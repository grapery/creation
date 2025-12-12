import { useState } from 'react';
import { Save, Sparkles, Image as ImageIcon, Users, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockStoryboards } from '../lib/mockStoryboardData';

interface StoryboardEditorProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryboardEditor({ storyId, onNavigate }: StoryboardEditorProps) {
  const parentStoryboard = storyId ? mockStoryboards[storyId] : null;
  
  const [title, setTitle] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(
        `Building upon the previous events, the story continues with ${rawInput}. ` +
        `The characters face new challenges as the narrative unfolds in unexpected ways. ` +
        `This new chapter brings depth to the overarching plot while maintaining the established tone and themes.`
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving new storyboard:', { title, rawInput, generatedContent });
    onNavigate('storyboard-viewer', storyId);
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
        {parentStoryboard && (
          <Card>
            <CardHeader>
              <CardTitle>Continuing from:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={parentStoryboard.images[0]}
                  alt={parentStoryboard.title}
                  className="w-20 h-20 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">{parentStoryboard.title}</h4>
                  <p className="text-muted-foreground line-clamp-2">
                    {parentStoryboard.content}
                  </p>
                </div>
              </div>

              {/* Characters in parent */}
              <div>
                <Label className="mb-2 block">Characters Available:</Label>
                <div className="flex flex-wrap gap-2">
                  {parentStoryboard.characters.map((char) => (
                    <div
                      key={char.id}
                      className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={char.avatar} />
                        <AvatarFallback>{char.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{char.name}</span>
                    </div>
                  ))}
                </div>
              </div>
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