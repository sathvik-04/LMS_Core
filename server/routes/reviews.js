const router = require('express').Router();
const Review = require('../models/Review');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// Get reviews for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const total = await Review.countDocuments({ course: req.params.courseId });
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('user', 'name photo')
            .sort('-createdAt')
            .skip((page - 1) * limit).limit(parseInt(limit));

        // Rating breakdown
        const breakdown = await Review.aggregate([
            { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(req.params.courseId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
        ]);

        res.json({ success: true, data: reviews, total, breakdown });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Add / update review
router.post('/', auth, async (req, res) => {
    try {
        const { course, rating, comment } = req.body;
        let review = await Review.findOne({ course, user: req.user._id });

        if (review) {
            review.rating = rating;
            review.comment = comment;
            review.isEdited = true;
            await review.save();
        } else {
            review = await Review.create({ course, user: req.user._id, rating, comment });
        }

        // Update course average rating
        const stats = await Review.aggregate([
            { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(course) } },
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (stats.length) {
            await Course.findByIdAndUpdate(course, {
                averageRating: Math.round(stats[0].avg * 10) / 10,
                totalReviews: stats[0].count,
            });
        }

        res.json({ success: true, data: review });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const courseId = review.course;
        await Review.findByIdAndDelete(req.params.id);

        // Recalculate average
        const stats = await Review.aggregate([
            { $match: { course: courseId } },
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        await Course.findByIdAndUpdate(courseId, {
            averageRating: stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
            totalReviews: stats.length ? stats[0].count : 0,
        });

        res.json({ success: true, message: 'Review deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
