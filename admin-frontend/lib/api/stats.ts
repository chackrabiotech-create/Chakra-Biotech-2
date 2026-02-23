import { apiRequest } from './config';

export interface DashboardStats {
  totalProducts: number;
  totalBlogs: number;
  totalGalleryImages: number;
  totalContacts: number;
  unreadContacts: number;
  pendingComments: number;
  pendingReviews: number;
  recentActivity: {
    contacts: Array<{
      _id: string;
      name: string;
      email: string;
      subject: string;
      createdAt: Date;
      isRead: boolean;
    }>;
    blogs: Array<{
      _id: string;
      title: string;
      slug: string;
      createdAt: Date;
      isPublished: boolean;
    }>;
  };
}

export const statsApi = {
  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return await apiRequest('/admin/stats');
  },
};
