"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { storyboards } from "@/lib/api/storyboards";
import { likes, bookmarks } from "@/lib/api/interactions";
import { Storyboard } from "@/lib/types";
import { Loader2, ArrowLeft, Sparkles, Users, Heart, MessageSquare, GitFork, Share2, Info, Workflow, Play, X, ChevronLeft, ChevronRight, LayoutList, Grid3x3, ArrowUp, ArrowDown, AlertCircle, Plus, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentList } from "@/components/comments/comment-list";
import { StoryboardRoadmap } from "@/components/storyboard/roadmap";
import { DetailMetadata } from "@/components/storyboard/detail-metadata";
import { ForkDialog } from "@/components/storyboard/fork-dialog";
import { ContinueDialog } from "@/components/storyboard/continue-dialog";
import { useTranslation } from "@/providers/language-provider";
import { useAuth } from "@/providers/auth-provider";
import { showSuccess } from "@/lib/toast-utils";

export default function StoryboardPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const router = useRouter();
    const [item, setItem] = useState<Storyboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [expandedVideoSceneId, setExpandedVideoSceneId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"carousel" | "list">("carousel");
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [parentStoryboard, setParentStoryboard] = useState<Storyboard | null>(null);
    const [childStoryboards, setChildStoryboards] = useState<Storyboard[]>([]);
    const [showChildrenList, setShowChildrenList] = useState(false);
    const [showNoChildrenDialog, setShowNoChildrenDialog] = useState(false);
    const [showForkDialog, setShowForkDialog] = useState(false);
    const [showContinueDialog, setShowContinueDialog] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const hasLoadedRef = useRef<string | null>(null);
    const { user } = useAuth();
    const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

    useEffect(() => {
        if (!id || hasLoadedRef.current === id) return;

        let isMounted = true;

        // Load view mode from localStorage
        const savedViewMode = localStorage.getItem("storyboardViewMode");
        if (savedViewMode === "list" || savedViewMode === "carousel") {
            setViewMode(savedViewMode);
        }

        async function load() {
            try {
                const data = await storyboards.get(id as string);

                if (!isMounted) return;

                setItem(data);
                setLikeCount(data.likes || 0);
                setShareCount(data.shares || 0);

                // Check interaction status
                if (user) {
                    try {
                        const [likeStatus, bookmarkStatus] = await Promise.all([
                            likes.checkStatus('storyboard_node', id as string).catch(() => ({ isLiked: false })),
                            bookmarks.checkStatus('storyboard', id as string).catch(() => ({ isBookmarked: false })),
                        ]);
                        if (isMounted) {
                            setIsLiked(likeStatus.isLiked);
                            setIsBookmarked(bookmarkStatus.isBookmarked);
                        }
                    } catch (e) {
                        // Silently ignore interaction check failures
                    }
                }

                // Fetch generation progress
                if (data.workflowStatus && data.workflowStatus !== 'draft' && data.workflowStatus !== 'completed') {
                    try {
                        const progress = await storyboards.getGenerationProgress(id as string);
                        if (isMounted) {
                            setWorkflow({
                                rawInput: data.content,
                                content: data.content,
                                scenes: data.storyboardScenes,
                                workflowStatus: progress.status || data.workflowStatus,
                                currentStep: progress.currentStep,
                                totalSteps: progress.totalSteps,
                                completedSteps: progress.completedSteps,
                                progress: progress.progress,
                                isAIGenerated: data.isAIGenerated || false,
                            });
                        }
                    } catch (e) {
                        // Generation progress not available, use storyboard data
                        if (isMounted && data.storyboardScenes) {
                            setWorkflow({
                                rawInput: data.content,
                                content: data.content,
                                scenes: data.storyboardScenes,
                                workflowStatus: data.workflowStatus,
                                isAIGenerated: data.isAIGenerated || false,
                            });
                        }
                    }
                } else if (data.storyboardScenes) {
                    setWorkflow({
                        rawInput: data.content,
                        content: data.content,
                        scenes: data.storyboardScenes,
                        workflowStatus: data.workflowStatus || 'completed',
                        tokenConsumption: data.tokenConsumption,
                        isAIGenerated: data.isAIGenerated || false,
                    });
                }

                // Load parent and children storyboards
                if (data.parentId && data.parentId !== "root") {
                    try {
                        const parent = await storyboards.getParent(id as string, data.parentId);
                        if (isMounted) setParentStoryboard(parent);
                    } catch (e) {
                        console.error("Failed to load parent:", e);
                        // Don't show error to user, just silently fail
                        // Parent navigation will be disabled
                    }
                }

                try {
                    const children = await storyboards.getChildren(id as string);
                    if (isMounted) setChildStoryboards(children);
                } catch (e) {
                    console.error("Failed to load children:", e);
                    // Set empty array to indicate no children navigation available
                    if (isMounted) setChildStoryboards([]);
                    // Don't block the main content - children navigation will show appropriate UI
                }

                hasLoadedRef.current = id as string;
            } catch (e) {
                console.error("Failed to load storyboard:", e);
                if (isMounted) {
                    setLoading(false);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [id, user]);

    const handlePlayVideo = (sceneId: string) => {
        // Pause all other videos
        videoRefs.current.forEach((video, id) => {
            if (id !== sceneId) {
                video.pause();
            }
        });

        // Set this scene as expanded (video will stay visible)
        setExpandedVideoSceneId(sceneId);

        // Play the video
        const video = videoRefs.current.get(sceneId);
        if (video) {
            video.play().catch(err => {
                console.error('Failed to play video:', err);
            });
        }
    };

    const handleCloseVideo = (sceneId: string) => {
        // Pause the video
        const video = videoRefs.current.get(sceneId);
        if (video) {
            video.pause();
        }
        // Collapse the video
        setExpandedVideoSceneId(null);
    };

    const handleViewModeChange = (mode: "carousel" | "list") => {
        setViewMode(mode);
        localStorage.setItem("storyboardViewMode", mode);
        // Reset to first scene when switching views
        setCurrentSceneIndex(0);
    };

    const handlePreviousScene = () => {
        if (item?.storyboardScenes) {
            setCurrentSceneIndex((prev) => (prev > 0 ? prev - 1 : item.storyboardScenes!.length - 1));
        }
    };

    const handleNextScene = () => {
        if (item?.storyboardScenes) {
            setCurrentSceneIndex((prev) => (prev < item.storyboardScenes!.length - 1 ? prev + 1 : 0));
        }
    };

    const handleNavigateToParent = () => {
        if (parentStoryboard) {
            router.push(`/storyboards/${parentStoryboard.id}`);
        }
    };

    const handleNavigateToChild = () => {
        if (childStoryboards.length === 0) {
            // No children - show dialog
            setShowNoChildrenDialog(true);
            setShowChildrenList(false);
        } else if (childStoryboards.length === 1) {
            // One child - navigate directly
            router.push(`/storyboards/${childStoryboards[0].id}`);
            setShowChildrenList(false);
        } else {
            // Multiple children - show list
            setShowChildrenList(!showChildrenList);
        }
    };

    const handleChildSelect = (childId: string) => {
        router.push(`/storyboards/${childId}`);
        setShowChildrenList(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    );

    if (!item) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div>Not Found</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("storyboard_detail.back")}
                    </Button>
                </div>

                {/* Main Content Card with Border */}
                <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8 shadow-sm">
                    {/* Header: Title and Creator */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{item.title}</h1>

                        <div className="flex items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                    {item.creatorAvatar ? (
                                        <img src={item.creatorAvatar} alt={item.creatorName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-xs">{(item.creatorName || "U")[0]}</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{item.creatorName || item.author || "Unknown"}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.createdAt ? new Date(item.createdAt * 1000).toLocaleString() : "Unknown date"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {item.isAIGenerated && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>{t("storyboard_detail.ai_generated")}</span>
                                    </div>
                                )}

                                {/* Action Buttons in Dashed Border */}
                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-border bg-secondary/20">
                                    <Button variant="ghost" size="sm" className="gap-1.5 h-7 px-2 text-xs" onClick={() => {
                                        setShowForkDialog(true);
                                    }}>
                                        <GitFork className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">{t("storyboard_detail.fork")}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    {item.content && (
                        <div className="prose dark:prose-invert max-w-none leading-relaxed text-lg mb-8 text-foreground/90">
                            <p className="whitespace-pre-wrap">{item.content}</p>
                        </div>
                    )}

                    {/* Storyboard Navigation */}
                    <div className="mb-6">
                        {/* Navigation Buttons Row */}
                        <div className="flex items-center justify-between mb-3">
                            {/* Previous (Parent) Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNavigateToParent}
                                disabled={!parentStoryboard}
                                className={`gap-2 ${!parentStoryboard ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <ArrowUp className="h-4 w-4" />
                                {parentStoryboard ? (
                                    <span className="hidden sm:inline">{parentStoryboard.title.length > 10 ? parentStoryboard.title.substring(0, 10) + '...' : parentStoryboard.title}</span>
                                ) : (
                                    <span className="hidden sm:inline">无上级故事板</span>
                                )}
                            </Button>

                            {/* Next (Children) Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNavigateToChild}
                                className="gap-2"
                            >
                                <ArrowDown className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {childStoryboards.length > 0 ? `下一级 (${childStoryboards.length})` : '下一级'}
                                </span>
                            </Button>
                        </div>

                        {/* Children Storyboards List (Horizontal Scroll) */}
                        {showChildrenList && childStoryboards.length > 1 && (
                            <div className="border border-border rounded-lg p-4 bg-secondary/20">
                                <p className="text-sm text-muted-foreground mb-3">选择下一级故事板:</p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {childStoryboards.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => handleChildSelect(child.id)}
                                            className="flex-shrink-0 w-48 text-left p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors bg-card"
                                        >
                                            <div className="font-semibold text-sm mb-2 truncate">{child.title}</div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Heart className="h-3 w-3" />
                                                    {child.likes || 0}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {child.comments || 0}
                                                </div>
                                                {child.isAIGenerated && (
                                                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                                        <Sparkles className="h-3 w-3" />
                                                        AI
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Storyboard Scenes */}
                    {item.storyboardScenes && item.storyboardScenes.length > 0 && (
                        <div className="mb-8">
                            {/* Header with View Mode Toggle */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <Workflow className="h-5 w-5 text-muted-foreground" />
                                    {t("storyboard_detail.scenes")} ({item.storyboardScenes.length})
                                </h3>
                                <div className="flex items-center gap-1 bg-secondary/20 p-1 rounded-lg">
                                    <button
                                        onClick={() => handleViewModeChange("carousel")}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === "carousel"
                                                ? "bg-background shadow-sm text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        title="轮播视图"
                                    >
                                        <Grid3x3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleViewModeChange("list")}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === "list"
                                                ? "bg-background shadow-sm text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        title="列表视图"
                                    >
                                        <LayoutList className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Carousel View */}
                            {viewMode === "carousel" && (
                                <div className="space-y-4">
                                    {/* Single Scene Display */}
                                    <div className="border border-border rounded-lg overflow-hidden bg-card">
                                        {(() => {
                                            const scene = item.storyboardScenes[currentSceneIndex];
                                            const index = currentSceneIndex;

                                            return (
                                                <>
                                                    {/* Scene Header */}
                                                    <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-lg">{scene.title}</h4>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                                                                        <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                            📍 {scene.location}
                                                                        </span>
                                                                        <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                            🕐 {scene.timeOfDay}
                                                                        </span>
                                                                        {scene.mood && (
                                                                            <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                                😊 {scene.mood}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {scene.isAIGenerated && (
                                                                <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    AI
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Scene Image */}
                                                    {scene.image && (
                                                        <div className="relative w-full bg-muted group">
                                                            <img
                                                                src={scene.image}
                                                                alt={scene.title}
                                                                className="w-full h-auto object-cover max-h-[600px]"
                                                            />
                                                            {/* Video Play Button */}
                                                            {scene.videoUrl && (
                                                                <div
                                                                    className="absolute top-4 right-4 z-10"
                                                                    onClick={() => handlePlayVideo(scene.id)}
                                                                >
                                                                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border-2 border-white dark:border-black flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors cursor-pointer">
                                                                        <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Video Player */}
                                                    {scene.videoUrl && expandedVideoSceneId === scene.id && (
                                                        <div className="relative w-full bg-black">
                                                            <button
                                                                onClick={() => handleCloseVideo(scene.id)}
                                                                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            <video
                                                                ref={(el) => {
                                                                    if (el) videoRefs.current.set(scene.id, el);
                                                                }}
                                                                src={scene.videoUrl}
                                                                controls
                                                                autoPlay
                                                                className="w-full h-auto"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Scene Content */}
                                                    <div className="px-4 py-3">
                                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                                            {scene.description}
                                                        </p>
                                                        {scene.characters && scene.characters.length > 0 && (
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Users className="h-4 w-4" />
                                                                <span>{scene.characters.join(", ")}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Navigation Controls */}
                                    <div className="flex items-center justify-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handlePreviousScene}
                                            className="rounded-full h-10 w-10"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {item.storyboardScenes.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentSceneIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${
                                                        idx === currentSceneIndex
                                                            ? "bg-primary w-6"
                                                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleNextScene}
                                            className="rounded-full h-10 w-10"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* List View */}
                            {viewMode === "list" && (
                                <div className="space-y-6">
                                    {item.storyboardScenes.map((scene, index) => (
                                        <div key={scene.id} className="border border-border rounded-lg overflow-hidden bg-card">
                                            {/* Scene Header */}
                                            <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg">{scene.title}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                                                                <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                    📍 {scene.location}
                                                                </span>
                                                                <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                    🕐 {scene.timeOfDay}
                                                                </span>
                                                                {scene.mood && (
                                                                    <span className="bg-background/50 px-2 py-0.5 rounded">
                                                                        😊 {scene.mood}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {scene.isAIGenerated && (
                                                        <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                                                            <Sparkles className="h-3 w-3" />
                                                            AI
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Scene Image */}
                                            {scene.image && (
                                                <div className="relative w-full bg-muted group">
                                                    <img
                                                        src={scene.image}
                                                        alt={scene.title}
                                                        className="w-full h-auto object-cover max-h-[600px]"
                                                    />
                                                    {/* Video Play Button */}
                                                    {scene.videoUrl && (
                                                        <div
                                                            className="absolute top-4 right-4 z-10"
                                                            onClick={() => handlePlayVideo(scene.id)}
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border-2 border-white dark:border-black flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors cursor-pointer">
                                                                <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Video Player */}
                                            {scene.videoUrl && expandedVideoSceneId === scene.id && (
                                                <div className="relative w-full bg-black">
                                                    <button
                                                        onClick={() => handleCloseVideo(scene.id)}
                                                        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <video
                                                        ref={(el) => {
                                                            if (el) videoRefs.current.set(scene.id, el);
                                                        }}
                                                        src={scene.videoUrl}
                                                        controls
                                                        autoPlay
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            )}

                                            {/* Scene Content */}
                                            <div className="px-4 py-3">
                                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                                    {scene.description}
                                                </p>
                                                {scene.characters && scene.characters.length > 0 && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Users className="h-4 w-4" />
                                                        <span>{scene.characters.join(", ")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Characters Section */}
                    {item.characterRefs && item.characterRefs.length > 0 && (
                        <div className="mb-8 pt-6 border-t border-border">
                            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                {t("characters.title")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.characterRefs.map((char) => {
                                    const name = char.character?.name || "Unknown Character";
                                    const avatar = char.character?.avatar;
                                    const description = char.character?.description;

                                    return (
                                        <Link
                                            key={char.characterId}
                                            href={`/characters/${char.characterId}`}
                                            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                                        >
                                            <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                {avatar ? (
                                                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                                                        {name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-base mb-1">{name}</div>
                                                {description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Statistics and Actions Section */}
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between gap-4">
                            {/* Statistics - Left Side */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="text-muted-foreground">
                                        <span className="font-bold text-foreground text-lg mr-1">{item.likes || 0}</span> 点赞
                                    </div>
                                    <span className="text-border">•</span>
                                    <div className="text-muted-foreground">
                                        <span className="font-bold text-foreground text-lg mr-1">{item.comments || 0}</span> 评论
                                    </div>
                                    <span className="text-border">•</span>
                                    <div className="text-muted-foreground">
                                        <span className="font-bold text-foreground text-lg mr-1">{item.views || 0}</span> 浏览
                                    </div>
                                    <span className="text-border">•</span>
                                    <div className="text-muted-foreground">
                                        <span className="font-bold text-foreground text-lg mr-1">{item.forkCount || 0}</span> 分支
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - Right Side */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetailsModal(true)}
                                    className="gap-2"
                                >
                                    <Info className="h-4 w-4" />
                                    {t("storyboard_detail.additional_details")}
                                </Button>
                                {workflow && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowProcessModal(true)}
                                        className="gap-2"
                                    >
                                        <Workflow className="h-4 w-4" />
                                        {t("storyboard_detail.generation_process")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section - Aligned with Content */}
                <div id="comments-section" className="bg-card border border-border rounded-xl p-6 md:p-8">
                    <CommentList targetId={id as string} targetType="storyboard" />
                </div>
            </main>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Like */}
                        <button
                            onClick={async () => {
                                if (!user) return;
                                const prev = isLiked;
                                const prevCount = likeCount;
                                setIsLiked(!prev);
                                setLikeCount(prev ? prevCount - 1 : prevCount + 1);
                                try {
                                    if (prev) {
                                        await likes.unlike('storyboard_node', id as string);
                                    } else {
                                        await likes.like('storyboard_node', id as string);
                                    }
                                } catch (e) {
                                    console.error(e);
                                    setIsLiked(prev);
                                    setLikeCount(prevCount);
                                }
                            }}
                            className="flex items-center gap-1.5 text-sm transition-colors"
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                            <span className={isLiked ? "text-red-500" : "text-muted-foreground"}>{likeCount}</span>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <MessageSquare className="h-5 w-5" />
                            <span>{item?.comments || 0}</span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={async () => {
                                try {
                                    if (navigator.share) {
                                        await navigator.share({
                                            title: item?.title || "Storyboard",
                                            url: window.location.href,
                                        });
                                    } else {
                                        await navigator.clipboard.writeText(window.location.href);
                                        showSuccess("Link copied to clipboard");
                                    }
                                } catch (e) {
                                    if ((e as Error).name !== "AbortError") {
                                        console.error(e);
                                    }
                                }
                            }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Share2 className="h-5 w-5" />
                            <span>{shareCount}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Bookmark */}
                        <button
                            onClick={async () => {
                                if (!user) return;
                                try {
                                    const result = await bookmarks.toggleBookmark('storyboard', id as string);
                                    setIsBookmarked(result.isBookmarked);
                                } catch (e) { console.error(e); }
                            }}
                            className="p-2 transition-colors"
                        >
                            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                        </button>

                        {/* Fork */}
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowForkDialog(true)}>
                            <GitFork className="h-4 w-4" />
                            <span className="hidden sm:inline">{t("storyboard_detail.fork")}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t("storyboard_detail.additional_details")}</DialogTitle>
                    </DialogHeader>
                    {showDetailsModal && item && (
                    <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">基本信息</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Storyboard ID</div>
                                        <div className="font-mono text-xs">{item.id}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Story ID</div>
                                        <div className="font-mono text-xs">{item.storyId || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">创作者</div>
                                        <div>{item.creatorName || "Unknown"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">创作者 ID</div>
                                        <div className="font-mono text-xs">{item.creatorId || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">时间信息</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">创建时间</div>
                                        <div>{item.createdAt ? new Date(item.createdAt * 1000).toLocaleString() : "Unknown"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">更新时间</div>
                                        <div>{item.updatedAt ? new Date(item.updatedAt * 1000).toLocaleString() : "Unknown"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* AI & Workflow Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">生成信息</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">AI 生成</div>
                                        <div>{item.isAIGenerated ? "是" : "否"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">场景数量</div>
                                        <div>{item.sceneCount || item.storyboardScenes?.length || 0}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">工作流状态</div>
                                        <div className="capitalize">{item.workflowStatus || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">当前步骤</div>
                                        <div>{item.currentStep || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Token Consumption */}
                            {item.tokenConsumption && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">资源消耗</h3>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary mb-1">
                                                {item.tokenConsumption.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Tokens 消耗</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Raw Input */}
                            {item.rawInput && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">原始输入</h3>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.rawInput}</p>
                                    </div>
                                </div>
                            )}

                            {/* Parent Info */}
                            {item.parentId && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">父节点</h3>
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <div className="font-mono text-xs">{item.parentId}</div>
                                    </div>
                                </div>
                            )}
                    </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* Process Modal */}
            <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{t("storyboard_detail.generation_process")}</DialogTitle>
                    </DialogHeader>
                    {showProcessModal && item && (
                        <StoryboardRoadmap storyboard={item} />
                    )}
                </DialogContent>
            </Dialog>

            {/* No Children Dialog */}
            <Dialog open={showNoChildrenDialog} onOpenChange={setShowNoChildrenDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                            已到故事线终点
                        </DialogTitle>
                        <DialogDescription>
                            当前故事板还没有下一级分支，您已经是这个故事的最新节点了。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 p-4 bg-secondary/30 rounded-lg">
                        <p className="text-sm font-medium">您可以：</p>
                        <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                            <li>• 点击"复刻"按钮创建新的故事分支</li>
                            <li>• 点击"续写"按钮继续当前故事线</li>
                        </ul>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNoChildrenDialog(false)}>
                            知道了
                        </Button>
                        <Button
                            onClick={() => {
                                setShowNoChildrenDialog(false);
                                setShowContinueDialog(true);
                            }}
                            variant="outline"
                            className="gap-2"
                        >
                            <ArrowDown className="h-4 w-4" />
                            续写
                        </Button>
                        <Button
                            onClick={() => {
                                setShowNoChildrenDialog(false);
                                setShowForkDialog(true);
                            }}
                            className="gap-2"
                        >
                            <GitFork className="h-4 w-4" />
                            创建分支
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fork Dialog */}
            <Dialog open={showForkDialog} onOpenChange={setShowForkDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Fork Storyboard</DialogTitle>
                        <DialogDescription>
                            Create a new branch from this storyboard.
                        </DialogDescription>
                    </DialogHeader>
                    {showForkDialog && (
                        <ForkDialog
                            storyboardId={id as string}
                            currentTitle={item.title}
                            open={showForkDialog}
                            onClose={() => setShowForkDialog(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Continue Dialog */}
            <Dialog open={showContinueDialog} onOpenChange={setShowContinueDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Continue Story</DialogTitle>
                        <DialogDescription>
                            Create a continuation of this storyboard.
                        </DialogDescription>
                    </DialogHeader>
                    {showContinueDialog && (
                        <ContinueDialog
                            storyboardId={id as string}
                            open={showContinueDialog}
                            onClose={() => setShowContinueDialog(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
