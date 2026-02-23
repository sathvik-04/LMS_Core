const mongoose = require('mongoose');

const infoBoxSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('InfoBox', infoBoxSchema);
