import React, { useState, useEffect } from 'react';
import { 
  ViewMode, 
  FeederTrip, 
  MonthlySaidiSaifiData,
  SpkTask,
  GarduMeasurement,
  MasterFeeder,
  MasterSection,
  MasterGarduHubung,
  MasterGarduDistribusi,
  MasterPemutus,
  MaterialItem,
  ApdTool,
  Vehicle,
  UserAccess,
  InspectionRecord,
  WhatsAppMessage,
  WhatsAppContact,
  PbPdRegistration
} from './types';
import { 
  INITIAL_TRIPS, 
  MONTHLY_TRIP_DATA, 
  MONTHLY_SAIDI_SAIFI_2026, 
  FEEDER_CONTRIBUTION, 
  FEEDER_HEALTH_LIST, 
  INSPECTION_LIST, 
  ROW_TREES,
  INITIAL_SPK_TASKS,
  INITIAL_GARDU_MEASUREMENTS,
  INITIAL_MASTER_FEEDERS,
  INITIAL_MASTER_SECTIONS,
  INITIAL_MASTER_GH,
  INITIAL_MASTER_GD,
  INITIAL_MASTER_PEMUTUS,
  INITIAL_MATERIALS,
  INITIAL_APD_TOOLS,
  INITIAL_VEHICLES,
  INITIAL_USERS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_PB_PD_DATA
} from './data/mockData';
import { syncCollection, saveDocument, deleteDocument } from './services/firebaseSync';
import { isAdminRole, canUserEditView } from './utils/permissionUtils';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { TripFrequencyChart } from './components/TripFrequencyChart';
import { SaidiSaifiChart } from './components/SaidiSaifiChart';

import { MainDashboardView } from './components/views/MainDashboardView';
import { GisMapView } from './components/views/GisMapView';
import { TripLogsView } from './components/views/TripLogsView';
import { HealthIndexView } from './components/views/HealthIndexView';
import { PemeliharaanView } from './components/views/PemeliharaanView';
import { SpkFormView } from './components/spk/SpkFormView';
import { SaidiSaifiDetailView } from './components/views/SaidiSaifiDetailView';
import { MaterialStockView } from './components/views/MaterialStockView';
import { MasterDataView } from './components/views/MasterDataView';
import { UserManagementView } from './components/views/UserManagementView';
import { PbPdMonitoringView } from './components/views/PbPdMonitoringView';
import { LoginPage } from './components/views/LoginPage';
import { WhatsAppDispatchView } from './components/views/WhatsAppDispatchView';
import { GangguanGoogleSheetIntegration } from './components/views/GangguanGoogleSheetIntegration';
import { GoogleSheetIntegrationView } from './components/views/GoogleSheetIntegrationView';

