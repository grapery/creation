"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import { storyboards } from "@/lib/api/storyboards";
import { stories } from "@/lib/api/stories";
import { Storyboard, Story } from "@/lib/types";
import { Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

enum Tab {
  TRENDING = "trending",
  STORYBOARDS = "storyboards",
  FOLLOWING = "following",
  CHARACTERS = "characters",
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRENDING);
  const [items, setItems] = useState<Storyboard[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Set default tab on auth load
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setActiveTab(Tab.STORYBOARDS);
      } else {
        setActiveTab(Tab.TRENDING);
      }
    }
  }, [authLoading, user]);

  // Fetch data when tab changes - with deduplication
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    async function fetchData() {
      // Prevent duplicate fetches
      if (hasFetched) return;
      hasFetched = true;

      setLoading(true);
      try {
        if (activeTab === Tab.TRENDING) {
          // Fetch trending stories (public endpoint)
          try {
            const res = await stories.getTrending();
            // Handle different response formats
            if (res && typeof res === 'object') {
              setTrendingStories(Array.isArray(res.stories) ? res.stories : []);
            } else {
              setTrendingStories([]);
            }
            setItems([]); // Clear storyboards when showing stories
          } catch (apiError: any) {
            console.error('Failed to fetch trending stories:', apiError);
            // If trending API fails, show empty state (not error)
            setTrendingStories([]);
            setItems([]);
          }
        } else if (activeTab === Tab.STORYBOARDS && user) {
          // Only fetch if user is logged in
          try {
            const res = await storyboards.getDashboardStoryboards();
            setItems(res.storyboards || []);
            setTrendingStories([]); // Clear stories when showing storyboards
          } catch (apiError: any) {
            console.error('Failed to fetch storyboards:', apiError);
            setItems([]);
            setTrendingStories([]);
          }
        } else if (activeTab === Tab.FOLLOWING && user) {
          // res = await storyboards.getFollowing(); // Not implemented yet, using placeholder
          setItems([]);
          setTrendingStories([]);
        } else {
          setItems([]);
          setTrendingStories([]);
        }
      } catch (e: any) {
        // Log error but don't show to user
        console.error('Failed to fetch data:', e);

        // If it's a 401 error, clear data and let the login prompt show
        if (e?.code === 401 || e?.message?.includes('401') || e?.message?.includes('token')) {
          setItems([]);
          setTrendingStories([]);
        } else {
          // For other errors, also clear data
          setItems([]);
          setTrendingStories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Only fetch if we have access or it's public
    if (activeTab === Tab.TRENDING) {
      // Always fetch trending (public)
      fetchData();
    } else if (user) {
      // Fetch authenticated tabs only if user is logged in
      fetchData();
    } else {
      // User not logged in and trying to access authenticated tab
      setItems([]);
      setTrendingStories([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab, user]);

  const tabs = [
    { value: Tab.TRENDING, label: t("dashboard.trending") },
    { value: Tab.STORYBOARDS, label: t("dashboard.start_here"), requiredAuth: true },
    { value: Tab.FOLLOWING, label: t("dashboard.following"), requiredAuth: true },
    { value: Tab.CHARACTERS, label: t("navigation.characters"), requiredAuth: true },
  ];

  // Handle tab click
  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.requiredAuth && !user) {
      // Show login prompt for unauthenticated users
      setShowLoginPrompt(true);
    } else {
      setActiveTab(tab.value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container max-w-6xl px-4 py-8 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="md:col-span-8 space-y-6">
            {/* Tabs */}
            <div className="flex items-center overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab)}
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

            {/* Header for Tab - Removed or Simplified */}
            {/* <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight capitalize">
                {activeTab === Tab.STORYBOARDS ? "Community Feed" : activeTab}
              </h2>
            </div> */}

            {/* Feed Content */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !user && tabs.find(t => t.value === activeTab)?.requiredAuth ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-lg bg-card p-8">
                  <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Login Required</h3>
                  <p className="text-muted-foreground max-w-md">
                    Please login to access {activeTab} content and join the community.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              ) : items.length === 0 && trendingStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="text-muted-foreground">
                    {activeTab === Tab.TRENDING
                      ? "No trending stories at the moment. Check back later!"
                      : `No ${activeTab.toLowerCase()} found yet.`
                    }
                  </div>
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
                  {trendingStories.map((story) => (
                    <div key={story.id} className="border border-border rounded-lg p-4 bg-card">
                      <h3 className="font-bold text-lg mb-1">{story.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{story.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">❤️ {story.likes}</span>
                        <span className="flex items-center gap-1">👥 {story.followers}</span>
                      </div>
                    </div>
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
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>

              {/* Title and Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Join the Community</h3>
                <p className="text-muted-foreground">
                  Sign in to access exclusive content, create your own stories, and connect with other creators.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  asChild
                  className="flex-1"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>

              {/* Cancel Button */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowLoginPrompt(false)}
              >
                Maybe Later
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
