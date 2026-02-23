const router = require('express').Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, optionalAuth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all published courses (public, with search/filter)
router.get('/', async (req, res) => {
    try {
        const { search, category, subcategory, level, sort, page = 1, limit = 12, featured, bestseller } = req.query;
        const filter = { status: 'active' };
        if (search) filter.$text = { $search: search };
        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (level) filter.level = level;
        if (featured === 'true') filter.featured = true;
        if (bestseller === 'true') filter.bestseller = true;

        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };
        if (sort === 'popular') sortOption = { totalEnrollments: -1 };
        if (sort === 'rating') sortOption = { averageRating: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const total = await Course.countDocuments(filter);
        const courses = await Course.find(filter)
            .populate('category', 'name slug')
            .populate('subcategory', 'name')
            .populate('instructor', 'name photo')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({ success: true, data: courses, total, totalPages: Math.ceil(total / limit), page: parseInt(page) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get single course by slug (public)
router.get('/slug/:slug', optionalAuth, async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug })
            .populate('category', 'name slug')
            .populate('subcategory', 'name')
            .populate('instructor', 'name photo bio expertise socialLinks')
            .populate({ path: 'sections', populate: { path: 'lectures', select: 'title duration order isFreePreview youtubeUrl' } });

        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

        // Check if user is enrolled
        let isEnrolled = false;
        if (req.user) {
            const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
            isEnrolled = !!enrollment;
        }

        res.json({ success: true, data: course, isEnrolled });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get instructor's own courses (MUST be before /:id)
router.get('/my-courses', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: courses });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get single course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('subcategory', 'name')
            .populate('instructor', 'name photo');
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        res.json({ success: true, data: course });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});



// Helper to parse array fields safely
function parseArrayField(val) {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
    }
    return [];
}

// Create course (instructor)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const data = { ...req.body, instructor: req.user._id };
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        data.goals = parseArrayField(data.goals);
        data.requirements = parseArrayField(data.requirements);
        data.targetAudience = parseArrayField(data.targetAudience);
        data.tags = parseArrayField(data.tags);

        const course = await Course.create(data);
        res.status(201).json({ success: true, data: course });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update course (instructor owner or admin)
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not your course.' });
        }

        const updates = { ...req.body };
        updates.goals = parseArrayField(updates.goals);
        updates.requirements = parseArrayField(updates.requirements);
        updates.targetAudience = parseArrayField(updates.targetAudience);
        updates.tags = parseArrayField(updates.tags);

        const updated = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json({ success: true, data: updated });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete course (instructor owner or admin)
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not your course.' });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Course deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
