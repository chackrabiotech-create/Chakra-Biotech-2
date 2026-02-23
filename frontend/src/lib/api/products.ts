import api from './config';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    category: {
        _id: string;
        name: string;
    } | string;
    price: number;
    originalPrice?: number;
    discount?: number;
    grade?: string;
    origin?: string;
    weight?: string;
    images: string[];
    featuredImage?: string;
    specifications?: {
        origin?: string;
        grade?: string;
        moistureContent?: string;
        crocin?: string;
        safranal?: string;
        picrocrocin?: string;
        shelfLife?: string;
        storage?: string;
    };
    features?: string[];
    benefits?: string[];
    inStock: boolean;
    stockQuantity?: number;
    badge?: string;
    isPublished: boolean;
    isFeatured: boolean;
    displayOrder: number;
    rating: number;
    reviewCount: number;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    success: boolean;
    data: {
        products: Product[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    };
}

export const productsApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        featured?: boolean;
    }) => {
        const response = await api.get<ProductsResponse>('/products', { params });
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`);
        return response.data;
    },

    incrementView: async (slug: string) => {
        const response = await api.post(`/products/${slug}/view`);
        return response.data;
    },
};
