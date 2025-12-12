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
import { mockChatThreads, mockChatMessages, ChatMessage } from '../lib/mockChatData';

interface ChatConversationProps {
  chatId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function ChatConversation({ chatId, onNavigate }: ChatConversationProps) {
  const thread = chatId ? mockChatThreads.find((t) => t.id === chatId) : mockChatThreads[0];
  const initialMessages = chatId ? mockChatMessages[chatId] || [] : mockChatMessages['1'];
  
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!thread) return null;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: inputValue,
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate character response after a delay
    setTimeout(() => {
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: thread.characterId,
        senderName: thread.characterName,
        senderAvatar: thread.characterAvatar,
        content: generateCharacterResponse(inputValue),
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      setMessages((prev) => [...prev, characterResponse]);
    }, 1500);
  };

  const generateCharacterResponse = (userMessage: string) => {
    const responses = [
      `That's an interesting perspective on "${userMessage}". Let me think about that...`,
      `I understand what you mean. In my experience with ${thread.storyTitle}, similar situations have taught me valuable lessons.`,
      `${userMessage}? That reminds me of something that happened in the story...`,
      `You raise a good point. Let me share my thoughts on that.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server
    // For now, we'll create a local URL
    const imageUrl = URL.createObjectURL(file);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: '',
      image: imageUrl,
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessages([...messages, newMessage]);

    // Simulate character response
    setTimeout(() => {
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: thread.characterId,
        senderName: thread.characterName,
        senderAvatar: thread.characterAvatar,
        content: 'What a fascinating image! Thank you for sharing that with me.',
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      setMessages((prev) => [...prev, characterResponse]);
    }, 1500);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setDeleteDialogOpen(false);
  };

  const totalMessages = messages.length;
  const userMessages = messages.filter((m) => m.isUser).length;
  const characterMessages = messages.filter((m) => !m.isUser).length;
  const daysActive = Math.ceil(
    (new Date().getTime() - new Date(thread.createdAt).getTime()) / 86400000
  );

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
            <p className="text-muted-foreground">from {thread.storyTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message) => (
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

              <span className="text-muted-foreground mt-1 px-2">
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
        ))}
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
            disabled={!inputValue.trim()}
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
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
