import React, { useState } from 'react';
import { X, TrendingUp, Target, BarChart2, CheckCircle2 } from 'lucide-react';

interface InputSaidiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSaidi: (
    year: number, 
    month: string, 
    saidiReal: number, 
    saifiReal: number, 
    saidiTarget?: number, 
    saifiTarget?: number,
    ensLossJuta?: number
  ) => void;
  isDarkMode: boolean;
  initialYear?: number;
  initialMonth?: string;
}

export const InputSaidiModal: React.FC<InputSaidiModalProps> = ({
  isOpen,
  onClose,
  onUpdateSaidi,
  isDarkMode,
  initialYear = 2026,
  initialMonth = 'Ags'
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  
  // Realization & Target Manual States
  const [saidiReal, setSaidiReal] = useState<number>(57.125);
  const [saidiTarget, setSaidiTarget] = useState<number>(72.412);
  
  const [saifiReal, setSaifiReal] = useState<number>(0.94);
  const [saifiTarget, setSaifiTarget] = useState<number>(1.10);

  const [ensLossJuta, setEnsLossJuta] = useState<number>(47.95);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSaidi(
      selectedYear, 
      selectedMonth, 
      saidiReal, 
      saifiReal, 
      saidiTarget, 
      saifiTarget, 
      ensLossJuta
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-blue-600 dark:text-cyan-400">
                Input Kinerja KPI (Target vs Realisasi ULP)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input & sesuaikan Target KPI, Realisasi KPI UP3, serta Realisasi ULP Baguala
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Periode Dropdowns */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Tahun
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border font-extrabold ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {[2026, 2025, 2024].map(y => (
                  <option key={y} value={y}>Tahun {y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-bold ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
                  <option key={m} value={m}>Bulan {m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SAIDI Section */}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
            <div className="font-extrabold text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Indeks SAIDI (Lama Padam - Jam/Plg)</span>
              <span className="text-[10px] text-slate-500 font-normal">{(saidiReal * 60).toFixed(1)} menit</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Realisasi SAIDI (Jam/Plg)
                </label>
                <input 
                  type="number"
                  step="0.001"
                  value={saidiReal}
                  onChange={(e) => setSaidiReal(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-black text-sm ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-blue-700'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Target KPI SAIDI (Jam/Plg)
                </label>
                <input 
                  type="number"
                  step="0.001"
                  value={saidiTarget}
                  onChange={(e) => setSaidiTarget(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-extrabold text-sm ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* SAIFI Section */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Indeks SAIFI (Frekuensi Padam - Kali/Plg)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Realisasi SAIFI (Kali/Plg)
                </label>
                <input 
                  type="number"
                  step="0.001"
                  value={saifiReal}
                  onChange={(e) => setSaifiReal(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-black text-sm ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-white border-slate-200 text-indigo-700'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Target KPI SAIFI (Kali/Plg)
                </label>
                <input 
                  type="number"
                  step="0.001"
                  value={saifiTarget}
                  onChange={(e) => setSaifiTarget(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-extrabold text-sm ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ENS Loss */}
          <div>
            <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Kerugian Penjualan ENS (Juta Rupiah)
            </label>
            <input 
              type="number"
              step="0.01"
              value={ensLossJuta}
              onChange={(e) => setEnsLossJuta(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl border font-bold ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-rose-400' : 'bg-slate-100 border-slate-200 text-rose-600'
              }`}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              Akan memperbarui rekapan monitoring {selectedMonth} {selectedYear}.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Kinerja</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
