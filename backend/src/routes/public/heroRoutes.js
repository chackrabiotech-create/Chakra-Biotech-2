const express = require('express');
const router = express.Router();
const HeroSection = require('../../models/HeroSection');

router.get('/', async (req, res) => {
  try {
    const sections = await HeroSection.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
