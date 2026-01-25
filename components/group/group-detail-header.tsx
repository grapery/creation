"use client";

import { useState } from "react";
import { BranchGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Users, Book, Share2, MoreHorizontal, Check, Plus, Globe, Lock } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";
import { groups } from "@/lib/api/groups";

interface GroupDetailHeaderProps {
    group: BranchGroup;
    isFollowing: boolean;
    onFollowChange: (isFollowing: boolean) => void;
}

export function GroupDetailHeader({ group, isFollowing, onFollowChange }: GroupDetailHeaderProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await groups.unfollow(group.id);
            } else {
                await groups.follow(group.id);
            }
            onFollowChange(!isFollowing);
        } catch (e) {
            console.error("Failed to follow/unfollow:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const memberCount = group.members ?? group.memberCount ?? 0;
    const storyCount = group.stories ?? group.storyCount ?? 0;

    return (
        <div className="relative mb-6">
            {/* Immersive Background Banner - Ultra Compact */}
            <div className="relative h-[80px] md:h-[120px] w-full overflow-hidden group">
                {group.avatar || group.displayImage ? (
                    <>
                        <img
                            src={group.avatar || group.displayImage}
                            alt={group.name}
                            className="w-full h-full object-cover blur-md opacity-80 scale-105 transition-transform duration-700 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-background/90" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="relative container max-w-6xl px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5 -mt-[20px] md:-mt-[30px]">
                    {/* Main Avatar (Poster Style) - Ultra Compact 2:1 Ratio */}
                    <div className="relative flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/20 transition-transform hover:-translate-y-1 duration-300 bg-background">
                            {group.avatar || group.displayImage ? (
                                <img
                                    src={group.avatar || group.displayImage}
                                    alt={group.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                    <Users className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.5">
                                {group.isPublic ? (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded-[2px] text-[6px] uppercase font-bold tracking-wider bg-green-500/90 text-white backdrop-blur-sm shadow-sm">
                                        <Globe className="w-2 h-2 mr-0.5" />
                                        PUB
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded-[2px] text-[6px] uppercase font-bold tracking-wider bg-yellow-500/90 text-white backdrop-blur-sm shadow-sm">
                                        <Lock className="w-2 h-2 mr-0.5" />
                                        PVT
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Group Info & Actions - Dark Text */}
                    <div className="flex-1 w-full pt-1 md:pt-2 text-center md:text-left space-y-2">
                        <div className="space-y-1">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display leading-tight">
                                {group.name}
                            </h1>

                            {/* Stats Inline */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="font-bold text-foreground">{memberCount}</span>
                                    <span>{t("group_detail.members")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Book className="w-3.5 h-3.5" />
                                    <span className="font-bold text-foreground">{storyCount}</span>
                                    <span>{t("group_detail.stories")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {group.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0 md:line-clamp-2">
                                {group.description}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                            <Button
                                size="sm"
                                variant={isFollowing ? "outline" : "default"}
                                onClick={handleFollow}
                                disabled={isLoading}
                                className={`min-w-[100px] h-8 rounded-full shadow-sm transition-all duration-300 text-xs ${isFollowing
                                        ? 'bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30'
                                        : 'bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1.5" />
                                ) : isFollowing ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 mr-1.5" />
                                        {t("group_detail.following")}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                                        {t("group_detail.follow")}
                                    </>
                                )}
                            </Button>

                            <Button size="sm" variant="outline" className="h-8 rounded-full gap-1.5 px-3 bg-background/80 backdrop-blur-sm text-xs">
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="sr-only">{t("group_detail.share")}</span>
                            </Button>

                            <Button size="sm" variant="ghost" className="h-8 rounded-full px-2 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
