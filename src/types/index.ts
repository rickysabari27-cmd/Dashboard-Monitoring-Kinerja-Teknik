export type ViewMode = 
  | 'dashboard'
  | 'gis'
  | 'health_index'
  | 'trips'
  | 'pemeliharaan'
  | 'spk'
  | 'pengukuran'
  | 'master_data'
  | 'saidi_saifi'
  | 'material'
  | 'apd'
  | 'kendaraan'
  | 'users'
  | 'whatsapp';

export interface FeederTrip {
  id: string;
  feederName: string;
  substation: string;
  tripDate: string;
  tripTime: string;
  recoveryTime: string;
  durationMinutes: number;
  relayType: 'GFR' | 'OCR' | 'GFR / OCR' | 'UVR' | 'OVR' | 'UFR';
  currentAmpere: number;
  kwPadam?: number;
  locationKm: string;
  coordinates?: string;
  cause: string;
  category: 'Tree/ROW' | 'Equipment Failure' | 'Lightning' | 'Animal' | 'Human Error' | 'Unknown';
  affectedCustomers: number;
  totalUlpCustomers?: number;
  saidiHours?: number;
  saidiMinutes?: number;
  saifiCount?: number;
  ensKwh: number;
  financialLossIdr: number;
  status: 'Resolved' | 'Under Investigation' | 'Pending Action';
  // Arus Gangguan
  iNol?: number;
  iL1?: number;
  iL2?: number;
  iL3?: number;
  estimatedDistanceKm?: number;
  faultTypeDetected?: string;
}

export interface FeederHealth {
  id: string;
  name: string;
  substation: string;
  lengthKm: number;
  customers: number;
  healthScore: number; // 0 - 100
  status: 'Sangatal Handal' | 'Handal' | 'Waspada' | 'Kritis';
  lastInspected: string;
  rowRiskPoints: number;
  thermoHotspots: number;
  groundingResistance: number; // Ohms
}

export interface MonthlyTripData {
  month: string;
  trips2026: number;
  trips2025: number;
  targetMax: number;
}

export interface MonthlySaidiSaifiData {
  year?: number;
  month: string;
  saidiReal: number; // Jam/Plg
  saidiTarget: number;
  saifiReal: number; // Kali/Plg
  saifiTarget: number;
  ensLossJuta: number; // Rp Juta
}

export interface FeederContribution {
  feederName: string;
  tripsCount: number;
  percentage: number;
  color: string;
}

