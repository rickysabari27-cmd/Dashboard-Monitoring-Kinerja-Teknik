import React, { useState } from 'react';
import { MonthlySaidiSaifiData } from '../../types';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  AlertCircle, 
  BarChart3, 
  CheckCircle2, 
  Target, 
  Clock, 
  Zap, 
  Edit3,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Check
} from 'lucide-react';

interface SaidiSaifiDetailViewProps {
  isDarkMode: boolean;
  data: MonthlySaidiSaifiData[];
  onOpenInputSaidi: () => void;
  onUpdateSaidiRow?: (updatedRow: MonthlySaidiSaifiData) => void;
}

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

export const SaidiSaifiDetailView: React.FC<SaidiSaifiDetailViewProps> = ({
  isDarkMode,
  data,
  onOpenInputSaidi,
  onUpdateSaidiRow
}) => {
  // Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('Ags'); // default up to Ags or 'ALL'

  // ENS Calculator State
  const [taripKwh, setTaripKwh] = useState<number>(1444.7); // Rp / kWh average TDL
  const [kwhUndelivered, setKwhUndelivered] = useState<number>(33192);

  // Inline editing row state
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editSaidiTarget, setEditSaidiTarget] = useState<number>(0);
  const [editSaifiTarget, setEditSaifiTarget] = useState<number>(0);
  const [editSaidiReal, setEditSaidiReal] = useState<number>(0);
  const [editSaifiReal, setEditSaifiReal] = useState<number>(0);

  // Filter dataset by year
  const yearData = data.filter(d => (d.year || 2026) === selectedYear);

  // Filter dataset up to selected month (if month filter chosen)
  let filteredData = yearData;
  if (selectedMonthFilter !== 'ALL') {
    const monthIndex = MONTH_ORDER.indexOf(selectedMonthFilter);
    if (monthIndex >= 0) {
      filteredData = yearData.filter(d => {
        const idx = MONTH_ORDER.indexOf(d.month);
        return idx >= 0 && idx <= monthIndex;
      });
    }
  }

  // Cumulative values for the filtered period
  // In PLN reporting, for cumulative up to month X, the value at month X is the cumulative score.
  // Or if filtering a range, we take the latest month in the range, or the sum of non-cumulative deltas.
  // Here, row at month X represents cumulative s/d month X.
  const latestRow = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  const cumSaidiReal = latestRow ? latestRow.saidiReal : 0;
  const cumSaidiTarget = latestRow ? latestRow.saidiTarget : 0;
  const cumSaifiReal = latestRow ? latestRow.saifiReal : 0;
  const cumSaifiTarget = latestRow ? latestRow.saifiTarget : 0;
  const cumEnsLossJuta = filteredData.reduce((acc, row) => acc + (row.ensLossJuta || 0), 0);

  // Minute conversions
  const cumSaidiRealMinutes = cumSaidiReal * 60;
  const cumSaidiTargetMinutes = cumSaidiTarget * 60;

  // Differences
  const deltaSaidiHours = cumSaidiTarget - cumSaidiReal; // positive = better than target
  const deltaSaidiMinutes = deltaSaidiHours * 60;
  const deltaSaifi = cumSaifiTarget - cumSaifiReal;

  const isSaidiOnTarget = cumSaidiReal <= cumSaidiTarget;
  const isSaifiOnTarget = cumSaifiReal <= cumSaifiTarget;

  const calculateENS = (kwh: number) => {
    return kwh * taripKwh;
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const startInlineEdit = (row: MonthlySaidiSaifiData) => {
    setEditingMonth(row.month);
    setEditSaidiReal(row.saidiReal);
    setEditSaidiTarget(row.saidiTarget);
    setEditSaifiReal(row.saifiReal);
    setEditSaifiTarget(row.saifiTarget);
  };

  const saveInlineEdit = (month: string) => {
    if (onUpdateSaidiRow) {
      onUpdateSaidiRow({
        year: selectedYear,
        month,
        saidiReal: editSaidiReal,
        saidiTarget: editSaidiTarget,
        saifiReal: editSaifiReal,
        saifiTarget: editSaifiTarget,
        ensLossJuta: Number((editSaidiReal * 0.85).toFixed(2))
      });
    }
    setEditingMonth(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Filter Actions */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Monitoring Realisasi & Target SAIDI / SAIFI Sesuai KPI
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                PLN ULP Baguala
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitoring pencapaian indeks lama padam (SAIDI - Jam & Menit) dan frekuensi (SAIFI) berdasarkan bulan & tahun
            </p>
          </div>
        </div>

        {/* Action Button: Input SAIDI/SAIFI */}
        <button 
          onClick={onOpenInputSaidi}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Input SAIDI/SAIFI & Target Manual</span>
        </button>
      </div>

      {/* FILTER BAR: PERIODE TAHUN & BULAN */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Filter Periode Monitoring:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Select Tahun */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`p-2 rounded-xl text-xs font-extrabold border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value={2026}>2026 (Berjalan)</option>
              <option value={2025}>2025 (Historis)</option>
              <option value={2024}>2024 (Historis)</option>
            </select>
          </div>

          {/* Select Bulan Filter */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bulan:</span>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className={`p-2 rounded-xl text-xs font-extrabold border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-300 text-blue-700'
              }`}
            >
              <option value="ALL">Semua Bulan (Setahun Full)</option>
              {MONTH_ORDER.map(m => (
                <option key={m} value={m}>s/d Bulan {m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI CUMULATIVE CARDS RESULT FOR FILTERED PERIOD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* SAIDI Kumulatif Card */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>SAIDI Kumulatif ({selectedMonthFilter === 'ALL' ? 'Setahun' : `s/d ${selectedMonthFilter}`} {selectedYear})</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                isSaidiOnTarget ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {isSaidiOnTarget ? 'Memenuhi KPI' : 'Melampaui Target'}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 dark:text-cyan-400">
              {cumSaidiReal.toFixed(3)} <span className="text-xs font-semibold text-slate-400">Jam / Plg</span>
            </div>
            <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-300 mt-0.5">
              ({cumSaidiRealMinutes.toFixed(1)} Menit / Plg)
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] flex justify-between text-slate-500">
            <span>Target KPI: <strong>{cumSaidiTarget.toFixed(3)} Jam</strong> ({cumSaidiTargetMinutes.toFixed(1)} m)</span>
            <span className={`font-bold ${deltaSaidiHours >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              Δ {Math.abs(deltaSaidiHours).toFixed(3)} Jam ({Math.abs(deltaSaidiMinutes).toFixed(1)} m)
            </span>
          </div>
        </div>

        {/* SAIFI Kumulatif Card */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>SAIFI Kumulatif ({selectedMonthFilter === 'ALL' ? 'Setahun' : `s/d ${selectedMonthFilter}`} {selectedYear})</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                isSaifiOnTarget ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {isSaifiOnTarget ? 'Memenuhi KPI' : 'Melampaui Target'}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 dark:text-indigo-400">
              {cumSaifiReal.toFixed(3)} <span className="text-xs font-semibold text-slate-400">Kali / Plg</span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] flex justify-between text-slate-500">
            <span>Target KPI: <strong>{cumSaifiTarget.toFixed(3)} Kali</strong></span>
            <span className={`font-bold ${deltaSaifi >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              Δ {Math.abs(deltaSaifi).toFixed(3)} Kali
            </span>
          </div>
        </div>

        {/* Kerugian ENS Card */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <span>Total Kerugian ENS</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-rose-500/10 text-rose-500">
                Tahun {selectedYear}
              </span>
            </div>

            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              Rp {cumEnsLossJuta.toFixed(2)} <span className="text-xs font-semibold text-slate-400">Juta</span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
            Akumulasi potensi kerugian penjualan energi
          </div>
        </div>

        {/* Status Capaian KPI Card */}
        <div className={`p-4 rounded-2xl flex flex-col justify-between border ${
          isSaidiOnTarget && isSaifiOnTarget 
            ? 'bg-gradient-to-br from-slate-900 to-emerald-950 text-white border-emerald-500/30' 
            : 'bg-gradient-to-br from-slate-900 to-rose-950 text-white border-rose-500/30'
        }`}>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider mb-1">
              Status Capaian KPI ULP
            </div>
            <div className={`text-lg font-black flex items-center gap-1.5 ${
              isSaidiOnTarget && isSaifiOnTarget ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isSaidiOnTarget && isSaifiOnTarget ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>MEMENUHI KPI (GREEN)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>EVALUASI KPI (RED)</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {isSaidiOnTarget && isSaifiOnTarget 
                ? 'Realisasi SAIDI & SAIFI berada di bawah ambang batas maksimum target PLN.' 
                : 'Diperlukan percepatan penanganan gangguan & pemangkasan ROW pohon.'}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Metode Hitung:</span>
            <span className="font-bold text-white">Standar PLN Terintegrasi</span>
          </div>
        </div>

      </div>

      {/* REKAPITULASI TABEL REALISASI VS TARGET MANUAL */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              TABEL REKAPITULASI TARGET & REALISASI SAIDI / SAIFI {selectedYear}
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                Mode Target Manual
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Anda dapat mengubah Target KPI SAIDI/SAIFI maupun Realisasi secara langsung pada tabel di bawah
            </p>
          </div>

          <button 
            onClick={onOpenInputSaidi}
            className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>+ Form Input SAIDI/SAIFI Lengkap</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            } uppercase font-bold text-[10px] tracking-wider`}>
              <tr>
                <th className="p-3">Bulan</th>
                <th className="p-3">Realisasi SAIDI (Jam & Menit)</th>
                <th className="p-3">Target KPI SAIDI (Jam)</th>
                <th className="p-3">Realisasi SAIFI (Kali)</th>
                <th className="p-3">Target KPI SAIFI (Kali)</th>
                <th className="p-3">Status Capaian</th>
                <th className="p-3 text-right">Kerugian ENS (Jt Rp)</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {yearData.map((row) => {
                const isEditing = editingMonth === row.month;
                const onTarget = row.saidiReal <= row.saidiTarget && row.saifiReal <= row.saifiTarget;
                const saidiMinutes = (row.saidiReal * 60).toFixed(1);

                return (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Month */}
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      Bulan {row.month}
                    </td>

                    {/* SAIDI Real */}
                    <td className="p-3 font-bold text-blue-600 dark:text-cyan-400">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaidiReal} 
                          onChange={(e) => setEditSaidiReal(Number(e.target.value))}
                          className="w-20 p-1 border rounded font-bold bg-white dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <div>
                          <span>{row.saidiReal.toFixed(3)} Jam</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">({saidiMinutes} m)</span>
                        </div>
                      )}
                    </td>

                    {/* SAIDI Target Manual */}
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaidiTarget} 
                          onChange={(e) => setEditSaidiTarget(Number(e.target.value))}
                          className="w-20 p-1 border rounded font-bold bg-white dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span>{row.saidiTarget.toFixed(3)} Jam</span>
                      )}
                    </td>

                    {/* SAIFI Real */}
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaifiReal} 
                          onChange={(e) => setEditSaifiReal(Number(e.target.value))}
                          className="w-20 p-1 border rounded font-bold bg-white dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span>{row.saifiReal.toFixed(3)} Kali</span>
                      )}
                    </td>

                    {/* SAIFI Target Manual */}
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaifiTarget} 
                          onChange={(e) => setEditSaifiTarget(Number(e.target.value))}
                          className="w-20 p-1 border rounded font-bold bg-white dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span>{row.saifiTarget.toFixed(3)} Kali</span>
                      )}
                    </td>

                    {/* Status KPI */}
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        onTarget 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {onTarget ? 'Tercapai' : 'Di Atas Target'}
                      </span>
                    </td>

                    {/* Kerugian ENS */}
                    <td className="p-3 text-right font-black text-rose-600 dark:text-rose-400">
                      Rp {row.ensLossJuta.toFixed(2)} Jt
                    </td>

                    {/* Aksi Edit */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <button 
                          onClick={() => saveInlineEdit(row.month)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 mx-auto shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Simpan</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => startInlineEdit(row)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500"
                          title="Edit Target Manual / Realisasi Bulan Ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Kumulatif Summary Row */}
            <tfoot className={`border-t-2 font-black ${
              isDarkMode ? 'bg-slate-950/90 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}>
              <tr>
                <td className="p-3 text-blue-600 dark:text-cyan-400 uppercase">
                  KUMULATIF S/D {selectedMonthFilter === 'ALL' ? 'DES' : selectedMonthFilter} {selectedYear}
                </td>
                <td className="p-3 text-cyan-600 dark:text-cyan-300">
                  {cumSaidiReal.toFixed(3)} Jam <span className="text-[10px] font-normal text-slate-400">({cumSaidiRealMinutes.toFixed(1)} m)</span>
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  {cumSaidiTarget.toFixed(3)} Jam
                </td>
                <td className="p-3 text-indigo-600 dark:text-indigo-400">
                  {cumSaifiReal.toFixed(3)} Kali
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  {cumSaifiTarget.toFixed(3)} Kali
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSaidiOnTarget && isSaifiOnTarget ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isSaidiOnTarget && isSaifiOnTarget ? '✅ Memenuhi KPI' : '⚠️ Over Target'}
                  </span>
                </td>
                <td className="p-3 text-right text-rose-600 dark:text-rose-400">
                  Rp {cumEnsLossJuta.toFixed(2)} Jt
                </td>
                <td className="p-3 text-center text-slate-400 text-[10px]">
                  Akumulasi
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* KALKULATOR SIMULASI KERUGIAN ENS */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            KALKULATOR SIMULASI KERUGIAN ENS (ENERGY NOT SERVED)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Energi Tidak Tersalurkan (kWh)
            </label>
            <input 
              type="number"
              value={kwhUndelivered}
              onChange={(e) => setKwhUndelivered(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl text-xs border font-bold ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Tarif Rata-rata Listrik (Rp / kWh)
            </label>
            <input 
              type="number"
              value={taripKwh}
              onChange={(e) => setTaripKwh(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl text-xs border font-bold ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold block">
              Estimasi Kerugian Finansial PLN
            </span>
            <span className="text-xl font-black text-cyan-400 mt-1">
              {formatRupiah(calculateENS(kwhUndelivered))}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
