import { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';

interface AppearanceSettingsProps {
  onNavigate: (page: string) => void;
}

export function AppearanceSettings({ onNavigate }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  const fontSizes = [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
  ] as const;

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Appearance" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-6">
        {/* Theme */}
        <div>
          <h3 className="mb-3 px-1">Theme</h3>
          <Card>
            <CardContent className="p-3 space-y-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">{themeOption.label}</div>
                    {theme === themeOption.id && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Font Size */}
        <div>
          <h3 className="mb-3 px-1">Text Size</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setFontSize(size.id)}
                  className="w-full flex items-center justify-between"
                >
                  <span
                    className={
                      size.id === 'small'
                        ? 'text-sm'
                        : size.id === 'large'
                        ? 'text-lg'
                        : ''
                    }
                  >
                    {size.label}
                  </span>
                  {fontSize === size.id && <Check className="h-5 w-5 text-primary" />}
                </button>
              ))}
            </CardContent>
          </Card>
          <p className="text-muted-foreground mt-2 px-1">
            This is a preview of how text will appear in the app
          </p>
        </div>
      </div>
    </div>
  );
}
