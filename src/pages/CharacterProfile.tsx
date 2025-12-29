import { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle, Sparkles, Users, Zap, Plus, Pencil, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useCharacterStore, useAuthStore, useChatStore } from '../stores';
import { toast } from 'sonner';

interface CharacterProfileProps {
  characterId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function CharacterProfile({ characterId, onNavigate }: CharacterProfileProps) {
  const { currentCharacter, fetchCharacter, updateCharacter, isLoading } = useCharacterStore();
  const { user: currentUser } = useAuthStore();
  const { threads, getOrCreateThread } = useChatStore();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [showPosterDialog, setShowPosterDialog] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [posterTitle, setPosterTitle] = useState('');
  const [posterPrompt, setPosterPrompt] = useState('');
  const [posterReferenceImage, setPosterReferenceImage] = useState<string | null>(null);
  const [posters, setPosters] = useState<any[]>([]);

  useEffect(() => {
    if (characterId) {
      fetchCharacter(characterId);
    }
  }, [characterId, fetchCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      setSkills(currentCharacter.skills || []);
    }
  }, [currentCharacter]);

  const isCreator = currentCharacter?.author?.id === currentUser?.id;

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !currentCharacter) return;
    
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
    setShowSkillDialog(false);
    
    try {
      await updateCharacter(currentCharacter.id, { skills: updatedSkills });
      toast.success('Skill added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add skill');
      setSkills(skills); // Revert on error
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!currentCharacter) return;
    
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    setSkills(updatedSkills);
    
    try {
      await updateCharacter(currentCharacter.id, { skills: updatedSkills });
      toast.success('Skill removed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to remove skill');
      setSkills(skills); // Revert on error
    }
  };

  const handleStartChat = async () => {
    if (!currentCharacter?.id) return;
    
    try {
      const thread = await getOrCreateThread(currentCharacter.id);
      onNavigate('chat-conversation', thread.id);
    } catch (error: any) {
      toast.error('Failed to start chat');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReferenceImage = () => {
    setPosterReferenceImage(null);
  };

  const handleCreatePoster = () => {
    if (!currentCharacter) return;
    
    if (posterTitle.trim() && (posterPrompt.trim() || posterReferenceImage)) {
      // TODO: Implement actual poster creation API
      toast.info('Generating poster with AI...', { duration: 2000 });
      
      setTimeout(() => {
        const newPoster = {
          id: `poster-${Date.now()}`,
          characterId: currentCharacter.id,
          title: posterTitle,
          image: posterReferenceImage || currentCharacter.poster || currentCharacter.avatar || '',
          author: currentUser,
          likes: 0,
          shares: 0,
          createdAt: new Date().toISOString(),
        };
        setPosters([newPoster, ...posters]);
        setPosterTitle('');
        setPosterPrompt('');
        setPosterReferenceImage(null);
        setShowPosterDialog(false);
        toast.success('Poster created successfully');
      }, 2000);
    } else {
      toast.error('Please provide a title and either a prompt or reference image');
    }
  };

  const handleLikePoster = (posterId: string) => {
    setPosters(posters.map(p => 
      p.id === posterId ? { ...p, likes: (p.likes || 0) + 1 } : p
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading character...</div>
      </div>
    );
  }

  if (!currentCharacter) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Character not found</p>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const canCreatePoster = true; // Simplified for now

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <MobileHeader 
        title={currentCharacter.name}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            <Button variant="ghost" size="icon" onClick={() => toast.info('Share character')}>
              <Share2 className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Character Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={currentCharacter.avatar} />
                <AvatarFallback>{currentCharacter.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentCharacter.name}</h2>
                </div>
                
                {currentCharacter.description && (
                  <p className="text-muted-foreground">{currentCharacter.description}</p>
                )}
                
                {currentCharacter.author && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('profile', currentCharacter.author.id)}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={currentCharacter.author.avatar} />
                          <AvatarFallback>{currentCharacter.author.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">@{currentCharacter.author.username || 'unknown'}</span>
                      </div>
                    </Button>
                    {currentCharacter.createdAt && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          Created {new Date(currentCharacter.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {isCreator ? (
                    <Button variant="outline" size="sm" onClick={() => onNavigate('character-editor', currentCharacter.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Character
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant={isFollowing ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => {
                          setIsFollowing(!isFollowing);
                          toast.success(isFollowing ? 'Unfollowed character' : 'Following character');
                        }}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleStartChat}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Section - TODO: Implement real analytics API */}
        {isCreator && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Analytics & Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl">0</div>
                  <div className="text-sm text-muted-foreground">Users Chatted</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <MessageCircle className="h-5 w-5 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl">0</div>
                  <div className="text-sm text-muted-foreground">Messages Sent</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Zap className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl">0</div>
                  <div className="text-sm text-muted-foreground">AI Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Skills
              </CardTitle>
              {isCreator && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSkillDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Skills that define this character's personality and capabilities
            </p>
          </CardHeader>
          <CardContent>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {skill}
                    {isCreator && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No skills added yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Character Visual Identity & Promotional Posters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Promotional Posters
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Community-created promotional artwork
                </p>
              </div>
              {canCreatePoster && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPosterDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poster
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {posters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posters.map((poster: any) => (
                  <div key={poster.id} className="space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <img 
                        src={poster.image} 
                        alt={poster.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {poster.author && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={poster.author.avatar} />
                              <AvatarFallback>{poster.author.displayName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">@{poster.author.username || 'unknown'}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          className="flex items-center gap-1 text-sm hover:text-primary"
                          onClick={() => handleLikePoster(poster.id)}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{poster.likes}</span>
                        </button>
                        <button 
                          className="flex items-center gap-1 text-sm hover:text-primary"
                          onClick={() => toast.info('Share poster')}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>{poster.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No promotional posters yet
                </p>
                {canCreatePoster && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setShowPosterDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Poster
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Add a skill that defines this character's abilities or personality traits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="skill">Skill Name</Label>
              <Input
                id="skill"
                placeholder="e.g., Time Travel, Detective, Poet"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkillDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Poster Dialog */}
      <Dialog open={showPosterDialog} onOpenChange={setShowPosterDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Promotional Poster</DialogTitle>
            <DialogDescription>
              Create a promotional poster for {character.name} using text prompts, image references, or both
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="posterTitle">Poster Title *</Label>
              <Input
                id="posterTitle"
                placeholder="e.g., 'Epic Battle Scene' or 'Character Portrait'"
                value={posterTitle}
                onChange={(e) => setPosterTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="posterPrompt">AI Generation Prompt</Label>
              <Textarea
                id="posterPrompt"
                placeholder="Describe the poster you want to create (e.g., 'Create a dramatic poster showing the character in a mystical forest with glowing crystals')"
                value={posterPrompt}
                onChange={(e) => setPosterPrompt(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Describe the scene, mood, style, and any specific details you want
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="posterImage">Reference Image</Label>
                {posterReferenceImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveReferenceImage}
                    className="h-auto p-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              
              {posterReferenceImage ? (
                <div className="relative w-full aspect-video rounded-lg border-2 border-dashed overflow-hidden">
                  <img 
                    src={posterReferenceImage} 
                    alt="Reference" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <label 
                  htmlFor="posterImage"
                  className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors bg-muted/10"
                >
                  <Upload className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload reference image</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</span>
                </label>
              )}
              
              <Input
                id="posterImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image for AI to use as style or composition reference
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-sm">You can use:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Text prompt only for AI-generated posters</li>
                <li>• Reference image only to use as-is or enhance</li>
                <li>• Both for AI to generate based on your image style</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPosterDialog(false);
              setPosterTitle('');
              setPosterPrompt('');
              setPosterReferenceImage(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePoster} disabled={!posterTitle.trim() || (!posterPrompt.trim() && !posterReferenceImage)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Poster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}