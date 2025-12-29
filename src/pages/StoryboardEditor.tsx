import { useState, useEffect } from 'react';
import { Save, Sparkles, Image as ImageIcon, Users, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useStoryboardStore, useStoryStore } from '../stores';
import { storyboardChatApi } from '../lib/api';
import { toast } from 'sonner';

interface StoryboardEditorProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryboardEditor({ storyId, onNavigate }: StoryboardEditorProps) {
  const { currentStoryboard, fetchStoryboard } = useStoryboardStore();
  const { currentStory, fetchStory } = useStoryStore();
  
  const [title, setTitle] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
      // Try to find parent storyboard if storyId is actually a storyboard ID
      fetchStoryboard(storyId).catch(() => {
        // If not found, it's probably a story ID, which is fine
      });
    }
  }, [storyId, fetchStory, fetchStoryboard]);

  const handleStartSession = async () => {
    if (!storyId) {
      toast.error('Story ID is required');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await storyboardChatApi.startSession({ storyId });
      setSessionId(response.data.session?.id || response.data.data?.session?.id);
      
      if (response.data.message) {
        const message = response.data.message || response.data.data?.message;
        if (message.content) {
          setGeneratedContent(message.content);
        }
      }
      
      toast.success('Session started');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to start session');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId) {
      await handleStartSession();
      return;
    }

    if (!rawInput.trim()) {
      toast.error('Please enter story content');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await storyboardChatApi.sendMessage(sessionId, {
        content: rawInput,
      });
      
      const message = response.data.message || response.data.data?.message;
      if (message?.content) {
        setGeneratedContent(message.content);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !rawInput.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsSaving(true);
    try {
      const { createStoryboard } = useStoryboardStore.getState();
      const storyboard = await createStoryboard({
        storyId: storyId || currentStory?.id || '',
        title,
        rawInput,
        content: generatedContent,
        parentId: currentStoryboard?.id || null,
      });
      
      toast.success('Storyboard created successfully');
      onNavigate('storyboard-viewer', storyboard.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save storyboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader
        title="Continue Story"
        showBack
        onBack={() => onNavigate('storyboard-viewer', storyId)}
        actions={
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Parent Storyboard Context */}
        {currentStoryboard && (
          <Card>
            <CardHeader>
              <CardTitle>Continuing from:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                {currentStoryboard.scenes?.[0]?.image && (
                  <img
                    src={currentStoryboard.scenes[0].image}
                    alt={currentStoryboard.title}
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">{currentStoryboard.title}</h4>
                  {currentStoryboard.content && (
                    <p className="text-muted-foreground line-clamp-2">
                      {currentStoryboard.content}
                    </p>
                  )}
                </div>
              </div>

              {/* Characters in parent */}
              {currentStoryboard.characterRefs && currentStoryboard.characterRefs.length > 0 && (
                <div>
                  <Label className="mb-2 block">Characters Available:</Label>
                  <div className="flex flex-wrap gap-2">
                    {currentStoryboard.characterRefs.map((char: any, index: number) => (
                      <div
                        key={char.storyCharacterId || index}
                        className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5"
                      >
                        {char.avatar && (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={char.avatar} />
                            <AvatarFallback>{char.name?.[0] || 'C'}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-sm">{char.name || `Character ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* New Storyboard Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your New Chapter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Chapter Title</Label>
              <Input
                id="title"
                placeholder="Give this part a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="input">What happens next?</Label>
              <Textarea
                id="input"
                placeholder="Describe what happens in this part of the story. You can mention characters, actions, dialogue, or plot developments..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={6}
              />
              <p className="text-sm text-muted-foreground">
                This will be enhanced by AI to create a polished narrative.
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!rawInput.trim() || isGenerating}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate AI Content'}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        {generatedContent && (
          <Card>
            <CardHeader>
              <CardTitle>AI-Enhanced Narrative</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p>{generatedContent}</p>
              </div>

              <div className="space-y-2">
                <Label>Edit if needed:</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scene Setup */}
        {generatedContent && (
          <Card>
            <CardHeader>
              <CardTitle>Visual Scenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Add scenes with AI-generated images or your own uploads
              </p>

              <Button variant="outline" className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" />
                Add Scene
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pb-4">
          <Button
            variant="outline"
            onClick={() => onNavigate('storyboard-viewer', storyId)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!generatedContent}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}