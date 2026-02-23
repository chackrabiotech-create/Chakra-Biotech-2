const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  image: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryCategory', required: true },
  tags: [{ type: String }],
  
  location: { type: String },
  date: { type: String },
  photographer: { type: String },
  
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
