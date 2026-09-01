import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { MonthlySaidiSaifiData, FeederContribution } from '../types';
import { TrendingUp, CheckCircle, PieChart as PieIcon, BarChart2 } from 'lucide-react';

interface SaidiSaifiChartProps {
  isDarkMode: boolean;
  monthlySaidiData: MonthlySaidiSaifiData[];
  feederContributions: FeederContribution[];
}

export const SaidiSaifiChart: React.FC<SaidiSaifiChartProps> = ({
  isDarkMode,
  monthlySaidiData,
  feederContributions
}) => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025'>('2026');

  const CustomSaidiTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const real = payload[0]?.value;
      const target = payload[1]?.value;
      return (
        <div className={`p-3 rounded-xl shadow-xl text-xs border ${
          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'
        }`}>
          <div className="font-bold text-zinc-400 mb-1.5">Bulan: {label} {selectedYear}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span>SAIDI Realisasi:</span>
              </span>
              <span className="font-bold text-emerald-500 dark:text-emerald-400">{real?.toFixed(3)} Jam/Plg</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-zinc-400 dark:bg-zinc-700 inline-block" />
                <span>SAIDI Target:</span>
              </span>
              <span className="font-medium text-zinc-500">{target?.toFixed(3)} Jam/Plg</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Main Section Banner */}
      <div className={`p-6 rounded-[28px] border transition-all ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900 dark:text-white">
                Visualisasi Trend Kinerja SAIDI, SAIFI & Energi Tidak Tersalurkan (ENS)
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Perbandingan target kumulatif vs realisasi bulanan serta estimasi dampak finansial PLN ULP Baguala
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear('2026')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === '2026'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              Tahun 2026
            </button>
            <button
              onClick={() => setSelectedYear('2025')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === '2025'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              Tahun 2025
            </button>
          </div>
        </div>

        {/* Charts Grid: Left Bar Chart + Right Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SAIDI Real vs Target Bar Chart (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
                GRAFIK BATANG SAIDI & SAIFI BULANAN (REAL VS TARGET)
              </span>

              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Batas Aman Target (&lt;0.200 Jam/Plg)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySaidiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  />
                  <Tooltip content={<CustomSaidiTooltip />} />
                  <Bar dataKey="saidiTarget" fill={isDarkMode ? '#3f3f46' : '#d4d4d8'} radius={[4, 4, 0, 0]} name="Target" />
                  <Bar dataKey="saidiReal" fill="#10b981" radius={[4, 4, 0, 0]} name="Realisasi" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feeder Trip Contribution Donut Chart (1 col) */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-2 flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-emerald-500" />
                KONTRIBUSI GANGGUAN FEEDER
              </span>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feederContributions}
                      dataKey="percentage"
                      nameKey="feederName"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={3}
                    >
                      {feederContributions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, 'Kontribusi']}
                      contentStyle={{
                        borderRadius: '12px',
                        background: '#09090b',
                        borderColor: '#27272a',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total</span>
                  <span className="text-lg font-light text-zinc-900 dark:text-white">6 Trips</span>
                </div>
              </div>
            </div>

            {/* Custom Legend Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-800 text-xs">
              {feederContributions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-black px-2.5 py-1.5 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-zinc-300 text-[11px] truncate">{item.feederName}</span>
                  </div>
                  <span className="font-bold text-white text-[11px] ml-1">{item.percentage}%</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
