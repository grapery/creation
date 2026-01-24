"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { Story } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Clock, Heart, BookOpen } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function GroupStoriesPage() {
    const { id } = useParams();
    const [items, setItems] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const res = await groups.getStories(id as string);
                setItems(res.stories || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Group Stories</h2>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Story
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground border rounded-lg bg-card/50 border-dashed">
                    No stories yet. Be the first to start one!
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(story => (
                        <Link key={story.id} href={`/stories/${story.id}`} className="group">
                            <Card className="overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col">
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {story.cover ? (
                                        <img src={story.cover} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <BookOpen className="h-10 w-10 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                                        <Heart className="h-3 w-3 fill-current" />
                                        {story.likes || 0}
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">{story.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{story.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                                        <div className="h-5 w-5 rounded-full bg-secondary overflow-hidden">
                                            {story.author?.avatar ? (
                                                <img src={story.author.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold px-1">{story.author?.username?.[0] || "U"}</div>
                                            )}
                                        </div>
                                        <span>{story.author?.displayName || story.author?.username || "Unknown"}</span>
                                        <span>•</span>
                                        <Clock className="h-3 w-3" />
                                        <span>{story.createdAt ? formatDistanceToNow(new Date(story.createdAt)) : 'recent'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
