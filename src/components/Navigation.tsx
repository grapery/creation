import { Home, BookOpen, Users, Image, User, Search, Plus, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { mockCurrentUser } from '../lib/mockData';
import { Badge } from './ui/badge';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'stories', label: 'My Stories', icon: BookOpen },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'assets', label: 'Assets', icon: Image },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          StoryForge
        </h1>
      </div>

      {/* Create Button */}
      <Button 
        onClick={() => onNavigate('create-story')} 
        className="mb-6 w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Story
      </Button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t pt-4 space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onNavigate('search')}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start relative"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
          <Badge variant="destructive" className="absolute right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onNavigate('profile')}
        >
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={mockCurrentUser.avatar} />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          Profile
        </Button>
      </div>
    </div>
  );
}
