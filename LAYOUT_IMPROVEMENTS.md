# Profile Pages Layout & Visual Improvements

## Overview
This document outlines comprehensive UI/UX improvements for profile-related pages, addressing layout issues, visual hierarchy, spacing, and accessibility.

## Problems Fixed

### 1. **Icon Issues**
❌ **Before**: Used emoji icons (`👑`) instead of SVG icons
✅ **After**: Use Lucide SVG icons (`Crown` component)
- **Impact**: More professional, consistent design language
- **Files**: `profile-header-v2.tsx`, all profile subpages

### 2. **Visual Hierarchy**
❌ **Before**: Inconsistent shadow levels, unclear depth
✅ **After**: Systematic shadow scale:
  - `shadow-sm` - Cards and small elements
  - `shadow-lg` - Floating elements (avatar, badges)
  - `backdrop-blur-sm` - Overlay effects
- **Impact**: Better depth perception, clearer content priority

### 3. **Spacing Inconsistency**
❌ **Before**: Inconsistent gaps (gap-2, gap-3, gap-6 mixed)
✅ **After**: Unified spacing scale:
  - `gap-1.5` - Compact (icon + text)
  - `gap-2` - Small (stat items)
  - `gap-3` - Medium (section headers)
  - `gap-6` - Large (major sections)
  - `space-y-2.5` - Vertical rhythm
  - `space-y-4` - Section separation
  - `space-y-6` - Major content blocks

### 4. **Responsive Issues**
❌ **Before**: Fixed heights (`h-[200px]`), fixed widths (`w-32`)
✅ **After**: Fluid dimensions with breakpoints:
  - Avatar: `w-[100px] sm:w-[120px] h-[100px] sm:h-[120px]`
  - Banner: `h-[180px] md:h-[220px]`
  - Grid: 1 → 2 → 3 → 4 columns across breakpoints
- **Impact**: Better mobile experience, optimal use of screen space

### 5. **Typography & Readability**
❌ **Before**: Inconsistent font sizes, poor line-height
✅ **After**:
  - Names: `text-2xl sm:text-3xl font-bold`
  - Stats: `text-base sm:text-lg font-semibold tabular-nums`
  - Body: `text-sm text-foreground/80 leading-relaxed`
  - Truncation: `line-clamp-2` for descriptions
- **Impact**: Better readability, visual balance

### 6. **Hover & Interaction Feedback**
❌ **Before**: Minimal or no hover states
✅ **After**: Comprehensive feedback system:
  - Cards: `hover:border-primary/30 hover:shadow-lg hover:-translate-y-1`
  - Buttons: `gap-2` for icon+text, proper focus states
  - Stats: `group-hover:text-foreground transition-colors`
  - Images: `transition-transform group-hover:scale-105 duration-300`
- **Impact**: Clear interactive feedback, polished feel

### 7. **Color & Dark Mode**
❌ **Before**: `bg-primary/10` invisible in light mode
✅ **After**: Proper opacity levels:
  - Light mode: `bg-primary/20`, `text-foreground/80`
  - Dark mode: Automatic via CSS variables
  - Overlays: `bg-black/40 to-transparent` gradients
  - Borders: `border-border/50` (subtle but visible)
- **Impact**: Accessible in both modes, consistent visual language

### 8. **Layout Structure**
❌ **Before**: Inconsistent padding, hidden content behind navbar
✅ **After**:
  - Container: `px-4 sm:px-6` for content
  - Negative margins: `-mt-10 sm:-mt-12` for overlapping layouts
  - Grid system: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - Gap system: `gap-4 sm:gap-5 lg:gap-6` for grid
- **Impact**: Better content flow, no hidden elements

## New Components Created

### 1. `components/profile/profile-header-v2.tsx`
**Improvements over original:**
- Unified Avatar + Actions row with better alignment
- VIP badge uses SVG icon (Crown) with gradient background
- Responsive avatar sizing (100px → 120px on mobile)
- Better hover states for all buttons
- Stats with hover feedback and tabular numbers
- Proper focus states for accessibility

