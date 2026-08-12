import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { SpkTask } from '../../types';
import { 
  Printer, 
  Plus, 
  Trash2, 
  FileText, 
  Save, 
  CheckCircle2, 
  FileCheck, 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Clock,
  UserCheck,
  Building,
  CheckSquare,
  Edit3,
  Award,
  Download,
  Loader2,
  X
} from 'lucide-react';

interface SpkFormViewProps {
  isDarkMode: boolean;
  spkList?: SpkTask[];
  onSaveSpk?: (spk: SpkTask) => void;
}

export interface SpkFormData {
  id: string;
  tanggal: string;
  nomorSpk: string;
  kategoriHeader: 'PEMELIHARAAN JARINGAN DISTRIBUSI' | 'INSPEKSI JARINGAN DISTRIBUSI' | string;
  personnel: string[];
  checklist: {
    jtm: boolean;
    jtr: boolean;
    garduHubung: boolean;
    garduTrafo: boolean;
    tiangTm: boolean;
    tiangTr: boolean;
    row: boolean;
    inspeksi: boolean;
    survey: boolean;
    customText: string;
    customChecked: boolean;
  };
  jenisPekerjaan: string;
  penyulang: string;
  section?: string;
  lokasi: string;
  target: string;
  
  // Pemberi Perintah & Manager
  tlTeknikName: string;
  tlTeknikTitle: string;
  isApprovedTlTeknik?: boolean;
  approvedTlTeknikAt?: string;

  managerName: string;
  managerTitle: string;
  isApprovedManager?: boolean;
  approvedManagerAt?: string;
  
  // Status Pekerjaan
  catatanStatus?: string;
  statusPekerjaan: 'Dalam Progres (On Progress)' | 'Selesai' | 'Selesai (Dengan Catatan)' | 'Pending' | string;
}

// Preset 1 (Row Perambasan Pohon - Page 1 in user's PDF)
const PRESET_ROW_PAGE_1: SpkFormData = {
  id: 'spk-017-row',
  tanggal: '12-08-2026',
  nomorSpk: 'NO. 017/PK.TEK/ROW/ULP.BGL/VIII/2026',
  kategoriHeader: 'PEMELIHARAAN JARINGAN DISTRIBUSI',
  personnel: [
    'Syahrul Kolly',
    'Barqil Fuad Lessy',
    'Rivaldo Agustien',
    'Melky Jackson P',
    'Deylan S',
    'Agus Subakti',
    'Wilson Lesnussa'
  ],
  checklist: {
    jtm: false,
    jtr: false,
    garduHubung: false,
    garduTrafo: false,
    tiangTm: false,
    tiangTr: false,
    row: true,
    inspeksi: false,
    survey: false,
    customText: '',
    customChecked: false
  },
  jenisPekerjaan: 'Perambasan Pohon',
  penyulang: 'Wayame 1&2',
  section: 'Wayame',
  lokasi: 'Tim 1 (JMP – Rumahtiga) Dan Tim 2 (GH Poka – GH Wayame)\n(Lanjut dari titik terakhir Perambasan Hari Kemarin)',
  target: 'Wayame 1 (37 Temuan) Dan Wayame 2 (13 Temuan)',
  tlTeknikName: 'Syahrul Kolly',
  tlTeknikTitle: 'TL TEKNIK ULP BAGUALA',
  isApprovedTlTeknik: false,
  managerName: 'Niken Oka Witdoretno',
  managerTitle: 'Manager ULP Baguala',
  isApprovedManager: false,
  statusPekerjaan: 'Dalam Proses'
};

// Preset 2 (Inspeksi Tier 1 - Page 2 in user's PDF)
const PRESET_INSPEKSI_PAGE_2: SpkFormData = {
  id: 'spk-017-ins',
  tanggal: '12-08-2026',
  nomorSpk: 'NO. 017/PK.TEK/INS/ULP.BGL/VIII/2026',
  kategoriHeader: 'INSPEKSI JARINGAN DISTRIBUSI',
  personnel: [
    'Rolly J Pattinama',
    'Henly W Sitanala',
    'Muzar Abdul Hatala',
    'Andre Heriyanto Gabriel'
  ],
  checklist: {
    jtm: false,
    jtr: false,
    garduHubung: false,
    garduTrafo: false,
    tiangTm: false,
    tiangTr: false,
    row: false,
    inspeksi: true,
    survey: false,
    customText: '',
    customChecked: false
  },
  jenisPekerjaan: 'Inspeksi Tier 1 Dan Gardu Distribusi',
  penyulang: 'ACC, Rijali & Tantui Atas',
  section: 'Wilayah Kerja',
  lokasi: 'Tersebar Wilayah Kerja',
  target: '67 Tiang Dan 4 Gardu Distribusi',
  tlTeknikName: 'Syahrul Kolly',
  tlTeknikTitle: 'TL TEKNIK ULP BAGUALA',
  isApprovedTlTeknik: false,
  managerName: 'Niken Oka Witdoretno',
  managerTitle: 'Manager ULP Baguala',
  isApprovedManager: false,
  statusPekerjaan: 'Dalam Proses'
};

