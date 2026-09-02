import React from 'react';
import { Lock, ShieldAlert, Eye } from 'lucide-react';

interface ReadOnlyBannerProps {
  isDarkMode: boolean;
  viewName?: string;
}

export const ReadOnlyBanner: React.FC<ReadOnlyBannerProps> = ({ isDarkMode, viewName }) => {
  return (
    <div className={`p-3.5 px-4 rounded-xl border flex items-center justify-between gap-3 text-xs mb-4 shadow-xs font-sans animate-fadeIn ${
      isDarkMode 
        ? 'bg-amber-950/40 border-amber-600/40 text-amber-200' 
        : 'bg-amber-50 border-amber-300 text-amber-900'
    }`}>
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 shrink-0">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500 inline" />
            <span>Mode Lihat Saja (Hak Akses User Admin)</span>
          </span>
          <p className="text-[11px] opacity-90 mt-0.5">
            User Admin hanya memiliki akses edit & input pada menu <strong>Surat Perintah Kerja (SPK)</strong> dan <strong>Input Gangguan Penyulang</strong>. Menu {viewName || 'ini'} berstatus Lihat Saja.
          </p>
        </div>
      </div>

      <span className="shrink-0 text-[10px] font-black uppercase px-2 py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
        READ-ONLY
      </span>
    </div>
  );
};
