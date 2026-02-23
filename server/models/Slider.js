const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
