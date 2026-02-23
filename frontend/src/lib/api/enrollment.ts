import api from './config';

export interface EnrollmentSubmission {
    studentName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    trainingId: string;
    notes?: string;
}

export interface EnrollmentResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        studentName: string;
        trainingTitle: string;
        status: string;
    };
}

export const enrollmentApi = {
    submit: async (data: EnrollmentSubmission) => {
        const response = await api.post<EnrollmentResponse>('/enrollments', data);
        return response.data;
    },
};
