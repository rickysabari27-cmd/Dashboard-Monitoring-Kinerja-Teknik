import React from 'react';
import { UserAccess } from '../types';
import { 
  Zap, 
  Globe, 
  MapPin, 
  Plus, 
  TrendingUp, 
  Moon, 
  Sun,
  ShieldCheck,
  Activity,
  BarChart2,
  User,
  LogOut,
  LogIn,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenInputGangguan: () => void;
  onOpenSaidiView: () => void;
  onOpenUniversalInput: (tab?: string) => void;
  onOpenGisMap: () => void;
  onOpenWhatsAppModal?: () => void;
  systemReliability: number;
  currentUser?: UserAccess | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  onOpenInputGangguan,
  onOpenSaidiView,
  onOpenUniversalInput,
  onOpenGisMap,
  onOpenWhatsAppModal,
  systemReliability,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  return (
    <header className={`sticky top-0 z-30 transition-colors border-b ${
      isDarkMode 
        ? 'bg-[#090D16]/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200/80 text-slate-800 backdrop-blur-md shadow-xs'
    }`}>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-xs">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Command Center 20kV
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white uppercase tracking-wider">
                ULP BAGUALA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sistem Keandalan <span className="text-emerald-600 dark:text-emerald-400 font-bold">{systemReliability}%</span> • Monitoring Distribusi JTM
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Cloud Active Online Badge (Hijau) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Globe className="w-3.5 h-3.5" />
            <span>SCADA Online</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-black">LIVE</span>
          </div>

          {/* System Health Pulse (Biru) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25">
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>25 Penyulang Aktif</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Action Button: Peta GIS Feeder (Biru) */}
          <button 
            onClick={onOpenGisMap}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 cursor-pointer active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Peta GIS</span>
          </button>

          {/* Action Button: + Input Gangguan (Merah) */}
          <button 
            onClick={onOpenInputGangguan}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+ Input Gangguan</span>
          </button>

          {/* Action Button: Kirim WA Dispatch (Hijau) */}
          {onOpenWhatsAppModal && (
            <button 
              onClick={onOpenWhatsAppModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              title="Kirim Chat & Broadcast Laporan via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dispatch WA</span>
            </button>
          )}

          {/* Action Button: Menu Monitoring SAIDI/SAIFI (Biru) */}
          <button 
            onClick={onOpenSaidiView}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
            title="Buka Menu Monitoring Realisasi SAIDI / SAIFI Sesuai KPI"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>SAIDI SAIFI</span>
          </button>

          {/* User Profile / Login / Logout Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-all active:scale-95 cursor-pointer"
                title="Logout dari Akun PLN"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Theme Toggle Button (Kuning/Hitam) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>
        </div>

      </div>
    </header>
  );
};


