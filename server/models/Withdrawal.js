const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: 'bank_transfer' },
    accountDetails: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    processedAt: { type: Date },
    note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
