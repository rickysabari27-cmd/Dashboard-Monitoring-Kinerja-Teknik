import React, { useState, useEffect } from 'react';
import { UserAccess, MasterFeeder } from '../types';
import { 
  Zap, 
  Globe, 
  Moon, 
  Sun,
  Activity,
  LogOut,
  LogIn,
  Clock,
  Mail
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenInputGangguan?: () => void;
  onOpenSaidiView?: () => void;
  onOpenUniversalInput?: (tab?: string) => void;
  onOpenGisMap?: () => void;
  onOpenWhatsAppModal?: () => void;
  systemReliability: number;
  currentUser?: UserAccess | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  masterFeeders?: MasterFeeder[];
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  systemReliability,
  currentUser,
  onOpenLogin,
  onLogout,
  masterFeeders = []
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const activeFeederCount = masterFeeders.length > 0 
    ? masterFeeders.filter(f => (f.operationalStatus || 'Operasi') === 'Operasi').length 
    : 24;
  const totalFeederCount = masterFeeders.length > 0 ? masterFeeders.length : 27;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastUpdated(`${dateStr} ${timeStr} WIT`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 z-30 transition-colors border-b ${
      isDarkMode 
        ? 'bg-black/95 border-zinc-800 text-white backdrop-blur-md' 
        : 'bg-white/95 border-zinc-200 text-zinc-900 backdrop-blur-md shadow-xs'
    }`}>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shadow-xs">
            <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white">
                Dashboard Kinerja Teknik
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                ULP BAGUALA
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Sistem Keandalan <span className="text-emerald-500 dark:text-emerald-400 font-bold">{systemReliability}%</span> • Monitoring Distribusi JTM
            </p>
          </div>
        </div>

        {/* Right Actions & Status Badges */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {/* Cloud Active Online Badge (SCADA Online LIVE) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Globe className="w-3.5 h-3.5" />
            <span>SCADA Online</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-black">LIVE</span>
          </div>

          {/* Active Feeders Badge with Updated Time */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            title={`${activeFeederCount} dari ${totalFeederCount} Penyulang Berstatus Operasi (Master Data ULP Baguala)`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>{activeFeederCount} Penyulang Aktif</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              <span>{lastUpdated}</span>
            </span>
          </div>

          {/* User Profile / Login / Logout Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-black text-emerald-400 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
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

          {/* Theme Toggle Button (Hitam/Putih/Hijau) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl transition-all bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Moon className="w-4 h-4 text-zinc-800" />}
          </button>
        </div>

      </div>
    </header>
  );
};


