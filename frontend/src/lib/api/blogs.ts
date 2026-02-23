import api from './config';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: {
        _id: string;
        name: string;
    } | string;
    author: string;
    tags: string[];
    readTime?: string;
    isPublished: boolean;
    publishedAt?: string;
    views: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface BlogsResponse {
    success: boolean;
    data: {
        blogs: Blog[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    };
}

export const blogsApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    }) => {
        const response = await api.get<BlogsResponse>('/blogs', { params });
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await api.get<{ success: boolean; data: Blog }>(`/blogs/${slug}`);
        return response.data;
    },

    incrementView: async (slug: string) => {
        const response = await api.post(`/blogs/${slug}/view`);
        return response.data;
    },

    like: async (slug: string) => {
        const response = await api.post(`/blogs/${slug}/like`);
        return response.data;
    },
};
