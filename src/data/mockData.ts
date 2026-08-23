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
  UserAccess,
  WhatsAppContact,
  WhatsAppMessage
} from '../types';

export const INITIAL_TRIPS: FeederTrip[] = [];

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
  { id: 'F04', name: 'TULEHU', substation: 'GI Passo', lengthKm: 0, customers: 0, healthScore: 68, status: 'Waspada', lastInspected: '2026-08-08', rowRiskPoints: 6, thermoHotspots: 2, groundingResistance: 3.4 },
  { id: 'F05', name: 'ALLANG', substation: 'GI Passo', lengthKm: 29.2, customers: 4120, healthScore: 81, status: 'Handal', lastInspected: '2026-08-04', rowRiskPoints: 3, thermoHotspots: 0, groundingResistance: 2.0 },
  { id: 'F06', name: 'PASSO', substation: 'GI Passo', lengthKm: 12.0, customers: 2950, healthScore: 95, status: 'Sangatal Handal', lastInspected: '2026-08-05', rowRiskPoints: 0, thermoHotspots: 0, groundingResistance: 0.9 }
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

export const INITIAL_SPK_TASKS: SpkTask[] = [];

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
    id: 'MF-ACC',
    feederCode: 'ACC',
    feederName: 'ACC',
    substationName: '-',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 0.7,
    garduCount: 6,
    customerCount: 1420,
    configuration: 'Radial'
  },
  {
    id: 'MF-ALG',
    feederCode: 'ALG',
    feederName: 'Allang',
    substationName: 'GI Passo',
    garduHubung: 'GH Bandara',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 18.5,
    garduCount: 28,
    customerCount: 4120,
    configuration: 'Radial'
  },
  {
    id: 'MF-BDR1',
    feederCode: 'BDR1',
    feederName: 'Bandara 1',
    substationName: 'GI Hative Besar',
    garduHubung: 'GH Bandara',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 14.2,
    garduCount: 15,
    customerCount: 3250,
    configuration: 'Looping'
  },
  {
    id: 'MF-BDR2',
    feederCode: 'BDR2',
    feederName: 'Bandara 2',
    substationName: 'GI Hative Besar',
    garduHubung: 'GH Bandara',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 12.8,
    garduCount: 12,
    customerCount: 2980,
    configuration: 'Looping'
  },
  {
    id: 'MF-GLL1',
    feederCode: 'GLL1',
    feederName: 'Galala 1',
    substationName: '-',
    garduHubung: 'GH Box Pantai Galala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 10.5,
    garduCount: 14,
    customerCount: 2750,
    configuration: 'Looping'
  },
  {
    id: 'MF-GLL2',
    feederCode: 'GLL2',
    feederName: 'Galala 2',
    substationName: '-',
    garduHubung: 'GH Box Pantai Poka',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 11.2,
    garduCount: 16,
    customerCount: 3100,
    configuration: 'Looping'
  },
  {
    id: 'MF-HTM',
    feederCode: 'HTM',
    feederName: 'Hutumuri',
    substationName: 'GI Passo',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 16.0,
    garduCount: 18,
    customerCount: 2890,
    configuration: 'Looping'
  },
  {
    id: 'MF-KRP1',
    feederCode: 'KRP1',
    feederName: 'Karpan 1',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 8.4,
    garduCount: 11,
    customerCount: 2640,
    configuration: 'Radial'
  },
  {
    id: 'MF-LTR1',
    feederCode: 'LTR1',
    feederName: 'Lateri 1',
    substationName: 'GI Passo',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 7.7,
    garduCount: 26,
    customerCount: 3820,
    configuration: 'Looping'
  },
  {
    id: 'MF-LTR2',
    feederCode: 'LTR2',
    feederName: 'Lateri 2',
    substationName: 'GI Passo',
    garduHubung: '-',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 24.1,
    garduCount: 32,
    customerCount: 5310,
    configuration: 'Looping'
  },
  {
    id: 'MF-LTR3',
    feederCode: 'LTR3',
    feederName: 'Lateri 3',
    substationName: 'GI Passo',
    garduHubung: '-',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 15.8,
    garduCount: 19,
    customerCount: 3100,
    configuration: 'Looping'
  },
  {
    id: 'MF-LTR4',
    feederCode: 'LTR4',
    feederName: 'Lateri 4',
    substationName: 'GI Passo',
    garduHubung: '-',
    status: 'Utama',
    operationalStatus: 'Tidak Operasi',
    khaAmpere: 600,
    lengthKms: 12.0,
    garduCount: 14,
    customerCount: 2890,
    configuration: 'Looping'
  },
  {
    id: 'MF-MCM',
    feederCode: 'MCM',
    feederName: 'MCM',
    substationName: '-',
    garduHubung: 'GH Hative Kecil',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 4.5,
    garduCount: 8,
    customerCount: 1850,
    configuration: 'Radial'
  },
  {
    id: 'MF-PSO',
    feederCode: 'PSO',
    feederName: 'Passo',
    substationName: 'GIS Passo',
    garduHubung: '-',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 7.8,
    garduCount: 22,
    customerCount: 2950,
    configuration: 'Looping'
  },
  {
    id: 'MF-TLH',
    feederCode: 'TLH',
    feederName: 'Tulehu',
    substationName: 'GI Passo',
    garduHubung: '-',
    status: 'Utama',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 22.5,
    garduCount: 25,
    customerCount: 4280,
    configuration: 'Looping'
  },
  {
    id: 'MF-WHR1',
    feederCode: 'WHR1',
    feederName: 'Waiheru 1',
    substationName: 'GIS Passo',
    garduHubung: 'GH Baguala',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 16.8,
    garduCount: 21,
    customerCount: 3620,
    configuration: 'Looping'
  },
  {
    id: 'MF-WYM1',
    feederCode: 'WYM1',
    feederName: 'Wayame 1',
    substationName: 'GI Hative Besar',
    garduHubung: 'GH Wayame',
    status: 'Percabangan',
    operationalStatus: 'Operasi',
    khaAmpere: 600,
    lengthKms: 15.3,
    garduCount: 18,
    customerCount: 3340,
    configuration: 'Looping'
  }
];

