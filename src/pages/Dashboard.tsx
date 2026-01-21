import { useEffect, useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import { useAuthStore } from '../stores/authStore';
import { StoryCard } from '../components/StoryCard';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Rocket, Flame, MoveUp, Clock, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const { stories, isLoading, fetchFeed } = useStoryStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'best' | 'hot' | 'new' | 'top'>('best');

    useEffect(() => {
        // Initial fetch
        fetchFeed(activeTab, 1);
    }, [activeTab, fetchFeed]);

    return (
        <div className="py-4 px-0 md:px-4">
            {/* Create Post Input */}
            {user && (
                <div className="bg-white rounded border border-gray-200 p-2 flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 relative flex-shrink-0">
                        <Avatar className="h-full w-full">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>u/</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <Input
                        placeholder="Create Post"
                        className="bg-gray-100 border-gray-200 hover:bg-white focus:bg-white hover:border-blue-500 transition-colors"
                        onClick={() => navigate('/submit')}
                    />
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <LinkIcon className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white rounded border border-gray-200 p-3 flex items-center gap-4 mb-4 overflow-x-auto">
                <Button
                    variant="ghost"
                    className={`h-8 gap-2 rounded-full font-bold ${activeTab === 'best' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('best')}
                >
                    <Rocket className="h-5 w-5" /> Best
                </Button>
                <Button
                    variant="ghost"
                    className={`h-8 gap-2 rounded-full font-bold ${activeTab === 'hot' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('hot')}
                >
                    <Flame className="h-5 w-5" /> Hot
                </Button>
                <Button
                    variant="ghost"
                    className={`h-8 gap-2 rounded-full font-bold ${activeTab === 'new' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('new')}
                >
                    <Clock className="h-5 w-5" /> New
                </Button>
                <Button
                    variant="ghost"
                    className={`h-8 gap-2 rounded-full font-bold ${activeTab === 'top' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('top')}
                >
                    <MoveUp className="h-5 w-5" /> Top
                </Button>
            </div>

            {/* Stories Feed */}
            <div className="space-y-3">
                {isLoading && stories.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-4 animate-pulse">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                </div>
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                                <div className="h-32 w-full bg-gray-200 rounded mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-16 bg-gray-200 rounded" />
                                    <div className="h-8 w-16 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    stories.map((story) => (
                        <StoryCard
                            key={story.id}
                            story={story}
                            onView={() => navigate(`/stories/${story.id}`)}
                        />
                    ))
                )}

                {!isLoading && stories.length === 0 && (
                    <div className="text-center py-10 bg-white border border-gray-200 rounded">
                        <p className="text-gray-500 font-bold text-lg">No stories yet.</p>
                        <p className="text-gray-400">Be the first to share something!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
