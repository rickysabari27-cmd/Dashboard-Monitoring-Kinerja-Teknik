import React from 'react';
import { 
  ViewMode, 
  SpkTask, 
  GarduMeasurement, 
  MasterFeeder, 
  MasterGarduDistribusi,
  MaterialItem, 
  ApdTool, 
  Vehicle, 
  UserAccess 
} from '../../types';
import { 
  Package, 
  FileText, 
  Gauge, 
  Database, 
  Shield, 
  Car, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap,
  Tag,
  Search,
  Trash2,
  Pencil,
  GitBranch,
  Power,
  PowerOff,
  Save,
  X
} from 'lucide-react';

interface MaterialStockViewProps {
  isDarkMode: boolean;
  currentView: ViewMode;
  spkList?: SpkTask[];
  garduMeasurements?: GarduMeasurement[];
  masterFeeders?: MasterFeeder[];
  masterGarduDistribusi?: MasterGarduDistribusi[];
  materials?: MaterialItem[];
  apdTools?: ApdTool[];
  vehicles?: Vehicle[];
  users?: UserAccess[];
  onOpenUniversalInput?: (tab?: string) => void;
  onDeleteMasterFeeder?: (feederId: string) => void;
  onSaveMasterFeeder?: (feeder: MasterFeeder) => void;
}

