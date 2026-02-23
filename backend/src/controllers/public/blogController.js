const Blog = require('../../models/Blog');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = '-publishedAt' } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];

    const blogs = await Blog.find(filter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: { blogs, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('category');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.like = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: { likes: blog.likes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: { views: blog.views } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
