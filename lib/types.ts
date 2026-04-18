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

// Membership Tier Types — must match backend MembershipTierType enum
export enum MembershipTier {
    FREE = 'free',
    PRO = 'pro',
    PRIME = 'prime',
    ULTRA = 'ultra',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
}

// Product SKU Definition
// Format: {tier}_{cycle}
// Examples: free_monthly, pro_quarterly, ultra_yearly
export type MembershipSKU = `${MembershipTier}_${BillingCycle}`;

export interface MembershipPlan {
    id: MembershipSKU;                    // e.g., "pro_monthly"
    tier: MembershipTier;                 // free, pro, prime, ultra
    cycle: BillingCycle;                 // monthly, quarterly, yearly
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
    sourceFragmentId?: string;
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
    /** 话题（与碎片 topic 对齐；展示时格式化为 #xxx） */
    topic?: string;
    workflowStatus?: string;
    currentStep?: number;
    storyboardScenes?: StoryboardScene[];
    characterRefs?: StoryboardCharacterRef[];

    // Parallel universe fields
    childrenIds?: string[];
    fateSnapshot?: Record<string, FateSnapshotEntry>;
    fateSnapshotHash?: string;
    isInDefaultPath?: boolean;
    defaultPathOrder?: number;
}

export interface FateSnapshotEntry {
    name: string;
    health?: number;
    mood?: string;
    location?: string;
    summary?: string;
}

// ============================================================
// Fragment Types (aligned with voyager Fragment.swift)
// ============================================================

export type FragmentVisibility = 'public' | 'followers' | 'private';

export type FragmentSourceType = 'original' | 'story_excerpt' | 'storyboard_node' | 'panel_generation' | 'ai_fragment_generation';

export interface FragmentStyle {
    id: string;
    value: string;     // slug
    name: string;
    icon?: string;
    category?: string;
    emoji?: string;
}

export interface StoryFragment {
    id: string;
    creatorId: string;
    creatorName?: string;
    creatorAvatar?: string;
    content: string;
    imageUrls: string[];
    style?: string;
    fragmentCount?: number;
    visibility: FragmentVisibility;
    topic?: string;
    caption?: string;
    isDraft?: boolean;
    draftCount?: number;
    convertedToStoryId?: string;
    isConverted?: boolean;
    sourceType?: FragmentSourceType;
    sourceId?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
}

export interface FragmentListResponse {
    fragments: StoryFragment[];
    total: number;
    hasMore?: boolean;
}

export interface CreateFragmentRequest {
    content: string;
    imageUrls?: string[];
    topic?: string;
    caption?: string;
    style?: string;
    fragmentCount?: number;
    visibility?: FragmentVisibility;
}

export interface UpdateFragmentRequest extends Partial<CreateFragmentRequest> {
    isDraft?: boolean;
}

// Fragment AI generation task
export interface GenerateFragmentTaskResponse {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: StoryFragment;
    error?: string;
}

// Fragment panel generation
export interface GenerateFragmentPanelsRequest {
    userInput: string;
    referenceImageUrl?: string;
    style?: string;
    panelCount?: number;
    visibility?: FragmentVisibility;
    topic?: string;
}

export interface FragmentPanelItem {
    index: number;
    imageUrl: string;
    caption?: string;
}

export interface GenerateFragmentPanelsTaskResponse {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    plan?: string;
    panels?: FragmentPanelItem[];
    metrics?: { panelsGenerated: number; tokensUsed: number };
    error?: string;
}

// Fragment → Story conversion
export interface FragmentStoryPrefillAIRequest {
    sceneCount?: number;   // 2-8, default 3
}

export interface FragmentStoryPrefillAIResponse {
    title: string;
    description: string;
    summary?: string;
    style?: string;
    genre?: string;
    tags?: string[];
    suggestedCharacters?: {
        name: string;
        role: string;
        background?: string;
    }[];
}

