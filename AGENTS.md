# Vibe Coding 雷达 — 项目全览

> 发现你的第一个编程项目 🚀
>
> 帮助开发者（尤其是初学者）探索、筛选并启动第一个编程项目。策划项目目录按"最好玩""最好用""最好搓"三维度分类，每个项目附带结构化详情、SMART 目标和 AI 提示词，可直接提交给 AI 助手辅助开发。

---

## ⚠️ 关键约束：纯 Docker 项目

**本项目仅支持 Docker 环境开发运行。请勿尝试本地直接启动后端或前端。**

```bash
# ✅ 正确的启动方式（唯一方式）
docker compose up -d
```

- 后端 Python 依赖、前端 Node 依赖均**不保证**在宿主机直接安装运行
- `docker compose` 是一切开发/测试/部署的唯一入口
- 如需修改代码后验证，请使用 `docker compose up -d --build <service>` 重建对应服务
- 所有环境变量通过 `.env` 文件管理，由 Compose 自动注入容器

---

## 一、快速导航

| 如果你要找… | 看这里 |
|---|---|
| 项目整体架构和数据流 | 第二章 |
| 前端组件列表和设计规范 | 第三章 |
| 后端 API 路由和数据库模型 | 第四章 |
| 项目种子数据（12 个项目） | 第四章数据库种子 |
| Docker 和部署 | 第五章 |
| CI/CD 流水线 | 第六章 |
| 开发环境配置 | 第七章 |
| 测试 | 第八章 |

---

## 二、架构总览

### 2.1 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端框架** | Next.js (Pages Router) | 14 | React 框架 |
| **状态管理** | Redux Toolkit | 2.1 | 全局状态（项目/分类/收藏/趋势） |
| **样式** | Tailwind CSS + CSS 自定义属性 | 3.4 | 原子化 CSS + 设计 Token |
| **图标** | Lucide React | 0.323 | ~12 个 SVG 图标 |
| **HTTP 客户端** | Axios | 1.6 | 前端 API 请求 |
| **后端框架** | FastAPI (Uvicorn) | 0.109 | API 服务 |
| **ORM** | SQLAlchemy | 2.0 | 数据库 ORM |
| **序列化** | Pydantic v2 | 2.6 | 请求/响应校验 |
| **数据库** | PostgreSQL 16 | — | 持久化存储 |
| **缓存** | Redis 7 | — | API 缓存 |
| **容器** | Docker + Docker Compose | — | 开发/生产环境 |
| **生产 Web 服务器** | Nginx | — | 反向代理 |

### 2.2 数据流

```
用户浏览器
    │  Redux 通过 Axios 请求
    ▼
Next.js 前端 (端口 3000)
    │  GET /api/projects?category_id=&difficulty=&search=
    │  GET /api/categories
    │  GET /api/trending?limit=10
    ▼
FastAPI 后端 (端口 8000)
    │  SQLAlchemy 查询 / Redis 缓存
    ▼
PostgreSQL (5432) + Redis (6379)
    ▲
    │
GitHub API 爬虫 ── 每天 02:00 通过 scheduler.py 触发
    爬取趋势仓库存储到 trending_projects 表
```

**关键数据流说明**：
- **纯客户端数据获取**：无 `getServerSideProps`/`getStaticProps`，所有数据通过 Redux thunk 懒加载
- **收藏系统**：前端 localStorage 优先（`toggleFavorite` reducer），后端 API 接口已实现但前端未使用
- **缓存策略**：分类缓存 1 小时，趋势缓存 30 分钟（Redis）；项目查询不缓存
- **趋势模拟**：GitHub 仓库数据真实获取，但 `stars_24h`/`stars_7d` 通过总 star 数估算（5% 作为 24h，×7 作为 7d）

---

## 三、前端设计系统

### 3.1 设计语言：专业/企业风

| 维度 | 值 |
|------|-----|
| **背景** | `#f6f7f9` 冷灰画布 |
| **卡片底色** | `#ffffff` 纯白 |
| **品牌色** | `#9333ea` 紫色（Logo 渐变） |
| **交互色** | `#2563eb` 蓝色（操作/强调） |
| **主文字** | `#172033` 深海军色 |
| **展示/正文字族** | Inter (400–700 weight) |
| **等宽字族** | JetBrains Mono |
| **圆角** | 8px / 12px / 18px / 24px |
| **阴影** | 冷蓝阴影递进 5 级 |
| **头部** | 毛玻璃 `rgba(255,255,255,0.88)` + `blur(14px)` |
| **动效** | 140ms / 220ms，`cubic-bezier(0.2, 0, 0, 1)` |

