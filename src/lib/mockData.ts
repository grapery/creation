export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  background?: string;
  bio?: string;
  location?: string;
  website?: string;
  aiPromptPreferences?: string;
  followers: number;
  following: number;
  createdAt: string;
  joinedDate?: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: User;
  likes: number;
  followers: number;
  panels: number;
  genre: string;
  status: 'draft' | 'published' | 'rendering';
  createdAt: string;
  updatedAt: string;
}

export interface StoryboardPanel {
  id: string;
  storyId: string;
  sequence: number;
  title: string;
  content: string;
  image?: string;
  characters: Character[];
  likes: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  poster?: string;
  author: User;
  likes: number;
  followers: number;
  stories: number;
  traits: string[];
  skills?: string[];
  isPublic: boolean;
  groupId?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  members: number;
  stories: number;
  creator: User;
  isPublic: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  author: User;
  likes: number;
  category: string;
  createdAt: string;
}

// Mock Users
export const mockCurrentUser: User = {
  id: '1',
  username: 'storyteller_pro',
  displayName: 'Alex Morgan',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  background: 'https://images.unsplash.com/photo-1681230745734-4e59736c3660?w=1200&h=300&fit=crop',
  bio: 'Passionate storyteller and world builder. Creating epic adventures one panel at a time.',
  location: 'San Francisco, CA',
  website: 'https://alexmorgan.com',
  aiPromptPreferences: 'Detailed world-building, character development, and plot twists.',
  followers: 1247,
  following: 432,
  createdAt: '2024-01-15',
  joinedDate: '2024-01-15',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: '2',
    username: 'fantasy_writer',
    displayName: 'Emma Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    followers: 892,
    following: 234,
    createdAt: '2024-02-10',
    joinedDate: '2024-02-10',
  },
  {
    id: '3',
    username: 'scifi_creator',
    displayName: 'Jordan Lee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    followers: 2341,
    following: 567,
    createdAt: '2024-01-05',
    joinedDate: '2024-01-05',
  },
];

// Mock Stories
export const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Crystal Chronicles',
    description: 'A young mage discovers an ancient crystal that holds the key to saving their world from an eternal darkness.',
    coverImage: 'https://images.unsplash.com/photo-1760448847959-bd3aec9e672c?w=800&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 432,
    followers: 289,
    panels: 24,
    genre: 'Fantasy',
    status: 'published',
    createdAt: '2024-10-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    description: 'In a cyberpunk metropolis, a hacker uncovers a conspiracy that threatens the very fabric of reality.',
    coverImage: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=400&fit=crop',
    author: mockUsers[2],
    likes: 687,
    followers: 412,
    panels: 18,
    genre: 'Sci-Fi',
    status: 'published',
    createdAt: '2024-09-20',
    updatedAt: '2024-11-12',
  },
  {
    id: '3',
    title: 'The Last Garden',
    description: 'A botanist races against time to preserve the last living plants on a dying Earth.',
    coverImage: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=400&fit=crop',
    author: mockUsers[1],
    likes: 523,
    followers: 334,
    panels: 15,
    genre: 'Drama',
    status: 'published',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-14',
  },
  {
    id: '4',
    title: 'Starlight Voyagers',
    description: 'A crew of unlikely heroes embarks on an interstellar journey to find a new home for humanity.',
    coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 156,
    followers: 98,
    panels: 8,
    genre: 'Sci-Fi',
    status: 'draft',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-15',
  },
];

