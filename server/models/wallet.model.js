// In server/src/models/wallet.model.js

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [{
        amount: Number,
        type: {
            type: String,
            enum: ['deposit', 'withdrawal', 'milestone_payment_release', 'milestone_payment_refund']
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Wallet', walletSchema);