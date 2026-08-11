import React from 'react';
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
  BarChart2
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenInputGangguan: () => void;
  onOpenSaidiView: () => void;
  onOpenUniversalInput: (tab?: string) => void;
  onOpenGisMap: () => void;
  systemReliability: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  onOpenInputGangguan,
  onOpenSaidiView,
  onOpenUniversalInput,
  onOpenGisMap,
  systemReliability
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
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Dashboard Kinerja & Keandalan 20kV
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              PLN ULP Baguala • Sistem Keandalan <span className="text-emerald-600 dark:text-emerald-400 font-bold">{systemReliability}%</span>
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Cloud Active Online Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Globe className="w-3.5 h-3.5" />
            <span>Sistem Online</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">LIVE SCADA</span>
          </div>

          {/* System Health Pulse */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>25 Penyulang Terhubung</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Action Button: Peta GIS Feeder */}
          <button 
            onClick={onOpenGisMap}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Peta GIS Feeder</span>
          </button>

          {/* Action Button: + Input Gangguan */}
          <button 
            onClick={onOpenInputGangguan}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+ Input Gangguan</span>
          </button>

          {/* Action Button: Menu Monitoring SAIDI/SAIFI */}
          <button 
            onClick={onOpenSaidiView}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs active:scale-95"
            title="Buka Menu Monitoring Realisasi SAIDI / SAIFI Sesuai KPI"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>SAIDI SAIFI</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
};

