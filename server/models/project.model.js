const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Assigned after a bid is accepted
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
    skills: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    },
    budget: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'in_progress', 'completed', 'disputed'],
        default: 'open'
    }
}, {
    timestamps: true,
    versionKey: false
});

projectSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
