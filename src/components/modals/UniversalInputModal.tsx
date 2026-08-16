import React, { useState, useEffect } from 'react';
import { ViewMode, BranchDevice, MasterFeeder, MasterSection, MasterPemutus, getSectionBranches, getDownstreamCoveredSections } from '../../types';
import { 
  X, 
  Zap, 
  FileText, 
  Wrench, 
  Gauge, 
  Database, 
  Layers,
  BarChart2, 
  Package, 
  Shield, 
  Car, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  PlusCircle,
  Plus,
  Trash2,
  GitBranch,
  Cpu
} from 'lucide-react';

interface UniversalInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ViewMode | string;
  isDarkMode: boolean;
  masterFeeders?: MasterFeeder[];
  masterSections?: MasterSection[];
  masterPemutus?: MasterPemutus[];
  onSaveTrip?: (trip: any) => void;
  onSaveSpk?: (spk: any) => void;
  onSaveInspection?: (inspection: any) => void;
  onSaveRowTree?: (row: any) => void;
  onSaveMeasurement?: (measurement: any) => void;
  onSaveMasterFeeder?: (feeder: any) => void;
  onSaveMasterSection?: (section: any) => void;
  onSaveMasterPemutus?: (pemutus: any) => void;
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
  masterFeeders = [],
  masterSections = [],
  masterPemutus = [],
  onSaveTrip,
  onSaveSpk,
  onSaveInspection,
  onSaveMeasurement,
  onSaveMasterFeeder,
  onSaveMasterSection,
  onSaveMasterPemutus,
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
    if (isOpen) {
      setMSecCode('');
      setMSecName('');
      setMSecStart('');
      setMSecEnd('');
      setMSecGarduCount('');
      setMSecLength('');
      setMSecKha('');
      setMSecCust('');
      setMSecPemutusId('');
      setMSecPemutusCode('');
      setMSecPemutusType('');
      setMSecHasFco(false);
      setMSecFcoBranches([]);
      setMSecBranchDeviceType('FCO');
      setMSecFcoName('');
      setMSecFcoLength('');
      setMSecFcoKha('');
      setMSecFcoLaterals('');
      setMSecCurrentLoad('');
      setMSecVoltageKv('');
      setMSecVoltageDrop('');
      setMSecTemperature('');
      // Reset Master Pemutus
      setPmtCode('');
      setPmtType('PMCB');
      setPmtFeeder('');
      setPmtSectionId('');
      setPmtLoc('');
      setPmtBrand('');
      setPmtRating(630);
      setPmtScada('Terhubung SCADA');
      setPmtStatus('Masuk / ON');
    }
  }, [defaultTab, isOpen, masterFeeders]);

  // Form States
  // 1. Trips
  const [tripFeeder, setTripFeeder] = useState('');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [tripTime, setTripTime] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [tripRelay, setTripRelay] = useState('GFR / OCR');
  const [tripLocation, setTripLocation] = useState('');
  const [tripCoordinates, setTripCoordinates] = useState('');
  const [tripCause, setTripCause] = useState('');
  const [tripCategory, setTripCategory] = useState('Tree/ROW');
  const [tripCustomers, setTripCustomers] = useState<string>('');
  const [tripAmpere, setTripAmpere] = useState<string>('');
  const [tripINol, setTripINol] = useState<string>('');
  const [tripIL1, setTripIL1] = useState<string>('');
  const [tripIL2, setTripIL2] = useState<string>('');
  const [tripIL3, setTripIL3] = useState<string>('');

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
  const [mFeederCode, setMFeederCode] = useState('');
  const [mFeederName, setMFeederName] = useState('');
  const [mFeederGi, setMFeederGi] = useState('-');
  const [mFeederGh, setMFeederGh] = useState('-');
  const [mFeederStatus, setMFeederStatus] = useState('Utama');
  const [mFeederOpStatus, setMFeederOpStatus] = useState('Operasi');
  const [mFeederKha, setMFeederKha] = useState<number | string>('');
  const [mFeederLength, setMFeederLength] = useState<number | string>('');
  const [mFeederGarduCount, setMFeederGarduCount] = useState<number | string>('');
  const [mFeederCust, setMFeederCust] = useState<number | string>('');
  const [mFeederConfig, setMFeederConfig] = useState('Looping');

  // 5b. Master Section
  const [mSecCode, setMSecCode] = useState('');
  const [mSecName, setMSecName] = useState('');
  const [mSecFeeder, setMSecFeeder] = useState('ALLANG');
  const [mSecSubstation, setMSecSubstation] = useState('GH Bandara');
  const [mSecStart, setMSecStart] = useState('');
  const [mSecEnd, setMSecEnd] = useState('');
  const [mSecGarduCount, setMSecGarduCount] = useState<number | string>('');
  const [mSecLength, setMSecLength] = useState<number | string>('');
  const [mSecKha, setMSecKha] = useState<number | string>('');
  const [mSecCust, setMSecCust] = useState<number | string>('');
  const [mSecStatus, setMSecStatus] = useState<string>('Operasi');
  const [mSecPemutusId, setMSecPemutusId] = useState('');
  const [mSecPemutusCode, setMSecPemutusCode] = useState('');
  const [mSecPemutusType, setMSecPemutusType] = useState<string>('');
  const [mSecHasFco, setMSecHasFco] = useState(false);
  const [mSecBranchDeviceType, setMSecBranchDeviceType] = useState<'FCO' | 'LBSM' | 'Recloser' | 'PMCB'>('FCO');
  const [mSecFcoName, setMSecFcoName] = useState('');
  const [mSecFcoLength, setMSecFcoLength] = useState<number | string>('');
  const [mSecFcoKha, setMSecFcoKha] = useState<number | string>('');
  const [mSecFcoLaterals, setMSecFcoLaterals] = useState('');
  const [mSecFcoBranches, setMSecFcoBranches] = useState<BranchDevice[]>([]);

  // 5c. Master Pemutus
  const [pmtCode, setPmtCode] = useState('');
  const [pmtType, setPmtType] = useState<'PMCB' | 'Recloser' | 'LBS Motorized' | 'LBS Manual' | 'SSO' | 'Sectionalizer'>('PMCB');
  const [pmtFeeder, setPmtFeeder] = useState('ALLANG');
  const [pmtSectionId, setPmtSectionId] = useState('');
  const [pmtLoc, setPmtLoc] = useState('');
  const [pmtBrand, setPmtBrand] = useState('');
  const [pmtRating, setPmtRating] = useState<number | string>(630);
  const [pmtScada, setPmtScada] = useState<'Terhubung SCADA' | 'Manual / Non-SCADA'>('Terhubung SCADA');
  const [pmtStatus, setPmtStatus] = useState<'Masuk / ON' | 'Lepas / OFF'>('Masuk / ON');

  const handleMAddBranch = () => {
    const newBr: BranchDevice = {
      id: `br-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      branchDeviceType: 'FCO',
      fcoBranchName: '',
      fcoLengthKms: undefined,
      fcoKhaAmpere: undefined,
      fcoLaterals: []
    };
    setMSecFcoBranches(prev => [...prev, newBr]);
    setMSecHasFco(true);
  };

  const handleMRemoveBranch = (index: number) => {
    setMSecFcoBranches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setMSecHasFco(false);
      return updated;
    });
  };

  const handleMUpdateBranch = (index: number, key: keyof BranchDevice, val: any) => {
    setMSecFcoBranches(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };
  const [mSecCurrentLoad, setMSecCurrentLoad] = useState<number | string>('');
  const [mSecVoltageKv, setMSecVoltageKv] = useState<number | string>('');
  const [mSecVoltageDrop, setMSecVoltageDrop] = useState<number | string>('');
  const [mSecTemperature, setMSecTemperature] = useState<number | string>('');

  const handleMFeederGiChange = (val: string) => {
    setMFeederGi(val);
    if (val && val !== '-') {
      setMFeederGh('-');
      setMFeederStatus('Utama');
    }
  };

  const handleMFeederGhChange = (val: string) => {
    setMFeederGh(val);
    if (val && val !== '-') {
      setMFeederGi('-');
      setMFeederStatus('Percabangan');
    }
  };

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
    { id: 'master_section', label: 'Master Section', icon: Layers, color: 'text-cyan-500' },
    { id: 'master_pemutus', label: 'Alat Pemutus (PMCB/Recloser)', icon: Cpu, color: 'text-blue-500' },
    { id: 'saidi_saifi', label: 'SAIDI / SAIFI', icon: BarChart2, color: 'text-teal-500' },
    { id: 'material', label: 'Stok Material', icon: Package, color: 'text-indigo-500' },
    { id: 'apd', label: 'Alat Kerja & APD', icon: Shield, color: 'text-emerald-500' },
    { id: 'kendaraan', label: 'Armada Kendaraan', icon: Car, color: 'text-sky-500' },
    { id: 'users', label: 'Akses User', icon: Users, color: 'text-slate-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'trips' && onSaveTrip) {
      let durationMins = 0;
      if (tripTime && recoveryTime) {
        const [h1, m1] = tripTime.split(':').map(Number);
        const [h2, m2] = recoveryTime.split(':').map(Number);
        if (!isNaN(h1) && !isNaN(m1) && !isNaN(h2) && !isNaN(m2)) {
          let mins1 = h1 * 60 + m1;
          let mins2 = h2 * 60 + m2;
          if (mins2 < mins1) mins2 += 24 * 60;
          durationMins = mins2 - mins1;
        }
      }

      const ampVal = Number(tripAmpere) || 0;
      const kwVal = ampVal > 0 ? Math.round(Math.sqrt(3) * 20 * ampVal * 0.95) : 0;
      const durHours = durationMins / 60;
      const ensVal = Math.round(kwVal * durHours);
      const affCust = Number(tripCustomers) || 0;
      const systemTotalCustomers = (masterFeeders || []).reduce((sum, f) => sum + (Number(f.customerCount) || 0), 0);
      const totalUlp = systemTotalCustomers > 0 ? systemTotalCustomers : 45200;
      const saidiH = totalUlp > 0 ? (durHours * affCust) / totalUlp : 0;
      const saidiM = saidiH * 60;
      const saifiC = totalUlp > 0 ? affCust / totalUlp : 0;

      const iNolNum = Number(tripINol) || 0;
      const iL1Num = Number(tripIL1) || 0;
      const iL2Num = Number(tripIL2) || 0;
      const iL3Num = Number(tripIL3) || 0;
      const maxI = Math.max(iNolNum, iL1Num, iL2Num, iL3Num);

      let estDist: number | undefined = undefined;
      let faultType: string | undefined = undefined;

      if (maxI > 0) {
        let iFault = maxI;
        if (iNolNum >= 15) {
          faultType = 'Gangguan 1 Phasa ke Tanah (GFR)';
          iFault = iNolNum;
        } else if (iL1Num > 30 && iL2Num > 30 && iL3Num > 30) {
          faultType = 'Gangguan 3 Phasa Simetris (OCR)';
          iFault = (iL1Num + iL2Num + iL3Num) / 3;
        } else {
          faultType = 'Gangguan 2 Phasa / Phasa-Phasa (OCR)';
        }

        const V_phase = 11547;
        const zLine = 0.41;
        let dist = V_phase / (iFault * zLine);
        if (ampVal > 0 && iFault > ampVal) {
          const net = iFault - (ampVal * 0.25);
          if (net > 0) dist = V_phase / (net * zLine);
        }
        estDist = Number(Math.min(Math.max(dist, 0.2), 40.0).toFixed(2));
      }

      onSaveTrip({
        id: `TRIP-INPUT-${Date.now()}`,
        feederName: tripFeeder || (masterFeeders[0]?.feederName || ''),
        substation: 'GI Passo (20kV)',
        tripDate,
        tripTime,
        recoveryTime,
        durationMinutes: durationMins,
        relayType: tripRelay as any,
        currentAmpere: ampVal,
        kwPadam: kwVal,
        locationKm: tripLocation,
        coordinates: tripCoordinates,
        cause: tripCause,
        category: tripCategory as any,
        affectedCustomers: affCust,
        totalUlpCustomers: totalUlp,
        saidiHours: Number(saidiH.toFixed(4)),
        saidiMinutes: Number(saidiM.toFixed(2)),
        saifiCount: Number(saifiC.toFixed(4)),
        ensKwh: ensVal,
        financialLossIdr: Math.round(ensVal * 1444.7),
        status: 'Resolved',
        iNol: iNolNum,
        iL1: iL1Num,
        iL2: iL2Num,
        iL3: iL3Num,
        estimatedDistanceKm: estDist,
        faultTypeDetected: faultType
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
      const finalGh = mFeederGh === '-' ? '' : mFeederGh;
      const finalStatus = (finalGh && finalGh !== '') ? 'Percabangan' : (mFeederStatus || 'Utama');
      onSaveMasterFeeder({
        id: `MF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        feederCode: mFeederCode.trim().toUpperCase(),
        feederName: mFeederName.trim(),
        substationName: mFeederGi || '-',
        garduHubung: finalGh,
        status: finalStatus,
        operationalStatus: mFeederOpStatus || 'Operasi',
        khaAmpere: mFeederKha !== '' ? Number(mFeederKha) : 0,
        capacityKva: mFeederKha !== '' ? Number(mFeederKha) : 0,
        lengthKms: mFeederLength !== '' ? Number(mFeederLength) : 0,
        garduCount: mFeederGarduCount !== '' ? Number(mFeederGarduCount) : 0,
        customerCount: mFeederCust !== '' ? Number(mFeederCust) : 0,
        configuration: mFeederConfig || 'Looping',
        voltageKv: 20,
        sectionCount: 12,
        breakerType: 'Vacuum Breaker 20kV'
      });
      setMFeederCode('');
      setMFeederName('');
      setMFeederGi('-');
      setMFeederGh('-');
      setMFeederKha('');
      setMFeederLength('');
      setMFeederGarduCount('');
      setMFeederCust('');
    } else if (activeTab === 'master_section' && onSaveMasterSection) {
      const branchesToSave = mSecFcoBranches.map(b => ({
        ...b,
        fcoBranchName: b.fcoBranchName.trim() || `${b.branchDeviceType || 'FCO'} Percabangan`
      }));
      const hasBranch = branchesToSave.length > 0;

      const selectedPmt = masterPemutus.find(p => p.id === mSecPemutusId);

      onSaveMasterSection({
        id: `SEC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sectionCode: mSecCode || `SEC-${Math.floor(Math.random() * 900 + 100)}`,
        sectionName: mSecName || 'Section Baru',
        feederName: mSecFeeder || 'ALLANG',
        substation: mSecSubstation || 'GH Bandara',
        startPoint: mSecStart || '-',
        endPoint: mSecEnd || '-',
        lengthKms: mSecLength !== '' ? Number(mSecLength) : 0,
        garduCount: mSecGarduCount !== '' ? Number(mSecGarduCount) : 0,
        khaAmpere: mSecKha !== '' ? Number(mSecKha) : 0,
        bebanUtamaKha: mSecLength !== '' ? Number(mSecLength) : 0,
        bebanCabangKha: 0,
        totalBebanKha: mSecKha !== '' ? Number(mSecKha) : 0,
        customerCount: mSecCust !== '' ? Number(mSecCust) : 0,
        status: mSecStatus || 'Operasi',
        pemutusId: mSecPemutusId || (selectedPmt?.id) || undefined,
        pemutusCode: mSecPemutusCode || (selectedPmt?.equipmentCode) || undefined,
        pemutusType: (mSecPemutusType as any) || (selectedPmt?.equipmentType) || undefined,
        fcoBranches: branchesToSave,
        hasFcoBranch: hasBranch,
        branchDeviceType: hasBranch ? branchesToSave[0].branchDeviceType : 'FCO',
        fcoBranchName: hasBranch ? branchesToSave[0].fcoBranchName : '',
        fcoLengthKms: hasBranch ? branchesToSave[0].fcoLengthKms : undefined,
        fcoKhaAmpere: hasBranch ? branchesToSave[0].fcoKhaAmpere : undefined,
        fcoLaterals: hasBranch ? branchesToSave[0].fcoLaterals : [],
        currentLoad: mSecCurrentLoad !== '' ? Number(mSecCurrentLoad) : undefined,
        currentLoadAmpere: mSecCurrentLoad !== '' ? Number(mSecCurrentLoad) : undefined,
        voltageKv: mSecVoltageKv !== '' ? Number(mSecVoltageKv) : undefined,
        voltageDropPercent: mSecVoltageDrop !== '' ? Number(mSecVoltageDrop) : undefined,
        temperatureCelsius: mSecTemperature !== '' ? Number(mSecTemperature) : undefined
      });
      setMSecCode('');
      setMSecName('');
      setMSecStart('');
      setMSecEnd('');
      setMSecLength('');
      setMSecGarduCount('');
      setMSecKha('');
      setMSecCust('');
      setMSecPemutusId('');
      setMSecPemutusCode('');
      setMSecPemutusType('');
      setMSecHasFco(false);
      setMSecFcoBranches([]);
      setMSecBranchDeviceType('FCO');
      setMSecFcoName('');
      setMSecFcoLength('');
      setMSecFcoKha('');
      setMSecFcoLaterals('');
      setMSecCurrentLoad('');
      setMSecVoltageKv('');
      setMSecVoltageDrop('');
      setMSecTemperature('');
    } else if (activeTab === 'master_pemutus' && onSaveMasterPemutus) {
      const selectedSec = masterSections.find(s => s.id === pmtSectionId);
      const generatedCode = pmtCode.trim() || `${pmtType.toUpperCase().replace(/\s+/g, '')}-${pmtFeeder.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`;

      onSaveMasterPemutus({
        id: `PMT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        equipmentCode: generatedCode,
        equipmentType: pmtType,
        feederName: pmtFeeder,
        sectionId: pmtSectionId || undefined,
        sectionName: selectedSec?.sectionName || undefined,
        location: pmtLoc || `Tiang ${generatedCode}`,
        brandModel: pmtBrand || 'Entec / Tavrida 20kV',
        currentRatingAmpere: Number(pmtRating) || 630,
        scadaStatus: pmtScada,
        status: pmtStatus,
        lastMaintenance: new Date().toISOString().split('T')[0]
      });

      setPmtCode('');
      setPmtType('PMCB');
      setPmtFeeder(masterFeeders[0]?.feederName || 'ALLANG');
      setPmtSectionId('');
      setPmtLoc('');
      setPmtBrand('');
      setPmtRating(630);
      setPmtScada('Terhubung SCADA');
      setPmtStatus('Masuk / ON');
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
                Pusat Input Data Operasional Distribusi
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  ULP Baguala
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formulir Entri Data Penyulang
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

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: TRIPS */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold mb-3">
                Input Kejadian Gangguan & Trip Feeder Penyulang 20kV (Manual Input)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Penyulang / Feeder (Master Data)</label>
                  <select 
                    value={tripFeeder} 
                    onChange={(e) => {
                      const selName = e.target.value;
                      setTripFeeder(selName);
                      const found = masterFeeders.find(f => f.feederName === selName);
                      const custCount = found?.customerCount !== undefined && found?.customerCount !== null ? found.customerCount : 0;
                      setTripCustomers(custCount.toString());
                    }} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {masterFeeders.length > 0 ? (
                      masterFeeders.map(f => (
                        <option key={f.feederName} value={f.feederName}>
                          {f.feederName} ({f.customerCount !== undefined && f.customerCount !== null ? f.customerCount.toLocaleString('id-ID') : 0} Plg)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="LATERI 1">LATERI 1 (3.820 Plg)</option>
                        <option value="LATERI 2">LATERI 2 (5.310 Plg)</option>
                        <option value="LATERI 3">LATERI 3 (3.100 Plg)</option>
                        <option value="TULEHU">TULEHU (0 Plg)</option>
                        <option value="ALLANG">ALLANG (4.120 Plg)</option>
                        <option value="PASSO">PASSO (2.950 Plg)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Relay Dominan</label>
                  <select value={tripRelay} onChange={(e) => setTripRelay(e.target.value)} className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <option value="GFR / OCR">GFR / OCR (Tanah & Arus Lebih)</option>
                    <option value="GFR">GFR (Ground Fault Relay)</option>
                    <option value="OCR">OCR (Over Current Relay)</option>
                    <option value="UVR">UVR (Under Voltage Relay)</option>
                    <option value="OVR">OVR (Over Voltage Relay)</option>
                    <option value="UFR">UFR (Under Frequency Relay)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Tanggal Trip</label>
                  <input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jam Trip</label>
                  <input type="time" value={tripTime} onChange={(e) => setTripTime(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Jam Masuk</label>
                  <input type="time" value={recoveryTime} onChange={(e) => setRecoveryTime(e.target.value)} className="w-full p-2 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Beban Arus (Ampere / A)</label>
                  <input type="number" value={tripAmpere} onChange={(e) => setTripAmpere(e.target.value)} placeholder="e.g. 380" className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Pelanggan Terdampak</label>
                  <input type="number" value={tripCustomers} onChange={(e) => setTripCustomers(e.target.value)} placeholder="e.g. 5310" className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Titik Lokasi Km SUTM</label>
                  <input type="text" value={tripLocation} onChange={(e) => setTripLocation(e.target.value)} placeholder="e.g. Km 6.2 Passo Dalam" className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Koordinat Lokasi (Lat, Long)</label>
                  <input type="text" value={tripCoordinates} onChange={(e) => setTripCoordinates(e.target.value)} placeholder="e.g. -3.6285, 128.2214" className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-cyan-600 dark:text-cyan-400 font-semibold" />
                </div>
              </div>

              {/* Form Arus Gangguan INOL, L1, L2, L3 */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <label className="font-bold text-purple-700 dark:text-purple-300 block text-xs">Form Arus Gangguan (Ampere):</label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 block">INOL</span>
                    <input type="number" value={tripINol} onChange={(e) => setTripINol(e.target.value)} placeholder="INOL" className="w-full p-2 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 font-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 block">L1</span>
                    <input type="number" value={tripIL1} onChange={(e) => setTripIL1(e.target.value)} placeholder="L1" className="w-full p-2 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-yellow-500 block">L2</span>
                    <input type="number" value={tripIL2} onChange={(e) => setTripIL2(e.target.value)} placeholder="L2" className="w-full p-2 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-yellow-600 dark:text-yellow-400 font-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 block">L3</span>
                    <input type="number" value={tripIL3} onChange={(e) => setTripIL3(e.target.value)} placeholder="L3" className="w-full p-2 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-black" />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Uraian Penyebab Gangguan</label>
                <textarea rows={2} value={tripCause} onChange={(e) => setTripCause(e.target.value)} placeholder="Tuliskan penyebab gangguan..." className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium" />
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
                Input Data Penyulang
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Penyulang</label>
                  <input 
                    type="text" 
                    value={mFeederCode} 
                    onChange={(e) => setMFeederCode(e.target.value)} 
                    placeholder="Contoh: BDR1" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Penyulang</label>
                  <input 
                    type="text" 
                    value={mFeederName} 
                    onChange={(e) => setMFeederName(e.target.value)} 
                    placeholder="Contoh: Bandara 1" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gardu Induk</label>
                  <select 
                    value={mFeederGi} 
                    onChange={(e) => handleMFeederGiChange(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-">Pilih Gardu</option>
                    <option value="Hative Besar">Hative Besar</option>
                    <option value="GIS Passo">GIS Passo</option>
                    <option value="GI Passo">GI Passo</option>
                    <option value="GI Sirimau">GI Sirimau</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GH</label>
                  <select 
                    value={mFeederGh} 
                    onChange={(e) => handleMFeederGhChange(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-">Pilih Gardu</option>
                    <option value="GH Area">GH Area</option>
                    <option value="GH Aston">GH Aston</option>
                    <option value="GH Baguala">GH Baguala</option>
                    <option value="GH Bandara">GH Bandara</option>
                    <option value="GH Box Pantai Galala">GH Box Pantai Galala</option>
                    <option value="GH Box Pantai Poka">GH Box Pantai Poka</option>
                    <option value="GH Hative Kecil">GH Hative Kecil</option>
                    <option value="GH Poka">GH Poka</option>
                    <option value="GH Wayame">GH Wayame</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select 
                    value={mFeederStatus} 
                    onChange={(e) => setMFeederStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Utama">Utama</option>
                    <option value="Percabangan">Percabangan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Operasional</label>
                  <select 
                    value={mFeederOpStatus} 
                    onChange={(e) => setMFeederOpStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kapasitas Gardu (kVA)</label>
                  <input 
                    type="number" 
                    value={mFeederKha} 
                    onChange={(e) => setMFeederKha(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Panjang (kms)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={mFeederLength} 
                    onChange={(e) => setMFeederLength(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Gardu</label>
                  <input 
                    type="number" 
                    value={mFeederGarduCount} 
                    onChange={(e) => setMFeederGarduCount(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Pel</label>
                  <input 
                    type="number" 
                    value={mFeederCust} 
                    onChange={(e) => setMFeederCust(e.target.value)} 
                    placeholder="0" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Konfigurasi</label>
                <select 
                  value={mFeederConfig} 
                  onChange={(e) => setMFeederConfig(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Looping">Looping</option>
                  <option value="Radial">Radial</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 5b: MASTER SECTION */}
          {activeTab === 'master_section' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold mb-3 flex items-center justify-between">
                <span>Input Data Section / Segmen Jaringan 20kV</span>
                <span className="text-[11px] font-normal text-cyan-600 dark:text-cyan-400">Master Section & Topologi</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Section</label>
                  <input 
                    type="text" 
                    value={mSecCode} 
                    onChange={(e) => setMSecCode(e.target.value)} 
                    placeholder="Contoh: ALG-ALL-01" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Section</label>
                  <input 
                    type="text" 
                    value={mSecName} 
                    onChange={(e) => setMSecName(e.target.value)} 
                    placeholder="Contoh: GH Bandara-Namahatu" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang</label>
                  <select 
                    value={mSecFeeder} 
                    onChange={(e) => {
                      setMSecFeeder(e.target.value);
                      setMSecPemutusId('');
                      setMSecPemutusCode('');
                      setMSecPemutusType('');
                    }} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Pilih Penyulang</option>
                    {masterFeeders.length === 0 ? (
                      <>
                        <option value="ALLANG">ALLANG</option>
                        <option value="LATERI 2">LATERI 2</option>
                        <option value="TULEHU">TULEHU</option>
                        <option value="PASSO">PASSO</option>
                        <option value="BATU MERAH">BATU MERAH</option>
                        <option value="HATIVE">HATIVE</option>
                      </>
                    ) : (
                      masterFeeders.map(f => (
                        <option key={f.id || f.feederName} value={f.feederName}>
                          {f.feederName} ({f.feederCode})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GI / GH Asal</label>
                  <select 
                    value={mSecSubstation} 
                    onChange={(e) => setMSecSubstation(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  >
                    <option value="">-- Pilih GI / GH Asal --</option>
                    <optgroup label="Gardu Induk (GI)">
                      <option value="GI Passo">GI Passo</option>
                      <option value="GIS Passo">GIS Passo</option>
                      <option value="GI Hative Besar">GI Hative Besar</option>
                      <option value="GI Sirimau">GI Sirimau</option>
                    </optgroup>
                    <optgroup label="Gardu Hubung (GH)">
                      <option value="GH Area">GH Area</option>
                      <option value="GH Aston">GH Aston</option>
                      <option value="GH Baguala">GH Baguala</option>
                      <option value="GH Bandara">GH Bandara</option>
                      <option value="GH Box Pantai Galala">GH Box Pantai Galala</option>
                      <option value="GH Box Pantai Poka">GH Box Pantai Poka</option>
                      <option value="GH Hative Kecil">GH Hative Kecil</option>
                      <option value="GH Poka">GH Poka</option>
                      <option value="GH Wayame">GH Wayame</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Pemutus Jaringan (PMCB, Recloser, LBS) Connection */}
              <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Alat Pemutus Section (PMCB / Recloser / LBS)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Terkoneksi ke simulasi pemadaman SAIDI/SAIFI</span>
                </div>
                <select
                  value={mSecPemutusId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    setMSecPemutusId(selId);
                    const found = masterPemutus.find(p => p.id === selId);
                    if (found) {
                      setMSecPemutusCode(found.equipmentCode);
                      setMSecPemutusType(found.equipmentType);
                    } else {
                      setMSecPemutusCode('');
                      setMSecPemutusType('');
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border font-bold bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="">-- Tanpa Alat Pemutus Khusus / GI Pangkal --</option>
                  {masterPemutus
                    .filter(p => !mSecFeeder || p.feederName.toLowerCase() === mSecFeeder.toLowerCase())
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.equipmentType}] {p.equipmentCode} - {p.location} ({p.status})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Titik Awal (In / Pangkal)</label>
                  <input 
                    type="text" 
                    value={mSecStart} 
                    onChange={(e) => setMSecStart(e.target.value)} 
                    placeholder="Contoh: GH Bandara (Pangkal)" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Titik Akhir (Out / Ujung)</label>
                  <input 
                    type="text" 
                    value={mSecEnd} 
                    onChange={(e) => setMSecEnd(e.target.value)} 
                    placeholder="Contoh: Recloser Namahatu (Node)" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Panjang (kms)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={mSecLength} 
                    onChange={(e) => setMSecLength(e.target.value)} 
                    placeholder="Contoh: 11.2" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Gardu</label>
                  <input 
                    type="number" 
                    value={mSecGarduCount} 
                    onChange={(e) => setMSecGarduCount(e.target.value)} 
                    placeholder="Contoh: 18" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">kVA Gardu</label>
                  <input 
                    type="number" 
                    value={mSecKha} 
                    onChange={(e) => setMSecKha(e.target.value)} 
                    placeholder="Contoh: 450" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Kondisi</label>
                  <select 
                    value={mSecStatus} 
                    onChange={(e) => setMSecStatus(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Operasi">Operasi</option>
                    <option value="Tidak Operasi">Tidak Operasi</option>
                    <option value="Warning">Warning</option>
                    <option value="Kritis">Kritis</option>
                    <option value="Manuver (Open)">Manuver (Open)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Pelanggan</label>
                  <input 
                    type="number" 
                    value={mSecCust} 
                    onChange={(e) => setMSecCust(e.target.value)} 
                    placeholder="Contoh: 1250" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500" 
                  />
                </div>
              </div>

              {/* Percabangan Configuration (Multi-Branch Support) */}
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-amber-600 dark:text-amber-400">Percabangan Lateral</div>
                      <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Tambah percabangan (FCO / LBSM / Recloser / PMCB) pada section ini</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleMAddBranch}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Percabangan</span>
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  📍 Posisi: Percabangan ditempatkan diantara section [{mSecStart || 'Pangkal'}] &rarr; [{mSecEnd || 'Ujung Section'}]
                </div>

                {mSecFcoBranches.length === 0 ? (
                  <div className="text-center py-3 text-xs text-slate-400 border border-dashed border-amber-500/20 rounded-xl">
                    Belum ada percabangan lateral pada section ini. Klik tombol <span className="font-bold text-amber-500">+ Tambah Percabangan</span> di atas untuk menambahkan.
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {mSecFcoBranches.map((br, bIdx) => (
                      <div key={br.id || bIdx} className="p-3 rounded-xl border border-amber-500/30 bg-white dark:bg-slate-900/60 space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            Percabangan Lateral #{bIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMRemoveBranch(bIdx)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus Percabangan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Peralatan Percabangan</label>
                            <select
                              value={br.branchDeviceType || 'FCO'}
                              onChange={(e) => handleMUpdateBranch(bIdx, 'branchDeviceType', e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-bold cursor-pointer"
                            >
                              <option value="FCO">FCO (Cut Out)</option>
                              <option value="LBSM">LBSM (LBS Motorized)</option>
                              <option value="Recloser">Recloser</option>
                              <option value="PMCB">PMCB (Pemutus CB)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Node Percabangan</label>
                            <input
                              type="text"
                              value={br.fcoBranchName || ''}
                              onChange={(e) => handleMUpdateBranch(bIdx, 'fcoBranchName', e.target.value)}
                              placeholder="Contoh: Perc. Hutumuri"
                              className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Panjang Cabang (kms)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={br.fcoLengthKms !== undefined && br.fcoLengthKms !== null ? br.fcoLengthKms : ''}
                              onChange={(e) => handleMUpdateBranch(bIdx, 'fcoLengthKms', e.target.value !== '' ? Number(e.target.value) : undefined)}
                              placeholder="Contoh: 0.8"
                              className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">kVA Gardu (Cabang)</label>
                            <input
                              type="number"
                              value={br.fcoKhaAmpere !== undefined && br.fcoKhaAmpere !== null ? br.fcoKhaAmpere : ''}
                              onChange={(e) => handleMUpdateBranch(bIdx, 'fcoKhaAmpere', e.target.value !== '' ? Number(e.target.value) : undefined)}
                              placeholder="Contoh: 65"
                              className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Telemetri Real-time Section */}
              <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Parameter Telemetri Monitoring Section
                </span>
                <div className="grid grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Beban Arus (A)</label>
                    <input
                      type="number"
                      value={mSecCurrentLoad}
                      onChange={(e) => setMSecCurrentLoad(e.target.value)}
                      placeholder="Contoh: 180"
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Tegangan (kV)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mSecVoltageKv}
                      onChange={(e) => setMSecVoltageKv(e.target.value)}
                      placeholder="Contoh: 20.1"
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Drop Tegangan (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mSecVoltageDrop}
                      onChange={(e) => setMSecVoltageDrop(e.target.value)}
                      placeholder="Contoh: 1.5"
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Temperatur Konduktor (°C)</label>
                    <input
                      type="number"
                      value={mSecTemperature}
                      onChange={(e) => setMSecTemperature(e.target.value)}
                      placeholder="Contoh: 38"
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5c: MASTER PEMUTUS */}
          {activeTab === 'master_pemutus' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Input Data Master Alat Pemutus Beban 20kV (PMCB / Recloser / LBS)</span>
                </span>
                <span className="text-[11px] font-normal text-blue-600 dark:text-blue-400">Proteksi & Switching</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jenis Peralatan Pemutus</label>
                  <select 
                    value={pmtType} 
                    onChange={(e) => setPmtType(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PMCB">PMCB (Pole Mounted Circuit Breaker)</option>
                    <option value="Recloser">Recloser (Penutup Balik Otomatis)</option>
                    <option value="LBS Motorized">LBS Motorized (Load Break Switch Motor)</option>
                    <option value="LBS Manual">LBS Manual</option>
                    <option value="SSO">SSO (Sectionalizer Switch)</option>
                    <option value="Sectionalizer">Sectionalizer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Peralatan</label>
                  <input 
                    type="text" 
                    value={pmtCode} 
                    onChange={(e) => setPmtCode(e.target.value)} 
                    placeholder={`Contoh: ${pmtType.toUpperCase()}-${pmtFeeder.substring(0, 3)}-01`} 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Penyulang (Feeder)</label>
                  <select 
                    value={pmtFeeder} 
                    onChange={(e) => {
                      setPmtFeeder(e.target.value);
                      setPmtSectionId('');
                    }} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {masterFeeders.length === 0 ? (
                      <>
                        <option value="ALLANG">ALLANG</option>
                        <option value="LATERI 2">LATERI 2</option>
                        <option value="TULEHU">TULEHU</option>
                        <option value="PASSO">PASSO</option>
                        <option value="BATU MERAH">BATU MERAH</option>
                        <option value="HATIVE">HATIVE</option>
                      </>
                    ) : (
                      masterFeeders.map(f => (
                        <option key={f.id || f.feederName} value={f.feederName}>
                          {f.feederName} ({f.feederCode})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Koneksi Section (Titik Proteksi Awal)
                  </label>
                  <select 
                    value={pmtSectionId} 
                    onChange={(e) => setPmtSectionId(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="">Semua Section / GI (Proteksi Total dari Pangkal GI s/d Ujung)</option>
                    {masterSections
                      .filter(s => !pmtFeeder || s.feederName.toLowerCase() === pmtFeeder.toLowerCase())
                      .map(s => {
                        const cov = getDownstreamCoveredSections(pmtFeeder, s.id, masterSections);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.sectionCode ? `[${s.sectionCode}] ` : ''}{s.sectionName} ➔ Mengkover {cov.coveredSections.length > 1 ? `${cov.coveredSections.length} Section` : 'Section'} s/d Ujung ({cov.totalGardu} Gardu)
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              {/* Dynamic Downstream Coverage Preview */}
              {(() => {
                const covInfo = getDownstreamCoveredSections(pmtFeeder, pmtSectionId, masterSections);
                const selectedSec = masterSections.find(s => s.id === pmtSectionId);
                return (
                  <div className={`p-3 rounded-xl border transition-all text-xs ${
                    pmtSectionId 
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200'
                      : 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Zap className={`w-4 h-4 ${pmtSectionId ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-600 dark:text-blue-400'}`} />
                        <span>Cakupan Proteksi & Pengaruh Padam:</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        pmtSectionId
                          ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                          : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      }`}>
                        {pmtSectionId ? `${selectedSec?.sectionName || covInfo.shortLabel} - Ujung Jaringan` : 'Semua Section / GI'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {pmtSectionId ? (
                        <>
                          Pemutus ini dipasang pada section awal dan <strong className="text-indigo-600 dark:text-indigo-400 font-bold">mengkover section tersebut beserta seluruh section setelahnya hingga ujung jaringan</strong>.
                        </>
                      ) : (
                        <>
                          Pemutus beroperasi di <strong className="text-blue-600 dark:text-blue-400 font-bold">Pangkal GI (Semua Section)</strong> dan memproteksi seluruh jalur penyulang dari awal hingga ujung jaringan.
                        </>
                      )}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                      <div className="bg-white/70 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[9px] text-slate-500 font-medium">Total Section</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.coveredSections.length} Section</div>
                      </div>
                      <div className="bg-white/70 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[9px] text-slate-500 font-medium">Gardu Terkover</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.totalGardu} Gardu</div>
                      </div>
                      <div className="bg-white/70 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[9px] text-slate-500 font-medium">Pelanggan Terkover</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">{covInfo.totalCustomers.toLocaleString('id-ID')} Plg</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi / Titik Tiang</label>
                  <input 
                    type="text" 
                    value={pmtLoc} 
                    onChange={(e) => setPmtLoc(e.target.value)} 
                    placeholder="Contoh: Tiang ALG-089 Desa Laha" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Merk / Model</label>
                  <input 
                    type="text" 
                    value={pmtBrand} 
                    onChange={(e) => setPmtBrand(e.target.value)} 
                    placeholder="Contoh: Tavrida OSM25 / Entec" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Arus Rating (A)</label>
                  <input 
                    type="number" 
                    value={pmtRating} 
                    onChange={(e) => setPmtRating(e.target.value)} 
                    placeholder="630" 
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Koneksi SCADA</label>
                  <select 
                    value={pmtScada} 
                    onChange={(e) => setPmtScada(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Terhubung SCADA">Terhubung SCADA (Remote RTU)</option>
                    <option value="Manual / Non-SCADA">Manual / Non-SCADA</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Operasi</label>
                  <select 
                    value={pmtStatus} 
                    onChange={(e) => setPmtStatus(e.target.value as any)} 
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Masuk / ON">Masuk / ON (Tersambung)</option>
                    <option value="Lepas / OFF">Lepas / OFF (Padam/Terbuka)</option>
                  </select>
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
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
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
                <span>Simpan Data</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
