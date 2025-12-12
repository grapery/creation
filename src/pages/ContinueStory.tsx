import { useState } from 'react';
import { ArrowLeft, Minimize2, Sparkles, Wand2, Image as ImageIcon, Video, Save, Send, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockStoryboards, StoryboardCharacter } from '../lib/mockStoryboardData';

interface ContinueStoryProps {
  storyId?: string;
  parentStoryboardId?: string;
  onNavigate: (page: string, id?: string) => void;
}

interface Scene {
  id: string;
  title: string;
  content: string;
  enhancedPrompt?: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function ContinueStory({ storyId, parentStoryboardId, onNavigate }: ContinueStoryProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedScene, setSelectedScene] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 1: Storyboard Setup
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<StoryboardCharacter[]>([]);

  // Step 2-4: Scenes
  const [scenes, setScenes] = useState<Scene[]>([
    { id: '1', title: 'Scene 1', content: '' },
    { id: '2', title: 'Scene 2', content: '' },
    { id: '3', title: 'Scene 3', content: '' },
    { id: '4', title: 'Scene 4', content: '' },
  ]);

  // Step 4: Video
  const [videoConfig, setVideoConfig] = useState({
    startFrame: '',
    endFrame: '',
    duration: '2m',
  });
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Available characters from parent storyboard
  const parentStoryboard = parentStoryboardId ? mockStoryboards[parentStoryboardId] : null;
  const availableCharacters = parentStoryboard?.characters || [];

