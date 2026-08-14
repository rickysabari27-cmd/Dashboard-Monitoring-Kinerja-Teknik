import {
  FeederTrip,
  FeederHealth,
  MonthlyTripData,
  MonthlySaidiSaifiData,
  FeederContribution,
  InspectionRecord,
  RowTreeLocation,
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
  UserAccess
} from '../types';

export const INITIAL_TRIPS: FeederTrip[] = [
  {
    id: 'TRIP-2026-001',
    feederName: 'LATERI 2',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-07-12',
    tripTime: '14:22',
    recoveryTime: '15:45',
    durationMinutes: 83,
    relayType: 'GFR / OCR',
    currentAmpere: 450,
    locationKm: 'Km 4.2 - Depan Kantor Desa',
    cause: 'Dahan pohon tumbang akibat angin kencang menyentuh SUTM',
    category: 'Tree/ROW',
    affectedCustomers: 4120,
    ensKwh: 12500,
    financialLossIdr: 18062500,
    status: 'Resolved'
  },
  {
    id: 'TRIP-2026-002',
    feederName: 'TULEHU',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-07-28',
    tripTime: '19:05',
    recoveryTime: '20:10',
    durationMinutes: 65,
    relayType: 'GFR / OCR',
    currentAmpere: 380,
    locationKm: 'Km 12.8 - Tikungan Liang',
    cause: 'Petir menyambar Isolator Tumpu Phasa R',
    category: 'Lightning',
    affectedCustomers: 3850,
    ensKwh: 9800,
    financialLossIdr: 14161000,
    status: 'Resolved'
  },
  {
    id: 'TRIP-2026-003',
    feederName: 'LATERI 3',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-08-02',
    tripTime: '08:15',
    recoveryTime: '09:00',
    durationMinutes: 45,
    relayType: 'GFR / OCR',
    currentAmpere: 320,
    locationKm: 'Km 2.1 - Lateri Dalam',
    cause: 'Sarang burung & ranting pada Pin Crossarm',
    category: 'Animal',
    affectedCustomers: 2900,
    ensKwh: 4500,
    financialLossIdr: 6502500,
    status: 'Resolved'
  },
  {
    id: 'TRIP-2026-004',
    feederName: 'ALLANG',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-08-04',
    tripTime: '11:40',
    recoveryTime: '12:15',
    durationMinutes: 35,
    relayType: 'GFR / OCR',
    currentAmpere: 290,
    locationKm: 'Km 8.5 - Jl. Raya Allang',
    cause: 'Kabel TR terkelupas tersenggol truk traktor',
    category: 'Human Error',
    affectedCustomers: 1850,
    ensKwh: 2100,
    financialLossIdr: 3034500,
    status: 'Resolved'
  },
  {
    id: 'TRIP-2026-005',
    feederName: 'TULEHU',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-08-08',
    tripTime: '16:30',
    recoveryTime: '17:10',
    durationMinutes: 40,
    relayType: 'GFR / OCR',
    currentAmpere: 310,
    locationKm: 'Km 15.2 - Pelabuhan Tulehu',
    cause: 'Karat pada arrester fasa T lepas',
    category: 'Equipment Failure',
    affectedCustomers: 2600,
    ensKwh: 3100,
    financialLossIdr: 4479500,
    status: 'Resolved'
  },
  {
    id: 'TRIP-2026-006',
    feederName: 'LATERI 2',
    substation: 'GI Passo (20kV)',
    tripDate: '2026-08-09',
    tripTime: '21:10',
    recoveryTime: '21:30',
    durationMinutes: 20,
    relayType: 'GFR / OCR',
    currentAmpere: 210,
    locationKm: 'Km 5.0 - SULI',
    cause: 'Hujan lebat angin kencang gesekan dahan sagu',
    category: 'Tree/ROW',
    affectedCustomers: 1200,
    ensKwh: 1200,
    financialLossIdr: 1712483,
    status: 'Resolved'
  }
];

export const MONTHLY_TRIP_DATA: MonthlyTripData[] = [
  { month: 'Jan', trips2026: 0, trips2025: 1, targetMax: 1 },
  { month: 'Feb', trips2026: 0, trips2025: 2, targetMax: 1 },
  { month: 'Mar', trips2026: 0, trips2025: 1, targetMax: 1 },
  { month: 'Apr', trips2026: 0, trips2025: 3, targetMax: 1 },
  { month: 'Mei', trips2026: 0, trips2025: 2, targetMax: 1 },
  { month: 'Jun', trips2026: 0, trips2025: 1, targetMax: 1 },
  { month: 'Jul', trips2026: 3, trips2025: 4, targetMax: 1 },
  { month: 'Ags', trips2026: 3, trips2025: 3, targetMax: 1 },
  { month: 'Sep', trips2026: 0, trips2025: 2, targetMax: 1 },
  { month: 'Okt', trips2026: 0, trips2025: 1, targetMax: 1 },
  { month: 'Nov', trips2026: 0, trips2025: 2, targetMax: 1 },
  { month: 'Des', trips2026: 0, trips2025: 2, targetMax: 1 }
];

