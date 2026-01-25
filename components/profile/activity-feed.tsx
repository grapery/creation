"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/api/profile";
import { Loader2, Star, UserPlus, BookOpen, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
    id: string;
    type: 'like_story' | 'follow' | 'create_story' | 'comment';
    userId: string;
    targetId?: string;
    targetName?: string;
    createdAt: number;
    details?: string;
}

interface ActivityFeedProps {
    userId: string;
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await profile.getActivity(userId);
                setActivities(res.activities || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [userId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'like_story': return <Star className="h-4 w-4 text-yellow-500" />;
            case 'follow': return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'create_story': return <BookOpen className="h-4 w-4 text-green-500" />;
            case 'comment': return <MessageCircle className="h-4 w-4 text-purple-500" />;
            default: return <div className="h-2 w-2 rounded-full bg-primary" />;
        }
    };

    const getDescription = (activity: Activity) => {
        switch (activity.type) {
            case 'like_story': return <span>liked a story <b>{activity.targetName}</b></span>;
            case 'follow': return <span>started following <b>{activity.targetName}</b></span>;
            case 'create_story': return <span>published a new story <b>{activity.targetName}</b></span>;
            case 'comment': return <span>commented on <b>{activity.targetName}</b></span>;
            default: return <span>performed an action</span>;
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    if (activities.length === 0) return (
        <div className="text-muted-foreground text-sm border rounded-lg p-8 text-center bg-card/50 border-dashed">
            No recent activity to show.
        </div>
    );

    return (
        <div className="space-y-4">
            {activities.map(activity => (
                <div key={activity.id} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                    <div className="mt-1 bg-secondary/50 p-2 rounded-full">
                        {getIcon(activity.type)}
                    </div>
                    <div>
                        <div className="text-sm">
                            {getDescription(activity)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(activity.createdAt * 1000), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