// Mock Characters
export const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Lyra Moonwhisper',
    description: 'A powerful mage with the ability to manipulate crystal energy. Wise beyond her years but haunted by her past.',
    avatar: 'https://images.unsplash.com/photo-1751006846163-3dd121df0147?w=300&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1751006846163-3dd121df0147?w=800&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 845,
    followers: 623,
    stories: 3,
    traits: ['Magical', 'Wise', 'Mysterious', 'Determined'],
    skills: ['Crystal Manipulation', 'Arcane Knowledge', 'Ancient Runes', 'Energy Channeling'],
    isPublic: true,
    groupId: '3',
    createdAt: '2024-10-10',
  },
  {
    id: '2',
    name: 'Kai Nightrunner',
    description: 'A skilled hacker and cyber-enhanced operative navigating the neon-lit streets of Neo-Tokyo.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    author: mockUsers[2],
    likes: 1234,
    followers: 892,
    stories: 5,
    traits: ['Tech-Savvy', 'Rebellious', 'Agile', 'Secretive'],
    skills: ['Hacking', 'Cybersecurity', 'Stealth Operations', 'Neural Interface'],
    isPublic: true,
    groupId: '2',
    createdAt: '2024-09-15',
  },
  {
    id: '3',
    name: 'Dr. Aria Bloom',
    description: 'A dedicated botanist fighting to preserve Earth\'s last remaining flora. Hopeful despite overwhelming odds.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=400&fit=crop',
    author: mockUsers[1],
    likes: 567,
    followers: 423,
    stories: 2,
    traits: ['Intelligent', 'Compassionate', 'Resilient', 'Scientific'],
    skills: ['Botany', 'Research', 'Gene Splicing', 'Environmental Science'],
    isPublic: false,
    groupId: '1',
    createdAt: '2024-10-28',
  },
  {
    id: '4',
    name: 'Captain Zara Nova',
    description: 'A fearless starship captain leading humanity\'s search for a new home among the stars.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 423,
    followers: 312,
    stories: 1,
    traits: ['Brave', 'Strategic', 'Charismatic', 'Determined'],
    skills: ['Starship Command', 'Tactical Planning', 'Diplomacy', 'Navigation'],
    isPublic: true,
    createdAt: '2024-11-05',
  },
];

// Mock Storyboard Panels
export const mockPanels: StoryboardPanel[] = [
  {
    id: '1',
    storyId: '1',
    sequence: 1,
    title: 'The Discovery',
    content: 'Lyra stumbles upon the ancient crystal hidden deep within the Whispering Caves. Its ethereal glow illuminates the darkness, revealing forgotten runes carved into the stone walls.',
    image: 'https://images.unsplash.com/photo-1518281420975-50db6e5d0a97?w=800&h=500&fit=crop',
    characters: [mockCharacters[0]],
    likes: 234,
    isPublished: true,
    createdAt: '2024-10-15',
  },
  {
    id: '2',
    storyId: '1',
    sequence: 2,
    title: 'The Vision',
    content: 'As Lyra touches the crystal, visions of the past flood her mind. She sees her ancestors wielding similar crystals to protect the realm from the Shadow King.',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&h=500&fit=crop',
    characters: [mockCharacters[0]],
    likes: 189,
    isPublished: true,
    createdAt: '2024-10-16',
  },
  {
    id: '3',
    storyId: '1',
    sequence: 3,
    title: 'The Mentor',
    content: 'Seeking answers, Lyra visits the old sage in the Moonlit Tower. He reveals the truth about her lineage and the burden she must bear.',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&h=500&fit=crop',
    characters: [mockCharacters[0]],
    likes: 156,
    isPublished: true,
    createdAt: '2024-10-17',
  },
];

