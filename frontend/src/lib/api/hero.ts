import api from './config';

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
    textPosition?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
}

export const heroApi = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; data: HeroSection[] }>('/hero-sections');
        return response.data;
    },
};
