"use client";

import { Story } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";

interface StoryCardProps {
    story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
    return (
        <Link href={`/stories/${story.id}`}>
            <Card className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5">
                    {/* Story Image/Preview */}
                    <div className="relative aspect-video rounded-lg bg-muted/30 mb-4 overflow-hidden">
                        {story.coverImage ? (
                            <img
                                src={story.coverImage}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}

                        {/* Overlay with stats */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{story.likeCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        <span className="font-medium tabular-nums">{story.commentCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Story Info */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {story.title}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                {story.author && story.createdAt && (
                                    <>
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(story.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {story.tags && story.tags.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        {story.tags[0]}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
