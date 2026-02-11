import { request } from './client';
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

// Note: Chat functionality is not implemented in the backend yet.
// These endpoints are placeholders and will return mock data.
export const chat = {
    // List active conversations
    listSessions: async (page = 1, limit = 20): Promise<ChatSession[]> => {
        // Return empty array as backend doesn't have this endpoint
        console.warn('Chat sessions not implemented in backend');
        return [];
    },

    // Create or get session with character
    startSession: async (characterId: string): Promise<ChatSession> => {
        console.warn('Chat start session not implemented in backend');
        throw new Error('Chat not implemented');
    },

    // Get messages for session
    getMessages: async (sessionId: string, before?: number, limit = 20): Promise<ChatMessage[]> => {
        console.warn('Chat get messages not implemented in backend');
        return [];
    },

    // Send message
    sendMessage: async (sessionId: string, content: string): Promise<ChatMessage> => {
        console.warn('Chat send message not implemented in backend');
        throw new Error('Chat not implemented');
    },
};
