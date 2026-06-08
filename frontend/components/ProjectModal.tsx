import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, Target, Code, ListChecks, Trophy, Clock, Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedProject } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';

interface ProjectModalProps {
  isOpen: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const project = useSelector((state: RootState) => state.projects.selectedProject);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger mount animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => dispatch(setSelectedProject(null)), 300);
  }, [dispatch]);

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
      // Fallback if clipboard API fails
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
        className={`absolute inset-0 transition-all duration-500 ${
          visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`relative w-full max-w-2xl h-full bg-surface-canvas border-l border-white/[0.08] shadow-elevated
          transition-all duration-500 ease-out overflow-hidden ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}
      >
        {/* Scrollable content */}
        <div className="h-full overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* ── Close button ── */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-text-tertiary hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Title section ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {project.difficulty}
                </div>
                <div className="px-2 py-0.5 rounded-md text-[11px] font-mono text-text-tertiary bg-white/[0.04] border border-white/[0.06]">
                  ~{project.estimated_hours}h
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                {project.name}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* ── Tech stack pills ── */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium bg-brand-500/8 text-brand-400/90 border border-brand-500/15"
                  >
                    <Code className="w-3.5 h-3.5" />
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* ── Core features ── */}
            {project.core_features && project.core_features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  核心功能
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.core_features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.03] text-text-secondary border border-white/[0.06]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── SMART Goal ── */}
            {project.target && (
              <Section icon={<Target className="w-4 h-4 text-brand-400" />} title="项目目标（SMART原则）">
                <p className="text-text-secondary leading-relaxed bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  {project.target}
                </p>
              </Section>
            )}

            {/* ── Tech recommendations ── */}
            {(project.tech_recommendations?.main?.length > 0 || project.tech_recommendations?.auxiliary?.length > 0) && (
              <Section icon={<Code className="w-4 h-4 text-accent-400" />} title="技术栈建议">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-xs font-mono text-text-tertiary mb-2 tracking-wide">主技术</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_recommendations.main || []).map((tech, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg text-sm font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-xs font-mono text-text-tertiary mb-2 tracking-wide">辅助技术</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_recommendations.auxiliary || []).map((tech, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg text-sm font-mono bg-accent-500/10 text-accent-400/90 border border-accent-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Implementation steps ── */}
            {project.implementation_steps && project.implementation_steps.length > 0 && (
              <Section icon={<ListChecks className="w-4 h-4 text-green" />} title="分阶段实施步骤">
                <div className="space-y-2">
                  {project.implementation_steps.map((step, index) => (
                    <div key={index} className="flex gap-3 items-start bg-white/[0.03] rounded-xl p-3.5 border border-white/[0.06]">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-text-secondary leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Expected outcomes ── */}
            {(project.expected_outcomes?.features?.length > 0 || project.expected_outcomes?.learning?.length > 0) && (
              <Section icon={<Trophy className="w-4 h-4 text-yellow" />} title="预期成果">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.expected_outcomes.features && project.expected_outcomes.features.length > 0 && (
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                      <p className="text-xs font-semibold text-text-tertiary mb-3 tracking-wide">功能</p>
                      <ul className="space-y-2">
                        {project.expected_outcomes.features.map((feature, index) => (
                          <li key={index} className="text-text-secondary text-sm flex items-start gap-2">
                            <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {project.expected_outcomes.learning && project.expected_outcomes.learning.length > 0 && (
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                      <p className="text-xs font-semibold text-text-tertiary mb-3 tracking-wide">学习收获</p>
                      <ul className="space-y-2">
                        {project.expected_outcomes.learning.map((item, index) => (
                          <li key={index} className="text-text-secondary text-sm flex items-start gap-2">
                            <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── CTA ── */}
            <div className="mt-8">
              <button
                onClick={handleCopyPrompt}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm
                  flex items-center justify-center gap-2.5 hover:from-brand-500 hover:to-brand-400
                  active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-500/25"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制到剪贴板
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制开工提示词（可直接发给AI助手）
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Section wrapper ── */
interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => (
  <div className="mb-7">
    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

export default ProjectModal;
