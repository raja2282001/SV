import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Category } from '../data/initialData';

interface CategorySliderProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({ categories, onSelect }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  const scroll = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const firstCard = slider.firstElementChild;
    const cardWidth = firstCard instanceof HTMLElement
      ? firstCard.getBoundingClientRect().width
      : slider.clientWidth;
    const gap = Number.parseFloat(window.getComputedStyle(slider).columnGap) || 0;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const nextPosition = slider.scrollLeft + direction * (cardWidth + gap);
    const left = maxScroll <= 1
      ? 0
      : direction > 0
        ? slider.scrollLeft >= maxScroll - 2 ? 0 : Math.min(nextPosition, maxScroll)
        : slider.scrollLeft <= 1 ? maxScroll : Math.max(nextPosition, 0);
    slider.scrollTo({ left, behavior: 'smooth' });
  };

  useEffect(() => {
    if (categories.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const intervalId = window.setInterval(() => {
      if (!isPausedRef.current) scroll(1);
    }, 4500);
    return () => window.clearInterval(intervalId);
  }, [categories.length]);

  return (
    <div
      className="relative"
      role="region"
      aria-label="Product categories"
      aria-roledescription="carousel"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
      onFocus={() => { isPausedRef.current = true; }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          isPausedRef.current = false;
        }
      }}
      onTouchStart={() => { isPausedRef.current = true; }}
      onTouchEnd={() => { isPausedRef.current = false; }}
    >
      {categories.length > 1 && (
        <div className="absolute -top-14 right-0 flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce9ff] bg-white text-[#0b1c30] shadow-md transition-colors hover:bg-[#131b2e] hover:text-white"
          >
              <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce9ff] bg-white text-[#0b1c30] shadow-md transition-colors hover:bg-[#131b2e] hover:text-white"
          >
              <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
      <div
        ref={sliderRef}
        id="home-category-slider"
          className="flex items-start gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-10 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category)}
              className="group flex w-[100px] flex-none snap-start flex-col items-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fea619] sm:w-[128px]"
          >
              <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-xl bg-[#f8f9ff] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24">
              {category.image ? (
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                    className="h-full w-full object-contain p-1"
                />
              ) : (
                  <ImageIcon className="h-9 w-9 stroke-1 text-[#8191aa]" aria-hidden="true" />
              )}
            </div>
              <span className="w-full truncate font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#303846] transition-colors group-hover:text-[#855300] sm:text-sm">
                {category.name}
              </span>
          </button>
        ))}
      </div>
    </div>
  );
};
