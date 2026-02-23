# Footer Settings - Quick Start Guide

## 🎯 Overview

The footer content is now fully editable through the admin panel. All information including company name, address, phone, email, social links, quick links, and offerings can be managed dynamically.

## 🚀 Quick Start

### 1. Initialize Default Data (Optional)

Run this command to populate the database with default footer settings:

```bash
cd backend
node scripts/initFooterSettings.js
```

### 2. Access Admin Panel

1. Navigate to: `http://localhost:3001/dashboard/settings` (or your admin URL)
2. Click on the **"Footer Settings"** tab
3. Update any fields you want to change
4. Click **"Save Footer Settings"**

### 3. View Changes

Visit your frontend at `http://localhost:3000` and scroll to the footer to see your changes!

## 📝 Editable Fields

### Footer Description

The tagline/description that appears under your logo in the footer.

### Quick Links

Add or remove navigation links that appear in the footer's "Quick Links" section.

- Each link requires a **Name** and **Path/URL**
- Click "+" to add more links
- Click "X" to remove a link

### Offerings

List your company's services or offerings.

- Simple text inputs
- Click "+" to add more offerings
- Click "X" to remove an offering

### Copyright Text

Custom copyright text (the year is automatically added before this text).

## 🔧 Technical Details

### API Endpoints

- **GET** `/api/company-details` - Fetch company/footer data (public)
- **PUT** `/api/admin/company-details` - Update company/footer data (admin only)

### File Locations

- **Backend Model**: `backend/src/models/CompanyDetails.js`
- **Backend Controller**: `backend/src/controllers/admin/companyController.js`
- **Frontend Component**: `frontend/src/components/layout/Footer.tsx`
- **Admin Panel**: `admin-frontend/app/dashboard/settings/page.tsx`
- **API Types**: `frontend/src/lib/api/company.ts`

## 🎨 Usage Example

### Via Admin Panel (Recommended)

1. Go to Settings → Footer Settings
2. Fill in the fields
3. Click Save

### Via API (Advanced)

```bash
curl -X PUT http://localhost:5000/api/admin/company-details \
  -H "Content-Type: application/json" \
  -d '{
    "footer": {
      "description": "Your company description",
      "offerings": ["Service 1", "Service 2"],
      "quickLinks": [
        { "name": "Products", "href": "/products" },
        { "name": "About", "href": "/about" }
      ],
      "copyrightText": "Your Company. All rights reserved."
    }
  }'
```

## 🧪 Testing Checklist

- [ ] Backend is running on port 5000
- [ ] Admin panel is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] MongoDB is connected
- [ ] Initialize script has been run (optional)
- [ ] Admin panel Settings page loads correctly
- [ ] Footer Settings tab is visible
- [ ] Can add/remove quick links
- [ ] Can add/remove offerings
- [ ] Save button works and shows success toast
- [ ] Frontend footer shows updated data

## 🐛 Troubleshooting

### Footer not updating on frontend?

- Check browser console for API errors
- Verify backend is running and accessible
- Clear browser cache and hard reload (Ctrl+Shift+R)

### Admin panel settings not saving?

- Check browser console for errors
- Verify backend API is accessible
- Check network tab for failed requests
- Ensure MongoDB is connected

### Default data not appearing?

- Run the initialization script: `node scripts/initFooterSettings.js`
- Check MongoDB connection in backend
- Verify `MONGODB_URI` in `.env` file

## 📞 Need Help?

If you encounter any issues, check:

1. All services are running
2. MongoDB is connected
3. No console errors in browser or terminal
4. API endpoints are accessible

For detailed implementation details, see `FOOTER_SETTINGS_IMPLEMENTATION.md`
