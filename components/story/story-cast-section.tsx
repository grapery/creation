"use client";

import { Character } from "@/lib/types";
import Image from "next/image";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";

interface StoryCastSectionProps {
    title: string;
    characters: Character[];
    onAddCharacter?: () => void;
    isLoading?: boolean;
    error?: string;
}

export function StoryCastSection({ title, characters, onAddCharacter, isLoading = false, error }: StoryCastSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                    {title} ({characters.length})
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddCharacter}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">{t("story_detail.empty.add_character", "Add Character")}</span>
                </Button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="bg-card border border-border/8 rounded-2xl p-10 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{t("common.loading", "Loading...")}</p>
                </div>
            ) : error ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.error.title", "Unable to load characters")}</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            ) : characters.length === 0 ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.empty.no_characters_title", "No characters yet")}</p>
                    <p className="text-sm text-muted-foreground">{t("story_detail.empty.no_characters_message", "Add characters to bring your story to life")}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {characters.map((character) => (
                        <CharacterRow key={character.id} character={character} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface CharacterRowProps {
    character: Character;
}

function CharacterRow({ character }: CharacterRowProps) {
    return (
        <div className="bg-card border border-border/8 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:bg-accent/5 transition-colors">
            {/* Avatar */}
            <div className="flex-shrink-0">
                {character.avatar ? (
                    <Image src={character.avatar} alt={character.name} width={56} height={56} className="rounded-full object-cover" sizes="56px" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold text-muted-foreground">
                            {character.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-foreground truncate">
                    {character.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                    {character.description || "Character"}
                </p>
            </div>

            {/* Chevron */}
            <div className="text-muted-foreground/50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
