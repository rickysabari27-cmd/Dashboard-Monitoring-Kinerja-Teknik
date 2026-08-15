import React, { useState } from 'react';
import { 
  MasterFeeder, 
  MasterSection, 
  MasterGarduHubung, 
  MasterGarduDistribusi, 
  MasterPemutus,
  BranchDevice,
  getSectionBranches
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
  Check
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
  const [secFeeder, setSecFeeder] = useState('Allang');
  const [secSubstation, setSecSubstation] = useState('GH Bandara');
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

  // Live Telemetry Monitoring States (Manual Input - No automatic prefill)
  const [secCurrentLoad, setSecCurrentLoad] = useState<number | string>('');
  const [secVoltageKv, setSecVoltageKv] = useState<number | string>('');
  const [secVoltageDrop, setSecVoltageDrop] = useState<number | string>('');
  const [secTemp, setSecTemp] = useState<number | string>('');

  // GH Form States
  const [ghCode, setGhCode] = useState('');
  const [ghName, setGhName] = useState('');
  const [ghLoc, setGhLoc] = useState('');
  const [ghIncoming, setGhIncoming] = useState('');
  const [ghOutCount, setGhOutCount] = useState<number | string>(0);
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
  const [pmtType, setPmtType] = useState<'Recloser' | 'LBS Motorized' | 'LBS Manual' | 'PMT' | 'FCO' | 'Disconnector (DS)'>('Recloser');
  const [pmtFeeder, setPmtFeeder] = useState('');
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
    setFKha(feeder.khaAmpere ?? 0);
    setFLength(feeder.lengthKms ?? 0);
    setFGarduCount(feeder.garduCount ?? 0);
    setFCust(feeder.customerCount ?? 0);
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
    setSectionToEdit(null);
    setIsAddSectionOpen(false);
  };

  // Handle GH Edit & Save
  const openEditGh = (gh: MasterGarduHubung) => {
    setGhToEdit(gh);
    setGhCode(gh.ghCode);
    setGhName(gh.ghName);
    setGhLoc(gh.location);
    setGhIncoming(gh.incomingFeeder);
    setGhOutCount(gh.outgoingFeedersCount);
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
      incomingFeeder: ghIncoming.trim(),
      outgoingFeedersCount: Number(ghOutCount) || 0,
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
    setPmtLoc(pmt.location);
    setPmtBrand(pmt.brandModel);
    setPmtRating(pmt.currentRatingAmpere);
    setPmtScada(pmt.scadaStatus);
    setPmtStatus(pmt.status);
  };

  const handleSavePmt = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MasterPemutus = {
      id: pmtToEdit ? pmtToEdit.id : `PMT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      equipmentCode: pmtCode.trim().toUpperCase(),
      equipmentType: pmtType,
      feederName: pmtFeeder.trim(),
      location: pmtLoc.trim(),
      brandModel: pmtBrand.trim(),
      currentRatingAmpere: Number(pmtRating) || 0,
      scadaStatus: pmtScada,
      status: pmtStatus
    };
    if (onSaveMasterPemutus) onSaveMasterPemutus(payload);
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
          {/* KPI Summary Cards */}
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
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Penyulang Utama</span>
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">
                {masterFeeders.filter(f => (!f.garduHubung || f.garduHubung === '-') && (f.status || 'Utama') === 'Utama').length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Penyulang Percabangan</span>
                <div className="p-1.5 rounded-lg bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-amber-700 dark:text-yellow-400">
                {masterFeeders.filter(f => (f.garduHubung && f.garduHubung !== '-') || f.status === 'Percabangan').length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Penyulang Operasi</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {masterFeeders.filter(f => (f.operationalStatus || 'Operasi') === 'Operasi').length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Tidak Operasi</span>
                <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-rose-700 dark:text-rose-400">
                {masterFeeders.filter(f => f.operationalStatus === 'Tidak Operasi').length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Feeder</span>
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
                setFGi('-');
                setFGh('-');
                setFStatus('Utama');
                setFOpStatus('Operasi');
                setFKha(0);
                setFLength(0);
                setFGarduCount(0);
                setFCust(0);
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
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-800/80 w-12">No</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kode Penyulang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Nama Penyulang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Gardu Induk</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Gardu Hubung</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status Operasional</th>
                    <th className="p-3 text-center border-r border-slate-800/80">kVA Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Panjang Jaringan (kms)</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Jumlah Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Jumlah Pel</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Konfigurasi</th>
                    <th className="p-3 text-center w-24">Aksi</th>
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
                        s => s.feederName && s.feederName.toLowerCase() === feeder.feederName.toLowerCase()
                      );
                      const matchingGds = masterGarduDistribusi.filter(
                        g => g.feederName && g.feederName.trim().toLowerCase() === feeder.feederName.trim().toLowerCase()
                      );
                      const totalKvaGds = matchingGds.reduce((acc, g) => acc + (g.capacityKva || 0), 0);
                      const hasSecs = matchingSections.length > 0;
                      
                      const realGardu = matchingGds.length > 0 
                        ? matchingGds.length 
                        : (hasSecs ? matchingSections.reduce((acc, s) => acc + (s.garduCount || 0), 0) : (feeder.garduCount ?? 0));
                      
                      const realLength = hasSecs 
                        ? Number(matchingSections.reduce((acc, s) => acc + (s.lengthKms || 0) + (s.hasFcoBranch ? (s.fcoLengthKms || 0) : 0), 0).toFixed(1))
                        : (feeder.lengthKms ?? 0);
                      
                      const realKvaGardu = totalKvaGds > 0 ? totalKvaGds : (feeder.khaAmpere ?? 0);
                      const realCust = hasSecs 
                        ? matchingSections.reduce((acc, s) => acc + (s.customerCount || 0), 0)
                        : (feeder.customerCount ?? 0);

                      return (
                        <tr key={`${feeder.id || 'feeder'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                          <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.feederCode}</td>
                          <td className="p-3 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">
                            <div>{feeder.feederName}</div>
                            {hasSecs && (
                              <div className="text-[10px] text-blue-500 font-bold mt-0.5">
                                {matchingSections.length} Sections Sync
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{feeder.substationName || '-'}</td>
                          <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{feeder.garduHubung || '-'}</td>
                          <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                            {(() => {
                              const isPercabangan = (feeder.garduHubung && feeder.garduHubung !== '-') || feeder.status === 'Percabangan';
                              const displayStatus = isPercabangan ? 'Percabangan' : 'Utama';
                              return (
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  displayStatus === 'Percabangan' 
                                    ? 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' 
                                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                }`}>
                                  {displayStatus}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              feeder.operationalStatus === 'Tidak Operasi' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {feeder.operationalStatus || 'Operasi'}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                            {realKvaGardu} kVA
                          </td>
                          <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                            {realLength}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                            {realGardu}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                            {realCust}
                          </td>
                          <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{feeder.configuration || 'Looping'}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditFeeder(feeder)}
                                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                                title="Edit Penyulang"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setFeederToDelete(feeder)}
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                                title="Hapus Penyulang"
                              >
                                <Trash2 className="w-4 h-4" />
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
                    const targetFeeder = selectedSectionFeeder === 'ALL' ? (availableFeeders[0] || 'Allang') : selectedSectionFeeder;
                    const fObj = masterFeeders.find(f => f.feederName.toLowerCase() === targetFeeder.toLowerCase());
                    const defaultGiGh = (fObj?.garduHubung && fObj.garduHubung !== '-')
                      ? fObj.garduHubung
                      : ((fObj?.substationName && fObj.substationName !== '-') ? fObj.substationName : (availableGHs[0] || availableGIs[0] || 'GH Bandara'));

                    setSectionToEdit(null);
                    setSecFeeder(targetFeeder);
                    setSecCode(generateSectionCode(targetFeeder));
                    setSecName('');
                    setSecSubstation(defaultGiGh);
                    setSecStart('');
                    setSecEnd('');
                    setSecGarduCount('');
                    setSecLength('');
                    setSecKha('');
                    setSecBebanUtama('');
                    setSecBebanCabang('');
                    setSecTotalBeban('');
                    setSecCust('');
                    setSecStatus('Normal');
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
              <div className="lg:col-span-5 flex flex-col">
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

                        return (
                          <div key={`${sec.id || 'sec'}-${idx}`} className="relative group">
                            {/* Curved / Vertical branch stem */}
                            <div className="flex items-center h-8 relative">
                              <div className="w-0.5 h-full bg-cyan-500/70 absolute left-0 top-0"></div>
                              <div className="pl-3 text-[11px] font-extrabold text-slate-300 flex items-center gap-1.5">
                                <span>{sec.lengthKms} KMS</span>
                                {isLast && <span className="text-[10px] text-cyan-400 font-bold">(Ujung)</span>}
                                <span className="text-cyan-400 text-xs">v</span>
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
                              onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10' 
                                  : isWarning
                                    ? 'bg-[#14151C] border-amber-500/60 hover:border-amber-400'
                                    : 'bg-[#0B132B]/90 border-cyan-500/30 hover:border-cyan-400'
                              }`}
                            >
                              {/* Node Indicator Dot */}
                              <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                                isWarning ? 'bg-amber-500 shadow-xs shadow-amber-500' : 'bg-cyan-500 shadow-xs shadow-cyan-500'
                              }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className={`font-black text-xs truncate ${isWarning ? 'text-amber-300' : 'text-slate-100'}`}>
                                  [{sec.endPoint || sec.sectionName}]
                                </div>
                                <div className="text-[10.5px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <span>{sec.lengthKms} KMS</span>
                                  <span>•</span>
                                  <span>{sec.garduCount} Gardu</span>
                                  <span>•</span>
                                  <span>Beban {sec.totalBebanKha || sec.khaAmpere || 0} A</span>
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
              <div className="lg:col-span-7 flex flex-col">
                <div className={`rounded-2xl border flex-1 flex flex-col overflow-hidden shadow-xs ${
                  isDarkMode ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
                      <thead className="bg-[#080E21] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3 text-center border-r border-slate-800/80 w-10">No</th>
                          <th className="p-3 text-left border-r border-slate-800/80">Kode Section</th>
                          <th className="p-3 text-left border-r border-slate-800/80">Nama Section</th>
                          <th className="p-3 text-center border-r border-slate-800/80">Panjang (KMS)</th>
                          <th className="p-3 text-center border-r border-slate-800/80">Jumlah Gardu</th>
                          <th className="p-3 text-center border-r border-slate-800/80">kVA Gardu</th>
                          <th className="p-3 text-center border-r border-slate-800/80">Beban Arus (A)</th>
                          <th className="p-3 text-center border-r border-slate-800/80">Status</th>
                          <th className="p-3 text-center w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                        {isUnselected ? (
                          <tr>
                            <td colSpan={9} className="p-12 text-center text-slate-400 font-bold">
                              Silakan pilih penyulang terlebih dahulu untuk melihat data section dan jaringan.
                            </td>
                          </tr>
                        ) : feederSections.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-12 text-center text-slate-400 font-bold">
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

                          return (
                            <tr 
                              key={`${sec.id || 'sec'}-${idx}`} 
                              onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
                              className={`transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-amber-500/15 dark:bg-amber-500/20 text-slate-900 dark:text-white' 
                                  : isWarning
                                    ? 'bg-amber-500/5 hover:bg-amber-500/10'
                                    : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">
                                {idx + 1}
                              </td>
                              <td className="p-3 font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>{sec.sectionCode}</span>
                                  {(() => {
                                    const brs = getSectionBranches(sec);
                                    if (brs.length === 0) return null;
                                    const devTypes = Array.from(new Set(brs.map(b => b.branchDeviceType || 'FCO')));
                                    return devTypes.map(dev => (
                                      <span key={dev} className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                        {dev}
                                      </span>
                                    ));
                                  })()}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">
                                <div>{sec.sectionName}</div>
                                {(() => {
                                  const brs = getSectionBranches(sec);
                                  if (brs.length === 0) return null;
                                  return brs.map((br, bIdx) => (
                                    <div key={br.id || bIdx} className="text-[10px] text-amber-500 font-semibold mt-0.5 flex items-center gap-1">
                                      <GitBranch className="w-3 h-3 shrink-0" />
                                      <span>↳ {br.fcoBranchName}</span>
                                    </div>
                                  ));
                                })()}
                              </td>
                              <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                                <div>{sec.lengthKms || 0} KMS</div>
                                {(() => {
                                  const brs = getSectionBranches(sec);
                                  const totalBrKms = brs.reduce((acc, b) => acc + (b.fcoLengthKms || 0), 0);
                                  if (totalBrKms <= 0) return null;
                                  return (
                                    <div className="text-[10px] text-amber-500 font-semibold mt-0.5">
                                      +{totalBrKms.toFixed(1)} km Cabang
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                                <div>{sec.garduCount || 0} Gardu</div>
                                {sec.customerCount ? (
                                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {sec.customerCount.toLocaleString('id-ID')} Pel
                                  </div>
                                ) : null}
                              </td>
                              <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                                {khaVal} kVA
                              </td>
                              <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">
                                <div className="flex items-center justify-center gap-1">
                                  <span>{loadAmp} A</span>
                                  {loadAmp > 0 && (
                                    <span className={`text-[10px] font-black ${
                                      loadPct > 80 ? 'text-rose-500' : loadPct > 60 ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                      ({loadPct}%)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80 font-bold">
                                {sec.status === 'Tidak Operasi' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Tidak Operasi
                                  </span>
                                ) : sec.status === 'Kritis' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Kritis
                                  </span>
                                ) : sec.status === 'Warning' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Warning
                                  </span>
                                ) : sec.status === 'Manuver (Open)' || sec.status === 'Manuver' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                                    <GitBranch className="w-3.5 h-3.5" />
                                    Manuver (Open)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                    <Check className="w-3 h-3" />
                                    {sec.status === 'Normal' ? 'Normal' : 'Operasi'}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => openEditSection(sec)}
                                    className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                                    title="Edit Section & FCO"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
                                    className={`p-1.5 rounded-lg cursor-pointer active:scale-90 ${
                                      isSelected ? 'bg-amber-500 text-white' : 'hover:bg-purple-500/10 text-purple-500'
                                    }`}
                                    title="Fokus Topologi"
                                  >
                                    <Network className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setSectionToDelete(sec)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                                    title="Hapus Section"
                                  >
                                    <Trash2 className="w-4 h-4" />
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
                setGhIncoming('');
                setGhOutCount(0);
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
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-800/80 w-12">No</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kode GH</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Nama Gardu Hubung</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Lokasi / Wilayah</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Incoming Feeder</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Jumlah Outgoing</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Daftar Feeder Keluar</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Tipe GH</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status</th>
                    <th className="p-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterGarduHubung
                    .filter(g => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (g.ghCode || '').toLowerCase().includes(q) ||
                             (g.ghName || '').toLowerCase().includes(q) ||
                             (g.location || '').toLowerCase().includes(q);
                    })
                    .map((gh, idx) => (
                      <tr key={`${gh.id || 'gh'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                        <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{gh.ghCode}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">{gh.ghName}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gh.location}</td>
                        <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gh.incomingFeeder}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80">{gh.outgoingFeedersCount} Feeder</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gh.outgoingFeedersList}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{gh.ghType}</td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500">
                            {gh.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditGh(gh)}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit GH"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setGhToDelete(gh)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                              title="Hapus GH"
                            >
                              <Trash2 className="w-4 h-4" />
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
                setGdFeeder(masterFeeders[0]?.feederName || 'Lateri 2');
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
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-800/80 w-12">No</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kode Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Nama Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Penyulang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Section</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kapasitas</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Phasa</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Tipe Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Lokasi</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status</th>
                    <th className="p-3 text-center w-24">Aksi</th>
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
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                        <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{gd.garduCode}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">{gd.garduName}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80">{gd.feederName}</td>
                        <td className="p-3 text-center text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gd.sectionName || '-'}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{gd.capacityKva} kVA</td>
                        <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gd.phase}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{gd.garduType}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{gd.location}</td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500">
                            {gd.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditGd(gd)}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit Gardu"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setGdToDelete(gd)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                              title="Hapus Gardu"
                            >
                              <Trash2 className="w-4 h-4" />
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
      {/* 5. DATA PEMUTUS                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'pemutus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Total Alat Pemutus</div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">{masterPemutus.length} Unit</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Recloser / OCR</div>
              <div className="text-xl font-black text-purple-700 dark:text-purple-400">
                {masterPemutus.filter(p => p.equipmentType === 'Recloser').length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">LBS Motorized / Manual</div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {masterPemutus.filter(p => p.equipmentType.includes('LBS')).length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
              <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Terhubung SCADA</div>
              <div className="text-xl font-black text-teal-700 dark:text-teal-400">
                {masterPemutus.filter(p => p.scadaStatus === 'Terhubung SCADA').length} Online
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
                setPmtType('Recloser');
                setPmtFeeder(masterFeeders[0]?.feederName || 'Lateri 2');
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
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-800/80 w-12">No</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kode Alat / Tag</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Jenis Pemutus</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Penyulang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Lokasi / Tiang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Merk & Tipe</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Rating (A)</th>
                    <th className="p-3 text-center border-r border-slate-800/80">SCADA Status</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status Posisi</th>
                    <th className="p-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterPemutus
                    .filter(p => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (p.equipmentCode || '').toLowerCase().includes(q) ||
                             (p.equipmentType || '').toLowerCase().includes(q) ||
                             (p.feederName || '').toLowerCase().includes(q) ||
                             (p.brandModel || '').toLowerCase().includes(q);
                    })
                    .map((pmt, idx) => (
                      <tr key={`${pmt.id || 'pmt'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                        <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{pmt.equipmentCode}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">{pmt.equipmentType}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80">{pmt.feederName}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{pmt.location}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{pmt.brandModel}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{pmt.currentRatingAmpere} A</td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            pmt.scadaStatus === 'Terhubung SCADA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {pmt.scadaStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500">
                            {pmt.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditPmt(pmt)}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit Pemutus"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPmtToDelete(pmt)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer active:scale-90"
                              title="Hapus Pemutus"
                            >
                              <Trash2 className="w-4 h-4" />
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
                        setSecCode(generateSectionCode(val));
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
                    {masterFeeders.map((f, fIdx) => (
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode GH</label>
                  <input 
                    type="text" 
                    value={ghCode} 
                    onChange={e => setGhCode(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: GH-BGL" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Gardu Hubung</label>
                  <input 
                    type="text" 
                    value={ghName} 
                    onChange={e => setGhName(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Contoh: GH Baguala" 
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi / Alamat</label>
                <input 
                  type="text" 
                  value={ghLoc} 
                  onChange={e => setGhLoc(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  placeholder="Alamat lengkap..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Incoming Feeder</label>
                  <input 
                    type="text" 
                    value={ghIncoming} 
                    onChange={e => setGhIncoming(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    placeholder="Feeder pemasok..." 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Outgoing</label>
                  <input 
                    type="number" 
                    value={ghOutCount} 
                    onChange={e => setGhOutCount(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Daftar Outgoing Feeder</label>
                <input 
                  type="text" 
                  value={ghOutList} 
                  onChange={e => setGhOutList(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nama feeder keluar pisahkan koma..." 
                />
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
                    placeholder="Contoh: REC-LTR2-01" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jenis Pemutus</label>
                  <select 
                    value={pmtType} 
                    onChange={e => setPmtType(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Recloser">Recloser</option>
                    <option value="LBS Motorized">LBS Motorized</option>
                    <option value="LBS Manual">LBS Manual</option>
                    <option value="PMT">PMT</option>
                    <option value="FCO">FCO</option>
                    <option value="Disconnector (DS)">Disconnector (DS)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang</label>
                  <input 
                    type="text" 
                    value={pmtFeeder} 
                    onChange={e => setPmtFeeder(e.target.value)} 
                    required 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rating Arus (A)</label>
                  <input 
                    type="number" 
                    value={pmtRating} 
                    onChange={e => setPmtRating(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi / Tiang</label>
                  <input 
                    type="text" 
                    value={pmtLoc} 
                    onChange={e => setPmtLoc(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Merk & Tipe</label>
                  <input 
                    type="text" 
                    value={pmtBrand} 
                    onChange={e => setPmtBrand(e.target.value)} 
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