**设计哲学**：蓝紫双色系统（蓝色交互 + 紫色品牌）、信息清晰优先、开发者工具感（等宽数字、发丝边框）、克制阴影。

### 3.2 CSS 架构

- `frontend/styles/globals.css`：~560 行，包含全套 CSS 自定义属性（~50 个 Token）、基础重置、排版、组件 class（`.minimal-card`、`.pill-minimal`、`.btn-primary` 等）、动画关键帧、响应式适配
- `frontend/tailwind.config.js`：主题扩展（字体族、色板、动画、阴影、圆角）与 CSS 变量对齐
- **核心原则**：**CSS 变量驱动**，Tailwind 用于布局/间距，自定义 class 用于组件视觉样式
- `--font-display` 当前值为 `'Outfit', Inter, system-ui, sans-serif`（通过 `globals.css` 设定，第 6 轮对话中由 Inter 改为 Outfit 以匹配 MiniMax 风格）

### 3.2.1 字体加载（`_document.tsx`）

- **文件**：`pages/_document.tsx`
- **Google Fonts 预加载**：Inter (400..800)、JetBrains Mono (400..700)、Outfit (500..800)
- Outfit 用于标题/展示字体，Inter 用于正文 UI，JetBrains Mono 用于等宽/数字
- 使用 `preconnect` + `preload` 优化字体加载性能

### 3.3 色板系统

| Token | Hex | 用途 |
|-------|-----|------|
| `--bg` | `#f6f7f9` | 页面背景 |
| `--surface` | `#ffffff` | 卡片/面板底色 |
| `--fg` | `#172033` | 主文字/标题 |
| `--fg-2` | `#3b4658` | 次级文字 |
| `--muted` | `#6b7689` | 辅助信息 |
| `--border` | `#d8dee8` | 默认边框 |
| `--accent` | `#2563eb` | 交互强调色 |
| `--brand` | `#9333ea` | 品牌识别色 |
| `--success` | `#16a34a` | 成功/初级 |
| `--warning` | `#f59e0b` | 警告/中级 |
| `--danger` | `#dc2626` | 危险/高级 |

### 3.4 页面结构（单页布局）

```
┌──────────────────────────────────────────────────────┐
│  Header (粘性毛玻璃导航)                              │
│  [■ Logo] Vibe Coding Radar    [♡ 收藏 (N)]          │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Vibe Coding. ← 巨幅标题 (60–140px clamp)             │
│                                                       │
│  —— 项目库 ——                                         │
│  [全部项目] [最好玩] [最好用] [最好搓]                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                     │
│  │卡片1│ │卡片2│ │卡片3│ │卡片4│  ← 响应式 1-4 列     │
│  └─────┘ └─────┘ └─────┘ └─────┘                     │
│                                                       │
│  —— GitHub 趋势 ——                                    │
│  ┌────┐ ┌────┐ ┌────┐                               │
│  │#01 │ │#02 │ │#03 │  ← IntersectionObserver 入场动画│
│  └────┘ └────┘ └────┘                               │
│                                                       │
│  ● Vibe Coding Radar · 2026 · 发现 · 学习 · 创造     │
└──────────────────────────────────────────────────────┘
```

### 3.5 核心文字/UI 定位

以下是在前几轮写作中确立的关键元素位置（方便后续快速定位和修改）：

| 元素 | 文件 | 行号 / 标识 | 关键属性 |
|------|------|------------|----------|
| **标题文字"Vibe Coding Radar"** | `components/Header.tsx:34-36` | `<span>` in `<Link href="/">` | 字体 `Outfit`, `text-2xl`, `font-bold`, `tracking-tight`, `hidden sm:block` |
| **雷达 SVG 图标** | `components/Header.tsx:21-32` | `<svg viewBox="0 0 32 32">` | 2 同心圆 + 十字准线 + 中心点，`stroke="var(--accent)"`，透明底无背景色 |
| **首页巨幅标题"Vibe Coding."** | `pages/index.tsx:80-88` | `<p>` in hero `<section>` | `font-[var(--font-display)]`，`fontSize: 'clamp(60px, 12vw, 140px)'`，点号为 `var(--accent)` |
| **Header 整体高度** | `components/Header.tsx:17` | `h-20` (80px) | 含 `sticky top-0 z-50 glass-header border-b` |
| **图标容器** | `components/Header.tsx:20` | `w-12 h-12` (48px) | `flex items-center justify-center` |
| **标题 + 图标共同链接** | `components/Header.tsx:19` | `<Link href="/">` | 包裹图标和标题，整体可点击回到首页，**无** `hover` 变色 |

