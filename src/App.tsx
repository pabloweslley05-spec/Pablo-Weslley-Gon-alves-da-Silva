import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { CatalogTab } from './components/CatalogTab';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartTab } from './components/CartTab';
import { CustomerOrdersTab } from './components/CustomerOrdersTab';
import { InventoryTab } from './components/InventoryTab';
import { ManageOrdersTab } from './components/ManageOrdersTab';
import { ProductModel } from './types';
import { Sparkles, Heart, Compass, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useApp();
  const [currentTab, setCurrentTab] = useState<'catalog' | 'cart' | 'orders' | 'inventory' | 'manageOrders'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

  // Sync tab option automatically when profile updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'employee') {
        setCurrentTab('inventory');
      } else {
        setCurrentTab('catalog');
      }
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#D4AF37] absolute animate-pulse" />
        </div>
        <h2 className="font-serif text-xl font-bold text-white tracking-[0.2em] uppercase">
          Carregando Ateliê
        </h2>
        <p className="text-[10px] text-neutral-500 tracking-widest font-sans uppercase mt-1">
          Garantindo Caimento & Elegância
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-200 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black font-sans">
      
      {/* Visual Header Block */}
      <div className="relative">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {/* Accent Top golden line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      </div>

      {/* Main visual Stage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentUser.role === 'client' ? (
              // CLIENT tabs
              <>
                {currentTab === 'catalog' && (
                  <CatalogTab onSelectProduct={(prod) => setSelectedProduct(prod)} />
                )}
                {currentTab === 'cart' && (
                  <CartTab onNavigateToOrders={() => setCurrentTab('orders')} />
                )}
                {currentTab === 'orders' && (
                  <CustomerOrdersTab />
                )}
              </>
            ) : (
              // STAFF tabs
              <>
                {currentTab === 'inventory' && <InventoryTab />}
                {currentTab === 'manageOrders' && <ManageOrdersTab />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Detailed elegant Product overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Luxurious footer containing brand info details */}
      <footer className="bg-black border-t border-neutral-900 mt-12 py-10 selection:bg-[#D4AF37] selection:text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-500 text-xs font-sans">
            
            {/* Identity column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-serif text-sm font-bold tracking-widest text-white uppercase">Ateliê Raniere</span>
              </div>
              <p className="leading-relaxed text-[11px] text-neutral-400">
                Alta costura projetada com perfeição matemática, tecidos premium e as mãos mais qualificadas do Brasil. O caimento absoluto que redefine sua presença.
              </p>
            </div>

            {/* Address column */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-widest uppercase text-[10px] text-[#D4AF37]">
                Localização & Horário
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Av. Brasília, 1118, Missão Velha - CE</span>
                </li>
                <li className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Segunda a Sexta, das 09:00 ás 19:00</span>
                </li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white tracking-widest uppercase text-[10px] text-[#D4AF37]">
                Entre em Contato
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>WhatsApp: (88) 98889-1446</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>ranieregoncalvesdasilva@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-neutral-950 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-600 font-sans uppercase tracking-wider">
            <p>© {new Date().getFullYear()} Ateliê Raniere LTDA. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com refinamento & alta costura <Heart className="w-3 h-3 text-[#D4AF37] fill-current animate-pulse" />
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
