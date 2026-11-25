import React from 'react';
import { useStore } from '../context/StoreContext';
import { CategorySlider } from '../components/CategorySlider';

export const CategoriesView: React.FC = () => {
  const { categories, setSelectedCategoryFilter, setActiveView } = useStore();

  const handleSelectCategory = (name: string) => {
    if (name.toLowerCase().includes('printing') || name.toLowerCase().includes('services')) {
      setActiveView('printing-and-services');
    } else {
      setSelectedCategoryFilter(name);
      setActiveView('product-catalogue');
    }
  };

  return (
    <div className="flex flex-col w-full py-8 bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#fea619]" />
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
              Inventory Taxonomy
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight uppercase">
            All Stationery & Reprographic Departments
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] max-w-2xl mt-1 leading-relaxed">
            Select any department to browse the catalogue or explore our reprographic services.
          </p>
        </div>
        {categories.length > 0 ? (
          <CategorySlider categories={categories} onSelect={category => handleSelectCategory(category.name)} />
        ) : (
          <p className="rounded-xl border border-[#dce9ff] bg-white p-6 text-sm text-[#45464d]">
            No categories are available right now.
          </p>
        )}
      </div>
    </div>
  );
};
