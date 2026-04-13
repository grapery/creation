# Frontend-Backend API Alignment Summary

## Overview
This document summarizes the alignment between the Next.js frontend (creation) and Go backend (grapery) APIs.

## Backend Services

| Service | Port | Base URL | Usage |
|---------|------|----------|-------|
| Main | 8080 | `/api` | Core API (stories, users, characters, etc.) |
| VIPPay | 8060 | `/api/vippay` | Payments and subscriptions |
| Chat | 8050 | N/A | Not implemented in backend |

## Key Changes Made

### 1. Group Feature Removal
- **Backend Change**: Group feature completely removed from backend
- **Frontend Impact**: All Group-related types, API calls, pages, and components removed

### 2. Story Status Type Alignment
- **Issue**: Frontend used `number` (0: draft, 1: published), backend uses `string`
- **Fix**: Updated `Story.status` type from `number` to `'draft' | 'published' | 'rendering'`
- **Files Changed**:
  - `lib/types.ts`: Updated Story and CreateStoryRequest interfaces
  - `components/story/story-detail-header.tsx`: Updated status check from `=== 1` to `=== 'published'`

### 3. Interaction System Migration
Unified like/follow system using `/api/likes` and `/api/follows`:

```typescript
// Story interactions
POST   /api/likes    { likeableType: 'story', likeableId: id }      // Like
DELETE /api/likes    { likeableType: 'story', likeableId: id }      // Unlike
POST   /api/follows  { followableType: 'story', followableId: id }  // Follow
DELETE /api/follows  { followableType: 'story', followableId: id }  // Unfollow

// Character interactions
POST   /api/follows  { followableType: 'character', followableId: id }
DELETE /api/follows  { followableType: 'character', followableId: id }

// Storyboard interactions（唯一数据源：storyboard_likes）
POST   /api/storyboards/:id/like
DELETE /api/storyboards/:id/like
// 批量/检查仍可用：POST /api/likes/batch-check、GET /api/likes/check?type=storyboard_node（服务端委托到 storyboard_likes）

// Batch check endpoints
POST /api/likes/batch-check    { likeableType, likeableIds }
POST /api/follows/batch-check  { followableType, followableIds }
```

### 4. Profile Update Fix
- **Old**: `PUT /api/profile`
- **New**: `PUT /api/users/:id`
- **File**: `lib/api/profile.ts`

### 5. VIP Service Migration
- **Change**: Payment service moved to VIPPay service on port 8060
- **Prefix**: All routes use `/api/vippay` prefix
- **Client**: Uses `paymentClient` instead of `apiClient`
- **File**: `lib/api/payment.ts`, `lib/api/vip.ts`

### 6. New API Modules Added
- `lib/api/notifications.ts` - Notification API with SSE support
- `lib/api/assets.ts` - Asset management
- `lib/api/devices.ts` - Device registration for push notifications
- `lib/api/settings.ts` - User settings
- `lib/api/tags.ts` - Tag management
- `lib/api/fragments.ts` - Fragment management

### 7. Style Alignment
Updated to match Voyager iOS DesignSystem:
- Status colors: `--follow`, `--like`, `--comment`, `--ai-complete`
- Floating cards with backdrop blur
- Capsule buttons with gradient backgrounds

## Authentication

### Public Routes (No Auth Required)
- `GET /api/public/stories/trending`
- `GET /api/public/trending/storyboards`

### Auth Routes (Require Bearer Token)
All other `/api/*` routes require authentication via `Authorization: Bearer <token>` header.

## API Response Format

### Standard Response Wrapper
```typescript
interface APIResponse<T> {
    code: number;      // 0 or 1 = success, others = error
    message: string;
    data?: T;
}
```

### Error Handling
- 401: Unauthorized - redirect to login
- 404: Not found - return empty data for navigation endpoints
- 500/503: Server errors - return safe empty responses to prevent UI crashes

## Type Mappings

| Frontend Type | Backend Type | Notes |
|--------------|--------------|-------|
| `Story.status: 'draft' \| 'published' \| 'rendering'` | `string` | Aligned to string enum |
| `Story.coverImage` | `coverImage` | Alias: `cover` |
| `Story.likes` | `likes` | Alias: `likeCount` |
| `Story.panels` | `panels` | Alias: `storyboardCount` |
| `Character.creatorId` | `createdBy` | Different field names |
| `UserSettings.profileVisibility` | `public` \| `followers_only` \| `private` | Note: backend uses `followers_only` not `followers` |
| `UserSettings.defaultStoryVisibility` | `public` \| `unlisted` \| `private` | Note: backend has `unlisted` option |
| `UserSettings.allowFollowFrom` | `everyone` \| `followers_only` \| `followers_of_followers` \| `no_one` | More granular than frontend |
| `UserSettings.notificationSettings` | `string` (JSON) | Backend stores as JSON string, frontend uses object |

## Missing/Unimplemented Features

1. **Chat System** - Backend has no chat endpoints, marked as NOT_IMPLEMENTED
2. **Following Stories Feed** - No dedicated backend endpoint, returns empty
3. **Payment Provider Specific Endpoints** - Use unified `createPayment` instead
4. **Block/Unblock User** - Backend endpoints not implemented
5. **Report User** - Backend endpoint not implemented

