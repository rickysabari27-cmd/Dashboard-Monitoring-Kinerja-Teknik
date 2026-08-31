import React, { useState, useMemo } from 'react';
import { 
  ViewMode, 
  FeederTrip, 
  MonthlySaidiSaifiData, 
  SpkTask, 
  GarduMeasurement, 
  MasterFeeder, 
  MasterSection, 
  MasterGarduHubung, 
  MasterGarduDistribusi, 
  MasterPemutus, 
  MaterialItem, 
  ApdTool, 
  Vehicle, 
  InspectionRecord, 
  RowTreeLocation,
  WhatsAppMessage
} from '../../types';
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
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Wrench, 
  Radio, 
  Cpu, 
  HardHat, 
  Flame, 
  Send, 
  PlusCircle, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  SlidersHorizontal,
  Calendar,
  TreePine,
  Search,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { matchFeederName, getHealthCategory } from './HealthIndexView';

interface MainDashboardViewProps {
  isDarkMode: boolean;
  setCurrentView: (view: ViewMode) => void;
  // Datasets
  trips: FeederTrip[];
  monthlySaidiData: MonthlySaidiSaifiData[];
  spkList: SpkTask[];
  garduMeasurements: GarduMeasurement[];
  masterFeeders: MasterFeeder[];
  masterSections: MasterSection[];
  masterGarduHubung: MasterGarduHubung[];
  masterGarduDistribusi: MasterGarduDistribusi[];
  masterPemutus: MasterPemutus[];
  materials: MaterialItem[];
  apdTools: ApdTool[];
  vehicles: Vehicle[];
  inspections: InspectionRecord[];
  rowTrees: RowTreeLocation[];
  whatsAppMessages?: WhatsAppMessage[];
  // Action Handlers
  onOpenInputGangguan: () => void;
  onOpenUniversalInput: (tab?: string) => void;
  onOpenWhatsAppModal: (trip?: FeederTrip, category?: string) => void;
  onEditTrip?: (trip: FeederTrip) => void;
}