### 3.6 组件清单

| 组件 | 路径 | 行数 | 功能 | 关键细节 |
|------|------|------|------|----------|
| **Header** | `components/Header.tsx` | 77 | 粘性毛玻璃导航栏，透明底雷达 SVG 图标，Outfit 标题，收藏按钮（心形 + 徽章计数 ≤99+） | props: `onShowFavorites`, `isShowFavorites?`；心形填充 `fill={isShowFavorites ? '#2563eb' : 'none'}`；`Link href="/"` 包裹图标+标题可点击回到首页 |
| **CategoryFilter** | `components/CategoryFilter.tsx` | 57 | 药丸形分类筛选按钮组 | 图标映射 `{'gamepad-2':<Gamepad2/>,'wrench':<Wrench/>,'baby':<Baby/>}`；`selectedCategory===null` 时激活"全部项目"；冗余 `fetchCategories` 仅用于手动注入后刷新 |
| **DifficultyBadge** | `components/DifficultyBadge.tsx` | 30 | 颜色编码难度标签（初级=绿，中级=黄，高级=红） | config 映射 `{'初级':{color:'var(--green)',bg:'var(--green-bg)'}, ...}`；圆点 + 文字布局 |
| **ProjectCard** | `components/ProjectCard.tsx` | 119 | 白底项目卡片：难度/工时 → 标题 → 描述 → 核心功能(≤3+N) → 技术栈(≤4+) → 收藏+详情箭头 | `handleCardClick`: 先 `fetchProjectById(dispatch)→setSelectedProject→onShowDetail()`；收藏 `e.stopPropagation()` 防止触发卡片；`animate-fade-in-up` 交错过场 (index ×0.025s) |
| **ProjectModal** | `components/ProjectModal.tsx` | 357 | 右侧抽屉详情页：遮罩 + 入口/出口动画 → 完整项目详情 + GitHub 链接卡片 + 复制开工提示词 | ⚠️ **关键 Bug 修复（第 6afb875 提交）**：需要 `onClose?: () => void` prop 让 `isOpen` 经过 `true→false→true` 完整周期，否则 `useEffect([isOpen])` 不会重触发，`visible` 卡在 false；`handleClose` 先 `setVisible(false)`，300ms 后 `dispatch(setSelectedProject(null))` + `onClose?.()`；GitHub 链接卡片仅在 `project.url` 存在时渲染（第 126 行）；`Esc` 关闭监听 |
| **TrendingSection** | `components/TrendingSection.tsx` | 206 | GitHub 本周热门：IntersectionObserver 入场动画 + 6 个示例项目的降级数据 | props: `onShowDetail?: (project: TrendingProject) => void`；`SAMPLE_TRENDING` 常量数组含 6 个真实项目（vscode/react/tailwindcss/next.js/rust/n8n）；`displayProjects` 用 `useMemo` 在 API 空时降级；卡片从 `<a>` 改为 `<div onClick>`（不再直接跳转 GitHub，改为触发详情 modal）；动画 `opacity-0 translate-y-12 → opacity-100 translate-y-0`，交错延迟 `idx × 0.04s` |

### 3.7 主页面编排（`pages/index.tsx`）

| 片段 | 行号 | 作用 |
|------|------|------|
| `dispatch(loadFavorites())` | 55 | 启动时从 localStorage 恢复收藏 |
| `dispatch(fetchProjects(...))` | 59-64 | 筛选条件变化时重新拉取项目列表 |
| `handleTrendingDetail` | 24-52 | ⚡ 将 `TrendingProject` 映射为 `Project` 形状后 `dispatch(setSelectedProject(...))` + `setIsModalOpen(true)` |
| `displayedProjects` | 66-68 | `showFavorites` 为 `true` 时过滤收藏 |
| `<Header>` | 72 | 传 `onShowFavorites` + `isShowFavorites` |
| `<TrendingSection>` | 172 | 传 `onShowDetail={handleTrendingDetail}` |
| `<ProjectModal>` | 195 | 传 `isOpen={isModalOpen}` + `onClose={() => setIsModalOpen(false)}` |
| Vibe Coding. 标题 | 82-84 | `clamp(60px, 12vw, 140px)` 流体字号 |
| 加载状态 | 131-135 | `spinner` + "加载中…" |
| 空状态 | 136-146 | "暂无项目" / "收藏夹还是空的" |
| Footer | 177-191 | `2026 · 发现 · 学习 · 创造` |

