import { Heart, Eye, BookOpen, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Character } from '../lib/mockData';
import { mockChatThreads } from '../lib/mockChatData';

interface CharacterCardProps {
  character: Character;
  onView?: () => void;
  onChat?: () => void;
}

export function CharacterCard({ character, onView, onChat }: CharacterCardProps) {
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChat) {
      onChat();
    }
  };

  return (
    <Card className="overflow-hidden active:scale-98 transition-transform" onClick={onView}>
      <div className="flex gap-3 p-3">
        {/* Character Image */}
        <div className="relative w-24 h-32 flex-shrink-0 rounded overflow-hidden">
          <img
            src={character.poster || character.avatar}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Character Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="mb-1">{character.name}</h3>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {character.traits.slice(0, 2).map((trait) => (
              <Badge key={trait} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
          
          <p className="text-muted-foreground mb-2 line-clamp-2 flex-1">
            {character.description}
          </p>

          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{character.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{character.followers}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{character.stories}</span>
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={handleChatClick} className="w-full">
            <MessageCircle className="mr-2 h-3.5 w-3.5" />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}