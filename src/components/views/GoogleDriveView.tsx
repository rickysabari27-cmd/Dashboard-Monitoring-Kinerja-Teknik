import React, { useState, useEffect, useRef } from 'react';
import { 
  HardDrive, 
  FolderPlus, 
  Upload, 
  RefreshCw, 
  Search, 
  FileText, 
  Folder, 
  FileSpreadsheet, 
  FileImage, 
  FileCode, 
  File, 
  Download, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  ChevronRight, 
  Home, 
  Grid, 
  List, 
  AlertCircle, 
  CheckCircle2, 
  LogOut, 
  Database, 
  Sparkles,
  CloudUpload,
  Layers,
  Share2,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  Zap,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { 
  DriveFile, 
  DriveAboutInfo, 
  listDriveFiles, 
  createDriveFolder, 
  uploadFileToDrive, 
  deleteDriveFile, 
  exportJsonToDrive, 
  exportCsvToDrive,
  getDriveAbout,
  fetchDriveFileText
} from '../../services/googleDriveService';
import { 
  googleSignIn, 
  googleLogout, 
  hasActiveAccessToken, 
  getCurrentGoogleUser,
  initAuth 
} from '../../services/googleAuth';
import { 
  FeederTrip, 
  MasterFeeder, 
  MonthlySaidiSaifiData, 
  SpkTask, 
  GarduMeasurement,
  MasterSection 
} from '../../types';

interface GoogleDriveViewProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
  // Datasets available for quick export to Drive
  trips?: FeederTrip[];
  masterFeeders?: MasterFeeder[];
  masterSections?: MasterSection[];
  monthlySaidi?: MonthlySaidiSaifiData[];
  spkList?: SpkTask[];
  garduMeasurements?: GarduMeasurement[];
  onImportTrips?: (trips: FeederTrip[]) => void;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({
  isDarkMode,
  onShowToast,
  trips = [],
  masterFeeders = [],
  masterSections = [],
  monthlySaidi = [],
  spkList = [],
  garduMeasurements = [],
  onImportTrips
}) => {
  // Auth state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);

  // File explorer state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [currentFolder, setCurrentFolder] = useState<BreadcrumbItem>({ id: 'root', name: 'Drive Saya' });
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: 'root', name: 'Drive Saya' }]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mimeFilter, setMimeFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & Actions
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportDataset, setExportDataset] = useState<'trips' | 'feeders' | 'sections' | 'saidi' | 'spk' | 'gardu'>('trips');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Destructive Delete Confirmation Modal (MANDATORY per Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setIsConnected(true);
        loadDriveInfo();
        loadFiles('root');
      },
      () => {
        setIsConnected(false);
        setAboutInfo(null);
        setFiles([]);
      }
    );

    if (hasActiveAccessToken()) {
      setIsConnected(true);
      loadDriveInfo();
      loadFiles('root');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadDriveInfo = async () => {
    try {
      const about = await getDriveAbout();
      setAboutInfo(about);
    } catch (err) {
      console.warn('Failed to load drive about info:', err);
    }
  };

  const loadFiles = async (folderId: string = currentFolder.id, search: string = searchQuery, filter: string = mimeFilter) => {
    setIsLoadingFiles(true);
    try {
      const res = await listDriveFiles({
        folderId: search ? undefined : folderId,
        searchQuery: search,
        mimeTypeFilter: filter,
      });
      setFiles(res.files);
    } catch (err: any) {
      console.error('Error loading drive files:', err);
      onShowToast(`Gagal memuat file Google Drive: ${err.message || err}`);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setIsConnected(true);
        onShowToast(`Berhasil terhubung ke Google Drive sebagai ${res.user.displayName || res.user.email}!`);
        await loadDriveInfo();
        await loadFiles('root');
      }
    } catch (err: any) {
      console.error('Google login failed:', err);
      onShowToast(`Login Google gagal: ${err.message || 'Izin Google Drive diperlukan'}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await googleLogout();
      setIsConnected(false);
      setAboutInfo(null);
      setFiles([]);
      onShowToast('Sesi Google Drive ditutup.');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Navigate folder
  const handleOpenFolder = (folder: DriveFile) => {
    const newBreadcrumb: BreadcrumbItem = { id: folder.id, name: folder.name };
    const updated = [...breadcrumbs, newBreadcrumb];
    setBreadcrumbs(updated);
    setCurrentFolder(newBreadcrumb);
    setSearchQuery('');
    loadFiles(folder.id, '', mimeFilter);
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    const updated = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(updated);
    setCurrentFolder(item);
    setSearchQuery('');
    loadFiles(item.id, '', mimeFilter);
  };

  // Create folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await createDriveFolder(newFolderName.trim(), currentFolder.id);
      onShowToast(`Folder "${newFolderName}" berhasil dibuat di Google Drive!`);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      loadFiles(currentFolder.id);
    } catch (err: any) {
      onShowToast(`Gagal membuat folder: ${err.message || err}`);
    }
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const file = selectedFiles[0];

    try {
      await uploadFileToDrive(file, file.name, file.type, currentFolder.id);
      onShowToast(`File "${file.name}" berhasil diunggah ke Google Drive!`);
      loadFiles(currentFolder.id);
    } catch (err: any) {
      onShowToast(`Gagal upload: ${err.message || err}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Export App Data to Drive
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let dataToExport: any = [];
      let baseName = '';

      if (exportDataset === 'trips') {
        dataToExport = trips;
        baseName = `PLN_Baguala_Laporan_Gangguan_${timestamp}`;
      } else if (exportDataset === 'feeders') {
        dataToExport = masterFeeders;
        baseName = `PLN_Baguala_Master_Penyulang_${timestamp}`;
      } else if (exportDataset === 'sections') {
        dataToExport = masterSections;
        baseName = `PLN_Baguala_Master_Section_${timestamp}`;
      } else if (exportDataset === 'saidi') {
        dataToExport = monthlySaidi;
        baseName = `PLN_Baguala_SAIDI_SAIFI_${timestamp}`;
      } else if (exportDataset === 'spk') {
        dataToExport = spkList;
        baseName = `PLN_Baguala_Daftar_SPK_${timestamp}`;
      } else if (exportDataset === 'gardu') {
        dataToExport = garduMeasurements;
        baseName = `PLN_Baguala_Pengukuran_Gardu_${timestamp}`;
      }

      if (exportFormat === 'json') {
        await exportJsonToDrive(dataToExport, `${baseName}.json`, currentFolder.id);
      } else {
        // Convert to CSV
        if (Array.isArray(dataToExport) && dataToExport.length > 0) {
          const keys = Object.keys(dataToExport[0]);
          const csvRows = [
            keys.join(','),
            ...dataToExport.map(row => 
              keys.map(k => {
                const val = (row as any)[k];
                if (val === null || val === undefined) return '""';
                const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
                return `"${str.replace(/"/g, '""')}"`;
              }).join(',')
            )
          ];
          await exportCsvToDrive(csvRows.join('\n'), `${baseName}.csv`, currentFolder.id);
        } else {
          await exportCsvToDrive('No Data', `${baseName}.csv`, currentFolder.id);
        }
      }

      onShowToast(`Data berhasil diekspor ke Google Drive (${baseName}.${exportFormat})!`);
      setIsExportModalOpen(false);
      loadFiles(currentFolder.id);
    } catch (err: any) {
      onShowToast(`Gagal ekspor ke Drive: ${err.message || err}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Delete file (MANDATORY explicit confirmation dialog)
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      await deleteDriveFile(fileToDelete.id);
      onShowToast(`File "${fileToDelete.name}" berhasil dihapus dari Google Drive.`);
      setFileToDelete(null);
      loadFiles(currentFolder.id);
    } catch (err: any) {
      onShowToast(`Gagal menghapus file: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Web Link
  const handleCopyLink = (file: DriveFile) => {
    if (file.webViewLink) {
      navigator.clipboard.writeText(file.webViewLink);
      setCopiedId(file.id);
      setTimeout(() => setCopiedId(null), 2000);
      onShowToast('Link Google Drive berhasil disalin ke clipboard!');
    }
  };

  // Helper for file type formatting
  const getFileIcon = (file: DriveFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
    }
    if (file.mimeType.includes('spreadsheet') || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
    }
    if (file.mimeType.includes('document') || file.mimeType === 'application/pdf' || file.name.endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-blue-400" />;
    }
    if (file.mimeType.includes('image/') || file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return <FileImage className="w-8 h-8 text-purple-400" />;
    }
    if (file.name.match(/\.(kml|kmz|geojson|json|xml)$/i)) {
      return <FileCode className="w-8 h-8 text-cyan-400" />;
    }
    return <File className="w-8 h-8 text-slate-400" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '-';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '-';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Quota calculation
  const quotaLimit = aboutInfo?.storageQuota?.limit ? parseInt(aboutInfo.storageQuota.limit, 10) : 0;
  const quotaUsage = aboutInfo?.storageQuota?.usage ? parseInt(aboutInfo.storageQuota.usage, 10) : 0;
  const quotaPercent = quotaLimit > 0 ? Math.min(100, Math.round((quotaUsage / quotaLimit) * 100)) : 0;

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-4rem)] ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/40">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>Google Drive PLN 20kV</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400">
                  Workspace API v3
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Penyimpanan & Sinkronisasi Eviden Lapangan, Dokumen SPK, GIS KML, dan Laporan Keandalan Sistem
              </p>
            </div>
          </div>
        </div>

        {/* AUTHENTICATION STATUS / GSI BUTTON */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/70 rounded-2xl p-2 sm:px-4 shadow-md">
              {aboutInfo?.user?.photoLink ? (
                <img 
                  src={aboutInfo.user.photoLink} 
                  alt="Google Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full border border-cyan-400/40 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {aboutInfo?.user?.displayName || 'Google Drive Terhubung'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {aboutInfo?.user?.emailAddress || 'Akun Google Aktif'}
                </span>
              </div>
              <button
                onClick={handleGoogleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                title="Putuskan Hubungan Google Drive"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* OFFICIAL GSI MATERIAL BUTTON (Styled according to Google Identity Guidelines) */
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="gsi-material-button relative overflow-hidden px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xl shadow-blue-950/20 border border-slate-200 flex items-center gap-3 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="gsi-material-button-icon shrink-0">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents">
                {isLoggingIn ? 'Menghubungkan...' : 'Sign in with Google'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* STORAGE STATS & FAST ACTIONS (WHEN CONNECTED) */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Storage Quota Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kapasitas Google Drive</span>
              <HardDrive className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-extrabold text-white text-sm">
                  {formatFileSize(aboutInfo?.storageQuota?.usage)}
                </span>
                <span className="text-slate-400">
                  dari {quotaLimit > 0 ? formatFileSize(aboutInfo?.storageQuota?.limit) : 'Tak Terbatas'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${quotaPercent > 90 ? 'bg-rose-500' : quotaPercent > 75 ? 'bg-amber-400' : 'bg-cyan-500'}`}
                  style={{ width: `${quotaLimit > 0 ? quotaPercent : 5}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Status: {quotaPercent > 90 ? 'Hampir Penuh' : 'Optimal'}</span>
              <span className="font-semibold text-cyan-400">{quotaPercent}% terpakai</span>
            </div>
          </div>

          {/* Quick PLN Export Hub */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ekspor Data PLN ke Drive</span>
              <CloudUpload className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-slate-300 my-2">
              Simpan laporan gangguan, master data gardu, dan SAIDI/SAIFI langsung ke Google Drive sebagai arsip resmi.
            </p>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Ekspor Dataset PLN ke Drive</span>
            </button>
          </div>

          {/* Quick Drive Folder Creator */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kelola Berkas & Folder</span>
              <FolderPlus className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex gap-2 my-2">
              <button
                onClick={() => setIsCreateFolderOpen(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Buat Folder</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Mengunggah...' : 'Upload File'}</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              Lokasi aktif: <span className="text-white font-semibold">{currentFolder.name}</span>
            </span>
          </div>

        </div>
      )}

      {/* NON-CONNECTED HERO PROMPT */}
      {!isConnected && (
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-8 text-center space-y-6 max-w-2xl mx-auto shadow-2xl backdrop-blur-md my-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/30 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/10">
            <HardDrive className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Hubungkan Google Drive Anda
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Integrasikan Google Drive dengan sistem kelistrikan PLN ULP Baguala untuk mengelola eviden foto inspeksi Right of Way (ROW), dokumen Berita Acara, file GIS KML/KMZ penyulang, dan backup otomatis database gangguan 20kV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Eviden & Foto</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Arsip foto pohon & inspeksi thermo 20kV</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">File KML / GIS</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Simpan & muat trase jalur penyulang</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Laporan Otomatis</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Export rekapan SAIDI/SAIFI & SPK</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="gsi-material-button px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-xl shadow-blue-900/30 flex items-center gap-3 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="gsi-material-button-icon shrink-0">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span>{isLoggingIn ? 'Memproses Izin...' : 'Hubungkan dengan Google'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Akses Google Drive aman dengan permission langsung dari akun Google Anda.
            </span>
          </div>
        </div>
      )}

      {/* FILE EXPLORER TOOLBAR & VIEWS (WHEN CONNECTED) */}
      {isConnected && (
        <div className="space-y-4">
          
          {/* SEARCH, FILTER & ACTION BAR */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/85 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadFiles(currentFolder.id, e.target.value, mimeFilter);
                }}
                placeholder="Cari file atau dokumen di Google Drive..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/70 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-hidden focus:border-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    loadFiles(currentFolder.id, '', mimeFilter);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
              {[
                { id: '', label: 'Semua' },
                { id: 'folder', label: 'Folder' },
                { id: 'document', label: 'Dokumen / PDF' },
                { id: 'image', label: 'Foto / Eviden' },
                { id: 'gis', label: 'GIS & Data' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setMimeFilter(f.id);
                    loadFiles(currentFolder.id, searchQuery, f.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    mimeFilter === f.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher & Reload */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Tampilan Grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Tampilan List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => loadFiles(currentFolder.id, searchQuery, mimeFilter)}
                disabled={isLoadingFiles}
                className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                title="Muat Ulang Berkas"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

          </div>

          {/* BREADCRUMB NAVIGATION */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs py-1 px-1 custom-scrollbar">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                <button
                  onClick={() => handleBreadcrumbClick(b, idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    idx === breadcrumbs.length - 1
                      ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {idx === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate max-w-[160px]">{b.name}</span>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* FILE LISTING CONTAINER */}
          {isLoadingFiles ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-slate-400">Memuat berkas Google Drive...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800/60 p-8 space-y-3">
              <Folder className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-200">Tidak ada file atau folder ditemukan</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Folder ini masih kosong. Buat folder baru atau unggah berkas PLN.'}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setIsCreateFolderOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                >
                  + Buat Folder
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold"
                >
                  + Upload File
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => {
                const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                return (
                  <div
                    key={file.id}
                    className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-blue-500/40 p-4 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-blue-950/30 flex flex-col justify-between"
                  >
                    {/* Top Row: Icon, Name & Actions */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div 
                          onClick={() => isFolder && handleOpenFolder(file)}
                          className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 ${isFolder ? 'cursor-pointer group-hover:scale-105 transition-transform' : ''}`}
                        >
                          {getFileIcon(file)}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Buka di Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleCopyLink(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Salin Link"
                          >
                            {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Hapus File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* File Name */}
                      <div 
                        onClick={() => isFolder && handleOpenFolder(file)}
                        className={`font-bold text-xs sm:text-sm text-slate-100 truncate mb-1 ${isFolder ? 'cursor-pointer hover:text-cyan-400' : ''}`}
                        title={file.name}
                      >
                        {file.name}
                      </div>
                    </div>

                    {/* Footer Info: Size, Date & Action */}
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{isFolder ? 'Folder' : formatFileSize(file.size)}</span>
                      <span>{formatDate(file.modifiedTime)}</span>
                    </div>

                    {/* Double Click on Folder hint */}
                    {isFolder && (
                      <button
                        onClick={() => handleOpenFolder(file)}
                        className="w-full mt-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Buka Folder</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Berkas</th>
                      <th className="py-3 px-4">Tipe</th>
                      <th className="py-3 px-4">Ukuran</th>
                      <th className="py-3 px-4">Terakhir Diubah</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {files.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                      return (
                        <tr 
                          key={file.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="py-3 px-4 font-semibold text-slate-200">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => isFolder && handleOpenFolder(file)}
                                className={`shrink-0 ${isFolder ? 'cursor-pointer' : ''}`}
                              >
                                {getFileIcon(file)}
                              </div>
                              <span 
                                onClick={() => isFolder && handleOpenFolder(file)}
                                className={`truncate max-w-xs md:max-w-md ${isFolder ? 'cursor-pointer hover:text-cyan-400 font-bold' : ''}`}
                              >
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {isFolder ? 'Folder Google Drive' : file.mimeType.split('/').pop()?.toUpperCase()}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {isFolder ? '-' : formatFileSize(file.size)}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {formatDate(file.modifiedTime)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isFolder ? (
                                <button
                                  onClick={() => handleOpenFolder(file)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600/30 font-bold text-[11px]"
                                >
                                  Buka
                                </button>
                              ) : file.webViewLink ? (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                  title="Buka di Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : null}
                              <button
                                onClick={() => handleCopyLink(file)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Salin Link"
                              >
                                {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => setFileToDelete(file)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Hapus File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          )}

        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {isCreateFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Buat Folder Baru</h3>
                <p className="text-xs text-slate-400">Di dalam: {currentFolder.name}</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Nama Folder</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Eviden Inspeksi ROW 2026..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFolderOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Buat Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT DATASET MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ekspor Data PLN ke Google Drive</h3>
                <p className="text-xs text-slate-400">Simpan snapshot data langsung ke folder aktif Drive Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">Pilih Kumpulan Data</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'trips', label: 'Gangguan Penyulang', count: trips.length },
                    { id: 'feeders', label: 'Master Penyulang', count: masterFeeders.length },
                    { id: 'sections', label: 'Master Section', count: masterSections.length },
                    { id: 'saidi', label: 'Kinerja SAIDI/SAIFI', count: monthlySaidi.length },
                    { id: 'spk', label: 'Daftar SPK', count: spkList.length },
                    { id: 'gardu', label: 'Pengukuran Gardu', count: garduMeasurements.length }
                  ].map((ds) => (
                    <button
                      key={ds.id}
                      type="button"
                      onClick={() => setExportDataset(ds.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        exportDataset === ds.id
                          ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200 truncate">{ds.label}</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{ds.count} Baris Data</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">Format Berkas</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      exportFormat === 'json'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400'
                    }`}
                  >
                    JSON (Full Struktur Data)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      exportFormat === 'csv'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400'
                    }`}
                  >
                    CSV (Excel & Spreadsheet)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                <span>Folder tujuan: </span>
                <span className="text-white font-semibold">{currentFolder.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportData}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengekspor...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Simpan ke Google Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE DELETE CONFIRMATION MODAL (MANDATORY per Workspace Skill rules) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/40 p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hapus Berkas dari Drive?</h3>
                <p className="text-xs text-rose-300">Tindakan ini memerlukan konfirmasi Anda</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Nama Berkas:</div>
              <div className="font-bold text-white break-all">{fileToDelete.name}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Tipe: {fileToDelete.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File'} • ID: {fileToDelete.id}
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Apakah Anda yakin ingin menghapus berkas ini dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteFile}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
