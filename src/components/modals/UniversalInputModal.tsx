import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import { 
  X, 
  Zap, 
  FileText, 
  Wrench, 
  Gauge, 
  Database, 
  BarChart2, 
  Package, 
  Shield, 
  Car, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  PlusCircle
} from 'lucide-react';

interface UniversalInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ViewMode | string;
  isDarkMode: boolean;
  onSaveTrip?: (trip: any) => void;
  onSaveSpk?: (spk: any) => void;
  onSaveInspection?: (inspection: any) => void;
  onSaveRowTree?: (row: any) => void;
  onSaveMeasurement?: (measurement: any) => void;
  onSaveMasterFeeder?: (feeder: any) => void;
  onSaveSaidi?: (month: string, saidiReal: number, saifiReal: number) => void;
  onSaveMaterial?: (material: any) => void;
  onSaveApd?: (apd: any) => void;
  onSaveVehicle?: (vehicle: any) => void;
  onSaveUser?: (user: any) => void;
  onSaveHealthUpdate?: (health: any) => void;
}

export const UniversalInputModal: React.FC<UniversalInputModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'trips',
  isDarkMode,
  onSaveTrip,
  onSaveSpk,
  onSaveInspection,
  onSaveMeasurement,
  onSaveMasterFeeder,
  onSaveSaidi,
  onSaveMaterial,
  onSaveApd,
  onSaveVehicle,
  onSaveUser,
  onSaveHealthUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // Form States
  // 1. Trips
  const [tripFeeder, setTripFeeder] = useState('LATERI 2');
  const [tripDate, setTripDate] = useState('2026-08-10');
  const [tripTime, setTripTime] = useState('14:20');
  const [tripRelay, setTripRelay] = useState('GFR / OCR');
  const [tripLocation, setTripLocation] = useState('Km 6.4 - Passo');
  const [tripCause, setTripCause] = useState('Dahan pohon sagu sentuh SUTM Phasa S');
  const [tripCategory, setTripCategory] = useState('Tree/ROW');
  const [tripCustomers, setTripCustomers] = useState(3400);
  const [tripEns, setTripEns] = useState(4200);

  // 2. SPK
  const [spkNo, setSpkNo] = useState(`SPK/BAG/2026/08/0${Math.floor(Math.random() * 80 + 10)}`);
  const [spkType, setSpkType] = useState('ROW Pangkas Pohon');
  const [spkFeeder, setSpkFeeder] = useState('TULEHU');
  const [spkLocation, setSpkLocation] = useState('Tiang 120 - 135 Liang');
  const [spkTeam, setSpkTeam] = useState('Tim Yantek 1 Passo');
  const [spkTarget, setSpkTarget] = useState('6 Pohon Sagu / Kelapa');
  const [spkPriority, setSpkPriority] = useState('Urgent');
  const [spkTlTeknik, setSpkTlTeknik] = useState('Syahrul Kolly (TL TEKNIK ULP BAGUALA)');

  // 3. Inspeksi / Pemeliharaan ROW
  const [inspFeeder, setInspFeeder] = useState('LATERI 2');
  const [inspLocation, setInspLocation] = useState('Gardu BG-018 Passo');
  const [inspTeam, setInspTeam] = useState('Tim Inspeksi 20kV');
  const [inspCategory, setInspCategory] = useState('Sedang');
  const [inspDesc, setInspDesc] = useState('Dahan pohon sagu berjarak < 1.2m dari konduktor SUTM');

  // 4. Pengukuran Gardu
  const [garduCode, setGarduCode] = useState('BG-025');
  const [garduName, setGarduName] = useState('Gardu Lateri Dalam');
  const [garduFeeder, setGarduFeeder] = useState('LATERI 2');
  const [garduKva, setGarduKva] = useState(160);
  const [currentR, setCurrentR] = useState(190);
  const [currentS, setCurrentS] = useState(185);
  const [currentT, setCurrentT] = useState(175);
  const [currentN, setCurrentN] = useState(25);

  // 5. Master Feeder
  const [mFeederCode, setMFeederCode] = useState('LTR-04');
  const [mFeederName, setMFeederName] = useState('LATERI 4');
  const [mFeederGi, setMFeederGi] = useState('GI Passo');
  const [mFeederLength, setMFeederLength] = useState(16.5);
  const [mFeederCust, setMFeederCust] = useState(3200);

  // 6. SAIDI SAIFI
  const [saidiMonth, setSaidiMonth] = useState('Ags');
  const [saidiVal, setSaidiVal] = useState(57.125);
  const [saifiVal, setSaifiVal] = useState(0.94);

  // 7. Material
  const [matName, setMatName] = useState('Pin Post Insulator 20kV');
  const [matCat, setMatCat] = useState('Isolator');
  const [matQty, setMatQty] = useState(20);
  const [matUnit, setMatUnit] = useState('Buah');

  // 8. APD
  const [apdName, setApdName] = useState('Helm K3 Class E 20kV');
  const [apdCat, setApdCat] = useState('APD K3');
  const [apdQty, setApdQty] = useState(10);
  const [apdCondition, setApdCondition] = useState('Baik');

  // 9. Vehicle
  const [vehPlate, setVehPlate] = useState('DE 1890 AB');
  const [vehName, setVehName] = useState('Mobil Yantek Hilux Passo');
  const [vehType, setVehType] = useState('Mobil Yantek');
  const [vehTeam, setVehTeam] = useState('Tim Yantek Passo');

  // 10. User
  const [userNik, setUserNik] = useState('9820055PLN');
  const [userName, setUserName] = useState('Petugas Teknik Baguala');
  const [userRole, setUserRole] = useState('Petugas Yantek');
  const [userEmail, setUserEmail] = useState('yantek.baguala@pln.co.id');

  if (!isOpen) return null;

  const tabMenuList = [
    { id: 'trips', label: 'Gangguan & Trip', icon: Zap, color: 'text-rose-500' },
    { id: 'spk', label: 'Perintah Kerja (SPK)', icon: FileText, color: 'text-blue-500' },
    { id: 'pemeliharaan', label: 'Inspeksi & ROW 20kV', icon: Wrench, color: 'text-emerald-500' },
    { id: 'pengukuran', label: 'Pengukuran Gardu', icon: Gauge, color: 'text-amber-500' },
    { id: 'master_data', label: 'Master Feeder', icon: Database, color: 'text-purple-500' },
    { id: 'saidi_saifi', label: 'SAIDI / SAIFI', icon: BarChart2, color: 'text-cyan-500' },
    { id: 'material', label: 'Stok Material', icon: Package, color: 'text-indigo-500' },
    { id: 'apd', label: 'Alat Kerja & APD', icon: Shield, color: 'text-teal-500' },
    { id: 'kendaraan', label: 'Armada Kendaraan', icon: Car, color: 'text-sky-500' },
    { id: 'users', label: 'Akses User', icon: Users, color: 'text-slate-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'trips' && onSaveTrip) {
      onSaveTrip({
        id: `TRIP-2026-00${Math.floor(Math.random() * 900 + 100)}`,
        feederName: tripFeeder,
        substation: 'GI Passo (20kV)',
        tripDate,
        tripTime,
        recoveryTime: '15:30',
        durationMinutes: 70,
        relayType: tripRelay as any,
        currentAmpere: 380,
        locationKm: tripLocation,
        cause: tripCause,
        category: tripCategory as any,
        affectedCustomers: Number(tripCustomers),
        ensKwh: Number(tripEns),
        financialLossIdr: Number(tripEns) * 1444.7,
        status: 'Resolved'
      });
    } else if (activeTab === 'spk' && onSaveSpk) {
      onSaveSpk({
        id: `SPK-2026-${Math.floor(Math.random() * 900 + 100)}`,
        spkNumber: spkNo,
        date: new Date().toISOString().split('T')[0],
        taskType: spkType,
        feederName: spkFeeder,
        locationSection: spkLocation,
        teamName: spkTeam,
        targetQty: spkTarget,
        status: 'Dalam Proses',
        priority: spkPriority,
        description: `SPK ${spkType} di ${spkFeeder}`
      });
    } else if (activeTab === 'pemeliharaan' && onSaveInspection) {
      onSaveInspection({
        id: `INSP-2026-0${Math.floor(Math.random() * 90 + 10)}`,
        feederName: inspFeeder,
        location: inspLocation,
        inspectorTeam: inspTeam,
        category: inspCategory,
        findingDescription: inspDesc,
        date: new Date().toISOString().split('T')[0],
        status: 'Open'
      });
    } else if (activeTab === 'pengukuran' && onSaveMeasurement) {
      const maxCurrent = Math.max(currentR, currentS, currentT);
      const approxKvaLoad = (maxCurrent * 3 * 220) / 1000;
      const pct = Math.round((approxKvaLoad / garduKva) * 100);

      onSaveMeasurement({
        id: `GARDU-00${Math.floor(Math.random() * 90 + 10)}`,
        garduCode,
        garduName,
        feederName: garduFeeder,
        capacityKva: Number(garduKva),
        date: new Date().toISOString().split('T')[0],
        inspectorName: 'Petugas Teknik ULP Baguala',
        currentR: Number(currentR),
        currentS: Number(currentS),
        currentT: Number(currentT),
        currentN: Number(currentN),
        voltageRN: 228,
        voltageSN: 226,
        voltageTN: 230,
        loadPercentage: pct > 100 ? 98 : pct,
        status: pct > 90 ? 'Critical Overload' : 'Normal'
      });
    } else if (activeTab === 'master_data' && onSaveMasterFeeder) {
      onSaveMasterFeeder({
        id: `MF-0${Math.floor(Math.random() * 90 + 10)}`,
        feederCode: mFeederCode,
        feederName: mFeederName,
        substationName: mFeederGi,
        voltageKv: 20,
        lengthKms: Number(mFeederLength),
        customerCount: Number(mFeederCust),
        sectionCount: 14,
        breakerType: 'SF6 Circuit Breaker 20kV',
        status: 'Aktif / Operasi'
      });
    } else if (activeTab === 'saidi_saifi' && onSaveSaidi) {
      onSaveSaidi(saidiMonth, Number(saidiVal), Number(saifiVal));
    } else if (activeTab === 'material' && onSaveMaterial) {
      onSaveMaterial({
        id: `M-0${Math.floor(Math.random() * 90 + 10)}`,
        itemCode: `MAT-${matCat.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`,
        name: matName,
        category: matCat,
        stockQty: Number(matQty),
        unit: matUnit,
        minStock: 10,
        warehouseLocation: 'Gudang ULP Baguala',
        status: Number(matQty) < 10 ? 'Waspada' : 'Aman'
      });
    } else if (activeTab === 'apd' && onSaveApd) {
      onSaveApd({
        id: `APD-0${Math.floor(Math.random() * 90 + 10)}`,
        code: `K3-${apdCat.substring(0, 3).toUpperCase()}-01`,
        name: apdName,
        category: apdCat,
        qty: Number(apdQty),
        condition: apdCondition,
        lastCalibrated: new Date().toISOString().split('T')[0],
        unitOwner: 'ULP Baguala',
        inspector: 'Officer K3 Baguala'
      });
    } else if (activeTab === 'kendaraan' && onSaveVehicle) {
      onSaveVehicle({
        id: `VEH-0${Math.floor(Math.random() * 90 + 10)}`,
        plateNumber: vehPlate,
        name: vehName,
        vehicleType: vehType,
        status: 'Siap Operasi',
        mileageKm: 32000,
        teamAssigned: vehTeam,
        fuelStatus: '90%'
      });
    } else if (activeTab === 'users' && onSaveUser) {
      onSaveUser({
        id: `USR-0${Math.floor(Math.random() * 90 + 10)}`,
        nik: userNik,
        name: userName,
        role: userRole,
        unitName: 'PLN ULP Baguala',
        email: userEmail,
        status: 'Aktif',
        lastActive: 'Baru saja'
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden transition-all my-auto max-h-[90vh] flex flex-col ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-600/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Pusat Input Data Operasional 20kV
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  ULP Baguala
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih kategori menu di bawah untuk menambahkan entri data baru ke sistem
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Horizontal Scroll */}
        <div className={`p-2 border-b overflow-x-auto custom-scrollbar flex items-center gap-1.5 ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {tabMenuList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: TRIPS */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold mb-3">
                Input Kejadian Gangguan & Trip Feeder Penyulang 20kV
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Penyulang / Feeder</label>
                  <select value={tripFeeder} onChange={(e) => setTripFeeder(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="LATERI 1">LATERI 1</option>
                    <option value="LATERI 2">LATERI 2</option>
                    <option value="LATERI 3">LATERI 3</option>
                    <option value="TULEHU">TULEHU</option>
                    <option value="ALLANG">ALLANG</option>
                    <option value="PASSO">PASSO</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Relay Dominan</label>
                  <select value={tripRelay} onChange={(e) => setTripRelay(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="GFR / OCR">GFR / OCR</option>
                    <option value="GFR">GFR (Ground Fault)</option>
                    <option value="OCR">OCR (Over Current)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Tanggal Trip</label>
                  <input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jam Trip</label>
                  <input type="text" value={tripTime} onChange={(e) => setTripTime(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Titik Lokasi Km SUTM</label>
                <input type="text" value={tripLocation} onChange={(e) => setTripLocation(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Uraian Penyebab Gangguan</label>
                <textarea rows={2} value={tripCause} onChange={(e) => setTripCause(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Pelanggan Terdampak</label>
                  <input type="number" value={tripCustomers} onChange={(e) => setTripCustomers(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Estimasi ENS (kWh)</label>
                  <input type="number" value={tripEns} onChange={(e) => setTripEns(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPK */}
          {activeTab === 'spk' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold mb-3">
                Input Perintah Kerja Harian (SPK) Tim Lapangan & Yantek
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nomor SPK</label>
                  <input type="text" value={spkNo} onChange={(e) => setSpkNo(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jenis Pekerjaan</label>
                  <select value={spkType} onChange={(e) => setSpkType(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="ROW Pangkas Pohon">ROW Pangkas Pohon</option>
                    <option value="Inspeksi Tier 1">Inspeksi Tier 1 Visual</option>
                    <option value="Inspeksi Tier 2 Thermo">Inspeksi Tier 2 Thermo</option>
                    <option value="Pemeliharaan SUTM">Pemeliharaan SUTM & Trafo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Penyulang Tujuan</label>
                  <select value={spkFeeder} onChange={(e) => setSpkFeeder(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="TULEHU">TULEHU</option>
                    <option value="LATERI 2">LATERI 2</option>
                    <option value="LATERI 3">LATERI 3</option>
                    <option value="ALLANG">ALLANG</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Prioritas</label>
                  <select value={spkPriority} onChange={(e) => setSpkPriority(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Urgent">Urgent</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Biasa">Biasa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Lokasi Section Jaringan</label>
                <input type="text" value={spkLocation} onChange={(e) => setSpkLocation(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Tim Pelaksana</label>
                  <input type="text" value={spkTeam} onChange={(e) => setSpkTeam(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Target Volume Kerja</label>
                  <input type="text" value={spkTarget} onChange={(e) => setSpkTarget(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
                </div>
              </div>
              <div>
                <label className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Pemberi Perintah (TL Teknik)</label>
                <input type="text" value={spkTlTeknik} onChange={(e) => setSpkTlTeknik(e.target.value)} className="w-full p-2.5 rounded-xl border bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white font-bold" />
              </div>
            </div>
          )}

          {/* TAB 3: PEMELIHARAAN & INSPEKSI */}
          {activeTab === 'pemeliharaan' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold mb-3">
                Input Laporan Temuan Inspeksi SUTM & ROW Pohon
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Penyulang</label>
                  <select value={inspFeeder} onChange={(e) => setInspFeeder(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="LATERI 2">LATERI 2</option>
                    <option value="LATERI 3">LATERI 3</option>
                    <option value="TULEHU">TULEHU</option>
                    <option value="ALLANG">ALLANG</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kategori Temuan</label>
                  <select value={inspCategory} onChange={(e) => setInspCategory(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Berat">Berat (Kritis)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Lokasi Tiang / Gardu</label>
                <input type="text" value={inspLocation} onChange={(e) => setInspLocation(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Uraian Detail Temuan Inspeksi</label>
                <textarea rows={2} value={inspDesc} onChange={(e) => setInspDesc(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Tim Inspektor Lapangan</label>
                <input type="text" value={inspTeam} onChange={(e) => setInspTeam(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
              </div>
            </div>
          )}

          {/* TAB 4: PENGUKURAN GARDU */}
          {activeTab === 'pengukuran' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold mb-3">
                Input Data Pengukuran Beban Gardu Distribusi
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kode Gardu</label>
                  <input type="text" value={garduCode} onChange={(e) => setGarduCode(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Gardu</label>
                  <input type="text" value={garduName} onChange={(e) => setGarduName(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Penyulang</label>
                  <select value={garduFeeder} onChange={(e) => setGarduFeeder(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="LATERI 2">LATERI 2</option>
                    <option value="TULEHU">TULEHU</option>
                    <option value="ALLANG">ALLANG</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kapasitas Trafo (kVA)</label>
                  <input type="number" value={garduKva} onChange={(e) => setGarduKva(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Arus R (A)</label>
                  <input type="number" value={currentR} onChange={(e) => setCurrentR(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Arus S (A)</label>
                  <input type="number" value={currentS} onChange={(e) => setCurrentS(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Arus T (A)</label>
                  <input type="number" value={currentT} onChange={(e) => setCurrentT(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Arus N (A)</label>
                  <input type="number" value={currentN} onChange={(e) => setCurrentN(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MASTER DATA */}
          {activeTab === 'master_data' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold mb-3">
                Input Master Data Penyulang & Feeder 20kV Baru
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kode Feeder</label>
                  <input type="text" value={mFeederCode} onChange={(e) => setMFeederCode(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Penyulang</label>
                  <input type="text" value={mFeederName} onChange={(e) => setMFeederName(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Gardu Induk (GI)</label>
                  <input type="text" value={mFeederGi} onChange={(e) => setMFeederGi(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Panjang (KMS)</label>
                  <input type="number" value={mFeederLength} onChange={(e) => setMFeederLength(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jumlah Pelanggan</label>
                  <input type="number" value={mFeederCust} onChange={(e) => setMFeederCust(Number(e.target.value))} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SAIDI SAIFI */}
          {activeTab === 'saidi_saifi' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold mb-3">
                Update Realisasi Indeks SAIDI / SAIFI Bulanan ULP Baguala
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Pilih Bulan</label>
                  <select value={saidiMonth} onChange={(e) => setSaidiMonth(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Jan">Januari</option>
                    <option value="Feb">Februari</option>
                    <option value="Mar">Maret</option>
                    <option value="Apr">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Jun">Juni</option>
                    <option value="Jul">Juli</option>
                    <option value="Ags">Agustus</option>
                    <option value="Sep">September</option>
                    <option value="Okt">Oktober</option>
                    <option value="Nov">November</option>
                    <option value="Des">Desember</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">SAIDI Real (Jam/Plg)</label>
                  <input type="number" step="0.001" value={saidiVal} onChange={(e) => setSaidiVal(Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">SAIFI Real (Kali/Plg)</label>
                  <input type="number" step="0.01" value={saifiVal} onChange={(e) => setSaifiVal(Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MATERIAL */}
          {activeTab === 'material' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold mb-3">
                Input Entri Material Cadangan / Pemeliharaan 20kV
              </div>
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Material / Komponen</label>
                <input type="text" value={matName} onChange={(e) => setMatName(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kategori</label>
                  <select value={matCat} onChange={(e) => setMatCat(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Isolator">Isolator</option>
                    <option value="Arrester">Arrester</option>
                    <option value="FCO & Fuse">FCO & Fuse</option>
                    <option value="Kabel & Conductor">Kabel & Conductor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jumlah Qty</label>
                  <input type="number" value={matQty} onChange={(e) => setMatQty(Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Satuan</label>
                  <input type="text" value={matUnit} onChange={(e) => setMatUnit(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: APD */}
          {activeTab === 'apd' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold mb-3">
                Input Alat Kerja & APD Keselamatan K3
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Peralatan / APD</label>
                  <input type="text" value={apdName} onChange={(e) => setApdName(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kategori K3</label>
                  <select value={apdCat} onChange={(e) => setApdCat(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="APD K3">APD K3</option>
                    <option value="Alat Kerja Hand Tools">Alat Kerja Hand Tools</option>
                    <option value="Alat Ukur Terkalibrasi">Alat Ukur Terkalibrasi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jumlah Qty</label>
                  <input type="number" value={apdQty} onChange={(e) => setApdQty(Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Kondisi Kelayakan</label>
                  <select value={apdCondition} onChange={(e) => setApdCondition(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Baik">Baik (Siap Pakai)</option>
                    <option value="Perlu Kalibrasi">Perlu Kalibrasi</option>
                    <option value="Rusak">Rusak / Afkir</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: KENDARAAN */}
          {activeTab === 'kendaraan' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold mb-3">
                Input Armada & Kendaraan Operasional Yantek
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nomor Plat Polisi</label>
                  <input type="text" value={vehPlate} onChange={(e) => setVehPlate(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Armada</label>
                  <input type="text" value={vehName} onChange={(e) => setVehName(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jenis Kendaraan</label>
                  <select value={vehType} onChange={(e) => setVehType(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Mobil Yantek">Mobil Yantek Hilux 4x4</option>
                    <option value="Motor Patroli">Motor Patroli Trail</option>
                    <option value="Truck Crane">Truck Crane Teleskopik</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Tim Penanggung Jawab</label>
                  <input type="text" value={vehTeam} onChange={(e) => setVehTeam(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: USER */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-700 dark:text-slate-300 font-semibold mb-3">
                Input User Baru & Pengaturan Hak Akses
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">NIP / ID Petugas</label>
                  <input type="text" value={userNik} onChange={(e) => setUserNik(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Lengkap</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Peran / Role Akses</label>
                  <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="Manager">Manager</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Admin Yantek">Admin Yantek</option>
                    <option value="Petugas Yantek">Petugas Yantek</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Official</label>
                  <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              * Input data terintegrasi ke SCADA & Realtime Dashboard
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Entri Data</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
