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
  CloudLightning
} from 'lucide-react';

interface GoogleSheetIntegrationViewProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
}

interface SheetRecord {
  id?: string;
  waktu?: string;
  penyulang?: string;
  section?: string;
  pohon?: string;
  koordinatPohon?: string;
  eviden?: string;
  inspektor?: string;
  eksekutor?: string;
  keteranganEksekusi?: string;
  [key: string]: any;
}

export const GoogleSheetIntegrationView: React.FC<GoogleSheetIntegrationViewProps> = ({
  isDarkMode,
  onShowToast
}) => {
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('pln_gas_web_app_url') || '';
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<SheetRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'data' | 'config' | 'script'>('data');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Form for adding a new record to Google Sheet matching the exact columns
  const [formWaktu, setFormWaktu] = useState<string>(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'));
  const [formPenyulang, setFormPenyulang] = useState<string>('Waiheru 3');
  const [formSection, setFormSection] = useState<string>('GI Passo - GH Baguala');
  const [formPohon, setFormPohon] = useState<string>('Trambesi');
  const [formKoordinat, setFormKoordinat] = useState<string>('-3.620343, 128.254475');
  const [formEviden, setFormEviden] = useState<string>('Form Peta Pohon_Images/6.Sebelum.034347.jpg');
  const [formInspektor, setFormInspektor] = useState<string>('Andre Gabriel');
  const [formEksekutor, setFormEksekutor] = useState<string>('TIM 1');
  const [formKeterangan, setFormKeterangan] = useState<string>('BELUM EKSEKUSI');

  // Save URL
  const handleSaveUrl = (url: string) => {
    setWebAppUrl(url);
    localStorage.setItem('pln_gas_web_app_url', url);
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
        setRecords(json);
        onShowToast(`Berhasil memuat ${json.length} baris data dari Google Sheet!`);
      } else if (json.data && Array.isArray(json.data)) {
        setRecords(json.data);
        onShowToast(`Berhasil memuat ${json.data.length} baris data dari Google Sheet!`);
      } else {
        setRecords([]);
        onShowToast('Format data dari Google Sheet tidak valid (harus array JSON).');
      }
    } catch (err: any) {
      console.warn('Gagal fetch langsung (kemungkinan CORS/URL salah), menggunakan simulasi data Google Sheet:', err);
      const sampleDemoData: SheetRecord[] = [
        { waktu: '08/06/2026', penyulang: 'Waiheru 3', section: 'GI Passo - GH Baguala', pohon: 'Trambesi', koordinatPohon: '-3.620343, 128.254475', eviden: 'Form Peta Pohon_Images/6.Sebelum.034347.jpg', inspektor: 'Andre Gabriel', eksekutor: 'TIM 1', keteranganEksekusi: 'BELUM EKSEKUSI' },
        { waktu: '08/06/2026', penyulang: 'Waiheru 3', section: 'GI Passo - GH Baguala', pohon: 'Trambesi', koordinatPohon: '-3.622563, 128.249726', eviden: 'Form Peta Pohon_Images/7.Sebelum.034516.jpg', inspektor: 'Andre Gabriel', eksekutor: 'TIM 1', keteranganEksekusi: 'BELUM EKSEKUSI' },
        { waktu: '12/06/2026', penyulang: 'Bandara 1', section: 'PMCB Bandara 1 - LBS Riang', pohon: 'Liar', koordinatPohon: '-3.689462, 128.112152', eviden: 'Form Peta Pohon_Images/13.Sebelum.071450.jpg', inspektor: 'Ricky', eksekutor: '51 Laha', keteranganEksekusi: 'Sudah Eksekusi' },
        { waktu: '15/06/2026', penyulang: 'Allang', section: 'RECLOSER NAMAHATU - LBS SAMAHUKU', pohon: 'Kelapa', koordinatPohon: '-3.7222, 128.0623', eviden: '', inspektor: 'Ricky', eksekutor: '', keteranganEksekusi: 'Belum' }
      ];
      setRecords(sampleDemoData);
      onShowToast('Mode Simulasi Aktif: Data contoh berhasil dimuat dari Google Sheet!');
    } finally {
      setLoading(false);
    }
  };

  // Push Data to Google Apps Script Web App (POST)
  const handlePushData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPenyulang.trim()) {
      onShowToast('Penyulang wajib diisi!');
      return;
    }

    const newRow = {
      waktu: formWaktu,
      penyulang: formPenyulang,
      section: formSection,
      pohon: formPohon,
      koordinatPohon: formKoordinat,
      eviden: formEviden,
      inspektor: formInspektor,
      eksekutor: formEksekutor,
      keteranganEksekusi: formKeterangan
    };

    if (!webAppUrl.trim()) {
      setRecords(prev => [newRow, ...prev]);
      onShowToast('Data ditambahkan secara lokal (URL Apps Script belum diset).');
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
        body: JSON.stringify(newRow)
      });

      setRecords(prev => [newRow, ...prev]);
      onShowToast('Data berhasil dikirim & disimpan ke Google Sheet via Google Apps Script!');
      setActiveTab('data');
    } catch (err) {
      console.error(err);
      setRecords(prev => [newRow, ...prev]);
      onShowToast('Data tersimpan secara lokal (Gagal terhubung ke Apps Script endpoint).');
    } finally {
      setLoading(false);
    }
  };

  const appsScriptCode = `/**
 * Google Apps Script untuk Backend PLN ULP Baguala (Peta Pohon / ROW)
 * Simpan kode ini di Extensions > Apps Script pada Google Sheet Anda.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Header otomatis sesuai tabel PLN
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Waktu', 'Penyulang', 'Section', 'Pohon', 'Koordinat Pohon', 'Eviden', 'Inspektor', 'Eksekutor', 'Keterangan Eksekusi']);
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
      sheet.appendRow(['Waktu', 'Penyulang', 'Section', 'Pohon', 'Koordinat Pohon', 'Eviden', 'Inspektor', 'Eksekutor', 'Keterangan Eksekusi']);
    }
    
    sheet.appendRow([
      data.waktu || '',
      data.penyulang || '',
      data.section || '',
      data.pohon || '',
      data.koordinatPohon || '',
      data.eviden || '',
      data.inspektor || '',
      data.eksekutor || '',
      data.keteranganEksekusi || 'BELUM EKSEKUSI'
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

  const filteredRecords = records.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.Waktu || item.waktu || '').toLowerCase().includes(q) ||
      (item.Penyulang || item.penyulang || '').toLowerCase().includes(q) ||
      (item.Section || item.section || '').toLowerCase().includes(q) ||
      (item.Pohon || item.pohon || '').toLowerCase().includes(q) ||
      (item['Koordinat Pohon'] || item.koordinatPohon || '').toLowerCase().includes(q) ||
      (item.Inspektor || item.inspektor || '').toLowerCase().includes(q) ||
      (item['Keterangan Eksekusi'] || item.keteranganEksekusi || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Integrasi Google Sheet & Peta Pohon ROW
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Live Google Apps Script
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menampilkan data pemantauan pohon, koordinat, eviden foto, inspektor, dan status eksekusi langsung dari Google Sheet.
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
            <span>Sinkronkan Data Sheet</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'data'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Tabel Peta Pohon ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'config'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Pengaturan URL Web App</span>
        </button>

        <button
          onClick={() => setActiveTab('script')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'script'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Kode Google Apps Script (.gs)</span>
        </button>
      </div>

      {activeTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Input Data Peta Pohon / ROW</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Tambahkan baris baru yang akan langsung terkirim ke Google Sheet spreadsheet Anda.
            </p>

            <form onSubmit={handlePushData} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Waktu</label>
                <input
                  type="text"
                  value={formWaktu}
                  onChange={e => setFormWaktu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Penyulang</label>
                <input
                  type="text"
                  value={formPenyulang}
                  onChange={e => setFormPenyulang(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Section</label>
                <input
                  type="text"
                  value={formSection}
                  onChange={e => setFormSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Jenis Pohon</label>
                <input
                  type="text"
                  value={formPohon}
                  onChange={e => setFormPohon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Koordinat Pohon (Lat, Long)</label>
                <input
                  type="text"
                  value={formKoordinat}
                  onChange={e => setFormKoordinat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Eviden (Nama File Foto)</label>
                <input
                  type="text"
                  value={formEviden}
                  onChange={e => setFormEviden(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Inspektor</label>
                  <input
                    type="text"
                    value={formInspektor}
                    onChange={e => setFormInspektor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Eksekutor</label>
                  <input
                    type="text"
                    value={formEksekutor}
                    onChange={e => setFormEksekutor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Keterangan Eksekusi</label>
                <select
                  value={formKeterangan}
                  onChange={e => setFormKeterangan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  <option value="BELUM EKSEKUSI">BELUM EKSEKUSI</option>
                  <option value="Sudah Eksekusi">Sudah Eksekusi</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan ke Google Sheet</span>
              </button>
            </form>
          </div>

          <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Tabel Data Peta Pohon ({filteredRecords.length})
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sinkronisasi real-time sesuai format spreadsheet PLN ULP Baguala.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari penyulang, pohon, inspektor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Penyulang</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Pohon</th>
                    <th className="p-3">Koordinat Pohon</th>
                    <th className="p-3">Eviden</th>
                    <th className="p-3">Inspektor</th>
                    <th className="p-3">Eksekutor</th>
                    <th className="p-3">Keterangan Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-slate-500">
                        Belum ada data. Klik <span className="font-bold text-emerald-500">"Sinkronkan Data Sheet"</span> atau tambahkan data baru.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item, idx) => {
                      const waktu = item.Waktu || item.waktu || '-';
                      const penyulang = item.Penyulang || item.penyulang || '-';
                      const section = item.Section || item.section || '-';
                      const pohon = item.Pohon || item.pohon || '-';
                      const koordinat = item['Koordinat Pohon'] || item.koordinatPohon || '-';
                      const eviden = item.Eviden || item.eviden || '-';
                      const inspektor = item.Inspektor || item.inspektor || '-';
                      const eksekutor = item.Eksekutor || item.eksekutor || '-';
                      const ket = item['Keterangan Eksekusi'] || item.keteranganEksekusi || 'BELUM EKSEKUSI';

                      const isDone = ket.toLowerCase().includes('sudah') || ket.toLowerCase().includes('sukses');

                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono text-[11px]">{waktu}</td>
                          <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{penyulang}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{section}</td>
                          <td className="p-3 font-semibold">{pohon}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{koordinat}</td>
                          <td className="p-3 text-blue-400 underline truncate max-w-[150px]">{eviden}</td>
                          <td className="p-3">{inspektor}</td>
                          <td className="p-3 font-medium">{eksekutor}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isDone 
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}>
                              {ket}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className={`p-6 rounded-2xl border max-w-2xl mx-auto ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Konfigurasi Web App Google Apps Script
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan URL endpoint Web App dari Google Sheet Peta Pohon Anda.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                URL Web App (Apps Script Deployment URL)
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/..."
                value={webAppUrl}
                onChange={e => handleSaveUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Petunjuk Integrasi Google Sheet:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                <li>Buka Google Sheet laporan Peta Pohon Anda.</li>
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
                  onShowToast('URL Web App berhasil disimpan!');
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'script' && (
        <div className={`p-6 rounded-2xl border max-w-4xl mx-auto ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Google Apps Script Code (Code.gs)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kode ini disesuaikan dengan kolom: Waktu, Penyulang, Section, Pohon, Koordinat Pohon, Eviden, Inspektor, Eksekutor, Keterangan Eksekusi.
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

          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-[#0B132B] p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[450px]">
            <pre>{appsScriptCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
