import { apiRequest } from './config';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string | { _id: string; name: string };
  author: string;
  tags: string[];
  readTime?: string;
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const blogsApi = {
  // Get all blogs
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublished?: boolean;
  }): Promise<BlogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isPublished !== undefined) queryParams.append('isPublished', params.isPublished.toString());

    return await apiRequest(`/admin/blogs?${queryParams.toString()}`);
  },

  // Get single blog
  getOne: async (id: string): Promise<{ success: boolean; data: Blog }> => {
    return await apiRequest(`/admin/blogs/${id}`);
  },

  // Create blog
  create: async (data: Partial<Blog>): Promise<{ success: boolean; data: Blog; message: string }> => {
    return await apiRequest('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update blog
  update: async (id: string, data: Partial<Blog>): Promise<{ success: boolean; data: Blog; message: string }> => {
    return await apiRequest(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete blog
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/blogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle publish status
  togglePublish: async (id: string): Promise<{ success: boolean; data: Blog; message: string }> => {
    return await apiRequest(`/admin/blogs/${id}/publish`, {
      method: 'POST',
    });
  },
};
