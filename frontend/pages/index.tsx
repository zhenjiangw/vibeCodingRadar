import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, loadFavorites } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import TrendingSection from '../components/TrendingSection';
import { Sparkles, Zap, Rocket, ChevronDown, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const searchQuery = useSelector((state: RootState) => state.projects.searchQuery);
  const selectedCategory = useSelector((state: RootState) => state.projects.selectedCategory);
  const selectedDifficulty = useSelector((state: RootState) => state.projects.selectedDifficulty);
  const favorites = useSelector((state: RootState) => state.projects.favorites);
  const isLoading = useSelector((state: RootState) => state.projects.isLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjects({
      categoryId: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      search: searchQuery || undefined,
    }));
  }, [dispatch, selectedCategory, selectedDifficulty, searchQuery]);

  useEffect(() => {
    // Trigger hero entrance animation on mount
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const displayedProjects = showFavorites
    ? projects.filter(p => favorites.includes(p.id))
    : projects;

  return (
    <div className="min-h-screen bg-surface-deep">
      <Header onShowFavorites={() => setShowFavorites(!showFavorites)} />

      <main className="relative z-10">
        {/* ════════════════════════════════════
             HERO SECTION
           ════════════════════════════════════ */}
        <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 px-4 overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 md:w-96 md:h-96 bg-brand-500/8 rounded-full blur-[100px]" />
            <div className="absolute top-40 left-1/3 w-48 h-48 md:w-64 md:h-64 bg-accent-500/6 rounded-full blur-[80px]" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div
              className={`flex justify-center mb-6 transition-all duration-700 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-accent-500/10 rounded-2xl blur-xl" />
                <div className="relative p-4 bg-gradient-to-br from-brand-600/30 to-brand-500/10 rounded-2xl border border-white/[0.08]">
                  <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 transition-all duration-700 delay-100 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              发现你的{' '}
              <span className="text-gradient-strong">第一个编程项目</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base md:text-lg text-text-secondary opacity-80 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              根据你的兴趣和技能水平，找到最适合你的入门项目。
              从好玩、好用到好搓，总有一款适合你！
            </p>

            {/* Stats row */}
            <div
              className={`flex flex-wrap justify-center gap-6 md:gap-8 transition-all duration-700 delay-300 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <StatItem icon={<Zap className="w-4 h-4" />} label="精选项目" value="100+" color="text-green" />
              <StatItem icon={<Rocket className="w-4 h-4" />} label="从零开始" value="全栈" color="text-brand-400" />
              <StatItem icon={<BookOpen className="w-4 h-4" />} label="AI 辅助" value="智能" color="text-accent-400" />
            </div>

            {/* Scroll indicator */}
            <div
              className={`flex justify-center mt-10 transition-all duration-700 delay-500 ${
                heroVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="animate-float">
                <ChevronDown className="w-5 h-5 text-text-tertiary opacity-40" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
             CATEGORY FILTER
           ════════════════════════════════════ */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <CategoryFilter />
          </div>
        </section>

        {/* ════════════════════════════════════
             PROJECTS GRID
           ════════════════════════════════════ */}
        <section className="py-8 px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            {showFavorites && (
              <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent-400 to-rose-400" />
                  <h2 className="text-lg font-bold text-white">我的收藏</h2>
                </div>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-200"
                >
                  返回全部
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
                </div>
                <p className="text-sm text-text-tertiary font-mono">加载中…</p>
              </div>
            ) : displayedProjects.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Sparkles className="w-8 h-8 text-text-tertiary opacity-40" />
                </div>
                <p className="text-base text-text-tertiary">暂无项目</p>
                <p className="text-sm text-text-tertiary opacity-60">
                  {showFavorites ? '收藏夹还是空的' : '换个条件试试？'}
                </p>
              </div>
            ) : (
              /* Projects grid with staggered entrance */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {displayedProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${idx * 0.04}s`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <ProjectCard
                      project={project}
                      onShowDetail={() => setIsModalOpen(true)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════
             TRENDING SECTION
           ════════════════════════════════════ */}
        <TrendingSection />

        {/* ════════════════════════════════════
             FOOTER
           ════════════════════════════════════ */}
        <footer className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-text-tertiary">
                  Vibe Coding 雷达
                </span>
              </div>
              <p className="text-xs text-text-tertiary opacity-50 font-mono">
                发现你的第一个编程项目
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Project detail drawer ── */}
      <ProjectModal isOpen={isModalOpen} />
    </div>
  );
};

/* ── Stat item helper ── */
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
    <span className={color}>{icon}</span>
    <span className="text-sm text-text-secondary">
      <span className={`font-semibold ${color}`}>{value}</span>
      {' '}
      {label}
    </span>
  </div>
);

export default HomePage;
