const express = require('express');
const router = express.Router();
const ProductCategory = require('../../models/ProductCategory');

router.get('/', async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await ProductCategory.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
