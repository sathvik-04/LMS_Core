const router = require('express').Router();
const Course = require('../models/Course');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const Withdrawal = require('../models/Withdrawal');
const Review = require('../models/Review');
const { auth, authorize } = require('../middleware/auth');

// Instructor dashboard stats
router.get('/stats', auth, authorize('instructor'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);
        const [totalEnrollments, totalOrders, totalReviews] = await Promise.all([
            Enrollment.countDocuments({ course: { $in: courseIds } }),
            Order.countDocuments({ instructor: req.user._id }),
            Review.countDocuments({ course: { $in: courseIds } }),
        ]);

        // Monthly revenue
        const monthlyRevenue = await Order.aggregate([
            { $match: { instructor: req.user._id, status: 'completed' } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$instructorEarning' }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }, { $limit: 12 },
        ]);

        // Per-course revenue
        const courseRevenue = await Order.aggregate([
            { $match: { instructor: req.user._id, status: 'completed' } },
            { $group: { _id: '$course', total: { $sum: '$instructorEarning' }, count: { $sum: 1 } } },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
            { $unwind: '$course' },
            { $project: { courseTitle: '$course.title', total: 1, count: 1 } },
        ]);

        res.json({
            success: true, data: {
                totalCourses: courses.length, totalEnrollments, totalOrders, totalReviews,
                totalEarnings: req.user.totalEarnings, availableBalance: req.user.availableBalance,
                monthlyRevenue, courseRevenue,
            }
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get enrolled students for instructor's courses
router.get('/students', auth, authorize('instructor'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id }).select('_id');
        const courseIds = courses.map(c => c._id);
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('user', 'name email photo').populate('course', 'title').sort('-createdAt');
        res.json({ success: true, data: enrollments });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get reviews for instructor's courses
router.get('/reviews', auth, authorize('instructor'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id }).select('_id');
        const courseIds = courses.map(c => c._id);
        const reviews = await Review.find({ course: { $in: courseIds } })
            .populate('user', 'name photo').populate('course', 'title').sort('-createdAt');
        res.json({ success: true, data: reviews });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Withdrawal requests
router.get('/withdrawals', auth, authorize('instructor'), async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ instructor: req.user._id }).sort('-createdAt');
        res.json({ success: true, data: withdrawals });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/withdrawals', auth, authorize('instructor'), async (req, res) => {
    try {
        const { amount, method, accountDetails } = req.body;
        if (amount > req.user.availableBalance) {
            return res.status(400).json({ success: false, message: 'Insufficient balance.' });
        }
        const withdrawal = await Withdrawal.create({ instructor: req.user._id, amount, method, accountDetails });
        res.status(201).json({ success: true, data: withdrawal });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
