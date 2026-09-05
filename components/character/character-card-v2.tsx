"use client";

import { Character } from "@/lib/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageSquare, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface CharacterCardProps {
    character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
    return (
        <Link href={`/characters/${character.id}`}>
            <Card className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5">
                    {/* Character Avatar */}
                    <div className="relative aspect-square w-full rounded-xl bg-muted/30 mb-4 overflow-hidden">
                        {character.avatar ? (
                            <Image src={character.avatar} alt={character.name} width={0} height={0} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" style={{ width: "100%", height: "100%" }} sizes="100vw" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}

                        {/* Overlay with character type badge */}
                        <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium backdrop-blur-sm">
                                Character
                            </span>
                        </div>
                    </div>

                    {/* Character Info */}
                    <div className="space-y-2.5">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                            {character.name}
                        </h3>

                        {/* Description */}
                        {character.description && (
                            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                {character.description}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-sm pt-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {character.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(character.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Heart className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{character.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{character.chatCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Personality Tags - Handle both string and array */}
                        {character.personality && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                {/* If personality is a string, split by comma */}
                                {typeof character.personality === 'string' ? (
                                    <>
                                        {character.personality.split(',').map((trait, index) => (
                                            <span
                                                key={`${trait}-${index}`}
                                                className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium hover:bg-secondary/20 transition-colors"
                                            >
                                                {trait.trim()}
                                            </span>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {/* If personality is an array, display first 3 */}
                                        {(character.personality as string[]).slice(0, 3).map((trait, index) => (
                                            <span
                                                key={`${trait}-${index}`}
                                                className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium hover:bg-secondary/20 transition-colors"
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                        {/* Show +N if more than 3 traits */}
                                        {(character.personality as string[]).length > 3 && (
                                            <span className="text-xs text-muted-foreground">
                                                +{(character.personality as string[]).length - 3}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
