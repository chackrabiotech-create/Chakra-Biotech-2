import api from './config';

export interface CurriculumModule {
    title: string;
    description: string;
    duration: string;
    topics: string[];
}

export interface TrainingFAQ {
    question: string;
    answer: string;
}

export interface TrainingTestimonial {
    name: string;
    city: string;
    image: string;
    review: string;
    rating: number;
}

export interface PracticalExposure {
    title: string;
    description: string;
    points: string[];
    images: string[];
}

export interface Training {
    _id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    aboutProgram?: string;
    level: string;
    category?: string;
    mode?: string;
    language?: string;
    duration: string;
    price: number;
    originalPrice?: number;
    features: string[];
    coverImage: string;
    icon?: string;
    popular: boolean;
    isActive: boolean;
    isPublished?: boolean;
    startDate?: string;
    endDate?: string;
    instructor?: string;
    instructorBio?: string;
    instructorImage?: string;
    instructorDesignation?: string;
    location?: string;
    topics?: string[];
    maxParticipants?: number;
    currentEnrollments?: number;
    curriculum?: CurriculumModule[];
    galleryImages?: string[];
    rating?: number;
    totalReviews?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    certificationTitle?: string;
    certificationDescription?: string;
    certificationImage?: string;
    faq?: TrainingFAQ[];
    testimonials?: TrainingTestimonial[];
    practicalExposure?: PracticalExposure;
    brochureUrl?: string;
    facilityVideoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const trainingApi = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; count: number; data: Training[] }>('/trainings');
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await api.get<{ success: boolean; data: Training }>(`/trainings/${slug}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<{ success: boolean; data: Training }>(`/trainings/id/${id}`);
        return response.data;
    },
};