export interface InspectionRecord {
  id: string;
  feederName: string;
  location: string;
  inspectorTeam: string;
  category: 'Ringan' | 'Sedang' | 'Berat';
  findingDescription: string;
  photoUrl?: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

export interface RowTreeLocation {
  id: string;
  feederName: string;
  spanLocation: string;
  treeType: string;
  distanceMeter: number;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  requiredAction: string;
  status: 'Perlu Pangkas' | 'Terjadwal' | 'Selesai';
}

export interface SpkTask {
  id: string;
  spkNumber: string;
  date: string;
  taskType: 'ROW Pangkas Pohon' | 'Inspeksi Tier 1' | 'Inspeksi Tier 2 Thermo' | 'Pemeliharaan SUTM' | 'Pengukuran Gardu';
  feederName: string;
  locationSection: string;
  teamName: string;
  targetQty: string;
  status: 'Draft' | 'Dalam Proses' | 'Selesai';
  priority: 'Biasa' | 'Tinggi' | 'Urgent';
  description: string;
}

export interface GarduMeasurement {
  id: string;
  garduCode: string;
  garduName: string;
  feederName: string;
  capacityKva: number;
  date: string;
  inspectorName: string;
  currentR: number;
  currentS: number;
  currentT: number;
  currentN: number;
  voltageRN: number;
  voltageSN: number;
  voltageTN: number;
  loadPercentage: number;
  status: 'Normal' | 'Underload' | 'Overload' | 'Critical Overload';
}

export interface MasterFeeder {
  id: string;
  feederCode: string;
  feederName: string;
  substationName: string;
  garduHubung?: string;
  voltageKv?: number;
  lengthKms: number;
  customerCount: number;
  capacityKva?: number;
  sectionCount?: number;
  breakerType?: string;
  status?: string;
  operationalStatus?: string;
  khaAmpere?: number;
  garduCount?: number;
  configuration?: string;
}

export interface BranchDevice {
  id?: string;
  branchDeviceType: 'FCO' | 'LBSM' | 'Recloser' | 'PMCB' | string;
  fcoBranchName: string;
  fcoLengthKms?: number;
  fcoKhaAmpere?: number;
  fcoLaterals?: string[];
}

export interface MasterSection {
  id: string;
  sectionCode: string;
  sectionName: string;
  feederName: string;
  substationOrGh: string;
  startPoint: string;
  endPoint: string;
  garduCount: number;
  lengthKms: number;
  khaAmpere?: number;
  bebanUtamaKha?: number;
  bebanCabangKha?: number;
  totalBebanKha?: number;
  customerCount?: number;
  status: 'Normal' | 'Warning' | 'Kritis' | 'Operasi' | 'Tidak Operasi' | 'Manuver' | string;
  // Alat Pemutus Section (Inbound Protection / Breaker Connection)
  pemutusId?: string;
  pemutusCode?: string;
  pemutusType?: 'Recloser' | 'PMCB' | 'LBS Motorized' | 'LBS Manual' | 'PMT' | 'FCO' | 'Disconnector (DS)' | string;
  sequenceOrder?: number;
  // FCO / LBSM / Recloser / PMCB Percabangan Manual Input
  hasFcoBranch?: boolean;
  branchDeviceType?: 'FCO' | 'LBSM' | 'Recloser' | 'PMCB' | string;
  fcoBranchName?: string;
  fcoLengthKms?: number;
  fcoKhaAmpere?: number;
  fcoLaterals?: string[]; // Daftar nama sub-cabang lateral manual
  fcoBranches?: BranchDevice[]; // Multi-percabangan lateral per section
  // Live Telemetry Monitoring Fields
  currentLoadAmpere?: number;
  voltageKv?: number;
  voltageDropPercent?: number;
  temperatureCelsius?: number;
}

export function getSectionBranches(sec: Partial<MasterSection>): BranchDevice[] {
  if (sec.fcoBranches && sec.fcoBranches.length > 0) {
    return sec.fcoBranches;
  }
  if (sec.hasFcoBranch) {
    return [{
      id: 'branch-legacy',
      branchDeviceType: sec.branchDeviceType || 'FCO',
      fcoBranchName: sec.fcoBranchName || `${sec.branchDeviceType || 'FCO'} Percabangan`,
      fcoLengthKms: sec.fcoLengthKms,
      fcoKhaAmpere: sec.fcoKhaAmpere,
      fcoLaterals: sec.fcoLaterals || []
    }];
  }
  return [];
}

export interface CoveredSectionsInfo {
  coveredSections: MasterSection[];
  isAllSections: boolean;
  label: string;
  shortLabel: string;
  totalGardu: number;
  totalCustomers: number;
  totalLengthKms: number;
  sectionNames: string[];
}

export function getDownstreamCoveredSections(
  feederName: string,
  startSectionIdOrName?: string,
  sections: MasterSection[] = []
): CoveredSectionsInfo {
  const feederSecs = (sections || []).filter(
    s => s && s.feederName && feederName && s.feederName.trim().toLowerCase() === feederName.trim().toLowerCase()
  );

  // If no specific section chosen or empty
  if (!startSectionIdOrName || startSectionIdOrName === '' || startSectionIdOrName === 'ALL' || startSectionIdOrName === 'GI') {
    const totalG = feederSecs.reduce((sum, s) => sum + (Number(s.garduCount) || 0), 0);
    const totalC = feederSecs.reduce((sum, s) => sum + (Number(s.customerCount) || 0), 0);
    const totalL = feederSecs.reduce((sum, s) => sum + (Number(s.lengthKms) || 0), 0);
    return {
      coveredSections: feederSecs,
      isAllSections: true,
      label: feederSecs.length > 0
        ? `Semua Section (${feederSecs[0].sectionName || feederSecs[0].sectionCode} s/d Ujung Jaringan)`
        : 'Semua Section / GI (Pangkal s/d Ujung Jaringan)',
      shortLabel: 'Semua Section / GI',
      totalGardu: totalG,
      totalCustomers: totalC,
      totalLengthKms: Number(totalL.toFixed(2)),
      sectionNames: feederSecs.map(s => s.sectionName || s.sectionCode)
    };
  }

  // Find index of selected section (match by ID, sectionName, or sectionCode)
  const targetIdx = feederSecs.findIndex(
    s => s.id === startSectionIdOrName || 
         s.sectionName?.trim().toLowerCase() === startSectionIdOrName.trim().toLowerCase() ||
         s.sectionCode?.trim().toLowerCase() === startSectionIdOrName.trim().toLowerCase()
  );

  if (targetIdx === -1) {
    return {
      coveredSections: [],
      isAllSections: false,
      label: `${startSectionIdOrName} - Ujung Jaringan`,
      shortLabel: `${startSectionIdOrName} - Ujung Jaringan`,
      totalGardu: 0,
      totalCustomers: 0,
      totalLengthKms: 0,
      sectionNames: [startSectionIdOrName]
    };
  }

  const downstream = feederSecs.slice(targetIdx);
  const startSec = feederSecs[targetIdx];
  const startName = startSec.sectionName || startSec.sectionCode;

  const totalG = downstream.reduce((sum, s) => sum + (Number(s.garduCount) || 0), 0);
  const totalC = downstream.reduce((sum, s) => sum + (Number(s.customerCount) || 0), 0);
  const totalL = downstream.reduce((sum, s) => sum + (Number(s.lengthKms) || 0), 0);

  return {
    coveredSections: downstream,
    isAllSections: false,
    label: `${startName} - Ujung Jaringan`,
    shortLabel: `${startName} - Ujung Jaringan`,
    totalGardu: totalG,
    totalCustomers: totalC,
    totalLengthKms: Number(totalL.toFixed(2)),
    sectionNames: downstream.map(s => s.sectionName || s.sectionCode)
  };
}

export interface MasterGarduHubung {
  id: string;
  ghCode: string;
  ghName: string;
  location: string;
  coordinates?: string;
  incomingFeedersCount?: number;
  incomingFeeder: string;
  outgoingFeedersCount: number;
  outgoingFeedersList: string;
  ghType: 'Indoor' | 'Outdoor' | 'Compact';
  status: 'Operasi' | 'Standby' | 'Pemeliharaan';
}

export interface MasterGarduDistribusi {
  id: string;
  garduCode: string;
  garduName: string;
  feederName: string;
  sectionName?: string;
  capacityKva: number;
  phase: '3 Phasa' | '1 Phasa';
  garduType: 'Portal' | 'Cantol' | 'Beton' | 'Kios';
  location: string;
  customerCount?: number;
  status: 'Operasi' | 'Tidak Operasi' | 'Pemeliharaan';
}

export interface MasterPemutus {
  id: string;
  equipmentCode: string;
  equipmentType: 'Recloser' | 'LBS Motorized' | 'LBS Manual' | 'PMT' | 'FCO' | 'Disconnector (DS)' | 'PMCB';
  feederName: string;
  sectionId?: string;
  sectionName?: string;
  location: string;
  brandModel: string;
  currentRatingAmpere: number;
  scadaStatus: 'Terhubung SCADA' | 'Manual / Non-SCADA' | 'Gangguan Link';
  status: 'Masuk / ON' | 'Lepas / OFF' | 'Pemeliharaan';
}

export interface MaterialItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'Isolator' | 'Arrester' | 'FCO & Fuse' | 'Kabel & Conductor' | 'Aksesoris Trafo' | 'Grounding';
  stockQty: number;
  unit: string;
  minStock: number;
  warehouseLocation: string;
  status: 'Aman' | 'Waspada' | 'Kritis';
}

