# API Integration Guide

本文档说明前端项目如何与三个后端服务进行集成。

## 后端服务架构

### 1. Server Service (主 API 服务)
- **端口**: 8080 (开发环境)
- **路径**: `/api/*`
- **功能**: 
  - 用户认证和管理
  - 故事、故事板、角色管理
  - 群组、搜索、通知
  - 评论、标签等

### 2. ChatMCP Service (聊天服务)
- **端口**: 8080 (开发环境，与 server 共享)
- **路径**: `/api/agent/chat/*` 和 `/api/agent/storyboard-chat/*`
- **功能**:
  - Agent 聊天 (角色对话)
  - Storyboard 聊天 (故事板创建对话)
  - SSE 实时消息推送

### 3. VipPay Service (支付服务)
- **端口**: 8081 (开发环境)
- **路径**: `/api/vippay/*`
- **功能**:
  - Apple/Google OAuth 登录
  - VIP 会员管理
  - IAP (应用内购买)

## 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# 主 API 服务 (server)
VITE_API_BASE_URL=/api

# 聊天服务 (chatmcp) - 可选，默认使用主服务
VITE_CHAT_API_BASE_URL=/api

# VIP 支付服务 (vippay) - 可选
VITE_VIPPAY_API_BASE_URL=http://localhost:8081
```

### 开发环境
- 使用 Vite 代理，所有 `/api` 请求会被代理到 `http://localhost:8080`
- VipPay 服务需要单独配置代理或使用完整 URL

### 生产环境
- 设置完整的基础 URL，例如：
  ```env
  VITE_API_BASE_URL=https://api.example.com
  VITE_CHAT_API_BASE_URL=https://chat.example.com
  VITE_VIPPAY_API_BASE_URL=https://pay.example.com
  ```

## 状态管理 (Zustand Stores)

### AuthStore (`stores/authStore.ts`)
管理用户认证状态：
```typescript
const { user, isAuthenticated, login, logout, getCurrentUser } = useAuthStore();
```

### StoryStore (`stores/storyStore.ts`)
管理故事数据：
```typescript
const { stories, currentStory, fetchStories, createStory } = useStoryStore();
```

### StoryboardStore (`stores/storyboardStore.ts`)
管理故事板数据：
```typescript
const { storyboards, feed, currentStoryboard, fetchFeed, createStoryboard } = useStoryboardStore();
```

### CharacterStore (`stores/characterStore.ts`)
管理角色数据：
```typescript
const { characters, currentCharacter, fetchCharacters, createCharacter } = useCharacterStore();
```

### ChatStore (`stores/chatStore.ts`)
管理聊天数据：
```typescript
const { threads, messages, fetchThreads, sendMessage } = useChatStore();
```

### UIStore (`stores/uiStore.ts`)
管理 UI 状态：
```typescript
const { activeTab, setActiveTab, theme, setTheme } = useUIStore();
```

## API 调用示例

### 认证
```typescript
import { authApi } from '../lib/api';

// 登录
await authApi.login({ email, password });

// 注册
await authApi.register({ email, password, username, displayName });

// 获取当前用户
await authApi.getCurrentUser();
```

### Agent 聊天
```typescript
import { agentChatApi } from '../lib/api';

// 发送消息
await agentChatApi.sendMessage({
  characterId: 'char-123',
  content: 'Hello!',
  threadId: 'thread-456'
});

// 获取聊天历史
await agentChatApi.getChatHistory(threadId, 50, 0);

// 获取线程列表
await agentChatApi.listChatThreads();
```

### Storyboard 聊天
```typescript
import { storyboardChatApi } from '../lib/api';

// 开始会话
await storyboardChatApi.startSession({ storyId: 'story-123' });

// 发送消息
await storyboardChatApi.sendMessage(sessionId, {
  content: 'Create a new scene'
});
```

## SSE 实时更新

### 聊天 SSE
```typescript
import { useChatSSE } from '../hooks/useSSE';

function ChatComponent({ threadId }: { threadId: string }) {
  useChatSSE(threadId, (message) => {
    // 处理实时消息
    console.log('New message:', message);
  });
}
```

### 通知 SSE
```typescript
import { useNotificationSSE } from '../hooks/useSSE';

useNotificationSSE((message) => {
  // 处理实时通知
  console.log('New notification:', message);
});
```

## 已更新的页面

✅ **Dashboard** - 使用真实 API 加载数据
✅ **Login** - 集成真实登录和 OAuth
✅ **ChatList** - 使用真实 API 加载聊天线程
✅ **ChatConversation** - 使用真实 API 发送/接收消息，支持 SSE
✅ **StoryboardEditor** - 使用真实 API 创建故事板
✅ **StoryboardViewer** - 使用真实 API 加载和显示故事板
✅ **Profile** - 使用真实 API 加载用户资料

## 待更新的页面

以下页面仍使用 mock 数据，可以按需更新：
- StoryEditor
- StoryViewer
- StoryDetail
- CharacterEditor
- CharacterProfile
- Groups
- GroupDetail
- EditProfile
- FollowersList
- FollowingList
- 其他设置页面

## 错误处理

所有 API 调用都包含错误处理：
- 401 未授权错误会自动清除 token 并跳转到登录页
- 错误信息通过 `toast` 显示给用户
- Store 中保存错误状态供组件使用

## 认证 Token

- Token 存储在 `localStorage` 中，key 为 `authToken`
- 所有 API 请求自动在 header 中添加 `Authorization: Bearer {token}`
- Token 过期或无效时会自动清除并跳转到登录页

## 注意事项

1. **CORS**: 开发环境使用 Vite 代理避免 CORS 问题
2. **SSE**: EventSource 不支持自定义 header，token 通过 URL 参数传递
3. **错误处理**: 所有 API 调用都应该有 try-catch 错误处理
4. **加载状态**: 使用 store 中的 `isLoading` 状态显示加载指示器
5. **数据格式**: 后端返回的数据格式可能不同，代码中已处理多种格式

