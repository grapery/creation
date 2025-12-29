import { useState, useEffect } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { userApi } from '../lib/api';
import { toast } from 'sonner';

interface FollowersListProps {
  userId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function FollowersList({ userId, onNavigate }: FollowersListProps) {
  const [followers, setFollowers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const itemsPerPage = 20;

  useEffect(() => {
    if (userId) {
      loadFollowers();
    }
  }, [userId, currentPage]);

  const loadFollowers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getFollowers(userId!, currentPage, itemsPerPage);
      const followersData = response.data.followers || response.data.data?.followers || response.data.data || [];
      
      if (currentPage === 1) {
        setFollowers(followersData);
      } else {
        setFollowers(prev => [...prev, ...followersData]);
      }
      
      setHasMore(followersData.length === itemsPerPage);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load followers');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    const isCurrentlyFollowing = followingStates[targetUserId];
    
    try {
      if (isCurrentlyFollowing) {
        await userApi.unfollowUser(targetUserId);
        setFollowingStates(prev => ({ ...prev, [targetUserId]: false }));
        toast.success('Unfollowed');
      } else {
        await userApi.followUser(targetUserId);
        setFollowingStates(prev => ({ ...prev, [targetUserId]: true }));
        toast.success('Following');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update follow status');
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader
        title="Followers"
        showBack
        onBack={() => onNavigate('profile')}
      />

      <div className="pb-20">
        {isLoading && followers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Loading followers...</div>
        ) : followers.length > 0 ? (
          <div className="divide-y">
            {followers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
              >
                <button
                  onClick={() => onNavigate('profile', user.id)}
                  className="flex-1 flex items-center gap-3 min-w-0"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.displayName?.[0] || user.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="truncate">{user.displayName || user.username || 'Unknown'}</div>
                    {user.username && (
                      <p className="text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    )}
                    {user.followers !== undefined && (
                      <p className="text-muted-foreground text-sm">
                        {user.followers.toLocaleString()} followers
                      </p>
                    )}
                  </div>
                </button>
                <Button
                  variant={followingStates[user.id] ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => toggleFollow(user.id)}
                >
                  {followingStates[user.id] ? 'Following' : 'Follow'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No followers yet</div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={loadMore}>
              Load More
            </Button>
          </div>
        )}

        {currentPage >= totalPages && mockFollowersList.length > itemsPerPage && (
          <div className="p-4 text-center text-muted-foreground">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  );
}
