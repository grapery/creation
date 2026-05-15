"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, TrendingUp, Users } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { FragmentCard } from "@/components/fragment/fragment-card";
import { StoryFragment, FragmentListResponse } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";

type FeedTab = "discover" | "following";

export default function FragmentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { show: showLoginPrompt } = useLoginPrompt();

    const [activeTab, setActiveTab] = useState<FeedTab>("discover");
    const [fragmentsList, setFragmentsList] = useState<StoryFragment[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const LIMIT = 20;

    const loadFragments = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            const currentOffset = reset ? 0 : offset;
            const res: FragmentListResponse = await fragments.list({
                tab: activeTab,
                limit: LIMIT,
                offset: currentOffset,
            });
            setFragmentsList(prev => reset ? res.fragments : [...prev, ...res.fragments]);
            setHasMore(res.fragments.length >= LIMIT);
            setOffset(currentOffset + LIMIT);
        } catch (err) {
            console.error("Failed to load fragments:", err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, offset]);

    useEffect(() => {
        setOffset(0);
        loadFragments(true);
    }, [activeTab]);

    const handleCreateClick = () => {
        if (!user) {
            showLoginPrompt();
            return;
        }
        router.push("/fragments/create");
    };

    const tabs: { id: FeedTab; label: string; icon: typeof TrendingUp }[] = [
        { id: "discover", label: "Discover", icon: TrendingUp },
        { id: "following", label: "Following", icon: Users },
    ];

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6 md:px-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Fragments</h1>
                    <p className="text-muted-foreground text-sm">Discover creative fragments from the community</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create
                </button>
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

            {/* Grid */}
            {loading && fragmentsList.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="rounded-xl bg-muted animate-pulse h-[280px]" />
                    ))}
                </div>
            ) : fragmentsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No fragments yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {activeTab === "discover"
                            ? "Be the first to create a fragment!"
                            : "Follow creators to see their fragments here"}
                    </p>
                    <button onClick={handleCreateClick} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                        Create Fragment
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {fragmentsList.map((fragment) => (
                            <FragmentCard key={fragment.id} fragment={fragment} compact />
                        ))}
                    </div>

                    {/* Load more */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => loadFragments()}
                                disabled={loading}
                                className="px-6 py-2.5 border border-border bg-background hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
