import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  PrintingRateCard,
  CustomerInquiry,
  StoreConfig,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_RATE_CARDS,
  INITIAL_INQUIRIES,
  INITIAL_STORE_CONFIG,
} from '../data/initialData';

export type NavView = 'home' | 'product-catalogue' | 'printing-and-services' | 'categories' | 'about-us' | 'contact-us' | 'admin-portal';

interface ToastInfo {
  message: string;
  type?: 'success' | 'warning' | 'info';
  visible: boolean;
}

interface InquiryModalData {
  isOpen: boolean;
  itemOrService?: string;
  skuOrCode?: string;
  defaultNote?: string;
  price?: number | string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  rateCards: PrintingRateCard[];
  inquiries: CustomerInquiry[];
  storeConfig: StoreConfig;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  
  // Product actions
  addProduct: (newProd: Omit<Product, 'id'>) => void;
  updateProductPrice: (idOrSku: string, newPrice: number) => void;
  toggleProductVisibility: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Category actions
  addCategory: (name: string, description?: string) => void;

  // Rate card actions
  updateRate: (id: string, newRate: number) => void;
  updateAllRates: (updatedRates: Record<string, number>) => void;

  // Inquiries actions
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'receivedTime' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: CustomerInquiry['status']) => void;

  // Store config actions
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => void;

  // Modals & UI helpers
  detailProduct: Product | null;
  setDetailProduct: (prod: Product | null) => void;
  inquiryModal: InquiryModalData;
  openInquiryModal: (itemOrService: string, skuOrCode?: string, price?: number | string) => void;
  closeInquiryModal: () => void;
  toast: ToastInfo;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial from localStorage if available
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sv_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('sv_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [rateCards, setRateCards] = useState<PrintingRateCard[]>(() => {
    try {
      const saved = localStorage.getItem('sv_rates');
      return saved ? JSON.parse(saved) : INITIAL_RATE_CARDS;
    } catch {
      return INITIAL_RATE_CARDS;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('sv_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('sv_config');
      return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  // Navigation & filtering state
  const [activeView, setActiveViewState] = useState<NavView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Modals & toasts
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [inquiryModal, setInquiryModal] = useState<InquiryModalData>({ isOpen: false });
  const [toast, setToast] = useState<ToastInfo>({ message: '', visible: false, type: 'success' });

  // Handle URL hash changes for deep linking / back button
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product-catalogue')) {
        setActiveViewState('product-catalogue');
        if (hash.includes('?q=')) {
          const q = decodeURIComponent(hash.split('?q=')[1] || '');
          setSearchQuery(q);
        }
      } else if (hash === 'printing-and-services') {
        setActiveViewState('printing-and-services');
      } else if (hash === 'categories') {
        setActiveViewState('categories');
      } else if (hash === 'about-us') {
        setActiveViewState('about-us');
      } else if (hash === 'contact-us' || hash === 'contact-shop') {
        setActiveViewState('contact-us');
      } else if (hash === 'admin-portal' || hash === 'admin') {
        setActiveViewState('admin-portal');
      } else if (hash === 'home' || !hash) {
        setActiveViewState('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setActiveView = (view: NavView) => {
    setActiveViewState(view);
    window.location.hash = view === 'home' ? '' : `#${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sv_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_rates', JSON.stringify(rateCards));
    } catch (e) {
      console.error(e);
    }
  }, [rateCards]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_config', JSON.stringify(storeConfig));
    } catch (e) {
      console.error(e);
    }
  }, [storeConfig]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3400);
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts(prev => [product, ...prev]);
    showToast(`Product "${product.name}" added to public catalogue!`);
  };

  const updateProductPrice = (idOrSku: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === idOrSku || p.sku === idOrSku ? { ...p, price: newPrice } : p))
    );
    showToast(`Updated price to ₹${newPrice}. Changes live across catalogue.`);
  };

  const toggleProductVisibility = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isPublic: !p.isPublic } : p))
    );
    showToast(`Toggled catalogue visibility state.`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product removed from catalogue.`);
  };

  const addCategory = (name: string, description = '') => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      id,
      name,
      itemCountText: '0 Items',
      itemCount: 0,
      icon: 'folder_open',
      description: description || 'New taxonomy division',
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${name}" created.`);
  };

  const updateRate = (id: string, newRate: number) => {
    setRateCards(prev =>
      prev.map(r => (r.id === id || r.serviceId === id ? { ...r, rate: newRate } : r))
    );
    showToast(`Rate updated.`);
  };

  const updateAllRates = (updatedRates: Record<string, number>) => {
    setRateCards(prev =>
      prev.map(r => {
        if (updatedRates[r.id] !== undefined) {
          return { ...r, rate: updatedRates[r.id] };
        }
        if (updatedRates[r.serviceId] !== undefined) {
          return { ...r, rate: updatedRates[r.serviceId] };
        }
        return r;
      })
    );
    showToast(`All printing rate cards synchronized across customer calculators!`);
  };

  const addInquiry = (inquiry: Omit<CustomerInquiry, 'id' | 'receivedTime' | 'status'>) => {
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      receivedTime: 'Just now',
      status: 'PENDING REPLY',
    };
    setInquiries(prev => [newInquiry, ...prev]);
    showToast(`Inquiry routed to shop desk.`);
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
    showToast(`Inquiry marked as ${status}.`);
  };

  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({ ...prev, ...newConfig }));
    showToast(`Store configuration saved! Closing time: ${newConfig.closeTime || storeConfig.closeTime}`);
  };

  const openInquiryModal = (itemOrService: string, skuOrCode = '', price: number | string = '') => {
    setInquiryModal({
      isOpen: true,
      itemOrService,
      skuOrCode,
      price,
    });
  };

  const closeInquiryModal = () => {
    setInquiryModal({ isOpen: false });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        rateCards,
        inquiries,
        storeConfig,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        addProduct,
        updateProductPrice,
        toggleProductVisibility,
        deleteProduct,
        addCategory,
        updateRate,
        updateAllRates,
        addInquiry,
        updateInquiryStatus,
        updateStoreConfig,
        detailProduct,
        setDetailProduct,
        inquiryModal,
        openInquiryModal,
        closeInquiryModal,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
