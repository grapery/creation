import { BookOpen, Edit, MessageCircle, Heart, UserPlus, Image, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';

export type ActivityType = 
  | 'story_created'
  | 'story_updated'
  | 'comment_added'
  | 'story_liked'
  | 'member_joined'
  | 'panel_added'
  | 'story_published';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  storyId?: string;
  storyTitle?: string;
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  onStoryClick?: (storyId: string) => void;
}

export function ActivityFeed({ activities, onStoryClick }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'story_created':
        return <BookOpen className="h-4 w-4" />;
      case 'story_updated':
        return <Edit className="h-4 w-4" />;
      case 'comment_added':
        return <MessageCircle className="h-4 w-4" />;
      case 'story_liked':
        return <Heart className="h-4 w-4" />;
      case 'member_joined':
        return <UserPlus className="h-4 w-4" />;
      case 'panel_added':
        return <Image className="h-4 w-4" />;
      case 'story_published':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: ActivityType) => {
    switch (type) {
      case 'story_created':
      case 'story_published':
        return 'text-green-500 bg-green-500/10';
      case 'story_updated':
      case 'panel_added':
        return 'text-blue-500 bg-blue-500/10';
      case 'comment_added':
        return 'text-purple-500 bg-purple-500/10';
      case 'story_liked':
        return 'text-red-500 bg-red-500/10';
      case 'member_joined':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Group activities by story to create threads
  const groupedActivities: Array<{ storyId: string | null; activities: Activity[] }> = [];
  let currentGroup: { storyId: string | null; activities: Activity[] } | null = null;

  activities.forEach((activity) => {
    if (!currentGroup || currentGroup.storyId !== activity.storyId) {
      currentGroup = { storyId: activity.storyId || null, activities: [activity] };
      groupedActivities.push(currentGroup);
    } else {
      currentGroup.activities.push(activity);
    }
  });

  return (
    <div className="space-y-0">
      {groupedActivities.map((group, groupIndex) => (
        <div key={groupIndex} className="relative">
          {/* Thread connector line */}
          {group.activities.length > 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
          )}

          {group.activities.map((activity, activityIndex) => {
            const isFirst = activityIndex === 0;
            const isLast = activityIndex === group.activities.length - 1;
            const hasThread = group.activities.length > 1;

            return (
              <div
                key={activity.id}
                className={`relative flex gap-3 p-3 hover:bg-accent/50 transition-colors ${
                  !isLast ? 'border-b' : groupIndex < groupedActivities.length - 1 ? 'border-b-2' : ''
                }`}
              >
                {/* Activity icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(activity.type)} relative z-10`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={activity.userAvatar} />
                        <AvatarFallback>{activity.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{activity.userName}</span>
                      <span className="text-muted-foreground">{activity.message}</span>
                      {activity.storyTitle && (
                        <>
                          <span className="text-muted-foreground">"</span>
                          <button
                            onClick={() => activity.storyId && onStoryClick?.(activity.storyId)}
                            className="hover:underline text-primary"
                          >
                            {activity.storyTitle}
                          </button>
                          <span className="text-muted-foreground">"</span>
                        </>
                      )}
                    </div>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
