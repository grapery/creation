import { useState } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { mockFollowingList } from '../lib/mockData';

interface FollowingListProps {
  onNavigate: (page: string, id?: string) => void;
}

export function FollowingList({ onNavigate }: FollowingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>(
    Object.fromEntries(mockFollowingList.map(user => [user.id, true]))
  );
  const itemsPerPage = 20;
  
  // In a real app, this would be paginated from the server
  const totalPages = Math.ceil(mockFollowingList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = mockFollowingList.slice(startIndex, endIndex);

  const toggleFollow = (userId: string) => {
    setFollowingStates(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
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
        <div className="divide-y">
          {displayedUsers.map((user) => (
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
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="truncate">{user.displayName}</div>
                  <p className="text-muted-foreground truncate">
                    @{user.username}
                  </p>
                  <p className="text-muted-foreground">
                    {user.followers.toLocaleString()} followers
                  </p>
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

        {/* Load More / Pagination */}
        {currentPage < totalPages && (
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
