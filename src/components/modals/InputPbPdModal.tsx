import React, { useState, useEffect } from 'react';
import { 
  PbPdRegistration, 
  PbPdRequestType, 
  PbPdTariffCategory, 
  PbPdStatus, 
  PbPdNetworkRequirement, 
  MasterFeeder,
  MasterGarduDistribusi
} from '../../types';
import { 
  X, 
  UserPlus, 
  Zap, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Hash, 
  FileText,
  Clock,
  DollarSign,
  ShieldAlert,
  Users,
  Cpu,
  Sparkles
} from 'lucide-react';
import { CustomSelect } from '../CustomSelect';

interface InputPbPdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePbPd: (data: PbPdRegistration) => void;
  isDarkMode: boolean;
  masterFeeders?: MasterFeeder[];
  masterGarduDistribusi?: MasterGarduDistribusi[];
  registrationToEdit?: PbPdRegistration | null;
}

const POWER_OPTIONS = [
  { value: 450, label: '450 VA' },
  { value: 900, label: '900 VA' },
  { value: 1300, label: '1.300 VA' },
  { value: 2200, label: '2.200 VA' },
  { value: 3500, label: '3.500 VA' },
  { value: 4400, label: '4.400 VA' },
  { value: 5500, label: '5.500 VA' },
  { value: 7700, label: '7.700 VA' },
  { value: 11000, label: '11.000 VA (11 kVA)' },
  { value: 13200, label: '13.200 VA (13.2 kVA)' },
  { value: 16500, label: '16.500 VA (16.5 kVA)' },
  { value: 23000, label: '23.000 VA (23 kVA)' },
  { value: 33000, label: '33.000 VA (33 kVA)' },
  { value: 41500, label: '41.500 VA (41.5 kVA)' },
  { value: 53000, label: '53.000 VA (53 kVA)' },
  { value: 66000, label: '66.000 VA (66 kVA)' },
  { value: 105000, label: '105.000 VA (105 kVA)' },
  { value: 147000, label: '147.000 VA (147 kVA)' },
  { value: 197000, label: '197.000 VA (197 kVA)' }
];