  const steps = [
    { num: 1, label: 'Setup', icon: Sparkles },
    { num: 2, label: 'Create', icon: Wand2 },
    { num: 3, label: 'Images', icon: ImageIcon },
    { num: 4, label: 'Video', icon: Video },
    { num: 5, label: 'Publish', icon: Send },
  ];

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // Mock AI generation
    setTimeout(() => {
      setTitle('Chapter 3: The Hidden Truth');
      setDescription(
        'After discovering the ancient map, our heroes venture into the forbidden forest. Strange shadows move between the trees, and whispers echo through the mist. What secrets await them in the heart of darkness?'
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleCreateStoryboard = () => {
    if (!title || !description) {
      alert('Please provide a title and description');
      return;
    }
    setCurrentStep(2);
  };

  const handleEnhanceScene = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.content) return;

    setIsGenerating(true);
    // Mock AI enhancement
    setTimeout(() => {
      const enhanced = `${scene.content} | Enhanced details: Two young people standing beside an office building window, looking out at the bright sky. Vivid blue sky with stylized clouds and tree leaf patterns. Warm sunlight illuminating the urban street scene, bright natural light, warm color tones, eye-level perspective, clean composition.`;
      
      setScenes(scenes.map(s => 
        s.id === sceneId ? { ...s, enhancedPrompt: enhanced } : s
      ));
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateImage = async (sceneId: string) => {
    setScenes(scenes.map(s => 
      s.id === sceneId ? { ...s, isGeneratingImage: true } : s
    ));

    // Mock image generation
    setTimeout(() => {
      const mockImageUrl = `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000000}`;
      setScenes(scenes.map(s => 
        s.id === sceneId ? { ...s, imageUrl: mockImageUrl, isGeneratingImage: false } : s
      ));
    }, 3000);
  };

  const handleGenerateAllImages = async () => {
    for (const scene of scenes) {
      if (!scene.imageUrl && scene.enhancedPrompt) {
        await handleGenerateImage(scene.id);
      }
    }
    setCurrentStep(4);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setCurrentStep(5);
    }, 5000);
  };

  const handleSkipVideo = () => {
    setCurrentStep(5);
  };

  const handlePublish = () => {
    alert('Storyboard published successfully!');
    onNavigate('story-detail', storyId);
  };

  const handleSaveDraft = () => {
    alert('Storyboard saved as draft!');
    onNavigate('story-detail', storyId);
  };

  const toggleCharacter = (character: StoryboardCharacter) => {
    if (selectedCharacters.find(c => c.id === character.id)) {
      setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const canProceedStep2 = scenes.every(s => s.enhancedPrompt);
  const canProceedStep3 = scenes.every(s => s.imageUrl);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('story-detail', storyId)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2>Continue Story</h2>
          <Button variant="ghost" size="icon">
            <Minimize2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Step 1: Storyboard Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter story title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happens in this chapter..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Character Selection</Label>
                  {availableCharacters.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableCharacters.map((character) => (
                        <button
                          key={character.id}
                          onClick={() => toggleCharacter(character)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            selectedCharacters.find(c => c.id === character.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={character.avatar} />
                              <AvatarFallback>{character.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <div className="font-medium">{character.name}</div>
                              <p className="text-xs text-muted-foreground">{character.role}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="w-full p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                      <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Add Characters</p>
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                  <Button className="flex-1" onClick={handleCreateStoryboard}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Scene Detail Enhancement */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Scene Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScene(index)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedScene === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {scene.title}
                  {scene.enhancedPrompt && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Scene Content</Label>
                  <Textarea
                    placeholder="Describe what happens in this scene..."
                    value={scenes[selectedScene].content}
                    onChange={(e) => {
                      const newScenes = [...scenes];
                      newScenes[selectedScene].content = e.target.value;
                      setScenes(newScenes);
                    }}
                    rows={6}
                  />
                </div>

                {scenes[selectedScene].enhancedPrompt && (
                  <div className="space-y-2">
                    <Label>AI Enhanced Image Prompt</Label>
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm">{scenes[selectedScene].enhancedPrompt}</p>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEnhanceScene(scenes[selectedScene].id)}
                  disabled={!scenes[selectedScene].content || isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Enhancing...' : 'Enhance Scene'}
                </Button>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedScene > 0) setSelectedScene(selectedScene - 1);
                    }}
                    disabled={selectedScene === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (selectedScene < scenes.length - 1) {
                        setSelectedScene(selectedScene + 1);
                      } else if (canProceedStep2) {
                        setCurrentStep(3);
                      }
                    }}
                  >
                    {selectedScene < scenes.length - 1 ? 'Next Scene' : 'Continue to Images'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!canProceedStep2 && (
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Please enhance all scenes before proceeding to image generation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Scene Image Generation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Scene Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScene(index)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedScene === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {scene.title}
                  {scene.imageUrl && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Scene Story</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{scenes[selectedScene].content}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image Prompt</Label>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm">{scenes[selectedScene].enhancedPrompt}</p>
                  </div>
                </div>

                {/* Image Display */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {scenes[selectedScene].isGeneratingImage ? (
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary animate-pulse" />
                      <p className="text-muted-foreground">Generating image...</p>
                    </div>
                  ) : scenes[selectedScene].imageUrl ? (
                    <img
                      src={scenes[selectedScene].imageUrl}
                      alt={scenes[selectedScene].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No image generated yet</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGenerateImage(scenes[selectedScene].id)}
                    disabled={scenes[selectedScene].isGeneratingImage || !!scenes[selectedScene].imageUrl}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Scene
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleGenerateAllImages}
                    disabled={canProceedStep3}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate All
                  </Button>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setCurrentStep(4)}
                    disabled={!canProceedStep3}
                  >
                    Continue to Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Video Generation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Scene Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScene(index)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedScene === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {scene.title}
                </button>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Scene Story</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{scenes[selectedScene].content}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Video Generation Settings</Label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Start Frame</Label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        {scenes[selectedScene].imageUrl ? (
                          <img
                            src={scenes[selectedScene].imageUrl}
                            alt="Start frame"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-destructive">Missing image</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">End Frame</Label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        {scenes[selectedScene].imageUrl ? (
                          <img
                            src={scenes[selectedScene].imageUrl}
                            alt="End frame"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-destructive">Missing image</p>
                    </div>
                  </div>

                  <details className="p-3 bg-muted rounded-lg">
                    <summary className="cursor-pointer font-medium">Prompt Settings</summary>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p>Duration: {videoConfig.duration}</p>
                      <p>Resolution: 1920x1080</p>
                      <p>Frame Rate: 24 fps</p>
                    </div>
                  </details>
                </div>

                {isGeneratingVideo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating video...</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video
                  </Button>
                  <Button className="flex-1" onClick={handleSkipVideo}>
                    Skip Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="mb-2">{title}</h2>
                  <p className="text-muted-foreground">{description}</p>
                </div>

                {selectedCharacters.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Characters</Label>
                    <div className="flex gap-2">
                      {selectedCharacters.map(char => (
                        <Avatar key={char.id} className="h-10 w-10">
                          <AvatarImage src={char.avatar} />
                          <AvatarFallback>{char.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scene Preview */}
            <div className="space-y-4">
              {scenes.map((scene, index) => (
                <Card key={scene.id}>
                  <CardContent className="p-0">
                    {scene.imageUrl && (
                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        className="w-full aspect-video object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3>{scene.title}</h3>
                        <Badge variant="secondary">Scene {index + 1}</Badge>
                      </div>
                      <p className="text-muted-foreground">{scene.content}</p>
                      {scene.imageUrl && (
                        <Badge variant="outline" className="mr-2">
                          <ImageIcon className="mr-1 h-3 w-3" />
                          Image
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button className="flex-1" onClick={handlePublish}>
                <Send className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
