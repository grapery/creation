"use client";

import { Heart, Share2, User, BookOpen } from "lucide-react";
import Image from "next/image";
import { Story } from "@/lib/types";
import { useTranslation } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { shareContent } from "@/lib/api/share";
import { showSuccess, showError } from "@/lib/toast-utils";
import { ContentModerationMenu } from "@/components/moderation/content-moderation-menu";

interface StoryDetailHeaderProps {
    story: Story;
    onLike?: () => void;
    onRead?: () => void;
    liking?: boolean;
}

export function StoryDetailHeader({ story, onLike, onRead, liking = false }: StoryDetailHeaderProps) {
    const { t } = useTranslation();
    const isPublished = story.status === 'published';

    const handleShare = async () => {
        if (!story.id) return;
        try {
            const { copied } = await shareContent({
                kind: "story",
                id: story.id,
                title: story.title,
            });
            if (copied) {
                showSuccess(t("common.link_copied", "Link copied to clipboard"));
            }
        } catch (e) {
            if ((e as Error).name !== "AbortError") {
                showError(t("common.share_failed", "Failed to share"));
            }
        }
    };

    return (
        <div className="relative mb-6">
            <div className="relative h-[80px] md:h-[120px] overflow-hidden group">
                {story.coverImage ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-md opacity-80 scale-105 transition-transform duration-700 group-hover:scale-100"
                            style={{ backgroundImage: `url(${story.coverImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-background/90" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                    </div>
                )}
            </div>

            <div className="relative container max-w-6xl px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5 -mt-[20px] md:-mt-[30px]">
                    <div className="relative flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/20 transition-transform hover:-translate-y-1 duration-300 relative">
                            {story.coverImage ? (
<Image src={story.coverImage} alt={story.title} fill sizes="100vw" className="object-cover"  priority />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 text-center">
                                    <span className="text-[10px] font-serif italic opacity-50">{story.title.substring(0, 2)}</span>
                                </div>
                            )}

                            <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.5">
                                {isPublished ? (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded-[2px] text-[6px] uppercase font-bold tracking-wider bg-green-500/90 text-white backdrop-blur-sm shadow-sm">
                                        P
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded-[2px] text-[6px] uppercase font-bold tracking-wider bg-yellow-500/90 text-white backdrop-blur-sm shadow-sm">
                                        D
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full pt-1 md:pt-2 text-center md:text-left space-y-2">
                        <div className="space-y-1">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display leading-tight">
                                {story.title}
                            </h1>

                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-muted-foreground">
                                <span>{t("common.story_by")}</span>
                                <div className="flex items-center gap-1 font-medium text-foreground">
                                    <div className="w-4 h-4 rounded-full overflow-hidden bg-secondary relative">
                                        {story.author?.avatar ? (
<Image src={story.author.avatar} alt={story.author.username} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                                        ) : (
                                            <User className="w-full h-full p-0.5" />
                                        )}
                                    </div>
                                    <span>{story.author?.displayName || story.author?.username || "Unknown Author"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 max-w-[200px] mx-auto md:mx-0 gap-2 py-1.5 border-y border-border/50">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-sm font-bold text-foreground">{story.storyboardCount || 0}</span>
                                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{t("common.stat_boards")}</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-sm font-bold text-foreground">{story.characterCount || 0}</span>
                                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{t("common.stat_chars")}</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-sm font-bold text-foreground">{story.viewCount || 0}</span>
                                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{t("common.stat_views")}</span>
                            </div>
                        </div>

                        {story.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0 md:line-clamp-2">
                                {story.description}
                            </p>
                        )}

                        <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                            <Button
                                size="sm"
                                className="h-8 rounded-full shadow-sm min-w-[100px] text-xs"
                                onClick={onRead}
                                disabled={!onRead}
                            >
                                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                                {t("story_detail.actions.read_now", "Read")}
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-full gap-1.5 px-3 text-xs"
                                onClick={onLike}
                                disabled={!onLike || liking}
                            >
                                <Heart className={`w-3.5 h-3.5 ${story.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                                <span>{story.likes || 0}</span>
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-full w-8 p-0"
                                onClick={handleShare}
                                aria-label="Share"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </Button>
                            <ContentModerationMenu
                                target={{
                                    kind: "content",
                                    contentType: "story",
                                    contentId: story.id,
                                    label: story.title,
                                    authorId: story.author?.id || (story as { creatorId?: string }).creatorId,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
