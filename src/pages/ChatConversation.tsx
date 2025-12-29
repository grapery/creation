import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, MoreVertical, Trash2, BarChart3, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useChatStore, useCharacterStore } from '../stores';
import { useChatSSE } from '../hooks/useSSE';
import { toast } from 'sonner';
import type { AgentChatMessage } from '../stores/chatStore';

interface ChatConversationProps {
  chatId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function ChatConversation({ chatId, onNavigate }: ChatConversationProps) {
  const { threads, messages, isLoading, fetchThread, fetchMessages, sendMessage, setCurrentThread, addMessage } = useChatStore();
  const { fetchCharacter } = useCharacterStore();
  
  const [inputValue, setInputValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find thread - either by ID or characterId
  const thread = chatId 
    ? threads.find((t) => t.id === chatId) || threads.find((t) => t.characterId === chatId)
    : threads[0];

  useEffect(() => {
    if (chatId) {
      // Try to find thread first
      const foundThread = threads.find((t) => t.id === chatId) || threads.find((t) => t.characterId === chatId);
      if (foundThread) {
        setCurrentThread(foundThread);
        fetchMessages(foundThread.id);
      } else {
        // Thread not found, might need to create one or fetch from server
        fetchThread(chatId);
      }
    }
  }, [chatId, threads, fetchThread, fetchMessages, setCurrentThread]);

  // SSE for real-time updates
  useChatSSE(thread?.id || '', (sseMessage) => {
    if (sseMessage.type === 'message' && sseMessage.messageId) {
      // Handle new message from SSE
      const newMessage: AgentChatMessage = {
        id: sseMessage.messageId,
        threadId: thread?.id || '',
        senderId: sseMessage.isComplete ? 'user' : thread?.characterId || '',
        senderName: sseMessage.isComplete ? 'You' : thread?.characterName || '',
        senderAvatar: sseMessage.isComplete ? '' : thread?.characterAvatar || '',
        content: sseMessage.content || sseMessage.data || '',
        timestamp: Date.now(),
        isUser: sseMessage.isComplete || false,
      };
      addMessage(newMessage);
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (thread?.characterId) {
      fetchCharacter(thread.characterId);
    }
  }, [thread?.characterId, fetchCharacter]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!thread) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !thread) return;

    setIsSending(true);
    const messageContent = inputValue;
    setInputValue('');

    try {
      await sendMessage({
        characterId: thread.characterId,
        content: messageContent,
        threadId: thread.id,
      });
      // Message will be added via SSE or response
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send message');
      setInputValue(messageContent); // Restore input on error
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !thread) return;

    // TODO: Upload image to server first, then send message with image URL
    const imageUrl = URL.createObjectURL(file);

    try {
      await sendMessage({
        characterId: thread.characterId,
        content: '',
        threadId: thread.id,
        image: imageUrl, // In production, this should be the uploaded image URL
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send image');
    }
  };

  const handleClearHistory = async () => {
    if (!thread) return;
    
    try {
      // Archive thread instead of clearing messages
      await archiveThread(thread.id);
      toast.success('Chat archived');
      onNavigate('chat');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to archive chat');
    }
    setDeleteDialogOpen(false);
  };

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Chat not found</p>
          <Button onClick={() => onNavigate('chat')}>Back to Chats</Button>
        </div>
      </div>
    );
  }

  const totalMessages = messages.length;
  const userMessages = messages.filter((m) => m.isUser).length;
  const characterMessages = messages.filter((m) => !m.isUser).length;
  const daysActive = thread.createdAt 
    ? Math.ceil((Date.now() - thread.createdAt) / 86400000)
    : 1;

  return (
    <div className="flex flex-col h-screen">
      <MobileHeader
        title={thread.characterName}
        showBack
        onBack={() => onNavigate('chat')}
        actions={
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('character-viewer', thread.characterId)}
            >
              <User className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('character-viewer', thread.characterId)}>
                  View Character Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAnalyticsDialogOpen(true)}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      {/* Character Info Banner */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-12 w-12 cursor-pointer"
            onClick={() => onNavigate('character-viewer', thread.characterId)}
          >
            <AvatarImage src={thread.characterAvatar} />
            <AvatarFallback>{thread.characterName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4>{thread.characterName}</h4>
            {thread.storyTitle && (
              <p className="text-muted-foreground">from {thread.storyTitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {isLoading && messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!message.isUser && (
              <Avatar
                className="h-8 w-8 flex-shrink-0 cursor-pointer"
                onClick={() => onNavigate('character-viewer', thread.characterId)}
              >
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
              </Avatar>
            )}

            <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
              {message.image && (
                <div className="rounded-lg overflow-hidden mb-2">
                  <img
                    src={message.image}
                    alt="Shared image"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              {message.content && (
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              )}

              <span className="text-muted-foreground mt-1 px-2 text-xs">
                {formatTime(message.timestamp)}
              </span>
            </div>

            {message.isUser && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t safe-area-bottom">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />

          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Clear History Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all messages in this conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground">
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analytics Dialog */}
      <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Analytics</DialogTitle>
            <DialogDescription>
              Conversation statistics with {thread.characterName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span>{totalMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Messages</span>
                  <span>{userMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Character Messages</span>
                  <span>{characterMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Days Active</span>
                  <span>{daysActive}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Messages per Day</span>
                  <span>{(totalMessages / daysActive).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Conversation Started</span>
                  <span>{thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                {thread.totalTokensUsed && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Tokens Used</span>
                    <span>{thread.totalTokensUsed.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
