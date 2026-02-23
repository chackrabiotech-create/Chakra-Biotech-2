const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const trainingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a training title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    content: {
        type: String
    },
    aboutProgram: {
        type: String // Rich text - detailed program description
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
        default: 'Beginner'
    },
    category: {
        type: String,
        enum: ['Saffron Cultivation', 'Advanced Techniques', 'Business & Marketing', 'R&D', 'Custom'],
        default: 'Saffron Cultivation'
    },
    mode: {
        type: String,
        enum: ['Offline', 'Online', 'Hybrid'],
        default: 'Offline'
    },
    language: {
        type: String,
        default: 'Hindi & English'
    },
    duration: {
        type: String,
        required: [true, 'Please add duration']
    },
    price: {
        type: Number,
        required: [true, 'Please add price']
    },
    features: [{
        type: String
    }],
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    originalPrice: {
        type: Number
    },
    maxParticipants: {
        type: Number
    },
    currentEnrollments: {
        type: Number,
        default: 0
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    instructor: {
        type: String
    },
    instructorBio: {
        type: String
    },
    instructorImage: {
        type: String
    },
    instructorDesignation: {
        type: String
    },
    location: {
        type: String
    },
    topics: [{
        type: String
    }],
    icon: {
        type: String,
        default: 'Sprout'
    },
    popular: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },

    // Curriculum
    curriculum: [{
        title: { type: String },
        description: { type: String },
        duration: { type: String },
        topics: [{ type: String }]
    }],


    // Rating
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },


    // Certification
    certificationTitle: {
        type: String
    },
    certificationDescription: {
        type: String
    },
    certificationImage: {
        type: String
    },

    // FAQ
    faq: [{
        question: { type: String },
        answer: { type: String }
    }],

    // Testimonials
    testimonials: [{
        name: { type: String },
        city: { type: String },
        image: { type: String },
        review: { type: String },
        rating: { type: Number, default: 5 }
    }],

    // Practical Exposure
    practicalExposure: {
        title: { type: String },
        description: { type: String },
        points: [{ type: String }],
        images: [{ type: String }]
    },

    // Additional
    brochureUrl: {
        type: String
    },
    facilityVideoUrl: {
        type: String
    }
}, { timestamps: true });

// Create slug from name
trainingSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title);
    }
    next();
});

// Also handle updates
trainingSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.title || update.$set?.title) {
        const title = update.title || update.$set?.title;
        if (!update.$set) update.$set = {};
        update.$set.slug = slugify(title);
    }
    next();
});

module.exports = mongoose.model('Training', trainingSchema);
