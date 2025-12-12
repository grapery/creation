import { Home, MessageCircle, PlusCircle, Users, User } from 'lucide-react';

type Page = 
  | 'dashboard' 
  | 'stories' 
  | 'characters' 
  | 'groups' 
  | 'assets' 
  | 'search' 
  | 'profile'
  | 'create-story'
  | 'story-editor'
  | 'story-viewer'
  | 'storyboard-editor'
  | 'character-editor'
  | 'character-viewer'
  | 'group-detail'
  | 'chat'
  | 'chat-conversation';

interface MobileNavigationProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
}

export function MobileNavigation({ currentPage, onNavigate }: MobileNavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'create-story', label: 'Create', icon: PlusCircle },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const isActive = (pageId: string) => {
    if (pageId === 'dashboard') {
      return currentPage === 'dashboard' || currentPage === 'stories';
    }
    if (pageId === 'chat') {
      return currentPage === 'chat' || currentPage === 'chat-conversation';
    }
    return currentPage === pageId;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'fill-current' : ''}`} />
              <span className={`${active ? 'font-medium' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}