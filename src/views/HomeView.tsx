import React from 'react';
import { useStore } from '../context/StoreContext';
import { CategorySlider } from '../components/CategorySlider';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    rateCards,
    storeConfig,
    setActiveView,
    setSelectedCategoryFilter,
    setDetailProduct,
    openInquiryModal,
  } = useStore();

  const handleCategoryClick = (catName: string) => {
    if (catName.toLowerCase().includes('printing') || catName.toLowerCase().includes('services')) {
      setActiveView('printing-and-services');
    } else {
      setSelectedCategoryFilter(catName);
      setActiveView('product-catalogue');
    }
  };

  // Popular products shown on Home (first 8 public products)
  const homeProducts = products.filter(p => p.isPublic).slice(0, 8);

  return (
    <div className="flex flex-col w-full">
      {/* CATALOGUE NOTIFICATION STRIP */}
      <div className="w-full bg-[#fea619] text-[#684000] px-4 sm:px-6 lg:px-12 py-2.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 text-xs font-['Space_Grotesk']">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>
              <strong>Notice:</strong> Online verification catalogue only. In-store purchasing & instant walk-in reprographic desk at Nana Chiloda, Ahmedabad. Zero online payments processed.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-semibold tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Store Walk-ins Welcomed Until {storeConfig.closeTime} Today</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="w-full relative overflow-hidden bg-white pb-10 border-b border-[#e5eeff]">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 flex flex-col gap-6 relative z-10">
          {/* Authority Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-[11px] rounded-full tracking-wider uppercase font-bold border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[14px] text-[#855300]">
                verified_user
              </span>
              Authorized Printing, Stationery & Xerox Centre in Ahmedabad
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c6c6cd]"></span>
            <span className="text-[#45464d] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-semibold">
              Nana Chiloda • New Shahibaug Hub
            </span>
          </div>

          {/* Main Headline & Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl lg:text-[46px] text-[#0b1c30] font-bold tracking-tight leading-[1.1] max-w-4xl">
                Your One-Stop Shop for{' '}
                <span className="underline decoration-[#fea619] decoration-4 underline-offset-8">
                  Stationery & Printing
                </span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-base text-[#45464d] max-w-2xl leading-relaxed">
                Browse genuine office supplies, student registers, school essentials, art materials, and industrial high-volume Xerox, colour printing, lamination, and spiral binding services.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => setActiveView('product-catalogue')}
                className="inline-flex items-center justify-between px-6 py-4 bg-[#131b2e] text-white rounded-xl font-['Space_Grotesk'] text-sm font-semibold shadow-md hover:bg-[#fea619] hover:text-[#684000] transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#fea619] group-hover:text-[#684000] transition-colors">
                    menu_book
                  </span>
                  <span>Explore Products</span>
                </span>
                <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => setActiveView('printing-and-services')}
                className="inline-flex items-center justify-between px-6 py-4 bg-[#eff4ff] text-[#0b1c30] rounded-xl font-['Space_Grotesk'] text-sm font-semibold hover:bg-[#dce9ff] transition-all group border border-[#dce9ff] cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#45464d]">
                    print
                  </span>
                  <span>View Printing Services</span>
                </span>
                <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center gap-3 border border-[#dce9ff]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30] leading-tight">
                  500+
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Stationery Items
                </span>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center gap-3 border border-[#dce9ff]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30] leading-tight">
                  High-Speed
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Laser Photocopying
                </span>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center gap-3 border border-[#dce9ff]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#fea619] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">nest_clock_farsight_analog</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30] leading-tight">
                  {storeConfig.closeTime}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Daily Closing Time
                </span>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center gap-3 border border-[#dce9ff]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0b1c30] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">location_city</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30] leading-tight">
                  Nana Chiloda
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Shop 10, Ahmedabad
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOME CATEGORY SLIDER */}
      <section className="w-full border-y border-[#e5eeff] bg-white py-3">
        <div className="max-w-[1440px] mx-auto px-1 sm:px-4 lg:px-8">
          <CategorySlider categories={categories} onSelect={category => handleCategoryClick(category.name)} />
        </div>
      </section>

      {/* POPULAR STATIONERY PRODUCTS (STRICT CATALOGUE ONLY) */}
      <section className="w-full py-10 bg-[#eff4ff] border-t border-b border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#fea619]"></span>
                <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#45464d] font-bold">
                  Current In-Shop Inventory
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
                Popular Stationery Products
              </h2>
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] max-w-sm">
              Transparent offline store rates. Walk into our Nana Chiloda outlet for instant purchase or volume bulk billing.
            </p>
          </div>

          {/* 8-Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {homeProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden border border-[#dce9ff] group"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-[#f8f9ff] overflow-hidden flex items-center justify-center p-2">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.image}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded bg-[#131b2e] text-white font-['Space_Grotesk'] text-[10px] font-bold">
                      {product.brand}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[#0b1c30] font-['Space_Grotesk'] text-[10px] font-bold flex items-center gap-1 shadow-sm border border-[#dce9ff]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fea619]"></span>
                      {product.stockStatus}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase tracking-wider font-semibold">
                      {product.category}
                    </span>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between">
                    <div>
                      <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d] block leading-none">
                        Store Price
                      </span>
                      <span className="font-['Space_Grotesk'] text-lg text-[#0b1c30] font-bold">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => setDetailProduct(product)}
                      className="px-3.5 py-1.5 bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs font-semibold rounded-lg hover:bg-[#131b2e] hover:text-white transition-all border border-[#dce9ff] cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Wholesale Banner */}
          <div className="bg-white rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-[#dce9ff]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fea619] flex items-center justify-center text-[#684000] shrink-0">
                <span className="material-symbols-outlined text-[26px]">corporate_fare</span>
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">
                  Procuring for Schools, Coaching Classes, or Offices?
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  We support institutional carton supplies of registers, reams, and file binders at dedicated distributor terms.
                </p>
              </div>
            </div>

            <button
              onClick={() => openInquiryModal('Institutional Wholesale Quotation')}
              className="px-5 py-3 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all whitespace-nowrap shadow-sm cursor-pointer"
            >
              Request Institutional Quotation
            </button>
          </div>
        </div>
      </section>

      {/* PRINTING & XEROX REPROGRAPHIC SERVICES SHOWCASE */}
      <section className="w-full py-10 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
                Production Studio Desk
              </span>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
                Printing & Xerox Services
              </h2>
            </div>
            <span className="font-['Space_Grotesk'] text-xs text-[#45464d] font-semibold">
              Same-Day Walk-in Counter Reprographics
            </span>
          </div>

          {/* 6 Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rateCards.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 border border-[#dce9ff]"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="w-11 h-11 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] border border-[#dce9ff]">
                    <span className="material-symbols-outlined text-[24px]">
                      {service.category === 'xerox'
                        ? 'file_copy'
                        : service.category === 'color'
                        ? 'palette'
                        : service.category === 'finishing'
                        ? 'layers'
                        : 'school'}
                    </span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">
                    {service.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-[#eff4ff]">
                  <div className="flex items-center justify-between text-xs text-[#45464d] bg-[#eff4ff] p-2 rounded-lg">
                    <span className="font-['Space_Grotesk'] uppercase text-[10px] font-bold">
                      Turnaround
                    </span>
                    <span className="font-bold text-[#0b1c30]">{service.turnaround}</span>
                  </div>

                  <button
                    onClick={() => openInquiryModal(service.title, service.serviceId, service.rate)}
                    className="w-full py-2 bg-[#eff4ff] text-[#0b1c30] hover:bg-[#131b2e] hover:text-white font-['Space_Grotesk'] text-xs font-semibold rounded-lg transition-all text-center border border-[#dce9ff] cursor-pointer"
                  >
                    Enquire for Service / Visit Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE LOCATION & VISITING HOURS SECTION */}
      <section className="w-full py-10 bg-white border-t border-[#e5eeff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Location Card */}
            <div className="lg:col-span-7 bg-[#eff4ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-[#dce9ff]">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold rounded-full w-fit border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[16px] text-[#855300]">
                    storefront
                  </span>
                  <span>Physical Retail & Reprographic Outlet</span>
                </div>

                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight leading-tight">
                  Visit {storeConfig.storeName} in Nana Chiloda
                </h2>

                {/* Address */}
                <div className="bg-white p-4 rounded-xl flex items-start gap-3 shadow-sm border border-[#dce9ff]">
                  <div className="w-10 h-10 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[22px]">pin_drop</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#0b1c30] uppercase tracking-wider font-bold">
                      Store Physical Address
                    </span>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#0b1c30] mt-1 leading-snug">
                      {storeConfig.address}
                    </p>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-1.5">
                      Landmark: {storeConfig.landmark}
                    </span>
                  </div>
                </div>

                {/* Visiting Hours */}
                <div className="bg-white p-4 rounded-xl flex flex-col gap-2 shadow-sm border border-[#dce9ff]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#fea619] text-[20px]">
                        schedule
                      </span>
                      <span className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">
                        Visiting Hours
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] font-['Space_Grotesk'] text-[11px] font-bold">
                      Open Today
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#0b1c30] pt-1">
                    <span className="font-['Plus_Jakarta_Sans'] font-medium">Monday – Saturday:</span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#0b1c30]">
                      Morning until {storeConfig.closeTime} IST
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-['Plus_Jakarta_Sans']">Sunday:</span>
                    <span className="font-['Plus_Jakarta_Sans']">Limited Evening Slots / Reprographic Inquiries</span>
                  </div>

                  <div className="mt-1 text-[11px] font-['Plus_Jakarta_Sans'] text-[#76777d] italic">
                    *Daily closing time: {storeConfig.closeTime} (Admin configurable opening timings).
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#131b2e] text-white rounded-xl font-['Space_Grotesk'] text-xs font-bold hover:bg-[#fea619] hover:text-[#684000] transition-all"
                  href={`https://maps.google.com/?q=${storeConfig.googleMapsQuery}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                  <span>Get Directions on Google Maps</span>
                </a>
                <button
                  onClick={() => openInquiryModal('Direct WhatsApp Shop Consultation')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0b1c30] rounded-xl font-['Space_Grotesk'] text-xs font-bold hover:bg-[#dce9ff] transition-all shadow-sm border border-[#dce9ff] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#855300]">
                    chat
                  </span>
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Map Card */}
            <div className="lg:col-span-5 flex flex-col rounded-2xl overflow-hidden shadow-sm bg-[#eff4ff] min-h-[380px] border border-[#dce9ff]">
              <div
                className="w-full h-full min-h-[340px] bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmO6F2cTrLqCtG0FJKnZb4bRueimDwSjGQg0lpoUCxoxoA3gJPoCys8u8KgZs-rpxv3KOQQXOcS9kT7Z1NHlzx-XYozOHDcc_rv6S7gPNmNuhoXjU33K-a9OBf0JQ0NNKHYWIMzciHGqvjDJF7wrKanvrIgDQl7O31zXkwmZYyYma2zyblYP6B8g13ven_yRRa8XG1xksoDbT1_SOGsZ9WmefkbTHrtz-OxOmpdzYLxtmk0cOCs7GL')",
                }}
              >
                <div className="absolute inset-0 bg-[#131b2e]/10 pointer-events-none"></div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-md flex items-center justify-between gap-3 border border-[#dce9ff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fea619] text-[24px]">
                      pin_drop
                    </span>
                    <div className="flex flex-col">
                      <span className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] leading-none">
                        {storeConfig.storeName}
                      </span>
                      <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-0.5">
                        Nana Chiloda, Ahmedabad
                      </span>
                    </div>
                  </div>

                  <a
                    className="px-3.5 py-1.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all"
                    href={`https://maps.google.com/?q=${storeConfig.googleMapsQuery}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Navigate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPUTATION BANNER */}
      <section className="w-full py-6 bg-[#eff4ff] border-t border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#0b1c30] shadow-sm shrink-0 border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] block">
                Commercial Reprographics & Verified Inventory
              </span>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                Serving students, coaching institutes, advocates, architects, and corporate enterprises across New Shahibaug and Nana Chiloda.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('product-catalogue')}
            className="w-full md:w-auto text-center px-5 py-2.5 bg-white text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold rounded-xl hover:bg-[#dce9ff] transition-all shadow-sm border border-[#dce9ff] cursor-pointer"
          >
            Browse Complete Catalogue
          </button>
        </div>
      </section>
    </div>
  );
};
