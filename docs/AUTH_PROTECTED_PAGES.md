# Authentication Protected Pages - Implementation Guide

本文档说明如何在需要登录的页面中集成登录提示功能。

## 📦 已创建的组件和工具

### 1. LoginPrompt 组件
**位置**: `components/auth/login-prompt.tsx`

统一的登录提示弹窗组件。

**功能**:
- 统一的登录提示 UI
- 支持自定义标题和描述
- 国际化支持
- 可复用的 Hook

### 2. useLoginPrompt Hook
**位置**: `components/auth/login-prompt.tsx`

```typescript
{
  show: () => void,      // 显示登录提示
  hide: () => void,      // 隐藏登录提示
  Component: React.FC,   // LoginPrompt 组件
  isOpen: boolean        // 当前是否显示
}
```

### 3. useAuthRequired Hook
**位置**: `lib/hooks/use-auth-required.ts`

**功能**: 处理认证需求的 Hook，提供统一的方法和状态。

```typescript
{
  // 认证状态
  isAuthenticated: boolean,
  isCheckingAuth: boolean,
  user: User | null,

  // 登录提示组件
  LoginPrompt: React.FC,
  showPrompt: (options?: { title?: string; description?: string }) => void,

  // 辅助方法
  requiresAuth: (callback: () => void | Promise<void>, options?: {
    title?: string;
    description?: string;
  }) => void,

  // 自定义提示选项
  customPromptTitle?: string,
  customPromptDesc?: string,
}
```

### 4. WithAuthCheck 组件
**位置**: `lib/components/with-auth-check.tsx`

HOC 组件，用于包装需要认证的内容。

## 🎯 使用方法

### 方法 1: 使用 useAuthRequired Hook（推荐）

适用于需要精细控制认证状态的页面。

```tsx
"use client";

import { useAuthRequired } from "@/lib/hooks/use-auth-required";

export default function MyPage() {
  const {
    isAuthenticated,
    isCheckingAuth,
    LoginPrompt,
    showPrompt
  } = useAuthRequired();

  // 显示加载状态
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // 显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <EmptyState />
        <LoginPrompt
          title="Custom Title"
          description="Custom description for this page"
        />
      </div>
    );
  }

  // 用户已登录，显示内容
  return <ProtectedContent />;
}
```

### 方法 2: 使用 requiresAuth 方法

用于处理需要认证的操作。

```tsx
"use client";

import { useAuthRequired } from "@/lib/hooks/use-auth-required";

export default function MyComponent() {
  const { requiresAuth } = useAuthRequired();

  const handleLike = async () => {
    requiresAuth(
      // 只有已登录用户才会执行这个回调
      async () => {
        await performLikeAction();
      },
      // 可选：自定义提示信息
      {
        title: "Like This Story",
        description: "Sign in to like stories and save them to your favorites."
      }
    );
  };

  return <button onClick={handleLike}>Like</button>;
}
```

### 方法 3: 使用 WithAuthCheck 组件

用于简单的页面保护。

```tsx
"use client";

import { WithAuthCheck } from "@/lib/components/with-auth-check";

export default function MyPage() {
  return (
    <WithAuthCheck
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <EmptyState />
        </div>
      }
    >
      <ProtectedContent />
    </WithAuthCheck>
  );
}
```

## 📝 已更新的页面

### 1. Notifications Page
**文件**: `app/notifications/page.tsx`

**更新内容**:
- 导入 `useAuthRequired`
- 添加认证检查
- 未登录时显示登录提示
- 自定义提示标题和描述

### 2. Chat List Page
**文件**: `app/chat/page.tsx`

**更新内容**:
- 导入 `useAuthRequired`
- 添加认证检查
- 未登录时显示登录提示
- 自定义提示标题和描述

### 3. Dashboard Page
**文件**: `app/page.tsx`

**更新内容**:
- 使用 `useLoginPrompt` Hook
- Tab 点击时检查认证状态
- 未登录用户点击受保护的 tab 时显示登录提示

## 🔧 集成到新页面的步骤

### 步骤 1: 导入必要的依赖

```tsx
import { useAuthRequired } from "@/lib/hooks/use-auth-required";
import { Loader2 } from "lucide-react";
```

### 步骤 2: 初始化 Hook

```tsx
export default function MyPage() {
  const {
    isAuthenticated,
    isCheckingAuth,
    LoginPrompt,
  } = useAuthRequired();
```

### 步骤 3: 添加认证检查

```tsx
  // 检查加载状态
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // 检查认证状态
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* 自定义空状态或说明 */}
        <div className="text-center py-20">
          <LockIcon className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-bold mt-4">Sign In Required</h2>
          <p className="text-muted-foreground mt-2">
            Please sign in to access this content.
          </p>
        </div>

        {/* 添加 LoginPrompt 组件 */}
        <LoginPrompt
          title="Page Title"              // 可选：自定义标题
          description="Page description"      // 可选：自定义描述
        />
      </div>
    );
  }

  // 用户已登录，渲染页面内容
  return (
    <div>
      {/* 页面内容 */}
    </div>
  );
}
```

