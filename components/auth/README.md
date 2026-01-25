# Login Prompt Component

统一的登录提示组件，用于在需要认证的功能中向用户展示登录弹窗。

## 功能

- ✅ 统一的登录提示 UI
- ✅ 支持自定义标题和描述
- ✅ 自动处理 401 认证错误
- ✅ 可复用的 Custom Hook
- ✅ 国际化支持

## 快速开始

### 1. 使用 `useLoginPrompt` Hook (推荐)

在需要显示登录提示的组件中使用：

```tsx
"use client";

import { useLoginPrompt } from "@/components/auth/login-prompt";

export default function MyComponent() {
  const LoginPromptModal, { show: showLoginPrompt } = useLoginPrompt();

  const handleAuthAction = async () => {
    // 检查用户是否登录，如果未登录则显示提示
    if (!user) {
      showLoginPrompt();
      return;
    }

    // 执行需要认证的操作
    await performAuthenticatedAction();
  };

  return (
    <div>
      <button onClick={handleAuthAction}>
        Click me (requires login)
      </button>

      {/* 在组件末尾添加 LoginPrompt */}
      <LoginPrompt />
    </div>
  );
}
```

### 2. 自定义标题和描述

```tsx
const LoginPrompt, { show: showLoginPrompt } = useLoginPrompt();

// ... 在组件中 ...

<LoginPrompt 
  title="Create Your Story"
  description="Sign in to start creating amazing stories and connect with the community."
/>
```

### 3. 在 API 调用中使用 `withAuth` 辅助函数

自动处理 401 错误并显示登录提示：

```tsx
"use client";

import { withAuth } from "@/lib/utils/api-auth";
import { useLoginPrompt } from "@/components/auth/login-prompt";

export default function MyComponent() {
  const { show: showLoginPrompt } = useLoginPrompt();

  const loadData = async () => {
    const result = await withAuth(
      () => storyboards.getDashboardStoryboards(),
      showLoginPrompt // 自动显示登录提示
    );

    if (result.requiresAuth) {
      // 登录提示已自动显示
      return;
    }

    if (result.error) {
      // 处理其他错误
      console.error("Failed to load:", result.error);
      return;
    }

    // 使用数据
    console.log("Data:", result.data);
  };

  return <button onClick={loadData}>Load Data</button>;
};
```

## API 参考

### LoginPrompt 组件

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `isOpen` | `boolean` | ✅ | - | 控制弹窗显示/隐藏 |
| `onClose` | `() => void` | ✅ | - | 关闭弹窗的回调 |
| `title` | `string` | ❌ | "Join Community" | 弹窗标题 |
| `description` | `string` | ❌ | 默认描述 | 弹窗描述文本 |

### useLoginPrompt Hook

返回值：

```typescript
{
  show: () => void,              // 显示登录提示
  hide: () => void,              // 隐藏登录提示
  LoginPromptModal: React.FC,     // LoginPrompt 组件
  isOpen: boolean                // 当前是否显示
}
```

## 实际使用场景

### 场景 1: Tab 需要登录

```tsx
const tabs = [
  { value: Tab.TRENDING, label: "Trending" },
  { value: Tab.STORYBOARDS, label: "My Storyboards", requiredAuth: true },
  { value: Tab.FOLLOWING, label: "Following", requiredAuth: true },
];

const LoginPrompt, { show: showLoginPrompt } = useLoginPrompt();

const handleTabClick = (tab) => {
  if (tab.requiredAuth && !user) {
    showLoginPrompt();
  } else {
    setActiveTab(tab.value);
  }
};
```

### 场景 2: API 调用失败时显示登录

```tsx
const handleLike = async (id: string) => {
  const result = await withAuth(
    () => storyboards.like(id),
    showLoginPrompt
  );

  if (result.requiresAuth) {
    return; // 登录提示已显示
  }

  if (result.data) {
    // 更新 UI
    updateLikeStatus(id, true);
  }
};
```

### 场景 3: 需要认证的操作

```tsx
const handleCreate = async () => {
  if (!user) {
    showLoginPrompt();
    return;
  }

  // 执行创建操作
  await createStoryboard(data);
};
```

## 国际化

组件会自动使用 `useTranslation` 提供的翻译：

```typescript
// 默认使用的翻译键
{
  "auth.join_community": "Join Community",
  "auth.login_prompt_description": "Sign in to access exclusive content...",
  "auth.login": "Login",
  "auth.sign_up": "Sign Up",
  "auth.maybe_later": "Maybe Later"
}
```

在语言文件中添加这些键值以支持多语言。

## 样式

组件使用了 Tailwind CSS 和 shadcn/ui 组件：

- `Card`: 弹窗容器
- `Button`: 动作按钮
- `Link`: Next.js 链接
- `Lock`, `LogIn`, `UserPlus`: Lucide 图标

## 最佳实践

1. **总是在组件末尾添加 LoginPrompt**：确保弹窗能够正确渲染
2. **使用 withAuth 包装 API 调用**：自动处理认证错误
3. **检查用户状态**：在操作前检查用户是否已登录
4. **提供有意义的描述**：根据功能自定义描述文本
5. **不要重复创建多个 LoginPrompt**：每个页面只需一个实例

## 完整示例

```tsx
"use client";

import { useState } from "react";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { withAuth } from "@/lib/utils/api-auth";
import { storyboards } from "@/lib/api/storyboards";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const LoginPromptModal, { show: showLoginPrompt } = useLoginPrompt();
  const { user } = useAuth();

  const loadDashboardData = async () => {
    const result = await withAuth(
      () => storyboards.getDashboardStoryboards(),
      showLoginPrompt
    );

    if (result.requiresAuth) {
      return; // 登录提示已自动显示
    }

    if (result.error) {
      console.error("Error:", result.error);
      return;
    }

    setItems(result.data.storyboards || []);
  };

  const handleTabClick = (tab) => {
    if (tab.requiredAuth && !user) {
      showLoginPrompt();
    } else {
      loadDashboardData();
    }
  };

  return (
    <div>
      <button onClick={() => showLoginPrompt()}>
        Show Login Prompt
      </button>

      {/* 添加自定义描述 */}
      <LoginPrompt 
        title="Access Your Dashboard"
        description="Sign in to view your storyboards, manage your characters, and track your progress."
      />
    </div>
  );
}
```

## 相关文件

- `components/auth/login-prompt.tsx` - 组件和 Hook 实现
- `lib/utils/api-auth.ts` - API 认证辅助函数
- `providers/auth-provider.tsx` - 认证状态管理
