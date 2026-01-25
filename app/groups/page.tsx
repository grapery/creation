"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/layout/header";
import { groups } from "@/lib/api/groups";
import { BranchGroup, GroupInvite } from "@/lib/types";
import {
    GroupCard,
    SearchResultGroupCard,
    GroupInviteCard,
} from "@/components/group/group-card";
import { Loader2, Search, Plus, Users, Globe, Mail, Lock } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

enum Tab {
    MY_GROUPS = "my_groups",
    DISCOVER = "discover",
    INVITES = "invites",
}

export default function GroupsPage() {
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>(Tab.MY_GROUPS);
    const [myGroups, setMyGroups] = useState<BranchGroup[]>([]);
    const [discoverGroups, setDiscoverGroups] = useState<BranchGroup[]>([]);
    const [invites, setInvites] = useState<GroupInvite[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<BranchGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [myGroupsPage, setMyGroupsPage] = useState(1);
    const [discoverGroupsPage, setDiscoverGroupsPage] = useState(1);
    const [hasMoreMyGroups, setHasMoreMyGroups] = useState(false);
    const [hasMoreDiscoverGroups, setHasMoreDiscoverGroups] = useState(false);

    // Fetch data when tab changes
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === Tab.MY_GROUPS) {
                const res = await groups.getMyGroups(1, 20);
                setMyGroups(res.groups || []);
                setHasMoreMyGroups(res.groups?.length >= 20);
                setMyGroupsPage(1);
            } else if (activeTab === Tab.DISCOVER) {
                const res = await groups.getDiscoverGroups(1, 20);
                setDiscoverGroups(res.groups || []);
                setHasMoreDiscoverGroups(res.groups?.length >= 20);
                setDiscoverGroupsPage(1);
            } else if (activeTab === Tab.INVITES && user) {
                try {
                    const res = await groups.getInvites(1, 20);
                    setInvites(res.invites || []);
                } catch (e: any) {
                    // Backend might return "group not found" if /api/groups/invites is not handled and falls through to /api/groups/:id
                    if (e?.message?.includes('group not found') || e?.code === 404) {
                        console.warn('Invites endpoint not found or misrouted on backend. Defaulting to empty list.');
                        setInvites([]);
                    } else {
                        throw e; // Re-throw other errors
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch groups:", e);
        } finally {
            setLoading(false);
        }
    }, [activeTab, user]);

    // Search function with debounce
    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await groups.search(query, 1, 20);
            setSearchResults(res.groups || []);
        } catch (e) {
            console.error("Search failed:", e);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, performSearch]);

    // Initial load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Load more handler
    const loadMore = async () => {
        if (loadingMore) return;

        setLoadingMore(true);
        try {
            if (activeTab === Tab.MY_GROUPS) {
                const res = await groups.getMyGroups(myGroupsPage + 1, 20);
                setMyGroups((prev) => [...prev, ...(res.groups || [])]);
                setHasMoreMyGroups(res.groups?.length >= 20);
                setMyGroupsPage((prev) => prev + 1);
            } else if (activeTab === Tab.DISCOVER) {
                const res = await groups.getDiscoverGroups(discoverGroupsPage + 1, 20);
                setDiscoverGroups((prev) => [...prev, ...(res.groups || [])]);
                setHasMoreDiscoverGroups(res.groups?.length >= 20);
                setDiscoverGroupsPage((prev) => prev + 1);
            }
        } catch (e) {
            console.error("Failed to load more:", e);
        } finally {
            setLoadingMore(false);
        }
    };

    const isShowingSearchResults = searchQuery.trim().length > 0;
    const tabs = [
        { value: Tab.MY_GROUPS, label: t("groups.my_groups_tab") },
        { value: Tab.DISCOVER, label: t("groups.discover_tab") },
        { value: Tab.INVITES, label: t("groups.invites_tab") },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                {/* Top App Bar */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[24px] font-bold text-foreground">{t("groups.title")}</h1>
                </div>

                {/* Search and Tabs */}
                <div className="mb-6">
                    {/* Search + Create */}
                    <div className="flex items-center gap-2 mb-4">
                        {/* Search Bar */}
                        <div className="flex-1 flex items-center gap-1.5 px-3 h-10 bg-secondary/50 rounded-xl border border-border">
                            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                placeholder={t("groups.search_placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    className="flex-shrink-0"
                                >
                                    <span className="text-muted-foreground text-sm">×</span>
                                </button>
                            )}
                        </div>

                        {/* Create Group Button */}
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="flex items-center gap-2 px-5 h-10 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("groups.create_group")}</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-border flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab.value
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground/80"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.value && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="py-2">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : isShowingSearchResults ? (
                        /* Search Results */
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-4">
                                <h2 className="text-[14px] font-semibold text-foreground">Search Results</h2>
                                <span className="text-[12px] text-muted-foreground">
                                    {searchResults.length} found
                                </span>
                            </div>

                            {searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                    <p className="text-lg font-semibold text-foreground mb-2">No groups found</p>
                                    <p className="text-sm text-muted-foreground">Try a different search term</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {searchResults.map((group) => (
                                        <SearchResultGroupCard key={group.id} group={group} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activeTab === Tab.MY_GROUPS ? (
                        /* My Groups */
                        <MyGroupsContent
                            groups={myGroups}
                            loading={loading}
                            hasMore={hasMoreMyGroups}
                            onLoadMore={loadMore}
                            loadingMore={loadingMore}
                        />
                    ) : activeTab === Tab.DISCOVER ? (
                        /* Discover Groups */
                        <DiscoverGroupsContent
                            groups={discoverGroups}
                            loading={loading}
                            hasMore={hasMoreDiscoverGroups}
                            onLoadMore={loadMore}
                            loadingMore={loadingMore}
                        />
                    ) : activeTab === Tab.INVITES ? (
                        /* Invites */
                        <InvitesContent invites={invites} setInvites={setInvites} loading={loading} />
                    ) : null}
                </div>
            </main>
        </div>
    );
}

// My Groups Content
function MyGroupsContent({
    groups,
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
}: {
    groups: BranchGroup[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    loadingMore: boolean;
}) {
    if (!loading && groups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Join or create a group to collaborate with others
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <Link key={group.id} href={`/groups/${group.id}`} className="block h-full">
                        <GroupCard group={group} className="h-full hover:shadow-md transition-all duration-300" />
                    </Link>
                ))}
            </div>

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}

// Discover Groups Content
function DiscoverGroupsContent({
    groups,
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
}: {
    groups: BranchGroup[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    loadingMore: boolean;
}) {
    if (!loading && groups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Globe className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No groups to discover</h3>
                <p className="text-sm text-muted-foreground">Check back later for new public groups</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <GroupCard key={group.id} group={group} showJoinButton className="h-full hover:shadow-md transition-all duration-300" />
                ))}
            </div>

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}

// Invites Content
function InvitesContent({
    invites,
    setInvites,
    loading,
}: {
    invites: GroupInvite[];
    setInvites: (invites: GroupInvite[]) => void;
    loading: boolean;
}) {
    if (!loading && invites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Mail className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No invites</h3>
                <p className="text-sm text-muted-foreground">You'll see group invitations here</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invites.map((invite) => (
                <GroupInviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={async () => {
                        try {
                            await groups.acceptInvite(invite.id);
                            // Refresh invites
                            const res = await groups.getInvites(1, 20);
                            setInvites(res.invites || []); // Fix setInvites (param name mismatch in parent - need to fix call site if passed wrong)
                        } catch (e) {
                            console.error("Failed to accept invite:", e);
                        }
                    }}
                    onReject={async () => {
                        try {
                            await groups.rejectInvite(invite.id);
                            // Refresh invites
                            const res = await groups.getInvites(1, 20);
                            setInvites(res.invites || []);
                        } catch (e) {
                            console.error("Failed to reject invite:", e);
                        }
                    }}
                />
            ))}
        </div>
    );
}
