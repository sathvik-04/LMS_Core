const router = require('express').Router();
const Category = require('../models/Category');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all categories (public)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ status: true }).populate('subcategories');
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('subcategories');
        if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create category (admin)
router.post('/', auth, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const category = await Category.create({
            name, slug, description, icon,
            image: req.file ? `/uploads/images/${req.file.filename}` : '',
        });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update category (admin)
router.put('/:id', auth, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.name) updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (req.file) updates.image = `/uploads/images/${req.file.filename}`;
        const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete category (admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
