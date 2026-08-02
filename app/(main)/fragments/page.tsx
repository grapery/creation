"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, TrendingUp, Users, LayoutGrid, Rows3, Search, X } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { FragmentCard } from "@/components/fragment/fragment-card";
import { FragmentVerticalFeed } from "@/components/fragment/fragment-vertical-feed";
import { StoryFragment, FragmentListResponse } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { loginUrlWithNext } from "@/lib/auth-redirect";

type FeedTab = "discover" | "following";
type ViewMode = "grid" | "vertical";

export default function FragmentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { show: showLoginPrompt, LoginPromptModal } = useLoginPrompt();

    const [activeTab, setActiveTab] = useState<FeedTab>("discover");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<StoryFragment[]>([]);
    const [searching, setSearching] = useState(false);
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
            router.push(loginUrlWithNext("/fragments/create"));
            return;
        }
        router.push("/fragments/create");
    };

    const handleTabClick = (tab: FeedTab) => {
        if (tab === "following" && !user) {
            showLoginPrompt();
            return;
        }
        setActiveTab(tab);
    };

    const handleSearchOpen = () => {
        if (!user) {
            showLoginPrompt();
            return;
        }
        setShowSearch(true);
    };

    const tabs: { id: FeedTab; label: string; icon: typeof TrendingUp }[] = [
        { id: "discover", label: "Discover", icon: TrendingUp },
        { id: "following", label: "Following", icon: Users },
    ];

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6 md:px-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {showSearch ? (
                    <div className="flex-1 flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={async (e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value.trim().length >= 2) {
                                    setSearching(true);
                                    try {
                                        const res = await fragments.search(e.target.value);
                                        setSearchResults(res.fragments);
                                    } catch { setSearchResults([]); }
                                    finally { setSearching(false); }
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                            placeholder="Search fragments..."
                            className="flex-1 py-1 text-sm bg-transparent focus:outline-none"
                            autoFocus
                        />
                        <button onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }} className="p-1 hover:bg-muted rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Fragments</h1>
                            <p className="text-muted-foreground text-sm">Discover creative fragments from the community</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSearchOpen}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                    title="Grid view"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("vertical")}
                                    className={`p-2 transition-colors ${viewMode === "vertical" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                    title="Vertical feed"
                                >
                                    <Rows3 className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleCreateClick}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
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
            {searchQuery.trim().length >= 2 ? (
                searching ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-muted-foreground">No fragments found for &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {searchResults.map((fragment) => (
                            <FragmentCard key={fragment.id} fragment={fragment} compact />
                        ))}
                    </div>
                )
            ) : viewMode === "vertical" ? (
                <FragmentVerticalFeed tab={activeTab} />
            ) : loading && fragmentsList.length === 0 ? (
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
            <LoginPromptModal />
        </div>
    );
}
