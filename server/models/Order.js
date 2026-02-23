const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseTitle: { type: String },
    price: { type: Number, required: true },
    instructorEarning: { type: Number, default: 0 },
    platformEarning: { type: Number, default: 0 },
    status: { type: String, enum: ['completed', 'refunded', 'pending'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
