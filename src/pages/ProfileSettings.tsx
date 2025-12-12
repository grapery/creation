import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

interface ProfileSettingsProps {
  onNavigate: (page: string) => void;
}

export function ProfileSettings({ onNavigate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    username: 'alexmorgan',
    email: 'alex@example.com',
    bio: 'Passionate storyteller and creative writer. Love crafting epic adventures!',
    website: 'https://alexmorgan.com',
    location: 'San Francisco, CA',
    aiPromptPreference: 'detailed',
  });

  const handleSave = () => {
    // Mock save
    console.log('Saving profile...', formData);
    onNavigate('settings');
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader
        title="Profile Settings"
        showBack
        onBack={() => onNavigate('settings')}
        actions={
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center">
                <h3>Profile Photo</h3>
                <p className="text-muted-foreground">Click to change your avatar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <div>
          <h3 className="mb-3 px-1">Basic Information</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-muted-foreground">
                  {formData.bio.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Preferences */}
        <div>
          <h3 className="mb-3 px-1">AI Preferences</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiPrompt">AI Prompt Style</Label>
                <select
                  id="aiPrompt"
                  value={formData.aiPromptPreference}
                  onChange={(e) =>
                    setFormData({ ...formData, aiPromptPreference: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="detailed">Detailed (More context)</option>
                  <option value="balanced">Balanced</option>
                  <option value="concise">Concise (Quick generation)</option>
                </select>
                <p className="text-muted-foreground">
                  Choose how much detail AI should use when generating content
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
