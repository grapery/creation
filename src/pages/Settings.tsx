import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import type { UpdateProfileReq, GenericResponse, User } from '../types';

export default function Settings() {
    const { user, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [avatar, setAvatar] = useState('');
    const [background, setBackground] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setDisplayName(user.displayName || '');
        setBio(user.bio || '');
        setLocation(user.location || '');
        setWebsite(user.website || '');
        setAvatar(user.avatar || '');
        setBackground(user.background || '');
    }, [user, navigate]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: UpdateProfileReq = {
                displayName,
                bio,
                location,
                website,
                avatar,
                background
            };

            await apiClient.put<GenericResponse<User>>(`/users/${user?.id}`, payload);
            await checkAuth(); // Refresh user data
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your public profile details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input
                                            id="displayName"
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={website}
                                            onChange={e => setWebsite(e.target.value)}
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avatar">Avatar URL</Label>
                                    <Input
                                        id="avatar"
                                        value={avatar}
                                        onChange={e => setAvatar(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="background">Background URL</Label>
                                    <Input
                                        id="background"
                                        value={background}
                                        onChange={e => setBackground(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Password change and email settings coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Theme settings coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
