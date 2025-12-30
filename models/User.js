const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferences: {
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'USD' },
        theme: { type: String, default: 'light' },
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    loyaltyTier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    savedPassengers: [{
        firstName: String,
        lastName: String,
        passportNumber: String,
        dateOfBirth: Date,
        nationality: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
