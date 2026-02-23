const Blog = require('../../models/Blog');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, isPublished } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const blogs = await Blog.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
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

exports.getOne = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('category');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Ensure slug is generated from title if not provided
    const slugify = require('../../utils/slugify');
    const blogData = { ...req.body };

    if (!blogData.slug && blogData.title) {
      blogData.slug = slugify(blogData.title);
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog, message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Regenerate slug if title is being updated
    const slugify = require('../../utils/slugify');
    const updateData = { ...req.body };

    if (updateData.title) {
      updateData.slug = slugify(updateData.title);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, data: blog, message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
