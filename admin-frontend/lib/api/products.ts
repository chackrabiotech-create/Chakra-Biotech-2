import { apiRequest } from './config';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string | { _id: string; name: string };
  price: number;
  originalPrice?: number;
  discount: number;
  grade?: string;
  origin?: string;
  weight?: string;
  images: string[];
  featuredImage?: string;
  specifications?: {
    origin?: string;
    grade?: string;
    moistureContent?: string;
    crocin?: string;
    safranal?: string;
    picrocrocin?: string;
    shelfLife?: string;
    storage?: string;
  };
  features?: string[];
  benefits?: string[];
  inStock: boolean;
  stockQuantity?: number;
  badge?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  rating: number;
  reviewCount: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublished?: boolean;
  }): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isPublished !== undefined) queryParams.append('isPublished', params.isPublished.toString());

    return await apiRequest(`/admin/products?${queryParams.toString()}`);
  },

  getOne: async (id: string): Promise<{ success: boolean; data: Product }> => {
    return await apiRequest(`/admin/products/${id}`);
  },

  create: async (data: Partial<Product>): Promise<{ success: boolean; data: Product; message: string }> => {
    return await apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Product>): Promise<{ success: boolean; data: Product; message: string }> => {
    return await apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  togglePublish: async (id: string): Promise<{ success: boolean; data: Product; message: string }> => {
    return await apiRequest(`/admin/products/${id}/publish`, {
      method: 'POST',
    });
  },

  toggleFeatured: async (id: string): Promise<{ success: boolean; data: Product; message: string }> => {
    return await apiRequest(`/admin/products/${id}/featured`, {
      method: 'PUT',
    });
  },
};
