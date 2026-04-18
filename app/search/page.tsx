"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { search } from "@/lib/api/search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";
import type { SearchResults, SearchType } from "@/lib/types";
import Link from "next/link";

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const params = useSearchParams();
    const initialQuery = params.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<SearchType>("all");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const doSearch = useCallback(async (q: string, type: SearchType, p: number) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const data = await search.search({ query: q, type, page: p, limit: 20 });
            setResults(data);
            setHasMore(data.total > p * 20);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialQuery) {
            doSearch(initialQuery, activeTab, 1);
        }
    }, [initialQuery, activeTab, doSearch]);

    const handleSearch = () => {
        setPage(1);
        doSearch(query, activeTab, 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        doSearch(query, activeTab, next);
    };

    const tabs: { value: SearchType; label: string }[] = [
        { value: "all", label: "All" },
        { value: "story", label: "Stories" },
        { value: "character", label: "Characters" },
        { value: "user", label: "Users" },
        { value: "storyboard", label: "Storyboards" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search stories, characters, users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button onClick={handleSearch} disabled={loading || !query.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SearchType)}>
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        {results ? (
                            <SearchResultsList results={results} type={tab.value} />
                        ) : (
                            !loading && (
                                <p className="text-center text-muted-foreground py-12">
                                    {initialQuery ? "No results found." : "Type something to search."}
                                </p>
                            )
                        )}
                        {loading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {hasMore && !loading && (
                            <div className="flex justify-center py-4">
                                <Button variant="outline" onClick={loadMore}>Load More</Button>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function SearchResultsList({ results, type }: { results: SearchResults; type: SearchType }) {
    const items: any[] = [
        ...(type === "all" || type === "story" ? results.stories || [] : []),
        ...(type === "all" || type === "character" ? results.characters || [] : []),
        ...(type === "all" || type === "user" ? results.users || [] : []),
        ...(type === "all" || type === "storyboard" ? results.storyboards || [] : []),
    ];

    if (items.length === 0) {
        return <p className="text-center text-muted-foreground py-12">No results found.</p>;
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={
                        item.title && item.storyId !== undefined ? `/stories/${item.id}` :
                        item.personality !== undefined ? `/characters/${item.id}` :
                        item.email !== undefined ? `/profile/${item.id}` :
                        `/storyboards/${item.id}`
                    }
                    className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                    <div className="font-medium">{item.title || item.name || item.username || item.displayName}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.description || item.bio || item.content || ""}
                    </div>
                </Link>
            ))}
        </div>
    );
}
