const router = require('express').Router();
const SiteInfo = require('../models/SiteInfo');
const Slider = require('../models/Slider');
const Partner = require('../models/Partner');
const InfoBox = require('../models/InfoBox');
const Category = require('../models/Category');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get site settings (public)
router.get('/site-info', async (req, res) => {
    try {
        let siteInfo = await SiteInfo.findOne();
        if (!siteInfo) siteInfo = await SiteInfo.create({});
        // Hide sensitive keys for non-admin
        const info = siteInfo.toObject();
        delete info.smtpPass;
        delete info.stripeSecretKey;
        delete info.googleClientSecret;
        res.json({ success: true, data: info });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update site settings (admin)
router.put('/site-info', auth, authorize('admin'), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.files?.logo) updates.logo = `/uploads/logos/${req.files.logo[0].filename}`;
        if (req.files?.favicon) updates.favicon = `/uploads/logos/${req.files.favicon[0].filename}`;
        let siteInfo = await SiteInfo.findOne();
        if (!siteInfo) siteInfo = await SiteInfo.create(updates);
        else siteInfo = await SiteInfo.findByIdAndUpdate(siteInfo._id, updates, { new: true });
        res.json({ success: true, data: siteInfo });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Public homepage data (combined endpoint to reduce requests)
router.get('/homepage', async (req, res) => {
    try {
        const [siteInfo, sliders, infoBoxes, partners, categories, featuredCourses, latestCourses, popularCourses] = await Promise.all([
            SiteInfo.findOne(),
            Slider.find({ status: true }).sort('order'),
            InfoBox.find({ status: true }).sort('order'),
            Partner.find({ status: true }).sort('order'),
            Category.find({ status: true }).limit(8),
            Course.find({ status: 'active', featured: true }).populate('instructor', 'name photo').populate('category', 'name').limit(8),
            Course.find({ status: 'active' }).populate('instructor', 'name photo').populate('category', 'name').sort('-createdAt').limit(8),
            Course.find({ status: 'active' }).populate('instructor', 'name photo').populate('category', 'name').sort('-totalEnrollments').limit(8),
        ]);
        res.json({ success: true, data: { siteInfo, sliders, infoBoxes, partners, categories, featuredCourses, latestCourses, popularCourses } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