export const MONTHLY_SAIDI_SAIFI_2026: MonthlySaidiSaifiData[] = [
  { year: 2026, month: 'Jan', saidiReal: 4.2, saidiTarget: 6.0, saifiReal: 0.08, saifiTarget: 0.12, ensLossJuta: 3.2 },
  { year: 2026, month: 'Feb', saidiReal: 8.5, saidiTarget: 12.0, saifiReal: 0.15, saifiTarget: 0.24, ensLossJuta: 6.8 },
  { year: 2026, month: 'Mar', saidiReal: 12.1, saidiTarget: 18.0, saifiReal: 0.22, saifiTarget: 0.36, ensLossJuta: 9.5 },
  { year: 2026, month: 'Apr', saidiReal: 21.4, saidiTarget: 24.0, saifiReal: 0.35, saifiTarget: 0.48, ensLossJuta: 16.2 },
  { year: 2026, month: 'Mei', saidiReal: 32.8, saidiTarget: 30.0, saifiReal: 0.52, saifiTarget: 0.60, ensLossJuta: 24.8 },
  { year: 2026, month: 'Jun', saidiReal: 41.5, saidiTarget: 36.0, saifiReal: 0.68, saifiTarget: 0.72, ensLossJuta: 31.0 },
  { year: 2026, month: 'Jul', saidiReal: 51.2, saidiTarget: 42.0, saifiReal: 0.81, saifiTarget: 0.84, ensLossJuta: 41.5 },
  { year: 2026, month: 'Ags', saidiReal: 57.125, saidiTarget: 72.412, saifiReal: 0.94, saifiTarget: 1.10, ensLossJuta: 47.95 },
  { year: 2026, month: 'Sep', saidiReal: 0, saidiTarget: 54.0, saifiReal: 0, saifiTarget: 0.96, ensLossJuta: 0 },
  { year: 2026, month: 'Okt', saidiReal: 0, saidiTarget: 60.0, saifiReal: 0, saifiTarget: 1.08, ensLossJuta: 0 },
  { year: 2026, month: 'Nov', saidiReal: 0, saidiTarget: 66.0, saifiReal: 0, saifiTarget: 1.20, ensLossJuta: 0 },
  { year: 2026, month: 'Des', saidiReal: 0, saidiTarget: 72.412, saifiReal: 0, saifiTarget: 1.32, ensLossJuta: 0 },

  // Historical 2025
  { year: 2025, month: 'Jan', saidiReal: 5.1, saidiTarget: 6.5, saifiReal: 0.09, saifiTarget: 0.13, ensLossJuta: 4.1 },
  { year: 2025, month: 'Feb', saidiReal: 9.8, saidiTarget: 13.0, saifiReal: 0.18, saifiTarget: 0.26, ensLossJuta: 8.2 },
  { year: 2025, month: 'Mar', saidiReal: 15.2, saidiTarget: 19.5, saifiReal: 0.28, saifiTarget: 0.39, ensLossJuta: 12.0 },
  { year: 2025, month: 'Apr', saidiReal: 24.6, saidiTarget: 26.0, saifiReal: 0.42, saifiTarget: 0.52, ensLossJuta: 19.5 },
  { year: 2025, month: 'Mei', saidiReal: 31.0, saidiTarget: 32.5, saifiReal: 0.58, saifiTarget: 0.65, ensLossJuta: 25.1 },
  { year: 2025, month: 'Jun', saidiReal: 43.2, saidiTarget: 39.0, saifiReal: 0.74, saifiTarget: 0.78, ensLossJuta: 34.0 },
  { year: 2025, month: 'Jul', saidiReal: 54.8, saidiTarget: 45.5, saifiReal: 0.89, saifiTarget: 0.91, ensLossJuta: 44.2 },
  { year: 2025, month: 'Ags', saidiReal: 63.5, saidiTarget: 52.0, saifiReal: 1.05, saifiTarget: 1.04, ensLossJuta: 51.0 },
  { year: 2025, month: 'Sep', saidiReal: 69.1, saidiTarget: 58.5, saifiReal: 1.14, saifiTarget: 1.17, ensLossJuta: 56.4 },
  { year: 2025, month: 'Okt', saidiReal: 74.0, saidiTarget: 65.0, saifiReal: 1.22, saifiTarget: 1.30, ensLossJuta: 61.2 },
  { year: 2025, month: 'Nov', saidiReal: 80.2, saidiTarget: 71.5, saifiReal: 1.35, saifiTarget: 1.43, ensLossJuta: 66.8 },
  { year: 2025, month: 'Des', saidiReal: 86.5, saidiTarget: 78.0, saifiReal: 1.48, saifiTarget: 1.56, ensLossJuta: 72.1 },

  // Historical 2024
  { year: 2024, month: 'Jan', saidiReal: 6.2, saidiTarget: 7.0, saifiReal: 0.11, saifiTarget: 0.15, ensLossJuta: 5.0 },
  { year: 2024, month: 'Feb', saidiReal: 11.5, saidiTarget: 14.0, saifiReal: 0.21, saifiTarget: 0.30, ensLossJuta: 9.8 },
  { year: 2024, month: 'Mar', saidiReal: 18.0, saidiTarget: 21.0, saifiReal: 0.33, saifiTarget: 0.45, ensLossJuta: 14.2 },
  { year: 2024, month: 'Apr', saidiReal: 28.1, saidiTarget: 28.0, saifiReal: 0.49, saifiTarget: 0.60, ensLossJuta: 22.0 },
  { year: 2024, month: 'Mei', saidiReal: 38.4, saidiTarget: 35.0, saifiReal: 0.67, saifiTarget: 0.75, ensLossJuta: 31.2 },
  { year: 2024, month: 'Jun', saidiReal: 49.0, saidiTarget: 42.0, saifiReal: 0.84, saifiTarget: 0.90, ensLossJuta: 39.8 },
  { year: 2024, month: 'Jul', saidiReal: 61.2, saidiTarget: 49.0, saifiReal: 1.02, saifiTarget: 1.05, ensLossJuta: 49.0 },
  { year: 2024, month: 'Ags', saidiReal: 71.0, saidiTarget: 56.0, saifiReal: 1.18, saifiTarget: 1.20, ensLossJuta: 58.0 },
  { year: 2024, month: 'Sep', saidiReal: 78.5, saidiTarget: 63.0, saifiReal: 1.29, saifiTarget: 1.35, ensLossJuta: 64.5 },
  { year: 2024, month: 'Okt', saidiReal: 85.0, saidiTarget: 70.0, saifiReal: 1.40, saifiTarget: 1.50, ensLossJuta: 70.1 },
  { year: 2024, month: 'Nov', saidiReal: 92.4, saidiTarget: 77.0, saifiReal: 1.54, saifiTarget: 1.65, ensLossJuta: 76.5 },
  { year: 2024, month: 'Des', saidiReal: 99.8, saidiTarget: 84.0, saifiReal: 1.68, saifiTarget: 1.80, ensLossJuta: 83.2 }
];