// Preset 3 (Pemeliharaan Gardu Passo)
const PRESET_PASSO_GARDU: SpkFormData = {
  id: 'spk-018-pas',
  tanggal: '11-08-2026',
  nomorSpk: 'NO. 018/PK.TEK/HAR/ULP.BGL/VIII/2026',
  kategoriHeader: 'PEMELIHARAAN JARINGAN DISTRIBUSI',
  personnel: [
    'Rivaldo Agustien',
    'Melky Jackson P',
    'Deylan S'
  ],
  checklist: {
    jtm: false,
    jtr: false,
    garduHubung: false,
    garduTrafo: true,
    tiangTm: false,
    tiangTr: false,
    row: false,
    inspeksi: false,
    survey: false,
    customText: '',
    customChecked: false
  },
  jenisPekerjaan: 'Pemeliharaan & Pengukuran Gardu Distribusi',
  penyulang: 'Passo',
  lokasi: 'Gardu Portal PAS-04 & PAS-09 Area Passo Transit',
  target: '2 Buah Gardu Distribusi',
  tlTeknikName: 'Syahrul Kolly',
  tlTeknikTitle: 'TL TEKNIK ULP BAGUALA',
  managerName: 'Niken Oka Witdoretno',
  managerTitle: 'Manager ULP Baguala',
  statusPekerjaan: 'Selesai'
};

// Preset 4 (Inspeksi Thermal Lateri 2)
const PRESET_LATERI_THERMO: SpkFormData = {
  id: 'spk-019-lat',
  tanggal: '10-08-2026',
  nomorSpk: 'NO. 019/PK.TEK/INS/ULP.BGL/VIII/2026',
  kategoriHeader: 'INSPEKSI JARINGAN DISTRIBUSI',
  personnel: [
    'Barqil Fuad Lessy',
    'Agus Subakti'
  ],
  checklist: {
    jtm: true,
    jtr: false,
    garduHubung: false,
    garduTrafo: false,
    tiangTm: true,
    tiangTr: false,
    row: false,
    inspeksi: true,
    survey: false,
    customText: '',
    customChecked: false
  },
  jenisPekerjaan: 'Inspeksi Thermal Hotspot SUTM',
  penyulang: 'LATERI 2',
  lokasi: 'Jalur Utama LATERI 2 (Tiang #10 s/d Tiang #88)',
  target: '52 Titik Sambungan FCO & Jumper',
  tlTeknikName: 'Syahrul Kolly',
  tlTeknikTitle: 'TL TEKNIK ULP BAGUALA',
  managerName: 'Niken Oka Witdoretno',
  managerTitle: 'Manager ULP Baguala',
  statusPekerjaan: 'Selesai dengan catatan'
};

// Helpers for HTML5 date input format (YYYY-MM-DD) <-> SPK Display format (DD-MM-YYYY)
const toIsoDateString = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const parts = clean.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return new Date().toISOString().split('T')[0];
};

const toDisplayDateString = (isoDateStr: string): string => {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
  }
  return isoDateStr;
};

