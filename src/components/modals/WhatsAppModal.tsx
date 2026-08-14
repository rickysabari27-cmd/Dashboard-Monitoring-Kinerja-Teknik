import React, { useState, useEffect } from 'react';
import { WhatsAppContact, WhatsAppMessage, FeederTrip, SpkTask } from '../../types';
import { INITIAL_WHATSAPP_CONTACTS } from '../../data/mockData';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Phone, 
  Users, 
  Zap, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Radio
} from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  initialCategory?: string;
  initialTrip?: FeederTrip | null;
  initialSpk?: SpkTask | null;
  selectedTrip?: FeederTrip | null;
  selectedSpk?: SpkTask | null;
  initialFeederName?: string;
  trips?: FeederTrip[];
  spkList?: SpkTask[];
  onMessageSent?: (msg: WhatsAppMessage) => void;
  onSaveMessage?: (msg: WhatsAppMessage) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  initialCategory = 'Gangguan / Trip',
  initialTrip,
  initialSpk,
  selectedTrip,
  selectedSpk,
  initialFeederName,
  trips = [],
  spkList = [],
  onMessageSent,
  onSaveMessage
}) => {
  const activeTrip = selectedTrip || initialTrip;
  const activeSpk = selectedSpk || initialSpk;

  const [category, setCategory] = useState<string>(initialCategory || 'Gangguan / Trip');
  const [selectedContactId, setSelectedContactId] = useState<string>('WAC-01');
  const [customInput, setCustomInput] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('ROW & Inspeksi Baguala');
  const [messageText, setMessageText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Template variables state
  const [feederName, setFeederName] = useState(initialFeederName || activeTrip?.feederName || 'LATERI 2');
  const [substation, setSubstation] = useState(activeTrip?.substation || 'GI Passo (20kV)');
  const [tripDate, setTripDate] = useState(activeTrip?.tripDate || new Date().toISOString().split('T')[0]);
  const [tripTime, setTripTime] = useState(activeTrip?.tripTime || '14:20');
  const [recoveryTime, setRecoveryTime] = useState(activeTrip?.recoveryTime || '15:30');
  const [relayType, setRelayType] = useState(activeTrip?.relayType || 'GFR / OCR');
  const [currentAmp, setCurrentAmp] = useState(activeTrip?.currentAmpere?.toString() || '450');
  const [locationKm, setLocationKm] = useState(activeTrip?.locationKm || 'Km 4.2 - Depan Kantor Desa');
  const [cause, setCause] = useState(activeTrip?.cause || 'Dahan pohon tumbang akibat angin kencang');
  const [affectedCust, setAffectedCust] = useState(activeTrip?.affectedCustomers?.toLocaleString('id-ID') || '4.120');
  const [spkNo, setSpkNo] = useState(activeSpk?.spkNo || 'SPK/2026/08/BGL-015');
  const [teamLeader, setTeamLeader] = useState(activeSpk?.teamLeader || 'Regu Yantek Passo');
  const [jobDesc, setJobDesc] = useState(activeSpk?.title || 'Perintangan Dahan Pohon & Penggantian Isolator SUTM');

  // Sync when initial values change
  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (activeTrip) {
      setFeederName(activeTrip.feederName);
      setSubstation(activeTrip.substation);
      setTripDate(activeTrip.tripDate);
      setTripTime(activeTrip.tripTime);
      setRecoveryTime(activeTrip.recoveryTime || '15:30');
      setRelayType(activeTrip.relayType);
      setCurrentAmp(activeTrip.currentAmpere?.toString() || '450');
      setLocationKm(activeTrip.locationKm);
      setCause(activeTrip.cause);
      setAffectedCust(activeTrip.affectedCustomers?.toLocaleString('id-ID') || '4.120');
    }
    if (activeSpk) {
      setSpkNo(activeSpk.spkNo);
      setTeamLeader(activeSpk.teamLeader);
      setJobDesc(activeSpk.title);
      setFeederName(activeSpk.feederName);
    }
    if (initialFeederName && !activeTrip && !activeSpk) {
      setFeederName(initialFeederName);
    }
  }, [initialCategory, activeTrip, activeSpk, initialFeederName]);

  // Generate template text whenever category or parameters change
  useEffect(() => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    if (category === 'Gangguan / Trip') {
      setMessageText(`🔴 *LAPORAN GANGGUAN / TRIP PENYULANG 20kV*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚡ *Penyulang*: ${feederName.toUpperCase()}
🏢 *Gardu Induk / GH*: ${substation}
📅 *Waktu Trip*: ${tripDate}, Pukul ${tripTime} WIT
⚠️ *Relay Bekerja*: ${relayType}
📊 *Arus Gangguan*: ${currentAmp} Ampere
📍 *Lokasi Indikasi*: ${locationKm}
🔍 *Dugaan Penyebab*: ${cause}
👥 *Pelanggan Terdampak*: ${affectedCust} Pelanggan
⏳ *Status*: Regu Yantek sedang meluncur & melakukan manuver sekat.
━━━━━━━━━━━━━━━━━━━━
_Mohon izin koordinasi pengusutan dan utamakan keselamatan kerja (K3)!_
_Dispatch Keandalan PLN ULP Baguala_`);
    } else if (category === 'Penormalan') {
      setMessageText(`🟢 *LAPORAN PENORMALAN SISTEM (NYALA KEMBALI)*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚡ *Penyulang*: ${feederName.toUpperCase()}
🏢 *Gardu Induk / GH*: ${substation}
⏰ *Waktu Nyala*: ${recoveryTime} WIT
⏱️ *Durasi Padam*: Estimasi Selesai Penormalan
✅ *Kondisi*: Seluruh beban dan pelanggan kembali bertegangan normal.
🛠️ *Tindakan Perbaikan*: Pembersihan ROW dahan pohon & pemulihan titik sekat.
━━━━━━━━━━━━━━━━━━━━
_Terima kasih atas respons cepat dan kewaspadaan seluruh tim di lapangan._`);
    } else if (category === 'SPK Lapangan') {
      setMessageText(`📋 *SURAT PERINTAH KERJA (SPK) PEMELIHARAAN*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
📄 *No. SPK*: ${spkNo}
👷‍♂️ *Regu Pelaksana*: ${teamLeader}
⚡ *Penyulang / Lokasi*: ${feederName.toUpperCase()} - ${locationKm}
🔧 *Uraian Pekerjaan*: ${jobDesc}
🛡️ *K3 & APD Wajib*: Helm Safety, Sarung Tangan 20kV, Sepatu Safety 20kV, Grounding Set
🕒 *Waktu Pengerjaan*: ${dateStr} (Pukul 09:00 - 15:00 WIT)
━━━━━━━━━━━━━━━━━━━━
_Safety First - Zero Accident!_`);
    } else if (category === 'Padam Terencana') {
      setMessageText(`📢 *PEMBERITAHUAN PEMADAMAN TERENCANA (PEMELIHARAAN 20kV)*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
Kepada Pelanggan Yth. PLN ULP Baguala, dalam rangka peningkatan keandalan pasokan listrik, akan dilaksanakan pekerjaan preventif:

📅 *Tanggal*: ${dateStr}
⏰ *Estimasi Waktu*: 09:00 - 14:00 WIT
⚡ *Penyulang*: ${feederName.toUpperCase()}
📍 *Wilayah Terdampak*: Sepanjang jalur ${feederName} & sekitarnya
🔧 *Pekerjaan*: Rabat / Pemangkasan Pohon ROW & Penggantian Isolator SUTM

Listrik akan dinormalkan kembali segera setelah pekerjaan selesai dengan aman. Mohon maaf atas ketidaknyamanan ini.
━━━━━━━━━━━━━━━━━━━━
_Humas PLN ULP Baguala_`);
    } else if (category === 'Emergency') {
      setMessageText(`🚨 *LAPORAN EMERGENCY K3 & BAHAYA KELISTRIKAN 20kV*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚠️ *Kondisi Darurat*: Kawat Fasa Putus / Pohon Roboh mengenai SUTM 20kV
📍 *Lokasi*: ${locationKm}
⚡ *Penyulang*: ${feederName.toUpperCase()}
🚨 *BAHAYA*: TEGANGAN TINGGI - MASYARAKAT DILARANG MENDEKAT (Radius min. 10 Meter)
🚒 *Tindakan Cepat*: PMT diamankan, Regu Yantek & K3 meluncur ke TKP.
━━━━━━━━━━━━━━━━━━━━
_Hubungi Call Center PLN 123 / Dispatch Baguala untuk koordinasi darurat._`);
    } else {
      setMessageText(`⚡ *INFORMASI KEANDALAN 20kV PLN ULP BAGUALA*\n\nStatus penyulang ${feederName.toUpperCase()} dalam pemantauan normal.`);
    }
  }, [category, feederName, substation, tripDate, tripTime, recoveryTime, relayType, currentAmp, locationKm, cause, affectedCust, spkNo, teamLeader, jobDesc]);

  // Handle contact change
  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    if (contactId === 'CUSTOM') {
      setRecipientName(customInput || 'Nomor WhatsApp Bebas / Grup');
    } else {
      const contact = INITIAL_WHATSAPP_CONTACTS.find(c => c.id === contactId);
      if (contact) {
        setRecipientName(contact.name);
      }
    }
  };

  // Helper to determine if customInput is a phone number or group name
  const isInputPhoneNumber = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return false;
    const digitsOnly = trimmed.replace(/[^0-9]/g, '');
    // If it starts with + or 08 or 62, or has at least 8 digits and digits make up most of string
    if (trimmed.startsWith('+') || trimmed.startsWith('08') || trimmed.startsWith('62')) {
      return digitsOnly.length >= 8;
    }
    return digitsOnly.length >= 9 && digitsOnly.length / trimmed.length > 0.6;
  };

  const getCleanPhoneNumber = (val: string) => {
    let num = val.trim().replace(/[^0-9]/g, '');
    if (num.startsWith('0')) {
      num = '62' + num.slice(1);
    }
    return num;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenWhatsAppDirect = () => {
    const encoded = encodeURIComponent(messageText);
    let targetPhone = '';
    let targetTitle = recipientName;
    let targetType = 'Grup WhatsApp';

    if (selectedContactId === 'CUSTOM') {
      if (isInputPhoneNumber(customInput)) {
        targetPhone = getCleanPhoneNumber(customInput);
        targetTitle = `+${targetPhone}`;
        targetType = 'Nomor Pribadi';
      } else {
        targetTitle = customInput.trim() || 'Grup WhatsApp Kustom';
        targetType = 'Grup WhatsApp';
      }
    } else {
      const contact = INITIAL_WHATSAPP_CONTACTS.find(c => c.id === selectedContactId);
      if (contact) {
        targetTitle = contact.name;
        targetType = contact.roleType;
      }
    }

    // Determine WhatsApp URL:
    // If targetPhone exists, open direct chat with that number.
    // If it's a group, open WhatsApp share chooser with pre-filled message.
    let url = '';
    if (targetPhone) {
      url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encoded}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encoded}`;
    }

    // Auto copy text for convenience
    try {
      navigator.clipboard.writeText(messageText);
    } catch (e) {
      // ignore
    }

    window.open(url, '_blank');

    // Create log message
    recordSentMessage(targetTitle, targetPhone, targetType);
  };

  const recordSentMessage = (targetTitle: string, targetPhone: string, targetType: string) => {
    const newMsg: WhatsAppMessage = {
      id: `WA-MSG-${Date.now()}`,
      recipientName: targetTitle,
      phoneNumber: targetPhone || targetTitle,
      recipientType: targetType,
      category: category as any,
      senderName: 'Petugas / Team Leader Baguala',
      sentAt: new Date().toLocaleString('id-ID'),
      status: 'Terkirim',
      feederRelated: feederName,
      messageText
    };

    if (onSaveMessage) {
      onSaveMessage(newMsg);
    } else if (onMessageSent) {
      onMessageSent(newMsg);
    }

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-[#0B132B] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-500/10 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-950 dark:text-white">
                  Kirim & Broadcast Chat WhatsApp
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  PLN DISPATCH WA
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Format Pesan Cepat Gangguan Feeder, SPK Yantek, & Informasi Pelanggan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 custom-scrollbar">
          
          {/* Left Column: Form & Template Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Category Selector Tabs */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Pilih Jenis Pesan / Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Gangguan / Trip', label: 'Laporan Trip', icon: Zap, color: 'text-rose-500' },
                  { id: 'Penormalan', label: 'Info Nyala', icon: CheckCircle2, color: 'text-emerald-500' },
                  { id: 'SPK Lapangan', label: 'SPK Yantek', icon: FileText, color: 'text-blue-500' },
                  { id: 'Padam Terencana', label: 'Padam Rencana', icon: Clock, color: 'text-amber-500' },
                  { id: 'Emergency', label: 'Darurat K3', icon: AlertTriangle, color: 'text-red-500' },
                  { id: 'Lainnya', label: 'Pesan Bebas', icon: Sparkles, color: 'text-purple-500' }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = category === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategory(tab.id as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? isDarkMode 
                            ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300 shadow-xs' 
                            : 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                          : isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${tab.color}`} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Recipient Contact */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Tujuan Pengiriman:
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Sinkron WhatsApp App & Web
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INITIAL_WHATSAPP_CONTACTS.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleContactSelect(contact.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      selectedContactId === contact.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                        : isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700' : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${contact.avatarColor} text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black truncate">{contact.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{contact.description}</div>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleContactSelect('CUSTOM')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all sm:col-span-2 ${
                    selectedContactId === 'CUSTOM'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                      : isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700' : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black">Nomor WhatsApp Bebas / Nama Grup Kustom</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Kirim langsung ke nomor HP atau ketik nama grup tujuan bebas
                    </div>
                  </div>
                </button>
              </div>

              {selectedContactId === 'CUSTOM' && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Ketik Nomor HP atau Nama Grup:
                    </span>
                    {customInput.trim() && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        isInputPhoneNumber(customInput)
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isInputPhoneNumber(customInput)
                          ? `📱 No. HP: +${getCleanPhoneNumber(customInput)}`
                          : `👥 Grup: "${customInput.trim()}"`
                        }
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: 081298765432 ATAU Grup K3 & Yantek Passo"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      setRecipientName(e.target.value.trim() || 'Nomor WhatsApp Bebas / Grup');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    💡 <strong>Otomatis</strong>: Jika memasukkan nomor HP, WhatsApp akan membuka percakapan langsung ke nomor tersebut. Jika memasukkan nama grup, WhatsApp akan membuka pemilih chat/grup untuk mengirim pesan ke grup tersebut.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Param Adjusters based on Category */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Penyulang:
                </label>
                <input 
                  type="text"
                  value={feederName}
                  onChange={(e) => setFeederName(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Lokasi / Titik:
                </label>
                <input 
                  type="text"
                  value={locationKm}
                  onChange={(e) => setLocationKm(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Message Textarea for direct editing */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Isi Pesan WhatsApp (Dapat Diedit):
                </label>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Format'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className={`w-full p-3.5 rounded-xl text-xs font-mono leading-relaxed border resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

          </div>

          {/* Right Column: Live WhatsApp Mobile Simulator Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full max-w-[340px] rounded-[32px] border-4 border-slate-800 dark:border-slate-700 shadow-2xl bg-[#EFEAE2] dark:bg-[#0B141B] overflow-hidden flex flex-col">
              
              {/* WhatsApp Smartphone Top Bar */}
              <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    PLN
                  </div>
                  <div>
                    <div className="text-xs font-extrabold truncate max-w-[170px]">
                      {recipientName}
                    </div>
                    <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <span>online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-3.5 flex-1 min-h-[300px] max-h-[340px] overflow-y-auto space-y-3 custom-scrollbar bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                
                {/* Notice timestamp */}
                <div className="text-center">
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-300/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase shadow-2xs">
                    HARI INI
                  </span>
                </div>

                {/* Sent Message Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[95%] p-3 rounded-2xl rounded-tr-xs bg-[#D9FDD3] dark:bg-[#005C4B] text-slate-900 dark:text-slate-100 text-[11px] shadow-sm relative leading-relaxed font-sans">
                    <pre className="whitespace-pre-wrap font-sans text-[11.5px] leading-snug break-words">
                      {messageText}
                    </pre>
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[9.5px] text-slate-500 dark:text-slate-300">
                      <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-blue-500 dark:text-blue-300 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Fake WhatsApp input bar */}
              <div className="bg-[#F0F2F5] dark:bg-[#1F2C34] p-2 flex items-center gap-2 border-t border-slate-300 dark:border-slate-800">
                <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  Ketik pesan...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00A884] text-white flex items-center justify-center">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

            {/* Mobile preview tip */}
            <p className="text-[11px] text-slate-700 dark:text-slate-300 text-center mt-2.5 font-bold">
              ⚡ Tampilan pratinjau pesan di layar penerima WhatsApp
            </p>

          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {sentSuccess && (
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Pesan berhasil dicatat ke histori dispatch!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyText}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-200' 
                  : 'border-slate-300 hover:bg-slate-100 text-slate-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Format Tersalin' : 'Salin Teks'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsAppDirect}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka & Kirim di WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
