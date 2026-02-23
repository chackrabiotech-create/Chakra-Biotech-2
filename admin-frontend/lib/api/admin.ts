import { apiRequest } from './config';

export interface AdminProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileData {
    email?: string;
    name?: string;
}

export const adminApi = {
    // Get current admin profile
    getProfile: async () => {
        const data = await apiRequest('/admin/manage/profile', {
            method: 'GET',
        });
        return data;
    },

    // Update admin profile (email/name)
    updateProfile: async (updateData: UpdateProfileData) => {
        const data = await apiRequest('/admin/manage/profile', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        return data;
    },

    // Change password
    changePassword: async (passwordData: ChangePasswordData) => {
        const data = await apiRequest('/admin/manage/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
        return data;
    },
};
