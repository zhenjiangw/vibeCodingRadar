from .database import engine, Base, SessionLocal
from .models import Category, Project, TrendingProject

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        if not db.query(Category).first():
            categories = [
                Category(
                    name="最好玩",
                    slug="most-fun",
                    description="创意性与娱乐价值高的项目",
                    icon="gamepad-2"
                ),
                Category(
                    name="最好用",
                    slug="most-useful",
                    description="实用性强、解决实际问题的项目",
                    icon="wrench"
                ),
                Category(
                    name="最好搓",
                    slug="easiest",
                    description="实现难度低、适合入门的项目",
                    icon="baby"
                )
            ]
            db.add_all(categories)
            db.commit()
        
        if not db.query(Project).first():
            projects = [
                Project(
                    name="个人博客系统",
                    slug="personal-blog",
                    description="使用现代技术栈构建的个人博客平台，支持Markdown编辑、分类管理和评论功能",
                    core_features=["Markdown编辑", "文章分类", "评论系统", "SEO优化", "响应式设计"],
                    difficulty="初级",
                    estimated_hours=15,
                    tech_stack=["Next.js", "React", "Tailwind CSS", "MongoDB", "Vercel"],
                    category_id=3,
                    target="创建一个功能完整的个人博客系统，支持文章发布、管理和展示",
                    tech_recommendations={"主技术": ["Next.js", "React"], "辅助技术": ["Tailwind CSS", "MongoDB", "Vercel"]},
                    implementation_steps=[
                        "初始化Next.js项目，配置Tailwind CSS",
                        "设计数据库模型，创建文章、分类、评论表",
                        "实现文章CRUD功能和Markdown编辑器",
                        "实现分类管理和标签系统",
                        "添加评论功能和SEO优化",
                        "部署到Vercel并配置域名"
                    ],
                    expected_outcomes={"功能": ["完整的博客系统", "Markdown编辑", "评论系统"], "学习收获": ["Next.js开发", "数据库设计", "SEO优化"]}
                ),
                Project(
                    name="待办事项应用",
                    slug="todo-app",
                    description="支持多设备同步的智能待办事项管理应用",
                    core_features=["任务列表", "优先级管理", "截止日期提醒", "数据同步", "统计分析"],
                    difficulty="初级",
                    estimated_hours=10,
                    tech_stack=["React", "TypeScript", "Firebase", "Tailwind CSS"],
                    category_id=3,
                    target="创建一个跨平台待办事项应用，支持数据同步和智能提醒",
                    tech_recommendations={"主技术": ["React", "TypeScript"], "辅助技术": ["Firebase", "Tailwind CSS"]},
                    implementation_steps=[
                        "初始化React + TypeScript项目",
                        "配置Firebase认证和数据库",
                        "实现任务CRUD功能",
                        "添加优先级和截止日期功能",
                        "实现数据同步和离线支持",
                        "添加统计分析功能"
                    ],
                    expected_outcomes={"功能": ["任务管理", "数据同步", "统计分析"], "学习收获": ["React Hooks", "Firebase", "TypeScript"]}
                ),
                Project(
                    name="天气查询应用",
                    slug="weather-app",
                    description="实时天气查询和预报应用，支持多城市切换",
                    core_features=["实时天气", "7天预报", "城市切换", "天气预警", "精美UI"],
                    difficulty="初级",
                    estimated_hours=8,
                    tech_stack=["Vue.js", "OpenWeatherMap API", "Tailwind CSS"],
                    category_id=1,
                    target="创建一个美观的天气查询应用，展示实时天气信息",
                    tech_recommendations={"主技术": ["Vue.js"], "辅助技术": ["OpenWeatherMap API", "Tailwind CSS"]},
                    implementation_steps=[
                        "初始化Vue.js项目",
                        "注册OpenWeatherMap API密钥",
                        "实现天气数据获取和展示",
                        "添加城市搜索和切换功能",
                        "实现7天预报展示",
                        "优化UI设计和动画效果"
                    ],
                    expected_outcomes={"功能": ["实时天气", "城市切换", "7天预报"], "学习收获": ["Vue.js开发", "API调用", "响应式设计"]}
                ),
                Project(
                    name="在线代码编辑器",
                    slug="code-editor",
                    description="支持多种编程语言的在线代码编辑器，带语法高亮和实时预览",
                    core_features=["语法高亮", "代码格式化", "实时预览", "多语言支持", "代码分享"],
                    difficulty="中级",
                    estimated_hours=30,
                    tech_stack=["React", "Monaco Editor", "Node.js", "Express"],
                    category_id=1,
                    target="创建一个功能强大的在线代码编辑器，支持多种语言",
                    tech_recommendations={"主技术": ["React", "Node.js"], "辅助技术": ["Monaco Editor", "Express"]},
                    implementation_steps=[
                        "初始化React项目",
                        "集成Monaco Editor组件",
                        "实现语法高亮和代码格式化",
                        "添加代码运行和预览功能",
                        "实现代码分享功能",
                        "部署到服务器"
                    ],
                    expected_outcomes={"功能": ["代码编辑", "实时预览", "代码分享"], "学习收获": ["Monaco Editor", "代码执行", "Web安全"]}
                ),
                Project(
                    name="电商管理后台",
                    slug="ecommerce-admin",
                    description="完整的电商管理后台系统，支持商品管理、订单处理和数据分析",
                    core_features=["商品管理", "订单处理", "用户管理", "数据分析", "权限控制"],
                    difficulty="高级",
                    estimated_hours=50,
                    tech_stack=["React", "Redux", "Node.js", "PostgreSQL", "Ant Design"],
                    category_id=2,
                    target="创建一个企业级电商管理后台系统",
                    tech_recommendations={"主技术": ["React", "Node.js"], "辅助技术": ["Redux", "PostgreSQL", "Ant Design"]},
                    implementation_steps=[
                        "设计数据库模型和API接口",
                        "初始化React + Redux项目",
                        "实现商品管理模块",
                        "实现订单处理模块",
                        "实现用户管理和权限控制",
                        "添加数据分析仪表盘",
                        "部署和性能优化"
                    ],
                    expected_outcomes={"功能": ["商品管理", "订单处理", "数据分析"], "学习收获": ["企业级应用", "权限管理", "性能优化"]}
                ),
                Project(
                    name="即时通讯应用",
                    slug="chat-app",
                    description="支持一对一和群组聊天的即时通讯应用",
                    core_features=["即时消息", "群组聊天", "文件分享", "在线状态", "消息通知"],
                    difficulty="中级",
                    estimated_hours=40,
                    tech_stack=["React Native", "Firebase", "TypeScript"],
                    category_id=1,
                    target="创建一个跨平台即时通讯应用",
                    tech_recommendations={"主技术": ["React Native", "TypeScript"], "辅助技术": ["Firebase"]},
                    implementation_steps=[
                        "初始化React Native项目",
                        "配置Firebase实时数据库",
                        "实现用户认证和注册",
                        "实现一对一聊天功能",
                        "添加群组聊天功能",
                        "实现文件分享和消息通知",
                        "测试和发布"
                    ],
                    expected_outcomes={"功能": ["即时消息", "群组聊天", "文件分享"], "学习收获": ["React Native", "实时通信", "移动开发"]}
                ),
                Project(
                    name="笔记管理应用",
                    slug="note-app",
                    description="支持富文本编辑和标签分类的笔记管理应用",
                    core_features=["富文本编辑", "标签分类", "搜索功能", "数据导出", "深色模式"],
                    difficulty="初级",
                    estimated_hours=12,
                    tech_stack=["React", "Quill", "IndexedDB", "Tailwind CSS"],
                    category_id=2,
                    target="创建一个功能完善的笔记管理应用",
                    tech_recommendations={"主技术": ["React"], "辅助技术": ["Quill", "IndexedDB"]},
                    implementation_steps=[
                        "初始化React项目",
                        "集成Quill富文本编辑器",
                        "实现笔记CRUD功能",
                        "添加标签分类和搜索功能",
                        "实现数据导出功能",
                        "添加深色模式支持"
                    ],
                    expected_outcomes={"功能": ["富文本编辑", "标签分类", "搜索"], "学习收获": ["富文本编辑", "IndexedDB", "PWA"]}
                ),
                Project(
                    name="健身计划追踪器",
                    slug="fitness-tracker",
                    description="帮助用户制定和追踪健身计划的应用",
                    core_features=["计划制定", "进度追踪", "数据统计", "运动指导", "社交分享"],
                    difficulty="中级",
                    estimated_hours=25,
                    tech_stack=["React", "D3.js", "Node.js", "MongoDB"],
                    category_id=2,
                    target="创建一个专业的健身计划追踪应用",
                    tech_recommendations={"主技术": ["React", "Node.js"], "辅助技术": ["D3.js", "MongoDB"]},
                    implementation_steps=[
                        "设计数据库模型",
                        "初始化React项目",
                        "实现计划制定功能",
                        "添加进度追踪和数据可视化",
                        "实现运动指导模块",
                        "添加社交分享功能"
                    ],
                    expected_outcomes={"功能": ["计划制定", "进度追踪", "数据可视化"], "学习收获": ["D3.js", "数据可视化", "健康应用"]}
                ),
                Project(
                    name="URL短链接服务",
                    slug="url-shortener",
                    description="支持自定义短链接的URL缩短服务",
                    core_features=["URL缩短", "自定义后缀", "访问统计", "过期设置", "批量处理"],
                    difficulty="初级",
                    estimated_hours=8,
                    tech_stack=["FastAPI", "Redis", "PostgreSQL"],
                    category_id=2,
                    target="创建一个高性能的URL短链接服务",
                    tech_recommendations={"主技术": ["FastAPI"], "辅助技术": ["Redis", "PostgreSQL"]},
                    implementation_steps=[
                        "初始化FastAPI项目",
                        "设计数据库模型",
                        "实现URL缩短算法",
                        "添加自定义后缀功能",
                        "实现访问统计",
                        "添加批量处理功能"
                    ],
                    expected_outcomes={"功能": ["URL缩短", "访问统计", "批量处理"], "学习收获": ["FastAPI", "Redis", "算法设计"]}
                ),
                Project(
                    name="AI图像生成器",
                    slug="ai-image-generator",
                    description="基于AI的图像生成应用，支持多种风格",
                    core_features=["文本生成图像", "风格转换", "图片编辑", "高清导出", "历史记录"],
                    difficulty="中级",
                    estimated_hours=20,
                    tech_stack=["React", "Stable Diffusion API", "Node.js"],
                    category_id=1,
                    target="创建一个基于AI的图像生成应用",
                    tech_recommendations={"主技术": ["React", "Node.js"], "辅助技术": ["Stable Diffusion API"]},
                    implementation_steps=[
                        "注册Stable Diffusion API密钥",
                        "初始化React项目",
                        "实现文本生成图像功能",
                        "添加风格转换功能",
                        "实现图片编辑功能",
                        "添加历史记录和导出功能"
                    ],
                    expected_outcomes={"功能": ["AI图像生成", "风格转换", "图片编辑"], "学习收获": ["AI API", "图像处理", "创意应用"]}
                ),
                Project(
                    name="股票行情追踪器",
                    slug="stock-tracker",
                    description="实时股票行情追踪和投资组合管理应用",
                    core_features=["实时行情", "投资组合", "价格预警", "数据分析", "新闻资讯"],
                    difficulty="中级",
                    estimated_hours=35,
                    tech_stack=["React", "Alpha Vantage API", "Recharts", "Node.js"],
                    category_id=2,
                    target="创建一个专业的股票行情追踪应用",
                    tech_recommendations={"主技术": ["React", "Node.js"], "辅助技术": ["Alpha Vantage API", "Recharts"]},
                    implementation_steps=[
                        "注册Alpha Vantage API",
                        "初始化React项目",
                        "实现实时行情展示",
                        "添加投资组合管理",
                        "实现价格预警功能",
                        "添加数据分析和新闻资讯"
                    ],
                    expected_outcomes={"功能": ["实时行情", "投资组合", "数据分析"], "学习收获": ["金融API", "数据可视化", "实时数据"]}
                ),
                Project(
                    name="音乐播放器",
                    slug="music-player",
                    description="支持在线音乐播放和歌单管理的音乐应用",
                    core_features=["音乐播放", "歌单管理", "歌词显示", "音效调节", "社交分享"],
                    difficulty="中级",
                    estimated_hours=28,
                    tech_stack=["React", "Web Audio API", "Spotify API", "Tailwind CSS"],
                    category_id=1,
                    target="创建一个功能完善的音乐播放器应用",
                    tech_recommendations={"主技术": ["React"], "辅助技术": ["Web Audio API", "Spotify API"]},
                    implementation_steps=[
                        "注册Spotify API",
                        "初始化React项目",
                        "实现音乐播放控制",
                        "添加歌单管理功能",
                        "实现歌词显示",
                        "添加音效调节和社交分享"
                    ],
                    expected_outcomes={"功能": ["音乐播放", "歌单管理", "歌词显示"], "学习收获": ["Web Audio API", "音乐流媒体", "UI/UX"]}
                )
            ]
            db.add_all(projects)
            db.commit()
        
        print("Database initialized successfully")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
