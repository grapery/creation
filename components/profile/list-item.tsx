"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { MoreHorizontal, Heart, MessageSquare, Calendar, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export interface ListItemProps {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    coverIcon?: ReactNode;
    stats?: {
        likes?: number;
        comments?: number;
        views?: number;
        scenes?: number;
        createdAt?: number;
    };
    author?: {
        name: string;
        avatar?: string;
        username?: string;
    };
    actions?: ReactNode;
    onClick?: () => void;
    onMenuClick?: () => void;
}

export default function ListItem({
    title,
    description,
    coverImage,
    coverIcon,
    stats = {},
    author,
    actions,
    onClick,
    onMenuClick,
}: ListItemProps) {
    const formatCreatedAt = (timestamp?: number) => {
        if (!timestamp) return "";
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <Card className="group hover:border-primary/30 transition-all cursor-pointer" onClick={onClick}>
            <div className="p-4">
                <div className="flex gap-4">
                    {/* Left - Cover Image */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted/10 flex items-center justify-center">
                            {coverImage ? (
                                <Image src={coverImage} alt={title} width={0} height={0} className="w-full h-full object-cover" style={{ width: "100%", height: "100%" }} sizes="100vw" />
                            ) : coverIcon ? (
                                <div className="text-muted-foreground/50">
                                    {coverIcon}
                                </div>
                            ) : (
                                <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                            )}
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header: Title and Menu Button */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMenuClick?.();
                                }}
                                className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                            >
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {description}
                            </p>
                        )}

                        {/* Author and Stats */}
                        <div className="flex items-center justify-between mb-3">
                            {/* Author Info */}
                            {author && (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        {author.avatar ? (
                                            <AvatarImage src={author.avatar} alt={author.name} />
                                        ) : (
                                            <AvatarFallback className="text-xs">
                                                {author.name?.[0]?.toUpperCase() || "?"}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-foreground">
                                            {author.name}
                                        </span>
                                        {author.username && (
                                            <span className="text-xs text-muted-foreground">
                                                @{author.username}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                {stats.likes !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{stats.likes}</span>
                                    </div>
                                )}
                                {stats.comments !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{stats.comments}</span>
                                    </div>
                                )}
                                {stats.views !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium tabular-nums">{stats.views}</span>
                                        <span>views</span>
                                    </div>
                                )}
                                {stats.scenes !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{stats.scenes}</span>
                                        <span>scenes</span>
                                    </div>
                                )}
                                {stats.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{formatCreatedAt(stats.createdAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
