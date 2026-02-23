const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.virtual('courses', {
    ref: 'Course', localField: '_id', foreignField: 'category',
});
categorySchema.virtual('subcategories', {
    ref: 'SubCategory', localField: '_id', foreignField: 'category',
});
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
