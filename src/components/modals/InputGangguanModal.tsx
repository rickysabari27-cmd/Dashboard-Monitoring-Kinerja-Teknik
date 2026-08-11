import React, { useState, useEffect } from 'react';
import { FeederTrip } from '../../types';
import { 
  X, 
  Zap, 
  Clock, 
  Users, 
  BarChart2, 
  Calculator, 
  CheckCircle2, 
  DollarSign, 
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface InputGangguanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrip: (trip: FeederTrip) => void;
  isDarkMode: boolean;
}

// Master Feeder Customer Mapping ULP Baguala
const FEEDER_CUSTOMER_MAP: Record<string, number> = {
  'LATERI 1': 3820,
  'LATERI 2': 5310,
  'LATERI 3': 3100,
  'TULEHU': 6890,
  'ALLANG': 4120,
  'PASSO': 2950,
  'HALONG': 3400,
  'WAIHERU': 4200,
  'HUTUMURI': 2800,
  'WAYAME': 3600,
  'POKA': 2500,
  'LIANG': 3100,
  'SULI': 2200,
};

export const InputGangguanModal: React.FC<InputGangguanModalProps> = ({
  isOpen,
  onClose,
  onSaveTrip,
  isDarkMode
}) => {
  // 1. Basic Info State
  const [feederName, setFeederName] = useState('LATERI 2');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [tripTime, setTripTime] = useState('10:15');
  const [recoveryTime, setRecoveryTime] = useState('11:45');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [relayType, setRelayType] = useState<'GFR' | 'OCR' | 'GFR / OCR' | 'UVR' | 'OVR'>('GFR / OCR');
  
  // 2. Load & Power State
  const [currentAmpere, setCurrentAmpere] = useState(380); // Ampere (A)
  const [kwPadam, setKwPadam] = useState(11186); // kW
  const [ensKwh, setEnsKwh] = useState(16779); // kWh
  
  // 3. Customer & SAIDI/SAIFI State
  const [totalUlpCustomers, setTotalUlpCustomers] = useState(45200); // Total Plg ULP Baguala
  const [feederCustomers, setFeederCustomers] = useState(5310);
  const [affectedCustomers, setAffectedCustomers] = useState(5310);
  
  // 4. Incident Detail State
  const [locationKm, setLocationKm] = useState('Km 6.2 - Passo Dalam');
  const [cause, setCause] = useState('Dahan pohon sagu menyentuh SUTM Phasa S saat angin kencang');
  const [category, setCategory] = useState<'Tree/ROW' | 'Equipment Failure' | 'Lightning' | 'Animal' | 'Human Error' | 'Unknown'>('Tree/ROW');

  // Tariff PLN per kWh
  const TARIFF_PER_KWH = 1444.70;

  // Auto calculate Duration whenever tripTime or recoveryTime changes
  useEffect(() => {
    if (!tripTime || !recoveryTime) return;
    try {
      const [h1, m1] = tripTime.split(':').map(Number);
      const [h2, m2] = recoveryTime.split(':').map(Number);

      if (!isNaN(h1) && !isNaN(m1) && !isNaN(h2) && !isNaN(m2)) {
        let mins1 = h1 * 60 + m1;
        let mins2 = h2 * 60 + m2;
        if (mins2 < mins1) {
          mins2 += 24 * 60; // Overnight duration
        }
        const diffMins = mins2 - mins1;
        if (diffMins >= 0) {
          setDurationMinutes(diffMins);
        }
      }
    } catch (e) {
      // ignore parsing error
    }
  }, [tripTime, recoveryTime]);

  // Auto populate customer counts when feeder changes
  useEffect(() => {
    const cust = FEEDER_CUSTOMER_MAP[feederName] || 3500;
    setFeederCustomers(cust);
    setAffectedCustomers(cust); // default to full feeder trip
  }, [feederName]);

  // Recalculate kW Padam and ENS whenever currentAmpere or durationMinutes changes
  useEffect(() => {
    // Formula PLN 20kV: kW = sqrt(3) * V_kV (20) * I (A) * cosPhi (0.85)
    // = 1.73205 * 20 * I * 0.85 = 29.437 * I
    const kw = Math.round(1.73205 * 20 * currentAmpere * 0.85);
    setKwPadam(kw);

    const durationHours = durationMinutes / 60;
    const ens = Math.round(kw * durationHours);
    setEnsKwh(ens);
  }, [currentAmpere, durationMinutes]);

  if (!isOpen) return null;

  // Realtime calculated metrics
  const durationHours = durationMinutes / 60;
  
  // SAIDI Contribution (Jam/Plg) = (Durasi Jam * Pelanggan Terdampak) / Total Pelanggan ULP
  const saidiHoursCalc = totalUlpCustomers > 0 
    ? (durationHours * affectedCustomers) / totalUlpCustomers 
    : 0;
  const saidiMinutesCalc = saidiHoursCalc * 60;

  // SAIFI Contribution (Kali/Plg) = Pelanggan Terdampak / Total Pelanggan ULP
  const saifiCalc = totalUlpCustomers > 0 
    ? affectedCustomers / totalUlpCustomers 
    : 0;

  // Financial Loss (Rp) = ENS * Tariff
  const financialLossCalc = Math.round(ensKwh * TARIFF_PER_KWH);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrip: FeederTrip = {
      id: `TRIP-2026-00${Math.floor(Math.random() * 900 + 100)}`,
      feederName,
      substation: 'GI Passo (20kV)',
      tripDate,
      tripTime,
      recoveryTime,
      durationMinutes,
      relayType,
      currentAmpere,
      kwPadam,
      locationKm,
      cause,
      category,
      affectedCustomers,
      totalUlpCustomers,
      saidiHours: Number(saidiHoursCalc.toFixed(4)),
      saidiMinutes: Number(saidiMinutesCalc.toFixed(2)),
      saifiCount: Number(saifiCalc.toFixed(4)),
      ensKwh,
      financialLossIdr: financialLossCalc,
      status: 'Resolved'
    };

    onSaveTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-500/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                Input Gangguan & Terintegrasi SAIDI / SAIFI
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  Standar PLN
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Laporan trip feeder 20kV dengan otomatisasi kalkulasi jam padam, ENS, & indeks SAIDI SAIFI
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs custom-scrollbar">
          
          {/* SECTION 1: FEEDER & WAKTU PADAM */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>1. Feeder & Jam Padam (Waktu Masuk)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Penyulang / Feeder
                </label>
                <select 
                  value={feederName}
                  onChange={(e) => setFeederName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-extrabold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {Object.keys(FEEDER_CUSTOMER_MAP).map(f => (
                    <option key={f} value={f}>{f} ({FEEDER_CUSTOMER_MAP[f].toLocaleString()} plg)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Relay Dominan Trip
                </label>
                <select 
                  value={relayType}
                  onChange={(e) => setRelayType(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="GFR / OCR">GFR / OCR (Tanah & Arus Lebih)</option>
                  <option value="GFR">GFR (Ground Fault Relay)</option>
                  <option value="OCR">OCR (Over Current Relay)</option>
                  <option value="UVR">UVR (Under Voltage Relay)</option>
                  <option value="OVR">OVR (Over Voltage Relay)</option>
                </select>
              </div>
            </div>

            {/* Time Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Tanggal Trip
                </label>
                <input 
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Jam Trip (Padam)
                </label>
                <input 
                  type="time"
                  value={tripTime}
                  onChange={(e) => setTripTime(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold text-rose-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Jam Masuk (Penormalan)
                </label>
                <input 
                  type="time"
                  value={recoveryTime}
                  onChange={(e) => setRecoveryTime(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold text-emerald-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Durasi Padam
                </label>
                <div className={`p-2 rounded-xl border text-center font-black text-xs flex flex-col justify-center ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <span>{durationMinutes} Menit</span>
                  <span className="text-[10px] font-normal opacity-80">({durationHours.toFixed(2)} Jam)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: INPUT ARUS (AMPERE) & DERAJAT PADAM (KW & ENS) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>2. Beban Arus Penyulang & Perhitungan kW / ENS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Beban Arus Penyulang (Ampere / A)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={currentAmpere}
                    onChange={(e) => setCurrentAmpere(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border font-black text-sm pr-8 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-amber-600'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    A
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Estimasi Daya Padam (kW)
                </label>
                <div className={`p-2.5 rounded-xl border font-black text-sm text-center ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {kwPadam.toLocaleString()} kW
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Energi Tidak Tersalurkan (ENS)
                </label>
                <div className={`p-2.5 rounded-xl border font-black text-sm text-center ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {ensKwh.toLocaleString()} kWh
                </div>
              </div>
            </div>

            <div className="text-[11px] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium flex items-center justify-between">
              <span>Rumus kW: √3 × 20kV × {currentAmpere}A × cosφ 0.85 = <strong>{kwPadam.toLocaleString()} kW</strong></span>
              <span>Estimasi Kerugian: <strong className="text-rose-600 dark:text-rose-400">{formatRupiah(financialLossCalc)}</strong></span>
            </div>
          </div>

          {/* SECTION 3: TERHUBUNG LANGSUNG SAIDI & SAIFI STANDAR PLN */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <BarChart2 className="w-4 h-4" />
                <span>3. Kalkulasi Kontribusi Indeks SAIDI & SAIFI PLN</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                Otomatis Termutakhirkan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Total Pelanggan Sistem ULP Baguala
                </label>
                <input 
                  type="number"
                  value={totalUlpCustomers}
                  onChange={(e) => setTotalUlpCustomers(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Pelanggan Terdampak Padam
                </label>
                <input 
                  type="number"
                  value={affectedCustomers}
                  onChange={(e) => setAffectedCustomers(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Live SAIDI / SAIFI Result Cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* SAIDI Box */}
              <div className="p-3 rounded-xl bg-slate-900 text-white border border-indigo-500/30 flex flex-col justify-between">
                <div className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">
                  Kontribusi SAIDI Gangguan Ini
                </div>
                <div className="my-1">
                  <div className="text-lg font-black text-cyan-400 leading-tight">
                    {saidiHoursCalc.toFixed(4)} <span className="text-xs font-semibold text-slate-300">Jam / Plg</span>
                  </div>
                  <div className="text-xs font-extrabold text-blue-300">
                    ({saidiMinutesCalc.toFixed(2)} Menit / Plg)
                  </div>
                </div>
                <div className="text-[9px] text-slate-400">
                  Rumus: ({durationHours.toFixed(2)} Jam × {affectedCustomers.toLocaleString()} Plg) / {totalUlpCustomers.toLocaleString()} Plg ULP
                </div>
              </div>

              {/* SAIFI Box */}
              <div className="p-3 rounded-xl bg-slate-900 text-white border border-indigo-500/30 flex flex-col justify-between">
                <div className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">
                  Kontribusi SAIFI Gangguan Ini
                </div>
                <div className="my-1">
                  <div className="text-lg font-black text-indigo-400 leading-tight">
                    {saifiCalc.toFixed(4)} <span className="text-xs font-semibold text-slate-300">Kali / Plg</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400">
                  Rumus: {affectedCustomers.toLocaleString()} Plg Terdampak / {totalUlpCustomers.toLocaleString()} Plg Total ULP
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PENYEBAB & LOKASI GANGGUAN */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>4. Lokasi & Penyebab Gangguan SUTM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Kategori Gangguan
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Tree/ROW">Pohon / Pohon Sagu (ROW)</option>
                  <option value="Equipment Failure">Kerusakan Material / Komponen</option>
                  <option value="Lightning">Sambaran Petir</option>
                  <option value="Animal">Hewan / Burung / Tali Layangan</option>
                  <option value="Human Error">Faktor Manusia / Kendaraan</option>
                  <option value="Unknown">Penyebab Belum Pasti</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Titik Lokasi Km SUTM
                </label>
                <input 
                  type="text"
                  value={locationKm}
                  onChange={(e) => setLocationKm(e.target.value)}
                  placeholder="Misal: Km 6.2 Passo Dalam"
                  className={`w-full p-2.5 rounded-xl border font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Uraian Kronologi / Penyebab Utama Gangguan
              </label>
              <textarea 
                rows={2}
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="Tuliskan kronologi singkat kejadian..."
                className={`w-full p-2.5 rounded-xl border font-medium ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Data gangguan akan langsung terakumulasi pada Rekap SAIDI/SAIFI ULP.
            </div>
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
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Gangguan & Update SAIDI/SAIFI</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
