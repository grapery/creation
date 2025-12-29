import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl } from './apiBase';

// 创建多个API实例以支持不同的后端服务
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000, // 增加超时时间以支持流式响应
  });

  // 请求拦截器 - 添加认证令牌
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器 - 处理错误
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('未授权访问，请重新登录');
        localStorage.removeItem('authToken');
        // 可以在这里添加跳转到登录页的逻辑
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// 主API服务 (server)
const apiClient = createApiClient(getApiBaseUrl('server'));

// 聊天服务 (chatmcp)
const chatApiClient = createApiClient(getApiBaseUrl('chat'));

// VIP支付服务 (vippay)
const vippayApiClient = createApiClient(getApiBaseUrl('vippay'));

// 请求拦截器 - 添加认证令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未认证错误，如跳转到登录页
      console.error('未授权访问，请重新登录');
      // 可以在这里添加跳转到登录页的逻辑
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 注册
  register: (data: any) => apiClient.post('/auth/register', data),
  // 登录
  login: (data: any) => apiClient.post('/auth/login', data),
  // 请求重置密码
  requestPasswordReset: (data: any) => apiClient.post('/auth/password/request-reset', data),
  // 重置密码
  resetPassword: (data: any) => apiClient.post('/auth/password/reset', data),
  // 刷新令牌
  refreshToken: (data: any) => apiClient.post('/auth/refresh', data),
  // 获取当前用户信息
  getCurrentUser: () => apiClient.get('/auth/me'),
  // 更改密码
  changePassword: (data: any) => apiClient.post('/auth/password/change', data),
};

// 用户相关API
export const userApi = {
  // 获取用户资料
  getUserProfile: (id: string) => apiClient.get(`/users/${id}`),
  // 更新用户资料
  updateUserProfile: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  // 更新用户头像
  updateUserAvatar: (id: string, data: FormData) => apiClient.put(`/users/${id}/avatar`, data),
  // 更新用户背景
  updateUserBackground: (id: string, data: FormData) => apiClient.put(`/users/${id}/background`, data),
  // 关注用户
  followUser: (id: string) => apiClient.post(`/users/${id}/follow`),
  // 取消关注用户
  unfollowUser: (id: string) => apiClient.delete(`/users/${id}/follow`),
  // 获取关注者列表
  getFollowers: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/followers`, { params: { page, limit } }),
  // 获取关注列表
  getFollowing: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/following`, { params: { page, limit } }),
  // 获取用户统计信息
  getUserStats: (id: string) => apiClient.get(`/users/${id}/stats`),
  // 获取用户故事
  getUserStories: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/stories`, { params: { page, limit } }),
  // 获取用户角色
  getUserCharacters: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/characters`, { params: { page, limit } }),
  // 获取用户喜欢的故事
  getLikedStories: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/liked-stories`, { params: { page, limit } }),
  // 获取用户喜欢的角色
  getLikedCharacters: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/liked-characters`, { params: { page, limit } }),
  // 获取用户喜欢的故事板
  getLikedStoryboards: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/liked-storyboards`, { params: { page, limit } }),
  // 获取用户活动
  getUserActivityList: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/users/${id}/activities`, { params: { page, limit } }),
};

// 故事相关API
export const storyApi = {
  // 创建故事
  createStory: (data: any) => apiClient.post('/stories', data),
  // 更新故事
  updateStory: (id: string, data: any) => apiClient.put(`/stories/${id}`, data),
  // 删除故事
  deleteStory: (id: string) => apiClient.delete(`/stories/${id}`),
  // 获取故事列表
  listStories: (page: number = 1, limit: number = 20) => apiClient.get('/stories', { params: { page, limit } }),
  // 获取故事详情
  getStory: (id: string) => apiClient.get(`/stories/${id}`),
  // 喜欢故事
  likeStory: (id: string) => apiClient.post(`/stories/${id}/like`),
  // 取消喜欢故事
  unlikeStory: (id: string) => apiClient.delete(`/stories/${id}/like`),
  // 关注故事
  followStory: (id: string) => apiClient.post(`/stories/${id}/follow`),
  // 取消关注故事
  unfollowStory: (id: string) => apiClient.delete(`/stories/${id}/follow`),
  // 获取故事标签
  getStoryTags: (id: string) => apiClient.get(`/stories/${id}/tags`),
  // 获取故事统计
  getStoryStats: (id: string) => apiClient.get(`/stories/${id}/stats`),
  // 渲染故事
  renderStory: (id: string, data: any) => apiClient.post(`/stories/${id}/render`, data),
  // 获取渲染任务状态
  getRenderTaskStatus: (id: string) => apiClient.get(`/stories/${id}/render-status`),
  // 发布故事
  publishStory: (id: string) => apiClient.post(`/stories/${id}/publish`),
  // 取消发布故事
  unpublishStory: (id: string) => apiClient.post(`/stories/${id}/unpublish`),
};

