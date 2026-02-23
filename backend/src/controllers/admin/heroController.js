const HeroSection = require('../../models/HeroSection');

exports.getAll = async (req, res) => {
  try {
    const sections = await HeroSection.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const section = await HeroSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Hero section not found' });
    }
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const section = await HeroSection.create(req.body);
    res.status(201).json({ success: true, data: section, message: 'Hero section created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const section = await HeroSection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!section) {
      return res.status(404).json({ success: false, message: 'Hero section not found' });
    }
    res.json({ success: true, data: section, message: 'Hero section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const section = await HeroSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Hero section not found' });
    }
    res.json({ success: true, message: 'Hero section deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const section = await HeroSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Hero section not found' });
    }
    section.isActive = !section.isActive;
    await section.save();
    res.json({ success: true, data: section, message: `Hero section ${section.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
