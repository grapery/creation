import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { GenericResponse, Story } from '../types';
import { AlertCircle, Loader2 } from 'lucide-react';

const GENRES = [
    'Fantasy', 'Sci-Fi', 'Horror', 'Romance', 'Mystery',
    'Adventure', 'Slice of Life', 'Tragedy', 'Comedy', 'Historical'
];

export default function SubmitStory() {
    console.log("SubmitStory mounting");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        genre: GENRES[0],
        description: '',
        tags: '',
        useAIEnrich: true,
        generateCover: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const payload = {
                title: formData.title,
                genre: formData.genre,
                description: formData.description,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                useAIEnrich: formData.useAIEnrich,
                generateCover: formData.generateCover,
                status: 'draft',
                defaultSceneCount: 6 // Match backend default preference
            };

            const response = await apiClient.post<GenericResponse<Story>>('/stories', payload);

            // Backend returns Success(c, story) so data is properly wrapped
            const createdStory = response.data.data;
            if (createdStory && createdStory.id) {
                navigate(`/stories/${createdStory.id}`);
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (err: any) {
            console.error("Failed to create story:", err);
            setError(err.response?.data?.message || err.message || "Failed to create story");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create a New Story</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="The Great Adventure"
                                required
                                maxLength={200}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Genre</label>
                            <select
                                className="w-full h-10 px-3 py-2 border rounded-md border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={formData.genre}
                                onChange={e => setFormData({ ...formData, genre: e.target.value })}
                            >
                                {GENRES.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full min-h-[120px] px-3 py-2 border rounded-md border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the premise..."
                                maxLength={2000}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <Input
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="magic, dragons, hero"
                            />
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h3 className="font-medium text-sm text-gray-900">AI Assistance</h3>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="aiEnrich"
                                    checked={formData.useAIEnrich}
                                    onChange={e => setFormData({ ...formData, useAIEnrich: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="aiEnrich" className="text-sm text-gray-700">
                                    Enrich description details using AI
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="genCover"
                                    checked={formData.generateCover}
                                    onChange={e => setFormData({ ...formData, generateCover: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="genCover" className="text-sm text-gray-700">
                                    Generate cover image automatically
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Story'
                                )}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
