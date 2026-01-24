"use client";

import { GroupActivity } from "@/lib/api/groups";
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

export function ActivityFeed({ activities }: { activities: GroupActivity[] }) {
    if (!activities || activities.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No recent activity</div>;
    }

    return (
        <div className="space-y-6">
            {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                    <ActivityAvatar src={activity.userAvatar} name={activity.userName || "U"} />
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{activity.userName}</span>
                            <span className="text-muted-foreground text-xs">• {formatDistanceToNow(new Date(activity.timestamp))} ago</span>
                        </div>
                        <p className="text-sm text-foreground/90">{activity.message}</p>
                        {activity.storyId && (
                            <Link href={`/stories/${activity.storyId}`} className="block mt-2 p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors">
                                <div className="font-medium text-sm flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">Story</span>
                                    {activity.storyTitle}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
