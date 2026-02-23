const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseLecture' },
    title: { type: String, required: true, trim: true },
    questions: [{
        question: { type: String, required: true },
        type: { type: String, enum: ['multiple-choice', 'true-false'], default: 'multiple-choice' },
        options: [{ type: String }],
        correctAnswer: { type: Number, required: true }, // index of correct option
        explanation: { type: String, default: '' },
        points: { type: Number, default: 1 },
    }],
    passingScore: { type: Number, default: 70 }, // percentage
    timeLimit: { type: Number, default: 0 }, // minutes, 0 = no limit
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
