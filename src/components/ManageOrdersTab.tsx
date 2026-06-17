import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderModel } from '../types';
import { DollarSign, Shield, ShoppingBag, Eye, Calendar, Sparkles, MessageSquare, Clipboard, Package, ArrowRight, UserCheck, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ManageOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Pendente' | 'Preparando' | 'Enviado' | 'Entregue'>('Todos');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    let d: Date;
    if (typeof date === 'string') {
      d = new Date(date);
    } else if (date && typeof date === 'object' && date.toDate) {
      d = date.toDate();
    } else {
      d = new Date(date);
    }
    
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Metrics logic
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalPrice, 0);
  const pendingCount = orders.filter(ord => ord.status === 'Pendente' || ord.status === 'Preparando').length;
  const deliveryCount = orders.filter(ord => ord.status === 'Entregue').length;

  const filteredOrders = orders.filter(ord => {
    if (selectedFilter === 'Todos') return true;
    return ord.status === selectedFilter;
  });

  const handleStatusChange = (orderId: string, currentStatus: OrderModel['status']) => {
    const statusFlow: Record<OrderModel['status'], OrderModel['status']> = {
      'Pendente': 'Preparando',
      'Preparando': 'Enviado',
      'Enviado': 'Entregue',
      'Entregue': 'Pendente' // allow cycle back for easy demo adjustment
    };
    updateOrderStatus(orderId, statusFlow[currentStatus]);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header panel */}
      <div className="bg-[#1E1E1E] p-6 border border-white/5 rounded-none flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-light tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Painel de Pedidos
          </h2>
          <p className="text-xs text-white/50 font-sans tracking-widest uppercase">
            Acompanhe a confecção, mude status e gerencie solicitações sob medida
          </p>
        </div>
        <Clipboard className="w-6 h-6 text-[#D4AF37]" />
      </div>

      {/* Modern High-End Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue metric */}
        <div className="bg-[#1E1E1E] border border-white/5 rounded-none p-5 relative overflow-hidden flex flex-col justify-between shadow-xl group hover:border-[#D4AF37]/35 transition-all">
          <div className="absolute top-2 right-2 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors">
            <DollarSign className="w-16 h-16" />
          </div>
          <div className="space-y-1.5 z-10">
            <span className="text-[8px] text-[#D4AF37] tracking-[0.25em] font-bold block uppercase font-mono">VALOR FATURADO BRUTO</span>
            <span className="font-serif text-2xl font-light text-white tracking-widest block" style={{ fontFamily: 'Georgia, serif' }}>
              {formatPrice(totalRevenue)}
            </span>
          </div>
          <span className="text-[9px] text-white/40 font-mono mt-3 uppercase tracking-wider">Total acumulado bruto</span>
        </div>

        {/* Pending state metric */}
        <div className="bg-[#1E1E1E] border border-white/5 rounded-none p-5 relative overflow-hidden flex flex-col justify-between shadow-xl group hover:border-amber-500/20 transition-all">
          <div className="absolute top-2 right-2 text-amber-500/5 group-hover:text-amber-500/10 transition-colors">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="space-y-1.5 z-10">
            <span className="text-[8px] text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">CONFECÇÕES EM CURSO</span>
            <span className="font-serif text-2xl font-light text-white tracking-widest block" style={{ fontFamily: 'Georgia, serif' }}>
              {pendingCount} solicitações
            </span>
          </div>
          <span className="text-[9px] text-white/40 font-mono mt-3 uppercase tracking-wider">Corte, costura e provas pendentes</span>
        </div>

        {/* Completed metric */}
        <div className="bg-[#1E1E1E] border border-white/5 rounded-none p-5 relative overflow-hidden flex flex-col justify-between shadow-xl group hover:border-emerald-500/20 transition-all">
          <div className="absolute top-2 right-2 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
            <UserCheck className="w-16 h-16" />
          </div>
          <div className="space-y-1.5 z-10">
            <span className="text-[8px] text-emerald-500 tracking-[0.25em] font-bold block uppercase font-mono">ENCOMENDAS CONCLUÍDAS</span>
            <span className="font-serif text-2xl font-light text-white tracking-widest block" style={{ fontFamily: 'Georgia, serif' }}>
              {deliveryCount} entregues
            </span>
          </div>
          <span className="text-[9px] text-white/40 font-mono mt-3 uppercase tracking-wider">Prova final realizada com perfeição</span>
        </div>
      </div>

      {/* Filter tab selectors */}
      <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto">
        {(['Todos', 'Pendente', 'Preparando', 'Enviado', 'Entregue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-4 py-1.5 rounded-none text-[9px] font-bold tracking-widest transition-all uppercase border ${
              selectedFilter === status
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-extrabold shadow-md'
                : 'bg-black text-white/50 border-white/5 hover:text-white hover:border-[#D4AF37]/30'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders details grid list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-[#1E1E1E] border border-white/5 rounded-none">
            <Clipboard className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-xs font-sans text-white/50 tracking-widest uppercase">Nenhum pedido encontrado nesta categoria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#1E1E1E] border border-white/5 rounded-none p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-black/15 transition-colors">
              <div className="space-y-4 flex-1">
                {/* Header detail */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[9px] font-bold text-white bg-black border border-white/10 px-2.5 py-1 rounded-none tracking-widest uppercase">
                    ENCOMENDA: {order.id}
                  </span>
                  <span className="text-[9px] text-white/40 font-sans tracking-tight uppercase">
                    DATA: {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Buyer / Customer */}
                <div className="space-y-1">
                  <h4 className="text-[9px] text-white/40 uppercase tracking-widest font-bold font-mono">Cliente solicitante</h4>
                  <p className="font-serif text-sm text-[#D4AF37] tracking-wider uppercase" style={{ fontFamily: 'Georgia, serif' }}>{order.customerName}</p>
                </div>

                {/* Sub items row list */}
                <div className="space-y-1.5">
                  <h4 className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Peças solicitadas</h4>
                  <div className="space-y-1 bg-black/60 border border-white/5 p-3 rounded-none max-w-lg">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-xs font-sans text-white/75 tracking-wide">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono text-[10px] text-[#D4AF37]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col justify-between items-end gap-4 border-l border-white/5 pl-0 md:pl-6 w-full md:w-80">
                <div className="text-right w-full">
                  <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] block font-bold font-mono">VALOR TOTAL ACERVO</span>
                  <span className="font-serif text-xl font-light text-[#D4AF37] tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider">Status Atual:</span>
                    <span className={`px-2 py-0.5 rounded-none font-bold uppercase text-[9px] border ${
                      order.status === 'Entregue'
                        ? 'bg-emerald-950/70 border-emerald-900 text-emerald-400'
                        : order.status === 'Enviado'
                        ? 'bg-blue-950/70 border-blue-900 text-blue-400'
                        : order.status === 'Preparando'
                        ? 'bg-amber-950/70 border-amber-900 text-amber-400'
                        : 'bg-black border-white/5 text-white/60'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Button trigger to upgrade the order phase */}
                  <button
                    onClick={() => handleStatusChange(order.id, order.status)}
                    className="w-full bg-black hover:bg-white hover:text-black border border-[#D4AF37] text-[#D4AF37] text-[10px] font-extrabold tracking-widest py-3 rounded-none transition-all flex items-center justify-center gap-1.5 uppercase"
                  >
                    <span>AVANÇAR ESTÁGIO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] text-white/30 text-center uppercase tracking-widest font-mono">
                    {order.status === 'Entregue' ? 'clique para inicializar ciclo' : 'avança para próxima fase de alfaiataria'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
