import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { MobileHeader } from '../components/MobileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockCurrentUser } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface EditProfileProps {
  onNavigate: (page: string) => void;
}

export function EditProfile({ onNavigate }: EditProfileProps) {
  const [formData, setFormData] = useState({
    displayName: mockCurrentUser.displayName,
    username: mockCurrentUser.username,
    bio: mockCurrentUser.bio || '',
    location: mockCurrentUser.location || '',
    website: mockCurrentUser.website || '',
    aiPromptPreferences: mockCurrentUser.aiPromptPreferences || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(mockCurrentUser.avatar);
  const [backgroundPreview, setBackgroundPreview] = useState(mockCurrentUser.background);

  const handleSave = () => {
    // In a real app, this would send data to the server
    toast.success('Profile updated successfully!');
    onNavigate('profile');
  };


  return (
    <div className="min-h-screen">
      <MobileHeader
        title="Edit Profile"
        showBack
        onBack={() => onNavigate('profile')}
        actions={
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        }
      />

      <div className="pb-20">
        {/* Background Image */}
        <div className="relative h-32 overflow-hidden bg-muted">
          {backgroundPreview && (
            <img
              src={backgroundPreview}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/50 transition-colors">
            <div className="flex flex-col items-center gap-1">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-white">Change Background</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
          </label>
        </div>

        {/* Avatar */}
        <div className="px-4 -mt-12 mb-6">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>{formData.displayName[0]}</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-1">@</span>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              rows={4}
              maxLength={200}
            />
            <p className="text-muted-foreground">
              {formData.bio.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Your location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiPromptPreferences">AI Prompt Preferences</Label>
            <Textarea
              id="aiPromptPreferences"
              value={formData.aiPromptPreferences}
              onChange={(e) =>
                setFormData({ ...formData, aiPromptPreferences: e.target.value })
              }
              placeholder="Describe your preferences for AI-generated content (e.g., writing style, themes, tone)"
              rows={4}
            />
            <p className="text-muted-foreground">
              These preferences help tailor AI suggestions to your creative style
            </p>
          </div>

          <div className="pt-4 pb-6">
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
