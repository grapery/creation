import { useState } from 'react';
import { Save, Sparkles, MessageCircle, Video, Image, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { mockCharacters } from '../lib/mockData';
import { mockChatThreads } from '../lib/mockChatData';

interface CharacterEditorProps {
  characterId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function CharacterEditor({ characterId, onNavigate }: CharacterEditorProps) {
  const character = characterId ? mockCharacters.find(c => c.id === characterId) : null;

  const [name, setName] = useState(character?.name || '');
  const [description, setDescription] = useState(character?.description || '');
  const [traits, setTraits] = useState<string[]>(character?.traits || []);
  const [newTrait, setNewTrait] = useState('');

  const handleAddTrait = () => {
    if (newTrait.trim()) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };
  
  const handleStartChat = () => {
    // Find existing chat thread with this character
    const existingThread = mockChatThreads.find(t => t.characterId === characterId);
    if (existingThread) {
      onNavigate('chat-conversation', existingThread.id);
    } else {
      // Create new chat thread (in a real app, this would be an API call)
      onNavigate('chat-conversation', characterId);
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={character ? character.name : 'New Character'}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            {character && (
              <Button variant="ghost" size="icon" onClick={handleStartChat}>
                <MessageCircle className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="p-4 space-y-4">
        {/* Character Header */}
        {character && (
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="mb-1">{character.name}</h2>
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {character.description}
                  </p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {character.traits.slice(0, 3).map((trait) => (
                      <Badge key={trait} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={handleStartChat} className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Conversation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Editor */}
        <Tabs defaultValue="profile">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Look</TabsTrigger>
            <TabsTrigger value="personality">Traits</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Character name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your character..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="Protagonist, Antagonist, etc."
                    defaultValue={character?.role || ''}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Visual Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Character Avatar</Label>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {character?.avatar ? (
                      <img src={character.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-muted-foreground">Upload avatar</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Upload Avatar
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Full Character Poster</Label>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {character?.poster ? (
                      <img src={character.poster} alt="Poster" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-muted-foreground">Upload poster</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personality Traits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {traits.map((trait) => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTrait(trait)}
                    >
                      {trait} ×
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a trait..."
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
                  />
                  <Button onClick={handleAddTrait}>Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Chat Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Conversation Style</Label>
                  <Textarea
                    placeholder="How should this character communicate? Include tone, vocabulary, and mannerisms..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Knowledge</Label>
                  <Textarea
                    placeholder="What does this character know? Their experiences, skills, and memories..."
                    rows={4}
                  />
                </div>

                {character && (
                  <Button onClick={handleStartChat} className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Test Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <Button className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Character
        </Button>
      </div>
    </div>
  );
}