export interface Scene {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string;
  timeOfDay?: string;
}

export interface StoryboardCharacter {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Storyboard {
  id: string;
  storyId: string;
  parentId: string | null; // null for root storyboard
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  content: string; // AI-polished narrative
  rawInput: string; // Original user input/prompt
  scenes: Scene[];
  characters: StoryboardCharacter[];
  images: string[]; // Carousel images
  likes: number;
  comments: number;
  shares: number;
  forkCount: number;
  views: number;
  createdAt: string;
  tokenConsumption: number;
  childrenIds: string[]; // IDs of forked/continued storyboards
}

export interface StoryParticipant {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: 'owner' | 'collaborator' | 'contributor';
  joinedAt: string;
}

export interface StoryComposition {
  id: string;
  title: string;
  coverImage: string;
  backgroundDescription: string;
  theme: string;
  genre: string;
  rootStoryboardId: string;
  participants: StoryParticipant[];
  totalStoryboards: number;
  totalForks: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data
export const mockStoryCompositions: StoryComposition[] = [
  {
    id: '1',
    title: 'The Last Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
    backgroundDescription: 'In a world where magic and technology collide, an ancient prophecy awakens. The last kingdom stands at the edge of darkness, and only a chosen few can save it from eternal night.',
    theme: 'Epic Fantasy',
    genre: 'Fantasy Adventure',
    rootStoryboardId: 'sb-1',
    participants: [
      {
        id: 'p1',
        userId: 'user-1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        role: 'owner',
        joinedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'p2',
        userId: 'user-2',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        role: 'collaborator',
        joinedAt: '2024-01-05T00:00:00Z',
      },
      {
        id: 'p3',
        userId: 'user-3',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        role: 'contributor',
        joinedAt: '2024-01-10T00:00:00Z',
      },
    ],
    totalStoryboards: 12,
    totalForks: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];

export const mockStoryboards: Record<string, Storyboard> = {
  'sb-1': {
    id: 'sb-1',
    storyId: '1',
    parentId: null,
    creatorId: 'user-1',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'The Awakening',
    content: 'In the heart of the ancient kingdom, Luna Nightshade stood at the precipice of destiny. The stars above whispered secrets of a forgotten age, and the wind carried omens of change. As the last guardian of the old magic, she knew that the prophecy spoken centuries ago was finally coming to pass.',
    rawInput: 'Luna discovers the prophecy in the old tower',
    scenes: [
      {
        id: 'scene-1',
        title: 'The Ancient Tower',
        description: 'Luna stands in the tower room, bathed in moonlight streaming through the circular window. Ancient scrolls and mystical artifacts surround her.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
        location: 'Northern Tower',
        timeOfDay: 'Midnight',
      },
      {
        id: 'scene-2',
        title: 'The Prophecy Revealed',
        description: 'A glowing scroll unfurls before Luna, revealing ancient text that begins to glow with ethereal light. The prophecy speaks of a chosen one.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
        location: 'Northern Tower',
        timeOfDay: 'Midnight',
      },
      {
        id: 'scene-3',
        title: 'The Stars Align',
        description: 'Through the tower window, the stars form a pattern never seen before. Luna realizes the moment has arrived.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        location: 'Northern Tower',
        timeOfDay: 'Midnight',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    likes: 245,
    comments: 32,
    shares: 18,
    forkCount: 3,
    views: 1240,
    createdAt: '2024-01-01T00:00:00Z',
    tokenConsumption: 1250,
    childrenIds: ['sb-2', 'sb-3', 'sb-4'],
  },
  'sb-2': {
    id: 'sb-2',
    storyId: '1',
    parentId: 'sb-1',
    creatorId: 'user-1',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'The Journey Begins',
    content: 'With the prophecy burning in her mind, Luna descended from the tower into the bustling kingdom below. The morning market was alive with voices, but she moved through it like a ghost, her thoughts consumed by what she had learned. She needed to find the others mentioned in the prophecy—the warrior, the sage, and the thief.',
    rawInput: 'Luna goes to find the other chosen ones in the market',
    scenes: [
      {
        id: 'scene-4',
        title: 'The Market Square',
        description: 'Luna weaves through the crowded morning market, searching for signs of the others mentioned in the prophecy.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        location: 'Central Market',
        timeOfDay: 'Morning',
      },
      {
        id: 'scene-5',
        title: 'A Familiar Face',
        description: 'Among the crowd, Luna spots a mysterious figure watching her—could this be one of the chosen?',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
        location: 'Central Market',
        timeOfDay: 'Morning',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
      {
        id: '2',
        name: 'Marcus Steel',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        role: 'Warrior',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    ],
    likes: 189,
    comments: 24,
    shares: 12,
    forkCount: 2,
    views: 856,
    createdAt: '2024-01-03T00:00:00Z',
    tokenConsumption: 980,
    childrenIds: ['sb-5', 'sb-6'],
  },
  'sb-3': {
    id: 'sb-3',
    storyId: '1',
    parentId: 'sb-1',
    creatorId: 'user-2',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    title: 'The Dark Path',
    content: 'But what if Luna chose differently? What if the prophecy itself was a trap? In this version of events, Luna decided to investigate the dark rumors spreading through the kingdom—whispers of an ancient evil awakening in the forbidden forest. Perhaps the prophecy was not about saving the kingdom, but about something far more sinister.',
    rawInput: 'Fork: Luna investigates the dark forest instead',
    scenes: [
      {
        id: 'scene-6',
        title: 'The Forbidden Forest',
        description: 'Luna stands at the edge of the dark forest, where few dare to venture. The trees seem to whisper warnings.',
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
        location: 'Forbidden Forest',
        timeOfDay: 'Dusk',
      },
      {
        id: 'scene-7',
        title: 'Dark Discoveries',
        description: 'Deep in the forest, Luna finds ancient ruins that speak of a different prophecy—one of destruction.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
        location: 'Ancient Ruins',
        timeOfDay: 'Night',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
    ],
    likes: 156,
    comments: 19,
    shares: 8,
    forkCount: 1,
    views: 623,
    createdAt: '2024-01-05T00:00:00Z',
    tokenConsumption: 1100,
    childrenIds: ['sb-7'],
  },
  'sb-4': {
    id: 'sb-4',
    storyId: '1',
    parentId: 'sb-1',
    creatorId: 'user-3',
    creatorName: 'Emma Wilson',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    title: 'The Council Meeting',
    content: 'Luna knew she could not act alone. She called for an emergency meeting of the High Council, the ancient order that had governed the kingdom for generations. As she stood before the council members, she revealed the prophecy and demanded immediate action. But not everyone believed her words.',
    rawInput: 'Fork: Luna presents the prophecy to the Council',
    scenes: [
      {
        id: 'scene-8',
        title: 'The Council Chamber',
        description: 'Luna stands before the High Council in the grand chamber, the prophecy scroll in her hands.',
        image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&h=600&fit=crop',
        location: 'Council Hall',
        timeOfDay: 'Afternoon',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
      {
        id: '3',
        name: 'Aria Moonstone',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        role: 'Sage',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&h=600&fit=crop',
    ],
    likes: 134,
    comments: 15,
    shares: 6,
    forkCount: 0,
    views: 512,
    createdAt: '2024-01-07T00:00:00Z',
    tokenConsumption: 850,
    childrenIds: [],
  },
  'sb-5': {
    id: 'sb-5',
    storyId: '1',
    parentId: 'sb-2',
    creatorId: 'user-1',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'The Warrior Alliance',
    content: 'Marcus Steel, the legendary warrior, stepped out from the shadows. "I have been waiting for you," he said to Luna. "The prophecy spoke of this day, and I am ready to fight by your side." Together, they began to plan their next move.',
    rawInput: 'Luna meets Marcus and they form an alliance',
    scenes: [
      {
        id: 'scene-9',
        title: 'The Alliance',
        description: 'Luna and Marcus shake hands in a quiet corner of the market, forming their partnership.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
        location: 'Market Tavern',
        timeOfDay: 'Afternoon',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
      {
        id: '2',
        name: 'Marcus Steel',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        role: 'Warrior',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
    ],
    likes: 167,
    comments: 21,
    shares: 9,
    forkCount: 0,
    views: 678,
    createdAt: '2024-01-06T00:00:00Z',
    tokenConsumption: 720,
    childrenIds: [],
  },
  'sb-6': {
    id: 'sb-6',
    storyId: '1',
    parentId: 'sb-2',
    creatorId: 'user-2',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    title: 'The Thief Encounter',
    content: 'Fork: What if Luna encountered the thief first? A nimble figure pickpocketed Luna in the crowd, but instead of running away, turned back with a knowing smile. "You are looking for me," the thief said. "The prophecy mentioned a guardian and a shadow. I am that shadow."',
    rawInput: 'Fork: Luna meets the thief character instead',
    scenes: [
      {
        id: 'scene-10',
        title: 'The Pickpocket',
        description: 'A mysterious thief confronts Luna after attempting to steal from her.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
        location: 'Market Alley',
        timeOfDay: 'Afternoon',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    ],
    likes: 142,
    comments: 18,
    shares: 7,
    forkCount: 0,
    views: 534,
    createdAt: '2024-01-08T00:00:00Z',
    tokenConsumption: 690,
    childrenIds: [],
  },
  'sb-7': {
    id: 'sb-7',
    storyId: '1',
    parentId: 'sb-3',
    creatorId: 'user-2',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    title: 'The Ancient Evil',
    content: 'In the depths of the ruins, Luna discovered the truth. The prophecy was indeed a trap, laid by an ancient evil that had been sealed away for millennia. By reading it, she had begun the ritual to release it. Now, she had to find a way to stop what she had unwittingly set in motion.',
    rawInput: 'Luna discovers the prophecy was a trap',
    scenes: [
      {
        id: 'scene-11',
        title: 'The Revelation',
        description: 'Luna realizes the horrible truth as dark energy begins to swirl around the ancient ruins.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
        location: 'Ancient Ruins',
        timeOfDay: 'Night',
      },
    ],
    characters: [
      {
        id: '1',
        name: 'Luna Nightshade',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        role: 'Protagonist',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
    ],
    likes: 178,
    comments: 23,
    shares: 11,
    forkCount: 0,
    views: 723,
    createdAt: '2024-01-10T00:00:00Z',
    tokenConsumption: 920,
    childrenIds: [],
  },
};
