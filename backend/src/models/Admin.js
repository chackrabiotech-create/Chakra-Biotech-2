const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Don't include password by default in queries
    },
    name: {
        type: String,
        default: 'Admin'
    },
    role: {
        type: String,
        default: 'super_admin',
        enum: ['super_admin', 'admin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash for:', this.email);
        return next();
    }

    try {
        console.log('Hashing password for:', this.email, 'Original length:', this.password.length);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully. New hash length:', this.password.length);
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to update password
adminSchema.methods.updatePassword = async function (newPassword) {
    this.password = newPassword;
    await this.save();
};

module.exports = mongoose.model('Admin', adminSchema);
