import React from 'react';
import { Heart, Clock, Code, ArrowUpRight } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, fetchProjectById, setSelectedProject } from '../store/projectSlice';
import type { Project } from '../store/projectSlice';
import type { AppDispatch, RootState } from '../store/store';

interface ProjectCardProps {
  project: Project;
  index: number;
  onShowDetail: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onShowDetail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.projects.favorites);
  const isFavorite = favorites.includes(project.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(project.id));
  };

  const handleCardClick = async () => {
    await dispatch(fetchProjectById(project.id));
    dispatch(setSelectedProject(project));
    onShowDetail();
  };

  return (
    <article
      onClick={handleCardClick}
      className="minimal-card group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
    >
      {/* ── Top row: badge + hours ── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <DifficultyBadge difficulty={project.difficulty} />
        <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{project.estimated_hours}h</span>
        </div>
      </div>

      {/* ── Title ── */}
      <h3 className="text-[15px] font-semibold text-[var(--fg)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors duration-[var(--motion-fast)]">
        {project.name}
      </h3>

      {/* ── Card body (flex-1 to fill space) ── */}
      <div className="card-body">
        {/* ── Description ── */}
        <p className="text-sm text-[var(--muted)] leading-relaxed truncate-2 mb-4">
          {project.description}
        </p>

        {/* ── Core features pills ── */}
        {project.core_features && project.core_features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.core_features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="tag-minimal">
                {feature}
              </span>
            ))}
            {project.core_features.length > 3 && (
              <span className="tag-minimal text-[var(--faint)]">
                +{project.core_features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Tech stack ── */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
            {project.tech_stack.slice(0, 4).map((tech, idx) => (
              <span key={idx} className="tag-minimal-code">
                <Code className="w-3 h-3" />
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="tag-minimal-code text-[var(--faint)]">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom row: favorite + detail arrow ── */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-[var(--radius-sm)] transition-all duration-[var(--motion-fast)] ${
            isFavorite
              ? 'text-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--accent)]'
          }`}
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Detail arrow */}
        <div className="flex items-center gap-1.5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-[var(--motion-fast)]">
          <span className="text-xs font-medium font-[var(--font-display)]">详情</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
