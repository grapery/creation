import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Storyboard, GenericResponse } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, MessageSquare, Play, RefreshCw } from 'lucide-react';
import { StoryboardChat } from '../components/StoryboardChat'; // Pending creation

export default function StoryboardDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Storyboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchBoard = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Storyboard (assuming endpoint matches)
                // Note: The backend might not have a direct GET /storyboards/:id yet?
                // Checking handler.go: authenticated.GET("/storyboards/:id", h.GetStoryboard)
                const res = await apiClient.get<GenericResponse<Storyboard>>(`/storyboards/${id}`);
                setBoard(res.data.data);
            } catch (err) {
                console.error("Failed to fetch storyboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading Storyboard...</div>;
    if (!board) return <div className="p-8 text-center text-red-500">Storyboard not found</div>;

    return (
        <div className="container max-w-6xl mx-auto py-6 px-4 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <h1 className="text-xl font-bold truncate max-w-lg">{board.title}</h1>
                <Button variant={showChat ? "secondary" : "outline"} onClick={() => setShowChat(!showChat)} className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {showChat ? 'Hide Chat' : 'Chat with Scene'}
                </Button>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Main Content Area */}
                <div className={`flex-1 overflow-y-auto space-y-6 ${showChat ? 'lg:mr-80' : ''}`}> {/* Reserve space if implemented as overlay or flex */}
                    {/* Scenes Carousel / Grid */}
                    {board.storyboardScenes && board.storyboardScenes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {board.storyboardScenes.map((scene) => (
                                <Card key={scene.id} className="overflow-hidden">
                                    <div className="aspect-video bg-gray-900 relative">
                                        {scene.image ? (
                                            <img src={scene.image} alt={scene.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                        )}
                                        {scene.videoUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Play className="w-12 h-12 text-white opacity-80" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <h4 className="font-semibold text-sm mb-1">{scene.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">{scene.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg p-12 text-center text-gray-500">
                            No scenes generated yet.
                            <div className="mt-4">
                                <Button variant="outline" className="gap-2" onClick={async () => {
                                    // Generate scenes by updating the storyboard content
                                    if (board.id) {
                                        try {
                                            await apiClient.post(`/storyboards/${board.id}/generate-scenes`);
                                            // Refresh the board
                                            const res = await apiClient.get<GenericResponse<Storyboard>>(`/storyboards/${board.id}`);
                                            setBoard(res.data.data);
                                        } catch (err) {
                                            console.error("Failed to generate scenes", err);
                                        }
                                    }
                                }}>
                                    <RefreshCw className="w-4 h-4" /> Generate Scenes
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Narrative Text */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Narrative</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {board.content}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chat Panel (Collapsible) */}
                {showChat && (
                    <div className="w-96 border-l pl-4 bg-white flex flex-col h-full absolute right-0 top-16 bottom-0 z-10 shadow-xl lg:static lg:shadow-none lg:z-auto lg:top-auto lg:bottom-auto">
                        <StoryboardChat storyboardId={board.id} context={board.content} />
                    </div>
                )}
            </div>
        </div>
    );
}
