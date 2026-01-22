import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { User, Story, GenericResponse, UserActivity } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StoryCard } from '../components/StoryCard';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Link as LinkIcon, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch User Profile
                const userRes = await apiClient.get<GenericResponse<User>>(`/users/${id}`);
                setUser(userRes.data.data);

                // Fetch User Stories
                const storiesRes = await apiClient.get<GenericResponse<{ stories: Story[] }>>(`/users/${id}/stories`);
                const storiesData = storiesRes.data.data;
                setStories(storiesData.stories || []);

                // Fetch Activities
                const actRes = await apiClient.get<GenericResponse<{ activities: UserActivity[] }>>(`/users/${id}/activities`);
                const actData = actRes.data.data;
                setActivities(actData.activities || []);

            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

    return (
        <div className="container max-w-5xl mx-auto py-6 px-4">
            {/* Header Section */}
            <div className="mb-8">
                <div className="relative h-48 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden mb-4">
                    {user.background && <img src={user.background} alt="Background" className="w-full h-full object-cover" />}
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center px-4 -mt-16 mb-4 gap-4 relative z-10">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-4xl">{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 mt-4 md:mt-0 md:mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{user.displayName || user.username}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                    </div>

                    <div className="flex gap-2 md:mb-4">
                        {user.isFollowing ? (
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    try {
                                        await apiClient.delete(`/users/${user.id}/follow`);
                                        setUser({ ...user, isFollowing: false, followers: (user.followers || 0) - 1 });
                                        toast.success('Unfollowed');
                                    } catch (err) {
                                        console.error("Failed to unfollow", err);
                                    }
                                }}
                            >
                                Unfollow
                            </Button>
                        ) : (
                            <Button
                                onClick={async () => {
                                    try {
                                        await apiClient.post(`/users/${user.id}/follow`);
                                        setUser({ ...user, isFollowing: true, followers: (user.followers || 0) + 1 });
                                        toast.success('Following!');
                                    } catch (err) {
                                        console.error("Failed to follow", err);
                                    }
                                }}
                            >
                                Follow
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={() => {
                                toast.info('Direct messaging coming soon!');
                            }}
                        >
                            Message
                        </Button>
                    </div>
                </div>

                <div className="px-4 space-y-4">
                    {user.bio && <p className="text-gray-700 max-w-2xl">{user.bio}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {user.location}
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                <a href={user.website} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">{user.website}</a>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Joined {new Date(user.createdAt * 1000).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex gap-6 pt-2 border-t">
                        <div className="flex gap-1">
                            <span className="font-bold text-gray-900">{user.following || 0}</span>
                            <span className="text-gray-500">Following</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold text-gray-900">{user.followers || 0}</span>
                            <span className="text-gray-500">Followers</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold text-gray-900">{user.storyboardCount || 0}</span>
                            <span className="text-gray-500">Storyboards</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="stories" className="w-full">
                <TabsList>
                    <TabsTrigger value="stories">Stories</TabsTrigger>
                    <TabsTrigger value="activities">Activity</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="stories" className="mt-6 space-y-4">
                    {stories.length > 0 ? (
                        stories.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No stories published yet.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="activities" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activities.length > 0 ? (
                                activities.map(act => (
                                    <div key={act.id} className="flex items-start gap-3 border-b last:border-0 pb-3">
                                        <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">{act.type.replace('_', ' ')}</span>
                                                {act.targetTitle && <span className="text-gray-600"> - {act.targetTitle}</span>}
                                            </p>
                                            <span className="text-xs text-gray-500">{formatDistanceToNow(act.createdAt * 1000)} ago</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500">No recent activity.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Bio</h3>
                                    <p className="text-gray-600">{user.bio || "No bio available."}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">User ID</h3>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{user.id}</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
