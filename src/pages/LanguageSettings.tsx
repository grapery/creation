import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';

interface LanguageSettingsProps {
  onNavigate: (page: string) => void;
}

export function LanguageSettings({ onNavigate }: LanguageSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  ];

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Language" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3>Select Language</h3>
                <p className="text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>

            <div className="space-y-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className="w-full p-3 flex items-center justify-between rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="text-left">
                    <div>{language.nativeName}</div>
                    <p className="text-muted-foreground">{language.name}</p>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-muted-foreground">
            <p>
              Language changes will take effect immediately. Some content may remain in the original
              language if translations are not yet available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
