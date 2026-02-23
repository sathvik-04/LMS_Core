const router = require('express').Router();
const CourseSection = require('../models/CourseSection');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

// Get sections for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const sections = await CourseSection.find({ course: req.params.courseId })
            .populate('lectures').sort('order');
        res.json({ success: true, data: sections });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create section
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const { course, title } = req.body;
        const count = await CourseSection.countDocuments({ course });
        const section = await CourseSection.create({ course, title, order: count });
        res.status(201).json({ success: true, data: section });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update section
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const section = await CourseSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: section });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete section
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        await CourseSection.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Section deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
