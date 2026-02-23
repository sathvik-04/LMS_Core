const router = require('express').Router();
const StaticPage = require('../models/StaticPage');
const { auth, authorize } = require('../middleware/auth');

// Get page by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const page = await StaticPage.findOne({ slug: req.params.slug, status: true });
        if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
        res.json({ success: true, data: page });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get all pages (admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const pages = await StaticPage.find().sort('slug');
        res.json({ success: true, data: pages });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create/update page (admin)
router.post('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { slug, title, content, metaTitle, metaDescription } = req.body;
        const page = await StaticPage.findOneAndUpdate(
            { slug }, { slug, title, content, metaTitle, metaDescription },
            { upsert: true, new: true }
        );
        res.json({ success: true, data: page });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete page (admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await StaticPage.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Page deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
