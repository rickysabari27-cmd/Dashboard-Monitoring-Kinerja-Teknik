import React, { useState } from 'react';
import { CustomSelect } from '../CustomSelect';
import { MonthlySaidiSaifiData } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Line,
  ComposedChart
} from 'recharts';
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
  Building2,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Printer,
  ShieldCheck,
  Activity,
  ChevronRight
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
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('Ags');
  const [chartMetric, setChartMetric] = useState<'saidi' | 'saifi' | 'ens' | 'response'>('saidi');

  // ENS Calculator State
  const [taripKwh, setTaripKwh] = useState<number>(1444.7);
  const [kwhUndelivered, setKwhUndelivered] = useState<number>(33192);

  // Inline editing row state
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editSaidiTarget, setEditSaidiTarget] = useState<number>(0);
  const [editSaidiUp3, setEditSaidiUp3] = useState<number>(0);
  const [editSaidiReal, setEditSaidiReal] = useState<number>(0);
  const [editSaifiTarget, setEditSaifiTarget] = useState<number>(0);
  const [editSaifiUp3, setEditSaifiUp3] = useState<number>(0);
  const [editSaifiReal, setEditSaifiReal] = useState<number>(0);
  const [editEnsTarget, setEditEnsTarget] = useState<number>(0);
  const [editEnsUp3, setEditEnsUp3] = useState<number>(0);
  const [editEnsReal, setEditEnsReal] = useState<number>(0);

  // Filter dataset by year
  const yearData = data.filter(d => (d.year || 2026) === selectedYear);

  // Enrich data with defaults for 3-way comparison if fields missing
  const enrichedYearData = yearData.map(d => ({
    ...d,
    saidiTarget: d.saidiTarget || 6.0,
    saidiUp3: d.saidiUp3 !== undefined ? d.saidiUp3 : Number((d.saidiTarget * 0.88).toFixed(3)),
    saidiReal: d.saidiReal || 0,
    saifiTarget: d.saifiTarget || 0.11,
    saifiUp3: d.saifiUp3 !== undefined ? d.saifiUp3 : Number((d.saifiTarget * 0.90).toFixed(3)),
    saifiReal: d.saifiReal || 0,
    ensTargetJuta: d.ensTargetJuta !== undefined ? d.ensTargetJuta : Number((d.saidiTarget * 0.90).toFixed(2)),
    ensUp3Juta: d.ensUp3Juta !== undefined ? d.ensUp3Juta : Number((d.saidiTarget * 0.78).toFixed(2)),
    ensLossJuta: d.ensLossJuta || 0,
    responseTimeTarget: d.responseTimeTarget || 45.0,
    responseTimeUp3: d.responseTimeUp3 || 38.5,
    responseTimeUlp: d.responseTimeUlp || 28.4
  }));

  // Filter dataset up to selected month (if month filter chosen)
  let filteredData = enrichedYearData;
  if (selectedMonthFilter !== 'ALL') {
    const monthIndex = MONTH_ORDER.indexOf(selectedMonthFilter);
    if (monthIndex >= 0) {
      filteredData = enrichedYearData.filter(d => {
        const idx = MONTH_ORDER.indexOf(d.month);
        return idx >= 0 && idx <= monthIndex;
      });
    }
  }

  // Cumulative YTD values for the filtered period
  const latestRow = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  // SAIDI YTD
  const cumSaidiTarget = latestRow ? latestRow.saidiTarget : 0;
  const cumSaidiUp3 = latestRow ? latestRow.saidiUp3 : 0;
  const cumSaidiReal = latestRow ? latestRow.saidiReal : 0;

  // SAIFI YTD
  const cumSaifiTarget = latestRow ? latestRow.saifiTarget : 0;
  const cumSaifiUp3 = latestRow ? latestRow.saifiUp3 : 0;
  const cumSaifiReal = latestRow ? latestRow.saifiReal : 0;

  // ENS YTD Sum
  const cumEnsTargetJuta = filteredData.reduce((acc, row) => acc + (row.ensTargetJuta || 0), 0);
  const cumEnsUp3Juta = filteredData.reduce((acc, row) => acc + (row.ensUp3Juta || 0), 0);
  const cumEnsLossJuta = filteredData.reduce((acc, row) => acc + (row.ensLossJuta || 0), 0);

  // Response Time Avg
  const avgResponseTarget = 45.0;
  const avgResponseUp3 = 38.5;
  const avgResponseUlp = 28.4;

  // Differences ULP vs Target KPI & ULP vs UP3
  const diffSaidiVsTarget = cumSaidiTarget - cumSaidiReal; // positive = better (lower than target)
  const diffSaidiVsUp3 = cumSaidiUp3 - cumSaidiReal;
  const diffSaifiVsTarget = cumSaifiTarget - cumSaifiReal;
  const diffSaifiVsUp3 = cumSaifiUp3 - cumSaifiReal;

  const isSaidiOnTarget = cumSaidiReal <= cumSaidiTarget;
  const isSaifiOnTarget = cumSaifiReal <= cumSaifiTarget;

  const calculateENS = (kwh: number) => kwh * taripKwh;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const startInlineEdit = (row: typeof enrichedYearData[0]) => {
    setEditingMonth(row.month);
    setEditSaidiTarget(row.saidiTarget);
    setEditSaidiUp3(row.saidiUp3);
    setEditSaidiReal(row.saidiReal);
    setEditSaifiTarget(row.saifiTarget);
    setEditSaifiUp3(row.saifiUp3);
    setEditSaifiReal(row.saifiReal);
    setEditEnsTarget(row.ensTargetJuta);
    setEditEnsUp3(row.ensUp3Juta);
    setEditEnsReal(row.ensLossJuta);
  };

  const saveInlineEdit = (month: string) => {
    if (onUpdateSaidiRow) {
      onUpdateSaidiRow({
        year: selectedYear,
        month,
        saidiTarget: editSaidiTarget,
        saidiUp3: editSaidiUp3,
        saidiReal: editSaidiReal,
        saifiTarget: editSaifiTarget,
        saifiUp3: editSaifiUp3,
        saifiReal: editSaifiReal,
        ensTargetJuta: editEnsTarget,
        ensUp3Juta: editEnsUp3,
        ensLossJuta: editEnsReal
      });
    }
    setEditingMonth(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Tooltip custom for 3-way comparison chart
  const CustomComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 rounded-xl shadow-2xl text-xs border bg-[#080e1e] border-[#1c2942] text-slate-100">
          <div className="font-extrabold text-[#00f5a0] mb-2 border-b border-[#1c2942] pb-1">
            Periode: Bulan {label} {selectedYear}
          </div>
          <div className="space-y-1.5 font-bold">
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-slate-400" /> Target KPI (UP3/Corporate):
              </span>
              <span>{payload[0]?.value} {chartMetric === 'saidi' ? 'Jam' : chartMetric === 'saifi' ? 'Kali' : chartMetric === 'ens' ? 'Jt Rp' : 'Menit'}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" /> Realisasi KPI UP3:
              </span>
              <span>{payload[1]?.value} {chartMetric === 'saidi' ? 'Jam' : chartMetric === 'saifi' ? 'Kali' : chartMetric === 'ens' ? 'Jt Rp' : 'Menit'}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#00f5a0]">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#00f5a0]" /> Realisasi ULP Baguala:
              </span>
              <span>{payload[2]?.value} {chartMetric === 'saidi' ? 'Jam' : chartMetric === 'saifi' ? 'Kali' : chartMetric === 'ens' ? 'Jt Rp' : 'Menit'}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 print:space-y-4">
      
      {/* HEADER BANNER: KINERJA KPI */}
      <div className="p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-white tracking-tight">
                Kinerja KPI — Perbandingan Target KPI vs Realisasi KPI vs Realisasi ULP
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PLN ULP BAGUALA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Matriks perbandingan 3 pilar utama operational performance: <strong className="text-slate-300">Target KPI Korporat</strong> vs <strong className="text-sky-400">Realisasi KPI UP3</strong> vs <strong className="text-[#00f5a0]">Realisasi ULP Baguala</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-[#0f1d33] hover:bg-[#162744] text-slate-200 rounded-xl text-xs font-bold border border-[#1e3254] flex items-center gap-2 transition-all cursor-pointer print:hidden"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Cetak PDF</span>
          </button>

          <button 
            onClick={onOpenInputSaidi}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-950/50 flex items-center gap-2 active:scale-95 transition-all cursor-pointer print:hidden"
          >
            <Edit3 className="w-4 h-4" />
            <span>+ Form Input Target & Realisasi KPI</span>
          </button>
        </div>
      </div>

      {/* FILTER PERIODE MONITORING */}
      <div className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 bg-[#0c1427] border-[#1c2942]">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
          <Filter className="w-4 h-4 text-[#00f5a0]" />
          <span>Filter Periode Kinerja KPI:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Select Tahun */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Tahun:</span>
            <CustomSelect
              value={String(selectedYear)}
              onChange={(val) => setSelectedYear(Number(val))}
              options={[
                { value: '2026', label: '2026 (Berjalan)' },
                { value: '2025', label: '2025 (Historis)' },
                { value: '2024', label: '2024 (Historis)' }
              ]}
              activeColor="emerald"
            />
          </div>

          {/* Select Bulan Filter */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Kumulatif Bulan:</span>
            <CustomSelect
              value={selectedMonthFilter}
              onChange={(val) => setSelectedMonthFilter(val)}
              options={[
                { value: 'ALL', label: 'Semua Bulan (Setahun Full)' },
                ...MONTH_ORDER.map(m => ({ value: m, label: `s/d Bulan ${m}` }))
              ]}
              activeColor="emerald"
            />
          </div>
        </div>
      </div>

      {/* 3-WAY COMPARISON CARDS GRID (Target KPI vs Realisasi KPI vs Realisasi ULP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* CARD 1: SAIDI (LAMA PADAM) */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between bg-[#0c1427] border-[#1c2942] shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span className="flex items-center gap-2 text-sky-400 font-extrabold">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>SAIDI (Lama Padam)</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                isSaidiOnTarget ? 'bg-emerald-950/60 text-[#00f5a0] border border-emerald-800/50' : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
              }`}>
                {isSaidiOnTarget ? '✅ Memenuhi KPI' : '⚠️ Over Target'}
              </span>
            </div>

            {/* 3-Pillar Value Breakdown */}
            <div className="space-y-2 mb-3">
              {/* Target KPI */}
              <div className="p-2.5 rounded-xl bg-[#070d19] border border-[#17253b] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" /> Target KPI (Max):
                </span>
                <span className="font-black text-slate-300">
                  {cumSaidiTarget.toFixed(3)} <span className="text-[10px] font-normal">Jam</span> ({ (cumSaidiTarget * 60).toFixed(1) } m)
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" /> Realisasi KPI UP3:
                </span>
                <span className="font-black text-white">
                  {cumSaidiUp3.toFixed(3)} <span className="text-[10px] font-normal">Jam</span> ({ (cumSaidiUp3 * 60).toFixed(1) } m)
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#052e2b] border border-[#0f5c53] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#00f5a0]">
                  {cumSaidiReal.toFixed(3)} <span className="text-xs font-normal">Jam</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Vs Target KPI: <strong className={diffSaidiVsTarget >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaidiVsTarget >= 0 ? `-${diffSaidiVsTarget.toFixed(3)} j` : `+${Math.abs(diffSaidiVsTarget).toFixed(3)} j`}</strong></span>
            <span>Vs Real UP3: <strong className={diffSaidiVsUp3 >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaidiVsUp3 >= 0 ? `-${diffSaidiVsUp3.toFixed(3)} j` : `+${Math.abs(diffSaidiVsUp3).toFixed(3)} j`}</strong></span>
          </div>
        </div>

        {/* CARD 2: SAIFI (FREKUENSI PADAM) */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between bg-[#0c1427] border-[#1c2942] shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span className="flex items-center gap-2 text-[#00e5ff] font-extrabold">
                <Zap className="w-4 h-4 text-[#00e5ff]" />
                <span>SAIFI (Frekuensi Padam)</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                isSaifiOnTarget ? 'bg-emerald-950/60 text-[#00f5a0] border border-emerald-800/50' : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
              }`}>
                {isSaifiOnTarget ? '✅ Memenuhi KPI' : '⚠️ Over Target'}
              </span>
            </div>

            {/* 3-Pillar Value Breakdown */}
            <div className="space-y-2 mb-3">
              {/* Target KPI */}
              <div className="p-2.5 rounded-xl bg-[#070d19] border border-[#17253b] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" /> Target KPI (Max):
                </span>
                <span className="font-black text-slate-300">
                  {cumSaifiTarget.toFixed(3)} <span className="text-[10px] font-normal">Kali/Plg</span>
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#00e5ff]" /> Realisasi KPI UP3:
                </span>
                <span className="font-black text-white">
                  {cumSaifiUp3.toFixed(3)} <span className="text-[10px] font-normal">Kali/Plg</span>
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#052e2b] border border-[#0f5c53] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#00f5a0]">
                  {cumSaifiReal.toFixed(3)} <span className="text-xs font-normal">Kali/Plg</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Vs Target KPI: <strong className={diffSaifiVsTarget >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaifiVsTarget >= 0 ? `-${diffSaifiVsTarget.toFixed(3)} x` : `+${Math.abs(diffSaifiVsTarget).toFixed(3)} x`}</strong></span>
            <span>Vs Real UP3: <strong className={diffSaifiVsUp3 >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaifiVsUp3 >= 0 ? `-${diffSaifiVsUp3.toFixed(3)} x` : `+${Math.abs(diffSaifiVsUp3).toFixed(3)} x`}</strong></span>
          </div>
        </div>

        {/* CARD 3: KERUGIAN ENS (ENERGY NOT SERVED) */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between bg-[#0c1427] border-[#1c2942] shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span className="flex items-center gap-2 text-[#fbbf24] font-extrabold">
                <DollarSign className="w-4 h-4 text-[#fbbf24]" />
                <span>KERUGIAN ENS (Energi Loss)</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-amber-950/50 text-[#fbbf24] border border-amber-800/50">
                Optimal Penjualan
              </span>
            </div>

            {/* 3-Pillar Value Breakdown */}
            <div className="space-y-2 mb-3">
              {/* Target KPI */}
              <div className="p-2.5 rounded-xl bg-[#070d19] border border-[#17253b] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" /> Target KPI Limit:
                </span>
                <span className="font-black text-slate-300">
                  Rp {cumEnsTargetJuta.toFixed(2)} Jt
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" /> Realisasi UP3 (Avg):
                </span>
                <span className="font-black text-white">
                  Rp {cumEnsUp3Juta.toFixed(2)} Jt
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#362205] border border-[#784c0c] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#fbbf24] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#fbbf24]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#fbbf24]">
                  Rp {cumEnsLossJuta.toFixed(2)} Jt
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Efisiensi Energi: <strong className="text-[#00f5a0]">+{ ((1 - (cumEnsLossJuta / (cumEnsTargetJuta || 1))) * 100).toFixed(1) }% Hemat</strong></span>
            <span>Target Rp: <strong className="text-slate-200">Rp { (cumEnsTargetJuta - cumEnsLossJuta).toFixed(2) } Jt Margin</strong></span>
          </div>
        </div>

      </div>

      {/* MULTI-SERIES RECHARTS: COMPARISON CHART (TARGET VS UP3 VS ULP) */}
      <div className="p-5 rounded-2xl border bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00f5a0]" />
              GRAFIK TREN PERBANDINGAN TARGET KPI VS REALISASI UP3 VS REALISASI ULP {selectedYear}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual perbandingan 3 seri data secara bulanan untuk menganalisis deviasi kinerja ULP Baguala terhadap target korporat
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#080e1e] rounded-xl border border-[#1b273e] text-xs font-extrabold">
            <button
              onClick={() => setChartMetric('saidi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'saidi' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SAIDI (Jam)
            </button>
            <button
              onClick={() => setChartMetric('saifi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'saifi' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SAIFI (Kali)
            </button>
            <button
              onClick={() => setChartMetric('ens')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'ens' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ENS (Jt Rp)
            </button>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={enrichedYearData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#1c283d" />
              <XAxis dataKey="month" stroke="#8ea2c0" fontSize={11} fontWeight={700} />
              <YAxis stroke="#8ea2c0" fontSize={11} />
              <Tooltip content={<CustomComparisonTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              
              {/* Target KPI (Dark Zinc Bar) */}
              <Bar 
                dataKey={chartMetric === 'saidi' ? 'saidiTarget' : chartMetric === 'saifi' ? 'saifiTarget' : 'ensTargetJuta'} 
                name="Target KPI (Batas Max)" 
                fill="#334155" 
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              
              {/* Realisasi KPI UP3 (Sky Blue Bar) */}
              <Bar 
                dataKey={chartMetric === 'saidi' ? 'saidiUp3' : chartMetric === 'saifi' ? 'saifiUp3' : 'ensUp3Juta'} 
                name="Realisasi KPI UP3" 
                fill="#0284c7" 
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              
              {/* Realisasi ULP Baguala (Vibrant Emerald Bar) */}
              <Bar 
                dataKey={chartMetric === 'saidi' ? 'saidiReal' : chartMetric === 'saifi' ? 'saifiReal' : 'ensLossJuta'} 
                name="Realisasi ULP Baguala" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                barSize={14}
              />

              {/* Trend Line for ULP Baguala */}
              <Line 
                type="monotone" 
                dataKey={chartMetric === 'saidi' ? 'saidiReal' : chartMetric === 'saifi' ? 'saifiReal' : 'ensLossJuta'} 
                name="Tren ULP" 
                stroke="#00f5a0" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#00f5a0' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REKAPITULASI TABEL DETIL: TARGET KPI VS REALISASI UP3 VS REALISASI ULP */}
      <div className="p-5 rounded-2xl border bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              TABEL REKAPITULASI HARIAN & BULANAN: TARGET KPI VS REALISASI UP3 VS REALISASI ULP ({selectedYear})
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                Mode 3-Way Audit
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Matriks pembanding persentase capaian dan deviasi angka SAIDI, SAIFI & ENS antara ULP Baguala dengan Target KPI Korporat & UP3
            </p>
          </div>

          <button 
            onClick={onOpenInputSaidi}
            className="text-xs font-extrabold text-emerald-400 hover:underline flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Form Input Lengkap</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-[#070c19] border-[#1c2942] text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Bulan</th>
                <th className="p-3 text-slate-400">Target KPI (Max)</th>
                <th className="p-3 text-sky-400">Realisasi KPI UP3</th>
                <th className="p-3 text-[#00f5a0]">Realisasi ULP Baguala</th>
                <th className="p-3">SAIFI (Target / UP3 / ULP)</th>
                <th className="p-3 text-right">ENS Loss (Target / UP3 / ULP)</th>
                <th className="p-3 text-center">Status KPI ULP</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2942] font-medium">
              {enrichedYearData.map((row) => {
                const isEditing = editingMonth === row.month;
                const onTarget = row.saidiReal <= row.saidiTarget && row.saifiReal <= row.saifiTarget;
                const saidiMinutes = (row.saidiReal * 60).toFixed(1);

                return (
                  <tr key={row.month} className="hover:bg-[#111c38]/60 transition-colors">
                    
                    {/* Month */}
                    <td className="p-3 font-black text-white">
                      Bulan {row.month}
                    </td>

                    {/* Target KPI SAIDI */}
                    <td className="p-3 font-extrabold text-slate-400">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaidiTarget} 
                          onChange={(e) => setEditSaidiTarget(Number(e.target.value))}
                          className="w-20 p-1 border border-[#1c2942] rounded font-bold bg-[#070c19] text-white"
                        />
                      ) : (
                        <span>{row.saidiTarget.toFixed(3)} Jam</span>
                      )}
                    </td>

                    {/* Realisasi KPI UP3 */}
                    <td className="p-3 font-extrabold text-sky-400">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaidiUp3} 
                          onChange={(e) => setEditSaidiUp3(Number(e.target.value))}
                          className="w-20 p-1 border border-[#1c2942] rounded font-bold bg-[#070c19] text-white"
                        />
                      ) : (
                        <span>{row.saidiUp3.toFixed(3)} Jam</span>
                      )}
                    </td>

                    {/* Realisasi ULP Baguala */}
                    <td className="p-3 font-black text-[#00f5a0]">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.001" 
                          value={editSaidiReal} 
                          onChange={(e) => setEditSaidiReal(Number(e.target.value))}
                          className="w-20 p-1 border border-[#1c2942] rounded font-bold bg-[#070c19] text-white"
                        />
                      ) : (
                        <div>
                          <span>{row.saidiReal.toFixed(3)} Jam</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">({saidiMinutes} m)</span>
                        </div>
                      )}
                    </td>

                    {/* SAIFI Breakdown (Target / UP3 / ULP) */}
                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input type="number" step="0.01" value={editSaifiTarget} onChange={(e) => setEditSaifiTarget(Number(e.target.value))} className="w-14 p-1 border border-[#1c2942] rounded bg-[#070c19] text-white" placeholder="Target" />
                          <input type="number" step="0.01" value={editSaifiUp3} onChange={(e) => setEditSaifiUp3(Number(e.target.value))} className="w-14 p-1 border border-[#1c2942] rounded bg-[#070c19] text-white" placeholder="UP3" />
                          <input type="number" step="0.01" value={editSaifiReal} onChange={(e) => setEditSaifiReal(Number(e.target.value))} className="w-14 p-1 border border-[#1c2942] rounded bg-[#070c19] text-white" placeholder="ULP" />
                        </div>
                      ) : (
                        <div className="text-[11px] font-bold space-x-1">
                          <span className="text-slate-400">{row.saifiTarget.toFixed(2)}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-sky-400">{row.saifiUp3.toFixed(2)}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-[#00f5a0]">{row.saifiReal.toFixed(2)} Kali</span>
                        </div>
                      )}
                    </td>

                    {/* ENS Breakdown */}
                    <td className="p-3 text-right font-bold text-slate-200">
                      <span className="text-[#fbbf24] font-black">
                        Rp {row.ensLossJuta.toFixed(2)} Jt
                      </span>
                    </td>

                    {/* Status KPI */}
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        onTarget 
                          ? 'bg-emerald-950/60 text-[#00f5a0] border border-emerald-800/50' 
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                      }`}>
                        {onTarget ? 'Tercapai (Green)' : 'Over Target'}
                      </span>
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
                          className="p-1.5 rounded-lg hover:bg-[#162744] text-slate-400 hover:text-[#00f5a0]"
                          title="Edit Target KPI vs Realisasi UP3 vs Realisasi ULP"
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
              isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-900'
            }`}>
              <tr>
                <td className="p-3 text-emerald-500 dark:text-emerald-400 uppercase">
                  KUMULATIF S/D {selectedMonthFilter === 'ALL' ? 'DES' : selectedMonthFilter} {selectedYear}
                </td>
                <td className="p-3 text-zinc-400">
                  {cumSaidiTarget.toFixed(3)} Jam
                </td>
                <td className="p-3 text-zinc-300">
                  {cumSaidiUp3.toFixed(3)} Jam
                </td>
                <td className="p-3 text-emerald-500 dark:text-emerald-400">
                  {cumSaidiReal.toFixed(3)} Jam
                </td>
                <td className="p-3 text-xs">
                  <span className="text-zinc-400">{cumSaifiTarget.toFixed(2)}</span> / <span className="text-zinc-300">{cumSaifiUp3.toFixed(2)}</span> / <span className="text-emerald-500">{cumSaifiReal.toFixed(2)} Kali</span>
                </td>
                <td className="p-3 text-right text-emerald-500 dark:text-emerald-400 font-black">
                  Rp {cumEnsLossJuta.toFixed(2)} Jt
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSaidiOnTarget && isSaifiOnTarget ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {isSaidiOnTarget && isSaifiOnTarget ? '✅ Memenuhi KPI' : '⚠️ Over Target'}
                  </span>
                </td>
                <td className="p-3 text-center text-zinc-400 text-[10px]">
                  Total Audit
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* KALKULATOR SIMULASI KERUGIAN ENS */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-emerald-500" />
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
            KALKULATOR SIMULASI KERUGIAN ENS (ENERGY NOT SERVED)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">
              Energi Tidak Tersalurkan (kWh)
            </label>
            <input 
              type="number"
              value={kwhUndelivered}
              onChange={(e) => setKwhUndelivered(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl text-xs border font-bold ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">
              Tarif Rata-rata Listrik (Rp / kWh)
            </label>
            <input 
              type="number"
              value={taripKwh}
              onChange={(e) => setTaripKwh(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl text-xs border font-bold ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-white flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
              Estimasi Kerugian Finansial PLN
            </span>
            <span className="text-xl font-black text-emerald-400 mt-1">
              {formatRupiah(calculateENS(kwhUndelivered))}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
