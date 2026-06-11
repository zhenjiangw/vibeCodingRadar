import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, ChevronRight, Code, ExternalLink, Star, GitBranch, CircleDot } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedProject } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';

interface ProjectModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const project = useSelector((state: RootState) => state.projects.selectedProject);
  const trendingList = useSelector((state: RootState) => state.projects.trendingProjects);
  const isTrending = project?.__source === 'trending';
  const trendingRank = isTrending && project
    ? (trendingList.findIndex(p => p.id === project.id) + 1) || null
    : null;
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      dispatch(setSelectedProject(null));
      onClose?.();
    }, 300);
  }, [dispatch, onClose]);

  const handleCopyPrompt = async () => {
    const prompt = `
项目目标（SMART原则）：
${project?.target || ''}

技术栈建议：
主技术：${project?.tech_recommendations?.main?.join(', ') || project?.tech_stack?.slice(0, 2).join(', ') || ''}
辅助技术：${project?.tech_recommendations?.auxiliary?.join(', ') || project?.tech_stack?.slice(2).join(', ') || ''}

分阶段实施步骤：
${project?.implementation_steps?.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n') || ''}

预期成果：
功能：${project?.expected_outcomes?.features?.join(', ') || '待补充'}
学习收获：${project?.expected_outcomes?.learning?.join(', ') || '待补充'}
    `.trim();

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Keyboard escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-300 ease-[var(--ease-standard)] ${
          visible ? 'bg-black/30' : 'bg-transparent'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`relative w-full max-w-2xl h-full bg-[var(--surface)] border-l border-[var(--border)]
          transition-all duration-400 ease-[var(--ease-standard)] overflow-hidden ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-8 md:p-10">
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {isTrending ? (
                  <>
                    <span className="section-label">
                      Trending{trendingRank ? ` · #${String(trendingRank).padStart(2, '0')}` : ''}
                    </span>
                    {project.language && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span className="font-mono text-xs text-[var(--muted)]">
                          {project.language}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="section-label">Project · {String(project.id).padStart(2, '0')}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                    <span className="font-mono text-xs text-[var(--muted)]">
                      ~{project.estimated_hours}h
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--accent-soft)] transition-all duration-[var(--motion-fast)]"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Title section ── */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-4 leading-tight">
                {project.name}
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* ── GitHub link card ── */}
            {project.url && (
              <div className="mb-10">
                <span className="section-label block mb-3">代码仓库</span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] hover:border-[var(--accent)] transition-all duration-[var(--motion-fast)] group no-underline"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg)] flex items-center justify-center border border-[var(--border)]">
                        <Code className="w-5 h-5 text-[var(--fg)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors truncate">
                          {project.full_name || project.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-mono text-[var(--faint)]">GitHub</span>
                          <ExternalLink className="w-3 h-3 text-[var(--faint)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* ── Trending: 项目指标面板 ── */}
            {isTrending && (project.total_stars !== undefined || project.forks !== undefined || project.open_issues !== undefined) && (
              <div className="mb-8">
                <span className="section-label block mb-3">项目指标</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.total_stars !== undefined && project.total_stars > 0 && (
                    <div className="p-5 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-[var(--muted)] tracking-wide uppercase">
                          Stars
                        </span>
                        <Star className="w-3.5 h-3.5 text-[var(--faint)]" />
                      </div>
                      <p className="text-2xl font-mono font-bold tabular-nums text-[var(--fg)]">
                        {formatNumber(project.total_stars)}
                      </p>
                    </div>
                  )}
                  {project.forks !== undefined && project.forks > 0 && (
                    <div className="p-5 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-[var(--muted)] tracking-wide uppercase">
                          Forks
                        </span>
                        <GitBranch className="w-3.5 h-3.5 text-[var(--faint)]" />
                      </div>
                      <p className="text-2xl font-mono font-bold tabular-nums text-[var(--fg)]">
                        {formatNumber(project.forks)}
                      </p>
                    </div>
                  )}
                  {project.open_issues !== undefined && (
                    <div className="col-span-2 sm:col-span-1 p-5 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-[var(--muted)] tracking-wide uppercase">
                          Issues
                        </span>
                        <CircleDot className="w-3.5 h-3.5 text-[var(--faint)]" />
                      </div>
                      <p className="text-2xl font-mono font-bold tabular-nums text-[var(--fg)]">
                        {project.open_issues.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tech stack ── */}
            {!isTrending && project.tech_stack && project.tech_stack.length > 0 && (
              <div className="mb-8">
                <span className="section-label block mb-3">
                  技术栈
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, idx) => (
                    <span key={idx} className="tag-minimal text-sm">
                      <Code className="w-3.5 h-3.5" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Core features ── */}
            {!isTrending && project.core_features && project.core_features.length > 0 && (
              <div className="mb-8">
                <span className="section-label block mb-3">
                  核心功能
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.core_features.map((feature, idx) => (
                    <span key={idx} className="tag-minimal text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── SMART Goal ── */}
            {!isTrending && project.target && (
              <div className="mb-8">
                <span className="section-label block mb-3">
                  项目目标
                </span>
                <div className="p-5 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">{project.target}</p>
                </div>
              </div>
            )}

            {/* ── Tech recommendations ── */}
            {!isTrending && (project.tech_recommendations?.main?.length > 0 || project.tech_recommendations?.auxiliary?.length > 0) && (
              <div className="mb-8">
                <span className="section-label block mb-3">
                  技术建议
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.tech_recommendations.main && project.tech_recommendations.main.length > 0 && (
                    <div className="p-4 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <p className="text-[10px] font-semibold text-[var(--muted)] mb-2 tracking-wide uppercase">Primary</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_recommendations.main.map((tech, idx) => (
                          <span key={idx} className="tag-minimal-code text-sm text-[var(--fg-2)]">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.tech_recommendations.auxiliary && project.tech_recommendations.auxiliary.length > 0 && (
                    <div className="p-4 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <p className="text-[10px] font-semibold text-[var(--muted)] mb-2 tracking-wide uppercase">Auxiliary</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_recommendations.auxiliary.map((tech, idx) => (
                          <span key={idx} className="tag-minimal-code text-sm text-[var(--fg-2)]">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Implementation steps ── */}
            {!isTrending && project.implementation_steps && project.implementation_steps.length > 0 && (
              <div className="mb-8">
                <span className="section-label block mb-3">
                  实施步骤
                </span>
                <div className="space-y-2">
                  {project.implementation_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start p-4 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]"
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-mono font-medium text-white bg-[var(--accent)] rounded-[var(--radius-sm)]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Expected outcomes ── */}
            {!isTrending && (project.expected_outcomes?.features?.length > 0 || project.expected_outcomes?.learning?.length > 0) && (
              <div className="mb-10">
                <span className="section-label block mb-3">
                  预期成果
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.expected_outcomes.features && project.expected_outcomes.features.length > 0 && (
                    <div className="p-4 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <p className="text-[10px] font-semibold text-[var(--muted)] mb-3 tracking-wide uppercase">功能</p>
                      <ul className="space-y-2">
                        {project.expected_outcomes.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-[var(--muted)] flex items-start gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {project.expected_outcomes.learning && project.expected_outcomes.learning.length > 0 && (
                    <div className="p-4 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[var(--radius-md)]">
                      <p className="text-[10px] font-semibold text-[var(--muted)] mb-3 tracking-wide uppercase">学习收获</p>
                      <ul className="space-y-2">
                        {project.expected_outcomes.learning.map((item, idx) => (
                          <li key={idx} className="text-sm text-[var(--muted)] flex items-start gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CTA — Copy prompt ── */}
            <div>
              <button
                onClick={handleCopyPrompt}
                className="btn-primary w-full justify-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制到剪贴板
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制开工提示词
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-[var(--border)]">
              <p className="text-[10px] font-mono text-[var(--faint)] text-center">
                Vibe Coding Radar · {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
