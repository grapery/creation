export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  isUser: boolean;
}

export interface ChatThread {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  storyTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messageCount: number;
  interactionFrequency: number; // messages per day
  createdAt: string;
}

export const mockChatThreads: ChatThread[] = [
  {
    id: '1',
    characterId: '1',
    characterName: 'Luna Nightshade',
    characterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    storyTitle: 'The Last Kingdom',
    lastMessage: 'The ancient prophecy speaks of a time when the stars align...',
    lastMessageTime: '2024-01-15T10:30:00Z',
    unreadCount: 2,
    messageCount: 145,
    interactionFrequency: 12.5,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    characterId: '2',
    characterName: 'Marcus Steel',
    characterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    storyTitle: 'Neon Shadows',
    lastMessage: 'The underground network needs your help. Meet me at the old dock.',
    lastMessageTime: '2024-01-14T18:45:00Z',
    unreadCount: 0,
    messageCount: 89,
    interactionFrequency: 8.2,
    createdAt: '2023-12-20T00:00:00Z',
  },
  {
    id: '3',
    characterId: '3',
    characterName: 'Aria Moonstone',
    characterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    storyTitle: 'The Last Kingdom',
    lastMessage: 'I found something interesting in the ancient library today!',
    lastMessageTime: '2024-01-14T12:20:00Z',
    unreadCount: 1,
    messageCount: 203,
    interactionFrequency: 15.8,
    createdAt: '2023-12-15T00:00:00Z',
  },
  {
    id: '4',
    characterId: '4',
    characterName: 'Dr. Elena Voss',
    characterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    storyTitle: 'Neon Shadows',
    lastMessage: 'The experiment results are fascinating. Let me show you.',
    lastMessageTime: '2024-01-13T16:00:00Z',
    unreadCount: 0,
    messageCount: 67,
    interactionFrequency: 5.3,
    createdAt: '2024-01-05T00:00:00Z',
  },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      senderName: 'Luna Nightshade',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      content: 'Greetings, traveler. I sense a great power within you.',
      timestamp: '2024-01-15T10:25:00Z',
      isUser: false,
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: 'Thank you, Luna. What brings you here today?',
      timestamp: '2024-01-15T10:26:00Z',
      isUser: true,
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Luna Nightshade',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      content: 'The ancient prophecy speaks of a time when the stars align...',
      timestamp: '2024-01-15T10:30:00Z',
      isUser: false,
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'Luna Nightshade',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      content: 'Look at what I discovered in the ancient ruins.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
      timestamp: '2024-01-15T10:31:00Z',
      isUser: false,
    },
  ],
  '2': [
    {
      id: '1',
      senderId: '2',
      senderName: 'Marcus Steel',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      content: 'Hey. Got a minute? Need to talk about the mission.',
      timestamp: '2024-01-14T18:40:00Z',
      isUser: false,
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: "Sure, what's going on?",
      timestamp: '2024-01-14T18:42:00Z',
      isUser: true,
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Marcus Steel',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      content: 'The underground network needs your help. Meet me at the old dock.',
      timestamp: '2024-01-14T18:45:00Z',
      isUser: false,
    },
  ],
  '3': [
    {
      id: '1',
      senderId: '3',
      senderName: 'Aria Moonstone',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'Hi! I hope you are having a wonderful day!',
      timestamp: '2024-01-14T12:15:00Z',
      isUser: false,
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: 'Hey Aria! Thanks, you too! What have you been up to?',
      timestamp: '2024-01-14T12:18:00Z',
      isUser: true,
    },
    {
      id: '3',
      senderId: '3',
      senderName: 'Aria Moonstone',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'I found something interesting in the ancient library today!',
      timestamp: '2024-01-14T12:20:00Z',
      isUser: false,
    },
  ],
  '4': [
    {
      id: '1',
      senderId: '4',
      senderName: 'Dr. Elena Voss',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Good afternoon. I have some new research findings to share.',
      timestamp: '2024-01-13T15:55:00Z',
      isUser: false,
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      content: 'That sounds exciting! What did you find?',
      timestamp: '2024-01-13T15:58:00Z',
      isUser: true,
    },
    {
      id: '3',
      senderId: '4',
      senderName: 'Dr. Elena Voss',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'The experiment results are fascinating. Let me show you.',
      timestamp: '2024-01-13T16:00:00Z',
      isUser: false,
    },
    {
      id: '4',
      senderId: '4',
      senderName: 'Dr. Elena Voss',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Here are the lab results from today.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
      timestamp: '2024-01-13T16:02:00Z',
      isUser: false,
    },
  ],
};