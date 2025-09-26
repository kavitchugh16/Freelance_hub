const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 32,
        match: /^[a-zA-Z0-9_\.\-]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+))$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // The role clearly defines if the user is a Client or a Freelancer.
    role: {
        type: String,
        required: true,
        enum: ['client', 'freelancer']
    },
    // Freelancer-specific fields
    skills: {
        type: [String],
        // This is only required if the role is 'freelancer'
        required: function() { return this.role === 'freelancer'; },
        default: undefined
    },
    portfolio: {
        type: String,
        required: false,
        trim: true
    },
    profilePicture: {
        type: String,
        default: 'default-avatar.png'
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 56
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    }
}, {
    timestamps: true,
    versionKey: false
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);