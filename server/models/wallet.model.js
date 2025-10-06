// // server/models/Wallet.js (Your Schema)
// const mongoose = require('mongoose');

// const walletSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         unique: true,
//         index: true
//     },
//     balance: {
//         type: Number,
//         required: true,
//         default: 0,
//         min: 0
//     },
//     transactions: [{
//         amount: { type: Number, required: true },
//         type: {
//             type: String,
//             enum: ['deposit', 'withdrawal', 'milestone_payment_release', 'milestone_payment_refund'],
//             required: true
//         },
//         description: { type: String, trim: true },
//         timestamp: {
//             type: Date,
//             default: Date.now
//         }
//     }]
// }, {
//     timestamps: true,
//     versionKey: false
// });

// module.exports = mongoose.model('Wallet', walletSchema);

// server/models/Wallet.js (Your Schema)
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    transactions: [{
        amount: { type: Number, required: true },
        type: {
            type: String,
            enum: ['deposit', 'withdrawal', 'milestone_payment_release', 'milestone_payment_refund'],
            required: true
        },
        description: { type: String, trim: true },
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