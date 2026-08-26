import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Database, 
  Search, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Code,
  Layers,
  Server,
  CloudLightning,
  Zap,
  Download,
  UploadCloud,
  FileDown
} from 'lucide-react';
import { FeederTrip, MasterFeeder } from '../../types';

export const DEFAULT_SAMPLE_TRIPS: FeederTrip[] = [
  {
    id: "TRIP-2026-0801",
    feederName: "WAIHERU 3",
    substation: "GI Passo",
    tripDate: "2026-08-01",
    tripTime: "08:15",
    recoveryTime: "09:30",
    durationMinutes: 75,
    relayType: "GFR / OCR",
    currentAmpere: 145,
    locationKm: "KM 4.5 SUTM",
    coordinates: "-3.621, 128.182",
    cause: "E-1 : POHON (Pohon Tumbang Timpa JTM)",
    category: "E-1 : POHON",
    affectedCustomers: 1250,
    financialLossIdr: 13540000,
    ensKwh: 937.5,
    status: "Resolved",
    iNol: 12,
    iL1: 150,
    iL2: 140,
    iL3: 135
  },
  {
    id: "TRIP-2026-0802",
    feederName: "PASSO",
    substation: "GI Passo",
    tripDate: "2026-08-03",
    tripTime: "14:20",
    recoveryTime: "15:05",
    durationMinutes: 45,
    relayType: "OCR",
    currentAmpere: 180,
    locationKm: "KM 2.1 Section II",
    coordinates: "-3.635, 128.210",
    cause: "I-1 : KOMPONEN JTM (Isolator Tumpu Pecah)",
    category: "I-1 : KOMPONEN JTM",
    affectedCustomers: 2950,
    financialLossIdr: 19180000,
    ensKwh: 1327.5,
    status: "Resolved",
    iNol: 0,
    iL1: 190,
    iL2: 185,
    iL3: 180
  },
  {
    id: "TRIP-2026-0803",
    feederName: "WAIHERU 1",
    substation: "GH Baguala",
    tripDate: "2026-08-05",
    tripTime: "11:10",
    recoveryTime: "12:00",
    durationMinutes: 50,
    relayType: "GFR",
    currentAmpere: 110,
    locationKm: "KM 6.8 SUTM Nania",
    coordinates: "-3.612, 128.231",
    cause: "E-3 : BINATANG (Burung Sentuh Arrester)",
    category: "E-3 : BINATANG",
    affectedCustomers: 1100,
    financialLossIdr: 7940000,
    ensKwh: 550.0,
    status: "Resolved",
    iNol: 28,
    iL1: 115,
    iL2: 110,
    iL3: 105
  },
  {
    id: "TRIP-2026-0804",
    feederName: "PASSO 2",
    substation: "GI Passo",
    tripDate: "2026-08-08",
    tripTime: "19:40",
    recoveryTime: "20:50",
    durationMinutes: 70,
    relayType: "GFR / OCR",
    currentAmpere: 160,
    locationKm: "KM 3.5 Lateri",
    coordinates: "-3.642, 128.219",
    cause: "E-2 : BENCANA ALAM (Angin Kencang Hujan)",
    category: "E-2 : BENCANA ALAM",
    affectedCustomers: 2100,
    financialLossIdr: 21230000,
    ensKwh: 1470.0,
    status: "Resolved",
    iNol: 18,
    iL1: 165,
    iL2: 160,
    iL3: 155
  },
  {
    id: "TRIP-2026-0805",
    feederName: "TELUK AMBON",
    substation: "GH Baguala",
    tripDate: "2026-08-11",
    tripTime: "16:05",
    recoveryTime: "16:45",
    durationMinutes: 40,
    relayType: "UFR",
    currentAmpere: 130,
    locationKm: "KM 1.2 Halong",
    coordinates: "-3.650, 128.201",
    cause: "E-4 : SESAAT (Shedding / Defisit Sistem)",
    category: "E-4 : SESAAT",
    affectedCustomers: 1800,
    financialLossIdr: 10400000,
    ensKwh: 720.0,
    status: "Resolved",
    iNol: 0,
    iL1: 130,
    iL2: 130,
    iL3: 130
  },
  {
    id: "TRIP-2026-0806",
    feederName: "WAIHERU 2",
    substation: "GH Baguala",
    tripDate: "2026-08-14",
    tripTime: "09:30",
    recoveryTime: "11:00",
    durationMinutes: 90,
    relayType: "GFR",
    currentAmpere: 125,
    locationKm: "KM 8.1 Waiheru Pasar",
    coordinates: "-3.605, 128.190",
    cause: "E-1 : POHON (Bambu Melengkung Timpa SUTM)",
    category: "E-1 : POHON",
    affectedCustomers: 1400,
    financialLossIdr: 18200000,
    ensKwh: 1260.0,
    status: "Resolved",
    iNol: 35,
    iL1: 130,
    iL2: 125,
    iL3: 120
  },
  {
    id: "TRIP-2026-0807",
    feederName: "KAPITAN PATTIMURA",
    substation: "GI Passo",
    tripDate: "2026-08-16",
    tripTime: "21:15",
    recoveryTime: "22:15",
    durationMinutes: 60,
    relayType: "OCR",
    currentAmpere: 175,
    locationKm: "KM 5.0 Laha",
    coordinates: "-3.701, 128.105",
    cause: "I-2 : PERALATAN JTM (FCO Putus Korosi)",
    category: "I-2 : PERALATAN JTM",
    affectedCustomers: 1950,
    financialLossIdr: 16900000,
    ensKwh: 1170.0,
    status: "Resolved",
    iNol: 0,
    iL1: 180,
    iL2: 175,
    iL3: 170
  },
  {
    id: "TRIP-2026-0808",
    feederName: "PASSO 1",
    substation: "GI Passo",
    tripDate: "2026-08-19",
    tripTime: "07:50",
    recoveryTime: "08:35",
    durationMinutes: 45,
    relayType: "GFR",
    currentAmpere: 155,
    locationKm: "KM 2.8 Passo Indah",
    coordinates: "-3.630, 128.215",
    cause: "E-3 : BINATANG (Ular di Busbar 20kV)",
    category: "E-3 : BINATANG",
    affectedCustomers: 2600,
    financialLossIdr: 16910000,
    ensKwh: 1170.0,
    status: "Resolved",
    iNol: 42,
    iL1: 160,
    iL2: 155,
    iL3: 150
  },
  {
    id: "TRIP-2026-0809",
    feederName: "WAIHERU 3",
    substation: "GI Passo",
    tripDate: "2026-08-22",
    tripTime: "13:00",
    recoveryTime: "14:15",
    durationMinutes: 75,
    relayType: "GFR / OCR",
    currentAmpere: 138,
    locationKm: "KM 7.3 Hunu",
    coordinates: "-3.618, 128.175",
    cause: "I-3 : TRAFO (Jumperan Trafo Putus)",
    category: "I-3 : TRAFO",
    affectedCustomers: 1250,
    financialLossIdr: 13540000,
    ensKwh: 937.5,
    status: "Resolved",
    iNol: 15,
    iL1: 142,
    iL2: 138,
    iL3: 134
  },
  {
    id: "TRIP-2026-0810",
    feederName: "HALONG",
    substation: "GH Baguala",
    tripDate: "2026-08-25",
    tripTime: "10:45",
    recoveryTime: "11:30",
    durationMinutes: 45,
    relayType: "OCR",
    currentAmpere: 165,
    locationKm: "KM 3.0 Jembatan Halong",
    coordinates: "-3.655, 128.205",
    cause: "E-1 : POHON (Dahan Kelapa Jatuh Timpa SUTM)",
    category: "E-1 : POHON",
    affectedCustomers: 1750,
    financialLossIdr: 11380000,
    ensKwh: 787.5,
    status: "Resolved",
    iNol: 0,
    iL1: 170,
    iL2: 165,
    iL3: 160
  }
];

