import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import type { CreateCharacterReq, GenerateCharacterReq, GenerateCharacterRes, GenericResponse, Character } from '../types';

export default function CreateCharacter() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState(''); // Prompt for generation or Bio
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [personality, setPersonality] = useState('');
    const [background, setBackground] = useState('');
    const [appearance, setAppearance] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleGenerate = async () => {
        if (!description && !name) {
            alert("Please enter a name or a concept description to generate.");
            return;
        }
        setGenerating(true);
        try {
            const payload: GenerateCharacterReq = {
                name,
                description
            };
            const res = await apiClient.post<GenericResponse<GenerateCharacterRes>>('/characters/generate', payload);
            const data = res.data.data;
            if (data) {
                if (data.name) setName(data.name);
                if (data.description) setDescription(data.description); // Update bio with generated one? Or keep concept?
                // Actually the API likely returns the structured fields
                setGender(data.gender || '');
                setAge(data.age || '');
                setOccupation(data.occupation || '');
                setPersonality(data.personality || '');
                setBackground(data.background || '');
                setAppearance(data.appearance || '');
            }
        } catch (error) {
            console.error("Failed to generate character", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: CreateCharacterReq = {
                name,
                description,
                gender,
                age,
                occupation,
                personality,
                background,
                appearance,
                avatar,
                isPublic
            };
            const res = await apiClient.post<GenericResponse<Character>>('/characters', payload);
            const newChar = res.data.data;
            if (newChar) {
                navigate(`/characters/${newChar.id}`);
            }
        } catch (error) {
            console.error("Failed to create character", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-3xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create a Character</CardTitle>
                    <CardDescription>
                        Design a new character for your stories. You can use AI to help flesh out the details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-end gap-2">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="concept">Concept / Description</Label>
                                    <textarea
                                        id="concept"
                                        className="flex min-h-[60px] w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="E.g. A cyberpunk detective who loves jazz..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="mb-0.5 bg-purple-600 hover:bg-purple-700"
                                >
                                    {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                    AI Generate
                                </Button>
                            </div>
                            <p className="text-xs text-purple-600">
                                Enter a brief concept above and click "AI Generate" to fill in the details below automatically.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Input id="gender" value={gender} onChange={e => setGender(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" value={age} onChange={e => setAge(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input id="occupation" value={occupation} onChange={e => setOccupation(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="personality">Personality</Label>
                            <textarea
                                id="personality"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={personality}
                                onChange={e => setPersonality(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="background">Background Story</Label>
                            <textarea
                                id="background"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={background}
                                onChange={e => setBackground(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="appearance">Appearance</Label>
                            <textarea
                                id="appearance"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={appearance}
                                onChange={e => setAppearance(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input id="avatar" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="public"
                                checked={isPublic}
                                onChange={e => setIsPublic(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="public">Make Public</Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" disabled={loading || !name}>
                                {loading ? 'Creating...' : 'Create Character'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
