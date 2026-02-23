const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    email: { type: String },
    totalAmount: { type: Number, required: true },
    paymentType: { type: String, default: 'stripe' },
    invoiceNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'completed', 'refunded', 'failed'], default: 'completed' },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    stripeSessionId: { type: String },
    refundId: { type: String },
    refundedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
