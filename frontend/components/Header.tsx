import React from 'react';
import { Heart, Radar } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface HeaderProps {
  onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowFavorites }) => {
  const favoritesCount = useSelector((state: RootState) => state.projects.favorites.length);

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="container-minimal">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center">
              <Radar className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-[var(--fg)] hidden sm:block">
              Vibe Coding Radar
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onShowFavorites}
              className="relative p-2 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-[var(--motion-fast)]"
              title="我的收藏"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[var(--accent)] fill-current' : ''}`} />
              {favoritesCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ minWidth: '16px', height: '16px', padding: '0 3px', borderRadius: 'var(--radius-sm)' }}
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
