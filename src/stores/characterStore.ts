import { create } from 'zustand';
import { characterApi } from '../lib/api';

export interface Character {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes: number;
  followers: number;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CharacterState {
  characters: Character[];
  currentCharacter: Character | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  
  // Actions
  fetchCharacters: (page?: number, limit?: number) => Promise<void>;
  fetchCharacter: (id: string) => Promise<void>;
  createCharacter: (data: Partial<Character>) => Promise<Character>;
  updateCharacter: (id: string, data: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  followCharacter: (id: string) => Promise<void>;
  unfollowCharacter: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  currentCharacter: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchCharacters: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await characterApi.listCharacters(page, limit);
      const data = response.data;
      const characters = data.characters || data.data?.characters || data.data || [];
      const total = data.total || data.count || characters.length;
      
      set({
        characters: page === 1 ? characters : [...get().characters, ...characters],
        total,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch characters',
      });
    }
  },

  fetchCharacter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await characterApi.getCharacter(id);
      const character = response.data.character || response.data;
      
      set({
        currentCharacter: character,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch character',
      });
    }
  },

  createCharacter: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await characterApi.createCharacter(data);
      const character = response.data.character || response.data;
      
      set((state) => ({
        characters: [character, ...state.characters],
        currentCharacter: character,
        isLoading: false,
        error: null,
      }));
      
      return character;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to create character',
      });
      throw error;
    }
  },

  updateCharacter: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await characterApi.updateCharacter(id, data);
      const updatedCharacter = response.data.character || response.data;
      
      set((state) => ({
        characters: state.characters.map((c) => (c.id === id ? updatedCharacter : c)),
        currentCharacter: state.currentCharacter?.id === id ? updatedCharacter : state.currentCharacter,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to update character',
      });
      throw error;
    }
  },

  deleteCharacter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await characterApi.deleteCharacter(id);
      
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        currentCharacter: state.currentCharacter?.id === id ? null : state.currentCharacter,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to delete character',
      });
      throw error;
    }
  },

  followCharacter: async (id: string) => {
    try {
      await characterApi.followCharacter(id);
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? { ...c, followers: c.followers + 1 } : c
        ),
        currentCharacter:
          state.currentCharacter?.id === id
            ? { ...state.currentCharacter, followers: state.currentCharacter.followers + 1 }
            : state.currentCharacter,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to follow character',
      });
    }
  },

  unfollowCharacter: async (id: string) => {
    try {
      await characterApi.unfollowCharacter(id);
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? { ...c, followers: Math.max(0, c.followers - 1) } : c
        ),
        currentCharacter:
          state.currentCharacter?.id === id
            ? { ...state.currentCharacter, followers: Math.max(0, state.currentCharacter.followers - 1) }
            : state.currentCharacter,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unfollow character',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

