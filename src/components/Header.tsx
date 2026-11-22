import React, { useState } from 'react';
import { useStore, NavView } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    storeConfig,
    inquiries,
    openInquiryModal,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'PENDING REPLY').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setActiveView('product-catalogue');
    }
  };

  const navLinks: { label: string; view: NavView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Product Catalogue', view: 'product-catalogue' },
    { label: 'Printing & Xerox Services', view: 'printing-and-services' },
    { label: 'Categories', view: 'categories' },
    { label: 'About Us', view: 'about-us' },
    { label: 'Contact Us', view: 'contact-us' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between py-1.5">
        {/* Top Row: Brand, Search, Action Buttons */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 pt-1">
          {/* Logo & Brand Info */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveView('home')}
          >
            <img
              alt="S V Copiers / Xerox Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="/assets/sv-copiers-logo.svg"
            />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold tracking-tight text-[#0b1c30] leading-none uppercase">
                {storeConfig.storeName}
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d] uppercase tracking-wider hidden sm:inline-block mt-0.5">
                {storeConfig.subtitle}
              </span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0b1c30] font-semibold">
                Ahmedabad • Open until {storeConfig.closeTime}
              </span>
            </div>
          </div>

          {/* Search Box in Header */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden md:block mx-3"
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#45464d] text-[18px]">
                search
              </span>
              <input
                className="w-full pl-9 pr-4 py-1.5 bg-[#eff4ff] text-[#0b1c30] placeholder:text-[#76777d] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-transparent focus:border-[#0b1c30] focus:bg-white focus:outline-none transition-all"
                placeholder="Search by GSM, brand, binding type, or service..."
                type="search"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
              />
            </div>
          </form>

          {/* Action Links */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openInquiryModal('Direct In-Store Inquiry')}
              className="inline-flex items-center gap-1.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span className="hidden sm:inline">Contact Shop</span>
              <span className="sm:hidden">Contact</span>
            </button>

            <button
              onClick={() => setActiveView('admin-portal')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all border cursor-pointer ${
                activeView === 'admin-portal'
                  ? 'bg-[#131b2e] text-white border-[#131b2e]'
                  : 'bg-[#eff4ff] text-[#0b1c30] border-[#dce9ff] hover:bg-[#dce9ff]'
              }`}
              title="Catalog Control Plane"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Admin</span>
              {pendingInquiriesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="flex items-center justify-between pb-1 mt-1">
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navLinks.map(link => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => setActiveView(link.view)}
                  className={`px-3 py-1 font-['Plus_Jakarta_Sans'] text-xs transition-all rounded-lg whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#dce9ff] text-[#0b1c30] font-bold shadow-sm'
                      : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] font-medium'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex xl:hidden items-center gap-1.5 text-[#45464d] font-['Space_Grotesk'] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>
            <span>Open until {storeConfig.closeTime}</span>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e5eeff] py-2 flex flex-col gap-1 bg-white">
            <form onSubmit={handleSearchSubmit} className="mb-2">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#45464d] text-[18px]">
                  search
                </span>
                <input
                  className="w-full pl-9 pr-3 py-2 bg-[#eff4ff] text-[#0b1c30] placeholder:text-[#76777d] font-['Plus_Jakarta_Sans'] text-xs rounded-lg focus:outline-none"
                  placeholder="Search products, services, paper GSM..."
                  type="search"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                />
              </div>
            </form>

            {navLinks.map(link => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => {
                    setActiveView(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#dce9ff] text-[#0b1c30] font-bold'
                      : 'text-[#45464d] hover:bg-[#eff4ff]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