export const FEEDER_CONTRIBUTION: FeederContribution[] = [
  { feederName: 'LATERI 3', tripsCount: 2, percentage: 33, color: '#0284C7' },
  { feederName: 'ALLANG', tripsCount: 1, percentage: 17, color: '#EAB308' },
  { feederName: 'TULEHU', tripsCount: 2, percentage: 25, color: '#A855F7' },
  { feederName: 'LATERI 2', tripsCount: 1, percentage: 25, color: '#3B82F6' }
];

export const FEEDER_HEALTH_LIST: FeederHealth[] = [
  { id: 'F01', name: 'LATERI 1', substation: 'GI Passo', lengthKm: 18.4, customers: 3820, healthScore: 92, status: 'Sangatal Handal', lastInspected: '2026-08-01', rowRiskPoints: 1, thermoHotspots: 0, groundingResistance: 1.2 },
  { id: 'F02', name: 'LATERI 2', substation: 'GI Passo', lengthKm: 24.1, customers: 5310, healthScore: 78, status: 'Handal', lastInspected: '2026-08-09', rowRiskPoints: 4, thermoHotspots: 1, groundingResistance: 2.1 },
  { id: 'F03', name: 'LATERI 3', substation: 'GI Passo', lengthKm: 15.8, customers: 3100, healthScore: 84, status: 'Handal', lastInspected: '2026-07-29', rowRiskPoints: 2, thermoHotspots: 0, groundingResistance: 1.8 },
  { id: 'F04', name: 'TULEHU', substation: 'GI Passo', lengthKm: 38.6, customers: 6890, healthScore: 68, status: 'Waspada', lastInspected: '2026-08-08', rowRiskPoints: 6, thermoHotspots: 2, groundingResistance: 3.4 },
  { id: 'F05', name: 'ALLANG', substation: 'GI Passo', lengthKm: 29.2, customers: 4120, healthScore: 81, status: 'Handal', lastInspected: '2026-08-04', rowRiskPoints: 3, thermoHotspots: 0, groundingResistance: 2.0 },
  { id: 'F06', name: 'PASSO', substation: 'GI Passo', lengthKm: 12.0, customers: 2950, healthScore: 95, status: 'Sangatal Handal', lastInspected: '2026-08-05', rowRiskPoints: 0, thermoHotspots: 0, groundingResistance: 0.9 },
  { id: 'F07', name: 'HALONG', substation: 'GI Passo', lengthKm: 14.5, customers: 3400, healthScore: 89, status: 'Sangatal Handal', lastInspected: '2026-08-03', rowRiskPoints: 1, thermoHotspots: 0, groundingResistance: 1.5 }
];

