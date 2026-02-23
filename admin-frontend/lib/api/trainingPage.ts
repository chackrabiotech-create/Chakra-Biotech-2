import { apiRequest } from './config';

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

const BASE_ENDPOINT = '/admin/training-page';

export const trainingPageApi = {
  get: async (): Promise<{ success: boolean; data: TrainingPageSettings }> => {
    return apiRequest(BASE_ENDPOINT);
  },

  update: async (data: Partial<TrainingPageSettings>): Promise<{ success: boolean; data: TrainingPageSettings; message: string }> => {
    return apiRequest(BASE_ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
