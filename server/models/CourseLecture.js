const mongoose = require('mongoose');

const courseLectureSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // minutes
    order: { type: Number, default: 0 },
    isFreePreview: { type: Boolean, default: false },
    resources: [{ name: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('CourseLecture', courseLectureSchema);
