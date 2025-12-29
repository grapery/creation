import { useState, useEffect } from 'react';
import { Heart, UserPlus, MessageCircle, Bell, BookOpen, Sparkles } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { notificationApi } from '../lib/api';
import { toast } from 'sonner';

interface NotificationsProps {
  onNavigate: (page: string, id?: string) => void;
}

type NotificationType = 'follow' | 'like' | 'comment' | 'update' | 'announcement' | 'ai-complete';

interface Notification {
  id: string;
  type: NotificationType;
  user?: {
    name: string;
    avatar: string;
    id: string;
  };
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionId?: string;
}

export function Notifications({ onNavigate }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.listNotifications();
      const data = response.data.notifications || response.data.data || response.data || [];
      
      // Transform API response to Notification format
      const transformedNotifications: Notification[] = data.map((n: any) => ({
        id: n.id,
        type: n.type || 'update',
        user: n.user ? {
          name: n.user.displayName || n.user.name || n.user.username,
          avatar: n.user.avatar || '',
          id: n.user.id,
        } : undefined,
        title: n.title || n.message || 'Notification',
        message: n.message || n.content || '',
        timestamp: formatTimestamp(n.createdAt || n.timestamp),
        isRead: n.isRead || false,
        actionId: n.actionId || n.targetId,
      }));
      
      setNotifications(transformedNotifications);
      setUnreadCount(transformedNotifications.filter(n => !n.isRead).length);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      const count = response.data.count || response.data.unreadCount || 0;
      setUnreadCount(count);
    } catch (error) {
      // Silently fail, use count from notifications list
    }
  };

  const formatTimestamp = (timestamp: string | number | Date): string => {
    if (!timestamp) return 'Just now';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await notificationApi.markAsRead(notification.id);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        // Silently fail
      }
    }

    // Navigate based on notification type
    if (notification.type === 'follow' && notification.user) {
      onNavigate('profile', notification.user.id);
    } else if (notification.type === 'like' && notification.actionId) {
      onNavigate('story-detail', notification.actionId);
    } else if (notification.type === 'comment' && notification.actionId) {
      onNavigate('storyboard-viewer', notification.actionId);
    } else if (notification.type === 'update' && notification.actionId) {
      onNavigate('story-detail', notification.actionId);
    } else if (notification.type === 'ai-complete' && notification.actionId) {
      onNavigate('storyboard-viewer', notification.actionId);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to mark all as read');
    }
  };
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'update':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'ai-complete':
        return <Sparkles className="h-5 w-5 text-yellow-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card
      className={`active:scale-98 transition-transform cursor-pointer ${
        !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {notification.user ? (
              <Avatar className="h-12 w-12">
                <AvatarImage src={notification.user.avatar} />
                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="line-clamp-1">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
              )}
            </div>
            <p className="text-muted-foreground line-clamp-2 mb-1">{notification.message}</p>
            <p className="text-muted-foreground">{notification.timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader 
        title="Notifications" 
        showBack 
        onBack={() => onNavigate('dashboard')}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:underline"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading notifications...</div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all">
                All {allNotifications.length > 0 && `(${allNotifications.length})`}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {allNotifications.length > 0 ? (
                allNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-3 mt-4">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">All caught up!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
