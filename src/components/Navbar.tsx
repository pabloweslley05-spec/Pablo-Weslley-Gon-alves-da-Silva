import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingCart, LogOut, Shield, User, Compass } from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'cart' | 'orders' | 'inventory' | 'manageOrders';
  setCurrentTab: (tab: 'catalog' | 'cart' | 'orders' | 'inventory' | 'manageOrders') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, signOut, cart } = useApp();

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-900 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Brand Logo & slogan */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => setCurrentTab(currentUser?.role === 'employee' ? 'inventory' : 'catalog')}>
          <div className="w-10 h-10 rounded-full bg-black border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.15)] group-hover:border-[#D4AF37] transition-all">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-extrabold tracking-[0.2em] text-white">
              ATELIÊ RANIERE
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans font-semibold">
              ALTA COSTURA & ALFAIATARIA
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {/* Role indicator badge */}
            <div className="flex items-center gap-1.5 bg-neutral-950/60 border border-neutral-900 rounded-lg px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-white">
              {currentUser.role === 'employee' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Painel Ateliê: <strong className="text-[#D4AF37]">{currentUser.name}</strong></span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Cliente: <strong className="text-[#D4AF37]">{currentUser.name}</strong></span>
                </>
              )}
            </div>

            {/* Navigation block */}
            <nav className="flex items-center gap-1.5">
              {currentUser.role === 'client' ? (
                <>
                  <button
                    onClick={() => setCurrentTab('catalog')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      currentTab === 'catalog'
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Catálogo
                  </button>

                  <button
                    onClick={() => setCurrentTab('orders')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      currentTab === 'orders'
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Pedidos
                  </button>

                  <button
                    onClick={() => setCurrentTab('cart')}
                    className={`relative p-2 rounded-lg border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900 transition-all ${
                      currentTab === 'cart' ? 'border-[#D4AF37]/50 text-[#D4AF37]' : 'text-neutral-400'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold font-mono flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentTab('inventory')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      currentTab === 'inventory'
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Gerenciar Acervo
                  </button>

                  <button
                    onClick={() => setCurrentTab('manageOrders')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      currentTab === 'manageOrders'
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Pedidos Recebidos
                  </button>
                </>
              )}

              {/* Log Out button */}
              <button
                onClick={signOut}
                className="p-2 border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 hover:border-red-500/30 text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
