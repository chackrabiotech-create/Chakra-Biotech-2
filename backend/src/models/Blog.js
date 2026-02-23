const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Also handle updates via findOneAndUpdate
blogSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.title || update.$set?.title) {
    const title = update.title || update.$set?.title;
    if (!update.$set) update.$set = {};
    update.$set.slug = slugify(title);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
