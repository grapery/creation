import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import type { Group, GenericResponse } from '../types';
import { Loader2 } from 'lucide-react';

interface EditGroupDialogProps {
    group: Group;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (updatedGroup: Group) => void;
}

export function EditGroupDialog({ group, open, onOpenChange, onSuccess }: EditGroupDialogProps) {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);
    const [isPublic, setIsPublic] = useState(group.is_public);
    const [avatarUrl, setAvatarUrl] = useState(group.avatar || '');
    const [coverUrl, setCoverUrl] = useState(group.cover_image || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when group changes or dialog opens
    useEffect(() => {
        if (open) {
            setName(group.name);
            setDescription(group.description);
            setIsPublic(group.is_public);
            setAvatarUrl(group.avatar || '');
            setCoverUrl(group.cover_image || '');
        }
    }, [open, group]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            // Update basic info
            const updateReq = {
                name,
                description,
                isPublic,
                avatar: avatarUrl,
                cover_image: coverUrl,
            };

            await apiClient.put(`/groups/${group.id}`, updateReq);

            // Fetch updated group to be sure
            const res = await apiClient.get<GenericResponse<Group>>(`/groups/${group.id}`);
            onSuccess(res.data.data);
            onOpenChange(false);
        } catch (err: any) {
            console.error("Failed to update group", err);
            setError(err.response?.data?.msg || "Failed to update group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Community Settings</DialogTitle>
                    <DialogDescription>
                        Update your community's details.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {/* Description */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    {/* Type (Public/Private) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Privacy</Label>
                        <div className="col-span-3 flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="privacy"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                /> Public
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="privacy"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                /> Private
                            </label>
                        </div>
                    </div>
                    {/* Avatar URL (Simple Input) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
                        <Input
                            id="avatar"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="col-span-3"
                            placeholder="https://..."
                        />
                    </div>
                    {/* Cover URL (Simple Input) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cover" className="text-right">Cover URL</Label>
                        <Input
                            id="cover"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            className="col-span-3"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
