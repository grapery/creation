import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Bell, Check, Trash2, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Notification, GenericResponse } from '../types';

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get<GenericResponse<{ notifications: Notification[], count: number }>>('/notifications');
            setNotifications(res.data.data.notifications || []);
            // Also refresh unread count in navbar? (Ideally handled by a store or SWR)
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiClient.post(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.post('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiClient.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    const handleClick = (n: Notification) => {
        if (!n.read) {
            apiClient.post(`/notifications/${n.id}/read`).catch(console.error);
        }
        if (n.link) {
            navigate(n.link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="w-4 h-4 text-red-500" fill="currentColor" />;
            case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
            default: return <Bell className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={loading || notifications.length === 0}>
                    <Check className="w-4 h-4 mr-2" /> Mark all as read
                </Button>
            </div>

            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading updates...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <Bell className="w-12 h-12 mx-auto text-gray-200 mb-2" />
                        <p className="text-gray-500">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <Card
                            key={n.id}
                            className={`cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? 'bg-blue-50 border-blue-100' : ''}`}
                            onClick={() => handleClick(n)}
                        >
                            <CardContent className="p-4 flex items-start gap-4">
                                <Avatar className="w-10 h-10 mt-1">
                                    <AvatarImage src={n.actorAvatar} />
                                    <AvatarFallback>{n.actorName?.[0] || '?'}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {getIcon(n.type)}
                                        <span className="font-semibold text-sm">{n.title}</span>
                                        <span className="text-xs text-gray-400">• {formatDistanceToNow(n.createdAt * 1000)} ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{n.content}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {!n.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                            onClick={(e) => handleMarkAsRead(n.id, e)}
                                            title="Mark as read"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={(e) => handleDelete(n.id, e)}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