## Issues Found and Fixed

### 1. OAuth API Client Mismatch (FIXED)
- **Issue**: Google/WeChat OAuth calls used default `apiClient` but endpoints are on vippay service (port 8060)
- **Fix**: Added `paymentClient` parameter to request calls in `lib/api/auth.ts`
- **Affected**: `loginWithGoogle()`, `loginWithWeChat()`

### 2. UserSettings Privacy Enum Mismatch (FIXED)
- **Issue**: Frontend used `followers` but backend uses `followers_only`
- **Fix**: Updated `UserSettings` interface to use backend enum values
- **Note**: Backend has more granular options like `followers_of_followers`, `no_one`

### 3. NotificationSettings Type Mismatch (FIXED)
- **Issue**: Backend stores `notificationSettings` as JSON string, frontend expected object
- **Fix**: Added `parseSettingsResponse()` helper in `lib/api/settings.ts` to auto-parse JSON string

### 4. Notification List Response Format (FIXED)
- **Issue**: Frontend expected `{ notifications, total, unreadCount }` but backend returns `{ notifications, count }`
- **Fix**: Updated `NotificationListResponse` interface to match backend
- **Note**: Use separate `getUnreadCount()` API to get unread count

### 5. Backend Handler Reference to Removed Group Feature
- **Issue**: `interaction.go` handler comment mentions `group` in FollowableType
- **Status**: Backend code correctly only supports `story`, `user`, `character` - comment is outdated
- **Action**: Backend should update comment to remove group reference

### 6. Character Type Missing Fields (FIXED)
- **Issue**: Frontend Character type was missing several backend fields
- **Fix**: Added missing fields to `lib/types/character.ts`:
  - `poster`, `needsPortrait`, `referenceImage`, `portraitGenerationStatus`
  - `traits`, `skills`, `posterCreationPermission`
  - `sourceType`, `sourcePrompt`, `sourceImage`, `createdBy`, `lastEditedBy`, `updatedAt`

### 7. Story Type Missing Fields (FIXED)
- **Issue**: Frontend Story type was missing many backend AI-related fields
- **Fix**: Added missing fields to `lib/types.ts`:
  - AI enrichment: `isAIEnriched`, `aiEnrichedAt`, `enrichedDescription`, `originalDescription`
  - AI images: `coverGeneratedByAI`, `posterImage`, `backgroundImage`
  - AI settings: `useAI`, `aiAssistanceOptions`
  - Token usage: `tokensUsed`, `textTokensUsed`, `imageTokensUsed`, `aiGenerationCost`
  - Collaboration: `isCollaborationOpen`
  - Navigation: `rootStoryboardId`, `defaultPathNodeIds`, `defaultPathUpdatedAt`, `defaultPathType`
  - Source: `sourceFragmentId`

### 8. Import Cleanup (OPTIMIZED)
- **Issue**: Multiple API files imported unused `apiClient`
- **Fix**: Removed unused `apiClient` imports from all API files (stories, characters, tags, etc.)
- **Files Affected**: 13 API files cleaned up

### 9. Payment Import Order (FIXED)
- **Issue**: Import statement was in middle of code in `lib/api/payment.ts`
- **Fix**: Moved import to top of file with other imports

## Appendix: Complete API Endpoint Mapping

### Main Service (Port 8080)

#### Authentication
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `auth.login()` | POST | `/api/auth/login` | No |
| `auth.register()` | POST | `/api/auth/register` | No |
| `auth.me()` | GET | `/api/auth/me` | Yes |
| `auth.refreshToken()` | POST | `/api/auth/refresh` | No |
| `auth.requestPasswordReset()` | POST | `/api/auth/password/request-reset` | No |
| `auth.resetPassword()` | POST | `/api/auth/password/reset` | No |

#### Stories
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `stories.getTrending()` | GET | `/api/public/stories/trending` | No |
| `stories.list()` | GET | `/api/stories` | Yes |
| `stories.get()` | GET | `/api/stories/:id` | Yes |
| `stories.create()` | POST | `/api/stories` | Yes |
| `stories.update()` | PUT | `/api/stories/:id` | Yes |
| `stories.like()` | POST | `/api/likes` | Yes |
| `stories.unlike()` | DELETE | `/api/likes` | Yes |
| `stories.follow()` | POST | `/api/follows` | Yes |
| `stories.unfollow()` | DELETE | `/api/follows` | Yes |
| `stories.batchCheckLiked()` | POST | `/api/likes/batch-check` | Yes |
| `stories.batchCheckFollowing()` | POST | `/api/follows/batch-check` | Yes |

