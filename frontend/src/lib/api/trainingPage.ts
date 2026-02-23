import api from './config';

export interface TrainingPageStat {
    value: string;
    label: string;
}

export interface TrainingPageBenefit {
    title: string;
    description: string;
    icon: string;
}

export interface TrainingPageHighlight {
    title: string;
    description: string;
    icon: string;
}

export interface TrainingPageModule {
    title: string;
    description: string;
    icon: string;
    topics: string[];
}

export interface TrainingPageTestimonial {
    name: string;
    role: string;
    rating: number;
    text: string;
}

export interface TrainingPageImpactStat {
    value: string;
    label: string;
    icon: string;
}

export interface TrainingPageSection {
    title: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    order: number;
    isVisible: boolean;
    template: string;
}

export interface TrainingPageSettings {
    _id?: string;
    hero: {
        title: string;
        subtitle: string;
        badge: string;
        backgroundImage: string;
        stats: TrainingPageStat[];
    };
    featuredCourse: {
        isVisible: boolean;
        badge: string;
        title: string;
        subtitle: string;
        gains: string[];
        benefits: TrainingPageBenefit[];
    };
    standout: {
        isVisible: boolean;
        title: string;
        description: string;
        additionalText: string;
        highlights: TrainingPageHighlight[];
    };
    modules: TrainingPageModule[];
    testimonials: TrainingPageTestimonial[];
    impactStats: TrainingPageImpactStat[];
    cta: {
        isVisible: boolean;
        title: string;
        description: string;
        buttonText: string;
    };
    sections: TrainingPageSection[];
    selectedTemplate: string;
}

export const trainingPageApi = {
    get: async () => {
        const response = await api.get<{ success: boolean; data: TrainingPageSettings | null }>('/training-page');
        return response.data;
    },
};
