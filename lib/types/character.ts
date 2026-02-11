import { User } from '../types';

export interface Character {
    id: string;
    storyId?: string;
    name: string;
    description: string;
    avatar?: string;
    poster?: string;  // AI generated poster image
    portrait?: string;  // Full character portrait image (AI generated)
    needsPortrait?: boolean;  // Whether portrait generation is needed
    referenceImage?: string;  // Reference image URL
    portraitGenerationStatus?: 'none' | 'pending' | 'generating' | 'generated' | 'failed';
    background?: string;
    personality?: string | string[];
    shortTermGoal?: string;
    longTermGoal?: string;
    handlingStyle?: string;
    cognitionRange?: string;
    abilityFeatures?: string;
    appearance?: string;
    dressPreference?: string;
    traits?: string[];  // Character traits array
    skills?: string[];  // Character skills array
    creatorId: string;
    createdBy?: string;  // Alias for creatorId (backend field)
    lastEditedBy?: string;
    author?: User;
    creator?: User;
    isPublic: boolean;
    sourceType?: 'manual' | 'ai' | 'upload';
    sourcePrompt?: string;
    sourceImage?: string;
    likes?: number;
    followers?: number;
    stories?: number;
    isFollowing?: boolean;
    chatCount?: number;
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
    systemPrompt?: string; // Private usually, but might be editable by owner
    gallery?: string[];
    posterCreationPermission?: 'creator_only' | 'anyone';  // Who can create posters
}

export interface CharacterMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}
