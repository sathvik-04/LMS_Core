const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseLecture' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('QuestionAnswer', questionAnswerSchema);
