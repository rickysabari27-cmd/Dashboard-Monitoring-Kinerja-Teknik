import React from 'react';
import { InspectionRecord, RowTreeLocation } from '../../types';
import { Wrench, Trees, ClipboardCheck, AlertCircle, CheckCircle, Plus } from 'lucide-react';

interface PemeliharaanViewProps {
  isDarkMode: boolean;
  inspections: InspectionRecord[];
  rowTrees: RowTreeLocation[];
  onOpenUniversalInput?: (tab?: string) => void;
}

export const PemeliharaanView: React.FC<PemeliharaanViewProps> = ({
  isDarkMode,
  inspections,
  rowTrees,
  onOpenUniversalInput
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pemeliharaan 20kV & Manajemen ROW Pohon
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoring Temuan Inspeksi SUTM, Thermovision, Grounding & Area Pangkas Pohon
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('pemeliharaan')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lapor Temuan Inspeksi</span>
          </button>
          <button 
            onClick={() => onOpenUniversalInput && onOpenUniversalInput('spk')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat SPK Pemeliharaan</span>
          </button>
        </div>
      </div>

      {/* Section 1: Inspeksi & Temuan Lapangan */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="w-4 h-4 text-blue-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            INSPEKSI & TEMUAN LAPANGAN SUTM
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            } uppercase font-bold text-[10px] tracking-wider`}>
              <tr>
                <th className="p-3">ID & Feeder</th>
                <th className="p-3">Lokasi / Gardu</th>
                <th className="p-3">Tim Inspeksi</th>
                <th className="p-3">Uraian Temuan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {inspections.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {item.feederName}
                    <div className="text-[10px] text-slate-400 font-normal">{item.id}</div>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                    {item.location}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {item.inspectorTeam}
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-medium max-w-xs">
                    {item.findingDescription}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Area ROW Rawan Pohon */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Trees className="w-4 h-4 text-emerald-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            PETA & JADWAL PANGKAS ROW POHON DEKAT SUTM
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rowTrees.map((tree) => (
            <div key={tree.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{tree.feederName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Prioritas {tree.priority}
                </span>
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                📍 {tree.spanLocation}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Jenis: <span className="font-semibold text-slate-900 dark:text-slate-100">{tree.treeType}</span> (Jarak: {tree.distanceMeter}m ke SUTM)
              </div>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-medium">
                Action: {tree.requiredAction}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
