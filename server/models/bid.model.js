const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bidAmount: {
        type: Number,
        required: true,
        min: 1
    },
    proposalText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true,
    versionKey: false
});

// Disallow duplicate bids by the same freelancer on the same project
bidSchema.index({ project: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);