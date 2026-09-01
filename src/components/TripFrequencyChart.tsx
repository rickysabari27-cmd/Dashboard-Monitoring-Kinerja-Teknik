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
          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'
        }`}>
          <div className="font-bold text-zinc-400 mb-1">Bulan: {label} 2026</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Trip SUTM:</span>
            <span className="font-extrabold text-emerald-500 dark:text-emerald-400">{value} Kejadian</span>
          </div>
          {value > 0 && (
            <div className="mt-1 text-[10px] text-emerald-400 font-medium">
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
      <div className={`lg:col-span-2 p-6 rounded-[28px] border transition-all ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900 dark:text-white">
                Tren Frekuensi Gangguan Bulanan (Overhead Trip Feeder)
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Monitoring jumlah pemadaman / trip pada jaringan SUTM 20kV PLN ULP Baguala periode tahun 2026
            </p>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-2 shrink-0">
            <span>Total Gangguan:</span>
            <span className="text-emerald-500 dark:text-emerald-400 text-sm font-black">{totalTrips} Kejadian</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-60 sm:h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDarkMode ? '#27272a' : '#e4e4e7'} 
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="trips2026" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.trips2026 > 0 ? '#10b981' : isDarkMode ? '#18181b' : '#e4e4e7'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Card (1 Col) */}
      <div className={`p-6 rounded-[28px] border flex flex-col justify-between transition-all ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-xs tracking-widest uppercase text-emerald-500 dark:text-emerald-400">
              ANALISIS KEANDALAN SUTM
            </h3>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            Suhu udara tinggi dan angin kencang sering meningkatkan potensi gangguan dahan pohon pada penyulang utama <span className="font-bold text-emerald-500 dark:text-emerald-400">Tulehu</span> dan <span className="font-bold text-emerald-500 dark:text-emerald-400">Lateri 2</span>.
          </p>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Rata-rata Gangguan:</span>
              <span className="font-bold text-emerald-500 dark:text-emerald-400 text-sm">0.5 / Bln</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Bulan Peak Gangguan:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Jul & Ags</span>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px] font-medium">
            Rencana aksi perbaikan pangkas pohon (ROW) dioptimalkan di bulan-bulan basah.
          </p>
        </div>
      </div>

    </div>
  );
};