export const InputPbPdModal: React.FC<InputPbPdModalProps> = ({
  isOpen,
  onClose,
  onSavePbPd,
  isDarkMode,
  masterFeeders = [],
  masterGarduDistribusi = [],
  registrationToEdit
}) => {
  const [activeStep, setActiveStep] = useState<'info' | 'teknis' | 'eksekusi'>('info');

  // Form Fields
  const [regNumber, setRegNumber] = useState('');
  const [idpel, setIdpel] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [requestType, setRequestType] = useState<PbPdRequestType>('Pasang Baru (PB)');
  const [tariffCategory, setTariffCategory] = useState<PbPdTariffCategory>('R-1 (Rumah Tangga)');
  const [oldPowerVa, setOldPowerVa] = useState<number>(0);
  const [newPowerVa, setNewPowerVa] = useState<number>(1300);
  const [meterType, setMeterType] = useState<'Prabayar (LPB)' | 'Pascabayar (Kwh Meter)'>('Prabayar (LPB)');
  const [feederName, setFeederName] = useState('');
  const [garduName, setGarduName] = useState('');
  const [tiangNumber, setTiangNumber] = useState('');
  const [networkRequirement, setNetworkRequirement] = useState<PbPdNetworkRequirement>('Hanya Sambungan Rumah (SR)');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetSlaDays, setTargetSlaDays] = useState<number>(3);
  const [targetSlaDate, setTargetSlaDate] = useState('');
  const [energizedDate, setEnergizedDate] = useState('');
  const [status, setStatus] = useState<PbPdStatus>('Bayar / Registrasi');
  const [biayaPenyambunganIdr, setBiayaPenyambunganIdr] = useState<number>(1218000);
  const [assignedTeam, setAssignedTeam] = useState('Regu Yantek Passo 1');
  const [meterSerialNumber, setMeterSerialNumber] = useState('');
  const [meterSealNumber, setMeterSealNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Auto calculate SLA date when paymentDate or targetSlaDays changes
  useEffect(() => {
    if (paymentDate) {
      const pDate = new Date(paymentDate);
      if (!isNaN(pDate.getTime())) {
        const tDate = new Date(pDate);
        tDate.setDate(pDate.getDate() + (Number(targetSlaDays) || 3));
        setTargetSlaDate(tDate.toISOString().split('T')[0]);
      }
    }
  }, [paymentDate, targetSlaDays]);

  // Adjust SLA days default when networkRequirement changes
  const handleNetworkRequirementChange = (req: PbPdNetworkRequirement) => {
    setNetworkRequirement(req);
    if (req === 'Tanpa Perluasan (Ganti APP)' || req === 'Hanya Sambungan Rumah (SR)') {
      setTargetSlaDays(3);
    } else if (req === 'Perluasan JTR / Sisip Tiang') {
      setTargetSlaDays(15);
    } else if (req === 'Pasang Trafo Sisipan') {
      setTargetSlaDays(25);
    }
  };

  // Generate unique agenda number
  const handleGenerateAgenda = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    setRegNumber(`5412${yyyy}${mm}${dd}${rand}`);
  };

  // Populate when editing or opening
  useEffect(() => {
    if (registrationToEdit) {
      setRegNumber(registrationToEdit.registrationNumber || '');
      setIdpel(registrationToEdit.idpel || '');
      setCustomerName(registrationToEdit.customerName || '');
      setCustomerPhone(registrationToEdit.customerPhone || '');
      setCustomerAddress(registrationToEdit.customerAddress || '');
      setRequestType(registrationToEdit.requestType);
      setTariffCategory(registrationToEdit.tariffCategory);
      setOldPowerVa(registrationToEdit.oldPowerVa || 0);
      setNewPowerVa(registrationToEdit.newPowerVa || 1300);
      setMeterType(registrationToEdit.meterType || 'Prabayar (LPB)');
      setFeederName(registrationToEdit.feederName || '');
      setGarduName(registrationToEdit.garduName || '');
      setTiangNumber(registrationToEdit.tiangNumber || '');
      setNetworkRequirement(registrationToEdit.networkRequirement || 'Hanya Sambungan Rumah (SR)');
      setRegistrationDate(registrationToEdit.registrationDate || new Date().toISOString().split('T')[0]);
      setPaymentDate(registrationToEdit.paymentDate || registrationToEdit.registrationDate || new Date().toISOString().split('T')[0]);
      setTargetSlaDays(registrationToEdit.targetSlaDays || 3);
      setTargetSlaDate(registrationToEdit.targetSlaDate || '');
      setEnergizedDate(registrationToEdit.energizedDate || '');
      setStatus(registrationToEdit.status);
      setBiayaPenyambunganIdr(registrationToEdit.biayaPenyambunganIdr || 0);
      setAssignedTeam(registrationToEdit.assignedTeam || '');
      setMeterSerialNumber(registrationToEdit.meterSerialNumber || '');
      setMeterSealNumber(registrationToEdit.meterSealNumber || '');
      setNotes(registrationToEdit.notes || '');
    } else {
      // Default reset for new entry
      handleGenerateAgenda();
      setIdpel('BARU');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setRequestType('Pasang Baru (PB)');
      setTariffCategory('R-1 (Rumah Tangga)');
      setOldPowerVa(0);
      setNewPowerVa(1300);
      setMeterType('Prabayar (LPB)');
      setFeederName(masterFeeders[0]?.feederName || 'PASSO');
      setGarduName('');
      setTiangNumber('');
      setNetworkRequirement('Hanya Sambungan Rumah (SR)');
      const now = new Date().toISOString().split('T')[0];
      setRegistrationDate(now);
      setPaymentDate(now);
      setTargetSlaDays(3);
      const target = new Date();
      target.setDate(target.getDate() + 3);
      setTargetSlaDate(target.toISOString().split('T')[0]);
      setEnergizedDate('');
      setStatus('Bayar / Registrasi');
      setBiayaPenyambunganIdr(1218000);
      setAssignedTeam('Regu Yantek Passo 1');
      setMeterSerialNumber('');
      setMeterSealNumber('');
      setNotes('');
      setActiveStep('info');
    }
  }, [registrationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Nama Pelanggan wajib diisi.');
      return;
    }

    const newRecord: PbPdRegistration = {
      id: registrationToEdit?.id || `PBPD-${Date.now()}`,
      registrationNumber: regNumber.trim() || `5412${Date.now()}`,
      idpel: requestType === 'Pasang Baru (PB)' && (!idpel || idpel === 'BARU') ? 'BARU' : idpel.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      requestType,
      tariffCategory,
      oldPowerVa: requestType === 'Pasang Baru (PB)' ? 0 : Number(oldPowerVa) || 0,
      newPowerVa: Number(newPowerVa) || 1300,
      meterType,
      feederName: feederName.trim(),
      garduName: garduName.trim(),
      tiangNumber: tiangNumber.trim(),
      networkRequirement,
      registrationDate,
      paymentDate: paymentDate || registrationDate,
      targetSlaDays: Number(targetSlaDays) || 3,
      targetSlaDate: targetSlaDate || registrationDate,
      energizedDate: status === 'Nyala (Selesai)' ? (energizedDate || new Date().toISOString().split('T')[0]) : undefined,
      status,
      biayaPenyambunganIdr: Number(biayaPenyambunganIdr) || 0,
      assignedTeam: assignedTeam.trim(),
      meterSerialNumber: meterSerialNumber.trim() || undefined,
      meterSealNumber: meterSealNumber.trim() || undefined,
      notes: notes.trim(),
      createdAt: registrationToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSavePbPd(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border ${
        isDarkMode ? 'bg-[#0f172a] border-slate-700/70 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b shrink-0 ${
          isDarkMode ? 'border-slate-800 bg-[#131d35]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2">
                {registrationToEdit ? 'Edit Permohonan PB / PD' : 'Form Input Pasang Baru & Perubahan Daya'}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  PLN ULP Baguala
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Monitoring proses layanan penyambungan dan kepatuhan Tingkat Mutu Pelayanan (TMP/SLA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className={`px-4 sm:px-6 py-2.5 flex items-center gap-2 border-b text-xs font-bold ${
          isDarkMode ? 'border-slate-800 bg-[#0d1527]' : 'border-slate-100 bg-slate-100/70'
        }`}>
          <button
            type="button"
            onClick={() => setActiveStep('info')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeStep === 'info' 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Data Pelanggan & Permohonan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('teknis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeStep === 'teknis' 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2. Teknis Jaringan & Daya</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('eksekusi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeStep === 'eksekusi' 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Status Pelaksanaan & SLA</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          
          {/* STEP 1: Data Pelanggan & Permohonan */}
          {activeStep === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* No. Registrasi / Agenda */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>No. Agenda / Registrasi PLN</span>
                    <button
                      type="button"
                      onClick={handleGenerateAgenda}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Auto Generate
                    </button>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. 5412026081901"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold border transition ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Jenis Permohonan */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Jenis Layanan Permohonan
                  </label>
                  <CustomSelect
                    value={requestType}
                    onChange={(val) => {
                      const t = val as PbPdRequestType;
                      setRequestType(t);
                      if (t === 'Pasang Baru (PB)') {
                        setOldPowerVa(0);
                        if (!idpel || idpel.length < 5) setIdpel('BARU');
                      }
                    }}
                    options={[
                      { value: 'Pasang Baru (PB)', label: '⚡ Pasang Baru (PB)' },
                      { value: 'Perubahan Daya (PD)', label: '📈 Perubahan Daya (PD - Tambah Daya)' },
                      { value: 'Migrasi Tarif / Prabayar', label: '🔄 Migrasi Tarif / Pascabayar ke Prabayar' },
                      { value: 'Penyambungan Sementara (Pesta/Proyek)', label: '🎪 Penyambungan Sementara (Pesta/Proyek)' }
                    ]}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Pelanggan (IDPEL) */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    ID Pelanggan (IDPEL) {requestType === 'Pasang Baru (PB)' ? '(Isi BARU jika belum terbit)' : ''}
                  </label>
                  <input
                    type="text"
                    required
                    value={idpel}
                    onChange={(e) => setIdpel(e.target.value)}
                    placeholder="e.g. 541208920114 atau BARU"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Nama Pelanggan */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Nama Pemohon / Pelanggan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama lengkap sesuai KTP / Instansi"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nomor Telepon / WA */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No. WhatsApp / Telepon Pelanggan</span>
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 081240128990 (untuk kirim update WA)"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Golongan Tarif */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Golongan Tarif & Peruntukan
                  </label>
                  <CustomSelect
                    value={tariffCategory}
                    onChange={(val) => setTariffCategory(val as PbPdTariffCategory)}
                    options={[
                      { value: 'R-1 (Rumah Tangga)', label: '🏠 R-1 (Rumah Tangga Kecil/Menengah)' },
                      { value: 'R-2 / R-3 (Rumah Besar)', label: '🏡 R-2 / R-3 (Rumah Tangga Besar/Mewah)' },
                      { value: 'B-1 / B-2 (Bisnis Komersial)', label: '🏢 B-1 / B-2 (Bisnis / Toko / Ruko)' },
                      { value: 'I-1 / I-2 / I-3 (Industri)', label: '🏭 I-1 / I-2 / I-3 (Industri / Cold Storage / Pabrik)' },
                      { value: 'P-1 / P-2 / P-3 (Pemerintah/PJU)', label: '🏛️ P-1 / P-2 / P-3 (Kantor Pemerintah / PJU)' },
                      { value: 'S-1 / S-2 / S-3 (Sosial/Tempat Ibadah)', label: '⛪ S-1 / S-2 / S-3 (Gereja / Masjid / Puskesmas / Sosial)' }
                    ]}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Alamat Lengkap & Titik Bangunan</span>
                </label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Jl. / RT / RW, Dusun / Kelurahan, Landmark terdekat..."
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border transition ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('teknis')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center gap-2 transition"
                >
                  <span>Lanjut ke Teknis Jaringan & Daya</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Teknis Jaringan & Daya */}
          {activeStep === 'teknis' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-cyan-200">Konfigurasi Sambungan & Perhitungan Daya</span>
                  Pilihlah daya awal dan daya baru yang diajukan. Penambahan daya akan dikorelasikan dengan kapasitas gardu distribusi dan beban penyulang.
                </div>
              </div>

              {/* Daya Lama & Daya Baru */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Daya Awal / Eksisting (VA) {requestType === 'Pasang Baru (PB)' ? '(Otomatis 0 untuk PB)' : ''}
                  </label>
                  {requestType === 'Pasang Baru (PB)' ? (
                    <input
                      type="text"
                      disabled
                      value="0 VA (Pasang Baru)"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border opacity-60 ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    />
                  ) : (
                    <CustomSelect
                      value={String(oldPowerVa)}
                      onChange={(val) => setOldPowerVa(Number(val))}
                      options={POWER_OPTIONS.map(p => ({ value: String(p.value), label: p.label }))}
                      isDarkMode={isDarkMode}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Daya Baru yang Dimohon (VA) <span className="text-red-400">*</span>
                  </label>
                  <CustomSelect
                    value={String(newPowerVa)}
                    onChange={(val) => setNewPowerVa(Number(val))}
                    options={POWER_OPTIONS.map(p => ({ value: String(p.value), label: p.label }))}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Tipe Meter & Kebutuhan Jaringan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Tipe Kwh Meter & Pengukuran
                  </label>
                  <CustomSelect
                    value={meterType}
                    onChange={(val) => setMeterType(val as any)}
                    options={[
                      { value: 'Prabayar (LPB)', label: '🪙 Prabayar (Token Listrik Pintar LPB)' },
                      { value: 'Pascabayar (Kwh Meter)', label: '📟 Pascabayar (Kwh Meter Konvensional / AMR)' }
                    ]}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Kebutuhan Konstruksi Jaringan
                  </label>
                  <CustomSelect
                    value={networkRequirement}
                    onChange={(val) => handleNetworkRequirementChange(val as PbPdNetworkRequirement)}
                    options={[
                      { value: 'Hanya Sambungan Rumah (SR)', label: '🔌 Hanya Sambungan Rumah (SR) - SLA 3 Hari' },
                      { value: 'Tanpa Perluasan (Ganti APP)', label: '⚡ Tanpa Perluasan / Ganti APP - SLA 3 Hari' },
                      { value: 'Perluasan JTR / Sisip Tiang', label: '🏗️ Perluasan JTR / Sisip Tiang - SLA 15 Hari' },
                      { value: 'Pasang Trafo Sisipan', label: '🏢 Pasang Trafo Sisipan / Gardu - SLA 25 Hari' }
                    ]}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Jaringan Asosiasi: Penyulang, Gardu, No Tiang */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Penyulang Pemasok
                  </label>
                  <CustomSelect
                    value={feederName}
                    onChange={(val) => setFeederName(val)}
                    options={masterFeeders.map(f => ({ value: f.feederName, label: `Penyulang ${f.feederName}` }))}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    Gardu Distribusi / Trafo
                  </label>
                  <input
                    type="text"
                    value={garduName}
                    onChange={(e) => setGarduName(e.target.value)}
                    placeholder="e.g. GD.PAS-02 / Trafo 100kVA"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    No. Tiang JTR Sambung
                  </label>
                  <input
                    type="text"
                    value={tiangNumber}
                    onChange={(e) => setTiangNumber(e.target.value)}
                    placeholder="e.g. TR.04/PAS / Tiang Beton"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Biaya Penyambungan */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Biaya Penyambungan (BP + UJL) (Rupiah)</span>
                </label>
                <input
                  type="number"
                  value={biayaPenyambunganIdr}
                  onChange={(e) => setBiayaPenyambunganIdr(Number(e.target.value))}
                  placeholder="e.g. 1218000"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-extrabold border transition ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-white border-slate-300 text-emerald-700'
                  }`}
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('info')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                >
                  ← Kembali ke Data Pelanggan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('eksekusi')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center gap-2 transition"
                >
                  <span>Lanjut ke Status & SLA</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Status Pelaksanaan & SLA */}
          {activeStep === 'eksekusi' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Status Workflow */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  Tahapan / Status Pelaksanaan Saat Ini
                </label>
                <CustomSelect
                  value={status}
                  onChange={(val) => {
                    const s = val as PbPdStatus;
                    setStatus(s);
                    if (s === 'Nyala (Selesai)' && !energizedDate) {
                      setEnergizedDate(new Date().toISOString().split('T')[0]);
                    }
                  }}
                  options={[
                    { value: 'Bayar / Registrasi', label: '💳 1. Bayar / Registrasi (Menunggu Survey)' },
                    { value: 'Survey Teknis', label: '🔍 2. Survey Teknis & Gambar Pengukuran' },
                    { value: 'Terbit PK / SPK', label: '📋 3. Terbit PK / SPK Pelaksanaan' },
                    { value: 'Penarikan JTR & SR', label: '🏗️ 4. Penarikan JTR & Sambungan Rumah (SR)' },
                    { value: 'Pasang Meter & Segel', label: '📟 5. Pasang Kwh Meter & Segel APP' },
                    { value: 'Nyala (Selesai)', label: '✅ 6. Nyala (Selesai & Pelanggan Aktif)' },
                    { value: 'Kendala / Pending', label: '⚠️ 7. Kendala / Pending Lapangan (Izin/Material)' }
                  ]}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Tanggal & SLA Setting */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tanggal Pembayaran</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Hari SLA (TMP)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={targetSlaDays}
                    onChange={(e) => setTargetSlaDays(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span>Batas Maksimum SLA</span>
                  </label>
                  <input
                    type="date"
                    value={targetSlaDate}
                    onChange={(e) => setTargetSlaDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-amber-400' : 'bg-white border-slate-300 text-amber-600'
                    }`}
                  />
                </div>
              </div>

              {/* Tanggal Nyala & Tim Pelaksana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tanggal Nyala / Selesai (Jika Sudah Nyala)</span>
                  </label>
                  <input
                    type="date"
                    value={energizedDate}
                    onChange={(e) => setEnergizedDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-white border-slate-300 text-emerald-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Regu Pelaksana / Mitra</span>
                  </label>
                  <input
                    type="text"
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                    placeholder="e.g. Regu Yantek Passo 1 / Mitra Konstruksi"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* No Seri Meter & Segel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    No. Seri KWH Meter Baru
                  </label>
                  <input
                    type="text"
                    value={meterSerialNumber}
                    onChange={(e) => setMeterSerialNumber(e.target.value)}
                    placeholder="e.g. 32190882190"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    No. Segel APP / Terminal
                  </label>
                  <input
                    type="text"
                    value={meterSealNumber}
                    onChange={(e) => setMeterSealNumber(e.target.value)}
                    placeholder="e.g. SGL-98210"
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold border transition ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Catatan Lapangan */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  Catatan / Keterangan Teknis & Kendala Lapangan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail ukuran kabel, panjang tarikan SR, kendala izin pohon/tetangga, dsb..."
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border transition ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('teknis')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                >
                  ← Kembali ke Teknis Daya
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Data Permohonan PB/PD</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
