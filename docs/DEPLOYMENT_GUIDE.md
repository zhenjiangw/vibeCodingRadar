# Vibe Coding 雷达 - 部署指南

## 目录

1. [环境要求](#环境要求)
2. [开发环境部署](#开发环境部署)
3. [生产环境部署](#生产环境部署)
4. [环境变量配置](#环境变量配置)
5. [数据库管理](#数据库管理)
6. [日志管理](#日志管理)
7. [常见问题排查](#常见问题排查)

## 环境要求

### 基础依赖
- Docker 20.0+
- Docker Compose 2.0+
- Git

### 硬件要求
- CPU：至少2核
- 内存：至少4GB
- 磁盘：至少10GB可用空间

## 开发环境部署

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/vibeLidar.git
cd vibeLidar
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置。

### 3. 启动服务

```bash
docker-compose up -d
```

### 4. 初始化数据库

```bash
docker exec -it vibelidar-backend python -m app.init_db
```

### 5. 访问应用

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端API | http://localhost:8000 |
| API文档 | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### 6. 停止服务

```bash
docker-compose down
```

## 生产环境部署

### 1. 创建生产环境配置

```bash
cp .env.example .env.prod
```

修改 `.env.prod`：
- 设置强密码
- 配置域名
- 设置生产环境相关配置

### 2. 使用生产环境Docker Compose

创建 `docker-compose.prod.yml`：

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_HOST: db
      REDIS_URL: redis://redis:6379/0
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

### 3. 启动生产环境

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. 配置反向代理（可选）

使用 Nginx 配置反向代理：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5. 配置HTTPS（推荐）

使用 Let's Encrypt 配置 SSL：

```bash
sudo certbot --nginx -d yourdomain.com
```

## 环境变量配置

### 完整变量列表

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| POSTGRES_USER | 否 | vibe_user | 数据库用户名 |
| POSTGRES_PASSWORD | 否 | vibe_password | 数据库密码 |
| POSTGRES_DB | 否 | vibe_db | 数据库名 |
| POSTGRES_HOST | 否 | db | 数据库主机 |
| POSTGRES_PORT | 否 | 5432 | 数据库端口 |
| REDIS_URL | 否 | redis://redis:6379/0 | Redis连接地址 |
| API_HOST | 否 | 0.0.0.0 | API绑定地址 |
| API_PORT | 否 | 8000 | API端口 |
| NEXT_PUBLIC_API_URL | 否 | http://localhost:8000 | 前端API地址 |
| GITHUB_TOKEN | 否 | 空 | GitHub API访问令牌 |

### 变量分类

#### 数据库配置
```bash
POSTGRES_USER=vibe_user
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=vibe_db
```

#### Redis配置
```bash
REDIS_URL=redis://redis:6379/0
```

#### API配置
```bash
API_HOST=0.0.0.0
API_PORT=8000
```

#### 前端配置
```bash
NEXT_PUBLIC_API_URL=http://api.yourdomain.com
```

#### GitHub配置（可选）
```bash
GITHUB_TOKEN=your_github_personal_access_token
```

## 数据库管理

### 连接数据库

```bash
docker exec -it vibelidar-db psql -U vibe_user -d vibe_db
```

### 查看表结构

```sql
\d;
```

### 备份数据库

```bash
docker exec vibelidar-db pg_dump -U vibe_user vibe_db > backup.sql
```

### 恢复数据库

```bash
cat backup.sql | docker exec -i vibelidar-db psql -U vibe_user -d vibe_db
```

### 手动更新趋势数据

```bash
docker exec -it vibelidar-backend python -m app.crawler
```

## 日志管理

### 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# 实时查看日志
docker-compose logs -f backend
```

### 日志格式

日志采用JSON格式，包含以下字段：
- `timestamp` - 时间戳
- `service` - 服务名
- `level` - 日志级别
- `message` - 日志内容

### 日志文件位置

日志文件存储在容器内部，配置了日志轮转：
- 最大文件大小：10MB
- 保留文件数：3个

## 健康检查

### 检查服务状态

```bash
docker-compose ps
```

### 手动检查健康状态

```bash
# 检查后端API
curl http://localhost:8000/docs

# 检查数据库
docker exec vibelidar-db pg_isready -U vibe_user

# 检查Redis
docker exec vibelidar-redis redis-cli ping
```

## 性能优化

### 前端优化
- 启用gzip压缩
- 配置CDN
- 启用HTTP缓存

### 后端优化
- 使用Redis缓存热点数据
- 配置数据库连接池
- 优化SQL查询

### 数据库优化
- 创建适当索引
- 定期清理过期数据
- 配置主从复制（可选）

## 常见问题排查

### 问题1：服务无法启动

**现象：**
```bash
docker-compose up -d 后服务启动失败
```

**排查步骤：**
1. 查看日志：`docker-compose logs`
2. 检查端口是否被占用：`lsof -i :3000`
3. 检查环境变量配置是否正确
4. 检查Docker资源是否充足

### 问题2：前端无法访问后端API

**现象：**
- 前端页面加载正常
- 项目列表为空
- 控制台显示API请求失败

**排查步骤：**
1. 检查后端服务是否正常运行：`docker-compose ps`
2. 检查API地址配置：`echo $NEXT_PUBLIC_API_URL`
3. 检查网络连接：`curl http://localhost:8000/api/projects`
4. 检查CORS配置

### 问题3：数据库连接失败

**现象：**
- 后端服务启动失败
- 日志显示数据库连接超时

**排查步骤：**
1. 检查数据库服务状态：`docker-compose ps db`
2. 检查数据库配置：`cat .env | grep POSTGRES`
3. 检查数据库健康检查：`docker exec vibelidar-db pg_isready -U vibe_user`
4. 查看数据库日志：`docker-compose logs db`

### 问题4：明星项目数据为空

**现象：**
- 明星项目区域显示加载动画
- 但始终没有数据

**排查步骤：**
1. 检查Redis服务：`docker-compose ps redis`
2. 手动运行爬虫：`docker exec -it vibelidar-backend python -m app.crawler`
3. 检查GitHub API限制
4. 配置GITHUB_TOKEN环境变量

### 问题5：收藏功能不生效

**现象：**
- 点击收藏图标没有反应
- 刷新页面后收藏消失

**排查步骤：**
1. 检查浏览器控制台是否有错误
2. 检查localStorage是否可用
3. 检查后端API是否正常：`curl http://localhost:8000/api/favorites?user_id=test`

## 安全建议

1. **设置强密码**：修改默认数据库密码
2. **限制网络访问**：生产环境中限制数据库端口访问
3. **配置HTTPS**：使用SSL证书加密传输
4. **定期备份**：定期备份数据库
5. **更新依赖**：定期更新Docker镜像和依赖包

## 版本更新

### 更新代码

```bash
git pull origin main
docker-compose up -d --build
```

### 数据库迁移

如果数据库结构有变更，需要执行迁移：

```bash
docker exec -it vibelidar-backend python -m app.init_db
```

## 故障恢复

### 服务崩溃恢复

```bash
# 查看崩溃日志
docker-compose logs --tail=50 backend

# 重启服务
docker-compose restart backend
```

### 数据库恢复

```bash
# 停止服务
docker-compose down

# 恢复备份
cat backup.sql | docker exec -i vibelidar-db psql -U vibe_user -d vibe_db

# 启动服务
docker-compose up -d
```

---

**部署完成！** 🎉
