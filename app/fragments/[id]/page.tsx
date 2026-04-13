"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, BookOpen, Loader2 } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { showSuccess, showError } from "@/lib/toast-utils";
import type { StoryFragment, FragmentStoryPrefillAIResponse, FragmentStoryCreationPrefill } from "@/lib/types";

export default function FragmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();
    const fragmentId = params.id as string;

    const [fragment, setFragment] = useState<StoryFragment | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        loadFragment();
    }, [fragmentId]);

    const loadFragment = async () => {
        try {
            const data = await fragments.get(fragmentId);
            setFragment(data);
            setIsLiked(data.isLiked || false);
            setLikeCount(data.likes || 0);
        } catch (err) {
            console.error("Failed to load fragment:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) { showLoginPrompt(); return; }
        try {
            if (isLiked) {
                await fragments.unlike(fragmentId);
                setLikeCount(prev => prev - 1);
            } else {
                await fragments.like(fragmentId);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("Failed to toggle like:", err);
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
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

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
                {fragment.style && (
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">{fragment.style}</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button onClick={handleLike} className="flex items-center gap-2 text-sm">
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    <span className={isLiked ? "text-red-500" : "text-muted-foreground"}>{likeCount}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    <span>{fragment.comments || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                    <span>{fragment.shares || 0}</span>
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
        </div>
    );
}
