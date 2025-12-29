import { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, ChevronLeft, ChevronRight, Eye, Users, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import { CommentSection } from '../components/CommentSection';
import { Separator } from '../components/ui/separator';
import { useStoryStore } from '../stores';
import { storyApi, userApi } from '../lib/api';
import { toast } from 'sonner';

interface StoryViewerProps {
  storyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryViewer({ storyId, onNavigate }: StoryViewerProps) {
  const { currentStory, fetchStory, isLoading, likeStory, unlikeStory } = useStoryStore();
  
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
    }
  }, [storyId, fetchStory]);

  if (isLoading) {
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

  const scenes = currentStory.scenes || [];
  const currentScene = scenes[currentPanelIndex];

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    }
  };

  const goToNextPanel = () => {
    if (currentPanelIndex < scenes.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    }
  };

  const handleLike = async () => {
    if (!currentStory) return;
    
    try {
      if (isLiked) {
        await unlikeStory(currentStory.id);
        setIsLiked(false);
      } else {
        await likeStory(currentStory.id);
        setIsLiked(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update like');
    }
  };

  const handleFollow = async () => {
    if (!currentStory?.author?.id) return;
    
    try {
      if (isFollowing) {
        await userApi.unfollowUser(currentStory.author.id);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await userApi.followUser(currentStory.author.id);
        setIsFollowing(true);
        toast.success('Following');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update follow status');
    }
  };

  return (
    <div className="min-h-screen">
      <MobileHeader 
        title={currentStory.title}
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
              <AvatarImage src={currentStory.author?.avatar} />
              <AvatarFallback>{currentStory.author?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="truncate">{currentStory.author?.displayName || 'Unknown'}</div>
              <p className="text-muted-foreground">
                {new Date(currentStory.createdAt).toLocaleDateString()}
              </p>
            </div>
            {currentStory.author?.id && (
              <Button 
                variant={isFollowing ? 'outline' : 'default'}
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          {currentStory.description && (
            <p className="text-muted-foreground">{currentStory.description}</p>
          )}

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{currentStory.likes + (isLiked ? 1 : 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{currentStory.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{scenes.length} scenes</span>
            </div>
            {currentStory.tags && currentStory.tags.length > 0 && (
              <Badge variant="secondary" className="ml-auto">{currentStory.tags[0]}</Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              variant={isLiked ? 'default' : 'outline'} 
              className="flex-1"
              onClick={handleLike}
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