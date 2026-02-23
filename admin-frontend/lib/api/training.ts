import { apiRequest } from './config';

// Types
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
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    category?: 'Saffron Cultivation' | 'Advanced Techniques' | 'Business & Marketing' | 'R&D' | 'Custom';
    mode?: 'Offline' | 'Online' | 'Hybrid';
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
    createdAt: string;
    updatedAt?: string;
    maxParticipants?: number;
    currentEnrollments?: number;
    startDate?: string;
    endDate?: string;
    instructor?: string;
    instructorBio?: string;
    instructorImage?: string;
    instructorDesignation?: string;
    location?: string;
    topics?: string[];
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
}

export interface CreateTrainingData {
    title: string;
    description: string;
    content: string;
    level?: string;
    duration: string;
    price: number;
    originalPrice?: number;
    discountType?: string;
    discountValue?: number;
    features?: string[];
    coverImage?: string;
    icon?: string;
    popular?: boolean;
    isActive?: boolean;
    isPublished?: boolean;
    maxParticipants?: number;
    startDate?: string;
    endDate?: string;
    instructor?: string;
    instructorBio?: string;
    instructorImage?: string;
    instructorDesignation?: string;
    location?: string;
    topics?: string[];
    aboutProgram?: string;
    category?: string;
    mode?: string;
    language?: string;
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
}

export interface UpdateTrainingData extends Partial<CreateTrainingData> { }

export interface TrainingStats {
    totalTrainings: number;
    activeTrainings: number;
    totalEnrollments: number;
    pendingEnrollments: number;
}

const BASE_ENDPOINT = '/admin/trainings';

export const trainingApi = {
    getAll: async (params?: { category?: string; mode?: string; level?: string; isPublished?: string; search?: string; page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        }
        const query = searchParams.toString();
        return apiRequest(`${BASE_ENDPOINT}${query ? `?${query}` : ''}`);
    },

    getOne: async (id: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}`);
    },

    getStats: async (): Promise<{ success: boolean; data: TrainingStats }> => {
        return apiRequest(`${BASE_ENDPOINT}/stats`);
    },

    create: async (data: CreateTrainingData) => {
        return apiRequest(BASE_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: UpdateTrainingData) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    },
};
