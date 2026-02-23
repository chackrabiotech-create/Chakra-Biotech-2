# Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the backend directory:

```bash
copy .env.example .env
```

Edit `.env` and add your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Update with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/chakra-bio

# Admin Credentials
ADMIN_EMAIL=admin@chakrabio.com
ADMIN_PASSWORD=YourSecurePassword123!

# JWT Secret - Generate a random string
JWT_SECRET=your_random_jwt_secret_key_here_min_32_chars

# Cloudinary - Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS - Update with your frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001
```

## Step 3: Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update MONGODB_URI accordingly.

## Step 4: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Step 5: Test the API

The server should be running at `http://localhost:5000`

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Test admin login:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@chakrabio.com\",\"password\":\"YourSecurePassword123!\"}"
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, whitelist your IP address

### Cloudinary Upload Error
- Verify Cloudinary credentials in .env
- Check API key permissions

### CORS Error
- Update FRONTEND_URL and ADMIN_FRONTEND_URL in .env
- Ensure URLs match your frontend applications

## Next Steps

1. Use the admin login endpoint to get a JWT token
2. Use the token in Authorization header: `Bearer <token>`
3. Start creating categories, products, blogs, etc.
4. See API-SPECIFICATION.md for all available endpoints

## API Testing Tools

- Postman: Import the API endpoints
- Thunder Client (VS Code extension)
- curl commands
- Your frontend application

## Production Deployment

1. Set NODE_ENV=production
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas or managed MongoDB
4. Enable HTTPS
5. Set proper CORS origins
6. Consider using PM2 for process management
7. Set up monitoring and logging
