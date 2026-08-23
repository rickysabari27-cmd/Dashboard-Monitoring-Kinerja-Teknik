import React, { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
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
  X,
  XCircle,
  Calendar,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface SpkFormViewProps {
  isDarkMode: boolean;
  spkList?: SpkTask[];
  onSaveSpk?: (spk: SpkTask) => void;
  onDeleteSpk?: (spkId: string) => void;
  onClearSpks?: () => void;
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
  statusPekerjaan: 'Dalam Progres' | 'Selesai' | 'Selesai (Dengan Catatan)' | 'Pending' | 'Terencana' | 'Rencana' | 'Dibatalkan' | string;
}

// Registered Penyulang List
const REGISTERED_PENYULANG = [
  'Passo', 'ACC', 'Lateri 1', 'Lateri 2', 'Lateri 3', 
  'Waiheru 1', 'Waiheru 2', 'Waiheru 3', 
  'Wayame 1', 'Wayame 2', 'Wayame 3', 
  'Bandara 1', 'Bandara 2', 'Allang', 'Hutumuri', 'Rijali', 
  'Karpan 1', 'MCM', 'MVTIC 1', 'MVTIC 2', 'Galala 1', 'Galala 2'
];

/**
 * QR Code component for SPK Manager Approval
 * Scans to: "Approve"
 */
const ApproveQrCode: React.FC<{ size?: number; text?: string }> = ({ size = 68, text = 'Approve' }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(text, {
      margin: 1,
      width: size * 3, // High-res for sharp printing & PDF export
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url: string) => {
        if (isMounted) setQrUrl(url);
      })
      .catch((err: unknown) => {
        console.error('Error generating approval QR Code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [text, size]);

  if (!qrUrl) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="bg-slate-100 border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-mono"
      >
        QR...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-0.5 bg-white rounded">
      <img
        src={qrUrl}
        alt="Approve QR Code"
        style={{ width: size, height: size }}
        className="block object-contain"
      />
    </div>
  );
};

/**
 * Official SMK3 Logo (Sistem Manajemen Keselamatan & Kesehatan Kerja)
 * Features the official 11-toothed green gear, inner white circle, green cross,
 * and 3-line centered bold typography without clipping or distortion.
 */
const Smk3Logo: React.FC<{ className?: string }> = ({ className = 'w-24 h-auto' }) => (
  <svg 
    viewBox="0 0 280 200" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible' }}
  >
    {/* Center 11-tooth Gear Wheel (K3 Standard) */}
    <g transform="translate(140, 58)">
      {/* 11 Gear Teeth */}
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(0)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(32.727)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(65.455)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(98.182)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(130.909)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(163.636)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(196.364)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(229.091)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(261.818)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(294.545)" />
      <polygon points="-6.5,-36 -4.8,-50 4.8,-50 6.5,-36" fill="#009E49" transform="rotate(327.273)" />

      {/* Gear Body */}
      <circle cx="0" cy="0" r="37.5" fill="#009E49" />
      {/* Inner White Circle */}
      <circle cx="0" cy="0" r="23.5" fill="#FFFFFF" />
      {/* Centered Green Cross */}
      <rect x="-14.5" y="-5.5" width="29" height="11" rx="0.5" fill="#009E49" />
      <rect x="-5.5" y="-14.5" width="11" height="29" rx="0.5" fill="#009E49" />
    </g>

    {/* Text Section (Line 1, 2, 3) */}
    <text 
      x="140" 
      y="132" 
      fontFamily="'Arial Black', 'Arial', 'Helvetica', sans-serif" 
      fontWeight="900" 
      fontSize="14.5" 
      fill="#009E49" 
      textAnchor="middle" 
      letterSpacing="0.3"
    >
      SISTEM MANAJEMEN
    </text>
    <text 
      x="140" 
      y="155" 
      fontFamily="'Arial Black', 'Arial', 'Helvetica', sans-serif" 
      fontWeight="900" 
      fontSize="11.8" 
      fill="#009E49" 
      textAnchor="middle" 
      letterSpacing="0.1"
    >
      KESELAMATAN &amp; KESEHATAN KERJA
    </text>
    <text 
      x="140" 
      y="182" 
      fontFamily="'Arial Black', 'Arial', 'Helvetica', sans-serif" 
      fontWeight="900" 
      fontSize="16" 
      fill="#009E49" 
      textAnchor="middle" 
      letterSpacing="0.5"
    >
      (SMK3)
    </text>
  </svg>
);

const DEFAULT_ROW_PERSONNEL = [
  'Syahrul Kolly',
  'Barqil Fuad Lessy',
  'Agus Suprianto',
  'Deylan S',
  'Wilson Lesnussa',
  'Melky Jackson P',
  'Rivaldo Agustien'
];

const DEFAULT_INSPEKSI_PERSONNEL = [
  'Rolly J Pattinama',
  'Muzhar A Hatala',
  'Andre H Gabriel'
];

// Preset 1 (Row Perambasan Pohon - Page 1 in user's PDF)
const PRESET_ROW_PAGE_1: SpkFormData = {
  id: 'spk-017-row',
  tanggal: '12-08-2026',
  nomorSpk: '',
  kategoriHeader: '',
  personnel: DEFAULT_ROW_PERSONNEL,
  checklist: {
    jtm: false,
    jtr: false,
    garduHubung: false,
    garduTrafo: false,
    tiangTm: false,
    tiangTr: false,
    row: false,
    inspeksi: false,
    survey: false,
    customText: '',
    customChecked: false
  },
  jenisPekerjaan: 'Perambasan Pohon ROW',
  penyulang: '',
  section: '',
  lokasi: '',
  target: '',
  tlTeknikName: '',
  tlTeknikTitle: 'TL TEKNIK',
  isApprovedTlTeknik: false,
  managerName: '',
  managerTitle: 'Manager ULP',
  isApprovedManager: false,
  statusPekerjaan: 'Dalam Progres'
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
  tlTeknikName: '',
  tlTeknikTitle: 'TL TEKNIK',
  isApprovedTlTeknik: false,
  managerName: '',
  managerTitle: 'Manager ULP',
  isApprovedManager: false,
  statusPekerjaan: 'Dalam Progres'
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
  tlTeknikName: '',
  tlTeknikTitle: 'TL TEKNIK',
  managerName: '',
  managerTitle: 'Manager ULP',
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
  tlTeknikName: '',
  tlTeknikTitle: 'TL TEKNIK',
  managerName: '',
  managerTitle: 'Manager ULP',
  statusPekerjaan: 'Selesai (Dengan Catatan)'
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

// Helper to split document number into editable segments
const parseNomorSpk = (fullNomor: string, categoryHeader: string) => {
  let clean = (fullNomor || '').replace(/^NO\.\s+/i, '').trim();
  
  let detectedMiddle = 'PK.TEK/ROW/ULP.BGL';
  const lowerHeader = (categoryHeader || '').toLowerCase();
  if (lowerHeader.includes('inspeksi') || lowerHeader.includes('ins')) {
    detectedMiddle = 'PK.TEK/INS/ULP.BGL';
  } else if (lowerHeader.includes('pemeliharaan') || lowerHeader.includes('har')) {
    detectedMiddle = 'PK.TEK/HAR/ULP.BGL';
  }

  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length >= 4) {
      const nomorUrut = parts[0].trim();
      const tahun = parts[parts.length - 1].trim();
      const bulan = parts[parts.length - 2].trim();
      const tengah = parts.slice(1, parts.length - 2).join('/').trim();
      return {
        nomorUrut,
        tengah: tengah || detectedMiddle,
        bulan,
        tahun: tahun || '2026'
      };
    }
  }

  return {
    nomorUrut: clean || '',
    tengah: detectedMiddle,
    bulan: '',
    tahun: '2026'
  };
};

// Helper to reliably normalize SPK status across all variations (Draft, Rencana, Dalam Proses, On Progress, Selesai, etc.)
export const normalizeSpkStatus = (status?: string): 'Terencana' | 'Dalam Progres' | 'Selesai' | 'Selesai (Dengan Catatan)' | 'Pending' | 'Dibatalkan' => {
  if (!status) return 'Terencana';
  const s = status.toLowerCase().trim();
  if (s.includes('batal') || s.includes('cancel')) return 'Dibatalkan';
  if (s.includes('catatan')) return 'Selesai (Dengan Catatan)';
  if (s.includes('selesai') || s.includes('done') || s.includes('tuntas')) return 'Selesai';
  if (s.includes('progres') || s.includes('proses') || s.includes('progress') || s.includes('jalan') || s.includes('kerja')) return 'Dalam Progres';
  if (s.includes('pending') || s.includes('tunda') || s.includes('tangguh')) return 'Pending';
  if (s.includes('draft') || s.includes('rencana') || s.includes('terencana') || s.includes('jadwal') || s.includes('baru')) return 'Terencana';
  return 'Terencana';
};

export const SpkFormView: React.FC<SpkFormViewProps> = ({
  isDarkMode,
  spkList = [],
  onSaveSpk,
  onDeleteSpk,
  onClearSpks
}) => {
  // Mode State: 'monitoring' by default per user request
  const [currentMode, setCurrentMode] = useState<'monitoring' | 'editor'>('monitoring');

  // List of SPK Records (Initialized clean per user request to recreate SPKs)
  const [allSpks, setAllSpks] = useState<SpkFormData[]>(() => {
    try {
      const saved = localStorage.getItem('spk_list_records_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(item => {
            const num = (item.nomorSpk || '').toLowerCase();
            return !num.includes('spk/bag/2026/08/012') && !num.includes('spk/bag/2026/08/013');
          });
          if (filtered.length > 0) {
            return filtered.map(item => ({
              ...item,
              statusPekerjaan: normalizeSpkStatus(item.statusPekerjaan)
            }));
          } else {
            localStorage.removeItem('spk_list_records_v3');
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat SPK dari localStorage:', err);
    }
    // Clean default list per user request ("data spk belum ada karena akan diinput manual")
    return [];
  });

  // Sync spkList from Firebase / parent if allSpks is empty or has missing items
  useEffect(() => {
    if (spkList && spkList.length > 0) {
      const cleanSpkList = spkList.filter(task => {
        const num = (task.spkNumber || '').toLowerCase();
        return !num.includes('spk/bag/2026/08/012') && !num.includes('spk/bag/2026/08/013');
      });
      if (cleanSpkList.length > 0) {
        setAllSpks(prev => {
          let changed = false;
          const updated = [...prev];
          cleanSpkList.forEach(task => {
            const exists = updated.find(item => item.id === task.id || (item.nomorSpk && task.spkNumber && item.nomorSpk.trim().toLowerCase() === task.spkNumber.trim().toLowerCase()));
            if (!exists) {
              changed = true;
              updated.push({
                id: task.id,
                tanggal: task.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
                nomorSpk: task.spkNumber || '',
                kategoriHeader: task.taskType?.toLowerCase().includes('inspeksi') ? 'INSPEKSI JARINGAN DISTRIBUSI' : 'PEMELIHARAAN JARINGAN DISTRIBUSI',
                personnel: task.teamName ? task.teamName.split(',').map(p => p.trim()).filter(Boolean) : [],
                checklist: {
                  jtm: true,
                  jtr: false,
                  garduHubung: false,
                  garduTrafo: false,
                  tiangTm: true,
                  tiangTr: false,
                  row: task.taskType?.toLowerCase().includes('row') || task.taskType?.toLowerCase().includes('pohon') || true,
                  inspeksi: task.taskType?.toLowerCase().includes('inspeksi') || false,
                  survey: false,
                  customText: '',
                  customChecked: false
                },
                jenisPekerjaan: task.taskType || 'Perambasan Pohon ROW',
                penyulang: task.feederName || '',
                section: '',
                lokasi: task.locationSection || '',
                target: task.targetQty || '',
                tlTeknikName: '',
                tlTeknikTitle: 'TL TEKNIK',
                isApprovedTlTeknik: false,
                managerName: '',
                managerTitle: 'Manager ULP',
                isApprovedManager: false,
                statusPekerjaan: normalizeSpkStatus(task.status)
              });
            }
          });
          return changed ? updated : prev;
        });
      }
    }
  }, [spkList]);

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
  const [targetValue, setTargetValue] = useState<string>('');

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
      nomorSpk: '',
      kategoriHeader: '',
      personnel: [],
      checklist: {
        jtm: false,
        jtr: false,
        garduHubung: false,
        garduTrafo: false,
        tiangTm: false,
        tiangTr: false,
        row: false,
        inspeksi: false,
        survey: false,
        customText: '',
        customChecked: false
      },
      jenisPekerjaan: '',
      penyulang: '',
      section: '',
      lokasi: '',
      target: '',
      tlTeknikName: '',
      tlTeknikTitle: 'TL TEKNIK',
      managerName: '',
      managerTitle: 'Manager ULP',
      statusPekerjaan: 'Dalam Progres'
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
    if (onDeleteSpk) {
      onDeleteSpk(id);
    }
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
      if (onClearSpks) {
        onClearSpks();
      }
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
    // ALWAYS use the standard offscreen A4 container to guarantee 100% consistent sizing, margins, and layout on all devices
    const elementId = 'printable-spk-monitoring';
    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) {
      showToast('Gagal memproses dokumen SPK untuk diunduh.');
      return;
    }

    setIsExportingPdf(true);
    
    // The offscreen container is inside 'printable-spk-monitoring-wrapper'
    const wrapper = document.getElementById('printable-spk-monitoring-wrapper');
    const originalStyle = wrapper ? wrapper.getAttribute('style') : '';
    const originalClassName = wrapper ? wrapper.className : '';

    if (wrapper) {
      // Temporarily make it visible to the rendering engine but out of user's interactive view
      wrapper.className = 'fixed top-0 left-0 w-[794px] h-[1123px] overflow-hidden pointer-events-none opacity-[0.01] z-[9999]';
      wrapper.setAttribute('style', 'left: 0 !important; top: 0 !important; opacity: 0.01 !important; visibility: visible !important; display: block !important;');
    }

    try {
      // Small delay to ensure the DOM updates
      await new Promise(resolve => setTimeout(resolve, 80));

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
      
      const spkNo = formData.nomorSpk || 'SPK_Document';
      const cleanFileName = spkNo
        .replace(/^(NO\.|NO|Nomor)\s*/i, '')
        .trim()
        .replace(/[\/\\]/g, '_')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_\.-]/g, '');
        
      const fileName = `${cleanFileName}.pdf`;
      pdf.save(fileName);
      showToast(`File PDF (${fileName}) berhasil diunduh!`);
      setShowPrintModal(false);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('Gagal download otomatis. Membuka dialog pencetakan...');
      setShowPrintModal(false);
      setTimeout(() => {
        window.print();
      }, 200);
    } finally {
      if (wrapper) {
        // Restore original style and class
        wrapper.className = originalClassName;
        if (originalStyle) {
          wrapper.setAttribute('style', originalStyle);
        } else {
          wrapper.removeAttribute('style');
        }
      }
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
        status: (formData.statusPekerjaan as any) || 'Dalam Progres',
        priority: 'Tinggi',
        description: `${formData.kategoriHeader} - TL Teknik: ${formData.tlTeknikName}`
      };
      onSaveSpk(spkRecord);
    }

    showToast('Surat Perintah Kerja (SPK) berhasil disimpan!');
    setCurrentMode('monitoring');
  };

  // Filtered SPK List for Monitoring Dashboard
  const filteredSpks = useMemo(() => {
    return allSpks.filter(spk => {
      const normStatus = normalizeSpkStatus(spk.statusPekerjaan);
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || (
        (spk.nomorSpk || '').toLowerCase().includes(q) ||
        (spk.penyulang || '').toLowerCase().includes(q) ||
        (spk.jenisPekerjaan || '').toLowerCase().includes(q) ||
        (spk.lokasi || '').toLowerCase().includes(q) ||
        (spk.section || '').toLowerCase().includes(q) ||
        (spk.kategoriHeader || '').toLowerCase().includes(q) ||
        (spk.personnel || []).some(p => p.toLowerCase().includes(q))
      );

      const matchesStatus = (() => {
        if (statusFilter === 'ALL') return true;
        if (statusFilter === 'Terencana' || statusFilter === 'Rencana' || statusFilter === 'Draft') {
          return normStatus === 'Terencana';
        }
        if (statusFilter === 'Dalam Progres' || statusFilter === 'Dalam Proses' || statusFilter === 'Proses') {
          return normStatus === 'Dalam Progres';
        }
        if (statusFilter === 'Selesai') {
          return normStatus === 'Selesai' || normStatus === 'Selesai (Dengan Catatan)';
        }
        if (statusFilter === 'Selesai (Dengan Catatan)') {
          return normStatus === 'Selesai (Dengan Catatan)';
        }
        if (statusFilter === 'Pending') {
          return normStatus === 'Pending';
        }
        if (statusFilter === 'Dibatalkan') {
          return normStatus === 'Dibatalkan';
        }
        return normStatus === normalizeSpkStatus(statusFilter);
      })();

      return matchesSearch && matchesStatus;
    });
  }, [allSpks, searchQuery, statusFilter]);

  // Group SPK Records dynamically by Work Status
  const rencanaSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Terencana');
  const progresSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Dalam Progres');
  const pendingSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Pending');
  const selesaiSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Selesai');
  const selesaiCatatanSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Selesai (Dengan Catatan)');
  const dibatalkanSpks = filteredSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Dibatalkan');

  const groupedCategories = [
    {
      id: 'Terencana',
      title: 'SPK Terencana',
      items: rencanaSpks,
      icon: <Calendar className="w-4 h-4" />,
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      headerClass: 'bg-indigo-950/40 border-y border-indigo-900/50 text-indigo-300 font-bold'
    },
    {
      id: 'Dalam Progres',
      title: 'SPK Dalam Proses / On Progress',
      items: progresSpks,
      icon: <Clock className="w-4 h-4" />,
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      headerClass: 'bg-amber-950/40 border-y border-amber-900/50 text-amber-300 font-bold'
    },
    {
      id: 'Pending',
      title: 'SPK Pending / Ditangguhkan',
      items: pendingSpks,
      icon: <AlertCircle className="w-4 h-4" />,
      badgeClass: 'bg-slate-800 text-slate-300 border border-slate-700',
      headerClass: 'bg-slate-900/80 border-y border-slate-800 text-slate-300 font-bold'
    },
    {
      id: 'Selesai',
      title: 'SPK Selesai (Murni)',
      items: selesaiSpks,
      icon: <CheckCircle2 className="w-4 h-4" />,
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      headerClass: 'bg-emerald-950/40 border-y border-emerald-900/50 text-emerald-300 font-bold'
    },
    {
      id: 'Selesai (Dengan Catatan)',
      title: 'SPK Selesai (Dengan Catatan)',
      items: selesaiCatatanSpks,
      icon: <Award className="w-4 h-4" />,
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
      headerClass: 'bg-cyan-950/40 border-y border-cyan-900/50 text-cyan-300 font-bold'
    },
    {
      id: 'Dibatalkan',
      title: 'SPK Dibatalkan',
      items: dibatalkanSpks,
      icon: <XCircle className="w-4 h-4" />,
      badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      headerClass: 'bg-rose-950/40 border-y border-rose-900/50 text-rose-300 font-bold'
    }
  ];

  // Determine active visible categories for the table
  const visibleCategories = groupedCategories.filter(cat => {
    if (statusFilter === 'ALL') {
      return cat.items.length > 0;
    }
    if (statusFilter === 'Terencana' || statusFilter === 'Rencana' || statusFilter === 'Draft') {
      return cat.id === 'Terencana';
    }
    if (statusFilter === 'Dalam Progres' || statusFilter === 'Dalam Proses' || statusFilter === 'Proses') {
      return cat.id === 'Dalam Progres';
    }
    if (statusFilter === 'Selesai') {
      return cat.id === 'Selesai' || cat.id === 'Selesai (Dengan Catatan)';
    }
    if (statusFilter === 'Selesai (Dengan Catatan)') {
      return cat.id === 'Selesai (Dengan Catatan)';
    }
    if (statusFilter === 'Pending') {
      return cat.id === 'Pending';
    }
    if (statusFilter === 'Dibatalkan') {
      return cat.id === 'Dibatalkan';
    }
    return cat.items.length > 0;
  });

  return (
    <div className={`space-y-6 font-sans text-slate-100 min-h-screen p-1 sm:p-2 select-none ${
      isDarkMode ? 'bg-[#070e1e]' : 'bg-[#070e1e]'
    }`}>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-[#0c162d] text-white shadow-2xl border border-blue-500 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW MODE 1: MONITORING SURAT PERINTAH KERJA (SPK) */}
      {currentMode === 'monitoring' && (
        <div className="space-y-6">
          
          {/* Header Banner Monitoring SPK */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                  Monitoring Surat Perintah Kerja (SPK)
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    ULP Baguala
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitoring status penerbitan SPK, pemberi perintah TL Teknik, serta pelaksanaan pekerjaan jaringan distribusi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {allSpks.length > 0 && (
                <button
                  onClick={handleClearAllSpks}
                  className="px-3.5 py-2.5 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-rose-500/30 active:scale-95"
                  title="Hapus Semua SPK untuk Buat Ulang"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Hapus Semua SPK</span>
                </button>
              )}

              <button
                onClick={handleCreateNewSpk}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat SPK Baru</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div 
              onClick={() => setStatusFilter('ALL')}
              className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                statusFilter === 'ALL'
                  ? 'border-blue-500 bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30' 
                  : 'bg-[#0c162d] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Total Dokumen SPK</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-blue-400">{allSpks.length}</span>
                  <span className="text-xs font-bold text-slate-400">Berkas</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('Terencana')}
              className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                statusFilter === 'Terencana' || statusFilter === 'Rencana'
                  ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/30' 
                  : 'bg-[#0c162d] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">SPK Terencana</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-indigo-400">
                    {allSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Terencana').length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">SPK</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('Dalam Progres')}
              className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                statusFilter === 'Dalam Progres' || statusFilter === 'Dalam Proses'
                  ? 'border-amber-500 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30' 
                  : 'bg-[#0c162d] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">SPK Dalam Proses</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-amber-400">
                    {allSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Dalam Progres').length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">SPK</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('Selesai')}
              className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                (statusFilter === 'Selesai' || statusFilter === 'Selesai (Dengan Catatan)')
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30' 
                  : 'bg-[#0c162d] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">SPK Selesai</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-emerald-400">
                    {allSpks.filter(s => {
                      const st = normalizeSpkStatus(s.statusPekerjaan);
                      return st === 'Selesai' || st === 'Selesai (Dengan Catatan)';
                    }).length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">SPK</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('Dibatalkan')}
              className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                statusFilter === 'Dibatalkan'
                  ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_15px_rgba(239,68,68,0.2)] ring-1 ring-rose-500/30' 
                  : 'bg-[#0c162d] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">SPK Dibatalkan</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-rose-400">
                    {allSpks.filter(s => normalizeSpkStatus(s.statusPekerjaan) === 'Dibatalkan').length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">SPK</span>
                </div>
              </div>
            </div>

          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NO. SPK, Penyulang, Jenis Pekerjaan, atau Nama Personel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white cursor-pointer"
              >
                <option value="ALL">Semua Status SPK</option>
                <option value="Terencana">Terencana</option>
                <option value="Dalam Progres">Dalam Progres</option>
                <option value="Selesai">Selesai</option>
                <option value="Selesai (Dengan Catatan)">Selesai (Dengan Catatan)</option>
                <option value="Pending">Pending</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Table of SPK Records */}
          <div className="rounded-2xl border border-slate-800/90 bg-[#0c162d] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-[11px] font-extrabold uppercase tracking-wider bg-[#091122] border-slate-800 text-slate-400">
                    <th className="py-3.5 px-4">NO. SPK</th>
                    <th className="py-3.5 px-4">Kategori & Jenis Pekerjaan</th>
                    <th className="py-3.5 px-4">Penyulang & Lokasi</th>
                    <th className="py-3.5 px-4">Personel Pelaksana</th>
                    <th className="py-3.5 px-4">Target Pekerjaan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi / Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {visibleCategories.map((cat) => (
                    <React.Fragment key={`cat-fragment-${cat.id}`}>
                      {/* Section Header Row for Status Group */}
                      <tr key={`group-header-${cat.id}`} className={cat.headerClass}>
                        <td colSpan={7} className="py-2.5 px-4 font-black">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="shrink-0">{cat.icon}</span>
                              <span className="tracking-wider uppercase text-[10px]">{cat.title}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cat.badgeClass}`}>
                              {cat.items.length} Berkas
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* SPK rows belonging to this group */}
                      {cat.items.map((spk) => (
                        <tr 
                          key={spk.id}
                          onClick={() => handleOpenSpkEditor(spk)}
                          className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="font-extrabold text-blue-400">{spk.nomorSpk}</div>
                            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>📅 {spk.tanggal}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-white">{spk.jenisPekerjaan}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{spk.kategoriHeader}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">⚡ {spk.penyulang}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{spk.lokasi}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-200">
                              {spk.personnel.slice(0, 2).join(', ')}
                              {spk.personnel.length > 2 && <span className="text-slate-400 font-normal"> +{spk.personnel.length - 2} lainnya</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">{spk.personnel.length} Orang Tim</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-white">🎯 {spk.target || '-'}</div>
                            <div className="text-[10px] font-bold text-blue-400">Target PK</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                              (spk.statusPekerjaan === 'Rencana' || spk.statusPekerjaan === 'Terencana') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                              spk.statusPekerjaan === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              (spk.statusPekerjaan === 'Selesai (Dengan Catatan)' || spk.statusPekerjaan === 'Selesai Dengan catatan' || spk.statusPekerjaan?.includes('catatan')) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                              (spk.statusPekerjaan === 'Dalam Proses' || spk.statusPekerjaan === 'Dalam Progres' || spk.statusPekerjaan?.includes('Progres')) ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              spk.statusPekerjaan === 'Dibatalkan' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {spk.statusPekerjaan}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(spk);
                                  setShowPrintModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 font-bold text-xs flex items-center gap-1 border border-blue-500/30 cursor-pointer shadow-2xs active:scale-95"
                                title="Cetak SPK"
                              >
                                <Printer className="w-3.5 h-3.5 text-blue-400" />
                                <span>Cetak</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const waText = `📋 *SURAT PERINTAH KERJA (SPK) PEMELIHARAAN 20kV*\n*PLN ULP BAGUALA*\n━━━━━━━━━━━━━━━━━━━━\n📄 *No. SPK*: ${spk.nomorSpk || spk.id}\n📅 *Tanggal*: ${spk.tanggal}\n⚡ *Penyulang*: ${spk.penyulang || '-'}\n🔧 *Jenis Pekerjaan*: ${spk.jenisPekerjaan || '-'}\n📍 *Lokasi*: ${spk.lokasi || '-'}\n🎯 *Target*: ${spk.target || '-'}\n👷‍♂️ *Personel*: ${(spk.personnel || []).filter(Boolean).join(', ')}\n━━━━━━━━━━━━━━━━━━━━\n_Safety First - Bekerja Sesuai SOP K3!_`;
                                  const encoded = encodeURIComponent(waText);
                                  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
                                }}
                                className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 font-bold text-xs flex items-center gap-1 border border-emerald-500/30 cursor-pointer shadow-2xs active:scale-95"
                                title="Kirim SPK via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                <span>WA</span>
                              </button>
                              
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSpk(spk.id, e)}
                                className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-colors cursor-pointer shadow-2xs active:scale-95"
                                title="Hapus SPK"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {filteredSpks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="w-8 h-8 text-slate-600" />
                          <span>Belum ada dokumen SPK atau pencarian Anda tidak cocok dengan data apapun.</span>
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

      {/* Offscreen Printable Document Container (ALWAYS present in DOM, used for high-fidelity PDF download in both modes) */}
      <div id="printable-spk-monitoring-wrapper" className="fixed -left-[9999px] top-0 pointer-events-none print:static print:left-0 print:opacity-100 print:w-full z-[-100]">
            <div 
              ref={printRef}
              id="printable-spk-monitoring"
              className="w-[794px] bg-white text-black p-8 font-sans relative overflow-hidden select-text text-black printable-spk-document"
              style={{ minHeight: '1000px', color: '#000000', backgroundColor: '#ffffff' }}
            >
              {/* Background Diagonal Watermark */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none rotate-[-30deg]"
                style={{ fontSize: '48px', fontWeight: '900', color: '#000' }}
              >
                PT PLN (Persero) UP3 Ambon
              </div>

              {/* HEADER BOX */}
              <div className="border-2 border-black w-full mb-3 text-black">
                <div className="flex border-b-2 border-black w-full">
                  <div className="w-[66.666%] p-2 border-r-2 border-black flex items-center gap-3">
                    {/* High-quality Vector PLN Logo */}
                    <svg viewBox="0 0 100 135" className="w-10 h-13 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="100" height="100" fill="#FFE300" />
                      <path d="M 20,33 C 30,25 40,41 50,33 C 60,25 70,41 80,33" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                      <path d="M 20,49 C 30,41 40,57 50,49 C 60,41 70,57 80,49" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                      <path d="M 20,65 C 30,57 40,73 50,65 C 60,57 70,73 80,65" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                      <polygon points="68,10 26,56 53,56 42,90 76,44 49,44" fill="#FF0000" />
                      <text x="50" y="128" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="28" fill="#0096D6" textAnchor="middle" letterSpacing="3">PLN</text>
                    </svg>

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
                  <div className="w-[33.333%] p-1 flex items-center justify-center">
                    {/* High-quality Vector SMK3 Indonesian standard OHS Gear & Cross Logo */}
                    <svg viewBox="0 0 120 120" className="w-[72px] h-[72px] shrink-0" xmlns="http://www.w3.org/2000/svg">
                      {/* Teeth of the gear (11 teeth) */}
                      <g transform="translate(60, 42)">
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(0)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(32.73)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(65.45)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(98.18)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(130.91)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(163.64)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(196.36)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(229.09)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(261.82)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(294.55)" />
                        <rect x="-4" y="-36" width="8" height="15" rx="1.5" fill="#009B4F" transform="rotate(327.27)" />
                      </g>
                      {/* Main outer rim of the gear wheel */}
                      <circle cx="60" cy="42" r="26" fill="#009B4F" />
                      {/* Inner white circle */}
                      <circle cx="60" cy="42" r="17" fill="white" />
                      {/* Green cross in the center */}
                      <rect x="57" y="31" width="6" height="22" rx="1" fill="#009B4F" />
                      <rect x="49" y="39" width="22" height="6" rx="1" fill="#009B4F" />
                      {/* Texts below the gear */}
                      <text x="60" y="82" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontWeight="900" fontSize="7.5" fill="#009B4F" textAnchor="middle" letterSpacing="0.2">SISTEM MANAJEMEN</text>
                      <text x="60" y="91" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontWeight="900" fontSize="6.2" fill="#009B4F" textAnchor="middle" letterSpacing="0.05">KESELAMATAN &amp; KESEHATAN KERJA</text>
                      <text x="60" y="102" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontWeight="900" fontSize="9" fill="#009B4F" textAnchor="middle" letterSpacing="0.5">(SMK3)</text>
                    </svg>
                  </div>
                </div>

                <div className="flex text-black w-full">
                  <div className="w-[66.666%] p-2 border-r-2 border-black font-extrabold text-center text-sm uppercase tracking-wider flex items-center justify-center">
                    FORMULIR PERINTAH KERJA
                  </div>
                  <div className="w-[33.333%] p-2 text-xs font-bold flex items-center justify-start gap-1">
                    <span>Tanggal</span>
                    <span>:</span>
                    <span className="font-extrabold">{formData.tanggal}</span>
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT BORDER BOX */}
              <div className="border-2 border-black w-full p-4 space-y-4 text-black text-xs leading-relaxed min-h-[750px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-2 border-b border-black/20 pb-2">
                    <div className="font-extrabold text-xs uppercase tracking-wide">
                      {formData.nomorSpk || 'NO. ....................................................'}
                    </div>
                    <div className="flex items-center justify-between text-xs font-extrabold pt-1">
                      <div>
                        <span>Pemberi Perintah: </span>
                        <span className="text-blue-900">{formData.tlTeknikTitle || 'TL TEKNIK'}</span>
                      </div>
                      <div>
                        <span className="underline font-black">{formData.tlTeknikName || '...........................................'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="font-black text-sm uppercase text-center tracking-wide my-1">
                    {formData.kategoriHeader}
                  </div>

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

                  <div className="font-extrabold text-xs pt-1">
                    Untuk melaksanakan {formData.kategoriHeader.toLowerCase()}
                  </div>

                  {/* Checklist 1 - 10 */}
                  <div className="flex flex-wrap w-full py-1 text-xs font-bold">
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">1</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.jtm ? '✓' : ''}
                      </span>
                      <span>JTM</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">6</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.tiangTr ? '✓' : ''}
                      </span>
                      <span>Tiang TR & aksesoris</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">2</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.jtr ? '✓' : ''}
                      </span>
                      <span>JTR</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">7</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.row ? '✓' : ''}
                      </span>
                      <span>ROW</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">3</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.garduHubung ? '✓' : ''}
                      </span>
                      <span>Gardu Hubung</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">8</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.inspeksi ? '✓' : ''}
                      </span>
                      <span>INSPEKSI</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">4</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.garduTrafo ? '✓' : ''}
                      </span>
                      <span>Gardu Trafo</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">9</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.survey ? '✓' : ''}
                      </span>
                      <span>SURVEY</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">5</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.tiangTm ? '✓' : ''}
                      </span>
                      <span>Tiang TM & aksesoris</span>
                    </div>
                    <div className="w-1/2 flex items-center gap-2 pb-1.5">
                      <span className="w-4 text-right">10</span>
                      <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                        {formData.checklist.customChecked ? '✓' : ''}
                      </span>
                      <span>{formData.checklist.customText || '__________'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 font-bold text-xs">
                    <div className="flex w-full">
                      <span className="w-[25%] font-black">Jenis pekerjaan</span>
                      <span className="w-[5%] text-center font-black">:</span>
                      <span className="w-[70%] font-extrabold">{formData.jenisPekerjaan}</span>
                    </div>
                    <div className="flex w-full">
                      <span className="w-[25%] font-black">Penyulang</span>
                      <span className="w-[5%] text-center font-black">:</span>
                      <span className="w-[70%] font-extrabold">{formData.penyulang}</span>
                    </div>
                    <div className="flex w-full">
                      <span className="w-[25%] font-black">Section</span>
                      <span className="w-[5%] text-center font-black">:</span>
                      <span className="w-[70%] font-extrabold">{formData.section || '-'}</span>
                    </div>
                    <div className="flex w-full">
                      <span className="w-[25%] font-black">Lokasi</span>
                      <span className="w-[5%] text-center font-black">:</span>
                      <span className="w-[70%] font-extrabold whitespace-pre-line leading-relaxed">
                        {formData.lokasi}
                      </span>
                    </div>
                    <div className="flex w-full">
                      <span className="w-[25%] font-black">Target</span>
                      <span className="w-[5%] text-center font-black">:</span>
                      <span className="w-[70%] font-extrabold">{formData.target}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex w-full justify-center text-center text-xs font-extrabold pt-2">
                    <div className="w-1/2 flex flex-col items-center justify-between min-h-[110px]">
                      <div>
                        <div>Mengetahui</div>
                        <div className="text-[11px] font-black text-slate-900">{formData.managerTitle || 'Manager ULP'}</div>
                      </div>
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
                      <div className="underline font-black">{formData.managerName || '...........................................'}</div>
                    </div>
                  </div>

                  <div className="border-t border-black/40 pt-2 text-[11px] font-extrabold">
                    <div className="mb-1 uppercase tracking-wide">Status pekerjaan</div>
                    <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1.5 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                          {(formData.statusPekerjaan === 'Rencana' || formData.statusPekerjaan === 'Terencana') ? '✓' : ''}
                        </span>
                        <span>Terencana</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                          {(formData.statusPekerjaan === 'Dalam Progres (On Progress)' || formData.statusPekerjaan === 'Dalam Proses' || formData.statusPekerjaan === 'Dalam Progres') ? '✓' : ''}
                        </span>
                        <span>Dalam Progres</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                          {formData.statusPekerjaan === 'Selesai' ? '✓' : ''}
                        </span>
                        <span>Selesai</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                          {(formData.statusPekerjaan === 'Selesai (Dengan Catatan)' || formData.statusPekerjaan === 'Selesai Dengan catatan' || formData.statusPekerjaan?.includes('catatan')) ? '✓' : ''}
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
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                          {formData.statusPekerjaan === 'Dibatalkan' ? '✓' : ''}
                        </span>
                        <span>Dibatalkan</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* VIEW MODE 2: FORM SPK EDITOR & A4 PRINT PREVIEW */}
      {currentMode === 'editor' && (
        <div className="space-y-6">

          {/* Top Return & Control Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-md flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentMode('monitoring')}
                className="px-3.5 py-2 bg-[#070e1e] hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>Kembali ke Monitoring SPK</span>
              </button>

              <div className="hidden sm:block h-6 w-px bg-slate-700" />

              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  Formulir & Preview SPK Official
                </h2>
                <p className="text-[11px] text-slate-400">
                  <span className="font-extrabold text-blue-400">{formData.nomorSpk}</span> • Pemberi Perintah: <strong className="text-slate-200">{formData.tlTeknikName}</strong>
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeleteSpk(formData.id)}
                className="px-3.5 py-2 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-rose-500/30 cursor-pointer active:scale-95"
                title="Hapus Dokumen SPK Ini"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Hapus SPK</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToSystem}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Simpan SPK</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Form Controls Left + Live Paper Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: EDITOR FORM CONTROLS (Hide when printing) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c162d] border border-slate-800/90 space-y-4 no-print shadow-md">
              <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Input & Edit Isian SPK</span>
                </h3>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded">
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
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
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
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Kategori Header
                    </label>
                    <select
                      value={formData.kategoriHeader}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isInspeksi = val === 'INSPEKSI JARINGAN DISTRIBUSI';
                        const isPerambasan = val.includes('PERAMBASAN') || val.includes('ROW');
                        const isPemeliharaan = val === 'PEMELIHARAAN JARINGAN DISTRIBUSI';

                        let nextMiddle = 'PK.TEK/ROW/ULP.BGL';
                        if (isPerambasan) {
                          nextMiddle = 'PK.TEK/ROW/ULP.BGL';
                        } else if (isInspeksi) {
                          nextMiddle = 'PK.TEK/INS/ULP.BGL';
                        } else if (isPemeliharaan) {
                          nextMiddle = 'PK.TEK/HAR/ULP.BGL';
                        }

                        // Parse current nomorSpk and build new one with nextMiddle
                        const parsed = parseNomorSpk(formData.nomorSpk, formData.kategoriHeader);
                        const nextNomorSpk = `${parsed.nomorUrut}/${nextMiddle}/${parsed.bulan}/${parsed.tahun}`;

                        let nextPersonnel: string[] = [];
                        let nextJenisPekerjaan = '';

                        if (isPerambasan) {
                          nextPersonnel = [...DEFAULT_ROW_PERSONNEL];
                          nextJenisPekerjaan = 'Perambasan Pohon (ROW)';
                        } else if (isInspeksi) {
                          nextPersonnel = [...DEFAULT_INSPEKSI_PERSONNEL];
                          nextJenisPekerjaan = 'Inspeksi Jaringan Distribusi';
                        } else if (isPemeliharaan) {
                          nextPersonnel = [];
                          nextJenisPekerjaan = 'Pemeliharaan Jaringan Distribusi';
                        }

                        setFormData(prev => ({
                          ...prev,
                          kategoriHeader: val,
                          nomorSpk: nextNomorSpk,
                          personnel: isPemeliharaan ? [] : (nextPersonnel.length > 0 ? nextPersonnel : prev.personnel),
                          jenisPekerjaan: nextJenisPekerjaan || prev.jenisPekerjaan,
                          checklist: {
                            ...prev.checklist,
                            row: isPerambasan ? true : false,
                            inspeksi: (isInspeksi || isPemeliharaan) ? true : false
                          }
                        }));
                      }}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="PEMELIHARAAN JARINGAN DISTRIBUSI">PEMELIHARAAN JARINGAN DISTRIBUSI</option>
                      <option value="INSPEKSI JARINGAN DISTRIBUSI">INSPEKSI JARINGAN DISTRIBUSI</option>
                      <option value="PERAMBASAN POHON (ROW)">PERAMBASAN POHON (ROW)</option>
                    </select>
                  </div>
                </div>

                {/* Segmented & Combined Nomor SPK Fields */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-slate-400 block">
                    Konfigurasi Nomor Dokumen SPK
                  </label>
                  
                  {/* Segmented Sub-Inputs */}
                  <div className="grid grid-cols-12 gap-1 bg-[#070e1e] p-1.5 rounded-xl border border-slate-800">
                    
                    {/* 1. Nomor Urut Input (Manual) */}
                    <div className="col-span-3">
                      <span className="text-[9px] font-bold text-slate-400 block mb-0.5 px-1 uppercase tracking-wider">No. Urut</span>
                      <input
                        type="text"
                        placeholder="Contoh: 013"
                        value={parseNomorSpk(formData.nomorSpk, formData.kategoriHeader).nomorUrut}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          const parsed = parseNomorSpk(formData.nomorSpk, formData.kategoriHeader);
                          const nextNomor = `${val}/${parsed.tengah}/${parsed.bulan}/${parsed.tahun}`;
                          setFormData({ ...formData, nomorSpk: nextNomor });
                        }}
                        className="w-full p-1.5 text-xs font-black text-center rounded-lg bg-[#0c162d] border border-slate-700 text-white focus:ring-1 focus:ring-blue-500"
                        title="Input Nomor Urut SPK (Manual)"
                      />
                    </div>

                    {/* Slash Separator */}
                    <div className="col-span-1 flex items-end justify-center pb-2 text-xs font-bold text-slate-400">
                      /
                    </div>

                    {/* 2. Kategori Tengah (Auto-filled) */}
                    <div className="col-span-4">
                      <span className="text-[9px] font-bold text-slate-400 block mb-0.5 px-1 uppercase tracking-wider">Kategori</span>
                      <div className="w-full p-1.5 text-[10px] font-extrabold text-center rounded-lg bg-[#0c162d] border border-slate-700 text-blue-400 truncate" title="Bagian Tengah (Terisi Otomatis)">
                        {parseNomorSpk(formData.nomorSpk, formData.kategoriHeader).tengah}
                      </div>
                    </div>

                    {/* Slash Separator */}
                    <div className="col-span-1 flex items-end justify-center pb-2 text-xs font-bold text-slate-400">
                      /
                    </div>

                    {/* 3. Bulan Romawi Dropdown (Manual) */}
                    <div className="col-span-3">
                      <span className="text-[9px] font-bold text-slate-400 block mb-0.5 px-1 uppercase tracking-wider">Bulan</span>
                      <select
                        value={parseNomorSpk(formData.nomorSpk, formData.kategoriHeader).bulan}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parsed = parseNomorSpk(formData.nomorSpk, formData.kategoriHeader);
                          const nextNomor = `${parsed.nomorUrut}/${parsed.tengah}/${val}/${parsed.tahun}`;
                          setFormData({ ...formData, nomorSpk: nextNomor });
                        }}
                        className="w-full p-1.5 text-xs font-black text-center rounded-lg bg-[#0c162d] border border-slate-700 text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        title="Pilih Bulan Romawi (Manual)"
                      >
                        <option value="">Pilih Bulan</option>
                        {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(rom => (
                          <option key={rom} value={rom}>{rom}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* 4. Combined Full Preview Input */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Pratinjau Nomor SPK Lengkap</span>
                    <input
                      type="text"
                      value={formData.nomorSpk}
                      onChange={(e) => setFormData({ ...formData, nomorSpk: e.target.value })}
                      className="w-full p-2 text-xs font-black rounded-xl border bg-[#070e1e] border-slate-700 text-white"
                      placeholder="Format: 013/PK.TEK/ROW/ULP.BGL/VIII/2026"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-400">
                      Pemberi Perintah: TL TEKNIK
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Pemberi Perintah (TL Teknik)</label>
                    <input
                      type="text"
                      value={formData.tlTeknikName}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tlTeknikName: e.target.value, 
                        tlTeknikTitle: 'TL TEKNIK' 
                      })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan Nama Pemberi Perintah (TL Teknik)..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Personel List */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>2. Di Perintahkan Kepada (Personel)</span>
                  <span className="text-[10px] font-bold text-blue-400">{formData.personnel.length} Orang</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {formData.personnel.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#070e1e] p-2 rounded-xl border border-slate-800">
                      <span className="w-5 text-center font-bold text-xs text-slate-500">{idx + 1}.</span>
                      <input
                        type="text"
                        value={person}
                        onChange={(e) => {
                          const updated = [...formData.personnel];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, personnel: updated });
                        }}
                        className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleRemovePersonnel(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
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
                    className="flex-1 p-2 text-xs rounded-xl border bg-[#070e1e] border-slate-700 text-white placeholder-slate-500"
                  />
                  <button
                    onClick={handleAddPersonnel}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Checklist Scope */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  3. Lingkup Pelaksanaan ( Checklist 1 - 10 )
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.jtm}
                      onChange={() => handleToggleChecklist('jtm')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">1. JTM</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.tiangTr}
                      onChange={() => handleToggleChecklist('tiangTr')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">6. Tiang TR & aksesoris</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.jtr}
                      onChange={() => handleToggleChecklist('jtr')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">2. JTR</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.row}
                      onChange={() => handleToggleChecklist('row')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">7. ROW</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.garduHubung}
                      onChange={() => handleToggleChecklist('garduHubung')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">3. Gardu Hubung</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.inspeksi}
                      onChange={() => handleToggleChecklist('inspeksi')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">8. INSPEKSI</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.garduTrafo}
                      onChange={() => handleToggleChecklist('garduTrafo')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">4. Gardu Trafo</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.survey}
                      onChange={() => handleToggleChecklist('survey')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">9. SURVEY</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border bg-[#070e1e] border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.checklist.tiangTm}
                      onChange={() => handleToggleChecklist('tiangTm')}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-200">5. Tiang TM & aksesoris</span>
                  </label>

                  {/* Point 10: Manual Input Toggle */}
                  <div className="col-span-2 p-2.5 rounded-xl border bg-[#070e1e] border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist.customChecked}
                        onChange={() => handleToggleChecklist('customChecked')}
                        className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-xs text-slate-200">
                        10. Lainnya (Klik untuk input)
                      </span>
                    </label>
                    {formData.checklist.customChecked && (
                      <input
                        type="text"
                        placeholder="Ketik deskripsi lingkup manual..."
                        value={formData.checklist.customText}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          checklist: {
                            ...prev.checklist,
                            customText: e.target.value
                          }
                        }))}
                        className="w-full p-2 text-xs font-bold rounded-lg border bg-[#0c162d] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Detail Pekerjaan */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  4. Detail Deskripsi Pekerjaan
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Jenis pekerjaan</label>
                  <input
                    type="text"
                    value={formData.jenisPekerjaan}
                    onChange={(e) => setFormData({ ...formData, jenisPekerjaan: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Penyulang (Pilihan Berdaftar)
                  </label>
                  <select
                    value={formData.penyulang}
                    onChange={(e) => setFormData({ ...formData, penyulang: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Pilih Penyulang</option>
                    {REGISTERED_PENYULANG.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                    {formData.penyulang && !REGISTERED_PENYULANG.includes(formData.penyulang) && (
                      <option value={formData.penyulang}>{formData.penyulang}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Section</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Lokasi Detail</label>
                  <textarea
                    rows={2}
                    placeholder=""
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 block">
                    Target Pekerjaan
                  </label>

                  {/* Choice Radio / Centang: Volume vs kms */}
                  <div className="flex items-center gap-4 p-2 rounded-xl bg-[#070e1e] border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200 hover:text-blue-400 transition-colors">
                      <input
                        type="radio"
                        name="targetTypeRadio"
                        checked={targetType === 'volume'}
                        onChange={() => updateTarget(targetValue, 'volume')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Volume</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200 hover:text-blue-400 transition-colors">
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
                      placeholder={targetType === 'kms' ? "Masukkan angka (misal: 15)" : "Masukkan angka (misal: 20)"}
                      value={targetValue}
                      onChange={(e) => updateTarget(e.target.value, targetType)}
                      className="w-full p-2 pr-28 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-2 px-2 py-1 rounded-md bg-emerald-500/20 text-[10px] font-black text-emerald-300 pointer-events-none uppercase border border-emerald-500/30">
                      {targetType === 'kms' ? 'kms' : 'Titik Pohon'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Pejabat Penandatangan & Persetujuan */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  5. Pejabat Penandatangan & Persetujuan
                </div>

                {/* Manager Approval Control */}
                <button
                  type="button"
                  onClick={handleToggleApproveManager}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    Boolean(formData.isApprovedManager)
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${Boolean(formData.isApprovedManager) ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {Boolean(formData.isApprovedManager) ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-black uppercase tracking-wider">
                        {Boolean(formData.isApprovedManager) ? 'MANAGER: APPROVED (QR CODE)' : 'MANAGER: PENDING APPROVAL'}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">
                        Persetujuan Manager ULP (Scan QR Code: &quot;Approve&quot;)
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase ${
                    Boolean(formData.isApprovedManager) ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                  }`}>
                    {Boolean(formData.isApprovedManager) ? 'QR Disetujui' : 'Menunggu'}
                  </span>
                </button>

                <div className="p-3 rounded-xl bg-[#070e1e] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-300">
                      Mengetahui: MANAGER ULP
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Nama Manager ULP</label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        managerName: e.target.value, 
                        managerTitle: 'Manager ULP' 
                      })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-[#0c162d] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan Nama Manager ULP..."
                    />
                  </div>
                </div>
              </div>

              {/* Status Pekerjaan Option */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  6. Status Pekerjaan
                </label>
                <select
                  value={formData.statusPekerjaan}
                  onChange={(e) => setFormData({ ...formData, statusPekerjaan: e.target.value })}
                  className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white"
                >
                  <option value="Terencana">Terencana</option>
                  <option value="Dalam Progres">Dalam Progres</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Selesai (Dengan Catatan)">Selesai (Dengan Catatan)</option>
                  <option value="Pending">Pending</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>

                {(formData.statusPekerjaan === 'Selesai (Dengan Catatan)' || formData.statusPekerjaan?.includes('catatan')) && (
                  <div className="space-y-1 mt-2">
                    <label className="text-[10px] font-bold text-slate-400 block">
                      Catatan Manual Status Pekerjaan:
                    </label>
                    <input
                      type="text"
                      placeholder="Ketik catatan manual disini..."
                      value={formData.catatanStatus || ''}
                      onChange={(e) => setFormData({ ...formData, catatanStatus: e.target.value })}
                      className="w-full p-2 text-xs font-bold rounded-xl border bg-[#070e1e] border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
                id="printable-spk-editor"
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
                  <div className="flex border-b-2 border-black w-full">
                    
                    {/* Left Logo & Name */}
                    <div className="w-[66.666%] p-2 border-r-2 border-black flex items-center gap-3">
                      {/* High-quality Vector PLN Logo */}
                      <svg viewBox="0 0 100 135" className="w-10 h-13 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="100" height="100" fill="#FFE300" />
                        <path d="M 20,33 C 30,25 40,41 50,33 C 60,25 70,41 80,33" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                        <path d="M 20,49 C 30,41 40,57 50,49 C 60,41 70,57 80,49" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                        <path d="M 20,65 C 30,57 40,73 50,65 C 60,57 70,73 80,65" fill="none" stroke="#0096D6" strokeWidth="6.5" strokeLinecap="round" />
                        <polygon points="68,10 26,56 53,56 42,90 76,44 49,44" fill="#FF0000" />
                        <text x="50" y="128" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="28" fill="#0096D6" textAnchor="middle" letterSpacing="3">PLN</text>
                      </svg>

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
                    <div className="w-[33.333%] p-1.5 flex items-center justify-center">
                      <Smk3Logo className="w-full max-w-[150px] max-h-[82px] object-contain" />
                    </div>
                  </div>

                  {/* Title & Date Row */}
                  <div className="flex text-black w-full">
                    <div className="w-[66.666%] p-2 border-r-2 border-black font-extrabold text-center text-sm uppercase tracking-wider flex items-center justify-center">
                      FORMULIR PERINTAH KERJA
                    </div>
                    <div className="w-[33.333%] p-2 text-xs font-bold flex items-center justify-start gap-1">
                      <span>Tanggal</span>
                      <span>:</span>
                      <span className="font-extrabold">{formData.tanggal}</span>
                    </div>
                  </div>
                </div>

                {/* MAIN CONTENT BORDER BOX */}
                <div className="border-2 border-black w-full p-4 space-y-4 text-black text-xs leading-relaxed min-h-[750px] flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    {/* Document Number & Pemberi Perintah */}
                    <div className="space-y-2 border-b border-black/20 pb-2">
                      <div className="font-extrabold text-xs uppercase tracking-wide">
                        {formData.nomorSpk || 'NO. ....................................................'}
                      </div>
                      <div className="flex items-center justify-between text-xs font-extrabold pt-1">
                        <div>
                          <span>Pemberi Perintah: </span>
                          <span className="text-blue-900">{formData.tlTeknikTitle || 'TL TEKNIK'}</span>
                        </div>
                        <div>
                          <span className="underline font-black">{formData.tlTeknikName || '...........................................'}</span>
                        </div>
                      </div>
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
                    <div className="flex flex-wrap w-full py-1 text-xs font-bold">
                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">1</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.jtm ? '✓' : ''}
                        </span>
                        <span>JTM</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">6</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.tiangTr ? '✓' : ''}
                        </span>
                        <span>Tiang TR & aksesoris</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">2</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.jtr ? '✓' : ''}
                        </span>
                        <span>JTR</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">7</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.row ? '✓' : ''}
                        </span>
                        <span>ROW</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">3</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.garduHubung ? '✓' : ''}
                        </span>
                        <span>Gardu Hubung</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">8</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.inspeksi ? '✓' : ''}
                        </span>
                        <span>INSPEKSI</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">4</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.garduTrafo ? '✓' : ''}
                        </span>
                        <span>Gardu Trafo</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">9</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.survey ? '✓' : ''}
                        </span>
                        <span>SURVEY</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">5</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.tiangTm ? '✓' : ''}
                        </span>
                        <span>Tiang TM & aksesoris</span>
                      </div>

                      <div className="w-1/2 flex items-center gap-2 pb-1.5">
                        <span className="w-4 text-right">10</span>
                        <span className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white text-[10px] font-bold shrink-0">
                          {formData.checklist.customChecked ? '✓' : ''}
                        </span>
                        <span>{formData.checklist.customText || '__________'}</span>
                      </div>
                    </div>

                    {/* Details Key Value List */}
                    <div className="space-y-1.5 pt-2 font-bold text-xs">
                      <div className="flex w-full">
                        <span className="w-[25%] font-black">Jenis pekerjaan</span>
                        <span className="w-[5%] text-center font-black">:</span>
                        <span className="w-[70%] font-extrabold">{formData.jenisPekerjaan}</span>
                      </div>

                      <div className="flex w-full">
                        <span className="w-[25%] font-black">Penyulang</span>
                        <span className="w-[5%] text-center font-black">:</span>
                        <span className="w-[70%] font-extrabold">{formData.penyulang}</span>
                      </div>

                      <div className="flex w-full">
                        <span className="w-[25%] font-black">Section</span>
                        <span className="w-[5%] text-center font-black">:</span>
                        <span className="w-[70%] font-extrabold">{formData.section || '-'}</span>
                      </div>

                      <div className="flex w-full">
                        <span className="w-[25%] font-black">Lokasi</span>
                        <span className="w-[5%] text-center font-black">:</span>
                        <span className="w-[70%] font-extrabold whitespace-pre-line leading-relaxed">
                          {formData.lokasi}
                        </span>
                      </div>

                      <div className="flex w-full">
                        <span className="w-[25%] font-black">Target</span>
                        <span className="w-[5%] text-center font-black">:</span>
                        <span className="w-[70%] font-extrabold">{formData.target}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Signatures & Status Section */}
                  <div className="pt-4 space-y-4">
                    
                    {/* SIGNATURE BLOCK (1 Signatory: Manager ULP on bottom-right) */}
                    <div className="flex w-full justify-end text-center text-xs font-extrabold pt-2">
                      
                      {/* Mengetahui MANAGER ULP */}
                      <div className="w-1/2 flex flex-col items-center justify-between min-h-[110px]">
                        <div>
                          <div>Mengetahui</div>
                          <div className="text-[11px] font-black text-slate-900">{formData.managerTitle || 'Manager ULP'}</div>
                        </div>

                        {/* QR Code Signature for Approved State (Scans to: "Approve") */}
                        <div className="my-1.5 min-w-[120px] flex items-center justify-center">
                          {Boolean(formData.isApprovedManager) ? (
                            <div className="flex flex-col items-center justify-center p-0.5">
                              <ApproveQrCode size={64} text="Approve" />
                            </div>
                          ) : (
                            <div className="h-16 flex items-center justify-center text-[9px] font-bold text-amber-700 italic border border-dashed border-amber-300 rounded-lg px-2 bg-amber-50/50">
                              [ MENUNGGU APPROVAL ]
                            </div>
                          )}
                        </div>

                        <div className="underline font-black">{formData.managerName || '...........................................'}</div>
                      </div>

                    </div>

                    {/* Status Pekerjaan Bottom Checkboxes */}
                    <div className="border-t border-black/40 pt-2 text-[11px] font-extrabold">
                      <div className="mb-1 uppercase tracking-wide">Status pekerjaan</div>
                      <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1.5 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {(formData.statusPekerjaan === 'Rencana' || formData.statusPekerjaan === 'Terencana') ? '✓' : ''}
                          </span>
                          <span>Terencana</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {(formData.statusPekerjaan === 'Dalam Progres (On Progress)' || formData.statusPekerjaan === 'Dalam Proses' || formData.statusPekerjaan === 'Dalam Progres' || formData.statusPekerjaan?.includes('Progres') || formData.statusPekerjaan?.includes('Progress')) ? '✓' : ''}
                          </span>
                          <span>Dalam Progres</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {formData.statusPekerjaan === 'Selesai' ? '✓' : ''}
                          </span>
                          <span>Selesai</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {(formData.statusPekerjaan === 'Selesai (Dengan Catatan)' || formData.statusPekerjaan === 'Selesai Dengan catatan' || formData.statusPekerjaan?.includes('catatan')) ? '✓' : ''}
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

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] font-bold bg-white">
                            {formData.statusPekerjaan === 'Dibatalkan' ? '✓' : ''}
                          </span>
                          <span>Dibatalkan</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 no-print">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl border bg-[#0c162d] border-slate-800 text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Cetak / Download SPK</h3>
                  <p className="text-[11px] text-slate-400 font-semibold truncate max-w-[240px]">
                    {formData.nomorSpk}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Pilih opsi output yang Anda inginkan untuk Surat Perintah Kerja ini:
            </p>

            <div className="space-y-3">
              {/* Option 1: Download PDF File */}
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleDownloadPdf}
                className="w-full p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-left flex items-start gap-3.5 transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                  {isExportingPdf ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Download className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs sm:text-sm text-emerald-200 flex items-center gap-2">
                    <span>Download File PDF (.pdf)</span>
                    <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-black">
                      Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 font-medium leading-snug">
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
                className="w-full p-4 rounded-xl border-2 border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/50 text-left flex items-start gap-3.5 transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Printer className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs sm:text-sm text-blue-200">
                    Cetak Langsung (Printer)
                  </div>
                  <p className="text-[11px] text-blue-300/80 font-medium leading-snug">
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
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
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
