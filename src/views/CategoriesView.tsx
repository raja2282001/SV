import React from 'react';
import { useStore } from '../context/StoreContext';

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelectCategory(category.name)}
                className="group overflow-hidden rounded-xl border border-[#dce9ff] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden bg-[#eff4ff]">
                  {category.image ? (
                    <img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eff4ff] to-white text-[#8191aa]">
                      <span className="material-symbols-outlined text-5xl" aria-hidden="true">{category.icon || 'folder'}</span>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-bold text-[#0b1c30] shadow-sm">
                    {category.itemCountText}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">{category.name}</h2>
                  <p className="mt-1 min-h-8 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] line-clamp-2">
                    {category.description || 'Explore products in this category.'}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wide text-[#855300]">
                    Explore category <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#dce9ff] bg-white p-6 text-sm text-[#45464d]">
            No categories are available right now.
          </p>
        )}
      </div>
    </div>
  );
};
