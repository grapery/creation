import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, GitFork, ChevronRight, X, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { useStoryboardStore } from '../stores';
import { toast } from 'sonner';

interface StoryboardViewerProps {
  storyboardId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function StoryboardViewer({ storyboardId, onNavigate }: StoryboardViewerProps) {
  const { currentStoryboard, isLoading, fetchStoryboard, fetchStoryboardTree, fetchStoryboardChildren, likeStoryboard, unlikeStoryboard, forkStoryboard } = useStoryboardStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showForkSelection, setShowForkSelection] = useState(false);
  const [liked, setLiked] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    if (storyboardId) {
      fetchStoryboardTree(storyboardId);
      fetchStoryboardChildren(storyboardId).then(setChildren).catch(() => setChildren([]));
    }
  }, [storyboardId, fetchStoryboardTree, fetchStoryboardChildren]);

  const currentScene = currentStoryboard?.scenes?.[currentImageIndex];

  useEffect(() => {
    // Update to new storyboard ID when prop changes
    if (storyboardId && storyboardId !== currentStoryboardId) {
      setCurrentStoryboardId(storyboardId);
    }
  }, [storyboardId]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentStoryboard?.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped up - go to next storyboard
        handleNavigateNext();
      } else {
        // Swiped down - go to previous storyboard
        handleNavigatePrevious();
      }
    }
  };

  const handleNavigateNext = () => {
    if (!currentStoryboard || children.length === 0) {
      // No children, can't go forward
      return;
    } else if (children.length === 1) {
      // Single child, navigate directly
      fetchStoryboardTree(children[0].id);
    } else {
      // Multiple children, show fork selection
      setShowForkSelection(true);
    }
  };

  const handleNavigatePrevious = () => {
    if (!currentStoryboard || !currentStoryboard.parentId) return;
    fetchStoryboardTree(currentStoryboard.parentId);
  };

  const handleLike = async () => {
    if (!currentStoryboard) return;
    
    try {
      if (liked) {
        await unlikeStoryboard(currentStoryboard.id);
        setLiked(false);
      } else {
        await likeStoryboard(currentStoryboard.id);
        setLiked(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update like');
    }
  };

  const handleFork = async () => {
    if (!currentStoryboard) return;
    
    try {
      const forked = await forkStoryboard(currentStoryboard.id);
      toast.success('Storyboard forked successfully');
      onNavigate('storyboard-viewer', forked.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fork storyboard');
    }
  };

  const handleNextImage = () => {
    if (!currentStoryboard || !currentStoryboard.scenes) return;
    if (currentImageIndex < currentStoryboard.scenes.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleForkSelect = (forkId: string) => {
    fetchStoryboardTree(forkId);
    setShowForkSelection(false);
  };

  const handleContinueWriting = () => {
    if (currentStoryboard?.storyId) {
      onNavigate('continue-story', currentStoryboard.storyId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading storyboard...</div>
      </div>
    );
  }

  if (!currentStoryboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Storyboard not found</p>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={() => onNavigate('story-detail', currentStoryboard.storyId)}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Hints */}
      <div className="absolute top-1/2 left-4 z-50 transform -translate-y-1/2">
        {currentStoryboard.parentId && (
          <button
            onClick={handleNavigatePrevious}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="absolute bottom-32 left-4 z-50">
        {children.length > 0 && (
          <button
            onClick={handleNavigateNext}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Image Carousel */}
        <div className="flex-1 relative">
          {currentScene?.image ? (
            <img
              src={currentScene.image}
              alt={currentScene.title || 'Scene'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}

          {/* Image Navigation Overlay */}
          <div className="absolute inset-0 flex">
            <div
              className="flex-1"
              onClick={handlePreviousImage}
            />
            <div
              className="flex-1"
              onClick={handleNextImage}
            />
          </div>

          {/* Image Progress Indicators */}
          {currentStoryboard.scenes && currentStoryboard.scenes.length > 1 && (
            <div className="absolute top-4 left-4 right-16 flex gap-1">
              {currentStoryboard.scenes.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

          {/* Creator Info */}
          {currentStoryboard.author && (
            <div className="absolute top-16 left-4 right-16">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={currentStoryboard.author.avatar} />
                  <AvatarFallback>{currentStoryboard.author.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white drop-shadow-lg">{currentStoryboard.author.displayName}</p>
                  <p className="text-white/80 text-sm drop-shadow-lg">{formatDate(currentStoryboard.createdAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scene Description */}
          {currentScene && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="mb-1 drop-shadow-lg">{currentScene.title}</h3>
              <p className="text-white/90 drop-shadow-lg mb-3">
                {currentScene.description}
              </p>
              
              {/* Character List */}
              {currentStoryboard.characterRefs && currentStoryboard.characterRefs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
                  {currentStoryboard.characterRefs.map((char: any, idx: number) => (
                    <div
                      key={char.storyCharacterId || idx}
                      className="flex-shrink-0 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2"
                      onClick={() => char.id && onNavigate('character-viewer', char.id)}
                    >
                      {char.avatar && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={char.avatar} />
                          <AvatarFallback>{char.name?.[0] || 'C'}</AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-sm">{char.name || `Character ${idx + 1}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      liked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
                    }`}>
                      <Heart className={`h-5 w-5 ${liked ? 'fill-white' : ''}`} />
                    </div>
                    <span className="text-xs drop-shadow-lg">{currentStoryboard.likes + (liked ? 1 : 0)}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs drop-shadow-lg">0</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <span className="text-xs drop-shadow-lg">0</span>
                  </button>

                  {children.length > 0 && (
                    <button 
                      onClick={() => setShowForkSelection(true)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <GitFork className="h-5 w-5" />
                      </div>
                      <span className="text-xs drop-shadow-lg">{children.length}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailsOpen(true)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  <Button
                    onClick={handleContinueWriting}
                    size="sm"
                    className="bg-primary/90 backdrop-blur-sm"
                  >
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fork Selection Sheet */}
      {showForkSelection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3>Choose Your Path</h3>
              <button onClick={() => setShowForkSelection(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              {children.map((childStoryboard) => {
                if (!childStoryboard) return null;

                return (
                  <Card
                    key={childStoryboard.id}
                    className="active:scale-98 transition-transform cursor-pointer"
                    onClick={() => handleForkSelect(childStoryboard.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {childStoryboard.scenes?.[0]?.image && (
                          <img
                            src={childStoryboard.scenes[0].image}
                            alt={childStoryboard.title}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1">{childStoryboard.title}</h4>
                          {childStoryboard.content && (
                            <p className="text-muted-foreground line-clamp-2 mb-2">
                              {childStoryboard.content}
                            </p>
                          )}
                          {childStoryboard.author && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={childStoryboard.author.avatar} />
                                <AvatarFallback>{childStoryboard.author.displayName[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {childStoryboard.author.displayName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Storyboard Details</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <h3 className="mb-2">{currentStoryboard.title}</h3>
              <p className="text-muted-foreground">
                Created on {formatDate(currentStoryboard.createdAt)}
              </p>
            </div>

            {/* Characters */}
            <div>
              <h4 className="mb-3">Characters</h4>
              <div className="space-y-2">
                {currentStoryboard.characters.map((char) => (
                  <div key={char.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={char.avatar} />
                      <AvatarFallback>{char.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{char.name}</p>
                      <p className="text-sm text-muted-foreground">{char.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator */}
            <div>
              <h4 className="mb-3">Creator</h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentStoryboard.creatorAvatar} />
                  <AvatarFallback>{currentStoryboard.creatorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p>{currentStoryboard.creatorName}</p>
                  <p className="text-sm text-muted-foreground">Story Contributor</p>
                </div>
              </div>
            </div>

            {/* Original Input */}
            <div>
              <h4 className="mb-2">Original Input</h4>
              <Card>
                <CardContent className="p-3">
                  <p className="text-muted-foreground">{currentStoryboard.rawInput}</p>
                </CardContent>
              </Card>
            </div>

            {/* AI-Enhanced Content */}
            <div>
              <h4 className="mb-2">AI-Enhanced Narrative</h4>
              <Card>
                <CardContent className="p-3">
                  <p>{currentStoryboard.content}</p>
                </CardContent>
              </Card>
            </div>

            {/* Scenes */}
            <div>
              <h4 className="mb-3">Scenes ({currentStoryboard.scenes.length})</h4>
              <div className="space-y-3">
                {currentStoryboard.scenes.map((scene, idx) => (
                  <Card key={scene.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <img
                          src={scene.image}
                          alt={scene.title}
                          className="w-20 h-20 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{idx + 1}</Badge>
                            <h5>{scene.title}</h5>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {scene.description}
                          </p>
                          <div className="flex gap-1">
                            {scene.location && (
                              <Badge variant="secondary" className="text-xs">
                                {scene.location}
                              </Badge>
                            )}
                            {scene.timeOfDay && (
                              <Badge variant="secondary" className="text-xs">
                                {scene.timeOfDay}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h4 className="mb-3">Statistics</h4>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token Consumption</span>
                    <span>{currentStoryboard.tokenConsumption.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span>{currentStoryboard.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Likes</span>
                    <span>{currentStoryboard.likes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span>{currentStoryboard.comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shares</span>
                    <span>{currentStoryboard.shares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Forks</span>
                    <span>{currentStoryboard.forkCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}