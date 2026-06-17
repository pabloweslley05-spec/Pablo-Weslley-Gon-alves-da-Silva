import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductModel } from '../types';
import { Plus, Edit2, Trash2, X, DollarSign, Archive, Save, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InventoryTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('Vestidos');
  const [imageUrl, setImageUrl] = useState('');
  
  const [error, setError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('0');
    setStock('0');
    setCategory('Vestidos');
    setImageUrl('');
    setError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: ProductModel) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setStock(prod.stock.toString());
    setCategory(prod.category || 'Vestidos');
    setImageUrl(prod.imageUrl);
    setError('');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || Number(price) <= 0 || Number(stock) < 0) {
      setError('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      stock: Math.floor(Number(stock)),
      category,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' // default elegant clothing photo
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    const isConfirmed = window.confirm(`Deseja realmente remover a peça "${name}" do catálogo do ateliê? Esta ação não pode ser desfeita.`);
    if (isConfirmed) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header panel */}
      <div className="bg-[#1E1E1E] p-6 border border-white/5 rounded-none flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-light tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Acervo & Modelos
          </h2>
          <p className="text-xs text-white/50 font-sans tracking-widest uppercase">
            Adicione modelos exclusivos, modifique tecidos/valores e atualize quantidades do estoque
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-[#D4AF37] hover:bg-white text-black text-[10px] font-extrabold tracking-[0.2em] px-4 py-3.5 rounded-none flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all uppercase"
        >
          <Plus className="w-4 h-4" />
          Novo Modelo
        </button>
      </div>

      {/* Catalog items list table/cards for administrators */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-none overflow-hidden shadow-xl">
        <div className="p-4 bg-black border-b border-white/5 flex justify-between items-center px-6">
          <span className="text-[9px] text-white/55 font-bold uppercase tracking-[0.25em]">Catálogo Ativo • {products.length} Peças</span>
          <Archive className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <div className="divide-y divide-white/5">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-10 h-10 text-[#D4AF37]/30 mx-auto mb-2" />
              <p className="text-white/40 font-sans text-xs uppercase tracking-widest">Nenhum produto cadastrado no catálogo.</p>
            </div>
          ) : (
            products.map((prod) => (
              <div key={prod.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-black/20 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Small picture preview */}
                  <div className="w-12 h-16 bg-[#2A2A2A] rounded-none border border-black overflow-hidden flex-shrink-0">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover brightness-[0.85]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm font-light text-white tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>{prod.name}</h4>
                      {prod.category && (
                        <span className="text-[8px] bg-black text-[#D4AF37] border border-[#D4AF37]/35 rounded-none px-2 py-0.5 uppercase tracking-widest font-semibold font-sans">
                          {prod.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 font-sans line-clamp-1 max-w-md">{prod.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-white/40">
                      <span>Valor: <strong className="text-white font-sans font-normal">{formatPrice(prod.price)}</strong></span>
                      <span>Qtd Estoque: <strong className={`font-sans ${prod.stock === 0 ? 'text-red-400' : prod.stock < 3 ? 'text-amber-400' : 'text-[#D4AF37]'}`}>{prod.stock}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Edit and delete button actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleOpenEditForm(prod)}
                    className="p-2.5 bg-black border border-white/10 hover:border-[#D4AF37] text-white/50 hover:text-[#D4AF37] rounded-none transition-colors"
                    title="Editar Modelo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-2.5 bg-black border border-white/10 hover:border-red-500 text-white/40 hover:text-red-400 rounded-none transition-colors"
                    title="Excluir Modelo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Slide-over or central Modal containing add/edit form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#1E1E1E] border border-[#D4AF37]/55 rounded-none overflow-hidden p-6 shadow-2xl z-10"
            >
              {/* Corner indicators */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/50" />

              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
                <h3 className="font-serif text-lg font-light text-white tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                  {editingProduct ? 'Editar Peça' : 'Novo Croqui'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-white/40 hover:text-[#D4AF37]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-950/40 border border-red-500/50 text-red-200 text-[10px] py-2 px-3 rounded-none mb-4 text-center font-mono uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-[10px] font-sans">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                    Nome da Peça / Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vestido Sereia Diamond"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                      Preço de Venda (BRL) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ex: 3500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                      Quantidade Inicial *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Ex: 5"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                      Categoria / Linha *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all"
                    >
                      <option value="Vestidos">Vestidos</option>
                      <option value="Ternos">Ternos</option>
                      <option value="Sapatos">Sapatos</option>
                      <option value="Sobretudos">Sobretudos</option>
                      <option value="Acessórios">Acessórios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5">
                    Descrição & Ficha Técnica *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Especifique seda, drapeados, rendas francesas, bordados sob medida..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-all font-sans text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-none text-[10px] tracking-widest font-semibold transition-all uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-extrabold text-[10px] tracking-widest rounded-none flex items-center gap-1.5 shadow-md uppercase transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar Modelo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
