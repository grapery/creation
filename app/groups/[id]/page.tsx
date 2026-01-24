"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { groups, GroupActivity } from "@/lib/api/groups";
import {
    ActivityFeed,
    ActivityHeatmap,
} from "@/components/group/activity-feed";
import { ActivityHeatmap as HeatmapComponent } from "@/components/group/activity-heatmap";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Book, Heart, Globe, Lock, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchGroup, GroupMember } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Avatar } from "@/components/ui/avatar";

export default function GroupDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [group, setGroup] = useState<BranchGroup | null>(null);
    const [activities, setActivities] = useState<GroupActivity[]>([]);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<"stories" | "activity" | "members">("stories");
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function load() {
            setLoading(true);
            try {
                const [groupData, actsData, membersData] = await Promise.all([
                    groups.get(id as string),
                    groups.getActivities(id as string),
                    groups.getMembers(id as string),
                ]);
                setGroup(groupData);
                setActivities(actsData.activities || []);
                setMembers(membersData.members || []);
                setIsFollowing(groupData.isFollowing || false);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleFollow = async () => {
        if (!group) return;
        try {
            if (isFollowing) {
                await groups.unfollow(group.id);
            } else {
                await groups.follow(group.id);
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error("Failed to follow/unfollow:", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
                    <Button onClick={() => router.push("/groups")}>Go Back</Button>
                </div>
            </div>
        );
    }

    const memberCount = group.members ?? group.memberCount ?? 0;
    const storyCount = group.stories ?? group.storyCount ?? 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Immersive Header */}
            <div className="relative h-[160px]">
                {group.avatar || group.displayImage ? (
                    <>
                        <img
                            src={group.avatar || group.displayImage}
                            alt={group.name}
                            className="w-full h-full object-cover blur-xl"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-background" />
                )}
            </div>

            {/* Group Info Section */}
            <div className="px-4 -mt-11 relative z-10">
                <div className="bg-card rounded-xl border border-border p-4">
                    {/* Avatar + Actions Row */}
                    <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className="w-[88px] h-[88px] rounded-full bg-background border-4 border-background shadow-lg overflow-hidden flex-shrink-0">
                            {group.avatar || group.displayImage ? (
                                <img
                                    src={group.avatar || group.displayImage}
                                    alt={group.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                    <Users className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            {/* Title and Badge */}
                            <div className="flex items-start gap-2 mb-2">
                                <h1 className="text-[24px] font-bold text-foreground">
                                    {group.name}
                                </h1>
                                {group.isPublic !== undefined && (
                                    <span className="text-[11px] font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-full mt-2">
                                        {group.isPublic ? "Public" : "Private"}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "default" : "outline"}
                                    onClick={handleFollow}
                                    className="h-8 px-3 text-xs font-medium"
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-medium">
                                    <Share2 className="w-3 h-3 mr-1" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-semibold text-foreground">{memberCount}</span>
                            <span>members</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Book className="w-3.5 h-3.5" />
                            <span className="font-semibold text-foreground">{storyCount}</span>
                            <span>stories</span>
                        </div>
                        {group.followers !== undefined && (
                            <div className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                <span className="font-semibold text-foreground">{group.followers}</span>
                                <span>followers</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {group.description && (
                        <p className="text-[15px] text-foreground mb-2 line-clamp-4">
                            {group.description}
                        </p>
                    )}

                    {/* Creator Info */}
                    {group.creator && (
                        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
                            <span className="text-orange-500">👑</span>
                            <span>
                                Created by{" "}
                                {group.creator.displayName || group.creator.username}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 py-3 sticky top-0 bg-background z-20 border-b border-border">
                <div className="bg-secondary rounded-full p-1 border border-border inline-flex">
                    {[
                        { value: "stories", label: "Stories" },
                        { value: "activity", label: "Activity" },
                        { value: "members", label: "Members" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedTab(tab.value as any)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all",
                                selectedTab === tab.value
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 py-4 pb-8">
                {selectedTab === "stories" && (
                    <StoriesTabContent groupId={group.id} storyCount={storyCount} />
                )}
                {selectedTab === "activity" && (
                    <ActivityTabContent groupId={group.id} activities={activities} />
                )}
                {selectedTab === "members" && (
                    <MembersTabContent groupId={group.id} members={members} />
                )}
            </div>
        </div>
    );
}

// Stories Tab Content
function StoriesTabContent({ groupId, storyCount }: { groupId: string; storyCount: number }) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await groups.getStories(groupId, 1, 20);
                setStories(res.stories || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [groupId]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (stories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Book className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No stories yet</h3>
                <p className="text-sm text-muted-foreground">
                    Create the first story to get started
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-2">
            {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            {story.coverImage && (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="text-[16px] font-bold text-foreground truncate pr-2">
                                        {story.title}
                                    </h3>
                                    {story.status === 1 && (
                                        <span className="text-[12px] font-medium text-background px-2.5 py-0.5 bg-foreground rounded-full">
                                            Published
                                        </span>
                                    )}
                                </div>
                                {story.description && (
                                    <p className="text-[14px] text-foreground/70 line-clamp-2 mb-2">
                                        {story.description}
                                    </p>
                                )}
                                <p className="text-[14px] text-muted-foreground">
                                    {story.author?.displayName || story.author?.username} · {story.panels || 0} panels
                                    {story.likes && ` · ${story.likes} likes`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Activity Tab Content
function ActivityTabContent({ groupId, activities }: { groupId: string; activities: GroupActivity[] }) {
    const [heatmap, setHeatmap] = useState<any>(null);

    useEffect(() => {
        async function load() {
            try {
                const hm = await groups.getHeatmap(groupId);
                setHeatmap(hm);
            } catch (e) {
                console.error(e);
            }
        }
        load();
    }, [groupId]);

    return (
        <div className="space-y-4">
            {/* Heatmap */}
            <Card>
                <CardContent className="p-4">
                    {heatmap ? <HeatmapComponent data={heatmap} /> : <div className="text-sm text-muted-foreground">No activity data</div>}
                </CardContent>
            </Card>

            {/* Activity Feed */}
            <div className="max-w-2xl mx-auto">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Group activity will appear here
                        </p>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-4">
                            <ActivityFeed activities={activities} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Members Tab Content
function MembersTabContent({ groupId, members }: { groupId: string; members: GroupMember[] }) {
    return (
        <div className="max-w-2xl mx-auto">
            {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No members yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Invite members to join this group
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {members.map((member) => (
                        <Card key={member.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                                        {member.user.avatar ? (
                                            <img
                                                src={member.user.avatar}
                                                alt={member.user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-foreground">
                                                {member.user.username[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[16px] font-semibold text-foreground">
                                            {member.user.displayName || member.user.username}
                                        </h4>
                                        <p className="text-[14px] text-muted-foreground">
                                            @{member.user.username}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={cn(
                                                "text-[12px] font-medium px-2 h-5 flex items-center rounded",
                                                member.role === "admin"
                                                    ? "bg-foreground text-background"
                                                    : "bg-secondary text-foreground"
                                            )}
                                        >
                                            {member.role === "admin" ? "Admin" : "Member"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
