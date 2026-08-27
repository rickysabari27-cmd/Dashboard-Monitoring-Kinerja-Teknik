import React, { useState, useMemo } from 'react';
import { CustomSelect } from '../CustomSelect';
import { MasterFeeder, MasterSection, MasterGarduDistribusi, FeederTrip, FeederHealth, InspectionRecord, SpkTask } from '../../types';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  BarChart, 
  Bar, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Siren, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertOctagon, 
  Info, 
  ArrowDownRight, 
  ArrowUpRight, 
  Users, 
  Layers, 
  Sliders, 
  Radio, 
  Wrench, 
  Gauge, 
  Calendar, 
  ChevronRight,
  Filter,
  RefreshCw,
  Clock,
  Check,
  CircleDot,
  Skull,
  RotateCcw,
  PieChart as PieChartIcon,
  HelpCircle,
  Hash,
  FileText,
  ExternalLink,
  Scissors,
  TreePine,
  CheckCircle,
  Search
} from 'lucide-react';

interface HealthIndexViewProps {
  isDarkMode: boolean;
  masterFeeders?: MasterFeeder[];
  masterSections?: MasterSection[];
  masterGarduDistribusi?: MasterGarduDistribusi[];
  trips?: FeederTrip[];
  feeders?: FeederHealth[];
  inspections?: InspectionRecord[];
  spkList?: SpkTask[];
  onSelectFeeder?: (feederName: string) => void;
  onNavigateToSpk?: () => void;
}

// Utility to normalize and match feeder names across different formats (e.g. "Hutumuri" vs "Penyulang Hutumuri")
export const matchFeederName = (nameA?: string, nameB?: string): boolean => {
  if (!nameA || !nameB) return false;
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/^(penyulang|feeder|fdr)\s+/i, '')
      .replace(/[^a-z0-9]/g, '');
  };
  const cleanA = normalize(nameA);
  const cleanB = normalize(nameB);
  if (!cleanA || !cleanB) return false;
  return cleanA === cleanB;
};

export const isSpkDone = (status?: string): boolean => {
  if (!status) return false;
  const st = status.toLowerCase();
  return st.includes('selesai') || st.includes('done') || st.includes('tuntas');
};

export const isSpkInProcess = (status?: string): boolean => {
  if (!status) return false;
  const st = status.toLowerCase();
  return st.includes('progres') || st.includes('proses') || st.includes('progress') || st.includes('jalan');
};

export const isSpkPending = (status?: string): boolean => {
  if (!status) return true;
  if (isSpkDone(status) || isSpkInProcess(status)) return false;
  return true;
};

export type HealthCategoryType = 'SEMPURNA' | 'SEHAT' | 'SAKIT' | 'KRONIS';

export interface HealthCategoryInfo {
  category: HealthCategoryType;
  label: string;
  tripsDesc: string;
  colorName: string;
  barBg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  textColor: string;
  headerBorder: string;
}

export function getHealthCategory(tripsCount: number): HealthCategoryInfo {
  if (tripsCount === 0) {
    return {
      category: 'SEMPURNA',
      label: 'Sempurna',
      tripsDesc: '0 Gangguan',
      colorName: 'Hijau',
      barBg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
      dotColor: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      headerBorder: 'border-emerald-500/30'
    };
  } else if (tripsCount >= 1 && tripsCount <= 3) {
    return {
      category: 'SEHAT',
      label: 'Sehat',
      tripsDesc: '1-3 Gangguan',
      colorName: 'Kuning',
      barBg: 'bg-amber-400',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/40',
      dotColor: 'bg-amber-400',
      textColor: 'text-amber-400',
      headerBorder: 'border-amber-500/30'
    };
  } else if (tripsCount >= 4 && tripsCount <= 6) {
    return {
      category: 'SAKIT',
      label: 'Sakit',
      tripsDesc: '4-6 Gangguan',
      colorName: 'Merah',
      barBg: 'bg-rose-500',
      badgeBg: 'bg-rose-500/20',
      badgeText: 'text-rose-500',
      badgeBorder: 'border-rose-500/40',
      dotColor: 'bg-rose-500',
      textColor: 'text-rose-500',
      headerBorder: 'border-rose-500/30'
    };
  } else {
    return {
      category: 'KRONIS',
      label: 'Kronis',
      tripsDesc: '>6 Gangguan',
      colorName: 'Hitam',
      barBg: 'bg-black border border-slate-700 shadow-inner',
      badgeBg: 'bg-black/90',
      badgeText: 'text-slate-100 font-extrabold',
      badgeBorder: 'border-slate-600',
      dotColor: 'bg-slate-300 ring-2 ring-black',
      textColor: 'text-slate-300',
      headerBorder: 'border-slate-700'
    };
  }
}

export interface FindingCategoryStat {
  code: string;
  name: string;
  fullName: string;
  count: number;
  percentage: number;
  totalDurationMinutes: number;
  totalEnsKwh: number;
  totalSaidiHours: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export function normalizeFindingCategory(rawCat?: string, cause?: string): { 
  code: string; 
  name: string; 
  fullName: string; 
  color: string; 
  badgeBg: string; 
  badgeBorder: string; 
  badgeText: string;
  description: string;
} {
  const c = (rawCat || '').toUpperCase();
  const cs = (cause || '').toUpperCase();
  
  if (c.includes('I-1') || c.includes('I1') || c.includes('KOMPONEN') || cs.includes('ISOLATOR') || cs.includes('JUMPER') || cs.includes('KONDUKTOR') || cs.includes('ARRESTER') || cs.includes('FUSE CUT')) {
    return {
      code: 'I-1',
      name: 'Komponen JTM',
      fullName: 'I-1 : KOMPONEN JTM',
      color: '#06b6d4', // Cyan
      badgeBg: 'bg-cyan-500/20',
      badgeBorder: 'border-cyan-500/40',
      badgeText: 'text-cyan-400',
      description: 'Isolator flashover, konduktor putus, jumperan lepas, lightning arrester bocor, FCO rusak'
    };
  }
  if (c.includes('I-2') || c.includes('I2') || c.includes('PERALATAN') || c.includes('EQUIPMENT') || cs.includes('RECLOSER') || cs.includes('LBS') || cs.includes('SECTIONALIZER') || cs.includes('LOAD BREAK')) {
    return {
      code: 'I-2',
      name: 'Peralatan JTM',
      fullName: 'I-2 : PERALATAN JTM',
      color: '#3b82f6', // Blue
      badgeBg: 'bg-blue-500/20',
      badgeBorder: 'border-blue-500/40',
      badgeText: 'text-blue-400',
      description: 'Recloser malfungsi, LBS bermasalah, sectionalizer trip, fault indicator error'
    };
  }
  if (c.includes('I-3') || c.includes('I3') || c.includes('TRAFO') || cs.includes('TRAFO') || cs.includes('TRANSFORMATOR') || cs.includes('KUBIKEL')) {
    return {
      code: 'I-3',
      name: 'Trafo & Lainnya',
      fullName: 'I-3 : TRAFO DAN LAINNYA',
      color: '#8b5cf6', // Violet
      badgeBg: 'bg-violet-500/20',
      badgeBorder: 'border-violet-500/40',
      badgeText: 'text-violet-400',
      description: 'Gangguan belitan trafo, bushing pecah, kubikel GI/GH, tap changer bermasalah'
    };
  }
  if (c.includes('I-4') || c.includes('I4') || c.includes('TIANG') || cs.includes('TIANG') || cs.includes('CROSSARM') || cs.includes('TRAVERS')) {
    return {
      code: 'I-4',
      name: 'Tiang & Konstruksi',
      fullName: 'I-4 : TIANG',
      color: '#f59e0b', // Amber
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-400',
      description: 'Tiang patah/miring, travers bengkok/korosi, guy wire putus, pondasi labil'
    };
  }
  if (c.includes('E-1') || c.includes('E1') || c.includes('POHON') || c.includes('TREE') || c.includes('ROW') || cs.includes('POHON') || cs.includes('DAHAN') || cs.includes('RANTING') || cs.includes('BAMBU') || cs.includes('KELAPA')) {
    return {
      code: 'E-1',
      name: 'Pohon / ROW',
      fullName: 'E-1 : POHON',
      color: '#10b981', // Emerald
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-500/40',
      badgeText: 'text-emerald-400',
      description: 'Dahan/ranting pohon menyentuh JTM, pohon tumbang menimpa jaringan, pelepah kelapa'
    };
  }
  if (c.includes('E-2') || c.includes('E2') || c.includes('BENCANA') || c.includes('LIGHTNING') || c.includes('PETIR') || cs.includes('PETIR') || cs.includes('HUJAN') || cs.includes('ANGIN') || cs.includes('LONGSOR') || cs.includes('BANJIR')) {
    return {
      code: 'E-2',
      name: 'Bencana / Petir',
      fullName: 'E-2 : BENCANA ALAM',
      color: '#f43f5e', // Rose
      badgeBg: 'bg-rose-500/20',
      badgeBorder: 'border-rose-500/40',
      badgeText: 'text-rose-400',
      description: 'Sambaran petir langsung, angin kencang (puting beliung), banjir, longsor lereng'
    };
  }
  if (c.includes('E-3') || c.includes('E3') || c.includes('BINATANG') || c.includes('ANIMAL') || cs.includes('BURUNG') || cs.includes('KELELAWAR') || cs.includes('KALONG') || cs.includes('ULAR') || cs.includes('TOKEK') || cs.includes('TIKUS')) {
    return {
      code: 'E-3',
      name: 'Binatang',
      fullName: 'E-3 : BINATANG',
      color: '#eab308', // Yellow
      badgeBg: 'bg-yellow-500/20',
      badgeBorder: 'border-yellow-500/40',
      badgeText: 'text-yellow-400',
      description: 'Kalong/kelelawar bentang fasa, burung hinggap di bushing, ular naik tiang, tokek'
    };
  }
  return {
    code: 'E-4',
    name: 'Sesaat / Nihil',
    fullName: 'E-4 : SESAAT / TIDAK DITEMUKAN',
    color: '#94a3b8', // Slate
    badgeBg: 'bg-slate-700/40',
    badgeBorder: 'border-slate-600',
    badgeText: 'text-slate-300',
    description: 'Gangguan sesaat (transient), PMT reclose sukses, hasil penelusuran nihil temuan fisik'
  };
}

// Polar to Cartesian conversion helper for SVG Donut Pie Chart
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const deltaAngle = Math.min(359.99, Math.max(0.01, endAngle - startAngle));
  const actualEndAngle = startAngle + deltaAngle;
  
  const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, actualEndAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, actualEndAngle);

  const largeArcFlag = deltaAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 0, startInner.x, startInner.y,
    'Z'
  ].join(' ');
}

