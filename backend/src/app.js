const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow all origins
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - Configured for 100k users
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10,000 requests per windowMs (suitable for 100k users)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/admin/manage', require('./routes/admin/adminRoutes'));
app.use('/api/admin/blog-categories', require('./routes/admin/blogCategoryRoutes'));
app.use('/api/admin/blogs', require('./routes/admin/blogRoutes'));
app.use('/api/admin/comments', require('./routes/admin/commentRoutes'));
app.use('/api/admin/product-categories', require('./routes/admin/productCategoryRoutes'));
app.use('/api/admin/products', require('./routes/admin/productRoutes'));
app.use('/api/admin/reviews', require('./routes/admin/reviewRoutes'));
app.use('/api/admin/gallery-categories', require('./routes/admin/galleryCategoryRoutes'));
app.use('/api/admin/gallery', require('./routes/admin/galleryRoutes'));
app.use('/api/admin/company-details', require('./routes/admin/companyRoutes'));
app.use('/api/admin/hero-sections', require('./routes/admin/heroRoutes'));
app.use('/api/admin/contacts', require('./routes/admin/contactRoutes'));
app.use('/api/admin/upload', require('./routes/admin/uploadRoutes'));
app.use('/api/admin/stats', require('./routes/admin/statsRoutes'));
app.use('/api/admin/trainings', require('./routes/admin/trainingRoutes'));
app.use('/api/admin/enrollments', require('./routes/admin/enrollmentRoutes'));
app.use('/api/admin/training-page', require('./routes/admin/trainingPageRoutes'));

// Public routes
app.use('/api/blog-categories', require('./routes/public/blogCategoryRoutes'));
app.use('/api/blogs', require('./routes/public/blogRoutes'));
app.use('/api/comments', require('./routes/public/commentRoutes'));
app.use('/api/product-categories', require('./routes/public/productCategoryRoutes'));
app.use('/api/products', require('./routes/public/productRoutes'));
app.use('/api/products', require('./routes/public/reviewRoutes'));
app.use('/api/gallery-categories', require('./routes/public/galleryCategoryRoutes'));
app.use('/api/gallery', require('./routes/public/galleryRoutes'));
app.use('/api/company-details', require('./routes/public/companyRoutes'));
app.use('/api/hero-sections', require('./routes/public/heroRoutes'));
app.use('/api/trainings', require('./routes/public/trainingRoutes'));
app.use('/api/training-page', require('./routes/public/trainingPageRoutes'));
app.use('/api/contact', require('./routes/public/contactRoutes'));
app.use('/api/enrollments', require('./routes/public/enrollmentRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API working fine', status: 'OK' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
