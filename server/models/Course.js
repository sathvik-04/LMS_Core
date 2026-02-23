const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    previewVideo: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // total minutes
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' },
    language: { type: String, default: 'English' },
    prerequisites: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'pending', 'active', 'inactive', 'rejected'], default: 'draft' },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    highestRated: { type: Boolean, default: false },
    certificate: { type: Boolean, default: true },
    totalEnrollments: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    goals: [{ type: String }],
    requirements: [{ type: String }],
    targetAudience: [{ type: String }],
}, { timestamps: true });

courseSchema.virtual('sections', {
    ref: 'CourseSection', localField: '_id', foreignField: 'course',
});
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// Text index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
