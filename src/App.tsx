/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickInquiryModal } from './components/QuickInquiryModal';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { CatalogueView } from './views/CatalogueView';
import { ServicesView } from './views/ServicesView';
import { CategoriesView } from './views/CategoriesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-['Plus_Jakarta_Sans']">
      <Header />

      {/* Main viewport with clearance for fixed header */}
      <main className="w-full pt-20 sm:pt-24 flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'product-catalogue' && <CatalogueView />}
        {activeView === 'printing-and-services' && <ServicesView />}
        {activeView === 'categories' && <CategoriesView />}
        {activeView === 'about-us' && <AboutView />}
        {activeView === 'contact-us' && <ContactView />}
        {activeView === 'admin-portal' && <AdminView />}
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <QuickInquiryModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
