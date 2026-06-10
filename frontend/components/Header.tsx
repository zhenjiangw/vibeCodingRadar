import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import type { RootState } from '../store/store';

interface HeaderProps {
  onShowFavorites: () => void;
  isShowFavorites?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShowFavorites, isShowFavorites }) => {
  const favoritesCount = useSelector((state: RootState) => state.projects.favorites.length);

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[var(--border-soft)]">
      <div className="container-minimal">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Logo + 标题 — 整体点击回到首页 */}
          <Link href="/" className="flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                {/* 外圈 */}
                <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="1.2" opacity="0.35" />
                {/* 中圈 */}
                <circle cx="16" cy="16" r="9" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
                {/* 十字准线 — 横 */}
                <line x1="2" y1="16" x2="30" y2="16" stroke="var(--accent)" strokeWidth="0.8" opacity="0.15" />
                {/* 十字准线 — 纵 */}
                <line x1="16" y1="2" x2="16" y2="30" stroke="var(--accent)" strokeWidth="0.8" opacity="0.15" />
                {/* 中心点 */}
                <circle cx="16" cy="16" r="3" fill="var(--accent)" opacity="0.8" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--fg)] hidden sm:block"
              style={{ fontFamily: '"Outfit", Inter, system-ui, sans-serif' }}>
              Vibe Coding Radar
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onShowFavorites}
              className="relative p-3 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-[var(--motion-fast)]"
              title="我的收藏"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                style={{ color: isShowFavorites ? '#2563eb' : undefined }}
              >
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                  fill={isShowFavorites ? '#2563eb' : 'none'}
                  stroke={isShowFavorites ? '#2563eb' : 'currentColor'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {favoritesCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-[var(--accent)] text-white text-[11px] font-bold flex items-center justify-center"
                  style={{ minWidth: '18px', height: '18px', padding: '0 4px', borderRadius: 'var(--radius-sm)' }}
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
