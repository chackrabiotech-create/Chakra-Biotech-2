# API Integration Complete! 🎉

The Chakra Bio admin frontend has been successfully integrated with the backend API.

## What's New

### ✅ Complete API Layer
- 13 API modules in `/lib/api/`
- Full TypeScript support with interfaces
- Centralized configuration
- Error handling built-in

### ✅ Updated Authentication
- Real JWT-based auth with backend
- Token management
- Auto-refresh and validation
- Secure logout

### ✅ Custom Hooks
- `useApi` hook for easy API integration
- Loading states
- Error handling
- Success callbacks

### ✅ Utilities
- Date/time formatters
- Currency formatters
- Text utilities

## Quick Start

### 1. Environment Setup

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Start Admin Frontend

```bash
cd admin-frontend
npm install
npm run dev
```

### 4. Login

Use the admin credentials from your backend `.env` file:
- Email: `admin@chakrabio.com`
- Password: Your configured password

## API Modules Available

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `authApi` | Authentication | login, verify, logout |
| `blogsApi` | Blog management | getAll, create, update, delete, togglePublish |
| `productsApi` | Product catalog | getAll, create, update, delete, togglePublish, toggleFeatured |
| `blogCategoriesApi` | Blog categories | getAll, create, update, delete |
| `productCategoriesApi` | Product categories | getAll, create, update, delete |
| `galleryCategoriesApi` | Gallery categories | getAll, create, update, delete |
| `commentsApi` | Comment moderation | getAll, approve, delete |
| `reviewsApi` | Review moderation | getAll, approve, delete |
| `contactsApi` | Contact management | getAll, markAsRead, markAsReplied, delete |
| `galleryApi` | Gallery images | getAll, create, update, delete |
| `heroApi` | Hero sections | getAll, create, update, delete, toggleActive |
| `companyApi` | Company details | get, update |
| `statsApi` | Dashboard stats | getDashboardStats |
| `uploadApi` | Image uploads | uploadImage, uploadImages, deleteImage |

## Example Usage

### Dashboard with Real Data

See `app/dashboard/page-with-api.tsx.example` for a complete example of:
- Loading dashboard statistics
- Displaying real-time data
- Handling loading states
- Error management

To use it:
```bash
mv app/dashboard/page-with-api.tsx.example app/dashboard/page.tsx
```

### Creating a Blog

```typescript
import { blogsApi } from '@/lib/api';
import { useApi } from '@/lib/hooks/useApi';

const { loading, execute } = useApi(blogsApi.create, {
  successMessage: 'Blog created!',
  onSuccess: () => router.push('/dashboard/blog')
});

const handleSubmit = async (data) => {
  await execute(data);
};
```

### Uploading Images

```typescript
import { uploadApi } from '@/lib/api';

const handleUpload = async (file: File) => {
  const response = await uploadApi.uploadImage(file);
  setImageUrl(response.data.url);
};
```

## Next Steps

### Update Existing Pages

1. **Dashboard** (`app/dashboard/page.tsx`)
   - Replace with `page-with-api.tsx.example`
   - Shows real stats from backend

2. **Blog Management** (`app/dashboard/blog/page.tsx`)
   - Use `blogsApi.getAll()` to fetch blogs
   - Use `blogsApi.create()` for new blogs
   - Use `blogsApi.update()` to edit
   - Use `blogsApi.delete()` to remove

3. **Product Management** (`app/dashboard/products/page.tsx`)
   - Use `productsApi` methods
   - Implement image upload with `uploadApi`

4. **Contact Management** (`app/dashboard/contact/page.tsx`)
   - Use `contactsApi.getAll()` to list
   - Use `contactsApi.markAsRead()` for status updates

5. **Gallery** (`app/dashboard/gallery/page.tsx`)
   - Use `galleryApi` for image management
   - Use `uploadApi` for uploads

6. **Hero/Carousel** (`app/dashboard/carousel/page.tsx`)
   - Use `heroApi` for carousel management

7. **Company Info** (`app/dashboard/company/page.tsx`)
   - Use `companyApi.get()` and `companyApi.update()`

## File Structure

```
admin-frontend/
├── lib/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── blogs.ts
│   │   ├── categories.ts
│   │   ├── comments.ts
│   │   ├── company.ts
│   │   ├── config.ts
│   │   ├── contacts.ts
│   │   ├── gallery.ts
│   │   ├── hero.ts
│   │   ├── index.ts
│   │   ├── products.ts
│   │   ├── reviews.ts
│   │   ├── stats.ts
│   │   └── upload.ts
│   ├── hooks/
│   │   └── useApi.ts
│   └── utils/
│       └── formatters.ts
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx (✅ Updated)
│   └── dashboard/
│       └── page-with-api.tsx.example
├── .env.local.example
├── INTEGRATION-GUIDE.md
└── README-API-INTEGRATION.md (this file)
```

## TypeScript Benefits

All API calls are fully typed:
- Autocomplete for function parameters
- Type checking for request/response data
- IntelliSense support in VS Code
- Compile-time error detection

## Error Handling

All API functions throw errors that can be caught:

```typescript
try {
  await blogsApi.create(data);
  toast.success('Success!');
} catch (error) {
  toast.error(error.message);
}
```

Or use the `useApi` hook for automatic error handling:

```typescript
const { loading, execute } = useApi(blogsApi.create, {
  successMessage: 'Blog created!',
  errorMessage: 'Failed to create blog'
});
```

## Testing Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Admin credentials configured
- [ ] Frontend `.env.local` created
- [ ] Can login successfully
- [ ] Dashboard shows real stats
- [ ] Can create/edit/delete blogs
- [ ] Can upload images
- [ ] Can manage products
- [ ] Can view contacts

## Troubleshooting

### CORS Errors
Update backend `.env`:
```
ADMIN_FRONTEND_URL=http://localhost:3001
```

### 401 Unauthorized
- Check admin credentials in backend `.env`
- Verify JWT_SECRET is set
- Try logging out and back in

### Network Errors
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify MongoDB connection

## Documentation

- **Full API Guide**: See `INTEGRATION-GUIDE.md`
- **Backend API Spec**: See `backend/API-SPECIFICATION.md`
- **Backend Setup**: See `backend/SETUP.md`

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Ensure all services are running

Happy coding! 🚀
