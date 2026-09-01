import React, { useState, useMemo } from 'react';
import { 
  PbPdRegistration, 
  PbPdStatus, 
  PbPdRequestType, 
  MasterFeeder,
  MasterGarduDistribusi,
  WhatsAppMessage
} from '../../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  ArrowUpDown, 
  RotateCcw, 
  FileSpreadsheet,
  TrendingUp,
  Layers,
  ChevronRight,
  Send,
  Building,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Activity,
  AlertCircle,
  X
} from 'lucide-react';
import { CustomSelect } from '../CustomSelect';
import { InputPbPdModal } from '../modals/InputPbPdModal';

interface PbPdMonitoringViewProps {
  isDarkMode: boolean;
  registrations: PbPdRegistration[];
  onSavePbPd: (data: PbPdRegistration) => void;
  onDeletePbPd: (id: string) => void;
  masterFeeders?: MasterFeeder[];
  masterGarduDistribusi?: MasterGarduDistribusi[];
  onOpenWhatsAppModal?: (msgData?: any) => void;
}

export const PbPdMonitoringView: React.FC<PbPdMonitoringViewProps> = ({
  isDarkMode,
  registrations,
  onSavePbPd,
  onDeletePbPd,
  masterFeeders = [],
  masterGarduDistribusi = [],
  onOpenWhatsAppModal
}) => {
  // Navigation & View Mode inside PB/PD
  const [activeTab, setActiveTab] = useState<'table' | 'kanban' | 'analytics'>('table');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PbPdRegistration | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PbPdRegistration | null>(null);

  // Quick Nyala Modal
  const [quickNyalaItem, setQuickNyalaItem] = useState<PbPdRegistration | null>(null);
  const [quickEnergizedDate, setQuickEnergizedDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickMeterSerial, setQuickMeterSerial] = useState('');
  const [quickMeterSeal, setQuickMeterSeal] = useState('');

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterFeeder, setFilterFeeder] = useState<string>('ALL');
  const [filterSla, setFilterSla] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [filterYear, setFilterYear] = useState<string>('ALL');

  // Month options (Indonesian)
  const monthOptions = [
    { value: 'ALL', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  // Year options
  const yearOptions = useMemo(() => {
    const years = new Set<string>(['2026', '2025', '2024']);
    registrations.forEach(r => {
      if (r.registrationDate) {
        const y = r.registrationDate.split('-')[0];
        if (y) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [registrations]);

  // Feeder options
  const feederOptions = useMemo(() => {
    const list = masterFeeders.length > 0 
      ? masterFeeders.map(f => f.feederName)
      : Array.from(new Set(registrations.map(r => r.feederName)));
    return [...list].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
  }, [masterFeeders, registrations]);

  // SLA Calculation Helper
  const getSlaStatus = (item: PbPdRegistration) => {
    if (item.status === 'Nyala (Selesai)' && item.energizedDate) {
      const pDate = new Date(item.paymentDate || item.registrationDate);
      const eDate = new Date(item.energizedDate);
      const diffDays = Math.ceil((eDate.getTime() - pDate.getTime()) / (1000 * 3600 * 24));
      const targetDays = item.targetSlaDays || 3;
      const isMet = diffDays <= targetDays;
      return {
        badge: isMet ? 'Selesai Sesuai SLA' : 'Selesai Lewat SLA',
        status: isMet ? 'met' : 'overdue_done',
        days: diffDays,
        label: `${diffDays} Hari (${isMet ? 'Tepat Waktu' : 'Terlambat'})`,
        colorClass: isMet 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      };
    }

    // If still in progress
    const today = new Date();
    const targetDate = item.targetSlaDate ? new Date(item.targetSlaDate) : null;
    if (!targetDate || isNaN(targetDate.getTime())) {
      return {
        badge: 'Dalam Proses',
        status: 'in_progress',
        days: 0,
        label: 'Dalam Proses',
        colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      };
    }

    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) {
      return {
        badge: 'Lewat SLA',
        status: 'overdue',
        days: Math.abs(diffDays),
        label: `Lewat ${Math.abs(diffDays)} Hari!`,
        colorClass: 'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse'
      };
    } else if (diffDays <= 1) {
      return {
        badge: 'Mendekati SLA',
        status: 'warning',
        days: diffDays,
        label: diffDays === 0 ? 'Hari Ini Batas SLA' : 'Sisa 1 Hari',
        colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      };
    } else {
      return {
        badge: 'On Track',
        status: 'on_track',
        days: diffDays,
        label: `Sisa ${diffDays} Hari`,
        colorClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
      };
    }
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return registrations.filter(item => {
      // Search filter
      const q = searchTerm.toLowerCase();
      const matchSearch = 
        !searchTerm ||
        item.registrationNumber.toLowerCase().includes(q) ||
        item.idpel.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerAddress.toLowerCase().includes(q) ||
        item.feederName.toLowerCase().includes(q) ||
        (item.garduName && item.garduName.toLowerCase().includes(q)) ||
        (item.meterSerialNumber && item.meterSerialNumber.toLowerCase().includes(q)) ||
        (item.assignedTeam && item.assignedTeam.toLowerCase().includes(q));

      // Request type filter
      const matchType = filterType === 'ALL' || item.requestType === filterType;

      // Status filter
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      // Feeder filter
      const matchFeeder = filterFeeder === 'ALL' || item.feederName === filterFeeder;

      // SLA filter
      let matchSla = true;
      if (filterSla !== 'ALL') {
        const sla = getSlaStatus(item);
        if (filterSla === 'done') matchSla = item.status === 'Nyala (Selesai)';
        else if (filterSla === 'ontrack') matchSla = sla.status === 'on_track';
        else if (filterSla === 'warning') matchSla = sla.status === 'warning';
        else if (filterSla === 'overdue') matchSla = sla.status === 'overdue';
      }

      // Date filters
      let matchMonth = true;
      let matchYear = true;
      if (item.registrationDate) {
        const [y, m] = item.registrationDate.split('-');
        if (filterMonth !== 'ALL') matchMonth = m === filterMonth;
        if (filterYear !== 'ALL') matchYear = y === filterYear;
      }

      return matchSearch && matchType && matchStatus && matchFeeder && matchSla && matchMonth && matchYear;
    });
  }, [registrations, searchTerm, filterType, filterStatus, filterFeeder, filterSla, filterMonth, filterYear]);

  // Key KPI Metrics
  const totalCount = registrations.length;
  const pbCount = registrations.filter(r => r.requestType === 'Pasang Baru (PB)').length;
  const pdCount = registrations.filter(r => r.requestType === 'Perubahan Daya (PD)').length;
  const completedCount = registrations.filter(r => r.status === 'Nyala (Selesai)').length;
  const inProgressCount = registrations.filter(r => r.status !== 'Nyala (Selesai)' && r.status !== 'Kendala / Pending').length;
  const pendingCount = registrations.filter(r => r.status === 'Kendala / Pending').length;

  const totalDayaVa = registrations.reduce((sum, r) => {
    if (r.requestType === 'Pasang Baru (PB)') return sum + (r.newPowerVa || 0);
    return sum + Math.max(0, (r.newPowerVa || 0) - (r.oldPowerVa || 0));
  }, 0);

  const totalBpIdr = registrations.reduce((sum, r) => sum + (r.biayaPenyambunganIdr || 0), 0);

  const slaCompliancePercent = useMemo(() => {
    if (completedCount === 0) return 100;
    const onTime = registrations.filter(r => {
      if (r.status !== 'Nyala (Selesai)' || !r.energizedDate) return false;
      const p = new Date(r.paymentDate || r.registrationDate).getTime();
      const e = new Date(r.energizedDate).getTime();
      const d = Math.ceil((e - p) / (1000 * 3600 * 24));
      return d <= (r.targetSlaDays || 3);
    }).length;
    return Math.round((onTime / completedCount) * 100);
  }, [registrations, completedCount]);

  // Advance Kanban status helper
  const handleAdvanceStatus = (item: PbPdRegistration) => {
    const statuses: PbPdStatus[] = [
      'Bayar / Registrasi',
      'Survey Teknis',
      'Terbit PK / SPK',
      'Penarikan JTR & SR',
      'Pasang Meter & Segel',
      'Nyala (Selesai)'
    ];
    const currentIndex = statuses.indexOf(item.status);
    if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      if (nextStatus === 'Nyala (Selesai)') {
        // Open quick nyala modal
        setQuickNyalaItem(item);
        setQuickEnergizedDate(new Date().toISOString().split('T')[0]);
        setQuickMeterSerial(item.meterSerialNumber || '');
        setQuickMeterSeal(item.meterSealNumber || '');
      } else {
        const updated: PbPdRegistration = {
          ...item,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
        onSavePbPd(updated);
      }
    }
  };

  // Submit Quick Nyala
  const handleSaveQuickNyala = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNyalaItem) return;

    const updated: PbPdRegistration = {
      ...quickNyalaItem,
      status: 'Nyala (Selesai)',
      energizedDate: quickEnergizedDate,
      meterSerialNumber: quickMeterSerial.trim() || quickNyalaItem.meterSerialNumber,
      meterSealNumber: quickMeterSeal.trim() || quickNyalaItem.meterSealNumber,
      updatedAt: new Date().toISOString()
    };

    onSavePbPd(updated);
    setQuickNyalaItem(null);
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }

    const headers = [
      'No. Agenda',
      'IDPEL',
      'Nama Pelanggan',
      'No Telepon',
      'Alamat',
      'Jenis Layanan',
      'Golongan Tarif',
      'Daya Lama (VA)',
      'Daya Baru (VA)',
      'Tipe Meter',
      'Penyulang',
      'Gardu',
      'Kebutuhan Jaringan',
      'Tgl Bayar',
      'Target SLA',
      'Tgl Nyala',
      'Status',
      'Biaya BP (Rp)',
      'Regu Pelaksana',
      'No Seri Meter',
      'No Segel',
      'Catatan'
    ];

    const rows = filteredData.map(r => [
      `"${r.registrationNumber}"`,
      `"${r.idpel}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.customerPhone || ''}"`,
      `"${r.customerAddress.replace(/"/g, '""')}"`,
      `"${r.requestType}"`,
      `"${r.tariffCategory}"`,
      r.oldPowerVa,
      r.newPowerVa,
      `"${r.meterType}"`,
      `"${r.feederName}"`,
      `"${r.garduName || ''}"`,
      `"${r.networkRequirement}"`,
      `"${r.paymentDate || r.registrationDate}"`,
      `"${r.targetSlaDate}"`,
      `"${r.energizedDate || ''}"`,
      `"${r.status}"`,
      r.biayaPenyambunganIdr,
      `"${r.assignedTeam || ''}"`,
      `"${r.meterSerialNumber || ''}"`,
      `"${r.meterSealNumber || ''}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monitoring_PB_PD_Baguala_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp helper
  const handleSendWhatsAppUpdate = (item: PbPdRegistration) => {
    const text = `⚡ *UPDATE LAYANAN PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
Kepada Yth. *${item.customerName}*
No. Agenda: *${item.registrationNumber}*
Layanan: *${item.requestType} (${item.tariffCategory} - ${item.newPowerVa} VA)*

📌 *Status Pengerjaan Saat Ini*:
✅ *${item.status.toUpperCase()}*

Penyulang: ${item.feederName}
Gardu: ${item.garduName || '-'}
Petugas: ${item.assignedTeam || 'Regu Yantek Baguala'}
${item.energizedDate ? `Tanggal Nyala: ${item.energizedDate}` : `Target Selesai SLA: ${item.targetSlaDate}`}

${item.notes ? `_Keterangan: ${item.notes}_\n` : ''}━━━━━━━━━━━━━━━━━━━━
Terima kasih atas kepercayaan Anda menggunakan layanan PLN.
_PLN Siap Melayani Terbaik_`;

    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal({
        recipientName: item.customerName,
        phoneNumber: item.customerPhone || '081240128990',
        recipientType: 'Pelanggan PB/PD',
        category: 'Pasang Baru / PD',
        messageText: text,
        feederRelated: item.feederName
      });
    } else {
      const cleanPhone = (item.customerPhone || '').replace(/\D/g, '');
      const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className={`p-5 rounded-2xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0e1628] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black tracking-wide text-slate-100 dark:text-white">
                Monitoring Pasang Baru & Perubahan Daya (PB / PD)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                ULP Baguala
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sistem Pengawasan Alur Kerja Sambungan Baru, Tambah Daya, & Kepatuhan SLA Tingkat Mutu Pelayanan (TMP)
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={handleExportCsv}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Input Permohonan PB/PD</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Permohonan */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Total Agenda</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-100 dark:text-white">
            {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span>{pbCount} PB</span> • <span>{pdCount} PD</span>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Sedang Diproses</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400">
            {inProgressCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Survey / Penarikan / Meter
          </div>
        </div>

        {/* Sudah Nyala */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Sudah Nyala</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {completedCount}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1 font-bold">
            {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% Selesai` : '0%'}
          </div>
        </div>

        {/* Kepatuhan SLA */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Kepatuhan SLA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {slaCompliancePercent}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            TMP Standar PLN
          </div>
        </div>

        {/* Total Penambahan Daya */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Total Daya Baru</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {(totalDayaVa / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-xs font-bold text-slate-400">kVA</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            {(totalDayaVa / 1000000).toFixed(3)} MVA Tersambung
          </div>
        </div>

        {/* Total Biaya Penyambungan */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Total BP & UJL</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-cyan-300 truncate">
            Rp {(totalBpIdr / 1000000).toFixed(1)} <span className="text-xs font-bold text-slate-400">Jt</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Pendapatan Layanan
          </div>
        </div>
      </div>

      {/* Tabs & View Switcher */}
      <div className={`p-1.5 rounded-xl border flex items-center gap-1.5 w-fit ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
      }`}>
        <button
          onClick={() => setActiveTab('table')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'table'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tabel Monitoring ({filteredData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'kanban'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Pipeline Workflow Tahapan</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Analisis SLA & Daya</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari No Agenda, IDPEL, Nama, Alamat, Meter..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-bold border transition ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Filter Jenis Permohonan */}
          <div>
            <CustomSelect
              value={filterType}
              onChange={(val) => setFilterType(val)}
              options={[
                { value: 'ALL', label: 'Semua Layanan (PB/PD)' },
                { value: 'Pasang Baru (PB)', label: '⚡ Pasang Baru (PB)' },
                { value: 'Perubahan Daya (PD)', label: '📈 Perubahan Daya (PD)' },
                { value: 'Migrasi Tarif / Prabayar', label: '🔄 Migrasi Tarif' },
                { value: 'Penyambungan Sementara (Pesta/Proyek)', label: '🎪 Sambungan Pesta' }
              ]}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Filter Status */}
          <div>
            <CustomSelect
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: 'ALL', label: 'Semua Status Tahapan' },
                { value: 'Bayar / Registrasi', label: '💳 1. Bayar/Reg' },
                { value: 'Survey Teknis', label: '🔍 2. Survey Teknis' },
                { value: 'Terbit PK / SPK', label: '📋 3. Terbit PK' },
                { value: 'Penarikan JTR & SR', label: '🏗️ 4. Tarik JTR/SR' },
                { value: 'Pasang Meter & Segel', label: '📟 5. Pasang Meter' },
                { value: 'Nyala (Selesai)', label: '✅ 6. Nyala Selesai' },
                { value: 'Kendala / Pending', label: '⚠️ 7. Kendala Lapangan' }
              ]}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Filter Penyulang */}
          <div>
            <CustomSelect
              value={filterFeeder}
              onChange={(val) => setFilterFeeder(val)}
              options={[
                { value: 'ALL', label: 'Semua Penyulang' },
                ...feederOptions.map(f => ({ value: f, label: `Penyulang ${f}` }))
              ]}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Filter SLA */}
          <div>
            <CustomSelect
              value={filterSla}
              onChange={(val) => setFilterSla(val)}
              options={[
                { value: 'ALL', label: 'Semua Status SLA' },
                { value: 'done', label: '✅ Selesai Nyala' },
                { value: 'ontrack', label: '⏱️ On-Track SLA' },
                { value: 'warning', label: '⚠️ Mendekati Batas SLA' },
                { value: 'overdue', label: '🚨 Lewat SLA (Overdue)' }
              ]}
              isDarkMode={isDarkMode}
            />
          </div>

        </div>

        {/* Sub filter: Bulan, Tahun, Reset */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-bold">Periode:</span>
            <div className="w-36">
              <CustomSelect
                value={filterMonth}
                onChange={(val) => setFilterMonth(val)}
                options={monthOptions}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="w-28">
              <CustomSelect
                value={filterYear}
                onChange={(val) => setFilterYear(val)}
                options={[
                  { value: 'ALL', label: 'Semua Thn' },
                  ...yearOptions.map(y => ({ value: y, label: y }))
                ]}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {(searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL' || filterFeeder !== 'ALL' || filterSla !== 'ALL' || filterMonth !== 'ALL' || filterYear !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('ALL');
                setFilterStatus('ALL');
                setFilterFeeder('ALL');
                setFilterSla('ALL');
                setFilterMonth('ALL');
                setFilterYear('ALL');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: TABEL MONITORING */}
      {activeTab === 'table' && (
        <div className={`rounded-2xl border overflow-hidden shadow-lg ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b font-extrabold uppercase tracking-wider text-[11px] ${
                  isDarkMode ? 'bg-[#131d35] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  <th className="py-3 px-3.5">No. Agenda & IDPEL</th>
                  <th className="py-3 px-3.5">Pelanggan & Lokasi</th>
                  <th className="py-3 px-3.5">Layanan & Daya</th>
                  <th className="py-3 px-3.5">Penyulang & Gardu</th>
                  <th className="py-3 px-3.5">Target SLA & Tanggal</th>
                  <th className="py-3 px-3.5">Status Tahapan</th>
                  <th className="py-3 px-3.5">Kwh Meter & Tim</th>
                  <th className="py-3 px-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="font-bold">Tidak ada data permohonan yang sesuai filter.</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterType('ALL');
                            setFilterStatus('ALL');
                            setFilterFeeder('ALL');
                            setFilterSla('ALL');
                          }}
                          className="text-xs text-cyan-400 font-bold hover:underline"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const sla = getSlaStatus(item);
                    const isPB = item.requestType === 'Pasang Baru (PB)';
                    const powerDelta = isPB ? item.newPowerVa : item.newPowerVa - item.oldPowerVa;

                    return (
                      <tr 
                        key={item.id}
                        className={`transition hover:bg-cyan-500/5 ${
                          item.status === 'Nyala (Selesai)' ? 'opacity-95' : ''
                        }`}
                      >
                        {/* No. Agenda & IDPEL */}
                        <td className="py-3 px-3.5 align-top">
                          <div className="font-mono font-black text-cyan-300 text-xs flex items-center gap-1">
                            <span>{item.registrationNumber}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                            <span className="text-slate-500">IDPEL:</span>
                            <span className={item.idpel === 'BARU' ? 'text-amber-400 font-bold' : 'text-slate-300 font-bold'}>
                              {item.idpel}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Reg: {item.registrationDate}
                          </div>
                        </td>

                        {/* Pelanggan & Alamat */}
                        <td className="py-3 px-3.5 align-top max-w-[220px]">
                          <div className="font-extrabold text-slate-100 text-xs">
                            {item.customerName}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5" title={item.customerAddress}>
                            {item.customerAddress}
                          </div>
                          {item.customerPhone && (
                            <button
                              onClick={() => handleSendWhatsAppUpdate(item)}
                              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{item.customerPhone}</span>
                            </button>
                          )}
                        </td>

                        {/* Layanan & Daya */}
                        <td className="py-3 px-3.5 align-top">
                          <div className="font-extrabold text-xs flex items-center gap-1">
                            <span className={isPB ? 'text-cyan-400' : 'text-blue-400'}>
                              {item.requestType}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-slate-300 mt-0.5">
                            {isPB ? (
                              <span>{item.newPowerVa.toLocaleString('id-ID')} VA</span>
                            ) : (
                              <span>
                                {item.oldPowerVa} → <span className="text-emerald-400 font-black">{item.newPowerVa.toLocaleString('id-ID')} VA</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.tariffCategory.split(' ')[0]} • {item.meterType.includes('Prabayar') ? 'LPB Token' : 'Pascabayar'}
                          </div>
                        </td>

                        {/* Penyulang & Gardu */}
                        <td className="py-3 px-3.5 align-top">
                          <div className="font-extrabold text-xs text-slate-200">
                            {item.feederName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.garduName || '-'}
                          </div>
                          {item.tiangNumber && (
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              Tiang: {item.tiangNumber}
                            </div>
                          )}
                        </td>

                        {/* Target SLA & Tanggal */}
                        <td className="py-3 px-3.5 align-top">
                          <div className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border inline-flex items-center gap-1 ${sla.colorClass}`}>
                            <Clock className="w-3 h-3" />
                            <span>{sla.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Tgl Bayar: {item.paymentDate || item.registrationDate}
                          </div>
                          {item.energizedDate ? (
                            <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Nyala: {item.energizedDate}
                            </div>
                          ) : (
                            <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                              Batas: {item.targetSlaDate}
                            </div>
                          )}
                        </td>

                        {/* Status Tahapan */}
                        <td className="py-3 px-3.5 align-top">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-block ${
                            item.status === 'Nyala (Selesai)'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : item.status === 'Kendala / Pending'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {item.status}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                            {item.networkRequirement}
                          </div>
                        </td>

                        {/* Meter & Tim */}
                        <td className="py-3 px-3.5 align-top">
                          <div className="text-[11px] font-bold text-slate-300">
                            {item.assignedTeam || '-'}
                          </div>
                          {item.meterSerialNumber && (
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              No. Meter: <span className="text-white font-bold">{item.meterSerialNumber}</span>
                            </div>
                          )}
                          {item.biayaPenyambunganIdr > 0 && (
                            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                              BP: Rp {item.biayaPenyambunganIdr.toLocaleString('id-ID')}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 align-top text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Quick Nyala Button */}
                            {item.status !== 'Nyala (Selesai)' && (
                              <button
                                onClick={() => {
                                  setQuickNyalaItem(item);
                                  setQuickEnergizedDate(new Date().toISOString().split('T')[0]);
                                  setQuickMeterSerial(item.meterSerialNumber || '');
                                  setQuickMeterSeal(item.meterSealNumber || '');
                                }}
                                title="Tandai Sudah Nyala"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* WhatsApp Button */}
                            <button
                              onClick={() => handleSendWhatsAppUpdate(item)}
                              title="Kirim Update WA ke Pelanggan"
                              className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-900 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              title="Edit Data"
                              className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300 transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              title="Hapus Data"
                              className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-950/60 hover:text-red-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* TAB 2: KANBAN PIPELINE WORKFLOW */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-start">
          {[
            { status: 'Bayar / Registrasi' as PbPdStatus, title: '1. Bayar / Reg', color: 'border-blue-500/50 bg-blue-950/20 text-blue-400' },
            { status: 'Survey Teknis' as PbPdStatus, title: '2. Survey Teknis', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' },
            { status: 'Terbit PK / SPK' as PbPdStatus, title: '3. Terbit PK / SPK', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-400' },
            { status: 'Penarikan JTR & SR' as PbPdStatus, title: '4. Tarik JTR / SR', color: 'border-amber-500/50 bg-amber-950/20 text-amber-400' },
            { status: 'Pasang Meter & Segel' as PbPdStatus, title: '5. Pasang Meter', color: 'border-purple-500/50 bg-purple-950/20 text-purple-400' },
            { status: 'Nyala (Selesai)' as PbPdStatus, title: '6. Sudah Nyala', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' }
          ].map((col) => {
            const colItems = filteredData.filter(r => r.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-2xl border p-3 flex flex-col space-y-3 min-h-[420px] ${
                  isDarkMode ? 'bg-[#0e1628] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between font-extrabold text-xs ${col.color}`}>
                  <span>{col.title}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-900/80 flex items-center justify-center text-[10px]">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto custom-scrollbar pr-0.5">
                  {colItems.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-500 font-bold">
                      Tidak ada permohonan
                    </div>
                  ) : (
                    colItems.map((item) => {
                      const sla = getSlaStatus(item);
                      const isPB = item.requestType === 'Pasang Baru (PB)';

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition shadow-sm space-y-2 relative group ${
                            isDarkMode 
                              ? 'bg-slate-900/90 border-slate-700/70 hover:border-cyan-500' 
                              : 'bg-white border-slate-200 hover:border-cyan-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-mono text-[10px] font-extrabold text-cyan-400">
                              {item.registrationNumber}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${sla.colorClass}`}>
                              {sla.days !== undefined && sla.days > 0 ? `${sla.days}h` : sla.badge}
                            </span>
                          </div>

                          <div>
                            <div className="font-bold text-xs text-slate-100 dark:text-white line-clamp-1">
                              {item.customerName}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {item.customerAddress}
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-[10px] space-y-0.5">
                            <div className="flex items-center justify-between text-slate-300 font-bold">
                              <span>{isPB ? 'Pasang Baru' : 'Tambah Daya'}</span>
                              <span className="text-emerald-400 font-black">{item.newPowerVa} VA</span>
                            </div>
                            <div className="text-slate-400 flex items-center justify-between">
                              <span>Penyulang: {item.feederName}</span>
                              <span>{item.garduName || ''}</span>
                            </div>
                          </div>

                          {/* Quick Action Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>

                            {item.status !== 'Nyala (Selesai)' ? (
                              <button
                                onClick={() => handleAdvanceStatus(item)}
                                className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs transition"
                              >
                                <span>Maju</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Nyala
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ANALISIS SLA & DAYA */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Rekap Permohonan per Penyulang */}
            <div className={`p-5 rounded-2xl border shadow-lg ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Distribusi Permohonan per Penyulang</span>
              </h3>
              <div className="space-y-2.5">
                {feederOptions.map(feeder => {
                  const items = registrations.filter(r => r.feederName === feeder);
                  const count = items.length;
                  const kva = items.reduce((sum, r) => sum + (r.newPowerVa || 0), 0) / 1000;
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;

                  return (
                    <div key={feeder} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>Penyulang {feeder}</span>
                        <span>{count} Agenda ({kva.toFixed(1)} kVA)</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rekap Komposisi Tarif */}
            <div className={`p-5 rounded-2xl border shadow-lg ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>Komposisi Golongan Pelanggan</span>
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'R-1', label: 'Rumah Tangga (R-1/R-2)', color: 'bg-emerald-500' },
                  { key: 'B-1', label: 'Bisnis & Ruko (B-1/B-2)', color: 'bg-cyan-500' },
                  { key: 'I-1', label: 'Industri & Pabrik (I-1/I-2)', color: 'bg-amber-500' },
                  { key: 'S-1', label: 'Sosial & Ibadah (S-1/S-2)', color: 'bg-purple-500' },
                  { key: 'P-1', label: 'Pemerintah & PJU (P-1/P-2)', color: 'bg-blue-500' }
                ].map(item => {
                  const match = registrations.filter(r => r.tariffCategory.includes(item.key));
                  const count = match.length;
                  const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-md ${item.color}`} />
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono font-black text-cyan-300">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SLA Tingkat Mutu Pelayanan (TMP) */}
            <div className={`p-5 rounded-2xl border shadow-lg ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Standar Tingkat Mutu Pelayanan (TMP)</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex justify-between">
                    <span>1. Tanpa Perluasan / Sambungan Rumah (SR)</span>
                    <span className="text-emerald-400 font-mono font-black">Maks. 3 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pemasangan APP Kwh meter dari tiang terdekat yang sudah bertegangan rendah.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex justify-between">
                    <span>2. Dengan Perluasan JTR / Sisip Tiang</span>
                    <span className="text-cyan-400 font-mono font-black">Maks. 15 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Memerlukan penanaman tiang TR dan penarikan twisted cable LVTC.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex justify-between">
                    <span>3. Dengan Pasang Trafo Sisipan</span>
                    <span className="text-amber-400 font-mono font-black">Maks. 25 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pelanggan daya besar yang memerlukan penambahan gardu distribusi baru.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT PB / PD */}
      <InputPbPdModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSavePbPd={onSavePbPd}
        isDarkMode={isDarkMode}
        masterFeeders={masterFeeders}
        masterGarduDistribusi={masterGarduDistribusi}
        registrationToEdit={editingItem}
      />

      {/* QUICK NYALA DIALOG */}
      {quickNyalaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Konfirmasi Sudah Menyala (Nyala)</span>
              </div>
              <button
                onClick={() => setQuickNyalaItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickNyala} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="font-extrabold text-slate-200">{quickNyalaItem.customerName}</div>
                <div className="text-slate-400">No. Agenda: <span className="font-mono text-cyan-300 font-bold">{quickNyalaItem.registrationNumber}</span></div>
                <div className="text-slate-400">Layanan: <span className="font-bold text-white">{quickNyalaItem.requestType} - {quickNyalaItem.newPowerVa} VA</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tanggal Penyalaan (Nyala Fisik) <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={quickEnergizedDate}
                  onChange={(e) => setQuickEnergizedDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-white border-slate-300 text-emerald-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  No. Seri KWH Meter Baru
                </label>
                <input
                  type="text"
                  value={quickMeterSerial}
                  onChange={(e) => setQuickMeterSerial(e.target.value)}
                  placeholder="e.g. 32190882190"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  No. Segel KWH Meter / APP
                </label>
                <input
                  type="text"
                  value={quickMeterSeal}
                  onChange={(e) => setQuickMeterSeal(e.target.value)}
                  placeholder="e.g. SGL-98210"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickNyalaItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Tandai Nyala</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`w-full max-w-sm p-5 rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-sm">Hapus Data Permohonan?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Apakah Anda yakin ingin menghapus data permohonan <span className="font-bold text-white">{itemToDelete.customerName}</span> ({itemToDelete.registrationNumber})?
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeletePbPd(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
