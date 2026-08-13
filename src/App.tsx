import React, { useState, useEffect } from 'react';
import { 
  ViewMode, 
  FeederTrip, 
  MonthlySaidiSaifiData,
  SpkTask,
  GarduMeasurement,
  MasterFeeder,
  MaterialItem,
  ApdTool,
  Vehicle,
  UserAccess,
  InspectionRecord
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
  INITIAL_MATERIALS,
  INITIAL_APD_TOOLS,
  INITIAL_VEHICLES,
  INITIAL_USERS
} from './data/mockData';
import { syncCollection, saveDocument, deleteDocument } from './services/firebaseSync';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { TripFrequencyChart } from './components/TripFrequencyChart';
import { SaidiSaifiChart } from './components/SaidiSaifiChart';

import { GisMapView } from './components/views/GisMapView';
import { TripLogsView } from './components/views/TripLogsView';
import { HealthIndexView } from './components/views/HealthIndexView';
import { PemeliharaanView } from './components/views/PemeliharaanView';
import { SpkFormView } from './components/spk/SpkFormView';
import { SaidiSaifiDetailView } from './components/views/SaidiSaifiDetailView';
import { MaterialStockView } from './components/views/MaterialStockView';
import { UserManagementView } from './components/views/UserManagementView';
import { LoginPage } from './components/views/LoginPage';

