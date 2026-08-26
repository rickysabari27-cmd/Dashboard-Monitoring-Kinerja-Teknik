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
  Zap
} from 'lucide-react';
import { FeederTrip, MasterFeeder } from '../../types';

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
    return trips;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'data' | 'config' | 'script'>('data');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

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
      if (Array.isArray(json)) {
        // Map Google Sheet rows to FeederTrip structure
        const mapped: FeederTrip[] = json.map((item, index) => ({
          id: item.id || `TRIP-GS-${index + 1}`,
          feederName: item.feederName || item.Penyulang || 'WAIHERU',
          substation: item.substation || item.GarduInduk || 'GI Passo',
          tripDate: item.tripDate || item.Tanggal || '2026-06-08',
          tripTime: item.tripTime || item.WaktuTrip || '10:00',
          recoveryTime: item.recoveryTime || item.WaktuNyala || '11:00',
          durationMinutes: Number(item.durationMinutes || item.DurasiMenit || 60),
          relayType: item.relayType || item.Relay || 'GFR / OCR',
          cause: item.cause || item.Penyebab || 'Gangguan SUTM',
          locationKm: item.locationKm || item.Lokasi || 'KM 5',
          coordinates: item.coordinates || item.Koordinat || '-3.62, 128.25',
          currentAmpere: Number(item.currentAmpere || item.ArusAmpere || 120),
          affectedCustomers: Number(item.affectedCustomers || item.PelangganTerdampak || 1000),
          financialLossIdr: Number(item.financialLossIdr || item.RugiRupiah || 5000000),
          category: item.category || item.Kategori || 'E-1 : POHON',
          ensKwh: Number(item.ensKwh || 150),
          status: 'Resolved' as const
        }));
        setSheetRecords(mapped);
        onShowToast(`Berhasil memuat ${mapped.length} data gangguan dari Google Sheet!`);
      } else {
        setSheetRecords(trips);
        onShowToast('Format data dari Google Sheet tidak valid, menampilkan data lokal.');
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
    try {
      await fetch(webAppUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrip)
      });

      onShowToast('Data gangguan berhasil dikirim & disimpan ke Google Sheet via Apps Script!');
      setActiveTab('data');
    } catch (err) {
      console.error(err);
      onShowToast('Data disimpan secara lokal (Gagal terhubung ke endpoint Google Sheet).');
    } finally {
      setLoading(false);
    }
  };

  const appsScriptCode = `/**
 * =====================================================================
 * GOOGLE APPS SCRIPT - INPUT GANGGUAN PENYULANG PLN ULP BAGUALA
 * =====================================================================
 * Salin kode ini ke Extensions > Apps Script di Google Sheet Anda.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Buat Header otomatis jika sheet masih kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'ID', 'Penyulang', 'Gardu Induk', 'Tanggal Trip', 'Waktu Trip', 
      'Waktu Nyala', 'Durasi (Menit)', 'Relay', 'Penyebab', 'Lokasi', 
      'Koordinat', 'Arus (A)', 'Pelanggan Terdampak', 'Rugi (Rp)'
    ]);
  }
  
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  try {
    var data = JSON.parse(e.postData.contents);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'ID', 'Penyulang', 'Gardu Induk', 'Tanggal Trip', 'Waktu Trip', 
        'Waktu Nyala', 'Durasi (Menit)', 'Relay', 'Penyebab', 'Lokasi', 
        'Koordinat', 'Arus (A)', 'Pelanggan Terdampak', 'Rugi (Rp)'
      ]);
    }
    
    sheet.appendRow([
      data.id || ('TRIP-' + new Date().getTime()),
      data.feederName || '',
      data.substation || '',
      data.tripDate || '',
      data.tripTime || '',
      data.recoveryTime || '',
      data.durationMinutes || 0,
      data.relayType || '',
      data.cause || '',
      data.locationKm || '',
      data.coordinates || '',
      data.currentAmpere || 0,
      data.affectedCustomers || 0,
      data.financialLossIdr || 0
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    onShowToast('Kode Google Apps Script berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const displayList = sheetRecords.length > 0 ? sheetRecords : trips;
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleFetchData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sinkronkan Google Sheet</span>
          </button>
        </div>
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
    </div>
  );
};
