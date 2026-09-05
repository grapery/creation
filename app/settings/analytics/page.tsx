"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, BookOpen, Layers, Users, Heart, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/api/profile";
import { errorMessage } from "@/lib/utils";

type TimeRange = "7d" | "30d";

interface AnalyticsData {
    totalStories: number;
    totalStoryboards: number;
    totalCharacters: number;
    totalFragments: number;
    viewsThisWeek: number;
    likesThisWeek: number;
    newFollowersThisWeek: number;
}

interface SummaryCard {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

export default function CreatorAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>("7d");
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await profile.getCreatorAnalytics();
            setAnalytics(data);
        } catch (err: unknown) {
            console.error("Failed to fetch creator analytics:", err);
            setError(errorMessage(err) || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const summaryCards: SummaryCard[] = analytics
        ? [
              {
                  title: "Total Stories",
                  value: analytics.totalStories,
                  icon: BookOpen,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10",
              },
              {
                  title: "Total Storyboards",
                  value: analytics.totalStoryboards,
                  icon: Layers,
                  color: "text-purple-500",
                  bgColor: "bg-purple-500/10",
              },
              {
                  title: "Followers",
                  value: analytics.newFollowersThisWeek,
                  icon: Users,
                  color: "text-green-500",
                  bgColor: "bg-green-500/10",
              },
              {
                  title: "Likes This Week",
                  value: analytics.likesThisWeek,
                  icon: Heart,
                  color: "text-red-500",
                  bgColor: "bg-red-500/10",
              },
          ]
        : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="h-6 w-6" />
                        Creator Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track your content performance and audience growth
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                        variant={timeRange === "7d" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTimeRange("7d")}
                        className="rounded-md"
                    >
                        Last 7 days
                    </Button>
                    <Button
                        variant={timeRange === "30d" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTimeRange("30d")}
                        className="rounded-md"
                    >
                        Last 30 days
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-3">Loading analytics...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <BarChart3 className="h-12 w-12 text-muted-foreground/40" />
                        <p className="text-base font-medium text-foreground mt-4">
                            Unable to load analytics
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                            {error}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={fetchAnalytics}>
                            Try again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            {!loading && !error && analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryCards.map((card) => (
                        <Card key={card.title}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{card.title}</p>
                                        <p className="text-2xl font-bold text-foreground mt-1">
                                            {card.value.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                                        <card.icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Weekly Activity Card */}
            {!loading && !error && analytics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Weekly Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-blue-500/10">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Views</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {analytics.viewsThisWeek.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-red-500/10">
                                    <Heart className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Likes</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {analytics.likesThisWeek.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-green-500/10">
                                    <Users className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">New Followers</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {analytics.newFollowersThisWeek.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content Breakdown Card */}
            {!loading && !error && analytics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Content Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "Stories", value: analytics.totalStories, color: "bg-blue-500" },
                                { label: "Storyboards", value: analytics.totalStoryboards, color: "bg-purple-500" },
                                { label: "Characters", value: analytics.totalCharacters, color: "bg-amber-500" },
                                { label: "Fragments", value: analytics.totalFragments, color: "bg-teal-500" },
                            ].map((item) => {
                                const total = analytics.totalStories + analytics.totalStoryboards + analytics.totalCharacters + analytics.totalFragments;
                                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                                return (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-foreground">
                                                {item.label}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {item.value.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                                                style={{ width: `${Math.max(percentage, 0)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State — no content yet */}
            {!loading && !error && analytics && (
                analytics.totalStories === 0 &&
                analytics.totalStoryboards === 0 &&
                analytics.totalCharacters === 0 &&
                analytics.totalFragments === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                            <p className="text-base font-medium text-foreground mt-4">
                                No content yet
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                                Start creating stories and storyboards to see your analytics here.
                            </p>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}
