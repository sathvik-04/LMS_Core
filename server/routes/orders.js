const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

// Create Stripe checkout session
router.post('/checkout', auth, async (req, res) => {
    try {
        const { items, couponCode, discountAmount = 0 } = req.body;
        // items: [{ courseId, courseTitle, price, instructorId }]

        if (!items || !items.length) return res.status(400).json({ success: false, message: 'No items.' });

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0) - discountAmount;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: item.courseTitle },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: 1,
            })),
            ...(discountAmount > 0 && {
                discounts: [{
                    coupon: await (async () => {
                        const stripeCoupon = await stripe.coupons.create({ amount_off: Math.round(discountAmount * 100), currency: 'usd', duration: 'once' });
                        return stripeCoupon.id;
                    })(),
                }],
            }),
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                items: JSON.stringify(items),
                couponCode: couponCode || '',
                discountAmount: discountAmount.toString(),
            },
        });

        res.json({ success: true, url: session.url, sessionId: session.id });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Payment success callback
router.post('/success', auth, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payment not completed.' });
        }

        // Check if already processed
        const existingPayment = await Payment.findOne({ stripeSessionId: sessionId });
        if (existingPayment) return res.json({ success: true, message: 'Already processed.', data: existingPayment });

        const meta = session.metadata;
        const items = JSON.parse(meta.items);
        const invoiceNo = 'INV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Create payment
        const payment = await Payment.create({
            transactionId: session.payment_intent,
            user: meta.userId,
            name: req.user.name,
            email: req.user.email,
            totalAmount: session.amount_total / 100,
            invoiceNo,
            stripeSessionId: sessionId,
            couponCode: meta.couponCode || undefined,
            discountAmount: parseFloat(meta.discountAmount) || 0,
            status: 'completed',
        });

        // Create orders and enrollments
        for (const item of items) {
            const course = await Course.findById(item.courseId);
            const commissionRate = 30; // Default platform commission
            const platformEarning = (item.price * commissionRate) / 100;
            const instructorEarning = item.price - platformEarning;

            await Order.create({
                payment: payment._id, user: meta.userId, course: item.courseId,
                instructor: item.instructorId, courseTitle: item.courseTitle, price: item.price,
                instructorEarning, platformEarning,
            });

            // Create enrollment
            await Enrollment.findOneAndUpdate(
                { user: meta.userId, course: item.courseId },
                { user: meta.userId, course: item.courseId, order: payment._id },
                { upsert: true, new: true }
            );

            // Update course stats
            await Course.findByIdAndUpdate(item.courseId, {
                $inc: { totalEnrollments: 1, totalRevenue: item.price },
            });

            // Update instructor earnings
            await User.findByIdAndUpdate(item.instructorId, {
                $inc: { totalEarnings: instructorEarning, availableBalance: instructorEarning },
            });

            // Send enrollment email
            const template = emailTemplates.enrollmentConfirmation(req.user.name, item.courseTitle);
            sendEmail({ to: req.user.email, ...template });
        }

        // Update coupon usage
        if (meta.couponCode) {
            await Coupon.findOneAndUpdate({ code: meta.couponCode }, {
                $inc: { usedCount: 1 },
                $push: { usedBy: { user: meta.userId } },
            });
        }

        // Clear cart
        await Cart.deleteMany({ user: meta.userId });

        // Send receipt email
        const receiptTemplate = emailTemplates.paymentReceipt(req.user.name, invoiceNo, session.amount_total / 100, items.map(i => i.courseTitle).join(', '));
        sendEmail({ to: req.user.email, ...receiptTemplate });

        res.json({ success: true, data: payment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('course', 'title slug image')
            .populate('payment', 'totalAmount invoiceNo status createdAt')
            .sort('-createdAt');
        res.json({ success: true, data: orders });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get order details
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('course').populate('payment').populate('instructor', 'name');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        res.json({ success: true, data: order });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
