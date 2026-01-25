# Login Prompt 命名冲突修复说明

## 🐛 问题
在使用 `useLoginPrompt` Hook 时，`LoginPrompt` 同时是导入的组件和从 Hook 返回的变量，导致命名冲突。

```typescript
// ❌ 错误：命名冲突
import { LoginPrompt as LoginPromptComponent } from "@/components/auth/login-prompt";
export default function MyPage() {
  const LoginPrompt, { show } = useLoginPrompt(); // 冲突！
}
```

## ✅ 解决方案

### 1. 更新 Hook 返回值
`useLoginPrompt` Hook 返回的组件改名为 `LoginPromptModal`：

```typescript
// ✅ 正确
export function useLoginPrompt() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const show = () => setShowLoginPrompt(true);
  const hide = () => setShowLoginPrompt(false);

  // 改名为 LoginPromptModal 避免冲突
  const LoginPromptModal = (props: Omit<LoginPromptProps, 'isOpen' | 'onClose'>) => (
    <LoginPrompt
      isOpen={showLoginPrompt}
      onClose={hide}
      {...props}
    />
  );

  return {
    show,
    hide,
    LoginPromptModal,  // 使用新名称
    isOpen: showLoginPrompt,
  };
}
```

### 2. 在页面中使用新名称

```tsx
"use client";

import { useLoginPrompt } from "@/components/auth/login-prompt";

export default function MyPage() {
  const LoginPromptModal, { show: showLoginPrompt } = useLoginPrompt();
  // ✅ 使用 LoginPromptModal 而不是 LoginPrompt

  return (
    <div>
      {/* 页面内容 */}
      <LoginPromptModal title="Custom Title" description="Custom Description" />
    </div>
  );
}
```

### 3. 在 useAuthRequired Hook 中也更新

```typescript
// ✅ 正确
export function useAuthRequired() {
  // ... 其他代码 ...

  return {
    // 其他返回值 ...

    // 使用新名称
    LoginPromptModal,  // 而不是 LoginPrompt
    showPrompt,
    // ...
  };
}
```

## 📝 已更新的文件

### 1. 组件文件
- ✅ `components/auth/login-prompt.tsx`
  - `useLoginPrompt` Hook 返回 `LoginPromptModal` 而不是 `Component`

### 2. 页面文件
- ✅ `app/page.tsx`
  - 导入: `import { LoginPrompt as LoginPromptComponent }`
  - 使用: `const { Component, show } = useLoginPrompt()`

- ✅ `app/notifications/page.tsx`
  - 使用: `const LoginPromptModal, ... } = useAuthRequired()`

- ✅ `app/chat/page.tsx`
  - 使用: `const LoginPromptModal, ... } = useAuthRequired()`

### 3. Hook 文件
- ✅ `lib/hooks/use-auth-required.ts`
  - 返回: `LoginPromptModal` 而不是 `LoginPrompt`

## 🔧 需要更新的文档

以下文档需要更新以反映新的命名：

1. `components/auth/README.md`
2. `docs/AUTH_PROTECTED_PAGES.md`

### 更新步骤

#### components/auth/README.md

将所有使用 `LoginPrompt, { show }` 的地方改为 `LoginPromptModal, { show }`：

```diff
- const LoginPrompt, { show: showLoginPrompt } = useLoginPrompt();
+ const LoginPromptModal, { show: showLoginPrompt } = useLoginPrompt();
```

将所有使用 `<LoginPrompt>` 的地方改为 `<LoginPromptModal>`：

```diff
- <LoginPrompt />
+ <LoginPromptModal />
```

#### docs/AUTH_PROTECTED_PAGES.md

同样将所有引用更新为新名称。

## 📚 正确的 API 参考

### useLoginPrompt Hook

```typescript
{
  show: () => void,              // 显示登录提示
  hide: () => void,              // 隐藏登录提示
  LoginPromptModal: React.FC,     // LoginPrompt 组件 ✅ 新名称
  isOpen: boolean                // 当前是否显示
}
```

### useAuthRequired Hook

```typescript
{
  isAuthenticated: boolean,
  isCheckingAuth: boolean,
  user: User | null,

  // 登录提示组件 ✅ 新名称
  LoginPromptModal: React.FC,
  showPrompt: (options?: { title?: string; description?: string }) => void,

  // 辅助方法
  requiresAuth: (callback: () => void | Promise<void>, options?: {
    title?: string;
    description?: string;
  }) => void,

  customPromptTitle?: string,
  customPromptDesc?: string,
}
```

## 🎯 快速参考

### 简单页面（使用 useLoginPrompt）

```tsx
import { useLoginPrompt } from "@/components/auth/login-prompt";

export default function MyPage() {
  const LoginPromptModal, { show } = useLoginPrompt();

  const handleAction = () => {
    if (!user) {
      show(); // 显示登录提示
      return;
    }
    // 执行操作
  };

  return (
    <div>
      <button onClick={handleAction}>Protected Action</button>
      <LoginPromptModal
        title="Access Feature"
        description="Sign in to use this feature."
      />
    </div>
  );
}
```

### 复杂页面（使用 useAuthRequired）

```tsx
import { useAuthRequired } from "@/lib/hooks/use-auth-required";

export default function MyProtectedPage() {
  const {
    isAuthenticated,
    isCheckingAuth,
    LoginPromptModal,
  } = useAuthRequired();

  if (!isAuthenticated) {
    return (
      <div>
        <EmptyState />
        <LoginPromptModal
          title="Sign In Required"
          description="Please sign in to continue."
        />
      </div>
    );
  }

  return <ProtectedContent />;
}
```

## 🚀 后续集成步骤

当在新的需要登录的页面中集成时：

1. ✅ 导入 `useLoginPrompt` 或 `useAuthRequired`
2. ✅ 从 Hook 解构 `LoginPromptModal`（而不是 `LoginPrompt`）
3. ✅ 在 JSX 中使用 `<LoginPromptModal />`
4. ✅ 根据页面功能自定义 `title` 和 `description`

## 总结

- **问题**: `LoginPrompt` 名称冲突
- **解决**: Hook 返回组件命名为 `LoginPromptModal`
- **影响**: 所有使用该 Hook 的页面和文档
- **好处**: 避免命名冲突，代码更清晰
