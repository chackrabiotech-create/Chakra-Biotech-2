const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  comment: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment', default: null },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BlogComment', blogCommentSchema);
