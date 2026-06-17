import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, User as UserIcon, LogIn, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'employee'>('client');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    if (role === 'employee' && password !== '158575') {
      setError('Código de acesso de funcionário inválido. Acesso restrito ao staff do Ateliê.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email, role, name || undefined);
    } catch (err: any) {
      setError(err?.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-black">
      {/* Decorative luxury elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0a] to-[#121212] opacity-80 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg bg-[#1E1E1E] border border-white/5 rounded-none px-8 py-12 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
      >
        {/* Fine gold border corner details reflecting high fashion label tags */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#D4AF37]/60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D4AF37]/60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#D4AF37]/60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#D4AF37]/60" />
 
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-none bg-black border border-[#D4AF37] mb-5 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </motion.div>
          <h1 className="font-serif text-3xl font-light tracking-[0.3em] text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Ateliê Raniere
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-6 bg-[#D4AF37]/35" />
            <p className="text-[10px] uppercase font-sans tracking-[0.4em] text-[#D4AF37] font-semibold">
              ALTA COSTURA & ALFAIATARIA
            </p>
            <span className="h-[1px] w-6 bg-[#D4AF37]/35" />
          </div>
        </div>
 
        {error && (
          <div className="bg-red-950/40 border border-red-500/50 text-red-200 text-xs py-3.5 px-4 rounded-none mb-6 text-center tracking-wide font-sans">
            {error}
          </div>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selector buttons with gorgeous gold borders */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => { setRole('client'); setPassword(''); setError(''); }}
              className={`flex items-center justify-center gap-2 py-4 px-4 rounded-none font-sans text-[11px] tracking-widest font-bold transition-all duration-300 border ${
                role === 'client' 
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
                  : 'bg-black text-white/50 border-white/5 hover:border-[#D4AF37]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              CLIENTE
            </button>
            <button
              type="button"
              onClick={() => { setRole('employee'); setPassword(''); setError(''); }}
              className={`flex items-center justify-center gap-2 py-4 px-4 rounded-none font-sans text-[11px] tracking-widest font-bold transition-all duration-300 border ${
                role === 'employee' 
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
                  : 'bg-black text-white/50 border-white/5 hover:border-[#D4AF37]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              STAFF ATELIÊ
            </button>
          </div>
 
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
              NOME COMPLETO (OPCIONAL)
            </label>
            <input
              type="text"
              placeholder="EX: ADRIANA SILVA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-none py-3.5 px-4 text-white text-xs tracking-widest outline-none placeholder-white/20 transition-all font-sans uppercase"
            />
          </div>
 
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
              E-MAIL DE ACESSO
            </label>
            <input
              type="email"
              placeholder="SEU-EMAIL@DOMINIO.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-none py-3.5 px-4 text-white text-xs tracking-widest outline-none placeholder-white/20 transition-all font-sans uppercase"
            />
          </div>

          {role === 'employee' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            >
              <label className="block text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
                Código de Autorização do Staff *
              </label>
              <input
                type="password"
                placeholder="DIGITE O CÓDIGO DE ACESSO DO STAFF"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={role === 'employee'}
                className="w-full bg-black border border-[#D4AF37]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-none py-3.5 px-4 text-white text-xs tracking-widest outline-none placeholder-[#D4AF37]/35 transition-all font-sans"
              />
            </motion.div>
          )}
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-white text-black font-sans text-xs font-bold tracking-[0.25em] py-4 rounded-none transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                ACESSAR SALÃO EXCLUSIVO
              </>
            )}
          </button>
        </form>
 
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-white/40 font-sans tracking-widest uppercase">
          <p className="flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            Acesso rápido direto • Novos e-mails cadastram-se na hora
          </p>
          <div className="mt-3 text-neutral-500 space-y-1">
            <p><strong>E-mail Cliente:</strong> cliente@raniere.com</p>
            <p><strong>E-mail Ateliê / Staff:</strong> ateliere@raniere.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
