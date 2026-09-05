"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bookmark as BookmarkIcon } from "lucide-react";
import { bookmarks } from "@/lib/api/interactions";
import type { Bookmark, BookmarkType, PagedBookmarks, Story, Storyboard, StoryFragment, Character } from "@/lib/types";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/require-auth";

function BookmarksContent() {
    const [activeTab, setActiveTab] = useState<BookmarkType | "all">("all");
    const [loading, setLoading] = useState(true);
    const [bookmarkData, setBookmarkData] = useState<PagedBookmarks | null>(null);

    const loadBookmarks = useCallback(async (type?: BookmarkType) => {
        setLoading(true);
        try {
            const data = await bookmarks.getMyBookmarks({ type });
            setBookmarkData(data);
        } catch (err) {
            console.error("Failed to load bookmarks:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBookmarks(activeTab === "all" ? undefined : (activeTab as BookmarkType));
    }, [activeTab, loadBookmarks]);

    const tabs: { value: BookmarkType | "all"; label: string }[] = [
        { value: "all", label: "All" },
        { value: "story", label: "Stories" },
        { value: "storyboard", label: "Storyboards" },
        { value: "fragment", label: "Fragments" },
        { value: "character", label: "Characters" },
    ];

    return (
        <div className="container max-w-6xl px-4 py-6 md:px-6 mx-auto space-y-6">
            <div className="flex items-center gap-2">
                <BookmarkIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Bookmarks</h1>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookmarkType | "all")}>
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : bookmarkData && bookmarkData.bookmarks.length > 0 ? (
                            <div className="grid gap-3">
                                {bookmarkData.bookmarks.map((bm: Bookmark) => (
                                    <BookmarkItem key={bm.id} bookmark={bm} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <BookmarkIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No bookmarks yet</p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    const getLink = () => {
        switch (bookmark.bookmarkType) {
            case "story": return `/stories/${bookmark.bookmarkId}`;
            case "storyboard": return `/storyboards/${bookmark.bookmarkId}`;
            case "fragment": return `/fragments/${bookmark.bookmarkId}`;
            case "character": return `/characters/${bookmark.bookmarkId}`;
            default: return "#";
        }
    };

    const item = bookmark.story || bookmark.storyboard || bookmark.fragment || bookmark.character;
    const card = item as Partial<Story & Storyboard & StoryFragment & Character> | undefined;
    const title = card?.title || card?.name || card?.content?.slice(0, 50) || "Untitled";

    return (
        <Link
            href={getLink()}
            className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                {card?.coverImage || card?.image || card?.avatar ? (
                    <div className="h-12 w-12 rounded bg-muted overflow-hidden flex-shrink-0">
                        <img
                            src={card?.coverImage || card?.image || card?.avatar}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{bookmark.bookmarkType}</div>
                </div>
            </div>
        </Link>
    );
}

export default function BookmarksPage() {
    return (
        <RequireAuth>
            <BookmarksContent />
        </RequireAuth>
    );
}