export const INSPECTION_LIST: InspectionRecord[] = [
  {
    id: 'INSP-2026-01',
    feederName: 'LATERI 2',
    location: 'Km 4.5 - Gardu Distribusi BG-012',
    inspectorTeam: 'Tim 1 & Tim 2 Active',
    category: 'Sedang',
    findingDescription: 'Dahan pohon sagu berjarak < 1.5m dari SUTM Fasa R',
    date: '2026-08-09',
    status: 'In Progress'
  },
  {
    id: 'INSP-2026-02',
    feederName: 'TULEHU',
    location: 'Km 12.1 - Tiang No. 142',
    inspectorTeam: 'Tim Inspeksi Tier 1',
    category: 'Berat',
    findingDescription: 'Pin Insulator retak fasa T akibat loncatan arus',
    date: '2026-08-08',
    status: 'Open'
  }
];

export const ROW_TREES: RowTreeLocation[] = [
  {
    id: 'ROW-001',
    feederName: 'TULEHU',
    spanLocation: 'Tiang No. 142 - 145 (Liang)',
    treeType: 'Pohon Kelapa & Ketapang',
    distanceMeter: 1.2,
    priority: 'Tinggi',
    requiredAction: 'Pangkas Dahan Top Line',
    status: 'Perlu Pangkas'
  },
  {
    id: 'ROW-002',
    feederName: 'LATERI 2',
    spanLocation: 'Tiang No. 88 - 90 (Suli)',
    treeType: 'Pohon Sagu',
    distanceMeter: 1.8,
    priority: 'Sedang',
    requiredAction: 'Tebang Pohon Sagu Rawan Tumbang',
    status: 'Terjadwal'
  }
];

export const INITIAL_SPK_TASKS: SpkTask[] = [
  {
    id: 'SPK-2026-081',
    spkNumber: 'SPK/BAG/2026/08/012',
    date: '2026-08-10',
    taskType: 'ROW Pangkas Pohon',
    feederName: 'TULEHU',
    locationSection: 'Tiang 142 - 150 Liang',
    teamName: 'Tim Yantek 1 Passo',
    targetQty: '8 Pohon Sagu / Kelapa',
    status: 'Dalam Proses',
    priority: 'Urgent',
    description: 'Pangkas dahan kritis potensi trip akibat angin musim timur'
  },
  {
    id: 'SPK-2026-082',
    spkNumber: 'SPK/BAG/2026/08/013',
    date: '2026-08-11',
    taskType: 'Inspeksi Tier 2 Thermo',
    feederName: 'LATERI 2',
    locationSection: 'Gardu Portal BG-015',
    teamName: 'Tim Inspeksi Khusus',
    targetQty: '12 Gardu Distribusi',
    status: 'Draft',
    priority: 'Biasa',
    description: 'Pemeriksaan suhu klem trafo dan arrester 20kV'
  }
];

export const INITIAL_GARDU_MEASUREMENTS: GarduMeasurement[] = [
  {
    id: 'GARDU-001',
    garduCode: 'BG-012',
    garduName: 'Gardu Lateri Raya',
    feederName: 'LATERI 2',
    capacityKva: 160,
    date: '2026-08-08',
    inspectorName: 'Joni Doe / M. Ricky',
    currentR: 185,
    currentS: 190,
    currentT: 175,
    currentN: 22,
    voltageRN: 228,
    voltageSN: 226,
    voltageTN: 230,
    loadPercentage: 78,
    status: 'Normal'
  },
  {
    id: 'GARDU-002',
    garduCode: 'BG-045',
    garduName: 'Gardu Pasar Tulehu',
    feederName: 'TULEHU',
    capacityKva: 250,
    date: '2026-08-09',
    inspectorName: 'Tim Yantek 2',
    currentR: 340,
    currentS: 325,
    currentT: 350,
    currentN: 48,
    voltageRN: 215,
    voltageSN: 218,
    voltageTN: 212,
    loadPercentage: 96,
    status: 'Critical Overload'
  }
];

