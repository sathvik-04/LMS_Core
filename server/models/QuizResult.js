const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    answers: [{ questionIndex: Number, selectedAnswer: Number, isCorrect: Boolean }],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeTaken: { type: Number, default: 0 }, // seconds
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
