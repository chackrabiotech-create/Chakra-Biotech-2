import { create } from 'zustand';
import { Blog, blogsApi } from '@/lib/api';

interface BlogsState {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    selectedCategory: string | null;
    searchQuery: string;
    fetchBlogs: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    }) => Promise<void>;
    setSelectedCategory: (category: string | null) => void;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
}

export const useBlogsStore = create<BlogsState>((set, get) => ({
    blogs: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedCategory: null,
    searchQuery: '',

    fetchBlogs: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await blogsApi.getAll(params);
            set({
                blogs: response.data.blogs,
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
        get().fetchBlogs({
            category: category || undefined,
            search: get().searchQuery || undefined,
            page: 1,
        });
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchBlogs({
            category: get().selectedCategory || undefined,
            search: query || undefined,
            page: 1,
        });
    },

    setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchBlogs({
            category: get().selectedCategory || undefined,
            search: get().searchQuery || undefined,
            page,
        });
    },
}));
