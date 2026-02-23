const router = require('express').Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { auth, authorize } = require('../middleware/auth');

// Get quizzes for a course
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.correctAnswer');
        res.json({ success: true, data: quizzes });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get single quiz (hide answers for students)
router.get('/:id', auth, async (req, res) => {
    try {
        let quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

        if (req.user.role === 'user') {
            quiz = quiz.toObject();
            quiz.questions = quiz.questions.map(q => ({ ...q, correctAnswer: undefined }));
        }
        res.json({ success: true, data: quiz });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create quiz (instructor)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const quiz = await Quiz.create({ ...req.body, instructor: req.user._id });
        res.status(201).json({ success: true, data: quiz });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Update quiz
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: quiz });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete quiz
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Quiz deleted.' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Submit quiz (student)
router.post('/:id/submit', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

        const { answers, timeTaken } = req.body; // answers: [{ questionIndex, selectedAnswer }]
        let score = 0;
        let totalPoints = 0;
        const processedAnswers = answers.map(a => {
            const question = quiz.questions[a.questionIndex];
            const isCorrect = question && question.correctAnswer === a.selectedAnswer;
            totalPoints += question ? question.points : 0;
            if (isCorrect) score += question.points;
            return { ...a, isCorrect };
        });

        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        const passed = percentage >= quiz.passingScore;

        const result = await QuizResult.create({
            quiz: quiz._id, user: req.user._id, course: quiz.course,
            answers: processedAnswers, score, totalPoints, percentage, passed, timeTaken,
        });

        res.json({ success: true, data: result });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get quiz results for a user
router.get('/results/me', auth, async (req, res) => {
    try {
        const results = await QuizResult.find({ user: req.user._id })
            .populate('quiz', 'title').populate('course', 'title').sort('-createdAt');
        res.json({ success: true, data: results });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