### 3.8 状态覆盖

| 状态 | 处理 |
|------|------|
| **Loading** | Spinner + "加载中…" 居中显示 |
| **Empty** | 空状态图标（∅）+ "暂无项目" + 上下文提示（收藏空/换条件） |
| **Error** | 后端错误通过 Redux 传递，触发空状态兜底 |
| **Favorites** | 收藏筛选模式，"我的收藏"头部 + "返回全部"按钮 |
| **单项目** | 网格自动调整为单列 |
| **Transition** | 入场动画 220ms fadeInUp，交错延迟 25ms 递增 |

### 3.9 响应式断点

| 断点 | 网格 | 容器内边距 | 调整 |
|------|------|-----------|------|
| **≥1280px (xl)** | 4列 | 36px | 完整布局 |
| **1024–1279px (lg)** | 3列 | 36px | 4→3列 |
| **768–1023px (md)** | 2列 | 24px | 3→2列，标题缩小 |
| **<768px (phone)** | 1列 | 16px | 2→1列，Section边距压缩 |

### 3.10 交互细节

| 交互 | 行为 |
|------|------|
| **卡片 hover** | 边框加深，微阴影上浮，标题变蓝色，详情箭头滑向蓝色 |
| **分类筛选** | 点击即切换，药丸标签激活态蓝底白字，非激活悬停蓝环 |
| **收藏** | 心形点击切换（空心↔实心），计数徽章实时更新，持久化到 localStorage |
| **项目详情** | 点击卡片 → 右侧抽屉滑出（带遮罩），Esc/点击遮罩关闭 |
| **热门项目详情** | 点击热门卡片 → `handleTrendingDetail` 将 TrendingProject 映射为 Project → 打开同一详情 modal，内含 GitHub 链接卡片 |
| **复制提示词** | 一键复制到剪贴板，按钮显示"已复制到剪贴板"反馈 2s |
| **趋势入场** | 滚动到视口后渐入上移（700ms），卡片逐张交错（40ms 间隔） |
| **滚动条** | 自定义 6px 窄滚动条，hover 加深颜色 |

---

## 四、后端架构

### 4.1 API 路由（`backend/app/main.py`）

| 方法 | 路径 | 描述 | 参数 | 缓存 |
|------|------|------|------|------|
| GET | `/api/categories` | 获取所有分类 | 无 | Redis 3600s |
| GET | `/api/projects` | 获取项目列表 | `category_id`、`difficulty`、`search`（可选） | 不缓存 |
| GET | `/api/projects/{id}` | 按 ID 获取单个项目 | 路径参数 `id` | 不缓存 |
| POST | `/api/favorites/{project_id}` | 添加收藏 | `user_id` 查询参数 | — |
| DELETE | `/api/favorites/{project_id}` | 移除收藏 | `user_id` 查询参数 | — |
| GET | `/api/favorites` | 获取用户收藏 | `user_id` 查询参数 | 不缓存 |
| GET | `/api/trending` | 获取 GitHub 趋势 | `limit`（可选，默认 10） | Redis 1800s |
| POST | `/api/search` | 搜索项目（记录历史） | `query`、`user_id`（可选） | — |

### 4.2 数据库模型（`backend/app/models.py`）

**Category** (`categories`)
- `id` (PK), `name`, `slug` (unique), `description`, `icon`, `created_at`, `updated_at`

**Project** (`projects`)
- `id` (PK), `name`, `slug`, `description`, `core_features` (ARRAY), `difficulty` (enum: 初级/中级/高级), `estimated_hours`, `tech_stack` (ARRAY), `category_id` (FK→categories), `target`, `tech_recommendations` (JSON), `implementation_steps` (ARRAY[TEXT]), `expected_outcomes` (JSON), `is_featured`, `created_at`, `updated_at`

