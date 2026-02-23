import api from './config';

export interface BlogComment {
    _id: string;
    blog?: string;
    product?: string;
    name: string;
    email: string;
    comment: string;
    parentComment?: string | null;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentsResponse {
    success: boolean;
    data: {
        comments: BlogComment[];
        replies: BlogComment[];
    };
}

export const commentsApi = {
    // Blog Comments
    getByBlog: async (slug: string) => {
        const response = await api.get<CommentsResponse>(`/comments/blog/${slug}`);
        return response.data;
    },

    createBlogComment: async (slug: string, data: { name: string; email: string; comment: string }) => {
        const response = await api.post<{ success: boolean; data: BlogComment; message: string }>(
            `/comments/blog/${slug}`,
            data
        );
        return response.data;
    },

    replyToBlogComment: async (commentId: string, data: { name: string; email: string; comment: string }) => {
        const response = await api.post<{ success: boolean; data: BlogComment; message: string }>(
            `/comments/blog/reply/${commentId}`,
            data
        );
        return response.data;
    },

    // Product Comments
    getByProduct: async (slug: string) => {
        const response = await api.get<CommentsResponse>(`/comments/product/${slug}`);
        return response.data;
    },

    createProductComment: async (slug: string, data: { name: string; email: string; comment: string }) => {
        const response = await api.post<{ success: boolean; data: BlogComment; message: string }>(
            `/comments/product/${slug}`,
            data
        );
        return response.data;
    },

    replyToProductComment: async (commentId: string, data: { name: string; email: string; comment: string }) => {
        const response = await api.post<{ success: boolean; data: BlogComment; message: string }>(
            `/comments/product/reply/${commentId}`,
            data
        );
        return response.data;
    }
};
