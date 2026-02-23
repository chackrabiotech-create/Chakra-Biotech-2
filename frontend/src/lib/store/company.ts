import { create } from 'zustand';
import { CompanyDetails, companyApi } from '@/lib/api';

interface CompanyState {
    companyDetails: CompanyDetails | null;
    loading: boolean;
    error: string | null;
    fetchCompanyDetails: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
    companyDetails: null,
    loading: false,
    error: null,

    fetchCompanyDetails: async () => {
        set({ loading: true, error: null });
        try {
            const response = await companyApi.get();
            set({ companyDetails: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
