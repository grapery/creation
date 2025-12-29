import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Star, Users, Bell, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StoryCard } from '../components/StoryCard';
import { CharacterCard } from '../components/CharacterCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MobileHeader } from '../components/MobileHeader';
import { useAuthStore, useStoryStore, useStoryboardStore, useCharacterStore, useChatStore } from '../stores';
import { groupApi, statsApi } from '../lib/api';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuthStore();
  const { stories, fetchStories, isLoading: isLoadingStories } = useStoryStore();
  const { feed: storyboards, fetchFeed, isLoading: isLoadingStoryboards } = useStoryboardStore();
  const { characters, fetchCharacters, isLoading: isLoadingCharacters } = useCharacterStore();
  const { threads, fetchThreads, unreadCount } = useChatStore();
  
  const [stats, setStats] = useState([
    { label: 'Total Stories', value: '0', icon: TrendingUp, change: '' },
    { label: 'Total Views', value: '0', icon: Clock, change: '' },
    { label: 'Followers', value: '0', icon: Users, change: '' },
    { label: 'Avg. Rating', value: '0', icon: Star, change: '' },
  ]);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      if (user?.id) {
        try {
          const statsResponse = await statsApi.getUserStats(user.id);
          const userStats = statsResponse.data.stats || statsResponse.data;
          setStats([
            { label: 'Total Stories', value: String(userStats.storiesCount || 0), icon: TrendingUp, change: '' },
            { label: 'Total Views', value: String(userStats.totalViews || 0), icon: Clock, change: '' },
            { label: 'Followers', value: String(userStats.followersCount || 0), icon: Users, change: '' },
            { label: 'Avg. Rating', value: userStats.averageRating ? userStats.averageRating.toFixed(1) : '0', icon: Star, change: '' },
          ]);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }

      // Load content
      await Promise.all([
        fetchStories(1, 20, 'created_at'),
        fetchFeed(1, 20),
        fetchCharacters(1, 20),
        fetchThreads(),
        loadGroups(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await groupApi.listGroups(1, 10);
      const data = response.data;
      const groupsList = data.groups || data.data?.groups || data.data || [];
      setGroups(groupsList);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title="StoryForge"
        actions={
          <>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('notifications')}>
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="p-4 space-y-6">
        <div>
          <h2 className="mb-1">
            Welcome back, {user?.displayName || user?.username || 'User'}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your stories today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mb-0.5">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="trending">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="my-stories">Mine</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Trending Stories</h3>
              {isLoadingStories ? (
                <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
              ) : stories.length > 0 ? (
                <div className="space-y-3">
                  {stories.slice(0, 3).map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onView={() => onNavigate('story-detail', story.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No stories yet</div>
              )}
            </div>

            <div>
              <h3 className="mb-3">Popular Characters</h3>
              {isLoadingCharacters ? (
                <div className="text-center py-8 text-muted-foreground">Loading characters...</div>
              ) : characters.length > 0 ? (
                <div className="space-y-3">
                  {characters.slice(0, 6).map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onView={() => onNavigate('character-viewer', character.id)}
                      onChat={() => {
                        // Find existing chat or create new one
                        const existingThread = threads.find(t => t.characterId === character.id);
                        if (existingThread) {
                          onNavigate('chat-conversation', existingThread.id);
                        } else {
                          onNavigate('chat-conversation', character.id);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No characters yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Recent Updates from Following</h3>
              {isLoadingStories ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : stories.filter(s => s.author.id !== user?.id).length > 0 ? (
                <div className="space-y-3">
                  {stories.filter(s => s.author.id !== user?.id).map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onView={() => onNavigate('story-viewer', story.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No updates from following</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-stories" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Your Stories</h3>
              {isLoadingStories ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : stories.filter(s => s.author.id === user?.id).length > 0 ? (
                <div className="space-y-3">
                  {stories.filter(s => s.author.id === user?.id).map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onView={() => onNavigate('story-editor', story.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">No stories yet</p>
                  <Button onClick={() => onNavigate('create-story')}>Create Your First Story</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Your Characters</h3>
              {isLoadingCharacters ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : characters.filter(c => c.author.id === user?.id).length > 0 ? (
                <div className="space-y-3">
                  {characters.filter(c => c.author.id === user?.id).map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onView={() => onNavigate('character-viewer', character.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">No characters yet</p>
                  <Button onClick={() => onNavigate('character-editor')}>Create Your First Character</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Groups */}
        {groups.length > 0 && (
          <div>
            <h3 className="mb-3">Your Groups</h3>
            <div className="space-y-3">
              {groups.map((group) => (
                <Card key={group.id} className="active:scale-98 transition-transform cursor-pointer" onClick={() => onNavigate('group-detail', group.id)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{group.name}</div>
                        <div className="text-muted-foreground">
                          {group.memberCount || 0} members
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {group.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {group.storyCount !== undefined && (
                        <Badge variant="secondary">{group.storyCount} stories</Badge>
                      )}
                      {group.isPublic && <Badge variant="outline">Public</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}