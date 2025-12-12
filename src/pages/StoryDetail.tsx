import { useState } from 'react';
import { Users, BookOpen, Plus, Edit2, Share2, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { mockStoryCompositions, mockStoryboards, StoryboardCharacter, Scene } from '../lib/mockStoryboardData';
import { mockStories } from '../lib/mockData';

interface StoryDetailProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryDetail({ storyId, onNavigate }: StoryDetailProps) {
  // Default to first story composition if no ID provided
  const story = mockStoryCompositions[0];
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  if (!story) return null;

  // Get all storyboards for this story
  const storyboards = Object.values(mockStoryboards).filter(sb => sb.storyId === story.id);
  const rootStoryboard = mockStoryboards[story.rootStoryboardId];

  // Get all unique characters from storyboards
  const allCharacters: StoryboardCharacter[] = [];
  const characterIds = new Set<string>();
  storyboards.forEach(sb => {
    sb.characters.forEach(char => {
      if (!characterIds.has(char.id)) {
        characterIds.add(char.id);
        allCharacters.push(char);
      }
    });
  });

  // Get all unique scenes
  const allScenes: Scene[] = [];
  const sceneIds = new Set<string>();
  storyboards.forEach(sb => {
    sb.scenes.forEach(scene => {
      if (!sceneIds.has(scene.id)) {
        sceneIds.add(scene.id);
        allScenes.push(scene);
      }
    });
  });

  const handleStartReading = () => {
    onNavigate('storyboard-viewer', story.rootStoryboardId);
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader
        title={story.title}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
            <Edit2 className="h-5 w-5" />
          </Button>
        }
      />

      <div className="space-y-4 pb-4">
        {/* Cover Image */}
        <div className="relative h-64 overflow-hidden">
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">{story.theme}</Badge>
              <Badge variant="secondary">{story.genre}</Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Story Info */}
          <div>
            <p className="text-muted-foreground mb-4">{story.backgroundDescription}</p>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{story.totalStoryboards} storyboards</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>{story.totalForks} forks</span>
              </div>
            </div>

            <Button onClick={handleStartReading} className="w-full" size="lg">
              Start Reading
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="storyboards">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="storyboards">Story</TabsTrigger>
              <TabsTrigger value="characters">Cast</TabsTrigger>
              <TabsTrigger value="scenes">Scenes</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Storyboards Tab */}
            <TabsContent value="storyboards" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Story Branches</h3>
              </div>
              
              {storyboards.map((sb) => (
                <Card 
                  key={sb.id} 
                  className="active:scale-98 transition-transform"
                  onClick={() => onNavigate('storyboard-viewer', sb.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={sb.images[0]}
                        alt={sb.title}
                        className="w-20 h-20 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="line-clamp-1">{sb.title}</h4>
                          {sb.parentId && (
                            <Badge variant="outline" className="flex-shrink-0">Fork</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-2">
                          {sb.content}
                        </p>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span>{sb.likes} likes</span>
                          <span>•</span>
                          <span>{sb.views} views</span>
                          {sb.forkCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{sb.forkCount} forks</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Characters Tab */}
            <TabsContent value="characters" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Characters ({allCharacters.length})</h3>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Character
                </Button>
              </div>

              {allCharacters.map((char) => (
                <Card 
                  key={char.id}
                  className="active:scale-98 transition-transform"
                  onClick={() => onNavigate('character-viewer', char.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={char.avatar} />
                        <AvatarFallback>{char.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4>{char.name}</h4>
                        <p className="text-muted-foreground">{char.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Scenes Tab */}
            <TabsContent value="scenes" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Scenes ({allScenes.length})</h3>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Scene
                </Button>
              </div>

              {allScenes.map((scene) => (
                <Card key={scene.id}>
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={scene.image}
                        alt={scene.title}
                        className="w-24 h-24 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1">{scene.title}</h4>
                        <p className="text-muted-foreground line-clamp-2 mb-2">
                          {scene.description}
                        </p>
                        <div className="flex gap-2">
                          {scene.location && (
                            <Badge variant="secondary" className="text-xs">{scene.location}</Badge>
                          )}
                          {scene.timeOfDay && (
                            <Badge variant="secondary" className="text-xs">{scene.timeOfDay}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Team ({story.participants.length})</h3>
                <Button size="sm" variant="outline" onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </div>

              {story.participants.map((participant) => (
                <Card key={participant.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4>{participant.name}</h4>
                        <p className="text-muted-foreground">
                          {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                        </p>
                      </div>
                      <Badge variant={
                        participant.role === 'owner' ? 'default' :
                        participant.role === 'collaborator' ? 'secondary' : 'outline'
                      }>
                        {participant.role}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Story Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription>Update story information and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input defaultValue={story.title} />
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <Textarea defaultValue={story.backgroundDescription} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Input defaultValue={story.theme} />
            </div>
            <div className="space-y-2">
              <Label>Genre</Label>
              <Input defaultValue={story.genre} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setEditDialogOpen(false)} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Collaborators</DialogTitle>
            <DialogDescription>Share this story with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email or Username</Label>
              <Input placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="collaborator">Collaborator</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>
            <Button onClick={() => setInviteDialogOpen(false)} className="w-full">
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}