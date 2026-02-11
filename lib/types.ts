export interface User {
    id: string;
    username: string;
    email?: string;
    displayName?: string;
    bio?: string;
    avatar?: string;
    background?: string;
    website?: string;
    location?: string;
    aiPromptPreferences?: string;
    followers?: number;
    following?: number;
    followerCount?: number;
    followingCount?: number;
    storyCount?: number;
    characterCount?: number;
    totalLikes?: number;
    dateOfBirth?: number; // timestamp
    joinedDate?: number;
    createdAt?: number;
    updatedAt?: number;
    status?: string;

    storyboardCount?: number;

    // Follow Status
    isFollowing?: boolean;

    // VIP & OAuth
    oauthProvider?: string;
    oauthId?: string;
    isVip?: boolean;
    vipLevel?: number;
    vipExpiresAt?: string;
    emailVerified?: boolean;
    lastLoginAt?: number;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    user: User;
    expiresIn: number;
}

export interface VIPInfo {
    userId: string;
    isVip: boolean;
    level: number;
    status: number;
    autoRenew: boolean;
    quotaUsed: number;
    quotaLimit: number;
    maxRoles: number;
    maxContexts: number;
    expiresAt?: string;
    planId?: string;
    subscriptionId?: string;
}

// Membership Tier Types
export enum MembershipTier {
    BASIC = 'basic',         // 普通付费会员
    PRO = 'pro',             // Pro 付费会员
    ULTRA = 'ultra'          // Ultra 付费会员
}

export enum BillingCycle {
    MONTHLY = 'month',       // 按月
    QUARTERLY = 'quarter',   // 按季度
    YEARLY = 'year'          // 按年
}

// Product SKU Definition
// Format: {tier}_{cycle}
// Examples: basic_month, pro_quarter, ultra_year
export type MembershipSKU = `${MembershipTier}_${BillingCycle}`;

export interface MembershipPlan {
    id: MembershipSKU;                    // e.g., "basic_month"
    tier: MembershipTier;                 // basic, pro, ultra
    cycle: BillingCycle;                 // month, quarter, year
    name: {
        en: string;
        zh: string;
        ja: string;
    };
    description: {
        en: string;
        zh: string;
        ja: string;
    };
    price: number;                       // Price in cents (e.g., 999 = $9.99)
    currency: string;                    // e.g., "USD"
    originalPrice?: number;               // For discount display
    discountPercent?: number;            // Discount percentage (0-100)
    features: string[];                  // List of feature keys
    limits: {
        aiQuota: number;                  // AI generation quota per month
        maxRoles: number;                 // Max character roles
        maxContexts: number;              // Max story contexts
        maxStoryboards: number;           // Max storyboards
        exportQuality: 'standard' | 'high' | 'ultra';
        prioritySupport: boolean;
        advancedFeatures: boolean;
    };
    popular?: boolean;                   // Highlight as popular choice
    recommended?: boolean;                // AI recommended
    trialDays?: number;                   // Free trial days
}

export interface SubscriptionInfo {
    id: string;
    userId: string;
    planId: MembershipSKU;
    tier: MembershipTier;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    autoRenew: boolean;
    currentPeriodStart: number;          // Timestamp
    currentPeriodEnd: number;            // Timestamp
    cancelAtPeriodEnd: boolean;
    createdAt: number;
    updatedAt: number;
    plan?: MembershipPlan;
}

export interface TokenUsage {
    total: number;
    used: number;
    remaining: number;
    resetAt: number;                     // Timestamp when quota resets
}

// Character Models
export interface Character {
    id: string;
    storyId?: string;
    name: string;
    description: string;
    avatar?: string;
    portrait?: string;
    background?: string;
    personality?: string | string[];
    shortTermGoal?: string;
    longTermGoal?: string;
    handlingStyle?: string;
    cognitionRange?: string;
    abilityFeatures?: string;
    appearance?: string;
    dressPreference?: string;
    creatorId: string;
    author?: User;
    isPublic: boolean;
    likes?: number;
    followers?: number;
    stories?: number;
    isFollowing?: boolean;
    chatCount?: number;
    tags?: string[];
    creator?: User;
    createdAt?: number;
    updatedAt?: number;
    systemPrompt?: string;
    gallery?: string[];
}

// Scene Models (Story-level scenes, not storyboard scenes)
export interface StoryScene {
    id: string;
    storyId: string;
    title: string;
    description?: string;
    image?: string;
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
}

// Contributor Models
export type StoryContributorBadgeStyle = 'owner' | 'collaborator' | 'contributor' | 'custom';

export interface Contributor {
    id: string;
    storyId: string;
    userId: string;
    name: string;
    avatar?: string;
    role?: string;
    badgeStyle?: StoryContributorBadgeStyle;
    joinedAt?: number;
}

// Story Models
export interface Story {
    id: string;
    title: string;
    summary?: string;
    description?: string; // Added description
    cover?: string;
    coverImage?: string; // Backend field name
    authorId: string;
    status: 'draft' | 'published' | 'rendering';
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    createdAt?: number;
    updatedAt?: number;
    tags?: string[];
    author?: User; // Expanded
    isLiked?: boolean;
    likes?: number; // Alias for likeCount
    followers?: number; // Number of followers
    panels?: number; // Number of panels (alias for storyboardCount)
    storyboardCount?: number; // Number of storyboards
    characterCount?: number; // Number of characters
    genre?: string; // Story genre
    