interface FeederHealthCalculated {
  id: string;
  name: string;
  substation: string;
  garduHubung?: string;
  customers: number;
  lengthKm: number;
  capacityMva: number;
  tripsCount: number;
  totalSaidiHours: number;
  totalSaifiCount: number;
  totalEnsKwh: number;
  voltageKv: number;
  voltageDeviationPercent: number;
  loadMw: number;
  loadPercent: number;
  frequencyHz: number;
  scoreKeandalan: number;
  scoreTegangan: number;
  scoreBeban: number;
  scorePeralatan: number;
  scoreGangguan: number;
  scorePemeliharaan: number;
  overallScore: number;
  healthCategory: HealthCategoryInfo;
  status: 'BAIK' | 'PERINGATAN' | 'BURUK';
  statusLabel: 'Sempurna' | 'Sehat' | 'Sakit' | 'Kronis';
  lastInspected: string;
  lastUpdated: string;
}

export const HealthIndexView: React.FC<HealthIndexViewProps> = ({
  isDarkMode,
  masterFeeders = [],
  masterSections = [],
  masterGarduDistribusi = [],
  trips = [],
  feeders = [],
  inspections = [],
  spkList = [],
  onSelectFeeder,
  onNavigateToSpk
}) => {
  // Filter States
  const [selectedFeeder, setSelectedFeeder] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedFeederId, setSelectedFeederId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | HealthCategoryType>('ALL');
  const [selectedFindingCode, setSelectedFindingCode] = useState<string | null>(null);
  const [spkSearchQuery, setSpkSearchQuery] = useState('');
  const [spkStatusFilter, setSpkStatusFilter] = useState<'ALL' | 'SELESAI' | 'PROSES' | 'PENDING'>('ALL');

  // Month options (Indonesian)
  const monthOptions = [
    { value: 'ALL', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  // Year options up to 2030
  const yearOptions = useMemo(() => {
    const years = new Set<string>(['2030', '2029', '2028', '2027', '2026', '2025', '2024']);
    trips.forEach(t => {
      if (t.tripDate) {
        const y = t.tripDate.split('-')[0];
        if (y && y.length === 4) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [trips]);

  // Feeder options for filter sorted alphabetically A-Z
  const feederOptions = useMemo(() => {
    const names = masterFeeders.length > 0 
      ? masterFeeders.map(f => f.feederName)
      : Array.from(new Set(trips.map(t => t.feederName)));
    return [...names].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
  }, [masterFeeders, trips]);

  // Active filter status
  const isFilterActive = selectedFeeder !== 'ALL' || selectedMonth !== 'ALL' || selectedYear !== 'ALL' || categoryFilter !== 'ALL' || selectedFindingCode !== null || Boolean(selectedFeederId);

  const handleResetFilter = () => {
    setSelectedFeeder('ALL');
    setSelectedMonth('ALL');
    setSelectedYear('ALL');
    setSelectedFeederId('');
    setCategoryFilter('ALL');
    setSelectedFindingCode(null);
  };

  // Filter trips based on Month and Year for dynamic period health analysis
  const filteredTripsByPeriod = useMemo(() => {
    return trips.filter(trip => {
      const tripYear = trip.tripDate ? trip.tripDate.split('-')[0] : '';
      const tripMonth = trip.tripDate ? trip.tripDate.split('-')[1] : '';

      const matchesYear = selectedYear === 'ALL' || tripYear === selectedYear;
      const matchesMonth = selectedMonth === 'ALL' || tripMonth === selectedMonth;

      return matchesYear && matchesMonth;
    });
  }, [trips, selectedYear, selectedMonth]);

  // Total ULP Customers fallback
  const masterTotalCust = (masterFeeders || []).reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
  const defaultTotalUlp = masterTotalCust > 0 ? masterTotalCust : 45200;

  // Compute detailed dynamic health metrics for each feeder
  const calculatedFeeders: FeederHealthCalculated[] = useMemo(() => {
    let baseList: { 
      id: string; 
      name: string; 
      substation: string; 
      garduHubung?: string; 
      substationName?: string;
      customers: number; 
      lengthKm: number; 
      capacityMva: number; 
    }[] = [];

    if (masterFeeders && masterFeeders.length > 0) {
      baseList = masterFeeders.map(mf => {
        // Find section data for this feeder if available (first section gives the pangkal/source point)
        const feederSecs = (masterSections || []).filter(s => s.feederName.toLowerCase() === mf.feederName.toLowerCase());
        const feederGds = (masterGarduDistribusi || []).filter(g => g.feederName && g.feederName.trim().toLowerCase() === mf.feederName.trim().toLowerCase());
        const secSupply = feederSecs[0]?.substationOrGh;

        // Supply source prioritization:
        // 1. Section supply point (secSupply) if present and not '-'
        // 2. Feeder garduHubung if present and not '-'
        // 3. Feeder substationName if present and not '-'
        // 4. Default 'GI Passo'
        const gh = (mf.garduHubung && mf.garduHubung !== '-') 
          ? mf.garduHubung 
          : (secSupply && secSupply !== '-' && secSupply.startsWith('GH') ? secSupply : undefined);
          
        const gi = (mf.substationName && mf.substationName !== '-') ? mf.substationName : undefined;
        
        const primarySupply = (secSupply && secSupply !== '-' && secSupply !== 'GI/GH')
          ? secSupply
          : (gh || gi || 'GI Passo');

        // Customer count sync matching Master Data logic
        const sumGdCust = feederGds.reduce((sum, g) => sum + (Number(g.customerCount) || 0), 0);
        const sumSecCust = feederSecs.reduce((sum, s) => sum + (Number(s.customerCount) || 0), 0);
        const realCust = feederGds.length > 0 
          ? sumGdCust 
          : (feederSecs.length > 0 ? sumSecCust : (Number(mf.customerCount) || 2800));

        return {
          id: mf.id || mf.feederName,
          name: mf.feederName,
          substation: primarySupply,
          garduHubung: gh,
          substationName: gi,
          customers: realCust,
          lengthKm: Number(mf.lengthKms) || 18.5,
          capacityMva: mf.capacityKva ? mf.capacityKva / 1000 : (mf.khaAmpere ? (mf.khaAmpere * 20 * 1.732) / 1000 : 12.5)
        };
      });
    } else if (feeders && feeders.length > 0) {
      baseList = feeders.map(f => {
        const feederSecs = (masterSections || []).filter(s => s.feederName.toLowerCase() === f.name.toLowerCase());
        const secSupply = feederSecs[0]?.substationOrGh;
        const gh = f.garduHubung && f.garduHubung !== '-' ? f.garduHubung : (secSupply && secSupply !== '-' && secSupply.startsWith('GH') ? secSupply : undefined);
        const primarySupply = (secSupply && secSupply !== '-') ? secSupply : (gh || f.substation || 'GI Passo');
        return {
          id: f.id,
          name: f.name,
          substation: primarySupply,
          garduHubung: gh,
          substationName: f.substation !== gh ? f.substation : undefined,
          customers: f.customers,
          lengthKm: f.lengthKm,
          capacityMva: 12.5
        };
      });
    } else {
      const uniqueTripFeeders = Array.from(new Set(trips.map(t => t.feederName)));
      baseList = uniqueTripFeeders.map((name, idx) => {
        const feederSecs = (masterSections || []).filter(s => s.feederName.toLowerCase() === name.toLowerCase());
        const secSupply = feederSecs[0]?.substationOrGh;
        const primarySupply = (secSupply && secSupply !== '-') 
          ? secSupply 
          : (name.toUpperCase() === 'ALLANG' ? 'GH Bandara' : 'GI Passo');
        return {
          id: `f-${idx}`,
          name,
          substation: primarySupply,
          garduHubung: primarySupply.startsWith('GH') ? primarySupply : undefined,
          customers: 3800,
          lengthKm: 15.2,
          capacityMva: 12.5
        };
      });
    }

    // Sort alphabetically
    baseList.sort((a, b) => a.name.localeCompare(b.name, 'id', { numeric: true, sensitivity: 'base' }));

    return baseList.map((item) => {
      const feederTrips = filteredTripsByPeriod.filter(t => matchFeederName(t.feederName, item.name));
      const tripsCount = feederTrips.length;
      
      const totalSaidi = feederTrips.reduce((acc, t) => {
        const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
        return acc + saidi;
      }, 0);

      const totalSaifi = feederTrips.reduce((acc, t) => {
        const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
        return acc + saifi;
      }, 0);

      const totalEns = feederTrips.reduce((acc, t) => acc + (t.ensKwh || 0), 0);

      const existingHealth = feeders.find(f => matchFeederName(f.name, item.name));
      const hash = item.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Health Category: 0 = Sempurna, 1-3 = Sehat, 4-6 = Sakit, >6 = Kronis
      const healthCategory = getHealthCategory(tripsCount);

      // Electrical & Equipment parameters
      const voltageDev = Math.max(0.8, Math.min(4.5, 1.8 + (hash % 15) / 10 + (tripsCount > 2 ? 1.2 : 0)));
      const voltageKv = Number((20.0 + (20.0 * (voltageDev / 100) * (hash % 2 === 0 ? 1 : -0.8))).toFixed(2));
      const loadPercent = Math.min(94, Math.max(45, 58 + (hash % 28)));
      const loadMw = Number(((item.capacityMva * (loadPercent / 100)) * 0.9).toFixed(2));
      const thermoIssues = existingHealth?.thermoHotspots ?? (hash % 4 === 0 ? 2 : hash % 3 === 0 ? 1 : 0);
      const groundingOhm = existingHealth?.groundingResistance ?? (2.5 + (hash % 40) / 10);
      
      // SPK ROW & Maintenance status matching for this feeder
      const feederSpks = spkList.filter(s => matchFeederName(s.feederName, item.name));
      const feederSpkDone = feederSpks.filter(s => isSpkDone(s.status)).length;
      const feederSpkPending = feederSpks.filter(s => !isSpkDone(s.status)).length;
      const spkPending = feederSpkPending;

      // Component Scores (0 - 100) and Health Index Calculation
      let scoreKeandalan = 100;
      let scoreGangguan = 100;
      let scoreTegangan = 100;
      let scoreBeban = 100;
      let scorePeralatan = 100;
      let scorePemeliharaan = 100;
      let finalScore = 100.0;

      if (tripsCount === 0) {
        // Jika tidak terdapat gangguan maka Health Index bernilai 100%
        finalScore = 100.0;
        scoreKeandalan = 100;
        scoreGangguan = 100;
        scoreTegangan = 100;
        scoreBeban = 100;
        scorePeralatan = 100;
        scorePemeliharaan = spkPending > 0 ? Math.max(70, 100 - spkPending * 5) : 100;
      } else {
        // Nilai 100% dikurangi persentasenya sesuai gangguan (frekuensi trip, SAIDI, durasi padam, ENS)
        const tripPenalty = tripsCount * 8.0;
        const saidiPenalty = Math.min(22, totalSaidi * 4.5);
        const totalDuration = feederTrips.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
        const durationPenalty = Math.min(15, (totalDuration / 180) * 3.0);
        const ensPenalty = Math.min(10, (totalEns / 3000) * 2.0);
        const totalReduction = tripPenalty + saidiPenalty + durationPenalty + ensPenalty;

        const calculatedBaseScore = Math.max(12.0, Math.min(92.0, 100.0 - totalReduction));
        finalScore = Number(calculatedBaseScore.toFixed(1));

        scoreKeandalan = Math.max(20, Math.min(92, Math.round(100 - (tripsCount * 10 + totalSaidi * 5))));
        scoreGangguan = Math.max(15, Math.min(90, Math.round(100 - tripsCount * 14)));
        scoreTegangan = Math.max(50, Math.min(96, Math.round(100 - voltageDev * 8)));
        scoreBeban = Math.max(45, Math.min(96, Math.round(100 - Math.max(0, loadPercent - 65) * 1.5)));
        scorePeralatan = Math.max(40, Math.min(96, Math.round(95 - thermoIssues * 12 - (groundingOhm > 5 ? 15 : 0))));
        scorePemeliharaan = Math.max(50, Math.min(100, Math.round(100 - spkPending * 5)));
      }

      let status: 'BAIK' | 'PERINGATAN' | 'BURUK' = 'BAIK';
      if (tripsCount >= 4) {
        status = 'BURUK';
      } else if (tripsCount >= 1) {
        status = 'PERINGATAN';
      }

      return {
        id: item.id,
        name: item.name,
        substation: item.substation,
        garduHubung: item.garduHubung,
        customers: item.customers,
        lengthKm: item.lengthKm,
        capacityMva: item.capacityMva,
        tripsCount,
        totalSaidiHours: totalSaidi,
        totalSaifiCount: totalSaifi,
        totalEnsKwh: totalEns,
        voltageKv,
        voltageDeviationPercent: Number(voltageDev.toFixed(2)),
        loadMw,
        loadPercent,
        frequencyHz: Number((49.95 + (hash % 10) / 100).toFixed(2)),
        scoreKeandalan,
        scoreTegangan,
        scoreBeban,
        scorePeralatan,
        scoreGangguan,
        scorePemeliharaan,
        spkTotal: feederSpks.length,
        spkDone: feederSpkDone,
        spkPending,
        overallScore: finalScore,
        healthCategory,
        status,
        statusLabel: healthCategory.label as any,
        lastInspected: existingHealth?.lastInspected || '14/08/2026',
        lastUpdated: '23/08/2026 10:20 WIT'
      };
    });
  }, [masterFeeders, filteredTripsByPeriod, feeders, inspections, spkList, trips, defaultTotalUlp]);

  // Feeders filtered by feeder selection
  const filteredFeeders = useMemo(() => {
    return calculatedFeeders.filter(feeder => {
      const matchesFeeder = selectedFeeder === 'ALL' || matchFeederName(feeder.name, selectedFeeder);
      return matchesFeeder;
    });
  }, [calculatedFeeders, selectedFeeder]);

  // When a specific feeder is explicitly selected via dropdown or table row click
  const selectedSpecificFeeder = useMemo(() => {
    if (selectedFeeder !== 'ALL') {
      return calculatedFeeders.find(f => matchFeederName(f.name, selectedFeeder)) || calculatedFeeders[0];
    }
    if (selectedFeederId) {
      return calculatedFeeders.find(f => f.id === selectedFeederId || matchFeederName(f.name, selectedFeederId)) || null;
    }
    return null;
  }, [calculatedFeeders, selectedFeeder, selectedFeederId]);

  // Active feeder fallback (for compatibility)
  const activeFeeder = selectedSpecificFeeder;

  // Filtered feeders for list by category button
  const displayedFeeders = useMemo(() => {
    if (categoryFilter === 'ALL') return filteredFeeders;
    return filteredFeeders.filter(f => f.healthCategory.category === categoryFilter);
  }, [filteredFeeders, categoryFilter]);

  // Aggregate stats across all feeders based on 4 Categories
  const totalCount = filteredFeeders.length;
  
  // 0 = Sempurna (Hijau)
  const sempurnaFeeders = filteredFeeders.filter(f => f.tripsCount === 0);
  const sempurnaCount = sempurnaFeeders.length;
  const sempurnaPercent = totalCount > 0 ? Math.round((sempurnaCount / totalCount) * 100) : 0;

  // 1-3 = Sehat (Kuning)
  const sehatFeeders = filteredFeeders.filter(f => f.tripsCount >= 1 && f.tripsCount <= 3);
  const sehatCount = sehatFeeders.length;
  const sehatPercent = totalCount > 0 ? Math.round((sehatCount / totalCount) * 100) : 0;

  // 4-6 = Sakit (Merah)
  const sakitFeeders = filteredFeeders.filter(f => f.tripsCount >= 4 && f.tripsCount <= 6);
  const sakitCount = sakitFeeders.length;
  const sakitPercent = totalCount > 0 ? Math.round((sakitCount / totalCount) * 100) : 0;

  // >6 = Kronis (Hitam)
  const kronisFeeders = filteredFeeders.filter(f => f.tripsCount > 6);
  const kronisCount = kronisFeeders.length;
  const kronisPercent = totalCount > 0 ? Math.round((kronisCount / totalCount) * 100) : 0;

  const avgHealthIndex = useMemo(() => {
    if (totalCount === 0) return 95.0;
    const sum = filteredFeeders.reduce((acc, f) => acc + f.overallScore, 0);
    return Number((sum / totalCount).toFixed(1));
  }, [filteredFeeders, totalCount]);

  const avgCategory = avgHealthIndex >= 90 ? 'SEMPURNA' : avgHealthIndex >= 80 ? 'SEHAT' : avgHealthIndex >= 60 ? 'SAKIT' : 'KRONIS';

  // System-wide Aggregated Statistics across all filtered feeders
  const systemStats = useMemo(() => {
    const count = filteredFeeders.length;
    if (count === 0) {
      return {
        totalCustomers: 0,
        totalCapacityMva: 0,
        totalLengthKm: 0,
        totalLoadMw: 0,
        totalGardu: 0,
        avgLoadPercent: 0,
        avgVoltageKv: '20,00',
        avgVoltageDev: '0,0',
        avgScoreKeandalan: 100,
        avgScoreTegangan: 100,
        avgScoreBeban: 100,
        avgScorePeralatan: 100,
        avgScoreGangguan: 100,
        avgScorePemeliharaan: 100,
        spkDonePercent: 100,
        spkTotal: 0,
        spkDone: 0,
        spkInProcess: 0,
        spkDraft: 0,
        feedersWithTrips: 0,
        substationsText: 'GI Passo & Sirimau'
      };
    }

    const totalCustomers = filteredFeeders.reduce((acc, f) => acc + (f.customers || 0), 0);
    const totalCapacityMva = filteredFeeders.reduce((acc, f) => acc + (f.capacityMva || 0), 0);
    const totalLengthKm = filteredFeeders.reduce((acc, f) => acc + (f.lengthKm || 0), 0);
    const totalLoadMw = filteredFeeders.reduce((acc, f) => acc + (f.loadMw || 0), 0);
    const totalGardu = masterFeeders.reduce((acc, f) => acc + (Number(f.garduCount) || 0), 0);
    const avgLoadPercent = Math.round(filteredFeeders.reduce((acc, f) => acc + (f.loadPercent || 0), 0) / count);
    const avgVoltageKv = (filteredFeeders.reduce((acc, f) => acc + (f.voltageKv || 20), 0) / count).toFixed(2).replace('.', ',');
    const avgVoltageDev = (filteredFeeders.reduce((acc, f) => acc + (f.voltageDeviationPercent || 0), 0) / count).toFixed(1).replace('.', ',');

    const avgScoreKeandalan = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scoreKeandalan, 0) / count);
    const avgScoreTegangan = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scoreTegangan, 0) / count);
    const avgScoreBeban = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scoreBeban, 0) / count);
    const avgScorePeralatan = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scorePeralatan, 0) / count);
    const avgScoreGangguan = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scoreGangguan, 0) / count);
    const avgScorePemeliharaan = Math.round(filteredFeeders.reduce((acc, f) => acc + f.scorePemeliharaan, 0) / count);

    // Active in-scope SPKs (if a feeder is selected, only for that feeder; otherwise all SPKs)
    const inScopeSpk = selectedSpecificFeeder 
      ? spkList.filter(s => matchFeederName(s.feederName, selectedSpecificFeeder.name))
      : spkList;

    const spkTotal = inScopeSpk.length;
    const spkDone = inScopeSpk.filter(s => isSpkDone(s.status)).length;
    const spkInProcess = inScopeSpk.filter(s => isSpkInProcess(s.status)).length;
    const spkDraft = inScopeSpk.filter(s => isSpkPending(s.status)).length;
    const spkDonePercent = spkTotal > 0 ? Math.round((spkDone / spkTotal) * 100) : 100;

    const feedersWithTrips = filteredFeeders.filter(f => f.tripsCount > 0).length;

    const subs = Array.from(new Set(
      filteredFeeders
        .map(f => f.substation)
        .filter(s => s && s !== '-' && s !== 'GI Unknown')
    ));
    const substationsText = subs.length > 0 ? subs.join(' & ') : 'GI Passo & Sirimau';

    return {
      totalCustomers,
      totalCapacityMva: Number(totalCapacityMva.toFixed(1)),
      totalLengthKm: Number(totalLengthKm.toFixed(1)),
      totalLoadMw: Number(totalLoadMw.toFixed(2)),
      totalGardu,
      avgLoadPercent,
      avgVoltageKv,
      avgVoltageDev,
      avgScoreKeandalan,
      avgScoreTegangan,
      avgScoreBeban,
      avgScorePeralatan,
      avgScoreGangguan,
      avgScorePemeliharaan,
      spkDonePercent,
      spkTotal,
      spkDone,
      spkInProcess,
      spkDraft,
      feedersWithTrips,
      substationsText
    };
  }, [filteredFeeders, masterFeeders, spkList, selectedSpecificFeeder]);

  // SPK Stats for individual selected feeder
  const spkFeederStats = useMemo(() => {
    if (!selectedSpecificFeeder) return null;
    const fSpk = spkList.filter(s => matchFeederName(s.feederName, selectedSpecificFeeder.name));
    const done = fSpk.filter(s => isSpkDone(s.status)).length;
    const inProcess = fSpk.filter(s => isSpkInProcess(s.status)).length;
    const pending = fSpk.filter(s => isSpkPending(s.status)).length;
    const total = fSpk.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 100;
    return { done, inProcess, pending, total, percent, tasks: fSpk };
  }, [selectedSpecificFeeder, spkList]);

  // Realtime SPK list filtered by active feeder scope, status filter, and search query
  const displayedSpks = useMemo(() => {
    return spkList.filter(spk => {
      // 1. Feeder matching
      if (selectedSpecificFeeder && !matchFeederName(spk.feederName, selectedSpecificFeeder.name)) {
        return false;
      }
      // 2. Status matching
      if (spkStatusFilter === 'SELESAI' && !isSpkDone(spk.status)) return false;
      if (spkStatusFilter === 'PROSES' && !isSpkInProcess(spk.status)) return false;
      if (spkStatusFilter === 'PENDING' && !isSpkPending(spk.status)) return false;
      // 3. Search query
      if (spkSearchQuery.trim()) {
        const query = spkSearchQuery.toLowerCase();
        const num = (spk.spkNumber || '').toLowerCase();
        const fName = (spk.feederName || '').toLowerCase();
        const jPekerjaan = (spk.jobType || '').toLowerCase();
        const team = (spk.team || '').toLowerCase();
        const loc = (spk.location || '').toLowerCase();
        const desc = (spk.description || '').toLowerCase();
        if (!num.includes(query) && !fName.includes(query) && !jPekerjaan.includes(query) && !team.includes(query) && !loc.includes(query) && !desc.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [spkList, selectedSpecificFeeder, spkStatusFilter, spkSearchQuery]);

  // Total Trips Count in filtered scope
  const totalTripsScope = useMemo(() => {
    if (selectedFeeder === 'ALL') {
      return filteredTripsByPeriod.length;
    }
    return filteredTripsByPeriod.filter(t => matchFeederName(t.feederName, selectedFeeder)).length;
  }, [filteredTripsByPeriod, selectedFeeder]);

  // Aggregate Key Indicators (SAIDI, SAIFI, ENS)
  const totalSaidiHours = useMemo(() => {
    return filteredTripsByPeriod.reduce((acc, t) => {
      const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
      return acc + (saidi || 0);
    }, 0);
  }, [filteredTripsByPeriod, defaultTotalUlp]);

  const avgSaidiHours = useMemo(() => {
    return totalCount > 0 ? Number((totalSaidiHours / totalCount).toFixed(3)) : 0.045;
  }, [totalSaidiHours, totalCount]);

  const totalSaifiCount = useMemo(() => {
    return filteredTripsByPeriod.reduce((acc, t) => {
      const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
      return acc + (saifi || 0);
    }, 0);
  }, [filteredTripsByPeriod, defaultTotalUlp]);

  const avgSaifiCount = useMemo(() => {
    return totalCount > 0 ? Number((totalSaifiCount / totalCount).toFixed(3)) : 0.038;
  }, [totalSaifiCount, totalCount]);

  const totalEnsKwh = useMemo(() => {
    return filteredTripsByPeriod.reduce((acc, t) => acc + (t.ensKwh || 0), 0);
  }, [filteredTripsByPeriod]);

  const totalEnsJutaRupiah = useMemo(() => {
    // Standard PLN TDL Rp 1.444,7 / kWh
    return (totalEnsKwh * 1444.7) / 1000000;
  }, [totalEnsKwh]);

  // Relevant Trips for Findings Diagram (filtered by period and feeder selection)
  const relevantTripsForFindings = useMemo(() => {
    return filteredTripsByPeriod.filter(trip => {
      if (selectedFeeder === 'ALL') return true;
      return matchFeederName(trip.feederName, selectedFeeder);
    });
  }, [filteredTripsByPeriod, selectedFeeder]);

  // Calculate Breakdown Findings (I-1, I-2, I-3, I-4, E-1, E-2, E-3, E-4)
  const findingStats: FindingCategoryStat[] = useMemo(() => {
    const map: { [code: string]: {
      info: ReturnType<typeof normalizeFindingCategory>;
      count: number;
      durationMinutes: number;
      ensKwh: number;
      saidiHours: number;
    }} = {
      'I-1': { info: normalizeFindingCategory('I-1'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'I-2': { info: normalizeFindingCategory('I-2'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'I-3': { info: normalizeFindingCategory('I-3'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'I-4': { info: normalizeFindingCategory('I-4'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'E-1': { info: normalizeFindingCategory('E-1'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'E-2': { info: normalizeFindingCategory('E-2'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'E-3': { info: normalizeFindingCategory('E-3'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
      'E-4': { info: normalizeFindingCategory('E-4'), count: 0, durationMinutes: 0, ensKwh: 0, saidiHours: 0 },
    };

    if (relevantTripsForFindings.length > 0) {
      relevantTripsForFindings.forEach(trip => {
        const norm = normalizeFindingCategory(trip.category, trip.cause);
        const targetCode = norm.code in map ? norm.code : 'E-4';
        
        map[targetCode].count += 1;
        map[targetCode].durationMinutes += Number(trip.durationMinutes || 0);
        map[targetCode].ensKwh += Number(trip.ensKwh || 0);
        
        const saidi = trip.saidiHours ?? ((( (trip.durationMinutes || 0) / 60 ) * (trip.affectedCustomers || 0)) / (trip.totalUlpCustomers || defaultTotalUlp));
        map[targetCode].saidiHours += saidi;
      });
    }

    const grandTotalTrips = Object.values(map).reduce((acc, item) => acc + item.count, 0);

    return Object.keys(map).map(code => {
      const item = map[code];
      const percentage = grandTotalTrips > 0 ? Number(((item.count / grandTotalTrips) * 100).toFixed(1)) : 0;

      return {
        code,
        name: item.info.name,
        fullName: item.info.fullName,
        count: item.count,
        percentage,
        totalDurationMinutes: item.durationMinutes,
        totalEnsKwh: item.ensKwh,
        totalSaidiHours: Number(item.saidiHours.toFixed(3)),
        color: item.info.color,
        badgeBg: item.info.badgeBg,
        badgeText: item.info.badgeText,
        badgeBorder: item.info.badgeBorder,
        description: item.info.description
      };
    }).sort((a, b) => b.count - a.count);
  }, [relevantTripsForFindings, defaultTotalUlp]);

  // Grand total findings count
  const totalFindingsCount = useMemo(() => {
    return findingStats.reduce((acc, item) => acc + item.count, 0);
  }, [findingStats]);

  // Radar chart metrics for currently active feeder or system average
  const radarComponents = useMemo(() => {
    if (selectedSpecificFeeder) {
      return [
        { label: 'Keandalan (SAIDI/SAIFI)', value: selectedSpecificFeeder.scoreKeandalan },
        { label: 'Kualitas Tegangan', value: selectedSpecificFeeder.scoreTegangan },
        { label: 'Beban', value: selectedSpecificFeeder.scoreBeban },
        { label: 'Kondisi Peralatan', value: selectedSpecificFeeder.scorePeralatan },
        { label: 'Gangguan', value: selectedSpecificFeeder.scoreGangguan },
        { label: 'Pemeliharaan', value: selectedSpecificFeeder.scorePemeliharaan },
      ];
    }
    return [
      { label: 'Keandalan (SAIDI/SAIFI)', value: systemStats.avgScoreKeandalan },
      { label: 'Kualitas Tegangan', value: systemStats.avgScoreTegangan },
      { label: 'Beban', value: systemStats.avgScoreBeban },
      { label: 'Kondisi Peralatan', value: systemStats.avgScorePeralatan },
      { label: 'Gangguan', value: systemStats.avgScoreGangguan },
      { label: 'Pemeliharaan', value: systemStats.avgScorePemeliharaan },
    ];
  }, [selectedSpecificFeeder, systemStats]);

  // Radar chart helper coordinates
  const radarCenter = { x: 130, y: 130 };
  const radarRadius = 85;
  const radarAngles = [ -90, -30, 30, 90, 150, 210 ];

  const getPoint = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: radarCenter.x + radius * Math.cos(rad),
      y: radarCenter.y + radius * Math.sin(rad)
    };
  };

  const radarPolygonPoints = radarComponents.map((comp, idx) => {
    const r = (comp.value / 100) * radarRadius;
    const pt = getPoint(radarAngles[idx], r);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Slices for Donut / Pie Chart SVG
  const pieSlices = useMemo(() => {
    let currentAngle = 0;
    return findingStats.map(stat => {
      const sliceAngle = totalFindingsCount > 0 ? (stat.count / totalFindingsCount) * 360 : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const pathData = describeArc(130, 130, 68, 115, startAngle, endAngle);
      const isSelected = selectedFindingCode === stat.code;

      return {
        ...stat,
        startAngle,
        endAngle,
        pathData,
        isSelected
      };
    });
  }, [findingStats, totalFindingsCount, selectedFindingCode]);

  const feederSelectOptions = useMemo(() => [
    { value: 'ALL', label: '⚡ Semua Feeder' },
    ...feederOptions.map(fName => ({ value: fName, label: fName }))
  ], [feederOptions]);

  const monthSelectOptions = useMemo(() => 
    monthOptions.map(m => ({ value: m.value, label: m.label })),
  [monthOptions]);

  const yearSelectOptions = useMemo(() => [
    { value: 'ALL', label: 'Semua Tahun' },
    ...yearOptions.map(yr => ({ value: yr, label: yr }))
  ], [yearOptions]);

  // Date parser helper for FeederTrip
  const getTripYearMonth = (t: FeederTrip) => {
    const rawDate = t.tripDate || (t as any).date || '';
    if (!rawDate) return { year: '', month: '' };
    const str = String(rawDate).trim();
    const parts = str.split('T')[0].split(/[-/]/);
    if (parts.length >= 2 && parts[0].length === 4) {
      return { year: parts[0], month: parts[1].padStart(2, '0') };
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return {
        year: String(d.getFullYear()),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    }
    return { year: '', month: '' };
  };

  // Calculate monthly outage counts and metrics for the trend chart accurately from real-time trips
  const monthlyOutageTrend = useMemo(() => {
    const monthList = [
      { code: '01', name: 'Jan', fullName: 'Januari' },
      { code: '02', name: 'Feb', fullName: 'Februari' },
      { code: '03', name: 'Mar', fullName: 'Maret' },
      { code: '04', name: 'Apr', fullName: 'April' },
      { code: '05', name: 'Mei', fullName: 'Mei' },
      { code: '06', name: 'Jun', fullName: 'Juni' },
      { code: '07', name: 'Jul', fullName: 'Juli' },
      { code: '08', name: 'Ags', fullName: 'Agustus' },
      { code: '09', name: 'Sep', fullName: 'September' },
      { code: '10', name: 'Okt', fullName: 'Oktober' },
      { code: '11', name: 'Nov', fullName: 'November' },
      { code: '12', name: 'Des', fullName: 'Desember' }
    ];

    // Filter trips matching selected feeder and year scope
    const tripsInScope = trips.filter(t => {
      const { year: tYear } = getTripYearMonth(t);
      const matchesFeeder = selectedFeeder === 'ALL' || matchFeederName(t.feederName, selectedFeeder);
      const matchesYear = selectedYear === 'ALL' || tYear === selectedYear;
      return matchesFeeder && matchesYear;
    });

    return monthList.map((m) => {
      let count = 0;
      let totalSaidi = 0;
      let totalEns = 0;
      let totalFinancialLoss = 0;

      const matchingTrips = tripsInScope.filter(t => {
        const { month: tMonth } = getTripYearMonth(t);
        return tMonth === m.code;
      });

      count = matchingTrips.length;
      matchingTrips.forEach(t => {
        const saidi = t.saidiHours ?? (
          (((t.durationMinutes || 0) / 60) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp)
        );
        totalSaidi += (saidi || 0);
        totalEns += (t.ensKwh || 0);
        totalFinancialLoss += (t.financialLossIdr || 0);
      });

      const categoryInfo = getHealthCategory(count);

      return {
        monthCode: m.code,
        month: m.name,
        fullName: m.fullName,
        count,
        saidiHours: Number(totalSaidi.toFixed(3)),
        ensKwh: Math.round(totalEns),
        financialLossIdr: Math.round(totalFinancialLoss),
        categoryInfo,
        isTargetExceeded: count > 1
      };
    });
  }, [trips, selectedFeeder, selectedYear, defaultTotalUlp]);

  const totalYearTrips = useMemo(() => {
    return monthlyOutageTrend.reduce((acc, m) => acc + m.count, 0);
  }, [monthlyOutageTrend]);

  const peakMonth = useMemo(() => {
    let maxObj = monthlyOutageTrend[0];
    monthlyOutageTrend.forEach(m => {
      if (m.count > maxObj.count) maxObj = m;
    });
    return maxObj;
  }, [monthlyOutageTrend]);

  const avgMonthlyTrips = useMemo(() => {
    return (totalYearTrips / 12).toFixed(1);
  }, [totalYearTrips]);

  const monthsWithTripsCount = useMemo(() => {
    return monthlyOutageTrend.filter(m => m.count > 0).length;
  }, [monthlyOutageTrend]);

  const CustomMonthlyTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
            <span className="font-black text-white text-sm">{data.fullName} {selectedYear === 'ALL' ? '2026' : selectedYear}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${data.categoryInfo.badgeBg} ${data.categoryInfo.badgeText} border ${data.categoryInfo.badgeBorder}`}>
              {data.categoryInfo.label}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-slate-400">Frekuensi Gangguan:</span>
            <span className="font-black text-rose-400 text-sm">{data.count} Kali (Trip)</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Indeks SAIDI:</span>
            <span className="font-bold text-blue-400">{data.saidiHours.toFixed(3)} Jam/Plg</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Energy Loss (ENS):</span>
            <span className="font-bold text-amber-300">{data.ensKwh.toLocaleString('id-ID')} kWh</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-3.5 font-sans text-slate-100 min-h-screen p-1 sm:p-2 select-none ${
      isDarkMode ? 'bg-[#070e1e]' : 'bg-slate-900'
    }`}>
      {/* ========================================================================= */}
      {/* 0. FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-md flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Feeder Filter */}
          <CustomSelect
            value={selectedFeeder}
            onChange={(val) => setSelectedFeeder(val)}
            options={feederSelectOptions}
            activeColor="emerald"
            showSearch
            searchPlaceholder="Cari Feeder..."
          />

          {/* Filter Bulan */}
          <CustomSelect
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val)}
            options={monthSelectOptions}
            activeColor="emerald"
          />

          {/* Filter Tahun */}
          <CustomSelect
            value={selectedYear}
            onChange={(val) => setSelectedYear(val)}
            options={yearSelectOptions}
            activeColor="amber"
          />

          {/* Reset Filter Button */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-700 active:scale-95"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Filter Summary Badge */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
          <span className="hidden md:inline">Terfilter:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-extrabold font-mono">
            {filteredFeeders.length} / {calculatedFeeders.length} Feeder
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP STATS ROW (HEALTH INDEX + FREKUENSI GANGGUAN + SAIDI + SAIFI + ENS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Rata-Rata Health Index */}
        <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase block">
                RATA-RATA HEALTH INDEX
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  {avgHealthIndex.toString().replace('.', ',')}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-semibold text-slate-400">Status Sistem:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  avgCategory === 'SEMPURNA' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  avgCategory === 'SEHAT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  avgCategory === 'SAKIT' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' :
                  'bg-black text-slate-200 border border-slate-700'
                }`}>
                  {avgCategory}
                </span>
              </div>
            </div>

            {/* Pulse Gauge Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${avgHealthIndex}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Standar PLN ULP Baguala</span>
            <span className="text-emerald-400 font-bold">{totalCount} Feeder Terpantau</span>
          </div>
        </div>

        {/* Card 2: JUMLAH FREKUENSI X GANGGUAN */}
        <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-300">
                FREKUENSI GANGGUAN
              </span>
              <Zap className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">
                {totalTripsScope}
              </span>
              <span className="text-xs font-bold text-slate-400">kali (Trip)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Rata-rata: <span className="font-bold text-white">{totalCount > 0 ? (totalTripsScope / totalCount).toFixed(1) : 0}x</span> / feeder
            </p>
          </div>

          <div className={`pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-bold ${
            (totalCount > 0 ? totalTripsScope / totalCount : 0) > 1.0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            <span className="flex items-center gap-0.5">
              {(totalCount > 0 ? totalTripsScope / totalCount : 0) > 1.0 ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Melampaui Target
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  On Target
                </>
              )}
            </span>
            <span className="text-slate-400 font-normal">Target: &lt; 1x/fd</span>
          </div>
        </div>

        {/* Card 3: INDEKS KEANDALAN SAIDI */}
        <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-300">
                SAIDI (DURASI)
              </span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-400">
                {totalSaidiHours.toFixed(3).replace('.', ',')}
              </span>
              <span className="text-xs font-bold text-slate-400">Jam/Plg</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Durasi: <span className="font-bold text-white">{(totalSaidiHours * 60).toFixed(1)}</span> Menit/Plg
            </p>
          </div>

          <div className={`pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-bold ${
            totalSaidiHours > 6.00 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            <span className="flex items-center gap-0.5">
              {totalSaidiHours > 6.00 ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Melampaui Target
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  On Target
                </>
              )}
            </span>
            <span className="text-slate-400 font-normal">Target: 6.00 Jam</span>
          </div>
        </div>

        {/* Card 4: INDEKS KEANDALAN SAIFI */}
        <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-cyan-400 mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-300">
                SAIFI (FREKUENSI)
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                {totalSaifiCount.toFixed(3).replace('.', ',')}
              </span>
              <span className="text-xs font-bold text-slate-400">Kali/Plg</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Rata-rata/Feeder: <span className="font-bold text-white">{avgSaifiCount.toFixed(3)}</span> Kali
            </p>
          </div>

          <div className={`pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-bold ${
            totalSaifiCount > 3.00 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            <span className="flex items-center gap-0.5">
              {totalSaifiCount > 3.00 ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Melampaui Target
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  On Target
                </>
              )}
            </span>
            <span className="text-slate-400 font-normal">Target: 3.00 Kali</span>
          </div>
        </div>

        {/* Card 5: INDEKS KEANDALAN ENS (ENERGY NOT SUPPLIED) */}
        <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-300">
                ENS (ENERGY LOSS)
              </span>
              <Gauge className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {totalEnsKwh > 1000 ? (totalEnsKwh / 1000).toFixed(1) : totalEnsKwh.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-slate-400">{totalEnsKwh > 1000 ? 'MWh' : 'kWh'}</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Est. Kerugian: <span className="font-bold text-amber-300">Rp {totalEnsJutaRupiah.toFixed(1)} Jt</span>
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-medium text-slate-400">
            <span>Tarif TDL: Rp 1.444,7</span>
            <span className="text-amber-400 font-bold">{totalEnsKwh.toLocaleString('id-ID')} kWh</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY PILLS BAR (SEMPURNA, SEHAT, SAKIT, KRONIS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Sempurna */}
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'SEMPURNA' ? 'ALL' : 'SEMPURNA')}
          className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
            categoryFilter === 'SEMPURNA' 
              ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30' 
              : 'bg-[#0c162d] border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-black text-emerald-400 block uppercase">0 = SEMPURNA (HIJAU)</span>
              <span className="text-[10px] text-slate-400">0 Gangguan</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-emerald-400">{sempurnaCount}</span>
            <span className="text-[10px] font-bold text-emerald-400/80 ml-1">({sempurnaPercent}%)</span>
          </div>
        </div>

        {/* Sehat */}
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'SEHAT' ? 'ALL' : 'SEHAT')}
          className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
            categoryFilter === 'SEHAT' 
              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30' 
              : 'bg-[#0c162d] border-slate-800 hover:border-amber-400/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] font-black text-amber-400 block uppercase">1-3 = SEHAT (KUNING)</span>
              <span className="text-[10px] text-slate-400">1-3x Trip</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-amber-400">{sehatCount}</span>
            <span className="text-[10px] font-bold text-amber-400/80 ml-1">({sehatPercent}%)</span>
          </div>
        </div>

        {/* Sakit */}
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'SAKIT' ? 'ALL' : 'SAKIT')}
          className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
            categoryFilter === 'SAKIT' 
              ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30' 
              : 'bg-[#0c162d] border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <div>
              <span className="text-[11px] font-black text-rose-400 block uppercase">4-6 = SAKIT (MERAH)</span>
              <span className="text-[10px] text-slate-400">4-6x Trip</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-rose-500">{sakitCount}</span>
            <span className="text-[10px] font-bold text-rose-400 ml-1">({sakitPercent}%)</span>
          </div>
        </div>

        {/* Kronis */}
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'KRONIS' ? 'ALL' : 'KRONIS')}
          className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
            categoryFilter === 'KRONIS' 
              ? 'bg-slate-800 border-slate-400 ring-2 ring-slate-400/30' 
              : 'bg-[#0c162d] border-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300 ring-2 ring-black shrink-0" />
            <div>
              <span className="text-[11px] font-black text-slate-300 block uppercase">&gt;6 = KRONIS (HITAM)</span>
              <span className="text-[10px] text-slate-400">&gt;6x Trip</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-slate-200">{kronisCount}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-1">({kronisPercent}%)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5 GRAFIK TREN GANGGUAN */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg space-y-4">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  GRAFIK TREN GANGGUAN
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                  {selectedYear === 'ALL' ? 'Semua Tahun Data' : `Tahun ${selectedYear}`}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Realtime Database
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Monitoring tren frekuensi pemadaman / trip SUTM per bulan secara realtime untuk {selectedFeeder !== 'ALL' ? `Penyulang ${selectedFeeder}` : 'semua penyulang (ULP Baguala)'}.
              </p>
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">TOTAL TRIP</span>
              <span className="text-sm font-black text-rose-400">{totalYearTrips} <span className="text-[10px] font-normal text-slate-400">Kali</span></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">BULAN PEAK</span>
              <span className="text-sm font-black text-amber-400">{peakMonth.count > 0 ? `${peakMonth.month} (${peakMonth.count}x)` : 'Nihil'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">RATA-RATA</span>
              <span className="text-sm font-black text-cyan-400">{avgMonthlyTrips} <span className="text-[10px] font-normal text-slate-400">x/bln</span></span>
            </div>
          </div>
        </div>

        {/* Main Chart + Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Chart (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyOutageTrend} margin={{ top: 20, right: 15, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="barGradientWarning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="barGradientDanger" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    allowDecimals={false} 
                  />
                  <RechartsTooltip content={<CustomMonthlyTrendTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    fill="url(#trendAreaGradient)" 
                    stroke="none" 
                  />
                  <Bar dataKey="count" name="Jumlah Gangguan" radius={[8, 8, 0, 0]} maxBarSize={38}>
                    {monthlyOutageTrend.map((entry, index) => {
                      const fill = entry.count === 0 
                        ? '#1e293b' 
                        : entry.count <= 1 
                        ? 'url(#barGradientNormal)' 
                        : entry.count <= 3 
                        ? 'url(#barGradientWarning)' 
                        : 'url(#barGradientDanger)';
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={fill} 
                          stroke={entry.monthCode === selectedMonth ? '#10b981' : 'transparent'} 
                          strokeWidth={2}
                          className="cursor-pointer transition-all hover:opacity-80"
                          onClick={() => setSelectedMonth(selectedMonth === entry.monthCode ? 'ALL' : entry.monthCode)}
                        />
                      );
                    })}
                  </Bar>
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Trenline Gangguan" 
                    stroke="#38bdf8" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#38bdf8', stroke: '#0c162d', strokeWidth: 2 }} 
                    activeDot={{ r: 7, fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2 }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Legend & Month Filter hint */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
                  <span>0-1 Gangguan (Sehat)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                  <span>2-3 Gangguan (Waspada)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                  <span>&gt;3 Gangguan (Sakit/Kronis)</span>
                </span>
              </div>
              <span className="text-slate-500 italic">* Klik batang bulan untuk memfilter data pada bulan tersebut</span>
            </div>
          </div>

          {/* Monthly Breakdown List (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="text-[11px] font-black uppercase text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rincian Bulanan</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-400">
                  {monthsWithTripsCount} Bulan Terjadi Trip
                </span>
              </div>

              {/* List of 12 months */}
              <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {monthlyOutageTrend.map((m) => {
                  const isSelected = selectedMonth === m.monthCode;
                  return (
                    <div 
                      key={m.monthCode}
                      onClick={() => setSelectedMonth(selectedMonth === m.monthCode ? 'ALL' : m.monthCode)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30' 
                          : m.count > 0 
                          ? 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 text-slate-200' 
                          : 'bg-slate-900/40 border-slate-800/50 text-slate-500 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${m.count === 0 ? 'bg-slate-700' : m.categoryInfo.dotColor}`} />
                        <span className="font-bold text-[11px]">{m.fullName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {m.count > 0 && (
                          <span className="text-[9.5px] font-mono text-slate-400">
                            SAIDI: {m.saidiHours.toFixed(2)}j
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          m.count === 0 
                            ? 'bg-slate-800 text-slate-400' 
                            : m.categoryInfo.badgeBg + ' ' + m.categoryInfo.badgeText
                        }`}>
                          {m.count} Trip
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mini Summary Footnote */}
            <div className="pt-2 mt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Evaluasi Target Kinerja PLN</span>
              <span className="text-emerald-400 font-bold">Target &lt; 1 Kali/Penyulang/Bln</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE ROW (INDEX BERDASARKAN TEMUAN & HEALTH INDEX FEEDERS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* PANEL 1: INDEX BERDASARKAN TEMUAN (5 of 12 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  INDEX BERDASARKAN TEMUAN
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                Total {totalFindingsCount} Kasus
              </span>
            </div>

            <p className="text-[10px] text-slate-400 mb-3">
              Distribusi penyebab dan temuan inspeksi gangguan feeder {selectedFeeder !== 'ALL' ? `(${selectedFeeder})` : 'semua penyulang'}.
            </p>

            {/* Donut Chart and Interactive Center Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              
              {/* SVG Donut Chart (5 of 12) */}
              <div className="sm:col-span-5 flex items-center justify-center relative">
                <svg className="w-48 h-48 sm:w-44 sm:h-44 overflow-visible" viewBox="0 0 260 260">
                  {totalFindingsCount === 0 ? (
                    <circle cx="130" cy="130" r="85" fill="none" stroke="#1e293b" strokeWidth="26" strokeDasharray="6 6" />
                  ) : (
                    /* Slices */
                    pieSlices.map((slice) => (
                      <path
                        key={slice.code}
                        d={slice.pathData}
                        fill={slice.color}
                        fillOpacity={selectedFindingCode === null || selectedFindingCode === slice.code ? 0.9 : 0.25}
                        stroke="#0c162d"
                        strokeWidth={slice.isSelected ? 3 : 1.5}
                        className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 origin-center"
                        onClick={() => setSelectedFindingCode(selectedFindingCode === slice.code ? null : slice.code)}
                      />
                    ))
                  )}

                  {/* Inner Circle Glow Ring */}
                  <circle cx="130" cy="130" r="66" fill="#0c162d" stroke="#1e293b" strokeWidth="1" />
                </svg>

                {/* Center Badge with Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {selectedFindingCode ? (
                    (() => {
                      const sel = findingStats.find(f => f.code === selectedFindingCode);
                      return (
                        <div className="text-center px-1">
                          <span className="text-[10px] font-black text-slate-400 block">{sel?.code}</span>
                          <span className="text-xl font-black text-white">{sel?.percentage}%</span>
                          <span className="text-[9px] font-bold text-emerald-400 block">{sel?.count}x Trip</span>
                        </div>
                      );
                    })()
                  ) : totalFindingsCount > 0 ? (
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">TOTAL TEMUAN</span>
                      <span className="text-2xl font-black text-white tracking-tight">{totalFindingsCount}</span>
                      <span className="text-[9px] font-semibold text-emerald-400 block">100% Data</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">TOTAL TEMUAN</span>
                      <span className="text-2xl font-black text-slate-400 tracking-tight">0</span>
                      <span className="text-[9px] font-semibold text-slate-500 block">Nihil Gangguan</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend List & Percentage Bars (7 of 12) */}
              <div className="sm:col-span-7 space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {findingStats.map((item) => {
                  const isSelected = selectedFindingCode === item.code;
                  return (
                    <div 
                      key={item.code}
                      onClick={() => setSelectedFindingCode(selectedFindingCode === item.code ? null : item.code)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                        isSelected 
                          ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/30' 
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black text-slate-200 truncate">{item.code}</span>
                            <span className="text-[9px] text-slate-400 truncate max-w-[85px]">{item.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Count & Percentage */}
                      <div className="text-right shrink-0 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">{item.count}x</span>
                        <span 
                          className="px-1.5 py-0.2 rounded text-[10px] font-black text-white"
                          style={{ backgroundColor: `${item.color}33`, borderColor: `${item.color}66`, borderWidth: '1px' }}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Selected Finding Detail Banner */}
            {selectedFindingCode && (
              (() => {
                const sel = findingStats.find(f => f.code === selectedFindingCode);
                if (!sel) return null;
                return (
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-[10px] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{sel.fullName}</span>
                      <span className="text-slate-400 block">{sel.description}</span>
                    </div>
                    <button
                      onClick={() => setSelectedFindingCode(null)}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 ml-2 shrink-0 cursor-pointer"
                    >
                      Reset Fokus
                    </button>
                  </div>
                );
              })()
            )}
          </div>

          {/* Footer Legend Note */}
          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
            <span>Standar Klasifikasi Gangguan PLN Distribusi</span>
            <span className="text-emerald-400 font-bold">Korelasi Indeks Keandalan</span>
          </div>
        </div>

        {/* PANEL 2: DAFTAR HEALTH INDEX & KEANDALAN PER PENYULANG (7 of 12 cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  HEALTH INDEX & INDEKS KEANDALAN PER PENYULANG
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                {displayedFeeders.length} / {filteredFeeders.length} Feeder
              </span>
            </div>

            <p className="text-[10px] text-slate-400 mb-3">
              Perbandingan Skor Health Index (0-100), Frekuensi Gangguan, SAIDI (Jam), SAIFI (Kali), dan ENS (kWh).
            </p>

            {/* Feeders Table Header */}
            <div className="grid grid-cols-12 gap-1 px-2 py-1 bg-slate-900/90 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              <div className="col-span-4">Penyulang & Sumber</div>
              <div className="col-span-2 text-center">Status & Trip</div>
              <div className="col-span-4 text-center">Indeks Keandalan (SAIDI / SAIFI / ENS)</div>
              <div className="col-span-2 text-right">Skor (0-100)</div>
            </div>              {/* List of Feeders */}
            <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {displayedFeeders.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 font-bold">
                  Tidak ada data penyulang yang cocok dengan pencarian / filter.
                </div>
              ) : (
                displayedFeeders.map((feeder) => {
                  const isSelected = selectedSpecificFeeder?.id === feeder.id;
                  const cat = feeder.healthCategory;

                  return (
                    <div 
                      key={feeder.id}
                      onClick={() => setSelectedFeederId(prev => prev === feeder.id ? '' : feeder.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer grid grid-cols-12 gap-1 items-center group ${
                        isSelected 
                          ? 'bg-slate-800/95 ring-1 ring-emerald-500/60 shadow-xs' 
                          : 'bg-slate-900/40 hover:bg-slate-800/50 border border-slate-800/60'
                      }`}
                    >
                      {/* Feeder Name & GI (4 of 12) */}
                      <div className="col-span-4 min-w-0 pr-1">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dotColor}`} />
                          <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate" title={feeder.name}>
                            {feeder.name.startsWith('Penyulang') ? feeder.name : `Penyulang ${feeder.name}`}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block truncate pl-3" title={`${feeder.substation} ${feeder.garduHubung ? `• ${feeder.garduHubung}` : ''}`}>
                          {feeder.substation} {feeder.garduHubung ? `• ${feeder.garduHubung}` : ''}
                        </span>
                      </div>

                      {/* Status & Trip Count (2 of 12) */}
                      <div className="col-span-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black shrink-0 border inline-block ${cat.badgeBg} ${cat.badgeText} ${cat.badgeBorder}`}>
                          {feeder.tripsCount}x {cat.label}
                        </span>
                      </div>

                      {/* SAIDI, SAIFI, ENS (4 of 12) */}
                      <div className="col-span-4 text-center px-1">
                        <div className="flex items-center justify-center gap-2 text-[9.5px]">
                          <span className="text-blue-300 font-bold" title="SAIDI (Jam/Plg)">
                            {feeder.totalSaidiHours.toFixed(2)} j
                          </span>
                          <span className="text-slate-500">|</span>
                          <span className="text-cyan-300 font-bold" title="SAIFI (Kali/Plg)">
                            {feeder.totalSaifiCount.toFixed(2)} k
                          </span>
                          <span className="text-slate-500">|</span>
                          <span className="text-amber-300 font-bold truncate" title="ENS (kWh)">
                            {feeder.totalEnsKwh.toLocaleString('id-ID')} kWh
                          </span>
                        </div>
                        {/* Mini Visual Bar */}
                        <div className="w-full h-1.5 rounded bg-slate-800 mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded ${cat.barBg}`}
                            style={{ width: `${Math.min(100, Math.max(8, feeder.overallScore))}%` }}
                          />
                        </div>
                      </div>

                      {/* Health Index Score (2 of 12) */}
                      <div className="col-span-2 text-right">
                        <span className="font-mono text-xs font-black text-white group-hover:text-emerald-400">
                          {feeder.overallScore.toString().replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Scale Legend (0, 50, 100) */}
          <div className="pt-2 mt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold text-slate-400 px-1">
            <span>Standar: 0x (Sempurna) | 1-3x (Sehat) | 4-6x (Sakit) | &gt;6x (Kronis)</span>
            <div className="flex items-center gap-2">
              {categoryFilter !== 'ALL' && (
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  Reset Filter ({categoryFilter})
                </button>
              )}
              {selectedSpecificFeeder ? (
                <button
                  onClick={() => setSelectedFeederId('')}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Penyulang: <strong className="text-white">{selectedSpecificFeeder.name}</strong></span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Tampilkan Semua</span>
                </button>
              ) : (
                <span className="text-slate-400">Rangkuman: <strong className="text-emerald-400">Semua {filteredFeeders.length} Feeder</strong></span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ROW (KOMPONEN RADAR, RINGKASAN INDIKATOR, DETAIL PENYULANG/SISTEM) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* PANEL 1: KOMPONEN PENILAIAN HEALTH INDEX (RADAR) (4 of 12 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                KOMPONEN PENILAIAN HEALTH INDEX
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                selectedSpecificFeeder
                  ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {selectedSpecificFeeder ? `Penyulang ${selectedSpecificFeeder.name}` : `Semua Feeder (${filteredFeeders.length} Feeder)`}
              </span>
            </div>

            {/* Custom SVG Radar Chart */}
            <div className="relative w-full h-[220px] flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 260 260">
                {/* Concentric Grid Rings */}
                {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => {
                  const ringPoints = radarAngles.map(ang => {
                    const pt = getPoint(ang, radarRadius * level);
                    return `${pt.x},${pt.y}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={lIdx}
                      points={ringPoints}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Spoke Axis Lines */}
                {radarAngles.map((ang, sIdx) => {
                  const pt = getPoint(ang, radarRadius);
                  return (
                    <line
                      key={sIdx}
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* The Radar Polygon Filled Area */}
                <polygon
                  points={radarPolygonPoints}
                  fill="#10b981"
                  fillOpacity="0.25"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Vertices Dots */}
                {radarComponents.map((comp, idx) => {
                  const r = (comp.value / 100) * radarRadius;
                  const pt = getPoint(radarAngles[idx], r);
                  return (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#10b981"
                      stroke="#0c162d"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Axis Labels */}
                <text x="130" y="24" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Keandalan (SAIDI/SAIFI)
                </text>
                <text x="225" y="85" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  <tspan x="220" dy="0">Kualitas</tspan>
                  <tspan x="220" dy="10">Tegangan</tspan>
                </text>
                <text x="215" y="190" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Beban
                </text>
                <text x="130" y="248" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Kondisi Peralatan
                </text>
                <text x="35" y="190" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Gangguan
                </text>
                <text x="35" y="85" fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Pemeliharaan
                </text>
              </svg>
            </div>
          </div>

          <div className="text-[9.5px] text-slate-400 text-center pt-1 border-t border-slate-800/60">
            Komposisi Bobot: Keandalan 25% | Peralatan 20% | Pemeliharaan 20% | Beban 15% | Tegangan 10% | Gangguan 10%
          </div>
        </div>

        {/* PANEL 2: RINGKASAN INDIKATOR UTAMA (4 of 12 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                RINGKASAN INDIKATOR UTAMA {selectedSpecificFeeder ? `(${selectedSpecificFeeder.name})` : '(SEMUA FEEDER)'}
              </h3>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                {selectedSpecificFeeder ? 'Live Feeder' : 'Live Sistem'}
              </span>
            </div>

            {/* 2x3 Metric Cards Grid - Enhanced Larger Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* 1. Keandalan (SAIDI) */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-blue-500/20 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-blue-400 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">SAIDI</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder 
                      ? selectedSpecificFeeder.totalSaidiHours.toFixed(3).replace('.', ',') 
                      : totalSaidiHours.toFixed(3).replace('.', ',')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">jam</span>
                </div>
                <div className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <span>⚡ {((selectedSpecificFeeder ? selectedSpecificFeeder.totalSaidiHours : totalSaidiHours) * 60).toFixed(1)} mnt/plg</span>
                </div>
              </div>

              {/* 2. Keandalan (SAIFI) */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-cyan-400 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">SAIFI</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder 
                      ? selectedSpecificFeeder.totalSaifiCount.toFixed(3).replace('.', ',') 
                      : totalSaifiCount.toFixed(3).replace('.', ',')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">kali</span>
                </div>
                <div className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <span>✓ {selectedSpecificFeeder ? `${selectedSpecificFeeder.tripsCount}x Gangguan` : `${totalTripsScope}x Total Trip`}</span>
                </div>
              </div>

              {/* 3. Kualitas Tegangan */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-indigo-400 mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Tegangan</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder 
                      ? selectedSpecificFeeder.voltageKv.toString().replace('.', ',') 
                      : systemStats.avgVoltageKv}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">kV</span>
                </div>
                <div className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <span>Deviasi {selectedSpecificFeeder ? selectedSpecificFeeder.voltageDeviationPercent : systemStats.avgVoltageDev}%</span>
                </div>
              </div>

              {/* 4. Beban (Loading) */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-emerald-400 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Beban</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder 
                      ? selectedSpecificFeeder.loadPercent 
                      : systemStats.avgLoadPercent}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">%</span>
                </div>
                <div className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <span>{selectedSpecificFeeder ? `${selectedSpecificFeeder.loadMw} MW` : `Total ${systemStats.totalLoadMw} MW`}</span>
                </div>
              </div>

              {/* 5. Gangguan (Frekuensi) */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-rose-500/20 hover:border-rose-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-rose-400 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Frekuensi</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder ? selectedSpecificFeeder.tripsCount : totalTripsScope}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">kali</span>
                </div>
                <div className="text-[9.5px] font-bold text-rose-400 flex items-center gap-1">
                  <span>{selectedSpecificFeeder ? `${selectedSpecificFeeder.tripsCount}x Gangguan Feeder` : `${systemStats.feedersWithTrips} Feeder Terdampak`}</span>
                </div>
              </div>

              {/* 6. Pemeliharaan (SPK ROW) */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-teal-500/20 hover:border-teal-500/40 transition-all flex flex-col justify-between shadow-xs">
                <div className="flex items-center gap-1 text-teal-400 mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">SPK ROW</span>
                </div>
                <div className="my-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedSpecificFeeder ? (spkFeederStats?.percent ?? 100) : systemStats.spkDonePercent}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">%</span>
                </div>
                <div className="text-[9.5px] font-bold text-teal-400 flex items-center gap-1">
                  <span>{selectedSpecificFeeder ? `Selesai ${spkFeederStats?.done ?? 0}/${spkFeederStats?.total ?? 0} SPK` : `Kepatuhan ${systemStats.spkDone}/${systemStats.spkTotal} SPK (${systemStats.spkInProcess} Proses)`}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-2.5 mt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px] text-slate-400">
            <span>Evaluasi Mutu Layanan ULP Baguala</span>
            <span className="text-emerald-400 font-bold">Standar Recovery &lt; 2 Jam</span>
          </div>
        </div>

        {/* PANEL 3: DETAIL PENYULANG (TERPILIH) / DETAIL SISTEM (SEMUA FEEDER) (4 of 12 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                {selectedSpecificFeeder ? 'DETAIL PENYULANG (TERPILIH)' : 'DETAIL SISTEM (SEMUA FEEDER)'}
              </h3>
              {selectedSpecificFeeder ? (
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${selectedSpecificFeeder.healthCategory.badgeBg} ${selectedSpecificFeeder.healthCategory.badgeText} ${selectedSpecificFeeder.healthCategory.badgeBorder}`}>
                  Penyulang {selectedSpecificFeeder.name}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                  {filteredFeeders.length} Feeder ULP Baguala
                </span>
              )}
            </div>

            {/* Content 2-Column: Left Data Table (8 of 12), Right Electrical Schema (4 of 12) */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              
              {/* Left Parameters Table (8 of 12) */}
              <div className="col-span-8 space-y-1.5 pr-2">
                
                {/* Health Index */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Health Index</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-white text-sm">
                      {selectedSpecificFeeder 
                        ? selectedSpecificFeeder.overallScore.toString().replace('.', ',') 
                        : avgHealthIndex.toString().replace('.', ',')}
                    </span>
                    {selectedSpecificFeeder ? (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${selectedSpecificFeeder.healthCategory.badgeBg} ${selectedSpecificFeeder.healthCategory.badgeText} ${selectedSpecificFeeder.healthCategory.badgeBorder}`}>
                        {selectedSpecificFeeder.healthCategory.label} ({selectedSpecificFeeder.tripsCount}x)
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                        {avgCategory} ({sempurnaCount} Sempurna, {sehatCount} Sehat{sakitCount > 0 ? `, ${sakitCount} Sakit` : ''}{kronisCount > 0 ? `, ${kronisCount} Kronis` : ''})
                      </span>
                    )}
                  </div>
                </div>

                {/* Frekuensi Gangguan */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Frekuensi Trip</span>
                  <span className="font-bold text-rose-400">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.tripsCount} Kali Gangguan` 
                      : `${totalTripsScope} Kali Gangguan (${systemStats.feedersWithTrips} Feeder Terdampak)`}
                  </span>
                </div>

                {/* Keandalan SAIDI & SAIFI */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">SAIDI / SAIFI</span>
                  <span className="font-bold text-slate-200">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.totalSaidiHours.toFixed(3).replace('.', ',')} j / ${selectedSpecificFeeder.totalSaifiCount.toFixed(3).replace('.', ',')} k` 
                      : `Total ${totalSaidiHours.toFixed(3).replace('.', ',')} j / ${totalSaifiCount.toFixed(3).replace('.', ',')} k`}
                  </span>
                </div>

                {/* Total ENS */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">ENS Feeder</span>
                  <span className="font-bold text-amber-300">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.totalEnsKwh.toLocaleString('id-ID')} kWh` 
                      : `${totalEnsKwh.toLocaleString('id-ID')} kWh (Rp ${totalEnsJutaRupiah.toFixed(1)} Jt)`}
                  </span>
                </div>

                {/* Tegangan Rata-rata */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Tegangan Rata-rata</span>
                  <span className="font-bold text-slate-200">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.voltageKv.toString().replace('.', ',')} kV` 
                      : `${systemStats.avgVoltageKv} kV (Nominal 20 kV)`}
                  </span>
                </div>

                {/* Beban Saat Ini */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Beban</span>
                  <span className="font-bold text-slate-200">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.loadMw.toString().replace('.', ',')} MW (${selectedSpecificFeeder.loadPercent}%)` 
                      : `Total ${systemStats.totalLoadMw.toLocaleString('id-ID')} MW (${systemStats.avgLoadPercent}%)`}
                  </span>
                </div>

                {/* Jumlah Pelanggan */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Jumlah Pelanggan</span>
                  <span className="font-bold text-slate-200">
                    {selectedSpecificFeeder 
                      ? `${selectedSpecificFeeder.customers.toLocaleString('id-ID')} Plg` 
                      : `${systemStats.totalCustomers.toLocaleString('id-ID')} Plg (Total ULP)`}
                  </span>
                </div>
              </div>

              {/* Right Single Line Electrical Graphic (4 of 12) */}
              <div className="col-span-4 border-l border-slate-800/80 pl-2 flex flex-col items-center justify-between py-1 text-center h-full">
                <div className="space-y-0.5">
                  <div className="w-6 h-6 mx-auto rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 block leading-tight">
                    {selectedSpecificFeeder ? `Sumber:\n${selectedSpecificFeeder.substation}` : `Sumber:\n${systemStats.substationsText}`}
                  </span>
                </div>

                <div className="my-1 flex flex-col items-center">
                  <div className="w-0.5 h-2.5 bg-slate-600" />
                  <div className="w-3 h-3 rounded border border-emerald-400 bg-emerald-500/20 flex items-center justify-center text-[6.5px] font-black text-emerald-400">
                    PMT
                  </div>
                  <div className="w-0.5 h-2.5 bg-slate-600" />
                </div>

                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-slate-200 block truncate max-w-[75px]">
                    {selectedSpecificFeeder ? selectedSpecificFeeder.name : `${filteredFeeders.length} Feeder`}
                  </span>
                  <div className="flex items-center justify-center gap-0.5 text-[8px] font-bold text-slate-400">
                    <Users className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{selectedSpecificFeeder ? selectedSpecificFeeder.customers.toLocaleString('id-ID') : systemStats.totalCustomers.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[9.5px]">
            <span className="text-slate-400">
              {selectedSpecificFeeder 
                ? `Kapasitas: ${selectedSpecificFeeder.capacityMva || 12.5} MVA` 
                : `Total Kapasitas: ${systemStats.totalCapacityMva.toLocaleString('id-ID')} MVA`}
            </span>
            <span className="text-cyan-400 font-bold">
              {selectedSpecificFeeder 
                ? `Panjang: ${selectedSpecificFeeder.lengthKm || 18} km` 
                : `Total JTM: ${systemStats.totalLengthKm.toLocaleString('id-ID')} km`}
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MONITORING REALTIME SPK ROW & PEMELIHARAAN FEEDER (REALTIME DARI MENU SPK) */}
      {/* ========================================================================= */}
      <div id="spk-row-monitoring" className="p-4 sm:p-5 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-xl space-y-4">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>MONITORING REALTIME SPK ROW & PEMELIHARAAN FEEDER</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Realtime Sync
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedSpecificFeeder 
                  ? `Sinkronisasi langsung Surat Perintah Kerja (SPK) untuk Penyulang ${selectedSpecificFeeder.name}`
                  : `Sinkronisasi langsung seluruh Surat Perintah Kerja (SPK) ROW dari Menu SPK ULP Baguala`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateToSpk && (
              <button
                onClick={onNavigateToSpk}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buka Menu SPK</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* SPK KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {/* 1. Total SPK */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {selectedSpecificFeeder ? `Total SPK ${selectedSpecificFeeder.name}` : 'Total SPK Terbit'}
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {selectedSpecificFeeder ? (spkFeederStats?.total ?? 0) : systemStats.spkTotal}
              </span>
              <span className="text-[10px] font-bold text-slate-400">berkas</span>
            </div>
            <span className="text-[9px] text-slate-400">
              {selectedSpecificFeeder ? 'Khusus penyulang aktif' : 'Akumulasi seluruh feeder'}
            </span>
          </div>

          {/* 2. SPK Selesai */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Selesai Eksekusi</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-300">
                {selectedSpecificFeeder ? (spkFeederStats?.done ?? 0) : systemStats.spkDone}
              </span>
              <span className="text-[10px] font-bold text-emerald-400">SPK</span>
            </div>
            <span className="text-[9px] text-emerald-400/80 font-medium">Sudah diinspeksi & tuntas</span>
          </div>

          {/* 3. Dalam Proses */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Dalam Progres</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                {selectedSpecificFeeder ? (spkFeederStats?.inProcess ?? 0) : systemStats.spkInProcess}
              </span>
              <span className="text-[10px] font-bold text-amber-400">SPK</span>
            </div>
            <span className="text-[9px] text-amber-400/80 font-medium">Regu sedang di lapangan</span>
          </div>

          {/* 4. Rencana / Pending */}
          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-sky-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Draft / Rencana</span>
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-sky-300">
                {selectedSpecificFeeder ? (spkFeederStats?.pending ?? 0) : systemStats.spkDraft}
              </span>
              <span className="text-[10px] font-bold text-sky-400">SPK</span>
            </div>
            <span className="text-[9px] text-sky-400/80 font-medium">Antrean eksekusi ROW</span>
          </div>

          {/* 5. Kepatuhan / Realisasi */}
          <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-teal-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Realisasi ROW</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-teal-300">
                {selectedSpecificFeeder ? (spkFeederStats?.percent ?? 100) : systemStats.spkDonePercent}
              </span>
              <span className="text-[10px] font-bold text-teal-400">%</span>
            </div>
            <span className="text-[9px] text-teal-400/80 font-medium">Tingkat penyelesaian tugas</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSpkStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                spkStatusFilter === 'ALL'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({selectedSpecificFeeder ? (spkFeederStats?.total ?? 0) : spkList.length})
            </button>
            <button
              onClick={() => setSpkStatusFilter('SELESAI')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                spkStatusFilter === 'SELESAI'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Selesai ({selectedSpecificFeeder ? (spkFeederStats?.done ?? 0) : spkList.filter(s => isSpkDone(s.status)).length})
            </button>
            <button
              onClick={() => setSpkStatusFilter('PROSES')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                spkStatusFilter === 'PROSES'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Proses ({selectedSpecificFeeder ? (spkFeederStats?.inProcess ?? 0) : spkList.filter(s => isSpkInProcess(s.status)).length})
            </button>
            <button
              onClick={() => setSpkStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                spkStatusFilter === 'PENDING'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-sky-400'
              }`}
            >
              Rencana ({selectedSpecificFeeder ? (spkFeederStats?.pending ?? 0) : spkList.filter(s => isSpkPending(s.status)).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={spkSearchQuery}
              onChange={(e) => setSpkSearchQuery(e.target.value)}
              placeholder="Cari No. SPK, Tim, Lokasi..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            {spkSearchQuery && (
              <button
                onClick={() => setSpkSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Realtime SPK Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[10.5px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">No. SPK & Tanggal</th>
                <th className="py-2.5 px-3">Penyulang</th>
                <th className="py-2.5 px-3">Jenis Pekerjaan & Target</th>
                <th className="py-2.5 px-3">Lokasi / Section</th>
                <th className="py-2.5 px-3">Tim Pelaksana</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedSpks.length > 0 ? (
                displayedSpks.map((spk, idx) => {
                  const done = isSpkDone(spk.status);
                  const inProc = isSpkInProcess(spk.status);
                  const isPlan = isSpkPending(spk.status);

                  return (
                    <tr 
                      key={spk.id || idx}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* No SPK & Date */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{spk.spkNumber || `SPK-${idx + 1}`}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{spk.issueDate || spk.date || 'Terbaru'}</span>
                        </div>
                      </td>

                      {/* Feeder */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (onSelectFeeder && spk.feederName) {
                              onSelectFeeder(spk.feederName);
                            }
                            setSelectedFeeder(spk.feederName || 'ALL');
                          }}
                          className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-slate-800 border border-slate-700 text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all text-left"
                        >
                          {spk.feederName ? `Penyulang ${spk.feederName.replace(/^penyulang\s+/i, '')}` : 'Semua Feeder'}
                        </button>
                      </td>

                      {/* Job Type & Target */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <TreePine className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{spk.jobType || 'Perambasan Pohon ROW'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          {spk.treeCount ? (
                            <span className="text-emerald-400 font-bold">{spk.treeCount} Titik Pohon</span>
                          ) : null}
                          {spk.volumeKms ? (
                            <span className="text-teal-400 font-bold">{spk.volumeKms} kms</span>
                          ) : null}
                          {spk.description && !spk.treeCount && !spk.volumeKms ? (
                            <span className="truncate max-w-[180px]">{spk.description}</span>
                          ) : null}
                        </div>
                      </td>

                      {/* Location & Section */}
                      <td className="py-2.5 px-3">
                        <span className="text-slate-300 block truncate max-w-[150px]">
                          {spk.location || spk.sectionName || 'Area Jaringan'}
                        </span>
                        {spk.garduName && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                            Gardu: {spk.garduName}
                          </span>
                        )}
                      </td>

                      {/* Team */}
                      <td className="py-2.5 px-3">
                        <span className="text-slate-300 font-medium block truncate max-w-[140px]">
                          {spk.team || spk.pelaksana || 'Regu Har ROW'}
                        </span>
                        {spk.supervisor && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                            Pengawas: {spk.supervisor}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center">
                        {done ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai
                          </span>
                        ) : inProc ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Dalam Proses
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                            <Calendar className="w-3 h-3" />
                            {spk.status || 'Draft'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        {onNavigateToSpk && (
                          <button
                            onClick={onNavigateToSpk}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 text-[11px] font-bold border border-slate-700 transition-all inline-flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">
                        {selectedSpecificFeeder 
                          ? `Belum Ada Data SPK untuk Penyulang ${selectedSpecificFeeder.name}`
                          : 'Belum Ada Surat Perintah Kerja (SPK) yang Sesuai Filter'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-md">
                        {selectedSpecificFeeder
                          ? `SPK yang dibuat di Menu SPK untuk penyulang ini akan langsung tersinkronisasi dan termonitor di sini secara real-time.`
                          : `Anda dapat membuat Surat Perintah Kerja (SPK) baru untuk perambasan pohon ROW atau inspeksi di Menu SPK.`}
                      </p>
                      {onNavigateToSpk && (
                        <button
                          onClick={onNavigateToSpk}
                          className="mt-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/40 transition-all hover:scale-105"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Buat SPK Baru di Menu SPK</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FOOTER */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>* Indikator Kinerja: 0 = Sempurna (Hijau) | 1-3 = Sehat (Kuning) | 4-6 = Sakit (Merah) | &gt;6 = Kronis (Hitam)</span>
        </div>
        <div className="font-bold text-slate-400">
          #1EnergySolution | PLN ULP Baguala
        </div>
      </div>
    </div>
  );
};
