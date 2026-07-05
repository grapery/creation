import { request } from './client';
import type {
    Bookmark,
    BookmarkType,
    PagedBookmarks,
    InteractionTargetType,
    BatchCheckResult,
    FollowCount,
    LikeCount,
    BookmarkCount,
} from '../types';

// ============================================================
// Follows — Unified follow system
// Backend: POST/DELETE /api/v1/follows, GET /api/v1/follows/*
// ============================================================

export const follows = {
    follow: async (type: InteractionTargetType, id: string) =>
        request('/api/follows', 'POST', {
            followableType: type,
            followableId: id,
        }),

    unfollow: async (type: InteractionTargetType, id: string) =>
        request('/api/follows', 'DELETE', {
            followableType: type,
            followableId: id,
        }),

    checkStatus: async (type: InteractionTargetType, id: string): Promise<{ isFollowing: boolean }> =>
        request(`/api/follows/check?type=${type}&id=${id}`),

    batchCheck: async (type: InteractionTargetType, ids: string[]): Promise<BatchCheckResult> => {
        if (ids.length === 0) return {};
        return request('/api/follows/batch-check', 'POST', {
            followableType: type,
            followableIds: ids,
        });
    },

    getFollowers: async (type: InteractionTargetType, id: string, page = 1, limit = 20) =>
        request(`/api/follows/followers/${type}/${id}?page=${page}&pageSize=${limit}`),

    getFollowing: async (userId: string, page = 1, limit = 20) =>
        request(`/api/follows/following/${userId}?page=${page}&pageSize=${limit}`),

    getCount: async (type: InteractionTargetType, id: string): Promise<FollowCount> =>
        request(`/api/follows/count/${type}/${id}`),
};

// ============================================================
// Likes — Unified like system
// Backend: POST/DELETE /api/v1/likes, GET /api/v1/likes/*
// ============================================================

export const likes = {
    like: async (type: InteractionTargetType, id: string) =>
        request('/api/likes', 'POST', {
            likeableType: type,
            likeableId: id,
        }),

    unlike: async (type: InteractionTargetType, id: string) =>
        request('/api/likes', 'DELETE', {
            likeableType: type,
            likeableId: id,
        }),

    checkStatus: async (type: InteractionTargetType, id: string): Promise<{ isLiked: boolean }> =>
        request(`/api/likes/check?type=${type}&id=${id}`),

    batchCheck: async (type: InteractionTargetType, ids: string[]): Promise<BatchCheckResult> => {
        if (ids.length === 0) return {};
        return request('/api/likes/batch-check', 'POST', {
            likeableType: type,
            likeableIds: ids,
        });
    },

    getLikes: async (type: InteractionTargetType, id: string, page = 1, limit = 20) => {
        const offset = (page - 1) * limit;
        return request(`/api/likes/${type}/${id}?limit=${limit}&offset=${offset}`);
    },

    getCount: async (type: InteractionTargetType, id: string): Promise<LikeCount> =>
        request(`/api/likes/count/${type}/${id}`),
};

// ============================================================
// Bookmarks — Unified bookmark system (NEW)
// Backend: POST/DELETE/GET /api/v1/bookmarks/*
// ============================================================

export const bookmarks = {
    create: async (type: BookmarkType, id: string, collectionName?: string): Promise<Bookmark> =>
        request('/api/bookmarks', 'POST', {
            bookmarkType: type,
            bookmarkId: id,
            collectionName,
        }),

    delete: async (bookmarkId: string): Promise<{ message: string }> =>
        request(`/api/bookmarks/${bookmarkId}`, 'DELETE'),

    checkStatus: async (type: BookmarkType, id: string): Promise<{ isBookmarked: boolean; bookmarkId?: string }> =>
        request(`/api/bookmarks/check?bookmarkType=${encodeURIComponent(type)}&bookmarkId=${encodeURIComponent(id)}`),

    getMyBookmarks: async (params: {
        type?: BookmarkType;
        page?: number;
        limit?: number;
        collectionName?: string;
    } = {}): Promise<PagedBookmarks> => {
        const { type, page = 1, limit = 20, collectionName } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (type) queryParams.append('type', type);
        if (collectionName) queryParams.append('collection', collectionName);
        return request(`/api/bookmarks/my?${queryParams.toString()}`);
    },

    getUserBookmarks: async (userId: string, params: {
        type?: BookmarkType;
        page?: number;
        limit?: number;
    } = {}): Promise<PagedBookmarks> => {
        const { type, page = 1, limit = 20 } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (type) queryParams.append('type', type);
        return request(`/api/bookmarks/users/${userId}?${queryParams.toString()}`);
    },

    getCount: async (type: BookmarkType, id: string): Promise<BookmarkCount> =>
        request(`/api/bookmarks/count/${type}/${id}`),

    toggleBookmark: async (type: BookmarkType, id: string): Promise<{ isBookmarked: boolean; bookmarkId?: string }> => {
        const check = await bookmarks.checkStatus(type, id);
        if (check.isBookmarked && check.bookmarkId) {
            await bookmarks.delete(check.bookmarkId);
            return { isBookmarked: false };
        } else {
            const result = await bookmarks.create(type, id);
            return { isBookmarked: true, bookmarkId: result.id };
        }
    },
};

// Unified export
export const interactions = {
    follows,
    likes,
    bookmarks,
};
