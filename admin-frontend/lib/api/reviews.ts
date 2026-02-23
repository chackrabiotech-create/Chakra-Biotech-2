import { apiRequest } from './config';

export interface ProductReview {
  _id: string;
  product: string | { _id: string; name: string; slug: string };
  name: string;
  email: string;
  rating: number;
  title?: string;
  review: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: ProductReview[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const reviewsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    product?: string;
    isApproved?: boolean;
  }): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.product) queryParams.append('product', params.product);
    if (params?.isApproved !== undefined) queryParams.append('isApproved', params.isApproved.toString());

    return await apiRequest(`/admin/reviews?${queryParams.toString()}`);
  },

  approve: async (id: string): Promise<{ success: boolean; data: ProductReview; message: string }> => {
    return await apiRequest(`/admin/reviews/${id}/approve`, {
      method: 'PUT',
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};
