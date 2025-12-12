import { ArrowLeft, MoreVertical, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function MobileHeader({ title, showBack, onBack, actions }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-40">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {title && (
            <h1 className="truncate">{title}</h1>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
