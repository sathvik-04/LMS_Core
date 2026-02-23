const router = require('express').Router();
const Enrollment = require('../models/Enrollment');
const CourseLecture = require('../models/CourseLecture');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Get user's enrolled courses
router.get('/my-courses', auth, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({ path: 'course', select: 'title slug image instructor totalEnrollments averageRating', populate: { path: 'instructor', select: 'name photo' } })
            .sort('-createdAt');
        res.json({ success: true, data: enrollments });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Mark lecture complete + update progress
router.post('/progress', auth, async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled.' });

        // Add lecture to completed list
        if (!enrollment.completedLectures.includes(lectureId)) {
            enrollment.completedLectures.push(lectureId);
        }
        enrollment.lastAccessedLecture = lectureId;
        enrollment.lastAccessedAt = new Date();

        // Calculate progress
        const totalLectures = await CourseLecture.countDocuments({ course: courseId });
        enrollment.progress = totalLectures > 0 ? Math.round((enrollment.completedLectures.length / totalLectures) * 100) : 0;

        if (enrollment.progress >= 100) {
            enrollment.status = 'completed';
            enrollment.completedAt = new Date();
        }

        await enrollment.save();
        res.json({ success: true, data: enrollment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get enrollment details for a course
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId })
            .populate('lastAccessedLecture', 'title');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled.' });
        res.json({ success: true, data: enrollment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Enroll in free course
router.post('/free-enroll', auth, async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        if (course.price > 0 && course.discountPrice > 0) return res.status(400).json({ success: false, message: 'This is a paid course.' });

        const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (existing) return res.status(400).json({ success: false, message: 'Already enrolled.' });

        const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
        await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });

        res.status(201).json({ success: true, data: enrollment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Generate certificate
router.get('/certificate/:courseId', auth, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId, status: 'completed' });
        if (!enrollment) return res.status(400).json({ success: false, message: 'Course not completed.' });

        const course = await Course.findById(req.params.courseId);
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${course.slug}.pdf`);
        doc.pipe(res);

        // Certificate design
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke('#6366f1');
        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70).stroke('#6366f1');

        doc.fontSize(40).fill('#6366f1').text('Certificate of Completion', 0, 100, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).fill('#666').text('This is to certify that', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(30).fill('#1a1a2e').text(req.user.name, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).fill('#666').text('has successfully completed the course', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(24).fill('#6366f1').text(course.title, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(12).fill('#999').text(`Completed on: ${enrollment.completedAt.toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).fill('#999').text(`Certificate ID: CERT-${enrollment._id.toString().substring(0, 8).toUpperCase()}`, { align: 'center' });

        doc.end();
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
