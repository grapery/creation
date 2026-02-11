"use client";

import { Story } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, Users, Book, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StoryCardProps {
    story: Story;
    className?: string;
}

export default function StoryCard({ story, className }: StoryCardProps) {
    const effectiveCharacterCount = story.characterCount || story.characters?.length || 0;

    return (
        <Link href={`/stories/${story.id}`}>
            <Card 
                floating 
                pressable
                className={cn("group cursor-pointer", className)}
            >
                <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4">
                        {/* Cover Image - 88x88 like iOS */}
                        <div className="relative w-[88px] h-[88px] flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                            {story.coverImage ? (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                {/* Title */}
                                <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                    {story.title}
                                </h3>

                                {/* Description */}
                                {story.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {story.description}
                                    </p>
                                )}

                                {/* Author */}
                                {story.author && (
                                    <div className="flex items-center gap-2 mb-2">
                                        {story.author.avatar ? (
                                            <img 
                                                src={story.author.avatar} 
                                                alt={story.author.displayName || story.author.username}
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        )}
                                        <span className="text-sm text-foreground font-medium truncate">
                                            {story.author.displayName || story.author.username}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Heart className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{story.likes || story.likeCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{story.followers || 0}</span>
                                </div>
                                {effectiveCharacterCount > 0 && (
                                    <div className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{effectiveCharacterCount}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Book className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{story.storyboardCount || story.panels || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