// 故事板相关API
export interface StoryboardCharacterRefPayload {
  storyCharacterId: string;
  role?: string;
  order?: number;
  notes?: string;
}

export interface StoryboardSceneRefPayload {
  storySceneId: string;
  sequence?: number;
  isPrimaryScene?: boolean;
}

export interface CreateStoryboardPayload {
  storyId: string;
  parentId?: string | null;
  title: string;
  rawInput: string;
  content?: string;
  scenes?: Array<{
    id?: string;
    title: string;
    description?: string;
    image?: string;
    location?: string;
    timeOfDay?: string;
  }>;
  sceneRefs?: StoryboardSceneRefPayload[];
  characterRefs?: StoryboardCharacterRefPayload[];
}

export interface UpdateStoryboardPayload {
  title?: string;
  content?: string;
  rawInput?: string;
  scenes?: CreateStoryboardPayload['scenes'];
  sceneRefs?: StoryboardSceneRefPayload[];
  characterRefs?: StoryboardCharacterRefPayload[];
}

export const storyboardApi = {
  // 创建故事板
  createStoryboard: (data: CreateStoryboardPayload) => apiClient.post('/storyboards', data),
  // 更新故事板
  updateStoryboard: (id: string, data: UpdateStoryboardPayload) => apiClient.put(`/storyboards/${id}`, data),
  // 删除故事板
  deleteStoryboard: (id: string) => apiClient.delete(`/storyboards/${id}`),
  // 获取故事板列表
  listStoryboards: (page: number = 1, limit: number = 20) => apiClient.get('/storyboards', { params: { page, limit } }),
  // 获取故事板详情
  getStoryboard: (id: string) => apiClient.get(`/storyboards/${id}`),
  // 获取故事板子节点
  getStoryboardChildren: (id: string) => apiClient.get(`/storyboards/${id}/children`),
  // 获取故事板树
  getStoryboardTree: (id: string) => apiClient.get(`/storyboards/${id}/tree`),
  // Fork故事板
  forkStoryboard: (id: string, data: Partial<CreateStoryboardPayload> = {}) =>
    apiClient.post(`/storyboards/${id}/fork`, data),
  // 喜欢故事板
  likeStoryboard: (id: string) => apiClient.post(`/storyboards/${id}/like`),
  // 取消喜欢故事板
  unlikeStoryboard: (id: string) => apiClient.delete(`/storyboards/${id}/like`),
};

// 角色相关API
export const characterApi = {
  // 创建角色
  createCharacter: (data: any) => apiClient.post('/characters', data),
  // 更新角色
  updateCharacter: (id: string, data: any) => apiClient.put(`/characters/${id}`, data),
  // 删除角色
  deleteCharacter: (id: string) => apiClient.delete(`/characters/${id}`),
  // 获取角色列表
  listCharacters: (page: number = 1, limit: number = 20) => apiClient.get('/characters', { params: { page, limit } }),
  // 获取角色详情
  getCharacter: (id: string) => apiClient.get(`/characters/${id}`),
  // 关注角色
  followCharacter: (id: string) => apiClient.post(`/characters/${id}/follow`),
  // 取消关注角色
  unfollowCharacter: (id: string) => apiClient.delete(`/characters/${id}/follow`),
  // 获取角色分析
  getCharacterAnalytics: (id: string) => apiClient.get(`/characters/${id}/analytics`),
  // 获取角色海报
  getCharacterPosters: (id: string) => apiClient.get(`/characters/${id}/posters`),
  // 创建角色海报
  createCharacterPoster: (id: string, data: any) => apiClient.post(`/characters/${id}/posters`, data),
  // 喜欢角色海报
  likeCharacterPoster: (id: string) => apiClient.post(`/posters/${id}/like`),
  // 分享角色海报
  shareCharacterPoster: (id: string) => apiClient.post(`/posters/${id}/share`),
  // 删除角色海报
  deleteCharacterPoster: (id: string) => apiClient.delete(`/posters/${id}`),
  // 添加角色技能
  addCharacterSkill: (id: string, data: any) => apiClient.post(`/characters/${id}/skills`, data),
  // 移除角色技能
  removeCharacterSkill: (id: string, skill: string) => apiClient.delete(`/characters/${id}/skills/${skill}`),
};

