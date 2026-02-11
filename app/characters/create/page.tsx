"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Simple Textarea
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
}

import { Loader2, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { characters } from "@/lib/api/characters";

export default function CreateCharacterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        systemPrompt: "",
        isPublic: true,
        avatar: ""
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            await characters.create(formData);
            router.push("/characters");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">Create Character</h1>
                <p className="text-muted-foreground">Bring a new personality to life</p>
            </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Define who your character is.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Sherlock Holmes"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                placeholder="A brief description visible to others..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prompt">System Persona (Prompt)</Label>
                            <div className="relative">
                                <Textarea
                                    id="prompt"
                                    placeholder="You are a helpful assistant..."
                                    className="min-h-[150px]"
                                    value={formData.systemPrompt}
                                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                                />
                                <Button size="sm" variant="ghost" className="absolute right-2 bottom-2 text-xs">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    Generate
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Define how the character behaves in chat.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Avatar</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">Upload or Generate Image</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button onClick={onSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Character
                        </Button>
                    </CardFooter>
                </Card>
        </div>
    );
}