**UserFavorite** (`user_favorites`)
- `id` (PK), `user_id`, `project_id` (FK→projects), `created_at`
- 唯一约束：(user_id, project_id)

**TrendingProject** (`trending_projects`)
- `id` (PK), `name`, `full_name` (unique), `description`, `url`, `language`, `stars_24h`, `stars_7d`, `total_stars`, `forks`, `open_issues`, `created_at`, `updated_at`

**SearchHistory** (`search_history`)
- `id` (PK), `user_id`, `query`, `created_at`

### 4.3 数据库种子数据

12 个策划项目，3 个分类：

| # | 项目名称 | 分类 | 难度 | 工时 | 技术栈 |
|---|----------|------|------|------|--------|
| 1 | 个人博客系统 | 最好搓 | 初级 | 15h | Next.js, React, Tailwind, MongoDB, Vercel |
| 2 | 待办事项应用 | 最好搓 | 初级 | 10h | React, TypeScript, Firebase, Tailwind |
| 3 | 天气查询应用 | 最好玩 | 初级 | 8h | Vue.js, OpenWeatherMap API, Tailwind |
| 4 | 在线代码编辑器 | 最好玩 | 中级 | 30h | React, Monaco Editor, Node.js, Express |
| 5 | 电商管理后台 | 最好用 | 高级 | 50h | React, Redux, Node.js, PostgreSQL, Ant Design |
| 6 | 即时通讯应用 | 最好玩 | 中级 | 40h | React Native, Firebase, TypeScript |
| 7 | 笔记管理应用 | 最好用 | 初级 | 12h | React, Quill, IndexedDB, Tailwind |
| 8 | 健身计划追踪器 | 最好用 | 中级 | 25h | React, D3.js, Node.js, MongoDB |
| 9 | URL 短链接服务 | 最好用 | 初级 | 8h | FastAPI, Redis, PostgreSQL |
| 10 | AI 图像生成器 | 最好玩 | 中级 | 20h | React, Stable Diffusion API, Node.js |
| 11 | 股票行情追踪器 | 最好用 | 中级 | 35h | React, Alpha Vantage API, Recharts, Node.js |
| 12 | 音乐播放器 | 最好玩 | 中级 | 28h | React, Web Audio API, Spotify API, Tailwind |

### 4.4 GitHub 趋势爬虫

- **文件**：`backend/app/crawler.py`
- **触发**：`backend/app/scheduler.py` 每天 02:00 在守护线程中调度
- **来源**：GitHub Search API（`created:>2023-01-01`，按 stars 降序）
- **注意**：增长指标（`stars_24h`/`stars_7d`）通过总 star 数估算，非真实增长跟踪

---

## 五、基础设施

### 5.1 Docker 架构

| 服务 | 镜像基础 | 端口映射 | 说明 |
|------|----------|----------|------|
| **db** | postgres:16-alpine | 5432 | 健康检查: pg_isready |
| **redis** | redis:7-alpine | 6379 | 健康检查: redis-cli ping |
| **backend** | python:3.11-slim (dev) / 多阶段 (prod) | 8000 | 开发带 `--reload` 热重载 |
| **frontend** | node:20-alpine (dev) / 多阶段→nginx:alpine (prod) | 3000 (dev) | 生产由 Nginx 服务静态文件 |

**生产 Nginx** (`frontend/nginx.conf`)：代理 `/api/` 请求到 `backend:8000`。

**配置文件**：
- `docker-compose.yml` — 开发环境（卷挂载热重载，JSON 日志驱动 10MB×3）
- `docker-compose.prod.yml` — 生产环境（无开发卷挂载，前端无端口映射）
- `backend/Dockerfile.dev` / `backend/Dockerfile.prod`
- `frontend/Dockerfile.dev` / `frontend/Dockerfile.prod`

### 5.2 CI/CD（`.github/workflows/ci-cd.yml`）

触发条件：`main` 分支的 push / PR。

| Job | 环境 | 步骤 |
|-----|------|------|
| **test-backend** | Python 3.11 | pip install → pytest |
| **test-frontend** | Node 20 | npm ci → npm run lint → npm test |
| **build-docker** | Docker | 依赖 test-backend + test-frontend 成功 → 构建生产镜像 |

---

## 六、Redux 状态管理

### 6.1 Store 结构

