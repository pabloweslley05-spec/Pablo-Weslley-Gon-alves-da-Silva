import React from 'react';
import { ProductModel } from '../types';
import { useApp } from '../context/AppContext';
import { X, ShoppingCart, Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  product: ProductModel;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addItemToCart } = useApp();
  const hasStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!hasStock) return;
    addItemToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm scrollbar-thin">
      <div className="flex min-h-screen items-center justify-center p-4 relative">
        {/* Click outside to close */}
        <div className="absolute inset-0 bg-transparent" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#1E1E1E] border border-[#D4AF37]/50 rounded-none overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10"
        >
          {/* Subtle corner elements */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/60" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/60" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/60" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/60" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-[#D4AF37] bg-black/80 rounded-none border border-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Beautiful Product Image */}
            <div className="relative bg-[#121212] group aspect-[4/5] md:aspect-auto md:h-full min-h-[300px] md:min-h-[450px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-95 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#D4AF37]/40">
                <Sparkles className="w-14 h-14 mb-2" />
                <span className="text-xs tracking-widest uppercase">Ateliê Raniere</span>
              </div>
            )}
            {/* Fine overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="p-8 md:p-10 flex flex-col justify-between space-y-8 bg-[#1e1e1e]">
            <div className="space-y-4">
              {/* Category flag */}
              {product.category && (
                <span className="bg-black/95 text-[#D4AF37] px-3.5 py-1.5 text-[8px] font-mono font-bold tracking-[0.25em] uppercase border border-[#D4AF37]/30 inline-block shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                  {product.category}
                </span>
              )}

              {/* Title */}
              <h2 className="font-serif text-3xl font-light tracking-wide text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {product.name}
              </h2>

              {/* Price Tag */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-semibold">VALOR</span>
                <span className="text-3xl font-serif font-light text-[#D4AF37] tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Stock indicator with nice styled visual status */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-none rotate-45 ${hasStock ? 'bg-[#D4AF37]' : 'bg-red-500'}`} />
                <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${hasStock ? 'text-white/75' : 'text-red-400'}`}>
                  {hasStock 
                    ? `Disponível para confecção rápida • ${product.stock} em estoque` 
                    : 'Indisponível no momento'
                  }
                </span>
              </div>

              {/* Gold divider line */}
              <div className="h-[1px] bg-gradient-to-r from-[#D4AF37]/40 via-transparent to-transparent my-6" />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#D4AF37]">
                  PROCESSO DE CRIAÇÃO & DETALHES
                </h4>
                <p className="text-white/60 font-sans text-xs leading-relaxed tracking-wide">
                  {product.description}
                </p>
              </div>

              {/* Luxury Guarantee details */}
              <div className="bg-black border border-white/5 p-4 mt-6">
                <p className="text-[9px] text-[#D4AF37] font-bold tracking-[0.25em] flex items-center gap-2 uppercase">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Ajuste Perfeito Raniere
                </p>
                <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                  Confecção personalizada premium. Oferecemos ajuste gratuito em nosso ateliê físico para todas as peças selecionadas para garantir caimento excelente.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-[10px] tracking-widest font-bold border border-white/10 text-white/50 hover:text-white hover:border-[#D4AF37]/80 bg-black rounded-none transition-colors uppercase"
              >
                Voltar
              </button>

              <button
                disabled={!hasStock}
                onClick={handleAddToCart}
                className={`flex-[2] py-4 text-[10px] tracking-widest font-extrabold flex items-center justify-center gap-2 rounded-none transition-all ${
                  hasStock
                    ? 'bg-[#D4AF37] hover:bg-white text-black shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'bg-black text-white/10 border border-white/5 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                ADICIONAR À SACOLA
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
