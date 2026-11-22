import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Product,
  Category,
  PrintingRateCard,
  CustomerInquiry,
  StoreConfig,
  INITIAL_RATE_CARDS,
  INITIAL_STORE_CONFIG,
} from '../data/initialData';
import { apiErrorMessage, apiRequest } from '../lib/api';

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

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  images?: string[];
  specifications?: Record<string, unknown>;
  stockQuantity?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

interface ApiService {
  id: string;
  name: string;
  description?: string;
  price: number | null;
  isActive: boolean;
}

interface ApiEnquiry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

interface ApiSettings {
  businessName?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  openingHours?: string;
  closingHours?: string;
  operationalDays?: string;
  landmark?: string;
  googleMapsQuery?: string;
  [key: string]: unknown;
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
  isLoading: boolean;
  apiError: string;
  adminToken: string | null;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  addProduct: (newProd: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  updateProductPrice: (idOrSku: string, newPrice: number) => Promise<void>;
  toggleProductVisibility: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string, description?: string) => Promise<void>;
  updateRate: (id: string, newRate: number) => Promise<void>;
  updateAllRates: (updatedRates: Record<string, number>) => Promise<void>;
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'receivedTime' | 'status'>) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: CustomerInquiry['status']) => Promise<void>;
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => Promise<void>;
  detailProduct: Product | null;
  setDetailProduct: (prod: Product | null) => void;
  inquiryModal: InquiryModalData;
  openInquiryModal: (itemOrService: string, skuOrCode?: string, price?: number | string) => void;
  closeInquiryModal: () => void;
  toast: ToastInfo;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

