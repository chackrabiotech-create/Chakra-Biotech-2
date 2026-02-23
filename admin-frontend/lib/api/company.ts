import { apiRequest } from './config';

export interface CompanyDetails {
  _id?: string;
  companyName: string;
  email: string;
  secondaryEmail?: string;
  phone: string;
  alternatePhone?: string;
  whatsappNumber: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  businessHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  aboutUs?: string;
  mission?: string;
  vision?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  updatedAt?: Date;
}

export const companyApi = {
  get: async (): Promise<{ success: boolean; data: CompanyDetails }> => {
    return await apiRequest('/admin/company-details');
  },

  update: async (data: Partial<CompanyDetails>): Promise<{ success: boolean; data: CompanyDetails; message: string }> => {
    return await apiRequest('/admin/company-details', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
