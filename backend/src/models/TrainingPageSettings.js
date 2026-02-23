const mongoose = require('mongoose');

const trainingPageSettingsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: { type: String, default: 'Master the Art of Saffron' },
    subtitle: { type: String, default: 'From cultivation to quality testing, become an expert in the world\'s most precious spice with our comprehensive training programs.' },
    badge: { type: String, default: 'Saffron Training Academy' },
    backgroundImage: { type: String, default: '/saffron-field.jpg' },
    stats: [{
      value: { type: String },
      label: { type: String }
    }]
  },

  // Featured Course Section
  featuredCourse: {
    isVisible: { type: Boolean, default: true },
    badge: { type: String, default: 'Featured Course' },
    title: { type: String, default: '3-Day Saffron Cultivation Course' },
    subtitle: { type: String, default: 'Crack the code to successfully cultivating the world\'s most precious spice at the Institute of Horticulture Technology' },
    gains: [{ type: String }],
    benefits: [{
      title: { type: String },
      description: { type: String },
      icon: { type: String, default: 'BookOpen' }
    }]
  },

  // Why This Course Stands Out
  standout: {
    isVisible: { type: Boolean, default: true },
    title: { type: String, default: 'Why This Course Stands Out' },
    description: { type: String },
    additionalText: { type: String },
    highlights: [{
      title: { type: String },
      description: { type: String },
      icon: { type: String, default: 'Users' }
    }]
  },

  // Course Modules
  modules: [{
    title: { type: String },
    description: { type: String },
    icon: { type: String, default: 'Leaf' },
    topics: [{ type: String }]
  }],

  // Testimonials
  testimonials: [{
    name: { type: String },
    role: { type: String },
    rating: { type: Number, default: 5 },
    text: { type: String }
  }],

  // Impact Stats
  impactStats: [{
    value: { type: String },
    label: { type: String },
    icon: { type: String, default: 'Target' }
  }],

  // CTA Section
  cta: {
    isVisible: { type: Boolean, default: true },
    title: { type: String, default: 'Corporate & Group Training' },
    description: { type: String, default: 'Customized training programs for businesses, agricultural cooperatives, and educational institutions. Contact us for group discounts.' },
    buttonText: { type: String, default: 'Contact for Group Training' }
  },

  // Custom Sections (admin can add dynamic sections)
  sections: [{
    title: { type: String },
    content: { type: String }, // Rich HTML content
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    template: { type: String, default: 'classic' } // classic, modern, minimal, bold
  }],

  // Global Settings
  selectedTemplate: { type: String, default: 'classic', enum: ['classic', 'modern', 'minimal', 'bold'] }

}, { timestamps: true });

module.exports = mongoose.model('TrainingPageSettings', trainingPageSettingsSchema);