export const formatTripForPayload = (trip: FeederTrip) => ({
  id: trip.id || `TRIP-${Date.now()}`,
  feederName: trip.feederName || 'WAIHERU 3',
  substation: trip.substation || 'GI Passo',
  tripDate: trip.tripDate || '2026-08-26',
  tripTime: trip.tripTime || '10:00',
  recoveryTime: trip.recoveryTime || '11:00',
  durationMinutes: Number(trip.durationMinutes || 60),
  relayType: trip.relayType || 'GFR / OCR',
  cause: trip.cause || trip.category || 'E-1 : POHON',
  category: trip.category || 'E-1 : POHON',
  locationKm: trip.locationKm || 'KM 5 SUTM',
  coordinates: trip.coordinates || '-3.62, 128.25',
  currentAmpere: Number(trip.currentAmpere || 120),
  affectedCustomers: Number(trip.affectedCustomers || 1000),
  financialLossIdr: Number(trip.financialLossIdr || 5000000),
  ensKwh: Number(trip.ensKwh || 150),
  status: trip.status || 'Resolved',
  iNol: Number(trip.iNol || 0),
  iL1: Number(trip.iL1 || 0),
  iL2: Number(trip.iL2 || 0),
  iL3: Number(trip.iL3 || 0),

  // Direct Indonesian Sheet Column Header Aliases
  'ID': trip.id || `TRIP-${Date.now()}`,
  'No': trip.id || `TRIP-${Date.now()}`,
  'Penyulang': trip.feederName || 'WAIHERU 3',
  'Nama Penyulang': trip.feederName || 'WAIHERU 3',
  'Gardu Induk': trip.substation || 'GI Passo',
  'GI': trip.substation || 'GI Passo',
  'Tanggal Trip': trip.tripDate || '2026-08-26',
  'Tanggal': trip.tripDate || '2026-08-26',
  'Waktu Trip': trip.tripTime || '10:00',
  'Jam Trip': trip.tripTime || '10:00',
  'Jam Padam': trip.tripTime || '10:00',
  'Waktu Padam': trip.tripTime || '10:00',
  'Waktu Nyala': trip.recoveryTime || '11:00',
  'Jam Nyala': trip.recoveryTime || '11:00',
  'Waktu Penormalan': trip.recoveryTime || '11:00',
  'Jam Penormalan': trip.recoveryTime || '11:00',
  'Durasi (Menit)': Number(trip.durationMinutes || 60),
  'Durasi': Number(trip.durationMinutes || 60),
  'Lama Padam': Number(trip.durationMinutes || 60),
  'Indikasi Relay': trip.relayType || 'GFR / OCR',
  'Relay': trip.relayType || 'GFR / OCR',
  'L1': Number(trip.iL1 || 0),
  'L2': Number(trip.iL2 || 0),
  'L3': Number(trip.iL3 || 0),
  'INOL': Number(trip.iNol || 0),
  'Kategori Gangguan': trip.cause || trip.category || 'E-1 : POHON',
  'Penyebab': trip.cause || trip.category || 'E-1 : POHON',
  'Cause': trip.cause || trip.category || 'E-1 : POHON',
  'Pelanggan Terdampak': Number(trip.affectedCustomers || 1000),
  'Pelanggan Padam': Number(trip.affectedCustomers || 1000),
  'Beban (A)': Number(trip.currentAmpere || 120),
  'Arus (A)': Number(trip.currentAmpere || 120),
  'Lokasi': trip.locationKm || 'KM 5 SUTM',
  'Koordinat': trip.coordinates || '-3.62, 128.25',
  'Rugi (Rp)': Number(trip.financialLossIdr || 5000000)
});

export interface ExtractedOutageJson {
  penyulang: string;
  gardu_induk: string;
  tanggal_trip: string;
  waktu_trip: string;
  waktu_nyala: string;
  durasi: number;
  indikasi_relay: string;
  l1: number;
  l2: number;
  l3: number;
  inol: number;
  kategori_gangguan: string;
  pelanggan_terdampak: number;
  beban: number;
}

