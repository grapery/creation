import { useState, useEffect } from 'react';
import { Settings, MapPin, Calendar, Link as LinkIcon, Share2, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import { StoryCard } from '../components/StoryCard';
import { CharacterCard } from '../components/CharacterCard';
import { UserActivityFeed } from '../components/UserActivityFeed';
import { AvatarPreview } from '../components/AvatarPreview';
import { useAuthStore, useStoryStore, useCharacterStore } from '../stores';
import { userApi } from '../lib/api';
import { toast } from 'sonner';
import type { User } from '../stores/authStore';

interface ProfileProps {
  userId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function Profile({ userId, onNavigate }: ProfileProps) {
  const { user: currentUser } = useAuthStore();
  const { stories, getUserStories, isLoading: isLoadingStories } = useStoryStore();
  const { characters, fetchCharacters, isLoading: isLoadingCharacters } = useCharacterStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  
  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id || '';

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    if (!profileUserId) return;
    
    setIsLoading(true);
    try {
      // Load user profile
      const userResponse = await userApi.getUserProfile(profileUserId);
      const profileUser = userResponse.data.user || userResponse.data;
      setUser(profileUser);

      // Check if following
      // Note: This would require a separate API call to check follow status
      
      // Load user stories
      await getUserStories(profileUserId, 1, 20);
      
      // Load user characters
      await fetchCharacters(1, 20);
      
      // Load user activities
      try {
        const activitiesResponse = await userApi.getUserActivityList(profileUserId, 1, 20);
        const activitiesData = activitiesResponse.data.activities || activitiesResponse.data.data?.activities || activitiesResponse.data.data || [];
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      if (isFollowing) {
        await userApi.unfollowUser(user.id);
        setIsFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        await userApi.followUser(user.id);
        setIsFollowing(true);
        toast.success('Followed successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update follow status');
    }
  };

  const userStories = stories.filter(s => s.author.id === user?.id);
  const userCharacters = characters.filter(c => c.author.id === user?.id);

  const handleActivityClick = (targetId: string, targetType?: string) => {
    if (targetType === 'story') {
      onNavigate('story-detail', targetId);
    } else if (targetType === 'character') {
      onNavigate('character-viewer', targetId);
    } else if (targetType === 'user') {
      onNavigate('profile', targetId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={isOwnProfile ? "Profile" : user.displayName}
        showBack={!isOwnProfile}
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            {isOwnProfile && (
              <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
                <Settings className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div>
        {/* Profile Header */}
        <Card className="rounded-none border-x-0">
          <div className="relative">
            {/* Background Image */}
            <div className="h-32 overflow-hidden">
              {user.background ? (
                <img
                  src={user.background}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
              )}
            </div>

            {/* Profile Info */}
            <CardContent className="relative pt-0 pb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-end justify-between -mt-12">
                  <button onClick={() => setShowAvatarPreview(true)}>
                    <Avatar className="h-24 w-24 border-4 border-background cursor-pointer hover:opacity-90 transition-opacity">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>
                  </button>
                  
                  {isOwnProfile ? (
                    <Button variant="outline" size="sm" onClick={() => onNavigate('edit-profile')}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      variant={isFollowing ? 'outline' : 'default'}
                      size="sm"
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>

                <div>
                  <h2 className="mb-0.5">{user.displayName}</h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                <p>{user.bio}</p>

                <div className="flex flex-col gap-2 text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <a href={user.website} className="hover:underline text-primary">
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    className="hover:underline"
                    onClick={() => onNavigate('following-list')}
                  >
                    <span>{user.following}</span>{' '}
                    <span className="text-muted-foreground">Following</span>
                  </button>
                  <button 
                    className="hover:underline"
                    onClick={() => onNavigate('followers-list')}
                  >
                    <span>{user.followers}</span>{' '}
                    <span className="text-muted-foreground">Followers</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats - Reduced spacing */}
        <div className="grid grid-cols-3 gap-px bg-border py-2 px-4">
          <div className="text-center py-1">
            <div className="text-sm">{userStories.length}</div>
            <p className="text-muted-foreground text-sm">Stories</p>
          </div>
          <div className="text-center py-1">
            <div className="text-sm">{userCharacters.length}</div>
            <p className="text-muted-foreground text-sm">Characters</p>
          </div>
          <div className="text-center py-1">
            <div className="text-sm">{userStories.reduce((acc, s) => acc + s.likes, 0)}</div>
            <p className="text-muted-foreground text-sm">Likes</p>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="activity" className="p-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            {activities.length > 0 ? (
              <UserActivityFeed 
                activities={activities} 
                onActivityClick={handleActivityClick}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No activities yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="stories" className="space-y-3 mt-4">
            {isLoadingStories ? (
              <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
            ) : userStories.length > 0 ? (
              userStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onView={() => onNavigate('story-viewer', story.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stories yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-3 mt-4">
            {isLoadingCharacters ? (
              <div className="text-center py-8 text-muted-foreground">Loading characters...</div>
            ) : userCharacters.length > 0 ? (
              userCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onView={() => onNavigate('character-viewer', character.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No characters yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes" className="space-y-3 mt-4">
            <div className="text-center py-8 text-muted-foreground">
              Liked content feature coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Avatar Preview Dialog */}
      <AvatarPreview
        open={showAvatarPreview}
        onClose={() => setShowAvatarPreview(false)}
        imageUrl={user.avatar}
        userName={user.displayName}
      />
    </div>
  );
}