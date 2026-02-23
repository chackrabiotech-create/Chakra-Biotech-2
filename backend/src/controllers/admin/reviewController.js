const ProductReview = require('../../models/ProductReview');
const Product = require('../../models/Product');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, product, isApproved } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (product) filter.product = product;
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const reviews = await ProductReview.find(filter)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ProductReview.countDocuments(filter);

    res.json({
      success: true,
      data: { reviews, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Update product rating
    const reviews = await ProductReview.find({ product: review.product, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    res.json({ success: true, data: review, message: 'Review approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