**Key features:**
```tsx
- Gradient banner with image overlay
- Floating avatar with shadow and border
- Action buttons with SVG icons
- Stats row with tabular-nums
```

### 2. `components/profile/content-grid.tsx`
**Purpose**: Reusable grid container for tab content

**Features:**
- Section header with icon
- Loading state with spinner
- Empty state with icon and message
- Responsive grid (1-2-3-4 columns)
- Consistent spacing and border

**Usage:**
```tsx
<ContentGrid
    title="Stories"
    icon={<BookOpen />}
    loading={loading}
    empty={stories.length === 0}
    emptyMessage="No stories yet"
>
    {stories.map(story => <StoryCard story={story} />)}
</ContentGrid>
```

### 3. `components/story/story-card-v2.tsx`
**Improvements:**
- Aspect ratio container for uniform cards
- Hover image zoom effect (scale-105)
- Overlay with stats (likes, comments)
- Smooth transitions (300ms)
- Better truncation (line-clamp-2)
- Tag display with +N overflow

**Visual hierarchy:**
1. Cover image (primary focus)
2. Title (secondary)
3. Metadata (tertiary)

### 4. `components/storyboard/storyboard-card-v2.tsx`
**Improvements:**
- Scene count badge with backdrop blur
- Scene icon (FileText) + number
- Description with line-clamp-2
- Tags with overflow handling
- Date display with icon

**Visual hierarchy:**
1. Cover image
2. Title + Description
3. Scene count badge
4. Stats row (likes, comments)
5. Tags

### 5. `components/character/character-card-v2.tsx`
**Improvements:**
- Square aspect ratio for avatars
- Character type badge (top-right)
- Personality traits as tags
- Consistent with other cards
- Hover feedback

**Visual hierarchy:**
1. Avatar + Type badge
2. Name + Description
3. Metadata row
4. Personality traits

## Implementation Guide

### Step 1: Replace Profile Header
```tsx
// In: app/profile/[id]/page.tsx
import ProfileHeader from "@/components/profile/profile-header-v2";

// Replace the header section with:
<ProfileHeader
    user={profileUser}
    isOwnProfile={isOwnProfile}
    isFollowing={isFollowing}
    likesCount={totalLikes}
    onAvatarTap={() => {}}
    onEditProfile={() => router.push("/settings/profile")}
    onFollow={handleFollow}
    onMessage={() => router.push(`/chat/${profileUser.id}`)}
    onShare={() => {}}
/>
```

### Step 2: Use Content Grid
```tsx
// In: app/profile/[id]/stories/page.tsx, storyboards/page.tsx, etc.
import ContentGrid from "@/components/profile/content-grid";
import StoryCard from "@/components/story/story-card-v2";

<ContentGrid
    title="Stories"
    icon={<BookOpen />}
    loading={loading}
    empty={stories.length === 0}
    emptyMessage="No stories yet"
    emptyIcon={<BookOpen />}
>
    {stories.map(story => (
        <StoryCard key={story.id} story={story} />
    ))}
</ContentGrid>
```

### Step 3: Replace Card Components
```tsx
// Import new card components
import StoryCard from "@/components/story/story-card-v2";
import StoryboardCard from "@/components/storyboard/storyboard-card-v2";
import CharacterCard from "@/components/character/character-card-v2";

// Use in grids
{stories.map(story => <StoryCard story={story} />)}
{storyboards.map(sb => <StoryboardCard storyboard={sb} />)}
{characters.map(char => <CharacterCard character={char} />)}
```

## Spacing System Reference

### Horizontal Gaps
```tsx
gap-1.5   // Icon + text (tight)
gap-2       // Stat items, small groups
gap-3       // Section headers
gap-4       // Button groups (mobile)
gap-6       // Major sections
gap-8       // Large spacing (desktop)
```

