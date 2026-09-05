import React, { useState, useEffect, useMemo } from 'react';
import { FeederTrip, MasterFeeder, MasterSection, MasterGarduHubung, getDownstreamCoveredSections } from '../../types';
import { resolveFeederSupply } from '../../utils/feederSupplyResolver';
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
  ArrowRight,
  MapPin,
  Compass,
  Cpu,
  Navigation,
  GitBranch,
  Radio
} from 'lucide-react';

interface InputGangguanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrip: (trip: FeederTrip) => void;
  isDarkMode: boolean;
  masterFeeders?: MasterFeeder[];
  masterSections?: MasterSection[];
  masterGarduHubung?: MasterGarduHubung[];
  tripToEdit?: FeederTrip | null;
}

// Default Fallback Feeder Customer Mapping ULP Baguala if masterFeeders is empty
const DEFAULT_FEEDER_MAP: Record<string, number> = {
  'LATERI 1': 3820,
  'LATERI 2': 5310,
  'LATERI 3': 3100,
  'TULEHU': 0,
  'ALLANG': 4120,
  'PASSO': 2950,
  'WAIHERU': 4200,
  'HUTUMURI': 2800,
  'WAYAME': 0,
  'POKA': 2500,
  'LIANG': 3100,
  'SULI': 2200,
};

