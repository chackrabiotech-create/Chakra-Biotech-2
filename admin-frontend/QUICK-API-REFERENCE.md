# Quick API Reference Card

## Import APIs

```typescript
import { 
  authApi, blogsApi, productsApi, contactsApi,
  blogCategoriesApi, productCategoriesApi,
  commentsApi, reviewsApi, galleryApi, heroApi,
  companyApi, statsApi, uploadApi
} from '@/lib/api';
```

## Common Patterns

### List Items
```typescript
const response = await blogsApi.getAll({ page: 1, limit: 10 });
const items = response.data.blogs;
const pagination = response.data.pagination;
```

### Get Single Item
```typescript
const response = await blogsApi.getOne(id);
const item = response.data;
```

### Create Item
```typescript
const response = await blogsApi.create(data);
toast.success(response.message);
```

### Update Item
```typescript
const response = await blogsApi.update(id, data);
toast.success(response.message);
```

### Delete Item
```typescript
await blogsApi.delete(id);
toast.success('Deleted successfully');
```

## With useApi Hook

```typescript
import { useApi } from '@/lib/hooks/useApi';

const { loading, execute } = useApi(blogsApi.create, {
  successMessage: 'Created!',
  onSuccess: () => router.push('/dashboard/blog')
});

await execute(formData);
```

## Upload Images

```typescript
// Single
const result = await uploadApi.uploadImage(file);
const url = result.data.url;

// Multiple
const results = await uploadApi.uploadImages([file1, file2]);
const urls = results.data.map(r => r.url);
```

## Dashboard Stats

```typescript
const stats = await statsApi.getDashboardStats();
// stats.data.totalProducts
// stats.data.unreadContacts
// stats.data.pendingComments
```

## Error Handling

```typescript
try {
  await blogsApi.create(data);
} catch (error) {
  toast.error(error.message);
}
```

## All Available APIs

| API | Methods |
|-----|---------|
| `authApi` | login, verify, logout |
| `blogsApi` | getAll, getOne, create, update, delete, togglePublish |
| `productsApi` | getAll, getOne, create, update, delete, togglePublish, toggleFeatured |
| `blogCategoriesApi` | getAll, getOne, create, update, delete |
| `productCategoriesApi` | getAll, getOne, create, update, delete |
| `galleryCategoriesApi` | getAll, getOne, create, update, delete |
| `commentsApi` | getAll, approve, delete |
| `reviewsApi` | getAll, approve, delete |
| `contactsApi` | getAll, getOne, markAsRead, markAsReplied, delete |
| `galleryApi` | getAll, getOne, create, update, delete |
| `heroApi` | getAll, getOne, create, update, delete, toggleActive |
| `companyApi` | get, update |
| `statsApi` | getDashboardStats |
| `uploadApi` | uploadImage, uploadImages, deleteImage |
