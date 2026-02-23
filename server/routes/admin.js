const router = require('express').Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Withdrawal = require('../models/Withdrawal');
const Slider = require('../models/Slider');
const Partner = require('../models/Partner');
const InfoBox = require('../models/InfoBox');
const { auth, authorize } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');
const upload = require('../middleware/upload');

// ── Dashboard Stats ──
router.get('/stats', auth, authorize('admin'), async (req, res) => {
    try {
        const [totalStudents, totalInstructors, totalCourses, totalOrders] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'instructor' }),
            Course.countDocuments(),
            Order.countDocuments(),
        ]);
        const revenueAgg = await Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // Monthly revenue for chart
        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }, { $limit: 12 },
        ]);

        const recentOrders = await Order.find().populate('user', 'name email').populate('course', 'title').sort('-createdAt').limit(10);
        const recentEnrollments = await Enrollment.find().populate('user', 'name email').populate('course', 'title').sort('-createdAt').limit(10);
        const pendingInstructors = await User.countDocuments({ role: 'instructor', status: 'pending' });
        const pendingCourses = await Course.countDocuments({ status: 'pending' });

        res.json({ success: true, data: { totalStudents, totalInstructors, totalCourses, totalOrders, totalRevenue, monthlyRevenue, recentOrders, recentEnrollments, pendingInstructors, pendingCourses } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Student Management ──
router.get('/students', auth, authorize('admin'), async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const filter = { role: 'user' };
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const total = await User.countDocuments(filter);
        const students = await User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
        res.json({ success: true, data: students, total, totalPages: Math.ceil(total / limit) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/students/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, data: user });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/students/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Student deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/students/:id/enrollments', auth, authorize('admin'), async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.params.id }).populate('course', 'title slug image');
        res.json({ success: true, data: enrollments });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Manual enrollment
router.post('/students/enroll', auth, authorize('admin'), async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        const existing = await Enrollment.findOne({ user: userId, course: courseId });
        if (existing) return res.status(400).json({ success: false, message: 'Already enrolled.' });
        const enrollment = await Enrollment.create({ user: userId, course: courseId });
        await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });
        res.status(201).json({ success: true, data: enrollment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Instructor Management ──
router.get('/instructors', auth, authorize('admin'), async (req, res) => {
    try {
        const { status, search } = req.query;
        const filter = { role: 'instructor' };
        if (status) filter.status = status;
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const instructors = await User.find(filter).sort('-createdAt');
        res.json({ success: true, data: instructors });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/instructors/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (req.body.status === 'active') {
            const template = emailTemplates.instructorApproved(user.name);
            sendEmail({ to: user.email, ...template });
        }
        res.json({ success: true, data: user });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/instructors/:id/commission', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { commissionRate: req.body.commissionRate }, { new: true });
        res.json({ success: true, data: user });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Course Management ──
router.get('/courses', auth, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const courses = await Course.find(filter).populate('instructor', 'name email').populate('category', 'name').sort('-createdAt');
        res.json({ success: true, data: courses });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/courses/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('instructor');
        if (req.body.status === 'active') {
            const template = emailTemplates.courseApproved(course.instructor.name, course.title);
            sendEmail({ to: course.instructor.email, ...template });
        } else if (req.body.status === 'rejected') {
            const template = emailTemplates.courseRejected(course.instructor.name, course.title);
            sendEmail({ to: course.instructor.email, ...template });
        }
        res.json({ success: true, data: course });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/courses/:id/featured', auth, authorize('admin'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, { featured: req.body.featured }, { new: true });
        res.json({ success: true, data: course });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Orders & Revenue ──
router.get('/orders', auth, authorize('admin'), async (req, res) => {
    try {
        const { from, to, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }
        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter).populate('user', 'name email').populate('course', 'title').populate('payment', 'invoiceNo totalAmount status').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
        res.json({ success: true, data: orders, total, totalPages: Math.ceil(total / limit) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Refund
router.post('/orders/:id/refund', auth, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('payment');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        // Mark as refunded
        order.status = 'refunded';
        await order.save();
        await Payment.findByIdAndUpdate(order.payment._id, { status: 'refunded', refundedAt: new Date() });
        // Remove enrollment
        await Enrollment.findOneAndDelete({ user: order.user, course: order.course });
        await Course.findByIdAndUpdate(order.course, { $inc: { totalEnrollments: -1, totalRevenue: -order.price } });
        await User.findByIdAndUpdate(order.instructor, { $inc: { totalEarnings: -order.instructorEarning, availableBalance: -order.instructorEarning } });
        res.json({ success: true, message: 'Order refunded.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Withdrawals ──
router.get('/withdrawals', auth, authorize('admin'), async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find().populate('instructor', 'name email').sort('-createdAt');
        res.json({ success: true, data: withdrawals });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/withdrawals/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const { status, note } = req.body;
        const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, { status, note, processedAt: new Date() }, { new: true });
        if (status === 'completed') {
            await User.findByIdAndUpdate(withdrawal.instructor, { $inc: { availableBalance: -withdrawal.amount } });
        }
        res.json({ success: true, data: withdrawal });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Sliders ──
router.get('/sliders', auth, authorize('admin'), async (req, res) => {
    try { res.json({ success: true, data: await Slider.find().sort('order') }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/sliders', auth, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.image = `/uploads/sliders/${req.file.filename}`;
        res.status(201).json({ success: true, data: await Slider.create(data) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.put('/sliders/:id', auth, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.image = `/uploads/sliders/${req.file.filename}`;
        res.json({ success: true, data: await Slider.findByIdAndUpdate(req.params.id, data, { new: true }) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.delete('/sliders/:id', auth, authorize('admin'), async (req, res) => {
    try { await Slider.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted.' }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Partners ──
router.get('/partners', auth, authorize('admin'), async (req, res) => {
    try { res.json({ success: true, data: await Partner.find().sort('order') }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/partners', auth, authorize('admin'), upload.single('logo'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.logo = `/uploads/partners/${req.file.filename}`;
        res.status(201).json({ success: true, data: await Partner.create(data) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.put('/partners/:id', auth, authorize('admin'), upload.single('logo'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.logo = `/uploads/partners/${req.file.filename}`;
        res.json({ success: true, data: await Partner.findByIdAndUpdate(req.params.id, data, { new: true }) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.delete('/partners/:id', auth, authorize('admin'), async (req, res) => {
    try { await Partner.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted.' }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Info Boxes ──
router.get('/infoboxes', auth, authorize('admin'), async (req, res) => {
    try { res.json({ success: true, data: await InfoBox.find().sort('order') }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/infoboxes', auth, authorize('admin'), async (req, res) => {
    try { res.status(201).json({ success: true, data: await InfoBox.create(req.body) }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.put('/infoboxes/:id', auth, authorize('admin'), async (req, res) => {
    try { res.json({ success: true, data: await InfoBox.findByIdAndUpdate(req.params.id, req.body, { new: true }) }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.delete('/infoboxes/:id', auth, authorize('admin'), async (req, res) => {
    try { await InfoBox.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted.' }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
