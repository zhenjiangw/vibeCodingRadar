# Vibe Coding 雷达 API 文档

## 概述

本API提供项目浏览、搜索、收藏和趋势数据等功能。

## 基础URL

开发环境：`http://localhost:8000`

## 接口列表

### 1. 获取分类列表

**GET** `/api/categories`

获取所有项目分类

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "最好玩",
    "slug": "most-fun",
    "description": "创意性与娱乐价值高的项目",
    "icon": "gamepad-2",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

### 2. 获取项目列表

**GET** `/api/projects`

获取项目列表，支持筛选和搜索

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category_id | int | 否 | 分类ID |
| difficulty | string | 否 | 难度级别（初级/中级/高级） |
| search | string | 否 | 搜索关键词 |

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "个人博客系统",
    "slug": "personal-blog",
    "description": "使用现代技术栈构建的个人博客平台...",
    "core_features": ["Markdown编辑", "文章分类", "评论系统"],
    "difficulty": "初级",
    "estimated_hours": 15,
    "tech_stack": ["Next.js", "React", "Tailwind CSS"],
    "category_id": 3,
    "target": "创建一个功能完整的个人博客系统...",
    "tech_recommendations": {
      "主技术": ["Next.js", "React"],
      "辅助技术": ["Tailwind CSS", "MongoDB"]
    },
    "implementation_steps": ["步骤1", "步骤2", "步骤3"],
    "expected_outcomes": {
      "功能": ["完整的博客系统"],
      "学习收获": ["Next.js开发"]
    },
    "is_featured": false,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

### 3. 获取项目详情

**GET** `/api/projects/{project_id}`

获取单个项目的详细信息

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | int | 项目ID |

**响应示例：**

```json
{
  "id": 1,
  "name": "个人博客系统",
  "slug": "personal-blog",
  "description": "使用现代技术栈构建的个人博客平台...",
  "core_features": ["Markdown编辑", "文章分类", "评论系统", "SEO优化", "响应式设计"],
  "difficulty": "初级",
  "estimated_hours": 15,
  "tech_stack": ["Next.js", "React", "Tailwind CSS", "MongoDB", "Vercel"],
  "category_id": 3,
  "target": "创建一个功能完整的个人博客系统，支持文章发布、管理和展示",
  "tech_recommendations": {
    "主技术": ["Next.js", "React"],
    "辅助技术": ["Tailwind CSS", "MongoDB", "Vercel"]
  },
  "implementation_steps": [
    "初始化Next.js项目，配置Tailwind CSS",
    "设计数据库模型，创建文章、分类、评论表",
    "实现文章CRUD功能和Markdown编辑器",
    "实现分类管理和标签系统",
    "添加评论功能和SEO优化",
    "部署到Vercel并配置域名"
  ],
  "expected_outcomes": {
    "功能": ["完整的博客系统", "Markdown编辑", "评论系统"],
    "学习收获": ["Next.js开发", "数据库设计", "SEO优化"]
  },
  "is_featured": false,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

### 4. 搜索项目

**POST** `/api/search`

搜索项目

**请求体：**

```json
{
  "query": "blog",
  "user_id": "user123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| query | string | 是 | 搜索关键词 |
| user_id | string | 否 | 用户ID（用于记录搜索历史） |

**响应示例：**

```json
{
  "projects": [...],
  "total": 5
}
```

### 5. 添加收藏

**POST** `/api/favorites/{project_id}?user_id={user_id}`

将项目添加到收藏

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | int | 项目ID |

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**响应示例：**

```json
{
  "message": "Favorite added"
}
```

### 6. 取消收藏

**DELETE** `/api/favorites/{project_id}?user_id={user_id}`

取消收藏项目

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | int | 项目ID |

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**响应示例：**

```json
{
  "message": "Favorite removed"
}
```

### 7. 获取收藏列表

**GET** `/api/favorites?user_id={user_id}`

获取用户的收藏列表

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "个人博客系统",
    ...
  }
]
```

### 8. 获取热门项目

**GET** `/api/trending?limit=10`

获取GitHub热门项目

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | int | 否 | 10 | 返回数量 |

**响应示例：**

```json
[
  {
    "id": 1,
    "name": "awesome-project",
    "full_name": "username/awesome-project",
    "description": "An awesome project",
    "url": "https://github.com/username/awesome-project",
    "language": "Python",
    "stars_24h": 150,
    "stars_7d": 1200,
    "total_stars": 5000,
    "forks": 800,
    "open_issues": 25
  }
]
```

## 错误响应

所有错误响应格式：

```json
{
  "detail": "错误描述"
}
```

## 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源未找到 |
| 500 | 服务器内部错误 |
