const express = require('express');
const router = express.Router();
const BlogComment = require('../../models/BlogComment');
const ProductComment = require('../../models/ProductComment');
const Blog = require('../../models/Blog');
const Product = require('../../models/Product');

// Blog Comments
router.get('/blog/:blogSlug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.blogSlug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comments = await BlogComment.find({ blog: blog._id, isApproved: true, parentComment: null })
      .sort({ createdAt: -1 });

    const replies = await BlogComment.find({ blog: blog._id, isApproved: true, parentComment: { $ne: null } })
      .sort({ createdAt: 1 });

    res.json({ success: true, data: { comments, replies } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/blog/:blogSlug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.blogSlug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = await BlogComment.create({
      ...req.body,
      blog: blog._id
    });

    res.status(201).json({ success: true, data: comment, message: 'Comment submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/blog/reply/:id', async (req, res) => {
  try {
    const parentComment = await BlogComment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const reply = await BlogComment.create({
      ...req.body,
      blog: parentComment.blog,
      parentComment: parentComment._id
    });

    res.status(201).json({ success: true, data: reply, message: 'Reply submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Product Comments
router.get('/product/:productSlug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.productSlug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const comments = await ProductComment.find({ product: product._id, isApproved: true, parentComment: null })
      .sort({ createdAt: -1 });

    const replies = await ProductComment.find({ product: product._id, isApproved: true, parentComment: { $ne: null } })
      .sort({ createdAt: 1 });

    res.json({ success: true, data: { comments, replies } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/product/:productSlug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.productSlug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const comment = await ProductComment.create({
      ...req.body,
      product: product._id
    });

    res.status(201).json({ success: true, data: comment, message: 'Comment submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/product/reply/:id', async (req, res) => {
  try {
    const parentComment = await ProductComment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const reply = await ProductComment.create({
      ...req.body,
      product: parentComment.product,
      parentComment: parentComment._id
    });

    res.status(201).json({ success: true, data: reply, message: 'Reply submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
