# Chakra Bio Backend API

Node.js backend API for Chakra Bio saffron e-commerce website with admin panel.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication for admin
- Cloudinary integration for image storage
- CORS enabled for frontend and admin frontend
- Rate limiting and security headers
- Comprehensive API for blogs, products, gallery, and more

## Installation

```bash
cd backend
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Update the `.env` file with your credentials:
   - MongoDB URI
   - Admin credentials
   - JWT secret
   - Cloudinary credentials
   - Frontend URLs

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Documentation

See `API-SPECIFICATION.md` for complete API documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   │   ├── admin/       # Admin controllers
│   │   └── public/      # Public controllers
│   ├── routes/          # Express routes
│   │   ├── admin/       # Admin routes
│   │   └── public/      # Public routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token

### Admin Routes (Protected)
All admin routes require authentication via Bearer token.

- Blog Categories: `/api/admin/blog-categories`
- Blogs: `/api/admin/blogs`
- Comments: `/api/admin/comments`
- Product Categories: `/api/admin/product-categories`
- Products: `/api/admin/products`
- Reviews: `/api/admin/reviews`
- Gallery Categories: `/api/admin/gallery-categories`
- Gallery: `/api/admin/gallery`
- Company Details: `/api/admin/company-details`
- Hero Sections: `/api/admin/hero-sections`
- Contacts: `/api/admin/contacts`
- Upload: `/api/admin/upload`
- Stats: `/api/admin/stats`

### Public Routes
- Blog Categories: `/api/blog-categories`
- Blogs: `/api/blogs`
- Product Categories: `/api/product-categories`
- Products: `/api/products`
- Gallery: `/api/gallery`
- Company Details: `/api/company-details`
- Hero Sections: `/api/hero-sections`
- Contact: `/api/contact`

## Security

- JWT authentication for admin routes
- Rate limiting on all API routes
- CORS configured for specific origins
- Helmet for security headers
- Input validation with express-validator
- MongoDB injection protection via Mongoose

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- cloudinary - Image storage
- multer - File upload handling
- cors - CORS middleware
- helmet - Security headers
- express-rate-limit - Rate limiting
- dotenv - Environment variables
- morgan - HTTP request logger
