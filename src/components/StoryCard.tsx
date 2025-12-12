import { Heart, Eye, Users, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Story } from '../lib/mockData';

interface StoryCardProps {
  story: Story;
  onView?: () => void;
}

export function StoryCard({ story, onView }: StoryCardProps) {
  return (
    <Card className="overflow-hidden active:scale-98 transition-transform" onClick={onView}>
      <div className="flex gap-3 p-3">
        {/* Story Cover */}
        <div className="relative w-24 h-32 flex-shrink-0 rounded overflow-hidden">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-1 right-1 text-xs" variant={story.status === 'published' ? 'default' : 'secondary'}>
            {story.status}
          </Badge>
        </div>
        
        {/* Story Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="mb-1 line-clamp-2">{story.title}</h3>
          
          <p className="text-muted-foreground mb-2 line-clamp-2 flex-1">
            {story.description}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={story.author.avatar} />
              <AvatarFallback>{story.author.displayName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground truncate">
              {story.author.displayName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{story.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{story.followers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{story.panels}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}