export const INITIAL_MASTER_FEEDERS: MasterFeeder[] = [
  {
    id: 'MF-01',
    feederCode: 'ACC',
    feederName: 'ACC',
    substationName: '-',
    garduHubung: 'GH Bandara',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-02',
    feederCode: 'ALG',
    feederName: 'Allang',
    substationName: '-',
    garduHubung: 'GH Bandara',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-03',
    feederCode: 'BDR1',
    feederName: 'Bandara 1',
    substationName: 'Hative Besar',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-04',
    feederCode: 'BDR2',
    feederName: 'Bandara 2',
    substationName: 'Hative Besar',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-05',
    feederCode: 'GLL1',
    feederName: 'Galala 1',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-06',
    feederCode: 'GLL2',
    feederName: 'Galala 2',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-07',
    feederCode: 'HTM',
    feederName: 'Hutumuri',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-08',
    feederCode: 'KRP1',
    feederName: 'Karpan 1',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-09',
    feederCode: 'LTR1',
    feederName: 'Lateri 1',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-10',
    feederCode: 'LTR2',
    feederName: 'Lateri 2',
    substationName: 'GI Passo',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-11',
    feederCode: 'LTR3',
    feederName: 'Lateri 3',
    substationName: 'GI Passo',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-12',
    feederCode: 'LTR4',
    feederName: 'Lateri 4',
    substationName: 'GI Passo',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Tidak Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-13',
    feederCode: 'MCM',
    feederName: 'MCM',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-14',
    feederCode: 'MVT1',
    feederName: 'MVTIC 1',
    substationName: 'Hative Besar',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-15',
    feederCode: 'MVT2',
    feederName: 'MVTIC 2',
    substationName: 'Hative Besar',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-16',
    feederCode: 'PSO',
    feederName: 'Passo',
    substationName: 'GIS Passo',
    garduHubung: '',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-17',
    feederCode: 'RJL',
    feederName: 'Rijali',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-18',
    feederCode: 'TTA',
    feederName: 'Tantui Atas',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-19',
    feederCode: 'WHR1',
    feederName: 'Waiheru 1',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-20',
    feederCode: 'WHR2',
    feederName: 'Waiheru 2',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  },
  {
    id: 'MF-21',
    feederCode: 'WHR3',
    feederName: 'Waiheru 3',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 0,
    lengthKms: 0,
    garduCount: 0,
    customerCount: 0,
    configuration: 'Looping'
  }
];

export const INITIAL_MASTER_SECTIONS: MasterSection[] = [
  {
    id: 'SEC-01',
    sectionCode: 'SEC-LTR2-01',
    sectionName: 'Section Utama Lateri - Suli',
    feederName: 'Lateri 2',
    substationOrGh: 'GI Passo',
    startPoint: 'PMT Outgoing GI Passo',
    endPoint: 'LBS Suli Atas (Pole #88)',
    garduCount: 14,
    lengthKms: 6.8,
    customerCount: 1850,
    status: 'Operasi'
  },
  {
    id: 'SEC-02',
    sectionCode: 'SEC-LTR2-02',
    sectionName: 'Section Suli - Tial Percabangan',
    feederName: 'Lateri 2',
    substationOrGh: 'GI Passo',
    startPoint: 'LBS Suli Atas (Pole #88)',
    endPoint: 'FCO Ujung Tial Pantai',
    garduCount: 9,
    lengthKms: 5.4,
    customerCount: 1200,
    status: 'Operasi'
  },
  {
    id: 'SEC-03',
    sectionCode: 'SEC-PSO-01',
    sectionName: 'Section Transit Passo Raya',
    feederName: 'Passo',
    substationOrGh: 'GIS Passo',
    startPoint: 'Outgoing GIS Passo',
    endPoint: 'Recloser Passo Transit',
    garduCount: 18,
    lengthKms: 7.2,
    customerCount: 2950,
    status: 'Operasi'
  },
  {
    id: 'SEC-04',
    sectionCode: 'SEC-BDR1-01',
    sectionName: 'Section Bandara Utama Pattimura',
    feederName: 'Bandara 1',
    substationOrGh: 'Hative Besar',
    startPoint: 'GI Hative Besar',
    endPoint: 'GH Bandara',
    garduCount: 12,
    lengthKms: 8.5,
    customerCount: 1400,
    status: 'Operasi'
  },
  {
    id: 'SEC-05',
    sectionCode: 'SEC-WHR1-01',
    sectionName: 'Section Waiheru Dalam - Nania',
    feederName: 'Waiheru 1',
    substationOrGh: 'GH Baguala',
    startPoint: 'GH Baguala Cell 3',
    endPoint: 'LBS Nania Permai',
    garduCount: 11,
    lengthKms: 4.9,
    customerCount: 1650,
    status: 'Operasi'
  }
];

