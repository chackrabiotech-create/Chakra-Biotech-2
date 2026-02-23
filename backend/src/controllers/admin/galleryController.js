const GalleryImage = require('../../models/GalleryImage');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (category) filter.category = category;

    const images = await GalleryImage.find(filter)
      .populate('category')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await GalleryImage.countDocuments(filter);

    res.json({
      success: true,
      data: { images, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id).populate('category');
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const image = await GalleryImage.create(req.body);
    res.status(201).json({ success: true, data: image, message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: image, message: 'Image updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
