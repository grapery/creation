import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { StoryCard } from '../components/StoryCard';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Users, Settings, Plus, UserPlus, ArrowLeft } from 'lucide-react';
import type { Group, GenericResponse, Story } from '../types';
import { useAuthStore } from '../stores/authStore';
import { InviteMemberDialog } from '../components/InviteMemberDialog';
import { EditGroupDialog } from '../components/EditGroupDialog';
import { cn } from '../lib/utils';

export default function GroupDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [group, setGroup] = useState<Group | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [joining, setJoining] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            // Fetch Group
            const groupRes = await apiClient.get<GenericResponse<Group>>(`/groups/${id}`);
            setGroup(groupRes.data.data);

            // Fetch Group Stories
            const storiesRes = await apiClient.get<GenericResponse<{ stories: Story[] }>>('/stories', {
                params: { groupId: id, limit: 20 }
            });
            setStories(storiesRes.data.data.stories || []);
        } catch (error) {
            console.error("Failed to fetch group data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleJoin = async () => {
        if (!group) return;
        setJoining(true);
        try {
            await apiClient.post(`/groups/${group.id}/follow`);
            // Refresh group to get updated membership status
            const res = await apiClient.get<GenericResponse<Group>>(`/groups/${group.id}`);
            setGroup(res.data.data);
        } catch (err) {
            console.error("Failed to join community", err);
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading community...</div>;
    if (!group) return <div className="p-8 text-center text-red-500 bg-gray-50 min-h-screen">Community not found</div>;

    // Admin check: Owner or Admin
    const isAdmin = group.my_role === 'owner' || group.my_role === 'admin';

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="h-40 bg-blue-600 relative">
                {/* Banner Image if any */}
                {group.cover_image && <img src={group.cover_image} className="w-full h-full object-cover" alt="Cover" />}
            </div>
            <div className="container max-w-5xl mx-auto px-4 pb-4">
                <div className="relative -mt-12 mb-4 bg-white rounded-lg shadow p-6 flex items-start gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white -mt-16 bg-white">
                        <AvatarImage src={group.avatar} />
                        <AvatarFallback className="text-2xl">{group.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 pt-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            r/{group.name}
                            {!group.is_public && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 font-normal">Private</span>}
                        </h1>
                        <p className="text-gray-500 mt-1">{group.description}</p>
                        <Link to="/groups" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Spaces
                        </Link>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{group.members} members</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        <Button
                            className={cn("w-full transition-all", group.my_role ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-700")}
                            onClick={handleJoin}
                            disabled={joining}
                        >
                            {group.my_role ? 'Member' : 'Join Space'}
                        </Button>
                        {isAdmin && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
                                    <Settings className="w-4 h-4" /> Settings
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => setInviteOpen(true)}>
                                    <UserPlus className="w-4 h-4" /> Invite
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {/* Create Post Bar */}
                        <Card>
                            <CardContent className="p-4 flex gap-4 items-center">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <input
                                    type="text"
                                    placeholder="Create a story in this community..."
                                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 hover:bg-white hover:ring-1 hover:ring-blue-500 transition-all focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                                    onClick={() => navigate('/submit', { state: { groupId: group.id } })}
                                    readOnly
                                />
                                <Button size="icon" variant="ghost"><Plus className="w-5 h-5 text-gray-500" /></Button>
                            </CardContent>
                        </Card>

                        {/* Stories Feed */}
                        {stories.length > 0 ? (
                            stories.map(story => <StoryCard key={story.id} story={story} />)
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                                No stories yet.
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 hidden md:block">
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-bold border-b pb-2 mb-4">About Community</h3>
                                <p className="text-sm text-gray-600 mb-4">{group.description || "No description."}</p>

                                <div className="text-xs text-gray-400">
                                    Created {new Date(group.created_at * 1000).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {group && (
                <>
                    <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} groupId={group.id} />
                    <EditGroupDialog
                        group={group}
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        onSuccess={(updatedGroup) => setGroup(updatedGroup)}
                    />
                </>
            )}
        </div>
    );
}
