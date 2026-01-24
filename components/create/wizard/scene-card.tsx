"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Scene {
    id: string;
    description: string;
    image?: string;
    location?: string;
    characters?: string[];
}

interface SceneCardProps {
    scene: Scene;
    index: number;
    onEdit?: (id: string, newContent: string) => void;
    onDelete?: (id: string) => void;
}

export function SceneCard({ scene, index, onEdit, onDelete }: SceneCardProps) {
    return (
        <Card className="p-4 relative group hover:border-primary transition-colors">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex gap-4">
                {/* Scene Number */}
                <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl font-bold text-muted-foreground/30">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Scene</Badge>
                        {scene.location && (
                            <Badge variant="secondary" className="text-xs">{scene.location}</Badge>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed">{scene.description}</p>

                    {scene.characters && scene.characters.length > 0 && (
                        <div className="flex gap-2 pt-2">
                            {scene.characters.map((char, i) => (
                                <div key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                    {char}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
