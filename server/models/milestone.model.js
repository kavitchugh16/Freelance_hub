const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10000
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'submitted_for_review', 'approved', 'revision_requested'],
        default: 'pending'
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Milestone', milestoneSchema);