import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import type { Group, GenericResponse, CreateGroupReq } from '../types';

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (group: Group) => void;
}

export function CreateGroupDialog({ open, onOpenChange, onSuccess }: CreateGroupDialogProps) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            const payload: CreateGroupReq = {
                name,
                description,
                isPublic
            };
            const res = await apiClient.post<GenericResponse<Group>>('/groups', payload);
            const newGroup = res.data.data;
            if (newGroup && newGroup.id) {
                onOpenChange(false);
                if (onSuccess) {
                    onSuccess(newGroup);
                } else {
                    navigate(`/r/${newGroup.id}`);
                }
            }
        } catch (err) {
            console.error("Failed to create group", err);
            // In a real app, show usage of sonner toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a Space</DialogTitle>
                    <DialogDescription>
                        Build a new home for your story collaborations.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">r/</span>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-8"
                                placeholder="space_name"
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Names cannot be changed after creation.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this space about?"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="public">Public Space</Label>
                        <input
                            type="checkbox"
                            id="public"
                            checked={isPublic}
                            onChange={e => setIsPublic(e.target.checked)}
                            className="h-4 w-4"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={loading || !name}>
                        {loading ? 'Creating...' : 'Create Space'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
