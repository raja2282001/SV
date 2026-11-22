import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoriesView: React.FC = () => {
  const { categories, products, setSelectedCategoryFilter, setActiveView } = useStore();

  const handleSelectCategory = (catName: string) => {
    if (catName.toLowerCase().includes('printing') || catName.toLowerCase().includes('services')) {
      setActiveView('printing-and-services');
    } else {
      setSelectedCategoryFilter(catName);
      setActiveView('product-catalogue');
    }
  };

  return (
    <div className="flex flex-col w-full py-8 bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#fea619]"></span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
              Inventory Taxonomy
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight uppercase">
            All Stationery & Reprographic Departments
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] max-w-2xl mt-1 leading-relaxed">
            Select any department to filter genuine offline stock or verify commercial specifications available at our Nana Chiloda outlet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const isServices = cat.id === 'services';
            const matchedProducts = products.filter(
              p =>
                p.category.toLowerCase() === cat.name.toLowerCase() ||
                p.category.includes(cat.name) ||
                (cat.name === 'Pens & Pencils' && p.category === 'Pens') ||
                (cat.name === 'Notebooks & Registers' && p.category === 'Notebooks')
            );

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                className={`p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-56 cursor-pointer border ${
                  isServices
                    ? 'bg-[#131b2e] text-white border-[#131b2e]'
                    : 'bg-white text-[#0b1c30] border-[#dce9ff]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isServices
                        ? 'bg-white/10 text-[#fea619]'
                        : 'bg-[#eff4ff] text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                  </div>
                  <span
                    className={`font-['Space_Grotesk'] text-xs font-bold px-2.5 py-1 rounded-full ${
                      isServices
                        ? 'bg-white/10 text-white'
                        : 'bg-[#eff4ff] text-[#45464d] border border-[#dce9ff]'
                    }`}
                  >
                    {matchedProducts.length > 0
                      ? `${matchedProducts.length} Items Indexed`
                      : cat.itemCountText}
                  </span>
                </div>

                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold mt-2">{cat.name}</h3>
                  <p
                    className={`font-['Plus_Jakarta_Sans'] text-xs mt-1 line-clamp-2 ${
                      isServices ? 'text-white/70' : 'text-[#45464d]'
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>

                <div
                  className={`pt-2 border-t flex items-center justify-between text-xs font-['Space_Grotesk'] font-bold ${
                    isServices ? 'border-white/10 text-[#fea619]' : 'border-[#eff4ff] text-[#855300]'
                  }`}
                >
                  <span>Explore Department</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
