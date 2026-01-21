import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Character, GenericResponse, PaginatedList } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { User, Plus } from 'lucide-react';

export default function CharactersList() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                // Assuming /characters returns PaginatedList or list
                const res = await apiClient.get<GenericResponse<PaginatedList<Character>>>('/characters');
                if (res.data.data && res.data.data.items) {
                    setCharacters(res.data.data.items);
                } else if (Array.isArray(res.data.data)) {
                    setCharacters(res.data.data as any);
                }
            } catch (error) {
                console.error("Failed to fetch characters:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Characters</h1>
                    <p className="text-gray-500">Explore characters created by the community.</p>
                </div>
                <Link to="/characters/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Create Character
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            ) : characters.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No characters found</h3>
                    <p className="text-gray-500 mb-6">Create the first character!</p>
                    <Link to="/characters/create">
                        <Button>Create Character</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 hover:cursor-pointer">
                    {characters.map(char => (
                        <Link key={char.id} to={`/characters/${char.id}`}>
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-24 h-24 mb-4 relative">
                                        <Avatar className="w-24 h-24">
                                            <AvatarImage src={char.avatar} className="object-cover" />
                                            <AvatarFallback className="text-2xl">{char.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <CardTitle className="text-lg">{char.name}</CardTitle>
                                    <CardDescription>{char.occupation || "Unknown Occupation"}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center pt-0 pb-4">
                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {char.description || "No description provided."}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
