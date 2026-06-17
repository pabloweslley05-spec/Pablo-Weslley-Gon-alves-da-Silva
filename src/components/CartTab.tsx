import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Armchair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartTabProps {
  onNavigateToOrders: () => void;
}

export const CartTab: React.FC<CartTabProps> = ({ onNavigateToOrders }) => {
  const { cart, addItemToCart, removeSingleItemFromCart, removeItemFromCart, placeOrder } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError('');
    try {
      await placeOrder();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onNavigateToOrders();
      }, 3000);
    } catch (err: any) {
      setError(err?.message || 'Erro ao finalizar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 px-8 bg-[#1E1E1E] border border-[#D4AF37] rounded-none max-w-lg mx-auto shadow-2xl space-y-6 relative"
      >
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/50" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-black border border-[#D4AF37] text-[#D4AF37] mb-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-light text-white tracking-[0.2em] uppercase" style={{ fontFamily: 'Georgia, serif' }}>
          Pedido Confirmado!
        </h3>
        <p className="font-sans text-xs text-white/60 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
          Nossos alfaiates já foram notificados. Daremos início à preparação do corte e aos refinamentos das suas peças exclusivas.
        </p>
        <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-semibold pt-4">
          Redirecionando para seus pedidos...
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#1E1E1E] p-6 border border-white/5 rounded-none flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-light tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Georgia, serif' }}>
              Minha Sacola
            </h2>
            <p className="text-xs text-white/50 font-sans tracking-widest uppercase">
              {cart.length === 0 ? 'Sua sacola está vazia.' : `Você possui ${cart.length} itens selecionados.`}
            </p>
          </div>
          <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/50 text-red-200 text-xs py-3.5 px-4 rounded-none text-center font-mono">
            {error}
          </div>
        )}

        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-[#1E1E1E] border border-white/5 rounded-none space-y-4"
            >
              <Armchair className="w-12 h-12 text-[#D4AF37]/30 mx-auto" />
              <p className="text-white/40 text-xs font-sans tracking-widest uppercase">Nenhuma peça foi adicionada ao seu carrinho.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  layout
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-[#1E1E1E] border border-white/5 hover:border-[#D4AF37]/30 rounded-none p-5 flex gap-4 items-center justify-between transition-colors duration-300"
                >
                  <div className="flex items-center gap-5">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-20 bg-[#2A2A2A] rounded-none overflow-hidden flex-shrink-0 border border-black">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover brightness-[0.85]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                          <ShoppingBag className="w-5 h-5 text-[#D4AF37]/30" />
                        </div>
                      )}
                    </div>

                    {/* Information */}
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-sm tracking-widest uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h3>
                      <div className="text-[10px] text-white/55 font-mono tracking-wider">
                        UNITÁRIO: <span className="text-white font-sans">{formatPrice(item.price)}</span>
                      </div>
                      <div className="text-xs text-[#D4AF37] font-bold font-mono tracking-widest">
                        SUBTOTAL: {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black border border-white/10 rounded-none">
                      <button
                        onClick={() => removeSingleItemFromCart(item.productId)}
                        className="p-1 px-3 text-white/50 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-sans text-xs font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => addItemToCart({ id: item.productId, name: item.name, price: item.price, imageUrl: item.imageUrl, description: '', stock: 99 })}
                        className="p-1 px-3 text-white/50 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItemFromCart(item.productId)}
                      className="p-2.5 text-white/40 hover:text-red-400 transition-colors bg-black border border-white/5 rounded-none"
                      title="Remover Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary section */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-none p-6 h-fit space-y-6">
        <h3 className="font-serif text-base font-light tracking-[0.2em] text-white border-b border-white/5 pb-4 flex items-center gap-2 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
          Valor Encomenda
        </h3>

        <div className="space-y-4 text-xs font-sans uppercase tracking-widest text-white/60">
          <div className="flex justify-between items-baseline">
            <span>Soma Peças</span>
            <span className="text-white tracking-widest text-sm font-semibold">{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
            <span className="text-[10px]">Ajustes Sob Medida</span>
            <span className="text-[#D4AF37] font-bold text-[10px]">CORTESIA</span>
          </div>

          <div className="flex justify-between items-baseline pt-2">
            <span className="text-xs font-semibold text-white tracking-[0.2em]">TOTAL REAL</span>
            <span className="text-2xl font-serif font-light text-[#D4AF37] tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Info label about premium ordering */}
        <div className="text-[9px] text-white/40 leading-relaxed font-sans border-t border-white/5 pt-4 space-y-2 uppercase tracking-widest">
          <p>
            * Ao finalizar o pedido, o estoque das peças é reduzido e nosso staff é encarregado de agendar suas medidas.
          </p>
          <p>
            * Orçamento formalizável via WhatsApp ou Pix.
          </p>
        </div>

        <button
          disabled={cart.length === 0 || loading}
          onClick={handleCheckout}
          className={`w-full py-4 text-xs tracking-[0.25em] font-extrabold flex items-center justify-center gap-2 rounded-none transition-all duration-300 uppercase ${
            cart.length > 0 && !loading
              ? 'bg-[#D4AF37] hover:bg-white text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              : 'bg-black text-white/10 border border-white/5 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              CONTRATAR ENCOMENDA
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