// 评论相关API
export const commentApi = {
  // 创建评论
  createComment: (data: any) => apiClient.post('/comments', data),
  // 更新评论
  updateComment: (id: string, data: any) => apiClient.put(`/comments/${id}`, data),
  // 删除评论
  deleteComment: (id: string) => apiClient.delete(`/comments/${id}`),
  // 获取评论列表
  listComments: (params: any) => apiClient.get('/comments', { params }),
  // 获取评论详情
  getComment: (id: string) => apiClient.get(`/comments/${id}`),
  // 获取评论回复
  getCommentReplies: (id: string) => apiClient.get(`/comments/${id}/replies`),
  // 获取评论树
  getCommentTree: (id: string) => apiClient.get(`/comments/${id}/tree`),
  // 喜欢评论
  likeComment: (id: string) => apiClient.post(`/comments/${id}/like`),
  // 不喜欢评论
  dislikeComment: (id: string) => apiClient.post(`/comments/${id}/dislike`),
  // 取消喜欢评论
  unlikeComment: (id: string) => apiClient.delete(`/comments/${id}/like`),
};

// 标签相关API
export const tagApi = {
  // 获取流行标签
  getPopularTags: () => apiClient.get('/tags/popular'),
  // 获取标签相关故事
  getStoriesByTag: (id: string, page: number = 1, limit: number = 20) => apiClient.get(`/tags/${id}/stories`, { params: { page, limit } }),
  // 添加故事标签
  addStoryTags: (id: string, data: any) => apiClient.post(`/stories/${id}/tags`, data),
};

// 群组相关API
export const groupApi = {
  // 创建群组
  createGroup: (data: any) => apiClient.post('/groups', data),
  // 更新群组
  updateGroup: (id: string, data: any) => apiClient.put(`/groups/${id}`, data),
  // 删除群组
  deleteGroup: (id: string) => apiClient.delete(`/groups/${id}`),
  // 获取群组列表
  listGroups: (page: number = 1, limit: number = 20) => apiClient.get('/groups', { params: { page, limit } }),
  // 获取群组详情
  getGroup: (id: string) => apiClient.get(`/groups/${id}`),
  // 邀请成员
  inviteMember: (id: string, data: any) => apiClient.post(`/groups/${id}/invite`, data),
  // 移除成员
  removeMember: (id: string, userId: string) => apiClient.delete(`/groups/${id}/members/${userId}`),
  // 更新成员角色
  updateMemberRole: (id: string, userId: string, data: any) => apiClient.post(`/groups/${id}/members/${userId}/role`, data),
  // 离开群组
  leaveGroup: (id: string) => apiClient.post(`/groups/${id}/leave`),
  // 获取群组成员
  getGroupMembers: (id: string) => apiClient.get(`/groups/${id}/members`),
  // 获取群组活动
  getGroupActivities: (id: string) => apiClient.get(`/groups/${id}/activities`),
};

// 搜索相关API
export const searchApi = {
  // 搜索
  search: (query: string, type: string = 'all', page: number = 1, limit: number = 20) =>
    apiClient.get('/search', { params: { q: query, type, page, limit } }),
};

// 聊天相关API
export const chatApi = {
  // 获取聊天线程列表
  listChatThreads: () => apiClient.get('/chats'),
  // 获取未读聊天数量
  getUnreadChatCount: () => apiClient.get('/chats/unread/count'),
  // 获取聊天线程
  getChatThread: (id: string) => apiClient.get(`/chats/${id}`),
  // 创建聊天线程
  createChatThread: (data: any) => apiClient.post('/chats', data),
  // 删除聊天线程
  deleteChatThread: (id: string) => apiClient.delete(`/chats/${id}`),
  // 标记聊天线程为已读
  markChatThreadAsRead: (id: string) => apiClient.post(`/chats/${id}/read`),
  // 获取聊天消息
  listChatMessages: (id: string) => apiClient.get(`/chats/${id}/messages`),
  // 发送聊天消息
  sendChatMessage: (id: string, data: any) => apiClient.post(`/chats/${id}/messages`, data),
  // 删除聊天消息
  deleteChatMessage: (id: string, messageId: string) => apiClient.delete(`/chats/${id}/messages/${messageId}`),
};

