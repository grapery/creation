import { useState } from 'react';
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
import { mockStories, mockPanels, mockCharacters } from '../lib/mockData';

interface StoryEditorProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryEditor({ storyId, onNavigate }: StoryEditorProps) {
  const story = storyId ? mockStories.find(s => s.id === storyId) : null;
  const panels = storyId ? mockPanels.filter(p => p.storyId === storyId) : [];

  const [title, setTitle] = useState(story?.title || '');
  const [description, setDescription] = useState(story?.description || '');
  const [genre, setGenre] = useState(story?.genre || 'Fantasy');

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={story ? 'Edit Story' : 'New Story'}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('story-viewer', storyId)}>
              <Eye className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button size="sm" className="flex-shrink-0">
            <Save className="mr-2 h-4 w-4" />
            Save
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
                    {story?.coverImage ? (
                      <img src={story.coverImage} alt="Cover" className="w-full h-full object-cover" />
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
              <h3>Panels ({panels.length})</h3>
              <Button size="sm" onClick={() => onNavigate('storyboard-editor', storyId)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Panel
              </Button>
            </div>

            {panels.length > 0 ? (
              <div className="space-y-2">
                {panels.map((panel, index) => (
                  <Card key={panel.id} className="active:scale-98 transition-transform">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                          <img src={panel.image} alt={`Panel ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span>Panel {panel.order}</span>
                            <Badge variant="secondary">{panel.type}</Badge>
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{panel.text || 'No caption'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No panels yet</p>
                  <Button onClick={() => onNavigate('storyboard-editor', storyId)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create First Panel
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3>Characters ({mockCharacters.length})</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {mockCharacters.map((character) => (
                <Card key={character.id} className="active:scale-98 transition-transform" onClick={() => onNavigate('character-editor', character.id)}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{character.name}</div>
                        <p className="text-muted-foreground truncate">{character.role}</p>
                      </div>
                      <Badge variant="secondary">{character.stories} stories</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}