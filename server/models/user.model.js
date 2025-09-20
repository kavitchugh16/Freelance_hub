// In server/src/models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
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
        required: function() { return this.role === 'freelancer'; }
    },
    portfolio: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        default: 'default-avatar.png', // A default image
    },
    country: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);