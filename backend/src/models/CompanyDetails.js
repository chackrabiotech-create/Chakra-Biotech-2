const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  secondaryEmail: { type: String },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  whatsappNumber: { type: String, required: true },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },

  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },

  businessHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },

  aboutUs: { type: String },
  mission: { type: String },
  vision: { type: String },

  // Footer specific fields
  footer: {
    description: { type: String, default: 'An Agri-Tech leader specializing in precision-controlled aeroponic saffron cultivation. We are democratizing "Red Gold" through sustainable technology and innovation.' },
    offerings: [{ type: String }],
    quickLinks: [{
      name: String,
      href: String
    }],
    copyrightText: { type: String, default: 'Chakra Biotech LLP. All rights reserved.' }
  },

  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CompanyDetails', companyDetailsSchema);
