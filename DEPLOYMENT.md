# Creation Frontend Deployment Guide

## 概述

Creation 是 未择 Voyager 平台的前端应用，基于 Next.js 16 构建。本文档说明如何部署和配置前端服务。

## 架构

- **前端服务**: Creation (Next.js) - 运行在 3000 端口
- **反向代理**: Nginx (ngx) - 运行在 80/443 端口，代理到 Creation 服务
- **后端 API**: 通过 Next.js rewrites 代理到后端服务

## Docker 部署

### 构建镜像

```bash
cd creation
docker build -t voyager-creation:latest .
```

### 运行容器

```bash
docker run -d \
  --name creation \
  --network voyager-network \
  -p 3000:3000 \
  voyager-creation:latest
```

## GitHub Actions 自动部署

项目配置了 GitHub Actions 工作流，支持自动构建和部署：

- **开发环境**: `develop` 分支推送到 `dev` 环境
- **生产环境**: `main` 分支推送到 `prod` 环境
- **手动触发**: 通过 GitHub Actions UI 手动触发部署

### 环境变量

需要在 GitHub Repository Variables 中配置：

- `ACR_REGISTRY`: 阿里云容器镜像仓库地址
- `ACR_USERNAME`: ACR 用户名
- `ACR_PASSWORD`: ACR 密码
- `DEV_DEPLOY_HOST`: 开发环境服务器地址
- `PROD_DEPLOY_HOST`: 生产环境服务器地址
- `SSH_USER`: SSH 用户名
- `SSH_KEY`: SSH 私钥

## Nginx 配置

Nginx 配置位于 `ngx/conf/default.conf`，主要配置：

1. **前端代理**: `/` 路径代理到 `creation:3000`
2. **API 代理**: `/api/*` 路径代理到相应的后端服务
3. **错误页面**: 保留在 nginx 中，用于代理失败时的降级处理

## 健康检查

前端服务提供健康检查端点：

- **路径**: `/api/health`
- **方法**: GET
- **响应**: `{ "status": "healthy", "timestamp": "..." }`

## 错误处理

- **Next.js 错误**: 由 Next.js 应用处理（404, 500 等）
- **代理错误**: 由 Nginx 错误页面处理（502, 503, 504 等）

## 注意事项

1. **Standalone 模式**: Next.js 配置为 `standalone` 输出模式，适合 Docker 部署
2. **网络配置**: 确保容器加入 `voyager-network` 网络，以便与其他服务通信
3. **环境变量**: 生产环境需要配置必要的环境变量
4. **静态资源**: Next.js 会自动处理静态资源，无需额外配置

## 故障排查

### 容器无法启动

1. 检查日志: `docker logs creation`
2. 检查端口占用: `netstat -tulpn | grep 3000`
3. 检查网络: `docker network inspect voyager-network`

### 代理失败

1. 检查 Creation 服务是否运行: `docker ps | grep creation`
2. 检查健康检查: `curl http://localhost:3000/api/health`
3. 检查 Nginx 配置: `docker exec ngx nginx -t`

### 页面无法访问

1. 检查 Nginx 日志: `docker logs ngx`
2. 检查 Creation 日志: `docker logs creation`
3. 检查防火墙规则
