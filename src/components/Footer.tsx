import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, storeConfig, openInquiryModal } = useStore();

  return (
    <footer className="w-full bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.04)] pt-10 pb-6 border-t border-[#e5eeff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Brand & Address Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveView('home')}
            >
              <img
                alt="S V Copiers / Xerox Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VvKfB2jlxvddqPSjWyZstnsSJr91O1uf0mNF3ACFkebn0AyhDjjIXGHvfbuooDv6-fbCLPwogOKS1DivnetdN7mR8UIkY9vDZCbGXgJAdBK9yvkdCEhdQobQNhMS5WSVia2g4V1-0ZXNQKlsfP65ICj9C5kPiokiXMFKVgmMr977yOr7wOZfp3ume4g0mS2-_piCcxuwOrJo0lDb6LLZpFzgAV8W8sSs-7ov0p_CXtV3c_0MXwihRqEXI"
              />
              <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30] uppercase">
                {storeConfig.storeName}
              </span>
            </div>

            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
              High-fidelity technical blueprint printing, thesis binding, and bulk reprographic stationery supply for commercial, educational, and institutional partners across Ahmedabad.
            </p>

            <div className="flex flex-col gap-1.5 bg-[#eff4ff] p-4 rounded-xl border border-[#dce9ff]">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0b1c30] uppercase font-bold tracking-wider">
                Physical Store Location
              </span>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-snug">
                {storeConfig.address}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[#684000]">
                <span className="material-symbols-outlined text-[16px] text-[#fea619]">
                  schedule
                </span>
                <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] font-semibold">
                  Operating Hours: {storeConfig.operationalDays} (until {storeConfig.closeTime})
                </span>
              </div>
            </div>
          </div>

          {/* Printing Services Column */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
              Printing Services
            </span>
            <ul className="flex flex-col gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Black & White High-Speed Xerox
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Digital Colour Laser Printing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Architectural CAD Plotting & Blueprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Thermal & Matte/Gloss Lamination
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Spiral, Wiro & Hard Thesis Binding
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('printing-and-services')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Studio Photo & Card Stock Printing
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
              Quick Navigation
            </span>
            <ul className="flex flex-col gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Store Front & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('product-catalogue')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Paper Stock & Reams Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('categories')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Stationery & Binding Supplies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about-us')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Studio Equipment & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact-us')}
                  className="hover:text-[#0b1c30] transition-colors text-left"
                >
                  Request Quote & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin-portal')}
                  className="hover:text-[#0b1c30] transition-colors text-left font-semibold text-[#0b1c30]"
                >
                  Store Operations Login
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support Column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
              Direct Support
            </span>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
              Need custom blueprint specifications or volume quotes?
            </p>
            <button
              onClick={() => openInquiryModal('Direct WhatsApp Consultation')}
              className="inline-flex items-center justify-center gap-1.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp Inquiry</span>
            </button>
            <div className="flex items-center gap-1.5 text-[#45464d] font-['Plus_Jakarta_Sans'] text-xs mt-1">
              <span className="material-symbols-outlined text-[16px] text-[#fea619]">
                pin_drop
              </span>
              <span>Nana Chiloda, Ahmedabad</span>
            </div>
          </div>
        </div>

        {/* GST Registered & Walk-in notice strip */}
        <div className="bg-[#eff4ff] p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left border border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fea619] text-[20px]">
              verified
            </span>
            <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] font-semibold">
              Catalogue & Information Only — In-store purchase & inquiries only. No online transactions.
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#45464d] font-medium bg-white px-2 py-0.5 rounded border border-[#dce9ff]">
            GST Registered Business
          </span>
        </div>

        {/* Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
          <p>© 2025 S V COPIERS / XEROX. All Rights Reserved. Nana Chiloda, Ahmedabad.</p>
          <div className="flex items-center gap-4 font-['Space_Grotesk'] text-xs">
            <button
              onClick={() => setActiveView('about-us')}
              className="hover:text-[#0b1c30] transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveView('contact-us')}
              className="hover:text-[#0b1c30] transition-colors"
            >
              Store Directions
            </button>
            <button
              onClick={() => setActiveView('admin-portal')}
              className="hover:text-[#0b1c30] transition-colors font-semibold text-[#0b1c30]"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
