import { apiRequest, API_BASE_URL, getToken } from './config';

export interface Enrollment {
    _id: string;
    studentName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    trainingId: {
        _id: string;
        title: string;
        slug: string;
    } | string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    source: 'whatsapp' | 'social_media' | 'website' | 'manual' | 'phone' | 'referral';
    notes?: string;
    adminNotes?: string;
    enrolledBy?: {
        _id: string;
        name: string;
        email: string;
    };
    approvedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EnrollmentStats {
    total: number;
    pending: number;
    approved: number;
    completed: number;
}

export interface CreateEnrollmentData {
    studentName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    trainingId: string;
    source: string;
    notes?: string;
}

export interface Student {
    _id: string;
    studentName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    totalEnrollments: number;
    approved: number;
    completed: number;
    lastEnrolled: string;
    enrollments: {
        _id: string;
        trainingId: { _id: string; title: string; slug: string } | null;
        status: string;
        source: string;
        createdAt: string;
    }[];
}

const BASE_ENDPOINT = '/admin/enrollments';

export const enrollmentApi = {
    getAll: async (params?: {
        status?: string;
        trainingId?: string;
        source?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) => {
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

    create: async (data: CreateEnrollmentData) => {
        return apiRequest(BASE_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<CreateEnrollmentData & { adminNotes: string }>) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    approve: async (id: string, adminNotes?: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    },

    reject: async (id: string, adminNotes?: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    },

    complete: async (id: string, adminNotes?: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}/complete`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    },

    downloadCSV: async (params?: {
        status?: string;
        trainingId?: string;
        source?: string;
        search?: string;
    }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        }
        const query = searchParams.toString();
        const token = getToken();
        const response = await fetch(
            `${API_BASE_URL}${BASE_ENDPOINT}/download${query ? `?${query}` : ''}`,
            {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );
        if (!response.ok) throw new Error('Failed to download CSV');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enrollments-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    getAllStudents: async (params?: { search?: string; page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        }
        const query = searchParams.toString();
        return apiRequest(`${BASE_ENDPOINT}/students${query ? `?${query}` : ''}`);
    },
};
