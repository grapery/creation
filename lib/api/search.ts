import { request } from './client';
import type { SearchResults, SearchType, SearchFilters } from '../types';

export const search = {
    search: async (params: {
        query: string;
        type?: SearchType;
        page?: number;
        limit?: number;
        filters?: SearchFilters;
    }): Promise<SearchResults> => {
        const { query, type = 'all', page = 1, limit = 20, filters } = params;
        const offset = (page - 1) * limit;
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);
        queryParams.append('type', type);
        queryParams.append('limit', limit.toString());
        queryParams.append('offset', offset.toString());
        if (filters?.genre) queryParams.append('genre', filters.genre);
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.sortBy) queryParams.append('sort_by', filters.sortBy);
        return request(`/api/search?${queryParams.toString()}`);
    },

    searchStories: async (query: string, page = 1, limit = 20): Promise<SearchResults> =>
        search.search({ query, type: 'story', page, limit }),

    searchCharacters: async (query: string, page = 1, limit = 20): Promise<SearchResults> =>
        search.search({ query, type: 'character', page, limit }),

    searchUsers: async (query: string, page = 1, limit = 20): Promise<SearchResults> =>
        search.search({ query, type: 'user', page, limit }),

    searchStoryboards: async (query: string, page = 1, limit = 20): Promise<SearchResults> =>
        search.search({ query, type: 'storyboard', page, limit }),

    searchFragments: async (query: string, page = 1, limit = 20): Promise<SearchResults> =>
        search.search({ query, type: 'fragment', page, limit }),
};
