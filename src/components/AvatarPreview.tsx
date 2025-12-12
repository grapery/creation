import { X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

interface AvatarPreviewProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  userName: string;
}

export function AvatarPreview({ open, onClose, imageUrl, userName }: AvatarPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-full p-0 bg-black/95 border-none flex flex-col items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="text-white mb-4">{userName}</div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={userName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 rounded-full bg-muted flex items-center justify-center">
              <span className="text-white">{userName[0]}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
