export interface User {
    id: string;
    username: string;
    email?: string;
    displayName: string;
    avatar?: string;
    background?: string;
    bio?: string;
    location?: string;
    website?: string;
    followers?: number;
    following?: number;
    storyboardCount?: number;
    status?: string;
    createdAt: number;
    updatedAt: number;
    isFollowing?: boolean;
}

export interface GenericResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export type ApiResponse<T> = GenericResponse<T>;

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

export interface PaginationReq {
    limit?: number;
    offset?: number;
}

export interface PaginatedList<T> {
    items: T[];
}

export interface Story {
    id: string;
    title: string;
    description: string;
    coverImage?: string;
    likes: number;
    followers: number;
    comments: number; // Added to match frontend usage
    panels: number;
    storyboardCount: number;
    characterCount: number;
    defaultSceneCount: number;
    genre: string;
    status: 'draft' | 'published' | 'rendering';
    isCollaborationOpen: boolean;
    createdAt: number;
    updatedAt: number;

    // AI Enrichment
    originalDescription?: string;
    enrichedDescription?: string;
    isAIEnriched?: boolean;
    coverGeneratedByAI?: boolean;
    posterImage?: string;
    backgroundImage?: string;

    // Stats
    tokensUsed?: number;

    // Relations
    author?: User;
    groupId?: string;
    groupName?: string;

    // Detailed view relations
    characters?: Character[];
    scenes?: StoryScene[];
    contributors?: StoryContributor[];
    liked?: boolean;
    isFollowing?: boolean;
}

export interface StoryScene {
    id: string;
    storyId: string;
    sequence: number;
    title: string;
    description: string;
    image?: string;
    location?: string;
    createdAt: number;
}

export interface StoryContributor {
    id: string;
    userId: string;
    role: 'owner' | 'collaborator' | 'contributor';
    name?: string;
    avatar?: string;
}

export interface Character {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
    gender?: string;
    age?: string;
    occupation?: string;
    personality?: string;
    background?: string;
    appearance?: string;
    isPublic?: boolean;
    creatorId?: string;
    createdAt?: number;
}

export interface Storyboard {
    id: string;
    storyId: string;
    parentId: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    title: string;
    content: string;
    rawInput: string;
    isStandalone: boolean;
    isAIGenerated: boolean;
    sceneCount: number;
    workflowStatus: 'draft' | 'content_ready' | 'images_ready' | 'video_ready' | 'published';
    likes: number;
    comments: number;
    shares: number;
    forkCount: number;
    views: number;
    createdAt: number;
    updatedAt: number;

    // Scenes
    storyboardScenes?: StoryboardScene[];

    // Tree
    childrenIds?: string[];

    // Client-side helper
    children?: Storyboard[];
}

export interface StoryboardScene {
    id: string;
    storyboardId: string;
    sequence: number;
    title: string;
    description: string;
    image?: string;
    videoUrl?: string;
    isSubdivided: boolean;
    videoSegments?: VideoSegmentInfo[];
}

export interface VideoSegmentInfo {
    index: number;
    videoUrl: string;
    startFrame: string;
    endFrame: string;
    durationSecs: number;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    cover_image?: string;
    members: number;
    stories: number;
    followers?: number;
    is_public: boolean;
    created_at: number;
    updated_at: number;

    // Relations
    creator?: User;
    my_role?: 'owner' | 'admin' | 'moderator' | 'member';
    is_following?: boolean;
}

// API Payloads
export interface CreateStoryReq {
    title: string;
    description?: string;
    genre: string;
    groupId?: string;
    tags?: string[];
    useAIEnrich?: boolean;
    generateCover?: boolean;
    defaultSceneCount?: number;
}

export interface CreateStoryboardReq {
    storyId: string;
    parentId?: string;
    title: string;
    rawInput: string;
    isStandalone?: boolean;
    sceneCount?: number;
}

// Comments
export interface Comment {
    id: string;
    authorId: string;
    content: string;
    targetType: string;
    targetId: string;
    parentId?: string;
    rootId?: string;
    likes: number;
    dislikes: number;
    replyCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    createdAt: number;
    updatedAt: number;

    // Relations
    author?: User;
    replies?: Comment[];
}

export interface CreateCommentReq {
    targetType: 'story' | 'storyboard' | 'character' | 'comment';
    targetId: string;
    content: string;
    parentId?: string;
}

export interface UserActivity {
    id: string;
    userId: string;
    type: string;
    targetId?: string;
    targetType?: string;
    targetTitle?: string;
    message?: string;
    createdAt: number;
}

export interface UserSubscription {
    id: number;
    userId: number;
    packagePlanId: number;
    status: number;
    startTime: string;
    endTime: string;
    autoRenew: boolean;
    quotaLimit: number;
    quotaUsed: number;
    features: string;
}

export interface CreateGroupReq {
    name: string;
    description: string;
    avatar?: string;
    isPublic: boolean;
}

export interface UpdateGroupReq {
    name?: string;
    description?: string;
    avatar?: string;
    isPublic?: boolean;
}

export interface UpdateProfileReq {
    displayName?: string;
    bio?: string;
    avatar?: string;
    background?: string;
    location?: string;
    website?: string;
    aiPromptPreferences?: string;
}

export interface VIPInfo {
    user_id: string;
    is_vip: boolean;
    level: number;
    status: number;
    auto_renew: boolean;
    quota_used: number;
    quota_limit: number;
    max_roles: number;
    max_contexts: number;
    expires_at?: string;
}

export interface UsageStats {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
    requests: number;
}

export interface ChatThread {
    id: string;
    userId: string;
    agentId?: string;
    title: string;
    lastMessageAt: number;
    createdAt: number;
    updatedAt: number;
}

export interface ChatMessage {
    id: string;
    threadId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: number;
}

export interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    systemPrompt: string;
}

export interface CreateCharacterReq {
    name: string;
    description: string;
    avatar?: string;
    gender?: string;
    age?: string;
    occupation?: string;
    personality?: string;
    background?: string;
    appearance?: string;
    tags?: string[];
    isPublic: boolean;
}

export interface GenerateCharacterReq {
    name?: string;
    description?: string; // high level concept
}

export interface GenerateCharacterRes {
    name: string;
    description: string;
    gender: string;
    age: string;
    occupation: string;
    personality: string;
    background: string;
    appearance: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: string; // like, comment, follow, mention, system
    title: string;
    content: string;
    link?: string;
    read: boolean;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
    createdAt: number;
    user?: User;
    actor?: User;
}
