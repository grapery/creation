"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { GroupActivity } from "@/lib/types";
import {
    ActivityFeed,
} from "@/components/group/activity-feed";
import { ActivityHeatmap as HeatmapComponent } from "@/components/group/activity-heatmap";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Book, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import Link from "next/link";

export default function GroupDashboardPage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [activities, setActivities] = useState<GroupActivity[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [heatmap, setHeatmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            setLoading(true);
            try {
                const [actsData, storiesData, heatmapData] = await Promise.all([
                    groups.getActivities(id as string, 1, 5),
                    groups.getStories(id as string, 1, 6),
                    groups.getHeatmap(id as string),
                ]);
                setActivities(actsData.activities || []);
                setStories(storiesData.stories || []);
                setHeatmap(heatmapData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 container max-w-6xl px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Stories & Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Stories Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <Book className="w-5 h-5 text-primary" />
                                {t("group_detail.stories")}
                            </h2>
                            <Link href={`/groups/${id}/stories`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    {t("common.see_all")} <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {stories.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <Book className="w-10 h-10 text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">{t("groups.group_no_stories_yet")}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stories.map((story) => (
                                    <Card key={story.id} className="group overflow-hidden hover:shadow-md transition-all border-border/50 hover:border-border">
                                        <Link href={`/stories/${story.id}`}>
                                            <div className="flex gap-4 p-4">
                                                <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                                                    {story.coverImage ? (
                                                        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Book className="w-6 h-6 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                        {story.title}
                                                    </h3>
                                                    {story.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">
                                                            {story.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                        <span>{story.author?.displayName || "Unknown"}</span>
                                                        <span>•</span>
                                                        <span>{story.panels || 0} panels</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column: Activity & Stats */}
                <div className="space-y-8">
                    {/* Heatmap Widget */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                                {t("group_detail.activity")}
                            </h3>
                            {heatmap ? (
                                <HeatmapComponent data={heatmap} />
                            ) : (
                                <div className="text-sm text-muted-foreground">{t("groups.no_activity_yet")}</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity Feed */}
                    <div>
                        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            {t("groups.recent_activity")}
                        </h3>
                        <Card>
                            <CardContent className="p-4">
                                {activities.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        {t("groups.no_activity_yet")}
                                    </div>
                                ) : (
                                    <ActivityFeed activities={activities} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