export const MaterialStockView: React.FC<MaterialStockViewProps> = ({
  isDarkMode,
  currentView,
  spkList = [],
  garduMeasurements = [],
  masterFeeders = [],
  masterGarduDistribusi = [],
  materials = [],
  apdTools = [],
  vehicles = [],
  users = [],
  onOpenUniversalInput,
  onDeleteMasterFeeder,
  onSaveMasterFeeder
}) => {
  const [feederSearchQuery, setFeederSearchQuery] = React.useState('');
  const [feederToDelete, setFeederToDelete] = React.useState<MasterFeeder | null>(null);

  // Edit Feeder Modal State
  const [feederToEdit, setFeederToEdit] = React.useState<MasterFeeder | null>(null);
  const [editCode, setEditCode] = React.useState('');
  const [editName, setEditName] = React.useState('');
  const [editGi, setEditGi] = React.useState('-');
  const [editGh, setEditGh] = React.useState('-');
  const [editStatus, setEditStatus] = React.useState('Utama');
  const [editOpStatus, setEditOpStatus] = React.useState('Operasi');
  const [editKha, setEditKha] = React.useState<number | string>('');
  const [editLength, setEditLength] = React.useState<number | string>('');
  const [editGarduCount, setEditGarduCount] = React.useState<number | string>('');
  const [editCustomerCount, setEditCustomerCount] = React.useState<number | string>('');
  const [editConfig, setEditConfig] = React.useState('Looping');

  const handleEditGiChange = (val: string) => {
    setEditGi(val);
    if (val && val !== '-') {
      setEditGh('-');
    }
  };

  const handleEditGhChange = (val: string) => {
    setEditGh(val);
    if (val && val !== '-') {
      setEditGi('-');
    }
  };

  const handleStartEdit = (feeder: MasterFeeder) => {
    setFeederToEdit(feeder);
    setEditCode(feeder.feederCode || '');
    setEditName(feeder.feederName || '');
    setEditGi(feeder.substationName && feeder.substationName !== '-' ? feeder.substationName : '-');
    setEditGh(feeder.garduHubung && feeder.garduHubung !== '-' ? feeder.garduHubung : '-');
    setEditStatus(feeder.status || 'Utama');
    setEditOpStatus(feeder.operationalStatus || 'Operasi');
    setEditKha(feeder.khaAmpere ?? '');
    setEditLength(feeder.lengthKms ?? '');
    setEditGarduCount(feeder.garduCount ?? '');
    setEditCustomerCount(feeder.customerCount ?? '');
    setEditConfig(feeder.configuration || 'Looping');
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feederToEdit) return;

    const updated: MasterFeeder = {
      ...feederToEdit,
      feederCode: editCode,
      feederName: editName,
      substationName: editGi,
      garduHubung: editGh,
      status: editStatus,
      operationalStatus: editOpStatus,
      khaAmpere: editKha !== '' ? Number(editKha) : 0,
      lengthKms: editLength !== '' ? Number(editLength) : 0,
      garduCount: editGarduCount !== '' ? Number(editGarduCount) : 0,
      customerCount: editCustomerCount !== '' ? Number(editCustomerCount) : 0,
      configuration: editConfig
    };

    if (onSaveMasterFeeder) {
      onSaveMasterFeeder(updated);
    }
    setFeederToEdit(null);
  };
  
  // 1. SPK VIEW
  if (currentView === 'spk') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Perintah Kerja Harian (SPK) Operasional
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manajemen SPK ROW Pangkas Pohon, Inspeksi SUTM Tier 1 & 2, serta Pemeliharaan
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('spk')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input SPK Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spkList.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{item.spkNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  {item.status}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {item.taskType} • Feeder {item.feederName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.locationSection}</p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Tim: {item.teamName}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.targetQty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. PENGUKURAN GARDU VIEW
  if (currentView === 'pengukuran') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Pengukuran Arus & Beban Gardu Distribusi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data Keseimbangan Beban Fasa R-S-T-N & Kategori Beban Kritis
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('pengukuran')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Pengukuran Gardu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {garduMeasurements.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">{item.garduCode} • {item.feederName}</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{item.garduName}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'Critical Overload' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {item.loadPercentage}% Load ({item.status})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs py-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-bold">
                <div><span className="text-[10px] text-slate-400 block font-normal">R</span>{item.currentR}A</div>
                <div><span className="text-[10px] text-slate-400 block font-normal">S</span>{item.currentS}A</div>
                <div><span className="text-[10px] text-slate-400 block font-normal">T</span>{item.currentT}A</div>
                <div><span className="text-[10px] text-slate-400 block font-normal">N</span>{item.currentN}A</div>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Trafo: {item.capacityKva} kVA</span>
                <span>Ukur: {item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. MASTER DATA VIEW
  if (currentView === 'master_data') {
    const penyulangUtama = masterFeeders.filter(f => (f.status || 'Utama') === 'Utama').length;
    const penyulangPercabangan = masterFeeders.filter(f => f.status === 'Percabangan').length;
    const totalPenyulang = penyulangUtama + penyulangPercabangan;
    const penyulangOperasi = masterFeeders.filter(f => (f.operationalStatus || 'Operasi') === 'Operasi').length;
    const penyulangTidakOperasi = masterFeeders.filter(f => f.operationalStatus === 'Tidak Operasi').length;

    const filteredFeeders = masterFeeders.filter((feeder) => {
      if (!feederSearchQuery.trim()) return true;
      const query = feederSearchQuery.toLowerCase();
      const code = (feeder.feederCode || '').toLowerCase();
      const name = (feeder.feederName || '').toLowerCase();
      const gi = (feeder.substationName || '').toLowerCase();
      const gh = (feeder.garduHubung || '').toLowerCase();
      return code.includes(query) || name.includes(query) || gi.includes(query) || gh.includes(query);
    });

    const sortedFeeders = [...filteredFeeders].sort((a, b) => {
      const nameA = (a.feederName || a.feederCode || '').toLowerCase();
      const nameB = (b.feederName || b.feederCode || '').toLowerCase();
      return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
    });

    return (
      <div className="space-y-4">
        {/* Header Bar */}
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Master Data Penyulang 20kV ULP Baguala
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventaris Feeder, Gardu Induk, GH, Kapasitas Gardu (kVA), Panjang Jaringan KMS, Jumlah Gardu & Pelanggan
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('master_data')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Data Penyulang</span>
          </button>
        </div>

        {/* Ringkasan Statistik Penyulang (5 KPI Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Card 1: Total Penyulang */}
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Penyulang</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
              {totalPenyulang} <span className="text-xs font-normal text-slate-400">Feeder</span>
            </div>
          </div>

          {/* Card 2: Penyulang Utama */}
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Utama</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {penyulangUtama} <span className="text-xs font-normal text-slate-400">Feeder</span>
            </div>
          </div>

          {/* Card 3: Penyulang Percabangan */}
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Percabangan</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <GitBranch className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
              {penyulangPercabangan} <span className="text-xs font-normal text-slate-400">Feeder</span>
            </div>
          </div>

          {/* Card 4: Penyulang Operasi */}
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Penyulang Operasi</span>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Power className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {penyulangOperasi} <span className="text-xs font-normal text-slate-400">Feeder</span>
            </div>
          </div>

          {/* Card 5: Penyulang Tidak Operasi */}
          <div className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Tidak Operasi</span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <PowerOff className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {penyulangTidakOperasi} <span className="text-xs font-normal text-slate-400">Feeder</span>
            </div>
          </div>
        </div>

        {/* Search Bar for Kode Penyulang or Nama Penyulang */}
        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text"
            value={feederSearchQuery}
            onChange={(e) => setFeederSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Kode Penyulang, Nama, GI, atau GH..."
            className={`w-full text-xs font-bold bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          />
          {feederSearchQuery && (
            <button 
              onClick={() => setFeederSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Table View Matching Example Screenshot */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-center text-xs border-collapse">
            <thead className="bg-slate-900 dark:bg-slate-950 text-white font-bold text-xs border-b border-slate-800">
              <tr>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">No</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Kode Penyulang</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Nama Penyulang</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Gardu Induk</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Gardu Hubung</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Status</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Status Operasional</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">kVA Gardu</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Panjang Jaringan (kms)</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Jumlah Gardu</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Jumlah Pel</th>
                <th className="p-3 border-r border-slate-800 text-center font-bold text-white">Konfigurasi</th>
                <th className="p-3 text-center font-bold text-white">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-center">
              {masterFeeders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-10 text-center text-slate-400 font-bold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Database className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Data Penyulang</p>
                      <p className="text-xs text-slate-400">Klik tombol <span className="font-bold text-purple-500">"Input Data Penyulang"</span> di atas untuk menambahkan data baru.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredFeeders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-slate-400 font-bold">
                    Tidak ada data penyulang yang cocok dengan pencarian "{feederSearchQuery}"
                  </td>
                </tr>
              ) : (
                sortedFeeders.map((feeder, idx) => {
                  const displayStatus = feeder.status && feeder.status !== 'Aktif / Operasi' ? feeder.status : 'Utama';
                  const matchingGds = (masterGarduDistribusi || []).filter(
                    g => g.feederName && g.feederName.trim().toLowerCase() === (feeder.feederName || '').trim().toLowerCase()
                  );
                  const feederTotalKva = matchingGds.reduce((acc, g) => acc + (g.capacityKva || 0), 0);
                  const displayGarduCount = matchingGds.length > 0 ? matchingGds.length : (feeder.garduCount ?? 0);

                  return (
                    <tr key={`${feeder.id || 'feeder'}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white">
                        {feeder.feederCode}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-200 font-medium">
                        {feeder.feederName}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300">
                        {feeder.substationName}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-medium">
                        {feeder.garduHubung || '-'}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-200">
                        {displayStatus}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-200">
                        {feeder.operationalStatus || 'Operasi'}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white">
                        {feederTotalKva} kVA
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white">
                        {feeder.lengthKms?.toString().replace('.', ',') || 0}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white">
                        {displayGarduCount}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white">
                        {feeder.customerCount ?? 0}
                      </td>
                      <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-200 font-medium">
                        {feeder.configuration || 'Looping'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(feeder)}
                            title="Edit Data Penyulang"
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center justify-center cursor-pointer active:scale-90"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setFeederToDelete(feeder)}
                            title="Hapus Data Penyulang"
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-colors inline-flex items-center justify-center cursor-pointer active:scale-90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Edit Data Penyulang */}
        {feederToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Edit Data Penyulang</h3>
                    <p className="text-xs text-slate-400">Ubah informasi spesifikasi penyulang 20kV</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeederToEdit(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kode Penyulang</label>
                    <input 
                      type="text" 
                      value={editCode} 
                      onChange={(e) => setEditCode(e.target.value)} 
                      required
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Penyulang</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      required
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Gardu Induk</label>
                    <select 
                      value={editGi} 
                      onChange={(e) => handleEditGiChange(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="-">Pilih Gardu</option>
                      <option value="Hative Besar">Hative Besar</option>
                      <option value="GIS Passo">GIS Passo</option>
                      <option value="GI Passo">GI Passo</option>
                      <option value="GI Sirimau">GI Sirimau</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">GH</label>
                    <select 
                      value={editGh} 
                      onChange={(e) => handleEditGhChange(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="-">Pilih Gardu</option>
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
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Status</label>
                    <select 
                      value={editStatus} 
                      onChange={(e) => setEditStatus(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Utama">Utama</option>
                      <option value="Percabangan">Percabangan</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Status Operasional</label>
                    <select 
                      value={editOpStatus} 
                      onChange={(e) => setEditOpStatus(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Operasi">Operasi</option>
                      <option value="Tidak Operasi">Tidak Operasi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kapasitas Gardu (kVA)</label>
                    <input 
                      type="number" 
                      value={editKha} 
                      onChange={(e) => setEditKha(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Panjang (kms)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={editLength} 
                      onChange={(e) => setEditLength(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jml Gardu</label>
                    <input 
                      type="number" 
                      value={editGarduCount} 
                      onChange={(e) => setEditGarduCount(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jml Pelanggan</label>
                    <input 
                      type="number" 
                      value={editCustomerCount} 
                      onChange={(e) => setEditCustomerCount(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Konfigurasi</label>
                  <select 
                    value={editConfig} 
                    onChange={(e) => setEditConfig(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Looping">Looping</option>
                    <option value="Radial">Radial</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFeederToEdit(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Data */}
        {feederToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <div className="p-3 rounded-xl bg-rose-500/10">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Hapus Data Penyulang</h3>
                  <p className="text-xs text-slate-400">Konfirmasi Penghapusan</p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
                Apakah Anda yakin ingin menghapus data penyulang <span className="font-bold text-slate-900 dark:text-white">{feederToDelete.feederName} ({feederToDelete.feederCode})</span>?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFeederToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteMasterFeeder && feederToDelete.id) {
                      onDeleteMasterFeeder(feederToDelete.id);
                    }
                    setFeederToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. APD VIEW
  if (currentView === 'apd') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Alat Kerja & Peralatan Keselamatan K3 APD
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventaris APD Tegangan Tinggi 20kV, Helm K3, Sarung Tangan Isolasi & Thermovision
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('apd')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input APD Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apdTools.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">{item.code}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {item.condition}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">{item.name}</h3>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{item.qty} <span className="text-xs font-normal text-slate-400">Unit</span></span>
                <span className="text-[10px] text-slate-400">{item.unitOwner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. KENDARAAN VIEW
  if (currentView === 'kendaraan') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Armada Kendaraan Operasional & Yantek
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitoring Mobil Gangguan Hilux 4x4, Truck Crane & Motor Patroli Jaringan
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('kendaraan')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Armada Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400">{item.plateNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">{item.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{item.teamAssigned}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Odometer: {item.mileageKm.toLocaleString('id-ID')} km</span>
                <span className="text-emerald-500">BBM: {item.fuelStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. USERS VIEW
  if (currentView === 'users') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Kelola User & Hak Akses Petugas Teknik
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Otorisasi Team Leader, Petugas Yantek & Admin
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('users')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah User Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((item, idx) => (
            <div key={`${item.id || item.nik || 'user'}-${idx}`} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">{item.nik}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{item.name}</h3>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-2">{item.role}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.email}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT: MATERIAL VIEW
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Stok & Pemakaian Material Pemeliharaan 20kV
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gudang PLN ULP Baguala • Inventaris Komponen SUTM & Cadangan Gangguan
            </p>
          </div>
        </div>

        <button 
          onClick={() => onOpenUniversalInput && onOpenUniversalInput('material')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Input Stok Material</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => (
          <div 
            key={mat.id}
            className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400">{mat.itemCode || mat.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                mat.status === 'Kritis' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                mat.status === 'Waspada' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {mat.status}
              </span>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
              {mat.name}
            </h3>

            <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                {mat.stockQty} <span className="text-xs text-slate-400 font-normal">{mat.unit}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Min: {mat.minStock} {mat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