interface ApiData<T> {
  data: T;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function mapProduct(product: ApiProduct): Product {
  const specifications = product.specifications || {};
  const stockStatus = specifications.stockStatus;
  const validStockStatus = stockStatus === 'In Stock at Shop' ||
    stockStatus === 'Available on Request' ||
    stockStatus === 'Low Stock' ||
    stockStatus === 'Out of Stock';

  return {
    id: product.id,
    sku: product.sku || '',
    name: product.name,
    brand: product.brand || '',
    category: product.category,
    price: product.price,
    unit: typeof specifications.unit === 'string' ? specifications.unit : 'each',
    stockStatus: validStockStatus
      ? stockStatus
      : product.stockQuantity === undefined
        ? 'Available on Request'
        : product.stockQuantity === 0
          ? 'Out of Stock'
          : product.stockQuantity < 10
            ? 'Low Stock'
            : 'In Stock at Shop',
    stockCount: product.stockQuantity,
    isPublic: product.isActive,
    image: product.images?.[0] || '',
    badgeLabel: typeof specifications.badgeLabel === 'string' ? specifications.badgeLabel : undefined,
    description: product.description || '',
    specDetails: typeof specifications.specDetails === 'string' ? specifications.specDetails : undefined,
    popularInHome: product.isFeatured,
  };
}

function toApiProduct(product: Omit<Product, 'id'> | Product): Record<string, unknown> {
  return {
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.category,
    brand: product.brand,
    price: product.price,
    images: product.image ? [product.image] : [],
    specifications: {
      unit: product.unit,
      stockStatus: product.stockStatus,
      badgeLabel: product.badgeLabel || '',
      specDetails: product.specDetails || '',
    },
    stockQuantity: product.stockCount,
    isAvailable: product.stockStatus !== 'Out of Stock',
    isFeatured: product.popularInHome === true,
    isActive: product.isPublic,
  };
}

function mapCategory(category: ApiCategory, products: Product[]): Category {
  const itemCount = products.filter((product) =>
    product.category.toLowerCase() === category.name.toLowerCase()
  ).length;
  return {
    id: category.id,
    name: category.name,
    itemCountText: `${itemCount} Items`,
    itemCount,
    icon: 'folder_open',
    description: category.description || '',
  };
}

function mapService(service: ApiService, index: number): PrintingRateCard {
  const name = service.name.toLowerCase();
  const template = INITIAL_RATE_CARDS.find((card) =>
    (name.includes('black') || name.includes('xerox') || name.includes('photocopy')) && card.category === 'xerox' ||
    (name.includes('colour') || name.includes('color')) && card.category === 'color' && card.title.toLowerCase().includes('colour') ||
    name.includes('lamination') && card.title.toLowerCase().includes('lamination') ||
    name.includes('spiral') && card.title.toLowerCase().includes('spiral') ||
    name.includes('photo') && card.title.toLowerCase().includes('photo') ||
    (name.includes('thesis') || name.includes('hardbound')) && card.category === 'thesis'
  ) || INITIAL_RATE_CARDS[index % INITIAL_RATE_CARDS.length];

  return {
    ...template,
    id: service.id,
    serviceId: service.id,
    title: service.name || template.title,
    description: service.description || template.description,
    rate: service.price ?? 0,
    rateDisplay: service.price === null ? 'Inquire at Shop' : undefined,
  };
}

function mapEnquiry(enquiry: ApiEnquiry): CustomerInquiry {
  return {
    id: enquiry.id,
    receivedTime: new Date(enquiry.createdAt).toLocaleString(),
    clientName: enquiry.name,
    clientContact: enquiry.phone || enquiry.email || '',
    itemOrService: enquiry.subject,
    skuOrCode: 'CONTACT-FORM',
    volume: '',
    status: enquiry.status === 'new' ? 'PENDING REPLY' : enquiry.status === 'archived' ? 'ARCHIVED' : 'ADDRESSED',
    notes: enquiry.message,
  };
}

function mapSettings(settings: ApiSettings): StoreConfig {
  const phone = settings.phone ?? INITIAL_STORE_CONFIG.phone;
  return {
    ...INITIAL_STORE_CONFIG,
    storeName: settings.businessName ?? INITIAL_STORE_CONFIG.storeName,
    address: settings.address ?? INITIAL_STORE_CONFIG.address,
    phone,
    whatsapp: settings.whatsapp ?? phone.replace(/\D/g, ''),
    email: settings.email ?? INITIAL_STORE_CONFIG.email,
    openTime: settings.openingHours ?? INITIAL_STORE_CONFIG.openTime,
    closeTime: settings.closingHours ?? INITIAL_STORE_CONFIG.closeTime,
    operationalDays: settings.operationalDays ?? INITIAL_STORE_CONFIG.operationalDays,
    landmark: settings.landmark ?? INITIAL_STORE_CONFIG.landmark,
    googleMapsQuery: settings.googleMapsQuery ?? INITIAL_STORE_CONFIG.googleMapsQuery,
  };
}

async function loadAllProducts(token?: string): Promise<ApiProduct[]> {
  const firstPage = await apiRequest<ApiData<ApiProduct[]> & { pagination?: { pages: number } }>(
    '/products?page=1&limit=100',
    {},
    token,
  );
  const products = [...firstPage.data];
  const pages = firstPage.pagination?.pages ?? 1;
  for (let page = 2; page <= pages; page += 1) {
    const result = await apiRequest<ApiData<ApiProduct[]> & { pagination?: { pages: number } }>(
      `/products?page=${page}&limit=100`,
      {},
      token,
    );
    products.push(...result.data);
  }
  return products;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rateCards, setRateCards] = useState<PrintingRateCard[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('sv_admin_token'));
  const [activeView, setActiveViewState] = useState<NavView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [inquiryModal, setInquiryModal] = useState<InquiryModalData>({ isOpen: false });
  const [toast, setToast] = useState<ToastInfo>({ message: '', visible: false, type: 'success' });

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    window.setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3400);
  };

  const loadData = async (token?: string) => {
    setIsLoading(true);
    setApiError('');
    try {
      const [apiProducts, apiCategories, servicesResponse, settingsResponse, enquiriesResponse] = await Promise.all([
        token
          ? apiRequest<ApiData<ApiProduct[]>>('/admin/products', {}, token).then((result) => result.data)
          : loadAllProducts(),
        apiRequest<ApiData<ApiCategory[]>>('/categories'),
        apiRequest<ApiData<ApiService[]>>('/services'),
        apiRequest<ApiData<ApiSettings>>('/settings/public'),
        token ? apiRequest<ApiData<ApiEnquiry[]>>('/admin/enquiries', {}, token) : Promise.resolve({ data: [] }),
      ]);
      const mappedProducts = apiProducts.map(mapProduct);
      setProducts(mappedProducts);
      setCategories(apiCategories.data.map((category) => mapCategory(category, mappedProducts)));
      setRateCards(servicesResponse.data.map(mapService));
      setStoreConfig(mapSettings(settingsResponse.data));
      setInquiries(enquiriesResponse.data.map(mapEnquiry));
    } catch (error) {
      setApiError(apiErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        await loadData(adminToken || undefined);
      } catch {
        if (adminToken && active) {
          sessionStorage.removeItem('sv_admin_token');
          setAdminToken(null);
        }
      }
    };
    void initialize();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product-catalogue')) {
        setActiveViewState('product-catalogue');
        if (hash.includes('?q=')) setSearchQuery(decodeURIComponent(hash.split('?q=')[1] || ''));
      } else if (hash === 'printing-and-services') setActiveViewState('printing-and-services');
      else if (hash === 'categories') setActiveViewState('categories');
      else if (hash === 'about-us') setActiveViewState('about-us');
      else if (hash === 'contact-us' || hash === 'contact-shop') setActiveViewState('contact-us');
      else if (hash === 'admin-portal' || hash === 'admin') setActiveViewState('admin-portal');
      else if (hash === 'home' || !hash) setActiveViewState('home');
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

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await apiRequest<{ token: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      sessionStorage.setItem('sv_admin_token', result.token);
      setAdminToken(result.token);
      await loadData(result.token);
      showToast('Admin login successful.');
      return true;
    } catch (error) {
      sessionStorage.removeItem('sv_admin_token');
      setAdminToken(null);
      showToast(apiErrorMessage(error), 'warning');
      return false;
    }
  };

  const adminLogout = () => {
    sessionStorage.removeItem('sv_admin_token');
    setAdminToken(null);
    setInquiries([]);
    void loadData().catch(() => undefined);
    showToast('Admin session ended.');
  };

  const runAdminMutation = async (action: () => Promise<unknown>, message: string) => {
    if (!adminToken) {
      showToast('Please log in to the admin portal again.', 'warning');
      return;
    }
    try {
      await action();
      await loadData(adminToken);
      showToast(message);
    } catch (error) {
      showToast(apiErrorMessage(error), 'warning');
    }
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) =>
    runAdminMutation(() => apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(toApiProduct(newProduct)),
    }, adminToken || undefined), `Product "${newProduct.name}" added to the catalogue.`);

  const updateProduct = (product: Product) =>
    runAdminMutation(() => apiRequest(`/admin/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(toApiProduct(product)),
    }, adminToken || undefined), `Product "${product.name}" updated.`);

  const updateProductPrice = (idOrSku: string, newPrice: number) => {
    const product = products.find((item) => item.id === idOrSku || item.sku === idOrSku);
    if (!product) {
      showToast('Product not found. Refresh the catalogue and try again.', 'warning');
      return Promise.resolve();
    }
    return updateProduct({ ...product, price: newPrice });
  };

  const toggleProductVisibility = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) {
      showToast('Product not found. Refresh the catalogue and try again.', 'warning');
      return Promise.resolve();
    }
    return updateProduct({ ...product, isPublic: !product.isPublic });
  };

  const deleteProduct = (id: string) =>
    runAdminMutation(() => apiRequest(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }, adminToken || undefined), 'Product archived.');

  const addCategory = (name: string, description = '') =>
    runAdminMutation(() => apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }, adminToken || undefined), `Category "${name}" created.`);

  const updateRate = (id: string, newRate: number) => updateAllRates({ [id]: newRate });

  const updateAllRates = (updatedRates: Record<string, number>) =>
    runAdminMutation(async () => {
      await Promise.all(rateCards.flatMap((service) => {
        const price = updatedRates[service.id] ?? updatedRates[service.serviceId];
        if (price === undefined) return [];
        return [apiRequest(`/admin/services/${encodeURIComponent(service.serviceId)}`, {
          method: 'PUT',
          body: JSON.stringify({ price }),
        }, adminToken || undefined)];
      }));
    }, 'Printing rates saved to the server.');

  const addInquiry = async (
    inquiry: Omit<CustomerInquiry, 'id' | 'receivedTime' | 'status'>,
  ): Promise<boolean> => {
    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: inquiry.clientName,
          phone: inquiry.clientContact,
          subject: `${inquiry.itemOrService}${inquiry.skuOrCode ? ` (${inquiry.skuOrCode})` : ''}`,
          message: [inquiry.volume && `Volume: ${inquiry.volume}`, inquiry.notes].filter(Boolean).join('\n'),
        }),
      });
      if (adminToken) await loadData(adminToken);
      showToast('Your inquiry was sent to the shop.');
      return true;
    } catch (error) {
      showToast(`Could not save your inquiry: ${apiErrorMessage(error)}`, 'warning');
      return false;
    }
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    const apiStatus = status === 'PENDING REPLY' ? 'new' : status === 'ARCHIVED' ? 'archived' : 'read';
    return runAdminMutation(() => apiRequest(`/admin/enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: apiStatus }),
    }, adminToken || undefined), `Inquiry marked ${status.toLowerCase()}.`);
  };

  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    const changes: Record<string, string> = {};
    if (newConfig.storeName !== undefined) changes.businessName = newConfig.storeName;
    if (newConfig.address !== undefined) changes.address = newConfig.address;
    if (newConfig.phone !== undefined) changes.phone = newConfig.phone;
    if (newConfig.email !== undefined) changes.email = newConfig.email;
    if (newConfig.whatsapp !== undefined) changes.whatsapp = newConfig.whatsapp;
    if (newConfig.openTime !== undefined) changes.openingHours = newConfig.openTime;
    if (newConfig.closeTime !== undefined) changes.closingHours = newConfig.closeTime;
    if (newConfig.operationalDays !== undefined) changes.operationalDays = newConfig.operationalDays;
    if (newConfig.landmark !== undefined) changes.landmark = newConfig.landmark;
    if (newConfig.googleMapsQuery !== undefined) changes.googleMapsQuery = newConfig.googleMapsQuery;
    return runAdminMutation(() => apiRequest('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }, adminToken || undefined), 'Store configuration saved.');
  };

  const openInquiryModal = (itemOrService: string, skuOrCode = '', price: number | string = '') => {
    setInquiryModal({ isOpen: true, itemOrService, skuOrCode, price });
  };

  const closeInquiryModal = () => setInquiryModal({ isOpen: false });

  return (
    <StoreContext.Provider value={{
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
      isLoading,
      apiError,
      adminToken,
      adminLogin,
      adminLogout,
      addProduct,
      updateProduct,
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
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
