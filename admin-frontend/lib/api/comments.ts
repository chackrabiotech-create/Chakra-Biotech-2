import { apiRequest } from './config';

export interface Comment {
  _id: string;
  blog?: { _id: string; title: string; slug: string };
  product?: { _id: string; name: string; slug: string };
  name: string;
  email: string;
  comment: string;
  parentComment?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const commentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    blog?: string;
    product?: string;
    type?: 'blog' | 'product';
    isApproved?: boolean;
  }): Promise<CommentsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.blog) queryParams.append('blog', params.blog);
    if (params?.product) queryParams.append('product', params.product);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.isApproved !== undefined) queryParams.append('isApproved', params.isApproved.toString());

    return await apiRequest(`/admin/comments?${queryParams.toString()}`);
  },

  approve: async (id: string, type: 'blog' | 'product' = 'blog'): Promise<{ success: boolean; data: Comment; message: string }> => {
    return await apiRequest(`/admin/comments/${id}/approve?type=${type}`, {
      method: 'PUT',
    });
  },

  delete: async (id: string, type: 'blog' | 'product' = 'blog'): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/comments/${id}?type=${type}`, {
      method: 'DELETE',
    });
  },
};
