const GalleryImage = require('../../models/GalleryImage');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, tags } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

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
    if (!image || !image.isPublished) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.like = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: { likes: image.likes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: { views: image.views } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
