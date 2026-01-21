import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { apiClient } from '../lib/api';
import type { CreateStoryboardReq, Storyboard, GenericResponse } from '../types';
import { Loader2 } from 'lucide-react';

// Simple Textarea component if not exists, otherwise I'll use standard <textarea> with tailwind classes
// I'll assume standard textarea for now to save time or use the Input's styles

interface CreateStoryboardDialogProps {
    storyId: string;
    parentId?: string; // Optional, if branching
    trigger?: React.ReactNode;
    onSuccess?: (newBoard: Storyboard) => void;
}

export function CreateStoryboardDialog({ storyId, parentId, trigger, onSuccess }: CreateStoryboardDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        rawInput: '',
        sceneCount: 4
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload: CreateStoryboardReq = {
                storyId,
                parentId: parentId, // undefined if root
                title: formData.title,
                rawInput: formData.rawInput,
                sceneCount: Number(formData.sceneCount) || 4,
                isStandalone: false
            };

            const res = await apiClient.post<GenericResponse<Storyboard>>('/storyboards', payload);
            if (res.data.data) {
                onSuccess?.(res.data.data);
                setOpen(false);
                // Reset form
                setFormData({ title: '', rawInput: '', sceneCount: 4 });
            }
        } catch (err: any) {
            console.error("Failed to create storyboard:", err);
            setError(err.response?.data?.message || err.message || "Failed to create storyboard");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Create Storyboard</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{parentId ? "Branch this Story" : "Create New Storyboard"}</DialogTitle>
                    <DialogDescription>
                        Describe what happens in this sequence. AI will help generate the scenes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. The Hero's Arrival"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Story Content</Label>
                        <textarea
                            id="content"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the scenes in detail..."
                            value={formData.rawInput}
                            onChange={(e) => setFormData({ ...formData, rawInput: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="scenes">Approximate Scenes</Label>
                        <Input
                            id="scenes"
                            type="number"
                            min={1}
                            max={16}
                            value={formData.sceneCount}
                            onChange={(e) => setFormData({ ...formData, sceneCount: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
