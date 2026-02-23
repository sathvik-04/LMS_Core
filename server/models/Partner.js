const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    website: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
