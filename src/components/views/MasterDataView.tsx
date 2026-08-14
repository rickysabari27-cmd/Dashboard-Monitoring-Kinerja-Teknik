import React, { useState } from 'react';
import { 
  MasterFeeder, 
  MasterSection, 
  MasterGarduHubung, 
  MasterGarduDistribusi, 
  MasterPemutus 
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
  AlertCircle
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

  // Section Form States
  const [secCode, setSecCode] = useState('');
  const [secName, setSecName] = useState('');
  const [secFeeder, setSecFeeder] = useState('');
  const [secSubstation, setSecSubstation] = useState('GI Passo');
  const [secStart, setSecStart] = useState('');
  const [secEnd, setSecEnd] = useState('');
  const [secGarduCount, setSecGarduCount] = useState<number | string>(0);
  const [secLength, setSecLength] = useState<number | string>(0);
  const [secCust, setSecCust] = useState<number | string>(0);
  const [secStatus, setSecStatus] = useState<'Operasi' | 'Tidak Operasi' | 'Manuver'>('Operasi');

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
    setFGh(feeder.garduHubung || '-');
    setFStatus(feeder.status || 'Utama');
    setFOpStatus(feeder.operationalStatus || 'Operasi');
    setFKha(feeder.khaAmpere ?? 0);
    setFLength(feeder.lengthKms ?? 0);
    setFGarduCount(feeder.garduCount ?? 0);
    setFCust(feeder.customerCount ?? 0);
    setFConfig(feeder.configuration || 'Looping');
  };

  const handleSaveFeeder = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MasterFeeder = {
      id: feederToEdit ? feederToEdit.id : `MF-${Date.now()}`,
      feederCode: fCode.trim().toUpperCase(),
      feederName: fName.trim(),
      substationName: fGi,
      garduHubung: fGh === '-' ? '' : fGh,
      status: fStatus,
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
    setSecSubstation(sec.substationOrGh);
    setSecStart(sec.startPoint);
    setSecEnd(sec.endPoint);
    setSecGarduCount(sec.garduCount);
    setSecLength(sec.lengthKms);
    setSecCust(sec.customerCount ?? 0);
    setSecStatus(sec.status);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MasterSection = {
      id: sectionToEdit ? sectionToEdit.id : `SEC-${Date.now()}`,
      sectionCode: secCode.trim().toUpperCase(),
      sectionName: secName.trim(),
      feederName: secFeeder.trim(),
      substationOrGh: secSubstation.trim(),
      startPoint: secStart.trim(),
      endPoint: secEnd.trim(),
      garduCount: Number(secGarduCount) || 0,
      lengthKms: Number(secLength) || 0,
      customerCount: Number(secCust) || 0,
      status: secStatus
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
      id: ghToEdit ? ghToEdit.id : `GH-${Date.now()}`,
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
      id: gdToEdit ? gdToEdit.id : `GD-${Date.now()}`,
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
      id: pmtToEdit ? pmtToEdit.id : `PMT-${Date.now()}`,
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
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Penyulang</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                {masterFeeders.length} <span className="text-xs font-normal text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Utama</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {masterFeeders.filter(f => (f.status || 'Utama') === 'Utama').length} <span className="text-xs font-normal text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Percabangan</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                {masterFeeders.filter(f => f.status === 'Percabangan').length} <span className="text-xs font-normal text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Operasi</span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                {masterFeeders.filter(f => (f.operationalStatus || 'Operasi') === 'Operasi').length} <span className="text-xs font-normal text-slate-400">Feeder</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Tidak Operasi</span>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                {masterFeeders.filter(f => f.operationalStatus === 'Tidak Operasi').length} <span className="text-xs font-normal text-slate-400">Feeder</span>
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
                    <th className="p-3 text-center border-r border-slate-800/80">KHA (A)</th>
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
                    .map((feeder, idx) => (
                      <tr key={feeder.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                        <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.feederCode}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">{feeder.feederName}</td>
                        <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{feeder.substationName || '-'}</td>
                        <td className="p-3 text-center font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{feeder.garduHubung || '-'}</td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            feeder.status === 'Percabangan' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {feeder.status || 'Utama'}
                          </span>
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            feeder.operationalStatus === 'Tidak Operasi' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {feeder.operationalStatus || 'Operasi'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.khaAmpere ?? 0}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.lengthKms ?? 0}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.garduCount ?? 0}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{feeder.customerCount ?? 0}</td>
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
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DATA SECTION                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'section' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Section</div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{masterSections.length} Section</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Gardu Section</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {masterSections.reduce((acc, s) => acc + (s.garduCount || 0), 0)} Gardu
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Panjang KMS</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                {masterSections.reduce((acc, s) => acc + (s.lengthKms || 0), 0).toFixed(1)} KMS
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Status Operasi</div>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
                {masterSections.filter(s => s.status === 'Operasi').length} Aktif
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
                placeholder="Cari berdasarkan Kode Section, Nama, atau Penyulang..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>
            <button
              onClick={() => {
                setSectionToEdit(null);
                setSecCode('');
                setSecName('');
                setSecFeeder(masterFeeders[0]?.feederName || 'Lateri 2');
                setSecSubstation('GI Passo');
                setSecStart('');
                setSecEnd('');
                setSecGarduCount(0);
                setSecLength(0);
                setSecCust(0);
                setSecStatus('Operasi');
                setIsAddSectionOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Section</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#0B132B] text-white font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-800/80 w-12">No</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Kode Section</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Nama Section</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Penyulang</th>
                    <th className="p-3 text-center border-r border-slate-800/80">GI / GH Asal</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Titik Awal (In)</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Titik Akhir (Out)</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Jml Gardu</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Panjang (kms)</th>
                    <th className="p-3 text-center border-r border-slate-800/80">Status</th>
                    <th className="p-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#070D1E]">
                  {masterSections
                    .filter(s => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (s.sectionCode || '').toLowerCase().includes(q) ||
                             (s.sectionName || '').toLowerCase().includes(q) ||
                             (s.feederName || '').toLowerCase().includes(q);
                    })
                    .map((sec, idx) => (
                      <tr key={sec.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{idx + 1}</td>
                        <td className="p-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{sec.sectionCode}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80">{sec.sectionName}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800/80">{sec.feederName}</td>
                        <td className="p-3 text-center text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{sec.substationOrGh}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{sec.startPoint}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80">{sec.endPoint}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{sec.garduCount}</td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/80">{sec.lengthKms}</td>
                        <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500">
                            {sec.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditSection(sec)}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 cursor-pointer active:scale-90"
                              title="Edit Section"
                            >
                              <Pencil className="w-4 h-4" />
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
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DATA GARDU HUBUNG                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'gardu_hubung' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Gardu Hubung</div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{masterGarduHubung.length} GH</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">GH Indoor / Outdoor</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                {masterGarduHubung.filter(g => g.ghType === 'Indoor').length} Indoor
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Outgoing Feeders</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {masterGarduHubung.reduce((acc, g) => acc + (g.outgoingFeedersCount || 0), 0)} Feeder
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Status Operasi</div>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
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
                      <tr key={gh.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
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
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Gardu Distribusi</div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{masterGarduDistribusi.length} Gardu</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Kapasitas Terpasang</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                {masterGarduDistribusi.reduce((acc, g) => acc + (g.capacityKva || 0), 0)} kVA
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Gardu Portal</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {masterGarduDistribusi.filter(g => g.garduType === 'Portal').length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Gardu Cantol / Beton / Kios</div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
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
                      <tr key={gd.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
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
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Total Alat Pemutus</div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{masterPemutus.length} Unit</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Recloser / OCR</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                {masterPemutus.filter(p => p.equipmentType === 'Recloser').length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">LBS Motorized / Manual</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {masterPemutus.filter(p => p.equipmentType.includes('LBS')).length} Unit
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="text-[11px] font-bold text-slate-400 mb-1">Terhubung SCADA</div>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
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
                      <tr key={pmt.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
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
              <button onClick={() => { setIsAddFeederOpen(false); setFeederToEdit(null); }} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFeeder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kode Penyulang</label>
                  <input type="text" value={fCode} onChange={e => setFCode(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: LTR2" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Nama Penyulang</label>
                  <input type="text" value={fName} onChange={e => setFName(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: Lateri 2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Gardu Induk</label>
                  <select value={fGi} onChange={e => { setFGi(e.target.value); if (e.target.value !== '-') setFGh('-'); }} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="-">-</option>
                    <option value="GI Passo">GI Passo</option>
                    <option value="GIS Passo">GIS Passo</option>
                    <option value="Hative Besar">Hative Besar</option>
                    <option value="GI Sirimau">GI Sirimau</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Gardu Hubung</label>
                  <select value={fGh} onChange={e => { setFGh(e.target.value); if (e.target.value !== '-') setFGi('-'); }} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="-">-</option>
                    <option value="GH Baguala">GH Baguala</option>
                    <option value="GH Bandara">GH Bandara</option>
                    <option value="GH Wayame">GH Wayame</option>
                    <option value="GH Poka">GH Poka</option>
                    <option value="GH Aston">GH Aston</option>
                    <option value="GH Hative Kecil">GH Hative Kecil</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Status</label>
                  <select value={fStatus} onChange={e => setFStatus(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Utama">Utama</option>
                    <option value="Percabangan">Percabangan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Status Operasional</label>
                  <select value={fOpStatus} onChange={e => setFOpStatus(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">KHA (A)</label>
                  <input type="number" value={fKha} onChange={e => setFKha(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Panjang (kms)</label>
                  <input type="number" step="0.1" value={fLength} onChange={e => setFLength(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Jml Gardu</label>
                  <input type="number" value={fGarduCount} onChange={e => setFGarduCount(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsAddFeederOpen(false); setFeederToEdit(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">Simpan Data</button>
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
              <h3 className="font-extrabold text-base">{sectionToEdit ? 'Edit Data Section' : 'Tambah Data Section'}</h3>
              <button onClick={() => { setIsAddSectionOpen(false); setSectionToEdit(null); }} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kode Section</label>
                  <input type="text" value={secCode} onChange={e => setSecCode(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: SEC-LTR2-01" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Nama Section</label>
                  <input type="text" value={secName} onChange={e => setSecName(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Nama section..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Penyulang</label>
                  <input type="text" value={secFeeder} onChange={e => setSecFeeder(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: Lateri 2" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">GI / GH</label>
                  <input type="text" value={secSubstation} onChange={e => setSecSubstation(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Titik Awal (In)</label>
                  <input type="text" value={secStart} onChange={e => setSecStart(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Titik Akhir (Out)</label>
                  <input type="text" value={secEnd} onChange={e => setSecEnd(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Jml Gardu</label>
                  <input type="number" value={secGarduCount} onChange={e => setSecGarduCount(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Panjang (kms)</label>
                  <input type="number" step="0.1" value={secLength} onChange={e => setSecLength(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Status</label>
                  <select value={secStatus} onChange={e => setSecStatus(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                    <option value="Manuver">Manuver</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsAddSectionOpen(false); setSectionToEdit(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">Simpan Section</button>
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
              <button onClick={() => { setIsAddGhOpen(false); setGhToEdit(null); }} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGh} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kode GH</label>
                  <input type="text" value={ghCode} onChange={e => setGhCode(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: GH-BGL" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Nama Gardu Hubung</label>
                  <input type="text" value={ghName} onChange={e => setGhName(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: GH Baguala" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Lokasi / Alamat</label>
                <input type="text" value={ghLoc} onChange={e => setGhLoc(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Alamat lengkap..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Incoming Feeder</label>
                  <input type="text" value={ghIncoming} onChange={e => setGhIncoming(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Feeder pemasok..." />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Jumlah Outgoing</label>
                  <input type="number" value={ghOutCount} onChange={e => setGhOutCount(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Daftar Outgoing Feeder</label>
                <input type="text" value={ghOutList} onChange={e => setGhOutList(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Nama feeder keluar pisahkan koma..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Tipe GH</label>
                  <select value={ghType} onChange={e => setGhType(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Compact">Compact</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Status</label>
                  <select value={ghStatus} onChange={e => setGhStatus(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Operasi">Operasi</option>
                    <option value="Standby">Standby</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsAddGhOpen(false); setGhToEdit(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">Simpan GH</button>
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
              <button onClick={() => { setIsAddGdOpen(false); setGdToEdit(null); }} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kode Gardu</label>
                  <input type="text" value={gdCode} onChange={e => setGdCode(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: BG-012" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Nama Gardu</label>
                  <input type="text" value={gdName} onChange={e => setGdName(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: Gardu Lateri Raya" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Penyulang</label>
                  <input type="text" value={gdFeeder} onChange={e => setGdFeeder(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Nama feeder..." />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Section</label>
                  <input type="text" value={gdSection} onChange={e => setGdSection(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kapasitas (kVA)</label>
                  <input type="number" value={gdKva} onChange={e => setGdKva(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Phasa</label>
                  <select value={gdPhase} onChange={e => setGdPhase(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="3 Phasa">3 Phasa</option>
                    <option value="1 Phasa">1 Phasa</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Tipe Gardu</label>
                  <select value={gdType} onChange={e => setGdType(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Portal">Portal</option>
                    <option value="Cantol">Cantol</option>
                    <option value="Beton">Beton</option>
                    <option value="Kios">Kios</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Lokasi</label>
                <input type="text" value={gdLoc} onChange={e => setGdLoc(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsAddGdOpen(false); setGdToEdit(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">Simpan Gardu</button>
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
              <button onClick={() => { setIsAddPmtOpen(false); setPmtToEdit(null); }} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePmt} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kode Alat / Tag</label>
                  <input type="text" value={pmtCode} onChange={e => setPmtCode(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Contoh: REC-LTR2-01" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Jenis Pemutus</label>
                  <select value={pmtType} onChange={e => setPmtType(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
                  <label className="font-bold text-slate-400 block mb-1">Penyulang</label>
                  <input type="text" value={pmtFeeder} onChange={e => setPmtFeeder(e.target.value)} required className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Rating Arus (A)</label>
                  <input type="number" value={pmtRating} onChange={e => setPmtRating(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Lokasi / Tiang</label>
                  <input type="text" value={pmtLoc} onChange={e => setPmtLoc(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Merk & Tipe</label>
                  <input type="text" value={pmtBrand} onChange={e => setPmtBrand(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">SCADA Status</label>
                  <select value={pmtScada} onChange={e => setPmtScada(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Terhubung SCADA">Terhubung SCADA</option>
                    <option value="Manual / Non-SCADA">Manual / Non-SCADA</option>
                    <option value="Gangguan Link">Gangguan Link</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Status Posisi</label>
                  <select value={pmtStatus} onChange={e => setPmtStatus(e.target.value as any)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <option value="Masuk / ON">Masuk / ON</option>
                    <option value="Lepas / OFF">Lepas / OFF</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsAddPmtOpen(false); setPmtToEdit(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">Simpan Pemutus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
