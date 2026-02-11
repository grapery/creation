import { request } from './client';

export interface GenerationRequest {
    storyId?: string; // If continuing
    prompt?: string;
    style?: string;
    characters?: string[];
    settings?: any;
}

export interface GenerationResponse {
    id: string; // Job ID or Result ID
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    status: 'pending' | 'completed' | 'failed';
}

export const creation = {
    // Note: These endpoints match the backend storyboard generation routes
    // POST /api/storyboards/:id/generate/content - Generate content
    // POST /api/storyboards/:id/generate/images - Generate images
    // POST /api/storyboards/:id/generate/video - Generate video
    // POST /api/storyboards/:id/publish - Publish
    // GET /api/storyboards/:id/generation-progress - Get progress

    // 2. Generate Story Content (Text)
    generateContent: async (storyboardId: string, data: GenerationRequest): Promise<GenerationResponse> => {
        return request(`/api/storyboards/${storyboardId}/generate/content`, 'POST', data);
    },

    // 3. Generate Image Prompts & Images
    generateImages: async (storyboardId: string, prompts?: string[]): Promise<GenerationResponse> => {
        return request(`/api/storyboards/${storyboardId}/generate/images`, 'POST', { prompts });
    },

    // 4. Generate Video
    generateVideo: async (storyboardId: string, imageId?: string): Promise<GenerationResponse> => {
        return request(`/api/storyboards/${storyboardId}/generate/video`, 'POST', { imageId });
    },

    // 5. Publish
    publish: async (storyboardId: string): Promise<void> => {
        return request(`/api/storyboards/${storyboardId}/publish`, 'POST');
    },

    // Polling status
    getStatus: async (storyboardId: string): Promise<GenerationResponse> => {
        return request(`/api/storyboards/${storyboardId}/generation-progress`);
    }
};
