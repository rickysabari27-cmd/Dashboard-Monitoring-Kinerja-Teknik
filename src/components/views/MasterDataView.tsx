import React, { useState, useMemo } from 'react';
import { 
  MasterFeeder, 
  MasterSection, 
  MasterGarduHubung, 
  MasterGarduDistribusi, 
  MasterPemutus,
  FeederTrip,
  BranchDevice,
  getSectionBranches,
  getDownstreamCoveredSections
} from '../../types';
import { 
  Database, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Building2, 
  ShieldCheck, 
  SlidersHorizontal,
  MapPin,
  Activity,
  AlertCircle,
  AlertTriangle,
  GitBranch,
  Network,
  Route,
  ChevronRight,
  Eye,
  Radio,
  Share2,
  Gauge,
  Thermometer,
  Flame,
  ArrowRight,
  CornerDownRight,
  Sparkles,
  Waves,
  Cpu,
  Check,
  Users
} from 'lucide-react';

export type MasterDataSubTab = 
  | 'penyulang'
  | 'section'
  | 'gardu_hubung'
  | 'gardu_distribusi'
  | 'pemutus';

interface MasterDataViewProps {
  isDarkMode: boolean;
  masterFeeders: MasterFeeder[];
  masterSections?: MasterSection[];
  masterGarduHubung?: MasterGarduHubung[];
  masterGarduDistribusi?: MasterGarduDistribusi[];
  masterPemutus?: MasterPemutus[];
  trips?: FeederTrip[];
  onSaveMasterFeeder: (feeder: any) => void;
  onDeleteMasterFeeder: (id: string) => void;
  onSaveMasterSection?: (section: any) => void;
  onDeleteMasterSection?: (id: string) => void;
  onSaveMasterGarduHubung?: (gh: any) => void;
  onDeleteMasterGarduHubung?: (id: string) => void;
  onSaveMasterGarduDistribusi?: (gd: any) => void;
  onDeleteMasterGarduDistribusi?: (id: string) => void;
  onSaveMasterPemutus?: (pmt: any) => void;
  onDeleteMasterPemutus?: (id: string) => void;
  onOpenUniversalInput?: (tab?: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  isDarkMode,
  masterFeeders,
  masterSections = [],
  masterGarduHubung = [],
  masterGarduDistribusi = [],
  masterPemutus = [],
  trips = [],
  onSaveMasterFeeder,
  onDeleteMasterFeeder,
  onSaveMasterSection,
  onDeleteMasterSection,
  onSaveMasterGarduHubung,
  onDeleteMasterGarduHubung,
  onSaveMasterGarduDistribusi,
  onDeleteMasterGarduDistribusi,
  onSaveMasterPemutus,
  onDeleteMasterPemutus
}) => {
  const [activeTab, setActiveTab] = useState<MasterDataSubTab>('penyulang');
  const [searchQuery, setSearchQuery] = useState('');

  // Utility to normalize and match feeder names consistently across modules
  const matchFeederName = (nameA?: string, nameB?: string): boolean => {
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

  // Fallback total ULP customer count
  const defaultTotalUlp = useMemo(() => {
    const sum = masterFeeders.reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
    return sum > 0 ? sum : 45200;
  }, [masterFeeders]);

  // Synchronized System-wide Reliability Aggregates (SAIDI, SAIFI, ENS, Trips)
  const systemSaidiSaifiEns = useMemo(() => {
    let totalTripsCount = (trips || []).length;
    let totalSaidiHours = 0;
    let totalSaifiCount = 0;
    let totalEnsKwh = 0;

    (trips || []).forEach(t => {
      const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
      const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
      totalSaidiHours += (saidi || 0);
      totalSaifiCount += (saifi || 0);
      totalEnsKwh += (t.ensKwh || 0);
    });

    return {
      totalTripsCount,
      totalSaidiHours,
      totalSaifiCount,
      totalEnsKwh
    };
  }, [trips, defaultTotalUlp]);

  // Modals state for Feeder
  const [feederToEdit, setFeederToEdit] = useState<MasterFeeder | null>(null);
  const [feederToDelete, setFeederToDelete] = useState<MasterFeeder | null>(null);
  const [isAddFeederOpen, setIsAddFeederOpen] = useState(false);

  // Modals state for Section
  const [sectionToEdit, setSectionToEdit] = useState<MasterSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<MasterSection | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  // Modals state for Gardu Hubung
  const [ghToEdit, setGhToEdit] = useState<MasterGarduHubung | null>(null);
  const [ghToDelete, setGhToDelete] = useState<MasterGarduHubung | null>(null);
  const [isAddGhOpen, setIsAddGhOpen] = useState(false);

  // Modals state for Gardu Distribusi
  const [gdToEdit, setGdToEdit] = useState<MasterGarduDistribusi | null>(null);
  const [gdToDelete, setGdToDelete] = useState<MasterGarduDistribusi | null>(null);
  const [isAddGdOpen, setIsAddGdOpen] = useState(false);

  // Modals state for Pemutus
  const [pmtToEdit, setPmtToEdit] = useState<MasterPemutus | null>(null);
  const [pmtToDelete, setPmtToDelete] = useState<MasterPemutus | null>(null);
  const [isAddPmtOpen, setIsAddPmtOpen] = useState(false);

  // Feeder Form States
  const [fCode, setFCode] = useState('');
  const [fName, setFName] = useState('');
  const [fGi, setFGi] = useState('-');
  const [fGh, setFGh] = useState('-');
  const [fStatus, setFStatus] = useState('Utama');
  const [fOpStatus, setFOpStatus] = useState('Operasi');
  const [fKha, setFKha] = useState<number | string>(0);
  const [fLength, setFLength] = useState<number | string>(0);
  const [fGarduCount, setFGarduCount] = useState<number | string>(0);
  const [fCust, setFCust] = useState<number | string>(0);
  const [fConfig, setFConfig] = useState('Looping');

  // Section States & Filter
  const [selectedSectionFeeder, setSelectedSectionFeeder] = useState('ALL');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sectionViewTab, setSectionViewTab] = useState<'topology_table' | 'monitoring'>('topology_table');

  // Available GI and GH master lists
  const availableGIs = Array.from(new Set([
    'GI Passo',
    'GIS Passo',
    'GI Hative Besar',
    'GI Sirimau',
    ...masterFeeders.map(f => f.substationName).filter((s): s is string => Boolean(s && s !== '-'))
  ])).filter(Boolean);

  const availableGHs = Array.from(new Set([
    ...masterGarduHubung.map(gh => gh.ghName),
    'GH Area',
    'GH Aston',
    'GH Baguala',
    'GH Bandara',
    'GH Box Pantai Galala',
    'GH Box Pantai Poka',
    'GH Hative Kecil',
    'GH Poka',
    'GH Wayame',
    ...masterFeeders.map(f => f.garduHubung).filter((g): g is string => Boolean(g && g !== '-'))
  ])).filter(Boolean);

  // Helper to generate dynamic Section Code based on Feeder and existing section count
  const generateSectionCode = (targetFeederName: string) => {
    const matching = masterFeeders.find(f => f.feederName.toLowerCase() === targetFeederName.toLowerCase());
    const prefix = matching ? matching.feederCode : targetFeederName.replace(/\s+/g, '-').toUpperCase();
    const existingCount = masterSections.filter(s => s.feederName.toLowerCase() === targetFeederName.toLowerCase()).length;
    const seq = String(existingCount + 1).padStart(2, '0');
    return `${prefix}-SEC-${seq}`;
  };

  // Section Form States
  const [secCode, setSecCode] = useState('');
  const [secName, setSecName] = useState('');
  const [secFeeder, setSecFeeder] = useState('');
  const [secSubstation, setSecSubstation] = useState('');
  const [secStart, setSecStart] = useState('');
  const [secEnd, setSecEnd] = useState('');
  const [secGarduCount, setSecGarduCount] = useState<number | string>('');
  const [secLength, setSecLength] = useState<number | string>('');
  const [secKha, setSecKha] = useState<number | string>('');
  const [secBebanUtama, setSecBebanUtama] = useState<number | string>('');
  const [secBebanCabang, setSecBebanCabang] = useState<number | string>('');
  const [secTotalBeban, setSecTotalBeban] = useState<number | string>('');
  const [secCust, setSecCust] = useState<number | string>('');
  const [secStatus, setSecStatus] = useState<string>('Operasi');

  // Percabangan States (Manual Input - Multi-branch support)
  const [secHasFco, setSecHasFco] = useState(false);
  const [secBranchDeviceType, setSecBranchDeviceType] = useState<'FCO' | 'LBSM' | 'Recloser' | 'PMCB'>('FCO');
  const [secFcoName, setSecFcoName] = useState('');
  const [secFcoLength, setSecFcoLength] = useState<number | string>('');
  const [secFcoKha, setSecFcoKha] = useState<number | string>('');
  const [secFcoLaterals, setSecFcoLaterals] = useState<string[]>([]);
  const [newLateralInput, setNewLateralInput] = useState('');
  const [secFcoBranches, setSecFcoBranches] = useState<BranchDevice[]>([]);

  const handleAddBranch = () => {
    const newBr: BranchDevice = {
      id: `br-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      branchDeviceType: 'FCO',
      fcoBranchName: '',
      fcoLengthKms: undefined,
      fcoKhaAmpere: undefined,
      fcoLaterals: []
    };
    setSecFcoBranches(prev => [...prev, newBr]);
    setSecHasFco(true);
  };

  const handleRemoveBranch = (index: number) => {
    setSecFcoBranches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setSecHasFco(false);
      return updated;
    });
  };

  const handleUpdateBranch = (index: number, key: keyof BranchDevice, val: any) => {
    setSecFcoBranches(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  // Section Pemutus Linkage
  const [secPemutusId, setSecPemutusId] = useState<string>('');
  const [secPemutusCode, setSecPemutusCode] = useState<string>('');
  const [secPemutusType, setSecPemutusType] = useState<string>('');

  // Live Telemetry Monitoring States (Manual Input - No automatic prefill)
  const [secCurrentLoad, setSecCurrentLoad] = useState<number | string>('');
  const [secVoltageKv, setSecVoltageKv] = useState<number | string>('');
  const [secVoltageDrop, setSecVoltageDrop] = useState<number | string>('');
  const [secTemp, setSecTemp] = useState<number | string>('');

  // Simulated Section Outage State for SAIDI/SAIFI Downstream Impact
  const [simulatedOutageSectionId, setSimulatedOutageSectionId] = useState<string | null>(null);

  // GH Form States
  const [ghCode, setGhCode] = useState('');
  const [ghName, setGhName] = useState('');
  const [ghLoc, setGhLoc] = useState('');
  const [ghCoordinates, setGhCoordinates] = useState('');
  const [ghInCount, setGhInCount] = useState<number | string>('');
  const [ghIncoming, setGhIncoming] = useState('');
  const [ghOutCount, setGhOutCount] = useState<number | string>('');
  const [ghOutList, setGhOutList] = useState('');
  const [ghType, setGhType] = useState<'Indoor' | 'Outdoor' | 'Compact'>('Indoor');
  const [ghStatus, setGhStatus] = useState<'Operasi' | 'Standby' | 'Pemeliharaan'>('Operasi');

  // GD Form States
  const [gdCode, setGdCode] = useState('');
  const [gdName, setGdName] = useState('');
  const [gdFeeder, setGdFeeder] = useState('');
  const [gdSection, setGdSection] = useState('');
  const [gdKva, setGdKva] = useState<number | string>(160);
  const [gdPhase, setGdPhase] = useState<'3 Phasa' | '1 Phasa'>('3 Phasa');
  const [gdType, setGdType] = useState<'Portal' | 'Cantol' | 'Beton' | 'Kios'>('Portal');
  const [gdLoc, setGdLoc] = useState('');
  const [gdCust, setGdCust] = useState<number | string>(0);
  const [gdStatus, setGdStatus] = useState<'Operasi' | 'Tidak Operasi' | 'Pemeliharaan'>('Operasi');

  // Pemutus Form States
  const [pmtCode, setPmtCode] = useState('');
  const [pmtType, setPmtType] = useState<'Recloser' | 'LBS Motorized' | 'LBS Manual' | 'PMT' | 'FCO' | 'Disconnector (DS)' | 'PMCB'>('PMCB');
  const [pmtFeeder, setPmtFeeder] = useState('');
  const [pmtSectionId, setPmtSectionId] = useState('');
  const [pmtSectionName, setPmtSectionName] = useState('');
  const [pmtLoc, setPmtLoc] = useState('');
  const [pmtBrand, setPmtBrand] = useState('');
  const [pmtRating, setPmtRating] = useState<number | string>(630);
  const [pmtScada, setPmtScada] = useState<'Terhubung SCADA' | 'Manual / Non-SCADA' | 'Gangguan Link'>('Terhubung SCADA');
  const [pmtStatus, setPmtStatus] = useState<'Masuk / ON' | 'Lepas / OFF' | 'Pemeliharaan'>('Masuk / ON');

  // Handle Feeder Edit
  const openEditFeeder = (feeder: MasterFeeder) => {
    setFeederToEdit(feeder);
    setFCode(feeder.feederCode);
    setFName(feeder.feederName);
    setFGi(feeder.substationName || '-');
    const ghVal = feeder.garduHubung || '-';
    setFGh(ghVal);
    // Any feeder from Gardu Hubung is Percabangan
    const statusVal = (ghVal && ghVal !== '-') ? 'Percabangan' : (feeder.status || 'Utama');
    setFStatus(statusVal);
    setFOpStatus(feeder.operationalStatus || 'Operasi');

    const matchingSections = masterSections.filter(
      s => s.feederName && s.feederName.trim().toLowerCase() === feeder.feederName.trim().toLowerCase()
    );
    const totalSecCust = matchingSections.reduce((acc, s) => acc + (Number(s.customerCount) || 0), 0);
    const hasSecs = matchingSections.length > 0;

    const matchingGds = masterGarduDistribusi.filter(
      g => g.feederName && g.feederName.trim().toLowerCase() === feeder.feederName.trim().toLowerCase()
    );
    const totalKvaGds = matchingGds.reduce((acc, g) => acc + (Number(g.capacityKva) || 0), 0);

    const secLenSum = matchingSections.reduce((acc, s) => acc + (s.lengthKms || 0) + (s.hasFcoBranch ? (s.fcoLengthKms || 0) : 0), 0);
    const secGarduSum = matchingSections.reduce((acc, s) => acc + (s.garduCount || 0), 0);

    const calcKva = totalKvaGds > 0 ? totalKvaGds : (feeder.capacityKva || feeder.khaAmpere || 0);
    const calcLength = secLenSum > 0 ? Number(secLenSum.toFixed(1)) : (feeder.lengthKms || 0);
    const calcGardu = matchingGds.length > 0 ? matchingGds.length : (secGarduSum > 0 ? secGarduSum : (feeder.garduCount || 0));
    const calcCust = totalSecCust > 0 ? totalSecCust : (feeder.customerCount || 0);

    setFKha(feeder.capacityKva || feeder.khaAmpere || (calcKva > 0 ? calcKva : ''));
    setFLength(feeder.lengthKms !== undefined && feeder.lengthKms !== null && feeder.lengthKms > 0 ? feeder.lengthKms : (calcLength > 0 ? calcLength : ''));
    setFGarduCount(feeder.garduCount !== undefined && feeder.garduCount !== null && feeder.garduCount > 0 ? feeder.garduCount : (calcGardu > 0 ? calcGardu : ''));
    setFCust(feeder.customerCount !== undefined && feeder.customerCount !== null && feeder.customerCount > 0 ? feeder.customerCount : (calcCust > 0 ? calcCust : ''));
    setFConfig(feeder.configuration || 'Looping');
  };

  const handleSaveFeeder = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGh = fGh === '-' ? '' : fGh;
    // Rule: Semua penyulang dari Gardu Hubung adalah Percabangan
    const finalStatus = (finalGh && finalGh !== '') ? 'Percabangan' : fStatus;
    const payload: MasterFeeder = {
      id: feederToEdit ? feederToEdit.id : `MF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      feederCode: fCode.trim().toUpperCase(),
      feederName: fName.trim(),
      substationName: fGi,
      garduHubung: finalGh,
      status: finalStatus,
      operationalStatus: fOpStatus,
      khaAmpere: Number(fKha) || 0,
      capacityKva: Number(fKha) || 0,
      lengthKms: Number(fLength) || 0,
      garduCount: Number(fGarduCount) || 0,
      customerCount: Number(fCust) || 0,
      configuration: fConfig
    };
    onSaveMasterFeeder(payload);
    setFeederToEdit(null);
    setIsAddFeederOpen(false);
  };

  // Handle Section Edit & Save
  const openEditSection = (sec: MasterSection) => {
    setSectionToEdit(sec);
    setSecCode(sec.sectionCode);
    setSecName(sec.sectionName);
    setSecFeeder(sec.feederName);
    setSecSubstation(sec.substationOrGh || (availableGHs[0] || availableGIs[0] || 'GH Bandara'));
    setSecStart(sec.startPoint || '');
    setSecEnd(sec.endPoint || '');
    setSecGarduCount(sec.garduCount !== undefined && sec.garduCount !== null ? sec.garduCount : '');
    setSecLength(sec.lengthKms !== undefined && sec.lengthKms !== null ? sec.lengthKms : '');
    setSecKha(sec.khaAmpere !== undefined && sec.khaAmpere !== null ? sec.khaAmpere : '');
    setSecBebanUtama(sec.bebanUtamaKha !== undefined ? sec.bebanUtamaKha : (sec.lengthKms ?? ''));
    setSecBebanCabang(sec.bebanCabangKha !== undefined ? sec.bebanCabangKha : (sec.hasFcoBranch ? (sec.garduCount ?? '') : ''));
    setSecTotalBeban(sec.totalBebanKha !== undefined ? sec.totalBebanKha : (sec.khaAmpere ?? ''));
    setSecCust(sec.customerCount !== undefined && sec.customerCount !== null ? sec.customerCount : '');
    setSecStatus(sec.status || 'Operasi');
    setSecPemutusId(sec.pemutusId || '');
    setSecPemutusCode(sec.pemutusCode || '');
    setSecPemutusType(sec.pemutusType || '');

    const branches = getSectionBranches(sec);
    setSecFcoBranches(branches);
    setSecHasFco(branches.length > 0);
    if (branches.length > 0) {
      setSecBranchDeviceType((branches[0].branchDeviceType as any) || 'FCO');
      setSecFcoName(branches[0].fcoBranchName || '');
      setSecFcoLength(branches[0].fcoLengthKms !== undefined ? branches[0].fcoLengthKms : '');
      setSecFcoKha(branches[0].fcoKhaAmpere !== undefined ? branches[0].fcoKhaAmpere : '');
      setSecFcoLaterals(branches[0].fcoLaterals && branches[0].fcoLaterals.length > 0 ? [...branches[0].fcoLaterals] : []);
    } else {
      setSecBranchDeviceType('FCO');
      setSecFcoName('');
      setSecFcoLength('');
      setSecFcoKha('');
      setSecFcoLaterals([]);
    }
    setNewLateralInput('');
    setSecCurrentLoad(sec.currentLoadAmpere !== undefined && sec.currentLoadAmpere !== null ? sec.currentLoadAmpere : '');
    setSecVoltageKv(sec.voltageKv !== undefined && sec.voltageKv !== null ? sec.voltageKv : '');
    setSecVoltageDrop(sec.voltageDropPercent !== undefined && sec.voltageDropPercent !== null ? sec.voltageDropPercent : '');
    setSecTemp(sec.temperatureCelsius !== undefined && sec.temperatureCelsius !== null ? sec.temperatureCelsius : '');
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    const branchesToSave = secFcoBranches.map(b => ({
      ...b,
      fcoBranchName: b.fcoBranchName.trim() || `${b.branchDeviceType || 'FCO'} Percabangan`
    }));
    const hasBranch = branchesToSave.length > 0;

    const payload: MasterSection = {
      id: sectionToEdit ? sectionToEdit.id : `SEC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sectionCode: secCode.trim().toUpperCase(),
      sectionName: secName.trim(),
      feederName: secFeeder.trim(),
      substationOrGh: secSubstation.trim(),
      startPoint: secStart.trim(),
      endPoint: secEnd.trim(),
      garduCount: secGarduCount !== '' ? Number(secGarduCount) : 0,
      lengthKms: secLength !== '' ? Number(secLength) : 0,
      khaAmpere: secKha !== '' ? Number(secKha) : 0,
      bebanUtamaKha: secBebanUtama !== '' ? Number(secBebanUtama) : (secLength !== '' ? Number(secLength) : 0),
      bebanCabangKha: secBebanCabang !== '' ? Number(secBebanCabang) : 0,
      totalBebanKha: secTotalBeban !== '' ? Number(secTotalBeban) : (secKha !== '' ? Number(secKha) : 0),
      customerCount: secCust !== '' ? Number(secCust) : 0,
      status: secStatus || 'Operasi',
      pemutusId: secPemutusId || undefined,
      pemutusCode: secPemutusCode || undefined,
      pemutusType: secPemutusType || undefined,
      fcoBranches: branchesToSave,
      hasFcoBranch: hasBranch,
      branchDeviceType: hasBranch ? branchesToSave[0].branchDeviceType : 'FCO',
      fcoBranchName: hasBranch ? branchesToSave[0].fcoBranchName : '',
      fcoLengthKms: hasBranch ? branchesToSave[0].fcoLengthKms : undefined,
      fcoKhaAmpere: hasBranch ? branchesToSave[0].fcoKhaAmpere : undefined,
      fcoLaterals: hasBranch ? branchesToSave[0].fcoLaterals : [],
      currentLoadAmpere: secCurrentLoad !== '' ? Number(secCurrentLoad) : undefined,
      voltageKv: secVoltageKv !== '' ? Number(secVoltageKv) : undefined,
      voltageDropPercent: secVoltageDrop !== '' ? Number(secVoltageDrop) : undefined,
      temperatureCelsius: secTemp !== '' ? Number(secTemp) : undefined
    };
    if (onSaveMasterSection) onSaveMasterSection(payload);
    
    // Auto-sync the connected MasterPemutus if selected
    if (secPemutusId && onSaveMasterPemutus) {
      const pObj = masterPemutus.find(p => p.id === secPemutusId);
      if (pObj) {
        onSaveMasterPemutus({
          ...pObj,
          sectionId: payload.id,
          sectionName: payload.sectionName
        });
      }
    }

    setSectionToEdit(null);
    setIsAddSectionOpen(false);
  };

  // Handle GH Edit & Save
  const openEditGh = (gh: MasterGarduHubung) => {
    setGhToEdit(gh);
    setGhCode(gh.ghCode);
    setGhName(gh.ghName);
    setGhLoc(gh.location);
    setGhCoordinates(gh.coordinates || '');
    setGhInCount(gh.incomingFeedersCount ?? '');
    setGhIncoming(gh.incomingFeeder);
    setGhOutCount(gh.outgoingFeedersCount ?? '');
    setGhOutList(gh.outgoingFeedersList);
    setGhType(gh.ghType);
    setGhStatus(gh.status);
  };

  const handleSaveGh = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MasterGarduHubung = {
      id: ghToEdit ? ghToEdit.id : `GH-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ghCode: ghCode.trim().toUpperCase(),
      ghName: ghName.trim(),
      location: ghLoc.trim(),
      coordinates: ghCoordinates.trim(),
      incomingFeedersCount: ghInCount !== '' ? Number(ghInCount) : 0,
      incomingFeeder: ghIncoming.trim(),
      outgoingFeedersCount: ghOutCount !== '' ? Number(ghOutCount) : 0,
      outgoingFeedersList: ghOutList.trim(),
      ghType: ghType,
      status: ghStatus
    };
    if (onSaveMasterGarduHubung) onSaveMasterGarduHubung(payload);
    setGhToEdit(null);
    setIsAddGhOpen(false);
  };

  // Handle GD Edit & Save
  const openEditGd = (gd: MasterGarduDistribusi) => {
    setGdToEdit(gd);
    setGdCode(gd.garduCode);
    setGdName(gd.garduName);
    setGdFeeder(gd.feederName);
    setGdSection(gd.sectionName || '');
    setGdKva(gd.capacityKva);
    setGdPhase(gd.phase);
    setGdType(gd.garduType);
    setGdLoc(gd.location);
    setGdCust(gd.customerCount ?? 0);
    setGdStatus(gd.status);
  };

  const handleSaveGd = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MasterGarduDistribusi = {
      id: gdToEdit ? gdToEdit.id : `GD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      garduCode: gdCode.trim().toUpperCase(),
      garduName: gdName.trim(),
      feederName: gdFeeder.trim(),
      sectionName: gdSection.trim(),
      capacityKva: Number(gdKva) || 0,
      phase: gdPhase,
      garduType: gdType,
      location: gdLoc.trim(),
      customerCount: Number(gdCust) || 0,
      status: gdStatus
    };
    if (onSaveMasterGarduDistribusi) onSaveMasterGarduDistribusi(payload);
    setGdToEdit(null);
    setIsAddGdOpen(false);
  };

  // Handle Pemutus Edit & Save
  const openEditPmt = (pmt: MasterPemutus) => {
    setPmtToEdit(pmt);
    setPmtCode(pmt.equipmentCode);
    setPmtType(pmt.equipmentType);
    setPmtFeeder(pmt.feederName);
    setPmtSectionId(pmt.sectionId || '');
    setPmtSectionName(pmt.sectionName || '');
    setPmtLoc(pmt.location);
    setPmtBrand(pmt.brandModel);
    setPmtRating(pmt.currentRatingAmpere);
    setPmtScada(pmt.scadaStatus);
    setPmtStatus(pmt.status);
  };

  const handleSavePmt = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSec = masterSections.find(s => s.id === pmtSectionId);
    const payload: MasterPemutus = {
      id: pmtToEdit ? pmtToEdit.id : `PMT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      equipmentCode: pmtCode.trim().toUpperCase(),
      equipmentType: pmtType,
      feederName: pmtFeeder.trim(),
      sectionId: pmtSectionId || undefined,
      sectionName: matchedSec ? matchedSec.sectionName : (pmtSectionName.trim() || undefined),
      location: pmtLoc.trim(),
      brandModel: pmtBrand.trim(),
      currentRatingAmpere: Number(pmtRating) || 0,
      scadaStatus: pmtScada,
      status: pmtStatus
    };
    if (onSaveMasterPemutus) onSaveMasterPemutus(payload);

    // Also auto-update the connected section if linked!
    if (pmtSectionId && matchedSec && onSaveMasterSection) {
      onSaveMasterSection({
        ...matchedSec,
        pemutusId: payload.id,
        pemutusCode: payload.equipmentCode,
        pemutusType: payload.equipmentType
      });
    }

    setPmtToEdit(null);
    setIsAddPmtOpen(false);
  };

  const tabButtons = [
    { id: 'penyulang' as MasterDataSubTab, label: 'Data Penyulang', icon: Database, count: masterFeeders.length },
    { id: 'section' as MasterDataSubTab, label: 'Data Section', icon: Layers, count: masterSections.length },
    { id: 'gardu_hubung' as MasterDataSubTab, label: 'Data Gardu Hubung', icon: Building2, count: masterGarduHubung.length },
    { id: 'gardu_distribusi' as MasterDataSubTab, label: 'Data Gardu Distribusi', icon: Zap, count: masterGarduDistribusi.length },
    { id: 'pemutus' as MasterDataSubTab, label: 'Data Pemutus', icon: SlidersHorizontal, count: masterPemutus.length },
  ];

  return (
    <div className="space-y-4">
      {/* Master Data Header with Sub-Tabs */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${
        isDarkMode ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Master Data Jaringan 20kV ULP Baguala
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventaris Lengkap Data Penyulang, Section, Gardu Hubung, Gardu Distribusi, dan Alat Pemutus
              </p>
            </div>
          </div>
        </div>

        {/* 5 Tab Navigation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {tabButtons.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isDarkMode 
                      ? 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DATA PENYULANG (Exact implementation requested by user)               */}
      {/* ========================================================================= */}
      {activeTab === 'penyulang' && (
        <div className="space-y-4">
          {/* Master Data Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total Penyulang</span>
                <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-purple-700 dark:text-purple-400">
                {masterFeeders.length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total Panjang</span>
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Route className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">
                {masterFeeders.reduce((acc, f) => {
                  const matchingSecs = masterSections.filter(s => s.feederName && matchFeederName(s.feederName, f.feederName));
                  const secLenSum = matchingSecs.reduce((sAcc, s) => sAcc + (s.lengthKms || 0) + (s.hasFcoBranch ? (s.fcoLengthKms || 0) : 0), 0);
                  const len = (f.lengthKms !== undefined && f.lengthKms !== null && f.lengthKms > 0) ? f.lengthKms : secLenSum;
                  return acc + (len || 0);
                }, 0).toFixed(1)} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">KMS</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total Gardu</span>
                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-cyan-700 dark:text-cyan-400">
                {masterGarduDistribusi.length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Unit</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total Kapasitas</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Gauge className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {masterGarduDistribusi.reduce((acc, g) => acc + (g.capacityKva || 0), 0).toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">kVA</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total Pelanggan</span>
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-amber-700 dark:text-amber-400">
                {masterFeeders.reduce((acc, f) => {
                  const matchingSecs = masterSections.filter(s => s.feederName && matchFeederName(s.feederName, f.feederName));
                  const secCustSum = matchingSecs.reduce((sAcc, s) => sAcc + (Number(s.customerCount) || 0), 0);
                  const cust = (f.customerCount !== undefined && f.customerCount !== null && f.customerCount > 0) ? f.customerCount : secCustSum;
                  return acc + (cust || 0);
                }, 0).toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Plg</span>
              </div>
            </div>
          </div>

          {/* Search Bar & Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan Kode Penyulang, Nama, GI, atau GH..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>
            <button
              onClick={() => {
                setFeederToEdit(null);
                setFCode('');
                setFName('');
                setFGi('GI Passo');
                setFGh('-');
                setFStatus('Utama');
                setFOpStatus('Operasi');
                setFKha('');
                setFLength('');
                setFGarduCount('');
                setFCust('');
                setFConfig('Looping');
                setIsAddFeederOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Penyulang</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80 w-8">No</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Kode</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Nama Penyulang</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Gardu Induk (GI)</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Gardu Hubung (GH)</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Jalur</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Status</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Pnjang (KMS)</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Gardu (BH)</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Gardu (KVA)</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Pelanggan</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Konfigurasi</th>
                    <th className="px-1.5 py-2.5 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterFeeders
                    .filter(f => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (f.feederCode || '').toLowerCase().includes(q) ||
                             (f.feederName || '').toLowerCase().includes(q) ||
                             (f.substationName || '').toLowerCase().includes(q) ||
                             (f.garduHubung || '').toLowerCase().includes(q);
                    })
                    .sort((a, b) => (a.feederName || a.feederCode || '').localeCompare(b.feederName || b.feederCode || '', undefined, { numeric: true }))
                    .map((feeder, idx) => {
                      // Dynamically sync metrics with real sections and gardu distribusi
                      const matchingSections = masterSections.filter(
                        s => s.feederName && matchFeederName(s.feederName, feeder.feederName)
                      );
                      const matchingGds = masterGarduDistribusi.filter(
                        g => g.feederName && matchFeederName(g.feederName, feeder.feederName)
                      );
                      const totalKvaGds = matchingGds.reduce((acc, g) => acc + (g.capacityKva || 0), 0);
                      const hasSecs = matchingSections.length > 0;
                      const totalSecCust = matchingSections.reduce((acc, s) => acc + (Number(s.customerCount) || 0), 0);
                      const secLengthSum = matchingSections.reduce((acc, s) => acc + (s.lengthKms || 0) + (s.hasFcoBranch ? (s.fcoLengthKms || 0) : 0), 0);
                      const secGarduSum = matchingSections.reduce((acc, s) => acc + (s.garduCount || 0), 0);
                      
                      const realGardu = (feeder.garduCount !== undefined && feeder.garduCount !== null && feeder.garduCount > 0)
                        ? feeder.garduCount
                        : (matchingGds.length > 0 ? matchingGds.length : (secGarduSum > 0 ? secGarduSum : 0));
                      
                      const realLength = (feeder.lengthKms !== undefined && feeder.lengthKms !== null && feeder.lengthKms > 0)
                        ? feeder.lengthKms
                        : (secLengthSum > 0 ? Number(secLengthSum.toFixed(1)) : 0);
                      
                      const realKvaGardu = (feeder.capacityKva || feeder.khaAmpere || 0) > 0
                        ? (feeder.capacityKva || feeder.khaAmpere)
                        : (matchingGds.length > 0 ? totalKvaGds : 0);
                      
                      const realCust = (feeder.customerCount !== undefined && feeder.customerCount !== null && feeder.customerCount > 0)
                        ? feeder.customerCount
                        : (totalSecCust > 0 ? totalSecCust : 0);

                      // Synchronized Feeder Reliability Metrics (SAIDI, SAIFI, ENS)
                      const feederTrips = (trips || []).filter(t => matchFeederName(t.feederName, feeder.feederName));
                      const tripCount = feederTrips.length;
                      const feederSaidi = feederTrips.reduce((acc, t) => {
                        const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
                        return acc + (saidi || 0);
                      }, 0);
                      const feederSaifi = feederTrips.reduce((acc, t) => {
                        const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
                        return acc + (saifi || 0);
                      }, 0);
                      const feederEns = feederTrips.reduce((acc, t) => acc + (t.ensKwh || 0), 0);

                      return (
                        <tr key={`${feeder.id || 'feeder'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-1.5 py-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{idx + 1}</td>
                          <td className="px-2 py-2 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{feeder.feederCode}</td>
                          <td className="px-2 py-2 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {feeder.feederName}
                          </td>
                          <td className="px-1.5 py-2 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{feeder.substationName || '-'}</td>
                          <td className="px-1.5 py-2 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{feeder.garduHubung || '-'}</td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                            {(() => {
                              const isPercabangan = (feeder.garduHubung && feeder.garduHubung !== '-') || feeder.status === 'Percabangan';
                              const displayStatus = isPercabangan ? 'Percabangan' : 'Utama';
                              return (
                                <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                                  displayStatus === 'Percabangan' 
                                    ? 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' 
                                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                }`}>
                                  {displayStatus}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                              feeder.operationalStatus === 'Tidak Operasi' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {feeder.operationalStatus === 'Tidak Operasi' ? 'Tidak Operasi' : 'Operasi'}
                            </span>
                          </td>
                          <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {realLength}
                          </td>
                          <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {realGardu}
                          </td>
                          <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {realKvaGardu} kVA
                          </td>
                          <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {realCust}
                          </td>
                          <td className="px-1.5 py-2 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{feeder.configuration || 'Looping'}</td>
                          <td className="px-1 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditFeeder(feeder)}
                                className="p-1 rounded hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                                title="Edit Penyulang"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setFeederToDelete(feeder)}
                                className="p-1 rounded hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                                title="Hapus Penyulang"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DATA SECTION                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'section' && (() => {
        // Feeder selection and filtering
        const availableFeeders: string[] = (Array.from(new Set(masterFeeders.map(f => f.feederName))) as string[]).sort((a, b) => a.localeCompare(b));
        const isUnselected = selectedSectionFeeder === 'ALL';
        const activeFeederName = isUnselected ? '-' : selectedSectionFeeder;

        const matchingFeeder = isUnselected ? null : masterFeeders.find(
          f => f.feederName.toLowerCase() === activeFeederName.toLowerCase()
        );

        const feederCodeDisplay = isUnselected
          ? '-'
          : activeFeederName.toLowerCase() === 'allang'
            ? 'ALG-ALLANG'
            : matchingFeeder
              ? `${matchingFeeder.feederCode}-${matchingFeeder.feederName.toUpperCase()}`
              : `SEC-${activeFeederName.toUpperCase()}`;

        // Filter sections based on selected feeder & search
        const feederSections = isUnselected ? [] : masterSections.filter(s => {
          if (s.feederName.toLowerCase() !== selectedSectionFeeder.toLowerCase()) {
            return false;
          }
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (s.sectionCode || '').toLowerCase().includes(q) ||
                 (s.sectionName || '').toLowerCase().includes(q) ||
                 (s.feederName || '').toLowerCase().includes(q) ||
                 (s.startPoint || '').toLowerCase().includes(q) ||
                 (s.endPoint || '').toLowerCase().includes(q);
        }).sort((a, b) => {
          // Sort natural ascending: SEC-01 at the top, followed by SEC-02, SEC-03, etc.
          const extractSeq = (code: string, name: string) => {
            const match = (code + ' ' + name).match(/sec(?:tion)?[-_\s]*(\d+)/i) || (code + ' ' + name).match(/(\d+)/);
            return match ? parseInt(match[1], 10) : 999999;
          };
          const seqA = extractSeq(a.sectionCode || '', a.sectionName || '');
          const seqB = extractSeq(b.sectionCode || '', b.sectionName || '');
          if (seqA !== seqB) return seqA - seqB;
          return (a.sectionCode || '').localeCompare(b.sectionCode || '', undefined, { numeric: true, sensitivity: 'base' });
        });

        // Summary KPI calculations based on real section data (Accumulates all sections when unselected/initial view)
        const sectionsForKpi = isUnselected
          ? masterSections.filter(s => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (s.sectionCode || '').toLowerCase().includes(q) ||
                     (s.sectionName || '').toLowerCase().includes(q) ||
                     (s.feederName || '').toLowerCase().includes(q) ||
                     (s.startPoint || '').toLowerCase().includes(q) ||
                     (s.endPoint || '').toLowerCase().includes(q);
            })
          : feederSections;

        const totalSectionCount = sectionsForKpi.length;
        const totalGarduCount = sectionsForKpi.reduce((acc, s) => acc + (s.garduCount || 0), 0);
        const mainLengthKms = sectionsForKpi.reduce((acc, s) => acc + (s.lengthKms || 0), 0);
        const branchLengthKms = sectionsForKpi.reduce((acc, s) => acc + getSectionBranches(s).reduce((bAcc, b) => bAcc + (b.fcoLengthKms || 0), 0), 0);
        const totalLengthKms = mainLengthKms + branchLengthKms;
        const totalCustomers = sectionsForKpi.reduce((acc, s) => acc + (s.customerCount || 0), 0);
        const peakKha = (Math.max(...sectionsForKpi.map(s => s.khaAmpere || s.totalBebanKha || 0), 0) || (matchingFeeder?.khaAmpere || 0));
        const totalBebanKha = sectionsForKpi.reduce((acc, s) => acc + (s.totalBebanKha || s.khaAmpere || 0), 0);
        const measuredCurrent = sectionsForKpi.reduce((acc, s) => acc + (s.currentLoadAmpere || s.currentLoad || 0), 0);
        const totalBranchCount = sectionsForKpi.reduce((acc, s) => acc + getSectionBranches(s).length, 0);
        const hasWarning = sectionsForKpi.some(s => s.status === 'Warning' || s.status === 'Kritis');

        return (
          <div className="space-y-4">
            {/* Top Breadcrumb & Status Bar */}
            <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#0B132B] border-slate-800 text-white' : 'bg-slate-50 border-slate-300/90 text-slate-900 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={isDarkMode ? 'text-slate-400 hover:text-blue-400 cursor-pointer' : 'text-slate-700 hover:text-blue-600 cursor-pointer'}>Beranda</span>
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>&gt;</span>
                <span className={isDarkMode ? 'text-slate-400 hover:text-blue-400 cursor-pointer' : 'text-slate-700 hover:text-blue-600 cursor-pointer'}>Penyulang</span>
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>&gt;</span>
                <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  {selectedSectionFeeder === 'ALL' ? 'Pilih Penyulang' : `Penyulang ${selectedSectionFeeder}`}
                </span>
                <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-700'}>Tab</span>
                <span className={`font-black px-2 py-0.5 rounded-md ${
                  isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-700 bg-blue-500/15 border border-blue-500/20'
                }`}>
                  Detail Jaringan & Section
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Status Operasional:</span>
                <span className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                  hasWarning 
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                    : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                }`}>
                  {hasWarning ? 'Warning / Perlu Inspeksi' : 'Normal / Siap Operasi'}
                </span>
              </div>
            </div>

            {/* 5 Real Synchronized Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Card 1: Penyulang Info */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[106px] transition-all ${
                isDarkMode 
                  ? 'bg-[#0B132B] border-slate-800 text-white' 
                  : 'bg-slate-50/90 border-slate-300 text-slate-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Penyulang
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className={`text-xl font-black tracking-tight truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    {isUnselected ? 'SEMUA PENYULANG' : activeFeederName.toUpperCase()}
                  </div>
                  <div className={`text-[11.5px] font-extrabold flex items-center gap-1.5 mt-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    {isUnselected ? (
                      <span>Total {masterFeeders.length} Penyulang</span>
                    ) : (
                      <>
                        <span>{feederCodeDisplay}</span>
                        <span>•</span>
                        <span className={`truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                          {matchingFeeder?.garduHubung && matchingFeeder.garduHubung !== '-' 
                            ? matchingFeeder.garduHubung 
                            : (matchingFeeder?.substationName && matchingFeeder.substationName !== '-' ? matchingFeeder.substationName : '-')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Total Section */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[106px] transition-all ${
                isDarkMode 
                  ? 'bg-[#0B132B] border-slate-800 text-white' 
                  : 'bg-slate-50/90 border-slate-300 text-slate-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Total Section
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                      {totalSectionCount}
                    </span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                      Section
                    </span>
                  </div>
                  <div className={`text-[11.5px] font-extrabold mt-1 ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
                  }`}>
                    {totalBranchCount > 0 ? `${totalBranchCount} Perc. Lateral` : '0 Perc. Lateral'}
                  </div>
                </div>
              </div>

              {/* Card 3: Total Gardu */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[106px] transition-all ${
                isDarkMode 
                  ? 'bg-[#0B132B] border-slate-800 text-white' 
                  : 'bg-slate-50/90 border-slate-300 text-slate-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Total Gardu
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                      {totalGarduCount}
                    </span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                      Gardu
                    </span>
                  </div>
                  <div className={`text-[11.5px] font-extrabold mt-1 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    {totalCustomers > 0 ? `${totalCustomers.toLocaleString('id-ID')} Pelanggan Terlayani` : 'Tersinkron Real Section'}
                  </div>
                </div>
              </div>

              {/* Card 4: Total Panjang KMS */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[106px] transition-all ${
                isDarkMode 
                  ? 'bg-[#0B132B] border-slate-800 text-white' 
                  : 'bg-slate-50/90 border-slate-300 text-slate-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Total Panjang
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                    <Route className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                      {totalLengthKms.toFixed(1)}
                    </span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                      KMS
                    </span>
                  </div>
                  <div className={`text-[11.5px] font-extrabold mt-1 ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-800'
                  }`}>
                    Utama: {mainLengthKms.toFixed(1)} km {branchLengthKms > 0 ? `| FCO: ${branchLengthKms.toFixed(1)} km` : ''}
                  </div>
                </div>
              </div>

              {/* Card 5: Kapasitas Gardu (kVA) */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[106px] transition-all ${
                isDarkMode 
                  ? 'bg-[#0B132B] border-slate-800 text-white' 
                  : 'bg-slate-50/90 border-slate-300 text-slate-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    kVA Gardu
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  {(() => {
                    const matchingGds = isUnselected ? [] : masterGarduDistribusi.filter(
                      g => g.feederName && g.feederName.trim().toLowerCase() === selectedSectionFeeder.trim().toLowerCase()
                    );
                    const totalKva = matchingGds.reduce((acc, g) => acc + (g.capacityKva || 0), 0);
                    const displayKva = totalKva > 0 ? totalKva : peakKha;

                    return (
                      <>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                            {displayKva}
                          </span>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                            kVA
                          </span>
                        </div>
                        <div className={`text-[11.5px] font-extrabold mt-1 ${
                          isDarkMode ? 'text-rose-400' : 'text-rose-700'
                        }`}>
                          {matchingGds.length > 0 ? `${matchingGds.length} Gardu Terdaftar (Tersinkron)` : (measuredCurrent > 0 ? `Arus Real: ${measuredCurrent} A` : `Estimasi: ${displayKva} kVA`)}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* View Sub-Tabs: Topologi & Tabel vs Live Telemetry Monitoring */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSectionViewTab('topology_table')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    sectionViewTab === 'topology_table'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isDarkMode
                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <span>Topologi Skematik & Tabel Detail</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSectionViewTab('monitoring')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    sectionViewTab === 'monitoring'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : isDarkMode
                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Activity className="w-4 h-4 text-amber-300" />
                  <span>Tampilan Monitoring Section Real-time</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-[11px]">
                  Jalur Utama
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px]">
                  FCO Percabangan Lateral
                </span>
              </div>
            </div>

            {/* Filter, Search & Add Data Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan Kode Section, Nama, atau Penyulang..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedSectionFeeder}
                  onChange={(e) => {
                    setSelectedSectionFeeder(e.target.value);
                    setSelectedSectionId(null);
                  }}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <option value="ALL">Pilih Penyulang</option>
                  {availableFeeders.map(f => (
                    <option key={f} value={f}>
                      {f.toUpperCase()}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const targetFeeder = selectedSectionFeeder === 'ALL' ? '' : selectedSectionFeeder;
                    const fObj = targetFeeder ? masterFeeders.find(f => f.feederName.toLowerCase() === targetFeeder.toLowerCase()) : null;
                    const defaultGiGh = (fObj?.garduHubung && fObj.garduHubung !== '-')
                      ? fObj.garduHubung
                      : ((fObj?.substationName && fObj.substationName !== '-') ? fObj.substationName : '');

                    setSectionToEdit(null);
                    setSecFeeder(targetFeeder);
                    setSecCode(targetFeeder ? generateSectionCode(targetFeeder) : '');
                    setSecName('');
                    setSecSubstation(defaultGiGh);
                    setSecPemutusId('');
                    setSecPemutusCode('');
                    setSecPemutusType('');
                    setSecStart('');
                    setSecEnd('');
                    setSecGarduCount('');
                    setSecLength('');
                    setSecKha('');
                    setSecBebanUtama('');
                    setSecBebanCabang('');
                    setSecTotalBeban('');
                    setSecCust('');
                    setSecStatus('Operasi');
                    setSecHasFco(false);
                    setSecFcoBranches([]);
                    setSecBranchDeviceType('FCO');
                    setSecFcoName('');
                    setSecFcoLength('');
                    setSecFcoKha('');
                    setSecFcoLaterals([]);
                    setNewLateralInput('');
                    setSecCurrentLoad('');
                    setSecVoltageKv('');
                    setSecVoltageDrop('');
                    setSecTemp('');
                    setIsAddSectionOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Section</span>
                </button>
              </div>
            </div>

            {/* 2-Column Split View: Interactive Schematic Topology & Detailed Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Topologi Skematik Interaktif */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                <div className={`p-4 rounded-2xl border flex-1 ${
                  isDarkMode ? 'bg-[#070E20] border-slate-800/90' : 'bg-[#091124] border-slate-800 text-white'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                    <h4 className="font-extrabold text-xs text-white tracking-wide flex items-center gap-2">
                      <span>Topologi Skematik Interaktif: Penyulang {activeFeederName} (Vertical View)</span>
                    </h4>
                    {selectedSectionId && (
                      <button
                        type="button"
                        onClick={() => setSelectedSectionId(null)}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        Reset Fokus
                      </button>
                    )}
                  </div>

                  {/* Section Outage & Cascading SAIDI/SAIFI Simulator Box */}
                  {!isUnselected && feederSections.length > 0 && (
                    <div className="mb-3 p-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-black text-indigo-300 flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Simulasi Lepas Pemutus & Padam Hilir (SAIDI/SAIFI)</span>
                        </div>
                        {simulatedOutageSectionId && (
                          <button
                            type="button"
                            onClick={() => setSimulatedOutageSectionId(null)}
                            className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                          >
                            Reset Simulasi
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Jika suatu pemutus / section lepas, arus terputus dan <strong className="text-amber-300">seluruh section setelahnya (downstream) otomatis padam</strong> dan dihitung ke data SAIDI/SAIFI.
                      </p>
                      {simulatedOutageSectionId ? (
                        (() => {
                          const simIndex = feederSections.findIndex(s => s.id === simulatedOutageSectionId);
                          if (simIndex === -1) return null;
                          const trippedSec = feederSections[simIndex];
                          const downstreamSecs = feederSections.slice(simIndex);
                          const upstreamSecs = feederSections.slice(0, simIndex);
                          const totalPadamCust = downstreamSecs.reduce((acc, s) => acc + (Number(s.customerCount) || 0), 0);
                          const totalPadamLength = downstreamSecs.reduce((acc, s) => acc + (Number(s.lengthKms) || 0), 0);
                          const totalUlpCust = masterFeeders.reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
                          const totalUlp = totalUlpCust > 0 ? totalUlpCust : 45200;
                          const simSaifi = totalPadamCust / totalUlp;
                          const simSaidiHours = (1.5 * totalPadamCust) / totalUlp; // assuming 1.5 hr outage

                          return (
                            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/50 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-rose-300 font-black text-[11px]">
                                <span>⚡ Titik Lepas: {trippedSec.sectionName} ({trippedSec.pemutusCode || 'PMCB/Recloser'})</span>
                                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] uppercase font-bold">Lepas / OFF</span>
                              </div>
                              <div className="text-[10.5px] text-slate-200">
                                <div>• <strong>{upstreamSecs.length} Section Pangkal:</strong> <span className="text-emerald-400 font-bold">AMAN (Tetap Bertegangan)</span></div>
                                <div>• <strong>{downstreamSecs.length} Section Hilir:</strong> <span className="text-rose-400 font-bold">PADAM TOTAL ({downstreamSecs.map(s => s.sectionCode).join(' &rarr; ')})</span></div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-500/30 text-[10px]">
                                <div className="p-1.5 rounded bg-black/40">
                                  <div className="text-slate-400">Total Plg Padam:</div>
                                  <div className="text-amber-300 font-extrabold text-sm">{totalPadamCust.toLocaleString('id-ID')} Pelanggan</div>
                                </div>
                                <div className="p-1.5 rounded bg-black/40">
                                  <div className="text-slate-400">Estimasi SAIFI Gangguan:</div>
                                  <div className="text-cyan-300 font-extrabold text-sm">{simSaifi.toFixed(4)} Kali/Plg</div>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">
                          👉 Klik salah satu section di bawah atau tombol "Simulasi Lepas" pada tabel untuk melihat analisis padam hilir.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schematic Tree Canvas */}
                  {isUnselected ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold">
                      Silakan pilih penyulang terlebih dahulu pada pilihan di atas untuk menampilkan topologi.
                    </div>
                  ) : (
                    <div className="p-4 bg-[#050A18]/90 rounded-xl border border-slate-800/80">
                    {/* Root / Pangkal Node */}
                    <div className="flex items-center gap-2.5 text-white pb-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <div className="font-black text-xs text-slate-100">
                        [{feederSections[0]?.substationOrGh || matchingFeeder?.garduHubung || matchingFeeder?.substationName || 'GI/GH'} (Pangkal)]
                      </div>
                    </div>

                    {/* Vertical Connected Nodes */}
                    <div className="relative pl-3.5 mt-1 space-y-0">
                      {feederSections.map((sec, idx) => {
                        const isWarning = sec.status === 'Warning' || sec.status === 'Kritis';
                        const isSelected = selectedSectionId === sec.id;
                        const isLast = idx === feederSections.length - 1;
                        const secStart = sec.startPoint || (idx > 0 ? feederSections[idx - 1].endPoint : sec.substationOrGh) || 'Pangkal';
                        const secEnd = sec.endPoint || sec.sectionName || 'Ujung Section';
                        const branches = getSectionBranches(sec);

                        // Cascading outage status check
                        const simIndex = simulatedOutageSectionId ? feederSections.findIndex(s => s.id === simulatedOutageSectionId) : -1;
                        const isSimulatedDownstreamPadam = simIndex !== -1 && idx >= simIndex;
                        const isTrippedNode = simIndex !== -1 && idx === simIndex;

                        return (
                          <div key={`${sec.id || 'sec'}-${idx}`} className="relative group">
                            {/* Curved / Vertical branch stem */}
                            <div className="flex items-center h-8 relative">
                              <div className={`w-0.5 h-full absolute left-0 top-0 ${
                                isSimulatedDownstreamPadam ? 'bg-rose-500/80' : 'bg-cyan-500/70'
                              }`}></div>
                              <div className="pl-3 text-[11px] font-extrabold text-slate-300 flex items-center gap-1.5">
                                <span className={isSimulatedDownstreamPadam ? 'text-rose-400' : ''}>{sec.lengthKms} KMS</span>
                                {isLast && <span className="text-[10px] text-cyan-400 font-bold">(Ujung)</span>}
                                {sec.pemutusCode && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/30 text-cyan-300 border border-cyan-500/40">
                                    ⚡ {sec.pemutusCode} ({sec.pemutusType || 'PMCB'})
                                  </span>
                                )}
                                <span className={`text-xs ${isSimulatedDownstreamPadam ? 'text-rose-400' : 'text-cyan-400'}`}>v</span>
                              </div>
                            </div>

                            {/* PERCABANGAN LATERAL BRANCHES (Rendered BEFORE section end node) */}
                            {branches.length > 0 && (
                              <div className="space-y-2">
                                {branches.map((branch, bIdx) => (
                                  <div key={branch.id || bIdx} className="my-2.5 pl-4 relative">
                                    {/* Orange Branch Connector */}
                                    <div className="absolute left-0 top-0 bottom-0 w-4 border-l-2 border-b-2 border-amber-500/80 rounded-bl-lg"></div>
                                    
                                    <div className="space-y-2">
                                      {/* Badge: New Branched Section */}
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs">
                                            <span>&larr;</span>
                                            <span>Percabangan Lateral ({branch.branchDeviceType || 'FCO'}) {branches.length > 1 ? `#${bIdx + 1}` : ''}</span>
                                          </span>
                                          <span className="text-[10.5px] font-bold text-amber-400">
                                            {branch.fcoLengthKms ? `${branch.fcoLengthKms} KMS` : ''}
                                          </span>
                                        </div>
                                        <div className="text-[9.5px] font-bold text-amber-300/80 pl-0.5">
                                          Posisi: Diantara Section [{secStart}] - [{secEnd}]
                                        </div>
                                      </div>

                                      {/* Branch Capsule */}
                                      <div className="p-3 rounded-xl border border-amber-500/60 bg-amber-950/30 text-white space-y-1.5 shadow-lg shadow-amber-500/5">
                                        <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                                            <Zap className="w-3 h-3" />
                                          </div>
                                          <div className="font-extrabold text-xs text-amber-300">
                                            [{branch.fcoBranchName || `${branch.branchDeviceType || 'Percabangan'} Lateral`}]
                                          </div>
                                        </div>
                                        <div className="text-[10px] font-bold text-amber-400/80 pl-7 flex items-center gap-2">
                                          {branch.fcoLengthKms ? <span>{branch.fcoLengthKms} KMS</span> : null}
                                          {branch.fcoLengthKms && branch.fcoKhaAmpere ? <span>•</span> : null}
                                          {branch.fcoKhaAmpere ? <span>kVA Gardu {branch.fcoKhaAmpere} kVA</span> : null}
                                        </div>

                                        {/* Sub-lateral Nodes */}
                                        {branch.fcoLaterals && branch.fcoLaterals.length > 0 && (
                                          <div className="pt-2 pl-7 space-y-1 border-t border-amber-500/20">
                                            {branch.fcoLaterals.map((lat, lIdx) => (
                                              <div key={lIdx} className="text-[10.5px] font-bold text-slate-300 flex items-center gap-1.5">
                                                <span className="text-amber-400 font-black">○</span>
                                                <span>[{lat}]</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Jalur Utama Continuity Indicator to End Node */}
                                      {bIdx === branches.length - 1 && (
                                        <div className="flex items-center gap-2 pt-1 pl-1 text-[11px] font-bold text-cyan-400">
                                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                                          <span>Jalur Utama &rarr; Menuju [{secEnd}]</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Node Capsule Box (Section End Node) */}
                            <div 
                              onClick={() => {
                                setSelectedSectionId(isSelected ? null : sec.id);
                                setSimulatedOutageSectionId(simulatedOutageSectionId === sec.id ? null : sec.id);
                              }}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isTrippedNode 
                                  ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20'
                                  : isSimulatedDownstreamPadam
                                    ? 'bg-rose-950/40 border-rose-500/60 opacity-90'
                                    : isSelected 
                                      ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10' 
                                      : isWarning
                                        ? 'bg-[#14151C] border-amber-500/60 hover:border-amber-400'
                                        : 'bg-[#0B132B]/90 border-cyan-500/30 hover:border-cyan-400'
                              }`}
                            >
                              {/* Node Indicator Dot */}
                              <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                                isTrippedNode
                                  ? 'bg-rose-500 shadow-xs shadow-rose-500 animate-pulse'
                                  : isSimulatedDownstreamPadam
                                    ? 'bg-rose-700'
                                    : isWarning 
                                      ? 'bg-amber-500 shadow-xs shadow-amber-500' 
                                      : 'bg-cyan-500 shadow-xs shadow-cyan-500'
                              }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <div className={`font-black text-xs truncate ${
                                    isTrippedNode ? 'text-rose-300' : isSimulatedDownstreamPadam ? 'text-rose-400' : isWarning ? 'text-amber-300' : 'text-slate-100'
                                  }`}>
                                    [{sec.endPoint || sec.sectionName}]
                                  </div>
                                  {isTrippedNode && (
                                    <span className="px-1.5 py-0.2 rounded text-[8.5px] font-black bg-rose-500 text-white">
                                      PEMUTUS LEPAS
                                    </span>
                                  )}
                                  {isSimulatedDownstreamPadam && !isTrippedNode && (
                                    <span className="px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                      PADAM HILIR
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10.5px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span>{sec.lengthKms} KMS</span>
                                  <span>•</span>
                                  <span>{sec.garduCount} Gardu</span>
                                  <span>•</span>
                                  <span>{sec.customerCount || 0} Plg</span>
                                  {sec.pemutusCode && (
                                    <>
                                      <span>•</span>
                                      <span className="text-cyan-300 font-bold">PMT: {sec.pemutusCode}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Right Column: Data Section Detailed Table */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                <div className={`rounded-2xl border flex-1 flex flex-col overflow-hidden shadow-xs ${
                  isDarkMode ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        Data Section Detailed - Penyulang {activeFeederName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {feederSections.length} Sections
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Parameter Jaringan & Telemetri
                    </span>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#080E21] text-white font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80 w-8">No</th>
                          <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Kode Section</th>
                          <th className="px-2.5 py-2.5 text-left border-r border-slate-800/80">Nama Section</th>
                          <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Alat Pemutus (PMCB/REC)</th>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Panjang</th>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Gardu & Plg</th>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">kVA</th>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Beban (A)</th>
                          <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Status</th>
                          <th className="px-1.5 py-2.5 text-center w-24">Aksi / Simulasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                        {isUnselected ? (
                          <tr>
                            <td colSpan={10} className="p-12 text-center text-slate-400 font-bold">
                              Silakan pilih penyulang terlebih dahulu untuk melihat data section dan jaringan.
                            </td>
                          </tr>
                        ) : feederSections.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-12 text-center text-slate-400 font-bold">
                              Tidak ada data section yang ditemukan.
                            </td>
                          </tr>
                        ) :
                          feederSections.map((sec, idx) => {
                          const isWarning = sec.status === 'Warning' || sec.status === 'Kritis';
                          const isSelected = selectedSectionId === sec.id;
                          const loadAmp = sec.currentLoadAmpere !== undefined ? sec.currentLoadAmpere : (sec.currentLoad || 0);
                          const khaVal = sec.khaAmpere || sec.totalBebanKha || 0;
                          const loadPct = khaVal > 0 ? Math.round((loadAmp / khaVal) * 100) : 0;

                          const simIndex = simulatedOutageSectionId ? feederSections.findIndex(s => s.id === simulatedOutageSectionId) : -1;
                          const isSimulatedPadam = simIndex !== -1 && idx >= simIndex;
                          const isTripped = simIndex !== -1 && idx === simIndex;

                          return (
                            <tr 
                              key={`${sec.id || 'sec'}-${idx}`} 
                              onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
                              className={`transition-colors cursor-pointer ${
                                isTripped
                                  ? 'bg-rose-500/20 text-slate-900 dark:text-white font-bold'
                                  : isSimulatedPadam
                                    ? 'bg-rose-500/10 text-slate-900 dark:text-white'
                                    : isSelected 
                                      ? 'bg-amber-500/15 dark:bg-amber-500/20 text-slate-900 dark:text-white' 
                                      : isWarning
                                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                                        : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="px-1.5 py-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="px-2 py-2 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                  <span>{sec.sectionCode}</span>
                                  {(() => {
                                    const brs = getSectionBranches(sec);
                                    if (brs.length === 0) return null;
                                    const devTypes = Array.from(new Set(brs.map(b => b.branchDeviceType || 'FCO')));
                                    return devTypes.map(dev => (
                                      <span key={dev} className="px-1 py-0.5 rounded text-[8.5px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                        {dev}
                                      </span>
                                    ));
                                  })()}
                                </div>
                              </td>
                              <td className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                <div>{sec.sectionName}</div>
                                {(() => {
                                  const brs = getSectionBranches(sec);
                                  if (brs.length === 0) return null;
                                  return brs.map((br, bIdx) => (
                                    <div key={br.id || bIdx} className="text-[9.5px] text-amber-500 font-semibold mt-0.5 flex items-center gap-1">
                                      <GitBranch className="w-2.5 h-2.5 shrink-0" />
                                      <span>↳ {br.fcoBranchName}</span>
                                    </div>
                                  ));
                                })()}
                              </td>
                              <td className="px-2 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                {sec.pemutusCode ? (
                                  <div className="inline-flex flex-col items-center">
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-blue-500/15 text-blue-600 dark:text-cyan-300 border border-blue-500/30">
                                      ⚡ {sec.pemutusCode}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold">
                                      {sec.pemutusType || 'PMCB'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[10px] italic">-</span>
                                )}
                              </td>
                              <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                <div>{sec.lengthKms || 0} KMS</div>
                                {(() => {
                                  const brs = getSectionBranches(sec);
                                  const totalBrKms = brs.reduce((acc, b) => acc + (b.fcoLengthKms || 0), 0);
                                  if (totalBrKms <= 0) return null;
                                  return (
                                    <div className="text-[9.5px] text-amber-500 font-semibold mt-0.5">
                                      +{totalBrKms.toFixed(1)} km
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                <div>{sec.garduCount || 0} G</div>
                                {sec.customerCount ? (
                                  <div className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                                    {sec.customerCount.toLocaleString('id-ID')} Pel
                                  </div>
                                ) : null}
                              </td>
                              <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                {khaVal} kVA
                              </td>
                              <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                                <div className="flex items-center justify-center gap-0.5 flex-wrap">
                                  <span>{loadAmp} A</span>
                                  {loadAmp > 0 && (
                                    <span className={`text-[9.5px] font-black ${
                                      loadPct > 80 ? 'text-rose-500' : loadPct > 60 ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                      ({loadPct}%)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold">
                                {isTripped ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                                    LEPAS / TRIP
                                  </span>
                                ) : isSimulatedPadam ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                    PADAM HILIR
                                  </span>
                                ) : sec.status === 'Tidak Operasi' ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    Off
                                  </span>
                                ) : sec.status === 'Kritis' ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    Kritis
                                  </span>
                                ) : sec.status === 'Warning' ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    Warn
                                  </span>
                                ) : sec.status === 'Manuver (Open)' || sec.status === 'Manuver' ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                                    <GitBranch className="w-3 h-3 shrink-0" />
                                    Manuver
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                    <Check className="w-3 h-3 shrink-0" />
                                    {sec.status === 'Normal' ? 'Normal' : 'Operasi'}
                                  </span>
                                )}
                              </td>
                              <td className="px-1 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setSimulatedOutageSectionId(simulatedOutageSectionId === sec.id ? null : sec.id)}
                                    className={`p-1.5 rounded-lg cursor-pointer active:scale-90 font-black text-[10px] ${
                                      simulatedOutageSectionId === sec.id 
                                        ? 'bg-rose-600 text-white' 
                                        : 'hover:bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                    }`}
                                    title="Simulasi Lepas Section & SAIDI/SAIFI"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openEditSection(sec)}
                                    className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                                    title="Edit Section & FCO"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setSectionToDelete(sec)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                                    title="Hapus Section"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* LIVE TELEMETRY & SECTION MONITORING DISPLAY (SESUAI DATA SECTIONNYA)     */}
            {/* ========================================================================= */}
            {(() => {
              const activeSection = feederSections.find(s => s.id === selectedSectionId) || feederSections[0];
              if (!activeSection) return null;

              const loadAmp = activeSection.currentLoadAmpere !== undefined ? activeSection.currentLoadAmpere : (activeSection.currentLoad ?? 0);
              const khaMax = activeSection.totalBebanKha || activeSection.khaAmpere || 0;
              const loadPercent = khaMax > 0 ? Math.min(Math.round((loadAmp / khaMax) * 100), 100) : 0;
              const voltKv = activeSection.voltageKv !== undefined ? activeSection.voltageKv : 20.0;
              const dropV = activeSection.voltageDropPercent !== undefined ? activeSection.voltageDropPercent : 0;
              const tempC = activeSection.temperatureCelsius !== undefined ? activeSection.temperatureCelsius : 0;
              const isThermalWarning = tempC > 60;
              const isDropWarning = dropV > 4.0;
              const isOverloaded = loadPercent > 80;

              return (
                <div className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#0B132B] border-slate-800 text-white' : 'bg-white border-slate-300 shadow-sm text-slate-950'
                }`}>
                  {/* Monitoring Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        <Gauge className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-950 dark:text-white">
                            Monitoring Telemetri: {activeSection.sectionName} ({activeSection.sectionCode})
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                            Penyulang {activeSection.feederName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                          {activeSection.startPoint || 'Pangkal'} &rarr; {activeSection.endPoint || 'Ujung'} • Panjang {activeSection.lengthKms} KMS • {activeSection.garduCount} Gardu Distribusi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>LIVE SCADA OK</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditSection(activeSection)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Section & FCO</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Telemetry Metrics Deck */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {/* 1. Beban Arus & Persentase KHA */}
                    <div className={`p-4 rounded-xl border ${
                      isOverloaded 
                        ? 'bg-rose-500/10 border-rose-500/30' 
                        : isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-300/90 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-800 dark:text-slate-200">Beban Arus (Real-time)</span>
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{loadPercent}% Beban</span>
                      </div>
                      <div className="text-2xl font-black text-slate-950 dark:text-white flex items-baseline gap-1.5">
                        <span>{loadAmp}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">/ {khaMax} A</span>
                      </div>
                      {/* Gauge Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            loadPercent > 85 ? 'bg-rose-500' : loadPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${loadPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2 flex items-center justify-between">
                        <span>Batas Aman: &lt; 70%</span>
                        <span className={loadPercent > 85 ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-emerald-700 dark:text-emerald-400 font-black'}>
                          {loadPercent > 85 ? 'Overload' : 'Normal'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Tegangan & Drop Tegangan */}
                    <div className={`p-4 rounded-xl border ${
                      isDropWarning 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-300/90 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-800 dark:text-slate-200">Tegangan Ujung (20 kV)</span>
                        </span>
                        <span className="font-black text-emerald-700 dark:text-emerald-400">&plusmn;{dropV}%</span>
                      </div>
                      <div className="text-2xl font-black text-slate-950 dark:text-white flex items-baseline gap-1.5">
                        <span>{voltKv}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">kV</span>
                      </div>
                      <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 mt-2">
                        Drop Tegangan: <span className={isDropWarning ? 'text-amber-700 dark:text-amber-400 font-black' : 'text-emerald-700 dark:text-emerald-400 font-black'}>{dropV}%</span>
                      </div>
                      <div className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                        Standar SPLN 1:1995: Maksimal 5.0%
                      </div>
                    </div>

                    {/* 3. Kondisi Termal & Suhu Konduktor */}
                    <div className={`p-4 rounded-xl border ${
                      isThermalWarning 
                        ? 'bg-rose-500/10 border-rose-500/30' 
                        : isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-300/90 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Thermometer className="w-4 h-4 text-rose-500" />
                          <span className="text-slate-800 dark:text-slate-200">Suhu Konduktor</span>
                        </span>
                        <span className="font-black text-emerald-700 dark:text-emerald-400">Normal</span>
                      </div>
                      <div className="text-2xl font-black text-slate-950 dark:text-white flex items-baseline gap-1.5">
                        <span>{tempC}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">&deg;C</span>
                      </div>
                      <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 mt-2">
                        Ambang Kritis: &gt; 70 &deg;C
                      </div>
                      <div className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                        Kondisi: {tempC > 60 ? 'Waspada Overheating' : 'Dingin / Optimal'}
                      </div>
                    </div>

                    {/* 4. Konfigurasi FCO & Beban Cabang */}
                    <div className={`p-4 rounded-xl border ${
                      activeSection.hasFcoBranch
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-300/90 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-800 dark:text-slate-200">Percabangan Lateral</span>
                        </span>
                        <span className="font-black text-amber-700 dark:text-amber-400">
                          {activeSection.hasFcoBranch ? 'Ada Cabang' : 'Tanpa Percabangan'}
                        </span>
                      </div>
                      <div className="text-xl font-black text-slate-950 dark:text-white truncate">
                        {activeSection.hasFcoBranch ? (activeSection.fcoBranchName || `${activeSection.branchDeviceType || 'Percabangan'} Lateral`) : 'Jalur Utama Saja'}
                      </div>
                      <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 mt-2">
                        {activeSection.hasFcoBranch 
                          ? (activeSection.fcoLengthKms 
                              ? `${activeSection.fcoLengthKms} KMS${activeSection.fcoKhaAmpere ? ` • kVA Gardu ${activeSection.fcoKhaAmpere} kVA` : ''}`
                              : 'Lateral Sekunder (Belum Diinput KMS)')
                          : 'Tidak ada lateral sekunder'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Section Details & Connected Assets Strip */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-2">
                        <span>Detail Struktur Beban Section:</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-black text-[11px] border border-blue-500/25">
                          Beban Utama: {activeSection.bebanUtamaKha || activeSection.lengthKms} KMS
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black text-[11px] border border-amber-500/25">
                          Beban Cabang: {activeSection.bebanCabangKha || (activeSection.hasFcoBranch ? 18 : 0)} A
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 font-black text-[11px] border border-purple-500/25">
                          Total Beban: {activeSection.totalBebanKha || activeSection.khaAmpere} A
                        </span>
                      </div>
                      {activeSection.hasFcoBranch && activeSection.fcoLaterals && activeSection.fcoLaterals.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Laterals:</span>
                          {activeSection.fcoLaterals.map((lat, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10.5px] font-black bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                              ○ {lat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditSection(activeSection)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                      >
                        Input Manual FCO
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSectionId(activeSection.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold cursor-pointer"
                      >
                        Highlight Skematik
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 3. DATA GARDU HUBUNG                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'gardu_hubung' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Gardu Hubung</div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">{masterGarduHubung.length} GH</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">GH Indoor / Outdoor</div>
              <div className="text-xl font-black text-purple-700 dark:text-purple-400">
                {masterGarduHubung.filter(g => g.ghType === 'Indoor').length} Indoor
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Outgoing Feeders</div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {masterGarduHubung.reduce((acc, g) => acc + (g.outgoingFeedersCount || 0), 0)} Feeder
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Status Operasi</div>
              <div className="text-xl font-black text-teal-700 dark:text-teal-400">
                {masterGarduHubung.filter(g => g.status === 'Operasi').length} Operasi
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Gardu Hubung, lokasi, atau feeder outgoing..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>
            <button
              onClick={() => {
                setGhToEdit(null);
                setGhCode('');
                setGhName('');
                setGhLoc('');
                setGhCoordinates('');
                setGhInCount('');
                setGhIncoming('');
                setGhOutCount('');
                setGhOutList('');
                setGhType('Indoor');
                setGhStatus('Operasi');
                setIsAddGhOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Gardu Hubung</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80 w-10">NO</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">KODE GH</th>
                    <th className="px-2.5 py-2.5 text-left border-r border-slate-800/80">NAMA GH</th>
                    <th className="px-2.5 py-2.5 text-left border-r border-slate-800/80">LOKASI</th>
                    <th className="px-2.5 py-2.5 text-center border-r border-slate-800/80">KOORDINAT LOKASI</th>
                    <th className="px-2.5 py-2.5 text-center border-r border-slate-800/80">FEEDER INC</th>
                    <th className="px-2.5 py-2.5 text-left border-r border-slate-800/80">FEEDER OUT</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">TIPE</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">STATUS</th>
                    <th className="px-2 py-2.5 text-center w-16">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterGarduHubung
                    .filter(g => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (g.ghCode || '').toLowerCase().includes(q) ||
                             (g.ghName || '').toLowerCase().includes(q) ||
                             (g.location || '').toLowerCase().includes(q) ||
                             (g.coordinates || '').toLowerCase().includes(q) ||
                             (g.incomingFeeder || '').toLowerCase().includes(q) ||
                             (g.outgoingFeedersList || '').toLowerCase().includes(q);
                    })
                    .map((gh, idx) => (
                      <tr key={`${gh.id || 'gh'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-2 py-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{idx + 1}</td>
                        <td className="px-2 py-2 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gh.ghCode}</td>
                        <td className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gh.ghName}</td>
                        <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gh.location}</td>
                        <td className="px-2.5 py-2 text-center font-mono text-[10.5px] border-r border-slate-200 dark:border-slate-800/80">
                          {gh.coordinates ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gh.coordinates.trim())}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/80 transition-colors hover:underline group"
                              title="Buka lokasi di Google Maps"
                            >
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                              {gh.coordinates}
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-[10px]">-</span>
                          )}
                        </td>
                        <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{gh.incomingFeeder}</div>
                          {gh.incomingFeedersCount ? (
                            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">({gh.incomingFeedersCount} Feeder)</div>
                          ) : null}
                        </td>
                        <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{gh.outgoingFeedersList}</div>
                          {gh.outgoingFeedersCount ? (
                            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">({gh.outgoingFeedersCount} Feeder)</div>
                          ) : null}
                        </td>
                        <td className="px-2 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gh.ghType}</td>
                        <td className="px-2 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                            gh.status === 'Operasi' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            gh.status === 'Standby' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}>
                            {gh.status}
                          </span>
                        </td>
                        <td className="px-1 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditGh(gh)}
                              className="p-1 rounded hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit GH"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setGhToDelete(gh)}
                              className="p-1 rounded hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                              title="Hapus GH"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DATA GARDU DISTRIBUSI                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'gardu_distribusi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Gardu Distribusi</div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">{masterGarduDistribusi.length} Gardu</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Kapasitas Terpasang</div>
              <div className="text-xl font-black text-purple-700 dark:text-purple-400">
                {masterGarduDistribusi.reduce((acc, g) => acc + (g.capacityKva || 0), 0)} kVA
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Gardu Portal</div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {masterGarduDistribusi.filter(g => g.garduType === 'Portal').length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Gardu Cantol / Beton / Kios</div>
              <div className="text-xl font-black text-amber-700 dark:text-amber-400">
                {masterGarduDistribusi.filter(g => g.garduType !== 'Portal').length} Unit
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan Kode Gardu, Nama Gardu, atau Penyulang..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>
            <button
              onClick={() => {
                setGdToEdit(null);
                setGdCode('');
                setGdName('');
                setGdFeeder('');
                setGdSection('');
                setGdKva(160);
                setGdPhase('3 Phasa');
                setGdType('Portal');
                setGdLoc('');
                setGdCust(0);
                setGdStatus('Operasi');
                setIsAddGdOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Gardu Distribusi</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80 w-8">No</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Kode</th>
                    <th className="px-2.5 py-2.5 text-left border-r border-slate-800/80">Nama Gardu</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Penyulang</th>
                    <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Section</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Kapasitas</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Phasa</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Tipe</th>
                    <th className="px-2 py-2.5 text-left border-r border-slate-800/80">Lokasi</th>
                    <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Status</th>
                    <th className="px-1.5 py-2.5 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterGarduDistribusi
                    .filter(g => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (g.garduCode || '').toLowerCase().includes(q) ||
                             (g.garduName || '').toLowerCase().includes(q) ||
                             (g.feederName || '').toLowerCase().includes(q);
                    })
                    .map((gd, idx) => (
                      <tr key={`${gd.id || 'gd'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-1.5 py-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{idx + 1}</td>
                        <td className="px-2 py-2 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.garduCode}</td>
                        <td className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.garduName}</td>
                        <td className="px-2 py-2 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.feederName}</td>
                        <td className="px-2 py-2 text-center text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.sectionName || '-'}</td>
                        <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.capacityKva} kVA</td>
                        <td className="px-1.5 py-2 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.phase}</td>
                        <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.garduType}</td>
                        <td className="px-2 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{gd.location}</td>
                        <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/10 text-emerald-500">
                            {gd.status}
                          </span>
                        </td>
                        <td className="px-1 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditGd(gd)}
                              className="p-1 rounded hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit Gardu"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setGdToDelete(gd)}
                              className="p-1 rounded hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                              title="Hapus Gardu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 5. DATA PEMUTUS                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'pemutus' && (() => {
        const totalPemutus = masterPemutus.length;
        const totalPmcb = masterPemutus.filter(p => p.equipmentType === 'PMCB').length;
        const totalRecloser = masterPemutus.filter(p => p.equipmentType === 'Recloser').length;
        const totalLbs = masterPemutus.filter(p => p.equipmentType && p.equipmentType.includes('LBS')).length;
        const totalPmt = masterPemutus.filter(p => p.equipmentType === 'PMT' || p.equipmentType === 'PMT GI').length;
        const totalFco = masterPemutus.filter(p => p.equipmentType === 'FCO' || p.equipmentType === 'SSO').length;
        const totalScada = masterPemutus.filter(p => p.scadaStatus === 'Terhubung SCADA').length;

        const filteredPemutus = masterPemutus.filter(p => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (p.equipmentCode || '').toLowerCase().includes(q) ||
                 (p.equipmentType || '').toLowerCase().includes(q) ||
                 (p.feederName || '').toLowerCase().includes(q) ||
                 (p.sectionName || '').toLowerCase().includes(q) ||
                 (p.brandModel || '').toLowerCase().includes(q);
        });

        return (
          <div className="space-y-4">
            {/* Header Metrics: Total Pemutus, only categories that have values > 0, and Terhubung SCADA */}
            <div className="flex flex-wrap gap-3">
              <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Alat Pemutus</div>
                <div className="text-xl font-black text-blue-700 dark:text-blue-400">{totalPemutus} Unit</div>
              </div>

              {totalPmcb > 0 && (
                <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                  <div className="text-[11px] font-black text-blue-800 dark:text-blue-200 uppercase tracking-wider mb-1">PMCB</div>
                  <div className="text-xl font-black text-blue-700 dark:text-blue-400">{totalPmcb} Unit</div>
                </div>
              )}

              {totalRecloser > 0 && (
                <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                  <div className="text-[11px] font-black text-purple-800 dark:text-purple-200 uppercase tracking-wider mb-1">Recloser / OCR</div>
                  <div className="text-xl font-black text-purple-700 dark:text-purple-400">{totalRecloser} Unit</div>
                </div>
              )}

              {totalLbs > 0 && (
                <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                  <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-200 uppercase tracking-wider mb-1">LBS Motor / Manual</div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">{totalLbs} Unit</div>
                </div>
              )}

              {totalPmt > 0 && (
                <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                  <div className="text-[11px] font-black text-amber-800 dark:text-amber-200 uppercase tracking-wider mb-1">PMT GI</div>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-400">{totalPmt} Unit</div>
                </div>
              )}

              {totalFco > 0 && (
                <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                  <div className="text-[11px] font-black text-orange-800 dark:text-orange-200 uppercase tracking-wider mb-1">FCO / SSO</div>
                  <div className="text-xl font-black text-orange-700 dark:text-orange-400">{totalFco} Unit</div>
                </div>
              )}

              <div className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
                <div className="text-[11px] font-black text-teal-800 dark:text-teal-200 uppercase tracking-wider mb-1">Terhubung SCADA</div>
                <div className="text-xl font-black text-teal-700 dark:text-teal-400">{totalScada} Online</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Kode Alat, Jenis, Penyulang, atau Merk..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                  }`}
                />
              </div>
              <button
                onClick={() => {
                  setPmtToEdit(null);
                  setPmtCode('');
                  setPmtType('PMCB');
                  setPmtFeeder('');
                  setPmtSectionId('');
                  setPmtSectionName('');
                  setPmtLoc('');
                  setPmtBrand('');
                  setPmtRating(630);
                  setPmtScada('Terhubung SCADA');
                  setPmtStatus('Masuk / ON');
                  setIsAddPmtOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Alat Pemutus</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80 w-8">No</th>
                      <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Kode Tag</th>
                      <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Jenis</th>
                      <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Penyulang</th>
                      <th className="px-2 py-2.5 text-center border-r border-slate-800/80">Koneksi Section</th>
                      <th className="px-2 py-2.5 text-left border-r border-slate-800/80">Lokasi/Tiang</th>
                      <th className="px-2 py-2.5 text-left border-r border-slate-800/80">Merk/Tipe</th>
                      <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Rating</th>
                      <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">SCADA</th>
                      <th className="px-1.5 py-2.5 text-center border-r border-slate-800/80">Posisi</th>
                      <th className="px-1.5 py-2.5 text-center w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                    {masterPemutus.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 px-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                              <SlidersHorizontal className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                              Belum Ada Data Alat Pemutus
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                              Data peralatan pemutus (PMCB, Recloser, LBS, dll) masih kosong dan siap diinput secara manual. Silakan klik tombol <b>"+ Tambah Alat Pemutus"</b> di atas.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredPemutus.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-8 px-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Tidak ada data pemutus yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredPemutus.map((pmt, idx) => (
                        <tr key={`${pmt.id || 'pmt'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-1.5 py-2 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{idx + 1}</td>
                          <td className="px-2 py-2 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{pmt.equipmentCode}</td>
                          <td className="px-2 py-2 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              pmt.equipmentType === 'PMCB' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : pmt.equipmentType === 'Recloser' 
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {pmt.equipmentType}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{pmt.feederName}</td>
                          <td className="px-2 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[11px]">
                            {(() => {
                              const cov = getDownstreamCoveredSections(pmt.feederName, pmt.sectionId || pmt.sectionName, masterSections);
                              if (pmt.sectionName || pmt.sectionId) {
                                return (
                                  <div className="flex flex-col items-center justify-center gap-0.5 max-w-[210px] mx-auto">
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-500/30 text-[10px] leading-tight text-center">
                                      {pmt.sectionName || cov.shortLabel} - Ujung Jaringan
                                    </span>
                                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                                      {cov.coveredSections.length > 1 
                                        ? `Mengkover ${cov.coveredSections.length} Section (${cov.totalGardu} GD)` 
                                        : 's/d Ujung Jaringan'}
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold italic">
                                    Semua Section / GI
                                  </span>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500">
                                    (GI s/d Ujung Jaringan)
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-2 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{pmt.location}</td>
                          <td className="px-2 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{pmt.brandModel}</td>
                          <td className="px-1.5 py-2 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80 text-[11px]">{pmt.currentRatingAmpere} A</td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                              pmt.scadaStatus === 'Terhubung SCADA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                            }`}>
                              {pmt.scadaStatus === 'Terhubung SCADA' ? 'SCADA' : 'Manual'}
                            </span>
                          </td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-200 dark:border-slate-800/80 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                              pmt.status === 'Lepas / OFF' 
                                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                                : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              {pmt.status}
                            </span>
                          </td>
                          <td className="px-1 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditPmt(pmt)}
                                className="p-1 rounded hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                                title="Edit Pemutus"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setPmtToDelete(pmt)}
                                className="p-1 rounded hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                                title="Hapus Pemutus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODALS SECTION (Feeder, Section, GH, GD, Pemutus)                        */}
      {/* ========================================================================= */}

      {/* 1. Modal Add/Edit Feeder */}
      {(isAddFeederOpen || feederToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base">{feederToEdit ? 'Edit Data Penyulang' : 'Tambah Data Penyulang'}</h3>
              <button onClick={() => { setIsAddFeederOpen(false); setFeederToEdit(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFeeder} className="space-y-4 text-xs">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Penyulang</label>
                  <input 
                    type="text" 
                    value={fCode} 
                    onChange={e => setFCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: LTR2" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Penyulang</label>
                  <input 
                    type="text" 
                    value={fName} 
                    onChange={e => setFName(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: Lateri 2" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gardu Induk</label>
                  <select 
                    value={fGi} 
                    onChange={e => { 
                      const val = e.target.value;
                      setFGi(val); 
                      if (val !== '-') {
                        setFGh('-');
                        setFStatus('Utama');
                      }
                    }} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-">-</option>
                    <option value="GI Passo">GI Passo</option>
                    <option value="GIS Passo">GIS Passo</option>
                    <option value="Hative Besar">Hative Besar</option>
                    <option value="GI Sirimau">GI Sirimau</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gardu Hubung</label>
                  <select 
                    value={fGh} 
                    onChange={e => { 
                      const val = e.target.value;
                      setFGh(val); 
                      if (val !== '-') {
                        setFGi('-');
                        setFStatus('Percabangan');
                      }
                    }} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-">-</option>
                    <option value="GH Area">GH Area</option>
                    <option value="GH Aston">GH Aston</option>
                    <option value="GH Baguala">GH Baguala</option>
                    <option value="GH Bandara">GH Bandara</option>
                    <option value="GH Box Pantai Galala">GH Box Pantai Galala</option>
                    <option value="GH Box Pantai Poka">GH Box Pantai Poka</option>
                    <option value="GH Hative Kecil">GH Hative Kecil</option>
                    <option value="GH Poka">GH Poka</option>
                    <option value="GH Wayame">GH Wayame</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select 
                    value={fStatus} 
                    onChange={e => setFStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Utama">Utama</option>
                    <option value="Percabangan">Percabangan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Operasional</label>
                  <select 
                    value={fOpStatus} 
                    onChange={e => setFOpStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kapasitas Gardu (kVA)</label>
                  <input 
                    type="number" 
                    value={fKha} 
                    onChange={e => setFKha(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Panjang (kms)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={fLength} 
                    onChange={e => setFLength(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jml Gardu</label>
                  <input 
                    type="number" 
                    value={fGarduCount} 
                    onChange={e => setFGarduCount(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jml Pelanggan</label>
                  <input 
                    type="number" 
                    value={fCust} 
                    onChange={e => setFCust(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Konfigurasi</label>
                  <select 
                    value={fConfig} 
                    onChange={e => setFConfig(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Looping">Looping</option>
                    <option value="Radial">Radial</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddFeederOpen(false); setFeederToEdit(null); }} 
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {(feederToDelete || sectionToDelete || ghToDelete || gdToDelete || pmtToDelete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl border text-center ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base mb-1">Konfirmasi Hapus</h4>
            <p className="text-xs text-slate-400 mb-4">
              Apakah Anda yakin ingin menghapus data item ini secara permanen dari database Master Data?
            </p>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setFeederToDelete(null);
                  setSectionToDelete(null);
                  setGhToDelete(null);
                  setGdToDelete(null);
                  setPmtToDelete(null);
                }} 
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (feederToDelete) { onDeleteMasterFeeder(feederToDelete.id); setFeederToDelete(null); }
                  if (sectionToDelete && onDeleteMasterSection) { onDeleteMasterSection(sectionToDelete.id); setSectionToDelete(null); }
                  if (ghToDelete && onDeleteMasterGarduHubung) { onDeleteMasterGarduHubung(ghToDelete.id); setGhToDelete(null); }
                  if (gdToDelete && onDeleteMasterGarduDistribusi) { onDeleteMasterGarduDistribusi(gdToDelete.id); setGdToDelete(null); }
                  if (pmtToDelete && onDeleteMasterPemutus) { onDeleteMasterPemutus(pmtToDelete.id); setPmtToDelete(null); }
                }} 
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Add/Edit Section */}
      {(isAddSectionOpen || sectionToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">{sectionToEdit ? 'Edit Data Section' : 'Tambah Data Section'}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Isi parameter segmen / section jaringan penyulang</p>
                </div>
              </div>
              <button onClick={() => { setIsAddSectionOpen(false); setSectionToEdit(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Section</label>
                  <input 
                    type="text" 
                    value={secCode} 
                    onChange={e => setSecCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: ALG-SEC-01" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Section</label>
                  <input 
                    type="text" 
                    value={secName} 
                    onChange={e => setSecName(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: GH Bandara-Namahatu" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang</label>
                  <select
                    value={secFeeder}
                    onChange={e => {
                      const val = e.target.value;
                      setSecFeeder(val);
                      if (!sectionToEdit) {
                        setSecCode(val ? generateSectionCode(val) : '');
                        const fObj = masterFeeders.find(f => f.feederName.toLowerCase() === val.toLowerCase());
                        if (fObj) {
                          if (fObj.garduHubung && fObj.garduHubung !== '-') {
                            setSecSubstation(fObj.garduHubung);
                          } else if (fObj.substationName && fObj.substationName !== '-') {
                            setSecSubstation(fObj.substationName);
                          }
                        }
                      }
                    }}
                    required
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Penyulang</option>
                    {[...masterFeeders].sort((a, b) => a.feederName.localeCompare(b.feederName, 'id', { numeric: true, sensitivity: 'base' })).map((f, fIdx) => (
                      <option key={`${f.id || f.feederName}-${fIdx}`} value={f.feederName}>
                        {f.feederName} ({f.feederCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GI / GH Asal</label>
                  <select 
                    value={secSubstation} 
                    onChange={e => setSecSubstation(e.target.value)} 
                    required
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  >
                    <option value="">-- Pilih GI / GH Asal --</option>
                    <optgroup label="Gardu Induk (GI)">
                      {availableGIs.map(gi => (
                        <option key={gi} value={gi}>{gi}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Gardu Hubung (GH)">
                      {availableGHs.map(gh => (
                        <option key={gh} value={gh}>{gh}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Titik Awal (In / Pangkal Node)</label>
                  <input 
                    type="text" 
                    value={secStart} 
                    onChange={e => setSecStart(e.target.value)} 
                    placeholder="Contoh: GH Bandara (Pangkal)"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Titik Akhir (Out / Ujung Node)</label>
                  <input 
                    type="text" 
                    value={secEnd} 
                    onChange={e => setSecEnd(e.target.value)} 
                    placeholder="Contoh: Recloser Namahatu (Node)"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Panjang (kms)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={secLength} 
                    onChange={e => setSecLength(e.target.value)} 
                    placeholder="Contoh: 1.0"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jml Gardu</label>
                  <input 
                    type="number" 
                    value={secGarduCount} 
                    onChange={e => setSecGarduCount(e.target.value)} 
                    placeholder="Contoh: 1"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">kVA Gardu</label>
                  <input 
                    type="number" 
                    value={secKha} 
                    onChange={e => {
                      setSecKha(e.target.value);
                      setSecTotalBeban(e.target.value);
                    }} 
                    placeholder="Contoh: 450"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jml Pelanggan</label>
                  <input 
                    type="number" 
                    value={secCust} 
                    onChange={e => setSecCust(e.target.value)} 
                    placeholder="Contoh: 350"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              {/* Percabangan Section (Multi-Branch Support) */}
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-amber-600 dark:text-amber-400">Percabangan Lateral</div>
                      <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Kelola percabangan (FCO / LBSM / Recloser / PMCB) pada section ini</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBranch}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Percabangan</span>
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  📍 Posisi: Percabangan ditempatkan diantara section [{secStart || 'Pangkal'}] &rarr; [{secEnd || 'Ujung Section'}]
                </div>

                {secFcoBranches.length === 0 ? (
                  <div className="text-center py-3 text-xs text-slate-400 border border-dashed border-amber-500/20 rounded-xl">
                    Belum ada percabangan lateral pada section ini. Klik tombol <span className="font-bold text-amber-500">+ Tambah Percabangan</span> di atas untuk menambahkan.
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {secFcoBranches.map((br, bIdx) => (
                      <div key={br.id || bIdx} className="p-3 rounded-xl border border-amber-500/30 bg-white dark:bg-slate-900/60 space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            Percabangan Lateral #{bIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBranch(bIdx)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus Percabangan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">Peralatan Percabangan</label>
                            <select
                              value={br.branchDeviceType || 'FCO'}
                              onChange={e => handleUpdateBranch(bIdx, 'branchDeviceType', e.target.value)}
                              className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 focus:outline-hidden text-xs cursor-pointer"
                            >
                              <option value="FCO">FCO (Cut Out)</option>
                              <option value="LBSM">LBSM (LBS Motorized)</option>
                              <option value="Recloser">Recloser</option>
                              <option value="PMCB">PMCB (Pemutus CB)</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">Nama Node Percabangan</label>
                            <input 
                              type="text" 
                              value={br.fcoBranchName || ''} 
                              onChange={e => handleUpdateBranch(bIdx, 'fcoBranchName', e.target.value)} 
                              placeholder="Contoh: Perc. Hutumuri"
                              className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 focus:outline-hidden text-xs" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">Panjang Cabang (kms)</label>
                            <input 
                              type="number" 
                              step="0.1" 
                              value={br.fcoLengthKms !== undefined && br.fcoLengthKms !== null ? br.fcoLengthKms : ''} 
                              onChange={e => handleUpdateBranch(bIdx, 'fcoLengthKms', e.target.value !== '' ? Number(e.target.value) : undefined)} 
                              placeholder="Contoh: 0.8"
                              className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 focus:outline-hidden text-xs" 
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">kVA Gardu (Cabang)</label>
                            <input 
                              type="number" 
                              value={br.fcoKhaAmpere !== undefined && br.fcoKhaAmpere !== null ? br.fcoKhaAmpere : ''} 
                              onChange={e => handleUpdateBranch(bIdx, 'fcoKhaAmpere', e.target.value !== '' ? Number(e.target.value) : undefined)} 
                              placeholder="Contoh: 160"
                              className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 focus:outline-hidden text-xs" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Telemetry & Monitoring Parameters */}
              <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2.5">
                <div className="font-extrabold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Parameter Monitoring Telemetri Section</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Beban Arus (A)</label>
                    <input 
                      type="number" 
                      value={secCurrentLoad} 
                      onChange={e => setSecCurrentLoad(e.target.value)} 
                      placeholder="Contoh: 180"
                      className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Tegangan (kV)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={secVoltageKv} 
                      onChange={e => setSecVoltageKv(e.target.value)} 
                      placeholder="Contoh: 20.0"
                      className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Drop Tegangan (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={secVoltageDrop} 
                      onChange={e => setSecVoltageDrop(e.target.value)} 
                      placeholder="Contoh: 1.5"
                      className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Suhu (°C)</label>
                    <input 
                      type="number" 
                      value={secTemp} 
                      onChange={e => setSecTemp(e.target.value)} 
                      placeholder="Contoh: 38"
                      className="w-full p-2 rounded-lg border font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs" 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Kondisi</label>
                  <select 
                    value={secStatus} 
                    onChange={e => setSecStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                    <option value="Warning">Warning</option>
                    <option value="Kritis">Kritis</option>
                    <option value="Manuver (Open)">Manuver (Open)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jml Pelanggan (Opsional)</label>
                  <input 
                    type="number" 
                    value={secCust} 
                    onChange={e => setSecCust(e.target.value)} 
                    placeholder="Contoh: 1250"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => { setIsAddSectionOpen(false); setSectionToEdit(null); }} 
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  Simpan Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Add/Edit GH */}
      {(isAddGhOpen || ghToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base">{ghToEdit ? 'Edit Gardu Hubung' : 'Tambah Gardu Hubung'}</h3>
              <button onClick={() => { setIsAddGhOpen(false); setGhToEdit(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGh} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode GH (Kode Gardu Hubung)</label>
                  <input 
                    type="text" 
                    value={ghCode} 
                    onChange={e => setGhCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan kode GH..." 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama GH (Nama Gardu Hubung)</label>
                  <input 
                    type="text" 
                    value={ghName} 
                    onChange={e => setGhName(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan nama GH..." 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi (Lokasi GH)</label>
                  <input 
                    type="text" 
                    value={ghLoc} 
                    onChange={e => setGhLoc(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan lokasi GH..." 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Koordinat Lokasi (Lat, Long)</label>
                  <input 
                    type="text" 
                    value={ghCoordinates} 
                    onChange={e => setGhCoordinates(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan koordinat (Lat, Long)..." 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Incoming Feeder</label>
                  <input 
                    type="number" 
                    value={ghInCount} 
                    onChange={e => setGhInCount(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan jumlah..."
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Feeder Inc (Daftar Feeder Masuk)</label>
                  <input 
                    type="text" 
                    value={ghIncoming} 
                    onChange={e => setGhIncoming(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan nama feeder masuk..." 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Outgoing Feeder</label>
                  <input 
                    type="number" 
                    value={ghOutCount} 
                    onChange={e => setGhOutCount(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan jumlah..."
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Feeder Out (Daftar Feeder Keluar)</label>
                  <input 
                    type="text" 
                    value={ghOutList} 
                    onChange={e => setGhOutList(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Masukkan nama feeder keluar..." 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tipe GH</label>
                  <select 
                    value={ghType} 
                    onChange={e => setGhType(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Compact">Compact</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select 
                    value={ghStatus} 
                    onChange={e => setGhStatus(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operasi">Operasi</option>
                    <option value="Standby">Standby</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddGhOpen(false); setGhToEdit(null); }} 
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan GH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Add/Edit GD */}
      {(isAddGdOpen || gdToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base">{gdToEdit ? 'Edit Gardu Distribusi' : 'Tambah Gardu Distribusi'}</h3>
              <button onClick={() => { setIsAddGdOpen(false); setGdToEdit(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Gardu</label>
                  <input 
                    type="text" 
                    value={gdCode} 
                    onChange={e => setGdCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: BG-012" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Gardu</label>
                  <input 
                    type="text" 
                    value={gdName} 
                    onChange={e => setGdName(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: Gardu Lateri Raya" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang</label>
                  <input 
                    type="text" 
                    value={gdFeeder} 
                    onChange={e => setGdFeeder(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Nama feeder..." 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Section</label>
                  <input 
                    type="text" 
                    value={gdSection} 
                    onChange={e => setGdSection(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kapasitas (kVA)</label>
                  <input 
                    type="number" 
                    value={gdKva} 
                    onChange={e => setGdKva(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phasa</label>
                  <select 
                    value={gdPhase} 
                    onChange={e => setGdPhase(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="3 Phasa">3 Phasa</option>
                    <option value="1 Phasa">1 Phasa</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tipe Gardu</label>
                  <select 
                    value={gdType} 
                    onChange={e => setGdType(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Portal">Portal</option>
                    <option value="Cantol">Cantol</option>
                    <option value="Beton">Beton</option>
                    <option value="Kios">Kios</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi</label>
                <input 
                  type="text" 
                  value={gdLoc} 
                  onChange={e => setGdLoc(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddGdOpen(false); setGdToEdit(null); }} 
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Gardu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Add/Edit Pemutus */}
      {(isAddPmtOpen || pmtToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base">{pmtToEdit ? 'Edit Alat Pemutus' : 'Tambah Alat Pemutus'}</h3>
              <button onClick={() => { setIsAddPmtOpen(false); setPmtToEdit(null); }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePmt} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Alat / Tag</label>
                  <input 
                    type="text" 
                    value={pmtCode} 
                    onChange={e => setPmtCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: PMCB-LTR2-01" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jenis Pemutus</label>
                  <select 
                    value={pmtType} 
                    onChange={e => setPmtType(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PMCB">PMCB (Pole Mounted Circuit Breaker)</option>
                    <option value="Recloser">Recloser (Automatic Circuit Recloser)</option>
                    <option value="LBS Motorized">LBS Motorized</option>
                    <option value="LBS Manual">LBS Manual</option>
                    <option value="PMT">PMT (Pemutus Tenaga)</option>
                    <option value="FCO">FCO (Fuse Cut Out)</option>
                    <option value="Disconnector (DS)">Disconnector (DS)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang (Master Data)</label>
                  <select 
                    value={pmtFeeder} 
                    onChange={e => {
                      const newF = e.target.value;
                      setPmtFeeder(newF);
                      setPmtSectionId('');
                      setPmtSectionName('');
                    }} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-blue-400 dark:border-blue-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Penyulang</option>
                    {[...masterFeeders].sort((a, b) => a.feederName.localeCompare(b.feederName, 'id', { numeric: true, sensitivity: 'base' })).map((f, fIdx) => (
                      <option key={`${f.id || f.feederName}-${fIdx}`} value={f.feederName}>
                        {f.feederName} ({f.feederCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi / Titik Tiang</label>
                  <input 
                    type="text" 
                    value={pmtLoc} 
                    onChange={e => setPmtLoc(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: Tiang BG-045 Passo / Depan Gardu"
                  />
                </div>
              </div>

              {/* Koneksi Section & Cakupan Proteksi Downstream */}
              <div className="space-y-2 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                    Koneksi Section / Titik Proteksi Awal
                  </label>
                  <span className="text-[10.5px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Proteksi Mengkover s/d Ujung Jaringan
                  </span>
                </div>
                <select
                  value={pmtSectionId}
                  onChange={e => {
                    const secId = e.target.value;
                    setPmtSectionId(secId);
                    if (secId.includes('::')) {
                      const [parentSecId, brName] = secId.split('::');
                      const secObj = masterSections.find(s => s.id === parentSecId);
                      setPmtSectionName(secObj ? `${secObj.sectionName} (Branch: ${brName})` : secId);
                    } else {
                      const secObj = masterSections.find(s => s.id === secId);
                      if (secObj) {
                        setPmtSectionName(secObj.sectionName);
                      } else {
                        setPmtSectionName('');
                      }
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                >
                  <option value="">Semua Section / GI (Proteksi Total dari Pangkal GI s/d Ujung)</option>
                  {masterSections
                    .filter(s => !pmtFeeder || s.feederName.toLowerCase() === pmtFeeder.toLowerCase())
                    .flatMap((s, sIdx) => {
                      const cov = getDownstreamCoveredSections(pmtFeeder, s.id, masterSections);
                      const options = [
                        <option key={`sec-${s.id || s.sectionName}-${sIdx}`} value={s.id}>
                          {s.sectionCode ? `[${s.sectionCode}] ` : ''}{s.sectionName} ➔ Mengkover {cov.coveredSections.length > 1 ? `${cov.coveredSections.length} Section` : 'Section'} s/d Ujung ({cov.totalGardu} Gardu)
                        </option>
                      ];

                      // Add branch options if section has branches
                      const branches = s.fcoBranches || [];
                      branches.forEach((br, bIdx) => {
                        options.push(
                          <option key={`br-${s.id}-${br.id || bIdx}`} value={`${s.id}::${br.fcoBranchName || br.id}`}>
                            &nbsp;&nbsp;↳ [Percabangan: {br.branchDeviceType || 'FCO'}] {br.fcoBranchName} (Panjang: {br.fcoLengthKms || 0} km, Beban: {br.fcoKhaAmpere || 0} kVA)
                          </option>
                        );
                      });

                      return options;
                    })}
                </select>

                {/* Downstream Coverage Dynamic Info Card */}
                {(() => {
                  const covInfo = getDownstreamCoveredSections(pmtFeeder, pmtSectionId, masterSections);
                  return (
                    <div className={`mt-2 p-3 rounded-xl border transition-all text-xs ${
                      pmtSectionId 
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200'
                        : 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-200'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 font-black text-xs">
                          <Zap className={`w-4 h-4 ${pmtSectionId ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-600 dark:text-blue-400'}`} />
                          <span>Cakupan Proteksi & Pengaruh Padam:</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          pmtSectionId
                            ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                            : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        }`}>
                          {pmtSectionId ? `${pmtSectionName || covInfo.shortLabel} - Ujung Jaringan` : 'Semua Section / GI'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        {pmtSectionId ? (
                          <>
                            Pemutus ini dipasang pada section awal dan <strong className="text-indigo-600 dark:text-indigo-400 font-bold">mengkover section tersebut beserta seluruh section setelahnya hingga ujung jaringan</strong>. Jika alat pemutus ini trip / open, seluruh section di hilir akan ikut padam.
                          </>
                        ) : (
                          <>
                            Pemutus beroperasi di <strong className="text-blue-600 dark:text-blue-400 font-bold">Pangkal GI (Semua Section)</strong> dan memproteksi seluruh jalur penyulang dari awal hingga ujung jaringan.
                          </>
                        )}
                      </p>

                      {covInfo.sectionNames.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Jalur Terkover:</span>
                          {covInfo.sectionNames.map((name, i) => (
                            <React.Fragment key={name + i}>
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                {name}
                              </span>
                              {i < covInfo.sectionNames.length - 1 && (
                                <span className="text-slate-400 text-[9px] font-bold">➔</span>
                              )}
                            </React.Fragment>
                          ))}
                          <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 ml-1">
                            (Ujung Jaringan)
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                        <div className="bg-white/70 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[9.5px] text-slate-500 font-medium">Total Section</div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.coveredSections.length} Section</div>
                        </div>
                        <div className="bg-white/70 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[9.5px] text-slate-500 font-medium">Gardu Terkover</div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.totalGardu} Gardu</div>
                        </div>
                        <div className="bg-white/70 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[9.5px] text-slate-500 font-medium">Pelanggan Terkover</div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.totalCustomers.toLocaleString('id-ID')} Plg</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rating Arus (A)</label>
                  <input 
                    type="number" 
                    value={pmtRating} 
                    onChange={e => setPmtRating(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Merk & Tipe</label>
                  <input 
                    type="text" 
                    value={pmtBrand} 
                    onChange={e => setPmtBrand(e.target.value)} 
                    placeholder="Contoh: Tavrida OSM25 / Entec / Schneider"
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SCADA Status</label>
                  <select 
                    value={pmtScada} 
                    onChange={e => setPmtScada(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Terhubung SCADA">Terhubung SCADA</option>
                    <option value="Manual / Non-SCADA">Manual / Non-SCADA</option>
                    <option value="Gangguan Link">Gangguan Link</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Posisi</label>
                  <select 
                    value={pmtStatus} 
                    onChange={e => setPmtStatus(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Masuk / ON">Masuk / ON</option>
                    <option value="Lepas / OFF">Lepas / OFF</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddPmtOpen(false); setPmtToEdit(null); }} 
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Pemutus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
