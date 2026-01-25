import { User } from '../types';

export interface Character {
    id: string;
    storyId?: string;
    name: string;
    description: string;
    avatar?: string;
    portrait?: string;
    background?: string;
    personality?: string | string[];
    shortTermGoal?: string;
    longTermGoal?: string;
    handlingStyle?: string;
    cognitionRange?: string;
    abilityFeatures?: string;
    appearance?: string;
    dressPreference?: string;
    creatorId: string;
    author?: User;
    isPublic: boolean;
    likes?: number;
    followers?: number;
    stories?: number;
    isFollowing?: boolean;
    chatCount?: number;
    tags?: string[];
    creator?: User;
    createdAt?: number;
    systemPrompt?: string; // Private usually, but might be editable by owner
    gallery?: string[];
}

export interface CharacterMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}
