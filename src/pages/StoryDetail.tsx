import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Story, Storyboard, GenericResponse } from '../types';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ThumbsUp, MessageSquare, GitBranch, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CreateStoryboardDialog } from '../components/CreateStoryboardDialog';
import { CommentsSection } from '../components/CommentsSection';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function StoryDetail() {
    const { id } = useParams<{ id: string }>();
    const [story, setStory] = useState<Story | null>(null);
    const [storyboards, setStoryboards] = useState<Storyboard[]>([]); // For tree view
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoryData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Story Details
                const storyRes = await apiClient.get<GenericResponse<Story>>(`/stories/${id}`);
                setStory(storyRes.data.data);

                // Fetch Story Tree (Storyboards)
                const boardsRes = await apiClient.get<GenericResponse<{ storyboards: Storyboard[] }>>(`/storyboards`, {
                    params: { storyId: id, limit: 100 }
                });
                const boardData = boardsRes.data.data as any;
                setStoryboards(boardData.storyboards || boardData.items || []);

            } catch (err) {
                console.error("Failed to fetch story details:", err);
                setError("Failed to load story");
            } finally {
                setLoading(false);
            }
        };

        fetchStoryData();
    }, [id]);

    if (loading) return (
        <div className="container max-w-5xl mx-auto py-6 px-4 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded h-[400px] border border-gray-200" />
                    <div className="bg-white rounded h-[200px] border border-gray-200" />
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded h-[150px] border border-gray-200" />
                    <div className="bg-white rounded h-[150px] border border-gray-200" />
                </div>
            </div>
        </div>
    );
    if (error || !story) return <div className="p-8 text-center text-red-500">{error || "Story not found"}</div>;

    return (
        <div className="container max-w-5xl mx-auto py-6 px-4">
            {/* Back Button */}
            <div className="mb-4">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Feed
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Story Details + Tree/Board) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Story Header Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                        {story.groupName && (
                                            <>
                                                <Link to={`/r/${story.groupId}`} className="font-bold text-gray-900 hover:underline">
                                                    r/{story.groupName}
                                                </Link>
                                                <span>•</span>
                                            </>
                                        )}
                                        <span>Posted by u/{story.author?.username || 'unknown'}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(story.createdAt * 1000)} ago</span>
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{story.title}</CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary">{story.genre}</Badge>
                                        <Badge variant={story.status === 'published' ? 'default' : 'outline'}>
                                            {story.status}
                                        </Badge>
                                    </div>
                                </div>
                                {/* Story Actions (Like/Share) need implementation */}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cover Image */}
                            {story.coverImage && (
                                <div className="rounded-lg overflow-hidden max-h-[400px]">
                                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{story.description}</p>
                            </div>

                            {/* Stats Bar */}
                            <div className="flex items-center space-x-6 pt-4 border-t text-sm text-gray-500">
                                <button
                                    className={cn("flex items-center space-x-1 hover:text-blue-600 transition-colors", story.liked && "text-blue-600")}
                                    onClick={async () => {
                                        try {
                                            await apiClient.post(`/stories/${story.id}/like`);
                                            setStory({ ...story, likes: story.likes + (story.liked ? -1 : 1), liked: !story.liked });
                                        } catch (err) {
                                            console.error("Failed to like story", err);
                                        }
                                    }}
                                >
                                    <ThumbsUp className={cn("w-4 h-4", story.liked && "fill-current")} />
                                    <span>{story.likes} Likes</span>
                                </button>
                                <div className="flex items-center space-x-1 cursor-default">
                                    <GitBranch className="w-4 h-4" />
                                    <span>{story.storyboardCount} Boards</span>
                                </div>
                                <div className="flex items-center space-x-1 cursor-default">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{story.characterCount} Characters</span>
                                </div>
                                <button
                                    className="flex items-center space-x-1 hover:text-yellow-600 transition-colors ml-auto"
                                    onClick={async () => {
                                        try {
                                            await apiClient.post(`/stories/${story.id}/save`);
                                            alert("Story saved to collection!");
                                        } catch (err) {
                                            console.error("Failed to save story", err);
                                            alert("Failed to save story");
                                        }
                                    }}
                                >
                                    <Badge variant="outline" className="border-gray-300">Save Story</Badge>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Storyboard Tree Visualization (Placeholder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Story Boards</CardTitle>
                            <CardDescription>Explore the different branches of this story.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {storyboards.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No storyboards yet. Be the first to create one!
                                    <div className="mt-4">
                                        <CreateStoryboardDialog
                                            storyId={story.id}
                                            onSuccess={(newBoard) => setStoryboards([...storyboards, newBoard])}
                                            trigger={<Button>Start First Storyboard</Button>}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {storyboards.map(board => (
                                        <Link key={board.id} to={`/storyboards/${board.id}`} className="block">
                                            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-semibold text-gray-900">{board.title}</h4>
                                                    <span className="text-xs text-gray-500">{formatDistanceToNow(board.createdAt * 1000)} ago</span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">{board.content}</p>

                                                {/* Preview Images of Scenes */}
                                                {board.storyboardScenes && board.storyboardScenes.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {board.storyboardScenes.slice(0, 4).map(scene => (
                                                            scene.image && (
                                                                <div key={scene.id} className="w-16 h-16 rounded overflow-hidden bg-gray-200">
                                                                    <img src={scene.image} alt={scene.title} className="w-full h-full object-cover" />
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <CardContent className="pt-6">
                            <CommentsSection targetType="story" targetId={story.id} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (Characters, Contributors) */}
                <div className="space-y-6">
                    {/* Characters Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Characters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {story.characters && story.characters.length > 0 ? (
                                    story.characters.map(char => (
                                        <Link key={char.id} to={`/characters/${char.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-1 rounded transition-colors">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback>{char.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-sm">{char.name}</span>
                                        </Link>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No characters yet.</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contributors Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contributors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {story.contributors && story.contributors.length > 0 ? (
                                    story.contributors.map(contributor => (
                                        <Link key={contributor.id} to={`/u/${contributor.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-1 rounded transition-colors">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={contributor.avatar} />
                                                <AvatarFallback>{contributor.name?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">{contributor.name}</div>
                                                <div className="text-xs text-gray-500 capitalize">{contributor.role}</div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={story.author?.avatar} />
                                            <AvatarFallback>{story.author?.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-sm">{story.author?.displayName || story.author?.username}</div>
                                            <div className="text-xs text-gray-500">Author</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
