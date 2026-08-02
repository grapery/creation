"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { storyboards } from "@/lib/api/storyboards";
import { request } from "@/lib/api/client";
import { Storyboard, StoryFragment, FragmentListResponse } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    FileText,
    Layers,
    Sparkles,
    PenLine,
    Clock,
    Image,
    Video,
    Film,
} from "lucide-react";

type DraftTab = "storyboards" | "fragments";

function StatusBadge({
    status,
    t,
}: {
    status: string | undefined;
    t: (key: string, fallback?: string) => string;
}) {
    switch (status) {
        case "generating":
        case "processing":
            return (
                <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                >
                    {t("drafts.status_generating", "Generating")}
                </Badge>
            );
        case "content_ready":
            return (
                <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                    {t("drafts.status_content", "Content ready")}
                </Badge>
            );
        case "images_ready":
            return (
                <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                    {t("drafts.status_images", "Images ready")}
                </Badge>
            );
        case "video_ready":
            return (
                <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                >
                    {t("drafts.status_video", "Video ready")}
                </Badge>
            );
        case "draft":
        default:
            return (
                <Badge variant="secondary">
                    {t("drafts.status_draft", "Draft")}
                </Badge>
            );
    }
}

function StatusIcon({ status }: { status: string | undefined }) {
    switch (status) {
        case "generating":
        case "processing":
            return <Loader2 className="w-4 h-4 animate-spin text-amber-500" />;
        case "content_ready":
            return <FileText className="w-4 h-4 text-blue-500" />;
        case "images_ready":
            return <Image className="w-4 h-4 text-green-500" />;
        case "video_ready":
            return <Video className="w-4 h-4 text-purple-500" />;
        default:
            return <PenLine className="w-4 h-4 text-muted-foreground" />;
    }
}

function RelativeTime({ timestamp }: { timestamp: number | undefined }) {
    if (!timestamp) return null;

    // Support both seconds and milliseconds timestamps
    const ts = timestamp > 1e12 ? timestamp : timestamp * 1000;
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let label: string;
    if (diffMins < 1) label = "Just now";
    else if (diffMins < 60) label = `${diffMins}m ago`;
    else if (diffHours < 24) label = `${diffHours}h ago`;
    else if (diffDays < 7) label = `${diffDays}d ago`;
    else label = date.toLocaleDateString();

    return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {label}
        </span>
    );
}