    // AI Enrichment fields
    isCollaborationOpen?: boolean; // Whether anyone can edit
    rootStoryboardId?: string; // Root storyboard ID
    originalDescription?: string; // User's original description before AI enrichment
    enrichedDescription?: string; // AI enriched description
    isAIEnriched?: boolean; // Whether AI enrichment was applied
    aiEnrichedAt?: number; // When AI enrichment was done
    coverGeneratedByAI?: boolean; // Whether cover was AI generated
    posterImage?: string; // AI generated poster image URL
    backgroundImage?: string; // AI generated background image URL
    useAI?: boolean; // Whether AI assistance is enabled
    aiAssistanceOptions?: AIAssistanceOptions; // AI assistance configuration
    
    // Token consumption
    tokensUsed?: number; // Total tokens used
    textTokensUsed?: number; // Text generation tokens
    imageTokensUsed?: number; // Image generation tokens
    aiGenerationCost?: number; // AI generation cost in credits
    
    // Source tracking
    sourceFragmentId?: string; // Source fragment ID if converted from fragment
    
    // Default path (for story navigation)
    defaultPathNodeIds?: string[]; // Default path node IDs
    defaultPathUpdatedAt?: number; // When default path was last updated
    defaultPathType?: 'manual' | 'auto'; // How default path was set
    
    // Relations
    characters?: Character[]; // Characters in the story
    scenes?: StoryScene[]; // Scenes in the story
    contributors?: Contributor[]; // Contributors to the story
}

// AI Assistance Options
export interface AIAssistanceOptions {
    generateMetadata?: boolean; // Generate title/description
    generateVisuals?: boolean; // Generate background/cover
    assistStoryboard?: boolean; // AI assist with storyboards
    generateVideo?: boolean; // Generate video (optional)
}

// AI Style Configuration
export interface StyleConfig {
    id: string;
    style: string;
    alias?: string;
    name: string;
    description?: string;
    preview_image?: string;
    is_public?: boolean;
    created_at?: number;
}

// Creation Requests
export interface CreateStoryRequest {
    title: string;
    description?: string;
    coverImage?: string;
    genre?: string;
    status?: 'draft' | 'published';
    defaultSceneCount?: number;
    tags?: string[];

    // AI Enrichment
    useAIEnrich?: boolean;
    generateCover?: boolean;
    generatePoster?: boolean;
    generateBackground?: boolean;
    aiStyle?: StyleConfig;
    style?: string; // Style name string

    isCollaborationOpen?: boolean;
}

export interface UpdateStoryRequest {
    title?: string;
    description?: string;
    coverImage?: string;
    genre?: string;
    status?: string;
    isCollaborationOpen?: boolean;
}

export interface RenderStoryRequest {
    enrichDescription?: boolean;
    generateBackground?: boolean;
    generateCover?: boolean;
    style?: string;
    aspectRatio?: string;
}

export enum RenderTaskType {
    COVER = 'cover',
    POSTER = 'poster',
    BACKGROUND = 'background'
}

export interface MediaRenderRequest {
    type: RenderTaskType;
    resolution?: string;
    quality?: string;
}

export interface RenderTask {
    id: string;
    storyId: string;
    type: RenderTaskType;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    resultUrl?: string;
    errorMessage?: string;
    createdAt: number;
    updatedAt: number;
}

export interface RenderStoryResponse {
    story?: Story;
    taskId?: string;
}

// Activity Heatmap Types
export interface ActivityHeatmapData {
    date: string;
    count: number;
}

export enum ActivityTimeRange {
    TODAY = 'today',
    WEEK = 'week',
    MONTH = 'month'
}

export interface ActivityHeatmapResponse {
    data: ActivityHeatmapData[];
    totalCount: number;
    timeRange: ActivityTimeRange;
}

export interface StoryboardCharacterRef {
    id: string;
    storyboardId: string;
    characterId: string;
    order: number;
    displayName?: string; // Made optional for safety
    avatarUrl?: string;
    character?: Character; // Backend returns nested character object
    createdAt?: number;
    updatedAt?: number;
}

export interface StoryboardScene {
    id: string;
    storyboardId: string;
    sequence: number;
    title: string;
    description?: string;
    image?: string;
    location?: string;
    timeOfDay?: string;
    mood?: string;
    videoUrl?: string;
    videoSegments?: VideoSegment[];
    totalVideoDuration?: number;
    isSubdivided?: boolean;
    isAIGenerated?: boolean;
    characters?: string[];
    createdAt?: number;
    updatedAt?: number;
}

export interface VideoSegment {
    startTime: number;
    endTime: number;
    url: string;
}

export interface StoryboardWorkflow {
    rawInput?: string;
    content?: string;
    scenes?: StoryboardScene[];
    workflowStatus?: string;
    tokenConsumption?: number;
    isAIGenerated?: boolean;
}

export interface Storyboard {
    id: string;
    storyId?: string;
    parentId?: string;
    title: string;
    content?: string;
    rawInput?: string;
    image?: string;
    images?: string[]; // Multiple scene images
    video?: string;
    type?: string; // 'scene', 'choice', 'ending'
    createdAt?: number;
    updatedAt?: number;
    creatorId?: string;
    creatorName?: string;
    creatorAvatar?: string;
    author?: string; // Added author
    likes?: number;
    comments?: number;
    shares?: number;
    forkCount?: number;
    views?: number;
    tokenConsumption?: number;
    isStandalone?: boolean;
    isAIGenerated?: boolean;
    isLiked?: boolean;
    sceneCount?: number;
    workflowStatus?: string;
    currentStep?: number;
    storyboardScenes?: StoryboardScene[];
    characterRefs?: StoryboardCharacterRef[];
}
