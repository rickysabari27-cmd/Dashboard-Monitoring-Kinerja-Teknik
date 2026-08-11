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
          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="font-bold text-slate-400 mb-1.5">Bulan: {label} {selectedYear}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
                <span>SAIDI Realisasi:</span>
              </span>
              <span className="font-bold text-blue-600 dark:text-cyan-400">{real?.toFixed(3)} Jam/Plg</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-600 inline-block" />
                <span>SAIDI Target:</span>
              </span>
              <span className="font-medium text-slate-500">{target?.toFixed(3)} Jam/Plg</span>
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
      <div className={`p-6 rounded-[32px] border transition-all ${
        isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-base text-white">
                Visualisasi Trend Kinerja SAIDI, SAIFI & Energi Tidak Tersalurkan (ENS)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Perbandingan target kumulatif vs realisasi bulanan serta estimasi dampak finansial PLN ULP Baguala
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear('2026')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === '2026'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              Tahun 2026
            </button>
            <button
              onClick={() => setSelectedYear('2025')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === '2025'
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-700/60'
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                GRAFIK BATANG SAIDI & SAIFI BULANAN (REAL VS TARGET)
              </span>

              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
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
                  />
                  <Tooltip content={<CustomSaidiTooltip />} />
                  <Bar dataKey="saidiTarget" fill={isDarkMode ? '#1E293B' : '#E2E8F0'} radius={[4, 4, 0, 0]} name="Target" />
                  <Bar dataKey="saidiReal" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Realisasi" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feeder Trip Contribution Donut Chart (1 col) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-indigo-400" />
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
                        background: '#0F172A',
                        borderColor: '#334155',
                        fontSize: '12px',
                        color: '#F8FAFC'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-slate-500">Total</span>
                  <span className="text-lg font-light text-white">6 Trips</span>
                </div>
              </div>
            </div>

            {/* Custom Legend Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-xs">
              {feederContributions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-300 text-[11px] truncate">{item.feederName}</span>
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
