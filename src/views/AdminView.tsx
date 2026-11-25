import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/initialData';
import { apiErrorMessage, uploadProductImage } from '../lib/api';
import { categoryMatches } from '../lib/category';

export const AdminView: React.FC = () => {
  const {
    products,
    categories,
    rateCards,
    inquiries,
    storeConfig,
    adminToken,
    adminLogin,
    adminLogout,
    addProduct,
    updateProduct,
    updateProductPrice,
    toggleProductVisibility,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateRate,
    updateAllRates,
    updateInquiryStatus,
    updateStoreConfig,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'catalog' | 'categories' | 'rates' | 'inquiries' | 'settings'>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');

  // Add / Edit Product Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Copier Paper');
  const [formBrand, setFormBrand] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStockStatus, setFormStockStatus] = useState<Product['stockStatus']>('In Stock at Shop');
  const [formIsPublic, setFormIsPublic] = useState(true);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Editable local rate cards map
  const [editableRates, setEditableRates] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    rateCards.forEach(r => {
      map[r.id] = r.rate;
    });
    return map;
  });

  // Business config form state
  const [configOpenTime, setConfigOpenTime] = useState(storeConfig.openTime);
  const [configCloseTime, setConfigCloseTime] = useState(storeConfig.closeTime);
  const [configDays, setConfigDays] = useState(storeConfig.operationalDays);
  const [configAddress, setConfigAddress] = useState(storeConfig.address);
  const [configPhone, setConfigPhone] = useState(storeConfig.phone);
  const [configWhatsapp, setConfigWhatsapp] = useState(storeConfig.whatsapp);
  const [configEmail, setConfigEmail] = useState(storeConfig.email);

  // New Category prompt
  const [isNewCategoryModal, setIsNewCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isUploadingCategoryImage, setIsUploadingCategoryImage] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const pendingInquiries = inquiries.filter(i => i.status === 'PENDING REPLY');

  useEffect(() => {
    const map: Record<string, number> = {};
    rateCards.forEach(rate => { map[rate.id] = rate.rate; });
    setEditableRates(map);
  }, [rateCards]);

  useEffect(() => {
    setConfigOpenTime(storeConfig.openTime);
    setConfigCloseTime(storeConfig.closeTime);
    setConfigDays(storeConfig.operationalDays);
    setConfigAddress(storeConfig.address);
    setConfigPhone(storeConfig.phone);
    setConfigWhatsapp(storeConfig.whatsapp);
    setConfigEmail(storeConfig.email);
  }, [storeConfig]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLogin(loginUsername, loginPassword);
    setLoginPassword('');
  };

  // Filtered products for table
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      !catalogSearch ||
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(catalogSearch.toLowerCase());

    const matchesCat =
      selectedCatFilter === 'ALL' ||
      p.category.toLowerCase() === selectedCatFilter.toLowerCase() ||
      p.category.includes(selectedCatFilter);

    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('Copier Paper');
    setFormBrand('');
    setFormSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice('150');
    setFormStockStatus('In Stock at Shop');
    setFormIsPublic(true);
    setFormDesc('');
    setFormImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCE1Ab0MuhishTZSFNxPrX92ItGMckhKWCBept_Kf0VHwnV_9pbToI8XYsmZeQLE_Q18RcJE579fZuoEbgOo2QElnHVvtQNZvNOyYquQLod3IBXPMGf5mnWjB-ToBvyVoZVL6AhkZefAKhm07gBwY-w5400N-xOOGOUk6m1MxSz_vSFvFAmlciUJO03UuCQfI3odQXGQRA1Ao24sUN4KEgGQBdyjUxyK55h91vMV-ke3JRxlFeF-fkK'
    );
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormSku(p.sku);
    setFormPrice(p.price.toString());
    setFormStockStatus(p.stockStatus);
    setFormIsPublic(p.isPublic);
    setFormDesc(p.description);
    setFormImage(p.image);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      showToast('Choose a JPEG, PNG, WebP, or GIF image.', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image files must be 5 MB or smaller.', 'warning');
      return;
    }
    if (!adminToken) {
      showToast('Please log in to the admin portal again.', 'warning');
      return;
    }

    setIsUploadingImage(true);
    try {
      setFormImage(await uploadProductImage(file, adminToken));
      showToast('Product image uploaded.');
    } catch (error) {
      showToast(apiErrorMessage(error), 'warning');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) return;
    const priceNum = parseFloat(formPrice) || 0;

    if (editingProductId) {
      const currentProduct = products.find(product => product.id === editingProductId);
      if (currentProduct) {
        void updateProduct({
          ...currentProduct,
          name: formName,
          category: formCategory,
          brand: formBrand,
          sku: formSku,
          price: priceNum,
          stockStatus: formStockStatus,
          isPublic: formIsPublic,
          description: formDesc,
          specDetails: formDesc,
          image: formImage,
        });
      }
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        brand: formBrand || 'Generic',
        sku: formSku,
        price: priceNum,
        unit: formCategory.includes('Paper') ? 'ream' : 'each',
        stockStatus: formStockStatus,
        stockCount: 50,
        isPublic: formIsPublic,
        image:
          formImage ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCE1Ab0MuhishTZSFNxPrX92ItGMckhKWCBept_Kf0VHwnV_9pbToI8XYsmZeQLE_Q18RcJE579fZuoEbgOo2QElnHVvtQNZvNOyYquQLod3IBXPMGf5mnWjB-ToBvyVoZVL6AhkZefAKhm07gBwY-w5400N-xOOGOUk6m1MxSz_vSFvFAmlciUJO03UuCQfI3odQXGQRA1Ao24sUN4KEgGQBdyjUxyK55h91vMV-ke3JRxlFeF-fkK',
        description: formDesc || 'Commercial grade stationery item supplied by SV Copiers.',
        specDetails: formDesc,
        badgeLabel: `${formBrand || 'Verified'} Spec`,
      });
    }

    setIsModalOpen(false);
  };

  const handleSaveRates = () => {
    updateAllRates(editableRates);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      openTime: configOpenTime,
      closeTime: configCloseTime,
      operationalDays: configDays,
      address: configAddress,
      phone: configPhone,
      whatsapp: configWhatsapp,
      email: configEmail,
    });
  };

  const handleOpenCategoryModal = (category?: (typeof categories)[number]) => {
    setEditingCategoryId(category?.id || null);
    setNewCatName(category?.name || '');
    setNewCatDescription(category?.description || '');
    setNewCatImage(category?.image || '');
    setIsNewCategoryModal(true);
  };

  const handleCategoryImageUpload = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      showToast('Choose a JPEG, PNG, WebP, or GIF image.', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image files must be 5 MB or smaller.', 'warning');
      return;
    }
    if (!adminToken) {
      showToast('Please log in to the admin portal again.', 'warning');
      return;
    }

    const previousImage = newCatImage;
    const previewUrl = URL.createObjectURL(file);
    setNewCatImage(previewUrl);
    setIsUploadingCategoryImage(true);
    try {
      const imageUrl = await uploadProductImage(file, adminToken, 'categories');
      URL.revokeObjectURL(previewUrl);
      setNewCatImage(imageUrl);
      showToast('Category image uploaded.');
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setNewCatImage(previousImage);
      showToast(apiErrorMessage(error), 'warning');
    } finally {
      setIsUploadingCategoryImage(false);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingCategoryImage || !newCatName.trim()) return;
    const saved = await saveCategory({
      name: newCatName.trim(),
      description: newCatDescription.trim(),
      image: newCatImage,
    }, editingCategoryId || undefined);
    if (saved) {
      setNewCatName('');
      setNewCatDescription('');
      setNewCatImage('');
      setEditingCategoryId(null);
      setIsNewCategoryModal(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Delete "${categoryName}"? Categories linked to products cannot be deleted.`)) {
      await deleteCategory(categoryId);
    }
  };

  if (!adminToken) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#f8f9ff] px-4 py-10">
        <form onSubmit={handleLoginSubmit} className="w-full max-w-md rounded-2xl border border-[#dce9ff] bg-white p-7 shadow-lg">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">Admin sign in</h1>
          <p className="mt-2 text-sm text-[#45464d]">Sign in to manage products, enquiries, rates, and store settings.</p>
          <label className="mt-5 block text-xs font-bold uppercase text-[#45464d]" htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            autoComplete="username"
            required
            value={loginUsername}
            onChange={event => setLoginUsername(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#dce9ff] bg-[#eff4ff] p-3 text-sm text-[#0b1c30] outline-none focus:border-[#131b2e]"
          />
          <label className="mt-4 block text-xs font-bold uppercase text-[#45464d]" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={loginPassword}
            onChange={event => setLoginPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#dce9ff] bg-[#eff4ff] p-3 text-sm text-[#0b1c30] outline-none focus:border-[#131b2e]"
          />
          <button type="submit" className="mt-6 w-full rounded-lg bg-[#131b2e] px-4 py-3 text-sm font-bold text-white hover:bg-[#fea619] hover:text-[#684000]">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] pb-12">
      {/* System Live Synced Notice */}
      <div className="w-full bg-[#000000] text-white py-2 px-4 sm:px-6 lg:px-12 shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-wider text-[#dce9ff]">
              Catalog Control Plane
            </span>
            <span className="text-[#565e74]">/</span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-white font-medium">
              Secure Admin Console • Changes update the public catalogue in real-time.
            </span>
          </div>

          <div className="flex items-center gap-3 font-['Space_Grotesk'] text-[11px] text-[#dce9ff]">
            <span>STORE NODE: AHM-EAST-01</span>
            <span className="bg-[#dce9ff]/20 px-2 py-0.5 rounded text-white font-bold">
              SYNCED
            </span>
            <button type="button" onClick={adminLogout} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Administrative Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          {/* Store Identity Panel */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#131b2e] text-white rounded-lg flex items-center justify-center font-['Space_Grotesk'] font-bold text-lg">
                SV
              </div>
              <div>
                <h1 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30] leading-none">
                  S V COPIERS
                </h1>
                <p className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase tracking-wider mt-0.5">
                  Xerox & Paper Spec
                </p>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-lg flex items-center justify-between border border-[#dce9ff]">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d] uppercase font-bold">
                  Store Status
                </span>
                <span className="font-['Space_Grotesk'] text-xs text-[#855300] font-bold">
                  Open • Closes {storeConfig.closeTime}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#fea619] text-[20px]">
                schedule
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white p-2 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span>Product Catalogue</span>
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeTab === 'catalog' ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#0b1c30]'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">category</span>
                <span>Category Taxonomy</span>
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#0b1c30]'
                }`}
              >
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'rates'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">request_quote</span>
                <span>Printing Rate Cards</span>
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeTab === 'rates' ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#0b1c30]'
                }`}
              >
                {rateCards.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
                <span>Customer Inquiries</span>
              </span>
              {pendingInquiries.length > 0 ? (
                <span className="bg-[#fea619] text-[#684000] px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {pendingInquiries.length} Pending
                </span>
              ) : (
                <span className="bg-[#eff4ff] text-[#0b1c30] px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {inquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">store</span>
                <span>Business Config</span>
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#76777d]">tune</span>
            </button>
          </nav>

          {/* Operational Hub Specs */}
          <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-1.5 border border-[#dce9ff]">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase tracking-wider font-bold">
              Ahmedabad Operational Hub
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-xs text-[#0b1c30] font-bold">
              Shop 10, Siddhivinayak Height
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
              Near Vishwakarma Engg College / Ratnaraj Green, Ahmedabad, Gujarat 382330
            </p>
            <div className="mt-2 pt-2 border-t border-[#dce9ff] flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d]">
                Reprographic Plotters
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#0b1c30]">
                {storeConfig.plotterStatus}
              </span>
            </div>
          </div>
        </aside>

        {/* Right 9-Column Workspace */}
        <section className="lg:col-span-9 flex flex-col gap-4">
          {/* Administrative Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                Active Catalog
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                  {products.length}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#855300] font-bold">
                  SKUs
                </span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d] mt-1">
                100% indexed
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                Categories
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                  {categories.length}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d]">Sections</span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d] mt-1">
                All mapped
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                Rate Tariffs
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                  {rateCards.length}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d]">Active</span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d] mt-1">
                B&W • Plot • Bind
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                Inquiries
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                  {inquiries.length}
                </span>
                {pendingInquiries.length > 0 && (
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#ba1a1a] font-bold">
                    {pendingInquiries.length} New
                  </span>
                )}
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#ba1a1a] font-medium">
                Direct WhatsApp
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#dce9ff] col-span-2 sm:col-span-1 flex flex-col justify-between">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                Store Today
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                  {storeConfig.closeTime.split(' ')[0]}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#0b1c30] font-bold">
                  {storeConfig.closeTime.split(' ')[1] || 'PM'}
                </span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#855300] font-medium">
                Closing Scheduled
              </span>
            </div>
          </div>

          {/* TAB 1: PRODUCT CATALOGUE */}
          {activeTab === 'catalog' && (
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0b1c30]">
                    Stationery & Print Supply Master
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Update item prices, toggle customer visibility, or add new papers and bindings.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-[#131b2e] text-white px-4 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-2 hover:bg-[#fea619] hover:text-[#684000] transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#76777d] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search SKU, Paper, Brand..."
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg focus:outline-none focus:bg-white border border-[#dce9ff]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['ALL', 'Copier Paper', 'Binding Supplies', 'Drafting Media', 'Office Supplies'].map(
                    cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCatFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] uppercase tracking-wide whitespace-nowrap cursor-pointer transition-all ${
                          selectedCatFilter === cat
                            ? 'bg-[#131b2e] text-white font-bold'
                            : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] border border-[#dce9ff]'
                        }`}
                      >
                        {cat === 'ALL' ? `All Items (${products.length})` : cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-[#dce9ff] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#eff4ff] text-[#45464d] font-['Space_Grotesk'] uppercase tracking-wider text-[11px] font-bold border-b border-[#dce9ff]">
                      <tr>
                        <th className="p-3">Spec Asset</th>
                        <th className="p-3">Product Identifier & Brand</th>
                        <th className="p-3">Category Classification</th>
                        <th className="p-3">Catalogue Tariff (₹)</th>
                        <th className="p-3">Inventory State</th>
                        <th className="p-3">Catalog State</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eff4ff] font-['Plus_Jakarta_Sans'] text-[#0b1c30]">
                      {filteredProducts.map(p => (
                        <tr
                          key={p.id}
                          className={`hover:bg-[#f8f9ff] transition-colors ${
                            !p.isPublic ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="p-3">
                            <img
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-lg bg-[#eff4ff] border border-[#dce9ff]"
                              src={p.image}
                            />
                          </td>

                          <td className="p-3">
                            <div className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30]">
                              {p.name}
                            </div>
                            <div className="font-['Space_Grotesk'] text-[10px] text-[#76777d]">
                              SKU: {p.sku} • {p.brand}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="bg-[#eff4ff] px-2 py-0.5 rounded text-[11px] text-[#0b1c30] font-medium border border-[#dce9ff]">
                              {p.category}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <span className="font-['Space_Grotesk'] font-bold">₹</span>
                              <input
                                type="number"
                                step="1"
                                defaultValue={p.price}
                                onBlur={e => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val !== p.price) {
                                    updateProductPrice(p.id, val);
                                  }
                                }}
                                className="w-20 px-2 py-1 bg-[#eff4ff] font-['Space_Grotesk'] text-xs font-bold rounded border border-[#dce9ff] focus:bg-white focus:outline-none"
                              />
                            </div>
                            <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] block mt-0.5">
                              per {p.unit}
                            </span>
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold ${
                                p.stockStatus === 'In Stock at Shop'
                                  ? 'bg-[#dce9ff] text-[#0b1c30]'
                                  : p.stockStatus === 'Low Stock'
                                  ? 'bg-[#ffddb8] text-[#855300]'
                                  : 'bg-[#ffdad6] text-[#ba1a1a]'
                              }`}
                            >
                              {p.stockStatus.toUpperCase()} ({p.stockCount ?? 15})
                            </span>
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-semibold ${
                                p.isPublic
                                  ? 'bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff]'
                                  : 'bg-gray-100 text-[#76777d]'
                              }`}
                            >
                              {p.isPublic ? 'Public' : 'Hidden'}
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 hover:bg-[#eff4ff] rounded text-[#45464d] hover:text-[#0b1c30]"
                                title="Edit Product Specs"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => toggleProductVisibility(p.id)}
                                className="p-1.5 hover:bg-[#eff4ff] rounded text-[#76777d] hover:text-[#0b1c30]"
                                title={p.isPublic ? 'Hide from Catalogue' : 'Show in Catalogue'}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {p.isPublic ? 'visibility_off' : 'visibility'}
                                </span>
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 hover:bg-[#ffdad6] rounded text-[#ba1a1a]"
                                title="Delete Product"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#eff4ff] p-3 flex items-center justify-between font-['Space_Grotesk'] text-xs text-[#45464d] border-t border-[#dce9ff]">
                  <span>Showing {filteredProducts.length} of {products.length} Items in Verified Ahmedabad Catalog</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#0b1c30]">Live Synchronized with Public Store</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORY TAXONOMY */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0b1c30]">
                    Stationery & Print Classification
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Categorization determines public directory grouping and filter tags.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCategoryModal()}
                  className="bg-[#131b2e] text-white px-4 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-2 hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const activeCount = products.filter(
                    p => categoryMatches(p.category, cat.name)
                  ).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white p-3 rounded-xl shadow-sm border border-[#dce9ff] flex items-center gap-3"
                    >
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-[#eff4ff]" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#76777d]">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] block truncate">
                          {cat.name}
                        </span>
                        <span className="font-['Space_Grotesk'] text-[11px] text-[#76777d]">
                          {activeCount} linked products
                        </span>
                        <div className="mt-2 flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="font-['Space_Grotesk'] text-[11px] font-bold text-[#0b1c30] hover:text-[#855300]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteCategory(cat.id, cat.name)}
                            className="font-['Space_Grotesk'] text-[11px] font-bold text-red-700 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PRINTING RATE CARDS */}
          {activeTab === 'rates' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0b1c30]">
                    Standard Printing Tariff Configurator
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Update the unit rates shown to customers inquiring via WhatsApp or in the Ahmedabad shop.
                  </p>
                </div>
                <button
                  onClick={handleSaveRates}
                  className="bg-[#131b2e] text-white px-4 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-2 hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Update All Tariffs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rateCards.map(service => (
                  <div
                    key={service.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-['Space_Grotesk'] text-[10px] bg-[#eff4ff] px-2 py-0.5 rounded text-[#0b1c30] font-bold border border-[#dce9ff]">
                          SERVICE ID: {service.serviceId}
                        </span>
                        <span className="material-symbols-outlined text-[#45464d] text-[20px]">
                          {service.category === 'xerox'
                            ? 'print'
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
                      <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-1">
                        {service.description}
                      </p>
                    </div>

                    <div className="bg-[#eff4ff] p-3 rounded-lg flex items-center justify-between border border-[#dce9ff]">
                      <div>
                        <span className="font-['Space_Grotesk'] text-[10px] text-[#76777d] uppercase font-bold">
                          Current Rate ({service.rateUnit})
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="0.25"
                            value={editableRates[service.id] ?? service.rate}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setEditableRates(prev => ({ ...prev, [service.id]: val }));
                            }}
                            className="w-24 px-2 py-1 bg-white font-['Space_Grotesk'] text-base font-bold rounded border border-[#dce9ff] focus:outline-none"
                          />
                        </div>
                      </div>
                      <span className="font-['Space_Grotesk'] text-xs text-[#855300] font-bold">
                        {service.turnaround}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER INQUIRIES LOG */}
          {activeTab === 'inquiries' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0b1c30]">
                    WhatsApp & Direct Consultation Log
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Customer inquiries routed directly from public catalogue spec requests. (No checkout/orders).
                  </p>
                </div>
                <span className="bg-[#fea619] text-[#684000] px-3 py-1 rounded-lg font-['Space_Grotesk'] text-xs font-bold">
                  {inquiries.length} Logged
                </span>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-[#dce9ff] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#eff4ff] text-[#45464d] font-['Space_Grotesk'] uppercase tracking-wider text-[11px] font-bold border-b border-[#dce9ff]">
                    <tr>
                      <th className="p-3">Received Time</th>
                      <th className="p-3">Client / Contact</th>
                      <th className="p-3">Inquired Item / Service</th>
                      <th className="p-3">Estimated Volume</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eff4ff] font-['Plus_Jakarta_Sans'] text-[#0b1c30]">
                    {inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-[#f8f9ff]">
                        <td className="p-3 font-['Space_Grotesk'] text-xs text-[#76777d]">
                          {inq.receivedTime}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-[#0b1c30]">{inq.clientName}</div>
                          <div className="font-['Space_Grotesk'] text-[11px] text-[#76777d]">
                            {inq.clientContact}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#0b1c30]">{inq.itemOrService}</div>
                          <div className="font-['Space_Grotesk'] text-[10px] text-[#76777d]">
                            SKU/Code: {inq.skuOrCode}
                          </div>
                          {inq.notes && (
                            <div className="text-[11px] text-[#45464d] italic mt-0.5">
                              "{inq.notes}"
                            </div>
                          )}
                        </td>
                        <td className="p-3">{inq.volume}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              updateInquiryStatus(
                                inq.id,
                                inq.status === 'PENDING REPLY' ? 'ADDRESSED' : 'PENDING REPLY'
                              )
                            }
                            className={`px-2 py-0.5 rounded font-['Space_Grotesk'] text-[10px] font-bold cursor-pointer transition-colors ${
                              inq.status === 'PENDING REPLY'
                                ? 'bg-[#fea619] text-[#684000]'
                                : 'bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff]'
                            }`}
                          >
                            {inq.status}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={`https://wa.me/${inq.clientContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${inq.clientName}, this is S V Copiers / Xerox regarding your inquiry on ${inq.itemOrService}. How can we assist you today?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#131b2e] text-white rounded font-['Space_Grotesk'] text-xs font-semibold hover:bg-[#fea619] hover:text-[#684000] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BUSINESS CONFIG */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#0b1c30]">
                    Ahmedabad Shop Settings & Contacts
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                    Controls store status indicator and direct inquiry routing destination.
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-[#131b2e] text-white px-4 py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-2 hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Store Configuration</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timings */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-3">
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fea619] text-[20px]">
                      schedule
                    </span>
                    <span>Shop Operational Hours (IST)</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div>
                      <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                        Morning Opening
                      </label>
                      <input
                        type="text"
                        value={configOpenTime}
                        onChange={e => setConfigOpenTime(e.target.value)}
                        className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                        Evening Closing (Current Store Badge)
                      </label>
                      <input
                        type="text"
                        value={configCloseTime}
                        onChange={e => setConfigCloseTime(e.target.value)}
                        className="w-full p-2 bg-[#eff4ff] text-[#855300] font-['Space_Grotesk'] text-xs font-bold rounded border border-[#dce9ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-1">
                    <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                      Weekly Store Operating Days
                    </label>
                    <input
                      type="text"
                      value={configDays}
                      onChange={e => setConfigDays(e.target.value)}
                      className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#eff4ff] p-3 rounded-lg text-[#45464d] font-['Plus_Jakarta_Sans'] text-xs border border-[#dce9ff]">
                    Current store status badge in header and notices calculate based on this closing time ({configCloseTime} IST).
                  </div>
                </div>

                {/* Location & Router */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-3">
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fea619] text-[20px]">
                      pin_drop
                    </span>
                    <span>Physical Presence & Inquiry Route</span>
                  </h3>

                  <div className="mt-1">
                    <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                      Physical Location Address
                    </label>
                    <textarea
                      rows={2}
                      value={configAddress}
                      onChange={e => setConfigAddress(e.target.value)}
                      className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                        Store Phone Contact
                      </label>
                      <input
                        type="text"
                        value={configPhone}
                        onChange={e => setConfigPhone(e.target.value)}
                        className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                        WhatsApp Router Number
                      </label>
                      <input
                        type="text"
                        value={configWhatsapp}
                        onChange={e => setConfigWhatsapp(e.target.value)}
                        className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold rounded border border-[#dce9ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-1">
                    <label className="font-['Space_Grotesk'] text-xs text-[#45464d] block mb-1">
                      Official Inquiry Email
                    </label>
                    <input
                      type="email"
                      value={configEmail}
                      onChange={e => setConfigEmail(e.target.value)}
                      className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#dce9ff] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">
                  {editingProductId ? 'Edit Product Specifications' : 'Add New Catalog Product'}
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  Items will be published to the Ahmedabad public catalog without cart mechanisms.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#131b2e] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-5 overflow-y-auto flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JK Cedar 80 GSM A4 Paper"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Category Classification *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                  >
                    <option value="Copier Paper">Copier Paper</option>
                    <option value="Pens">Pens & Pencils</option>
                    <option value="Notebooks">Notebooks & Registers</option>
                    <option value="School Stationery">School Stationery</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Files & Folders">Files & Folders</option>
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="Printer Supplies">Printer Supplies</option>
                    <option value="Drafting Media">Architectural Drafting Media</option>
                    <option value="Binding Supplies">Binding Supplies</option>
                    <option value="Finishing Media">Finishing Media</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Brand / Paper Mill
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JK Paper / BILT"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PAP-JK-80A4"
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="380"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold rounded border border-[#dce9ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Inventory State
                  </label>
                  <select
                    value={formStockStatus}
                    onChange={e => setFormStockStatus(e.target.value as any)}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                  >
                    <option value="In Stock at Shop">In Store Stock</option>
                    <option value="Low Stock">Low Stock Alert</option>
                    <option value="Available on Request">Available on Request</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Public Directory Visibility
                  </label>
                  <select
                    value={formIsPublic ? 'public' : 'hidden'}
                    onChange={e => setFormIsPublic(e.target.value === 'public')}
                    className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                  >
                    <option value="public">Public (Visible in Catalogue)</option>
                    <option value="hidden">Hidden (Draft / Warehouse Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                  Product Image
                </label>
                <input
                  type="url"
                  placeholder="Paste an image URL or upload an image"
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    aria-label="Upload product image"
                    disabled={isUploadingImage}
                    onChange={event => {
                      const file = event.currentTarget.files?.[0];
                      event.currentTarget.value = '';
                      if (file) void handleImageUpload(file);
                    }}
                    className="min-w-0 flex-1 text-xs text-[#45464d] file:mr-3 file:rounded file:border-0 file:bg-[#eff4ff] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#0b1c30]"
                  />
                  <span className="shrink-0 text-[11px] text-[#45464d]">
                    {isUploadingImage ? 'Uploading…' : 'JPEG, PNG, WebP, GIF · max 5 MB'}
                  </span>
                </div>
                {formImage && (
                  <img
                    alt="Product preview"
                    src={formImage}
                    className="mt-3 h-20 w-20 rounded-lg border border-[#dce9ff] bg-[#eff4ff] object-contain"
                  />
                )}
              </div>

              <div>
                <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                  Technical Specification Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 500 sheets ream, ultra-high brightness 98%, designed for heavy photocopiers..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-['Space_Grotesk'] text-[#45464d] hover:text-[#0b1c30]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-5 py-2.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                >
                  {isUploadingImage ? 'Uploading Image…' : 'Save Product to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CATEGORY MODAL */}
      {isNewCategoryModal && (
        <div
          className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsNewCategoryModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-5 border border-[#dce9ff]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30] mb-1">
              {editingCategoryId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mb-3">
              Add a name and optional image for this catalogue category.
            </p>

            <form onSubmit={handleAddCategorySubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="e.g. Parchment & Specialty Papers"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
              />
              <textarea
                rows={2}
                placeholder="Short category description (optional)"
                value={newCatDescription}
                onChange={e => setNewCatDescription(e.target.value)}
                className="w-full p-2 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded border border-[#dce9ff] focus:outline-none"
              />
              <label className="flex flex-col gap-2 font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30]">
                Category Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={isUploadingCategoryImage}
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) void handleCategoryImageUpload(file);
                    event.currentTarget.value = '';
                  }}
                  className="w-full text-xs font-normal file:mr-3 file:rounded file:border-0 file:bg-[#eff4ff] file:px-3 file:py-2 file:text-xs file:font-bold"
                />
              </label>
              <p className="text-[11px] text-[#76777d]">JPEG, PNG, WebP, or GIF; maximum 5 MB.</p>
              {newCatImage && (
                <img
                  src={newCatImage}
                  alt="Category preview"
                  className="h-36 w-full rounded-lg border border-[#dce9ff] bg-[#eff4ff] object-cover"
                />
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryModal(false);
                    setEditingCategoryId(null);
                    setNewCatImage('');
                  }}
                  className="px-3 py-1.5 text-xs text-[#45464d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCategoryImage}
                  className="px-4 py-2 bg-[#131b2e] text-white rounded font-['Space_Grotesk'] text-xs font-bold hover:bg-[#fea619] hover:text-[#684000]"
                >
                  {isUploadingCategoryImage ? 'Uploading…' : editingCategoryId ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
