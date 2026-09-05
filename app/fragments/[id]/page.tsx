"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, BookOpen, Loader2, UserPlus } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { bookmarks } from "@/lib/api/interactions";
import { profile } from "@/lib/api/profile";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { showSuccess, showError } from "@/lib/toast-utils";
import { CommentList } from "@/components/comments/comment-list";
import { ContentModerationMenu } from "@/components/moderation/content-moderation-menu";
import type { StoryFragment, FragmentStoryPrefillAIResponse, FragmentStoryCreationPrefill } from "@/lib/types";
import { parseShareGrant } from "@/lib/share-grant";

export default function FragmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();
    const fragmentId = params.id as string;

    const [fragment, setFragment] = useState<StoryFragment | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [converting, setConverting] = useState(false);
    const commentsRef = useRef<HTMLDivElement>(null);

    const shareGrant = parseShareGrant(searchParams);

    useEffect(() => {
        loadFragment();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在碎片/分享参数变化时重载；loadFragment 为普通函数
    }, [fragmentId, shareGrant?.token, shareGrant?.exp]);

    const loadFragment = async () => {
        try {
            const data = await fragments.get(fragmentId, shareGrant);
            setFragment(data);
            setIsLiked(data.isLiked || false);
            setLikeCount(data.likes || 0);
            setShareCount(data.shares || 0);

            if (user) {
                const [bookmarkStatus, followStatus] = await Promise.all([
                    bookmarks.checkStatus('fragment', fragmentId).catch(() => ({ isBookmarked: false })),
                    data.creatorId && data.creatorId !== user.id
                        ? profile.isFollowing(data.creatorId).then(r => r.isFollowing).catch(() => false)
                        : Promise.resolve(false),
                ]);
                setIsBookmarked(bookmarkStatus.isBookmarked);
                setIsFollowing(!!followStatus);
            }
        } catch (err) {
            console.error("Failed to load fragment:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) { showLoginPrompt(); return; }
        const prevLiked = isLiked;
        const prevCount = likeCount;
        setIsLiked(!prevLiked);
        setLikeCount(prev => prevLiked ? prev - 1 : prev + 1);
        try {
            if (prevLiked) {
                await fragments.unlike(fragmentId);
            } else {
                await fragments.like(fragmentId);
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
        }
    };

    const handleBookmark = async () => {
        if (!user) { showLoginPrompt(); return; }
        try {
            const result = await bookmarks.toggleBookmark('fragment', fragmentId);
            setIsBookmarked(result.isBookmarked);
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
        }
    };

    const handleShare = async () => {
        try {
            await fragments.share(fragmentId);
            setShareCount(prev => prev + 1);
            const { shareContent } = await import("@/lib/api/share");
            const { copied } = await shareContent({
                kind: "fragment",
                id: fragmentId,
                title: fragment?.content?.slice(0, 50) || "Fragment",
            });
            if (copied) showSuccess("Link copied to clipboard");
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Failed to share:", err);
            }
        }
    };

    const handleFollow = async () => {
        if (!user || !fragment?.creatorId) { showLoginPrompt(); return; }
        const prev = isFollowing;
        setIsFollowing(!prev);
        try {
            if (prev) {
                await profile.unfollowUser(fragment.creatorId);
            } else {
                await profile.followUser(fragment.creatorId);
            }
        } catch (err) {
            console.error("Failed to toggle follow:", err);
            setIsFollowing(prev);
        }
    };

    const handleConvertToStory = async () => {
        if (!user) { showLoginPrompt(); return; }
        setConverting(true);
        try {
            // Step 1: Get AI prefill
            const prefill: FragmentStoryPrefillAIResponse = await fragments.storyPrefillAI(fragmentId, { sceneCount: 3 });

            // Step 2: Navigate to story creation with prefill data
            const creationPrefill: FragmentStoryCreationPrefill = {
                fragmentId,
                title: prefill.title,
                description: prefill.description,
                genre: prefill.genre,
                defaultSceneCount: 3,
                useAI: true,
                suggestedStyle: prefill.style,
                summary: prefill.summary,
                suggestedTags: prefill.tags,
                suggestedCharacters: prefill.suggestedCharacters,
                limitTitleToSevenCharacters: true,
            };

            const encoded = encodeURIComponent(JSON.stringify(creationPrefill));
            router.push(`/create?fragmentPrefill=${encoded}`);
        } catch (err) {
            console.error("Failed to convert to story:", err);
            showError("Conversion failed", "Failed to generate story from fragment");
        } finally {
            setConverting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!fragment) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg font-semibold mb-2">Fragment not found</p>
                <button onClick={() => router.push("/fragments")} className="text-primary hover:underline">
                    Back to fragments
                </button>
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
            <LoginPromptModal />

            {/* Back button */}
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <ContentModerationMenu
                    target={{
                        kind: "content",
                        contentType: "fragment",
                        contentId: fragment.id,
                        label: "fragment",
                        authorId: fragment.creatorId,
                    }}
                />
            </div>

            {/* Image Gallery */}
            {fragment.imageUrls && fragment.imageUrls.length > 0 && (
                <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                        <img
                            src={fragment.imageUrls[currentImageIndex]}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        {fragment.imageUrls.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {fragment.imageUrls.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            i === currentImageIndex ? "bg-white" : "bg-white/40"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {fragment.imageUrls.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {fragment.imageUrls.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                        i === currentImageIndex ? "border-primary" : "border-transparent"
                                    }`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="space-y-4">
                {/* Topic */}
                {fragment.topic && (
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        #{fragment.topic}
                    </span>
                )}

                {/* Text */}
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{fragment.content}</p>

                {/* Caption */}
                {fragment.caption && (
                    <p className="text-muted-foreground text-sm italic">{fragment.caption}</p>
                )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 py-3 border-t border-b">
                {fragment.creatorAvatar && (
                    <img src={fragment.creatorAvatar} alt="" className="w-10 h-10 rounded-full" />
                )}
                <div className="flex-1">
                    <p className="font-medium text-sm">{fragment.creatorName || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                        {fragment.createdAt ? new Date(fragment.createdAt * 1000).toLocaleDateString() : ""}
                    </p>
                </div>
                {user && fragment.creatorId && fragment.creatorId !== user.id && (
                    <button
                        onClick={handleFollow}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isFollowing
                                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                )}
                {fragment.style && (
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">{fragment.style}</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button onClick={handleLike} className="flex items-center gap-2 text-sm">
                    <Heart className={`w-5 h-5 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"}`} />
                    <span className={isLiked ? "text-red-500" : "text-muted-foreground"}>{likeCount}</span>
                </button>
                <button
                    onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>{fragment.comments || 0}</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>{shareCount}</span>
                </button>
                <button onClick={handleBookmark} className="flex items-center gap-2 text-sm transition-colors">
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleConvertToStory}
                    disabled={converting || fragment.isConverted}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {converting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <BookOpen className="w-4 h-4" />
                    )}
                    {converting ? "Converting..." : fragment.isConverted ? "Converted" : "Convert to Story"}
                </button>
            </div>

            {/* Comments */}
            <div ref={commentsRef}>
                <CommentList targetId={fragmentId} targetType="fragment" />
            </div>
        </div>
    );
}
