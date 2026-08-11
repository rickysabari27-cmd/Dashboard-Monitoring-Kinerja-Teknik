import React from 'react';
import { ViewMode } from '../types';
import { 
  Zap, 
  ClipboardCheck, 
  Trees, 
  TrendingUp, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface KpiCardsProps {
  isDarkMode: boolean;
  setCurrentView: (view: ViewMode) => void;
  totalTrips: number;
  totalInspections: number;
  totalRowPoints: number;
  saidiVal: number;
  saidiTarget: number;
  financialLossTotal: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  isDarkMode,
  setCurrentView,
  totalTrips,
  totalInspections,
  totalRowPoints,
  saidiVal,
  saidiTarget,
  financialLossTotal
}) => {

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Card 1: Total Trip Gangguan */}
      <div 
        onClick={() => setCurrentView('trips')}
        className={`group cursor-pointer p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900/60' 
            : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs'
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-3xl pointer-events-none" />
        
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 block">
          Total Trip Gangguan SUTM
        </span>

        <div className="text-4xl font-light mb-2 text-white flex items-baseline gap-1.5">
          {totalTrips}
          <span className="text-rose-400 text-sm font-semibold">Kejadian</span>
        </div>

        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mb-3">
          <span>Relay GFR / OCR</span>
          <span className="text-slate-600 ml-1">2026</span>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Lateri 2 & Tulehu</span>
          <div className="flex items-center text-indigo-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card 2: Inspeksi & Temuan Lapangan */}
      <div 
        onClick={() => setCurrentView('pemeliharaan')}
        className={`group cursor-pointer p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900/60' 
            : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs'
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 block">
          Inspeksi & Temuan Lapangan
        </span>

        <div className="text-4xl font-light mb-2 text-white flex items-baseline gap-1.5">
          {totalInspections}
          <span className="text-indigo-400 text-sm font-semibold">Lokasi</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-3">
          <span>↑ 100% Terinspeksi</span>
          <span className="text-slate-600 ml-1">Tim 1 & 2</span>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Temuan Berat: 0</span>
          <div className="flex items-center text-indigo-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
            <span>Inspeksi</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card 3: Area ROW Rawan Pohon */}
      <div 
        onClick={() => setCurrentView('pemeliharaan')}
        className={`group cursor-pointer p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900/60' 
            : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs'
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 block">
          Area ROW Perlu Pangkas
        </span>

        <div className="text-4xl font-light mb-2 text-white flex items-baseline gap-1.5">
          {totalRowPoints}
          <span className="text-emerald-400 text-sm font-semibold">Titik</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-3">
          <span>Target Pangkas M2</span>
          <span className="text-slate-600 ml-1">2026</span>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Pangkas Aktif</span>
          <div className="flex items-center text-indigo-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
            <span>Peta ROW</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card 4: Kinerja SAIDI / SAIFI */}
      <div 
        onClick={() => setCurrentView('saidi_saifi')}
        className={`group cursor-pointer p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900/60' 
            : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs'
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 block">
          Realisasi SAIDI Kumulatif
        </span>

        <div className="text-4xl font-light mb-2 text-white flex items-baseline gap-1.5">
          {saidiVal.toFixed(3)}
          <span className="text-indigo-400 text-sm font-semibold">Jam/Plg</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-3">
          <span>&lt; Target {saidiTarget.toFixed(3)}</span>
          <span className="text-slate-600 ml-1">Aman</span>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>ENS: {formatRupiah(financialLossTotal)}</span>
          <div className="flex items-center text-indigo-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
            <span>Analisis</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

    </div>
  );
};
