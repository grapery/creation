import { useState } from 'react';
import {
  User,
  Camera,
  Globe,
  Palette,
  Shield,
  Bell,
  CreditCard,
  Info,
  FileText,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const currentUser = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: 'Update your profile information',
          action: () => onNavigate('profile-settings'),
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification preferences',
          action: () => onNavigate('notification-settings'),
        },
        {
          icon: CreditCard,
          label: 'Membership & Billing',
          description: 'Manage your subscription',
          action: () => onNavigate('membership'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          action: () => onNavigate('language-settings'),
        },
        {
          icon: Palette,
          label: 'Appearance',
          description: 'Theme and display options',
          action: () => onNavigate('appearance-settings'),
        },
        {
          icon: Shield,
          label: 'Privacy & Safety',
          description: 'Control who can see your content',
          action: () => onNavigate('privacy-settings'),
        },
      ],
    },
    {
      title: 'Legal & About',
      items: [
        {
          icon: FileText,
          label: 'Terms of Service',
          action: () => onNavigate('terms'),
        },
        {
          icon: Lock,
          label: 'Privacy Policy',
          action: () => onNavigate('privacy'),
        },
        {
          icon: Info,
          label: 'About StoryForge',
          action: () => onNavigate('about'),
        },
        {
          icon: FileText,
          label: 'Regulatory Information',
          action: () => onNavigate('regulatory'),
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          icon: LogOut,
          label: 'Sign Out',
          className: 'text-primary',
          action: () => onNavigate('sign-out'),
        },
        {
          icon: Trash2,
          label: 'Delete Account',
          className: 'text-destructive',
          action: () => onNavigate('delete-account'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Settings" showBack onBack={() => onNavigate('dashboard')} />

      <div className="p-4 space-y-6">
        {/* Profile Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1">{currentUser.name}</h3>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <div key={section.title}>
            <h3 className="mb-3 px-1">{section.title}</h3>
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <button
                        onClick={item.action}
                        className="w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                      >
                        <Icon className={`h-5 w-5 ${item.className || 'text-muted-foreground'}`} />
                        <div className="flex-1 text-left">
                          <div className={item.className}>{item.label}</div>
                          {item.description && (
                            <p className="text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                      {itemIndex < section.items.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center text-muted-foreground pb-4">
          <p>StoryForge v1.0.0</p>
          <p>© 2025 StoryForge. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