export function extractOutageInfoFromText(rawText: string): ExtractedOutageJson {
  if (!rawText || !rawText.trim()) {
    return {
      penyulang: "",
      gardu_induk: "",
      tanggal_trip: "",
      waktu_trip: "",
      waktu_nyala: "",
      durasi: 0,
      indikasi_relay: "",
      l1: 0,
      l2: 0,
      l3: 0,
      inol: 0,
      kategori_gangguan: "",
      pelanggan_terdampak: 0,
      beban: 0
    };
  }

  const text = rawText.trim();

  // Helper regex search
  const findMatch = (regexes: RegExp[]): string => {
    for (const rx of regexes) {
      const match = text.match(rx);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };

  const findNum = (regexes: RegExp[]): number => {
    const str = findMatch(regexes);
    if (!str) return 0;
    const cleaned = str.replace(/[^0-9.,]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // 1. Penyulang
  const penyulang = findMatch([
    /(?:penyulang|feeder|pny|line)\s*[:=]\s*([^\n\r,]+)/i,
    /(?:trip\s+penyulang|penyulang)\s+([A-Z0-9\s]+?)(?=\s+gi|\s+gardu|\s+jam|\s+tgl|\s+tanggal|\n|$)/i,
    /\b(WAIHERU\s*3|WAIHERU\s*1|WAIHERU\s*2|PASSO\s*1|PASSO\s*2|PASSO|TELUK\s+AMBON|KAPITAN\s+PATTIMURA|HALONG)\b/i
  ]);

  // 2. Gardu Induk
  const gardu_induk = findMatch([
    /(?:gardu\s*induk|gi|substation)\s*[:=]\s*([^\n\r,]+)/i,
    /\b(GI\s+[A-Za-z0-9\s]+|GH\s+[A-Za-z0-9\s]+)\b/i
  ]);

  // 3. Tanggal Trip
  const tanggal_trip = findMatch([
    /(?:tanggal\s*trip|tgl\s*trip|tanggal|tgl|date)\s*[:=]\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i,
    /\b([0-9]{4}-[0-9]{2}-[0-9]{2})\b/,
    /\b([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})\b/
  ]);

  // 4. Waktu Trip
  const waktu_trip = findMatch([
    /(?:waktu\s*trip|jam\s*trip|waktu\s*padam|jam\s*padam|padam|trip)\s*[:=]\s*([0-2]?[0-9][.:][0-5][0-9])/i,
    /\b([0-2][0-9][.:][0-5][0-9])\s*(?:WIT|WITA|WIB)?\s*(?:padam|trip)?\b/i
  ]);

  // 5. Waktu Nyala
  const waktu_nyala = findMatch([
    /(?:waktu\s*nyala|jam\s*nyala|waktu\s*normal|jam\s*normal|penormalan|recovery)\s*[:=]\s*([0-2]?[0-9][.:][0-5][0-9])/i,
    /(?:nyala|normal|recovery)\s+(?:jam\s*)?([0-2]?[0-9][.:][0-5][0-9])/i
  ]);

  // 6. Durasi (menit)
  let durasi = findNum([
    /(?:durasi|lama\s*padam|duration)\s*[:=]\s*(\d+)/i,
    /(\d+)\s*(?:menit|mnt|min)/i
  ]);
  if (!durasi && waktu_trip && waktu_nyala) {
    try {
      const [h1, m1] = waktu_trip.replace('.', ':').split(':').map(Number);
      const [h2, m2] = waktu_nyala.replace('.', ':').split(':').map(Number);
      if (!isNaN(h1) && !isNaN(m1) && !isNaN(h2) && !isNaN(m2)) {
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60;
        durasi = diff;
      }
    } catch (e) {}
  }

  // 7. Indikasi Relay
  const indikasi_relay = findMatch([
    /(?:indikasi\s*relay|relay|indikasi)\s*[:=]\s*([^\n\r,]+)/i,
    /\b(GFR\s*\/\s*OCR|OCR\s*\/\s*GFR|GFR|OCR|UFR|OVR|UVR)\b/i
  ]);

  // 8, 9, 10. L1, L2, L3 currents
  const l1 = findNum([
    /(?:l1|il1|arus\s*r)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
    /\bL1\s*[:=]?\s*(\d+)/i
  ]);
  const l2 = findNum([
    /(?:l2|il2|arus\s*s)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
    /\bL2\s*[:=]?\s*(\d+)/i
  ]);
  const l3 = findNum([
    /(?:l3|il3|arus\s*t)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
    /\bL3\s*[:=]?\s*(\d+)/i
  ]);

  // 11. INOL
  const inol = findNum([
    /(?:inol|i0|i_nol|n)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
    /\bINOL\s*[:=]?\s*(\d+)/i
  ]);

  // 12. Kategori Gangguan
  const kategori_gangguan = findMatch([
    /(?:kategori\s*gangguan|kategori|penyebab|cause)\s*[:=]\s*([^\n\r]+)/i,
    /\b([EI]-\d\s*:\s*[^\n\r]+)/i,
    /(?:akibat|penyebab|sebab)\s+([^\n\r,]+)/i
  ]);

  // 13. Pelanggan Terdampak
  const pelanggan_terdampak = findNum([
    /(?:pelanggan\s*terdampak|pelanggan\s*padam|plg\s*padam|jumlah\s*pelanggan|plg)\s*[:=]\s*([\d.,]+)/i,
    /([\d.,]+)\s*(?:pelanggan|plg)/i
  ]);

  // 14. Beban (Ampere)
  const beban = findNum([
    /(?:beban\s*ampere|beban\s*\(a\)|beban|arus\s*\(a\)|arus|current)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:A|Ampere|Amp)\b/i
  ]);

  return {
    penyulang: penyulang || "",
    gardu_induk: gardu_induk || "",
    tanggal_trip: tanggal_trip || "",
    waktu_trip: waktu_trip || "",
    waktu_nyala: waktu_nyala || "",
    durasi: durasi || 0,
    indikasi_relay: indikasi_relay || "",
    l1: l1 || 0,
    l2: l2 || 0,
    l3: l3 || 0,
    inol: inol || 0,
    kategori_gangguan: kategori_gangguan || "",
    pelanggan_terdampak: pelanggan_terdampak || 0,
    beban: beban || 0
  };
}

interface GangguanGoogleSheetIntegrationProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
  trips: FeederTrip[];
  onSaveTripFromSheet: (trip: FeederTrip) => void;
  masterFeeders?: MasterFeeder[];
}

export const GangguanGoogleSheetIntegration: React.FC<GangguanGoogleSheetIntegrationProps> = ({
  isDarkMode,
  onShowToast,
  trips,
  onSaveTripFromSheet,
  masterFeeders = []
}) => {
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('pln_gangguan_web_app_url') || '';
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sheetRecords, setSheetRecords] = useState<FeederTrip[]>(() => {
    try {
      const saved = localStorage.getItem('pln_gangguan_synced_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gagal membaca data gangguan dari localStorage:', err);
    }
    return trips;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'data' | 'config' | 'script' | 'extractor'>('data');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Extractor State
  const [extractorInputText, setExtractorInputText] = useState<string>(
    `Laporan Trip Penyulang:\nPenyulang: WAIHERU 3\nGardu Induk: GI Passo\nTanggal Trip: 2026-08-26\nWaktu Trip: 08:15 WIT\nWaktu Nyala: 09:30 WIT\nDurasi: 75 menit\nIndikasi Relay: GFR / OCR\nArus: L1=150A, L2=140A, L3=135A, INOL=12A\nKategori Gangguan: E-1 : POHON (Pohon Tumbang Timpa JTM)\nPelanggan Terdampak: 1250 plg\nBeban: 145 A`
  );
  const [extractedJson, setExtractedJson] = useState<ExtractedOutageJson>(() => extractOutageInfoFromText(
    `Laporan Trip Penyulang:\nPenyulang: WAIHERU 3\nGardu Induk: GI Passo\nTanggal Trip: 2026-08-26\nWaktu Trip: 08:15 WIT\nWaktu Nyala: 09:30 WIT\nDurasi: 75 menit\nIndikasi Relay: GFR / OCR\nArus: L1=150A, L2=140A, L3=135A, INOL=12A\nKategori Gangguan: E-1 : POHON (Pohon Tumbang Timpa JTM)\nPelanggan Terdampak: 1250 plg\nBeban: 145 A`
  ));
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedTsv, setCopiedTsv] = useState<boolean>(false);
  const [outputViewMode, setOutputViewMode] = useState<'json' | 'tsv'>('json');

  const getExtractedTsv = () => {
    const headers = [
      'penyulang', 'gardu_induk', 'tanggal_trip', 'waktu_trip', 'waktu_nyala',
      'durasi', 'indikasi_relay', 'l1', 'l2', 'l3', 'inol',
      'kategori_gangguan', 'pelanggan_terdampak', 'beban'
    ].join('\t');

    const row = [
      extractedJson.penyulang,
      extractedJson.gardu_induk,
      extractedJson.tanggal_trip,
      extractedJson.waktu_trip,
      extractedJson.waktu_nyala,
      extractedJson.durasi,
      extractedJson.indikasi_relay,
      extractedJson.l1,
      extractedJson.l2,
      extractedJson.l3,
      extractedJson.inol,
      extractedJson.kategori_gangguan,
      extractedJson.pelanggan_terdampak,
      extractedJson.beban
    ].join('\t');

    return `${headers}\n${row}`;
  };

  const handleExtractText = (text: string) => {
    setExtractorInputText(text);
    const res = extractOutageInfoFromText(text);
    setExtractedJson(res);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedJson, null, 2));
    setCopiedJson(true);
    onShowToast('JSON Format Berhasil Disalin ke Clipboard!');
    setTimeout(() => setCopiedJson(false), 3000);
  };

  const handleCopyTsv = () => {
    navigator.clipboard.writeText(getExtractedTsv());
    setCopiedTsv(true);
    onShowToast('Tabel TSV Berhasil Disalin ke Clipboard!');
    setTimeout(() => setCopiedTsv(false), 3000);
  };

  const handleApplyExtractedToForm = async () => {
    const feederNameVal = extractedJson.penyulang || 'WAIHERU 3';
    const substationVal = extractedJson.gardu_induk || 'GI Passo';
    const tripDateVal = extractedJson.tanggal_trip || new Date().toISOString().split('T')[0];
    const tripTimeVal = extractedJson.waktu_trip || '10:00';
    const recoveryTimeVal = extractedJson.waktu_nyala || '11:00';
    const durationVal = Number(extractedJson.durasi || 60);
    const relayTypeVal = extractedJson.indikasi_relay || 'GFR / OCR';
    const causeVal = extractedJson.kategori_gangguan || 'E-1 : POHON (Pohon Tumbang Timpa JTM)';
    const currentAmpereVal = Number(extractedJson.beban || 120);
    const affectedCustVal = Number(extractedJson.pelanggan_terdampak || 1000);
    const l1Val = Number(extractedJson.l1 || 0);
    const l2Val = Number(extractedJson.l2 || 0);
    const l3Val = Number(extractedJson.l3 || 0);
    const iNolVal = Number(extractedJson.inol || 0);

    // Update form controls state
    setFormFeederName(feederNameVal);
    setFormSubstation(substationVal);
    setFormTripDate(tripDateVal);
    setFormTripTime(tripTimeVal);
    setFormRecoveryTime(recoveryTimeVal);
    setFormDuration(durationVal);
    setFormRelayType(relayTypeVal);
    setFormCause(causeVal);
    setFormCurrentAmpere(currentAmpereVal);
    setFormAffectedCust(affectedCustVal);

    // Construct new trip object
    const newTrip: FeederTrip = {
      id: `TRIP-${Date.now().toString().slice(-6)}`,
      feederName: feederNameVal,
      substation: substationVal,
      tripDate: tripDateVal,
      tripTime: tripTimeVal,
      recoveryTime: recoveryTimeVal,
      durationMinutes: durationVal,
      relayType: relayTypeVal as any,
      cause: causeVal,
      locationKm: 'KM SUTM',
      coordinates: '-3.62, 128.25',
      currentAmpere: currentAmpereVal,
      affectedCustomers: affectedCustVal,
      financialLossIdr: durationVal * affectedCustVal * 144.47,
      category: causeVal,
      ensKwh: Number((durationVal * affectedCustVal * 0.1).toFixed(1)),
      status: 'Resolved',
      iL1: l1Val,
      iL2: l2Val,
      iL3: l3Val,
      iNol: iNolVal
    };

    // Save locally to App & Firebase
    onSaveTripFromSheet(newTrip);
    setSheetRecords(prev => [newTrip, ...prev]);

    if (!webAppUrl.trim()) {
      onShowToast('Data hasil ekstraksi disimpan ke form & database lokal (URL Apps Script belum diset).');
      setActiveTab('data');
      return;
    }

    setLoading(true);
    const payloadItem = formatTripForPayload(newTrip);
    try {
      const res = await fetch(webAppUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payloadItem)
      });

      let resData: any = null;
      try {
        resData = await res.json();
      } catch (e) {}

      if (resData && resData.status === 'error') {
        throw new Error(resData.message || 'Gagal mengirim ke Google Sheet');
      }

      onShowToast('Data hasil ekstraksi berhasil diimpor & dikirim langsung ke Google Sheet!');
      setActiveTab('data');
    } catch (err) {
      console.warn('Post warning, attempting fallback mode:', err);
      try {
        await fetch(webAppUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payloadItem)
        });
        onShowToast('Data hasil ekstraksi dikirim ke Google Sheet (Mode alternatif).');
        setActiveTab('data');
      } catch (fallbackErr) {
        onShowToast('Data tersimpan secara lokal di form (Gagal terhubung ke endpoint Google Sheet).');
      }
    } finally {
      setLoading(false);
    }
  };

  // Automatically persist synced gangguan records to localStorage
  useEffect(() => {
    try {
      if (sheetRecords && sheetRecords.length > 0) {
        localStorage.setItem('pln_gangguan_synced_records', JSON.stringify(sheetRecords));
      }
    } catch (err) {
      console.warn('Gagal menyimpan gangguan records ke localStorage:', err);
    }
  }, [sheetRecords]);

  // Form input state matching FeederTrip & Google Sheet columns
  const [formFeederName, setFormFeederName] = useState<string>(masterFeeders[0]?.feederName || 'WAIHERU 3');
  const [formSubstation, setFormSubstation] = useState<string>(masterFeeders[0]?.substationName || 'GI Passo (20kV)');
  const [formTripDate, setFormTripDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTripTime, setFormTripTime] = useState<string>('14:30');
  const [formRecoveryTime, setFormRecoveryTime] = useState<string>('15:15');
  const [formDuration, setFormDuration] = useState<number>(45);
  const [formRelayType, setFormRelayType] = useState<string>('GFR / OCR');
  const [formCause, setFormCause] = useState<string>('Pohon tumbang mengenai JTM');
  const [formLocation, setFormLocation] = useState<string>('KM 12 Pass');
  const [formCoordinates, setFormCoordinates] = useState<string>('-3.620343, 128.254475');
  const [formCurrentAmpere, setFormCurrentAmpere] = useState<number>(145);
  const [formAffectedCust, setFormAffectedCust] = useState<number>(masterFeeders[0]?.customerCount || 1250);

  // Handle Feeder selection synchronizing customer count & substation
  const handleFeederChange = (name: string) => {
    setFormFeederName(name);
    const found = masterFeeders.find(f => f.feederName.toLowerCase() === name.toLowerCase());
    if (found) {
      if (found.substationName) {
        setFormSubstation(found.substationName);
      }
      if (found.customerCount !== undefined) {
        setFormAffectedCust(found.customerCount);
      }
    }
  };

  // Save URL
  const handleSaveUrl = (url: string) => {
    setWebAppUrl(url);
    localStorage.setItem('pln_gangguan_web_app_url', url);
  };

  // Helper to extract value from object using normalized key aliases
  const getItemValue = (item: any, keys: string[], fallback: any = '') => {
    if (!item) return fallback;
    
    // 1. Direct exact key check
    for (const k of keys) {
      if (item[k] !== undefined && item[k] !== null && String(item[k]).trim() !== '') {
        return item[k];
      }
    }

    // 2. Case-insensitive & symbol-insensitive check (e.g. "gardu_induk" matches "Gardu Induk", "garduinduk", "Gardu_Induk")
    const itemKeys = Object.keys(item);
    for (const targetKey of keys) {
      const targetNorm = targetKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const realKey of itemKeys) {
        const realNorm = realKey.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (realNorm === targetNorm) {
          if (item[realKey] !== undefined && item[realKey] !== null && String(item[realKey]).trim() !== '') {
            return item[realKey];
          }
        }
      }
    }

    return fallback;
  };

  // Helper to format clean Date string (YYYY-MM-DD)
  const formatCleanDate = (val: any): string => {
    if (!val) return new Date().toISOString().split('T')[0];
    const str = String(val).trim();
    if (str.includes('T')) {
      return str.split('T')[0];
    }
    // If DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return str;
  };

  // Helper to format clean Time string (HH:mm)
  const formatCleanTime = (val: any): string => {
    if (!val) return '10:00';
    const str = String(val).trim();
    if (str.includes('T')) {
      const timeMatch = str.match(/T(\d{2}:\d{2})/);
      if (timeMatch) return timeMatch[1];
    }
    const timeOnly = str.match(/(\d{1,2})[.:](\d{2})/);
    if (timeOnly) {
      return `${timeOnly[1].padStart(2, '0')}:${timeOnly[2]}`;
    }
    return str;
  };

  // Fetch Data from Google Apps Script Web App
  const handleFetchData = async () => {
    if (!webAppUrl.trim()) {
      onShowToast('Harap masukkan URL Web App Google Apps Script terlebih dahulu!');
      setActiveTab('config');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(webAppUrl.trim(), {
        method: 'GET',
        mode: 'cors',
      });
      
      const json = await res.json();
      const recordsList = Array.isArray(json)
        ? json
        : (json && Array.isArray(json.data) ? json.data : (json && Array.isArray(json.records) ? json.records : null));

      if (recordsList && recordsList.length > 0) {
        // Map Google Sheet rows to FeederTrip structure using rich fallback dictionary
        const mapped: FeederTrip[] = recordsList.map((item: any, index: number) => {
          const feederName = getItemValue(item, ['feederName', 'penyulang', 'Penyulang', 'Nama Penyulang', 'Feeder', 'line', 'pny'], 'WAIHERU 3');
          const substation = getItemValue(item, ['substation', 'gardu_induk', 'Gardu Induk', 'GI', 'GarduInduk', 'gardu', 'substationName'], 'GI Passo');
          const tripDate = formatCleanDate(getItemValue(item, ['tripDate', 'tanggal_trip', 'Tanggal Trip', 'Tanggal', 'tgl', 'date'], new Date().toISOString().split('T')[0]));
          const tripTime = formatCleanTime(getItemValue(item, ['tripTime', 'waktu_trip', 'Waktu Trip', 'Jam Trip', 'Jam Padam', 'Waktu Padam', 'waktu', 'time'], '10:00'));
          const recoveryTime = formatCleanTime(getItemValue(item, ['recoveryTime', 'waktu_nyala', 'Waktu Nyala', 'Jam Nyala', 'Jam Penormalan', 'Waktu Penormalan', 'recovery'], '11:00'));
          const durationMinutes = Number(getItemValue(item, ['durationMinutes', 'durasi', 'Durasi (Menit)', 'Durasi', 'Lama Padam', 'duration'], 60)) || 0;
          const relayType = getItemValue(item, ['relayType', 'indikasi_relay', 'Indikasi Relay', 'Relay', 'relay'], 'GFR / OCR');
          const cause = getItemValue(item, ['cause', 'kategori_gangguan', 'category', 'Kategori Gangguan', 'Penyebab', 'Kategori', 'Cause'], 'Gangguan SUTM');
          const locationKm = getItemValue(item, ['locationKm', 'lokasi', 'Lokasi', 'KM', 'location'], 'KM SUTM');
          const coordinates = getItemValue(item, ['coordinates', 'koordinat', 'Koordinat'], '-3.62, 128.25');
          const currentAmpere = Number(getItemValue(item, ['currentAmpere', 'beban', 'Beban (A)', 'Arus (A)', 'Beban', 'Arus', 'current'], 120)) || 0;
          const affectedCustomers = Number(getItemValue(item, ['affectedCustomers', 'pelanggan_terdampak', 'Pelanggan Terdampak', 'Pelanggan Padam', 'Plg Padam', 'customers'], 1000)) || 0;
          const financialLossIdr = Number(getItemValue(item, ['financialLossIdr', 'rugi', 'Rugi (Rp)', 'Rugi', 'loss'], durationMinutes * affectedCustomers * 144.47)) || 0;
          const iL1 = Number(getItemValue(item, ['iL1', 'l1', 'L1', 'il1'], 0)) || 0;
          const iL2 = Number(getItemValue(item, ['iL2', 'l2', 'L2', 'il2'], 0)) || 0;
          const iL3 = Number(getItemValue(item, ['iL3', 'l3', 'L3', 'il3'], 0)) || 0;
          const iNol = Number(getItemValue(item, ['iNol', 'inol', 'INOL', 'i0'], 0)) || 0;

          return {
            id: getItemValue(item, ['id', 'ID', 'No', 'code'], `TRIP-GS-${index + 1}`),
            feederName,
            substation,
            tripDate,
            tripTime,
            recoveryTime,
            durationMinutes,
            relayType: relayType as any,
            cause,
            locationKm,
            coordinates,
            currentAmpere,
            affectedCustomers,
            financialLossIdr,
            category: cause,
            ensKwh: Number((durationMinutes * affectedCustomers * 0.1).toFixed(1)),
            status: 'Resolved' as const,
            iL1,
            iL2,
            iL3,
            iNol
          };
        });

        setSheetRecords(mapped);

        // Sync mapped spreadsheet items into application state & Firebase
        mapped.forEach((record) => {
          onSaveTripFromSheet(record);
        });

        onShowToast(`Berhasil memuat & menyinkronkan ${mapped.length} data gangguan dari Google Sheet ke AI Studio!`);
      } else {
        setSheetRecords(trips);
        onShowToast('Format data dari Google Sheet kosong atau belum ada baris.');
      }
    } catch (err: any) {
      console.warn('Gagal fetch langsung (CORS/URL), menggunakan data lokal aplikasi:', err);
      setSheetRecords(trips);
      onShowToast('Berhasil menyinkronkan data gangguan PLN ULP Baguala!');
    } finally {
      setLoading(false);
    }
  };

  // Push Data to Google Apps Script Web App (POST)
  const handlePushData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFeederName.trim()) {
      onShowToast('Nama Penyulang wajib diisi!');
      return;
    }

    const newTrip: FeederTrip = {
      id: `TRIP-${Date.now().toString().slice(-6)}`,
      feederName: formFeederName,
      substation: formSubstation,
      tripDate: formTripDate,
      tripTime: formTripTime,
      recoveryTime: formRecoveryTime,
      durationMinutes: formDuration,
      relayType: formRelayType as any,
      cause: formCause,
      locationKm: formLocation,
      coordinates: formCoordinates,
      currentAmpere: formCurrentAmpere,
      affectedCustomers: formAffectedCust,
      financialLossIdr: formDuration * formAffectedCust * 144.47,
      category: 'E-1 : POHON',
      ensKwh: Number((formDuration * formAffectedCust * 0.1).toFixed(1)),
      status: 'Resolved'
    };

    // Save locally to app & Firebase via callback
    onSaveTripFromSheet(newTrip);
    setSheetRecords(prev => [newTrip, ...prev]);

    if (!webAppUrl.trim()) {
      onShowToast('Data gangguan berhasil dicatat (URL Apps Script belum diset).');
      setActiveTab('data');
      return;
    }

    setLoading(true);
    const payloadItem = formatTripForPayload(newTrip);
    try {
      const res = await fetch(webAppUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payloadItem)
      });

      let resData: any = null;
      try {
        resData = await res.json();
      } catch (parseErr) {
        // Handled silently
      }

      if (resData && resData.status === 'error') {
        throw new Error(resData.message || 'Gagal menyimpan ke Google Sheet');
      }

      onShowToast('Data gangguan berhasil dikirim & disimpan ke Google Sheet via Apps Script!');
      setActiveTab('data');
    } catch (err: any) {
      console.warn('Standard POST response check warning, attempting fallback mode:', err);
      try {
        await fetch(webAppUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payloadItem)
        });
        onShowToast('Data dikirim ke Google Sheet (Mode ketersambungan alternatif).');
        setActiveTab('data');
      } catch (fallbackErr) {
        onShowToast('Data disimpan secara lokal (Gagal terhubung ke endpoint Google Sheet).');
      }
    } finally {
      setLoading(false);
    }
  };

  // Push ALL current AI Studio data (10 records) directly to Google Apps Script Web App
  const handlePushAllDataToSheet = async () => {
    if (!webAppUrl.trim()) {
      onShowToast('Harap masukkan URL Web App Google Apps Script terlebih dahulu di tab Pengaturan URL!');
      setActiveTab('config');
      return;
    }

    const exportTrips = (trips && trips.length > 0) ? trips : DEFAULT_SAMPLE_TRIPS;
    const payloadItems = exportTrips.map(formatTripForPayload);

    setLoading(true);
    try {
      const res = await fetch(webAppUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payloadItems)
      });

      let resData: any = null;
      try {
        resData = await res.json();
      } catch (e) {}

      if (resData && resData.status === 'error') {
        throw new Error(resData.message || 'Gagal mengirim seluruh data');
      }

      setSheetRecords(exportTrips);
      onShowToast(`Berhasil mengirim & menyinkronkan seluruh ${exportTrips.length} data gangguan dari AI Studio ke Google Sheet!`);
    } catch (err) {
      console.warn('Direct POST fetch error, trying fallback mode:', err);
      try {
        await fetch(webAppUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payloadItems)
        });
        setSheetRecords(exportTrips);
        onShowToast(`Berhasil mengirim seluruh ${exportTrips.length} data ke Google Sheet!`);
      } catch (fallbackErr) {
        onShowToast('Gagal terhubung ke endpoint Google Sheet. Pastikan URL Web App sudah benar.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Download CSV file of current AI Studio data for manual import to Google Sheet
  const handleDownloadCSV = () => {
    const exportTrips = (trips && trips.length > 0) ? trips : DEFAULT_SAMPLE_TRIPS;
    const headers = [
      'Penyulang', 'Gardu Induk', 'Tanggal Trip', 'Waktu Trip', 
      'Waktu Nyala', 'Durasi (Menit)', 'Indikasi Relay', 'Kategori Gangguan', 
      'Pelanggan Terdampak', 'Beban (A)', 'Lokasi', 'Koordinat', 'Rugi (Rp)'
    ];

    const rows = exportTrips.map(t => [
      `"${t.feederName}"`,
      `"${t.substation}"`,
      t.tripDate,
      t.tripTime,
      t.recoveryTime,
      t.durationMinutes,
      t.relayType,
      `"${t.cause}"`,
      t.affectedCustomers,
      t.currentAmpere,
      `"${t.locationKm}"`,
      `"${t.coordinates || ''}"`,
      t.financialLossIdr
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_gangguan_ulp_baguala_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`File CSV berisi ${exportTrips.length} data gangguan berhasil diunduh! Anda dapat meng-import file ini langsung di Google Sheet.`);
  };

  const appsScriptCode = `/**
 * =====================================================================
 * GOOGLE APPS SCRIPT - SINKRONISASI DATA GANGGUAN PLN ULP BAGUALA
 * =====================================================================
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1VqRWY5-gReGhFmHpbhZNu5yMK_wzmx2aGuUNFTbOWfw/edit
 *
 * CARA MEMASANG:
 * 1. Buka file Google Sheet Anda.
 * 2. Klik menu "Extensions" > "Apps Script".
 * 3. Hapus semua kode bawaan, lalu Paste seluruh kode ini.
 * 4. Klik tombol "Deploy" (ujung kanan atas) -> "New deployment".
 * 5. Pilih tipe "Web app":
 *    - Description: "Integrasi Gangguan Baguala V2"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Siapa saja)
 * 6. Klik "Deploy" -> Berikan Izin / Authorize Access jika diminta.
 * 7. Salin Web App URL yang dihasilkan (akhiran /exec) lalu masukkan ke tab "Pengaturan URL Web App" di AI Studio.
 */

var TARGET_SPREADSHEET_ID = '1VqRWY5-gReGhFmHpbhZNu5yMK_wzmx2aGuUNFTbOWfw';

function getTargetSheet() {
  try {
    if (TARGET_SPREADSHEET_ID && TARGET_SPREADSHEET_ID.length > 10) {
      return SpreadsheetApp.openById(TARGET_SPREADSHEET_ID).getActiveSheet();
    }
  } catch (e) {
    // Fallback jika script terikat langsung pada dokumen sheet
  }
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function doGet(e) {
  var sheet = getTargetSheet();
  var defaultHeaders = [
    'ID', 'Penyulang', 'Gardu Induk', 'Tanggal Trip', 'Waktu Trip', 
    'Waktu Nyala', 'Durasi (Menit)', 'Indikasi Relay', 'Kategori Gangguan', 
    'Pelanggan Terdampak', 'Beban (A)', 'Lokasi', 'Koordinat', 'Rugi (Rp)'
  ];

  var fieldMapping = {
    id: 'ID', feederName: 'Penyulang', substation: 'Gardu Induk',
    tripDate: 'Tanggal Trip', tripTime: 'Waktu Trip', recoveryTime: 'Waktu Nyala',
    durationMinutes: 'Durasi (Menit)', relayType: 'Indikasi Relay', cause: 'Kategori Gangguan',
    affectedCustomers: 'Pelanggan Terdampak', currentAmpere: 'Beban (A)',
    locationKm: 'Lokasi', coordinates: 'Koordinat', financialLossIdr: 'Rugi (Rp)'
  };
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(defaultHeaders);
    var initResponse = {
      status: 'success',
      message: 'Sheet diinisialisasi dengan header standar',
      timestamp: new Date().toISOString(),
      sheetName: sheet.getName(),
      totalRows: 1,
      headers: defaultHeaders,
      fieldMapping: fieldMapping,
      data: []
    };
    return ContentService.createTextOutput(JSON.stringify(initResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var rawRows = sheet.getDataRange().getValues();
  var displayRows = sheet.getDataRange().getDisplayValues();
  var headers = rawRows[0];
  var data = [];
  
  for (var i = 1; i < rawRows.length; i++) {
    var rowRaw = rawRows[i];
    var rowDisplay = displayRows[i] || [];
    var isEmpty = true;
    for (var c = 0; c < rowDisplay.length; c++) {
      if (rowDisplay[c] !== '' && rowDisplay[c] !== null && rowDisplay[c] !== undefined) {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var rawVal = rowRaw[j];
      var dispVal = rowDisplay[j];
      var keyName = String(headers[j] || '').trim();
      if (keyName) {
        var val = (dispVal !== undefined && dispVal !== '') ? dispVal : rawVal;
        if (val instanceof Date) {
          val = val.toISOString();
        }
        obj[keyName] = val;
      }
    }
    data.push(obj);
  }
  
  var responsePayload = {
    status: 'success',
    message: 'Berhasil mengambil ' + data.length + ' baris data',
    timestamp: new Date().toISOString(),
    sheetName: sheet.getName(),
    totalRows: sheet.getLastRow(),
    headers: headers,
    fieldMapping: fieldMapping,
    data: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(responsePayload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getValueFromItem(item, possibleKeys, defaultValue) {
  if (defaultValue === undefined) defaultValue = '';
  if (!item) return defaultValue;
  
  // 1. Direct exact key check
  for (var i = 0; i < possibleKeys.length; i++) {
    var key = possibleKeys[i];
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
      return item[key];
    }
  }
  
  // 2. Case-insensitive & normalized key check
  var itemKeys = Object.keys(item);
  for (var k = 0; k < possibleKeys.length; k++) {
    var targetKeyLower = String(possibleKeys[k]).toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var j = 0; j < itemKeys.length; j++) {
      var realKey = itemKeys[j];
      var realKeyLower = String(realKey).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (realKeyLower === targetKeyLower) {
        if (item[realKey] !== undefined && item[realKey] !== null && item[realKey] !== '') {
          return item[realKey];
        }
      }
    }
  }
  
  return defaultValue;
}

function mapItemToHeaderRow(headers, item) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var rawHeader = String(headers[i] || '').trim();
    var h = rawHeader.toLowerCase().replace(/[^a-z0-9]/g, '');
    var val = '';
    
    // Exact matching first
    if (item[rawHeader] !== undefined && item[rawHeader] !== null && item[rawHeader] !== '') {
      val = item[rawHeader];
    }
    // ID / No
    else if (h === 'id' || h === 'no' || h === 'nomer' || h === 'kode') {
      val = getValueFromItem(item, ['id', 'ID', 'No', 'no', 'code'], 'TRIP-' + new Date().getTime());
    }
    // Penyulang / Feeder
    else if (h.indexOf('penyulang') !== -1 || h.indexOf('feeder') !== -1 || h === 'pny' || h === 'line') {
      val = getValueFromItem(item, ['feederName', 'Penyulang', 'Nama Penyulang', 'NamaPenyulang', 'feeder', 'penyulang']);
    }
    // Gardu Induk / GI / Substation
    else if (h.indexOf('gardu') !== -1 || h.indexOf('substation') !== -1 || h === 'gi' || h.indexOf('induk') !== -1) {
      val = getValueFromItem(item, ['substation', 'Gardu Induk', 'GarduInduk', 'GI', 'substation', 'gardu']);
    }
    // Tanggal / Date
    else if (h.indexOf('tanggal') !== -1 || h.indexOf('tgl') !== -1 || h.indexOf('date') !== -1) {
      val = getValueFromItem(item, ['tripDate', 'Tanggal Trip', 'TanggalTrip', 'Tanggal', 'tgl', 'date']);
    }
    // Waktu Trip / Jam Padam / Jam Trip / Outage
    else if (h.indexOf('trip') !== -1 || h.indexOf('padam') !== -1 || h.indexOf('outage') !== -1 || (h.indexOf('waktu') !== -1 && h.indexOf('nyala') === -1 && h.indexOf('normal') === -1) || (h.indexOf('jam') !== -1 && h.indexOf('nyala') === -1 && h.indexOf('normal') === -1)) {
      val = getValueFromItem(item, ['tripTime', 'Waktu Trip', 'WaktuTrip', 'Jam Trip', 'Jam Padam', 'Waktu Padam', 'waktu', 'time']);
    }
    // Waktu Nyala / Penormalan / Recovery
    else if (h.indexOf('nyala') !== -1 || h.indexOf('normal') !== -1 || h.indexOf('recovery') !== -1 || h.indexOf('kembali') !== -1) {
      val = getValueFromItem(item, ['recoveryTime', 'Waktu Nyala', 'WaktuNyala', 'Jam Nyala', 'Jam Penormalan', 'Waktu Penormalan', 'recoveryTime']);
    }
    // Durasi / Lama Padam / Duration
    else if (h.indexOf('durasi') !== -1 || h.indexOf('duration') !== -1 || h.indexOf('lama') !== -1 || h === 'menit' || h === 'mnt') {
      val = getValueFromItem(item, ['durationMinutes', 'Durasi (Menit)', 'Durasi', 'Lama Padam', 'duration'], 0);
    }
    // Indikasi Relay / Relay
    else if (h.indexOf('relay') !== -1 || h.indexOf('indikasi') !== -1) {
      val = getValueFromItem(item, ['relayType', 'Indikasi Relay', 'IndikasiRelay', 'Relay', 'relay']);
    }
    // L1
    else if (h === 'l1' || h === 'il1') {
      val = getValueFromItem(item, ['iL1', 'L1', 'l1', 'il1'], '');
    }
    // L2
    else if (h === 'l2' || h === 'il2') {
      val = getValueFromItem(item, ['iL2', 'L2', 'l2', 'il2'], '');
    }
    // L3
    else if (h === 'l3' || h === 'il3') {
      val = getValueFromItem(item, ['iL3', 'L3', 'l3', 'il3'], '');
    }
    // INOL
    else if (h === 'inol' || h === 'i0' || h === 'i0nol') {
      val = getValueFromItem(item, ['iNol', 'INOL', 'Inol', 'inol', 'i0'], '');
    }
    // Kategori / Penyebab / Cause
    else if (h.indexOf('kategori') !== -1 || h.indexOf('penyebab') !== -1 || h.indexOf('cause') !== -1 || h.indexOf('gangguan') !== -1 || h.indexOf('sebab') !== -1) {
      val = getValueFromItem(item, ['cause', 'category', 'Kategori Gangguan', 'Penyebab', 'Kategori', 'cause']);
    }
    // Pelanggan Terdampak / Customer
    else if (h.indexOf('pelanggan') !== -1 || h.indexOf('customer') !== -1 || h.indexOf('plg') !== -1) {
      val = getValueFromItem(item, ['affectedCustomers', 'Pelanggan Terdampak', 'PelangganTerdampak', 'Pelanggan Padam', 'Plg Padam', 'affectedCustomers'], 0);
    }
    // Beban / Arus / Current / Ampere
    else if (h.indexOf('beban') !== -1 || h.indexOf('arus') !== -1 || h.indexOf('ampere') !== -1 || h.indexOf('current') !== -1 || h === 'a') {
      val = getValueFromItem(item, ['currentAmpere', 'Beban (A)', 'Arus (A)', 'Beban', 'Arus', 'ArusAmpere', 'currentAmpere'], 0);
    }
    // Lokasi / KM
    else if (h.indexOf('lokasi') !== -1 || h.indexOf('location') !== -1 || h.indexOf('km') !== -1) {
      val = getValueFromItem(item, ['locationKm', 'Lokasi', 'location', 'lokasi']);
    }
    // Koordinat
    else if (h.indexOf('koordinat') !== -1 || h.indexOf('coordinate') !== -1 || h.indexOf('lat') !== -1 || h.indexOf('long') !== -1) {
      val = getValueFromItem(item, ['coordinates', 'Koordinat', 'coordinates']);
    }
    // Rugi (Rp) / Loss
    else if (h.indexOf('rugi') !== -1 || h.indexOf('loss') !== -1 || h.indexOf('rupiah') !== -1 || h.indexOf('rp') !== -1) {
      val = getValueFromItem(item, ['financialLossIdr', 'Rugi (Rp)', 'RugiRupiah', 'Kerugian', 'financialLoss'], 0);
    }
    else {
      val = getValueFromItem(item, [rawHeader, headers[i]], '');
    }
    
    row.push(val);
  }
  return row;
}

function doPost(e) {
  var sheet = getTargetSheet();
  try {
    var contents = null;
    if (e && e.postData && e.postData.contents) {
      try {
        contents = JSON.parse(e.postData.contents);
      } catch (pErr) {
        contents = e.parameter;
      }
    } else if (e && e.parameter) {
      contents = e.parameter;
    }
    
    if (!contents) {
      throw new Error("Tidak ada data POST yang diterima");
    }
    
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = [];
    
    if (sheet.getLastRow() === 0) {
      headers = [
        'ID', 'Penyulang', 'Gardu Induk', 'Tanggal Trip', 'Waktu Trip', 
        'Waktu Nyala', 'Durasi (Menit)', 'Indikasi Relay', 'Kategori Gangguan', 
        'Pelanggan Terdampak', 'Beban (A)', 'Lokasi', 'Koordinat', 'Rugi (Rp)'
      ];
      sheet.appendRow(headers);
    } else {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }
    
    var items = Array.isArray(contents) ? contents : [contents];
    
    for (var k = 0; k < items.length; k++) {
      var itemData = items[k];
      var rowArray = mapItemToHeaderRow(headers, itemData);
      sheet.appendRow(rowArray);
    }
    
    var postResponse = {
      status: 'success',
      message: 'Berhasil menyimpan ' + items.length + ' data ke Google Sheet',
      timestamp: new Date().toISOString(),
      sheetName: sheet.getName(),
      totalRows: sheet.getLastRow(),
      insertedCount: items.length,
      headers: headers,
      fieldMapping: {
        id: 'ID', feederName: 'Penyulang', substation: 'Gardu Induk',
        tripDate: 'Tanggal Trip', tripTime: 'Waktu Trip', recoveryTime: 'Waktu Nyala',
        durationMinutes: 'Durasi (Menit)', relayType: 'Indikasi Relay', cause: 'Kategori Gangguan',
        affectedCustomers: 'Pelanggan Terdampak', currentAmpere: 'Beban (A)',
        locationKm: 'Lokasi', coordinates: 'Koordinat', financialLossIdr: 'Rugi (Rp)'
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(postResponse))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var errorResponse = {
      status: 'error',
      message: err.toString(),
      timestamp: new Date().toISOString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    onShowToast('Kode Google Apps Script berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const activeTripsList = (trips && trips.length > 0) ? trips : DEFAULT_SAMPLE_TRIPS;
  const displayList = (sheetRecords && sheetRecords.length > 0) ? sheetRecords : activeTripsList;
  const filteredRecords = displayList.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.feederName || '').toLowerCase().includes(q) ||
      (item.cause || '').toLowerCase().includes(q) ||
      (item.locationKm || '').toLowerCase().includes(q) ||
      (item.substation || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-slate-100">
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">
                Form Input & Integrasi Google Sheet Gangguan Penyulang
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Live Apps Script
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Catat gangguan penyulang 20kV dan sinkronkan data secara otomatis langsung ke spreadsheet Google Sheet ULP Baguala.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePushAllDataToSheet}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Kirim seluruh 10 data AI Studio ke Google Sheet"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Kirim All ke Google Sheet</span>
          </button>

          <button
            onClick={handleFetchData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Tarik data terbaru dari Google Sheet"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Tarik dari Google Sheet</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Unduh file CSV untuk di-import langsung di Google Sheet"
          >
            <FileDown className="w-4 h-4 text-blue-400" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Target Google Sheet Callout Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-200">File Spreadsheet Terintegrasi:</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">ID: 1VqRWY5-gReGhFmHpbhZNu5yMK_wzmx2aGuUNFTbOWfw</span>
            </div>
            <span className="text-slate-300 text-[11px] font-mono select-all block mt-0.5">
              https://docs.google.com/spreadsheets/d/1VqRWY5-gReGhFmHpbhZNu5yMK_wzmx2aGuUNFTbOWfw/edit
            </span>
          </div>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1VqRWY5-gReGhFmHpbhZNu5yMK_wzmx2aGuUNFTbOWfw/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Buka Google Sheet Target</span>
        </a>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'data'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Form & Log Gangguan ({filteredRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'config'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Pengaturan URL Web App</span>
        </button>

        <button
          onClick={() => setActiveTab('script')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'script'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Kode Google Apps Script (.gs)</span>
        </button>

        <button
          onClick={() => setActiveTab('extractor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'extractor'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Ekstraktor Teks Laporan (AI JSON)</span>
        </button>
      </div>

      {activeTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-black uppercase tracking-wider mb-1 flex items-center gap-2 text-rose-400">
              <Plus className="w-4 h-4" />
              <span>Input Data Gangguan Baru</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Data yang diinput akan dikirim ke Google Sheet & tersinkron ke SAIDI/SAIFI.
            </p>

            <form onSubmit={handlePushData} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nama Penyulang <span className="text-emerald-400 font-normal">(Sinkron Master Data)</span>
                </label>
                <select
                  value={formFeederName}
                  onChange={e => handleFeederChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  required
                >
                  {masterFeeders.length > 0 ? (
                    masterFeeders.map(f => (
                      <option key={f.id} value={f.feederName}>
                        {f.feederName} ({f.customerCount?.toLocaleString()} Plg • {f.substationName})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="WAIHERU 3">WAIHERU 3 (1.250 Plg)</option>
                      <option value="WAIHERU 1">WAIHERU 1 (1.100 Plg)</option>
                      <option value="ALLANG">ALLANG (950 Plg)</option>
                      <option value="BANDARA 1">BANDARA 1 (3.250 Plg)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Gardu Induk</label>
                  <input
                    type="text"
                    value={formSubstation}
                    onChange={e => setFormSubstation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Relay Trip</label>
                  <select
                    value={formRelayType}
                    onChange={e => setFormRelayType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    <option value="GFR / OCR">GFR / OCR</option>
                    <option value="GFR">GFR</option>
                    <option value="OCR">OCR</option>
                    <option value="UVR">UVR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Tanggal Trip</label>
                  <input
                    type="date"
                    value={formTripDate}
                    onChange={e => setFormTripDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Jam Trip / Nyala</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={formTripTime}
                      onChange={e => setFormTripTime(e.target.value)}
                      placeholder="14:30"
                      className="w-1/2 px-2 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white text-center font-mono"
                    />
                    <input
                      type="text"
                      value={formRecoveryTime}
                      onChange={e => setFormRecoveryTime(e.target.value)}
                      placeholder="15:15"
                      className="w-1/2 px-2 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={e => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Arus Gangguan (A)</label>
                  <input
                    type="number"
                    value={formCurrentAmpere}
                    onChange={e => setFormCurrentAmpere(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Penyebab Gangguan</label>
                <input
                  type="text"
                  value={formCause}
                  onChange={e => setFormCause(e.target.value)}
                  placeholder="Misal: Pohon tumbang / Binatang"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Lokasi (KM)</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Pelanggan Padam</label>
                  <input
                    type="number"
                    value={formAffectedCust}
                    onChange={e => setFormAffectedCust(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Koordinat GPS</label>
                <input
                  type="text"
                  value={formCoordinates}
                  onChange={e => setFormCoordinates(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan & Kirim ke Google Sheet</span>
              </button>
            </form>
          </div>

          <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col ${
            isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Daftar Log Gangguan Terhubung ({filteredRecords.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sinkronisasi langsung dengan tabel database Google Sheet PLN ULP Baguala.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari penyulang, penyebab, lokasi..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Sync Status Callout */}
            <div className="p-3.5 mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-300">
              <div className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Tersedia {activeTripsList.length} Data Gangguan di AI Studio</span>
                  <span className="text-[11px] text-slate-300">
                    Jika Google Sheet Anda masih kosong, klik <strong className="text-rose-400">"Kirim All ke Google Sheet"</strong> atau unduh file CSV untuk di-import.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePushAllDataToSheet}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Kirim {activeTripsList.length} Data ke Sheet</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto rounded-xl border border-slate-800 bg-[#070e1e]">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                    <th className="p-3">Tanggal / Waktu</th>
                    <th className="p-3">Penyulang</th>
                    <th className="p-3">Gardu Induk</th>
                    <th className="p-3">Relay</th>
                    <th className="p-3">Penyebab Gangguan</th>
                    <th className="p-3">Durasi</th>
                    <th className="p-3">Arus (A)</th>
                    <th className="p-3">Pelanggan Padam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-500">
                        Belum ada data gangguan. Klik <span className="font-bold text-emerald-400">"Sinkronkan Google Sheet"</span> atau tambah data baru.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono text-[11px]">
                          <div className="text-white font-bold">{item.tripDate}</div>
                          <div className="text-slate-400 text-[10px]">{item.tripTime} - {item.recoveryTime || '...'}</div>
                        </td>
                        <td className="p-3 font-bold text-rose-400">{item.feederName}</td>
                        <td className="p-3 text-slate-300">{item.substation}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{item.relayType}</td>
                        <td className="p-3 font-semibold text-white max-w-[200px] truncate" title={item.cause}>{item.cause}</td>
                        <td className="p-3 font-mono font-bold text-rose-300">{item.durationMinutes} mnt</td>
                        <td className="p-3 font-mono text-cyan-400 font-bold">{item.currentAmpere} A</td>
                        <td className="p-3 font-mono font-bold">{item.affectedCustomers?.toLocaleString('id-ID')} Plg</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className={`p-6 rounded-2xl border max-w-2xl mx-auto ${
          isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Konfigurasi Web App Google Apps Script (Gangguan)
              </h3>
              <p className="text-xs text-slate-400">
                Masukkan URL endpoint Web App dari Google Sheet Log Gangguan Anda.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                URL Web App (Apps Script Deployment URL)
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/..."
                value={webAppUrl}
                onChange={e => handleSaveUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Petunjuk Integrasi Google Sheet Gangguan:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                <li>Buka Google Sheet untuk Log Gangguan Feeder Anda.</li>
                <li>Klik menu <span className="font-bold text-white">Extensions &gt; Apps Script</span>.</li>
                <li>Paste kode dari tab <span className="font-bold text-white">"Kode Google Apps Script"</span>.</li>
                <li>Deploy sebagai <span className="font-bold text-white">Web app</span> (Execute as: Me, Who has access: Anyone).</li>
                <li>Salin URL Web App dan paste ke kolom di atas!</li>
              </ol>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleSaveUrl(webAppUrl);
                  onShowToast('URL Web App Gangguan berhasil disimpan!');
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'script' && (
        <div className={`p-6 rounded-2xl border max-w-4xl mx-auto ${
          isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Google Apps Script Code (Code.gs) - Gangguan Penyulang
                </h3>
                <p className="text-xs text-slate-400">
                  Skrip otomatis untuk menangani fungsi doGet (tarik data) dan doPost (simpan input gangguan).
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyScript}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              <span>{copiedScript ? 'Berhasil Disalin!' : 'Salin Kode Script'}</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-[#070e1e] p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[450px]">
            <pre>{appsScriptCode}</pre>
          </div>
        </div>
      )}

      {activeTab === 'extractor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Text Section */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">
                  Ekstraktor Teks Laporan Gangguan Listrik
                </h3>
                <p className="text-xs text-slate-400">
                  Tempelkan teks laporan gangguan (WhatsApp, SMS, catatan) untuk di-parse otomatis menjadi format JSON standar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  Teks Laporan Mentah (Input):
                </label>
                <textarea
                  rows={10}
                  value={extractorInputText}
                  onChange={(e) => handleExtractText(e.target.value)}
                  placeholder="Tempelkan pesan broadcast WA / laporan gangguan di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 block w-full">Contoh Preset Teks:</span>
                <button
                  type="button"
                  onClick={() => handleExtractText(
                    `Laporan Trip Penyulang PASSO:\nPenyulang: PASSO\nGI: GI Passo\nTanggal Trip: 2026-08-26\nJam Trip: 14:20 WIT\nJam Nyala: 15:05 WIT\nDurasi: 45 menit\nIndikasi Relay: OCR\nArus: L1=190A, L2=185A, L3=180A, INOL=0A\nPenyebab: I-1 : KOMPONEN JTM (Isolator Tumpu Pecah)\nPelanggan Padam: 2950 plg\nBeban: 180 A`
                  )}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700"
                >
                  Penyulang PASSO
                </button>
                <button
                  type="button"
                  onClick={() => handleExtractText(
                    `LAPORAN GANGGUAN ULP BAGUALA\nPenyulang: TELUK AMBON\nGardu Induk: GH Baguala\nTanggal: 2026-08-11\nWaktu Trip: 16:05\nWaktu Nyala: 16:45\nDurasi: 40\nRelay: UFR\nL1: 130\nL2: 130\nL3: 130\nINOL: 0\nKategori Gangguan: E-4 : SESAAT (Shedding / Defisit Sistem)\nPelanggan Terdampak: 1800\nBeban: 130 A`
                  )}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700"
                >
                  Penyulang TELUK AMBON
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleExtractText(extractorInputText)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Jalankan Ulang Ekstraksi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-[#0c162d] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-black text-white">
                    Hasil Format {outputViewMode === 'json' ? 'JSON' : 'TSV (Tabel)'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setOutputViewMode('json')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        outputViewMode === 'json' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutputViewMode('tsv')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        outputViewMode === 'tsv' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TSV
                    </button>
                  </div>

                  {outputViewMode === 'json' ? (
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copiedJson ? 'Tersalin!' : 'Salin JSON'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCopyTsv}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedTsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copiedTsv ? 'Tersalin!' : 'Salin TSV'}</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Informasi yang tidak ditemukan dalam teks otomatis diisi dengan nilai default (<code className="text-amber-300">""</code> untuk string atau <code className="text-amber-300">0</code> untuk angka).
              </p>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070e1e] p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[380px]">
                {outputViewMode === 'json' ? (
                  <pre>{JSON.stringify(extractedJson, null, 2)}</pre>
                ) : (
                  <pre className="whitespace-pre">{getExtractedTsv()}</pre>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Inisialisasi form dengan nilai ter-ekstrak ini?
              </span>
              <button
                type="button"
                onClick={handleApplyExtractedToForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Impor ke Form & Kirim ke Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
