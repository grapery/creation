import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import type { GenericResponse } from '../types';

interface InviteMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: string;
}

export function InviteMemberDialog({ open, onOpenChange, groupId }: InviteMemberDialogProps) {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInvite = async () => {
        if (!userId.trim()) return;
        setLoading(true);
        try {
            // Placeholder: Assuming post to /groups/:id/members with userId
            await apiClient.post<GenericResponse<any>>(`/groups/${groupId}/members`, { userId });
            onOpenChange(false);
            setUserId('');
            alert('Member invited (simulated)');
        } catch (err) {
            console.error("Failed to invite member", err);
            // alert('Failed to invite member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Enter the User ID or Username to invite them to this community.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="userId">User ID / Username</Label>
                        <Input
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. user-123"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleInvite} disabled={loading || !userId}>
                        {loading ? 'Sending...' : 'Send Invite'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
