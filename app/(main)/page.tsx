"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Loader2, Compass, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { GuestDiscoverFeed } from "@/components/discover/guest-discover-feed";
import { loginUrlWithNext } from "@/lib/auth-redirect";

enum Tab {
  STORYBOARDS = "storyboards",
  FOLLOWING = "following",
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STORYBOARDS);
  const [items, setItems] = useState<Storyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { show: showLoginPrompt, LoginPromptModal } = useLoginPrompt();

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setPage(1);
      try {
        if (activeTab === Tab.STORYBOARDS) {
          const res = await storyboards.getDashboardStoryboards();
          setItems(res.storyboards || []);
          setHasMore((res.storyboards || []).length >= 20);
        } else if (activeTab === Tab.FOLLOWING) {
          const res = await storyboards.getFeed(1, 20, "following");
          setItems(res.storyboards || []);
          setHasMore((res.storyboards || []).length >= 20);
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, user]);

  const tabs = [
    { value: Tab.STORYBOARDS, label: t("dashboard.start_here") },
    { value: Tab.FOLLOWING, label: t("dashboard.following") },
  ];

  if (authLoading) {
    return (
      <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  // Guests: Discover via public/optional-auth APIs (aligned with iOS Voyager)
  if (!user) {
    return (
      <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
        <GuestDiscoverFeed />
      </main>
    );
  }

  const loadMore = async () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      let res: { storyboards?: Storyboard[] };
      if (activeTab === Tab.STORYBOARDS) {
        res = await storyboards.getDashboardStoryboards(nextPage, 20);
      } else {
        res = await storyboards.getFeed(nextPage, 20, "following");
      }
      setItems((prev) => [...prev, ...(res.storyboards || [])]);
      setPage(nextPage);
      setHasMore((res.storyboards || []).length >= 20);
    } catch (e) {
      console.error("Failed to load more:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 min-w-0 space-y-6">
          <button
            type="button"
            onClick={() => {
              if (!user) {
                router.push(loginUrlWithNext("/search"));
                return;
              }
              router.push("/search");
            }}
            className="flex w-full items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-left"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {t("discover.search_placeholder")}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/plaza"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t("dashboard.discover")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.trending_topics")}</p>
              </div>
            </Link>
            <Link
              href="/fragments"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t("navigation.sidebar.write_story")}</p>
                <p className="text-xs text-muted-foreground">{t("discover.fragments_stories")}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    if (tab.value === Tab.FOLLOWING && !user) {
                      showLoginPrompt();
                      return;
                    }
                    setActiveTab(tab.value);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === tab.value
                      ? "text-primary font-bold bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border bg-card animate-pulse">
                    <div className="aspect-[3/4] bg-muted" />
                    <div className="space-y-2 p-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-xl border border-dashed border-border bg-card/40">
                <Compass className="h-10 w-10 text-muted-foreground/60" />
                <div>
                  <p className="font-medium">
                    {activeTab === Tab.FOLLOWING ? t("dashboard.no_stories_yet", "No stories from people you follow yet") : t("dashboard.explore_empty_title", "Nothing here yet")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === Tab.FOLLOWING ? t("dashboard.following_hint", "Follow creators to see their storyboards here") : t("dashboard.explore_empty_hint", "New storyboards will appear here as the community publishes")}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/plaza")}>
                  {t("dashboard.explore_cta", "Explore the Plaza")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {items.map((board, index) => (
                  <StoryboardCard key={board.id} storyboard={board} priority={index < 3} />
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-6 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block md:col-span-4 lg:col-span-4">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
      <LoginPromptModal />
    </main>
  );
}
