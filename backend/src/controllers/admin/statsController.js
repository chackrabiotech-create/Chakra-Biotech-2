const Product = require('../../models/Product');
const Blog = require('../../models/Blog');
const GalleryImage = require('../../models/GalleryImage');
const ContactSubmission = require('../../models/ContactSubmission');
const BlogComment = require('../../models/BlogComment');
const ProductReview = require('../../models/ProductReview');

exports.getStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalBlogs,
      totalGalleryImages,
      totalContacts,
      unreadContacts,
      pendingComments,
      pendingReviews
    ] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments(),
      GalleryImage.countDocuments(),
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ isRead: false }),
      BlogComment.countDocuments({ isApproved: false }),
      ProductReview.countDocuments({ isApproved: false })
    ]);

    const recentContacts = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject createdAt isRead');

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug createdAt isPublished');

    res.json({
      success: true,
      data: {
        totalProducts,
        totalBlogs,
        totalGalleryImages,
        totalContacts,
        unreadContacts,
        pendingComments,
        pendingReviews,
        recentActivity: {
          contacts: recentContacts,
          blogs: recentBlogs
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
