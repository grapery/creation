"use client";

import { GroupActivity } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ActivityAvatar({ src, name }: { src?: string, name: string }) {
    return (
        <Avatar>
            <AvatarImage src={src} alt={name} />
            <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}

export function ActivityFeed({ activities, userId }: { activities: GroupActivity[], userId?: string }) {
    if (!activities || activities.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No recent activity</div>;
    }

    const getActivityMessage = (activity: GroupActivity) => {
        switch (activity.type) {
            case 'story_created':
                return "created a new story";
            case 'storyboard_created':
                return "created a new storyboard";
            case 'member_joined':
                return "joined the group";
            case 'panel_added':
                return "added a panel to";
            case 'comment':
                return "commented on";
            default:
                return "performed an action";
        }
    };

    return (
        <div className="space-y-6">
            {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                    <ActivityAvatar src={activity.user.avatar} name={activity.user.displayName || activity.user.username || "U"} />
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{activity.user.displayName || activity.user.username}</span>
                            <span className="text-muted-foreground text-xs">• {formatDistanceToNow(new Date(activity.createdAt * 1000))} ago</span>
                        </div>
                        <p className="text-sm text-foreground/90">{getActivityMessage(activity)}</p>
                        {activity.targetId && (activity.type === 'story_created' || activity.type === 'storyboard_created') && (
                            <Link href={`/${activity.type === 'story_created' ? 'stories' : 'storyboards'}/${activity.targetId}`} className="block mt-2 p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors">
                                <div className="font-medium text-sm flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
                                        {activity.type === 'story_created' ? 'Story' : 'Storyboard'}
                                    </span>
                                    {activity.targetName}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
