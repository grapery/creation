"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Loader2, ArrowLeft, Sparkles, Users, Heart, MessageSquare, GitFork, Share2, Info, Workflow, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentList } from "@/components/comments/comment-list";
import { StoryboardRoadmap } from "@/components/storyboard/roadmap";
import { DetailMetadata } from "@/components/storyboard/detail-metadata";
import { useTranslation } from "@/providers/language-provider";

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
    const hasLoadedRef = useRef(false);
    const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

    useEffect(() => {
        if (!id || hasLoadedRef.current) return;

        let isMounted = true;

        async function load() {
            try {
                const data = await storyboards.get(id as string);

                if (!isMounted) return;

                setItem(data);
                // Mock workflow data - in real implementation, fetch from API
                if (data.storyboardScenes) {
                    setWorkflow({
                        rawInput: data.content,
                        content: data.content,
                        scenes: data.storyboardScenes,
                        workflowStatus: "completed",
                        tokenConsumption: 1250,
                        isAIGenerated: data.isAIGenerated || false,
                    });
                }
                hasLoadedRef.current = true;
            } catch (e) {
                console.error(e);
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
    }, [id]);

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

                        <div className="flex items-center gap-4 text-sm">
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

                            {item.isAIGenerated && (
                                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>{t("storyboard_detail.ai_generated")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    {item.content && (
                        <div className="prose dark:prose-invert max-w-none leading-relaxed text-lg mb-8 text-foreground/90">
                            <p className="whitespace-pre-wrap">{item.content}</p>
                        </div>
                    )}

                    {/* Storyboard Scenes */}
                    {item.storyboardScenes && item.storyboardScenes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <Workflow className="h-5 w-5 text-muted-foreground" />
                                {t("storyboard_detail.scenes")} ({item.storyboardScenes.length})
                            </h3>
                            {/* Single Column Layout - Show all scenes vertically */}
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

                                        {/* Scene Image - Always visible, larger */}
                                        {scene.image && (
                                            <div className="relative w-full bg-muted group">
                                                <img
                                                    src={scene.image}
                                                    alt={scene.title}
                                                    className="w-full h-auto object-cover max-h-[600px]"
                                                />
                                                {/* Video Play Button - Show if video exists */}
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

                                        {/* Video Player - Visible when expanded */}
                                        {scene.videoUrl && expandedVideoSceneId === scene.id && (
                                            <div className="relative w-full bg-black">
                                                {/* Close Button */}
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

                                        {/* Scene Content - Always show description */}
                                        <div className="px-4 py-3">
                                            {/* Description */}
                                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                                {scene.description}
                                            </p>

                                            {/* Characters in Scene */}
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
                                            href={`/profile/characters/${char.characterId}`}
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

                    {/* Statistics Section */}
                    <div className="mb-8 pt-6 border-t border-border">
                        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                            <Info className="h-5 w-5 text-muted-foreground" />
                            统计信息
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-secondary/30 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{item.likes || 0}</div>
                                <div className="text-xs text-muted-foreground">点赞</div>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{item.comments || 0}</div>
                                <div className="text-xs text-muted-foreground">评论</div>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{item.views || 0}</div>
                                <div className="text-xs text-muted-foreground">浏览</div>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{item.forkCount || 0}</div>
                                <div className="text-xs text-muted-foreground">分支</div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Workflow - Button Section */}
                    <div className="mb-8 pt-6 border-t border-border">
                        <div className="flex flex-wrap gap-3">
                            {/* Details Button */}
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailsModal(true)}
                                className="gap-2"
                            >
                                <Info className="h-4 w-4" />
                                {t("storyboard_detail.additional_details")}
                            </Button>

                            {/* Process Button */}
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

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-sm">{item.likes || 0} {t("storyboard_detail.likes")}</span>
                            <span>•</span>
                            <span className="text-sm">{item.comments || 0} {t("storyboard_detail.comments")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Heart className="h-4 w-4" />
                                {t("storyboard_detail.like")}
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                {t("storyboard_detail.comment")}
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <GitFork className="h-4 w-4" />
                                {t("storyboard_detail.fork")}
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Comments Section - Aligned with Content */}
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                    <CommentList targetId={id as string} targetType="storyboard" />
                </div>
            </main>

            {/* Details Modal */}
            {showDetailsModal && item && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-xl font-semibold">{t("storyboard_detail.additional_details")}</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6 space-y-6">
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
                    </Card>
                </div>
            )}

            {/* Process Modal */}
            {showProcessModal && item && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-xl font-semibold">{t("storyboard_detail.generation_process")}</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProcessModal(false)}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6">
                            <StoryboardRoadmap storyboard={item} />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
