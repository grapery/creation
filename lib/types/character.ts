import { User } from '../types';

export interface Character {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    background?: string;
    creatorId: string;
    isPublic: boolean;
    likes?: number;
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
