const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, 'Please add student name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Please add phone number'],
        trim: true
    },
    whatsappNumber: {
        type: String,
        trim: true
    },
    trainingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: [true, 'Please select a training program']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['whatsapp', 'social_media', 'website', 'manual', 'phone', 'referral'],
        default: 'manual'
    },
    notes: {
        type: String
    },
    adminNotes: {
        type: String
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