export const SpkFormView: React.FC<SpkFormViewProps> = ({
  isDarkMode,
  spkList = [],
  onSaveSpk
}) => {
  // Mode State: 'monitoring' by default per user request
  const [currentMode, setCurrentMode] = useState<'monitoring' | 'editor'>('monitoring');

  // List of SPK Records (Initialized clean per user request to recreate SPKs)
  const [allSpks, setAllSpks] = useState<SpkFormData[]>(() => {
    try {
      const saved = localStorage.getItem('spk_list_records_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat SPK dari localStorage:', err);
    }
    // Clean default list per user request ("hapus spk yang sudah ada karena akan dibuat ulang")
    return [];
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('spk_list_records_v3', JSON.stringify(allSpks));
    } catch (err) {
      console.warn('Gagal menyimpan SPK ke localStorage:', err);
    }
  }, [allSpks]);

  // Currently Selected / Active SPK Form for Editing or Printing
  const [formData, setFormData] = useState<SpkFormData>(PRESET_ROW_PAGE_1);
  const [newPersonnelName, setNewPersonnelName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Print Modal & PDF Export states
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Target Unit State: 'volume' vs 'kms'
  const [targetType, setTargetType] = useState<'volume' | 'kms'>('volume');
  const [targetValue, setTargetValue] = useState<string>('20 Titik Pohon');

  // Sync targetType & targetValue when active SPK changes
  useEffect(() => {
    if (formData.target) {
      const lower = formData.target.toLowerCase();
      if (lower.includes('kms')) {
        setTargetType('kms');
        const numOnly = formData.target.replace(/kms/gi, '').trim();
        setTargetValue(numOnly);
      } else {
        setTargetType('volume');
        const numOnly = formData.target
          .replace(/titik\s*pohon/gi, '')
          .replace(/titik/gi, '')
          .replace(/pohon/gi, '')
          .replace(/volume/gi, '')
          .trim();
        setTargetValue(numOnly || formData.target);
      }
    } else {
      setTargetValue('');
    }
  }, [formData.id]);

  const updateTarget = (val: string, type: 'volume' | 'kms') => {
    setTargetValue(val);
    setTargetType(type);

    if (!val.trim()) {
      setFormData(prev => ({ ...prev, target: '' }));
      return;
    }

    if (type === 'kms') {
      const cleanNum = val.replace(/kms/gi, '').trim();
      setFormData(prev => ({ ...prev, target: `${cleanNum} kms` }));
    } else {
      const cleanVal = val.trim();
      if (cleanVal.toLowerCase().includes('titik pohon')) {
        setFormData(prev => ({ ...prev, target: cleanVal }));
      } else {
        setFormData(prev => ({ ...prev, target: `${cleanVal} Titik Pohon` }));
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Search & Filter state for Monitoring view
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const printRef = useRef<HTMLDivElement>(null);

  // Open SPK Form for Editing / Viewing Print
  const handleOpenSpkEditor = (spk: SpkFormData) => {
    setFormData(spk);
    setCurrentMode('editor');
  };

  // Create New Blank SPK
  const handleCreateNewSpk = () => {
    const newSpk: SpkFormData = {
      id: `spk-${Date.now()}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      nomorSpk: `NO. 0${Math.floor(Math.random() * 80 + 20)}/PK.TEK/ROW/ULP.BGL/VIII/2026`,
      kategoriHeader: 'PEMELIHARAAN JARINGAN DISTRIBUSI',
      personnel: ['Syahrul Kolly', 'Barqil Fuad Lessy'],
      checklist: {
        jtm: false,
        jtr: false,
        garduHubung: false,
        garduTrafo: false,
        tiangTm: false,
        tiangTr: false,
        row: true,
        inspeksi: false,
        survey: false,
        customText: '',
        customChecked: false
      },
      jenisPekerjaan: 'Perambasan Pohon ROW',
      penyulang: 'Wayame 1',
      lokasi: 'Wilayah Kerja ULP Baguala',
      target: '20 Titik Pohon',
      tlTeknikName: 'Syahrul Kolly',
      tlTeknikTitle: 'TL TEKNIK ULP BAGUALA',
      managerName: 'Niken Oka Witdoretno',
      managerTitle: 'Manager ULP Baguala',
      statusPekerjaan: 'Dalam Proses'
    };

    setFormData(newSpk);
    setCurrentMode('editor');
  };

  // Delete Single SPK
  const handleDeleteSpk = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAllSpks(prev => prev.filter(item => item.id !== id));
    showToast('Dokumen SPK berhasil dihapus!');
    if (formData.id === id) {
      setCurrentMode('monitoring');
    }
  };

  // Delete All SPKs
  const handleClearAllSpks = () => {
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH dokumen SPK untuk dibuat ulang?')) {
      setAllSpks([]);
      localStorage.removeItem('spk_list_records_v3');
      showToast('Semua dokumen SPK berhasil dibersihkan.');
    }
  };

  // Add personnel
  const handleAddPersonnel = () => {
    if (!newPersonnelName.trim()) return;
    setFormData(prev => ({
      ...prev,
      personnel: [...prev.personnel, newPersonnelName.trim()]
    }));
    setNewPersonnelName('');
  };

  // Remove personnel
  const handleRemovePersonnel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personnel: prev.personnel.filter((_, i) => i !== index)
    }));
  };

  // Toggle checklist
  const handleToggleChecklist = (key: keyof SpkFormData['checklist']) => {
    if (key === 'customText') return;
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key]
      }
    }));
  };

  // Approval Handlers for Pejabat Penandatangan
  const handleApproveAll = () => {
    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const isCurrentlyAllApproved = Boolean(formData.isApprovedTlTeknik) && Boolean(formData.isApprovedManager);

    if (isCurrentlyAllApproved) {
      setFormData(prev => ({
        ...prev,
        isApprovedTlTeknik: false,
        approvedTlTeknikAt: undefined,
        isApprovedManager: false,
        approvedManagerAt: undefined,
      }));
      showToast('Status Approval dibatalkan (Menunggu Approve)');
    } else {
      setFormData(prev => ({
        ...prev,
        isApprovedTlTeknik: true,
        approvedTlTeknikAt: nowStr,
        isApprovedManager: true,
        approvedManagerAt: nowStr,
      }));
      showToast('SPK Berhasil Di-approve oleh TL Teknik & Manager ULP!');
    }
  };

  const handleToggleApproveTlTeknik = () => {
    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    setFormData(prev => {
      const nextApproved = !Boolean(prev.isApprovedTlTeknik);
      if (nextApproved) showToast('Persetujuan TL TEKNIK berhasil dicatat!');
      return {
        ...prev,
        isApprovedTlTeknik: nextApproved,
        approvedTlTeknikAt: nextApproved ? nowStr : undefined
      };
    });
  };

  const handleToggleApproveManager = () => {
    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    setFormData(prev => {
      const nextApproved = !Boolean(prev.isApprovedManager);
      if (nextApproved) showToast('Persetujuan MANAGER ULP berhasil dicatat!');
      return {
        ...prev,
        isApprovedManager: nextApproved,
        approvedManagerAt: nextApproved ? nowStr : undefined
      };
    });
  };

  // Handle Print / Save PDF Modal
  const handlePrint = () => {
    setShowPrintModal(true);
  };

  // Download PDF file directly using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExportingPdf(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      
      const cleanNum = (formData.nomorSpk || 'SPK_Document')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_');
        
      pdf.save(`SPK_${cleanNum}.pdf`);
      showToast('File PDF SPK berhasil diunduh!');
      setShowPrintModal(false);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('Membuka dialog pencetakan sistem...');
      setShowPrintModal(false);
      setTimeout(() => {
        window.print();
      }, 200);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Save SPK to list and optional callback
  const handleSaveToSystem = () => {
    setAllSpks(prev => {
      const existsIndex = prev.findIndex(item => item.id === formData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = formData;
        return updated;
      } else {
        return [formData, ...prev];
      }
    });

    if (onSaveSpk) {
      const spkRecord: SpkTask = {
        id: formData.id || `SPK-${Math.floor(Math.random() * 900 + 100)}`,
        spkNumber: formData.nomorSpk,
        date: formData.tanggal,
        taskType: formData.jenisPekerjaan as any,
        feederName: formData.penyulang,
        locationSection: formData.lokasi,
        teamName: formData.personnel.join(', '),
        targetQty: formData.target,
        status: 'Dalam Proses',
        priority: 'Tinggi',
        description: `${formData.kategoriHeader} - TL Teknik: ${formData.tlTeknikName}`
      };
      onSaveSpk(spkRecord);
    }

    showToast('Surat Perintah Kerja (SPK) berhasil disimpan & tersimpan otomatis di web!');
  };

  // Filtered SPK List for Monitoring Dashboard
  const filteredSpks = allSpks.filter(spk => {
    const matchesSearch = 
      spk.nomorSpk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spk.penyulang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spk.jenisPekerjaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spk.personnel.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      spk.lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || spk.statusPekerjaan === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-blue-500 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW MODE 1: MONITORING SURAT PERINTAH KERJA (SPK) */}
      {currentMode === 'monitoring' && (
        <div className="space-y-6">
          
          {/* Header Banner Monitoring SPK */}
          <div className={`p-5 sm:p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  Monitoring Surat Perintah Kerja (SPK)
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    ULP Baguala
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monitoring status penerbitan SPK, pemberi perintah TL Teknik, serta pelaksanaan pekerjaan jaringan distribusi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {allSpks.length > 0 && (
                <button
                  onClick={handleClearAllSpks}
                  className="px-3.5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-rose-200 dark:border-slate-700"
                  title="Hapus Semua SPK untuk Buat Ulang"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Semua SPK</span>
                </button>
              )}

              <button
                onClick={handleCreateNewSpk}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat SPK Baru</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total Dokumen SPK</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{allSpks.length}</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Berkas</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">SPK Dalam Proses</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {allSpks.filter(s => s.statusPekerjaan === 'Dalam Proses').length}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">SPK</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">SPK Selesai</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {allSpks.filter(s => s.statusPekerjaan === 'Selesai' || s.statusPekerjaan === 'Selesai dengan catatan').length}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">SPK</span>
                </div>
              </div>
            </div>

          </div>

          {/* Search & Filter Toolbar */}
          <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NO. SPK, Penyulang, Jenis Pekerjaan, atau Nama Personel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="ALL">Semua Status SPK</option>
                <option value="Dalam Progres (On Progress)">Dalam Progres (On Progress)</option>
                <option value="Selesai">Selesai</option>
                <option value="Selesai (Dengan Catatan)">Selesai (Dengan Catatan)</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Table of SPK Records */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'
                  }`}>
                    <th className="py-3.5 px-4">NO. SPK</th>
                    <th className="py-3.5 px-4">Kategori & Jenis Pekerjaan</th>
                    <th className="py-3.5 px-4">Penyulang & Lokasi</th>
                    <th className="py-3.5 px-4">Personel Pelaksana</th>
                    <th className="py-3.5 px-4">Pemberi Perintah</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi / Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredSpks.map((spk) => (
                    <tr 
                      key={spk.id}
                      onClick={() => handleOpenSpkEditor(spk)}
                      className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="font-extrabold text-blue-600 dark:text-blue-400">{spk.nomorSpk}</div>
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📅 {spk.tanggal}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{spk.jenisPekerjaan}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{spk.kategoriHeader}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">⚡ {spk.penyulang}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{spk.lokasi}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {spk.personnel.slice(0, 2).join(', ')}
                          {spk.personnel.length > 2 && <span className="text-slate-400 font-normal"> +{spk.personnel.length - 2} lainnya</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">{spk.personnel.length} Orang Tim</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{spk.tlTeknikName}</div>
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{spk.tlTeknikTitle}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                          spk.statusPekerjaan === 'Selesai' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                          spk.statusPekerjaan === 'Selesai dengan catatan' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                          spk.statusPekerjaan === 'Dalam Proses' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                          'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                        }`}>
                          {spk.statusPekerjaan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenSpkEditor(spk)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1 border border-blue-200 dark:border-slate-700"
                            title="Buka / Cetak SPK"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSpk(spk.id, e)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-slate-700 transition-colors"
                            title="Hapus SPK"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredSpks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                          <span>Belum ada dokumen SPK. Klik <strong>"+ Buat SPK Baru"</strong> untuk membuat dokumen SPK pertama Anda.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEW MODE 2: FORM SPK EDITOR & A4 PRINT PREVIEW */}
      {currentMode === 'editor' && (
        <div className="space-y-6">

          {/* Top Return & Control Bar */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 no-print ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentMode('monitoring')}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Monitoring SPK</span>
              </button>

              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  Formulir & Preview SPK Official
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{formData.nomorSpk}</span> • Pemberi Perintah: <strong>{formData.tlTeknikName}</strong>
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeleteSpk(formData.id)}
                className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-slate-800 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-rose-200 dark:border-slate-700 cursor-pointer"
                title="Hapus Dokumen SPK Ini"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus SPK</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToSystem}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan SPK</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Download SPK</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Form Controls Left + Live Paper Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: EDITOR FORM CONTROLS (Hide when printing) */}
            <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 no-print ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  <span>Input & Edit Isian SPK</span>
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  Edit Mode
                </span>
              </div>

              {/* Section 1: Header Info */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  1. Header & Nomor SPK
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Tanggal Dokumen
                    </label>
                    <input
                      type="date"
                      value={toIsoDateString(formData.tanggal)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({ ...formData, tanggal: toDisplayDateString(e.target.value) });
                        }
                      }}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker?.();
                        } catch (_) {}
                      }}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Kategori Header
                    </label>
                    <select
                      value={formData.kategoriHeader}
                      onChange={(e) => setFormData({ ...formData, kategoriHeader: e.target.value })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PEMELIHARAAN JARINGAN DISTRIBUSI">PEMELIHARAAN JARINGAN DISTRIBUSI</option>
                      <option value="INSPEKSI JARINGAN DISTRIBUSI">INSPEKSI JARINGAN DISTRIBUSI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Nomor Dokumen SPK</label>
                  <input
                    type="text"
                    value={formData.nomorSpk}
                    onChange={(e) => setFormData({ ...formData, nomorSpk: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Section 2: Personel List */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>2. Di Perintahkan Kepada (Personel)</span>
                  <span className="text-[10px] text-blue-500">{formData.personnel.length} Orang</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {formData.personnel.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="w-5 text-center font-bold text-xs text-slate-400">{idx + 1}.</span>
                      <input
                        type="text"
                        value={person}
                        onChange={(e) => {
                          const updated = [...formData.personnel];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, personnel: updated });
                        }}
                        className="flex-1 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleRemovePersonnel(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tambah nama personel..."
                    value={newPersonnelName}
                    onChange={(e) => setNewPersonnelName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPersonnel())}
                    className="flex-1 p-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddPersonnel}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Checklist Scope */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  3. Lingkup Pelaksanaan ( Checklist 1 - 10 )
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.jtm}
                      onChange={() => handleToggleChecklist('jtm')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">1. JTM</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.tiangTr}
                      onChange={() => handleToggleChecklist('tiangTr')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">6. Tiang TR & aksesoris</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.jtr}
                      onChange={() => handleToggleChecklist('jtr')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">2. JTR</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.row}
                      onChange={() => handleToggleChecklist('row')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">7. ROW</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.garduHubung}
                      onChange={() => handleToggleChecklist('garduHubung')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">3. Gardu Hubung</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.inspeksi}
                      onChange={() => handleToggleChecklist('inspeksi')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">8. INSPEKSI</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.garduTrafo}
                      onChange={() => handleToggleChecklist('garduTrafo')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">4. Gardu Trafo</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.survey}
                      onChange={() => handleToggleChecklist('survey')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">9. SURVEY</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist.tiangTm}
                      onChange={() => handleToggleChecklist('tiangTm')}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">5. Tiang TM & aksesoris</span>
                  </label>

                  {/* Point 10: Manual Input Toggle */}
                  <div className="col-span-2 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist.customChecked}
                        onChange={() => handleToggleChecklist('customChecked')}
                        className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        10. Lainnya / Input Manual (Klik untuk Tampilkan Teks)
                      </span>
                    </label>
                    {formData.checklist.customChecked && (
                      <input
                        type="text"
                        placeholder="Ketik deskripsi lingkup manual (misal: Pengujian Recloser, Penggantian Trafo...)"
                        value={formData.checklist.customText}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          checklist: {
                            ...prev.checklist,
                            customText: e.target.value
                          }
                        }))}
                        className="w-full p-2 text-xs font-bold rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Detail Pekerjaan */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  4. Detail Deskripsi Pekerjaan
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Jenis pekerjaan</label>
                  <input
                    type="text"
                    value={formData.jenisPekerjaan}
                    onChange={(e) => setFormData({ ...formData, jenisPekerjaan: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Penyulang</label>
                  <input
                    type="text"
                    value={formData.penyulang}
                    onChange={(e) => setFormData({ ...formData, penyulang: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="Masukkan Section (misal: Section 1 / Gh Wayame)"
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Lokasi Detail</label>
                  <textarea
                    rows={2}
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Target Pekerjaan
                  </label>

                  {/* Choice Radio / Centang: Volume vs kms */}
                  <div className="flex items-center gap-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                      <input
                        type="radio"
                        name="targetTypeRadio"
                        checked={targetType === 'volume'}
                        onChange={() => updateTarget(targetValue, 'volume')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Volume</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                      <input
                        type="radio"
                        name="targetTypeRadio"
                        checked={targetType === 'kms'}
                        onChange={() => updateTarget(targetValue, 'kms')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>kms (Kilometer Sirkit)</span>
                    </label>
                  </div>

                  {/* Input Nilai Target */}
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={targetType === 'kms' ? "Masukkan angka (misal: 15)" : "Masukkan nilai angka saja (misal: 20)"}
                      value={targetValue}
                      onChange={(e) => updateTarget(e.target.value, targetType)}
                      className="w-full p-2 pr-28 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-2 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 pointer-events-none uppercase">
                      {targetType === 'kms' ? 'kms' : 'Titik Pohon'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Pejabat Penandatangan & Persetujuan */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  5. Pejabat Penandatangan & Persetujuan
                </div>

                {/* Direct Approval Control Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleApproveAll}
                      className={`px-3 py-1.5 text-white font-black text-[11px] rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        (Boolean(formData.isApprovedTlTeknik) && Boolean(formData.isApprovedManager))
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      {(Boolean(formData.isApprovedTlTeknik) && Boolean(formData.isApprovedManager)) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve (TL & Manager)</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>(Menunggu Approve)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* TL Teknik Approval Button */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">TL TEKNIK</span>
                        {Boolean(formData.isApprovedTlTeknik) ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            TER-APPROVE
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[9px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            PENDING
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleApproveTlTeknik}
                        className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          Boolean(formData.isApprovedTlTeknik)
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{Boolean(formData.isApprovedTlTeknik) ? '✓ Approved TL Teknik' : 'Klik Approve TL Teknik'}</span>
                      </button>
                    </div>

                    {/* Manager ULP Approval Button */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">MANAGER ULP</span>
                        {Boolean(formData.isApprovedManager) ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            TER-APPROVE
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[9px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            PENDING
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleApproveManager}
                        className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          Boolean(formData.isApprovedManager)
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{Boolean(formData.isApprovedManager) ? '✓ Approved Manager' : 'Klik Approve Manager'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                      Pemberi Perintah: TL TEKNIK
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Team Leader Teknik</label>
                    <input
                      type="text"
                      value={formData.tlTeknikName}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tlTeknikName: e.target.value, 
                        tlTeknikTitle: 'TL TEKNIK ULP BAGUALA' 
                      })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan Nama TL Teknik..."
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                      Mengetahui: MANAGER ULP BAGUALA
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Manager ULP</label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        managerName: e.target.value, 
                        managerTitle: 'Manager ULP Baguala' 
                      })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan Nama Manager ULP..."
                    />
                  </div>
                </div>
              </div>

              {/* Status Pekerjaan Option */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  6. Status Pekerjaan
                </label>
                <select
                  value={formData.statusPekerjaan}
                  onChange={(e) => setFormData({ ...formData, statusPekerjaan: e.target.value })}
                  className="w-full p-2 text-xs font-bold rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Dalam Progres (On Progress)">Dalam Progres (On Progress)</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Selesai (Dengan Catatan)">Selesai (Dengan Catatan)</option>
                  <option value="Pending">Pending</option>
                </select>

                {(formData.statusPekerjaan === 'Selesai (Dengan Catatan)' || formData.statusPekerjaan?.includes('catatan')) && (
                  <div className="space-y-1 mt-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Catatan Manual Status Pekerjaan:
                    </label>
                    <input
                      type="text"
                      placeholder="Ketik catatan manual disini..."
                      value={formData.catatanStatus || ''}
                      onChange={(e) => setFormData({ ...formData, catatanStatus: e.target.value })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: OFFICIAL PRINTABLE A4 FORM PAPER PREVIEW */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">

              {/* Paper Frame Canvas */}
              <div 
                ref={printRef}
                className="w-full max-w-[720px] bg-white text-black p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-300 font-sans relative overflow-hidden select-text text-black dark:text-black printable-spk-document"
                style={{
                  minHeight: '920px',
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Background Diagonal Watermark matching screenshot */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none rotate-[-30deg]"
                  style={{ fontSize: '48px', fontWeight: '900', color: '#000' }}
                >
                  PT PLN (Persero) UP3 Ambon
                </div>

                {/* HEADER BOX - Border Table Layout 1:1 like screenshot */}
                <div className="border-2 border-black w-full mb-3 text-black">
                  <div className="grid grid-cols-12 border-b-2 border-black">
                    
                    {/* Left Logo & Name */}
                    <div className="col-span-8 p-2 border-r-2 border-black flex items-center gap-2">
                      {/* PLN Lightning Bolt Logo SVG */}
                      <div className="w-9 h-12 bg-sky-500 border border-black flex items-center justify-center shrink-0 relative overflow-hidden">
                        <div className="w-full h-full bg-[#fde047] flex items-center justify-center relative p-0.5">
                          <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-current drop-shadow-xs">
                            <path d="M11 15H6l7-14v8h5l-7 14v-8z" />
                          </svg>
                          <div className="absolute bottom-0 text-[7px] font-black tracking-tighter text-blue-900 bg-white/90 px-0.5">
                            PLN
                          </div>
                        </div>
                      </div>

                      <div className="leading-tight text-black">
                        <div className="font-extrabold text-[12px] uppercase tracking-wide">
                          PT PLN (Persero)
                        </div>
                        <div className="font-bold text-[10px] uppercase">
                          UNIT INDUK WILAYAH MALUKU DAN MALUKU UTARA
                        </div>
                        <div className="font-bold text-[10px] uppercase">
                          UP3 AMBON
                        </div>
                        <div className="font-extrabold text-[11px] uppercase tracking-wide">
                          ULP BAGUALA
                        </div>
                      </div>
                    </div>

                    {/* Right SMK3 Logo */}
                    <div className="col-span-4 p-2 flex items-center justify-center gap-1.5 text-center">
                      <div className="w-8 h-8 rounded-full border border-yellow-500 bg-yellow-100 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-amber-800">SMK3</span>
                      </div>
                      <div className="text-[9px] font-bold leading-tight text-amber-700">
                        Sistem Manajemen K3
                      </div>
                    </div>
                  </div>

                  {/* Title & Date Row */}
                  <div className="grid grid-cols-12 text-black">
                    <div className="col-span-8 p-2 border-r-2 border-black font-extrabold text-center text-sm uppercase tracking-wider flex items-center justify-center">
                      FORMULIR PERINTAH KERJA
                    </div>
                    <div className="col-span-4 p-2 text-xs font-bold flex items-center justify-start gap-1">
                      <span>Tanggal</span>
                      <span>:</span>
                      <span className="font-extrabold">{formData.tanggal}</span>
                    </div>
                  </div>
                </div>

                {/* MAIN CONTENT BORDER BOX */}
                <div className="border-2 border-black w-full p-4 space-y-4 text-black text-xs leading-relaxed min-h-[750px] flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    {/* Document Number */}
                    <div className="font-extrabold text-xs uppercase tracking-wide border-b border-black/20 pb-1.5">
                      {formData.nomorSpk}
                    </div>

                    {/* Header Category Subtitle */}
                    <div className="font-black text-sm uppercase text-center tracking-wide my-1">
                      {formData.kategoriHeader}
                    </div>

                    {/* Di Perintahkan kepada Section */}
                    <div className="space-y-1">
                      <div className="font-extrabold text-xs">
                        Di Perintahkan kepada :
                      </div>
                      <ol className="list-decimal list-inside pl-1 space-y-0.5 font-bold text-xs">
                        {formData.personnel.map((person, idx) => (
                          <li key={idx} className="leading-snug">
                            {person}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Purpose Text */}
                    <div className="font-extrabold text-xs pt-1">
                      Untuk melaksanakan {formData.kategoriHeader.toLowerCase()}
                    </div>

                    {/* 10 Checklist Grid 1:1 matching screenshot */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 py-1 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">1</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.jtm ? '✓' : ''}
                        </span>
                        <span>JTM</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">6</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.tiangTr ? '✓' : ''}
                        </span>
                        <span>Tiang TR & aksesoris</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">2</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.jtr ? '✓' : ''}
                        </span>
                        <span>JTR</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">7</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.row ? '✓' : ''}
                        </span>
                        <span>ROW</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">3</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.garduHubung ? '✓' : ''}
                        </span>
                        <span>Gardu Hubung</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">8</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.inspeksi ? '✓' : ''}
                        </span>
                        <span>INSPEKSI</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">4</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.garduTrafo ? '✓' : ''}
                        </span>
                        <span>Gardu Trafo</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">9</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.survey ? '✓' : ''}
                        </span>
                        <span>SURVEY</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">5</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.tiangTm ? '✓' : ''}
                        </span>
                        <span>Tiang TM & aksesoris</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 text-right">10</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.customChecked ? '✓' : ''}
                        </span>
                        <span>{formData.checklist.customText || '__________'}</span>
                      </div>
                    </div>

                    {/* Details Key Value List */}
                    <div className="space-y-1.5 pt-2 font-bold text-xs">
                      <div className="grid grid-cols-12">
                        <span className="col-span-3 font-black">Jenis pekerjaan</span>
                        <span className="col-span-1 text-center font-black">:</span>
                        <span className="col-span-8 font-extrabold">{formData.jenisPekerjaan}</span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-3 font-black">Penyulang</span>
                        <span className="col-span-1 text-center font-black">:</span>
                        <span className="col-span-8 font-extrabold">{formData.penyulang}</span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-3 font-black">Section</span>
                        <span className="col-span-1 text-center font-black">:</span>
                        <span className="col-span-8 font-extrabold">{formData.section || '-'}</span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-3 font-black">Lokasi</span>
                        <span className="col-span-1 text-center font-black">:</span>
                        <span className="col-span-8 font-extrabold whitespace-pre-line leading-relaxed">
                          {formData.lokasi}
                        </span>
                      </div>

                      <div className="grid grid-cols-12">
                        <span className="col-span-3 font-black">Target</span>
                        <span className="col-span-1 text-center font-black">:</span>
                        <span className="col-span-8 font-extrabold">{formData.target}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Signatures & Status Section */}
                  <div className="pt-4 space-y-4">
                    
                    {/* SIGNATURE BLOCKS (2 Signatories: TL Teknik Pemberi Perintah + Manager) */}
                    <div className="grid grid-cols-2 gap-4 text-center text-xs font-extrabold pt-2">
                      
                      {/* Left: Pemberi Perintah TL TEKNIK */}
                      <div className="flex flex-col items-center justify-between min-h-[110px]">
                        <div>
                          <div>Pemberi Perintah</div>
                          <div className="text-[11px] font-black text-blue-900">{formData.tlTeknikTitle}</div>
                        </div>

                        {/* Stamp Box Matching User Request (Green border, APPROVE TL TEKNIK, No date) */}
                        <div className="my-2 min-w-[140px] flex items-center justify-center">
                          {Boolean(formData.isApprovedTlTeknik) ? (
                            <div className="border-2 border-emerald-600 rounded-lg py-1.5 px-3 bg-emerald-50/90 shadow-xs rotate-[-4deg] text-center border-dashed">
                              <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                                APPROVE TL TEKNIK
                              </span>
                            </div>
                          ) : (
                            <div className="h-9 flex items-center justify-center text-[9px] font-bold text-amber-700 italic border border-dashed border-amber-300 rounded-lg px-2 bg-amber-50/50">
                              [ MENUNGGU APPROVAL ]
                            </div>
                          )}
                        </div>

                        <div className="underline font-black">{formData.tlTeknikName}</div>
                      </div>

                      {/* Right: Mengetahui MANAGER ULP BAGUALA */}
                      <div className="flex flex-col items-center justify-between min-h-[110px]">
                        <div>
                          <div>Mengetahui</div>
                          <div className="text-[11px] font-black text-slate-900">{formData.managerTitle}</div>
                        </div>

                        {/* Stamp Box Matching User Request (Green border, APPROVE MANAGER, No date) */}
                        <div className="my-2 min-w-[140px] flex items-center justify-center">
                          {Boolean(formData.isApprovedManager) ? (
                            <div className="border-2 border-emerald-600 rounded-lg py-1.5 px-3 bg-emerald-50/90 shadow-xs rotate-[-4deg] text-center border-dashed">
                              <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                                APPROVE MANAGER
                              </span>
                            </div>
                          ) : (
                            <div className="h-9 flex items-center justify-center text-[9px] font-bold text-amber-700 italic border border-dashed border-amber-300 rounded-lg px-2 bg-amber-50/50">
                              [ MENUNGGU APPROVAL ]
                            </div>
                          )}
                        </div>

                        <div className="underline font-black">{formData.managerName}</div>
                      </div>

                    </div>

                    {/* Status Pekerjaan Bottom Checkboxes */}
                    <div className="border-t border-black/40 pt-2 text-[11px] font-extrabold">
                      <div className="mb-1 uppercase tracking-wide">Status pekerjaan</div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {(formData.statusPekerjaan === 'Dalam Progres (On Progress)' || formData.statusPekerjaan === 'Dalam Proses') ? '✓' : ''}
                          </span>
                          <span>Dalam Progres (On Progress)</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {formData.statusPekerjaan === 'Selesai' ? '✓' : ''}
                          </span>
                          <span>Selesai</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {(formData.statusPekerjaan === 'Selesai (Dengan Catatan)' || formData.statusPekerjaan?.includes('catatan')) ? '✓' : ''}
                          </span>
                          <span>
                            Selesai (Dengan Catatan)
                            {formData.catatanStatus ? `: ${formData.catatanStatus}` : ''}
                          </span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {formData.statusPekerjaan === 'Pending' ? '✓' : ''}
                          </span>
                          <span>Pending</span>
                        </label>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Modal Dialog Pilihan Cetak / Download SPK */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border space-y-5 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Cetak / Download SPK</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[240px]">
                    {formData.nomorSpk}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Pilih opsi output yang Anda inginkan untuk Surat Perintah Kerja ini:
            </p>

            <div className="space-y-3">
              {/* Option 1: Download PDF File */}
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleDownloadPdf}
                className="w-full p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 text-left flex items-start gap-3.5 transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                  {isExportingPdf ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Download className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                    <span>Download File PDF (.pdf)</span>
                    <span className="text-[9px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-black">
                      Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 font-medium leading-snug">
                    {isExportingPdf ? 'Mengkonversi SPK ke PDF...' : 'Unduh langsung dokumen SPK resmi ke HP/Komputer sebagai file PDF.'}
                  </p>
                </div>
              </button>

              {/* Option 2: Cetak Langsung */}
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={() => {
                  setShowPrintModal(false);
                  setTimeout(() => {
                    window.print();
                  }, 150);
                }}
                className="w-full p-4 rounded-xl border-2 border-blue-500/40 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 text-left flex items-start gap-3.5 transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Printer className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs sm:text-sm text-blue-950 dark:text-blue-200">
                    Cetak Langsung (Printer)
                  </div>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 font-medium leading-snug">
                    Buka jendela cetak sistem untuk langsung mencetak dokumen A4 ke mesin printer.
                  </p>
                </div>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Exact A4 Print Output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .printable-spk-document, .printable-spk-document * {
            visibility: visible;
          }
          .printable-spk-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-w: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 10mm !important;
            background: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
        }
      `}</style>

    </div>
  );
};
