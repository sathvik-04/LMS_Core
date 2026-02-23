const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('StaticPage', staticPageSchema);