// 通知相关API
export const notificationApi = {
  // 获取通知列表
  listNotifications: () => apiClient.get('/notifications'),
  // 获取未读通知数量
  getUnreadCount: () => apiClient.get('/notifications/unread/count'),
  // 标记通知为已读
  markAsRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
  // 标记所有通知为已读
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
  // 删除通知
  deleteNotification: (id: string) => apiClient.delete(`/notifications/${id}`),
};

// 文件上传相关API
export const uploadApi = {
  // 上传图片
  uploadImage: (data: FormData) => apiClient.post('/upload/image', data),
  // 上传头像
  uploadAvatar: (data: FormData) => apiClient.post('/upload/avatar', data),
  // 上传封面
  uploadCover: (data: FormData) => apiClient.post('/upload/cover', data),
  // 批量上传
  uploadMultiple: (data: FormData) => apiClient.post('/upload/multiple', data),
  // 删除上传文件
  deleteUpload: (data: any) => apiClient.delete('/upload', data),
};

// AI相关API
export const aiApi = {
  // 生成故事
  generateStory: (data: any) => apiClient.post('/ai/generate-story', data),
  // 增强提示词
  enhancePrompt: (data: any) => apiClient.post('/ai/enhance-prompt', data),
  // 生成图片
  generateImage: (data: any) => apiClient.post('/ai/generate-image', data),
  // 生成视频
  generateVideo: (data: any) => apiClient.post('/ai/generate-video', data),
  // 获取任务状态
  getTaskStatus: (id: string) => apiClient.get(`/ai/tasks/${id}`),
  // 获取任务结果
  getTaskResult: (id: string) => apiClient.get(`/ai/tasks/${id}/result`),
  // 取消任务
  cancelTask: (id: string) => apiClient.delete(`/ai/tasks/${id}`),
};

// 统计相关API
export const statsApi = {
  // 获取仪表盘统计
  getDashboardStats: () => apiClient.get('/dashboard/stats'),
  // 获取用户活动
  getActivities: () => apiClient.get('/activities'),
  // 获取用户统计
  getUserStats: (id: string) => apiClient.get(`/users/${id}/stats`),
};

// 资产相关API
export const assetApi = {
  // 获取资产列表
  listAssets: () => apiClient.get('/assets'),
  // 获取资产详情
  getAsset: (id: string) => apiClient.get(`/assets/${id}`),
  // 创建资产
  createAsset: (data: any) => apiClient.post('/assets', data),
  // 更新资产
  updateAsset: (id: string, data: any) => apiClient.put(`/assets/${id}`, data),
  // 删除资产
  deleteAsset: (id: string) => apiClient.delete(`/assets/${id}`),
};

// 活动相关API
export const activityApi = {
  // 获取全球活动
  getGlobalActivities: () => apiClient.get('/activities/global'),
};

