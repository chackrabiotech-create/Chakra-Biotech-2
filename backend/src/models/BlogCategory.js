const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

blogCategorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

// Also handle updates via findOneAndUpdate
blogCategorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name || update.$set?.name) {
    const name = update.name || update.$set?.name;
    if (!update.$set) update.$set = {};
    update.$set.slug = slugify(name);
  }
  next();
});

module.exports = mongoose.model('BlogCategory', blogCategorySchema);
