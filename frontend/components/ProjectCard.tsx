import React from 'react';
import { Heart, Clock, Code, ChevronRight } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, fetchProjectById, setSelectedProject } from '../store/projectSlice';
import type { Project } from '../store/projectSlice';
import type { AppDispatch, RootState } from '../store/store';

interface ProjectCardProps {
  project: Project;
  onShowDetail: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onShowDetail }) => {
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
      className="card-base group cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
    >
      {/* Top gradient accent line */}
      <div className="h-[2px] bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors duration-300 leading-snug">
            {project.name}
          </h3>
          <button
            onClick={handleFavoriteClick}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-300 ${
              isFavorite
                ? 'text-rose-400 bg-rose-500/10'
                : 'text-text-tertiary hover:text-rose-400 hover:bg-rose-500/5'
            }`}
            aria-label={isFavorite ? '取消收藏' : '收藏'}
          >
            <Heart className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* ── Description ── */}
        <p className="text-sm text-text-secondary opacity-80 leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* ── Core features pills ── */}
        {project.core_features && project.core_features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.core_features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-text-tertiary border border-white/[0.06]"
              >
                {feature}
              </span>
            ))}
            {project.core_features.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.03] text-text-tertiary opacity-60">
                +{project.core_features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Meta row ── */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <DifficultyBadge difficulty={project.difficulty} />
          <div className="flex items-center gap-1.5 text-text-tertiary text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{project.estimated_hours}h</span>
          </div>
        </div>

        {/* ── Tech stack ── */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
            {project.tech_stack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-brand-500/8 text-brand-400/90 border border-brand-500/15"
              >
                <Code className="w-3 h-3" />
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.03] text-text-tertiary opacity-60">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* ── View detail indicator ── */}
        <div className="flex items-center justify-end mt-3 text-xs text-text-tertiary opacity-50 group-hover:text-brand-400/60 transition-colors duration-300 gap-1">
          查看详情
          <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
