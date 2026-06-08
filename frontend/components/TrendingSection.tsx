import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProjects } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Star, GitBranch, TrendingUp } from 'lucide-react';

const TrendingSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const trendingProjects = useSelector((state: RootState) => state.projects.trendingProjects);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
          {trendingProjects.map((project, idx) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`minimal-card no-underline block
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
            </a>
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
