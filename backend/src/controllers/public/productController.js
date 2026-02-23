const Product = require('../../models/Product');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, grade, sort = '-createdAt', search } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (grade) filter.grade = grade;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: { products, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true }).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: { views: product.views } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
