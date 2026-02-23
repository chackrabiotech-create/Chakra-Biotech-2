import { uploadFile } from './config';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
  };
  message: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  data: Array<{
    url: string;
    publicId: string;
  }>;
  message: string;
}

export const uploadApi = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    return await uploadFile('/admin/upload/image', file, 'image');
  },

  uploadImages: async (files: File[]): Promise<MultipleUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('chakra_admin_token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/upload/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  deleteImage: async (publicId: string): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem('chakra_admin_token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/upload/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Delete failed');
    }

    return data;
  },
};