// Mock Groups
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Fantasy Writers Guild',
    description: 'A community of fantasy storytellers sharing ideas, collaborating on epic tales, and supporting each other\'s creative journeys.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    members: 1247,
    stories: 856,
    creator: mockUsers[1],
    isPublic: true,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Sci-Fi Collective',
    description: 'Exploring the future through storytelling. A space for sci-fi enthusiasts to create and collaborate.',
    avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop',
    members: 892,
    stories: 634,
    creator: mockUsers[2],
    isPublic: true,
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    name: 'Character Development Workshop',
    description: 'Master the art of creating compelling characters. Share your characters, get feedback, and learn from fellow creators.',
    avatar: 'https://images.unsplash.com/photo-1691849098270-c32749424a76?w=150&h=150&fit=crop',
    members: 2341,
    stories: 423,
    creator: mockCurrentUser,
    isPublic: true,
    createdAt: '2024-03-12',
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    author: mockUsers[1],
    content: 'This is absolutely stunning! The world-building is incredible. I love how you\'ve developed the magic system around the crystals.',
    likes: 45,
    dislikes: 2,
    replies: [
      {
        id: '1-1',
        author: mockCurrentUser,
        content: 'Thank you so much! I spent weeks developing the magic system. Really appreciate your feedback!',
        likes: 23,
        dislikes: 0,
        replies: [],
        createdAt: '2024-11-12T10:30:00Z',
      },
    ],
    createdAt: '2024-11-12T09:15:00Z',
  },
  {
    id: '2',
    author: mockUsers[2],
    content: 'Can\'t wait to see where this story goes! Following this closely. The character development is top-notch.',
    likes: 67,
    dislikes: 1,
    replies: [],
    createdAt: '2024-11-13T14:22:00Z',
  },
];

// Mock Items/Assets
export const mockItems: Item[] = [
  {
    id: '1',
    title: 'Ancient Crystal Prop',
    description: 'A 3D model of the mystical crystal from The Crystal Chronicles',
    image: 'https://images.unsplash.com/photo-1518281420975-50db6e5d0a97?w=400&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 234,
    category: 'Props',
    createdAt: '2024-10-20',
  },
  {
    id: '2',
    title: 'Cyberpunk City Background',
    description: 'Neon-lit cityscape perfect for sci-fi stories',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop',
    author: mockUsers[2],
    likes: 445,
    category: 'Backgrounds',
    createdAt: '2024-09-25',
  },
  {
    id: '3',
    title: 'Medieval Castle Exterior',
    description: 'High-resolution fantasy castle background',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=400&fit=crop',
    author: mockUsers[1],
    likes: 678,
    category: 'Backgrounds',
    createdAt: '2024-10-05',
  },
];

// Mock User Activity (for user-specific activity feed)
export interface UserActivity {
  id: string;
  type: 'story_created' | 'story_updated' | 'story_published' | 'story_liked' | 'character_created' | 'character_updated' | 'user_followed' | 'storyboard_created' | 'panel_added';
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId?: string;
  targetTitle?: string;
  targetType?: 'story' | 'character' | 'user' | 'storyboard';
  message: string;
  timestamp: string;
}

export const mockUserActivities: UserActivity[] = [
  {
    id: 'a1',
    type: 'story_published',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '1',
    targetTitle: 'The Crystal Chronicles',
    targetType: 'story',
    message: 'published',
    timestamp: '2024-11-10T14:30:00Z',
  },
  {
    id: 'a2',
    type: 'panel_added',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '1',
    targetTitle: 'The Crystal Chronicles',
    targetType: 'story',
    message: 'added 3 new panels to',
    timestamp: '2024-11-09T10:15:00Z',
  },
  {
    id: 'a3',
    type: 'character_created',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '1',
    targetTitle: 'Lyra Moonwhisper',
    targetType: 'character',
    message: 'created character',
    timestamp: '2024-10-10T09:00:00Z',
  },
  {
    id: 'a4',
    type: 'story_created',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '4',
    targetTitle: 'Starlight Voyagers',
    targetType: 'story',
    message: 'started working on',
    timestamp: '2024-11-10T08:20:00Z',
  },
  {
    id: 'a5',
    type: 'user_followed',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '3',
    targetTitle: 'Jordan Lee',
    targetType: 'user',
    message: 'followed',
    timestamp: '2024-11-08T16:45:00Z',
  },
  {
    id: 'a6',
    type: 'story_liked',
    userId: '1',
    userName: 'Alex Morgan',
    userAvatar: mockCurrentUser.avatar,
    targetId: '2',
    targetTitle: 'Neon Dreams',
    targetType: 'story',
    message: 'liked',
    timestamp: '2024-11-07T12:30:00Z',
  },
];

