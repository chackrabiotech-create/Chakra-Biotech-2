const BlogComment = require('../../models/BlogComment');
const ProductComment = require('../../models/ProductComment');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, blog, product, type, isApproved } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    let comments, total;

    if (type === 'product' || product) {
      if (product) filter.product = product;
      comments = await ProductComment.find(filter)
        .populate('product', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
      total = await ProductComment.countDocuments(filter);
    } else {
      if (blog) filter.blog = blog;
      comments = await BlogComment.find(filter)
        .populate('blog', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
      total = await BlogComment.countDocuments(filter);
    }

    res.json({
      success: true,
      data: { comments, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let comment;
    if (type === 'product') {
      comment = await ProductComment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    } else {
      comment = await BlogComment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    }

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, data: comment, message: 'Comment approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let comment;
    if (type === 'product') {
      comment = await ProductComment.findByIdAndDelete(id);
    } else {
      comment = await BlogComment.findByIdAndDelete(id);
    }

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
