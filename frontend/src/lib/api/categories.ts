import api from './config';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    displayOrder?: number;
}

export const categoriesApi = {
    getBlogCategories: async () => {
        const response = await api.get<{ success: boolean; data: Category[] }>('/blog-categories');
        return response.data;
    },

    getProductCategories: async () => {
        const response = await api.get<{ success: boolean; data: Category[] }>('/product-categories');
        return response.data;
    },

    getGalleryCategories: async () => {
        const response = await api.get<{ success: boolean; data: Category[] }>('/gallery-categories');
        return response.data;
    },
};
