import { request } from './client';
import type { SearchResults, SearchType, SearchFilters, StoryFragment } from '../types';

function matchesFragmentQuery(fragment: StoryFragment, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
        fragment.content,
        fragment.caption,
        fragment.topic,
        ...(fragment.tags || []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return haystack.includes(q);
}

async function searchFragmentsViaList(
    query: string,
    page = 1,
    limit = 20
): Promise<SearchResults> {
    const offset = (page - 1) * limit;
    const fetchLimit = Math.min(Math.max(limit * 3, 60), 100);

    const res = await request<{ fragments?: StoryFragment[]; total?: number }>(
        `/api/v1/fragments?tab=discover&public_feed=1&limit=${fetchLimit}&offset=${offset}`
    );

    const all = res.fragments || [];
    const filtered = all.filter((f) => matchesFragmentQuery(f, query));
    const fragments = filtered.slice(0, limit);

    return {
        fragments,
        total: filtered.length,
        query,
    };
}

export const search = {
    search: async (params: {
        query: string;
        type?: SearchType;
        page?: number;
        limit?: number;
        filters?: SearchFilters;
    }): Promise<SearchResults> => {
        const { query, type = 'all', page = 1, limit = 20, filters } = params;

        if (type === 'fragment') {
            return searchFragmentsViaList(query, page, limit);
        }

        const offset = (page - 1) * limit;
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);
        queryParams.append('type', type);
        queryParams.append('limit', limit.toString());
        queryParams.append('offset', offset.toString());
        if (filters?.genre) queryParams.append('genre', filters.genre);
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.sortBy) queryParams.append('sort_by', filters.sortBy);
        return request(`/api/v1/search?${queryParams.toString()}`);
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
        searchFragmentsViaList(query, page, limit),
};
