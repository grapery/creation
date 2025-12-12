import { TrendingUp, Clock, Star, Users, Bell, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StoryCard } from '../components/StoryCard';
import { CharacterCard } from '../components/CharacterCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MobileHeader } from '../components/MobileHeader';
import { mockStories, mockCharacters, mockGroups } from '../lib/mockData';
import { mockChatThreads } from '../lib/mockChatData';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Stories', value: '12', icon: TrendingUp, change: '+3 this month' },
    { label: 'Total Views', value: '24.5K', icon: Clock, change: '+12% this week' },
    { label: 'Followers', value: '1,247', icon: Users, change: '+34 this week' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, change: 'Top 5%' },
  ];

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
          <h2 className="mb-1">Welcome back, Alex! 👋</h2>
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
              <div className="space-y-3">
                {mockStories.slice(0, 3).map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onView={() => onNavigate('story-detail', story.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3">Popular Characters</h3>
              <div className="space-y-3">
                {mockCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onView={() => onNavigate('character-viewer', character.id)}
                    onChat={() => {
                      // Find existing chat or create new one
                      const existingThread = mockChatThreads.find(t => t.characterId === character.id);
                      if (existingThread) {
                        onNavigate('chat-conversation', existingThread.id);
                      } else {
                        onNavigate('chat-conversation', character.id);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Recent Updates from Following</h3>
              <div className="space-y-3">
                {mockStories.filter(s => s.author.id !== '1').map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onView={() => onNavigate('story-viewer', story.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-stories" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Your Stories</h3>
              <div className="space-y-3">
                {mockStories.filter(s => s.author.id === '1').map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onView={() => onNavigate('story-editor', story.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-4 mt-4">
            <div>
              <h3 className="mb-3">Your Characters</h3>
              <div className="space-y-3">
                {mockCharacters.filter(c => c.author.id === '1').map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onView={() => onNavigate('character-viewer', character.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Groups */}
        <div>
          <h3 className="mb-3">Your Groups</h3>
          <div className="space-y-3">
            {mockGroups.map((group) => (
              <Card key={group.id} className="active:scale-98 transition-transform" onClick={() => onNavigate('group-detail', group.id)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{group.name}</div>
                      <div className="text-muted-foreground">
                        {group.members} members
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{group.stories} stories</Badge>
                    {group.isPublic && <Badge variant="outline">Public</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}