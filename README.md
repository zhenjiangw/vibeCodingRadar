# Vibe Coding 雷达

帮助开发者发现并选择第一个值得实施的编程项目的Web应用。

## 功能特性

### 项目分类浏览系统
- **三个分类维度**：最好玩（创意性与娱乐价值）、最好用（实用性）、最好搓（入门难度）
- **项目卡片**：包含项目名称、简介、核心功能、难度标识、预计完成时间、技术栈标签
- **详细提示词**：点击项目卡片展示标准化开工提示词，可直接提交给AI助手
- **筛选功能**：支持分类筛选、全局搜索、用户收藏

### 明星项目展示区
- **滚动加载**：下滑至距离底部200px时自动加载
- **GitHub趋势**：展示本周增长最快的开源项目
- **悬停效果**：卡片悬停缩放和阴影效果

## 技术栈

### 前端
- Next.js 14
- Tailwind CSS 3
- Redux Toolkit
- Lucide React

### 后端
- FastAPI
- PostgreSQL
- Redis
- SQLAlchemy

### 基础设施
- Docker
- Docker Compose

## 快速开始

### 环境要求
- Docker 20+
- Docker Compose 2+

### 启动开发环境

```bash
# 复制环境变量文件
cp .env.example .env

# 启动所有服务
docker-compose up -d

# 初始化数据库
docker exec -it vibelidar-backend python -m app.init_db
```

### 访问地址
- 前端应用：http://localhost:3000
- 后端API文档：http://localhost:8000/docs

### 停止服务

```bash
docker-compose down
```

## 项目结构

```
vibeLidar/
├── backend/                 # 后端服务
│   ├── app/                # 应用代码
│   │   ├── main.py        # FastAPI入口
│   │   ├── database.py    # 数据库配置
│   │   ├── models.py      # 数据库模型
│   │   ├── schemas.py     # Pydantic模式
│   │   ├── crawler.py     # GitHub爬虫
│   │   └── scheduler.py   # 定时任务
│   ├── tests/             # 测试文件
│   ├── requirements.txt   # Python依赖
│   ├── Dockerfile.dev     # 开发环境Dockerfile
│   └── Dockerfile.prod    # 生产环境Dockerfile
├── frontend/               # 前端应用
│   ├── components/        # React组件
│   ├── pages/            # Next.js页面
│   ├── store/            # Redux状态管理
│   ├── styles/           # 样式文件
│   ├── package.json      # Node.js依赖
│   ├── Dockerfile.dev    # 开发环境Dockerfile
│   └── Dockerfile.prod   # 生产环境Dockerfile
├── docker-compose.yml     # Docker Compose配置
└── .env.example          # 环境变量示例
```

## API接口

### 项目接口
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/{id}` - 获取项目详情
- `POST /api/search` - 搜索项目

### 分类接口
- `GET /api/categories` - 获取分类列表

### 收藏接口
- `POST /api/favorites/{project_id}` - 添加收藏
- `DELETE /api/favorites/{project_id}` - 取消收藏
- `GET /api/favorites` - 获取收藏列表

### 趋势接口
- `GET /api/trending` - 获取热门项目

## 数据库结构

### 表结构
- **categories** - 分类表
- **projects** - 项目表
- **user_favorites** - 用户收藏表
- **trending_projects** - 热门项目表
- **search_history** - 搜索历史表

## 配置说明

### 环境变量

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

## 开发指南

### 添加新项目分类

1. 在 `backend/app/models.py` 中添加分类记录
2. 在 `backend/app/init_db.py` 中初始化分类数据
3. 更新前端 `CategoryFilter.tsx` 组件

### 添加新项目

在 `backend/app/init_db.py` 的 `projects` 列表中添加新项目配置。

## 部署说明

### 生产环境

```bash
# 使用生产环境配置
docker-compose -f docker-compose.prod.yml up -d
```

### 健康检查

所有服务都配置了健康检查：
- 数据库：检查PostgreSQL连接
- Redis：检查Redis连接
- 后端：检查API文档端点

### 日志管理

日志采用JSON格式输出，包含：
- 时间戳
- 服务名
- 日志级别
- 内容

## 许可证

MIT License
