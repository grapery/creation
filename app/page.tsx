"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Loader2, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useLoginPrompt } from "@/components/auth/login-prompt";

const PlazaFeed = lazy(() =>
  import("@/components/plaza/plaza-feed").then((m) => ({
    default: m.PlazaFeed,
  }))
);

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
  const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();

  // Fetch data when tab changes (authenticated only)
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        if (activeTab === Tab.STORYBOARDS) {
          const res = await storyboards.getDashboardStoryboards();
          setItems(res.storyboards || []);
        } else if (activeTab === Tab.FOLLOWING) {
          // TODO: Implement following feed
          setItems([]);
        }
      } catch (e: any) {
        console.error('Failed to fetch data:', e);
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [activeTab, user]);

  const tabs = [
    { value: Tab.STORYBOARDS, label: t("dashboard.start_here") },
    { value: Tab.FOLLOWING, label: t("dashboard.following") },
  ];

  // Unauthenticated users: show Header + Plaza content
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <PlazaFeed />
          </Suspense>
        </main>
      </div>
    );
  }

  // Authenticated users: full dashboard
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="md:col-span-8 min-w-0 space-y-6">
            {/* Quick Actions */}
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
                  <p className="text-xs text-muted-foreground">Fragments & Stories</p>
                </div>
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
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

            {/* Feed Content */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <p className="text-muted-foreground">
                    {activeTab === Tab.FOLLOWING
                      ? t("dashboard.no_stories_yet")
                      : t("empty")
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((board) => (
                    <StoryboardCard
                      key={board.id}
                      storyboard={board}
                      onTap={() => router.push(`/storyboards/${board.id}`)}
                      onLike={async () => {
                        try {
                          if (board.isLiked) {
                            await storyboards.unlike(board.id);
                          } else {
                            await storyboards.like(board.id);
                          }
                        } catch (e) {
                          console.error('Failed to like/unlike:', e);
                        }
                      }}
                      onCreatorTap={(creatorId) => {
                        router.push(`/profile/${creatorId}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block md:col-span-4 lg:col-span-4">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Login Prompt Modal */}
      <LoginPromptModal />
    </div>
  );
}