export const INITIAL_MASTER_GH: MasterGarduHubung[] = [
  {
    id: 'GH-01',
    ghCode: 'GH-BGL',
    ghName: 'GH Baguala',
    location: 'Jl. Wolter Monginsidi, Baguala, Ambon',
    incomingFeeder: 'Lateri 2 (GI Passo)',
    outgoingFeedersCount: 4,
    outgoingFeedersList: 'Hutumuri, Lateri 1, Waiheru 1, Express',
    ghType: 'Indoor',
    status: 'Operasi'
  },
  {
    id: 'GH-02',
    ghCode: 'GH-BDR',
    ghName: 'GH Bandara',
    location: 'Kawasan Bandara Pattimura Laha',
    incomingFeeder: 'Bandara 1 (GI Hative Besar)',
    outgoingFeedersCount: 3,
    outgoingFeedersList: 'ACC, Allang, Bandara Khusus',
    ghType: 'Indoor',
    status: 'Operasi'
  },
  {
    id: 'GH-03',
    ghCode: 'GH-WYM',
    ghName: 'GH Wayame',
    location: 'Jl. Ir. M. Putuhena, Wayame',
    incomingFeeder: 'Wayame 2 (GI Hative Besar)',
    outgoingFeedersCount: 2,
    outgoingFeedersList: 'Wayame 1, Wayame Lokal',
    ghType: 'Indoor',
    status: 'Operasi'
  },
  {
    id: 'GH-04',
    ghCode: 'GH-POK',
    ghName: 'GH Poka',
    location: 'Kompleks Bundaran Leimena Poka',
    incomingFeeder: 'Wayame 3 (GI Hative Besar)',
    outgoingFeedersCount: 3,
    outgoingFeedersList: 'Poka 1, Kampus Unpatti, Rumahtiga',
    ghType: 'Compact',
    status: 'Operasi'
  },
  {
    id: 'GH-05',
    ghCode: 'GH-AST',
    ghName: 'GH Aston',
    location: 'Kawasan Komersial Passo Transit',
    incomingFeeder: 'Passo (GIS Passo)',
    outgoingFeedersCount: 2,
    outgoingFeedersList: 'Hotel Aston, Mall ACC',
    ghType: 'Indoor',
    status: 'Operasi'
  },
  {
    id: 'GH-06',
    ghCode: 'GH-HTK',
    ghName: 'GH Hative Kecil',
    location: 'Jl. Jenderal Sudirman Hative Kecil',
    incomingFeeder: 'Lateri 3 (GI Passo)',
    outgoingFeedersCount: 2,
    outgoingFeedersList: 'Galala, Hative Bawah',
    ghType: 'Indoor',
    status: 'Operasi'
  },
  {
    id: 'GH-07',
    ghCode: 'GH-BXP',
    ghName: 'GH Box Pantai Galala',
    location: 'Pesisir Jembatan Merah Putih Galala',
    incomingFeeder: 'Lateri 1 (GH Baguala)',
    outgoingFeedersCount: 2,
    outgoingFeedersList: 'JMP Penerangan, Galala Pesisir',
    ghType: 'Compact',
    status: 'Operasi'
  },
  {
    id: 'GH-08',
    ghCode: 'GH-BXK',
    ghName: 'GH Box Pantai Poka',
    location: 'Pesisir Jembatan Merah Putih Poka',
    incomingFeeder: 'Wayame 1 (GH Wayame)',
    outgoingFeedersCount: 2,
    outgoingFeedersList: 'Poka Pantai, Rumahtiga Bawah',
    ghType: 'Compact',
    status: 'Operasi'
  },
  {
    id: 'GH-09',
    ghCode: 'GH-ARA',
    ghName: 'GH Area',
    location: 'Kompleks Kantor PLN UP3 Ambon',
    incomingFeeder: 'Passo (GIS Passo)',
    outgoingFeedersCount: 3,
    outgoingFeedersList: 'Feeder Kota, Sirimau Express',
    ghType: 'Indoor',
    status: 'Operasi'
  }
];

