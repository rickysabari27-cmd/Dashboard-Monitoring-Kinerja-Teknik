import React, { useState } from 'react';
import { X, Lock, User, Key, LogIn, Shield, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { UserAccess } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccess) => void;
  isDarkMode: boolean;
  usersList: UserAccess[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDarkMode,
  usersList
}) => {
  const [username, setUsername] = useState<string>('8812345Z');
  const [password, setPassword] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (!username.trim() || !password.trim()) {
        setErrorMsg('NIP/ID Petugas dan Password wajib diisi.');
        return;
      }

      // Check user in list or match demo user
      const matchedUser = usersList.find(
        u => u.nik.toLowerCase() === username.trim().toLowerCase() ||
             u.email.toLowerCase() === username.trim().toLowerCase() ||
             u.name.toLowerCase().includes(username.trim().toLowerCase())
      );

      if (matchedUser) {
        if (matchedUser.status === 'Non-Aktif') {
          setErrorMsg('Akun pengguna ini sedang Non-Aktif. Hubungi Administrator ULP.');
          return;
        }
        onLoginSuccess(matchedUser);
        onClose();
      } else {
        // Fallback demo user if not explicitly found
        const newDemoUser: UserAccess = {
          id: `USR-${Date.now()}`,
          nik: username.trim().toUpperCase(),
          name: username.includes('@') ? username.split('@')[0] : username,
          role: 'Team Leader',
          unitName: 'PLN ULP Baguala',
          email: username.includes('@') ? username : `${username.toLowerCase()}@pln.co.id`,
          status: 'Aktif',
          lastActive: 'Baru Saja'
        };
        onLoginSuccess(newDemoUser);
        onClose();
      }
    }, 400);
  };

  const handleQuickSelect = (user: UserAccess) => {
    setUsername(user.nik);
    setPassword('123456');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 shadow-inner">
              <Shield className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/30">
                PLN ULP Baguala
              </span>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                Login Sistem Keandalan 20kV
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100/80 mt-2 font-medium">
            Masukkan NIP / ID Petugas/Email dan Password akun PLN untuk membuka akses fitur penuh
          </p>
        </div>

        {/* Quick User Selector Pills */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Akun Demo (Akses Cepat):</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {usersList.slice(0, 3).map((u, idx) => (
              <button
                key={`${u.id || u.nik || 'user'}-${idx}`}
                type="button"
                onClick={() => handleQuickSelect(u)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  username === u.nik 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-3 h-3 text-cyan-400" />
                <span>{u.name.split(' ')[0]} ({u.role})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* User / NIK */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Username / NIP</span>
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: 9218042PLN atau Username"
                className={`w-full pl-3.5 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-500" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun..."
                className={`w-full pl-3.5 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 font-medium">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Ingat sesi login ini</span>
            </label>
            <span className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer">
              Lupa Password?
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Ke Sistem</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
