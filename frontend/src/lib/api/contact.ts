import api from './config';

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export const contactApi = {
    submit: async (data: ContactFormData) => {
        const response = await api.post<{ success: boolean; message: string }>('/contact', data);
        return response.data;
    },
};
