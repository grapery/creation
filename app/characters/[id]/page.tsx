"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { characters } from "@/lib/api/characters";
import { Character } from "@/lib/types/character";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CharacterDetailPage() {
    const { id } = useParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await characters.get(id as string);
                setCharacter(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;
    if (!character) return <div className="min-h-screen flex items-center justify-center bg-background">Character not found</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Hero / Cover */}
            <div className="h-64 md:h-80 bg-muted relative">
                {character.background && (
                    <img src={character.background} className="w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <main className="flex-1 container px-4 md:px-6 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column: Avatar & Actions */}
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4 w-full md:w-64">
                        <div className="h-40 w-40 md:h-48 md:w-48 rounded-2xl border-4 border-background shadow-lg bg-secondary overflow-hidden">
                            {character.avatar ? (
                                <img src={character.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-muted-foreground">{character.name[0]}</div>
                            )}
                        </div>

                        <div className="w-full space-y-2">
                            <Button className="w-full" size="lg" asChild>
                                <Link href={`/chat/${character.id}`}>
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Chat
                                </Link>
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Like
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Content */}
                    <div className="flex-1 pt-4 md:pt-12 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">{character.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                <span className="text-sm">@{character.creator?.username || "System"}</span>
                                <span>•</span>
                                <span className="text-sm">{character.likes || 0} Likes</span>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <p className="text-lg leading-relaxed">{character.description}</p>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="timeline">
                            <TabsList className="bg-secondary/50">
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                <TabsTrigger value="info">Info</TabsTrigger>
                            </TabsList>
                            <TabsContent value="timeline" className="p-4 border rounded-lg bg-card/50 min-h-[200px]">
                                <div className="text-center text-muted-foreground py-10">
                                    No timeline events yet.
                                </div>
                            </TabsContent>
                            <TabsContent value="gallery" className="p-4 border rounded-lg bg-card/50 min-h-[200px]">
                                <div className="text-center text-muted-foreground py-10">
                                    No images in gallery.
                                </div>
                            </TabsContent>
                            <TabsContent value="info" className="p-4 border rounded-lg bg-card/50 min-h-[200px]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Created</div>
                                        <div>2024-05-20</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Version</div>
                                        <div>1.0</div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}
