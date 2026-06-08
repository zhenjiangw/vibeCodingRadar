import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

const config: Record<string, { label: string; color: string; bg: string }> = {
  '初级': { label: '初级', color: 'var(--green)', bg: 'var(--green-bg)' },
  '中级': { label: '中级', color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
  '高级': { label: '高级', color: 'var(--red)', bg: 'var(--red-bg)' },
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const c = config[difficulty] || config['初级'];

  return (
    <span
      className="badge-minimal"
      style={{ color: c.color, background: c.bg }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
};

export default DifficultyBadge;
