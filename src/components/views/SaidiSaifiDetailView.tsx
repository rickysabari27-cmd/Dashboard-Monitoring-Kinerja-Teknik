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
  AlertTriangle,
  Star,
  Sparkles,
  Percent
} from 'lucide-react';

interface SaidiSaifiDetailViewProps {
  isDarkMode: boolean;
  data: MonthlySaidiSaifiData[];
  onOpenInputSaidi: () => void;
  onUpdateSaidiRow?: (updatedRow: MonthlySaidiSaifiData) => void;
}

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const FULL_MONTH_NAMES: Record<string, string> = {
  Jan: 'Januari',
  Feb: 'Februari',
  Mar: 'Maret',
  Apr: 'April',
  Mei: 'Mei',
  Jun: 'Juni',
  Jul: 'Juli',
  Ags: 'Agustus',
  Sep: 'September',
  Okt: 'Oktober',
  Nov: 'November',
  Des: 'Desember'
};

const CURRENT_APP_YEAR = new Date().getFullYear();

// Build year options up to 2030 (2030 down to 2024)
const YEAR_OPTIONS = Array.from({ length: 2030 - 2024 + 1 }, (_, i) => 2030 - i).map(year => ({
  value: String(year),
  label: String(year)
}));

// Helper to match month names robustly
const matchMonth = (m1?: string, m2?: string) => {
  if (!m1 || !m2) return false;
  const s1 = m1.trim().toLowerCase();
  const s2 = m2.trim().toLowerCase();
  if (s1 === s2) return true;
  if ((s1 === 'jul' || s1 === 'juli') && (s2 === 'jul' || s2 === 'juli')) return true;
  if ((s1 === 'ags' || s1 === 'agustus' || s1 === 'agt') && (s2 === 'ags' || s2 === 'agustus' || s2 === 'agt')) return true;
  if ((s1 === 'jan' || s1 === 'januari') && (s2 === 'jan' || s2 === 'januari')) return true;
  if ((s1 === 'feb' || s1 === 'februari') && (s2 === 'feb' || s2 === 'februari')) return true;
  if ((s1 === 'mar' || s1 === 'maret') && (s2 === 'mar' || s2 === 'maret')) return true;
  if ((s1 === 'apr' || s1 === 'april') && (s2 === 'apr' || s2 === 'april')) return true;
  if ((s1 === 'mei' || s1 === 'may') && (s2 === 'mei' || s2 === 'may')) return true;
  if ((s1 === 'jun' || s1 === 'juni') && (s2 === 'jun' || s2 === 'juni')) return true;
  if ((s1 === 'sep' || s1 === 'september') && (s2 === 'sep' || s2 === 'september')) return true;
  if ((s1 === 'okt' || s1 === 'oktober') && (s2 === 'okt' || s2 === 'oktober')) return true;
  if ((s1 === 'nov' || s1 === 'november') && (s2 === 'nov' || s2 === 'november')) return true;
  if ((s1 === 'des' || s1 === 'desember') && (s2 === 'des' || s2 === 'desember')) return true;
  return s1.startsWith(s2) || s2.startsWith(s1);
};

// Interface for KPI Scoring
export interface KpiScoreResult {
  score: number; // 0 - 110
  scoreFormatted: string;
  status: 'optimal' | 'memenuhi' | 'perhatian' | 'kurang';
  badgeText: string;
  badgeBg: string;
  badgeTextCol: string;
  badgeBorder: string;
  predikat: string;
}

