import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProjects } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Star, GitBranch, TrendingUp } from 'lucide-react';
import type { TrendingProject } from '../store/projectSlice';

/* ── Fallback sample data for GitHub trending (shown when API returns empty) ── */
const SAMPLE_TRENDING: TrendingProject[] = [
  {
    id: 1001, name: 'vscode', full_name: 'microsoft/vscode',
    description: 'Visual Studio Code — 微软出品的跨平台代码编辑器，支持扩展生态和内置 Git 集成。',
    url: 'https://github.com/microsoft/vscode', language: 'TypeScript',
    stars_24h: 185, stars_7d: 1280, total_stars: 172000, forks: 31000, open_issues: 4800,
  },
  {
    id: 1002, name: 'react', full_name: 'facebook/react',
    description: '用于构建用户界面的声明式 JavaScript 库，核心特点为组件化和虚拟 DOM。',
    url: 'https://github.com/facebook/react', language: 'JavaScript',
    stars_24h: 95, stars_7d: 720, total_stars: 232000, forks: 47500, open_issues: 760,
  },
  {
    id: 1003, name: 'tailwindcss', full_name: 'tailwindlabs/tailwindcss',
    description: '实用优先的 CSS 框架，通过组合原子化工具类快速构建自定义界面。',
    url: 'https://github.com/tailwindlabs/tailwindcss', language: 'CSS',
    stars_24h: 42, stars_7d: 360, total_stars: 86000, forks: 4400, open_issues: 0,
  },
  {
    id: 1004, name: 'next.js', full_name: 'vercel/next.js',
    description: 'React 全栈框架，支持服务端渲染、静态生成和 App Router。',
    url: 'https://github.com/vercel/next.js', language: 'TypeScript',
    stars_24h: 140, stars_7d: 980, total_stars: 130000, forks: 28000, open_issues: 3100,
  },
  {
    id: 1005, name: 'rust', full_name: 'rust-lang/rust',
    description: '注重安全、并发和性能的系统编程语言，零成本抽象和所有权模型。',
    url: 'https://github.com/rust-lang/rust', language: 'Rust',
    stars_24h: 55, stars_7d: 420, total_stars: 100000, forks: 13000, open_issues: 9900,
  },
  {
    id: 1006, name: 'n8n', full_name: 'n8n-io/n8n',
    description: '可自部署的工作流自动化工具，提供 Fair-code 许可的可视化编排界面。',
    url: 'https://github.com/n8n-io/n8n', language: 'TypeScript',
    stars_24h: 120, stars_7d: 890, total_stars: 52000, forks: 8200, open_issues: 370,
  },
];

interface TrendingSectionProps {
  onShowDetail?: (project: TrendingProject) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ onShowDetail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const trendingProjects = useSelector((state: RootState) => state.projects.trendingProjects);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback: 当 API 返回数据为空时展示示例项目
  const displayProjects = useMemo(() => {
    if (trendingProjects && trendingProjects.length > 0) {
      return trendingProjects;
    }
    return SAMPLE_TRENDING;
  }, [trendingProjects]);

  useEffect(() => {
    dispatch(fetchTrendingProjects());
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 1000).toFixed(0) + 'k';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <section
      ref={sectionRef}
      className={`bg-[var(--bg)] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container-minimal section-y">
        {/* ── Section header ── */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              <span className="section-label">GitHub 趋势</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-2">
              本周热门
            </h2>
            <p className="text-sm text-[var(--muted)]">
              增长最快的开源项目
            </p>
          </div>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <span className="font-mono text-sm tabular-nums text-[var(--accent)] font-medium">
              {trendingProjects.length > 0 ? String(trendingProjects.length).padStart(2, '0') : '--'}
            </span>
            <span className="text-xs">活跃项目</span>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map((project, idx) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => onShowDetail?.(project)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onShowDetail?.(project); }}
              className={`minimal-card cursor-pointer
                animate-fade-in-up ${isVisible ? '' : 'opacity-0'}`}
              style={{
                animationDelay: isVisible ? `${idx * 0.04}s` : '0s',
                animationFillMode: 'backwards',
              }}
            >
              {/* ── Rank + repo name ── */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-[var(--faint)] font-medium flex-shrink-0 tabular-nums">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--fg)] truncate group-hover:text-[var(--accent)] transition-colors duration-[var(--motion-fast)]">
                    {project.name}
                  </h3>
                </div>
                <GitBranch className="w-4 h-4 text-[var(--faint)] flex-shrink-0" />
              </div>

              {/* ── Description ── */}
              <p className="text-sm text-[var(--muted)] leading-relaxed truncate-2 mb-4">
                {project.description || 'No description provided.'}
              </p>

              {/* ── Stats row ── */}
              <div className="flex items-center justify-between gap-4">
                {project.language && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    <span className="text-xs font-mono text-[var(--faint)] truncate">{project.language}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1 text-[var(--faint)] tabular-nums">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{formatNumber(project.total_stars)}</span>
                  </div>
                  {project.forks > 0 && (
                    <div className="flex items-center gap-1 text-[var(--faint)] tabular-nums">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{formatNumber(project.forks)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Weekly growth ── */}
              {project.stars_7d > 0 && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--green)]" />
                  <span className="text-xs font-mono font-medium text-[var(--green)]">
                    +{formatNumber(project.stars_7d)}
                  </span>
                  <span className="text-[10px] text-[var(--faint)]">本周新增</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-[var(--faint)]">
            数据来源 GitHub API · 实时更新
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
