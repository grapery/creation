import { useState } from 'react';
import { Search, MoreVertical, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { mockChatThreads } from '../lib/mockChatData';

interface ChatListProps {
  onNavigate: (page: string, id?: string) => void;
}

export function ChatList({ onNavigate }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState(mockChatThreads);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  const filteredThreads = threads.filter(
    (thread) =>
      thread.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.storyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
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

  const handleDeleteThread = (threadId: string) => {
    setThreadToDelete(threadId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (threadToDelete) {
      setThreads(threads.filter((t) => t.id !== threadToDelete));
      setThreadToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <MobileHeader
        title="Chats"
        actions={
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Chat Threads */}
        <div className="space-y-2">
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className="active:scale-98 transition-transform cursor-pointer"
                onClick={() => onNavigate('chat-conversation', thread.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar
                        className="h-14 w-14 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('character-viewer', thread.characterId);
                        }}
                      >
                        <AvatarImage src={thread.characterAvatar} />
                        <AvatarFallback>{thread.characterName[0]}</AvatarFallback>
                      </Avatar>
                      {thread.unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate">{thread.characterName}</h4>
                          <p className="text-muted-foreground truncate">
                            {thread.storyTitle}
                          </p>
                        </div>
                        <span className="text-muted-foreground flex-shrink-0">
                          {formatTime(thread.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 mb-2">
                        {thread.lastMessage}
                      </p>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{thread.messageCount} messages</span>
                        <span>•</span>
                        <span>{thread.interactionFrequency.toFixed(1)} msgs/day</span>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('character-viewer', thread.characterId);
                          }}
                        >
                          View Character Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show analytics
                          }}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteThread(thread.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No chats found' : 'No conversations yet'}
                </p>
                {!searchQuery && (
                  <p className="text-muted-foreground mt-2">
                    Start chatting with characters from your stories!
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
