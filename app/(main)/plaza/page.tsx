"use client";

import { useState, useEffect, useCallback } from "react";
import { PlazaFeed } from "@/components/plaza/plaza-feed";
import { useTranslation } from "@/providers/language-provider";
import { TrendingUp, Clock, Sparkles, Search, Loader2 } from "lucide-react";
import { stories } from "@/lib/api/stories";
import Link from "next/link";

type PlazaTab = "discover" | "trending" | "latest";

export default function PlazaPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<PlazaTab>("discover");
    const [trendingStories, setTrendingStories] = useState<any[]>([]);
    const [latestStories, setLatestStories] = useState<any[]>([]);
    const [loadingExtra, setLoadingExtra] = useState(false);

    useEffect(() => {
        if (activeTab === "trending" && trendingStories.length === 0) {
            loadTrending();
        } else if (activeTab === "latest" && latestStories.length === 0) {
            loadLatest();
        }
    }, [activeTab]);

    const loadTrending = async () => {
        setLoadingExtra(true);
        try {
            const res = await stories.list(1, 20, "likes_count");
            setTrendingStories(res.stories || []);
        } catch { setTrendingStories([]); }
        finally { setLoadingExtra(false); }
    };

    const loadLatest = async () => {
        setLoadingExtra(true);
        try {
            const res = await stories.list(1, 20, "created_at");
            setLatestStories(res.stories || []);
        } catch { setLatestStories([]); }
        finally { setLoadingExtra(false); }
    };

    const tabs: { id: PlazaTab; label: string; icon: typeof Sparkles }[] = [
        { id: "discover", label: "Discover", icon: Sparkles },
        { id: "trending", label: "Trending", icon: TrendingUp },
        { id: "latest", label: "Latest", icon: Clock },
    ];

    return (
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 md:px-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Plaza</h1>
                <p className="text-muted-foreground text-sm">Explore stories and fragments from the community</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-2 pb-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {activeTab === "discover" ? (
                <PlazaFeed />
            ) : loadingExtra ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(activeTab === "trending" ? trendingStories : latestStories).map((story) => (
                        <Link key={story.id} href={`/stories/${story.id}`} className="block group">
                            <div className="rounded-xl overflow-hidden border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30">
                                {story.coverImage ? (
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={story.coverImage}
                                            alt={story.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center p-4">
                                        <p className="text-sm text-muted-foreground text-center line-clamp-3">{story.title}</p>
                                    </div>
                                )}
                                <div className="p-3">
                                    <p className="text-sm font-medium line-clamp-2">{story.title}</p>
                                    {story.author && (
                                        <p className="text-xs text-muted-foreground mt-1">{story.author.displayName || story.author.username}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {(activeTab === "trending" ? trendingStories : latestStories).length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <p className="text-muted-foreground">No stories found</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
