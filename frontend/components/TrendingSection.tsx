import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProjects } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import { TrendingUp, Star, GitBranch, ExternalLink, ArrowUp, Flame } from 'lucide-react';

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
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ── Section header ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-xl blur-lg" />
            <div className="relative p-2.5 bg-gradient-to-br from-yellow-600/80 to-orange-500/80 rounded-xl border border-yellow-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              GitHub 明星项目
            </h2>
            <p className="text-sm text-text-tertiary mt-0.5">
              本周增长最快的开源项目
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <TrendingUp className="w-4 h-4 text-yellow" />
            <span className="text-xs text-text-tertiary font-mono">实时趋势</span>
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
              className={`group card-base p-5 no-underline
                animate-fade-in-up ${isVisible ? '' : 'opacity-0'}`}
              style={{
                animationDelay: isVisible ? `${idx * 0.06}s` : '0s',
                animationFillMode: 'backwards',
              }}
            >
              {/* ── Card header ── */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* GitHub-style icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-brand-400 transition-colors duration-300">
                    {project.name}
                  </h3>
                </div>
                <ExternalLink className="w-4 h-4 text-text-tertiary opacity-40 flex-shrink-0 group-hover:text-brand-400 transition-colors duration-300" />
              </div>

              {/* ── Description ── */}
              <p className="text-sm text-text-secondary opacity-80 leading-relaxed line-clamp-2 mb-4">
                {project.description || 'No description provided.'}
              </p>

              {/* ── Stats ── */}
              <div className="flex items-center justify-between gap-4">
                {/* Language */}
                {project.language && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-brand-400/60" />
                    <span className="text-xs font-mono text-text-tertiary truncate">{project.language}</span>
                  </div>
                )}

                {/* Stars */}
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1 text-text-tertiary">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{formatNumber(project.total_stars)}</span>
                  </div>
                  {project.forks > 0 && (
                    <div className="flex items-center gap-1 text-text-tertiary">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{formatNumber(project.forks)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Weekly growth ── */}
              {project.stars_7d > 0 && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
                  <ArrowUp className="w-3.5 h-3.5 text-green" />
                  <span className="text-xs font-mono font-medium text-green">
                    +{formatNumber(project.stars_7d)}
                  </span>
                  <span className="text-[10px] text-text-tertiary opacity-60">本周增长</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
