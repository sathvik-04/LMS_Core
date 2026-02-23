const router = require('express').Router();
const SubCategory = require('../models/SubCategory');
const { auth, authorize } = require('../middleware/auth');

// Get all subcategories (optionally filter by category)
router.get('/', async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category, status: true } : { status: true };
        const subs = await SubCategory.find(filter).populate('category', 'name slug');
        res.json({ success: true, data: subs });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create
router.post('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const sub = await SubCategory.create({ name, slug, category });
        res.status(201).json({ success: true, data: sub });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update
router.put('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.name) updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const sub = await SubCategory.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json({ success: true, data: sub });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Subcategory deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
