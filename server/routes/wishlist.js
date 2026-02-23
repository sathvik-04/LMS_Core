const router = require('express').Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// Get wishlist
router.get('/', auth, async (req, res) => {
    try {
        const items = await Wishlist.find({ user: req.user._id })
            .populate({ path: 'course', select: 'title slug image price discountPrice instructor averageRating', populate: { path: 'instructor', select: 'name' } });
        res.json({ success: true, data: items });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
    try {
        const exists = await Wishlist.findOne({ user: req.user._id, course: req.body.course });
        if (exists) return res.status(400).json({ success: false, message: 'Already in wishlist.' });
        const item = await Wishlist.create({ user: req.user._id, course: req.body.course });
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Remove from wishlist
router.delete('/:id', auth, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ success: true, message: 'Removed from wishlist.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
