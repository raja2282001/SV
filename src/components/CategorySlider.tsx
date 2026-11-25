import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Swiper as SwiperInstance } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Category } from '../data/initialData';

interface CategorySliderProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({ categories, onSelect }) => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const categoryCount = Math.max(categories.length, 1);

  return (
    <div
      className="relative w-full font-['Plus_Jakarta_Sans']"
      role="region"
      aria-label="Product categories"
      aria-roledescription="carousel"
    >
      {categories.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous categories"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce9ff] bg-white text-[#0b1c30] shadow-md transition-colors hover:bg-[#131b2e] hover:text-white sm:left-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next categories"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce9ff] bg-white text-[#0b1c30] shadow-md transition-colors hover:bg-[#131b2e] hover:text-white sm:right-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <Swiper
        modules={[A11y, Autoplay]}
        onSwiper={swiper => { swiperRef.current = swiper; }}
        slidesPerView={Math.min(categoryCount, 2.3)}
        spaceBetween={12}
        speed={500}
        rewind
        watchOverflow
        autoplay={categories.length > 1 ? {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        breakpoints={{
          360: { slidesPerView: Math.min(categoryCount, 3), spaceBetween: 14 },
          480: { slidesPerView: Math.min(categoryCount, 4), spaceBetween: 16 },
          640: { slidesPerView: Math.min(categoryCount, 5), spaceBetween: 16 },
          768: { slidesPerView: Math.min(categoryCount, 6), spaceBetween: 18 },
          1024: { slidesPerView: Math.min(categoryCount, 8), spaceBetween: 18 },
          1280: { slidesPerView: Math.min(categoryCount, 10), spaceBetween: 20 },
          1600: { slidesPerView: Math.min(categoryCount, 12), spaceBetween: 20 },
        }}
        className="!px-10 !py-2 sm:!px-12"
      >
        {categories.map(category => (
          <SwiperSlide key={category.id} className="!flex !h-auto !justify-center">
            <button
              type="button"
              onClick={() => onSelect(category)}
              className="group flex w-full max-w-[156px] flex-col items-center gap-2 rounded-lg px-1 py-1 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fea619]"
            >
              <span className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-xl bg-[#f7f8ff] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
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
              </span>
              <span className="line-clamp-2 min-h-10 w-full text-[12px] font-semibold leading-5 text-[#303846] transition-colors group-hover:text-[#855300] sm:text-[13px] lg:text-sm">
                {category.name}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
