const router = require('express').Router();
const Cart = require('../models/Cart');
const { auth, optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('crypto');

// Get cart items
router.get('/', optionalAuth, async (req, res) => {
    try {
        const filter = req.user ? { user: req.user._id } : { guestToken: req.cookies?.guestToken || req.query.guestToken };
        if (!filter.user && !filter.guestToken) return res.json({ success: true, data: [] });

        const items = await Cart.find(filter)
            .populate({ path: 'course', select: 'title slug image price discountPrice instructor', populate: { path: 'instructor', select: 'name photo' } });
        res.json({ success: true, data: items });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Add to cart
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { course, price, instructor } = req.body;
        const filter = req.user ? { user: req.user._id, course } : { guestToken: req.cookies?.guestToken || req.body.guestToken, course };

        const exists = await Cart.findOne(filter);
        if (exists) return res.status(400).json({ success: false, message: 'Already in cart.' });

        let guestToken = req.cookies?.guestToken || req.body.guestToken;
        if (!req.user && !guestToken) {
            guestToken = require('crypto').randomUUID();
            res.cookie('guestToken', guestToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        }

        const item = await Cart.create({
            user: req.user?._id, guestToken: req.user ? undefined : guestToken,
            course, price, instructor,
        });
        res.status(201).json({ success: true, data: item, guestToken });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Remove from cart
router.delete('/:id', optionalAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Removed from cart.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
    try {
        await Cart.deleteMany({ user: req.user._id });
        res.json({ success: true, message: 'Cart cleared.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Merge guest cart to user cart on login
router.post('/merge', auth, async (req, res) => {
    try {
        const { guestToken } = req.body;
        if (!guestToken) return res.json({ success: true });
        const guestItems = await Cart.find({ guestToken });
        for (const item of guestItems) {
            const exists = await Cart.findOne({ user: req.user._id, course: item.course });
            if (!exists) {
                item.user = req.user._id;
                item.guestToken = undefined;
                await item.save();
            } else {
                await Cart.findByIdAndDelete(item._id);
            }
        }
        res.json({ success: true, message: 'Cart merged.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
