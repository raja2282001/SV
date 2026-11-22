import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/initialData';

export const CatalogueView: React.FC = () => {
  const {
    products,
    storeConfig,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    setDetailProduct,
    openInquiryModal,
    setActiveView,
  } = useStore();

  // Selected filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategoryFilter ? [selectedCategoryFilter] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sync if parent changed selectedCategoryFilter
  React.useEffect(() => {
    if (selectedCategoryFilter && !selectedCategories.includes(selectedCategoryFilter)) {
      setSelectedCategories([selectedCategoryFilter]);
    }
  }, [selectedCategoryFilter]);

  // Categories list with counts computed dynamically from products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const allCategories = [
    'Pens',
    'Notebooks',
    'School Stationery',
    'Office Supplies',
    'Files & Folders',
    'Paper Products',
    'Art & Craft',
    'Printer Supplies',
    'Drafting Media',
    'Binding Supplies',
    'Finishing Media',
  ];

  const standardBrands = [
    'Classmate',
    'Doms',
    'Cello',
    'JK Paper',
    'Kangaro',
    'Reynolds',
    'Camlin',
    'Solo',
    'Luxor',
    'Desmat',
    'BILT',
    'HP',
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleAvailability = (avail: string) => {
    setSelectedAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAvailability([]);
    setSelectedPriceRange('all');
    setSelectedCategoryFilter('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSku && !matchesDesc) {
          return false;
        }
      }

      // Categories
      if (selectedCategories.length > 0) {
        const matched = selectedCategories.some(
          c => p.category.toLowerCase() === c.toLowerCase() || p.category.includes(c)
        );
        if (!matched) return false;
      }

      // Brands
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(p.brand)) return false;
      }

      // Availability
      if (selectedAvailability.length > 0) {
        if (!selectedAvailability.includes(p.stockStatus)) return false;
      }

      // Price range
      if (selectedPriceRange !== 'all') {
        const [minStr, maxStr] = selectedPriceRange.split('-');
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        if (p.price < min || p.price > max) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategories, selectedBrands, selectedAvailability, selectedPriceRange]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Top Indicator Band */}
      <section className="w-full bg-[#eff4ff] py-2.5 border-b border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-[#0b1c30] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>
            <span className="text-[#76777d]">/</span>
            <span className="text-[#0b1c30] font-semibold">Product Catalogue</span>
            <span className="hidden sm:inline-block ml-2 bg-[#dce9ff] text-[#0b1c30] px-2 py-0.5 rounded font-['Space_Grotesk'] text-[11px] font-bold">
              Showing {sortedProducts.length} of {products.length} Products
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#45464d] font-['Space_Grotesk'] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
              <span>Counter Open: {storeConfig.openTime} – {storeConfig.closeTime}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[#45464d] font-['Space_Grotesk'] text-[11px] bg-white px-2.5 py-1 rounded border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[15px] text-[#fea619]">info</span>
              <span>In-Store Purchase Only • No Online Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Header Title Strip & Live Search */}
      <section className="w-full bg-white py-6 border-b border-[#e5eeff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest text-[#855300] font-bold">
                Comprehensive Inventory Index
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#855300]"></span>
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest text-[#45464d]">
                Vol. 2025
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight leading-none uppercase">
              Product Catalogue
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] max-w-2xl mt-1">
              Examine our institutional paper reams, office registers, binding files, writing instruments, and reprographic materials. Verify specifications and reserve for pickup.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-96 flex flex-col gap-1">
            <label
              className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold"
              htmlFor="catalog-search"
            >
              Instant Filter Search
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#45464d] text-[20px]">
                search
              </span>
              <input
                id="catalog-search"
                className="w-full pl-10 pr-9 py-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0b1c30] shadow-sm transition-all border border-[#dce9ff]"
                placeholder="Search by item, GSM or brand..."
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#45464d] hover:text-[#0b1c30]"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <section className="w-full py-8 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#dce9ff] flex flex-col gap-5 sticky top-28">
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-2 bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-[#0b1c30]">
                    tune
                  </span>
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] uppercase">
                    Filter Index
                  </span>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="font-['Space_Grotesk'] text-xs text-[#855300] hover:underline font-bold cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Category Checklist */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
                    Product Categories
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d]">
                    {allCategories.length} Types
                  </span>
                </div>

                <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                  {allCategories.map(cat => {
                    const count = categoryCounts[cat] || 0;
                    if (count === 0 && !selectedCategories.includes(cat)) return null;
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans'] text-[#45464d] hover:text-[#0b1c30] cursor-pointer p-1 rounded hover:bg-[#eff4ff] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat)}
                            className="w-3.5 h-3.5 rounded text-[#0b1c30] focus:ring-0"
                          />
                          <span>{cat}</span>
                        </span>
                        <span className="font-['Space_Grotesk'] text-[10px] bg-[#eff4ff] px-1.5 rounded font-semibold text-[#0b1c30]">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
                  Price Range (INR)
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'All Prices', val: 'all' },
                    { label: 'Under ₹50', val: '0-50' },
                    { label: '₹50 - ₹150', val: '50-150' },
                    { label: '₹150 - ₹300', val: '150-300' },
                    { label: '₹300 - ₹500', val: '300-500' },
                    { label: 'Above ₹500', val: '500-99999' },
                  ].map(item => (
                    <label
                      key={item.val}
                      className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRange === item.val}
                        onChange={() => {
                          setSelectedPriceRange(item.val);
                          setCurrentPage(1);
                        }}
                        className="w-3.5 h-3.5 text-[#0b1c30]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Standard Brands */}
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
                  Standard Brands
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {standardBrands.map(b => (
                    <label
                      key={b}
                      className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="w-3.5 h-3.5 rounded text-[#0b1c30]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Counter Availability */}
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
                  Counter Availability
                </span>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('In Stock at Shop')}
                      onChange={() => toggleAvailability('In Stock at Shop')}
                      className="w-3.5 h-3.5 rounded text-[#0b1c30]"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>
                      <span>In Stock at Shop</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hover:text-[#0b1c30] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('Available on Request')}
                      onChange={() => toggleAvailability('Available on Request')}
                      className="w-3.5 h-3.5 rounded text-[#0b1c30]"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#76777d]"></span>
                      <span>Available on Request</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Institutional Wholesale Notice */}
              <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col gap-1 border border-[#dce9ff]">
                <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#0b1c30] uppercase">
                  Institutional Wholesale
                </span>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-snug">
                  Schools, colleges & commercial architectural offices in Ahmedabad receive custom GST invoicing for monthly reams and registers.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Product Grid & Controls */}
          <main className="lg:col-span-9 flex flex-col gap-4">
            {/* Top Bar: Summary & Sort */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="font-['Space_Grotesk'] text-xs uppercase font-bold text-[#45464d]">
                  View Mode:
                </span>
                <span className="bg-[#eff4ff] font-['Space_Grotesk'] text-xs px-2.5 py-1 rounded text-[#0b1c30] font-bold border border-[#dce9ff]">
                  {sortedProducts.length} Products
                </span>

                {/* Filter tags summary */}
                {(selectedCategories.length > 0 || selectedBrands.length > 0 || searchQuery) && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#855300] hover:underline font-['Space_Grotesk'] font-semibold ml-2"
                  >
                    Clear active filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <label
                  className="font-['Space_Grotesk'] text-xs text-[#45464d] uppercase font-bold whitespace-nowrap"
                  htmlFor="catalog-sort"
                >
                  Sort By:
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:bg-white transition-all cursor-pointer font-semibold shadow-sm border border-[#dce9ff]"
                >
                  <option value="featured">Featured Index</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid (12 items per page) */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedProducts.map(product => (
                  <article
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group border border-[#dce9ff]"
                  >
                    <div className="p-4 flex flex-col gap-2">
                      <div className="relative bg-[#eff4ff] rounded-lg p-2 aspect-[4/3] flex items-center justify-center overflow-hidden border border-[#dce9ff]">
                        <img
                          alt={product.name}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                          src={product.image}
                        />
                        <span
                          className={`absolute top-2 left-2 font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold shadow-sm ${
                            product.stockStatus.includes('In Stock')
                              ? 'bg-[#fea619] text-[#684000]'
                              : 'bg-white text-[#0b1c30] border border-[#dce9ff]'
                          }`}
                        >
                          {product.stockStatus}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur font-['Space_Grotesk'] text-[10px] px-1.5 py-0.5 rounded text-[#45464d] font-bold border border-[#dce9ff]">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex flex-col mt-1">
                        <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-[#45464d] font-bold">
                          {product.brand}
                        </span>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] line-clamp-2 mt-0.5 leading-snug">
                          {product.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between pt-1 border-t border-[#eff4ff]">
                        <div>
                          <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
                            ₹{product.price}
                          </span>
                          <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                            / {product.unit}
                          </span>
                        </div>
                        {product.badgeLabel && (
                          <span className="font-['Space_Grotesk'] text-[11px] text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded font-semibold border border-[#dce9ff]">
                            {product.badgeLabel}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setDetailProduct(product)}
                        className="w-full py-2 bg-[#eff4ff] text-[#0b1c30] hover:bg-[#131b2e] hover:text-white rounded-lg font-['Space_Grotesk'] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-[#dce9ff] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>View Details</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* No Results Empty State */
              <div className="bg-white rounded-xl p-10 text-center shadow-sm flex flex-col items-center justify-center gap-4 border border-[#dce9ff]">
                <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#45464d]">
                  <span className="material-symbols-outlined text-[32px]">inventory</span>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                  <h3 className="font-['Space_Grotesk'] text-lg text-[#0b1c30] font-bold">
                    No Products Match Your Criteria
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Try resetting filters or adjusting search keywords. Custom sizes and special reams can also be ordered via our direct store helpline.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {sortedProducts.length > 0 && (
              <nav
                aria-label="Pagination"
                className="bg-white rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#dce9ff]"
              >
                <div className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Showing{' '}
                  <span className="font-semibold text-[#0b1c30]">
                    {Math.min(1 + (currentPage - 1) * itemsPerPage, sortedProducts.length)} -{' '}
                    {Math.min(currentPage * itemsPerPage, sortedProducts.length)}
                  </span>{' '}
                  of <span className="font-semibold text-[#0b1c30]">{sortedProducts.length}</span> catalogue items
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs hover:bg-[#dce9ff] transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 border border-[#dce9ff]"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg font-['Space_Grotesk'] text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#131b2e] text-white shadow-sm'
                          : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] border border-[#dce9ff]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs hover:bg-[#dce9ff] transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 border border-[#dce9ff]"
                  >
                    <span>Next</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </nav>
            )}
          </main>
        </div>
      </section>

      {/* Sticky Bottom Quick Inquiry Helper Banner */}
      <section className="w-full bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] py-4 border-t border-[#e5eeff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fea619]/20 flex items-center justify-center text-[#855300] shrink-0">
              <span className="material-symbols-outlined text-[26px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm sm:text-base text-[#0b1c30] font-bold">
                  Want to check bulk order pricing or confirm immediate store stock?
                </span>
                <span className="hidden sm:inline-block bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold">
                  Today: Closes {storeConfig.closeTime}
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-0.5">
                {storeConfig.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => openInquiryModal('Bulk Order / Stock Check')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#fea619] hover:text-[#684000] shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp Quick Inquiry</span>
            </button>
            <a
              href={`https://maps.google.com/?q=${storeConfig.googleMapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#dce9ff] shadow-sm transition-all border border-[#dce9ff]"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