// Function to calculate KPI Score on 100% - 110% scale
// Polarity:
// - 'min' = Polaritas Negatif / Koefisien Negatif / Minimalkan / Semakin Kecil Semakin Baik:
//   (SAIDI, SAIFI, ENS, Susut Distribusi, Response Time, Feedback Rating Negatif, Jumlah Gangguan TM, Kerusakan Peralatan)
// - 'max' = Polaritas Positif / Koefisien Normal / Maksimalkan / Semakin Besar Semakin Baik:
//   (Success Rate Auto Dispatch, MVOD Sesuai Kewenangan, MTTR Siaga 1 TM, Penambahan Aset RUPTL, Penambahan Aset Fisik Investasi)
export const calculateKpiScore = (target: number, real: number, polarity: 'min' | 'max'): KpiScoreResult => {
  // If target & real are both 0
  if (target === 0 && real === 0) {
    return {
      score: 100,
      scoreFormatted: '100,00%',
      status: 'memenuhi',
      badgeText: '100,0%',
      badgeBg: 'bg-emerald-950/60',
      badgeTextCol: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/30',
      predikat: 'Standar Target (100%)'
    };
  }

  let score = 100;

  if (polarity === 'min') {
    // POLARITAS NEGATIF (Minimalkan - Semakin Kecil Semakin Baik)
    // Target adalah batas toleransi maksimum
    if (target <= 0) {
      if (real <= 0) {
        score = 110;
      } else {
        score = Math.max(0, 100 - real * 10);
      }
    } else {
      if (real <= target) {
        // Realisasi lebih baik / efisien (di bawah batas target) -> Skor 100% s/d 110%
        // Standar NKO PLN: ((2 * Target - Real) / Target) * 100%, dicap max 110%
        const calculated = ((2 * target - real) / target) * 100;
        score = Math.min(110, calculated);
      } else {
        // Realisasi melebihi batas toleransi target -> Skor turun proporsional di bawah 100%
        const calculated = ((2 * target - real) / target) * 100;
        score = Math.max(0, calculated);
      }
    }
  } else {
    // POLARITAS POSITIF (Maksimalkan - Semakin Besar Semakin Baik)
    // Target adalah sasaran minimal yang harus dicapai
    if (target <= 0) {
      score = real > 0 ? 110 : 100;
    } else {
      // Standar NKO PLN: (Real / Target) * 100%, dicap max 110% dan min 0%
      const ratio = (real / target) * 100;
      score = Math.min(110, Math.max(0, ratio));
    }
  }

  // Cap score to range [0, 110]
  score = Math.min(110, Math.max(0, score));

  let status: 'optimal' | 'memenuhi' | 'perhatian' | 'kurang' = 'memenuhi';
  let predikat = 'Memenuhi Target';
  let badgeBg = 'bg-teal-950/70';
  let badgeTextCol = 'text-teal-300';
  let badgeBorder = 'border-teal-500/40';

  if (score >= 109.9) {
    status = 'optimal';
    predikat = 'Istimewa / Optimal (110%)';
    badgeBg = 'bg-emerald-950/90';
    badgeTextCol = 'text-[#00f5a0]';
    badgeBorder = 'border-[#00f5a0]/60';
  } else if (score >= 100) {
    status = 'memenuhi';
    predikat = 'Memenuhi Target (100% - 109%)';
    badgeBg = 'bg-teal-950/70';
    badgeTextCol = 'text-teal-300';
    badgeBorder = 'border-teal-500/40';
  } else if (score >= 90) {
    status = 'perhatian';
    predikat = 'Perlu Perhatian (90% - 99%)';
    badgeBg = 'bg-amber-950/70';
    badgeTextCol = 'text-amber-300';
    badgeBorder = 'border-amber-500/40';
  } else {
    status = 'kurang';
    predikat = 'Kurang / Over Limit (< 90%)';
    badgeBg = 'bg-rose-950/70';
    badgeTextCol = 'text-rose-300';
    badgeBorder = 'border-rose-500/40';
  }

  const scoreFormatted = score.toFixed(2).replace('.', ',') + '%';
  const badgeText = `${score.toFixed(1).replace('.', ',')}%`;

  return {
    score: Number(score.toFixed(2)),
    scoreFormatted,
    status,
    badgeText,
    badgeBg,
    badgeTextCol,
    badgeBorder,
    predikat
  };
};

