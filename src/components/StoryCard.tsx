import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Story } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useStoryStore } from '../stores/storyStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface StoryCardProps {
    story: Story;
    onView?: () => void;
}

export function StoryCard({ story, onView }: StoryCardProps) {
    const navigate = useNavigate();
    const { likeStory } = useStoryStore();

    const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
        e.stopPropagation();
        if (type === 'up') {
            likeStory(story.id);
        }
    };

    const handleGroupClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (story.groupId) navigate(`/r/${story.groupId}`);
    }

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (story.author?.id) navigate(`/u/${story.author.id}`);
    }

    return (
        <Card
            className="flex border border-gray-200 bg-white hover:border-gray-400 cursor-pointer overflow-hidden rounded mb-2 transition-colors"
            onClick={onView}
        >
            {/* Vote Column */}
            <div className="w-[40px] bg-[#F8F9FA] flex flex-col items-center py-2 gap-1 border-r border-transparent">
                <button
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-[#FF4500]"
                    onClick={(e) => handleVote(e, 'up')}
                >
                    <ArrowBigUp className="h-6 w-6" />
                </button>
                <span className="text-xs font-bold text-gray-900">{story.likes || 0}</span>
                <button
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-[#7193FF]"
                    onClick={(e) => handleVote(e, 'down')}
                >
                    <ArrowBigDown className="h-6 w-6" />
                </button>
            </div>

            {/* Content Column */}
            <div className="flex-1 p-2 pb-1">
                {/* Header */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    {story.groupId ? (
                        <div className="flex items-center gap-1">
                            {/* Group Icon Placeholder */}
                            <div className="h-5 w-5 bg-black rounded-full" />
                            <span className="font-bold text-black hover:underline z-10 relative" onClick={handleGroupClick}>
                                r/{story.groupName || 'grapery'}
                            </span>
                            <span className="mx-0.5">•</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <div className="h-5 w-5 bg-blue-500 rounded-full" />
                            <span className="font-bold text-black hover:underline cursor-pointer" onClick={() => navigate('/')}>r/grapery</span>
                            <span className="mx-0.5">•</span>
                        </div>
                    )}

                    <span>Posted by</span>
                    <span className="hover:underline" onClick={handleUserClick}>
                        u/{story.author?.username || story.author?.displayName || 'user'}
                    </span>
                    <span>
                        {story.createdAt ? formatDistanceToNow(new Date(story.createdAt * 1000), { addSuffix: true }) : 'recently'}
                    </span>
                </div>

                {/* Title & Body */}
                <div className="mb-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 leading-snug">{story.title}</h3>

                    {story.coverImage ? (
                        <div className="w-full relative rounded-lg overflow-hidden max-h-[500px] border border-gray-200 flex justify-center bg-black">
                            <img src={story.coverImage} alt={story.title} className="max-h-[500px] object-contain" />
                        </div>
                    ) : (
                        <div className="relative max-h-[250px] overflow-hidden">
                            <p className="text-sm text-gray-800 leading-relaxed font-normal font-sans line-clamp-4">{story.description}</p>
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-1 text-gray-500 font-bold text-xs">
                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-2 text-gray-500 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate(`/stories/${story.id}`); }}>
                        <MessageSquare className="h-5 w-5" />
                        {story.comments || story.storyboardCount || 0} Comments
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-2 text-gray-500 hover:bg-gray-100" onClick={async (e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                            try {
                                await navigator.share({
                                    title: story.title,
                                    text: story.description,
                                    url: window.location.origin + `/stories/${story.id}`,
                                });
                            } catch (err) {
                                console.log('Share failed', err);
                            }
                        } else {
                            navigator.clipboard.writeText(window.location.origin + `/stories/${story.id}`);
                            toast.success('Link copied to clipboard!');
                        }
                    }}>
                        <Share2 className="h-5 w-5" />
                        Share
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-2 text-gray-500 hover:bg-gray-100" onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            // Save to collection - need to implement API call
                            toast.success('Story saved to collection!');
                        } catch (err) {
                            console.error("Failed to save story", err);
                        }
                    }}>
                        <Bookmark className="h-5 w-5" />
                        Save
                    </Button>
                </div>
            </div>
        </Card>
    );
}
