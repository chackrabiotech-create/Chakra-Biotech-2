# Pages Updated with Real API

## ✅ Completed Pages

1. **Dashboard** (`/dashboard/page.tsx`) - Using `statsApi`
2. **Product Categories** (`/dashboard/product-categories/page.tsx`) - Using `productCategoriesApi`
3. **Products** (`/dashboard/products/page.tsx`) - Using `productsApi` + image upload
4. **Blog Categories** (`/dashboard/blog-categories/page.tsx`) - Using `blogCategoriesApi`

## 🔄 Pages to Update

### High Priority (Core Features)

5. **Blog Management** (`/dashboard/blog/page.tsx`)
   - API: `blogsApi`
   - Features: CRUD operations, publish/unpublish, image upload
   
6. **Contact Management** (`/dashboard/contact/page.tsx`)
   - API: `contactsApi`
   - Features: View submissions, mark as read/replied, delete

7. **Gallery** (`/dashboard/carousel/page.tsx` or create `/dashboard/gallery/page.tsx`)
   - API: `galleryApi` + `galleryCategoriesApi`
   - Features: Upload images, categorize, manage

8. **Hero/Carousel** (`/dashboard/carousel/page.tsx`)
   - API: `heroApi`
   - Features: Manage hero sections, upload images, toggle active

9. **Company Info** (`/dashboard/company/page.tsx`)
   - API: `companyApi`
   - Features: Update company details, contact info, social media

### Low Priority (Can be removed or simplified)

10. **Notifications** (`/dashboard/notifications/page.tsx`) - **REMOVE** (not in API)
11. **Profile** (`/dashboard/profile/page.tsx`) - **SIMPLIFY** (just show admin email)
12. **Settings** (`/dashboard/settings/page.tsx`) - **SIMPLIFY** (basic settings only)
13. **Training** (`/dashboard/training/page.tsx`) - **REMOVE** (not in API spec)

## 📋 Implementation Pattern

All pages should follow this pattern:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'
import { someApi, SomeType } from '@/lib/api'

const SomePage = () => {
  const [items, setItems] = useState<SomeType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SomeType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await someApi.getAll()
      setItems(response.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        await someApi.update(editing._id, formData)
        toast.success('Updated successfully!')
      } else {
        await someApi.create(formData)
        toast.success('Created successfully!')
      }
      setShowForm(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await someApi.delete(id)
      toast.success('Deleted successfully!')
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete')
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Page Title">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Page Title">
      {/* Page content */}
    </DashboardLayout>
  )
}

export default SomePage
```

## 🎨 Image Upload Pattern

For pages that need image upload:

```typescript
import { uploadApi } from '@/lib/api'

const [uploading, setUploading] = useState(false)

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setUploading(true)
  try {
    const response = await uploadApi.uploadImage(file)
    setFormData(prev => ({ ...prev, image: response.data.url }))
    toast.success('Image uploaded!')
  } catch (error: any) {
    toast.error(error.message || 'Upload failed')
  } finally {
    setUploading(false)
  }
}

// In JSX:
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  disabled={uploading}
/>
```

## 🗑️ Pages to Remove

Delete these directories as they're not in the API spec:
- `/dashboard/notifications/`
- `/dashboard/training/`

## ✂️ Header Simplification

Remove from Header component:
- Search functionality (not implemented in backend)
- Notifications dropdown (not in API)
- Keep only: User profile dropdown with logout

## 📝 Next Steps

1. Update remaining high-priority pages (Blog, Contact, Gallery, Hero, Company)
2. Remove unnecessary pages (Notifications, Training)
3. Simplify Header component
4. Simplify Profile and Settings pages
5. Test all CRUD operations
6. Test image uploads
7. Verify all API integrations work

## 🚀 Quick Commands

```bash
# Start backend
cd backend && npm run dev

# Start admin frontend
cd admin-frontend && npm run dev

# Test login
# Email: a@aa.co
# Password: 123412
```
