import React, { useState } from 'react';
import { WhatsAppContact, WhatsAppMessage, FeederTrip, SpkTask } from '../../types';
import { INITIAL_WHATSAPP_CONTACTS } from '../../data/mockData';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  Users, 
  Zap, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  Plus,
  RefreshCw,
  Share2,
  Trash2,
  Paperclip,
  Smile,
  ShieldCheck,
  Radio,
  UserCheck
} from 'lucide-react';

interface WhatsAppDispatchViewProps {
  isDarkMode: boolean;
  messages: WhatsAppMessage[];
  onSendMessage: (msg: WhatsAppMessage) => void;
  onDeleteMessage?: (id: string) => void;
  trips: FeederTrip[];
  spkList: SpkTask[];
  onOpenQuickModal: (category?: string, trip?: FeederTrip) => void;
}

export const WhatsAppDispatchView: React.FC<WhatsAppDispatchViewProps> = ({
  isDarkMode,
  messages,
  onSendMessage,
  onDeleteMessage,
  trips,
  spkList,
  onOpenQuickModal
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'broadcast' | 'history'>('chat');
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact>(INITIAL_WHATSAPP_CONTACTS[0]);
  const [chatInputText, setChatInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Broadcast generator state
  const [broadcastCategory, setBroadcastCategory] = useState<'Gangguan / Trip' | 'Penormalan' | 'SPK Lapangan' | 'Padam Terencana' | 'Emergency' | 'Lainnya'>('Gangguan / Trip');
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [selectedSpkId, setSelectedSpkId] = useState<string>(spkList[0]?.id || '');
  const [broadcastTargetMode, setBroadcastTargetMode] = useState<string>('WAC-01');
  const [customBroadcastInput, setCustomBroadcastInput] = useState('');
  const [customMessageDraft, setCustomMessageDraft] = useState('');

  // Selected trip or spk for template
  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];
  const currentSpk = spkList.find(s => s.id === selectedSpkId) || spkList[0];

  // Helper to determine if input is phone number or group name
  const isPhoneNumber = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return false;
    const digitsOnly = trimmed.replace(/[^0-9]/g, '');
    if (trimmed.startsWith('+') || trimmed.startsWith('08') || trimmed.startsWith('62')) {
      return digitsOnly.length >= 8;
    }
    return digitsOnly.length >= 9 && digitsOnly.length / trimmed.length > 0.6;
  };

  const cleanPhoneNumber = (val: string) => {
    let num = val.trim().replace(/[^0-9]/g, '');
    if (num.startsWith('0')) {
      num = '62' + num.slice(1);
    }
    return num;
  };

  // Build template on selection
  const generateBroadcastText = (cat: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (cat === 'Gangguan / Trip' && currentTrip) {
      return `🔴 *LAPORAN GANGGUAN / TRIP PENYULANG 20kV*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚡ *Penyulang*: ${currentTrip.feederName}
🏢 *Gardu Induk*: ${currentTrip.substation}
📅 *Waktu Trip*: ${currentTrip.tripDate}, Pukul ${currentTrip.tripTime} WIT
⚠️ *Relay*: ${currentTrip.relayType}
📊 *Arus Gangguan*: ${currentTrip.currentAmpere} A
📍 *Lokasi*: ${currentTrip.locationKm}
🔍 *Penyebab*: ${currentTrip.cause}
👥 *Pelanggan Terdampak*: ${currentTrip.affectedCustomers?.toLocaleString('id-ID')} Pelanggan
⏳ *Status*: Koordinator Yantek sedang penelusuran lapangan.
━━━━━━━━━━━━━━━━━━━━
_Safety First - Utamakan Keselamatan K3!_`;
    } else if (cat === 'Penormalan' && currentTrip) {
      return `🟢 *LAPORAN PENORMALAN SISTEM (NYALA KEMBALI)*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚡ *Penyulang*: ${currentTrip.feederName}
🏢 *Gardu Induk*: ${currentTrip.substation}
⏰ *Waktu Nyala*: ${currentTrip.recoveryTime || timeStr} WIT
⏱️ *Durasi Padam*: ${currentTrip.durationMinutes} Menit
✅ *Kondisi*: Seluruh beban dan pelanggan kembali normal.
🛠️ *Penanganan*: Selesai pemulihan & penormalan tegangan.
━━━━━━━━━━━━━━━━━━━━
_Terima kasih atas kerja sama seluruh tim._`;
    } else if (cat === 'SPK Lapangan' && currentSpk) {
      return `📋 *SURAT PERINTAH KERJA (SPK) PEMELIHARAAN*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
📄 *No. SPK*: ${currentSpk.spkNo}
👷‍♂️ *Regu*: ${currentSpk.teamLeader}
⚡ *Penyulang*: ${currentSpk.feederName}
🔧 *Uraian*: ${currentSpk.title}
🛡️ *K3*: Wajib Helm, Sarung Tangan 20kV, Sepatu Safety
🕒 *Jadwal*: ${currentSpk.date} (${currentSpk.timeWindow || '09:00 - 15:00 WIT'})
━━━━━━━━━━━━━━━━━━━━
_Zero Accident - Bekerja Sesuai SOP K3!_`;
    } else if (cat === 'Padam Terencana') {
      return `📢 *PEMBERITAHUAN PEMADAMAN TERENCANA (PEMELIHARAAN 20kV)*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
Kepada Pelanggan Yth, dalam rangka pemeliharaan keandalan jaringan:
📅 *Tanggal*: ${dateStr}
⏰ *Waktu*: 09:00 - 14:00 WIT
⚡ *Penyulang*: ${currentTrip?.feederName || 'LATERI 2'}
📍 *Wilayah*: Sepanjang jalur distribusi terkait
🔧 *Pekerjaan*: Rabat Pohon ROW & Penggantian Isolator Kritis
━━━━━━━━━━━━━━━━━━━━
_Mohon maaf atas ketidaknyamanan._`;
    } else if (cat === 'Emergency') {
      return `🚨 *LAPORAN EMERGENCY K3 KELISTRIKAN 20kV*
*PLN ULP BAGUALA*
━━━━━━━━━━━━━━━━━━━━
⚠️ *Kondisi*: Kawat Fasa Putus / Pohon Roboh mengenai SUTM 20kV
📍 *Lokasi*: ${currentTrip?.locationKm || 'Jalur SUTM Baguala'}
⚡ *Penyulang*: ${currentTrip?.feederName || 'LATERI 2'}
🚨 *BAHAYA*: TEGANGAN TINGGI - RADIUS MINIMAL 10 METER
🚒 *Tindakan*: Regu Yantek & K3 meluncur ke TKP.
━━━━━━━━━━━━━━━━━━━━`;
    }
    return `⚡ *INFORMASI OPERASIONAL 20kV PLN ULP BAGUALA*\n\nStatus penyulang dalam kondisi terpantau normal.`;
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `WA-MSG-${Date.now()}`,
      recipientName: selectedContact.name,
      phoneNumber: selectedContact.name,
      recipientType: selectedContact.roleType,
      category: 'Lainnya',
      messageText: chatInputText,
      senderName: 'Petugas Dispatcher ULP Baguala',
      sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIT',
      status: 'Dibaca'
    };

    onSendMessage(newMsg);
    setChatInputText('');
  };

  const handleSendBroadcast = () => {
    const textToSend = customMessageDraft || generateBroadcastText(broadcastCategory);
    let targetTitle = '';
    let targetPhone = '';
    let targetType = 'Grup WhatsApp';

    if (broadcastTargetMode === 'CUSTOM') {
      if (isPhoneNumber(customBroadcastInput)) {
        targetPhone = cleanPhoneNumber(customBroadcastInput);
        targetTitle = `+${targetPhone}`;
        targetType = 'Nomor Pribadi';
      } else {
        targetTitle = customBroadcastInput.trim() || 'Grup WhatsApp Kustom';
        targetType = 'Grup WhatsApp';
      }
    } else {
      const contact = INITIAL_WHATSAPP_CONTACTS.find(c => c.id === broadcastTargetMode) || INITIAL_WHATSAPP_CONTACTS[0];
      targetTitle = contact.name;
      targetType = contact.roleType;
    }

    const newMsg: WhatsAppMessage = {
      id: `WA-MSG-${Date.now()}`,
      recipientName: targetTitle,
      phoneNumber: targetPhone || targetTitle,
      recipientType: targetType,
      category: broadcastCategory,
      messageText: textToSend,
      senderName: 'Dispatcher PLN ULP Baguala',
      sentAt: new Date().toLocaleString('id-ID'),
      status: 'Terkirim',
      feederRelated: currentTrip?.feederName
    };

    onSendMessage(newMsg);

    // Auto copy text
    try {
      navigator.clipboard.writeText(textToSend);
    } catch (e) {
      // ignore
    }

    // Open WhatsApp Web / App
    const encoded = encodeURIComponent(textToSend);
    let url = '';
    if (targetPhone) {
      url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encoded}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encoded}`;
    }
    window.open(url, '_blank');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredHistory = messages.filter(m => {
    const matchesSearch = 
      m.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.messageText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.feederRelated && m.feederRelated.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Pusat Dispatch & Broadcast Chat WhatsApp 20kV
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                ● WA ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Integrasi Pesan Cepat Gangguan SUTM, SPK Regu Yantek, & Notifikasi Pemeliharaan PLN ULP Baguala
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all border ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all border ${
              activeTab === 'broadcast'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Broadcast Template</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all border ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Log Histori ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
          <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
            Total Broadcast WA
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
            {messages.length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Pesan</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
          <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
            Grup Dispatch Terdaftar
          </div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400">
            {INITIAL_WHATSAPP_CONTACTS.length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Grup / Regu</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
          <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
            Laporan Trip Terkirim
          </div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400">
            {messages.filter(m => m.category === 'Gangguan / Trip').length} <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Trip</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-300 shadow-xs'}`}>
          <div className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
            Status Server WhatsApp
          </div>
          <div className="text-xl font-black text-teal-700 dark:text-teal-400 flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span>Ready API</span>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE CHAT SIMULATOR */}
      {activeTab === 'chat' && (
        <div className={`rounded-2xl border overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px] ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          {/* Chat Contacts List (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-950/40">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2">
                Daftar Ruang Chat & Regu:
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari grup / petugas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/60 custom-scrollbar">
              {INITIAL_WHATSAPP_CONTACTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(contact => {
                const isSelected = selectedContact.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-3 flex items-start gap-3 text-left transition-all ${
                      isSelected
                        ? isDarkMode ? 'bg-slate-800/90 border-l-4 border-emerald-500' : 'bg-emerald-50/80 border-l-4 border-emerald-600'
                        : isDarkMode ? 'hover:bg-slate-850 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${contact.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-black text-slate-950 dark:text-white truncate">
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">12:30</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {contact.description}
                      </p>
                      <span className="inline-block mt-1 text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        {contact.roleType}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-[#EFEAE2] dark:bg-[#0B141B]">
            
            {/* WhatsApp Chat Header */}
            <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${selectedContact.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">{selectedContact.name}</div>
                  <div className="text-[11px] text-emerald-200 font-medium">
                    +{selectedContact.phoneNumber} • Dispatcher Active
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenQuickModal('Gangguan / Trip')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>+ Template Cepat</span>
                </button>
              </div>
            </div>

            {/* Message Feed Canvas */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:18px_18px] max-h-[460px]">
              
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-slate-300/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase shadow-2xs">
                  SISTEM DISPATCH WHATSAPP TERENKRIPSI
                </span>
              </div>

              {/* Messages from this contact or general */}
              {messages.map(msg => (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-xs bg-[#D9FDD3] dark:bg-[#005C4B] text-slate-950 dark:text-slate-100 text-xs shadow-sm relative leading-relaxed font-sans border border-emerald-500/20">
                    <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center justify-between gap-2">
                      <span>{msg.senderName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-600/20 text-[9px] uppercase font-black">
                        {msg.category}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-snug break-words">
                      {msg.messageText}
                    </pre>
                    <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-slate-600 dark:text-slate-300">
                      <span>{msg.sentAt}</span>
                      <span className="text-blue-500 dark:text-blue-300 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">Belum ada riwayat pesan di ruang chat ini.</p>
                  <p className="text-[11px]">Ketik pesan di bawah atau gunakan tombol Template Cepat.</p>
                </div>
              )}

            </div>

            {/* Quick Template Chips Bar */}
            <div className="bg-slate-100 dark:bg-slate-900/90 px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase">Template:</span>
              <button 
                onClick={() => setChatInputText(generateBroadcastText('Gangguan / Trip'))}
                className="px-2.5 py-1 rounded-md text-[11px] font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30"
              >
                ⚡ Laporan Trip
              </button>
              <button 
                onClick={() => setChatInputText(generateBroadcastText('Penormalan'))}
                className="px-2.5 py-1 rounded-md text-[11px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
              >
                ✅ Info Nyala
              </button>
              <button 
                onClick={() => setChatInputText(generateBroadcastText('SPK Lapangan'))}
                className="px-2.5 py-1 rounded-md text-[11px] font-black bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 border border-blue-500/30"
              >
                📋 SPK Yantek
              </button>
              <button 
                onClick={() => setChatInputText(generateBroadcastText('Emergency'))}
                className="px-2.5 py-1 rounded-md text-[11px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30"
              >
                🚨 Bahaya K3
              </button>
            </div>

            {/* Bottom Chat Message Input Box */}
            <div className="bg-[#F0F2F5] dark:bg-[#1F2C34] p-3 flex items-center gap-2 border-t border-slate-300 dark:border-slate-800">
              <textarea
                rows={2}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder={`Ketik pesan untuk ${selectedContact.name}... (Gunakan *teks* untuk bold)`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                className={`flex-1 rounded-2xl px-3.5 py-2 text-xs border resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-[#2A3942] border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />

              <button
                onClick={handleSendChatMessage}
                disabled={!chatInputText.trim()}
                className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008f70] disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BROADCAST TEMPLATE GENERATOR */}
      {activeTab === 'broadcast' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Generator Broadcast WhatsApp Otomatis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Pilih format laporan, sesuaikan data kejadian, dan kirim langsung ke WhatsApp Web / Aplikasi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const txt = generateBroadcastText(broadcastCategory);
                  navigator.clipboard.writeText(txt);
                  alert('Format broadcast WhatsApp telah disalin ke clipboard!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Saja</span>
              </button>

              <button
                onClick={handleSendBroadcast}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kirim via WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Configuration Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  1. Pilih Jenis Informasi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Gangguan / Trip', label: 'Trip Feeder', icon: Zap },
                    { id: 'Penormalan', label: 'Info Nyala', icon: CheckCircle2 },
                    { id: 'SPK Lapangan', label: 'SPK Yantek', icon: FileText },
                    { id: 'Padam Terencana', label: 'Padam Rencana', icon: Clock },
                    { id: 'Emergency', label: 'Bahaya K3', icon: AlertTriangle }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setBroadcastCategory(tab.id as any);
                        setCustomMessageDraft(generateBroadcastText(tab.id));
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        broadcastCategory === tab.id
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300'
                          : isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Linker */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Hubungkan ke Data Log Gangguan:
                </label>
                <select
                  value={selectedTripId}
                  onChange={(e) => {
                    setSelectedTripId(e.target.value);
                    setTimeout(() => setCustomMessageDraft(generateBroadcastText(broadcastCategory)), 50);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.feederName} - {t.tripDate} ({t.cause.slice(0, 40)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Target */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    3. Nomor WhatsApp / Grup Tujuan:
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Sinkron WhatsApp App
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INITIAL_WHATSAPP_CONTACTS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setBroadcastTargetMode(c.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                        broadcastTargetMode === c.id
                          ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                          : isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${c.avatarColor} text-white flex items-center justify-center text-xs font-black shrink-0`}>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{c.roleType}</div>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setBroadcastTargetMode('CUSTOM')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all sm:col-span-2 ${
                      broadcastTargetMode === 'CUSTOM'
                        ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                        : isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center text-xs font-black shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black">Nomor WhatsApp Bebas / Nama Grup Kustom</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Kirim ke nomor HP pribadi atau ketik nama grup tujuan bebas
                      </div>
                    </div>
                  </button>
                </div>

                {broadcastTargetMode === 'CUSTOM' && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">
                        Ketik Nomor HP atau Nama Grup:
                      </span>
                      {customBroadcastInput.trim() && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isPhoneNumber(customBroadcastInput)
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isPhoneNumber(customBroadcastInput)
                            ? `📱 No. HP: +${cleanPhoneNumber(customBroadcastInput)}`
                            : `👥 Grup: "${customBroadcastInput.trim()}"`
                          }
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Contoh: 081298765432 ATAU Grup K3 & Yantek Passo"
                      value={customBroadcastInput}
                      onChange={(e) => setCustomBroadcastInput(e.target.value)}
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

            </div>

            {/* Live Generated Preview (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pratinjau Pesan yang Akan Dikirim:
              </label>
              
              <div className="p-4 rounded-2xl bg-[#EFEAE2] dark:bg-[#0B141B] border border-slate-300 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-[#D9FDD3] dark:bg-[#005C4B] text-slate-950 dark:text-slate-100 text-xs shadow-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {customMessageDraft || generateBroadcastText(broadcastCategory)}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={handleSendBroadcast}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Kirim Broadcast Sekarang (WhatsApp)</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: DISPATCH HISTORY LOG */}
      {activeTab === 'history' && (
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari histori pesan, penyulang, tujuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Gangguan / Trip">Gangguan / Trip</option>
                <option value="Penormalan">Penormalan</option>
                <option value="SPK Lapangan">SPK Lapangan</option>
                <option value="Padam Terencana">Padam Terencana</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* History List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <tr>
                  <th className="py-3 px-3 font-extrabold uppercase">Waktu Kirim</th>
                  <th className="py-3 px-3 font-extrabold uppercase">Tujuan / Grup</th>
                  <th className="py-3 px-3 font-extrabold uppercase">Kategori</th>
                  <th className="py-3 px-3 font-extrabold uppercase">Penyulang</th>
                  <th className="py-3 px-3 font-extrabold uppercase">Ringkasan Pesan</th>
                  <th className="py-3 px-3 font-extrabold uppercase text-center">Status</th>
                  <th className="py-3 px-3 font-extrabold uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                {filteredHistory.map(item => (
                  <tr key={item.id} className={`${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="py-3 px-3 font-mono font-bold whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {item.sentAt}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      <div>{item.recipientName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">+{item.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        item.category === 'Gangguan / Trip' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30' :
                        item.category === 'Penormalan' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
                        item.category === 'SPK Lapangan' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30' :
                        'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">
                      {item.feederRelated || '-'}
                    </td>
                    <td className="py-3 px-3 max-w-[280px] truncate text-slate-600 dark:text-slate-300">
                      {item.messageText.replace(/\n/g, ' ')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        ✓✓ {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyMessage(item.id, item.messageText)}
                          title="Salin Teks"
                          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            const encoded = encodeURIComponent(item.messageText);
                            window.open(`https://api.whatsapp.com/send?phone=${item.phoneNumber}&text=${encoded}`, '_blank');
                          }}
                          title="Buka di WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
