import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Category } from '../data/initialData';

interface CategorySliderProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({ categories, onSelect }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * sliderRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {categories.length > 1 && (
        <div className="absolute -top-14 right-0 hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#dce9ff] text-[#0b1c30] shadow-sm hover:bg-[#131b2e] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mx-auto" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-white border border-[#dce9ff] text-[#0b1c30] shadow-sm hover:bg-[#131b2e] hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 mx-auto" />
          </button>
        </div>
      )}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 [scrollbar-width:thin] [scrollbar-color:#dce9ff_transparent]"
      >
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category)}
            className="group relative flex-none w-[78%] sm:w-[42%] lg:w-[calc(25%-12px)] snap-start overflow-hidden rounded-2xl border border-[#dce9ff] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fea619]"
          >
            <div className="relative h-40 sm:h-44 overflow-hidden bg-[#eff4ff]">
              {category.image ? (
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#eff4ff] via-white to-[#dce9ff] text-[#8191aa]">
                  <ImageIcon className="w-12 h-12 stroke-1" aria-hidden="true" />
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-bold text-[#0b1c30] shadow-sm">
                {category.itemCountText}
              </span>
            </div>
            <div className="flex min-h-24 flex-col justify-between p-4">
              <div>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30] line-clamp-1">
                  {category.name}
                </h3>
                <p className="mt-1 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] line-clamp-2">
                  {category.description || 'Explore products in this category.'}
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wide text-[#855300]">
                Explore category <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
