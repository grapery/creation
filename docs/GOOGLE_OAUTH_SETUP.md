# Google OAuth Setup Guide

本指南将帮助您在 Voyager 应用中设置 Google 登录功能。

## 前置要求

1. 一个 Google Cloud 项目
2. Google Cloud Console 访问权限

## 步骤 1: 创建 Google OAuth 2.0 凭证

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择或创建一个项目
3. 导航到 **APIs & Services** > **Credentials**
4. 点击 **Create Credentials** > **OAuth 2.0 Client ID**
5. 如果提示，请配置 OAuth 同意屏幕
6. 选择应用类型：**Web application**
7. 配置授权的重定向 URI：

```
http://localhost:3000
```

8. 记下 **Client ID**（您将在下一步中用到）

## 步骤 2: 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 复制以下配置：

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-google-client-id-here
```

3. 将 `your-actual-google-client-id-here` 替换为步骤 1 中获得的 Client ID

## 步骤 3: 验证设置

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000/login
3. 点击 "Continue with Google" 按钮
4. 完成 Google 登录流程

## 实现细节

### 前端流程

1. **加载 Google Identity Services SDK**
   - 文件位置：`/lib/hooks/use-google-oauth.ts`
   - 动态加载 Google 的 OAuth 脚本

2. **用户点击 Google 登录按钮**
   - 文件位置：`/app/(auth)/login/page.tsx`
   - 调用 `googleSignIn()` 函数

3. **Google OAuth 弹窗**
   - 用户选择 Google 账户
   - 授予应用权限

4. **接收凭证**
   - Google 返回 ID token
   - 前端发送到后端 API

5. **后端验证**
   - API 端点：`POST /api/vippay/google-oauth/signin`
   - 后端验证 Google ID token 并创建/更新用户会话

6. **登录成功**
   - 保存 access token 和 refresh token
   - 重定向到首页

### 关键文件

- `/lib/hooks/use-google-oauth.ts` - Google OAuth 自定义钩子
- `/lib/api/auth.ts` - 认证 API 客户端（包含 `loginWithGoogle`）
- `/app/(auth)/login/page.tsx` - 登录页面 UI
- `/grapery/internal/transport/pay/google_oauth_handler.go` - 后端 Google OAuth 处理器
- `/grapery/cmd/vippay/main.go` - 后端路由注册

## 生产环境配置

对于生产环境，您需要：

1. 在 Google Cloud Console 中添加生产域名：
```
https://yourdomain.com
```

2. 更新生产环境的环境变量

3. 确保 HTTPS 已配置（Google OAuth 的要求）

## 故障排除

### 问题：Google 按钮显示 "Google OAuth not ready"

**解决方案**：
- 检查 `.env.local` 文件是否存在
- 验证 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 是否正确设置
- 重启开发服务器

### 问题：CORS 错误

**解决方案**：
- 在 Google Cloud Console 中验证已添加正确的授权域名
- 确保使用 HTTPS（生产环境）

### 问题：后端 API 返回 401

**解决方案**：
- 验证后端 `/api/vippay/google-oauth/signin` 端点可访问
- 检查后端是否正确配置了 `GOOGLE_CLIENT_ID` 环境变量
- 确保发送的是 `idToken`（Google ID token），不是 access token

## 安全最佳实践

1. **永远不要提交 `.env.local` 文件到版本控制**
   - 已添加到 `.gitignore`

2. **使用环境特定的 Client ID**
   - 开发环境使用一个 Client ID
   - 生产环境使用另一个 Client ID

3. **验证后端的 ID token**
   - 不要盲目接受来自前端的 token
   - 使用 Google 的 token verification endpoint

4. **限制 token 范围**
   - 只请求必要的权限（`openid email profile`）

## 下一步

- [ ] 实现 Apple Sign In
- [ ] 实现微信登录
- [ ] 添加 OAuth 账号关联功能

## 相关资源

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 for Mobile & Web Apps](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
