# Admin Management & WhatsApp Configuration - Implementation Guide

## 🎯 Overview

Successfully implemented **database-driven admin credentials** and **dynamic WhatsApp number management**. Admin credentials and WhatsApp number are now stored in the database and manageable through the admin panel instead of hardcoded environment variables.

## ✅ What's Been Implemented

### 1. **Admin Model & Authentication**

- ✅ Created `Admin` model with password hashing
- ✅ Updated auth controller to use database instead of .env
- ✅ Implemented secure password comparison with bcrypt
- ✅ Added last login tracking and account status

### 2. **Admin Management APIs**

- ✅ `/api/admin/manage/profile` - Get/Update admin profile (email, name)
- ✅ `/api/admin/manage/change-password` - Change password with current password verification
- ✅ JWT tokens now include admin ID, email, and role
- ✅ Updated auth middleware to work with new JWT structure

### 3. **WhatsApp Number Management**

- ✅ WhatsApp number moved to `CompanyDetails` model (already exists)
- ✅ Updated WhatsApp button component to fetch from API
- ✅ Admin can update WhatsApp number through company settings

### 4. **Database Seeding**

- ✅ Created comprehensive seed script (`seedDatabase.js`)
- ✅ Seeds initial admin from .env or defaults
- ✅ Seeds company details with footer settings
- ✅ Proper password hashing during seeding

### 5. **Admin Panel Integration**

- ✅ Profile settings now uses real API
- ✅ Password change modal connects to backend
- ✅ Footer settings includes WhatsApp number
- ✅ All changes save to database

---

## 📁 Files Created/Modified

### **Backend - Created Files:**

1. `backend/src/models/Admin.js` - Admin model with password hashing
2. `backend/src/controllers/admin/adminController.js` - Admin management controller
3. `backend/src/routes/admin/adminRoutes.js` - Admin management routes
4. `backend/scripts/seedDatabase.js` - Database initialization script

### **Backend - Modified Files:**

1. `backend/src/controllers/authController.js` - Updated to use Admin model
2. `backend/src/middleware/auth.js` - Updated JWT verification
3. `backend/src/app.js` - Added admin management routes

### **Frontend - Modified Files:**

1. `frontend/src/components/ui/whatsapp-button.tsx` - Fetches number from API
2. `admin-frontend/app/dashboard/settings/page.tsx` - Real profile & password APIs
3. `admin-frontend/lib/api/admin.ts` - Admin API service (created)

---

## 🚀 Getting Started

### **Step 1: Seed the Database**

This creates the initial admin account and company data:

```bash
cd backend
node scripts/seedDatabase.js
```

**Default credentials created:**

- Email: From `ADMIN_EMAIL` in .env or `admin@chakrabiotech.com`
- Password: From `ADMIN_PASSWORD` in .env or `admin123456`

⚠️ **IMPORTANT:** Change the password immediately after first login!

### **Step 2: Start the Backend**

```bash
cd backend
npm run dev
```

### **Step 3: Login & Update**

1. Go to admin panel: `http://localhost:3001`
2. Login with seeded credentials
3. Go to Settings → Profile or Footer Settings
4. Update your details and save

---

## 🔑 Admin Management Features

### **1. Profile Management**

**Location:** Admin Panel → Settings → Profile Tab

**What you can update:**

- Email address (must be unique)
- Name

**API Endpoint:** `PUT /api/admin/manage/profile`

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "name": "Admin Name"
}
```

### **2. Password Management**

**Location:** Admin Panel → Settings → Security Tab → Change Password

**Requirements:**

- Current password (for verification)
- New password (minimum 6 characters)
- Passwords are hashed with bcrypt

**API Endpoint:** `PUT /api/admin/manage/change-password`

**Request Body:**

```json
{
  "currentPassword": "old password",
  "newPassword": "new secure password"
}
```

### **3. WhatsApp Number Management**

**Location:** Admin Panel → Settings → Footer Settings

The WhatsApp number is part of company details and can be updated there.

**API Endpoint:** `PUT /api/admin/company-details`

**Request Body:**

```json
{
  "whatsappNumber": "919876543210"
}
```

---

## 🔒 Security Features

### **Password Security:**

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ Passwords never sent in responses
- ✅ Current password verification for changes
- ✅ Minimum password length validation

### **JWT Security:**

- ✅ Tokens include admin ID, email, and role
- ✅ Tokens verified on protected routes
- ✅ Admin status checked on verification

### **Account Security:**

- ✅ Account can be disabled (`isActive` field)
- ✅ Last login tracking
- ✅ Role-based permissions (super_admin, admin)

---

## 📊 Database Schema

### **Admin Model:**

```javascript
{
  email: String (unique, required),
  password: String (hashed, select: false),
  name: String,
  role: String (super_admin | admin),
  is Active: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **CompanyDetails Model:**

Already exists, now includes:

```javascript
{
  whatsappNumber: String,
  // ... other company details
  footer: {
    description: String,
    offerings: [String],
    quickLinks: [{ name, href }],
    copyrightText: String
  }
}
```

---

## 🧪 Testing

### **1. Test Admin Login:**

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chakrabiotech.com",
    "password": "admin123456"
  }'