export const SaidiSaifiDetailView: React.FC<SaidiSaifiDetailViewProps> = ({
  isDarkMode,
  data,
  onOpenInputSaidi,
  onUpdateSaidiRow
}) => {
  // Filters & Display Unit Mode
  const [selectedYear, setSelectedYear] = useState<number>(() => CURRENT_APP_YEAR);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [matrixPeriod, setMatrixPeriod] = useState<'s1' | 's2' | 'all'>('all');
  const [chartMetric, setChartMetric] = useState<
    'susut' | 'saidi' | 'saifi' | 'ens' | 'ruptl' | 'investasi' | 'feedback' | 'response' | 'autodispatch' | 'gangguan' | 'kerusakan' | 'mvod' | 'mttr'
  >('susut');
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
    const d = (data || []).find(item => (item.year || CURRENT_APP_YEAR) === selectedYear && matchMonth(item.month, m));
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
    ? (enrichedYearData.find(d => matchMonth(d.month, selectedMonthFilter)) || enrichedYearData[0])
    : (
        [...enrichedYearData].reverse().find(d => 
          (d.saidiReal || 0) > 0 || (d.saifiReal || 0) > 0 || (d.ensLossJuta || 0) > 0 || 
          (d.saidiRealMenit || 0) > 0 || (d.asetInvestasiUlp || 0) > 0 || (d.susutPercentReal || 0) > 0 ||
          (d.saidiTarget || 0) > 0 || (d.saifiTarget || 0) > 0
        ) || enrichedYearData[enrichedYearData.length - 1]
      );

  // Susut Distribusi YTD
  const cumSusutTarget = latestRow ? latestRow.susutPercentTarget : 0;
  const cumSusutUp3 = latestRow ? latestRow.susutPercentUp3 : 0;
  const cumSusutReal = latestRow ? latestRow.susutPercentReal : 0;
  const diffSusutVsTarget = cumSusutTarget - cumSusutReal;
  const diffSusutVsUp3 = cumSusutUp3 - cumSusutReal;
  const isSusutOnTarget = cumSusutReal <= cumSusutTarget;

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

  // Calculate Scores (100% - 110%) for all 13 indicators on the current latestRow/Kumulatif
  const scoreSusut = calculateKpiScore(latestRow?.susutPercentTarget ?? 0, latestRow?.susutPercentReal ?? 0, 'min');
  const scoreSaidi = calculateKpiScore(latestRow?.saidiTargetMenit ?? 0, latestRow?.saidiRealMenit ?? 0, 'min');
  const scoreSaifi = calculateKpiScore(latestRow?.saifiTarget ?? 0, latestRow?.saifiReal ?? 0, 'min');
  const scoreEns = calculateKpiScore(latestRow?.ensMwhTarget ?? 0, latestRow?.ensMwhReal ?? 0, 'min');
  const scoreResponse = calculateKpiScore(latestRow?.responseTimeTarget ?? 0, latestRow?.responseTimeUlp ?? 0, 'min');
  const scoreFeedback = calculateKpiScore(latestRow?.feedbackRatingNegatifTarget ?? 0, latestRow?.feedbackRatingNegatifUlp ?? 0, 'min');
  const scoreAutoDispatch = calculateKpiScore(latestRow?.successRateAutoDispatchTarget ?? 0, latestRow?.successRateAutoDispatchUlp ?? 0, 'max');
  const scoreGangguan = calculateKpiScore(latestRow?.gangguanTmTarget ?? 0, latestRow?.gangguanTmReal ?? 0, 'min');
  const scoreKerusakan = calculateKpiScore(latestRow?.kerusakanPeralatanTarget ?? 0, latestRow?.kerusakanPeralatanReal ?? 0, 'min');
  const scoreMvod = calculateKpiScore(latestRow?.mvodTarget ?? 0, latestRow?.mvodUlp ?? 0, 'max');
  const scoreMttr = calculateKpiScore(latestRow?.mttrSiaga1Target ?? 0, latestRow?.mttrSiaga1Ulp ?? 0, 'max');
  const scoreRuptl = calculateKpiScore(latestRow?.asetRuptlTarget ?? 0, latestRow?.asetRuptlUlp ?? 0, 'max');
  const scoreInvestasi = calculateKpiScore(latestRow?.asetInvestasiTarget ?? 0, latestRow?.asetInvestasiUlp ?? 0, 'max');

  const allScoresList = [
    // 1. Susut
    { id: 1, category: 'Susut', name: 'Susut Distribusi Tanpa Emin', unit: '%', polarity: 'min' as const, target: latestRow?.susutPercentTarget ?? 0, real: latestRow?.susutPercentReal ?? 0, scoreObj: scoreSusut, icon: Zap, iconColor: 'text-cyan-400' },
    
    // 2. Keandalan Penyaluran Tenaga Listrik
    { id: 2, category: 'Keandalan Penyaluran Tenaga Listrik', name: 'SAIDI (Lama Padam Kumulatif)', unit: 'menit/plg', polarity: 'min' as const, target: latestRow?.saidiTargetMenit ?? 0, real: latestRow?.saidiRealMenit ?? 0, scoreObj: scoreSaidi, icon: Clock, iconColor: 'text-sky-400' },
    { id: 3, category: 'Keandalan Penyaluran Tenaga Listrik', name: 'SAIFI (Frekuensi Padam Kumulatif)', unit: 'kali/plg', polarity: 'min' as const, target: latestRow?.saifiTarget ?? 0, real: latestRow?.saifiReal ?? 0, scoreObj: scoreSaifi, icon: Zap, iconColor: 'text-[#00e5ff]' },
    { id: 4, category: 'Keandalan Penyaluran Tenaga Listrik', name: 'ENS (Energy Not Served Loss)', unit: 'MWh', polarity: 'min' as const, target: latestRow?.ensMwhTarget ?? 0, real: latestRow?.ensMwhReal ?? 0, scoreObj: scoreEns, icon: DollarSign, iconColor: 'text-amber-400' },
    
    // 3. Penyelesaian Eksekusi RUPTL dan Investasi
    { id: 5, category: 'Penyelesaian Eksekusi RUPTL dan Investasi', name: 'Penambahan Aset RUPTL', unit: '%', polarity: 'max' as const, target: latestRow?.asetRuptlTarget ?? 0, real: latestRow?.asetRuptlUlp ?? 0, scoreObj: scoreRuptl, icon: Target, iconColor: 'text-pink-400' },
    { id: 6, category: 'Penyelesaian Eksekusi RUPTL dan Investasi', name: 'Penambahan Aset Penyelesaian Fisik Investasi', unit: '%', polarity: 'max' as const, target: latestRow?.asetInvestasiTarget ?? 0, real: latestRow?.asetInvestasiUlp ?? 0, scoreObj: scoreInvestasi, icon: Award, iconColor: 'text-emerald-400' },
    
    // 4. Peningkatan Pelayanan Pelanggan
    { id: 7, category: 'Peningkatan Pelayanan Pelanggan', name: 'Feedback Rating Negatif pada PLN Mobile Gangguan', unit: 'kali', polarity: 'min' as const, target: latestRow?.feedbackRatingNegatifTarget ?? 0, real: latestRow?.feedbackRatingNegatifUlp ?? 0, scoreObj: scoreFeedback, icon: ShieldCheck, iconColor: 'text-purple-400' },
    { id: 8, category: 'Peningkatan Pelayanan Pelanggan', name: 'Response Time atas Gangguan (diluar Clear Tamper)', unit: 'menit', polarity: 'min' as const, target: latestRow?.responseTimeTarget ?? 0, real: latestRow?.responseTimeUlp ?? 0, scoreObj: scoreResponse, icon: Clock, iconColor: 'text-teal-400' },
    { id: 9, category: 'Peningkatan Pelayanan Pelanggan', name: 'Success Rate Auto Dispatch Gangguan Individual (diluar Clear Tamper)', unit: '%', polarity: 'max' as const, target: latestRow?.successRateAutoDispatchTarget ?? 0, real: latestRow?.successRateAutoDispatchUlp ?? 0, scoreObj: scoreAutoDispatch, icon: Target, iconColor: 'text-blue-400' },
    
    // 5. Keandalan JTM
    { id: 10, category: 'Keandalan JTM', name: 'Gangguan TM (sesuai kewenangan)', unit: 'kali', polarity: 'min' as const, target: latestRow?.gangguanTmTarget ?? 0, real: latestRow?.gangguanTmReal ?? 0, scoreObj: scoreGangguan, icon: Activity, iconColor: 'text-rose-400' },
    { id: 11, category: 'Keandalan JTM', name: 'Kerusakan Peralatan Distribusi (sesuai kewenangan)', unit: 'kali', polarity: 'min' as const, target: latestRow?.kerusakanPeralatanTarget ?? 0, real: latestRow?.kerusakanPeralatanReal ?? 0, scoreObj: scoreKerusakan, icon: AlertTriangle, iconColor: 'text-orange-400' },
    
    // 6. Emergency Response Time (ERT) Distribusi
    { id: 12, category: 'Emergency Response Time (ERT) Distribusi', name: 'MVOD (sesuai kewenangan)', unit: '%', polarity: 'max' as const, target: latestRow?.mvodTarget ?? 0, real: latestRow?.mvodUlp ?? 0, scoreObj: scoreMvod, icon: Zap, iconColor: 'text-lime-400' },
    { id: 13, category: 'Emergency Response Time (ERT) Distribusi', name: 'MTTR Siaga 1 TM (sesuai kewenangan)', unit: 'menit', polarity: 'max' as const, target: latestRow?.mttrSiaga1Target ?? 0, real: latestRow?.mttrSiaga1Ulp ?? 0, scoreObj: scoreMttr, icon: Clock, iconColor: 'text-indigo-400' }
  ];

  const totalScoreSum = allScoresList.reduce((acc, curr) => acc + curr.scoreObj.score, 0);
  const avgOverallScore = Number((totalScoreSum / allScoresList.length).toFixed(2));
  const countOptimal = allScoresList.filter(s => s.scoreObj.score >= 109.9).length;
  const countMemenuhi = allScoresList.filter(s => s.scoreObj.score >= 100 && s.scoreObj.score < 109.9).length;
  const countPerluPerhatian = allScoresList.filter(s => s.scoreObj.score < 100).length;

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
      case 'susut': return { target: 'susutPercentTarget', real: 'susutPercentReal', unit: '%', label: 'Susut Distribusi Tanpa Emin (%)' };
      case 'saidi': return { target: 'saidiTarget', real: 'saidiReal', unit: 'Jam/Plg', label: 'SAIDI (Lama Padam)' };
      case 'saifi': return { target: 'saifiTarget', real: 'saifiReal', unit: 'Kali/Plg', label: 'SAIFI (Frekuensi Padam)' };
      case 'ens': return { target: 'ensMwhTarget', real: 'ensMwhReal', unit: 'MWh', label: 'ENS (Energi Loss)' };
      case 'ruptl': return { target: 'asetRuptlTarget', real: 'asetRuptlUlp', unit: '%', label: 'Penambahan Aset RUPTL' };
      case 'investasi': return { target: 'asetInvestasiTarget', real: 'asetInvestasiUlp', unit: '%', label: 'Penambahan Aset Penyelesaian Fisik Investasi' };
      case 'feedback': return { target: 'feedbackRatingNegatifTarget', real: 'feedbackRatingNegatifUlp', unit: 'Kali', label: 'Feedback Rating Negatif pada PLN Mobile Gangguan' };
      case 'response': return { target: 'responseTimeTarget', real: 'responseTimeUlp', unit: 'Menit', label: 'Response Time atas Gangguan (diluar Clear Tamper)' };
      case 'autodispatch': return { target: 'successRateAutoDispatchTarget', real: 'successRateAutoDispatchUlp', unit: '%', label: 'Success Rate Auto Dispatch Gangguan Individual (diluar Clear Tamper)' };
      case 'gangguan': return { target: 'gangguanTmTarget', real: 'gangguanTmReal', unit: 'Kali', label: 'Gangguan TM (sesuai kewenangan)' };
      case 'kerusakan': return { target: 'kerusakanPeralatanTarget', real: 'kerusakanPeralatanReal', unit: 'Kali', label: 'Kerusakan Peralatan Distribusi (sesuai kewenangan)' };
      case 'mvod': return { target: 'mvodTarget', real: 'mvodUlp', unit: '%', label: 'MVOD (sesuai kewenangan)' };
      case 'mttr': return { target: 'mttrSiaga1Target', real: 'mttrSiaga1Ulp', unit: 'Menit', label: 'MTTR Siaga 1 TM (sesuai kewenangan)' };
      default: return { target: 'susutPercentTarget', real: 'susutPercentReal', unit: '%', label: 'Susut Distribusi Tanpa Emin' };
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
              options={YEAR_OPTIONS}
              activeColor="emerald"
            />
          </div>

          {/* Select Bulan Filter */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Bulan:</span>
            <CustomSelect
              value={selectedMonthFilter}
              onChange={(val) => setSelectedMonthFilter(val)}
              options={[
                { value: 'ALL', label: 'Pilih Bulan' },
                ...MONTH_ORDER.map(m => ({ value: m, label: `Bulan ${FULL_MONTH_NAMES[m] || m}` }))
              ]}
              activeColor="emerald"
            />
          </div>
        </div>
      </div>

      {/* BANNER EVALUASI & PENILAIAN SKOR KINERJA KPI (100% s.d. 110%) */}
      <div className="p-5 rounded-2xl border bg-gradient-to-br from-[#071326] via-[#0c1833] to-[#071326] border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-[#00f5a0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  EVALUASI PENILAIAN SKOR KINERJA KPI (100% s.d. 110%)
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#00f5a0] border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00f5a0]" />
                  Standar Capaian PLN
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Penilaian terukur realisasi terhadap target KPI (Batas Maksimal 110,00% untuk capaian istimewa/efisien).
              </p>
            </div>
          </div>

          {/* Average Overall Score Capsule */}
          <div className="flex items-center gap-3 bg-[#060c1a]/90 px-4 py-2.5 rounded-2xl border border-[#1b2b48] shadow-inner">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Total Rata-rata Skor KPI:
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {avgOverallScore >= 109.9 ? '🌟 Capaian Istimewa' : avgOverallScore >= 100 ? '✅ Memenuhi Target' : '⚠️ Perlu Perbaikan'}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${
                avgOverallScore >= 109.9 ? 'text-[#00f5a0]' : avgOverallScore >= 100 ? 'text-teal-300' : 'text-amber-400'
              }`}>
                {avgOverallScore.toFixed(2).replace('.', ',')}%
              </span>
              <span className="text-[11px] font-bold text-slate-500">/ 110%</span>
            </div>
          </div>
        </div>

        {/* Scoring Status Breakdown Pills & Progress Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-[#1a2944] relative z-10">
          <div className="p-3 rounded-xl bg-[#061022] border border-[#14233e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0]" />
              <span className="text-xs font-bold text-slate-300">Istimewa (110%)</span>
            </div>
            <span className="text-sm font-black text-[#00f5a0] px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
              {countOptimal} Indikator
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061022] border border-[#14233e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span className="text-xs font-bold text-slate-300">Memenuhi (100-109%)</span>
            </div>
            <span className="text-sm font-black text-teal-300 px-2 py-0.5 rounded-lg bg-teal-950/80 border border-teal-500/30">
              {countMemenuhi} Indikator
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061022] border border-[#14233e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-slate-300">Perhatian (&lt; 100%)</span>
            </div>
            <span className="text-sm font-black text-amber-400 px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/30">
              {countPerluPerhatian} Indikator
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061022] border border-[#14233e] flex flex-col justify-center">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Meter Penilaian (0 - 110%):</span>
              <span className="text-emerald-400 font-extrabold">{avgOverallScore.toFixed(1).replace('.', ',')}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-[#00f5a0] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (avgOverallScore / 110) * 100)}%` }}
              />
              {/* 100% Mark Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white/80" 
                style={{ left: `${(100 / 110) * 100}%` }}
                title="Batas Target 100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3-WAY COMPARISON CARDS GRID (Target KPI vs Realisasi KPI vs Realisasi ULP + Penilaian Skor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: SUSUT DISTRIBUSI TANPA EMIN */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between bg-[#0c1427] border-[#1c2942] shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span className="flex items-center gap-2 text-cyan-400 font-extrabold">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Susut Distribusi</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                isSusutOnTarget ? 'bg-emerald-950/60 text-[#00f5a0] border border-emerald-800/50' : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
              }`}>
                {isSusutOnTarget ? '✅ Memenuhi KPI' : '⚠️ Over Target'}
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
                  {formatComma(cumSusutTarget, 2)} %
                </span>
              </div>

              {/* Realisasi KPI UP3 */}
              <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1b2b46] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Realisasi KPI UP3:
                </span>
                <span className="font-black text-white">
                  {formatComma(cumSusutUp3, 2)} %
                </span>
              </div>

              {/* Realisasi ULP Baguala */}
              <div className="p-3 rounded-xl bg-[#052e2b] border border-[#0f5c53] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" /> Realisasi ULP Baguala:
                </span>
                <span className="text-base font-black text-[#00f5a0]">
                  {formatComma(cumSusutReal, 2)} %
                </span>
              </div>

              {/* Skor Penilaian 100% - 110% */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${scoreSusut.badgeBg} ${scoreSusut.badgeBorder}`}>
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#00f5a0]" /> Penilaian Skor KPI:
                </span>
                <span className={`font-black text-xs ${scoreSusut.badgeTextCol}`}>
                  {scoreSusut.scoreFormatted} ({scoreSusut.predikat.split('(')[0].trim()})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2942] text-[11px] flex justify-between text-slate-400 font-medium">
            <span>Vs Target: <strong className={diffSusutVsTarget >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSusutVsTarget >= 0 ? `-${formatComma(diffSusutVsTarget, 2)}%` : `+${formatComma(Math.abs(diffSusutVsTarget), 2)}%`}</strong></span>
            <span>Vs Real UP3: <strong className={diffSusutVsUp3 >= 0 ? 'text-[#00f5a0]' : 'text-slate-400'}>{diffSusutVsUp3 >= 0 ? `-${formatComma(diffSusutVsUp3, 2)}%` : `+${formatComma(Math.abs(diffSusutVsUp3), 2)}%`}</strong></span>
          </div>
        </div>

        {/* CARD 2: SAIDI (LAMA PADAM) */}
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

              {/* Skor Penilaian 100% - 110% */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${scoreSaidi.badgeBg} ${scoreSaidi.badgeBorder}`}>
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#00f5a0]" /> Penilaian Skor KPI:
                </span>
                <span className={`font-black text-xs ${scoreSaidi.badgeTextCol}`}>
                  {scoreSaidi.scoreFormatted} ({scoreSaidi.predikat.split('(')[0].trim()})
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

              {/* Skor Penilaian 100% - 110% */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${scoreSaifi.badgeBg} ${scoreSaifi.badgeBorder}`}>
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#00f5a0]" /> Penilaian Skor KPI:
                </span>
                <span className={`font-black text-xs ${scoreSaifi.badgeTextCol}`}>
                  {scoreSaifi.scoreFormatted} ({scoreSaifi.predikat.split('(')[0].trim()})
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

              {/* Skor Penilaian 100% - 110% */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${scoreEns.badgeBg} ${scoreEns.badgeBorder}`}>
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#00f5a0]" /> Penilaian Skor KPI:
                </span>
                <span className={`font-black text-xs ${scoreEns.badgeTextCol}`}>
                  {scoreEns.scoreFormatted} ({scoreEns.predikat.split('(')[0].trim()})
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

      {/* MULTI-SERIES RECHARTS: COMPARISON CHART (TARGET VS ULP) */}
      <div className="p-5 rounded-2xl border bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00f5a0]" />
              GRAFIK TREN TARGET VS REALISASI KPI ULP {selectedYear}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual perbandingan target korporat vs realisasi bulanan untuk menganalisis deviasi kinerja KPI ULP Baguala {selectedYear}
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
              <optgroup label="1. Susut" className="text-slate-400 bg-[#0c1427]">
                <option value="susut" className="text-emerald-300">Susut Distribusi Tanpa Emin (%)</option>
              </optgroup>

              <optgroup label="2. Keandalan Penyaluran Tenaga Listrik" className="text-slate-400 bg-[#0c1427]">
                <option value="saidi" className="text-emerald-300">SAIDI (Lama Padam - Jam/Plg)</option>
                <option value="saifi" className="text-emerald-300">SAIFI (Frekuensi Padam - Kali/Plg)</option>
                <option value="ens" className="text-emerald-300">ENS (Energi Loss - MWh)</option>
              </optgroup>

              <optgroup label="3. Penyelesaian Eksekusi RUPTL dan Investasi" className="text-slate-400 bg-[#0c1427]">
                <option value="ruptl" className="text-emerald-300">Penambahan Aset RUPTL (%)</option>
                <option value="investasi" className="text-emerald-300">Penambahan Aset Penyelesaian Fisik Investasi (%)</option>
              </optgroup>

              <optgroup label="4. Peningkatan Pelayanan Pelanggan" className="text-slate-400 bg-[#0c1427]">
                <option value="feedback" className="text-emerald-300">Feedback Rating Negatif pada PLN Mobile Gangguan (Kali)</option>
                <option value="response" className="text-emerald-300">Response Time atas Gangguan (diluar Clear Tamper) (Menit)</option>
                <option value="autodispatch" className="text-emerald-300">Success Rate Auto Dispatch Gangguan Individual (diluar Clear Tamper) (%)</option>
              </optgroup>

              <optgroup label="5. Keandalan JTM" className="text-slate-400 bg-[#0c1427]">
                <option value="gangguan" className="text-emerald-300">Gangguan TM (sesuai kewenangan) (Kali)</option>
                <option value="kerusakan" className="text-emerald-300">Kerusakan Peralatan Distribusi (sesuai kewenangan) (Kali)</option>
              </optgroup>

              <optgroup label="6. Emergency Response Time (ERT) Distribusi" className="text-slate-400 bg-[#0c1427]">
                <option value="mvod" className="text-emerald-300">MVOD (sesuai kewenangan) (%)</option>
                <option value="mttr" className="text-emerald-300">MTTR Siaga 1 TM (sesuai kewenangan) (Menit)</option>
              </optgroup>
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

      {/* SCORECARD LENGKAP PENILAIAN 13 INDIKATOR KINERJA KPI (100% s.d. 110%) */}
      <div className="p-5 rounded-2xl border bg-[#0c1427] border-[#1c2942] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-[#00f5a0]" />
              SCORECARD PENILAIAN INDIKATOR KINERJA KPI (ULP BAGUALA {selectedYear})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian kalkulasi skor penilaian 100% - 110% seluruh indikator terhadap target batas operasional PLN
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Periode:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#070c19] text-[#00f5a0] text-xs font-black border border-[#1b2b48]">
              {selectedMonthFilter === 'ALL' ? 'Kumulatif Berjalan (YTD)' : `Bulan ${selectedMonthFilter} ${selectedYear}`}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs divide-y divide-[#1c2942]">
            <thead className="bg-[#070c19] text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-3 text-center w-12">No</th>
                <th className="p-3">Indikator Kinerja KPI</th>
                <th className="p-3 text-center">Polaritas</th>
                <th className="p-3 text-center">Target</th>
                <th className="p-3 text-center text-white">Realisasi ULP</th>
                <th className="p-3 text-center text-slate-400">Deviasi</th>
                <th className="p-3 text-center text-[#00f5a0]">Skor Penilaian (100% - 110%)</th>
                <th className="p-3 text-center">Meter Capaian</th>
                <th className="p-3 text-center">Predikat Kinerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2942] font-semibold text-slate-200">
              {allScoresList.map((item, idx) => {
                const isNewCategory = idx === 0 || allScoresList[idx - 1].category !== item.category;
                const IconComp = item.icon;
                const diff = item.polarity === 'min' ? (item.target - item.real) : (item.real - item.target);
                const isBetter = diff >= 0;
                
                return (
                  <React.Fragment key={item.id}>
                    {isNewCategory && (
                      <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                        <td colSpan={9} className="py-2.5 px-3.5 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                            <span>{item.category}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-[#111c38]/50 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <IconComp className={`w-3.5 h-3.5 ${item.iconColor}`} />
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({item.unit})</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                          item.polarity === 'min' 
                            ? 'bg-sky-950/60 text-sky-400 border border-sky-800/40' 
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        }`}>
                          {item.polarity === 'min' ? '🔻 Negatif (Minimalkan)' : '🔺 Normal (Maksimalkan)'}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-400 font-bold">
                        {formatComma(item.target, item.unit === '%' ? 2 : item.unit === 'MWh' ? 3 : 1)} {item.unit}
                      </td>
                      <td className="p-3 text-center font-black text-white">
                        {formatComma(item.real, item.unit === '%' ? 2 : item.unit === 'MWh' ? 3 : 1)} {item.unit}
                      </td>
                      <td className="p-3 text-center text-xs font-bold">
                        <span className={isBetter ? 'text-[#00f5a0]' : 'text-rose-400'}>
                          {isBetter ? '+' : ''}{formatComma(diff, 2)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-black ${item.scoreObj.badgeBg} ${item.scoreObj.badgeTextCol} border ${item.scoreObj.badgeBorder}`}>
                          {item.scoreObj.score >= 109.9 && <Star className="w-3 h-3 text-[#00f5a0]" />}
                          {item.scoreObj.scoreFormatted}
                        </span>
                      </td>
                      <td className="p-3 text-center w-36">
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-500 to-[#00f5a0] rounded-full"
                            style={{ width: `${Math.min(100, (item.scoreObj.score / 110) * 100)}%` }}
                          />
                          <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: `${(100 / 110) * 100}%` }} />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black block whitespace-nowrap ${
                          item.scoreObj.status === 'optimal' 
                            ? 'bg-emerald-950 text-[#00f5a0] border border-[#00f5a0]/40' 
                            : item.scoreObj.status === 'memenuhi'
                              ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                              : item.scoreObj.status === 'perhatian'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        }`}>
                          {item.scoreObj.predikat}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
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

          const displayedData = matrixMonths.map(m => enrichedYearData.find(d => matchMonth(d.month, m)) || enrichedYearData[0]);
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
                    <th className="p-3 text-center text-white">Kumulatif / Akhir</th>
                    <th className="p-3 text-center text-[#00f5a0]">Skor Penilaian (100% - 110%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2942] font-semibold text-slate-200">
                  
                  {/* CATEGORY 1: SUSUT */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>1. Susut</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: Susut % */}
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreSusut.badgeBg} ${scoreSusut.badgeTextCol} border ${scoreSusut.badgeBorder}`}>
                        {scoreSusut.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* CATEGORY 2: KEANDALAN PENYALURAN TENAGA LISTRIK */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>2. Keandalan Penyaluran Tenaga Listrik</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: SAIDI (Menit/Plg) */}
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreSaidi.badgeBg} ${scoreSaidi.badgeTextCol} border ${scoreSaidi.badgeBorder}`}>
                        {scoreSaidi.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: SAIDI (Jam/Plg) */}
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreSaidi.badgeBg} ${scoreSaidi.badgeTextCol} border ${scoreSaidi.badgeBorder}`}>
                        {scoreSaidi.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: SAIFI */}
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreSaifi.badgeBg} ${scoreSaifi.badgeTextCol} border ${scoreSaifi.badgeBorder}`}>
                        {scoreSaifi.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: ENS Loss MWh */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>ENS (Energi Loss - MWh)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreEns.badgeBg} ${scoreEns.badgeTextCol} border ${scoreEns.badgeBorder}`}>
                        {scoreEns.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* CATEGORY 3: PENYELESAIAN EKSEKUSI RUPTL DAN INVESTASI */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>3. Penyelesaian Eksekusi RUPTL dan Investasi</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: Penambahan Aset RUPTL */}
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreRuptl.badgeBg} ${scoreRuptl.badgeTextCol} border ${scoreRuptl.badgeBorder}`}>
                        {scoreRuptl.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: Penambahan Aset Investasi */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Penambahan Aset Penyelesaian Fisik Investasi (%)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreInvestasi.badgeBg} ${scoreInvestasi.badgeTextCol} border ${scoreInvestasi.badgeBorder}`}>
                        {scoreInvestasi.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* CATEGORY 4: PENINGKATAN PELAYANAN PELANGGAN */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>4. Peningkatan Pelayanan Pelanggan</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: Feedback Rating Negatif */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Feedback Rating Negatif pada PLN Mobile Gangguan</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreFeedback.badgeBg} ${scoreFeedback.badgeTextCol} border ${scoreFeedback.badgeBorder}`}>
                        {scoreFeedback.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: Response Time */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>Response Time atas Gangguan (diluar Clear Tamper)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreResponse.badgeBg} ${scoreResponse.badgeTextCol} border ${scoreResponse.badgeBorder}`}>
                        {scoreResponse.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: Success Rate Auto Dispatch */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      <span>Success Rate Auto Dispatch Gangguan Individual (diluar Clear Tamper)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreAutoDispatch.badgeBg} ${scoreAutoDispatch.badgeTextCol} border ${scoreAutoDispatch.badgeBorder}`}>
                        {scoreAutoDispatch.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* CATEGORY 5: KEANDALAN JTM */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>5. Keandalan JTM</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: Gangguan TM */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>Gangguan TM (sesuai kewenangan)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreGangguan.badgeBg} ${scoreGangguan.badgeTextCol} border ${scoreGangguan.badgeBorder}`}>
                        {scoreGangguan.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: Kerusakan Peralatan */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      <span>Kerusakan Peralatan Distribusi (sesuai kewenangan)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreKerusakan.badgeBg} ${scoreKerusakan.badgeTextCol} border ${scoreKerusakan.badgeBorder}`}>
                        {scoreKerusakan.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* CATEGORY 6: EMERGENCY RESPONSE TIME (ERT) DISTRIBUSI */}
                  <tr className="bg-[#091326] border-t-2 border-b border-[#1f3150]">
                    <td colSpan={matrixMonths.length + 5} className="py-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full inline-block" />
                        <span>6. Emergency Response Time (ERT) Distribusi</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row: MVOD */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-lime-400" />
                      <span>MVOD (sesuai kewenangan) (%)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreMvod.badgeBg} ${scoreMvod.badgeTextCol} border ${scoreMvod.badgeBorder}`}>
                        {scoreMvod.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                  {/* Row: MTTR Siaga 1 TM */}
                  <tr className="hover:bg-[#111c38]/50">
                    <td className="p-3 font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>MTTR Siaga 1 TM (sesuai kewenangan)</span>
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
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${scoreMttr.badgeBg} ${scoreMttr.badgeTextCol} border ${scoreMttr.badgeBorder}`}>
                        {scoreMttr.scoreFormatted}
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

    </div>
  );
};
