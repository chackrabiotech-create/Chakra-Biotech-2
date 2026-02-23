import { apiRequest } from './config';

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  success: boolean;
  data: {
    contacts: ContactSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const contactsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<ContactsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());

    return await apiRequest(`/admin/contacts?${queryParams.toString()}`);
  },

  getOne: async (id: string): Promise<{ success: boolean; data: ContactSubmission }> => {
    return await apiRequest(`/admin/contacts/${id}`);
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: ContactSubmission; message: string }> => {
    return await apiRequest(`/admin/contacts/${id}/read`, {
      method: 'PUT',
    });
  },

  markAsReplied: async (id: string, adminNotes?: string): Promise<{ success: boolean; data: ContactSubmission; message: string }> => {
    return await apiRequest(`/admin/contacts/${id}/reply`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};
