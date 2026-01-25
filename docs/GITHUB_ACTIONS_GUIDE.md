# GitHub Actions 配置指南 🚀

本文档说明如何配置 GitHub Actions 来管理 Google OAuth 的 Client ID 和其他敏感信息。

## 📋 概述

### 当前实现状态

✅ **前端 (creation)**:
- 使用 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 环境变量
- 在 `.env.local` 中配置（本地开发）
- 支持从 GitHub Actions Secrets 读取（生产环境）

✅ **后端 (grapery)**:
- 使用 `GOOGLE_CLIENT_ID` 环境变量
- 在 `.env` 中配置（本地开发）
- 支持从 GitHub Actions Secrets 读取（生产环境）
- 优先级: 环境变量 > 配置文件 > 硬编码默认值

### 代码实现验证

**后端代码** (`grapery/internal/transport/pay/google_oauth_handler.go:682`):
```go
func createGoogleOAuthConfig() *payservice.GoogleOAuthConfig {
    // 优先级：环境变量 > 配置文件 > 默认值
    clientID := os.Getenv("GOOGLE_CLIENT_ID")

    // 如果环境变量未设置，尝试从配置文件读取
    if clientID == "" {
        // ... 读取配置文件逻辑
    }

    // 如果仍未设置，使用默认值
    if clientID == "" {
        clientID = "345805164843-pbd5oc8emnu03l1i0sdn7r19pmk10ajf.apps.googleusercontent.com"
    }

    return &payservice.GoogleOAuthConfig{
        ClientID:       clientID,
        TimeoutSeconds: 30,
        CacheDuration:  1,
    }
}
```

**前端代码** (`lib/hooks/use-google-oauth.ts`):
```typescript
const { isLoaded, isLoading, signIn } = useGoogleOAuth({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  onSuccess: async (credentialResponse) => {
    await auth.loginWithGoogle({
      idToken: credentialResponse.credential,
    });
  },
});
```

## 🔧 GitHub Actions 配置步骤

### 1. 在 GitHub 仓库中配置 Secrets

1. 访问您的 GitHub 仓库
2. 进入 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret** 添加以下 secrets:

#### 前端所需 Secrets (creation 项目)

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `345805164843-pbd5oc8emnu03l1i0sdn7r19pmk10ajf.apps.googleusercontent.com` | Google OAuth Client ID |

#### 后端所需 Secrets (grapery 项目)

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `GOOGLE_CLIENT_ID` | `345805164843-pbd5oc8emnu03l1i0sdn7r19pmk10ajf.apps.googleusercontent.com` | Google OAuth Client ID |
| `DB_PASSWORD` | `您的数据库密码` | 数据库密码 |
| `REDIS_PASSWORD` | `您的Redis密码` | Redis 密码（如有） |

### 2. 创建 GitHub Actions Workflow 文件

#### 前端部署 Workflow (creation)

创建文件: `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
      - production
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.production
        run: |
          echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}" >> .env.production
          # 添加其他环境变量
          echo "NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}" >> .env.production

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}

      - name: Deploy to production
        # 这里根据您的部署方式配置（例如: Vercel, AWS, Docker等）
        run: |
          echo "Deploying to production..."
          # 示例: 部署到 Vercel
          # npm install -g vercel
          # vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

#### 后端部署 Workflow (grapery)

创建文件: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main
      - production
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.21'

      - name: Build application
        run: |
          go mod download
          go build -o bin/server ./cmd/server
        env:
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          REDIS_PASSWORD: ${{ secrets.REDIS_PASSWORD }}

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # 示例: 部署到服务器
          # scp -r bin/server user@server:/path/to/deploy
          # ssh user@server 'systemctl restart grapery'
        env:
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          REDIS_PASSWORD: ${{ secrets.REDIS_PASSWORD }}
```

### 3. Docker 部署配置 (可选)

如果您使用 Docker 部署，可以参考以下配置:

#### Dockerfile (前端)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

#### Dockerfile (后端)

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

RUN go build -o bin/server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/bin/server .

# 在运行时设置环境变量
ENV GOOGLE_CLIENT_ID=""
ENV DB_PASSWORD=""
ENV REDIS_PASSWORD=""

EXPOSE 8080