#### Storyboards
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `storyboards.getFeed()` | GET | `/api/storyboards/feed` | Yes |
| `storyboards.getDashboardStoryboards()` | GET | `/api/dashboard/storyboards` | Yes |
| `storyboards.getTrending()` | GET | `/api/dashboard/trending/storyboards` | Yes |
| `storyboards.getByStoryId()` | GET | `/api/storyboards?storyId=` | Yes |
| `storyboards.get()` | GET | `/api/storyboards/:id` | Yes |
| `storyboards.getChildren()` | GET | `/api/storyboards/:id/children` | Yes |
| `storyboards.like()` | POST | `/api/storyboards/:id/like` | Yes |
| `storyboards.unlike()` | DELETE | `/api/storyboards/:id/like` | Yes |

#### Characters
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `characters.list()` | GET | `/api/characters` | Yes |
| `characters.get()` | GET | `/api/characters/:id` | Yes |
| `characters.create()` | POST | `/api/characters` | Yes |
| `characters.update()` | PUT | `/api/characters/:id` | Yes |
| `characters.delete()` | DELETE | `/api/characters/:id` | Yes |
| `characters.follow()` | POST | `/api/follows` | Yes |
| `characters.unfollow()` | DELETE | `/api/follows` | Yes |
| `characters.like()` | POST | `/api/likes` | Yes |
| `characters.unlike()` | DELETE | `/api/likes` | Yes |

#### Users / Profile
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `profile.getProfile()` | GET | `/api/users/:id` | Yes |
| `profile.updateProfile()` | PUT | `/api/users/:id` | Yes |
| `profile.getMyProfile()` | GET | `/api/auth/me` | Yes |
| `profile.getStories()` | GET | `/api/users/:id/stories` | Yes |
| `profile.getCharacters()` | GET | `/api/users/:id/characters` | Yes |
| `profile.getStoryboards()` | GET | `/api/users/:id/storyboards` | Yes |
| `profile.getFollowers()` | GET | `/api/users/:id/followers` | Yes |
| `profile.getFollowing()` | GET | `/api/users/:id/following` | Yes |
| `profile.followUser()` | POST | `/api/follows` | Yes |
| `profile.unfollowUser()` | DELETE | `/api/follows` | Yes |

#### Comments
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `comments.list()` | GET | `/api/comments?targetId=&targetType=` | Yes |
| `comments.create()` | POST | `/api/comments` | Yes |
| `comments.delete()` | DELETE | `/api/comments/:id` | Yes |
| `comments.like()` | POST | `/api/comments/:id/like` | Yes |
| `comments.unlike()` | DELETE | `/api/comments/:id/like` | Yes |

#### Notifications
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `notifications.list()` | GET | `/api/notifications` | Yes |
| `notifications.getUnreadCount()` | GET | `/api/notifications/unread/count` | Yes |
| `notifications.markAsRead()` | POST | `/api/notifications/:id/read` | Yes |
| `notifications.markAllAsRead()` | POST | `/api/notifications/read-all` | Yes |
| `notifications.delete()` | DELETE | `/api/notifications/:id` | Yes |
| `notifications.subscribeToSSE()` | GET | `/api/sse/notifications` | Yes |

#### Settings
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `settings.get()` | GET | `/api/settings` | Yes |
| `settings.update()` | PUT | `/api/settings` | Yes |
| `settings.updateLanguage()` | PUT | `/api/settings/language` | Yes |
| `settings.updateTheme()` | PUT | `/api/settings/theme` | Yes |
| `settings.updateFontSize()` | PUT | `/api/settings/font-size` | Yes |
| `settings.updatePrivacy()` | PUT | `/api/settings/privacy` | Yes |
| `settings.updateAI()` | PUT | `/api/settings/ai` | Yes |
| `settings.updateNotifications()` | PUT | `/api/settings/notifications` | Yes |

### VIPPay Service (Port 8060)

#### VIP / Subscription
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `vip.getStatus()` | GET | `/api/vippay/vip/info` | Yes |
| `vip.checkIsVip()` | GET | `/api/vippay/vip/check` | Yes |
| `vip.getTokenUsage()` | GET | `/api/vippay/vip/quota` | Yes |
| `vip.getMaxRoles()` | GET | `/api/vippay/vip/max-roles` | Yes |
| `vip.getMaxContexts()` | GET | `/api/vippay/vip/max-contexts` | Yes |

#### Payments
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `payment.createPayment()` | POST | `/api/vippay/web/payments` | Yes |
| `payment.getPaymentById()` | GET | `/api/vippay/web/payments/:id` | Yes |
| `payment.getPaymentHistory()` | GET | `/api/vippay/web/payments/user/:userId` | Yes |
| `payment.cancelPayment()` | POST | `/api/vippay/web/payments/:id/cancel` | Yes |

#### OAuth (External Providers)
| Frontend API | Method | Backend Route | Auth Required |
|-------------|--------|--------------|---------------|
| `auth.loginWithGoogle()` | POST | `/api/vippay/google-oauth/signin` | No |
| `auth.loginWithWeChat()` | POST | `/api/vippay/wechat-oauth/signin` | No |

## Testing Checklist

- [ ] Story list loads correctly with authentication
- [ ] Story detail displays all fields (title, description, cover, stats)
- [ ] Like/Follow buttons work and update UI
- [ ] User profile updates successfully
- [ ] VIP membership page loads plans
- [ ] Public trending stories accessible without login
- [ ] Notifications SSE connection works
