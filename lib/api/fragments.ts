import { request, apiClient, AI_TIMEOUT } from './client';
import type {
    StoryFragment,
    FragmentListResponse,
    CreateFragmentRequest,
    UpdateFragmentRequest,
    FragmentStyle,
    FragmentStoryPrefillAIRequest,
    FragmentStoryPrefillAIResponse,
    ConvertFragmentRequest,
    ConvertFragmentResponse,
    GenerateFragmentTaskResponse,
    GenerateFragmentPanelsRequest,
    GenerateFragmentPanelsTaskResponse,
} from '@/lib/types';

export const fragments = {
    // List fragments (feed)
    list: async (params?: {
        tab?: 'discover' | 'following';
        limit?: number;
        offset?: number;
    }): Promise<FragmentListResponse> => {
        const { tab = 'discover', limit = 20, offset = 0 } = params || {};
        return request(`/api/v1/fragments?tab=${tab}&limit=${limit}&offset=${offset}`);
    },

    // List fragments by topic
    getByTopic: async (topic: string, limit = 20, offset = 0, convertedOnly?: boolean): Promise<FragmentListResponse> => {
        let url = `/api/v1/fragments?topic=${encodeURIComponent(topic)}&limit=${limit}&offset=${offset}`;
        if (convertedOnly !== undefined) url += `&converted=${convertedOnly ? '1' : '0'}`;
        return request(url);
    },

    // Get fragment by ID
    get: async (id: string): Promise<StoryFragment> => {
        return request(`/api/v1/fragments/${id}`);
    },

    // Create fragment
    create: async (data: CreateFragmentRequest): Promise<StoryFragment> => {
        return request('/api/v1/fragments', 'POST', data);
    },

    // Update fragment
    update: async (id: string, data: UpdateFragmentRequest): Promise<StoryFragment> => {
        return request(`/api/v1/fragments/${id}`, 'PUT', data);
    },

    // Delete fragment
    delete: async (id: string): Promise<void> => {
        return request(`/api/v1/fragments/${id}`, 'DELETE');
    },

    // Get fragment stats
    getStats: async (id: string): Promise<{ likes: number; comments: number; shares: number; isLiked: boolean }> => {
        return request(`/api/v1/fragments/${id}/stats`);
    },

    // AI text-only fragment generation (async task)
    generate: async (data: {
        content: string;
        style?: string;
        visibility?: string;
        topic?: string;
    }): Promise<{ taskId: string }> => {
        return request('/api/v1/fragments/generate', 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Poll text generation task status
    getGenerateStatus: async (taskId: string): Promise<GenerateFragmentTaskResponse> => {
        return request(`/api/v1/fragments/generate/${taskId}`);
    },

    // AI panel generation from reference image (async task)
    generatePanels: async (data: GenerateFragmentPanelsRequest): Promise<{ taskId: string }> => {
        return request('/api/v1/fragment-panels/generate', 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Poll panel generation task status
    getPanelGenerateStatus: async (taskId: string): Promise<GenerateFragmentPanelsTaskResponse> => {
        return request(`/api/v1/fragment-panels/generate/${taskId}`);
    },

    // Resume failed panel generation
    resumePanelGenerate: async (taskId: string): Promise<GenerateFragmentPanelsTaskResponse> => {
        return request(`/api/v1/fragment-panels/generate/${taskId}/resume`, 'POST');
    },

    // Like fragment
    like: async (id: string): Promise<void> => {
        return request(`/api/v1/fragments/${id}/like`, 'POST');
    },

    // Unlike fragment
    unlike: async (id: string): Promise<void> => {
        return request(`/api/v1/fragments/${id}/like`, 'DELETE');
    },

    // Record share
    share: async (id: string): Promise<{ shareUrl: string }> => {
        return request(`/api/v1/fragments/${id}/share`, 'POST', { platform: 'local' });
    },

    // Get fragment comments
    getComments: async (id: string, limit = 20, offset = 0): Promise<{ comments: any[]; total: number }> => {
        return request(`/api/v1/fragments/${id}/comments?limit=${limit}&offset=${offset}`);
    },

    // Add comment
    addComment: async (fragmentId: string, content: string, parentId?: string): Promise<any> => {
        return request(`/api/v1/fragments/${fragmentId}/comments`, 'POST', { content, parentId });
    },

    // Get user's fragments
    getByUser: async (userId: string, limit = 20, offset = 0, draftsOnly?: boolean): Promise<FragmentListResponse> => {
        let url = `/api/v1/users/${userId}/fragments?limit=${limit}&offset=${offset}`;
        if (draftsOnly) url += '&drafts_only=1';
        return request(url);
    },

    // AI prefill for story creation from fragment
    storyPrefillAI: async (fragmentId: string, data?: FragmentStoryPrefillAIRequest): Promise<FragmentStoryPrefillAIResponse> => {
        return request(`/api/v1/fragments/${fragmentId}/story-prefill-ai`, 'POST', data || {}, apiClient, AI_TIMEOUT);
    },

    // Convert fragment to story
    convertToStory: async (fragmentId: string, data: ConvertFragmentRequest): Promise<ConvertFragmentResponse> => {
        return request(`/api/v1/fragments/${fragmentId}/convert-to-story`, 'POST', data);
    },

    // Get comic styles (paginated batch) — uses POST per voyager
    getStyles: async (cursor?: string): Promise<{ styles: FragmentStyle[]; nextCursor?: string }> => {
        const body = cursor ? { cursor } : {};
        return request('/api/v1/fragments/styles/next', 'POST', body, apiClient, AI_TIMEOUT);
    },

    // Search fragments - Uses unified search endpoint with type filter
    search: async (query: string, limit = 20, offset = 0): Promise<FragmentListResponse> => {
        return request(`/api/search?type=fragment&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    },

    // Get fragment likes list
    getLikes: async (id: string, page = 1, limit = 20): Promise<{ likes: any[]; total: number; page?: number; limit?: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/v1/fragments/${id}/likes?limit=${limit}&offset=${offset}`);
    },

    // Update fragment comment
    updateComment: async (commentId: string, content: string): Promise<any> =>
        request(`/api/v1/fragments/comments/${commentId}`, 'PUT', { content }),

    // Delete fragment comment
    deleteComment: async (commentId: string): Promise<{ message: string }> =>
        request(`/api/v1/fragments/comments/${commentId}`, 'DELETE'),

    // Get comment replies
    getCommentReplies: async (commentId: string, limit = 20, offset = 0): Promise<{ comments: any[]; total: number }> =>
        request(`/api/v1/fragments/comments/${commentId}/replies?limit=${limit}&offset=${offset}`),

    // List generation tasks
    listGenerationTasks: async (limit = 20, offset = 0): Promise<{ tasks: GenerateFragmentTaskResponse[]; total: number }> =>
        request(`/api/v1/fragments/generate?limit=${limit}&offset=${offset}`),

    // Cancel generation task
    cancelGeneration: async (taskId: string): Promise<{ message: string }> =>
        request(`/api/v1/fragments/generate/${taskId}`, 'DELETE'),

    // Get fragment generation assets
    getGenerationAssets: async (id: string, params?: {
        type?: string;
    }): Promise<{ assets: any[] }> => {
        const query = params?.type ? `?type=${params.type}` : '';
        return request(`/api/v1/fragments/${id}/assets${query}`);
    },
};
