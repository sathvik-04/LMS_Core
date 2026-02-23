const mongoose = require('mongoose');

const courseSectionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

courseSectionSchema.virtual('lectures', {
    ref: 'CourseLecture', localField: '_id', foreignField: 'section',
});
courseSectionSchema.set('toJSON', { virtuals: true });
courseSectionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CourseSection', courseSectionSchema);
