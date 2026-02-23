const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    progress: { type: Number, default: 0 }, // percentage 0-100
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseLecture' }],
    lastAccessedLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseLecture' },
    lastAccessedAt: { type: Date },
    certificateUrl: { type: String, default: '' },
    status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },
}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