import { InputGangguanModal } from './components/modals/InputGangguanModal';
import { InputSaidiModal } from './components/modals/InputSaidiModal';
import { UniversalInputModal } from './components/modals/UniversalInputModal';
import { LoginModal } from './components/modals/LoginModal';
import { Menu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Authentication State - default to null so opening link lands directly on Login Page
  const [currentUser, setCurrentUser] = useState<UserAccess | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Core App Datasets with Live State
  const [trips, setTrips] = useState<FeederTrip[]>(INITIAL_TRIPS);
  const [monthlySaidiData, setMonthlySaidiData] = useState<MonthlySaidiSaifiData[]>(MONTHLY_SAIDI_SAIFI_2026);
  const [spkList, setSpkList] = useState<SpkTask[]>(INITIAL_SPK_TASKS);
  const [garduMeasurements, setGarduMeasurements] = useState<GarduMeasurement[]>(INITIAL_GARDU_MEASUREMENTS);
  const [masterFeeders, setMasterFeeders] = useState<MasterFeeder[]>(INITIAL_MASTER_FEEDERS);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [apdTools, setApdTools] = useState<ApdTool[]>(INITIAL_APD_TOOLS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [users, setUsers] = useState<UserAccess[]>(INITIAL_USERS);
  const [inspections, setInspections] = useState<InspectionRecord[]>(INSPECTION_LIST);

  // Firebase Real-time Synchronization
  useEffect(() => {
    const unsubTrips = syncCollection<FeederTrip>('trips', INITIAL_TRIPS, (data) => setTrips(data));
    const unsubSaidi = syncCollection<MonthlySaidiSaifiData>('saidi_saifi', MONTHLY_SAIDI_SAIFI_2026, (data) => setMonthlySaidiData(data));
    const unsubSpk = syncCollection<SpkTask>('spk_tasks', INITIAL_SPK_TASKS, (data) => setSpkList(data));
    const unsubGardu = syncCollection<GarduMeasurement>('gardu_measurements', INITIAL_GARDU_MEASUREMENTS, (data) => setGarduMeasurements(data));
    const unsubFeeders = syncCollection<MasterFeeder>('master_feeders', INITIAL_MASTER_FEEDERS, (data) => setMasterFeeders(data));
    const unsubMaterials = syncCollection<MaterialItem>('materials', INITIAL_MATERIALS, (data) => setMaterials(data));
    const unsubApd = syncCollection<ApdTool>('apd_tools', INITIAL_APD_TOOLS, (data) => setApdTools(data));
    const unsubVehicles = syncCollection<Vehicle>('vehicles', INITIAL_VEHICLES, (data) => setVehicles(data));
    const unsubUsers = syncCollection<UserAccess>('users_access', INITIAL_USERS, (data) => setUsers(data));

    return () => {
      unsubTrips();
      unsubSaidi();
      unsubSpk();
      unsubGardu();
      unsubFeeders();
      unsubMaterials();
      unsubApd();
      unsubVehicles();
      unsubUsers();
    };
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Control States
  const [isGangguanModalOpen, setIsGangguanModalOpen] = useState(false);
  const [isSaidiModalOpen, setIsSaidiModalOpen] = useState(false);
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState(false);
  const [universalModalTab, setUniversalModalTab] = useState<string>('trips');

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

  // Save Handlers
  const handleSaveTrip = async (newTrip: FeederTrip) => {
    setTrips([newTrip, ...trips]);
    saveDocument('trips', newTrip, newTrip.id);

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
    setSpkList([newSpk, ...spkList]);
    saveDocument('spk_tasks', newSpk, newSpk.id);
    showToast(`Perintah Kerja SPK ${newSpk.spkNumber} telah diterbitkan & tersimpan di Firebase!`);
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

  const handleUpdateSaidi = (
    year: number, 
    month: string, 
    saidiReal: number, 
    saifiReal: number, 
    saidiTarget?: number, 
    saifiTarget?: number,
    ensLossJuta?: number
  ) => {
    setMonthlySaidiData(prev => prev.map(item => {
      if ((item.year || 2026) === year && item.month === month) {
        const updated = { 
          ...item, 
          year,
          month,
          saidiReal, 
          saifiReal,
          saidiTarget: saidiTarget !== undefined ? saidiTarget : item.saidiTarget,
          saifiTarget: saifiTarget !== undefined ? saifiTarget : item.saifiTarget,
          ensLossJuta: ensLossJuta !== undefined ? ensLossJuta : item.ensLossJuta
        };
        saveDocument('saidi_saifi', updated, `${month}_${year}`);
        return updated;
      }
      return item;
    }));
    showToast(`Kinerja SAIDI/SAIFI ${month} ${year} diperbarui di Firebase: ${saidiReal.toFixed(3)} Jam/Plg`);
  };

  const handleUpdateSaidiRow = (updatedRow: MonthlySaidiSaifiData) => {
    setMonthlySaidiData(prev => prev.map(item => {
      if ((item.year || 2026) === (updatedRow.year || 2026) && item.month === updatedRow.month) {
        saveDocument('saidi_saifi', updatedRow, `${updatedRow.month}_${updatedRow.year || 2026}`);
        return updatedRow;
      }
      return item;
    }));
    showToast(`Target & Realisasi ${updatedRow.month} ${updatedRow.year || 2026} berhasil disimpan ke Firebase!`);
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
    setUsers([newUser, ...users]);
    saveDocument('users_access', newUser, newUser.id);
    showToast(`User ${newUser.name} (${newUser.role}) berhasil diberikan akses ke Firebase!`);
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
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-100/70 text-slate-900'
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
        systemReliability={98.6}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
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
            <div className="space-y-6">
              
              {/* Top Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Dashboard Kinerja & Keandalan 20kV
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PLN ULP Baguala • Sistem Keandalan <span className="font-bold text-emerald-600 dark:text-emerald-400">98.6%</span>
                  </p>
                </div>
              </div>

              {/* 4 Summary Cards */}
              <KpiCards 
                isDarkMode={isDarkMode}
                setCurrentView={setCurrentView}
                totalTrips={totalTripsCount}
                totalInspections={totalInspectionsCount}
                totalRowPoints={totalRowPointsCount}
                saidiVal={saidiVal}
                saidiTarget={saidiTarget}
                financialLossTotal={financialLossTotal}
              />

              {/* Middle Section: Trip Frequency + Reliability Analysis */}
              <TripFrequencyChart 
                isDarkMode={isDarkMode}
                data={MONTHLY_TRIP_DATA}
                totalTrips={totalTripsCount}
              />

              {/* Bottom Section: SAIDI/SAIFI Trend + Feeder Donut Contribution */}
              <SaidiSaifiChart 
                isDarkMode={isDarkMode}
                monthlySaidiData={monthlySaidiData}
                feederContributions={FEEDER_CONTRIBUTION}
              />

            </div>
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
              onOpenInputGangguan={() => setIsGangguanModalOpen(true)}
            />
          )}

          {currentView === 'health_index' && (
            <HealthIndexView 
              isDarkMode={isDarkMode}
              feeders={FEEDER_HEALTH_LIST}
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

          {currentView === 'spk' && (
            <SpkFormView 
              isDarkMode={isDarkMode}
              spkList={spkList}
              onSaveSpk={handleSaveSpk}
            />
          )}

          {currentView === 'saidi_saifi' && (
            <SaidiSaifiDetailView 
              isDarkMode={isDarkMode}
              data={monthlySaidiData}
              onOpenInputSaidi={() => setIsSaidiModalOpen(true)}
              onUpdateSaidiRow={handleUpdateSaidiRow}
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

          {(currentView === 'material' || currentView === 'apd' || currentView === 'kendaraan' || currentView === 'master_data' || currentView === 'pengukuran') && (
            <MaterialStockView 
              isDarkMode={isDarkMode}
              currentView={currentView}
              spkList={spkList}
              garduMeasurements={garduMeasurements}
              masterFeeders={masterFeeders}
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
        onClose={() => setIsGangguanModalOpen(false)}
        onSaveTrip={handleSaveTrip}
        isDarkMode={isDarkMode}
      />

      <InputSaidiModal 
        isOpen={isSaidiModalOpen}
        onClose={() => setIsSaidiModalOpen(false)}
        onUpdateSaidi={handleUpdateSaidi}
        isDarkMode={isDarkMode}
      />

      <UniversalInputModal 
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        defaultTab={universalModalTab}
        isDarkMode={isDarkMode}
        onSaveTrip={handleSaveTrip}
        onSaveSpk={handleSaveSpk}
        onSaveInspection={handleSaveInspection}
        onSaveMeasurement={handleSaveMeasurement}
        onSaveMasterFeeder={handleSaveMasterFeeder}
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

    </div>
  );
}
