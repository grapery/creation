import { create } from 'zustand';
import { agentChatApi } from '../lib/api';

export interface AgentChatThread {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  storyTitle?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  messageCount: number;
  interactionFrequency: number;
  selectedStoryboardId?: string;
  totalTokensUsed?: number;
  isArchived?: boolean;
  summary?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface AgentChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  image?: string;
  timestamp: number;
  isUser: boolean;
  reactions?: any[];
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    model?: string;
  };
}

interface ChatState {
  threads: AgentChatThread[];
  currentThread: AgentChatThread | null;
  messages: AgentChatMessage[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  
  // Actions
  fetchThreads: () => Promise<void>;
  fetchThread: (id: string) => Promise<void>;
  createThread: (characterId: string) => Promise<AgentChatThread>;
  fetchMessages: (threadId: string, limit?: number, offset?: number) => Promise<void>;
  sendMessage: (data: {
    characterId: string;
    content: string;
    threadId?: string;
    image?: string;
    storyboardBranchId?: string;
  }) => Promise<void>;
  archiveThread: (threadId: string) => Promise<void>;
  clearError: () => void;
  setCurrentThread: (thread: AgentChatThread | null) => void;
  addMessage: (message: AgentChatMessage) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],
  currentThread: null,
  messages: [],
  isLoading: false,
  error: null,
  unreadCount: 0,

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await agentChatApi.listChatThreads();
      const data = response.data;
      const threads = data.threads || data.data?.threads || data.data || [];
      
      // Calculate total unread count
      const unreadCount = threads.reduce((sum: number, t: AgentChatThread) => sum + (t.unreadCount || 0), 0);
      
      set({
        threads,
        unreadCount,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch threads',
      });
    }
  },

  fetchThread: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const threads = get().threads;
      const thread = threads.find((t) => t.id === id);
      
      if (thread) {
        set({ currentThread: thread, isLoading: false });
      } else {
        // If thread not in list, fetch it
        await get().fetchThreads();
        const updatedThreads = get().threads;
        const foundThread = updatedThreads.find((t) => t.id === id);
        set({ currentThread: foundThread || null, isLoading: false });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch thread',
      });
    }
  },

  createThread: async (characterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await agentChatApi.createChatThread({ characterId });
      // API returns thread directly or wrapped in data.thread
      const threadData = response.data.thread || response.data.data || response.data;
      
      // Transform to AgentChatThread format
      const thread: AgentChatThread = {
        id: threadData.id,
        characterId: threadData.characterId,
        characterName: threadData.characterName || '',
        characterAvatar: threadData.characterAvatar || '',
        storyTitle: threadData.storyTitle,
        lastMessage: threadData.lastMessage || '',
        lastMessageTime: threadData.lastMessageTime || Date.now(),
        unreadCount: threadData.unreadCount || 0,
        messageCount: threadData.messageCount || 0,
        interactionFrequency: threadData.interactionFrequency || 0,
        selectedStoryboardId: threadData.selectedStoryboardId,
        totalTokensUsed: threadData.totalTokensUsed || 0,
        isArchived: threadData.isArchived || false,
        summary: threadData.summary,
        createdAt: threadData.createdAt || Date.now(),
        updatedAt: threadData.updatedAt,
      };
      
      set((state) => ({
        threads: [thread, ...state.threads],
        currentThread: thread,
        isLoading: false,
        error: null,
      }));
      
      return thread;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to create thread',
      });
      throw error;
    }
  },

  fetchMessages: async (threadId: string, limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await agentChatApi.getChatHistory(threadId, limit, offset);
      const data = response.data;
      const messages = data.messages || data.data?.messages || data.data || [];
      
      set({
        messages: offset === 0 ? messages : [...get().messages, ...messages],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch messages',
      });
    }
  },

  sendMessage: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await agentChatApi.sendMessage(data);
      const result = response.data;
      
      // Add user message and agent reply to messages
      if (result.userMessage) {
        set((state) => ({
          messages: [...state.messages, result.userMessage],
        }));
      }
      
      if (result.agentReply) {
        set((state) => ({
          messages: [...state.messages, result.agentReply!],
        }));
      }
      
      // Update thread if threadId is returned
      if (result.threadId) {
        await get().fetchThreads();
      }
      
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to send message',
      });
      throw error;
    }
  },

  archiveThread: async (threadId: string) => {
    set({ isLoading: true, error: null });
    try {
      await agentChatApi.archiveThread(threadId);
      
      set((state) => ({
        threads: state.threads.filter((t) => t.id !== threadId),
        currentThread: state.currentThread?.id === threadId ? null : state.currentThread,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to archive thread',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentThread: (thread: AgentChatThread | null) => {
    set({ currentThread: thread, messages: [] });
  },

  addMessage: (message: AgentChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));