```

### **2. Test Profile Update:**

```bash
curl -X PUT http://localhost:5000/api/admin/manage/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "newemail@example.com",
    "name": "New Admin Name"
  }'
```

### **3. Test Password Change:**

```bash
curl -X PUT http://localhost:5000/api/admin/manage/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "currentPassword": "admin123456",
    "newPassword": "newSecurePassword123"
  }'
```

---

## 🔄 Migration from .env

### **Before (Hardcoded in .env):**

```env
ADMIN_EMAIL=a@aa.co
ADMIN_PASSWORD=123412
```

### **After (Database-Driven):**

1. Admin credentials stored in MongoDB
2. Passwords properly hashed
3. Can be updated through admin panel
4. .env variables only used for initial seeding

**Note:** You can remove `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env` after seeding!

---

## 📝 API Endpoints Summary

| Endpoint                            | Method | Purpose                | Auth Required |
| ----------------------------------- | ------ | ---------------------- | ------------- |
| `/api/admin/login`                  | POST   | Admin login            | No            |
| `/api/admin/verify`                 | GET    | Verify token           | Yes           |
| `/api/admin/manage/profile`         | GET    | Get admin profile      | Yes           |
| `/api/admin/manage/profile`         | PUT    | Update profile         | Yes           |
| `/api/admin/manage/change-password` | PUT    | Change password        | Yes           |
| `/api/company-details`              | GET    | Get company details    | No            |
| `/api/admin/company-details`        | PUT    | Update company details | Yes           |

---

## 🐛 Troubleshooting

### **"Admin not found" error on login:**

- Run the seed script: `node scripts/seedDatabase.js`
- Check MongoDB connection
- Verify admin exists in database

### **"Invalid credentials" error:**

- Double-check email and password
- Password is case-sensitive
- Try using default credentials from seed script output

### **WhatsApp button shows old number:**

- Clear browser cache
- Check company details in database
- Verify API is returning whatsappNumber field

### **Password change not working:**

- Ensure current password is correct
- New password must be at least 6 characters
- Check browser console for errors
- Verify JWT token is valid

---

## ⚙️ Configuration

### **Environment Variables (.env):**

```env
# Database
MONGODB_URI=mongodb://...

# JWT
JWT_SECRET=your_secret_key

# OPTIONAL: For Initial Seeding Only
ADMIN_EMAIL=admin@chakrabiotech.com
ADMIN_PASSWORD=admin123456
```

**Note:** After running the seed script once, admin credentials come from the database, not .env!

---

## 🎯 Next Steps

1. **Run seed script** to create initial admin
2. **Login** with default credentials
3. **Change password** immediately in Settings
4. **Update profile** with your details
5. **Configure WhatsApp number** in Footer Settings
6. **Remove** ADMIN_EMAIL and ADMIN_PASSWORD from .env (optional)

---

## ✨ Benefits

✅ **Dynamic Management** - No need to redeploy to change admin credentials  
✅ **Secure** - Passwords properly hashed with bcrypt  
✅ **Scalable** - Supports multiple admin accounts  
✅ **Auditable** - Last login tracking  
✅ **Flexible** - WhatsApp number from database  
✅ **Role-based** - Super admin and admin roles

---

## 📞 Support

For issues or questions:

1. Check troubleshooting section
2. Verify database connection
3. Check backend logs
4. Ensure all migrations ran successfully

Happy administering! 🚀
