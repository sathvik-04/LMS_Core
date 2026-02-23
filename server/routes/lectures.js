const router = require('express').Router();
const CourseLecture = require('../models/CourseLecture');
const { auth, authorize } = require('../middleware/auth');

// Get lectures for a section
router.get('/section/:sectionId', async (req, res) => {
    try {
        const lectures = await CourseLecture.find({ section: req.params.sectionId }).sort('order');
        res.json({ success: true, data: lectures });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create lecture
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const { course, section, title, youtubeUrl, content, duration, isFreePreview } = req.body;
        const count = await CourseLecture.countDocuments({ section });
        const lecture = await CourseLecture.create({ course, section, title, youtubeUrl, content, duration, isFreePreview, order: count });
        res.status(201).json({ success: true, data: lecture });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update lecture
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const lecture = await CourseLecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: lecture });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete lecture
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        await CourseLecture.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Lecture deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