export default function DraftsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<DraftTab>("storyboards");
    const [draftStoryboards, setDraftStoryboards] = useState<Storyboard[]>([]);
    const [draftFragments, setDraftFragments] = useState<StoryFragment[]>([]);
    const [loadingStoryboards, setLoadingStoryboards] = useState(true);
    const [loadingFragments, setLoadingFragments] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?next=" + encodeURIComponent("/drafts"));
        }
    }, [user, authLoading, router]);

    // Load draft storyboards
    const loadDraftStoryboards = useCallback(async () => {
        setLoadingStoryboards(true);
        try {
            const res = await storyboards.getDashboardStoryboards(1, 50);
            const all = res.storyboards || [];
            // Keep items that are not published
            const drafts = all.filter(
                (sb) =>
                    !sb.workflowStatus ||
                    sb.workflowStatus === "draft" ||
                    sb.workflowStatus === "content_ready" ||
                    sb.workflowStatus === "images_ready" ||
                    sb.workflowStatus === "video_ready" ||
                    sb.workflowStatus === "generating" ||
                    sb.workflowStatus === "processing"
            );
            setDraftStoryboards(drafts);
        } catch (err) {
            console.error("Failed to load draft storyboards:", err);
        } finally {
            setLoadingStoryboards(false);
        }
    }, []);

    // Load draft fragments (user's own, filtered client-side for drafts)
    const loadDraftFragments = useCallback(async () => {
        setLoadingFragments(true);
        try {
            const res: FragmentListResponse = await request(
                "/api/fragments?tab=mine&limit=50"
            );
            const all = res.fragments || [];
            setDraftFragments(all.filter((f) => f.isDraft));
        } catch (err) {
            console.error("Failed to load draft fragments:", err);
        } finally {
            setLoadingFragments(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadDraftStoryboards();
        }
    }, [user, loadDraftStoryboards]);

    useEffect(() => {
        if (user && activeTab === "fragments") {
            loadDraftFragments();
        }
    }, [user, activeTab, loadDraftFragments]);

    // Loading state while checking auth
    if (authLoading || (!user && !authLoading)) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex items-center justify-center flex-1">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:px-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("drafts.title", "Drafts")}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Continue where you left off
                    </p>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as DraftTab)}
                >
                    <TabsList className="mb-6">
                        <TabsTrigger value="storyboards" className="gap-2">
                            <Layers className="w-4 h-4" />
                            {t("drafts.kind_storyboard", "Storyboards")}
                        </TabsTrigger>
                        <TabsTrigger value="fragments" className="gap-2">
                            <Film className="w-4 h-4" />
                            {t("drafts.kind_fragment", "Fragments")}
                        </TabsTrigger>
                    </TabsList>

                    {/* ---- Storyboards Tab ---- */}
                    <TabsContent value="storyboards">
                        {loadingStoryboards ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-4">
                                            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                                            <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                                            <div className="h-6 bg-muted rounded w-1/3" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : draftStoryboards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <Layers className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {t("drafts.empty", "No drafts")}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Start creating a storyboard to see your drafts here
                                </p>
                                <Button asChild>
                                    <Link href="/create">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Create Storyboard
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {draftStoryboards.map((sb) => (
                                    <Link
                                        key={sb.id}
                                        href={`/storyboards/${sb.id}/editor`}
                                    >
                                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-foreground truncate">
                                                            {sb.title || "Untitled"}
                                                        </h3>
                                                        {sb.content && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {sb.content.slice(0, 120)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {sb.image && (
                                                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                                            <img
                                                                src={sb.image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <StatusIcon
                                                        status={sb.workflowStatus}
                                                    />
                                                    <StatusBadge
                                                        status={sb.workflowStatus}
                                                        t={t}
                                                    />
                                                    <div className="ml-auto">
                                                        <RelativeTime
                                                            timestamp={
                                                                sb.updatedAt ||
                                                                sb.createdAt
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {sb.sceneCount !== undefined &&
                                                    sb.sceneCount > 0 && (
                                                        <div className="mt-2 text-xs text-muted-foreground">
                                                            {sb.sceneCount} scene
                                                            {sb.sceneCount !== 1
                                                                ? "s"
                                                                : ""}
                                                        </div>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* ---- Fragments Tab ---- */}
                    <TabsContent value="fragments">
                        {loadingFragments ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-4">
                                            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : draftFragments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <Film className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {t("drafts.empty", "No drafts")}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Start creating a fragment to see your drafts
                                    here
                                </p>
                                <Button asChild>
                                    <Link href="/fragments/create">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Create Fragment
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {draftFragments.map((fragment) => (
                                    <Link
                                        key={fragment.id}
                                        href={`/fragments/${fragment.id}`}
                                    >
                                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {fragment.imageUrls &&
                                                    fragment.imageUrls.length > 0 ? (
                                                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                                            <img
                                                                src={fragment.imageUrls[0]}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-md flex items-center justify-center flex-shrink-0 bg-muted">
                                                            <Film className="w-5 h-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground line-clamp-2">
                                                            {fragment.content.slice(0, 100)}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <Badge variant="secondary">
                                                                {t(
                                                                    "drafts.status_draft",
                                                                    "Draft"
                                                                )}
                                                            </Badge>
                                                            <RelativeTime
                                                                timestamp={
                                                                    fragment.updatedAt ||
                                                                    fragment.createdAt
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
