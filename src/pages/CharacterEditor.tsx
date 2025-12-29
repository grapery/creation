import { useState, useEffect } from 'react';
import { Save, Sparkles, MessageCircle, Video, Image, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { useCharacterStore, useChatStore } from '../stores';
import { toast } from 'sonner';

interface CharacterEditorProps {
  characterId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function CharacterEditor({ characterId, onNavigate }: CharacterEditorProps) {
  const { currentCharacter, fetchCharacter, createCharacter, updateCharacter, isLoading } = useCharacterStore();
  const { threads, fetchThreads } = useChatStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (characterId) {
      fetchCharacter(characterId);
    }
    fetchThreads();
  }, [characterId, fetchCharacter, fetchThreads]);

  useEffect(() => {
    if (currentCharacter) {
      setName(currentCharacter.name || '');
      setDescription(currentCharacter.description || '');
      setSkills(currentCharacter.skills || []);
    }
  }, [currentCharacter]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a character name');
      return;
    }

    setIsSaving(true);
    try {
      if (characterId && currentCharacter) {
        // Update existing character
        await updateCharacter(characterId, {
          name,
          description,
          skills,
        });
        toast.success('Character updated successfully');
      } else {
        // Create new character
        const newCharacter = await createCharacter({
          name,
          description,
          skills,
        });
        toast.success('Character created successfully');
        onNavigate('character-editor', newCharacter.id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save character');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleStartChat = async () => {
    if (!characterId && !currentCharacter?.id) {
      toast.error('Please save the character first');
      return;
    }

    const charId = characterId || currentCharacter?.id;
    if (!charId) return;

    try {
      // Find existing chat thread with this character
      const existingThread = threads.find(t => t.characterId === charId);
      if (existingThread) {
        onNavigate('chat-conversation', existingThread.id);
      } else {
        // Navigate to chat, which will create thread if needed
        onNavigate('chat-conversation', charId);
      }
    } catch (error: any) {
      toast.error('Failed to start chat');
    }
  };

  if (isLoading && characterId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading character...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={currentCharacter ? currentCharacter.name : 'New Character'}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            {currentCharacter && (
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
        </div>

        {/* Character Header */}
        {currentCharacter && (
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {currentCharacter.avatar && (
                  <img
                    src={currentCharacter.avatar}
                    alt={currentCharacter.name}
                    className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="mb-1">{currentCharacter.name}</h2>
                  {currentCharacter.description && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {currentCharacter.description}
                    </p>
                  )}
                  {skills.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
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
                    defaultValue={currentCharacter?.role || ''}
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
                    {currentCharacter?.avatar ? (
                      <img src={currentCharacter.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                    {currentCharacter?.poster ? (
                      <img src={currentCharacter.poster} alt="Poster" className="w-full h-full object-cover" />
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
                <CardTitle>Skills & Traits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill}>Add</Button>
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

                {currentCharacter && (
                  <Button onClick={handleStartChat} className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Test Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}