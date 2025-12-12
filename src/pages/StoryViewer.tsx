import { useState } from 'react';
import { Heart, Share2, Bookmark, ChevronLeft, ChevronRight, Eye, Users, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import { CommentSection } from '../components/CommentSection';
import { mockStories, mockPanels, mockComments } from '../lib/mockData';
import { Separator } from '../components/ui/separator';

interface StoryViewerProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryViewer({ storyId, onNavigate }: StoryViewerProps) {
  const story = storyId ? mockStories.find(s => s.id === storyId) : mockStories[0];
  const panels = storyId ? mockPanels.filter(p => p.storyId === storyId) : mockPanels;
  
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!story) return null;

  const currentPanel = panels[currentPanelIndex];

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    }
  };

  const goToNextPanel = () => {
    if (currentPanelIndex < panels.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={story.title}
        showBack
        onBack={() => onNavigate('dashboard')}
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div>
        {/* Story Info */}
        <div className="p-4 space-y-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={story.author.avatar} />
              <AvatarFallback>{story.author.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="truncate">{story.author.displayName}</div>
              <p className="text-muted-foreground">
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button 
              variant={isFollowing ? 'outline' : 'default'}
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          <p className="text-muted-foreground">{story.description}</p>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{story.likes + (isLiked ? 1 : 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{story.followers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{panels.length} panels</span>
            </div>
            <Badge variant="secondary" className="ml-auto">{story.genre}</Badge>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={isLiked ? 'default' : 'outline'} 
              className="flex-1"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Panel Viewer */}
        <div className="relative bg-black">
          {/* Panel Navigation Indicator */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-center">
            <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur">
              {currentPanelIndex + 1} / {panels.length}
            </Badge>
          </div>

          {/* Current Panel */}
          <div className="aspect-[9/16] relative flex items-center justify-center">
            <img
              src={currentPanel?.image}
              alt={currentPanel?.text}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            {currentPanelIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 hover:bg-black/50 text-white pointer-events-auto backdrop-blur"
                onClick={goToPreviousPanel}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <div className="flex-1" />
            {currentPanelIndex < panels.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 hover:bg-black/50 text-white pointer-events-auto backdrop-blur"
                onClick={goToNextPanel}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Panel Text Overlay */}
          {currentPanel?.text && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-center">{currentPanel.text}</p>
            </div>
          )}
        </div>

        {/* Panel Thumbnails */}
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-2">
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                onClick={() => setCurrentPanelIndex(index)}
                className={`flex-shrink-0 w-16 h-24 rounded overflow-hidden border-2 transition-all ${
                  index === currentPanelIndex 
                    ? 'border-primary scale-105' 
                    : 'border-transparent opacity-60'
                }`}
              >
                <img
                  src={panel.image}
                  alt={`Panel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Comments */}
        <div className="p-4">
          <CommentSection comments={mockComments} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}