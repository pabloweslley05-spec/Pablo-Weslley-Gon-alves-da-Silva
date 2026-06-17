import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductModel } from '../types';
import { Search, Eye, ShoppingCart, Sparkles, Filter, CheckCircle, Upload, Scissors, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CatalogTabProps {
  onSelectProduct: (product: ProductModel) => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({ onSelectProduct }) => {
  const { products, addItemToCart, addProduct } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [notification, setNotification] = useState<string | null>(null);

  // Custom design states
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Vestidos');
  const [customDescription, setCustomDescription] = useState('');
  const [customImage, setCustomImage] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customSuccess, setCustomSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomImage(e.target.result as string);
          setCustomError(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setCustomError("Por favor, selecione um arquivo de imagem válido.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDescription.trim()) {
      setCustomError("Por favor, forneça pelo menos a descrição e especificações da sua peça.");
      return;
    }

    const name = customName.trim() || `Croqui Exclusivo de ${customCategory}`;
    const desc = customDescription.trim();
    
    // Create new bespoke product
    const newBespoke: Omit<ProductModel, 'id'> = {
      name,
      description: desc,
      price: 0, // Budget structured during WhatsApp or in-person consultation
      stock: 1,
      imageUrl: customImage || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
      category: 'Sob Medida'
    };

    // Add to catalog
    addProduct(newBespoke);
    
    // Create matching Product representation with matching id pattern to place in customer cart
    const tempBespokeProduct: ProductModel = {
      ...newBespoke,
      id: 'prod-custom-' + Date.now()
    };
    
    // Add to cart
    addItemToCart(tempBespokeProduct);

    setNotification(`"${name}" adicionado ao carrinho como Encomenda Sob Medida!`);
    
    // Reset form beautifully
    setCustomName('');
    setCustomCategory('Vestidos');
    setCustomDescription('');
    setCustomImage('');
    setCustomError(null);
    setCustomSuccess(true);
    
    setTimeout(() => {
      setCustomSuccess(false);
    }, 6000);
  };

  // Derive unique categories from products list
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: ProductModel, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening detail modal
    if (product.stock <= 0) return;
    addItemToCart(product);
    setNotification(`"${product.name}" adicionado ao carrinho!`);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#121212] border border-[#D4AF37] text-white py-3.5 px-6 rounded-none shadow-[0_0_30px_rgba(212,175,55,0.25)] font-sans text-xs font-semibold tracking-wider"
          >
            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sophisticated Dark Spotlight Luxury Hero Banner representing the design's signature highlight */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#121212] border border-white/5 rounded-none overflow-hidden group flex items-end p-6 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Dark gold ambient glow gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/45 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 opacity-80" />
        
        {/* Beautiful high-fashion background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-[1.02] transition-transform duration-[4000ms] ease-out brightness-[0.75"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200')` }}
        />

        {/* Framing fine gold accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/30 pointer-events-none" />

        <div className="relative z-20 max-w-xl space-y-4">
          <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] md:text-xs block font-bold">
            COLEÇÃO DEFINE LUXO
          </span>
          <h2 className="text-3xl md:text-6xl font-light leading-none text-white tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            O Esplendor do <br />
            <span className="italic text-[#D4AF37] font-serif">Veludo Noir</span>
          </h2>
          <p className="text-white/60 text-xs md:text-sm font-sans leading-relaxed">
            Uma exploração da silhueta clássica com toques de modernidade rústica. Tecidos nobres selecionados manualmente nas melhores tecelagens europeias.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button 
              onClick={() => {
                const target = products.find(p => p.category === 'Vestidos') || products[0];
                if (target) onSelectProduct(target);
              }}
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-white text-[#121212] hover:text-black font-extrabold text-[10px] tracking-widest uppercase transition-colors"
            >
              Explorar Peça
            </button>
            <span className="text-[#D4AF37] text-xs font-mono tracking-widest uppercase hidden sm:inline-block">
              ✦ Alta Costura Exclusiva
            </span>
          </div>
        </div>
      </div>

      {/* Styled search & filters panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1E1E1E] p-6 border border-white/5">
        <div className="space-y-1">
          <h3 className="text-lg font-light tracking-[0.2em] uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Catálogo / Acervo
          </h3>
          <p className="text-xs text-white/50 font-sans tracking-widest uppercase">
            Explore modelos selecionados de caimento absoluto
          </p>
        </div>

        {/* Search Input with gold accent & white borders */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="BUSCAR MODELO OU TECIDO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white py-3 pl-10 pr-4 text-xs tracking-widest font-sans uppercase outline-none transition-all placeholder-white/30"
          />
        </div>
      </div>

      {/* Category filters resembling wide-tracked Georgia aesthetic */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'bg-black text-white/50 border-white/5 hover:border-[#D4AF37]/55 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#1E1E1E] border border-dashed border-white/10">
          <Filter className="w-10 h-10 text-white/30 mx-auto mb-3 animate-pulse" />
          <p className="text-xs font-sans uppercase tracking-widest text-white/60">Nenhum croqui corresponde aos filtros.</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('Todos'); }}
            className="mt-3 text-xs text-[#D4AF37] tracking-widest uppercase border-b border-[#D4AF37] pb-0.5 hover:text-white hover:border-white transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        /* Sophisticated Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const hasStock = product.stock > 0;
            return (
              <motion.div
                layout
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-[#1E1E1E] border border-white/5 hover:border-[#D4AF37]/50 overflow-hidden cursor-pointer flex flex-col justify-between transition-colors duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Fine corner marks */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-[#D4AF37]/40 transition-colors pointer-events-none" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-transparent group-hover:border-[#D4AF37]/40 transition-colors pointer-events-none" />

                {/* Imagery container with cinematic exposure */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2A2A2A] border-b border-black">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out brightness-[0.8] group-hover:brightness-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#D4AF37]/40">
                      <Sparkles className="w-12 h-12 mb-2" />
                      <span className="text-[10px] tracking-widest uppercase">Ateliê Raniere</span>
                    </div>
                  )}

                  {/* Elegant category badge */}
                  {product.category && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-black/95 text-[#D4AF37] px-3 py-1 text-[8px] font-mono font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/30">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Stock status tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase font-mono border ${
                      hasStock 
                        ? 'bg-black/90 text-[#D4AF37] border-[#D4AF37]/35 shadow-[0_0_10px_rgba(212,175,55,0.2)]' 
                        : 'bg-red-950/90 text-red-300 border-red-900/50'
                    }`}>
                      {hasStock ? `${product.stock} DISP.` : 'ESGOTADO'}
                    </span>
                  </div>

                  {/* Hover action overlay with luxury typography */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span 
                      className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-xs font-semibold tracking-[0.25em] px-6 py-3.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 uppercase"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      Explorar Peça
                    </span>
                  </div>
                </div>

                {/* Luxury Info Container */}
                <div className="p-5 space-y-4 bg-[#1E1E1E]">
                  <div>
                    <h4 
                      className="text-lg font-light tracking-wide text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] font-sans text-white/50 leading-relaxed line-clamp-2 mt-1.5">
                      {product.description}
                    </p>
                  </div>

                  {/* Price tag & Quick cart action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] block font-semibold">VALOR</span>
                      <span className="text-sm font-semibold text-white tracking-widest">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <button
                      disabled={!hasStock}
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`px-4 py-2.5 text-[10px] font-bold tracking-widest transition-all uppercase duration-300 ${
                        hasStock
                          ? 'bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/45'
                          : 'bg-black text-white/10 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dynamic luxury section: Ateliê Sob Medida / Cocriação */}
      <div className="border border-white/5 bg-[#1E1E1E] p-8 mt-12 relative overflow-hidden">
        {/* Subtle decorative marks */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/35" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#D4AF37]/35" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#D4AF37]/35" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/35" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Informative brand column */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Scissors className="w-5 h-5 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">Alta Alfaiataria sob Medida</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-wider leading-tight uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Estúdio de <br />
                <span className="italic text-[#D4AF37]">Cocriação</span> Raniere
              </h3>
              <p className="text-white/60 text-xs font-sans leading-relaxed">
                Dê asas à sua imaginação. Se você possui um modelo de vestido dos sonhos, terno, casaco com rendas específicas ou quer reproduzir um croqui autoral de alta costura, anexe suas fotos de referência e ficha descritiva.
              </p>
              <p className="text-white/40 text-[11px] font-sans leading-relaxed">
                Nossa equipe de modelagem analisará o drapeado, bordados franceses e estrutura para gerar a ficha técnica de provas e agendamento presencial.
              </p>
            </div>

            {/* Steps in dynamic card slots */}
            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-start gap-3">
                <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold w-6 h-6 rounded-none flex items-center justify-center shrink-0">1</span>
                <div>
                  <h5 className="text-[11px] text-white font-bold uppercase tracking-widest">Preencha & envie</h5>
                  <p className="text-[10px] text-white/50 font-sans">Forneça fotos e especificações de renda, seda ou drapeados.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold w-6 h-6 rounded-none flex items-center justify-center shrink-0">2</span>
                <div>
                  <h5 className="text-[11px] text-white font-bold uppercase tracking-widest">Simule na Sacola</h5>
                  <p className="text-[10px] text-white/50 font-sans">Seu croqui sob medida passa a integrar sua sacola para checkout.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold w-6 h-6 rounded-none flex items-center justify-center shrink-0">3</span>
                <div>
                  <h5 className="text-[11px] text-white font-bold uppercase tracking-widest">Agende suas Provas</h5>
                  <p className="text-[10px] text-white/50 font-sans">Ajustado via WhatsApp para o agendamento de medidas presenciais.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Practical interactive form column */}
          <div className="lg:col-span-12 xl:col-span-7 bg-black p-6 border border-white/5">
            <h4 className="text-xs uppercase tracking-[0.25em] font-extrabold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Ficha do Seu Modelo Exclusivo
            </h4>

            {customError && (
              <div className="mb-4 bg-red-950/40 border border-red-500/40 text-red-200 text-[10px] py-2.5 px-3 tracking-wider uppercase font-mono text-center">
                {customError}
              </div>
            )}

            {customSuccess && (
              <div className="mb-5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-[10px] py-3.5 px-4 tracking-wider uppercase font-mono text-center leading-relaxed">
                ✓ Croqui enviado com sucesso! Ele foi cadastrado na categoria "Sob Medida" e adicionado diretamente ao seu carrinho para solicitação de orçamento.
              </div>
            )}

            <form onSubmit={handleCreateCustom} className="space-y-4 text-[10px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#D4AF37] uppercase tracking-widest font-bold mb-1.5 font-mono">
                    Nome da Criação
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Vestido Sereia Ombros Caídos"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 text-white px-3.5 py-3 rounded-none outline-none focus:border-[#D4AF37] uppercase tracking-wider text-xs placeholder-white/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] uppercase tracking-widest font-bold mb-1.5 font-mono">
                    Categoria da Peça
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 text-white px-3.5 py-3 rounded-none outline-none focus:border-[#D4AF37] tracking-wider text-xs transition-colors"
                  >
                    <option value="Vestidos">Vestidos de Festa / Noivas</option>
                    <option value="Ternos">Ternos / Blazers Slim</option>
                    <option value="Tailleurs">Tailleurs / Casacos Estruturados</option>
                    <option value="Acessórios">Acessórios / Outros Customizados</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#D4AF37] uppercase tracking-widest font-bold mb-1.5 font-mono">
                  Descrição dos Materiais, Rendas & Caimento *
                </label>
                <textarea
                  rows={4}
                  placeholder="Especifique tudo que deseja no seu modelo: tecidos de preferência (Zibelina, Crepe, Seda, Renda Solstiss), estilo das alças, mangas, decote, comprimento da cauda, etc..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 text-white px-3.5 py-3 rounded-none outline-none focus:border-[#D4AF37] text-xs leading-relaxed placeholder-white/20 transition-colors"
                />
              </div>

              {/* Upload area conforming with drag-and-drop & manual click */}
              <div>
                <label className="block text-[#D4AF37] uppercase tracking-widest font-bold mb-1.5 font-mono">
                  Referência Visual / Foto ou Croqui Desenhado
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 rounded-none min-h-[140px] ${
                    isDragActive
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                      : 'border-white/10 hover:border-[#D4AF37]/40 bg-[#121212]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {customImage ? (
                    <div className="relative group w-full max-w-[200px] aspect-[3/4] overflow-hidden border border-white/10">
                      <img src={customImage} alt="Preview customizada" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomImage('');
                        }}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold tracking-widest uppercase text-[10px] transition-all"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Remover Foto
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#D4AF37] mb-1 animate-bounce" />
                      <span className="text-[11px] text-white font-bold tracking-wider uppercase">Arraste sua Imagem de Referência</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">ou clique para selecionar do seu dispositivo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Base price warning */}
              <div className="p-3.5 bg-[#121212] border border-white/5 flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold block">ORÇAMENTO DO ATELIÊ</span>
                  <p className="text-[10px] text-white font-serif leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Orçamentos definitivos e contratos de alfaiataria fina são selados em nossa conversa direta no WhatsApp ou na primeira prova presencial.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-white text-black font-extrabold tracking-[0.2em] uppercase text-[10px] px-8 py-3.5 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  ENVIAR PROJETO PARA SACOLA
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
