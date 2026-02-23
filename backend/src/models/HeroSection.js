const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String, required: true },
  mobileImage: { type: String },
  
  ctaText: { type: String },
  ctaLink: { type: String },
  secondaryCtaText: { type: String },
  secondaryCtaLink: { type: String },
  
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  
  textPosition: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
  overlayOpacity: { type: Number, default: 0.5 }
}, { timestamps: true });

module.exports = mongoose.model('HeroSection', heroSectionSchema);
