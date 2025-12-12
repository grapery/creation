import { useState } from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

interface PrivacySettingsProps {
  onNavigate: (page: string) => void;
}

export function PrivacySettings({ onNavigate }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showFollowers: true,
    showFollowing: true,
    allowMessages: true,
    allowComments: true,
    showActivity: true,
    showReadingHistory: false,
    parentalControls: false,
    hideExplicitContent: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Privacy & Safety" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-6">
        {/* Profile Privacy */}
        <div>
          <h3 className="mb-3 px-1">Profile Privacy</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="public">Public Profile</Label>
                  <p className="text-muted-foreground">
                    Allow anyone to view your profile
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={settings.profilePublic}
                  onCheckedChange={() => toggleSetting('profilePublic')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="followers">Show Followers</Label>
                  <p className="text-muted-foreground">
                    Display your follower count and list
                  </p>
                </div>
                <Switch
                  id="followers"
                  checked={settings.showFollowers}
                  onCheckedChange={() => toggleSetting('showFollowers')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="following">Show Following</Label>
                  <p className="text-muted-foreground">
                    Display who you're following
                  </p>
                </div>
                <Switch
                  id="following"
                  checked={settings.showFollowing}
                  onCheckedChange={() => toggleSetting('showFollowing')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content & Interactions */}
        <div>
          <h3 className="mb-3 px-1">Content & Interactions</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="messages">Allow Direct Messages</Label>
                  <p className="text-muted-foreground">
                    Let other users send you messages
                  </p>
                </div>
                <Switch
                  id="messages"
                  checked={settings.allowMessages}
                  onCheckedChange={() => toggleSetting('allowMessages')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="comments">Allow Comments</Label>
                  <p className="text-muted-foreground">
                    Enable comments on your stories
                  </p>
                </div>
                <Switch
                  id="comments"
                  checked={settings.allowComments}
                  onCheckedChange={() => toggleSetting('allowComments')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="activity">Show Activity Status</Label>
                  <p className="text-muted-foreground">
                    Let others see when you're online
                  </p>
                </div>
                <Switch
                  id="activity"
                  checked={settings.showActivity}
                  onCheckedChange={() => toggleSetting('showActivity')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="history">Show Reading History</Label>
                  <p className="text-muted-foreground">
                    Display stories you've read
                  </p>
                </div>
                <Switch
                  id="history"
                  checked={settings.showReadingHistory}
                  onCheckedChange={() => toggleSetting('showReadingHistory')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safety & Content Filtering */}
        <div>
          <h3 className="mb-3 px-1">Safety & Content Filtering</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="parental">Parental Controls</Label>
                  <p className="text-muted-foreground">
                    Enable teen-safe mode
                  </p>
                </div>
                <Switch
                  id="parental"
                  checked={settings.parentalControls}
                  onCheckedChange={() => toggleSetting('parentalControls')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="explicit">Hide Explicit Content</Label>
                  <p className="text-muted-foreground">
                    Filter mature and explicit stories
                  </p>
                </div>
                <Switch
                  id="explicit"
                  checked={settings.hideExplicitContent}
                  onCheckedChange={() => toggleSetting('hideExplicitContent')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data & Privacy Info */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Data is Protected
            </CardTitle>
            <CardDescription>
              We never sell your personal information. Learn more in our{' '}
              <button
                onClick={() => onNavigate('privacy')}
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
