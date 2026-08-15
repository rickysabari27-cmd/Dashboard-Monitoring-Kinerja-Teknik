import React from 'react';
import { FeederHealth } from '../../types';
import { Activity, ShieldCheck, AlertTriangle, Wrench, Thermometer, Radio } from 'lucide-react';

interface HealthIndexViewProps {
  isDarkMode: boolean;
  feeders: FeederHealth[];
}

export const HealthIndexView: React.FC<HealthIndexViewProps> = ({
  isDarkMode,
  feeders
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Health Index Penyulang 20kV ULP Baguala
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluasi Kesehatan Isolasi, Grounding, Thermovision Hotspot, & Risiko ROW Pohon
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>7/7 Penyulang Terinspeksi Periodik</span>
        </div>
      </div>

      {/* Grid of Feeder Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeders.map((feeder, idx) => {
          const isWarning = feeder.healthScore < 75;
          const isDanger = feeder.healthScore < 70;

          return (
            <div 
              key={`${feeder.id || 'feeder'}-${idx}`}
              className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {feeder.substation}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {feeder.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-black ${
                    isDanger ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {feeder.healthScore}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDanger ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    isWarning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {feeder.status}
                  </span>
                </div>
              </div>

              {/* Health Score Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${feeder.healthScore}%` }}
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Panjang SUTM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feeder.lengthKm} km</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Pelanggan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feeder.customers.toLocaleString('id-ID')} Plg</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Grounding (Ω)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feeder.groundingResistance} Ω</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Hotspot Thermovision</span>
                  <span className={`font-bold ${feeder.thermoHotspots > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {feeder.thermoHotspots} Titik
                  </span>
                </div>
              </div>

              <div className="mt-3 text-[10px] text-slate-400 text-right">
                Inspeksi Terakhir: {feeder.lastInspected}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
