const Product = require('../../models/Product');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, isPublished } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const products = await Product.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
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

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Ensure slug is generated from name if not provided
    const slugify = require('../../utils/slugify');
    const productData = { ...req.body };

    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name);
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Regenerate slug if name is being updated
    const slugify = require('../../utils/slugify');
    const updateData = { ...req.body };

    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.togglePublish = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.isPublished = !product.isPublished;
    await product.save();
    res.json({ success: true, data: product, message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ success: true, data: product, message: `Product ${product.isFeatured ? 'marked as featured' : 'unmarked as featured'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
