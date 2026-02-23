import { apiRequest } from './config';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const blogCategoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    return await apiRequest('/admin/blog-categories');
  },

  getOne: async (id: string): Promise<{ success: boolean; data: Category }> => {
    return await apiRequest(`/admin/blog-categories/${id}`);
  },

  create: async (data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest('/admin/blog-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest(`/admin/blog-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/blog-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export const productCategoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    return await apiRequest('/admin/product-categories');
  },

  getOne: async (id: string): Promise<{ success: boolean; data: Category }> => {
    return await apiRequest(`/admin/product-categories/${id}`);
  },

  create: async (data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest('/admin/product-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest(`/admin/product-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/product-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export const galleryCategoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    return await apiRequest('/admin/gallery-categories');
  },

  getOne: async (id: string): Promise<{ success: boolean; data: Category }> => {
    return await apiRequest(`/admin/gallery-categories/${id}`);
  },

  create: async (data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest('/admin/gallery-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Category>): Promise<{ success: boolean; data: Category; message: string }> => {
    return await apiRequest(`/admin/gallery-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/gallery-categories/${id}`, {
      method: 'DELETE',
    });
  },
};
