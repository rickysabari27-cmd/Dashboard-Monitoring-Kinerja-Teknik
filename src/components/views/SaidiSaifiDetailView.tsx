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
import { saveDocument } from '../../services/firebaseSync';
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
  ChevronRight,
  RotateCcw,
  AlertTriangle
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
  // Filters & Display Unit Mode
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('Jan');
  const [matrixPeriod, setMatrixPeriod] = useState<'s1' | 's2' | 'all'>('s1');
  const [chartMetric, setChartMetric] = useState<
    'saidi' | 'saifi' | 'ens' | 'susut' | 'response' | 'autodispatch' | 'feedback' | 'gangguan' | 'kerusakan' | 'mvod' | 'mttr' | 'ruptl' | 'investasi'
  >('saidi');
  const [saidiUnitDisplay, setSaidiUnitDisplay] = useState<'menit' | 'jam'>('menit');
  const [ensUnitDisplay, setEnsUnitDisplay] = useState<'mwh' | 'juta'>('mwh');

  // Helper to format decimal numbers with comma (,) for Indonesian locale
  const formatComma = (val: number | undefined | null, decimals: number = 2): string => {
    if (val === undefined || val === null || isNaN(val)) return '0,00';
    return val.toFixed(decimals).replace('.', ',');
  };

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

  // Enrich data for all 12 months with exact matching from data
  const enrichedYearData = MONTH_ORDER.map(m => {
    const d = (data || []).find(item => (item.year || 2026) === selectedYear && item.month === m);
    const sTarget = d?.saidiTarget ?? 0;
    const sTargetM = d?.saidiTargetMenit !== undefined ? d.saidiTargetMenit : Number((sTarget * 60).toFixed(2));
    const sUp3 = d?.saidiUp3 ?? 0;
    const sUp3M = d?.saidiUp3Menit !== undefined ? d.saidiUp3Menit : Number((sUp3 * 60).toFixed(2));
    const sReal = d?.saidiReal ?? 0;
    const sRealM = d?.saidiRealMenit !== undefined ? d.saidiRealMenit : Number((sReal * 60).toFixed(2));

    const eTargetJuta = d?.ensTargetJuta ?? 0;
    const eTargetMwh = d?.ensMwhTarget !== undefined ? d.ensMwhTarget : Number((eTargetJuta / 1.4447).toFixed(3));
    const eUp3Juta = d?.ensUp3Juta ?? 0;
    const eUp3Mwh = d?.ensMwhUp3 !== undefined ? d.ensMwhUp3 : Number((eUp3Juta / 1.4447).toFixed(3));
    const eRealJuta = d?.ensLossJuta ?? 0;
    const eRealMwh = d?.ensMwhReal !== undefined ? d.ensMwhReal : Number((eRealJuta / 1.4447).toFixed(3));

    return {
      month: m,
      year: selectedYear,
      ...d,
      saidiTarget: sTarget,
      saidiTargetMenit: sTargetM,
      saidiUp3: sUp3,
      saidiUp3Menit: sUp3M,
      saidiReal: sReal,
      saidiRealMenit: sRealM,
      saifiTarget: d?.saifiTarget ?? 0,
      saifiUp3: d?.saifiUp3 ?? 0,
      saifiReal: d?.saifiReal ?? 0,
      ensTargetJuta: eTargetJuta,
      ensMwhTarget: eTargetMwh,
      ensUp3Juta: eUp3Juta,
      ensMwhUp3: eUp3Mwh,
      ensLossJuta: eRealJuta,
      ensMwhReal: eRealMwh,
      responseTimeTarget: d?.responseTimeTarget ?? 0,
      responseTimeUp3: d?.responseTimeUp3 ?? 0,
      responseTimeUlp: d?.responseTimeUlp ?? 0,
      successRateAutoDispatchTarget: d?.successRateAutoDispatchTarget ?? 0,
      successRateAutoDispatchUp3: d?.successRateAutoDispatchUp3 ?? 0,
      successRateAutoDispatchUlp: d?.successRateAutoDispatchUlp ?? 0,
      feedbackRatingNegatifTarget: d?.feedbackRatingNegatifTarget ?? 0,
      feedbackRatingNegatifUp3: d?.feedbackRatingNegatifUp3 ?? 0,
      feedbackRatingNegatifUlp: d?.feedbackRatingNegatifUlp ?? 0,
      gangguanTmTarget: d?.gangguanTmTarget ?? 0,
      gangguanTmUp3: d?.gangguanTmUp3 ?? 0,
      gangguanTmReal: d?.gangguanTmReal ?? 0,
      kerusakanPeralatanTarget: d?.kerusakanPeralatanTarget ?? 0,
      kerusakanPeralatanUp3: d?.kerusakanPeralatanUp3 ?? 0,
      kerusakanPeralatanReal: d?.kerusakanPeralatanReal ?? 0,
      mvodTarget: d?.mvodTarget ?? 0,
      mvodUp3: d?.mvodUp3 ?? 0,
      mvodUlp: d?.mvodUlp ?? 0,
      mttrSiaga1Target: d?.mttrSiaga1Target ?? 0,
      mttrSiaga1Up3: d?.mttrSiaga1Up3 ?? 0,
      mttrSiaga1Ulp: d?.mttrSiaga1Ulp ?? 0,
      asetRuptlTarget: d?.asetRuptlTarget ?? 0,
      asetRuptlUp3: d?.asetRuptlUp3 ?? 0,
      asetRuptlUlp: d?.asetRuptlUlp ?? 0,
      asetInvestasiTarget: d?.asetInvestasiTarget ?? 0,
      asetInvestasiUp3: d?.asetInvestasiUp3 ?? 0,
      asetInvestasiUlp: d?.asetInvestasiUlp ?? 0,
      penjualanGwhTarget: d?.penjualanGwhTarget ?? 0,
      penjualanGwhUp3: d?.penjualanGwhUp3 ?? 0,
      penjualanGwhReal: d?.penjualanGwhReal ?? 0,
      susutPercentTarget: d?.susutPercentTarget ?? 0,
      susutPercentUp3: d?.susutPercentUp3 ?? 0,
      susutPercentReal: d?.susutPercentReal ?? 0
    };
  });

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

  // Selected/Latest row for the KPI header cards
  const latestRow = selectedMonthFilter !== 'ALL'
    ? (enrichedYearData.find(d => d.month === selectedMonthFilter) || enrichedYearData[0])
    : (filteredData.length > 0 ? filteredData[filteredData.length - 1] : enrichedYearData[0]);

  // SAIDI YTD (Jam & Menit)
  const cumSaidiTarget = latestRow ? latestRow.saidiTarget : 0;
  const cumSaidiTargetMenit = latestRow ? latestRow.saidiTargetMenit : 0;
  const cumSaidiUp3 = latestRow ? latestRow.saidiUp3 : 0;
  const cumSaidiUp3Menit = latestRow ? latestRow.saidiUp3Menit : 0;
  const cumSaidiReal = latestRow ? latestRow.saidiReal : 0;
  const cumSaidiRealMenit = latestRow ? latestRow.saidiRealMenit : 0;

  // SAIFI YTD
  const cumSaifiTarget = latestRow ? latestRow.saifiTarget : 0;
  const cumSaifiUp3 = latestRow ? latestRow.saifiUp3 : 0;
  const cumSaifiReal = latestRow ? latestRow.saifiReal : 0;

  // ENS YTD Sum / Latest Kumulatif
  const cumEnsTargetJuta = latestRow ? latestRow.ensTargetJuta : 0;
  const cumEnsTargetMwh = latestRow ? latestRow.ensMwhTarget : 0;
  const cumEnsUp3Juta = latestRow ? latestRow.ensUp3Juta : 0;
  const cumEnsUp3Mwh = latestRow ? latestRow.ensMwhUp3 : 0;
  const cumEnsLossJuta = latestRow ? latestRow.ensLossJuta : 0;
  const cumEnsLossMwh = latestRow ? latestRow.ensMwhReal : 0;

  // Differences ULP vs Target KPI & ULP vs UP3 (using minutes for SAIDI if selected)
  const diffSaidiVsTargetMenit = cumSaidiTargetMenit - cumSaidiRealMenit;
  const diffSaidiVsUp3Menit = cumSaidiUp3Menit - cumSaidiRealMenit;
  const diffSaidiVsTargetJam = cumSaidiTarget - cumSaidiReal;
  const diffSaidiVsUp3Jam = cumSaidiUp3 - cumSaidiReal;

  const diffSaifiVsTarget = cumSaifiTarget - cumSaifiReal;
  const diffSaifiVsUp3 = cumSaifiUp3 - cumSaifiReal;

  const isSaidiOnTarget = cumSaidiRealMenit <= cumSaidiTargetMenit;
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

  const getChartMetricMeta = () => {
    switch (chartMetric) {
      case 'saidi': return { target: 'saidiTarget', real: 'saidiReal', unit: 'Jam/Plg', label: 'SAIDI (Lama Padam)' };
      case 'saifi': return { target: 'saifiTarget', real: 'saifiReal', unit: 'Kali/Plg', label: 'SAIFI (Frekuensi Padam)' };
      case 'ens': return { target: 'ensMwhTarget', real: 'ensMwhReal', unit: 'MWh', label: 'ENS Energi Loss' };
      case 'susut': return { target: 'susutPercentTarget', real: 'susutPercentReal', unit: '%', label: 'Susut Distribusi Tanpa Emin' };
      case 'response': return { target: 'responseTimeTarget', real: 'responseTimeUlp', unit: 'Menit', label: 'Response Time Gangguan' };
      case 'autodispatch': return { target: 'successRateAutoDispatchTarget', real: 'successRateAutoDispatchUlp', unit: '%', label: 'Success Rate Auto Dispatch' };
      case 'feedback': return { target: 'feedbackRatingNegatifTarget', real: 'feedbackRatingNegatifUlp', unit: 'Kali', label: 'Feedback Rating Negatif PLN Mobile' };
      case 'gangguan': return { target: 'gangguanTmTarget', real: 'gangguanTmReal', unit: 'Kali', label: 'Jumlah Gangguan TM' };
      case 'kerusakan': return { target: 'kerusakanPeralatanTarget', real: 'kerusakanPeralatanReal', unit: 'Kali', label: 'Kerusakan Peralatan Distribusi' };
      case 'mvod': return { target: 'mvodTarget', real: 'mvodUlp', unit: '%', label: 'MVOD' };
      case 'mttr': return { target: 'mttrSiaga1Target', real: 'mttrSiaga1Ulp', unit: 'Menit', label: 'MTTR Siaga 1 TM' };
      case 'ruptl': return { target: 'asetRuptlTarget', real: 'asetRuptlUlp', unit: '%', label: 'Penambahan Aset RUPTL' };
      case 'investasi': return { target: 'asetInvestasiTarget', real: 'asetInvestasiUlp', unit: '%', label: 'Aset Penyelesaian Fisik Investasi' };
      default: return { target: 'saidiTarget', real: 'saidiReal', unit: 'Jam/Plg', label: 'SAIDI' };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Tooltip custom for Target vs Realisasi chart
  const CustomComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const meta = getChartMetricMeta();
      return (
        <div className="p-3.5 rounded-xl shadow-2xl text-xs border bg-[#080e1e] border-[#1c2942] text-slate-100">
          <div className="font-extrabold text-[#00f5a0] mb-2 border-b border-[#1c2942] pb-1">
            Periode: Bulan {label} {selectedYear} ({meta.label})
          </div>
          <div className="space-y-1.5 font-bold">
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-slate-400" /> Target KPI:
              </span>
              <span>{formatComma(payload[0]?.value, 2)} {meta.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#00f5a0]">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#00f5a0]" /> Realisasi KPI:
              </span>
              <span>{formatComma(payload[1]?.value, 2)} {meta.unit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleResetAllData = () => {
    if (window.confirm("Apakah Anda yakin ingin mengosongkan/menghapus semua data Target & Realisasi KPI? Semua data akan di-reset menjadi 0 agar Anda dapat menginput manual dari awal.")) {
      MONTH_ORDER.forEach((m) => {
        const emptyRow: MonthlySaidiSaifiData = {
          id: `${m}_${selectedYear}`,
          year: selectedYear,
          month: m,
          saidiTargetMenit: 0,
          saidiUp3Menit: 0,
          saidiRealMenit: 0,
          saidiTarget: 0,
          saidiUp3: 0,
          saidiReal: 0,
          saifiTarget: 0,
          saifiUp3: 0,
          saifiReal: 0,
          ensMwhTarget: 0,
          ensMwhUp3: 0,
          ensMwhReal: 0,
          ensTargetJuta: 0,
          ensUp3Juta: 0,
          ensLossJuta: 0,
          responseTimeTarget: 0,
          responseTimeUp3: 0,
          responseTimeUlp: 0,
          successRateAutoDispatchTarget: 0,
          successRateAutoDispatchUp3: 0,
          successRateAutoDispatchUlp: 0,
          feedbackRatingNegatifTarget: 0,
          feedbackRatingNegatifUp3: 0,
          feedbackRatingNegatifUlp: 0,
          gangguanTmTarget: 0,
          gangguanTmUp3: 0,
          gangguanTmReal: 0,
          kerusakanPeralatanTarget: 0,
          kerusakanPeralatanUp3: 0,
          kerusakanPeralatanReal: 0,
          mvodTarget: 0,
          mvodUp3: 0,
          mvodUlp: 0,
          mttrSiaga1Target: 0,
          mttrSiaga1Up3: 0,
          mttrSiaga1Ulp: 0,
          asetRuptlTarget: 0,
          asetRuptlUp3: 0,
          asetRuptlUlp: 0,
          asetInvestasiTarget: 0,
          asetInvestasiUp3: 0,
          asetInvestasiUlp: 0,
          penjualanGwhTarget: 0,
          penjualanGwhUp3: 0,
          penjualanGwhReal: 0,
          susutPercentTarget: 0,
          susutPercentUp3: 0,
          susutPercentReal: 0
        };
        if (onUpdateSaidiRow) {
          onUpdateSaidiRow(emptyRow);
        }
        saveDocument('saidi_saifi', emptyRow, `${m}_${selectedYear}`);
      });
    }
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
                Kinerja KPI — Perbandingan Target KPI vs Realisasi KPI
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PLN ULP BAGUALA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Matriks perbandingan kinerja operasional: <strong className="text-slate-300">Target KPI Korporat</strong> vs <strong className="text-[#00f5a0]">Realisasi KPI</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleResetAllData}
            className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer print:hidden"
            title="Hapus / Kosongkan semua data Target & Realisasi KPI untuk input manual"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Kosongkan Data Target & Realisasi</span>
          </button>

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
              
              {/* Unit Switcher */}
              <div className="flex items-center bg-[#070d19] rounded-lg p-0.5 border border-[#17253b] text-[10px] font-black">
                <button
                  onClick={() => setSaidiUnitDisplay('menit')}
                  className={`px-2 py-0.5 rounded ${saidiUnitDisplay === 'menit' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  menit/plg
                </button>
                <button
                  onClick={() => setSaidiUnitDisplay('jam')}
                  className={`px-2 py-0.5 rounded ${saidiUnitDisplay === 'jam' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  jam/plg
                </button>
              </div>
            </div>

            {/* 3-Pillar Value Breakdown */}
            <div className="space-y-2 mb-3">
              {/* Target KPI */}
              <div className="p-2.5 rounded-xl bg-[#070d19] border border-[#17253b] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" /> Target KPI (Max):
                </span>
                <span className="font-black text-slate-300">
                  {saidiUnitDisplay === 'menit' 
                    ? `${formatComma(cumSaidiTargetMenit, 2)} menit/plg`
                    : `${formatComma(cumSaidiTarget, 3)} jam/plg`
                  }
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" /> Realisasi KPI UP3:
                </span>
                <span className="font-black text-white">
                  {saidiUnitDisplay === 'menit' 
                    ? `${formatComma(cumSaidiUp3Menit, 2)} menit/plg`
                    : `${formatComma(cumSaidiUp3, 3)} jam/plg`
                  }
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#052e2b] border border-[#0f5c53] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#00f5a0]">
                  {saidiUnitDisplay === 'menit' 
                    ? `${formatComma(cumSaidiRealMenit, 2)} menit/plg`
                    : `${formatComma(cumSaidiReal, 3)} jam/plg`
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Vs Target: <strong className={diffSaidiVsTargetMenit >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaidiVsTargetMenit >= 0 ? `-${formatComma(diffSaidiVsTargetMenit, 2)} m` : `+${formatComma(Math.abs(diffSaidiVsTargetMenit), 2)} m`}</strong></span>
            <span>Vs Real UP3: <strong className={diffSaidiVsUp3Menit >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaidiVsUp3Menit >= 0 ? `-${formatComma(diffSaidiVsUp3Menit, 2)} m` : `+${formatComma(Math.abs(diffSaidiVsUp3Menit), 2)} m`}</strong></span>
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
                  {formatComma(cumSaifiTarget, 2)} <span className="text-[10px] font-normal">kali/plg</span>
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#00e5ff]" /> Realisasi KPI UP3:
                </span>
                <span className="font-black text-white">
                  {formatComma(cumSaifiUp3, 2)} <span className="text-[10px] font-normal">kali/plg</span>
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#052e2b] border border-[#0f5c53] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#00f5a0]">
                  {formatComma(cumSaifiReal, 2)} <span className="text-xs font-normal">kali/plg</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Vs Target: <strong className={diffSaifiVsTarget >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaifiVsTarget >= 0 ? `-${formatComma(diffSaifiVsTarget, 2)} x` : `+${formatComma(Math.abs(diffSaifiVsTarget), 2)} x`}</strong></span>
            <span>Vs Real UP3: <strong className={diffSaifiVsUp3 >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSaifiVsUp3 >= 0 ? `-${formatComma(diffSaifiVsUp3, 2)} x` : `+${formatComma(Math.abs(diffSaifiVsUp3), 2)} x`}</strong></span>
          </div>
        </div>

        {/* CARD 3: KERUGIAN ENS (ENERGY NOT SERVED) */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between bg-[#0c1427] border-[#1c2942] shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span className="flex items-center gap-2 text-[#fbbf24] font-extrabold">
                <DollarSign className="w-4 h-4 text-[#fbbf24]" />
                <span>ENS (Energi Loss)</span>
              </span>
              
              {/* Unit Switcher */}
              <div className="flex items-center bg-[#070d19] rounded-lg p-0.5 border border-[#17253b] text-[10px] font-black">
                <button
                  onClick={() => setEnsUnitDisplay('mwh')}
                  className={`px-2 py-0.5 rounded ${ensUnitDisplay === 'mwh' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  MWh
                </button>
                <button
                  onClick={() => setEnsUnitDisplay('juta')}
                  className={`px-2 py-0.5 rounded ${ensUnitDisplay === 'juta' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Rp Juta
                </button>
              </div>
            </div>

            {/* 3-Pillar Value Breakdown */}
            <div className="space-y-2 mb-3">
              {/* Target KPI */}
              <div className="p-2.5 rounded-xl bg-[#070d19] border border-[#17253b] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" /> Target KPI Limit:
                </span>
                <span className="font-black text-slate-300">
                  {ensUnitDisplay === 'mwh' 
                    ? `${formatComma(cumEnsTargetMwh, 3)} MWh`
                    : `Rp ${formatComma(cumEnsTargetJuta, 2)} Jt`
                  }
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" /> Realisasi UP3:
                </span>
                <span className="font-black text-white">
                  {ensUnitDisplay === 'mwh' 
                    ? `${formatComma(cumEnsUp3Mwh, 3)} MWh`
                    : `Rp ${formatComma(cumEnsUp3Juta, 2)} Jt`
                  }
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#362205] border border-[#784c0c] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#fbbf24] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#fbbf24]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#fbbf24]">
                  {ensUnitDisplay === 'mwh' 
                    ? `${formatComma(cumEnsLossMwh, 3)} MWh`
                    : `Rp ${formatComma(cumEnsLossJuta, 2)} Jt`
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Efisiensi: <strong className="text-[#00f5a0]">+{ formatComma((1 - (cumEnsLossMwh / (cumEnsTargetMwh || 1))) * 100, 1) }% Hemat</strong></span>
            <span>Margin Target: <strong className="text-slate-200">{formatComma(cumEnsTargetMwh - cumEnsLossMwh, 3)} MWh</strong></span>
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

          {/* Metric Selector Dropdown / Pills */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400">Pilih Indikator KPI:</label>
            <select
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#080e1e] border border-[#1b273e] text-xs font-black text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="saidi">SAIDI (Lama Padam - Jam/Plg)</option>
              <option value="saifi">SAIFI (Frekuensi Padam - Kali/Plg)</option>
              <option value="ens">ENS Energi Loss (MWh)</option>
              <option value="susut">Susut Distribusi Tanpa Emin (%)</option>
              <option value="ruptl">Penambahan Aset RUPTL (%)</option>
              <option value="investasi">Aset Penyelesaian Investasi (%)</option>
              <option value="feedback">Feedback Rating Negatif (Kali)</option>
              <option value="response">Response Time Gangguan (Menit)</option>
              <option value="autodispatch">Success Rate Auto Dispatch (%)</option>
              <option value="gangguan">Jumlah Gangguan TM (Kali)</option>
              <option value="kerusakan">Kerusakan Peralatan (Kali)</option>
              <option value="mvod">MVOD (%)</option>
              <option value="mttr">MTTR Siaga 1 TM (Menit)</option>
            </select>
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
              
              {/* Target KPI (Dark Slate Bar) */}
              <Bar 
                dataKey={getChartMetricMeta().target} 
                name="Target KPI" 
                fill="#475569" 
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              
              {/* Realisasi KPI (Vibrant Emerald Bar) */}
              <Bar 
                dataKey={getChartMetricMeta().real} 
                name="Realisasi KPI" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                barSize={18}
              />

              {/* Trend Line for Realisasi */}
              <Line 
                type="monotone" 
                dataKey={getChartMetricMeta().real} 
                name="Tren Realisasi KPI" 
                stroke="#00f5a0" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#00f5a0' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MATRIKS LENGKAP SCORECARD KPI ULP BAGUALA 2026 (MATCHING EXCEL DATA) */}
      <div className="p-5 rounded-2xl border bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              MATRIKS KINERJA KPI & PERFORMANCE INDICATORS (ULP BAGUALA {selectedYear})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian seluruh indikator kinerja bulanan (Susut, SAIDI, SAIFI, ENS, Gangguan TM, Pelayanan, Aset) sesuai dokumen Excel PLN
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={onOpenInputSaidi}
              className="text-xs font-extrabold text-white flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3.5 py-1.5 rounded-xl shadow-md cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Input Target & Realisasi</span>
            </button>

            {/* Period Selector Tabs for Matriks Kinerja */}
            <div className="flex items-center gap-1 bg-[#070c19] p-1 rounded-xl border border-[#1c2942] text-xs font-bold">
              <button
                type="button"
                onClick={() => setMatrixPeriod('s1')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  matrixPeriod === 's1' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semester 1 (Jan - Jun)
              </button>
              <button
                type="button"
                onClick={() => setMatrixPeriod('s2')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  matrixPeriod === 's2' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semester 2 (Jul - Des)
              </button>
              <button
                type="button"
                onClick={() => setMatrixPeriod('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  matrixPeriod === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                12 Bulan (Full Year)
              </button>
            </div>
          </div>
        </div>

        {(() => {
          const matrixMonths = matrixPeriod === 's1' 
            ? MONTH_ORDER.slice(0, 6) 
            : matrixPeriod === 's2' 
              ? MONTH_ORDER.slice(6, 12) 
              : MONTH_ORDER;

          const displayedData = matrixMonths.map(m => enrichedYearData.find(d => d.month === m) || enrichedYearData[0]);
          const targetRow = displayedData[displayedData.length - 1];

          return (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs divide-y divide-[#1c2942]">
                <thead className="bg-[#070c19] text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Indikator Kinerja</th>
                    <th className="p-3 text-center">Satuan</th>
                    <th className="p-3 text-center">Target ({matrixPeriod === 's1' ? 'S1' : matrixPeriod === 's2' ? 'S2' : 'Tahunan'})</th>
                    {matrixMonths.map(m => (
                      <th key={m} className="p-3 text-center">{m}</th>
                    ))}
                    <th className="p-3 text-center text-[#00f5a0]">Kumulatif / Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2942] font-semibold text-slate-200">
                  
                  {/* Row 1: Susut % */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Susut Distribusi Tanpa Emin (%)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">%</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.susutPercentTarget, 2)}%</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-cyan-400 font-bold block">{formatComma(r.susutPercentReal, 2)}%</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.susutPercentTarget, 2)}%</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-cyan-400 font-black">
                      {formatComma(targetRow?.susutPercentReal ?? 0, 2)}%
                    </td>
                  </tr>

                  {/* Row 3: SAIDI (Menit/Plg) */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>SAIDI (Kumulatif Menit / Plg)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">menit/plg</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.saidiTargetMenit, 2)}</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-sky-400 font-bold block">{formatComma(r.saidiRealMenit, 2)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.saidiTargetMenit, 2)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-sky-400 font-black">
                      {formatComma(targetRow?.saidiRealMenit ?? 0, 2)} m
                    </td>
                  </tr>

                  {/* Row 4: SAIDI (Jam/Plg) */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-slate-300 flex items-center gap-2 pl-6">
                      <span>↳ SAIDI Konversi (Jam / Plg)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">jam/plg</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.saidiTarget, 3)} j</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-slate-200 font-bold block">{formatComma(r.saidiReal, 3)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.saidiTarget, 3)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-slate-200 font-black">
                      {formatComma(targetRow?.saidiReal ?? 0, 3)} j
                    </td>
                  </tr>

                  {/* Row 5: SAIFI */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>SAIFI (Kumulatif Kali / Plg)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">kali/plg</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.saifiTarget, 2)}</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-[#00e5ff] font-bold block">{formatComma(r.saifiReal, 2)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.saifiTarget, 2)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-[#00e5ff] font-black">
                      {formatComma(targetRow?.saifiReal ?? 0, 2)} x
                    </td>
                  </tr>

                  {/* Row 6: ENS Loss MWh */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>ENS (Energi Loss)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">MWh</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.ensMwhTarget, 3)} MWh</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-amber-400 font-bold block">{formatComma(r.ensMwhReal, 3)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.ensMwhTarget, 3)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-amber-400 font-black">
                      {formatComma(targetRow?.ensMwhReal ?? 0, 3)} MWh
                    </td>
                  </tr>

                  {/* Row 7: Response Time */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>Response Time Pelayanan Gangguan</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">menit</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.responseTimeTarget, 1)} m</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-teal-400 font-bold block">{formatComma(r.responseTimeUlp, 1)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.responseTimeTarget, 1)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-teal-400 font-black">
                      {formatComma(targetRow?.responseTimeUlp ?? 0, 1)} m
                    </td>
                  </tr>

                  {/* Row 8: Feedback Rating Negatif */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Feedback Rating Negatif PLN Mobile</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">kali</td>
                    <td className="p-3 text-center text-slate-400">{(targetRow?.feedbackRatingNegatifTarget ?? 0)} kali</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-purple-400 font-bold block">{r.feedbackRatingNegatifUlp ?? 0}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {r.feedbackRatingNegatifTarget ?? 0}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-purple-400 font-black">
                      {(targetRow?.feedbackRatingNegatifUlp ?? 0)} kali
                    </td>
                  </tr>

                  {/* Row 9: Success Rate Auto Dispatch */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      <span>Success Rate Auto Dispatch</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">%</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.successRateAutoDispatchTarget, 2)}%</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-blue-400 font-bold block">{formatComma(r.successRateAutoDispatchUlp, 2)}%</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.successRateAutoDispatchTarget, 2)}%</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-blue-400 font-black">
                      {formatComma(targetRow?.successRateAutoDispatchUlp ?? 0, 2)}%
                    </td>
                  </tr>

                  {/* Row 10: Gangguan TM */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>Jumlah Gangguan Penulang / TM</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">kali</td>
                    <td className="p-3 text-center text-slate-400">{targetRow?.gangguanTmTarget ?? 0} kali</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-rose-400 font-bold block">{r.gangguanTmReal || 0}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {r.gangguanTmTarget || 0}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-rose-400 font-black">
                      {(targetRow?.gangguanTmReal ?? 0)} kali
                    </td>
                  </tr>

                  {/* Row 11: Kerusakan Peralatan */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      <span>Kerusakan Peralatan Distribusi</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">kali</td>
                    <td className="p-3 text-center text-slate-400">{targetRow?.kerusakanPeralatanTarget ?? 0} kali</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-orange-400 font-bold block">{r.kerusakanPeralatanReal || 0}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {r.kerusakanPeralatanTarget || 0}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-orange-400 font-black">
                      {(targetRow?.kerusakanPeralatanReal ?? 0)} kali
                    </td>
                  </tr>

                  {/* Row 12: MVOD */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-lime-400" />
                      <span>MVOD Sesuai Kewenangan</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">%</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.mvodTarget, 2)}%</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-lime-400 font-bold block">{formatComma(r.mvodUlp, 2)}%</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.mvodTarget, 2)}%</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-lime-400 font-black">
                      {formatComma(targetRow?.mvodUlp ?? 0, 2)}%
                    </td>
                  </tr>

                  {/* Row 13: MTTR Siaga 1 TM */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>MTTR Siaga 1 TM</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">menit</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.mttrSiaga1Target, 1)} m</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-indigo-400 font-bold block">{formatComma(r.mttrSiaga1Ulp, 1)}</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.mttrSiaga1Target, 1)}</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-indigo-400 font-black">
                      {formatComma(targetRow?.mttrSiaga1Ulp ?? 0, 1)} m
                    </td>
                  </tr>

                  {/* Row 14: Penambahan Aset RUPTL */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-pink-400" />
                      <span>Penambahan Aset RUPTL (%)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">%</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.asetRuptlTarget, 2)}%</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-pink-400 font-bold block">{formatComma(r.asetRuptlUlp, 2)}%</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.asetRuptlTarget, 2)}%</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-pink-400 font-black">
                      {formatComma(targetRow?.asetRuptlUlp ?? 0, 2)}%
                    </td>
                  </tr>

                  {/* Row 15: Penambahan Aset Investasi */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Penambahan Aset Fisik Investasi (%)</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">%</td>
                    <td className="p-3 text-center text-slate-400">{formatComma(targetRow?.asetInvestasiTarget, 2)}%</td>
                    {displayedData.map(r => (
                      <td key={r.month} className="p-3 text-center">
                        <span className="text-emerald-400 font-bold block">{formatComma(r.asetInvestasiUlp, 2)}%</span>
                        <span className="text-[9px] text-slate-500 block">Tgt: {formatComma(r.asetInvestasiTarget, 2)}%</span>
                      </td>
                    ))}
                    <td className="p-3 text-center text-emerald-400 font-black">
                      {formatComma(targetRow?.asetInvestasiUlp ?? 0, 2)}%
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          );
        })()}
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
