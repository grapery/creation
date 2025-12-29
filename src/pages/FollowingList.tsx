import { useState, useEffect } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { userApi } from '../lib/api';
import { toast } from 'sonner';

interface FollowingListProps {
  userId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function FollowingList({ userId, onNavigate }: FollowingListProps) {
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const itemsPerPage = 20;

  useEffect(() => {
    if (userId) {
      loadFollowing();
    }
  }, [userId, currentPage]);

  const loadFollowing = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getFollowing(userId!, currentPage, itemsPerPage);
      const followingData = response.data.following || response.data.data?.following || response.data.data || [];
      
      if (currentPage === 1) {
        setFollowing(followingData);
        setFollowingStates(Object.fromEntries(followingData.map((user: any) => [user.id, true])));
      } else {
        setFollowing(prev => [...prev, ...followingData]);
        setFollowingStates(prev => ({
          ...prev,
          ...Object.fromEntries(followingData.map((user: any) => [user.id, true]))
        }));
      }
      
      setHasMore(followingData.length === itemsPerPage);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load following');
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
        setFollowing(prev => prev.filter(u => u.id !== targetUserId));
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
        title="Following"
        showBack
        onBack={() => onNavigate('profile')}
      />

      <div className="pb-20">
        {isLoading && following.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Loading following...</div>
        ) : following.length > 0 ? (
          <div className="divide-y">
            {following.map((user: any) => (
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
          <div className="text-center py-8 text-muted-foreground">Not following anyone yet</div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={loadMore}>
              Load More
            </Button>
          </div>
        )}

        {currentPage >= totalPages && mockFollowingList.length > itemsPerPage && (
          <div className="p-4 text-center text-muted-foreground">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  );
}
