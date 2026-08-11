import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { MonthlyTripData } from '../types';
import { Activity, AlertCircle, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface TripFrequencyChartProps {
  isDarkMode: boolean;
  data: MonthlyTripData[];
  totalTrips: number;
}

export const TripFrequencyChart: React.FC<TripFrequencyChartProps> = ({
  isDarkMode,
  data,
  totalTrips
}) => {

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className={`p-3 rounded-xl shadow-xl text-xs border ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="font-bold text-slate-400 mb-1">Bulan: {label} 2026</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            <span>Trip SUTM:</span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">{value} Kejadian</span>
          </div>
          {value > 0 && (
            <div className="mt-1 text-[10px] text-amber-500 font-medium">
              Relay GFR/OCR Active
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Chart Card (2 Cols) */}
      <div className={`lg:col-span-2 p-6 rounded-[32px] border transition-all ${
        isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-base text-white">
                Tren Frekuensi Gangguan Bulanan (Overhead Trip Feeder)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitoring jumlah pemadaman / trip pada jaringan SUTM 20kV PLN ULP Baguala periode tahun 2026
            </p>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 flex items-center gap-2 shrink-0">
            <span>Total Gangguan:</span>
            <span className="text-indigo-400 text-sm font-black">{totalTrips} Kejadian</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-60 sm:h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDarkMode ? '#1E293B' : '#E2E8F0'} 
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#64748B' : '#64748B', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#64748B' : '#64748B', fontSize: 11 }} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="trips2026" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.trips2026 > 0 ? '#6366F1' : isDarkMode ? '#0F172A' : '#CBD5E1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Card (1 Col) */}
      <div className={`p-6 rounded-[32px] border flex flex-col justify-between transition-all ${
        isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs tracking-widest uppercase text-indigo-400">
              ANALISIS KEANDALAN SUTM
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Suhu udara tinggi dan angin kencang sering meningkatkan potensi gangguan dahan pohon pada penyulang utama <span className="font-bold text-indigo-400">Tulehu</span> dan <span className="font-bold text-indigo-400">Lateri 2</span>.
          </p>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <span className="text-slate-500">Rata-rata Gangguan:</span>
              <span className="font-bold text-indigo-400 text-sm">0.5 / Bln</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <span className="text-slate-500">Bulan Peak Gangguan:</span>
              <span className="font-bold text-slate-200 text-sm">Jul & Ags</span>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px] font-medium">
            Rencana aksi perbaikan pangkas pohon (ROW) dioptimalkan di bulan-bulan basah.
          </p>
        </div>
      </div>

    </div>
  );
};
