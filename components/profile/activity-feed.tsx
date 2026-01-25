"use client";

import { useEffect, useState } from "react";
import { profile, UserActivity } from "@/lib/api/profile";
import { Loader2, Star, UserPlus, BookOpen, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityFeedProps {
    userId: string;
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
    const [activities, setActivities] = useState<UserActivity[]>([]);
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

    const getIcon = (type?: string) => {
        switch (type) {
            case 'story': return <BookOpen className="h-4 w-4 text-green-500" />;
            case 'character': return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'storyboard': return <BookOpen className="h-4 w-4 text-purple-500" />;
            default: return <Star className="h-4 w-4 text-yellow-500" />;
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
                        {getIcon(activity.targetType)}
                    </div>
                    <div>
                        <div className="text-sm">
                            <span>{activity.message}</span>
                            {activity.targetName && <span> <b>{activity.targetName}</b></span>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(activity.timestamp * 1000), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
