"use client";

import { Storyboard } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Heart, MessageSquare, Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface StoryboardCardProps {
    storyboard: Storyboard;
}

export function StoryboardCard({ storyboard }: StoryboardCardProps) {
    return (
        <Link href={`/storyboards/${storyboard.id}`}>
            <Card className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5">
                    {/* Cover Image */}
                    <div className="relative aspect-video rounded-lg bg-muted/30 mb-4 overflow-hidden">
                        {story.coverImage ? (
                            <img
                                src={story.coverImage}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <Layers className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}

                        {/* Overlay with scene count */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <FileText className="h-3.5 w-3.5 text-white/90" />
                                    <span className="text-xs font-medium text-white tabular-nums">
                                        {story.sceneCount || 0} scenes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Storyboard Info */}
                    <div className="space-y-2.5">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {story.title}
                        </h3>

                        {/* Description */}
                        {story.description && (
                            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                {story.description}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-sm pt-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {story.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(storyboard.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Heart className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{story.likeCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{story.commentCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {story.tags && story.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {story.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {story.tags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{story.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
