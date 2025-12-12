import { Heart, UserPlus, MessageCircle, Bell, BookOpen, Sparkles } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

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

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'ai-complete',
    title: 'AI Storyboard Ready',
    message: 'Your AI-generated storyboard for "The Last Kingdom" is ready to review',
    timestamp: '5m ago',
    isRead: false,
    actionId: 'sb-1',
  },
  {
    id: 'n2',
    type: 'follow',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      id: 'u2',
    },
    title: 'New Follower',
    message: 'Sarah Chen started following you',
    timestamp: '2h ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'like',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      id: 'u3',
    },
    title: 'Story Liked',
    message: 'Mike Johnson liked your story "The Last Kingdom"',
    timestamp: '3h ago',
    isRead: false,
    actionId: 's1',
  },
  {
    id: 'n4',
    type: 'comment',
    user: {
      name: 'Emily Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      id: 'u4',
    },
    title: 'New Comment',
    message: 'Emily Davis commented on your storyboard',
    timestamp: '5h ago',
    isRead: true,
    actionId: 'sb-1',
  },
  {
    id: 'n5',
    type: 'update',
    user: {
      name: 'Chris Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
      id: 'u5',
    },
    title: 'Story Updated',
    message: 'Chris Wilson added a new chapter to "Mystery in the Mountains"',
    timestamp: '1d ago',
    isRead: true,
    actionId: 's2',
  },
  {
    id: 'n6',
    type: 'announcement',
    title: 'New Feature: AI Storyboards',
    message: 'Create stunning storyboards with our new AI-powered generation tool',
    timestamp: '2d ago',
    isRead: true,
  },
];

export function Notifications({ onNavigate }: NotificationsProps) {
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

  const handleNotificationClick = (notification: Notification) => {
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

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const allNotifications = mockNotifications;
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card
      className={`active:scale-98 transition-transform ${
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
      <MobileHeader title="Notifications" showBack onBack={() => onNavigate('dashboard')} />

      <div className="p-4">
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
      </div>
    </div>
  );
}