export const INITIAL_MASTER_GD: MasterGarduDistribusi[] = [
  {
    id: 'GD-01',
    garduCode: 'BG-012',
    garduName: 'Gardu Lateri Raya',
    feederName: 'Lateri 2',
    sectionName: 'Section Utama Lateri - Suli',
    capacityKva: 160,
    phase: '3 Phasa',
    garduType: 'Portal',
    location: 'Jl. Wolter Monginsidi No. 45 Lateri',
    customerCount: 142,
    status: 'Operasi'
  },
  {
    id: 'GD-02',
    garduCode: 'BG-045',
    garduName: 'Gardu Pasar Tulehu',
    feederName: 'Hutumuri',
    sectionName: 'Section Pasar Tulehu',
    capacityKva: 250,
    phase: '3 Phasa',
    garduType: 'Portal',
    location: 'Kawasan Pelabuhan Speed Tulehu',
    customerCount: 210,
    status: 'Operasi'
  },
  {
    id: 'GD-03',
    garduCode: 'PAS-04',
    garduName: 'Gardu Transit Passo Mall',
    feederName: 'Passo',
    sectionName: 'Section Transit Passo Raya',
    capacityKva: 200,
    phase: '3 Phasa',
    garduType: 'Beton',
    location: 'Depan Mall ACC Passo',
    customerCount: 85,
    status: 'Operasi'
  },
  {
    id: 'GD-04',
    garduCode: 'PAS-09',
    garduName: 'Gardu Terminal Passo',
    feederName: 'Passo',
    sectionName: 'Section Transit Passo Raya',
    capacityKva: 100,
    phase: '3 Phasa',
    garduType: 'Portal',
    location: 'Pintu Keluar Terminal Transit Passo',
    customerCount: 96,
    status: 'Operasi'
  },
  {
    id: 'GD-05',
    garduCode: 'BDR-03',
    garduName: 'Gardu Radar Bandara',
    feederName: 'Bandara 1',
    sectionName: 'Section Bandara Utama Pattimura',
    capacityKva: 250,
    phase: '3 Phasa',
    garduType: 'Kios',
    location: 'Kompleks Radar Navigasi Udara Laha',
    customerCount: 18,
    status: 'Operasi'
  },
  {
    id: 'GD-06',
    garduCode: 'WYM-05',
    garduName: 'Gardu Kampus Pertanian',
    feederName: 'Wayame 1',
    sectionName: 'Section Poka - Rumahtiga',
    capacityKva: 160,
    phase: '3 Phasa',
    garduType: 'Portal',
    location: 'Fakultas Pertanian Unpatti Poka',
    customerCount: 125,
    status: 'Operasi'
  },
  {
    id: 'GD-07',
    garduCode: 'WHR-02',
    garduName: 'Gardu Waiheru BTN',
    feederName: 'Waiheru 1',
    sectionName: 'Section Waiheru Dalam - Nania',
    capacityKva: 100,
    phase: '3 Phasa',
    garduType: 'Cantol',
    location: 'Kompleks Perumahan BTN Waiheru Permai',
    customerCount: 160,
    status: 'Operasi'
  }
];

