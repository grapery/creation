import { request, apiClient, AI_TIMEOUT } from './client';
import type {
    AIGenerateStoryRequest,
    AIEnhancePromptRequest,
    AIGenerateImageRequest,
    AIGenerateVideoRequest,
    AITask,
} from '../types';

export const ai = {
    generateStory: async (params: AIGenerateStoryRequest): Promise<AITask> =>
        request('/api/ai/generate-story', 'POST', params, apiClient, AI_TIMEOUT),

    enhancePrompt: async (params: AIEnhancePromptRequest): Promise<{ enhancedPrompt: string }> =>
        request('/api/ai/enhance-prompt', 'POST', params, apiClient, AI_TIMEOUT),

    generateImage: async (params: AIGenerateImageRequest): Promise<AITask> =>
        request('/api/ai/generate-image', 'POST', params, apiClient, AI_TIMEOUT),

    generateVideo: async (params: AIGenerateVideoRequest): Promise<AITask> =>
        request('/api/ai/generate-video', 'POST', params, apiClient, AI_TIMEOUT),

    generateCharacter: async (params: { prompt: string; style?: string }): Promise<AITask> =>
        request('/api/ai/generate-character', 'POST', params, apiClient, AI_TIMEOUT),

    getTask: async (taskId: string): Promise<AITask> =>
        request(`/api/ai/tasks/${taskId}`),

    getTaskResult: async (taskId: string): Promise<any> =>
        request(`/api/ai/tasks/${taskId}/result`),

    cancelTask: async (taskId: string): Promise<{ message: string }> =>
        request(`/api/ai/tasks/${taskId}`, 'DELETE'),
};
