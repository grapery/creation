import { apiClient, request } from './client';
import { Character } from '../types/character';

export interface ChatSession {
    id: string;
    characterId: string;
    characterName: string;
    characterAvatar?: string;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    status: 'sending' | 'sent' | 'error';
}

export const chat = {
    // List active conversations
    listSessions: async (page = 1, limit = 20): Promise<ChatSession[]> => {
        // Mock or real endpoint
        return request(`/api/chat/sessions?limit=${limit}&offset=${(page - 1) * limit}`);
    },

    // Create or get session with character
    startSession: async (characterId: string): Promise<ChatSession> => {
        return request(`/api/chat/sessions`, 'POST', { characterId });
    },

    // Get messages for session
    getMessages: async (sessionId: string, before?: number, limit = 20): Promise<ChatMessage[]> => {
        let url = `/api/chat/sessions/${sessionId}/messages?limit=${limit}`;
        if (before) url += `&before=${before}`;
        return request(url);
    },

    // Send message
    sendMessage: async (sessionId: string, content: string): Promise<ChatMessage> => {
        return request(`/api/chat/sessions/${sessionId}/messages`, 'POST', { content });
    },

    // Real-time hook placeholder (WebSockets would go here)
};
