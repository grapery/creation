# Internationalization (i18n) Setup

This project supports English, Simplified Chinese (简体中文), and Japanese (日本語).

## Usage

### Using the useTranslation Hook

```tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('common.ok')}</h1>
      <p>{t('auth.email')}</p>
      <p>{t('chat_with', { name: 'John' })}</p>
    </div>
  );
}
```

### Using the Language Selector Component

```tsx
import { LanguageSelector } from '@/components/auth/language-selector';

export function Header() {
  return (
    <header>
      <LanguageSelector />
    </header>
  );
}
```

## Translation Keys

Translations are organized by category:

- `common` - Common UI elements (buttons, labels, etc.)
- `auth` - Authentication related strings
- `navigation` - Navigation items
- `settings` - Settings page
- `dashboard` - Dashboard page
- `stories` - Story-related strings
- `characters` - Character-related strings
- `chat` - Chat-related strings
- `groups` - Group-related strings
- `profile` - Profile page
- `notifications` - Notifications
- `errors` - Error messages

## Adding New Translations

1. Add the key to all three language files in `lib/i18n/translations/`:
   - `en.json` (English)
   - `zh-Hans.json` (Simplified Chinese)
   - `ja.json` (Japanese)

2. Use the key in your component:
```tsx
const { t } = useTranslation();
<p>{t('your.new.key')}</p>
```

## Interpolation

You can use parameters in your translations:

```json
{
  "chat_with": "Chat with {name}"
}
```

```tsx
<p>{t('chat_with', { name: 'Alice' })}</p>
// Output: Chat with Alice
```

## Supported Languages

- **English** (en)
- **Simplified Chinese** (zh-Hans) - 简体中文
- **Japanese** (ja) - 日本語

The language is automatically detected from the browser, but can be changed using the LanguageSelector component or by calling `setLanguage()`.