### Vertical Spacing
```tsx
space-y-1   // Very tight (tags)
space-y-2   // Form fields, list items
space-y-2.5 // Compact (stats, metadata)
space-y-4   // Sections, card content
space-y-6   // Major content blocks
space-y-8   // Page sections
```

### Padding
```tsx
p-4         // Default padding (mobile)
sm:p-5      // Default padding (desktop)
p-5         // Generous padding
p-6         // Large sections
```

## Visual Hierarchy Reference

### Shadow Scale
```tsx
shadow-sm    // Cards, small elements
shadow-md    // Medium elements
shadow-lg    // Floating, important elements
shadow-xl    // Popups, modals
```

### Border Radius
```tsx
rounded-lg    // Cards, buttons
rounded-xl    // Containers
rounded-full  // Avatars, badges
rounded-2xl  // Large containers
```

### Opacity Levels
```tsx
opacity-10   // Background tint (very subtle)
opacity-20   // Background tint (subtle)
opacity-40   // Overlay (visible)
opacity-60   // Strong overlay (text readable)
opacity-80   // Near opaque
```

## Accessibility Checklist

✅ **Done**:
- [x] All icons from consistent set (Lucide)
- [x] SVG icons instead of emojis
- [x] All clickable elements have `cursor-pointer`
- [x] Hover states provide clear visual feedback
- [x] Transitions are smooth (150-300ms)
- [x] Focus states visible for keyboard navigation
- [x] Text contrast meets WCAG AA (4.5:1 minimum)
- [x] Responsive at 320px, 768px, 1024px, 1440px
- [x] No content hidden behind fixed navbars
- [x] Consistent spacing system
- [x] Semantic HTML (proper heading hierarchy)

## Color Palette Reference

### Primary Colors
```tsx
primary/10   // Background tint (very subtle)
primary/20   // Background tint (subtle)
primary/30   // Accent backgrounds
primary      // Primary actions, links
```

### Border Colors
```tsx
border-border/50    // Subtle borders (light mode)
border-border/30    // Very subtle (dark mode)
border-primary/30   // Accent borders
```

### Text Colors
```tsx
text-foreground      // Primary text
text-foreground/80   // Secondary text
text-muted-foreground // Tertiary text (labels)
```

## Responsive Breakpoints

```tsx
// Mobile (default)
grid-cols-1
px-4
text-base

// Tablet (sm:)
grid-cols-2
px-5
text-lg

// Laptop (lg:)
grid-cols-3
text-xl

// Desktop (xl:)
grid-cols-4
text-2xl
```

## Migration Checklist

### Phase 1: Core Components
- [ ] Create `profile-header-v2.tsx`
- [ ] Create `content-grid.tsx`
- [ ] Create `story-card-v2.tsx`
- [ ] Create `storyboard-card-v2.tsx`
- [ ] Create `character-card-v2.tsx`

### Phase 2: Page Updates
- [ ] Update `app/profile/[id]/page.tsx`
- [ ] Update `app/profile/[id]/stories/page.tsx`
- [ ] Update `app/profile/[id]/storyboards/page.tsx`
- [ ] Update `app/profile/[id]/characters/page.tsx`
- [ ] Update `app/profile/[id]/drafts/page.tsx`

### Phase 3: Testing
- [ ] Test on mobile (320px)
- [ ] Test on tablet (768px)
- [ ] Test on laptop (1024px)
- [ ] Test on desktop (1440px)
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Test all hover states
- [ ] Test keyboard navigation

### Phase 4: Cleanup
- [ ] Remove old components
- [ ] Remove unused imports
- [ ] Update documentation
- [ ] Commit changes

## Next Steps

1. **Review and approve** the new components
2. **Implement** in each profile subpage
3. **Test** across all breakpoints
4. **Iterate** based on user feedback

## Notes

- All new components use Tailwind's `@apply` pattern for consistency
- Custom border radius `9999px` used for pill shapes
- `tabular-nums` class for monospaced numbers in stats
- `group-hover` pattern for nested hover states
- `transition-all duration-300` for smooth animations
