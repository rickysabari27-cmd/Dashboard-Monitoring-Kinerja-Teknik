import React from 'react';
import { 
  ViewMode, 
  SpkTask, 
  GarduMeasurement, 
  MasterFeeder, 
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
  Search
} from 'lucide-react';

interface MaterialStockViewProps {
  isDarkMode: boolean;
  currentView: ViewMode;
  spkList?: SpkTask[];
  garduMeasurements?: GarduMeasurement[];
  masterFeeders?: MasterFeeder[];
  materials?: MaterialItem[];
  apdTools?: ApdTool[];
  vehicles?: Vehicle[];
  users?: UserAccess[];
  onOpenUniversalInput?: (tab?: string) => void;
}

export const MaterialStockView: React.FC<MaterialStockViewProps> = ({
  isDarkMode,
  currentView,
  spkList = [],
  garduMeasurements = [],
  masterFeeders = [],
  materials = [],
  apdTools = [],
  vehicles = [],
  users = [],
  onOpenUniversalInput
}) => {
  
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
    return (
      <div className="space-y-4">
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
                Inventaris Feeder, Gardu Induk, Breaker, Panjang KMS & Jumlah Pelanggan
              </p>
            </div>
          </div>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('master_data')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Penyulang Baru</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'} font-bold uppercase text-[10px]`}>
              <tr>
                <th className="p-3">Kode / Feeder</th>
                <th className="p-3">Gardu Induk</th>
                <th className="p-3">Panjang (KMS)</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Jenis Breaker</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {masterFeeders.map((feeder) => (
                <tr key={feeder.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{feeder.feederName} ({feeder.feederCode})</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{feeder.substationName}</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">{feeder.lengthKms} km</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">{feeder.customerCount.toLocaleString('id-ID')} Plg</td>
                  <td className="p-3 text-slate-500">{feeder.breakerType}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {feeder.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                Otorisasi Team Leader, Supervisor, Petugas Yantek & Operator SCADA
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
          {users.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${
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
