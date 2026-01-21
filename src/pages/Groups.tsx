import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Group, GenericResponse, PaginatedList } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Users, Plus } from 'lucide-react';
import { CreateGroupDialog } from '../components/CreateGroupDialog';

export default function Groups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Assuming /groups returns PaginatedList or list of groups wrapped in GenericResponse
                const res = await apiClient.get<GenericResponse<PaginatedList<Group>>>('/groups');
                // Adjust based on actual API response structure. 
                // If the generic wrap structure is: data: { items: [] } 
                if (res.data.data && res.data.data.items) {
                    setGroups(res.data.data.items);
                } else if (Array.isArray(res.data.data)) {
                    // Fallback if API returns array directly
                    setGroups(res.data.data as any);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Spaces</h1>
                    <p className="text-gray-500">Discover and join spaces matching your interests.</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Create Space
                </Button>
            </div>

            <CreateGroupDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={() => window.location.reload()} // Simple reload to refresh list
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No spaces found</h3>
                    <p className="text-gray-500 mb-6">Be the first to create one!</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>Create Space</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <Card key={group.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={group.avatar} />
                                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">
                                            <Link to={`/r/${group.id}`} className="hover:underline">
                                                r/{group.name}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="line-clamp-1">
                                            {group.members} members
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                                    {group.description || "No description provided."}
                                </p>
                                <div className="mt-4">
                                    <Link to={`/r/${group.id}`}>
                                        <Button variant="outline" className="w-full">View Space</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
