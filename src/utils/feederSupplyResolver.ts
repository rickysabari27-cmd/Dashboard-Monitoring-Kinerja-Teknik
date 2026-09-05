import { MasterFeeder, MasterSection, MasterGarduHubung } from '../types';

// Fallback electrical network mapping for PLN ULP Baguala (Ambon, Maluku)
export const PLN_BAGUALA_FEEDER_MAP: Record<string, { gh: string; gi: string; isBranch: boolean }> = {
  'TULEHU': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: false },
  'LATERI 1': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'LATERI 2': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: false },
  'LATERI 3': { gh: 'GH Hative Kecil', gi: 'GI Passo', isBranch: false },
  'LATERI 4': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: false },
  'HUTUMURI': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'WAIHERU 1': { gh: 'GH Baguala', gi: 'GIS Passo', isBranch: true },
  'WAIHERU': { gh: 'GH Baguala', gi: 'GIS Passo', isBranch: true },
  'SULI': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'HUNUTH': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'NANIA': { gh: 'GH Baguala', gi: 'GIS Passo', isBranch: true },
  'DURIAN PATAH': { gh: 'GH Baguala', gi: 'GIS Passo', isBranch: true },
  'NATSEPA': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'LIANG': { gh: 'GH Baguala', gi: 'GI Passo', isBranch: true },
  'ACC': { gh: 'GH Baguala', gi: 'GIS Passo', isBranch: true },
  'PASSO': { gh: 'GH Aston', gi: 'GIS Passo', isBranch: false },
  'ALLANG': { gh: 'GH Bandara', gi: 'GI Hative Besar', isBranch: true },
  'BANDARA 1': { gh: 'GH Bandara', gi: 'GI Hative Besar', isBranch: false },
  'BANDARA 2': { gh: 'GH Bandara', gi: 'GI Hative Besar', isBranch: false },
  'LAHA': { gh: 'GH Bandara', gi: 'GI Hative Besar', isBranch: true },
  'WAYAME 1': { gh: 'GH Wayame', gi: 'GI Hative Besar', isBranch: true },
  'WAYAME': { gh: 'GH Wayame', gi: 'GI Hative Besar', isBranch: true },
  'HATIVE': { gh: 'GH Wayame', gi: 'GI Hative Besar', isBranch: true },
  'POKKA': { gh: 'GH Box Pantai Poka', gi: 'GI Hative Besar', isBranch: true },
  'POKA': { gh: 'GH Box Pantai Poka', gi: 'GI Hative Besar', isBranch: true },
  'GALALA 1': { gh: 'GH Box Pantai Galala', gi: 'GI Passo', isBranch: true },
  'GALALA 2': { gh: 'GH Box Pantai Poka', gi: 'GI Hative Besar', isBranch: true },
  'KARPAN 1': { gh: 'GH Hative Kecil', gi: 'GI Passo', isBranch: true },
  'MCM': { gh: 'GH Hative Kecil', gi: 'GI Passo', isBranch: true },
  'HALONG': { gh: 'GH Hative Kecil', gi: 'GI Passo', isBranch: true },
  'BATU MERAH': { gh: 'GH Area', gi: 'GI Sirimau', isBranch: false },
  'RUMAHTIGA': { gh: 'GH Box Pantai Poka', gi: 'GI Hative Besar', isBranch: true }
};

export interface FeederSupplyResolution {
  feederName: string;
  recommendedGh: string;
  defaultGi: string;
  isBranch: boolean;
  sourceType: 'GI' | 'GH' | 'PERCABANGAN';
}

/**
 * Intelligent supply source resolver that automatically determines
 * the matching Gardu Hubung (GH) and Substation (GI) for any Feeder.
 */
export function resolveFeederSupply(
  feederName: string,
  masterFeeders: MasterFeeder[] = [],
  masterSections: MasterSection[] = [],
  masterGarduHubung: MasterGarduHubung[] = []
): FeederSupplyResolution {
  const cleanName = (feederName || '').trim();
  const upperName = cleanName.toUpperCase();

  // 1. Try finding in MasterFeeders
  const foundMaster = masterFeeders.find(
    f => f.feederName && f.feederName.trim().toUpperCase() === upperName
  );

  let ghCandidate = '';
  let giCandidate = '';
  let isBranch = false;

  if (foundMaster) {
    if (foundMaster.garduHubung && foundMaster.garduHubung !== '-' && foundMaster.garduHubung.trim() !== '') {
      ghCandidate = foundMaster.garduHubung.trim();
    }
    if (foundMaster.substationName && foundMaster.substationName !== '-' && foundMaster.substationName.trim() !== '') {
      giCandidate = foundMaster.substationName.trim();
    }
    isBranch = (foundMaster.status || '').toLowerCase() === 'percabangan' || Boolean(ghCandidate && ghCandidate !== '-');
  }

  // 2. Try looking in MasterSections for this feeder
  if (!ghCandidate || !giCandidate) {
    const secForFeeder = masterSections.filter(
      s => s.feederName && s.feederName.trim().toUpperCase() === upperName
    );
    for (const sec of secForFeeder) {
      const supply = (sec.substationOrGh || '').trim();
      if (supply.startsWith('GH ') && !ghCandidate) {
        ghCandidate = supply;
        isBranch = true;
      } else if (supply.startsWith('GI ') && !giCandidate) {
        giCandidate = supply;
      }
    }
  }

  // 3. Try looking in MasterGarduHubung (outgoing list or incoming feeder)
  if (!ghCandidate && masterGarduHubung.length > 0) {
    for (const gh of masterGarduHubung) {
      const outList = (gh.outgoingFeedersList || '').toUpperCase();
      const inFeeder = (gh.incomingFeeder || '').toUpperCase();
      if (cleanName && outList.includes(upperName)) {
        ghCandidate = gh.ghName;
        isBranch = true;
        break;
      }
      if (cleanName && inFeeder.includes(upperName)) {
        ghCandidate = gh.ghName;
      }
    }
  }

  // 4. Fallback from PLN ULP Baguala network topology map
  const fallback = PLN_BAGUALA_FEEDER_MAP[upperName];
  if (fallback) {
    if (!ghCandidate) ghCandidate = fallback.gh;
    if (!giCandidate) giCandidate = fallback.gi;
    if (!foundMaster) isBranch = fallback.isBranch;
  }

  // Final Defaults
  const finalGh = ghCandidate || 'GH Baguala';
  const finalGi = giCandidate || 'GI Passo';
  const finalSourceType: 'GI' | 'GH' | 'PERCABANGAN' = isBranch ? 'GH' : 'GI';

  return {
    feederName: cleanName,
    recommendedGh: finalGh,
    defaultGi: finalGi,
    isBranch,
    sourceType: finalSourceType
  };
}
