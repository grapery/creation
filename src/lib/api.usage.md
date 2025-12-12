# API 客户端使用指南

## 概述
本项目已创建了完整的 API 客户端 `src/lib/api.ts`，包含了所有后端 API 的前端接口封装。

## 如何使用

### 1. 导入 API 模块
```typescript
// 导入整个 API 客户端
import apiClient from './api';

// 或导入特定模块
import { authApi, userApi, storyApi } from './api';
```

### 2. 在组件中使用
```typescript
import { useEffect, useState } from 'react';
import { userApi } from './lib/api';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getUserProfile(userId);
        setUser(response.data);
      } catch (error) {
        console.error('获取用户资料失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // 渲染用户资料...
}
```

### 3. 认证说明
API 客户端会自动将 localStorage 中的 `authToken` 附加到请求头中。登录成功后，需要将令牌保存到 localStorage：

```typescript
const response = await authApi.login({ email, password });
localStorage.setItem('authToken', response.data.token);
localStorage.setItem('refreshToken', response.data.refreshToken);
```

### 4. 错误处理
API 客户端已配置响应拦截器，统一处理 401 未授权错误。可以根据需要在组件中添加额外的错误处理：

```typescript
try {
  const response = await apiClient.get('/api/some/resource');
  // 处理成功响应
} catch (error) {
  if (error.response?.status === 404) {
    // 资源不存在处理
  } else if (error.response?.status === 500) {
    // 服务器错误处理
  } else {
    // 其他错误处理
  }
}
```

## 已实现的 API 模块

| 模块名         | 功能范围                     |
|---------------|------------------------------|
| **authApi**   | 认证相关 API                 |
| **userApi**   | 用户相关 API                 |
| **storyApi**  | 故事相关 API                 |
| **storyboardApi** | 故事板相关 API          |
| **characterApi** | 角色相关 API            |
| **commentApi** | 评论相关 API            |
| **tagApi**    | 标签相关 API                 |
| **groupApi**  | 群组相关 API                 |
| **searchApi** | 搜索相关 API                 |
| **chatApi**   | 聊天相关 API                 |
| **notificationApi** | 通知相关 API        |
| **uploadApi** | 文件上传相关 API             |
| **aiApi**     | AI 相关 API                  |
| **statsApi**  | 统计相关 API                 |
| **assetApi**  | 资产相关 API                 |
| **activityApi** | 活动相关 API          |

## 未实现的工作

### 1. 认证系统完善
- 实现令牌刷新机制
- 实现登出功能
- 添加自动重定向到登录页的逻辑

### 2. 页面修改
需要修改更多页面来使用 API 客户端替代 mock 数据：
- Profile.tsx
- EditProfile.tsx
- StoryEditor.tsx
- CharacterEditor.tsx
- 等等

### 3. 类型定义
为 API 响应添加 TypeScript 类型定义，提高代码类型安全性。

### 4. 错误处理
为不同 API 端点添加更具体的错误处理和用户提示。

## 后续开发建议

1. **优先修改核心页面**：先修改用户使用频率高的页面，如个人资料、故事列表等。

2. **使用 TypeScript 类型**：为 API 响应添加类型定义，提高代码可靠性。

3. **添加 loading 状态**：在 API 请求期间显示加载动画，提升用户体验。

4. **错误提示**：为 API 错误添加友好的用户提示，避免直接暴露技术错误信息。

5. **测试 API**：确保每个 API 端点都能正常工作，并处理边界情况。