CMD ["./server"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./creation
      args:
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

  backend:
    build:
      context: ./grapery
      args:
        GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    ports:
      - "8080:8080"
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - DB_DATABASE=${DB_DATABASE}
      - DB_USERNAME=${DB_USERNAME}
      - DB_ADDRESS=${DB_ADDRESS}
```

### 4. GitHub Actions + Docker 部署示例

```yaml
name: Deploy with Docker

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build and deploy frontend
        run: |
          cd creation
          docker build -t myapp-frontend \
            --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }} \
            .
          docker tag myapp-frontend:latest registry.example.com/myapp-frontend:latest
          docker push registry.example.com/myapp-frontend:latest

      - name: Build and deploy backend
        run: |
          cd grapery
          docker build -t myapp-backend \
            --build-arg GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }} \
            .
          docker tag myapp-backend:latest registry.example.com/myapp-backend:latest
          docker push registry.example.com/myapp-backend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker-compose pull
            docker-compose up -d
            docker image prune -f
```

## 🧪 验证部署

### 前端验证

1. **检查环境变量**:
   ```bash
   # 在生产环境中
   curl https://your-frontend.com/api/env-check
   ```

2. **浏览器控制台检查**:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
   // 应该输出: 345805164843-pbd5oc8emnu03l1i0sdn7r19pmk10ajf.apps.googleusercontent.com
   ```

3. **登录页面测试**:
   - 访问 `https://your-frontend.com/login`
   - 点击 "Continue with Google"
   - 确认 Google OAuth 弹窗正常显示

### 后端验证

1. **检查环境变量**:
   ```bash
   # SSH 到服务器
   ssh user@server

   # 检查环境变量
   env | grep GOOGLE_CLIENT_ID
   # 应该输出: GOOGLE_CLIENT_ID=345805164843-pbd5oc8emnu03l1i0sdn7r19pmk10ajf.apps.googleusercontent.com
   ```

2. **API 端点测试**:
   ```bash
   curl https://your-backend.com/api/vippay/google-oauth/status
   # 应该返回: {"code":0,"data":{"enabled":true}}
   ```

3. **服务日志检查**:
   ```bash
   # 查看应用日志
   journalctl -u grapery -f

   # 应该看到:
   # [INFO] Google OAuth configured successfully
   ```

## 📊 环境变量优先级总结

### 前端 (Next.js)

1. **生产环境**: GitHub Actions Secrets → Docker/Kubernetes 环境变量 → `.env.production`
2. **开发环境**: `.env.local` → `.env.development` → `.env`
3. **构建时**: GitHub Actions Secrets 会被注入到构建产物中

### 后端 (Go)

1. **运行时环境变量**: GitHub Actions Secrets → 系统环境变量 → `os.Getenv()`
2. **配置文件**: `vippay.json` (如果没有环境变量)
3. **硬编码默认值**: 最后的备选方案

**当前实现优先级** (grapery/internal/transport/pay/google_oauth_handler.go:680-717):
```
环境变量 (GOOGLE_CLIENT_ID)
  ↓ (如果未设置)
配置文件 (vippay.json)
  ↓ (如果未设置)
硬编码默认值
```

## 🔒 安全最佳实践

1. **永远不要**将 `.env.local` 或 `.env` 文件提交到 Git
2. **使用不同的** Client ID 用于开发、测试和生产环境
3. **定期轮换** secrets
4. **使用 GitHub Environments** 来管理不同环境的 secrets
5. **启用 GitHub Actions 的日志保护**，避免敏感信息泄露

### GitHub Environments 配置

1. 在 GitHub 仓库中创建多个环境: `development`, `staging`, `production`
2. 为每个环境配置不同的 secrets
3. 在 workflow 中指定环境:

```yaml
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production  # 使用 production 环境的 secrets
    steps:
      # ... 部署步骤
```

## 🚨 常见问题

### 问题 1: 前端构建时环境变量为空

**原因**: Next.js 只允许以 `NEXT_PUBLIC_` 开头的环境变量在客户端访问

**解决方案**:
```yaml
# 在 GitHub Actions 中
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}
```

### 问题 2: 后端无法读取环境变量

**原因**: 环境变量未在运行时设置

**解决方案**:
- Docker: 使用 `ENV` 指令或在 `docker run` 时使用 `-e`
- Systemd: 在 service 文件中添加 `Environment=`
- Kubernetes: 使用 ConfigMap 或 Secret

### 问题 3: GitHub Actions Secrets 不生效

**检查清单**:
- [ ] Secret 名称完全匹配（区分大小写）
- [ ] Secret 值没有多余的空格或换行
- [ ] Workflow 文件正确引用 secret
- [ ] Workflow 有权限访问 secret

## ✅ 总结

当前实现已经完全支持 GitHub Actions Secrets:

- ✅ **后端**: 优先从环境变量 `GOOGLE_CLIENT_ID` 读取
- ✅ **前端**: 从 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 读取
- ✅ **无需代码修改**: 现有代码已正确实现
- ✅ **只需配置**: 在 GitHub Actions 中添加 secrets 并配置 workflow

您的代码已经准备好使用 GitHub Actions 部署了！🎉
