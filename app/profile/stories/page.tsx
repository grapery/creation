"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Story } from "@/lib/types";
import { profile } from "@/lib/api/profile";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ProfileStoriesPage() {
    const { id } = useParams();
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>("User");

    useEffect(() => {
        if (!id) return;
        async function load() {
            setLoading(true);
            try {
                const data = await profile.getStories(id as string, 1, 50);
                setStories(data.stories || []);

                // Get user name from first story author
                if (data.stories && data.stories.length > 0) {
                    const author = data.stories[0].author;
                    setUserName(author?.displayName || author?.username || "User");
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-lg font-bold text-foreground">Stories</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-foreground mb-2">No stories yet</p>
                        <p className="text-sm text-muted-foreground">
                            {userName} hasn't created any stories
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {stories.map((story) => (
                            <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <Link href={`/stories/${story.id}`}>
                                    <CardContent className="p-4">
                                        {/* Cover Image */}
                                        {story.coverImage && (
                                            <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-secondary">
                                                <img
                                                    src={story.coverImage}
                                                    alt={story.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">
                                            {story.title}
                                        </h3>

                                        {/* Description */}
                                        {story.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {story.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            {story.panels && (
                                                <span>{story.panels} panels</span>
                                            )}
                                            {story.likes && (
                                                <>
                                                    <span>·</span>
                                                    <span>{story.likes} likes</span>
                                                </>
                                            )}
                                            {story.status === 1 && (
                                                <>
                                                        <span>·</span>
                                                        <span className="text-xs font-medium text-primary">Published</span>
                                                    </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
