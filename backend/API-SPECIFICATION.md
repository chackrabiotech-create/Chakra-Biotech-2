# Chakra Bio - Backend API Specification
mongodb+srv://amanrajofficialmail_db_user:FnVhk6JhJotiZX8C@cluster0.eshsu0v.mongodb.net/?appName=Cluster0
## Overview

Node.js backend API for Chakra Bio saffron e-commerce website with admin panel.

**Authentication:** Simple hardcoded admin credentials via environment variables (no user registration/login)

**Image Storage:** Cloudinary

**Database:** MongoDB with Mongoose

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/chakra-bio

# Admin Credentials (Hardcoded)
ADMIN_EMAIL=admin@chakrabio.com
ADMIN_PASSWORD=your_secure_password_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001
```

---

## Database Schemas

### 1. Blog Category Schema

```javascript
{
  name: String (required, unique),
  slug: String (required, unique, auto-generated),
  description: String,
  image: String (Cloudinary URL),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Blog Schema

```javascript
{
  title: String (required),
  slug: String (required, unique, auto-generated),
  excerpt: String (required),
  content: String (required, HTML),
  featuredImage: String (Cloudinary URL, required),
  category: ObjectId (ref: 'BlogCategory', required),
  author: String (required),
  tags: [String],
  readTime: String (e.g., "5 min read"),
  isPublished: Boolean (default: false),
  publishedAt: Date,
  views: Number (default: 0),
  likes: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Blog Comment Schema

```javascript
{
  blog: ObjectId (ref: 'Blog', required),
  name: String (required),
  email: String (required),
  comment: String (required),
  parentComment: ObjectId (ref: 'BlogComment', null for top-level),
  isApproved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Product Category Schema

```javascript
{
  name: String (required, unique),
  slug: String (required, unique, auto-generated),
  description: String,
  image: String (Cloudinary URL),
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Product Schema

```javascript
{
  name: String (required),
  slug: String (required, unique, auto-generated),
  description: String (required),
  shortDescription: String,
  category: ObjectId (ref: 'ProductCategory', required),
  
  // Pricing
  price: Number (required),
  originalPrice: Number,
  discount: Number (calculated),
  
  // Product Details
  grade: String (e.g., "Grade A+"),
  origin: String (e.g., "Kashmir"),
  weight: String (e.g., "1g"),
  
  // Images
  images: [String] (Cloudinary URLs, required),
  featuredImage: String (Cloudinary URL),
  
  // Specifications
  specifications: {
    origin: String,
    grade: String,
    moistureContent: String,
    crocin: String,
    safranal: String,
    picrocrocin: String,
    shelfLife: String,
    storage: String
  },
  
  // Features & Benefits
  features: [String],
  benefits: [String],
  
  // Inventory
  inStock: Boolean (default: true),
  stockQuantity: Number,
  
  // SEO & Display
  badge: String (e.g., "Bestseller", "Premium"),
  isPublished: Boolean (default: false),
  isFeatured: Boolean (default: false),
  displayOrder: Number (default: 0),
  
  // Stats
  rating: Number (default: 0, calculated from reviews),
  reviewCount: Number (default: 0),
  views: Number (default: 0),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Product Review Schema

```javascript
{
  product: ObjectId (ref: 'Product', required),
  name: String (required),
  email: String (required),
  rating: Number (required, 1-5),
  title: String,
  review: String (required),
  images: [String] (Cloudinary URLs),
  isVerifiedPurchase: Boolean (default: false),
  isApproved: Boolean (default: false),
  helpfulCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Gallery Category Schema

```javascript
{
  name: String (required, unique),
  slug: String (required, unique, auto-generated),
  description: String,
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Gallery Image Schema

```javascript
{
  title: String (required),
  description: String,
  image: String (Cloudinary URL, required),
  thumbnail: String (Cloudinary URL),
  category: ObjectId (ref: 'GalleryCategory', required),
  tags: [String],
  
  // Metadata
  location: String,
  date: String,
  photographer: String,
  
  // Stats
  views: Number (default: 0),
  likes: Number (default: 0),
  
  isPublished: Boolean (default: true),
  displayOrder: Number (default: 0),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 9. Company Details Schema (Single Document)

```javascript
{
  // Contact Information
  companyName: String (required),
  email: String (required),
  phone: String (required),
  alternatePhone: String,
  whatsappNumber: String (required),
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },
  
  // Business Hours
  businessHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  
  // About
  aboutUs: String (HTML),
  mission: String,
  vision: String,
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  
  updatedAt: Date
}
```

### 10. Hero Section Schema

```javascript
{
  title: String (required),
  subtitle: String,
  description: String,
  image: String (Cloudinary URL, required),
  mobileImage: String (Cloudinary URL),
  
  // Call to Action
  ctaText: String,
  ctaLink: String,
  secondaryCtaText: String,
  secondaryCtaLink: String,
  
  // Display Settings
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  
  // Styling
  textPosition: String (enum: ['left', 'center', 'right'], default: 'center'),
  overlayOpacity: Number (default: 0.5),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 11. Contact Submission Schema

```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  
  // Status
  isRead: Boolean (default: false),
  isReplied: Boolean (default: false),
  adminNotes: String,
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication

#### Admin Login
```
POST /api/admin/login
Body: { email, password }
Response: { success, token, message }
```

#### Verify Admin Token
```
GET /api/admin/verify
Headers: { Authorization: Bearer <token> }
Response: { success, admin: { email } }
```

---

### Blog Categories (Admin)

```
GET    /api/admin/blog-categories          - Get all categories
POST   /api/admin/blog-categories          - Create category
GET    /api/admin/blog-categories/:id      - Get single category
PUT    /api/admin/blog-categories/:id      - Update category
DELETE /api/admin/blog-categories/:id      - Delete category
```

### Blog Categories (Public)

```
GET /api/blog-categories                   - Get active categories
GET /api/blog-categories/:slug             - Get category by slug
```

---

### Blogs (Admin)

```
GET    /api/admin/blogs                    - Get all blogs (with filters)
POST   /api/admin/blogs                    - Create blog
GET    /api/admin/blogs/:id                - Get single blog
PUT    /api/admin/blogs/:id                - Update blog
DELETE /api/admin/blogs/:id                - Delete blog
POST   /api/admin/blogs/:id/publish        - Publish/unpublish blog
```

### Blogs (Public)

```
GET /api/blogs                             - Get published blogs (paginated, filtered)
GET /api/blogs/:slug                       - Get blog by slug
POST /api/blogs/:slug/like                 - Like a blog
POST /api/blogs/:slug/view                 - Increment view count
```

---

### Blog Comments (Admin)

```
GET    /api/admin/comments                 - Get all comments
PUT    /api/admin/comments/:id/approve     - Approve comment
DELETE /api/admin/comments/:id             - Delete comment
```

### Blog Comments (Public)

```
GET  /api/blogs/:slug/comments             - Get approved comments for blog
POST /api/blogs/:slug/comments             - Submit comment
POST /api/comments/:id/reply               - Reply to comment
```

---

### Product Categories (Admin)

```
GET    /api/admin/product-categories       - Get all categories
POST   /api/admin/product-categories       - Create category
GET    /api/admin/product-categories/:id   - Get single category
PUT    /api/admin/product-categories/:id   - Update category
DELETE /api/admin/product-categories/:id   - Delete category
```

### Product Categories (Public)

```
GET /api/product-categories                - Get active categories
GET /api/product-categories/:slug          - Get category by slug
```

---

### Products (Admin)

```
GET    /api/admin/products                 - Get all products
POST   /api/admin/products                 - Create product
GET    /api/admin/products/:id             - Get single product
PUT    /api/admin/products/:id             - Update product
DELETE /api/admin/products/:id             - Delete product
POST   /api/admin/products/:id/publish     - Publish/unpublish product
PUT    /api/admin/products/:id/featured    - Toggle featured status
```

### Products (Public)

```
GET /api/products                          - Get published products (paginated, filtered)
GET /api/products/:slug                    - Get product by slug
POST /api/products/:slug/view              - Increment view count
```

---

### Product Reviews (Admin)

```
GET    /api/admin/reviews                  - Get all reviews
PUT    /api/admin/reviews/:id/approve      - Approve review
DELETE /api/admin/reviews/:id              - Delete review
```

### Product Reviews (Public)

```
GET  /api/products/:slug/reviews           - Get approved reviews
POST /api/products/:slug/reviews           - Submit review
POST /api/reviews/:id/helpful              - Mark review as helpful
```

---

### Gallery Categories (Admin)

```
GET    /api/admin/gallery-categories       - Get all categories
POST   /api/admin/gallery-categories       - Create category
GET    /api/admin/gallery-categories/:id   - Get single category
PUT    /api/admin/gallery-categories/:id   - Update category
DELETE /api/admin/gallery-categories/:id   - Delete category
```

### Gallery Categories (Public)

```
GET /api/gallery-categories                - Get active categories
```

---

### Gallery Images (Admin)

```
GET    /api/admin/gallery                  - Get all images
POST   /api/admin/gallery                  - Upload image
GET    /api/admin/gallery/:id              - Get single image
PUT    /api/admin/gallery/:id              - Update image
DELETE /api/admin/gallery/:id              - Delete image
```

### Gallery Images (Public)

```
GET  /api/gallery                          - Get published images (paginated, filtered)
GET  /api/gallery/:id                      - Get single image
POST /api/gallery/:id/like                 - Like image
POST /api/gallery/:id/view                 - Increment view count
```

---

### Company Details (Admin)

```
GET /api/admin/company-details             - Get company details
PUT /api/admin/company-details             - Update company details
```

### Company Details (Public)

```
GET /api/company-details                   - Get company details
```

---

### Hero Sections (Admin)

```
GET    /api/admin/hero-sections            - Get all hero sections
POST   /api/admin/hero-sections            - Create hero section
GET    /api/admin/hero-sections/:id        - Get single hero section
PUT    /api/admin/hero-sections/:id        - Update hero section
DELETE /api/admin/hero-sections/:id        - Delete hero section
PUT    /api/admin/hero-sections/:id/toggle - Toggle active status
```

### Hero Sections (Public)

```
GET /api/hero-sections                     - Get active hero sections (ordered)
```

---

### Contact Submissions (Admin)

```
GET    /api/admin/contacts                 - Get all submissions
GET    /api/admin/contacts/:id             - Get single submission
PUT    /api/admin/contacts/:id/read        - Mark as read
PUT    /api/admin/contacts/:id/reply       - Mark as replied
DELETE /api/admin/contacts/:id             - Delete submission
```

### Contact Submissions (Public)

```
POST /api/contact                          - Submit contact form
```

---

### File Upload (Admin)

```
POST /api/admin/upload/image               - Upload single image to Cloudinary
POST /api/admin/upload/images              - Upload multiple images
DELETE /api/admin/upload/image             - Delete image from Cloudinary
```

---

### Statistics (Admin Dashboard)

```
GET /api/admin/stats                       - Get dashboard statistics
Response: {
  totalProducts: Number,
  totalBlogs: Number,
  totalGalleryImages: Number,
  totalContacts: Number,
  unreadContacts: Number,
  pendingComments: Number,
  pendingReviews: Number,
  recentActivity: []
}
```

---

## Request/Response Examples

### Create Blog (Admin)

**Request:**
```json
POST /api/admin/blogs
Headers: { Authorization: Bearer <token> }
Body: {
  "title": "10 Health Benefits of Saffron",
  "excerpt": "Discover the amazing health benefits...",
  "content": "<p>Full HTML content...</p>",
  "featuredImage": "https://cloudinary.com/...",
  "category": "507f1f77bcf86cd799439011",
  "author": "Dr. Priya Sharma",
  "tags": ["health", "benefits", "wellness"],
  "readTime": "5 min read",
  "isPublished": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "10 Health Benefits of Saffron",
    "slug": "10-health-benefits-of-saffron",
    ...
  },
  "message": "Blog created successfully"
}
```

### Get Products (Public)

**Request:**
```
GET /api/products?category=kashmiri&grade=A+&page=1&limit=12&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 36,
      "itemsPerPage": 12
    }
  }
}
```

### Submit Contact Form (Public)

**Request:**
```json
POST /api/contact
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "subject": "Product Inquiry",
  "message": "I want to know more about..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us. We'll get back to you soon!"
}
```

---

## Middleware

### 1. Admin Authentication Middleware
- Verify JWT token
- Check if admin credentials match environment variables
- Attach admin info to request

### 2. Error Handler Middleware
- Catch all errors
- Format error responses
- Log errors

### 3. CORS Middleware
- Allow frontend and admin frontend URLs
- Handle preflight requests

### 4. Rate Limiting
- Limit API requests per IP
- Prevent abuse

### 5. File Upload Middleware
- Multer for handling multipart/form-data
- Cloudinary integration

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Image Storage:** Cloudinary
- **Validation:** express-validator or Joi
- **Security:** helmet, cors, express-rate-limit
- **Environment:** dotenv
- **Logging:** morgan, winston (optional)

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── constants.js
│   ├── models/
│   │   ├── BlogCategory.js
│   │   ├── Blog.js
│   │   ├── BlogComment.js
│   │   ├── ProductCategory.js
│   │   ├── Product.js
│   │   ├── ProductReview.js
│   │   ├── GalleryCategory.js
│   │   ├── GalleryImage.js
│   │   ├── CompanyDetails.js
│   │   ├── HeroSection.js
│   │   └── ContactSubmission.js
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── blogController.js
│   │   │   ├── productController.js
│   │   │   ├── galleryController.js
│   │   │   ├── companyController.js
│   │   │   ├── heroController.js
│   │   │   └── statsController.js
│   │   ├── public/
│   │   │   ├── blogController.js
│   │   │   ├── productController.js
│   │   │   ├── galleryController.js
│   │   │   ├── companyController.js
│   │   │   └── contactController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── blogRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── galleryRoutes.js
│   │   │   ├── companyRoutes.js
│   │   │   ├── heroRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── public/
│   │   │   ├── blogRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── galleryRoutes.js
│   │   │   ├── companyRoutes.js
│   │   │   └── contactRoutes.js
│   │   └── authRoutes.js
│   ├── utils/
│   │   ├── slugify.js
│   │   ├── cloudinary.js
│   │   └── helpers.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Installation & Setup

```bash
# Install dependencies
npm install express mongoose dotenv cors helmet express-rate-limit
npm install jsonwebtoken bcryptjs
npm install cloudinary multer multer-storage-cloudinary
npm install express-validator
npm install morgan

# Development dependencies
npm install --save-dev nodemon

# Start development server
npm run dev
```

---

## Security Considerations

1. **Admin Authentication:** Simple JWT-based auth with hardcoded credentials
2. **Input Validation:** Validate all user inputs
3. **Rate Limiting:** Prevent API abuse
4. **CORS:** Restrict to known origins
5. **Helmet:** Security headers
6. **MongoDB Injection:** Use Mongoose sanitization
7. **XSS Protection:** Sanitize HTML content
8. **File Upload:** Validate file types and sizes

---

## Notes

- All admin routes require authentication
- All public routes are open (no authentication)
- Images are stored in Cloudinary with organized folders
- Slugs are auto-generated from titles
- Soft delete option can be added if needed
- Pagination is implemented for list endpoints
- Search and filtering available on list endpoints
