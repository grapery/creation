import { request } from './client';
import type { Feedback, FeedbackCategory } from '../types';

export const feedback = {
    submit: async (params: {
        category: FeedbackCategory;
        content: string;
        contactInfo?: string;
    }): Promise<Feedback> =>
        request('/api/feedback', 'POST', params),

    listMyFeedback: async (page = 1, limit = 20): Promise<{ feedbacks: Feedback[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/feedback?limit=${limit}&offset=${offset}`);
    },
};
