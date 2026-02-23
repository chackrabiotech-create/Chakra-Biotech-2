const express = require('express');
const router = express.Router();
const ProductReview = require('../../models/ProductReview');
const Product = require('../../models/Product');

router.get('/:productSlug/reviews', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.productSlug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await ProductReview.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:productSlug/reviews', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.productSlug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await ProductReview.create({
      ...req.body,
      product: product._id
    });

    res.status(201).json({ success: true, data: review, message: 'Review submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, data: { helpfulCount: review.helpfulCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
