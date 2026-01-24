"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth-provider";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import { storyboards } from "@/lib/api/storyboards";
import { stories } from "@/lib/api/stories";
import { Storyboard, Story } from "@/lib/types";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

enum Tab {
  TRENDING = "trending",
  STORYBOARDS = "storyboards",
  FOLLOWING = "following",
  CHARACTERS = "characters",
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRENDING);
  const [items, setItems] = useState<Storyboard[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch data when tab changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (activeTab === Tab.TRENDING) {
          // Fetch trending stories (public endpoint)
          const res = await stories.getTrending();
          setTrendingStories(res.stories || []);
          setItems([]); // Clear storyboards when showing stories
        } else if (activeTab === Tab.STORYBOARDS && user) {
          // Only fetch if user is logged in
          const res = await storyboards.getDashboardStoryboards();
          setItems(res.storyboards || []);
          setTrendingStories([]); // Clear stories when showing storyboards
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
        setLoading(false);
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
  }, [activeTab, user]);

  const tabs = [
    { value: Tab.TRENDING, label: "Trending" },
    { value: Tab.STORYBOARDS, label: "Start Here", requiredAuth: true }, // "Storyboards" renamed to "Start Here" or similar? Kept "Storyboards"
    { value: Tab.FOLLOWING, label: "Following", requiredAuth: true },
    { value: Tab.CHARACTERS, label: "Characters", requiredAuth: true },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-8 md:px-6">
        {/* Tabs */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center bg-secondary/50 p-1 rounded-full backdrop-blur supports-[backdrop-filter]:bg-secondary/20">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  if (!tab.requiredAuth || user) {
                    setActiveTab(tab.value);
                  }
                }}
                disabled={tab.requiredAuth && !user}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === tab.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/80 hover:bg-background/50",
                  tab.requiredAuth && !user && "opacity-50 cursor-not-allowed"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Header for Tab */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight capitalize">
              {activeTab === Tab.STORYBOARDS ? "Community Feed" : activeTab}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !user && tabs.find(t => t.value === activeTab)?.requiredAuth ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
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
            <div className="text-center py-20 text-muted-foreground">
              No items found.
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
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
                    // Navigate to creator profile
                    router.push(`/profile/${creatorId}`);
                  }}
                />
              ))}
              {trendingStories.map((story) => (
                <div key={story.id} className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="font-bold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>❤️ {story.likes}</span>
                    <span>👥 {story.followers}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
