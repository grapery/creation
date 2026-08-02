import { request } from './client';

export interface ChatSession {
    id: string;
    characterId?: string;
    peerUserId?: string;
    sessionType?: 'character' | 'direct' | string;
    characterName: string;
    characterAvatar?: string;
    title?: string;
    avatar?: string;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant' | 'peer';
    content: string;
    timestamp: number;
    status: 'sending' | 'sent' | 'error';
}

export const chat = {
    listSessions: async (page = 1, limit = 20): Promise<ChatSession[]> => {
        const offset = (page - 1) * limit;
        const res = await request<{ sessions?: ChatSession[] } | ChatSession[]>(
            `/api/v1/chat/sessions?limit=${limit}&offset=${offset}`
        );
        if (Array.isArray(res)) return res;
        return res?.sessions || [];
    },

    getSession: async (sessionId: string): Promise<ChatSession> => {
        return request(`/api/v1/chat/sessions/${sessionId}`);
    },

    /** Start or reuse a character roleplay session. */
    startSession: async (characterId: string): Promise<ChatSession> => {
        return request('/api/v1/chat/sessions', 'POST', { characterId });
    },

    /** Start or reuse a direct message session with another user. */
    startDirectSession: async (peerUserId: string): Promise<ChatSession> => {
        return request('/api/v1/chat/sessions', 'POST', { peerUserId });
    },

    getMessages: async (sessionId: string, before?: number, limit = 50): Promise<ChatMessage[]> => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (before) params.set('before', String(before));
        const res = await request<{ messages?: ChatMessage[] } | ChatMessage[]>(
            `/api/v1/chat/sessions/${sessionId}/messages?${params.toString()}`
        );
        if (Array.isArray(res)) return res;
        return res?.messages || [];
    },

    sendMessage: async (
        sessionId: string,
        content: string
    ): Promise<{ userMessage: ChatMessage; assistantMessage?: ChatMessage }> => {
        return request(`/api/v1/chat/sessions/${sessionId}/messages`, 'POST', { content });
    },
};
