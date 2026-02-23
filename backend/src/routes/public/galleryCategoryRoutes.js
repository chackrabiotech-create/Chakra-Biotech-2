const express = require('express');
const router = express.Router();
const GalleryCategory = require('../../models/GalleryCategory');

router.get('/', async (req, res) => {
  try {
    const categories = await GalleryCategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
