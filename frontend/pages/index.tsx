import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, loadFavorites, setSelectedProject } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import type { TrendingProject } from '../store/projectSlice';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import TrendingSection from '../components/TrendingSection';

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

  const handleTrendingDetail = useCallback((tp: TrendingProject) => {
    dispatch(setSelectedProject({
      id: tp.id,
      name: tp.name,
      slug: tp.full_name?.toLowerCase().replace(/[\/\s]/g, '-') || tp.name.toLowerCase().replace(/\s/g, '-'),
      description: tp.description,
      core_features: [],
      difficulty: '',
      estimated_hours: 0,
      tech_stack: [tp.language || ''].filter(Boolean),
      category_id: 0,
      target: '',
      tech_recommendations: { main: [], auxiliary: [] },
      implementation_steps: [],
      expected_outcomes: { features: [], learning: [] },
      is_featured: false,
      created_at: '',
      updated_at: '',
      url: tp.url,
      language: tp.language,
      full_name: tp.full_name,
      stars_24h: tp.stars_24h,
      stars_7d: tp.stars_7d,
      total_stars: tp.total_stars,
      forks: tp.forks,
      open_issues: tp.open_issues,
      __source: 'trending',
    }));
    setIsModalOpen(true);
  }, [dispatch]);

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

  const displayedProjects = showFavorites
    ? projects.filter(p => favorites.includes(p.id))
    : projects;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header onShowFavorites={() => setShowFavorites(!showFavorites)} isShowFavorites={showFavorites} />

      <main>
        {/* ═══════════════════════════════════════════════
             VIBE CODING HERO
             ═══════════════════════════════════════════════ */}
        <section>
          <div className="container-minimal py-12 md:py-16">
            <div className="text-center">
              <p
                className="font-[var(--font-display)] font-bold text-[var(--fg)] leading-none tracking-[-0.03em] select-none"
                style={{ fontSize: 'clamp(60px, 12vw, 140px)' }}
              >
                Vibe Coding<span className="text-[var(--accent)]">.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
             PROJECT GALLERY
             ═══════════════════════════════════════════════ */}
        <section>
          <div className="container-minimal" style={{ paddingTop: 'clamp(32px,5vw,56px)', paddingBottom: '48px' }}>
            {/* Section header */}
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <span className="section-label mb-1 block">项目库</span>
                <h2 className="text-2xl font-bold text-[var(--fg)] tracking-tight">
                  浏览所有项目
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  找到属于你的下一个编码项目
                </p>
              </div>
            </div>

            {/* Category filter */}
            <div className="mb-8">
              <CategoryFilter />
            </div>

            {/* Favorites header */}
            {showFavorites && (
              <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[var(--accent)]" />
                  <h3 className="text-[15px] font-bold text-[var(--fg)]">我的收藏</h3>
                </div>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  返回全部
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="spinner" />
                <p className="text-sm font-mono text-[var(--muted)]">加载中…</p>
              </div>
            ) : displayedProjects.length === 0 ? (
              /* Empty state */
              <div className="empty-state">
                <div className="empty-state-icon">
                  <span className="w-5 h-5 inline-flex items-center justify-center text-[var(--faint)] font-mono text-sm">∅</span>
                </div>
                <p className="text-base text-[var(--muted)] font-medium">暂无项目</p>
                <p className="text-sm text-[var(--faint)]">
                  {showFavorites ? '收藏夹还是空的' : '换个条件试试？'}
                </p>
              </div>
            ) : (
              /* Projects grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="animate-fade-in-up h-full"
                    style={{
                      animationDelay: `${idx * 0.025}s`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <ProjectCard
                      project={project}
                      index={idx}
                      onShowDetail={() => setIsModalOpen(true)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trending Section */}
        <TrendingSection onShowDetail={handleTrendingDetail} />

        {/* ═══════════════════════════════════════════════
             FOOTER
             ═══════════════════════════════════════════════ */}
        <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="container-minimal py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-xs font-mono text-[var(--faint)]">
                  Vibe Coding Radar
                </span>
              </div>
              <p className="text-[11px] font-mono text-[var(--faint)]">
                {new Date().getFullYear()} · 发现 · 学习 · 创造
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Project detail drawer ── */}
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HomePage;