export const INITIAL_MASTER_PEMUTUS: MasterPemutus[] = [
  {
    id: 'PMT-01',
    equipmentCode: 'REC-LTR2-01',
    equipmentType: 'Recloser',
    feederName: 'Lateri 2',
    location: 'Pole #45 Depan Kantor Camat Baguala',
    brandModel: 'NOJA Power OSM38 (38kV 800A)',
    currentRatingAmpere: 800,
    scadaStatus: 'Terhubung SCADA',
    status: 'Masuk / ON'
  },
  {
    id: 'PMT-02',
    equipmentCode: 'LBS-PSO-02',
    equipmentType: 'LBS Motorized',
    feederName: 'Passo',
    location: 'Pole #12 Perempatan Passo Transit',
    brandModel: 'Schneider Ringmaster SF6 630A',
    currentRatingAmpere: 630,
    scadaStatus: 'Terhubung SCADA',
    status: 'Masuk / ON'
  },
  {
    id: 'PMT-03',
    equipmentCode: 'PMT-BDR1-OUT',
    equipmentType: 'PMT',
    feederName: 'Bandara 1',
    location: 'Bay Outgoing GI Hative Besar',
    brandModel: 'ABB VD4 Vacuum 1250A',
    currentRatingAmpere: 1250,
    scadaStatus: 'Terhubung SCADA',
    status: 'Masuk / ON'
  },
  {
    id: 'PMT-04',
    equipmentCode: 'LBS-SULI-01',
    equipmentType: 'LBS Manual',
    feederName: 'Lateri 2',
    location: 'Pole #88 Batas Suli Atas',
    brandModel: 'Entec Air Break Switch 630A',
    currentRatingAmpere: 630,
    scadaStatus: 'Manual / Non-SCADA',
    status: 'Masuk / ON'
  },
  {
    id: 'PMT-05',
    equipmentCode: 'FCO-HTM-01',
    equipmentType: 'FCO',
    feederName: 'Hutumuri',
    location: 'Percabangan Pole #112 Haturessy',
    brandModel: 'Hubbell Chance 27kV 100A',
    currentRatingAmpere: 100,
    scadaStatus: 'Manual / Non-SCADA',
    status: 'Masuk / ON'
  },
  {
    id: 'PMT-06',
    equipmentCode: 'REC-WYM2-01',
    equipmentType: 'Recloser',
    feederName: 'Wayame 2',
    location: 'Pole #32 Jembatan Rumahtiga',
    brandModel: 'Tavrida Electric Rec15',
    currentRatingAmpere: 630,
    scadaStatus: 'Terhubung SCADA',
    status: 'Masuk / ON'
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  { id: 'M-01', itemCode: 'MAT-PIN-20', name: 'Pin Post Insulator 20kV', category: 'Isolator', stockQty: 42, unit: 'Buah', minStock: 15, warehouseLocation: 'Gudang ULP Baguala', status: 'Aman' },
  { id: 'M-02', itemCode: 'MAT-ARR-10', name: 'Lightning Arrester 20kV 10kA', category: 'Arrester', stockQty: 18, unit: 'Buah', minStock: 10, warehouseLocation: 'Gudang ULP Baguala', status: 'Aman' },
  { id: 'M-03', itemCode: 'MAT-FCO-20', name: 'Fuse Cut Out (FCO) 20kV', category: 'FCO & Fuse', stockQty: 25, unit: 'Set', minStock: 8, warehouseLocation: 'Gudang ULP Baguala', status: 'Aman' },
  { id: 'M-04', itemCode: 'MAT-CAB-150', name: 'Conductor AAACs 150mm²', category: 'Kabel & Conductor', stockQty: 450, unit: 'Meter', minStock: 200, warehouseLocation: 'Gudang Utama Passo', status: 'Aman' },
  { id: 'M-05', itemCode: 'MAT-GRD-58', name: 'Grounding Rod Tembaga 5/8"', category: 'Grounding', stockQty: 12, unit: 'Batang', minStock: 10, warehouseLocation: 'Gudang ULP Baguala', status: 'Waspada' }
];

export const INITIAL_APD_TOOLS: ApdTool[] = [
  { id: 'APD-01', code: 'K3-HELM-01', name: 'Helm K3 Class E (20kV Rating)', category: 'APD K3', qty: 15, condition: 'Baik', lastCalibrated: '2026-06-15', unitOwner: 'Tim Yantek Passo', inspector: 'Officer K3' },
  { id: 'APD-02', code: 'K3-GLV-20', name: 'Sarung Tangan Isolasi 20kV Class 2', category: 'APD K3', qty: 8, condition: 'Baik', lastCalibrated: '2026-07-01', unitOwner: 'Tim Inspeksi 20kV', inspector: 'Officer K3' },
  { id: 'APD-03', code: 'ALT-THERMO-01', name: 'Kamera Thermovision FLIR E8-XT', category: 'Alat Ukur Terkalibrasi', qty: 2, condition: 'Baik', lastCalibrated: '2026-05-10', unitOwner: 'Tim Inspeksi Tier 2', inspector: 'Lab Terkalibrasi' }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'VEH-01', plateNumber: 'DE 1420 AB', name: 'Mobil Yantek Hilux 4x4', vehicleType: 'Mobil Yantek', status: 'Siap Operasi', mileageKm: 42150, teamAssigned: 'Tim Yantek Posko Passo', fuelStatus: '85%' },
  { id: 'VEH-02', plateNumber: 'DE 3389 BC', name: 'Truck Crane Teleskopik 20kV', vehicleType: 'Truck Crane', status: 'Siap Operasi', mileageKm: 68900, teamAssigned: 'Tim Pemeliharaan Berat', fuelStatus: '70%' },
  { id: 'VEH-03', plateNumber: 'DE 5512 C', name: 'Motor Patroli Trail 150cc', vehicleType: 'Motor Patroli', status: 'Siap Operasi', mileageKm: 18400, teamAssigned: 'Petugas ROW Liang', fuelStatus: '90%' }
];

export const INITIAL_USERS: UserAccess[] = [
  { id: 'USR-01', nik: '9218042PLN', name: 'M. Ricky Sabary', role: 'Team Leader', unitName: 'PLN ULP Baguala', email: 'rickysabari27@gmail.com', phone: '081234567890', status: 'Aktif', lastActive: 'Hari ini 12:45' },
  { id: 'USR-02', nik: '9512088PLN', name: 'Joni Doe', role: 'Team Leader', unitName: 'PLN ULP Baguala', email: 'joni.doe@pln.co.id', phone: '081298765432', status: 'Aktif', lastActive: 'Hari ini 11:30' },
  { id: 'USR-03', nik: '9820011PLN', name: 'Tim Yantek Passo', role: 'Petugas Yantek', unitName: 'Posko Passo', email: 'yantek.passo@pln.co.id', phone: '085211223344', status: 'Aktif', lastActive: 'Hari ini 10:15' }
];
