import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, fetchCategories } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Gamepad2, Wrench, Baby, Layers } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'gamepad-2': <Gamepad2 className="w-4 h-4" />,
  'wrench': <Wrench className="w-4 h-4" />,
  'baby': <Baby className="w-4 h-4" />,
};

const fallbackIcon = <Layers className="w-4 h-4" />;

const CategoryFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.projects.categories);
  const selectedCategory = useSelector((state: RootState) => state.projects.selectedCategory);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId: number | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {/* All */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
          selectedCategory === null
            ? 'text-white glow-brand'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
            selectedCategory === null
              ? 'bg-gradient-to-br from-brand-600/80 to-brand-500/60 border border-brand-500/30'
              : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07]'
          }`}
        />
        <span className="relative z-10 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          全部项目
        </span>
      </button>

      {/* Category items */}
      {categories.map((category, idx) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
            animate-fade-in-up stagger-${Math.min(idx + 1, 8)} ${
            selectedCategory === category.id
              ? 'text-white glow-brand'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
          style={{ animationDelay: `${(idx + 1) * 0.04}s` }}
        >
          <div
            className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-br from-brand-600/80 to-brand-500/60 border border-brand-500/30'
                : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07]'
            }`}
          />
          <span className="relative z-10 flex items-center gap-2">
            {iconMap[category.icon] || fallbackIcon}
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
