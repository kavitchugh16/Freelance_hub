const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true, enum: ['client', 'freelancer'] },
    
    // Freelancer-specific fields
    skills: { type: [String], default: [] }, 
    portfolio: { type: String, trim: true, default: '' },
    
    // Client-specific fields
    company: { type: String, trim: true, default: '' },

    // Common fields for both
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }  // ✅ Required for both
}, { timestamps: true });

// Hash password pre-save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
