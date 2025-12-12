import { useState } from 'react';
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
import { mockCurrentUser, mockStories, mockCharacters, mockUserActivities } from '../lib/mockData';

interface ProfileProps {
  userId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function Profile({ userId, onNavigate }: ProfileProps) {
  const user = mockCurrentUser; // In a real app, fetch based on userId
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const isOwnProfile = !userId || userId === user.id;

  const userStories = mockStories.filter(s => s.author.id === user.id);
  const userCharacters = mockCharacters.filter(c => c.author.id === user.id);

  const handleActivityClick = (targetId: string, targetType?: string) => {
    if (targetType === 'story') {
      onNavigate('story-detail', targetId);
    } else if (targetType === 'character') {
      onNavigate('character-viewer', targetId);
    } else if (targetType === 'user') {
      onNavigate('profile', targetId);
    }
  };

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
              <img
                src={user.background}
                alt="Background"
                className="w-full h-full object-cover"
              />
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
                      onClick={() => setIsFollowing(!isFollowing)}
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
            <UserActivityFeed 
              activities={mockUserActivities} 
              onActivityClick={handleActivityClick}
            />
          </TabsContent>

          <TabsContent value="stories" className="space-y-3 mt-4">
            {userStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onView={() => onNavigate('story-viewer', story.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="characters" className="space-y-3 mt-4">
            {userCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onView={() => onNavigate('character-viewer', character.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="likes" className="space-y-3 mt-4">
            <p className="text-muted-foreground text-center py-8">
              No liked content yet
            </p>
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