export const INITIAL_MASTER_SECTIONS: MasterSection[] = [
  // ALLANG (Supply dari GH Bandara)
  {
    id: 'SEC-AL-01',
    sectionCode: 'SEC-AL-1',
    sectionName: 'Section 1 (GH Bandara - Recloser Laha)',
    feederName: 'Allang',
    substationOrGh: 'GH Bandara',
    startPoint: 'Outgoing GH Bandara (P.01)',
    endPoint: 'Recloser Laha (P.42)',
    garduCount: 8,
    lengthKms: 4.8,
    khaAmpere: 400,
    bebanUtamaKha: 35,
    bebanCabangKha: 12,
    customerCount: 1250,
    status: 'Operasi',
    pemutusType: 'Recloser',
    pemutusCode: 'REC-LAHA-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Laha Pantai',
    fcoLengthKms: 1.8,
    fcoKhaAmpere: 65,
    fcoLaterals: ['Cabang Dermaga Laha', 'Cabang Pemukiman Laha'],
    fcoBranches: [
      {
        id: 'BR-AL-01',
        branchDeviceType: 'FCO',
        fcoBranchName: 'FCO Percabangan Laha Pantai',
        fcoLengthKms: 1.8,
        fcoKhaAmpere: 65,
        fcoLaterals: ['Cabang Dermaga Laha', 'Cabang Pemukiman Laha']
      },
      {
        id: 'BR-AL-02',
        branchDeviceType: 'FCO',
        fcoBranchName: 'FCO Percabangan Bandara Barat',
        fcoLengthKms: 1.2,
        fcoKhaAmpere: 45,
        fcoLaterals: ['Cabang Radar Navigasi']
      }
    ]
  },
  {
    id: 'SEC-AL-02',
    sectionCode: 'SEC-AL-2',
    sectionName: 'Section 2 (Recloser Laha - LBS Hatu)',
    feederName: 'Allang',
    substationOrGh: 'GH Bandara',
    startPoint: 'Recloser Laha (P.42)',
    endPoint: 'LBS Hatu (P.88)',
    garduCount: 11,
    lengthKms: 6.2,
    khaAmpere: 400,
    bebanUtamaKha: 28,
    bebanCabangKha: 16,
    customerCount: 1580,
    status: 'Operasi',
    pemutusType: 'LBS Motorized',
    pemutusCode: 'LBS-HATU-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Negeri Hatu & Dusun',
    fcoLengthKms: 2.6,
    fcoKhaAmpere: 50,
    fcoLaterals: ['Cabang Hatu Dalam', 'Cabang Pesisir Hatu'],
    fcoBranches: [
      {
        id: 'BR-AL-03',
        branchDeviceType: 'FCO',
        fcoBranchName: 'FCO Percabangan Negeri Hatu & Dusun',
        fcoLengthKms: 2.6,
        fcoKhaAmpere: 50,
        fcoLaterals: ['Cabang Hatu Dalam', 'Cabang Pesisir Hatu']
      }
    ]
  },
  {
    id: 'SEC-AL-03',
    sectionCode: 'SEC-AL-3',
    sectionName: 'Section 3 (LBS Hatu - Ujung Allang/Wakasihu)',
    feederName: 'Allang',
    substationOrGh: 'GH Bandara',
    startPoint: 'LBS Hatu (P.88)',
    endPoint: 'Ujung SUTM Allang Wakasihu (P.145)',
    garduCount: 9,
    lengthKms: 7.5,
    khaAmpere: 300,
    bebanUtamaKha: 22,
    bebanCabangKha: 14,
    customerCount: 1290,
    status: 'Operasi',
    pemutusType: 'PMCB',
    pemutusCode: 'PMCB-ALLANG-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Wakasihu Barat',
    fcoLengthKms: 3.2,
    fcoKhaAmpere: 40,
    fcoLaterals: ['Cabang Desa Wakasihu', 'Cabang PLTS Komunal']
  },

  // LATERI 1 (Supply dari GH Baguala)
  {
    id: 'SEC-LT1-01',
    sectionCode: 'SEC-LT1-1',
    sectionName: 'Section 1 (GH Baguala - Recloser Lateri)',
    feederName: 'Lateri 1',
    substationOrGh: 'GH Baguala',
    startPoint: 'Outgoing GH Baguala',
    endPoint: 'Recloser Lateri (P.35)',
    garduCount: 12,
    lengthKms: 3.5,
    khaAmpere: 450,
    bebanUtamaKha: 42,
    bebanCabangKha: 18,
    customerCount: 1850,
    status: 'Operasi',
    pemutusType: 'Recloser',
    pemutusCode: 'REC-LT1-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Lateri Dalam',
    fcoLengthKms: 1.5,
    fcoKhaAmpere: 55,
    fcoLaterals: ['Cabang Perum Lateri Indah', 'Cabang Pasar Lateri']
  },
  {
    id: 'SEC-LT1-02',
    sectionCode: 'SEC-LT1-2',
    sectionName: 'Section 2 (Recloser Lateri - LBS Halong)',
    feederName: 'Lateri 1',
    substationOrGh: 'GH Baguala',
    startPoint: 'Recloser Lateri (P.35)',
    endPoint: 'LBS Halong (P.72)',
    garduCount: 14,
    lengthKms: 4.2,
    khaAmpere: 400,
    bebanUtamaKha: 38,
    bebanCabangKha: 15,
    customerCount: 1970,
    status: 'Operasi',
    pemutusType: 'LBS Motorized',
    pemutusCode: 'LBS-HLG-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Halong Baru',
    fcoLengthKms: 2.1,
    fcoKhaAmpere: 45,
    fcoLaterals: ['Cabang Lantamal Halong', 'Cabang Pemukiman Atas']
  },

  // PASSO (Supply dari GI Passo)
  {
    id: 'SEC-PSO-01',
    sectionCode: 'SEC-PSO-1',
    sectionName: 'Section 1 (GI Passo - LBS Transit Passo)',
    feederName: 'Passo',
    substationOrGh: 'GI Passo',
    startPoint: 'Pangkal GI Passo 20kV',
    endPoint: 'LBS Transit Passo (P.28)',
    garduCount: 10,
    lengthKms: 3.2,
    khaAmpere: 500,
    bebanUtamaKha: 48,
    bebanCabangKha: 20,
    customerCount: 1450,
    status: 'Operasi',
    pemutusType: 'LBS Motorized',
    pemutusCode: 'LBS-TR-PSO',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Terminal Transit',
    fcoLengthKms: 1.4,
    fcoKhaAmpere: 60,
    fcoLaterals: ['Cabang Mall Passo', 'Cabang Pasar Transit']
  },
  {
    id: 'SEC-PSO-02',
    sectionCode: 'SEC-PSO-2',
    sectionName: 'Section 2 (LBS Transit - Recloser Hunuth)',
    feederName: 'Passo',
    substationOrGh: 'GI Passo',
    startPoint: 'LBS Transit Passo (P.28)',
    endPoint: 'Recloser Hunuth (P.65)',
    garduCount: 12,
    lengthKms: 4.6,
    khaAmpere: 450,
    bebanUtamaKha: 36,
    bebanCabangKha: 14,
    customerCount: 1500,
    status: 'Operasi',
    pemutusType: 'Recloser',
    pemutusCode: 'REC-HNT-01',
    hasFcoBranch: true,
    branchDeviceType: 'FCO',
    fcoBranchName: 'FCO Percabangan Hunuth Durian Patah',
    fcoLengthKms: 2.3,
    fcoKhaAmpere: 48,
    fcoLaterals: ['Cabang Kampus Unpatti Baru', 'Cabang Durian Patah']
  }
];

