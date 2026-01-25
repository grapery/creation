"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { Story } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Clock, Heart, BookOpen, Book } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export default function GroupStoriesPage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [items, setItems] = useState<any[]>([]);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Book className="w-6 h-6 text-primary" />
                        {t("group_detail.stories")}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {t("groups.group_description_stories", "Discover and share stories within this group")}
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("stories.create_story")}
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : items.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Book className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{t("groups.group_no_stories_yet")}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t("groups.group_no_stories_message")}
                        </p>
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            {t("stories.create_story")}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(story => (
                        <Card key={story.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
                            <Link href={`/stories/${story.id}`}>
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                    {story.coverImage ? (
                                        <img
                                            src={story.coverImage}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                            alt={story.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                                            <BookOpen className="h-10 w-10 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    {story.status === 1 && (
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
                                                {t("groups.published")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                        {story.title}
                                    </h3>
                                    {story.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                            {story.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary overflow-hidden">
                                                {story.author?.avatar ? (
                                                    <img src={story.author.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-[10px]">
                                                        {(story.author?.displayName || "U")[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground truncate max-w-[80px]">
                                                {story.author?.displayName || story.author?.username || "Unknown"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                <span>{story.likes || 0}</span>
                                            </div>
                                            <span>{story.panels || 0} {t("groups.panels")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
