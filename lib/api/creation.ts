import { request, apiClient, AI_TIMEOUT } from './client';
import type {
    StoryboardContentGeneration,
    StoryboardImageGeneration,
    StoryboardVideoGeneration,
    StoryboardGenerationProgress,
    BatchImageResponse,
    ContinueStoryboardRequest,
    ContinueStoryboardResponse,
    ForkStoryboardRequest,
    Storyboard,
    StoryboardStructureGenerationResponse,
} from '@/lib/types';

export const creation = {
    // Regenerate storyboard structure (bible + scene plan) when scenes are empty
    generateStructure: async (storyboardId: string): Promise<StoryboardStructureGenerationResponse> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/structure`, 'POST', {}, apiClient, AI_TIMEOUT);
    },

    // Step 1: Generate AI narrative content
    generateContent: async (
        storyboardId: string,
        data: { rawInput: string; characterIds?: string[]; sceneIds?: string[]; style?: string }
    ): Promise<StoryboardContentGeneration> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/content`, 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Step 2: Generate detailed scene descriptions
    generateSceneDetails: async (
        storyboardId: string,
        data: { sceneId: string; sceneTitle?: string; sceneLocation?: string; inputDescription: string }
    ): Promise<unknown> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/scene-details`, 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Step 3: Generate image for a single scene
    generateImage: async (
        storyboardId: string,
        data: {
            sceneId: string;
            sceneTitle?: string;
            sceneDescription: string;
            referenceImages?: string[];
            sceneCharacters?: string[];
            characterReferenceImages?: string[];
            storyStyleId?: string;
        }
    ): Promise<StoryboardImageGeneration> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/image`, 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Step 3 Batch: Generate images for all scenes
    generateAllImages: async (
        storyboardId: string,
        data?: { regenerateAll?: boolean; storyStyleId?: string }
    ): Promise<BatchImageResponse> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/images`, 'POST', data || {}, apiClient, AI_TIMEOUT);
    },

    // Step 4: Generate video for a scene
    generateVideo: async (
        storyboardId: string,
        data: {
            sceneId: string;
            sceneTitle?: string;
            inputDescription: string;
            referenceImageUrl?: string;
            endFrameUrl?: string;
        }
    ): Promise<StoryboardVideoGeneration> => {
        return request(`/api/v1/storyboards/${storyboardId}/generate/video`, 'POST', data, apiClient, AI_TIMEOUT);
    },

    // Get aggregated generation progress
    getGenerationProgress: async (storyboardId: string): Promise<StoryboardGenerationProgress> => {
        return request(`/api/v1/storyboards/${storyboardId}/generation-progress`);
    },

    // Retry all failed image generations
    retryFailedImages: async (storyboardId: string): Promise<{ storyboardId: string; retriedCount: number; remainingFailed: number }> => {
        return request(`/api/v1/storyboards/${storyboardId}/retry-failed-images`, 'POST');
    },

    // Cancel all pending/processing generation tasks
    cancelGeneration: async (storyboardId: string): Promise<{ storyboardId: string; cancelledCount: number }> => {
        return request(`/api/v1/storyboards/${storyboardId}/cancel-generation`, 'POST');
    },

    // Publish storyboard
    publish: async (storyboardId: string): Promise<Storyboard> => {
        return request(`/api/v1/storyboards/${storyboardId}/publish`, 'POST');
    },

    // Parallel universe continuation
    continueStoryboard: async (storyboardId: string, data: ContinueStoryboardRequest): Promise<ContinueStoryboardResponse> => {
        return request(`/api/v1/storyboards/${storyboardId}/continue`, 'POST', data);
    },

    // Fork (branch) a storyboard
    forkStoryboard: async (storyboardId: string, data: ForkStoryboardRequest): Promise<Storyboard> => {
        return request(`/api/v1/storyboards/${storyboardId}/fork`, 'POST', data);
    },
};