```typescript
{
  projects: Project[],
  categories: Category[],
  trendingProjects: TrendingProject[],
  favorites: number[],             // 项目 ID 数组
  selectedProject: Project | null,
  searchQuery: string,
  selectedCategory: number | null,
  selectedDifficulty: string | null,
  isLoading: boolean,
  error: string | null,
}
```

### 6.2 Async Thunks

| Thunk | 端点 | 作用 |
|-------|------|------|
| `fetchProjects` | GET `/api/projects` | 带可选筛选参数 |
| `fetchCategories` | GET `/api/categories` | 加载分类列表 |
| `fetchTrendingProjects` | GET `/api/trending` | 加载趋势项目 |
| `fetchProjectById` | GET `/api/projects/{id}` | 加载单个项目详情 |

### 6.3 同步 Actions

| Action | 作用 |
|--------|------|
| `setSearchQuery` | 设置搜索关键词 |
| `setSelectedCategory` | 设置分类筛选 |
| `setSelectedDifficulty` | 设置难度筛选 |
| `setSelectedProject` | 设置当前选中的项目 |
| `toggleFavorite` | 切换收藏（同步到 localStorage） |
| `loadFavorites` | 从 localStorage 恢复收藏 |

---

## 七、开发环境

### 7.1 快速启动

```bash
# Docker 开发环境（一键启动所有服务）
docker compose up -d

# 或本地开发
# 后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 前端
cd frontend
npm install
npm run dev
```

### 7.2 环境变量（`.env`）

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `REDIS_URL` | Redis 连接串 |
| `GITHUB_TOKEN` | GitHub API Token（爬虫用） |
| `NEXT_PUBLIC_API_URL` | 前端 API 基地址 |

### 7.3 项目文件结构

```
vibeLidar/
├── .env.example                 # 环境变量模板
├── AGENTS.md                    # ← 本文档
├── README.md                    # 项目介绍 + 快速入门
├── docker-compose.yml           # 开发环境
├── docker-compose.prod.yml      # 生产环境
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 入口 + 所有路由
│   │   ├── database.py          # SQLAlchemy 引擎/会话
│   │   ├── models.py            # ORM 模型
│   │   ├── schemas.py           # Pydantic 模型
│   │   ├── init_db.py           # 数据库种子数据
│   │   ├── crawler.py           # GitHub 趋势爬虫
│   │   └── scheduler.py         # 定时任务（每天 02:00）
│   └── tests/
│       └── test_api.py          # Pytest API 测试
│
├── frontend/
│   ├── pages/
│   │   ├── index.tsx            # 主页面（单页布局）
│   │   ├── _app.tsx             # Redux Provider 包装
│   │   └── _document.tsx        # HTML 外壳 + 字体预加载
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── DifficultyBadge.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectModal.tsx
│   │   └── TrendingSection.tsx
│   ├── store/
│   │   ├── store.ts
│   │   └── projectSlice.ts
│   ├── styles/
│   │   └── globals.css          # ~560 行，设计 Token + 组件类 + 动画
│   └── tailwind.config.js
│
├── docs/
│   ├── API_DOCS.md              # 完整 API 参考
│   ├── DATABASE_DESIGN.md       # 数据库架构（ER 图 + 索引）
│   ├── DEPLOYMENT_GUIDE.md      # 部署指南
│   └── USER_MANUAL.md           # 用户手册
│
└── .github/workflows/
    └── ci-cd.yml                # CI/CD 流水线
```

---

## 八、测试

**后端测试**（`backend/tests/test_api.py`）：
- 使用 SQLite 内存数据库 + FastAPI TestClient
- 4 个冒烟测试：获取分类、获取项目、搜索、获取趋势

**前端测试**：项目配置了 lint（`npm run lint`），当前无单元测试。

---

## 九、已知架构决策和注意事项

1. **纯客户端数据获取**：无 SSR/SSG，初始加载时项目网格为空直到 API 响应
2. **无用户认证**：`user_id` 是客户端传递的字符串参数，无登录/会话/Token
3. **收藏客户端优先**：`toggleFavorite` 管理 localStorage 数组，后端 API 接口存在但前端未使用
4. **无 CMS**：种子数据是唯一数据来源，添加/修改项目需编辑 `init_db.py`
5. **错误处理缺失**：`index.tsx` 没有检查或渲染 Redux state 中的 `error` 字段
6. **前端无单元测试**：仅配置了 lint，需补充测试覆盖