// Agent Chat API (使用 chatmcp 服务)
export const agentChatApi = {
  // 发送消息
  sendMessage: (data: {
    characterId: string;
    content: string;
    threadId?: string;
    image?: string;
    storyboardBranchId?: string;
  }) => chatApiClient.post('/agent/chat/send', data),
  
  // 流式发送消息
  sendMessageStream: (data: {
    characterId: string;
    content: string;
    threadId?: string;
    image?: string;
    storyboardBranchId?: string;
  }) => chatApiClient.post('/agent/chat/send-stream', data, {
    responseType: 'stream',
  }),
  
  // 获取聊天历史
  getChatHistory: (threadId: string, limit: number = 50, offset: number = 0) =>
    chatApiClient.get(`/agent/chat/history/${threadId}`, { params: { limit, offset } }),
  
  // 获取聊天线程列表
  listChatThreads: () => chatApiClient.get('/agent/chat/threads'),
  
  // 创建聊天线程
  createChatThread: (data: { characterId: string }) =>
    chatApiClient.post('/agent/chat/threads', data),
  
  // 获取故事板分支
  getStoryboardBranches: (threadId: string) =>
    chatApiClient.get(`/agent/chat/threads/${threadId}/storyboard-branches`),
  
  // 选择故事板分支
  selectStoryboardBranch: (threadId: string, data: { storyboardBranchId: string; characterId: string }) =>
    chatApiClient.post(`/agent/chat/threads/${threadId}/select-branch`, data),
  
  // 加载更多消息
  loadMoreMessages: (threadId: string, beforeMessageId: string, limit: number = 20) =>
    chatApiClient.get(`/agent/chat/threads/${threadId}/messages`, {
      params: { before: beforeMessageId, limit },
    }),
  
  // 获取线程统计
  getThreadStats: (threadId: string) =>
    chatApiClient.get(`/agent/chat/threads/${threadId}/stats`),
  
  // 归档线程
  archiveThread: (threadId: string) =>
    chatApiClient.post(`/agent/chat/threads/${threadId}/archive`),
  
  // 消息反应
  reactToMessage: (messageId: string, data: { reactionType: string; emojiCode?: string }) =>
    chatApiClient.post(`/agent/chat/messages/${messageId}/react`, data),
  
  // 归档消息
  archiveMessage: (messageId: string) =>
    chatApiClient.post(`/agent/chat/messages/${messageId}/archive`),
};

// Storyboard Chat API (使用 chatmcp 服务)
export const storyboardChatApi = {
  // 开始会话
  startSession: (data: { storyId: string }) =>
    chatApiClient.post('/agent/storyboard-chat/start', data),
  
  // 获取会话列表
  listSessions: () => chatApiClient.get('/agent/storyboard-chat/sessions'),
  
  // 获取会话详情
  getSession: (sessionId: string) =>
    chatApiClient.get(`/agent/storyboard-chat/sessions/${sessionId}`),
  
  // 获取消息列表
  getMessages: (sessionId: string) =>
    chatApiClient.get(`/agent/storyboard-chat/sessions/${sessionId}/messages`),
  
  // 发送消息
  sendMessage: (sessionId: string, data: { actionId?: string; content?: string; data?: any }) =>
    chatApiClient.post(`/agent/storyboard-chat/sessions/${sessionId}/send`, data),
  
  // 获取会话状态
  getStatus: (sessionId: string) =>
    chatApiClient.get(`/agent/storyboard-chat/sessions/${sessionId}/status`),
};

// VIP Pay API (使用 vippay 服务)
export const vippayApi = {
  // 健康检查
  health: () => vippayApiClient.get('/health'),
  
  // 版权信息
  getCopyright: () => vippayApiClient.get('/copyright'),
  
  // Apple OAuth
  appleOAuth: {
    signin: (data: { redirect?: string }) => vippayApiClient.post('/apple-oauth/signin', data),
    getStatus: () => vippayApiClient.get('/apple-oauth/status'),
    getConfig: () => vippayApiClient.get('/apple-oauth/config'),
  },
  
  // Google OAuth
  googleOAuth: {
    signin: (data: { redirect?: string }) => vippayApiClient.post('/google-oauth/signin', data),
    getStatus: () => vippayApiClient.get('/google-oauth/status'),
    getConfig: () => vippayApiClient.get('/google-oauth/config'),
  },
  
  // VIP 信息
  vip: {
    getInfo: () => vippayApiClient.get('/vip/info'),
    check: () => vippayApiClient.get('/vip/check'),
    getQuota: () => vippayApiClient.get('/vip/quota'),
    getMaxRoles: () => vippayApiClient.get('/vip/max-roles'),
    getMaxContexts: () => vippayApiClient.get('/vip/max-contexts'),
  },
  
  // IAP
  iap: {
    getProducts: () => vippayApiClient.get('/iap/products'),
    getProductDetail: (id: string) => vippayApiClient.get(`/iap/products/${id}`),
    verifyAppleReceipt: (data: any) => vippayApiClient.post('/iap/apple/verify', data),
    verifyGooglePurchase: (data: any) => vippayApiClient.post('/iap/google/verify', data),
  },
};

export default apiClient;
export { chatApiClient, vippayApiClient };
