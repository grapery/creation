import { useState, useEffect } from 'react';
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
import { useStoryStore, useStoryboardStore, useCharacterStore, useAuthStore } from '../stores';
import { toast } from 'sonner';

interface StoryDetailProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryDetail({ storyId, onNavigate }: StoryDetailProps) {
  const { currentStory, fetchStory, isLoading: isLoadingStory } = useStoryStore();
  const { storyboards, fetchStoryboards } = useStoryboardStore();
  const { characters, fetchCharacters } = useCharacterStore();
  const { user: currentUser } = useAuthStore();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
      fetchStoryboards(1, 50); // Load all storyboards
      fetchCharacters(1, 50); // Load all characters
    }
  }, [storyId, fetchStory, fetchStoryboards, fetchCharacters]);

  if (isLoadingStory) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading story...</div>
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Story not found</p>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Get all storyboards for this story
  const storyStoryboards = storyboards.filter(sb => sb.storyId === currentStory.id);
  const rootStoryboard = storyStoryboards.find(sb => !sb.parentId) || storyStoryboards[0];

  // Get all unique characters from storyboards
  const allCharacters = characters.filter(char => 
    storyStoryboards.some(sb => sb.characterRefs?.some((ref: any) => ref.storyCharacterId === char.id))
  );

  // Get all unique scenes
  const allScenes: any[] = [];
  const sceneIds = new Set<string>();
  storyStoryboards.forEach(sb => {
    sb.scenes?.forEach((scene: any) => {
      if (!sceneIds.has(scene.id)) {
        sceneIds.add(scene.id);
        allScenes.push(scene);
      }
    });
  });

  const isOwner = currentStory.author?.id === currentUser?.id;

  const handleStartReading = () => {
    if (rootStoryboard) {
      onNavigate('storyboard-viewer', rootStoryboard.id);
    } else {
      toast.error('No storyboard available');
    }
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader
        title={currentStory.title}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            {isOwner && (
              <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
                <Edit2 className="h-5 w-5" />
              </Button>
            )}
          </>
        }
      />

      <div className="space-y-4 pb-4">
        {/* Cover Image */}
        <div className="relative h-64 overflow-hidden">
          {currentStory.cover ? (
            <img src={currentStory.cover} alt={currentStory.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {currentStory.tags && currentStory.tags.length > 0 && (
              <div className="flex gap-2 mb-2">
                {currentStory.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Story Info */}
          <div>
            {currentStory.description && (
              <p className="text-muted-foreground mb-4">{currentStory.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{storyStoryboards.length} storyboards</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>{storyStoryboards.filter(sb => sb.parentId).length} forks</span>
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
                {isOwner && (
                  <Button size="sm" variant="outline" onClick={() => onNavigate('storyboard-editor', storyId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Branch
                  </Button>
                )}
              </div>
              
              {storyStoryboards.length > 0 ? (
                storyStoryboards.map((sb) => (
                  <Card 
                    key={sb.id} 
                    className="active:scale-98 transition-transform cursor-pointer"
                    onClick={() => onNavigate('storyboard-viewer', sb.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {sb.scenes?.[0]?.image && (
                          <img
                            src={sb.scenes[0].image}
                            alt={sb.title}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="line-clamp-1">{sb.title}</h4>
                            {sb.parentId && (
                              <Badge variant="outline" className="flex-shrink-0">Fork</Badge>
                            )}
                          </div>
                          {sb.content && (
                            <p className="text-muted-foreground line-clamp-2 mb-2">
                              {sb.content}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-muted-foreground text-sm">
                            <span>{sb.likes || 0} likes</span>
                            {sb.scenes && (
                              <>
                                <span>•</span>
                                <span>{sb.scenes.length} scenes</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">No storyboards yet</p>
                    {isOwner && (
                      <Button onClick={() => onNavigate('storyboard-editor', storyId)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Storyboard
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Characters Tab */}
            <TabsContent value="characters" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Characters ({allCharacters.length})</h3>
                {isOwner && (
                  <Button size="sm" variant="outline" onClick={() => onNavigate('character-editor')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Character
                  </Button>
                )}
              </div>

              {allCharacters.length > 0 ? (
                allCharacters.map((char: any) => (
                  <Card 
                    key={char.id}
                    className="active:scale-98 transition-transform cursor-pointer"
                    onClick={() => onNavigate('character-profile', char.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {char.avatar && (
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={char.avatar} />
                            <AvatarFallback>{char.name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4>{char.name}</h4>
                          {char.description && (
                            <p className="text-muted-foreground line-clamp-1">{char.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">No characters yet</p>
                    {isOwner && (
                      <Button onClick={() => onNavigate('character-editor')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Character
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Scenes Tab */}
            <TabsContent value="scenes" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Scenes ({allScenes.length})</h3>
              </div>

              {allScenes.length > 0 ? (
                allScenes.map((scene: any) => (
                  <Card key={scene.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {scene.image && (
                          <img
                            src={scene.image}
                            alt={scene.title}
                            className="w-24 h-24 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1">{scene.title}</h4>
                          {scene.description && (
                            <p className="text-muted-foreground line-clamp-2 mb-2">
                              {scene.description}
                            </p>
                          )}
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
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No scenes yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3>Team</h3>
                {isOwner && (
                  <Button size="sm" variant="outline" onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                )}
              </div>

              {currentStory.author && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentStory.author.avatar} />
                        <AvatarFallback>{currentStory.author.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4>{currentStory.author.displayName}</h4>
                        <p className="text-muted-foreground">Creator</p>
                      </div>
                      <Badge variant="default">Owner</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
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
              <Input defaultValue={currentStory.title} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea defaultValue={currentStory.description || ''} rows={4} />
            </div>
            {currentStory.tags && currentStory.tags.length > 0 && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input defaultValue={currentStory.tags.join(', ')} />
              </div>
            )}
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