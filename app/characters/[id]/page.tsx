"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { characters } from "@/lib/api/characters";
import { storyboards } from "@/lib/api/storyboards";
import { Character } from "@/lib/types/character";
import { Storyboard } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageCircle, Share2, MoreHorizontal, Film, Image, Info } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CharacterPoster {
    id: string;
    image: string;
    createdAt: number;
}

export default function CharacterDetailPage() {
    const { id } = useParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);

    // Timeline state
    const [storyboardsList, setStoryboardsList] = useState<Storyboard[]>([]);
    const [loadingStoryboards, setLoadingStoryboards] = useState(true);

    // Gallery state
    const [posters, setPosters] = useState<CharacterPoster[]>([]);
    const [loadingPosters, setLoadingPosters] = useState(true);

    // Interaction states
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("timeline");

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await characters.get(id as string);
                setCharacter(data);
                setIsFollowing(data.isFollowing || false);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    // Load timeline data when tab switches to timeline
    useEffect(() => {
        if (activeTab === "timeline" && id) {
            loadStoryboards(id as string);
        }
    }, [activeTab, id]);

    // Load gallery data when tab switches to gallery
    useEffect(() => {
        if (activeTab === "gallery" && id) {
            loadPosters(id as string);
        }
    }, [activeTab, id]);

    const loadStoryboards = async (characterId: string) => {
        setLoadingStoryboards(true);
        try {
            // Load storyboards for this character
            const response = await storyboards.getByStoryId(characterId, null);
            setStoryboardsList(response.storyboards || []);
        } catch (e) {
            console.error(e);
            setStoryboardsList([]);
        } finally {
            setLoadingStoryboards(false);
        }
    };

    const loadPosters = async (characterId: string) => {
        setLoadingPosters(true);
        try {
            // TODO: Implement posters API
            // For now, set empty array
            setPosters([]);
        } catch (e) {
            console.error(e);
            setPosters([]);
        } finally {
            setLoadingPosters(false);
        }
    };

    const handleFollow = async () => {
        if (!id) return;
        try {
            if (isFollowing) {
                await characters.unfollow(id as string);
            } else {
                await characters.follow(id as string);
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error("Failed to toggle follow:", e);
        }
    };

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

            <main className="flex-1 container max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-10">
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
                                <Button
                                    variant={isFollowing ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? "Following" : "Follow"}
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
                    <div className="flex-1 min-w-0 pt-4 md:pt-12 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">{character.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                <span className="text-sm">@{character.author?.username || "System"}</span>
                                <span>•</span>
                                <span className="text-sm">{character.followers || 0} Followers</span>
                                <span>•</span>
                                <span className="text-sm">{character.stories || 0} Stories</span>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <p className="text-lg leading-relaxed">{character.description}</p>
                            </CardContent>
                        </Card>

                        {/* Additional Character Details */}
                        {(character.personality || character.background || character.appearance) && (
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-lg font-semibold">About {character.name}</h3>
                                    {character.personality && character.personality.trim() !== '' && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Personality</h4>
                                            <p className="text-sm leading-relaxed">{character.personality}</p>
                                        </div>
                                    )}
                                    {character.background && character.background.trim() !== '' && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Background</h4>
                                            <p className="text-sm leading-relaxed">{character.background}</p>
                                        </div>
                                    )}
                                    {character.appearance && character.appearance.trim() !== '' && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Appearance</h4>
                                            <p className="text-sm leading-relaxed">{character.appearance}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-secondary/50">
                                <TabsTrigger value="timeline">
                                    <Film className="w-4 h-4 mr-2" />
                                    Timeline
                                </TabsTrigger>
                                <TabsTrigger value="gallery">
                                    <Image className="w-4 h-4 mr-2" />
                                    Gallery
                                </TabsTrigger>
                                <TabsTrigger value="info">
                                    <Info className="w-4 h-4 mr-2" />
                                    Info
                                </TabsTrigger>
                            </TabsList>

                            {/* Timeline Tab */}
                            <TabsContent value="timeline" className="mt-6">
                                {loadingStoryboards ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : storyboardsList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <Film className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No storyboards yet</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Storyboards featuring this character will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {storyboardsList.map((storyboard, index) => (
                                            <div key={storyboard.id} className="flex gap-4">
                                                {/* Timeline line and node */}
                                                <div className="flex flex-col items-center">
                                                    {/* Top line */}
                                                    <div className={`w-0.5 h-8 ${index === 0 ? 'bg-transparent' : 'bg-blue-500/50'}`} />
                                                    {/* Node */}
                                                    <div className="relative">
                                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                        </div>
                                                    </div>
                                                    {/* Bottom line */}
                                                    <div className={`w-0.5 flex-1 ${index === storyboardsList.length - 1 ? 'bg-transparent' : 'bg-blue-500/50'}`} />
                                                </div>

                                                {/* Storyboard card */}
                                                <Card className="flex-1 hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            {storyboard.createdAt && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(storyboard.createdAt * 1000).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                            {storyboard.workflowStatus && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                                    {storyboard.workflowStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                                                            {storyboard.title}
                                                        </h4>
                                                        {storyboard.content && (
                                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                                                {storyboard.content}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            {storyboard.likes !== undefined && (
                                                                <span>{storyboard.likes} likes</span>
                                                            )}
                                                            {storyboard.comments !== undefined && (
                                                                <span>{storyboard.comments} comments</span>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery" className="mt-6">
                                {loadingPosters ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : posters.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <Image className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No media yet</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Promotional posters and media will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {posters.map((poster) => (
                                            <div key={poster.id} className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                                                <img
                                                    src={poster.image}
                                                    alt="Poster"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Info Tab */}
                            <TabsContent value="info" className="mt-6">
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        {/* Character Stats */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Statistics</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Visibility</span>
                                                    <span className="text-sm font-medium">
                                                        {character.isPublic ? 'Public' : 'Group Only'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Likes</span>
                                                    <span className="text-sm font-medium">{character.likes || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Followers</span>
                                                    <span className="text-sm font-medium">{character.followers || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Stories</span>
                                                    <span className="text-sm font-medium">{character.stories || 0}</span>
                                                </div>
                                                {character.createdAt && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Created</span>
                                                        <span className="text-sm font-medium">
                                                            {new Date(character.createdAt * 1000).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Author Info */}
                                        {character.author && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Creator</h3>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={character.author.avatar} />
                                                        <AvatarFallback>
                                                            {character.author.username?.[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">@{character.author.username}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {character.author.displayName || 'Creator'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Goals & Features */}
                                        {(character.shortTermGoal || character.longTermGoal || character.abilityFeatures) && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Goals & Abilities</h3>
                                                <div className="space-y-3">
                                                    {character.shortTermGoal && character.shortTermGoal.trim() !== '' && (
                                                        <div>
                                                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Short-term Goal</h4>
                                                            <p className="text-sm leading-relaxed">{character.shortTermGoal}</p>
                                                        </div>
                                                    )}
                                                    {character.longTermGoal && character.longTermGoal.trim() !== '' && (
                                                        <div>
                                                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Long-term Goal</h4>
                                                            <p className="text-sm leading-relaxed">{character.longTermGoal}</p>
                                                        </div>
                                                    )}
                                                    {character.abilityFeatures && character.abilityFeatures.trim() !== '' && (
                                                        <div>
                                                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Abilities</h4>
                                                            <p className="text-sm leading-relaxed">{character.abilityFeatures}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tags */}
                                        {character.tags && character.tags.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {character.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}