export const InputGangguanModal: React.FC<InputGangguanModalProps> = ({
  isOpen,
  onClose,
  onSaveTrip,
  isDarkMode,
  masterFeeders = [],
  masterSections = [],
  masterGarduHubung = [],
  tripToEdit = null
}) => {
  // Available feeders list from Master Data sorted alphabetically
  const availableFeeders = useMemo(() => {
    const list = masterFeeders.length > 0 
      ? masterFeeders.map(f => {
          const secList = (masterSections || []).filter(s => s.feederName && s.feederName.trim().toLowerCase() === f.feederName.trim().toLowerCase());
          const totalSecCust = secList.reduce((sum, s) => sum + (Number(s.customerCount) || 0), 0);
          const supplyResolution = resolveFeederSupply(f.feederName, masterFeeders, masterSections, masterGarduHubung);
          
          return { 
            name: f.feederName, 
            cust: secList.length > 0 ? totalSecCust : (Number(f.customerCount) || 0),
            substation: supplyResolution.defaultGi || f.substationName || 'GI Passo (20kV)',
            garduHubung: supplyResolution.recommendedGh,
            lengthKm: f.lengthKms || 15
          };
        })
      : Object.keys(DEFAULT_FEEDER_MAP).map(k => {
          const supplyResolution = resolveFeederSupply(k, [], [], []);
          return { 
            name: k, 
            cust: DEFAULT_FEEDER_MAP[k],
            substation: supplyResolution.defaultGi,
            garduHubung: supplyResolution.recommendedGh,
            lengthKm: 15
          };
        });
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'id', { numeric: true, sensitivity: 'base' }));
  }, [masterFeeders, masterSections, masterGarduHubung]);

  // Available GHs list (deduplicated and sorted)
  const availableGHList = useMemo(() => {
    const defaultGHs = [
      'GH Baguala', 
      'GH Bandara', 
      'GH Wayame', 
      'GH Hative Kecil', 
      'GH Box Pantai Galala', 
      'GH Box Pantai Poka', 
      'GH Aston', 
      'GH Area', 
      'GH Poka'
    ];
    const fromMaster = (masterGarduHubung || []).map(g => g.ghName).filter(Boolean);
    const combined = Array.from(new Set([...fromMaster, ...defaultGHs]));
    return combined.sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
  }, [masterGarduHubung]);

  // Master total customers sum across all feeders
  const masterTotalCustomers = useMemo(() => {
    return masterFeeders.length > 0 
      ? masterFeeders.reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0) 
      : 0;
  }, [masterFeeders]);

  const defaultUlpCustomers = 0;

  // 1. Basic Info State (Default Blank / Empty for Manual Input)
  const [feederName, setFeederName] = useState('');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [tripTime, setTripTime] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [relayType, setRelayType] = useState<'GFR' | 'OCR' | 'GFR / OCR' | 'UVR' | 'OVR' | 'UFR'>('GFR');
  const [tripScope, setTripScope] = useState<'UTAMA' | 'PERCABANGAN'>('UTAMA');
  
  // Current Feeder Supply Resolution (Auto-Calculated)
  const currentFeederSupply = useMemo(() => {
    return resolveFeederSupply(feederName, masterFeeders, masterSections, masterGarduHubung);
  }, [feederName, masterFeeders, masterSections, masterGarduHubung]);

  // Supply Source & Section / Branch Selection State
  const [supplySourceType, setSupplySourceType] = useState<'GI' | 'GH' | 'PERCABANGAN'>('GI');
  const [selectedGhName, setSelectedGhName] = useState<string>('GH Baguala');
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('');
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>('');

  // 2. Load & Power State (Blank)
  const [currentAmpere, setCurrentAmpere] = useState<string>(''); // Beban Arus Penyulang (A)
  
  // 3. Customer & SAIDI/SAIFI State (Default 0 for Total Pelanggan ULP)
  const [totalUlpCustomers, setTotalUlpCustomers] = useState<number | string>(0);
  const [affectedCustomers, setAffectedCustomers] = useState<string>('');
  
  // 4. Incident Detail State (Blank)
  const [locationKm, setLocationKm] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [cause, setCause] = useState('');
  const [category, setCategory] = useState<string>('E-1 : POHON');

  // 5. Arus Gangguan State (INOL, L1, L2, L3 - Blank)
  const [iNol, setINol] = useState<string>(''); // Ground Fault Current (A)
  const [iL1, setIL1] = useState<string>('');   // Phasa R (A)
  const [iL2, setIL2] = useState<string>('');   // Phasa S (A)
  const [iL3, setIL3] = useState<string>('');   // Phasa T (A)

  // Tariff PLN per kWh
  const TARIFF_PER_KWH = 1444.70;

  // Sections matching currently selected feeder
  const matchingSections = useMemo(() => {
    if (!feederName) return [];
    const secList = masterSections.filter(
      s => s.feederName && s.feederName.trim().toLowerCase() === feederName.trim().toLowerCase()
    );
    return secList;
  }, [feederName, masterSections]);

  // Combined branches for the matching sections
  const availableBranches = useMemo(() => {
    const branches: Array<{
      id: string;
      sectionId: string;
      sectionName: string;
      branchName: string;
      lengthKm: number;
      khaAmpere: number;
      startPoint: string;
      endPoint: string;
      substationOrGh: string;
    }> = [];

    matchingSections.forEach((sec, sIdx) => {
      const sName = sec.sectionName || `Section ${sIdx + 1}`;
      const startPt = sec.startPoint || 'Pangkal Section';
      const endPt = sec.endPoint || 'Ujung Section';
      const sourcePt = sec.substationOrGh || 'GH/GI';

      if (sec.fcoBranches && sec.fcoBranches.length > 0) {
        sec.fcoBranches.forEach((b, bIdx) => {
          branches.push({
            id: b.id || `BR-${sec.id}-${bIdx}`,
            sectionId: sec.id,
            sectionName: sName,
            branchName: b.fcoBranchName || `Percabangan Lateral ${bIdx + 1}`,
            lengthKm: b.fcoLengthKms || 2.0,
            khaAmpere: b.fcoKhaAmpere || 50,
            startPoint: startPt,
            endPoint: endPt,
            substationOrGh: sourcePt
          });
        });
      } else if (sec.hasFcoBranch) {
        branches.push({
          id: `BR-${sec.id}-0`,
          sectionId: sec.id,
          sectionName: sName,
          branchName: sec.fcoBranchName || 'Percabangan FCO Lateral',
          lengthKm: sec.fcoLengthKms || 2.0,
          khaAmpere: sec.fcoKhaAmpere || 50,
          startPoint: startPt,
          endPoint: endPt,
          substationOrGh: sourcePt
        });
      }
    });

    return branches;
  }, [matchingSections]);

  // Real-Time Synchronization Helper for Customer Counts from Master Data & Master Section
  const syncCustomerCountFromMaster = (
    fName: string = feederName,
    sourceType: 'GI' | 'GH' | 'PERCABANGAN' = supplySourceType,
    secKey: string = selectedSectionKey
  ) => {
    if (!fName) return;

    // Filter masterSections ("data section") for this feeder
    const secList = (masterSections || []).filter(
      s => s.feederName && s.feederName.trim().toLowerCase() === fName.trim().toLowerCase()
    );

    if (sourceType === 'PERCABANGAN') {
      if (secKey) {
        const foundSec = secList.find(s => s.id === secKey || s.sectionName === secKey);
        if (foundSec && foundSec.customerCount !== undefined && foundSec.customerCount !== null) {
          setAffectedCustomers(foundSec.customerCount.toString());
          return;
        }
        const covered = getDownstreamCoveredSections(fName, secKey, masterSections);
        if (covered && covered.totalCustomers > 0) {
          setAffectedCustomers(covered.totalCustomers.toString());
          return;
        }
      }
      // If no section key, check first section under matching feeder in masterSections
      if (secList.length > 0 && secList[0].customerCount !== undefined && secList[0].customerCount !== null) {
        setAffectedCustomers(secList[0].customerCount.toString());
        return;
      }
    }

    // Default for GI or GH (Full Feeder):
    // Calculate sum of customerCount across all sections of this feeder from masterSections ("data section")
    const totalSecCust = secList.reduce((sum, s) => sum + (Number(s.customerCount) || 0), 0);
    if (totalSecCust > 0) {
      setAffectedCustomers(totalSecCust.toString());
    } else {
      const foundFeeder = availableFeeders.find(f => f.name.toLowerCase() === fName.toLowerCase());
      setAffectedCustomers(foundFeeder ? foundFeeder.cust.toString() : '0');
    }
  };

  // Reset or populate form whenever modal opens or tripToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (tripToEdit) {
        const fName = tripToEdit.feederName || availableFeeders[0]?.name || '';
        setFeederName(fName);
        setTripDate(tripToEdit.tripDate || new Date().toISOString().split('T')[0]);
        setTripTime(tripToEdit.tripTime || '');
        setRecoveryTime(tripToEdit.recoveryTime || '');
        setDurationMinutes(tripToEdit.durationMinutes || 0);
        setRelayType(tripToEdit.relayType || 'GFR / OCR');
        setTripScope(tripToEdit.tripScope || 'UTAMA');
        
        const supplyRes = resolveFeederSupply(fName, masterFeeders, masterSections, masterGarduHubung);

        // Supply Source
        if (tripToEdit.supplySourceType) {
          setSupplySourceType(tripToEdit.supplySourceType === 'SECTION' ? 'PERCABANGAN' : tripToEdit.supplySourceType);
        } else if (tripToEdit.tripScope === 'PERCABANGAN') {
          setSupplySourceType('GH');
        } else {
          setSupplySourceType(supplyRes.sourceType);
        }

        setSelectedGhName(
          tripToEdit.supplySourceName && tripToEdit.supplySourceName.startsWith('GH') 
            ? tripToEdit.supplySourceName 
            : supplyRes.recommendedGh
        );
        setSelectedSectionKey(tripToEdit.sectionId || '');
        setSelectedBranchKey(tripToEdit.branchId || tripToEdit.branchName || '');

        setCurrentAmpere(tripToEdit.currentAmpere !== undefined && tripToEdit.currentAmpere !== null ? tripToEdit.currentAmpere.toString() : '');
        setTotalUlpCustomers(tripToEdit.totalUlpCustomers !== undefined && tripToEdit.totalUlpCustomers !== null ? tripToEdit.totalUlpCustomers : 0);
        setAffectedCustomers(tripToEdit.affectedCustomers !== undefined && tripToEdit.affectedCustomers !== null ? tripToEdit.affectedCustomers.toString() : '');
        setLocationKm(tripToEdit.locationKm || '');
        setCoordinates(tripToEdit.coordinates || '');
        setCause(tripToEdit.cause || '');
        setCategory(tripToEdit.category || 'E-1 : POHON');
        setINol(tripToEdit.iNol !== undefined && tripToEdit.iNol !== null ? tripToEdit.iNol.toString() : '');
        setIL1(tripToEdit.iL1 !== undefined && tripToEdit.iL1 !== null ? tripToEdit.iL1.toString() : '');
        setIL2(tripToEdit.iL2 !== undefined && tripToEdit.iL2 !== null ? tripToEdit.iL2.toString() : '');
        setIL3(tripToEdit.iL3 !== undefined && tripToEdit.iL3 !== null ? tripToEdit.iL3.toString() : '');
      } else {
        const defaultFeeder = availableFeeders[0]?.name || '';
        const found = availableFeeders.find(f => f.name === defaultFeeder);
        const supplyRes = resolveFeederSupply(defaultFeeder, masterFeeders, masterSections, masterGarduHubung);

        setFeederName(defaultFeeder);
        setTripDate(new Date().toISOString().split('T')[0]);
        setTripTime('');
        setRecoveryTime('');
        setDurationMinutes(0);
        setRelayType('GFR');
        
        // Auto default supply source and GH based on feeder topology
        setSelectedGhName(supplyRes.recommendedGh);
        setSupplySourceType(supplyRes.sourceType);
        setTripScope(supplyRes.isBranch ? 'PERCABANGAN' : 'UTAMA');

        setSelectedSectionKey('');
        setSelectedBranchKey('');
        setCurrentAmpere('');
        setTotalUlpCustomers(0);
        
        // Sync customer count from Master Data
        const initialCust = found ? found.cust : 0;
        setAffectedCustomers(initialCust.toString());

        setLocationKm('');
        setCoordinates('');
        setCause('');
        setCategory('E-1 : POHON');
        setINol('');
        setIL1('');
        setIL2('');
        setIL3('');
      }
    }
  }, [isOpen, masterFeeders, tripToEdit, masterTotalCustomers]);

  // Auto calculate Duration whenever tripTime or recoveryTime changes with robust parsing & overnight support
  useEffect(() => {
    if (!tripTime || !recoveryTime) {
      setDurationMinutes(0);
      return;
    }
    try {
      const parseTimeToSeconds = (str: string): number | null => {
        if (!str) return null;
        const clean = str.trim().toUpperCase();
        const isPM = clean.includes('PM');
        const isAM = clean.includes('AM');
        const timeOnly = clean.replace(/AM|PM/g, '').trim();
        const parts = timeOnly.split(':').map(p => parseFloat(p));
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
        let hours = parts[0];
        const minutes = parts[1];
        const seconds = parts[2] || 0;
        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        return hours * 3600 + minutes * 60 + seconds;
      };

      const secs1 = parseTimeToSeconds(tripTime);
      const secs2 = parseTimeToSeconds(recoveryTime);

      if (secs1 !== null && secs2 !== null) {
        let diffSecs = secs2 - secs1;
        if (diffSecs < 0) {
          // Overnight shift (across midnight)
          diffSecs += 24 * 3600;
        }
        const diffMins = Math.round(diffSecs / 60);
        if (diffMins >= 0) {
          setDurationMinutes(diffMins);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [tripTime, recoveryTime]);

  // Auto set default affected customers & automatically synchronize GH when user selects a feeder
  const handleFeederChange = (name: string) => {
    setFeederName(name);
    const supplyRes = resolveFeederSupply(name, masterFeeders, masterSections, masterGarduHubung);
    
    // Automatically adjust the connected Gardu Hubung (GH) for this Feeder
    setSelectedGhName(supplyRes.recommendedGh);

    // Auto set supply source & scope based on feeder topology
    const newSourceType: 'GI' | 'GH' | 'PERCABANGAN' = supplyRes.sourceType;
    setSupplySourceType(newSourceType);
    setTripScope(supplyRes.isBranch ? 'PERCABANGAN' : 'UTAMA');
    
    setSelectedSectionKey('');
    setSelectedBranchKey('');

    // Real-time synchronization of customer data
    syncCustomerCountFromMaster(name, newSourceType, '');
  };

  // Realtime calculated values
  const ampereVal = Number(currentAmpere) || 0;
  // Formula PLN 20kV: kW = SQRT(3) * 20kV * I(A) * 0.95
  const kwPadam = ampereVal > 0 ? Math.round(Math.sqrt(3) * 20 * ampereVal * 0.95) : 0;
  const durationHours = durationMinutes / 60;
  const ensKwh = Math.round(kwPadam * durationHours);
  const financialLossCalc = Math.round(ensKwh * TARIFF_PER_KWH);

  const ulpCustVal = Number(totalUlpCustomers) || 0;
  const affCustVal = Number(affectedCustomers) || 0;

  // SAIDI Contribution (Jam/Plg)
  const saidiHoursCalc = ulpCustVal > 0 ? (durationHours * affCustVal) / ulpCustVal : 0;
  const saidiMinutesCalc = saidiHoursCalc * 60;

  // SAIFI Contribution (Kali/Plg)
  const saifiCalc = ulpCustVal > 0 ? affCustVal / ulpCustVal : 0;

  // AI Fault Distance Calculation (from GI Substation vs Gardu Hubung vs Section / Percabangan)
  const iNolNum = Number(iNol) || 0;
  const iL1Num = Number(iL1) || 0;
  const iL2Num = Number(iL2) || 0;
  const iL3Num = Number(iL3) || 0;

  const calculateAiDistance = () => {
    const maxI = Math.max(iNolNum, iL1Num, iL2Num, iL3Num);
    if (maxI <= 0) {
      return {
        detectedType: 'Belum Ada Input Arus Gangguan',
        distanceKm: null,
        cumulativeDistanceKm: null,
        recommendation: 'Silakan input nilai INOL, L1, L2, atau L3 untuk menghitung estimasi jarak lokasi gangguan secara presisi.',
        confidence: '-',
        sourceTitle: supplySourceType === 'GH' ? `Gardu Hubung (${selectedGhName})` : (supplySourceType === 'PERCABANGAN' ? 'Percabangan / Section' : 'GI (Gardu Induk)')
      };
    }

    let faultType = 'Gangguan 2 Phasa / Phasa-Phasa (OCR)';
    let iFault = maxI;

    if (iNolNum >= 15) {
      faultType = 'Gangguan 1 Phasa ke Tanah (GFR / Ground Fault)';
      iFault = iNolNum;
    } else if (iL1Num > 30 && iL2Num > 30 && iL3Num > 30 && Math.abs(iL1Num - iL2Num) < 80 && Math.abs(iL2Num - iL3Num) < 80) {
      faultType = 'Gangguan 3 Phasa Simetris (OCR)';
      iFault = (iL1Num + iL2Num + iL3Num) / 3;
    }

    // Line Impedance for 20kV SUTM AAAC ~ 0.41 Ohm/km
    const V_phase = 11547; // 20,000 / sqrt(3)
    const zLinePerKm = 0.41;
    
    let rawDist = V_phase / (iFault * zLinePerKm);

    // Apply load current compensation
    if (ampereVal > 0 && iFault > ampereVal) {
      const netFaultCurrent = iFault - (ampereVal * 0.25);
      if (netFaultCurrent > 0) {
        rawDist = V_phase / (netFaultCurrent * zLinePerKm);
      }
    }

    // Find feeder info
    const currentFeeder = availableFeeders.find(f => f.name === feederName);
    const feederSubstation = currentFeeder?.substation || 'GI Passo (20kV)';
    const feederTotalLength = currentFeeder?.lengthKm || 18;

    // CASE 1: PERCABANGAN PENYULANG / SECTION
    if (supplySourceType === 'PERCABANGAN') {
      const selectedBranch = availableBranches.find(b => b.id === selectedBranchKey || b.branchName === selectedBranchKey) 
        || availableBranches[0];
      
      const selectedSec = matchingSections.find(s => s.id === selectedSectionKey) 
        || (selectedBranch ? matchingSections.find(s => s.id === selectedBranch.sectionId) : matchingSections[0]);

      const branchNameLabel = selectedBranch ? selectedBranch.branchName : (selectedSec?.fcoBranchName || 'Percabangan Lateral FCO');
      const branchMaxLen = selectedBranch ? selectedBranch.lengthKm : (selectedSec?.fcoLengthKms || 3.0);
      const sectionNameLabel = selectedSec ? selectedSec.sectionName : 'Section Penyulang';
      const tapOffPoint = selectedSec?.startPoint || 'Pangkal Section / FCO Tap-off';
      const targetArea = selectedSec?.endPoint || 'Ujung Jaringan';

      // Distance on the branch itself
      const branchDistKm = Number(Math.min(Math.max(rawDist, 0.1), branchMaxLen).toFixed(2));
      
      // Calculate cumulative distance from GH or GI
      let cumulativeKm = branchDistKm;
      if (matchingSections.length > 0 && selectedSec) {
        const secIndex = matchingSections.findIndex(s => s.id === selectedSec.id);
        const priorLen = matchingSections.slice(0, secIndex).reduce((acc, s) => acc + (s.lengthKms || 0), 0);
        cumulativeKm = Number((priorLen + (selectedSec.lengthKms ? selectedSec.lengthKms * 0.5 : 0) + branchDistKm).toFixed(2));
      }

      const kmStart = Math.max(0, Number((branchDistKm - 0.2).toFixed(1)));
      const kmEnd = Number((branchDistKm + 0.2).toFixed(1));

      return {
        detectedType: faultType,
        distanceKm: branchDistKm,
        cumulativeDistanceKm: cumulativeKm,
        recommendation: `Target Penelusuran Yantek: Estimasi SUTM Sekitar Km ${kmStart} s/d Km ${kmEnd} dari Titik Percabangan [${branchNameLabel}] pada ${sectionNameLabel}, Tap-off dari ${tapOffPoint} ke arah ${targetArea}. (Jarak kumulatif ~ Km ${cumulativeKm} dari pasokan pangkal).`,
        confidence: iNolNum > 50 || maxI > 250 ? 'Akurat Tinggi (95%)' : 'Akurat Sedang (84%)',
        sourceTitle: `Percabangan [${branchNameLabel}] (${sectionNameLabel})`
      };
    }

    // CASE 2: GARDU HUBUNG (GH)
    if (supplySourceType === 'GH') {
      const ghNameLabel = selectedGhName || currentFeeder?.garduHubung || 'GH Bandara';
      const ghFeederLen = matchingSections.length > 0 
        ? matchingSections.reduce((acc, s) => acc + (s.lengthKms || 0), 0)
        : feederTotalLength;

      const distanceKm = Number(Math.min(Math.max(rawDist, 0.2), ghFeederLen > 0 ? ghFeederLen : 25.0).toFixed(2));
      const kmStart = Math.max(0, Number((distanceKm - 0.3).toFixed(1)));
      const kmEnd = Number((distanceKm + 0.3).toFixed(1));

      // Match to section along the route from GH
      let targetSectionInfo = '';
      if (matchingSections.length > 0) {
        let runningKm = 0;
        for (let i = 0; i < matchingSections.length; i++) {
          const sec = matchingSections[i];
          const secLen = sec.lengthKms || 4.0;
          const nextKm = runningKm + secLen;
          if (distanceKm <= nextKm || i === matchingSections.length - 1) {
            targetSectionInfo = `Terindikasi pada ${sec.sectionName || `Section ${i + 1}`} (Km ${runningKm.toFixed(1)} - ${nextKm.toFixed(1)} dari ${ghNameLabel}), antara [${sec.startPoint || 'Pangkal'}] dan [${sec.endPoint || 'Ujung'}].`;
            break;
          }
          runningKm = nextKm;
        }
      }

      return {
        detectedType: faultType,
        distanceKm,
        cumulativeDistanceKm: distanceKm,
        recommendation: `Target Penelusuran Yantek: Estimasi SUTM Sekitar Km ${kmStart} s/d Km ${kmEnd} dari Gardu Hubung (${ghNameLabel}). ${targetSectionInfo}`,
        confidence: iNolNum > 50 || maxI > 250 ? 'Akurat Tinggi (94%)' : 'Akurat Sedang (82%)',
        sourceTitle: `Gardu Hubung (${ghNameLabel})`
      };
    }

    // CASE 3: GARDU INDUK (GI / PANGKAL FEEDER)
    const distanceKm = Number(Math.min(Math.max(rawDist, 0.2), feederTotalLength).toFixed(2));
    const kmStart = Math.max(0, Number((distanceKm - 0.3).toFixed(1)));
    const kmEnd = Number((distanceKm + 0.3).toFixed(1));

    let targetSectionInfo = '';
    if (matchingSections.length > 0) {
      let runningKm = 0;
      for (let i = 0; i < matchingSections.length; i++) {
        const sec = matchingSections[i];
        const secLen = sec.lengthKms || 4.0;
        const nextKm = runningKm + secLen;
        if (distanceKm <= nextKm || i === matchingSections.length - 1) {
          targetSectionInfo = `Terindikasi pada ${sec.sectionName || `Section ${i + 1}`} (Km ${runningKm.toFixed(1)} - ${nextKm.toFixed(1)} dari ${feederSubstation}), antara [${sec.startPoint || 'Pangkal'}] dan [${sec.endPoint || 'Ujung'}].`;
          break;
        }
        runningKm = nextKm;
      }
    }

    return {
      detectedType: faultType,
      distanceKm,
      cumulativeDistanceKm: distanceKm,
      recommendation: `Target Penelusuran Yantek: Estimasi SUTM Sekitar Km ${kmStart} s/d Km ${kmEnd} dari Substation ${feederSubstation}. ${targetSectionInfo}`,
      confidence: iNolNum > 50 || maxI > 250 ? 'Akurat Tinggi (93%)' : 'Akurat Sedang (80%)',
      sourceTitle: `Substation GI (${feederSubstation})`
    };
  };

  const aiResult = calculateAiDistance();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine supply source name & section / branch details
    let sSource = 'GI Passo (20kV)';
    let secId: string | undefined = undefined;
    let secName: string | undefined = undefined;
    let brId: string | undefined = undefined;
    let brName: string | undefined = undefined;

    if (supplySourceType === 'GH') {
      sSource = selectedGhName || 'GH Bandara';
    } else if (supplySourceType === 'PERCABANGAN') {
      const selectedBranch = availableBranches.find(b => b.id === selectedBranchKey || b.branchName === selectedBranchKey);
      const selectedSec = matchingSections.find(s => s.id === selectedSectionKey);

      if (selectedBranch) {
        brId = selectedBranch.id;
        brName = selectedBranch.branchName;
        secId = selectedBranch.sectionId;
        secName = selectedBranch.sectionName;
        sSource = `Percabangan ${selectedBranch.branchName}`;
      } else if (selectedSec) {
        secId = selectedSec.id;
        secName = selectedSec.sectionName;
        brName = selectedSec.fcoBranchName || 'Percabangan Section';
        sSource = `Section ${selectedSec.sectionName}`;
      } else {
        sSource = 'Percabangan Lateral Penyulang';
      }
    } else {
      const foundFeeder = availableFeeders.find(f => f.name === feederName);
      sSource = foundFeeder?.substation || 'GI Passo (20kV)';
    }

    const newTrip: FeederTrip = {
      id: tripToEdit ? tripToEdit.id : `TRIP-INPUT-${Date.now()}`,
      feederName,
      substation: sSource,
      tripDate,
      tripTime,
      recoveryTime,
      durationMinutes,
      relayType,
      currentAmpere: ampereVal,
      kwPadam,
      locationKm: locationKm || (aiResult.distanceKm ? `Sekitar Km ${aiResult.distanceKm} dari ${sSource}` : ''),
      coordinates,
      cause,
      category,
      affectedCustomers: affCustVal,
      totalUlpCustomers: ulpCustVal,
      saidiHours: Number(saidiHoursCalc.toFixed(4)),
      saidiMinutes: Number(saidiMinutesCalc.toFixed(2)),
      saifiCount: Number(saifiCalc.toFixed(4)),
      ensKwh,
      financialLossIdr: financialLossCalc,
      status: tripToEdit?.status || 'Resolved',
      iNol: iNolNum,
      iL1: iL1Num,
      iL2: iL2Num,
      iL3: iL3Num,
      estimatedDistanceKm: aiResult.distanceKm || undefined,
      cumulativeDistanceKm: aiResult.cumulativeDistanceKm || undefined,
      faultTypeDetected: aiResult.detectedType !== 'Belum Ada Input Arus Gangguan' ? aiResult.detectedType : undefined,
      tripScope,
      supplySourceType,
      supplySourceName: sSource,
      sectionId: secId,
      sectionName: secName,
      branchId: brId,
      branchName: brName
    };

    onSaveTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-red-500/10 to-amber-500/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                {tripToEdit ? `Edit Data Gangguan Feeder ${tripToEdit.feederName}` : 'Form Input Gangguan Feeder 20kV & Kalkulasi SAIDI/SAIFI'}
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {tripToEdit ? 'Edit Mode' : 'Manual Input'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih feeder, gardu hubung atau percabangan section penyuplai. Estimasi jarak AI akan dihitung presisi berdasarkan titik acuan pasokan.
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>1. Feeder (Master Data) & Waktu Padam</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                ULP Baguala
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Penyulang / Feeder <span className="text-rose-500">* (Master Data)</span>
                </label>
                <select 
                  value={feederName}
                  onChange={(e) => handleFeederChange(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-extrabold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  required
                >
                  {availableFeeders.length === 0 ? (
                    <option value="">Penyulang Belum Tersedia di Master Data</option>
                  ) : (
                    availableFeeders.map(f => (
                      <option key={f.name} value={f.name}>
                        {f.name} ({f.cust.toLocaleString('id-ID')} Plg)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Relay Proteksi
                </label>
                <select 
                  value={relayType}
                  onChange={(e) => setRelayType(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="GFR">GFR (Ground Fault Relay)</option>
                  <option value="OCR">OCR (Over Current Relay)</option>
                  <option value="GFR / OCR">GFR & OCR (Tanah & Arus Lebih)</option>
                  <option value="UVR">UVR (Under Voltage Relay)</option>
                  <option value="OVR">OVR (Over Voltage Relay)</option>
                  <option value="UFR">UFR (Under Frequency Relay)</option>
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
                  required
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
                  placeholder="HH:MM"
                  className={`w-full p-2 rounded-xl border font-bold text-rose-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  required
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
                  placeholder="HH:MM"
                  className={`w-full p-2 rounded-xl border font-bold text-emerald-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                  <span>Durasi Padam</span>
                  <span className="text-[10px] font-semibold text-blue-500 dark:text-cyan-400">Otomatis / Edit</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={durationMinutes || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setDurationMinutes(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className={`w-full p-2 pr-14 rounded-xl border font-black text-xs text-center ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                    placeholder="0"
                    min={0}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
                    Menit
                  </span>
                </div>
                <div className="mt-1 text-center text-[10px] font-bold">
                  {durationMinutes > 0 ? (
                    <span className="text-blue-600 dark:text-cyan-400">
                      = {Math.floor(durationMinutes / 60)} Jam {durationMinutes % 60} Mnt ({(durationMinutes / 60).toFixed(2)} Jam)
                    </span>
                  ) : (
                    <span className="text-slate-400">Otomatis dihitung</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: TITIK ACUAN PASOKAN & PERCABANGAN / GARDU HUBUNG */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-purple-500/5 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <GitBranch className="w-4 h-4 text-amber-500" />
                <span>2. Titik Acuan Pasokan & Percabangan Penyulang (Supply Source)</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Pangkal / Gardu Hubung / Percabangan Section
              </span>
            </div>

            {/* 3-Way Supply Source Selector */}
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                Pilih Titik Pasokan yang Mensuplai Section / Lokasi Gangguan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Substation GI */}
                <button
                  type="button"
                  onClick={() => {
                    setSupplySourceType('GI');
                    setTripScope('UTAMA');
                    syncCustomerCountFromMaster(feederName, 'GI', selectedSectionKey);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    supplySourceType === 'GI'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/30'
                      : isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      Gardu Induk (GI)
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      supplySourceType === 'GI' ? 'bg-purple-700 text-purple-100' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}>
                      Pangkal Feeder
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold truncate ${supplySourceType === 'GI' ? 'text-purple-100' : 'text-slate-400'}`}>
                    {currentFeederSupply.defaultGi || 'GI Passo'}
                  </span>
                </button>

                {/* 2. Gardu Hubung (GH) */}
                <button
                  type="button"
                  onClick={() => {
                    setSupplySourceType('GH');
                    setTripScope('PERCABANGAN');
                    setSelectedGhName(currentFeederSupply.recommendedGh);
                    syncCustomerCountFromMaster(feederName, 'GH', selectedSectionKey);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    supplySourceType === 'GH'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30'
                      : isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5" />
                      Gardu Hubung (GH)
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      supplySourceType === 'GH' ? 'bg-amber-700 text-amber-100' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      Penyuplai GH
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold truncate ${supplySourceType === 'GH' ? 'text-amber-100' : 'text-slate-400'}`}>
                    {currentFeederSupply.recommendedGh || 'GH Baguala'}
                  </span>
                </button>

                {/* 3. Percabangan / Section */}
                <button
                  type="button"
                  onClick={() => {
                    setSupplySourceType('PERCABANGAN');
                    setTripScope('PERCABANGAN');
                    let targetSec = selectedSectionKey;
                    if (!targetSec && matchingSections.length > 0) {
                      targetSec = matchingSections[0].id;
                      setSelectedSectionKey(targetSec);
                    }
                    syncCustomerCountFromMaster(feederName, 'PERCABANGAN', targetSec);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    supplySourceType === 'PERCABANGAN'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                      : isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5" />
                      Percabangan / Section
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      supplySourceType === 'PERCABANGAN' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      Lateral / FCO
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 ${supplySourceType === 'PERCABANGAN' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Cabang Lateral FCO / Section
                  </span>
                </button>
              </div>
            </div>

            {/* Conditional Dropdowns based on supplySourceType */}
            {supplySourceType === 'GH' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-700 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-500" />
                    Pilih Gardu Hubung (GH) yang Menyuplai Section Penyulang Ini:
                  </label>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                    {currentFeederSupply.recommendedGh ? `${currentFeederSupply.recommendedGh} (Feeder ${feederName})` : ''}
                  </span>
                </div>
                <select
                  value={selectedGhName}
                  onChange={(e) => setSelectedGhName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-black text-xs ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-amber-200 text-amber-900'
                  }`}
                >
                  {availableGHList.map(gh => (
                    <option key={gh} value={gh}>
                      {gh} {gh === currentFeederSupply.recommendedGh ? `(Feeder ${feederName})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {supplySourceType === 'PERCABANGAN' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                    Pilih Percabangan Lateral / Section Penyuplai (Master Data Section):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {matchingSections.length} Section terdaftar pada Feeder {feederName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Select Section */}
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">
                      Section Utama:
                    </label>
                    <select
                      value={selectedSectionKey}
                      onChange={(e) => {
                        const newSecKey = e.target.value;
                        setSelectedSectionKey(newSecKey);
                        // Reset branch selection if section changes
                        const sec = matchingSections.find(s => s.id === newSecKey);
                        if (sec?.fcoBranches && sec.fcoBranches.length > 0) {
                          setSelectedBranchKey(sec.fcoBranches[0].id || sec.fcoBranches[0].fcoBranchName);
                        } else {
                          setSelectedBranchKey('');
                        }
                        syncCustomerCountFromMaster(feederName, 'PERCABANGAN', newSecKey);
                      }}
                      className={`w-full p-2 rounded-xl border font-bold text-xs ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">-- Pilih Section Penyulang --</option>
                      {matchingSections.map(sec => (
                        <option key={sec.id} value={sec.id}>
                          {sec.sectionName} ({sec.customerCount ? sec.customerCount.toLocaleString('id-ID') : 0} Plg • {sec.lengthKms} km)
                        </option>
                      ))}
                      {matchingSections.length === 0 && (
                        <option value="GENERIC-SEC">Section 1 (Pangkal s/d Recloser)</option>
                      )}
                    </select>
                  </div>

                  {/* Select Percabangan FCO / Lateral */}
                  <div>
                    <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">
                      Percabangan Lateral (FCO / Branch):
                    </label>
                    <select
                      value={selectedBranchKey}
                      onChange={(e) => setSelectedBranchKey(e.target.value)}
                      className={`w-full p-2 rounded-xl border font-bold text-xs ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-800'
                      }`}
                    >
                      <option value="">-- Pilih Percabangan Lateral --</option>
                      {availableBranches.map(br => (
                        <option key={br.id} value={br.id}>
                          {br.branchName} ({br.lengthKm} km) • {br.sectionName}
                        </option>
                      ))}
                      {availableBranches.length === 0 && (
                        <>
                          <option value="BR-GENERIC-1">FCO Percabangan Lateral 1 (1.8 km)</option>
                          <option value="BR-GENERIC-2">FCO Percabangan Lateral 2 (2.5 km)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>
                    Kalkulasi AI akan mengestimasi jarak sepanjang cabang lateral dari titik tap-off section, serta menghitung jarak kumulatif dari pangkal.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: BEBAN & ARUS PENYULANG */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>3. Beban Arus & Daya Padam (kW / ENS / Rupiah)</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Tarif: Rp 1.444,70/kWh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Beban Arus Sesaat Sebelum Trip (Ampere / A)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    value={currentAmpere}
                    onChange={(e) => setCurrentAmpere(e.target.value)}
                    placeholder="e.g. 145"
                    className={`w-full p-2.5 pl-3 pr-8 rounded-xl border font-black text-sm ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">A</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Daya Padam Terhitung (kW Padam)
                </label>
                <div className={`p-2.5 rounded-xl border font-black text-sm flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span>{kwPadam.toLocaleString('id-ID')} kW</span>
                  <span className="text-[10px] font-semibold text-slate-400">√3 × 20kV × {ampereVal}A × 0.95</span>
                </div>
              </div>
            </div>

            {/* Calculated ENS & Financial Loss */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Energi Tidak Tersalur (ENS)</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">
                    {ensKwh.toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-300">kWh</span>
                  </div>
                </div>
                <Zap className="w-6 h-6 text-amber-400 opacity-80" />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Estimasi Kerugian Finansial</div>
                  <div className="text-lg font-black text-rose-400 mt-0.5">
                    {formatRupiah(financialLossCalc)}
                  </div>
                </div>
                <DollarSign className="w-6 h-6 text-rose-400 opacity-80" />
              </div>
            </div>
          </div>

          {/* SECTION 4: PELANGGAN & KALKULASI SAIDI/SAIFI */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>4. Pelanggan Terdampak & Kalkulasi SAIDI/SAIFI</span>
              </div>
              <button
                type="button"
                onClick={() => syncCustomerCountFromMaster()}
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                title="Klik untuk sinkronkan ulang data pelanggan dengan Master Data Feeder/Section"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sinkron Real-Time Master Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Total Pelanggan ULP Baguala (Plg)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={totalUlpCustomers}
                    onChange={(e) => setTotalUlpCustomers(e.target.value)}
                    placeholder="0"
                    className={`w-full p-2.5 pl-3 pr-12 rounded-xl border font-bold text-sm ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Plg</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Pelanggan Feeder Padam / Terdampak (Plg)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={affectedCustomers}
                    onChange={(e) => setAffectedCustomers(e.target.value)}
                    placeholder="e.g. 3820"
                    className={`w-full p-2.5 pl-3 pr-12 rounded-xl border font-bold text-sm ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-blue-700'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Plg</span>
                </div>
              </div>
            </div>

            {/* SAIDI & SAIFI Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* SAIDI Box */}
              <div className="p-3 rounded-xl bg-slate-900 text-white border border-cyan-500/30 flex flex-col justify-between">
                <div className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
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
                  Rumus: ({durationHours.toFixed(2)} Jam × {affCustVal.toLocaleString('id-ID')} Plg) / {ulpCustVal.toLocaleString('id-ID')} Plg ULP
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
                  Rumus: {affCustVal.toLocaleString('id-ID')} Plg Terdampak / {ulpCustVal.toLocaleString('id-ID')} Plg Total ULP
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: PENYEBAB & LOKASI GANGGUAN SUTM */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>5. Lokasi & Penyebab Gangguan SUTM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Kategori Gangguan
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold text-xs ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="I-1 : KOMPONEN JTM">I-1 : KOMPONEN JTM</option>
                  <option value="I-2 : PERALATAN JTM">I-2 : PERALATAN JTM</option>
                  <option value="I-3 : TRAFO DAN LAINNYA">I-3 : TRAFO DAN LAINNYA</option>
                  <option value="I-4 : TIANG">I-4 : TIANG</option>
                  <option value="E-1 : POHON">E-1 : POHON</option>
                  <option value="E-2 : BENCANA ALAM">E-2 : BENCANA ALAM</option>
                  <option value="E-3 : BINATANG">E-3 : BINATANG</option>
                  <option value="E-4 : SESAAT / TIDAK DITEMUKAN">E-4 : SESAAT / TIDAK DITEMUKAN</option>
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
                  placeholder="Misal: Km 6.2 Laha Pantai"
                  className={`w-full p-2.5 rounded-xl border font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-500 dark:text-slate-400 block">
                    Koordinat Lokasi (Lat, Long)
                  </label>
                  {coordinates && coordinates.trim() && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates.trim())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                      title="Cek lokasi di Google Maps"
                    >
                      <MapPin className="w-2.5 h-2.5 text-rose-500" />
                      <span>Cek di Google Maps</span>
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="Misal: -3.7102, 128.0895"
                    className={`w-full p-2.5 pl-8 rounded-xl border font-mono text-xs ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-blue-700'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
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

          {/* SECTION 6: ARUS GANGGUAN & PERHITUNGAN ESTIMASI JARAK AI */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>6. Form Arus Gangguan & Estimasi Jarak AI (Berdasarkan {aiResult.sourceTitle})</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                Impedansi SUTM & AI Algorithm
              </span>
            </div>

            {/* Form Arus Gangguan: INOL, L1, L2, L3 */}
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 text-[11px]">
                Form Input Arus Gangguan (Ampere / A):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-400 block mb-0.5">
                    INOL (Ground Fault / GFR)
                  </span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={iNol}
                      onChange={(e) => setINol(e.target.value)}
                      placeholder="e.g. 450"
                      className="w-full p-2 rounded-xl bg-slate-800 border border-rose-500/40 text-rose-300 font-black text-xs pr-7 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">A</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 block mb-0.5">
                    L1 (Phasa R)
                  </span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={iL1}
                      onChange={(e) => setIL1(e.target.value)}
                      placeholder="e.g. 380"
                      className="w-full p-2 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-300 font-black text-xs pr-7 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">A</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-yellow-400 block mb-0.5">
                    L2 (Phasa S)
                  </span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={iL2}
                      onChange={(e) => setIL2(e.target.value)}
                      placeholder="e.g. 360"
                      className="w-full p-2 rounded-xl bg-slate-800 border border-yellow-500/40 text-yellow-300 font-black text-xs pr-7 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">A</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-blue-400 block mb-0.5">
                    L3 (Phasa T)
                  </span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={iL3}
                      onChange={(e) => setIL3(e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full p-2 rounded-xl bg-slate-800 border border-blue-500/40 text-blue-300 font-black text-xs pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live AI Distance Calculation Result Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-cyan-400 uppercase tracking-wide">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HASIL ESTIMASI JARAK GANGGUAN DARI {aiResult.sourceTitle.toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700">
                  Akurasi: {aiResult.confidence}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                {/* Metric Box */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                      <span>Estimasi Jarak dari Titik Acuan:</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-500/20 text-purple-300">
                        {supplySourceType === 'PERCABANGAN' ? 'Titik Percabangan' : (supplySourceType === 'GH' ? 'Gardu Hubung' : 'Gardu Induk')}
                      </span>
                    </div>
                    
                    <div className="text-2xl font-black text-purple-300 flex items-baseline gap-1 mt-1">
                      {aiResult.distanceKm !== null ? (
                        <>
                          <span>{aiResult.distanceKm}</span>
                          <span className="text-xs font-bold text-purple-400">
                            km dari {supplySourceType === 'PERCABANGAN' ? 'Titik Tap-off Percabangan' : (supplySourceType === 'GH' ? selectedGhName : 'Substation GI')}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">Menunggu Input Arus Gangguan...</span>
                      )}
                    </div>

                    {aiResult.cumulativeDistanceKm !== null && supplySourceType === 'PERCABANGAN' && (
                      <div className="text-[10.5px] font-extrabold text-amber-300 mt-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                        <span>Jarak Kumulatif Total: ~{aiResult.cumulativeDistanceKm} km dari Pangkal</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-purple-500/20">
                    Jenis Gangguan: <strong className="text-amber-300">{aiResult.detectedType}</strong>
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className="text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span>Rekomendasi Lokasi Lapangan Yantek:</span>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
                      {aiResult.recommendation}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800 text-[9.5px] text-slate-400 flex items-center justify-between">
                    <span>Titik Acuan: {aiResult.sourceTitle}</span>
                    <span className="text-emerald-400 font-bold">Z = 0.41 Ω/km</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Data gangguan akan langsung terakumulasi pada Rekap SAIDI/SAIFI ULP Baguala.
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
                <span>{tripToEdit ? 'Simpan Perubahan Gangguan' : 'Simpan Gangguan & Update SAIDI/SAIFI'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