import { InputGangguanModal } from './components/modals/InputGangguanModal';
import { InputSaidiModal } from './components/modals/InputSaidiModal';
import { UniversalInputModal } from './components/modals/UniversalInputModal';
import { LoginModal } from './components/modals/LoginModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { Menu, Sparkles, CheckCircle2, SlidersHorizontal, ChevronRight } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Authentication State - default to null so opening link lands directly on Login Page
  const [currentUser, setCurrentUser] = useState<UserAccess | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Core App Datasets with Live State
  const [trips, setTrips] = useState<FeederTrip[]>(INITIAL_TRIPS);
  const [editingTrip, setEditingTrip] = useState<FeederTrip | null>(null);
  const [monthlySaidiData, setMonthlySaidiData] = useState<MonthlySaidiSaifiData[]>(MONTHLY_SAIDI_SAIFI_2026);
  const [spkList, setSpkList] = useState<SpkTask[]>(INITIAL_SPK_TASKS);
  const [garduMeasurements, setGarduMeasurements] = useState<GarduMeasurement[]>(INITIAL_GARDU_MEASUREMENTS);
  const [masterFeeders, setMasterFeeders] = useState<MasterFeeder[]>(INITIAL_MASTER_FEEDERS);
  const [masterSections, setMasterSections] = useState<MasterSection[]>(INITIAL_MASTER_SECTIONS);
  const [masterGarduHubung, setMasterGarduHubung] = useState<MasterGarduHubung[]>(INITIAL_MASTER_GH);
  const [masterGarduDistribusi, setMasterGarduDistribusi] = useState<MasterGarduDistribusi[]>(INITIAL_MASTER_GD);
  const [masterPemutus, setMasterPemutus] = useState<MasterPemutus[]>(INITIAL_MASTER_PEMUTUS);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [apdTools, setApdTools] = useState<ApdTool[]>(INITIAL_APD_TOOLS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [users, setUsers] = useState<UserAccess[]>(INITIAL_USERS);
  const [inspections, setInspections] = useState<InspectionRecord[]>(INSPECTION_LIST);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [pbPdList, setPbPdList] = useState<PbPdRegistration[]>(INITIAL_PB_PD_DATA);

  // Dark Mode DOM synchronization
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Firebase Real-time Synchronization
  useEffect(() => {
    const unsubTrips = syncCollection<FeederTrip>('trips', [], (data) => {
      const isMockId = (id: string) => id.startsWith('TRIP-2026-') || id.startsWith('TRIP-00') || id === 'TRIP-1' || id === 'TRIP-2';
      const cleanTrips = data.filter(item => !isMockId(item.id));
      setTrips(cleanTrips);
      data.forEach(item => {
        if (isMockId(item.id)) {
          deleteDocument('trips', item.id);
        }
      });
    });
    const unsubSaidi = syncCollection<MonthlySaidiSaifiData>('saidi_saifi', MONTHLY_SAIDI_SAIFI_2026, (data) => setMonthlySaidiData(data));
    const unsubSpk = syncCollection<SpkTask>('spk_tasks', INITIAL_SPK_TASKS, (data) => {
      const isMockSpk = (item: SpkTask) => 
        item.id === 'SPK-2026-081' || item.id === 'SPK-2026-082' || 
        (item.spkNumber || '').toLowerCase().includes('spk/bag/2026/08/012') || 
        (item.spkNumber || '').toLowerCase().includes('spk/bag/2026/08/013');
      const cleanSpk = data.filter(item => !isMockSpk(item));
      setSpkList(cleanSpk);
      data.forEach(item => {
        if (isMockSpk(item)) {
          deleteDocument('spk_tasks', item.id);
        }
      });
    });
    const unsubGardu = syncCollection<GarduMeasurement>('gardu_measurements', INITIAL_GARDU_MEASUREMENTS, (data) => setGarduMeasurements(data));
    const unsubFeeders = syncCollection<MasterFeeder>('master_feeders', INITIAL_MASTER_FEEDERS, (data) => {
      const seenIds = new Set<string>();
      const cleanData: MasterFeeder[] = [];

      data.forEach(item => {
        if (!item.feederName) {
          if (item.id) deleteDocument('master_feeders', item.id);
          return;
        }
        if (item.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          cleanData.push(item);
        }
      });

      setMasterFeeders(cleanData);
    });
    const unsubSections = syncCollection<MasterSection>('master_sections', INITIAL_MASTER_SECTIONS, (data) => setMasterSections(data));
    const unsubGh = syncCollection<MasterGarduHubung>('master_gardu_hubung', INITIAL_MASTER_GH, (data) => setMasterGarduHubung(data));
    const unsubGd = syncCollection<MasterGarduDistribusi>('master_gardu_distribusi', INITIAL_MASTER_GD, (data) => {
      const filteredGd = data.filter(item => !['GD-01', 'GD-02', 'GD-03', 'GD-04', 'GD-05'].includes(item.id));
      setMasterGarduDistribusi(filteredGd);
      data.forEach(item => {
        if (['GD-01', 'GD-02', 'GD-03', 'GD-04', 'GD-05'].includes(item.id)) {
          deleteDocument('master_gardu_distribusi', item.id);
        }
      });
    });
    const unsubPmt = syncCollection<MasterPemutus>('master_pemutus', INITIAL_MASTER_PEMUTUS, (data) => {
      const isMockPmt = (id: string) => ['PMT-01', 'PMT-02', 'PMT-03', 'PMT-04'].includes(id);
      const cleanPmt = data.filter(item => !isMockPmt(item.id));
      setMasterPemutus(cleanPmt);
      data.forEach(item => {
        if (isMockPmt(item.id)) {
          deleteDocument('master_pemutus', item.id);
        }
      });
    });
    const unsubMaterials = syncCollection<MaterialItem>('materials', INITIAL_MATERIALS, (data) => setMaterials(data));
    const unsubApd = syncCollection<ApdTool>('apd_tools', INITIAL_APD_TOOLS, (data) => setApdTools(data));
    const unsubVehicles = syncCollection<Vehicle>('vehicles', INITIAL_VEHICLES, (data) => setVehicles(data));
    const unsubUsers = syncCollection<UserAccess>('users_access', INITIAL_USERS, (data) => setUsers(data));
    const unsubWa = syncCollection<WhatsAppMessage>('whatsapp_messages', INITIAL_WHATSAPP_MESSAGES, (data) => setWhatsAppMessages(data));
    const unsubPbPd = syncCollection<PbPdRegistration>('pb_pd_registrations', INITIAL_PB_PD_DATA, (data) => setPbPdList(data));

    return () => {
      unsubTrips();
      unsubSaidi();
      unsubSpk();
      unsubGardu();
      unsubFeeders();
      unsubSections();
      unsubGh();
      unsubGd();
      unsubPmt();
      unsubMaterials();
      unsubApd();
      unsubVehicles();
      unsubUsers();
      unsubWa();
      unsubPbPd();
    };
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Control States
  const [isGangguanModalOpen, setIsGangguanModalOpen] = useState(false);
  const [isSaidiModalOpen, setIsSaidiModalOpen] = useState(false);
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState(false);
  const [universalModalTab, setUniversalModalTab] = useState<string>('trips');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppModalCategory, setWhatsAppModalCategory] = useState<string>('Gangguan / Trip');
  const [whatsAppModalTrip, setWhatsAppModalTrip] = useState<FeederTrip | undefined>(undefined);
  const [whatsAppModalSpk, setWhatsAppModalSpk] = useState<SpkTask | undefined>(undefined);

  // Calculated Metrics
  const totalTripsCount = trips.length;
  const totalInspectionsCount = inspections.length;
  const totalRowPointsCount = ROW_TREES.filter(t => t.status === 'Perlu Pangkas').length;
  
  // Ags 2026 SAIDI
  const currentSaidiObj = monthlySaidiData.find(m => m.month === 'Ags') || monthlySaidiData[7] || {
    month: 'Ags',
    saidiReal: 0,
    saidiTarget: 0,
    saifiReal: 0,
    saifiTarget: 0,
    ensLossJuta: 0
  };
  const saidiVal = currentSaidiObj.saidiReal;
  const saidiTarget = currentSaidiObj.saidiTarget;
  const financialLossTotal = trips.reduce((acc, t) => acc + t.financialLossIdr, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccess) => {
    setCurrentUser(user);
    showToast(`Selamat datang kembali, ${user.name} (${user.role})!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah logout dari akun PLN.');
  };

  const handleSendMessage = (msg: WhatsAppMessage) => {
    setWhatsAppMessages(prev => [msg, ...prev]);
    saveDocument('whatsapp_messages', msg, msg.id);
    showToast(`Pesan WhatsApp berhasil dikirim ke ${msg.recipientName}`);
  };

  const handleOpenWhatsAppModal = (trip?: FeederTrip, category?: string, spk?: SpkTask) => {
    setWhatsAppModalTrip(trip);
    setWhatsAppModalSpk(spk);
    setWhatsAppModalCategory(category || (trip ? 'Gangguan / Trip' : spk ? 'SPK Lapangan' : 'Gangguan / Trip'));
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenUniversalInput = (tab?: string) => {
    if (tab) {
      setUniversalModalTab(tab);
    } else if (currentView !== 'dashboard') {
      setUniversalModalTab(currentView);
    } else {
      setUniversalModalTab('trips');
    }
    setIsUniversalModalOpen(true);
  };

  const handleEditTrip = (trip: FeederTrip) => {
    setEditingTrip(trip);
    setIsGangguanModalOpen(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    const target = trips.find(t => t.id === tripId);
    setTrips(prev => prev.filter(t => t.id !== tripId));
    deleteDocument('trips', tripId);
    showToast(`Data gangguan ${target ? target.feederName : tripId} berhasil dihapus dari sistem!`);
  };

  // Save Handlers
  const handleSaveTrip = async (newTrip: FeederTrip) => {
    setTrips(prev => {
      const exists = prev.some(t => t.id === newTrip.id);
      if (exists) {
        return prev.map(t => t.id === newTrip.id ? newTrip : t);
      }
      return [newTrip, ...prev];
    });
    saveDocument('trips', newTrip, newTrip.id);

    if (editingTrip) {
      showToast(`Data gangguan ${newTrip.feederName} (${newTrip.id}) berhasil diperbarui!`);
      setEditingTrip(null);
      return;
    }

    // Automatically accumulate SAIDI and SAIFI into current active month (Ags 2026)
    if (newTrip.saidiHours !== undefined && newTrip.saidiHours >= 0) {
      const updatedSaidiData = monthlySaidiData.map(item => {
        if (item.month === 'Ags') {
          const updatedSaidi = Number((item.saidiReal + (newTrip.saidiHours || 0)).toFixed(3));
          const updatedSaifi = Number((item.saifiReal + (newTrip.saifiCount || 0)).toFixed(3));
          const updatedEnsLoss = Number((item.ensLossJuta + (newTrip.financialLossIdr / 1000000)).toFixed(2));
          const updatedObj = { 
            ...item, 
            saidiReal: updatedSaidi, 
            saifiReal: updatedSaifi, 
            ensLossJuta: updatedEnsLoss 
          };
          saveDocument('saidi_saifi', updatedObj, `${item.month}_2026`);
          return updatedObj;
        }
        return item;
      });
      setMonthlySaidiData(updatedSaidiData);
    }

    showToast(`Gangguan ${newTrip.feederName} (${newTrip.id}) berhasil disimpan ke Firebase & terhubung ke SAIDI/SAIFI!`);
  };

  const handleSaveSpk = (newSpk: SpkTask) => {
    setSpkList(prev => {
      const idx = prev.findIndex(s => s.id === newSpk.id || (s.spkNumber && newSpk.spkNumber && s.spkNumber.trim().toLowerCase() === newSpk.spkNumber.trim().toLowerCase()));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newSpk;
        return updated;
      }
      return [newSpk, ...prev];
    });
    saveDocument('spk_tasks', newSpk, newSpk.id);
    showToast(`Perintah Kerja SPK ${newSpk.spkNumber || newSpk.feederName} telah tersinkronisasi ke Health Index & Firebase!`);
  };

  const handleDeleteSpk = (spkId: string) => {
    const target = spkList.find(s => s.id === spkId);
    setSpkList(prev => prev.filter(s => s.id !== spkId));
    deleteDocument('spk_tasks', spkId);
    showToast(`Dokumen SPK ${target ? target.spkNumber : spkId} berhasil dihapus!`);
  };

  const handleClearSpks = () => {
    spkList.forEach(s => deleteDocument('spk_tasks', s.id));
    setSpkList([]);
    showToast('Seluruh dokumen SPK telah dibersihkan dari sistem.');
  };

  const handleSaveInspection = (newInsp: InspectionRecord) => {
    setInspections([newInsp, ...inspections]);
    showToast(`Temuan Inspeksi ${newInsp.id} (${newInsp.feederName}) dicatat!`);
  };

  const handleSaveMeasurement = (newMeas: GarduMeasurement) => {
    setGarduMeasurements([newMeas, ...garduMeasurements]);
    saveDocument('gardu_measurements', newMeas, newMeas.id);
    showToast(`Pengukuran Gardu ${newMeas.garduCode} (${newMeas.garduName}) disimpan ke Firebase!`);
  };

  const handleSaveMasterFeeder = (newFeeder: MasterFeeder) => {
    setMasterFeeders(prev => {
      const idx = prev.findIndex(f => f.id === newFeeder.id || (f.feederCode && newFeeder.feederCode && f.feederCode.trim().toLowerCase() === newFeeder.feederCode.trim().toLowerCase()));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newFeeder;
        return updated;
      }
      return [newFeeder, ...prev];
    });
    saveDocument('master_feeders', newFeeder, newFeeder.id);
    showToast(`Data Penyulang ${newFeeder.feederName} (${newFeeder.feederCode}) berhasil disimpan!`);
  };

  const handleSaveMasterSection = (newSec: MasterSection) => {
    setMasterSections(prev => {
      const idx = prev.findIndex(s => s.id === newSec.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newSec;
        return updated;
      }
      return [newSec, ...prev];
    });
    saveDocument('master_sections', newSec, newSec.id);
    showToast(`Data Section ${newSec.sectionName} (${newSec.sectionCode}) berhasil disimpan!`);
  };

  const handleDeleteMasterSection = (secId: string) => {
    const target = masterSections.find(s => s.id === secId);
    setMasterSections(prev => prev.filter(s => s.id !== secId));
    deleteDocument('master_sections', secId);
    showToast(`Data Section ${target ? target.sectionName : ''} berhasil dihapus!`);
  };

  const handleSaveMasterGarduHubung = (newGh: MasterGarduHubung) => {
    setMasterGarduHubung(prev => {
      const idx = prev.findIndex(g => g.id === newGh.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newGh;
        return updated;
      }
      return [newGh, ...prev];
    });
    saveDocument('master_gardu_hubung', newGh, newGh.id);
    showToast(`Data Gardu Hubung ${newGh.ghName} (${newGh.ghCode}) berhasil disimpan!`);
  };

  const handleDeleteMasterGarduHubung = (ghId: string) => {
    const target = masterGarduHubung.find(g => g.id === ghId);
    setMasterGarduHubung(prev => prev.filter(g => g.id !== ghId));
    deleteDocument('master_gardu_hubung', ghId);
    showToast(`Data Gardu Hubung ${target ? target.ghName : ''} berhasil dihapus!`);
  };

  const handleSaveMasterGarduDistribusi = (newGd: MasterGarduDistribusi) => {
    setMasterGarduDistribusi(prev => {
      const idx = prev.findIndex(g => g.id === newGd.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newGd;
        return updated;
      }
      return [newGd, ...prev];
    });
    saveDocument('master_gardu_distribusi', newGd, newGd.id);

    // Auto-sync parent feeder totals in master_feeders
    if (newGd.feederName) {
      const feederName = newGd.feederName.trim();
      const allGds = [...masterGarduDistribusi.filter(g => g.id !== newGd.id), newGd];
      const matchingGds = allGds.filter(g => g.feederName && g.feederName.trim().toLowerCase() === feederName.toLowerCase());
      const totalKva = matchingGds.reduce((sum, g) => sum + (Number(g.capacityKva) || 0), 0);
      const totalCust = matchingGds.reduce((sum, g) => sum + (Number(g.customerCount) || 0), 0);

      const parentFeeder = masterFeeders.find(f => f.feederName.trim().toLowerCase() === feederName.toLowerCase());
      if (parentFeeder) {
        const updatedFeeder: MasterFeeder = {
          ...parentFeeder,
          garduCount: matchingGds.length,
          capacityKva: totalKva > 0 ? totalKva : parentFeeder.capacityKva,
          khaAmpere: totalKva > 0 ? totalKva : parentFeeder.khaAmpere,
          customerCount: totalCust > 0 ? totalCust : parentFeeder.customerCount
        };
        setMasterFeeders(prev => prev.map(f => f.id === parentFeeder.id ? updatedFeeder : f));
        saveDocument('master_feeders', updatedFeeder, parentFeeder.id);
      }
    }

    showToast(`Data Gardu Distribusi ${newGd.garduName} (${newGd.garduCode}) berhasil disimpan!`);
  };

  const handleDeleteMasterGarduDistribusi = (gdId: string) => {
    const target = masterGarduDistribusi.find(g => g.id === gdId);
    setMasterGarduDistribusi(prev => prev.filter(g => g.id !== gdId));
    deleteDocument('master_gardu_distribusi', gdId);

    if (target && target.feederName) {
      const feederName = target.feederName.trim();
      const remainingGds = masterGarduDistribusi.filter(g => g.id !== gdId && g.feederName && g.feederName.trim().toLowerCase() === feederName.toLowerCase());
      const totalKva = remainingGds.reduce((sum, g) => sum + (Number(g.capacityKva) || 0), 0);
      const totalCust = remainingGds.reduce((sum, g) => sum + (Number(g.customerCount) || 0), 0);

      const parentFeeder = masterFeeders.find(f => f.feederName.trim().toLowerCase() === feederName.toLowerCase());
      if (parentFeeder) {
        const updatedFeeder: MasterFeeder = {
          ...parentFeeder,
          garduCount: remainingGds.length,
          capacityKva: totalKva > 0 ? totalKva : parentFeeder.capacityKva,
          khaAmpere: totalKva > 0 ? totalKva : parentFeeder.khaAmpere,
          customerCount: totalCust > 0 ? totalCust : parentFeeder.customerCount
        };
        setMasterFeeders(prev => prev.map(f => f.id === parentFeeder.id ? updatedFeeder : f));
        saveDocument('master_feeders', updatedFeeder, parentFeeder.id);
      }
    }

    showToast(`Data Gardu Distribusi ${target ? target.garduName : ''} berhasil dihapus!`);
  };

  const handleSaveMasterPemutus = (newPmt: MasterPemutus) => {
    setMasterPemutus(prev => {
      const idx = prev.findIndex(p => p.id === newPmt.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newPmt;
        return updated;
      }
      return [newPmt, ...prev];
    });
    saveDocument('master_pemutus', newPmt, newPmt.id);
    showToast(`Data Alat Pemutus ${newPmt.equipmentCode} (${newPmt.equipmentType}) berhasil disimpan!`);
  };

  const handleDeleteMasterPemutus = (pmtId: string) => {
    const target = masterPemutus.find(p => p.id === pmtId);
    setMasterPemutus(prev => prev.filter(p => p.id !== pmtId));
    deleteDocument('master_pemutus', pmtId);
    showToast(`Data Alat Pemutus ${target ? target.equipmentCode : ''} berhasil dihapus!`);
  };

  const normalizeMonthName = (m: string): string => {
    if (!m) return 'Jan';
    const s = m.trim().toLowerCase();
    if (s.startsWith('jan')) return 'Jan';
    if (s.startsWith('feb')) return 'Feb';
    if (s.startsWith('mar')) return 'Mar';
    if (s.startsWith('apr')) return 'Apr';
    if (s.startsWith('mei') || s.startsWith('may')) return 'Mei';
    if (s.startsWith('jun')) return 'Jun';
    if (s.startsWith('jul')) return 'Jul';
    if (s.startsWith('ag') || s.startsWith('aug')) return 'Ags';
    if (s.startsWith('sep')) return 'Sep';
    if (s.startsWith('ok') || s.startsWith('oct')) return 'Okt';
    if (s.startsWith('nov')) return 'Nov';
    if (s.startsWith('des') || s.startsWith('dec')) return 'Des';
    return m;
  };

  const handleUpdateSaidi = (
    year: number, 
    month: string, 
    saidiReal: number, 
    saifiReal: number, 
    saidiTarget?: number, 
    saifiTarget?: number,
    ensLossJuta?: number
  ) => {
    const cleanMonth = normalizeMonthName(month);
    const docId = `${cleanMonth}_${year}`;
    setMonthlySaidiData(prev => {
      const idx = prev.findIndex(item => (item.year || 2026) === year && normalizeMonthName(item.month) === cleanMonth);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          year,
          month: cleanMonth,
          saidiReal,
          saifiReal,
          saidiTarget: saidiTarget !== undefined ? saidiTarget : next[idx].saidiTarget,
          saifiTarget: saifiTarget !== undefined ? saifiTarget : next[idx].saifiTarget,
          ensLossJuta: ensLossJuta !== undefined ? ensLossJuta : next[idx].ensLossJuta
        };
        saveDocument('saidi_saifi', next[idx], docId);
        return next;
      } else {
        const newRow: MonthlySaidiSaifiData = {
          year,
          month: cleanMonth,
          saidiReal,
          saifiReal,
          saidiTarget: saidiTarget ?? 0,
          saifiTarget: saifiTarget ?? 0,
          ensLossJuta: ensLossJuta ?? 0
        };
        saveDocument('saidi_saifi', newRow, docId);
        return [...prev, newRow];
      }
    });
    showToast(`Kinerja SAIDI/SAIFI Bulan ${cleanMonth} ${year} berhasil disimpan: ${saidiReal.toFixed(3)} Jam/Plg`);
  };

  const handleUpdateSaidiRow = (updatedRow: MonthlySaidiSaifiData) => {
    const rowYear = updatedRow.year || 2026;
    const cleanMonth = normalizeMonthName(updatedRow.month);
    const docId = `${cleanMonth}_${rowYear}`;
    const cleanRow: MonthlySaidiSaifiData = {
      ...updatedRow,
      id: docId,
      month: cleanMonth,
      year: rowYear
    };

    setMonthlySaidiData(prev => {
      const idx = prev.findIndex(item => (item.year || 2026) === rowYear && normalizeMonthName(item.month) === cleanMonth);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...cleanRow };
        return next;
      }
      return [...prev, cleanRow];
    });

    saveDocument('saidi_saifi', cleanRow, docId);
    showToast(`Data Target & Realisasi KPI Bulan ${cleanMonth} ${rowYear} berhasil disimpan!`);
  };

  const handleSaveMaterial = (newMat: MaterialItem) => {
    setMaterials([newMat, ...materials]);
    saveDocument('materials', newMat, newMat.id);
    showToast(`Material ${newMat.name} (${newMat.stockQty} ${newMat.unit}) ditambahkan ke Firebase!`);
  };

  const handleSaveApd = (newApd: ApdTool) => {
    setApdTools([newApd, ...apdTools]);
    saveDocument('apd_tools', newApd, newApd.id);
    showToast(`Peralatan APD K3 ${newApd.name} berhasil dicatat di Firebase!`);
  };

  const handleSaveVehicle = (newVeh: Vehicle) => {
    setVehicles([newVeh, ...vehicles]);
    saveDocument('vehicles', newVeh, newVeh.id);
    showToast(`Armada ${newVeh.plateNumber} (${newVeh.name}) ditambahkan ke Firebase!`);
  };

  const handleSaveUser = (newUser: UserAccess) => {
    setUsers(prev => {
      const idx = prev.findIndex(u => u.id === newUser.id || u.nik === newUser.nik);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newUser;
        return updated;
      }
      return [newUser, ...prev];
    });
    saveDocument('users_access', newUser, newUser.id);
    showToast(`User ${newUser.name} (${newUser.role}) berhasil disimpan!`);
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    deleteDocument('users_access', userId);
    showToast(`Akun user ${targetUser ? targetUser.name : ''} berhasil dihapus!`);
  };

  const handleDeleteMasterFeeder = (feederId: string) => {
    const target = masterFeeders.find(f => f.id === feederId);
    setMasterFeeders(prev => prev.filter(f => f.id !== feederId));
    deleteDocument('master_feeders', feederId);
    showToast(`Data Penyulang ${target ? target.feederName : ''} berhasil dihapus!`);
  };

  const handleSavePbPd = (newRecord: PbPdRegistration) => {
    setPbPdList(prev => {
      const idx = prev.findIndex(item => item.id === newRecord.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newRecord;
        return next;
      }
      return [newRecord, ...prev];
    });
    saveDocument('pb_pd_registrations', newRecord, newRecord.id);
    showToast(`Permohonan ${newRecord.requestType} - ${newRecord.customerName} (${newRecord.registrationNumber}) berhasil disimpan!`);
  };

  const handleDeletePbPd = (id: string) => {
    const target = pbPdList.find(p => p.id === id);
    setPbPdList(prev => prev.filter(p => p.id !== id));
    deleteDocument('pb_pd_registrations', id);
    showToast(`Data permohonan ${target ? target.customerName : ''} berhasil dihapus!`);
  };

  // Render standalone Gardu Induk Login Page if user is logged out
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        usersList={users}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${
      isDarkMode ? 'dark bg-[#070c19] text-slate-100' : 'bg-[#090e1a] text-slate-100'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-cyan-500/50 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenInputGangguan={() => setIsGangguanModalOpen(true)}
        onOpenSaidiView={() => setCurrentView('saidi_saifi')}
        onOpenUniversalInput={handleOpenUniversalInput}
        onOpenGisMap={() => setCurrentView('gis')}
        onOpenWhatsAppModal={() => handleOpenWhatsAppModal()}
        systemReliability={98.6}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        masterFeeders={masterFeeders}
      />

      <div className="max-w-[1700px] mx-auto flex">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpenMobile={isOpenMobileSidebar}
          setIsOpenMobile={setIsOpenMobileSidebar}
          isDarkMode={isDarkMode}
          tripCount={totalTripsCount}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0 overflow-x-hidden">
          
          {/* Mobile Top Toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setIsOpenMobileSidebar(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5 text-blue-600" />
              <span>Buka Menu System</span>
            </button>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              ULP Baguala
            </span>
          </div>

          {/* View Content Renderer */}
          {currentView === 'dashboard' && (
            <MainDashboardView 
              isDarkMode={isDarkMode}
              setCurrentView={setCurrentView}
              trips={trips}
              monthlySaidiData={monthlySaidiData}
              spkList={spkList}
              garduMeasurements={garduMeasurements}
              masterFeeders={masterFeeders}
              masterSections={masterSections}
              masterGarduHubung={masterGarduHubung}
              masterGarduDistribusi={masterGarduDistribusi}
              masterPemutus={masterPemutus}
              materials={materials}
              apdTools={apdTools}
              vehicles={vehicles}
              inspections={inspections}
              rowTrees={ROW_TREES}
              whatsAppMessages={whatsAppMessages}
              onOpenInputGangguan={() => {
                setEditingTrip(null);
                setIsGangguanModalOpen(true);
              }}
              onOpenUniversalInput={handleOpenUniversalInput}
              onOpenWhatsAppModal={(trip, cat) => handleOpenWhatsAppModal(trip, cat)}
              onEditTrip={handleEditTrip}
            />
          )}

          {currentView === 'pb_pd' && (
            <PbPdMonitoringView 
              isDarkMode={isDarkMode}
              registrations={pbPdList}
              onSavePbPd={handleSavePbPd}
              onDeletePbPd={handleDeletePbPd}
              masterFeeders={masterFeeders}
              masterGarduDistribusi={masterGarduDistribusi}
              onOpenWhatsAppModal={(msgData) => {
                setIsWhatsAppModalOpen(true);
                if (msgData?.category) setWhatsAppModalCategory(msgData.category);
              }}
            />
          )}

          {currentView === 'gis' && (
            <GisMapView 
              isDarkMode={isDarkMode}
              feeders={FEEDER_HEALTH_LIST}
              trips={trips}
              onOpenInputGangguan={() => setIsGangguanModalOpen(true)}
            />
          )}

          {currentView === 'trips' && (
            <TripLogsView 
              isDarkMode={isDarkMode}
              trips={trips}
              onOpenInputGangguan={() => {
                setEditingTrip(null);
                setIsGangguanModalOpen(true);
              }}
              onOpenGoogleSheetSync={() => setCurrentView('gangguan_sheet_sync' as any)}
              onEditTrip={handleEditTrip}
              onDeleteTrip={handleDeleteTrip}
              onOpenWhatsAppModal={(trip) => handleOpenWhatsAppModal(trip, 'Gangguan / Trip')}
              masterFeeders={masterFeeders}
            />
          )}

          {currentView === 'gangguan_sheet_sync' as any && (
            <GangguanGoogleSheetIntegration 
              isDarkMode={isDarkMode}
              onShowToast={showToast}
              trips={trips}
              onSaveTripFromSheet={handleSaveTrip}
              masterFeeders={masterFeeders}
            />
          )}

          {currentView === 'whatsapp' && (
            <WhatsAppDispatchView 
              isDarkMode={isDarkMode}
              messages={whatsAppMessages}
              onSendMessage={handleSendMessage}
              trips={trips}
              spkList={spkList}
              onOpenQuickModal={(cat, trip) => handleOpenWhatsAppModal(trip, cat)}
            />
          )}

          {currentView === 'health_index' && (
            <HealthIndexView 
              isDarkMode={isDarkMode}
              masterFeeders={masterFeeders}
              masterSections={masterSections}
              masterGarduDistribusi={masterGarduDistribusi}
              trips={trips}
              feeders={FEEDER_HEALTH_LIST}
              inspections={inspections}
              spkList={spkList}
              onNavigateToSpk={() => setCurrentView('spk')}
            />
          )}

          {currentView === 'pemeliharaan' && (
            <PemeliharaanView 
              isDarkMode={isDarkMode}
              inspections={inspections}
              rowTrees={ROW_TREES}
              onOpenUniversalInput={handleOpenUniversalInput}
            />
          )}

          {currentView === 'google_sheet_sync' && (
            <GoogleSheetIntegrationView 
              isDarkMode={isDarkMode}
              onShowToast={showToast}
            />
          )}

          {currentView === 'spk' && (
            <SpkFormView 
              isDarkMode={isDarkMode}
              spkList={spkList}
              onSaveSpk={handleSaveSpk}
              onDeleteSpk={handleDeleteSpk}
              onClearSpks={handleClearSpks}
              currentUser={currentUser}
            />
          )}

          {currentView === 'saidi_saifi' && (
            <SaidiSaifiDetailView 
              isDarkMode={isDarkMode}
              data={monthlySaidiData}
              onOpenInputSaidi={() => setIsSaidiModalOpen(true)}
              onUpdateSaidiRow={handleUpdateSaidiRow}
              currentUser={currentUser}
            />
          )}

          {currentView === 'users' && (
            <UserManagementView 
              isDarkMode={isDarkMode}
              users={users}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              currentUser={currentUser}
            />
          )}

          {currentView === 'master_data' && (
            <MasterDataView 
              isDarkMode={isDarkMode}
              masterFeeders={masterFeeders}
              masterSections={masterSections}
              masterGarduHubung={masterGarduHubung}
              masterGarduDistribusi={masterGarduDistribusi}
              masterPemutus={masterPemutus}
              trips={trips}
              onSaveMasterFeeder={handleSaveMasterFeeder}
              onDeleteMasterFeeder={handleDeleteMasterFeeder}
              onSaveMasterSection={handleSaveMasterSection}
              onDeleteMasterSection={handleDeleteMasterSection}
              onSaveMasterGarduHubung={handleSaveMasterGarduHubung}
              onDeleteMasterGarduHubung={handleDeleteMasterGarduHubung}
              onSaveMasterGarduDistribusi={handleSaveMasterGarduDistribusi}
              onDeleteMasterGarduDistribusi={handleDeleteMasterGarduDistribusi}
              onSaveMasterPemutus={handleSaveMasterPemutus}
              onDeleteMasterPemutus={handleDeleteMasterPemutus}
              onOpenUniversalInput={handleOpenUniversalInput}
            />
          )}

          {(currentView === 'material' || currentView === 'apd' || currentView === 'kendaraan' || currentView === 'pengukuran') && (
            <MaterialStockView 
              isDarkMode={isDarkMode}
              currentView={currentView}
              spkList={spkList}
              garduMeasurements={garduMeasurements}
              masterFeeders={masterFeeders}
              masterGarduDistribusi={masterGarduDistribusi}
              materials={materials}
              apdTools={apdTools}
              vehicles={vehicles}
              users={users}
              onOpenUniversalInput={handleOpenUniversalInput}
              onDeleteMasterFeeder={handleDeleteMasterFeeder}
              onSaveMasterFeeder={handleSaveMasterFeeder}
            />
          )}

        </main>

      </div>

      {/* Input Modals */}
      <InputGangguanModal 
        isOpen={isGangguanModalOpen}
        onClose={() => {
          setIsGangguanModalOpen(false);
          setEditingTrip(null);
        }}
        onSaveTrip={handleSaveTrip}
        isDarkMode={isDarkMode}
        masterFeeders={masterFeeders}
        masterSections={masterSections}
        masterGarduHubung={masterGarduHubung}
        tripToEdit={editingTrip}
      />

      <InputSaidiModal 
        isOpen={isSaidiModalOpen}
        onClose={() => setIsSaidiModalOpen(false)}
        onUpdateSaidi={handleUpdateSaidi}
        onSaveRow={handleUpdateSaidiRow}
        monthlySaidiData={monthlySaidiData}
        isDarkMode={isDarkMode}
      />

      <UniversalInputModal 
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        defaultTab={universalModalTab}
        isDarkMode={isDarkMode}
        masterFeeders={masterFeeders}
        masterSections={masterSections}
        masterPemutus={masterPemutus}
        onSaveTrip={handleSaveTrip}
        onSaveSpk={handleSaveSpk}
        onSaveInspection={handleSaveInspection}
        onSaveMeasurement={handleSaveMeasurement}
        onSaveMasterFeeder={handleSaveMasterFeeder}
        onSaveMasterSection={handleSaveMasterSection}
        onSaveMasterPemutus={handleSaveMasterPemutus}
        onSaveSaidi={handleUpdateSaidi}
        onSaveMaterial={handleSaveMaterial}
        onSaveApd={handleSaveApd}
        onSaveVehicle={handleSaveVehicle}
        onSaveUser={handleSaveUser}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        usersList={users}
      />

      <WhatsAppModal 
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        isDarkMode={isDarkMode}
        trips={trips}
        spkList={spkList}
        selectedTrip={whatsAppModalTrip}
        selectedSpk={whatsAppModalSpk}
        initialCategory={whatsAppModalCategory}
        onSaveMessage={handleSendMessage}
      />

    </div>
  );
}
