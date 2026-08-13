import React, { useState } from 'react';
import { 
  Zap, 
  User, 
  Key, 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Lock
} from 'lucide-react';
import { UserAccess } from '../../types';
import garduIndukImg from '../../assets/images/gardu_induk_pln_1786415424800.jpg';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccess) => void;
  usersList: UserAccess[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  usersList
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorMsg('Username dan Password wajib diisi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Search matched user in list
      const matchedUser = usersList.find(
        u => u.nik.toLowerCase() === trimmedUsername.toLowerCase() ||
             u.email.toLowerCase() === trimmedUsername.toLowerCase() ||
             u.name.toLowerCase().includes(trimmedUsername.toLowerCase())
      );

      if (matchedUser) {
        if (matchedUser.status === 'Non-Aktif') {
          setErrorMsg('Akun ini sedang Non-Aktif. Hubungi Supervisor.');
          return;
        }
        onLoginSuccess(matchedUser);
      } else {
        // Fallback for user entry
        const fallbackUser: UserAccess = {
          id: `USR-${Date.now()}`,
          nik: trimmedUsername.toUpperCase(),
          name: trimmedUsername.includes('@') ? trimmedUsername.split('@')[0] : trimmedUsername,
          role: 'Team Leader',
          unitName: 'PLN ULP Baguala',
          email: trimmedUsername.includes('@') ? trimmedUsername : `${trimmedUsername.toLowerCase()}@pln.co.id`,
          status: 'Aktif',
          lastActive: 'Baru Saja'
        };
        onLoginSuccess(fallbackUser);
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      
      {/* GARDU INDUK BACKGROUND WITH REALISTIC SUBSTATION PHOTO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={garduIndukImg} 
          alt="Gardu Induk PLN 20kV" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-110 brightness-90 animate-fadeIn"
        />
        {/* Soft atmospheric gradient tint so Gardu Induk substation is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
      </div>

      {/* CENTERED CLEAN LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* BRANDING HEADER */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-600 p-0.5 shadow-2xl shadow-amber-500/40">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center backdrop-blur-md">
              <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white uppercase drop-shadow-md">
              PT PLN (PERSERO)
            </h1>
            <p className="text-xs font-bold text-cyan-300 tracking-widest uppercase drop-shadow-md">
              ULP BAGUALA
            </p>
          </div>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="rounded-3xl bg-slate-900/85 border border-slate-700/60 shadow-2xl shadow-slate-950/90 backdrop-blur-md p-8 space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>Login System</span>
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* USERNAME FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Username</span>
              </label>
              <input 
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm font-semibold placeholder-slate-400 focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm font-semibold placeholder-slate-400 focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* FOOTER CAPTION */}
        <p className="text-[11px] text-slate-300/90 text-center font-medium mt-4 drop-shadow-md">
          © 2026 PT PLN (Persero) ULP Baguala
        </p>

      </div>

    </div>
  );
};
