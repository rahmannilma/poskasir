import React, { useState } from 'react';
import logoImg from './logo.jpg';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
  onBackToLanding?: () => void;
}

export default function Login({ onLogin, onBackToLanding }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerUser = username.toLowerCase();
    const isOwner = (lowerUser === 'owner' || lowerUser === 'owner@m-coffee.com') && password === 'owner123';
    const isKasir = (lowerUser === 'kasir' || lowerUser === 'kasir@m-coffee.com') && password === 'kasir123';
    const isAdmin = (lowerUser === 'admin' || lowerUser === 'admin@m-coffee.com') && password === 'admin123';

    if (isOwner) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin('Owner M-Coffee', 'owner');
      }, 800);
    } else if (isKasir || isAdmin) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const displayName = isAdmin ? 'Marcus W.' : 'Kasir M-Coffee';
        onLogin(displayName, 'kasir');
      }, 800);
    } else {
      setError('Username, Email, atau Password yang Anda masukkan salah!');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#0d1607] overflow-hidden select-none">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-700/15 rounded-full blur-[120px] animate-pulse duration-5000" />

      {/* Login Card Wrapper */}
      <div className="w-full max-w-md p-6 sm:p-8 z-10 mx-4">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <img
              src={logoImg}
              className="w-12 h-12 rounded-full object-cover shadow-lg shadow-primary/25 shrink-0"
              alt="M-Coffee Logo"
            />
            <div>
              <h1 className="text-xl font-black tracking-widest text-white">
                M-<span className="text-primary">COFFEE</span>
              </h1>
              <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Point of Sale System</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-md font-bold text-white/90">Masuk ke Akun POS</h2>
            <p className="text-[11px] text-white/50 mt-1">Harap isi username atau email terdaftar Anda</p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-[11px] font-semibold text-red-300 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[10px] text-white/60 uppercase font-mono tracking-wider">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username atau email..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] focus:border-primary/50 rounded-2xl outline-none text-white transition-all text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[10px] text-white/60 uppercase font-mono tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] focus:border-primary/50 rounded-2xl outline-none text-white transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] cursor-pointer mt-6 text-xs uppercase tracking-wider disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Masuk Sekarang
                </>
              )}
            </button>
          </form>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mt-4 text-[11px] font-bold text-white/50 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-mono outline-none"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Kembali
            </button>
          )}

          {/* Dotted Hint Credentials Box */}
          <div className="w-full mt-8 p-3.5 bg-primary/5 border border-dashed border-primary/25 rounded-2xl text-[10px] text-emerald-300/80 leading-relaxed font-sans">
            <p className="font-bold uppercase tracking-wider text-emerald-400 text-[9px] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Petunjuk Demo Masuk:
            </p>
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div>
                <p className="text-primary font-bold text-[9px] uppercase border-b border-primary/25 pb-0.5 mb-1">Akses Owner</p>
                <p>User: <span className="text-white font-bold">owner</span></p>
                <p>Pass: <span className="text-white font-bold">owner123</span></p>
              </div>
              <div>
                <p className="text-primary font-bold text-[9px] uppercase border-b border-primary/25 pb-0.5 mb-1">Akses Kasir</p>
                <p>User: <span className="text-white font-bold">kasir / admin</span></p>
                <p>Pass: <span className="text-white font-bold">kasir123 / admin123</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