// Robust date matching helper function
export const isDateInPeriod = (dateStr?: string, targetYear = 'ALL', targetMonth = 'ALL'): boolean => {
  if (!dateStr) return false;
  const str = String(dateStr).trim();
  if (!str) return false;

  // 1. Format: YYYY-MM-DD or YYYY/MM/DD or ISO string
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    if (targetYear !== 'ALL' && year !== targetYear) return false;
    if (targetMonth !== 'ALL' && month !== targetMonth) return false;
    return true;
  }

  // 2. Format: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^\d{1,2}[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const month = dmyMatch[1].padStart(2, '0');
    const year = dmyMatch[2];
    if (targetYear !== 'ALL' && year !== targetYear) return false;
    if (targetMonth !== 'ALL' && month !== targetMonth) return false;
    return true;
  }

  // 3. Fallback contains checks
  if (targetYear !== 'ALL' && !str.includes(targetYear)) return false;
  if (targetMonth !== 'ALL') {
    const padded = targetMonth.padStart(2, '0');
    const matchPatterns = [`-${padded}-`, `/${padded}/`, `-${padded}`, `/${padded}`];
    const matched = matchPatterns.some(p => str.includes(p));
    if (!matched) return false;
  }

  return true;
};

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  isDarkMode,
  setCurrentView,
  trips,
  monthlySaidiData,
  spkList,
  garduMeasurements,
  masterFeeders,
  masterSections,
  masterGarduHubung,
  masterGarduDistribusi,
  masterPemutus,
  materials,
  apdTools,
  vehicles,
  inspections,
  rowTrees,
  whatsAppMessages = [],
  onOpenInputGangguan,
  onOpenUniversalInput,
  onOpenWhatsAppModal,
  onEditTrip
}) => {
  // Global Period Filters for Dashboard
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [feederSearchQuery, setFeederSearchQuery] = useState<string>('');

  const monthsList = [
    { value: 'ALL', label: 'Semua Bulan (YTD)', short: 'YTD' },
    { value: '01', label: 'Januari', short: 'Jan' },
    { value: '02', label: 'Februari', short: 'Feb' },
    { value: '03', label: 'Maret', short: 'Mar' },
    { value: '04', label: 'April', short: 'Apr' },
    { value: '05', label: 'Mei', short: 'Mei' },
    { value: '06', label: 'Juni', short: 'Jun' },
    { value: '07', label: 'Juli', short: 'Jul' },
    { value: '08', label: 'Agustus', short: 'Ags' },
    { value: '09', label: 'September', short: 'Sep' },
    { value: '10', label: 'Oktober', short: 'Okt' },
    { value: '11', label: 'November', short: 'Nov' },
    { value: '12', label: 'Desember', short: 'Des' }
  ];

  const currentMonthItem = monthsList.find(m => m.value === selectedMonth) || monthsList[0];
  const selectedMonthLabel = currentMonthItem.label;
  const isMonthFiltered = selectedMonth !== 'ALL';

  // Fallback Total ULP Customers
  const defaultTotalUlp = useMemo(() => {
    const sumFeeders = (masterFeeders || []).reduce((acc, f) => acc + (f.totalCustomers || 0), 0);
    return sumFeeders > 0 ? sumFeeders : 68750;
  }, [masterFeeders]);

  // 1. Filtered Trips based on selected Year and Month
  const filteredTrips = useMemo(() => {
    return (trips || []).filter(trip => isDateInPeriod(trip.tripDate, selectedYear, selectedMonth));
  }, [trips, selectedYear, selectedMonth]);

  // 2. Filtered SPK based on selected Year and Month
  const filteredSpkList = useMemo(() => {
    return (spkList || []).filter(spk => isDateInPeriod(spk.date, selectedYear, selectedMonth));
  }, [spkList, selectedYear, selectedMonth]);

  // 3. Filtered Inspections based on selected Year and Month
  const filteredInspections = useMemo(() => {
    return (inspections || []).filter(insp => isDateInPeriod(insp.date, selectedYear, selectedMonth));
  }, [inspections, selectedYear, selectedMonth]);

  // 4. Filtered Gardu Measurements based on selected Year and Month
  const filteredGarduMeasurements = useMemo(() => {
    return (garduMeasurements || []).filter(g => isDateInPeriod(g.date, selectedYear, selectedMonth));
  }, [garduMeasurements, selectedYear, selectedMonth]);

  // Target SAIDI & SAIFI for the selected period
  const currentPeriodTargets = useMemo(() => {
    if (selectedMonth === 'ALL') {
      return {
        saidiTarget: 72.412,
        saifiTarget: 1.32,
        targetLabel: 'Target YTD 2026'
      };
    }
    const monthIndex = parseInt(selectedMonth, 10) - 1;
    const monthShorts = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'ags', 'sep', 'okt', 'nov', 'des'];
    const shortCode = monthShorts[monthIndex];
    const foundData = (monthlySaidiData || []).find(s => {
      const yearMatch = !s.year || s.year.toString() === selectedYear;
      const monthMatch = s.month.toLowerCase().startsWith(shortCode);
      return yearMatch && monthMatch;
    });

    return {
      saidiTarget: foundData ? foundData.saidiTarget : 6.0,
      saifiTarget: foundData ? foundData.saifiTarget : 0.11,
      targetLabel: `Target ${selectedMonthLabel}`
    };
  }, [selectedMonth, selectedYear, monthlySaidiData, selectedMonthLabel]);

  // Aggregate Key Performance Indicators (Directly from Filtered Trips)
  const kpiStats = useMemo(() => {
    const totalTripsCount = filteredTrips.length;
    
    let totalSaidiHours = 0;
    let totalSaifiCount = 0;
    let totalEnsKwh = 0;
    let totalFinancialLoss = 0;
    let totalDurationMinutes = 0;
    let totalCustomersAffected = 0;

    filteredTrips.forEach(t => {
      const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
      const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
      
      totalSaidiHours += (saidi || 0);
      totalSaifiCount += (saifi || 0);
      totalEnsKwh += (t.ensKwh || 0);
      totalFinancialLoss += (t.financialLossIdr || (t.ensKwh ? t.ensKwh * 1444.7 : 0));
      totalDurationMinutes += (t.durationMinutes || 0);
      totalCustomersAffected += (t.affectedCustomers || 0);
    });

    const avgDurationPerTrip = totalTripsCount > 0 ? (totalDurationMinutes / totalTripsCount) : 0;

    return {
      totalTripsCount,
      totalSaidiHours,
      totalSaifiCount,
      totalEnsKwh,
      totalFinancialLoss,
      totalDurationMinutes,
      totalCustomersAffected,
      avgDurationPerTrip
    };
  }, [filteredTrips, defaultTotalUlp]);

  // Master Assets Stats
  const assetStats = useMemo(() => {
    const totalFeeders = masterFeeders.length;
    const totalLengthKm = masterFeeders.reduce((acc, f) => acc + (f.lengthKm || 0), 0);
    const totalCustomers = masterFeeders.reduce((acc, f) => acc + (f.totalCustomers || 0), 0) || defaultTotalUlp;
    const totalPowerMva = masterFeeders.reduce((acc, f) => acc + (f.capacityMva || 0), 0);
    
    const totalGh = masterGarduHubung.length;
    const totalGd = masterGarduDistribusi.length;
    const totalGdKva = masterGarduDistribusi.reduce((acc, g) => acc + (g.capacityKva || 0), 0);

    const totalPemutus = masterPemutus.length;
    const totalPmcb = masterPemutus.filter(p => p.equipmentType === 'PMCB').length;
    const totalRecloser = masterPemutus.filter(p => p.equipmentType === 'Recloser').length;
    const totalLbs = masterPemutus.filter(p => p.equipmentType && p.equipmentType.includes('LBS')).length;
    const totalPmt = masterPemutus.filter(p => p.equipmentType === 'PMT' || p.equipmentType === 'PMT GI').length;
    const totalFco = masterPemutus.filter(p => p.equipmentType === 'FCO' || p.equipmentType === 'SSO').length;
    const totalScada = masterPemutus.filter(p => p.scadaStatus === 'Terhubung SCADA').length;
    const scadaPercent = totalPemutus > 0 ? Math.round((totalScada / totalPemutus) * 100) : 0;

    return {
      totalFeeders,
      totalLengthKm,
      totalCustomers,
      totalPowerMva,
      totalGh,
      totalGd,
      totalGdKva,
      totalPemutus,
      totalPmcb,
      totalRecloser,
      totalLbs,
      totalPmt,
      totalFco,
      totalScada,
      scadaPercent
    };
  }, [masterFeeders, masterGarduHubung, masterGarduDistribusi, masterPemutus, defaultTotalUlp]);

  // Feeder Health Breakdown for the Selected Month / Period
  const feederHealthList = useMemo(() => {
    return masterFeeders.map(feeder => {
      const feederTrips = filteredTrips.filter(t => matchFeederName(t.feederName, feeder.feederName));
      const tripCount = feederTrips.length;
      const saidiContrib = feederTrips.reduce((acc, t) => {
        const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
        return acc + (saidi || 0);
      }, 0);
      const ensKwh = feederTrips.reduce((acc, t) => acc + (t.ensKwh || 0), 0);
      const categoryInfo = getHealthCategory(tripCount);

      // 100-point Health Score Formula for Selected Month
      let score = 100 - (tripCount * 15) - (saidiContrib * 20);
      if (score < 10) score = 10;
      if (tripCount === 0) score = 100;

      return {
        id: feeder.id,
        name: feeder.feederName,
        code: feeder.feederCode,
        substation: feeder.substation,
        lengthKm: feeder.lengthKm || 0,
        customers: feeder.totalCustomers || 0,
        tripCount,
        saidiContrib,
        ensKwh,
        healthScore: Math.round(score),
        categoryInfo
      };
    });
  }, [masterFeeders, filteredTrips, defaultTotalUlp]);

  // Overall Health Summary for the Selected Month / Period
  const overallHealthSummary = useMemo(() => {
    const total = feederHealthList.length;
    if (total === 0) return { avgScore: 100, sempurna: 0, sehat: 0, sakit: 0, kronis: 0 };

    const sumScore = feederHealthList.reduce((acc, f) => acc + f.healthScore, 0);
    const avgScore = Math.round(sumScore / total);

    const sempurna = feederHealthList.filter(f => f.categoryInfo.category === 'SEMPURNA').length;
    const sehat = feederHealthList.filter(f => f.categoryInfo.category === 'SEHAT').length;
    const sakit = feederHealthList.filter(f => f.categoryInfo.category === 'SAKIT').length;
    const kronis = feederHealthList.filter(f => f.categoryInfo.category === 'KRONIS').length;

    return { avgScore, sempurna, sehat, sakit, kronis };
  }, [feederHealthList]);

  // Top 5 Vulnerable Feeders for the Selected Month / Period
  const topWorstFeeders = useMemo(() => {
    return [...feederHealthList]
      .sort((a, b) => b.tripCount - a.tripCount || b.saidiContrib - a.saidiContrib)
      .slice(0, 5);
  }, [feederHealthList]);

  // Monthly Trip Breakdown Chart Data (Jan - Dec)
  const monthlyTripChartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return monthNames.map((name, idx) => {
      const mNum = (idx + 1).toString().padStart(2, '0');
      const tripsInMonth = (trips || []).filter(t => {
        const d = t.tripDate || '';
        return isDateInPeriod(d, selectedYear, mNum);
      });

      // Find monthly SAIDI real data if available
      const saidiItem = (monthlySaidiData || []).find(s => {
        const matchY = !s.year || s.year.toString() === selectedYear;
        const matchM = s.month.toLowerCase().startsWith(name.toLowerCase().slice(0, 3));
        return matchY && matchM;
      });

      return {
        month: name,
        monthCode: mNum,
        trips: tripsInMonth.length,
        saidiReal: saidiItem ? saidiItem.saidiReal : (tripsInMonth.length * 0.05),
        saidiTarget: saidiItem ? saidiItem.saidiTarget : 0.150,
        ensLoss: tripsInMonth.reduce((acc, t) => acc + (t.ensKwh || 0), 0),
        isSelected: selectedMonth === mNum
      };
    });
  }, [trips, selectedYear, selectedMonth, monthlySaidiData]);

  // Fault Cause Classification Pareto based on Filtered Trips
  const faultCausesData = useMemo(() => {
    const counts: Record<string, { label: string; count: number; color: string }> = {
      'E-1': { label: 'Pohon / ROW (E-1)', count: 0, color: '#10B981' },
      'I-1': { label: 'Komponen JTM (I-1)', count: 0, color: '#2563EB' },
      'I-2': { label: 'Peralatan JTM (I-2)', count: 0, color: '#0284C7' },
      'I-4': { label: 'Tiang / Konstruksi (I-4)', count: 0, color: '#E11D48' },
      'E-2': { label: 'Bencana Alam / Cuaca (E-2)', count: 0, color: '#F59E0B' },
      'E-3': { label: 'Binatang / Hewan (E-3)', count: 0, color: '#9333EA' },
      'E-4': { label: 'Sesaat / Tdk Ditemukan (E-4)', count: 0, color: '#64748B' },
      'OTHER': { label: 'Lain-lain / Investigasi', count: 0, color: '#475569' }
    };

    filteredTrips.forEach(t => {
      const cat = (t.category || '').toUpperCase();
      if (cat.includes('E-1') || cat.includes('POHON') || cat.includes('ROW') || cat.includes('TREE')) {
        counts['E-1'].count += 1;
      } else if (cat.includes('I-1') || cat.includes('KOMPONEN')) {
        counts['I-1'].count += 1;
      } else if (cat.includes('I-2') || cat.includes('PERALATAN')) {
        counts['I-2'].count += 1;
      } else if (cat.includes('I-4') || cat.includes('TIANG')) {
        counts['I-4'].count += 1;
      } else if (cat.includes('E-2') || cat.includes('BENCANA') || cat.includes('PETIR') || cat.includes('LIGHTNING')) {
        counts['E-2'].count += 1;
      } else if (cat.includes('E-3') || cat.includes('BINATANG') || cat.includes('ANIMAL')) {
        counts['E-3'].count += 1;
      } else if (cat.includes('E-4') || cat.includes('SESAAT') || cat.includes('TIDAK DITEMUKAN')) {
        counts['E-4'].count += 1;
      } else {
        counts['OTHER'].count += 1;
      }
    });

    return Object.values(counts).filter(c => c.count > 0);
  }, [filteredTrips]);

  // SPK & Maintenance Operations Summary (Filtered by Month if available, else active list)
  const spkStats = useMemo(() => {
    const listToUse = filteredSpkList.length > 0 ? filteredSpkList : (selectedMonth === 'ALL' ? spkList : []);
    const total = listToUse.length;
    const dalamProses = listToUse.filter(s => (s.status || '').toLowerCase().includes('proses') || (s.status || '').toLowerCase().includes('progress')).length;
    const selesai = listToUse.filter(s => (s.status || '').toLowerCase().includes('selesai') || (s.status || '').toLowerCase().includes('done')).length;
    const draft = listToUse.filter(s => (s.status || '').toLowerCase().includes('draft')).length;
    const urgent = listToUse.filter(s => (s.priority || '').toLowerCase().includes('urgent') || (s.priority || '').toLowerCase().includes('tinggi')).length;

    return { total, dalamProses, selesai, draft, urgent, list: listToUse };
  }, [filteredSpkList, spkList, selectedMonth]);

  // Inspections & ROW Stats (Filtered by Month if available)
  const inspectionStats = useMemo(() => {
    const listToUse = filteredInspections.length > 0 ? filteredInspections : (selectedMonth === 'ALL' ? inspections : []);
    const totalInsp = listToUse.length;
    const openInsp = listToUse.filter(i => i.status === 'Open').length;
    const heavyInsp = listToUse.filter(i => i.category === 'Berat').length;
    
    const totalRow = rowTrees.length;
    const perluPangkas = rowTrees.filter(r => r.status === 'Perlu Pangkas').length;
    const highPriorityRow = rowTrees.filter(r => r.priority === 'Tinggi').length;

    return { totalInsp, openInsp, heavyInsp, totalRow, perluPangkas, highPriorityRow };
  }, [filteredInspections, inspections, rowTrees, selectedMonth]);

  // Gardu Measurements & Transformer Load Stats (Filtered by Month if available)
  const garduStats = useMemo(() => {
    const listToUse = filteredGarduMeasurements.length > 0 ? filteredGarduMeasurements : (selectedMonth === 'ALL' ? garduMeasurements : []);
    const totalMeasured = listToUse.length;
    let overloadCount = 0; // >100%
    let warningCount = 0;  // 80% - 100%
    let normalCount = 0;   // <80%
    let unbalanceCount = 0; // unbalance > 20%

    listToUse.forEach(g => {
      const maxCurrent = Math.max(g.currentR || 0, g.currentS || 0, g.currentT || 0);
      const cap = g.capacityKva || 100;
      const inNominal = (cap / 0.6928) || 144;
      const loadPercent = (maxCurrent / inNominal) * 100;

      if (loadPercent > 100) overloadCount++;
      else if (loadPercent >= 80) warningCount++;
      else normalCount++;

      const avg = ((g.currentR || 0) + (g.currentS || 0) + (g.currentT || 0)) / 3;
      if (avg > 0) {
        const diffMax = Math.max(
          Math.abs((g.currentR || 0) - avg),
          Math.abs((g.currentS || 0) - avg),
          Math.abs((g.currentT || 0) - avg)
        );
        if ((diffMax / avg) * 100 > 20) unbalanceCount++;
      }
    });

    return { totalMeasured, overloadCount, warningCount, normalCount, unbalanceCount };
  }, [filteredGarduMeasurements, garduMeasurements, selectedMonth]);

  // Logistics & Tools Readiness
  const logisticsStats = useMemo(() => {
    const totalMats = materials.length;
    const lowStockMats = materials.filter(m => m.stock <= m.minStock).length;
    
    const totalApd = apdTools.length;
    const goodApd = apdTools.filter(a => a.condition === 'Baik').length;
    const apdReadyPercent = totalApd > 0 ? Math.round((goodApd / totalApd) * 100) : 100;

    const totalVehicles = vehicles.length;
    const readyVehicles = vehicles.filter(v => v.status === 'Tersedia' || v.status === 'Operasi').length;

    return { totalMats, lowStockMats, totalApd, apdReadyPercent, totalVehicles, readyVehicles };
  }, [materials, apdTools, vehicles]);

  // Currency Formatter
  const formatRupiah = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(2)} M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filtered feeder health list for search box
  const displayedFeeders = useMemo(() => {
    if (!feederSearchQuery.trim()) return feederHealthList;
    const q = feederSearchQuery.toLowerCase();
    return feederHealthList.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.code && f.code.toLowerCase().includes(q)) || 
      (f.substation && f.substation.toLowerCase().includes(q))
    );
  }, [feederHealthList, feederSearchQuery]);

  return (
    <div className={`space-y-6 font-sans select-none min-h-screen ${
      isDarkMode ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* 1. TOP COMMAND BAR: Live Shift Status, Quick Actions & Period Filter */}
      <div className={`p-4 sm:p-6 rounded-3xl border transition-all ${
        isDarkMode 
          ? 'bg-slate-900/70 border-slate-800/80 shadow-2xl backdrop-blur-md' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Header Title & Substation Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                SISTEM 20kV REAL-TIME
              </span>

              {/* Active Period Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Calendar className="w-3.5 h-3.5" />
                <span>Periode: <strong>{selectedMonthLabel} {selectedYear}</strong></span>
              </span>

              {isMonthFiltered && (
                <button
                  onClick={() => setSelectedMonth('ALL')}
                  title="Reset ke Semua Bulan (YTD)"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset YTD</span>
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Command Center Kinerja & Keandalan JTM</span>
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Seluruh metrik trip SUTM, SAIDI/SAIFI, Health Index, SPK, dan log gangguan otomatis menyesuaikan data periode <strong>{selectedMonthLabel} {selectedYear}</strong>.
            </p>
          </div>

          {/* Quick Action Buttons & Period Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Year Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/70 text-xs">
              {['2026', '2025', '2024'].map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedYear === yr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Month Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                aria-label="Pilih Periode Bulan Pencarian"
                className={`text-xs font-bold px-3 py-2 pr-8 rounded-xl border appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all ${
                  isMonthFiltered
                    ? 'bg-blue-600 text-white border-blue-600 font-black shadow-md shadow-blue-600/20'
                    : isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white' 
                      : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {monthsList.map(m => (
                  <option key={m.value} value={m.value} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    {m.label}
                  </option>
                ))}
              </select>
              <Filter className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isMonthFiltered ? 'text-white' : 'text-slate-400'
              }`} />
            </div>

            {/* Action 1: Quick Input Gangguan (Merah) */}
            <button
              onClick={onOpenInputGangguan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Gangguan</span>
            </button>

            {/* Action 2: WhatsApp Dispatch (Hijau) */}
            <button
              onClick={() => onOpenWhatsAppModal(undefined, 'Gangguan / Trip')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch WA</span>
            </button>

            {/* Action 3: Universal Input (Biru) */}
            <button
              onClick={() => onOpenUniversalInput()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 text-xs font-bold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Input Data</span>
            </button>
          </div>

        </div>

        {/* Quick Month Filter Bar Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-extrabold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
            Bulan:
          </span>
          {monthsList.map(m => {
            const isActive = selectedMonth === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setSelectedMonth(m.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-black scale-105'
                    : isDarkMode
                      ? 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {m.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS (6 Metrik Utama Terkalkulasi Presisi Berdasarkan Filter Bulan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* KPI 1: Total Trip Gangguan (Merah) */}
        <div 
          onClick={() => setCurrentView('trips')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-red-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-red-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `Trip (${currentMonthItem.short})` : 'Total Trip (YTD)'}
            </span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Zap className="w-4 h-4 fill-red-500" />
            </div>
          </div>
          
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
              {kpiStats.totalTripsCount}
              <span className="text-xs font-black text-red-600 dark:text-red-400">Kejadian</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Durasi: <span className="font-bold text-slate-700 dark:text-slate-200">{(kpiStats.totalDurationMinutes / 60).toFixed(1)} Jam</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform">
            <span>{isMonthFiltered ? `${selectedMonthLabel} ${selectedYear}` : 'Log Gangguan YTD'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 2: SAIDI Realisasi (Biru) */}
        <div 
          onClick={() => setCurrentView('saidi_saifi')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-blue-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `SAIDI (${currentMonthItem.short})` : 'SAIDI Kumulatif'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 flex items-baseline gap-1">
              {kpiStats.totalSaidiHours.toFixed(3)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Jam/Plg</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Ekuivalen: <span className="font-bold text-slate-700 dark:text-slate-200">{(kpiStats.totalSaidiHours * 60).toFixed(1)} Menit/Plg</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            <span>{currentPeriodTargets.targetLabel}: &lt; {currentPeriodTargets.saidiTarget.toFixed(2)} j</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 3: SAIFI Realisasi (Biru Langit) */}
        <div 
          onClick={() => setCurrentView('saidi_saifi')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-sky-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-sky-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `SAIFI (${currentMonthItem.short})` : 'SAIFI Kumulatif'}
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-sky-600 dark:text-sky-400 flex items-baseline gap-1">
              {kpiStats.totalSaifiCount.toFixed(3)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kali/Plg</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Plg Padam: <span className="font-bold text-slate-700 dark:text-slate-200">{kpiStats.totalCustomersAffected.toLocaleString('id-ID')}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
            <span>Target: &lt; {currentPeriodTargets.saifiTarget.toFixed(2)}x</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 4: ENS & Kerugian Finansial (Kuning / Amber) */}
        <div 
          onClick={() => setCurrentView('trips')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-amber-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `ENS (${currentMonthItem.short})` : 'ENS Loss Energi'}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-amber-500 dark:text-amber-400 flex items-baseline gap-1">
              {(kpiStats.totalEnsKwh / 1000).toFixed(2)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">MWh</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Finansial: <span className="font-bold text-amber-600 dark:text-amber-300">{formatRupiah(kpiStats.totalFinancialLoss)}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-amber-500 group-hover:translate-x-0.5 transition-transform">
            <span>{kpiStats.totalEnsKwh.toLocaleString('id-ID')} kWh Padam</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 5: Health Index Grid (Hijau) */}
        <div 
          onClick={() => setCurrentView('health_index')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `Health Index (${currentMonthItem.short})` : 'Rata-rata Health Index'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1">
              {overallHealthSummary.avgScore}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold mt-0.5">
              <span className="text-emerald-600 dark:text-emerald-400">{overallHealthSummary.sempurna} Sempurna</span>
              <span className="text-slate-400">•</span>
              <span className="text-red-600 dark:text-red-400">{overallHealthSummary.sakit + overallHealthSummary.kronis} Perhatian</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>{assetStats.totalFeeders} Penyulang Aktif</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 6: SPK & Perintah Kerja (Biru/Putih) */}
        <div 
          onClick={() => setCurrentView('spk')}
          className={`group cursor-pointer p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-blue-500 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
              {isMonthFiltered ? `SPK (${currentMonthItem.short})` : 'Perintah Kerja SPK'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 flex items-baseline gap-1">
              {spkStats.total}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Dokumen</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-amber-500 font-bold">{spkStats.dalamProses} Proses</span> • <span className="text-emerald-600 dark:text-emerald-400 font-bold">{spkStats.selesai} Selesai</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            <span>Buka Modul SPK</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* 3. ASSET INFRASTRUCTURE & SCADA AUTOMATION BANNER */}
      <div className={`p-5 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Infrastruktur Jaringan & Otomasi Proteksi SCADA 20kV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Topologi aset gardu, panjang SUTM, dan kesiapan switching pemutus jarak jauh ULP Baguala
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('master_data')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Master Data Aset Lengkap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Panjang JTM SUTM</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{assetStats.totalLengthKm.toFixed(1)} <span className="text-xs font-bold text-slate-400">kms</span></div>
            <span className="text-[10px] text-slate-500">{assetStats.totalFeeders} Feeder Keluar GI/GH</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Gardu Distribusi (GD)</span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">{assetStats.totalGd} <span className="text-xs font-bold text-slate-400">Unit</span></div>
            <span className="text-[10px] text-slate-500">{(assetStats.totalGdKva / 1000).toFixed(1)} MVA Total Trafo</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Gardu Hubung (GH)</span>
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">{assetStats.totalGh} <span className="text-xs font-bold text-slate-400">Lokasi</span></div>
            <span className="text-[10px] text-slate-500">Manuver Tegangan Beban</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Recloser & PMCB</span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">{assetStats.totalRecloser + assetStats.totalPmcb} <span className="text-xs font-bold text-slate-400">Unit</span></div>
            <span className="text-[10px] text-slate-500">Proteksi Hubung Singkat</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">LBS Motor & Manual</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{assetStats.totalLbs} <span className="text-xs font-bold text-slate-400">Unit</span></div>
            <span className="text-[10px] text-slate-500">Saklar Seksi Beban 20kV</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Otomasi SCADA</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{assetStats.totalScada} <span className="text-xs font-bold text-emerald-500">({assetStats.scadaPercent}%)</span></div>
            <span className="text-[10px] text-emerald-500 font-bold">Online Remote Control</span>
          </div>

        </div>
      </div>

      {/* 4. CHARTS ROW: Monthly Trip Breakdown Bar Chart (Left) + Fault Cause Pareto (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Monthly Trips & SAIDI Trend (2 Cols) */}
        <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <BarChart className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Frekuensi Gangguan SUTM & Realisasi SAIDI ({selectedYear})
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Klik pada batang bulan untuk memfilter seluruh dashboard secara instan ke bulan tersebut
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-600"></span>
                <span className="text-slate-600 dark:text-slate-300">Trip SUTM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-sky-400"></span>
                <span className="text-slate-600 dark:text-slate-300">SAIDI (Jam/Plg)</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyTripChartData} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const clickedMonth = e.activePayload[0].payload.monthCode;
                    setSelectedMonth(clickedMonth);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1E293B' : '#E2E8F0'} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-xl shadow-xl text-xs border ${
                          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                        }`}>
                          <div className="font-bold text-slate-400 mb-1.5 flex items-center justify-between gap-2">
                            <span>Bulan: {label} {selectedYear}</span>
                            {selectedMonth === data.monthCode && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">Terpilih</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4 font-bold text-blue-600 dark:text-blue-400">
                              <span>Trip SUTM:</span>
                              <span>{data.trips} Kejadian</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-sky-500 font-bold">
                              <span>SAIDI Real:</span>
                              <span>{data.saidiReal.toFixed(3)} Jam/Plg</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-amber-500 font-bold">
                              <span>ENS Loss:</span>
                              <span>{data.ensLoss.toLocaleString('id-ID')} kWh</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-slate-700 text-[10px] text-blue-400 font-semibold">
                            Klik untuk memfilter dashboard
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="trips" radius={[6, 6, 0, 0]} maxBarSize={36} className="cursor-pointer">
                  {monthlyTripChartData.map((entry, index) => {
                    const isCurrentSelected = selectedMonth === entry.monthCode;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          isCurrentSelected 
                            ? '#2563EB' 
                            : entry.trips > 0 
                              ? (isDarkMode ? '#3B82F6' : '#60A5FA') 
                              : (isDarkMode ? '#1E293B' : '#E2E8F0')
                        }
                        stroke={isCurrentSelected ? '#93C5FD' : 'none'}
                        strokeWidth={isCurrentSelected ? 2 : 0}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pareto Distribusi Penyebab Gangguan (1 Col) */}
        <div className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Penyebab Gangguan ({currentMonthItem.short})
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Klasifikasi faktor penyebab trip pada periode <strong>{selectedMonthLabel} {selectedYear}</strong>
            </p>

            <div className="space-y-2.5">
              {faultCausesData.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-800/20 text-center text-xs text-slate-400 border border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  <p className="font-bold text-slate-300">Tidak ada gangguan trip</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Jaringan beroperasi normal pada {selectedMonthLabel} {selectedYear}</p>
                </div>
              ) : (
                faultCausesData.map((item, idx) => {
                  const percent = kpiStats.totalTripsCount > 0 
                    ? Math.round((item.count / kpiStats.totalTripsCount) * 100) 
                    : 0;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.count} <span className="text-[10px] text-slate-500">({percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Dominasi Utama:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {faultCausesData.length > 0 ? faultCausesData[0].label.split('(')[0] : '100% Normal'}
            </span>
          </div>
        </div>

      </div>

      {/* 5. VULNERABLE FEEDERS & GRID HEALTH MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Top 5 Penyulang Perlu Perhatian Khusus (1 Col) */}
        <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Top 5 Rawan ({currentMonthItem.short})
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Penyulang dengan trip & ENS tertinggi pada {selectedMonthLabel}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('health_index')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Health Index
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {topWorstFeeders.map((feeder, index) => (
              <div
                key={feeder.id}
                onClick={() => setCurrentView('health_index')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-red-500/40' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-black">
                      {index + 1}
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {feeder.name}
                    </span>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${feeder.categoryInfo.badgeBg} ${feeder.categoryInfo.badgeText} ${feeder.categoryInfo.badgeBorder}`}>
                    {feeder.categoryInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/50">
                  <div>
                    <span className="text-slate-500 block">Trip Periode</span>
                    <span className={`font-black text-xs ${feeder.tripCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {feeder.tripCount} Kali
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SAIDI</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-xs">{feeder.saidiContrib.toFixed(3)} j</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ENS Padam</span>
                    <span className="font-black text-amber-500 text-xs">{feeder.ensKwh.toLocaleString('id-ID')} kWh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Matrix Semua Penyulang 20kV ULP Baguala (2 Cols) */}
        <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Matriks Keandalan Penyulang ({currentMonthItem.short})
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Katalog performa seluruh penyulang aktif ULP Baguala pada <strong>{selectedMonthLabel} {selectedYear}</strong>
              </p>
            </div>

            {/* Feeder Search Box */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Cari nama penyulang..."
                value={feederSearchQuery}
                onChange={(e) => setFeederSearchQuery(e.target.value)}
                className={`w-full text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Feeders Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {displayedFeeders.map(f => (
              <div
                key={f.id}
                onClick={() => setCurrentView('health_index')}
                className={`p-3 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/70 hover:border-blue-500/40' 
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {f.name}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${f.categoryInfo.badgeBg} ${f.categoryInfo.badgeText} ${f.categoryInfo.badgeBorder}`}>
                    {f.categoryInfo.label}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between mb-2">
                  <span>{f.substation}</span>
                  <span>{f.lengthKm} km • {f.customers.toLocaleString('id-ID')} plg</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-slate-500 font-medium">Trip: <strong className={f.tripCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>{f.tripCount}x</strong></span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Skor: {f.healthScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. OPERATIONAL TRI-COLUMN: Pemeliharaan/SPK + Trafo & ROW + Logistik/K3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1: Monitoring SPK & Pemeliharaan Lapangan */}
        <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  SPK & Eksekusi Yantek
                </h3>
              </div>
              <button 
                onClick={() => setCurrentView('spk')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Detail SPK
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Status perintah kerja pada periode <strong>{selectedMonthLabel}</strong>
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-500 block">Dalam Proses</span>
                <span className="text-lg font-black text-amber-500">{spkStats.dalamProses} SPK</span>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-500 block">Selesai / Tuntas</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{spkStats.selesai} SPK</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {spkStats.list.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  Tidak ada SPK terbit pada {selectedMonthLabel}
                </div>
              ) : (
                spkStats.list.slice(0, 3).map(spk => (
                  <div
                    key={spk.id}
                    onClick={() => setCurrentView('spk')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer hover:border-blue-500 transition-all ${
                      isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 dark:text-white truncate">{spk.taskType}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">{spk.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {spk.feederName} • {spk.teamName} {spk.date ? `• ${spk.date}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onOpenUniversalInput('spk')}
            className="w-full mt-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800/60 transition-all cursor-pointer"
          >
            + Buat SPK Baru
          </button>
        </div>

        {/* Col 2: Inspeksi SUTM, ROW Pohon & Pembebanan Gardu */}
        <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <TreePine className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Inspeksi ROW & Beban Trafo
                </h3>
              </div>
              <button 
                onClick={() => setCurrentView('pemeliharaan')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Pemeliharaan
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Perlindungan ROW jaringan dan kapasitas trafo distribusi
            </p>

            <div className="space-y-2.5">
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Titik Rawan Pohon SUTM</span>
                  <span className="font-black text-red-600 dark:text-red-400">{inspectionStats.perluPangkas} Titik</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {inspectionStats.highPriorityRow} titik prioritas tinggi dekat kawat konduktor 20kV
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Pengukuran Beban Gardu</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{garduStats.totalMeasured} Gardu</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Normal: {garduStats.normalCount}</span>
                  <span className="text-amber-500 font-bold">Waspada: {garduStats.warningCount}</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">Overload: {garduStats.overloadCount}</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Temuan Inspeksi Fisik</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{inspectionStats.totalInsp} Temuan</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {inspectionStats.heavyInsp} kategori berat • {inspectionStats.openInsp} status open
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('gis')}
            className="w-full mt-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-all cursor-pointer"
          >
            Buka Peta Spasial GIS JTM
          </button>
        </div>

        {/* Col 3: Kesiapan Logistik, APD K3 & Armada Yantek */}
        <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <HardHat className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Logistik, K3 & Armada
                </h3>
              </div>
              <button 
                onClick={() => setCurrentView('material')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Logistik
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Ketersediaan material cadang, kelayakan APD, dan armada siaga
            </p>

            <div className="space-y-2.5">
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Stok Material Kritis</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{logisticsStats.totalMats} Item</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {logisticsStats.lowStockMats > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">{logisticsStats.lowStockMats} item di bawah batas minimum</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Semua stok cadangan aman</span>
                  )}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Kelaikan APD & Alat Uji K3</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{logisticsStats.apdReadyPercent}%</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {logisticsStats.totalApd} unit peralatan keselamatan kerja 20kV
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Armada Siaga Reaksi Cepat</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">{logisticsStats.readyVehicles} / {logisticsStats.totalVehicles} Siap</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Mobil Yantek & Motor Reaksi Cepat Siaga 24 Jam
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('whatsapp')}
            className="w-full mt-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800/60 transition-all cursor-pointer"
          >
            Buka Riwayat Dispatch WhatsApp
          </button>
        </div>

      </div>

      {/* 7. LIVE FEED: RECENT TRIPS & GANGGUAN REAL-TIME LOG SESUAI FILTER BULAN */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Zap className="w-4 h-4 fill-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Log Kejadian Gangguan ({currentMonthItem.short}) - {filteredTrips.length} Total Kejadian
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pembaruan rekaman padam periode <strong>{selectedMonthLabel} {selectedYear}</strong> dan rincian parameter relay OCR/GFR
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('trips')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Seluruh Tabel Log Gangguan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-800/20 border border-slate-800/50 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-90" />
            <div className="font-extrabold text-sm text-slate-200">Tidak ada gangguan trip pada {selectedMonthLabel} {selectedYear}</div>
            <div className="text-[11px] text-slate-500 mt-1">Sistem jaringan distribusi 20kV PLN ULP Baguala beroperasi 100% andal dan aman tanpa pemadaman.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="pb-3 px-3">Waktu Padam</th>
                  <th className="pb-3 px-3">Penyulang & GI</th>
                  <th className="pb-3 px-3">Relay & Arus</th>
                  <th className="pb-3 px-3">Kategori & Penyebab</th>
                  <th className="pb-3 px-3">Durasi</th>
                  <th className="pb-3 px-3">SAIDI (Jam)</th>
                  <th className="pb-3 px-3">ENS (kWh)</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTrips.slice(0, 8).map(trip => {
                  const saidiVal = trip.saidiHours ?? ((( (trip.durationMinutes || 0) / 60 ) * (trip.affectedCustomers || 0)) / (trip.totalUlpCustomers || defaultTotalUlp));
                  
                  return (
                    <tr 
                      key={trip.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <div>{trip.tripDate}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{trip.tripTime} WIT</div>
                      </td>

                      <td className="py-3 px-3 font-bold whitespace-nowrap">
                        <span className="text-blue-600 dark:text-blue-400">{trip.feederName}</span>
                        <div className="text-[10px] text-slate-500 font-normal">{trip.substation}</div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[10px]">
                          {trip.relayType}
                        </span>
                        {trip.currentAmpere ? (
                          <div className="text-[10px] text-slate-500">{trip.currentAmpere} A</div>
                        ) : null}
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-semibold truncate">{trip.cause || '-'}</div>
                        <div className="text-[10px] text-slate-500 truncate">{trip.category}</div>
                      </td>

                      <td className="py-3 px-3 font-semibold whitespace-nowrap">
                        {trip.durationMinutes} Menit
                      </td>

                      <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {saidiVal.toFixed(3)}
                      </td>

                      <td className="py-3 px-3 font-bold text-amber-500 whitespace-nowrap">
                        {(trip.ensKwh || 0).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenWhatsAppModal(trip, 'Gangguan / Trip')}
                            title="Kirim Pesan WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          {onEditTrip && (
                            <button
                              onClick={() => onEditTrip(trip)}
                              title="Edit Data Gangguan"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
