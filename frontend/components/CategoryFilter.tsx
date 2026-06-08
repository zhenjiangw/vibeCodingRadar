import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, fetchCategories } from '../store/projectSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Gamepad2, Wrench, Baby, Layers } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'gamepad-2': <Gamepad2 className="w-3.5 h-3.5" />,
  'wrench': <Wrench className="w-3.5 h-3.5" />,
  'baby': <Baby className="w-3.5 h-3.5" />,
};

const fallbackIcon = <Layers className="w-3.5 h-3.5" />;

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
    <div className="flex flex-wrap items-center gap-2">
      {/* All */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={`pill-minimal ${selectedCategory === null ? 'active' : ''}`}
      >
        <Layers className="w-3.5 h-3.5" />
        全部项目
      </button>

      {/* Category items */}
      {categories.map((category, idx) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`pill-minimal animate-fade-in-up stagger-${Math.min(idx + 1, 8)} ${
            selectedCategory === category.id ? 'active' : ''
          }`}
          style={{ animationDelay: `${(idx + 1) * 0.025}s`, animationFillMode: 'backwards' }}
        >
          {iconMap[category.icon] || fallbackIcon}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
