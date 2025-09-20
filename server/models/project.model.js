// In server/src/models/project.model.js

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Assigned after a bid is accepted
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'in_progress', 'completed', 'disputed'],
        default: 'open'
    },
    // We will link to bids and milestones via their own models later
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Project', projectSchema);