import React, { useState, useMemo } from 'react';
import { CustomSelect } from '../CustomSelect';
import { FeederTrip, MasterFeeder } from '../../types';
import { 
  Zap, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign,
  MessageSquare,
  MapPin,
  Cpu,
  Activity,
  Edit2,
  Trash2,
  ArrowUpDown,
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react';

interface TripLogsViewProps {
  isDarkMode: boolean;
  trips: FeederTrip[];
  onOpenInputGangguan: () => void;
  onOpenWhatsAppModal?: (trip?: FeederTrip) => void;
  onOpenGoogleSheetSync?: () => void;
  onEditTrip?: (trip: FeederTrip) => void;
  onDeleteTrip?: (tripId: string) => void;
  masterFeeders?: MasterFeeder[];
}

export const TripLogsView: React.FC<TripLogsViewProps> = ({
  isDarkMode,
  trips,
  onOpenInputGangguan,
  onOpenWhatsAppModal,
  onOpenGoogleSheetSync,
  onEditTrip,
  onDeleteTrip,
  masterFeeders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeder, setSelectedFeeder] = useState('ALL');
  const [selectedRelay, setSelectedRelay] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortBy, setSortBy] = useState<'ALL' | 'duration-desc' | 'saidi-desc' | 'saifi-desc' | 'ens-desc'>('ALL');
  const [tripToDelete, setTripToDelete] = useState<FeederTrip | null>(null);

  // Month options (Indonesian)
  const monthOptions = [
    { value: 'ALL', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  // Year options up to 2030
  const yearOptions = useMemo(() => {
    const years = new Set<string>(['2030', '2029', '2028', '2027', '2026', '2025', '2024']);
    trips.forEach(t => {
      if (t.tripDate) {
        const y = t.tripDate.split('-')[0];
        if (y && y.length === 4) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [trips]);

  // Feeder options for filter sorted alphabetically A-Z
  const feederOptions = useMemo(() => {
    const names = masterFeeders.length > 0 
      ? masterFeeders.map(f => f.feederName)
      : Array.from(new Set(trips.map(t => t.feederName)));
    return [...names].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
  }, [masterFeeders, trips]);

  // Filtered trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.feederName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.locationKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.category && trip.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.coordinates && trip.coordinates.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFeeder = selectedFeeder === 'ALL' || trip.feederName === selectedFeeder;
    const matchesRelay = selectedRelay === 'ALL' || trip.relayType.includes(selectedRelay);

    // Month & Year filter
    const tripYear = trip.tripDate ? trip.tripDate.split('-')[0] : '';
    const tripMonth = trip.tripDate ? trip.tripDate.split('-')[1] : '';

    const matchesYear = selectedYear === 'ALL' || tripYear === selectedYear;
    const matchesMonth = selectedMonth === 'ALL' || tripMonth === selectedMonth;

    return matchesSearch && matchesFeeder && matchesRelay && matchesYear && matchesMonth;
  });

  // Master total customers for SAIDI/SAIFI calculation fallback
  const masterTotalCust = (masterFeeders || []).reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
  const defaultTotalUlp = masterTotalCust > 0 ? masterTotalCust : 45200;

  // Sorted trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'duration-desc') {
      return (b.durationMinutes || 0) - (a.durationMinutes || 0);
    }
    if (sortBy === 'saidi-desc') {
      const totalUlpA = a.totalUlpCustomers || defaultTotalUlp;
      const totalUlpB = b.totalUlpCustomers || defaultTotalUlp;
      const saidiA = a.saidiHours ?? ((( (a.durationMinutes || 0) / 60 ) * (a.affectedCustomers || 0)) / totalUlpA);
      const saidiB = b.saidiHours ?? ((( (b.durationMinutes || 0) / 60 ) * (b.affectedCustomers || 0)) / totalUlpB);
      return saidiB - saidiA;
    }
    if (sortBy === 'saifi-desc') {
      const totalUlpA = a.totalUlpCustomers || defaultTotalUlp;
      const totalUlpB = b.totalUlpCustomers || defaultTotalUlp;
      const saifiA = a.saifiCount ?? ((a.affectedCustomers || 0) / totalUlpA);
      const saifiB = b.saifiCount ?? ((b.affectedCustomers || 0) / totalUlpB);
      return saifiB - saifiA;
    }
    if (sortBy === 'ens-desc') {
      return (b.ensKwh || 0) - (a.ensKwh || 0);
    }
    return 0;
  });

  const isFilterActive = selectedFeeder !== 'ALL' || selectedMonth !== 'ALL' || selectedYear !== 'ALL' || searchTerm !== '' || selectedRelay !== 'ALL' || sortBy !== 'ALL';

  const handleResetFilter = () => {
    setSelectedFeeder('ALL');
    setSelectedMonth('ALL');
    setSelectedYear('ALL');
    setSelectedRelay('ALL');
    setSearchTerm('');
    setSortBy('ALL');
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Aggregates for filtered view
  const totalEns = sortedTrips.reduce((acc, t) => acc + (t.ensKwh || 0), 0);
  const totalLoss = sortedTrips.reduce((acc, t) => acc + (t.financialLossIdr || 0), 0);
  const totalSaidiHours = sortedTrips.reduce((acc, t) => {
    const saidi = t.saidiHours ?? ((( (t.durationMinutes || 0) / 60 ) * (t.affectedCustomers || 0)) / (t.totalUlpCustomers || defaultTotalUlp));
    return acc + (saidi || 0);
  }, 0);
  const totalSaifiCount = sortedTrips.reduce((acc, t) => {
    const saifi = t.saifiCount ?? ((t.affectedCustomers || 0) / (t.totalUlpCustomers || defaultTotalUlp));
    return acc + (saifi || 0);
  }, 0);

  return (
    <div className={`space-y-4 font-sans text-slate-100 min-h-screen p-1 sm:p-2 select-none ${
      isDarkMode ? 'bg-[#070e1e]' : 'bg-[#070e1e]'
    }`}>
      {/* Top Header Controls */}
      <div className="p-4 rounded-2xl bg-[#0c162d] border border-slate-800/90 shadow-md space-y-3.5 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">
                Log & Analisis Gangguan Feeder 20kV
              </h2>
              <p className="text-xs text-slate-400">
                Monitoring Gangguan & Indek Kehandalan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Google Sheet Sync Button */}
            {onOpenGoogleSheetSync && (
              <button
                onClick={onOpenGoogleSheetSync}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                title="Sinkronisasi & Form Input Gangguan ke Google Sheet"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheet Sync</span>
              </button>
            )}

            {/* Broadcast WA Button */}
            {onOpenWhatsAppModal && (
              <button
                onClick={() => onOpenWhatsAppModal()}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                title="Kirim Laporan Gangguan ke WhatsApp Group / Dispatcher"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Broadcast WA</span>
              </button>
            )}

            {/* Add Trip Button */}
            <button
              onClick={onOpenInputGangguan}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Trip Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search Box */}
            <div className="relative min-w-[180px] flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari lokasi, koordinat, kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#070e1e] border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            {/* Feeder Filter */}
            <CustomSelect
              value={selectedFeeder}
              onChange={(val) => setSelectedFeeder(val)}
              options={[{ value: 'ALL', label: '⚡ Semua Feeder' }, ...feederOptions.map(f => ({ value: f, label: f }))]}
              activeColor="emerald"
              showSearch
              searchPlaceholder="Cari Feeder..."
            />

            {/* Filter Bulan */}
            <CustomSelect
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              options={monthOptions.map(m => ({ value: m.value, label: m.label }))}
              activeColor="rose"
            />

            {/* Filter Tahun */}
            <CustomSelect
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              options={[{ value: 'ALL', label: 'Semua Tahun' }, ...yearOptions.map(yr => ({ value: yr, label: yr }))]}
              activeColor="amber"
            />

            {/* Reset Filter Button */}
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-700 active:scale-95"
                title="Reset Semua Filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sortir:
            </span>
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={[
                { value: 'ALL', label: 'Semua' },
                { value: 'duration-desc', label: '⏳ Durasi Terpanjang' },
                { value: 'saidi-desc', label: '📊 SAIDI Tertinggi' },
                { value: 'saifi-desc', label: '⚡ SAIFI Tertinggi' },
                { value: 'ens-desc', label: '🔋 ENS Tertinggi' }
              ]}
              activeColor="indigo"
            />
          </div>
        </div>

        {/* Quick Filter Summary Pill / Mini Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-bold">
          <div className="flex items-center gap-2 text-slate-400">
            <span>
              Menampilkan <strong className="text-white font-black">{sortedTrips.length}</strong> data gangguan
            </span>
            {selectedMonth !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px]">
                Bulan {monthOptions.find(m => m.value === selectedMonth)?.label}
              </span>
            )}
            {selectedYear !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
                Tahun {selectedYear}
              </span>
            )}
            {selectedFeeder !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px]">
                Feeder {selectedFeeder}
              </span>
            )}
          </div>

          {sortedTrips.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>Total ENS: <strong className="text-amber-400">{totalEns.toLocaleString('id-ID')} kWh</strong></span>
              <span>Total SAIDI: <strong className="text-blue-400">{totalSaidiHours.toFixed(3)} Jam/Plg</strong></span>
              <span>Total SAIFI: <strong className="text-cyan-400">{totalSaifiCount.toFixed(3)} Kali/Plg</strong></span>
              <span>Total Kerugian: <strong className="text-rose-400">{formatRupiah(totalLoss)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Trip Log Table */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#0c162d] shadow-md overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-[#091122] border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">NO</th>
                <th className="p-3.5 text-center">ID & Feeder</th>
                <th className="p-3.5 text-center">Jam Trip & Masuk</th>
                <th className="p-3.5 text-center">Arus Beban & Gangguan</th>
                <th className="p-3.5 text-center">Estimasi Jarak AI</th>
                <th className="p-3.5 text-center">SAIDI / SAIFI</th>
                <th className="p-3.5 text-center">Lokasi & Koordinat</th>
                <th className="p-3.5 text-center">Pelanggan & ENS</th>
                <th className="p-3.5 text-center">Kerugian & Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {sortedTrips.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Tidak ada data trip gangguan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                sortedTrips.map((trip, index) => {
                  const durationHours = trip.durationMinutes / 60;
                  const masterTotalCust = (masterFeeders || []).reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
                  const totalUlp = trip.totalUlpCustomers || (masterTotalCust > 0 ? masterTotalCust : 45200);
                  const saidiHours = trip.saidiHours ?? Number(((durationHours * trip.affectedCustomers) / totalUlp).toFixed(4));
                  const saidiMins = trip.saidiMinutes ?? Number((saidiHours * 60).toFixed(2));
                  const saifiVal = trip.saifiCount ?? Number((trip.affectedCustomers / totalUlp).toFixed(4));
                  const kw = trip.kwPadam || Math.round(Math.sqrt(3) * 20 * trip.currentAmpere * 0.95);

                  return (
                    <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                      
                      {/* Nomor Urut */}
                      <td className="p-3.5 text-center font-extrabold text-slate-400">
                        <span className="w-7 h-7 rounded-lg inline-flex items-center justify-center bg-slate-800 text-slate-300 border border-slate-700/70 text-xs shadow-2xs font-mono font-black">
                          {index + 1}
                        </span>
                      </td>

                      {/* Feeder */}
                      <td className="p-3.5 text-center font-bold">
                        <div className="text-white font-extrabold flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                          {trip.feederName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{trip.id}</div>
                      </td>

                      {/* Waktu & Durasi */}
                      <td className="p-3.5 text-center">
                        <div className="text-slate-200 font-bold flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-rose-400" />
                          <span>{trip.tripTime || '-'}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400">{trip.recoveryTime || '-'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {trip.tripDate} • <span className="font-extrabold text-amber-400">
                            {trip.durationMinutes} Mnt ({Math.floor(trip.durationMinutes / 60)}j {trip.durationMinutes % 60}m)
                          </span>
                        </div>
                      </td>

                      {/* Relay & Arus Gangguan */}
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block">
                          {trip.relayType}
                        </span>
                        <div className="text-[10px] text-slate-300 font-semibold mt-1">
                          Beban: <strong className="text-white">{trip.currentAmpere} A</strong> ({kw.toLocaleString('id-ID')} kW)
                        </div>
                        {(trip.iNol || trip.iL1 || trip.iL2 || trip.iL3) ? (
                          <div className="text-[9px] font-mono text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded mt-1 border border-purple-500/30 inline-block">
                            I0:{trip.iNol || 0}A | R:{trip.iL1 || 0}A S:{trip.iL2 || 0}A T:{trip.iL3 || 0}A
                          </div>
                        ) : null}
                      </td>

                      {/* Estimasi Jarak AI */}
                      <td className="p-3.5 text-center">
                        {trip.estimatedDistanceKm ? (
                          <div className={`p-1.5 rounded-lg border inline-block max-w-[170px] ${
                            trip.supplySourceType === 'PERCABANGAN'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : trip.supplySourceType === 'GH'
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                          }`}>
                            <div className="font-extrabold text-xs flex items-center justify-center gap-1">
                              <Cpu className={`w-3 h-3 ${
                                trip.supplySourceType === 'PERCABANGAN' 
                                ? 'text-emerald-400' 
                                : trip.supplySourceType === 'GH' 
                                  ? 'text-amber-400' 
                                  : 'text-purple-400'
                              }`} />
                              <span>{trip.estimatedDistanceKm} km</span>
                            </div>
                            <div className="text-[9px] font-semibold text-slate-400 mt-0.5 truncate" title={trip.supplySourceName || (trip.tripScope === 'PERCABANGAN' ? 'Gardu Hubung' : 'Substation GI')}>
                              dari {trip.supplySourceName || (trip.tripScope === 'PERCABANGAN' ? 'Gardu Hubung' : 'Substation GI')}
                            </div>
                            {trip.cumulativeDistanceKm && trip.supplySourceType === 'PERCABANGAN' && (
                              <div className="text-[8.5px] font-bold text-amber-400">
                                ~{trip.cumulativeDistanceKm} km dr Pangkal
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-normal">-</span>
                        )}
                      </td>

                      {/* SAIDI / SAIFI Contribution */}
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 inline-block">
                            SAIDI: {saidiHours} j ({saidiMins} m)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 inline-block">
                            SAIFI: {saifiVal} kali
                          </span>
                        </div>
                      </td>

                      {/* Lokasi & Penyebab */}
                      <td className="p-3.5 text-center max-w-xs">
                        <div className="font-bold text-slate-200 truncate" title={trip.locationKm}>
                          📍 {trip.locationKm || 'Lokasi SUTM'}
                        </div>
                        {trip.category && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                            {trip.category}
                          </span>
                        )}
                        {trip.coordinates && (
                          <div className="mt-0.5">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.coordinates.trim())}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline group"
                              title="Buka lokasi langsung di Google Maps"
                            >
                              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                              <span>{trip.coordinates}</span>
                            </a>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1" title={trip.cause}>
                          {trip.cause}
                        </div>
                      </td>

                      {/* Pelanggan & ENS */}
                      <td className="p-3.5 text-center font-bold text-slate-200">
                        <div>{trip.affectedCustomers.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">Plg</span></div>
                        <div className="text-[10px] text-slate-400 font-normal">{trip.ensKwh.toLocaleString('id-ID')} kWh</div>
                      </td>

                      {/* Kerugian & Status */}
                      <td className="p-3.5 text-center">
                        <div className="font-black text-rose-400 text-xs">
                          {formatRupiah(trip.financialLossIdr)}
                        </div>
                        <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {trip.status}
                        </span>
                      </td>

                      {/* Actions Column: Edit, Hapus, WA */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onEditTrip && (
                            <button
                              type="button"
                              onClick={() => onEditTrip(trip)}
                              className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                              title="Edit Data Gangguan"
                            >
                              <Edit2 className="w-3 h-3 text-amber-400" />
                              <span>Edit</span>
                            </button>
                          )}

                          {onDeleteTrip && (
                            <button
                              type="button"
                              onClick={() => setTripToDelete(trip)}
                              className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                              title="Hapus Data Gangguan"
                            >
                              <Trash2 className="w-3 h-3 text-rose-400" />
                              <span>Hapus</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenWhatsAppModal ? onOpenWhatsAppModal(trip) : null}
                            className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Kirim Laporan Trip ini ke WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WA</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Trip Gangguan */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c162d] text-white p-6 text-center shadow-2xl transition-all">
            <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-3.5 shadow-inner border border-rose-500/30">
              <Trash2 className="w-7 h-7 text-rose-400" />
            </div>

            <h4 className="font-extrabold text-base mb-1.5 text-rose-400">
              Konfirmasi Hapus Data Gangguan
            </h4>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus data gangguan penyulang{' '}
              <strong className="text-white font-black">{tripToDelete.feederName}</strong>{' '}
              secara permanen dari database sistem?
            </p>

            {/* Trip summary card */}
            <div className="p-3 rounded-xl bg-[#070e1e] border border-slate-800 text-left text-xs mb-5 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">ID Gangguan:</span>
                <span className="font-mono font-bold text-slate-300">{tripToDelete.id}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Waktu Trip:</span>
                <span className="font-bold text-slate-200">{tripToDelete.tripDate} ({tripToDelete.tripTime} - {tripToDelete.recoveryTime})</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Relay & Arus:</span>
                <span className="font-bold text-amber-400">{tripToDelete.relayType} | {tripToDelete.currentAmpere} A</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Kerugian IDR:</span>
                <span className="font-black text-rose-400">{formatRupiah(tripToDelete.financialLossIdr)}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button 
                type="button" 
                onClick={() => setTripToDelete(null)} 
                className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer text-slate-300 hover:text-white"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (onDeleteTrip && tripToDelete) {
                    onDeleteTrip(tripToDelete.id);
                    setTripToDelete(null);
                  }
                }} 
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
