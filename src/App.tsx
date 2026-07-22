import React, { useState, useEffect } from 'react';
import { WatchProduct, StoreSettings, PageView } from './types';
import { loadWatches, saveWatches, loadSettings, saveSettings } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeView } from './views/HomeView';
import { CollectionView } from './views/CollectionView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyTermsView } from './views/PrivacyTermsView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);

  const [watches, setWatches] = useState<WatchProduct[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(loadSettings());

  // Load state on mount
  useEffect(() => {
    const loadedWatches = loadWatches();
    const loadedSettings = loadSettings();
    setWatches(loadedWatches);
    setSettings(loadedSettings);
  }, []);

  // Save handlers
  const handleSaveWatches = (newWatches: WatchProduct[]) => {
    setWatches(newWatches);
    saveWatches(newWatches);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Navigation Handler
  const handleNavigate = (view: PageView, filterCategory?: string) => {
    setCurrentView(view);
    if (filterCategory !== undefined) {
      setSelectedCategory(filterCategory);
    } else if (view !== 'collection') {
      setSelectedCategory('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2B2A26] flex flex-col font-sans selection:bg-[#5C6B3A] selection:text-white">
      
      {/* Sticky Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        settings={settings}
        totalProductsCount={watches.length}
      />

      {/* Main View Router Container */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            watches={watches}
            settings={settings}
            onNavigate={handleNavigate}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'collection' && (
          <CollectionView
            watches={watches}
            settings={settings}
            initialCategory={selectedCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'new-arrivals' && (
          <CollectionView
            watches={watches}
            settings={settings}
            presetFilterType="new-arrivals"
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'best-sellers' && (
          <CollectionView
            watches={watches}
            settings={settings}
            presetFilterType="best-sellers"
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            settings={settings}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyTermsView
            initialTab="privacy"
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'terms' && (
          <PrivacyTermsView
            initialTab="terms"
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            watches={watches}
            settings={settings}
            onSaveWatches={handleSaveWatches}
            onSaveSettings={handleSaveSettings}
            onExitAdmin={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          allProducts={watches}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        settings={settings}
      />

    </div>
  );
}
