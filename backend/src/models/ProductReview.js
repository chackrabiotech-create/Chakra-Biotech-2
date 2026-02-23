const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  review: { type: String, required: true },
  images: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ProductReview', productReviewSchema);
