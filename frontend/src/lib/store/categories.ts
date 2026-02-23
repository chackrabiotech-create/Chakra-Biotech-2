import { create } from 'zustand';
import { Category, categoriesApi } from '@/lib/api';

interface CategoriesState {
    blogCategories: Category[];
    productCategories: Category[];
    galleryCategories: Category[];
    loading: boolean;
    error: string | null;
    fetchBlogCategories: () => Promise<void>;
    fetchProductCategories: () => Promise<void>;
    fetchGalleryCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
    blogCategories: [],
    productCategories: [],
    galleryCategories: [],
    loading: false,
    error: null,

    fetchBlogCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await categoriesApi.getBlogCategories();
            set({ blogCategories: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchProductCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await categoriesApi.getProductCategories();
            set({ productCategories: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchGalleryCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await categoriesApi.getGalleryCategories();
            set({ galleryCategories: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
