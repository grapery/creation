import { BookOpen, Edit, Heart, UserPlus, Image, Sparkles, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserActivity } from '../lib/mockData';

interface UserActivityFeedProps {
  activities: UserActivity[];
  onActivityClick?: (targetId: string, targetType?: string) => void;
}

export function UserActivityFeed({ activities, onActivityClick }: UserActivityFeedProps) {
  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'story_created':
      case 'story_published':
        return <BookOpen className="h-4 w-4" />;
      case 'story_updated':
        return <Edit className="h-4 w-4" />;
      case 'story_liked':
        return <Heart className="h-4 w-4" />;
      case 'character_created':
      case 'character_updated':
        return <Users className="h-4 w-4" />;
      case 'user_followed':
        return <UserPlus className="h-4 w-4" />;
      case 'panel_added':
      case 'storyboard_created':
        return <Image className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: UserActivity['type']) => {
    switch (type) {
      case 'story_created':
      case 'story_published':
        return 'text-green-500 bg-green-500/10';
      case 'story_updated':
      case 'panel_added':
      case 'storyboard_created':
        return 'text-blue-500 bg-blue-500/10';
      case 'character_created':
      case 'character_updated':
        return 'text-purple-500 bg-purple-500/10';
      case 'story_liked':
        return 'text-red-500 bg-red-500/10';
      case 'user_followed':
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

  // Group activities by target to create threads
  const groupedActivities: Array<{ targetId: string | null; activities: UserActivity[] }> = [];
  let currentGroup: { targetId: string | null; activities: UserActivity[] } | null = null;

  activities.forEach((activity) => {
    if (!currentGroup || currentGroup.targetId !== activity.targetId) {
      currentGroup = { targetId: activity.targetId || null, activities: [activity] };
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
            const isLast = activityIndex === group.activities.length - 1;

            return (
              <div
                key={activity.id}
                className={`relative flex gap-3 p-3 hover:bg-accent/50 transition-colors ${
                  !isLast ? 'border-b' : groupIndex < groupedActivities.length - 1 ? 'border-b-2' : ''
                }`}
              >
                {/* Activity icon */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                    activity.type
                  )} relative z-10`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground">{activity.message}</span>
                      {activity.targetTitle && (
                        <>
                          <span className="text-muted-foreground">\"</span>
                          <button
                            onClick={() =>
                              activity.targetId &&
                              onActivityClick?.(activity.targetId, activity.targetType)
                            }
                            className="hover:underline text-primary truncate"
                          >
                            {activity.targetTitle}
                          </button>
                          <span className="text-muted-foreground">\"</span>
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

      {activities.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No activity yet
        </div>
      )}
    </div>
  );
}
