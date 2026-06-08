import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

const config: Record<string, { stars: number; label: string; txt: string; bg: string }> = {
  '初级': { stars: 1, label: '初级', txt: 'text-green', bg: 'bg-green-bg' },
  '中级': { stars: 2, label: '中级', txt: 'text-yellow', bg: 'bg-yellow-bg' },
  '高级': { stars: 3, label: '高级', txt: 'text-red', bg: 'bg-red-bg' },
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const c = config[difficulty] || config['初级'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/[0.08] ${c.txt} ${c.bg}`}
    >
      <span className="flex gap-[1px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <svg
            key={i}
            width="10"
            height="10"
            viewBox="0 0 12 12"
            className={i < c.stars ? 'fill-current opacity-100' : 'fill-current opacity-20'}
          >
            <path d="M6 1l1.5 3.2L11 4.7 8.5 7.2l.7 3.8L6 9.2 2.8 11l.7-3.8L1 4.7l3.5-.5L6 1z" />
          </svg>
        ))}
      </span>
      {c.label}
    </span>
  );
};

export default DifficultyBadge;