// Mock Followers/Following Lists
export const mockFollowersList: User[] = [
  mockUsers[1],
  mockUsers[2],
  {
    id: '4',
    username: 'adventure_seeker',
    displayName: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    followers: 567,
    following: 234,
    createdAt: '2024-03-20',
    joinedDate: '2024-03-20',
  },
  {
    id: '5',
    username: 'mystery_master',
    displayName: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    followers: 1023,
    following: 445,
    createdAt: '2024-02-15',
    joinedDate: '2024-02-15',
  },
  {
    id: '6',
    username: 'romance_writer',
    displayName: 'Lisa Park',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    followers: 789,
    following: 312,
    createdAt: '2024-04-10',
    joinedDate: '2024-04-10',
  },
  {
    id: '9',
    username: 'horror_tales',
    displayName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop',
    followers: 1456,
    following: 523,
    createdAt: '2024-01-22',
    joinedDate: '2024-01-22',
  },
  {
    id: '10',
    username: 'historical_novelist',
    displayName: 'Victoria Smith',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
    followers: 892,
    following: 401,
    createdAt: '2024-03-05',
    joinedDate: '2024-03-05',
  },
];

export const mockFollowingList: User[] = [
  mockUsers[1],
  mockUsers[2],
  {
    id: '7',
    username: 'world_builder',
    displayName: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    followers: 2134,
    following: 678,
    createdAt: '2024-01-08',
    joinedDate: '2024-01-08',
  },
  {
    id: '8',
    username: 'character_artist',
    displayName: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    followers: 1567,
    following: 523,
    createdAt: '2024-02-22',
    joinedDate: '2024-02-22',
  },
  {
    id: '11',
    username: 'plot_master',
    displayName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    followers: 2567,
    following: 823,
    createdAt: '2024-01-12',
    joinedDate: '2024-01-12',
  },
];

// Character Posters
export interface CharacterPoster {
  id: string;
  characterId: string;
  title: string;
  image: string;
  author: User;
  likes: number;
  shares: number;
  createdAt: string;
}

export const mockCharacterPosters: CharacterPoster[] = [
  {
    id: 'poster-1',
    characterId: '1',
    title: 'Lyra in the Moonlight',
    image: 'https://images.unsplash.com/photo-1751006846163-3dd121df0147?w=800&h=400&fit=crop',
    author: mockCurrentUser,
    likes: 234,
    shares: 45,
    createdAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'poster-2',
    characterId: '1',
    title: 'Crystal Power Unleashed',
    image: 'https://images.unsplash.com/photo-1518281420975-50db6e5d0a97?w=800&h=400&fit=crop',
    author: mockUsers[1],
    likes: 189,
    shares: 32,
    createdAt: '2024-10-18T14:30:00Z',
  },
  {
    id: 'poster-3',
    characterId: '2',
    title: 'Neon Runner',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    author: mockUsers[2],
    likes: 567,
    shares: 89,
    createdAt: '2024-09-20T16:45:00Z',
  },
  {
    id: 'poster-4',
    characterId: '3',
    title: 'Guardian of Nature',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=400&fit=crop',
    author: mockUsers[1],
    likes: 345,
    shares: 56,
    createdAt: '2024-11-01T09:15:00Z',
  },
];

// Character Analytics
export interface CharacterAnalytics {
  characterId: string;
  usersWhoChattedCount: number;
  totalMessagesSent: number;
  totalTokensConsumed: number;
}

export const mockCharacterAnalytics: CharacterAnalytics[] = [
  {
    characterId: '1',
    usersWhoChattedCount: 234,
    totalMessagesSent: 1456,
    totalTokensConsumed: 45678,
  },
  {
    characterId: '2',
    usersWhoChattedCount: 567,
    totalMessagesSent: 3421,
    totalTokensConsumed: 89234,
  },
  {
    characterId: '3',
    usersWhoChattedCount: 189,
    totalMessagesSent: 892,
    totalTokensConsumed: 23456,
  },
  {
    characterId: '4',
    usersWhoChattedCount: 156,
    totalMessagesSent: 743,
    totalTokensConsumed: 19823,
  },
];