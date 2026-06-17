import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderModel } from '../types';
import { Calendar, Package, ChevronDown, ChevronUp, Sparkles, MessageSquare, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerOrdersTab: React.FC = () => {
  const { orders, currentUser } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const customerOrders = orders.filter(
    (order) => order.customerId === currentUser?.uid
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Status mapping to steps indices
  const statusSteps = ['Pendente', 'Preparando', 'Enviado', 'Entregue'];
  const getStepIndex = (status: OrderModel['status']) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header with premium look */}
      <div className="bg-[#1E1E1E] p-6 border border-white/5 rounded-none flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-light tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Minhas Encomendas
          </h2>
          <p className="text-xs text-white/50 font-sans tracking-widest uppercase">
            Acompanhe a confecção, acabamento e status de alfaiataria
          </p>
        </div>
        <Package className="w-6 h-6 text-[#D4AF37]" />
      </div>

      {customerOrders.length === 0 ? (
        <div className="text-center py-20 bg-[#1E1E1E] border border-white/5 rounded-none">
          <Calendar className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-3" />
          <p className="text-xs font-sans tracking-widest uppercase text-white/60">Você ainda não solicitou nenhuma encomenda de luxo.</p>
          <p className="text-[11px] text-white/40 font-sans tracking-wide mt-1.5 uppercase">Navegue pelas nossas opções no catálogo e comece agora.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {customerOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const currentStepIdx = getStepIndex(order.status);

              return (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-[#1E1E1E] border border-white/5 focus-within:border-[#D4AF37]/50 rounded-none overflow-hidden transition-all duration-300"
                >
                  {/* Top Header Card Trigger */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-black/30 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#D4AF37] bg-black px-2.5 py-1 rounded-none border border-[#D4AF37]/35 tracking-widest uppercase">
                          {order.id}
                        </span>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">
                          ENCOMENDADO EM: {formatDate(order.createdAt)}
                        </span>
                      </div>
                      
                      {/* Brief list of item names on collapsed */}
                      {!isExpanded && (
                        <p className="text-xs text-white/50 font-sans line-clamp-1 uppercase tracking-wider">
                          Peças: {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      {/* Total and Live status tag */}
                      <div className="text-right">
                        <span className="text-[9px] text-white/40 block uppercase tracking-widest font-medium">VALOR ENCOMENDA</span>
                        <span className="font-serif text-base font-light text-[#D4AF37] tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border ${
                          order.status === 'Entregue'
                            ? 'bg-emerald-950/70 border-emerald-900 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                            : order.status === 'Enviado'
                            ? 'bg-blue-950/70 border-blue-900 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                            : order.status === 'Preparando'
                            ? 'bg-amber-950/70 border-amber-900 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                            : 'bg-black border-white/5 text-white/60'
                        }`}>
                          {order.status}
                        </span>
                        
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-white/40" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable detailed drawer */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-black overflow-hidden bg-black/20"
                    >
                      <div className="p-6 space-y-6">
                        {/* Interactive Steps Visual Timeline */}
                        <div className="space-y-3 p-4 bg-black border border-white/5 rounded-none">
                          <h4 className="text-[9px] text-white/40 uppercase tracking-[0.25em] font-semibold text-center mb-1">
                            Estágio de Confecção Sob Medida
                          </h4>
                          
                          <div className="grid grid-cols-4 relative pt-4 pb-2">
                            {/* Horizontal connect line */}
                            <div className="absolute top-[26px] left-[12.5%] right-[12.5%] h-[1px] bg-white/10 z-0">
                              <div
                                className="h-full bg-[#D4AF37] transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                              />
                            </div>

                            {statusSteps.map((stepName, stepIdx) => {
                              const isCompleted = currentStepIdx >= stepIdx;
                              const isActive = currentStepIdx === stepIdx;

                              return (
                                <div key={stepName} className="flex flex-col items-center relative z-10">
                                  <div className={`w-6 h-6 rounded-none flex items-center justify-center border transition-all ${
                                    isActive
                                      ? 'bg-black border-[#D4AF37] text-[#D4AF37] ring-4 ring-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                                      : isCompleted
                                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                      : 'bg-[#1E1E1E] border-white/10 text-white/40'
                                  }`}>
                                    {isCompleted && !isActive ? (
                                      <Check className="w-3.5 h-3.5" />
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold">{stepIdx + 1}</span>
                                    )}
                                  </div>
                                  <span className={`text-[9px] uppercase tracking-widest font-semibold mt-3 ${
                                    isActive ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-white/30'
                                  }`}>
                                    {stepName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order info list and products detailed */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-3">
                            <h5 className="text-[11px] text-[#D4AF37] uppercase tracking-widest font-semibold">Peças Inclusas na Encomenda</h5>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-sans">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-12 bg-black border border-white/5 overflow-hidden rounded-none">
                                      {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover brightness-[0.85]" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-white font-serif" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</p>
                                      <p className="text-white/45">{item.quantity} x {formatPrice(item.price)}</p>
                                    </div>
                                  </div>
                                  <span className="font-serif font-light text-white tracking-widest">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Contact and address notes */}
                          <div className="bg-black border border-white/5 rounded-none p-4 space-y-3 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                PROVA PRESENCIAL
                              </h5>
                              <p className="text-[10px] text-white/50 leading-normal uppercase tracking-wider">
                                Deseja agendar uma prova no ateliê para validar as dimensões exatas da sua peça? Fale agora com nossa equipe.
                              </p>
                            </div>
                            <button className="w-full py-3 bg-black border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[10px] font-bold font-sans tracking-[0.2em] text-[#D4AF37] hover:text-white rounded-none transition-colors flex items-center justify-center gap-2 uppercase">
                              <MessageSquare className="w-3.5 h-3.5" />
                              CHAMAR CONSULTOR
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
