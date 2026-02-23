const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },

  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },

  grade: { type: String },
  origin: { type: String },
  weight: { type: String },

  images: [{ type: String, required: true }],
  featuredImage: { type: String },

  specifications: {
    origin: String,
    grade: String,
    moistureContent: String,
    crocin: String,
    safranal: String,
    picrocrocin: String,
    shelfLife: String,
    storage: String
  },

  features: [{ type: String }],
  benefits: [{ type: String }],

  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number },

  badge: { type: String },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },

  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name);
  }
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  if (this.images && this.images.length > 0 && !this.featuredImage) {
    this.featuredImage = this.images[0];
  }
  next();
});

// Also handle updates via findOneAndUpdate
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name || update.$set?.name) {
    const name = update.name || update.$set?.name;
    if (!update.$set) update.$set = {};
    update.$set.slug = slugify(name);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
