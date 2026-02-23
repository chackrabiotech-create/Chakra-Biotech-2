import { create } from 'zustand';
import { HeroSection, heroApi } from '@/lib/api';

interface HeroState {
    heroSections: HeroSection[];
    loading: boolean;
    error: string | null;
    fetchHeroSections: () => Promise<void>;
}

export const useHeroStore = create<HeroState>((set) => ({
    heroSections: [],
    loading: false,
    error: null,

    fetchHeroSections: async () => {
        set({ loading: true, error: null });
        try {
            const response = await heroApi.getAll();
            set({ heroSections: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
