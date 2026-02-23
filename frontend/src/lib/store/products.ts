import { create } from 'zustand';
import { Product, productsApi } from '@/lib/api';

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    selectedCategory: string | null;
    searchQuery: string;
    fetchProducts: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        featured?: boolean;
    }) => Promise<void>;
    setSelectedCategory: (category: string | null) => void;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedCategory: null,
    searchQuery: '',

    fetchProducts: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await productsApi.getAll(params);
            set({
                products: response.data.products,
                totalPages: response.data.pagination.totalPages,
                currentPage: response.data.pagination.currentPage,
                loading: false,
            });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    setSelectedCategory: (category) => {
        set({ selectedCategory: category, currentPage: 1 });
        get().fetchProducts({
            category: category || undefined,
            search: get().searchQuery || undefined,
            page: 1,
        });
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchProducts({
            category: get().selectedCategory || undefined,
            search: query || undefined,
            page: 1,
        });
    },

    setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchProducts({
            category: get().selectedCategory || undefined,
            search: get().searchQuery || undefined,
            page,
        });
    },
}));