export interface FragmentStoryCreationPrefill {
    fragmentId: string;
    title: string;
    description?: string;
    coverImage?: string;
    genre?: string;
    defaultSceneCount: number;
    useAI: boolean;
    suggestedStyle?: string;
    summary?: string;
    suggestedTags?: string[];
    suggestedCharacters?: {
        name: string;
        role: string;
        background?: string;
    }[];
    limitTitleToSevenCharacters?: boolean;
}

export interface ConvertFragmentRequest {
    title: string;
    description?: string;
    genre?: string;
    coverImage?: string;
    sceneCount?: number;
    useAI?: boolean;
    collaborationType?: 'open' | 'restricted' | 'closed';
}

export interface ConvertFragmentResponse {
    story: Story;
    fragmentId: string;
}

// ============================================================
// Generation Pipeline Types (aligned with voyager StoryboardGeneration.swift)
// ============================================================

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type WorkflowStatus = 'draft' | 'content_ready' | 'images_ready' | 'video_ready' | 'published';

export interface StoryboardContentGeneration {
    id: string;
    storyboardId: string;
    rawInput: string;
    generatedContent?: string;
    status: GenerationStatus;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    errorMessage?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface StoryboardSceneGeneration {
    id: string;
    storyboardId: string;
    sceneId: string;
    sceneTitle?: string;
    generatedDescription?: string;
    status: GenerationStatus;
    errorMessage?: string;
}

export interface StoryboardImageGeneration {
    id: string;
    sceneId: string;
    generatedPrompt?: string;
    promptDetails?: {
        artStyle?: string;
        lighting?: string;
        colorPalette?: string;
        composition?: string;
        keyElements?: string[];
        mood?: string;
    };
    generatedImageUrl?: string;
    status: GenerationStatus;
    errorMessage?: string;
}

export interface StoryboardVideoGeneration {
    id: string;
    sceneId: string;
    generatedPrompt?: string;
    promptDetails?: {
        cameraMovement?: string;
        subjectMotion?: string;
        atmosphere?: string;
        transitionStyle?: string;
        duration?: string;
        keyMoments?: string[];
    };
    generatedVideoUrl?: string;
    providerTaskId?: string;
    providerName?: string;
    duration?: number;
    status: GenerationStatus;
    isSubdivided?: boolean;
    videoSegments?: {
        index: number;
        videoUrl: string;
        startFrame?: string;
        endFrame?: string;
        durationSecs: number;
    }[];
}

export interface GenerationPipelineSceneItem {
    sceneId: string;
    sceneTitle?: string;
    status: GenerationStatus;
    errorMessage?: string;
}

export interface GenerationPipelineStep {
    phase: 'content' | 'scenes' | 'images';
    status: GenerationStatus | 'running';
    order: number;
    title: string;
    summary?: string;
    errorMessage?: string;
    sceneItems?: GenerationPipelineSceneItem[];
}

export interface StoryboardGenerationProgress {
    storyboardId: string;
    workflowStatus: WorkflowStatus;
    currentStep: number;
    totalTokens?: number;
    isGenerating: boolean;
    hasPendingTasks?: boolean;
    generationMessage?: string;
    contentGeneration?: StoryboardContentGeneration;
    sceneGenerations?: StoryboardSceneGeneration[];
    imageGenerations?: StoryboardImageGeneration[];
    videoGenerations?: StoryboardVideoGeneration[];
    pipelineSteps: GenerationPipelineStep[];
    suggestedResumeAction?: 'none' | 'retry_failed_images' | 'regenerate_content' | 'regenerate_scenes';
}

export interface BatchImageResponse {
    results: {
        sceneId: string;
        sceneTitle?: string;
        status: 'success' | 'failed';
        errorMessage?: string;
        generation?: StoryboardImageGeneration;
        existingImageUrl?: string;
    }[];
    total: number;
    successCount: number;
    failedCount: number;
}

export interface ContinueStoryboardRequest {
    rawInput: string;
    sceneCount?: number;
    characters?: string[];
    generateVideo?: boolean;
    comicStyle?: string;
}

export interface ContinueStoryboardResponse {
    newStoryboard: Storyboard;
    generatedScenes: StoryboardScene[];
    fateSnapshot?: Record<string, FateSnapshotEntry>;
    tokensUsed?: number;
}

export interface ForkStoryboardRequest {
    title: string;
    rawInput: string;
    content?: string;
    isStandalone?: boolean;
    sceneCount?: number;
    sceneRefs?: { storySceneId: string; sequence: number; isPrimaryScene: boolean }[];
    characterRefs?: { characterId: string; role: string; order: number; notes?: string }[];
}

// ============================================================
// Plaza Types (aligned with voyager PlazaModels.swift)
// ============================================================

export type PlazaRailKind =
    | 'stories_trending'
    | 'stories_latest_published'
    | 'fragments_discover_global'
    | 'fragments_topic';

export interface PlazaSectionBadgeColor {
    key: string;
    color: string;
}

export interface PlazaStorySnippet {
    id: string;
    title?: string;
    coverURL?: string;
    likes?: number;
    sourceFragmentId?: string;
}

export interface PlazaSection {
    id: string;
    kind: PlazaRailKind;
    title?: string;
    titleKey?: string;
    subtitle?: string;
    subtitleKey?: string;
    badgeText?: string;
    badgeKey?: string;
    badgeColor?: string;
    badgeColorKey?: string;
    creatorUserId?: string;
    avatarURL?: string;
    topicTag?: string;
    topicQuery?: string;
    fragments?: StoryFragment[];
    stories?: PlazaStorySnippet[];
}

export interface PlazaResponse {
    sections: PlazaSection[];
}

// ============================================================
// Genre Constants (aligned with voyager allGenres)
// ============================================================

export const GENRES = [
    { key: 'fantasy', label: { en: 'Fantasy', zh: '奇幻', ja: 'ファンタジー' } },
    { key: 'scifi', label: { en: 'Sci-Fi', zh: '科幻', ja: 'SF' } },
    { key: 'mystery', label: { en: 'Mystery', zh: '悬疑', ja: 'ミステリー' } },
    { key: 'romance', label: { en: 'Romance', zh: '爱情', ja: 'ロマンス' } },
    { key: 'wuxia', label: { en: 'Wuxia', zh: '武侠', ja: '武俠' } },
    { key: 'historical', label: { en: 'Historical', zh: '历史', ja: '歴史' } },
    { key: 'urban', label: { en: 'Urban', zh: '都市', ja: 'アーバン' } },
    { key: 'horror', label: { en: 'Horror', zh: '恐怖', ja: 'ホラー' } },
    { key: 'adventure', label: { en: 'Adventure', zh: '冒险', ja: 'アドベンチャー' } },
    { key: 'comedy', label: { en: 'Comedy', zh: '喜剧', ja: 'コメディ' } },
    { key: 'youth', label: { en: 'Youth', zh: '青春', ja: '青春' } },
    { key: 'other', label: { en: 'Other', zh: '其他', ja: 'その他' } },
] as const;

export type GenreKey = typeof GENRES[number]['key'];

// ============================================================
// Bookmark Types
// ============================================================

export type BookmarkType = 'story' | 'fragment' | 'storyboard' | 'character';

export interface Bookmark {
    id: string;
    userId: string;
    bookmarkType: BookmarkType;
    bookmarkId: string;
    collectionName?: string;
    createdAt?: number;
    updatedAt?: number;
    // Expanded references
    story?: Story;
    fragment?: StoryFragment;
    storyboard?: Storyboard;
    character?: Character;
}

export interface PagedBookmarks {
    bookmarks: Bookmark[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// ============================================================
// Search Types
// ============================================================

export type SearchType = 'story' | 'character' | 'user' | 'storyboard' | 'fragment' | 'all';

export interface SearchFilters {
    genre?: string;
    status?: string;
    sortBy?: string;
    tags?: string[];
}

export interface SearchResults {
    stories?: Story[];
    characters?: Character[];
    users?: User[];
    storyboards?: Storyboard[];
    fragments?: StoryFragment[];
    total: number;
    query: string;
}

// ============================================================
// Badge Types
// ============================================================

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type BadgeCategory = 'creation' | 'social' | 'engagement' | 'milestone' | 'special';

export interface BadgeDefinition {
    id: string;
    code: string;
    name: string;
    nameZh?: string;
    description: string;
    descriptionZh?: string;
    category: BadgeCategory;
    tier: BadgeTier;
    iconUrl?: string;
    iconEmoji?: string;
    colorHex?: string;
    threshold: number;
    points: number;
    displayOrder: number;
}

export interface UserBadge {
    id: string;
    userId: string;
    badgeId: string;
    badge?: BadgeDefinition;
    awardedAt: number;
    pinnedAt?: number;
    progress?: BadgeProgress;
    isViewed?: boolean;
}

export interface BadgeProgress {
    badgeId: string;
    current: number;
    target: number;
    percentage: number;
}

// ============================================================
// Token Usage Types
// ============================================================

export interface TokenUsageStats {
    totalUsed: number;
    totalLimit: number;
    byType: Record<string, number>;
    period: string;
}

export interface TokenUsageLog {
    id: string;
    userId: string;
    entityType: string;
    entityId: string;
    tokensUsed: number;
    model?: string;
    createdAt: number;
}

export interface TokenUsageLimits {
    dailyLimit: number;
    monthlyLimit: number;
    dailyUsed: number;
    monthlyUsed: number;
}

export interface TokenUsageByType {
    type: string;
    used: number;
    limit: number;
}

export interface UsageBillingSummary {
    period: string;
    totalTokens: number;
    totalCost: number;
    byType: Record<string, { tokens: number; cost: number }>;
}

// ============================================================
// Membership Backend Types
// ============================================================

export interface MembershipPlanBackend {
    id: string;
    tier: string;
    period: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    features: string[];
    limits: Record<string, number | string | boolean>;
}

export interface UserMembership {
    tier: string;
    status: string;
    startDate: number;
    endDate: number;
    autoRenew: boolean;
    planId: string;
}

export interface MembershipUsage {
    aiUsedThisMonth: number;
    aiLimit: number;
    isUnlimited: boolean;
    remainingQuota: number;
    storyboardsCreated: number;
    storyboardsLimit: number;
    charactersCreated: number;
    charactersLimit: number;
}

export interface SubscribeRequest {
    tier: string;
    period: string;
    paymentMethod?: string;
}

export interface SubscribeResponse {
    orderId: string;
    paymentUrl?: string;
    clientSecret?: string;
}

// ============================================================
// Feedback & Referral Types
// ============================================================

export type FeedbackCategory = 'bug' | 'feature' | 'improvement' | 'other';

export interface Feedback {
    id: string;
    category: FeedbackCategory;
    content: string;
    contactInfo?: string;
    status: 'pending' | 'reviewing' | 'resolved' | 'closed';
    createdAt: number;
    updatedAt?: number;
}

export interface ReferralInfo {
    referralCode: string;
    shareContent?: string;
    shareUrl?: string;
    stats: {
        totalReferrals: number;
        activeReferrals: number;
        earnedPoints: number;
    };
}

export interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    earnedPoints: number;
    referralCode: string;
}

// ============================================================
// Story Panel Types
// ============================================================

export interface StoryPanel {
    id: string;
    storyId: string;
    title?: string;
    imageUrl?: string;
    text?: string;
    textPosition?: string;
    sequence: number;
    storyboardId?: string;
    isAIGenerated?: boolean;
    createdAt?: number;
    updatedAt?: number;
}

export interface ReorderPanelsRequest {
    panelIds: string[];
}

export interface StoryDefaultPath {
    nodeIds: string[];
    count: number;
}

// ============================================================
// Character Extended Types
// ============================================================

export interface CharacterAnalytics {
    totalStoryboards: number;
    totalLikes: number;
    totalForks: number;
    totalViews: number;
}

export interface CharacterStoryboardRef {
    storyboardId: string;
    title: string;
    role?: string;
    coverImage?: string;
}

export interface GenerateCharacterRequest {
    name?: string;
    description?: string;
    personality?: string;
    appearance?: string;
    style?: string;
}

export interface GenerateAvatarRequest {
    style?: string;
}

export interface CropAvatarRequest {
    x: number;
    y: number;
    width: number;
    height: number;
    portraitUrl?: string;
}

// ============================================================
// User Extended Types
// ============================================================

export interface UserStats {
    storyCount: number;
    storyboardCount: number;
    characterCount: number;
    fragmentCount: number;
    followerCount: number;
    followingCount: number;
    totalLikes: number;
    totalViews: number;
}

export interface UserPoints {
    points: number;
}

export interface PointsHistory {
    id: string;
    amount: number;
    reason: string;
    createdAt: number;
}

export interface LikedContent {
    stories?: Story[];
    characters?: Character[];
    storyboards?: Storyboard[];
}

export interface CreatorAnalytics {
    totalStories: number;
    totalStoryboards: number;
    totalCharacters: number;
    totalFragments: number;
    viewsThisWeek: number;
    likesThisWeek: number;
    newFollowersThisWeek: number;
}

// ============================================================
// Genre Preference Types
// ============================================================

export interface GenrePreference {
    key: string;
    label: string;
    selected: boolean;
}

export interface GenreCatalogPage {
    genres: GenrePreference[];
    total: number;
}

// ============================================================
// File Upload Types
// ============================================================

export interface STSToken {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
    endpoint: string;
    bucket: string;
    region: string;
}

export interface ImageLevels {
    original?: string;
    content?: string;
    preview?: string;
    thumbnail?: string;
    small?: string;
}

export interface UploadResult {
    url: string;
    filename?: string;
    levels?: ImageLevels;
}

// ============================================================
// AI Standalone Types
// ============================================================

export type AIEntityType = 'story' | 'character' | 'image' | 'video' | 'prompt';

export interface AIGenerateStoryRequest {
    prompt: string;
    genre?: string;
    style?: string;
    sceneCount?: number;
}

export interface AIEnhancePromptRequest {
    prompt: string;
    context?: string;
}

export interface AIGenerateImageRequest {
    prompt: string;
    style?: string;
    aspectRatio?: string;
    count?: number;
}

export interface AIGenerateVideoRequest {
    imageUrl?: string;
    prompt?: string;
    duration?: number;
    style?: string;
}

export interface AITask {
    id: string;
    type: AIEntityType;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress?: number;
    result?: any;
    error?: string;
    createdAt: number;
    updatedAt: number;
}

// ============================================================
// Interaction Types (Unified)
// ============================================================

export type InteractionTargetType = 'story' | 'character' | 'storyboard_node' | 'fragment' | 'user';

export interface InteractionCheckResult {
    isFollowing?: boolean;
    isLiked?: boolean;
    isBookmarked?: boolean;
}

export interface BatchCheckRequest {
    type: InteractionTargetType;
    ids: string[];
}

export interface BatchCheckResult {
    [id: string]: boolean;
}

export interface FollowCount {
    count: number;
}

export interface LikeCount {
    count: number;
}

export interface BookmarkCount {
    count: number;
}

// ============================================================
// Invitation Code Types
// ============================================================

export interface InvitationCode {
    id: string;
    code: string;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    expiresAt?: number;
    createdAt: number;
}

// ============================================================
// Webhook / Payment Types
// ============================================================

export interface WebPayment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    planId?: string;
    createdAt: number;
    updatedAt?: number;
}

export interface CreateWebPaymentRequest {
    planId: string;
    paymentMethod: 'stripe' | 'alipay';
    returnUrl?: string;
}

export interface CreateWebPaymentResponse {
    paymentId: string;
    clientSecret?: string;
    paymentUrl?: string;
}
