import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';

interface TripLogsViewProps {
  isDarkMode: boolean;
  trips: FeederTrip[];
  onOpenInputGangguan: () => void;
  onOpenWhatsAppModal?: (trip?: FeederTrip) => void;
  onEditTrip?: (trip: FeederTrip) => void;
  onDeleteTrip?: (tripId: string) => void;
  masterFeeders?: MasterFeeder[];
}

export const TripLogsView: React.FC<TripLogsViewProps> = ({
  isDarkMode,
  trips,
  onOpenInputGangguan,
  onOpenWhatsAppModal,
  onEditTrip,
  onDeleteTrip,
  masterFeeders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeder, setSelectedFeeder] = useState('ALL');
  const [selectedRelay, setSelectedRelay] = useState('ALL');
  const [tripToDelete, setTripToDelete] = useState<FeederTrip | null>(null);

  // Feeder options for filter
  const feederOptions = masterFeeders.length > 0 
    ? masterFeeders.map(f => f.feederName)
    : Array.from(new Set(trips.map(t => t.feederName)));

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.feederName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.locationKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.coordinates && trip.coordinates.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFeeder = selectedFeeder === 'ALL' || trip.feederName === selectedFeeder;
    const matchesRelay = selectedRelay === 'ALL' || trip.relayType.includes(selectedRelay);

    return matchesSearch && matchesFeeder && matchesRelay;
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Log Matriks Gangguan & Trip Feeder 20kV
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rekapitulasi Trip, Arus Gangguan (INOL, L1, L2, L3), Estimasi Jarak AI, & Indeks SAIDI/SAIFI
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari lokasi, koordinat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Feeder Filter */}
          <select
            value={selectedFeeder}
            onChange={(e) => setSelectedFeeder(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs border font-semibold focus:outline-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">Semua Feeder</option>
            {feederOptions.map(fName => (
              <option key={fName} value={fName}>{fName}</option>
            ))}
          </select>

          {/* Broadcast WA Button */}
          {onOpenWhatsAppModal && (
            <button
              onClick={() => onOpenWhatsAppModal()}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
              title="Kirim Laporan Gangguan ke WhatsApp Group / Dispatcher"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Broadcast WA</span>
            </button>
          )}

          {/* Add Trip Button */}
          <button
            onClick={onOpenInputGangguan}
            className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Trip Baru</span>
          </button>
        </div>
      </div>

      {/* Trip Log Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            } uppercase font-bold text-[10px] tracking-wider`}>
              <tr>
                <th className="p-3.5">ID & Feeder</th>
                <th className="p-3.5">Jam Trip & Masuk</th>
                <th className="p-3.5">Arus Beban & Gangguan</th>
                <th className="p-3.5">Estimasi Jarak AI</th>
                <th className="p-3.5">SAIDI / SAIFI</th>
                <th className="p-3.5">Lokasi & Koordinat</th>
                <th className="p-3.5">Pelanggan & ENS</th>
                <th className="p-3.5 text-right">Kerugian & Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Belum ada data trip gangguan. Silakan klik <strong>+ Catat Trip Baru</strong> untuk menginput data secara manual.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const durationHours = trip.durationMinutes / 60;
                  const masterTotalCust = (masterFeeders || []).reduce((acc, f) => acc + (Number(f.customerCount) || 0), 0);
                  const totalUlp = trip.totalUlpCustomers || (masterTotalCust > 0 ? masterTotalCust : 45200);
                  const saidiHours = trip.saidiHours ?? Number(((durationHours * trip.affectedCustomers) / totalUlp).toFixed(4));
                  const saidiMins = trip.saidiMinutes ?? Number((saidiHours * 60).toFixed(2));
                  const saifiVal = trip.saifiCount ?? Number((trip.affectedCustomers / totalUlp).toFixed(4));
                  const kw = trip.kwPadam || Math.round(Math.sqrt(3) * 20 * trip.currentAmpere * 0.95);

                  return (
                    <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      
                      {/* Feeder */}
                      <td className="p-3.5 font-bold">
                        <div className="text-slate-900 dark:text-white font-extrabold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                          {trip.feederName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{trip.id}</div>
                      </td>

                      {/* Waktu & Durasi */}
                      <td className="p-3.5">
                        <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>{trip.tripTime || '-'}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{trip.recoveryTime || '-'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {trip.tripDate} • <span className="font-extrabold text-amber-600 dark:text-amber-400">{trip.durationMinutes} m ({durationHours.toFixed(2)} j)</span>
                        </div>
                      </td>

                      {/* Relay & Arus Gangguan */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 inline-block">
                          {trip.relayType}
                        </span>
                        <div className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold mt-1">
                          Beban: <strong>{trip.currentAmpere} A</strong> ({kw.toLocaleString('id-ID')} kW)
                        </div>
                        {(trip.iNol || trip.iL1 || trip.iL2 || trip.iL3) ? (
                          <div className="text-[9px] font-mono text-purple-600 dark:text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded mt-1 border border-purple-500/20">
                            I0:{trip.iNol || 0}A | R:{trip.iL1 || 0}A S:{trip.iL2 || 0}A T:{trip.iL3 || 0}A
                          </div>
                        ) : null}
                      </td>

                      {/* Estimasi Jarak AI */}
                      <td className="p-3.5">
                        {trip.estimatedDistanceKm ? (
                          <div className={`p-1.5 rounded-lg border ${
                            trip.tripScope === 'PERCABANGAN'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300'
                          }`}>
                            <div className="font-extrabold text-xs flex items-center gap-1">
                              <Cpu className={`w-3 h-3 ${trip.tripScope === 'PERCABANGAN' ? 'text-amber-500' : 'text-purple-500'}`} />
                              <span>{trip.estimatedDistanceKm} km</span>
                            </div>
                            <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                              {trip.tripScope === 'PERCABANGAN' ? 'dari Gardu Hubung' : 'dari Substation GI'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-normal">-</span>
                        )}
                      </td>

                      {/* SAIDI / SAIFI Contribution */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 inline-block">
                            SAIDI: {saidiHours} j ({saidiMins} m)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 inline-block">
                            SAIFI: {saifiVal} kali
                          </span>
                        </div>
                      </td>

                      {/* Lokasi & Penyebab */}
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate" title={trip.locationKm}>
                          📍 {trip.locationKm || 'Lokasi SUTM'}
                        </div>
                        {trip.coordinates && (
                          <a
                            href={`https://earth.google.com/web/search/${encodeURIComponent(trip.coordinates.trim())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 mt-1 hover:underline group"
                            title="Buka lokasi di Google Earth"
                          >
                            <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                            <span>{trip.coordinates}</span>
                          </a>
                        )}
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1" title={trip.cause}>
                          {trip.cause}
                        </div>
                      </td>

                      {/* Pelanggan & ENS */}
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                        <div>{trip.affectedCustomers.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">Plg</span></div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{trip.ensKwh.toLocaleString('id-ID')} kWh</div>
                      </td>

                      {/* Kerugian & Status */}
                      <td className="p-3.5 text-right">
                        <div className="font-black text-rose-600 dark:text-rose-400 text-xs">
                          {formatRupiah(trip.financialLossIdr)}
                        </div>
                        <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
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
                              className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                              title="Edit Data Gangguan"
                            >
                              <Edit2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>Edit</span>
                            </button>
                          )}

                          {onDeleteTrip && (
                            <button
                              type="button"
                              onClick={() => setTripToDelete(trip)}
                              className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                              title="Hapus Data Gangguan"
                            >
                              <Trash2 className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              <span>Hapus</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenWhatsAppModal ? onOpenWhatsAppModal(trip) : null}
                            className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-black inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Kirim Laporan Trip ini ke WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
          <div className={`w-full max-w-md rounded-2xl border p-6 text-center shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
              <Trash2 className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            </div>

            <h4 className="font-extrabold text-base mb-1.5 text-rose-600 dark:text-rose-400">
              Konfirmasi Hapus Data Gangguan
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus data gangguan penyulang{' '}
              <strong className="text-slate-900 dark:text-white font-black">{tripToDelete.feederName}</strong>{' '}
              secara permanen dari database sistem?
            </p>

            {/* Trip summary card */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-left text-xs mb-5 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">ID Gangguan:</span>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{tripToDelete.id}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Waktu Trip:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{tripToDelete.tripDate} ({tripToDelete.tripTime} - {tripToDelete.recoveryTime})</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Relay & Arus:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{tripToDelete.relayType} | {tripToDelete.currentAmpere} A</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Kerugian IDR:</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{formatRupiah(tripToDelete.financialLossIdr)}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button 
                type="button" 
                onClick={() => setTripToDelete(null)} 
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
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