### 步骤 4: 处理需要认证的操作

```tsx
  const { requiresAuth } = useAuthRequired();

  const handleAction = () => {
    requiresAuth(
      async () => {
        // 只有已登录用户才会执行
        await performProtectedAction();
      },
      {
        title: "Action Name",               // 可选
        description: "Action description",   // 可选
      }
    );
  };

  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
}
```

## 🎨 自定义登录提示

### 自定义标题

```tsx
<LoginPrompt
  title="Create Your Story"
/>
```

### 自定义描述

```tsx
<LoginPrompt
  description="Sign in to start creating amazing stories and connect with other creators."
/>
```

### 同时自定义两者

```tsx
<LoginPrompt
  title="Access Your Dashboard"
  description="Sign in to view your storyboards, manage your characters, and track your progress."
/>
```

## 🌐 国际化

LoginPrompt 组件自动支持国际化。确保在语言文件中添加以下键值：

```json
{
  "auth.join_community": "Join Community",
  "auth.login_prompt_description": "Sign in to access exclusive content, create your own stories, and connect with other creators.",
  "auth.login": "Login",
  "auth.sign_up": "Sign Up",
  "auth.maybe_later": "Maybe Later"
}
```

## 📋 需要添加登录提示的页面清单

### 高优先级（用户核心功能）
- [x] `app/page.tsx` - Dashboard ✅
- [x] `app/notifications/page.tsx` - Notifications ✅
- [x] `app/chat/page.tsx` - Chat List ✅
- [ ] `app/chat/[id]/page.tsx` - Chat Detail
- [ ] `app/characters/page.tsx` - Characters List
- [ ] `app/characters/create/page.tsx` - Create Character
- [ ] `app/characters/[id]/page.tsx` - Character Detail
- [ ] `app/profile/following/page.tsx` - Following
- [ ] `app/profile/followers/page.tsx` - Followers

### 中优先级（管理功能）
- [ ] `app/settings/page.tsx` - Settings
- [ ] `app/settings/profile/page.tsx` - Profile Settings
- [ ] `app/settings/privacy/page.tsx` - Privacy Settings
- [ ] `app/settings/language/page.tsx` - Language Settings
- [ ] `app/settings/appearance/page.tsx` - Appearance Settings

### 内容创建页面
- [ ] `app/create/page.tsx` - Create Storyboard
- [ ] `app/create/wizard/page.tsx` - Create Wizard
- [ ] `app/create/chat/page.tsx` - Create Chat
- [ ] `app/storyboards/[id]/editor/page.tsx` - Storyboard Editor

### 群组页面
- [ ] `app/groups/page.tsx` - Groups List
- [ ] `app/groups/[id]/page.tsx` - Group Detail
- [ ] `app/groups/[id]/settings/page.tsx` - Group Settings
- [ ] `app/groups/[id]/members/page.tsx` - Group Members

## 🔄 API 调用中的认证处理

使用 `withAuth` 辅助函数自动处理 401 错误：

```tsx
import { withAuth } from "@/lib/utils/api-auth";
import { useLoginPrompt } from "@/components/auth/login-prompt";

export default function MyComponent() {
  const { show } = useLoginPrompt();

  const loadData = async () => {
    const result = await withAuth(
      () => storyboards.getDashboardStoryboards(),
      show  // 自动显示登录提示
    );

    if (result.requiresAuth) {
      // 登录提示已自动显示
      return;
    }

    if (result.error) {
      console.error("Failed to load:", result.error);
      return;
    }

    // 使用数据
    console.log("Data:", result.data);
  };

  return <button onClick={loadData}>Load Data</button>;
};
```

## 🎯 最佳实践

1. **始终使用 Hook**: 优先使用 `useAuthRequired` 或 `useLoginPrompt` Hook
2. **处理加载状态**: 在认证检查期间显示加载指示器
3. **提供有意义的提示**: 根据页面功能自定义标题和描述
4. **保持一致的用户体验**: 所有受保护页面应使用相同的登录提示 UI
5. **不要重复导航**: 登录提示组件会处理导航逻辑
6. **测试未登录状态**: 确保未登录用户看到适当的提示

## 🐛 常见问题

### Q: 为什么登录提示没有显示？
A: 确保：
1. 在组件中添加了 `LoginPrompt` 组件
2. 没有多个 `LoginPrompt` 实例
3. Hook 正确返回了 `show` 方法

### Q: 如何处理 401 错误？
A: 使用 `withAuth` 辅助函数包装 API 调用，它会自动显示登录提示。

### Q: 可以自定义登录提示的样式吗？
A: 不推荐。使用统一的 UI 确保用户体验一致。

## 📚 相关文件

- `components/auth/login-prompt.tsx` - 登录提示组件
- `components/auth/README.md` - 组件详细文档
- `lib/hooks/use-auth-required.ts` - 认证需求 Hook
- `lib/components/with-auth-check.tsx` - 认证检查 HOC
- `lib/utils/api-auth.ts` - API 认证辅助函数

## 📞 需要帮助？

如果遇到问题或需要帮助，请参考 `components/auth/README.md` 获取更详细的文档。
