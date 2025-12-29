import { useState, useEffect } from 'react';
import { Save, Eye, Share2, Users, Settings, Plus, Sparkles, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { useStoryStore, useCharacterStore } from '../stores';
import { toast } from 'sonner';

interface StoryEditorProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryEditor({ storyId, onNavigate }: StoryEditorProps) {
  const { currentStory, fetchStory, createStory, updateStory, isLoading } = useStoryStore();
  const { characters, fetchCharacters } = useCharacterStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
    }
    fetchCharacters(1, 50); // Load all characters for selection
  }, [storyId, fetchStory, fetchCharacters]);

  useEffect(() => {
    if (currentStory) {
      setTitle(currentStory.title || '');
      setDescription(currentStory.description || '');
      setContent(currentStory.content || '');
    }
  }, [currentStory]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      if (storyId && currentStory) {
        // Update existing story
        await updateStory(storyId, {
          title,
          description,
          content,
        });
        toast.success('Story updated successfully');
      } else {
        // Create new story
        const newStory = await createStory({
          title,
          description,
          content,
          status: 'draft',
        });
        toast.success('Story created successfully');
        onNavigate('story-editor', newStory.id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save story');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && storyId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading story...</div>
      </div>
    );
  }

  const storyScenes = currentStory?.scenes || [];
  const storyCharacters = currentStory?.characters || [];

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={currentStory ? 'Edit Story' : 'New Story'}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            {currentStory && (
              <Button variant="ghost" size="icon" onClick={() => onNavigate('story-viewer', storyId)}>
                <Eye className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            size="sm" 
            className="flex-shrink-0"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button size="sm" variant="outline" className="flex-shrink-0">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" variant="outline" className="flex-shrink-0">
            <Users className="mr-2 h-4 w-4" />
            Collaborate
          </Button>
        </div>

        {/* Main Editor */}
        <Tabs defaultValue="details">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="panels">Panels</TabsTrigger>
            <TabsTrigger value="characters">Cast</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Story Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter story title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your story..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Horror">Horror</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {currentStory?.cover ? (
                      <img src={currentStory.cover} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-muted-foreground">Upload cover image</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Upload Cover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="panels" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3>Scenes ({storyScenes.length})</h3>
              <Button size="sm" onClick={() => onNavigate('storyboard-editor', storyId || currentStory?.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Scene
              </Button>
            </div>

            {storyScenes.length > 0 ? (
              <div className="space-y-2">
                {storyScenes.map((scene: any, index: number) => (
                  <Card 
                    key={scene.id || index} 
                    className="active:scale-98 transition-transform cursor-pointer"
                    onClick={() => onNavigate('storyboard-viewer', scene.storyboardId)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {scene.image && (
                          <div className="w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <img src={scene.image} alt={`Scene ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span>{scene.title || `Scene ${index + 1}`}</span>
                            {scene.location && (
                              <Badge variant="secondary">{scene.location}</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{scene.description || 'No description'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No scenes yet</p>
                  <Button onClick={() => onNavigate('storyboard-editor', storyId || currentStory?.id)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create First Scene
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3>Characters ({storyCharacters.length || characters.length})</h3>
              <Button size="sm" onClick={() => onNavigate('character-editor')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Character
              </Button>
            </div>

            {(storyCharacters.length > 0 || characters.length > 0) ? (
              <div className="space-y-2">
                {(storyCharacters.length > 0 ? storyCharacters : characters).map((character: any) => (
                  <Card 
                    key={character.id} 
                    className="active:scale-98 transition-transform cursor-pointer" 
                    onClick={() => onNavigate('character-editor', character.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {character.avatar && (
                          <img
                            src={character.avatar}
                            alt={character.name}
                            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{character.name}</div>
                          {character.description && (
                            <p className="text-muted-foreground truncate">{character.description}</p>
                          )}
                        </div>
                        {character.skills && character.skills.length > 0 && (
                          <Badge variant="secondary">{character.skills.length} skills</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No characters yet</p>
                  <Button onClick={() => onNavigate('character-editor')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Character
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}