const router = require('express').Router();
const Coupon = require('../models/Coupon');
const { auth, authorize } = require('../middleware/auth');

// Get all coupons (instructor's own or admin sees all)
router.get('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { instructor: req.user._id };
        const coupons = await Coupon.find(filter).sort('-createdAt');
        res.json({ success: true, data: coupons });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create coupon
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.user.role === 'instructor') data.instructor = req.user._id;
        const coupon = await Coupon.create(data);
        res.status(201).json({ success: true, data: coupon });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update coupon
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: coupon });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete coupon
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Coupon deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Apply coupon (public, requires auth)
router.post('/apply', auth, async (req, res) => {
    try {
        const { code, courseIds, totalAmount } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), status: true });

        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
        if (new Date(coupon.validUntil) < new Date()) return res.status(400).json({ success: false, message: 'Coupon has expired.' });
        if (new Date(coupon.validFrom) > new Date()) return res.status(400).json({ success: false, message: 'Coupon not yet valid.' });
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
        if (coupon.minPurchaseAmount > 0 && totalAmount < coupon.minPurchaseAmount) {
            return res.status(400).json({ success: false, message: `Minimum purchase amount is $${coupon.minPurchaseAmount}.` });
        }

        // Check if coupon is for specific courses
        if (coupon.courses && coupon.courses.length > 0) {
            const validCourses = courseIds.filter(id => coupon.courses.includes(id));
            if (validCourses.length === 0) return res.status(400).json({ success: false, message: 'Coupon not valid for these courses.' });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (totalAmount * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }
        discount = Math.min(discount, totalAmount);

        res.json({ success: true, data: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount, finalAmount: totalAmount - discount } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
