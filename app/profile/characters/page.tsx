"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character } from "@/lib/types";
import { profile } from "@/lib/api/profile";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ProfileCharactersPage() {
    const { id } = useParams();
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>("User");

    useEffect(() => {
        if (!id) return;
        async function load() {
            setLoading(true);
            try {
                const data = await profile.getCharacters(id as string, 1, 50);
                setCharacters(data.characters || []);
                setUserName("User"); // Could be from API
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-lg font-bold text-foreground">Characters</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : characters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-foreground mb-2">No characters yet</p>
                        <p className="text-sm text-muted-foreground">
                            {userName} hasn't created any characters
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {characters.map((character) => (
                            <Card key={character.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <Link href={`/characters/${character.id}`}>
                                    <CardContent className="p-4">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden mx-auto mb-3">
                                            {character.avatar ? (
                                                <img
                                                    src={character.avatar}
                                                    alt={character.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-muted-foreground">
                                                        {character.name?.[0]?.toUpperCase() || "?"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <h3 className="text-base font-bold text-foreground text-center mb-1 line-clamp-1">
                                            {character.name}
                                        </h3>

                                        {/* Description */}
                                        {character.description && (
                                            <p className="text-sm text-muted-foreground text-center line-clamp-2">
                                                {character.description}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {character.tags && character.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 justify-center mt-2">
                                                {character.tags.slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {character.tags.length > 3 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +{character.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
