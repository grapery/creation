import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MessageSquare, ArrowLeft, Share2, Edit } from 'lucide-react';
import type { Character, GenericResponse } from '../types';
import { toast } from 'sonner';

export default function CharacterDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Character
                const res = await apiClient.get<GenericResponse<Character>>(`/characters/${id}`);
                setCharacter(res.data.data);
            } catch (error) {
                console.error("Failed to fetch character", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacter();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: character?.name,
                    text: `Check out this character: ${character?.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading character...</div>;
    if (!character) return <div className="p-8 text-center text-red-500">Character not found</div>;

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Actions */}
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-48 h-48 border-4 border-white shadow-lg">
                        <AvatarImage src={character.avatar} />
                        <AvatarFallback className="text-4xl">{character.name[0]}</AvatarFallback>
                    </Avatar>

                    <h1 className="text-2xl font-bold text-center block md:hidden">{character.name}</h1>

                    <div className="flex flex-col w-full gap-2">
                        <Button
                            className="w-full gap-2"
                            variant="default"
                            onClick={() => {
                                if (character?.id) {
                                    // Navigate to chat with character or open character chat
                                    // For now, just navigate to agent chat
                                    navigate('/chat');
                                }
                            }}
                        >
                            <MessageSquare className="w-4 h-4" /> Chat with {character?.name.split(' ')[0]}
                        </Button>
                        <Button
                            className="w-full gap-2"
                            variant="outline"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </Button>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="hidden md:block">
                        <h1 className="text-4xl font-bold">{character.name}</h1>
                        <p className="text-xl text-gray-500 mt-1">{character.occupation || "Unknown Role"}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {character.description && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase">Description</h4>
                                    <p className="text-gray-800 mt-1">{character.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {character.gender && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-500 uppercase">Gender</h4>
                                        <p>{character.gender}</p>
                                    </div>
                                )}
                                {character.age && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-500 uppercase">Age</h4>
                                        <p>{character.age}</p>
                                    </div>
                                )}
                            </div>

                            {character.personality && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase">Personality</h4>
                                    <p className="text-gray-800 mt-1 text-sm">{character.personality}</p>
                                </div>
                            )}

                            {character.background && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase">Background</h4>
                                    <p className="text-gray-800 mt-1 text-sm">{character.background}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400"
                            onClick={() => {
                                toast.info('Edit suggestion feature coming soon!');
                            }}
                        >
                            <Edit className="w-3 h-3 mr-1" /> Suggest Edit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
