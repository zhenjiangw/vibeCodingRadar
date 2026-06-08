import React, { useState, useCallback } from 'react';
import { Search, Radar, Heart, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';

interface HeaderProps {
  onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowFavorites }) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.projects.searchQuery);
  const favoritesCount = useSelector((state: RootState) => state.projects.favorites.length);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-surface-deep/80 backdrop-blur-2xl border-b border-white/[0.06]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* ── Logo ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-accent-500/20 rounded-xl blur-lg" />
              <div className="relative p-2 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl">
                <Radar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white tracking-tight">
                <span className="text-gradient">Vibe Coding</span>
                <span className="text-white/70"> 雷达</span>
              </h1>
              <p className="text-[11px] text-text-tertiary tracking-wide font-mono">
                发现你的第一个编程项目
              </p>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="flex-1 max-w-lg mx-auto md:mx-8">
            <div
              className={`relative group transition-all duration-300 ${
                searchFocused ? 'scale-[1.02]' : ''
              }`}
            >
              <div
                className={`absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 blur-sm ${
                  searchFocused
                    ? 'opacity-100 bg-gradient-to-r from-brand-500/30 to-accent-500/20'
                    : 'group-hover:opacity-60 bg-white/[0.04]'
                }`}
              />
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="搜索项目、技术栈…"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-text-tertiary
                    focus:outline-none focus:border-brand-500/40 focus:bg-white/[0.07]
                    transition-all duration-300"
                />
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={() => dispatch(setSearchQuery(''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            <button
              onClick={onShowFavorites}
              className="relative p-2.5 rounded-xl text-text-tertiary hover:text-accent-400 hover:bg-white/[0.06] transition-all duration-300 group"
              title="我的收藏"
            >
              <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-accent-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full
                  animate-fade-in-scale shadow-lg shadow-accent-500/30"
                  style={{ width: '18px', height: '18px' }}
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>

            {/* Sparkle accent icon (decorative) */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Sparkles className="w-4 h-4 text-accent-400/60" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
