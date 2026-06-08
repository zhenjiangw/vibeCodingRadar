# 数据库结构设计

## 整体架构

本应用采用 PostgreSQL 数据库，包含以下核心表：

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  categories  │───┐ │   projects   │◄───┐│ user_favorites   │
│              │   │ │              │    ││                  │
│ - id (PK)    │   │ │ - id (PK)    │    ││ - id (PK)        │
│ - name       │   │ │ - name       │    ││ - user_id        │
│ - slug       │   │ │ - slug       │    ││ - project_id (FK)│
│ - icon       │   │ │ - category_id│───┘│                  │
└──────────────┘   │ │ - difficulty │     └──────────────────┘
                   │ │ - tech_stack │
                   │ └──────────────┘
                   │
┌──────────────────┐│     ┌──────────────────┐
│search_history    ││     │trending_projects │
│                  ││     │                  │
│ - id (PK)        ││     │ - id (PK)        │
│ - user_id        ││     │ - name           │
│ - query          ││     │ - full_name      │
│ - created_at     ││     │ - stars_24h      │
└──────────────────┘│     │ - stars_7d       │
                    │     └──────────────────┘
                    └──────────────────────┐
                                           │
                                           ▼
                                ┌──────────────────┐
                                │   关系说明        │
                                │                  │
                                │ categories.id    │
                                │     └───► projects.category_id
                                │                  │
                                │ projects.id      │
                                │     └───► user_favorites.project_id
                                └──────────────────┘
```

## 表详细设计

### 1. categories（分类表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 分类唯一标识 |
| name | VARCHAR(50) | NOT NULL, UNIQUE | 分类名称 |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | 分类别名（URL友好） |
| description | TEXT | NULL | 分类描述 |
| icon | VARCHAR(100) | NULL | 图标名称 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 更新时间 |

**示例数据：**

| id | name | slug | description | icon |
|----|------|------|-------------|------|
| 1 | 最好玩 | most-fun | 创意性与娱乐价值高的项目 | gamepad-2 |
| 2 | 最好用 | most-useful | 实用性强、解决实际问题的项目 | wrench |
| 3 | 最好搓 | easiest | 实现难度低、适合入门的项目 | baby |

### 2. projects（项目表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 项目唯一标识 |
| name | VARCHAR(200) | NOT NULL | 项目名称 |
| slug | VARCHAR(200) | NOT NULL, UNIQUE | 项目别名 |
| description | TEXT | NOT NULL | 项目简介（≤150字） |
| core_features | TEXT[] | NOT NULL | 核心功能列表（3-5个） |
| difficulty | VARCHAR(20) | NOT NULL | 难度级别（初级/中级/高级） |
| estimated_hours | INT | NOT NULL | 预计完成时间（小时） |
| tech_stack | TEXT[] | NOT NULL | 技术栈标签（最多5个） |
| category_id | INT | FOREIGN KEY | 所属分类 |
| target | TEXT | NULL | 项目目标（SMART原则） |
| tech_recommendations | JSON | NULL | 技术建议（主技术+辅助技术） |
| implementation_steps | TEXT[] | NULL | 实施步骤（至少5步） |
| expected_outcomes | JSON | NULL | 预期成果（功能+学习收获） |
| is_featured | BOOLEAN | DEFAULT FALSE | 是否精选 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 更新时间 |

**tech_recommendations 结构：**

```json
{
  "主技术": ["Next.js", "React"],
  "辅助技术": ["Tailwind CSS", "MongoDB"]
}
```

**expected_outcomes 结构：**

```json
{
  "功能": ["完整的博客系统", "Markdown编辑"],
  "学习收获": ["Next.js开发", "数据库设计"]
}
```

### 3. user_favorites（用户收藏表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 收藏记录唯一标识 |
| user_id | VARCHAR(255) | NOT NULL | 用户标识（前端生成） |
| project_id | INT | FOREIGN KEY | 收藏的项目ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**唯一约束：** `unique_user_project (user_id, project_id)`

### 4. trending_projects（热门项目表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 记录唯一标识 |
| name | VARCHAR(200) | NOT NULL | 项目名称 |
| full_name | VARCHAR(300) | NOT NULL, UNIQUE | GitHub完整名称（owner/repo） |
| description | TEXT | NULL | 项目简介（≤100字） |
| url | VARCHAR(500) | NOT NULL | GitHub仓库URL |
| language | VARCHAR(100) | NULL | 主语言 |
| stars_24h | INT | DEFAULT 0 | 24小时star增长数 |
| stars_7d | INT | DEFAULT 0 | 7天star增长数 |
| total_stars | INT | DEFAULT 0 | 总star数 |
| forks | INT | DEFAULT 0 | fork数 |
| open_issues | INT | DEFAULT 0 | 开放issue数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 更新时间 |

### 5. search_history（搜索历史表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 记录唯一标识 |
| user_id | VARCHAR(255) | NULL | 用户标识 |
| query | VARCHAR(500) | NOT NULL | 搜索关键词 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

## 索引设计

| 表名 | 索引字段 | 索引类型 | 说明 |
|------|----------|----------|------|
| projects | category_id | BTREE | 加速分类筛选 |
| projects | difficulty | BTREE | 加速难度筛选 |
| projects | slug | UNIQUE | 唯一约束 |
| user_favorites | user_id | BTREE | 加速用户收藏查询 |
| user_favorites | (user_id, project_id) | UNIQUE | 唯一约束 |
| trending_projects | full_name | UNIQUE | 唯一约束 |
| trending_projects | stars_7d | BTREE | 加速趋势排序 |

## ER图

```
categories          projects
    │                    │
    │ 1                  │ N
    └────────────────────┘
          category_id

projects            user_favorites
    │                    │
    │ 1                  │ N
    └────────────────────┘
          project_id
```

## 扩展预留

以下字段设计考虑了未来扩展：

1. **projects 表：**
   - `is_featured` - 支持精选项目标识
   - 预留字段可扩展：`tags`, `author`, `github_url`, `demo_url`

2. **categories 表：**
   - `icon` - 支持自定义图标
   - 预留字段可扩展：`color`, `order`

3. **trending_projects 表：**
   - `stars_24h`, `stars_7d` - 支持多维度增长统计
   - 预留字段可扩展：`contributors`, `last_updated`
