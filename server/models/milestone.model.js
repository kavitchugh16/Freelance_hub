// In server/src/models/milestone.model.js

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'submitted_for_review', 'approved', 'revision_requested'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Milestone', milestoneSchema);