export interface ApdTool {
  id: string;
  code: string;
  name: string;
  category: 'APD K3' | 'Alat Kerja Hand Tools' | 'Alat Ukur Terkalibrasi';
  qty: number;
  condition: 'Baik' | 'Perlu Kalibrasi' | 'Rusak';
  lastCalibrated: string;
  unitOwner: string;
  inspector: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  name: string;
  vehicleType: 'Mobil Yantek' | 'Motor Patroli' | 'Truck Crane' | 'Mobil Double Cabin';
  status: 'Siap Operasi' | 'Dalam Perbaikan' | 'Kritis';
  mileageKm: number;
  teamAssigned: string;
  fuelStatus: string;
}

export interface UserAccess {
  id: string;
  nik: string;
  name: string;
  role: 'Manager' | 'Team Leader' | 'Admin Yantek' | 'Petugas Yantek' | 'Admin';
  unitName: string;
  email: string;
  phone?: string;
  status: 'Aktif' | 'Non-Aktif';
  lastActive: string;
}

export interface ImportedFeederFile {
  id: string;
  name: string;
  pointsCount: number;
  importDate: string;
  color: string;
  isVisible: boolean;
  isChecked: boolean;
  fileType: 'KML' | 'KMZ' | 'GeoJSON';
  pathCoords: Array<[number, number]>;
  poles: Array<{
    id: string;
    poleNumber: string;
    lat: number;
    lng: number;
    type: 'Penyulang' | 'Pohon' | 'Gardu' | 'Gangguan';
    description?: string;
    jenisTiang?: string;
    tipeKonstruksi?: string;
    tinggiDaN?: string;
    keteranganLainnya?: string;
  }>;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phoneNumber: string;
  roleType: string;
  avatarColor: string;
  description?: string;
}

export interface WhatsAppMessage {
  id: string;
  recipientName: string;
  phoneNumber: string;
  recipientType: string;
  category: 'Gangguan / Trip' | 'Penormalan' | 'SPK Lapangan' | 'Padam Terencana' | 'Emergency' | 'Lainnya';
  messageText: string;
  senderName: string;
  sentAt: string;
  status: 'Terkirim' | 'Diterima' | 'Dibaca' | 'Draft';
  feederRelated?: string;
}
