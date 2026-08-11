import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutGrid, 
  MapPin, 
  TrendingUp, 
  Zap, 
  Wrench, 
  FileText, 
  Gauge, 
  Database, 
  BarChart2, 
  Package, 
  Shield, 
  Car, 
  Users, 
  Lock,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isDarkMode: boolean;
  tripCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpenMobile,
  setIsOpenMobile,
  isDarkMode,
  tripCount
}) => {

  const menuItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard Utama', icon: LayoutGrid, badge: null },
    { id: 'gis' as ViewMode, label: 'Peta Penyulang GIS', icon: MapPin, badge: null },
    { id: 'health_index' as ViewMode, label: 'Health Index Penyulang', icon: TrendingUp, badge: null },
    { id: 'trips' as ViewMode, label: 'Gangguan & Trip Feeder', icon: Zap, badge: null },
    { id: 'pemeliharaan' as ViewMode, label: 'Pemeliharaan 20kV', icon: Wrench, badge: '4 Sub', hasSub: true },
    { id: 'spk' as ViewMode, label: 'Perintah Kerja Harian (SPK)', icon: FileText, badge: null },
    { id: 'pengukuran' as ViewMode, label: 'Pengukuran & Beban Gardu', icon: Gauge, badge: null },
    { id: 'master_data' as ViewMode, label: 'Master Data Penyulang', icon: Database, badge: null },
    { id: 'saidi_saifi' as ViewMode, label: 'Kinerja SAIDI / SAIFI', icon: BarChart2, badge: null },
    { id: 'material' as ViewMode, label: 'Stok & Pemakaian Material', icon: Package, badge: null },
    { id: 'apd' as ViewMode, label: 'Alat Kerja & APD', icon: Shield, badge: null },
    { id: 'kendaraan' as ViewMode, label: 'Kendaraan Operasional', icon: Car, badge: null },
    { id: 'users' as ViewMode, label: 'Kelola User & Hak Akses', icon: Users, badge: null, locked: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-0 left-0 z-40
        w-64 sm:w-72 lg:w-64 h-screen lg:h-screen
        transition-transform duration-300 ease-in-out my-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-[#0B132B] text-slate-300
        flex flex-col shrink-0 overflow-hidden p-3.5 sm:p-4 border-r border-slate-800/80
      `}>
        {/* Mobile Close Button */}
        <div className="p-2 flex items-center justify-between lg:hidden mb-2">
          <div className="font-bold text-xs tracking-wider text-slate-300 uppercase flex items-center justify-between w-full">
            <span>MENU SYSTEM</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </div>
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header / Title as in Screenshot 1 */}
        <div className="hidden lg:flex items-center justify-between px-3 py-3 mb-3">
          <span className="text-[12px] font-extrabold tracking-wider text-slate-300 uppercase">
            MENU SYSTEM
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                disabled={item.locked}
                onClick={() => {
                  if (!item.locked) {
                    setCurrentView(item.id);
                    setIsOpenMobile(false);
                  }
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group
                  ${item.locked 
                    ? 'opacity-40 cursor-not-allowed text-slate-500' 
                    : isActive 
                      ? 'bg-[#102A5C] text-blue-400 font-bold shadow-xs' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : item.locked ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="truncate text-left">{item.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                      {item.badge}
                    </span>
                  )}
                  {item.hasSub && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {item.locked && (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="mt-auto pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-blue-400">PLN</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">ULP Baguala</span>
              <span className="text-[10px] text-slate-400">Sistem Keandalan 20kV</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

