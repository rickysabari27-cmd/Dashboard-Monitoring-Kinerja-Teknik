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
  Activity
} from 'lucide-react';

interface TripLogsViewProps {
  isDarkMode: boolean;
  trips: FeederTrip[];
  onOpenInputGangguan: () => void;
  onOpenWhatsAppModal?: (trip?: FeederTrip) => void;
  masterFeeders?: MasterFeeder[];
}

export const TripLogsView: React.FC<TripLogsViewProps> = ({
  isDarkMode,
  trips,
  onOpenInputGangguan,
  onOpenWhatsAppModal,
  masterFeeders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeder, setSelectedFeeder] = useState('ALL');
  const [selectedRelay, setSelectedRelay] = useState('ALL');

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
                  const totalUlp = trip.totalUlpCustomers || 45200;
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
                          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                            <div className="font-extrabold text-xs flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-purple-500" />
                              <span>{trip.estimatedDistanceKm} km</span>
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400">
                              dari Substation GI
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
                          <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{trip.coordinates}</span>
                          </div>
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

                      {/* Kirim WA Action */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenWhatsAppModal ? onOpenWhatsAppModal(trip) : null}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-black inline-flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                          title="Kirim Laporan Trip ini ke WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>WA</span>
                        </button>
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
  );
};
