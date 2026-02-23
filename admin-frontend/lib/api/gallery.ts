import { apiRequest } from './config';

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  image: string;
  thumbnail?: string;
  category: string | { _id: string; name: string };
  tags?: string[];
  location?: string;
  date?: string;
  photographer?: string;
  views: number;
  likes: number;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryResponse {
  success: boolean;
  data: {
    images: GalleryImage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const galleryApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<GalleryResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);

    return await apiRequest(`/admin/gallery?${queryParams.toString()}`);
  },

  getOne: async (id: string): Promise<{ success: boolean; data: GalleryImage }> => {
    return await apiRequest(`/admin/gallery/${id}`);
  },

  create: async (data: Partial<GalleryImage>): Promise<{ success: boolean; data: GalleryImage; message: string }> => {
    return await apiRequest('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<GalleryImage>): Promise<{ success: boolean; data: GalleryImage; message: string }> => {
    return await apiRequest(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};