export const INITIAL_MASTER_GH: MasterGarduHubung[] = [
  {
    id: 'GH-01',
    ghCode: 'GH-BGL',
    ghName: 'GH Baguala',
    location: 'Jl. Wolter Monginsidi, Baguala, Ambon',
    coordinates: '-3.6285, 128.2214',
    incomingFeedersCount: 1,
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
    coordinates: '-3.7102, 128.0895',
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
    coordinates: '-3.6582, 128.1630',
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
    coordinates: '-3.6521, 128.1904',
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
    coordinates: '-3.6310, 128.2180',
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
    coordinates: '-3.6812, 128.1951',
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
    coordinates: '-3.6645, 128.1928',
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
    coordinates: '-3.6598, 128.1901',
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
    coordinates: '-3.6930, 128.1812',
    incomingFeeder: 'Passo (GIS Passo)',
    outgoingFeedersCount: 3,
    outgoingFeedersList: 'Feeder Kota, Sirimau Express',
    ghType: 'Indoor',
    status: 'Operasi'
  }
];

export const INITIAL_MASTER_GD: MasterGarduDistribusi[] = [];

export const INITIAL_MASTER_PEMUTUS: MasterPemutus[] = [];

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

export const INITIAL_WHATSAPP_CONTACTS: WhatsAppContact[] = [
  {
    id: 'WAC-01',
    name: 'ROW & Inspeksi Baguala',
    phoneNumber: 'ROW_Inspeksi_Baguala',
    roleType: 'Grup ROW & Inspeksi',
    avatarColor: 'bg-emerald-600',
    description: 'Tim Perabatan Pohon ROW, Inspeksi SUTM & K3 Lapangan'
  },
  {
    id: 'WAC-02',
    name: 'PLN ULP Baguala Menyapa',
    phoneNumber: 'PLN_ULP_Baguala_Menyapa',
    roleType: 'Grup Pelayanan & Humas',
    avatarColor: 'bg-blue-600',
    description: 'Pemberitahuan Pelanggan, Padam Terencana & Pelayanan Publik'
  },
  {
    id: 'WAC-03',
    name: 'Tim Teknik ULP Baguala',
    phoneNumber: 'Tim_Teknik_ULP_Baguala',
    roleType: 'Tim Teknik & Yantek',
    avatarColor: 'bg-amber-600',
    description: 'Regu Pemeliharaan Jaringan, Yantek Posko & Operasi Distribusi'
  },
  {
    id: 'WAC-04',
    name: 'PLN UP3 Ambon & Stake holder Pulau Ambon⚡',
    phoneNumber: 'PLN_UP3_Ambon_Stakeholder',
    roleType: 'Manajemen & Stakeholder',
    avatarColor: 'bg-purple-600',
    description: 'Pimpinan UP3 Ambon, Dispatcher & Stakeholder Pulau Ambon'
  }
];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'WA-MSG-001',
    recipientName: 'ROW & Inspeksi Baguala',
    phoneNumber: 'ROW & Inspeksi Baguala',
    recipientType: 'Grup ROW & Inspeksi',
    category: 'Gangguan / Trip',
    senderName: 'M. Ricky Sabary (Team Leader)',
    sentAt: '2026-08-14 09:15 WIT',
    status: 'Dibaca',
    feederRelated: 'LATERI 2',
    messageText: `🔴 *LAPORAN GANGGUAN / TRIP PENYULANG 20kV*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚡ *Penyulang*: LATERI 2
🏢 *Gardu Induk / GH*: GI Passo (20kV)
📅 *Waktu Trip*: 2026-08-14, Pukul 09:10 WIT
⚠️ *Relay Bekerja*: GFR / OCR
📊 *Arus Gangguan*: 450 Ampere
📍 *Lokasi Indikasi*: Km 4.2 - Depan Kantor Desa
🔍 *Dugaan Penyebab*: Dahan pohon tumbang akibat angin kencang
👥 *Pelanggan Terdampak*: 4.120 Pelanggan
⏳ *Status*: Regu Yantek Passo sedang meluncur ke lokasi.
━━━━━━━━━━━━━━━━━━━━
_Safety First - Utamakan Keselamatan K3!_`
  },
  {
    id: 'WA-MSG-002',
    recipientName: 'Tim Teknik ULP Baguala',
    phoneNumber: 'Tim Teknik ULP Baguala',
    recipientType: 'Tim Teknik & Yantek',
    category: 'SPK Lapangan',
    senderName: 'M. Ricky Sabary (Team Leader)',
    sentAt: '2026-08-13 15:30 WIT',
    status: 'Diterima',
    feederRelated: 'TULEHU',
    messageText: `📋 *SURAT PERINTAH KERJA (SPK) PEMELIHARAAN*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
📄 *No. SPK*: SPK/2026/08/BGL-014
👷‍♂️ *Regu Pelaksana*: Regu Pemeliharaan Jaringan
⚡ *Penyulang / Lokasi*: TULEHU - SUTM Km 12.8 Tikungan Liang
🔧 *Uraian Pekerjaan*: Pemangkasan 12 Pohon Kritis ROW & Penggantian Isolator Tumpu
🛡️ *K3 & APD Wajib*: Helm, Sarung Tangan 20kV, Sepatu Safety, Grounding Stick
🕒 *Jadwal Pengerjaan*: 15 Agustus 2026 (09:00 - 14:00 WIT)
━━━━━━━━━━━━━━━━━━━━
_Mohon konfirmasi kesiapan personil dan alat kerja._`
  }
];

