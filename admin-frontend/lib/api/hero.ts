import { apiRequest } from './config';

export interface HeroSection {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  isActive: boolean;
  displayOrder: number;
  textPosition: 'left' | 'center' | 'right';
  overlayOpacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export const heroApi = {
  getAll: async (): Promise<{ success: boolean; data: HeroSection[] }> => {
    return await apiRequest('/admin/hero-sections');
  },

  getOne: async (id: string): Promise<{ success: boolean; data: HeroSection }> => {
    return await apiRequest(`/admin/hero-sections/${id}`);
  },

  create: async (data: Partial<HeroSection>): Promise<{ success: boolean; data: HeroSection; message: string }> => {
    return await apiRequest('/admin/hero-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<HeroSection>): Promise<{ success: boolean; data: HeroSection; message: string }> => {
    return await apiRequest(`/admin/hero-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await apiRequest(`/admin/hero-sections/${id}`, {
      method: 'DELETE',
    });
  },

  toggleActive: async (id: string): Promise<{ success: boolean; data: HeroSection; message: string }> => {
    return await apiRequest(`/admin/hero-sections/${id}/toggle`, {
      method: 'PUT',
    });
  },
};
