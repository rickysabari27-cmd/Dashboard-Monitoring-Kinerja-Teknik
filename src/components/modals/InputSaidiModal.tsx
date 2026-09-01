import React, { useState, useEffect } from 'react';
import { X, BarChart2, CheckCircle2, Target, Building2, Award, Zap, Clock, DollarSign, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MonthlySaidiSaifiData } from '../../types';

interface InputSaidiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSaidi?: (
    year: number, 
    month: string, 
    saidiReal: number, 
    saifiReal: number, 
    saidiTarget?: number, 
    saifiTarget?: number,
    ensLossJuta?: number
  ) => void;
  onSaveRow?: (updatedRow: MonthlySaidiSaifiData) => void;
  isDarkMode: boolean;
  initialYear?: number;
  initialMonth?: string;
  monthlySaidiData?: MonthlySaidiSaifiData[];
}

const parseNum = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).trim().replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const InputSaidiModal: React.FC<InputSaidiModalProps> = ({
  isOpen,
  onClose,
  onUpdateSaidi,
  onSaveRow,
  isDarkMode,
  initialYear = new Date().getFullYear(),
  initialMonth = 'Jan',
  monthlySaidiData = []
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [activeTab, setActiveTab] = useState<'susut' | 'keandalan' | 'investasi' | 'pelayanan' | 'keandalan_jtm' | 'ert_distribusi'>('susut');

  // String-based raw form state for smooth unhindered typing
  const [rawForm, setRawForm] = useState<Record<string, string>>({});

  // When selected year/month changes or modal opens, sync rawForm from existing monthly data
  // Helper to match month names robustly
  const matchMonth = (m1?: string, m2?: string) => {
    if (!m1 || !m2) return false;
    const s1 = m1.trim().toLowerCase();
    const s2 = m2.trim().toLowerCase();
    if (s1 === s2) return true;
    if ((s1 === 'jul' || s1 === 'juli') && (s2 === 'jul' || s2 === 'juli')) return true;
    if ((s1 === 'ags' || s1 === 'agustus' || s1 === 'agt') && (s2 === 'ags' || s2 === 'agustus' || s2 === 'agt')) return true;
    if ((s1 === 'jan' || s1 === 'januari') && (s2 === 'jan' || s2 === 'januari')) return true;
    if ((s1 === 'feb' || s1 === 'februari') && (s2 === 'feb' || s2 === 'februari')) return true;
    if ((s1 === 'mar' || s1 === 'maret') && (s2 === 'mar' || s2 === 'maret')) return true;
    if ((s1 === 'apr' || s1 === 'april') && (s2 === 'apr' || s2 === 'april')) return true;
    if ((s1 === 'mei' || s1 === 'may') && (s2 === 'mei' || s2 === 'may')) return true;
    if ((s1 === 'jun' || s1 === 'juni') && (s2 === 'jun' || s2 === 'juni')) return true;
    if ((s1 === 'sep' || s1 === 'september') && (s2 === 'sep' || s2 === 'september')) return true;
    if ((s1 === 'okt' || s1 === 'oktober') && (s2 === 'okt' || s2 === 'oktober')) return true;
    if ((s1 === 'nov' || s1 === 'november') && (s2 === 'nov' || s2 === 'november')) return true;
    if ((s1 === 'des' || s1 === 'desember') && (s2 === 'des' || s2 === 'desember')) return true;
    return s1.startsWith(s2) || s2.startsWith(s1);
  };

  useEffect(() => {
    if (!isOpen) return;
    const found = (monthlySaidiData || []).find(d => (d.year || 2026) === selectedYear && matchMonth(d.month, selectedMonth));
    
    const sTargetM = found?.saidiTargetMenit !== undefined 
      ? found.saidiTargetMenit 
      : (found?.saidiTarget ? Number((found.saidiTarget * 60).toFixed(2)) : undefined);
    
    const sRealM = found?.saidiRealMenit !== undefined 
      ? found.saidiRealMenit 
      : (found?.saidiReal ? Number((found.saidiReal * 60).toFixed(2)) : undefined);

    setRawForm({
      saidiTargetMenit: sTargetM !== undefined && sTargetM !== 0 ? String(sTargetM) : (sTargetM === 0 ? '0' : ''),
      saidiRealMenit: sRealM !== undefined && sRealM !== 0 ? String(sRealM) : (sRealM === 0 ? '0' : ''),
      saifiTarget: found?.saifiTarget !== undefined && found.saifiTarget !== 0 ? String(found.saifiTarget) : (found?.saifiTarget === 0 ? '0' : ''),
      saifiReal: found?.saifiReal !== undefined && found.saifiReal !== 0 ? String(found.saifiReal) : (found?.saifiReal === 0 ? '0' : ''),
      ensMwhTarget: found?.ensMwhTarget !== undefined && found.ensMwhTarget !== 0 ? String(found.ensMwhTarget) : (found?.ensMwhTarget === 0 ? '0' : ''),
      ensMwhReal: found?.ensMwhReal !== undefined && found.ensMwhReal !== 0 ? String(found.ensMwhReal) : (found?.ensMwhReal === 0 ? '0' : ''),
      susutPercentTarget: found?.susutPercentTarget !== undefined && found.susutPercentTarget !== 0 ? String(found.susutPercentTarget) : (found?.susutPercentTarget === 0 ? '0' : ''),
      susutPercentReal: found?.susutPercentReal !== undefined && found.susutPercentReal !== 0 ? String(found.susutPercentReal) : (found?.susutPercentReal === 0 ? '0' : ''),
      asetRuptlTarget: found?.asetRuptlTarget !== undefined && found.asetRuptlTarget !== 0 ? String(found.asetRuptlTarget) : (found?.asetRuptlTarget === 0 ? '0' : ''),
      asetRuptlUlp: found?.asetRuptlUlp !== undefined && found.asetRuptlUlp !== 0 ? String(found.asetRuptlUlp) : (found?.asetRuptlUlp === 0 ? '0' : ''),
      asetInvestasiTarget: found?.asetInvestasiTarget !== undefined && found.asetInvestasiTarget !== 0 ? String(found.asetInvestasiTarget) : (found?.asetInvestasiTarget === 0 ? '0' : ''),
      asetInvestasiUlp: found?.asetInvestasiUlp !== undefined && found.asetInvestasiUlp !== 0 ? String(found.asetInvestasiUlp) : (found?.asetInvestasiUlp === 0 ? '0' : ''),
      feedbackRatingNegatifTarget: found?.feedbackRatingNegatifTarget !== undefined && found.feedbackRatingNegatifTarget !== 0 ? String(found.feedbackRatingNegatifTarget) : (found?.feedbackRatingNegatifTarget === 0 ? '0' : ''),
      feedbackRatingNegatifUlp: found?.feedbackRatingNegatifUlp !== undefined && found.feedbackRatingNegatifUlp !== 0 ? String(found.feedbackRatingNegatifUlp) : (found?.feedbackRatingNegatifUlp === 0 ? '0' : ''),
      responseTimeTarget: found?.responseTimeTarget !== undefined && found.responseTimeTarget !== 0 ? String(found.responseTimeTarget) : (found?.responseTimeTarget === 0 ? '0' : ''),
      responseTimeUlp: found?.responseTimeUlp !== undefined && found.responseTimeUlp !== 0 ? String(found.responseTimeUlp) : (found?.responseTimeUlp === 0 ? '0' : ''),
      successRateAutoDispatchTarget: found?.successRateAutoDispatchTarget !== undefined && found.successRateAutoDispatchTarget !== 0 ? String(found.successRateAutoDispatchTarget) : (found?.successRateAutoDispatchTarget === 0 ? '0' : ''),
      successRateAutoDispatchUlp: found?.successRateAutoDispatchUlp !== undefined && found.successRateAutoDispatchUlp !== 0 ? String(found.successRateAutoDispatchUlp) : (found?.successRateAutoDispatchUlp === 0 ? '0' : ''),
      gangguanTmTarget: found?.gangguanTmTarget !== undefined && found.gangguanTmTarget !== 0 ? String(found.gangguanTmTarget) : (found?.gangguanTmTarget === 0 ? '0' : ''),
      gangguanTmReal: found?.gangguanTmReal !== undefined && found.gangguanTmReal !== 0 ? String(found.gangguanTmReal) : (found?.gangguanTmReal === 0 ? '0' : ''),
      kerusakanPeralatanTarget: found?.kerusakanPeralatanTarget !== undefined && found.kerusakanPeralatanTarget !== 0 ? String(found.kerusakanPeralatanTarget) : (found?.kerusakanPeralatanTarget === 0 ? '0' : ''),
      kerusakanPeralatanReal: found?.kerusakanPeralatanReal !== undefined && found.kerusakanPeralatanReal !== 0 ? String(found.kerusakanPeralatanReal) : (found?.kerusakanPeralatanReal === 0 ? '0' : ''),
      mvodTarget: found?.mvodTarget !== undefined && found.mvodTarget !== 0 ? String(found.mvodTarget) : (found?.mvodTarget === 0 ? '0' : ''),
      mvodUlp: found?.mvodUlp !== undefined && found.mvodUlp !== 0 ? String(found.mvodUlp) : (found?.mvodUlp === 0 ? '0' : ''),
      mttrSiaga1Target: found?.mttrSiaga1Target !== undefined && found.mttrSiaga1Target !== 0 ? String(found.mttrSiaga1Target) : (found?.mttrSiaga1Target === 0 ? '0' : ''),
      mttrSiaga1Ulp: found?.mttrSiaga1Ulp !== undefined && found.mttrSiaga1Ulp !== 0 ? String(found.mttrSiaga1Ulp) : (found?.mttrSiaga1Ulp === 0 ? '0' : '')
    });
  }, [isOpen, selectedYear, selectedMonth, monthlySaidiData]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, val: string) => {
    setRawForm(prev => ({ ...prev, [field]: val }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const targetMenitVal = parseNum(rawForm.saidiTargetMenit);
  const realMenitVal = parseNum(rawForm.saidiRealMenit);
  const targetJamCalc = (targetMenitVal / 60).toFixed(2);
  const realJamCalc = (realMenitVal / 60).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const saidiTargetM = parseNum(rawForm.saidiTargetMenit);
    const saidiRealM = parseNum(rawForm.saidiRealMenit);
    const saidiTargetJ = Number((saidiTargetM / 60).toFixed(4));
    const saidiRealJ = Number((saidiRealM / 60).toFixed(4));

    const saifiT = parseNum(rawForm.saifiTarget);
    const saifiR = parseNum(rawForm.saifiReal);

    const ensMwhT = parseNum(rawForm.ensMwhTarget);
    const ensMwhR = parseNum(rawForm.ensMwhReal);
    const ensTgtJt = Number((ensMwhT * 1.4447).toFixed(2));
    const ensLossJt = Number((ensMwhR * 1.4447).toFixed(2));

    const payload: MonthlySaidiSaifiData = {
      year: selectedYear,
      month: selectedMonth,

      // 1. SAIDI
      saidiTargetMenit: saidiTargetM,
      saidiUp3Menit: saidiRealM,
      saidiRealMenit: saidiRealM,
      saidiTarget: saidiTargetJ,
      saidiUp3: saidiRealJ,
      saidiReal: saidiRealJ,

      // 2. SAIFI
      saifiTarget: saifiT,
      saifiUp3: saifiR,
      saifiReal: saifiR,

      // 3. ENS Loss
      ensMwhTarget: ensMwhT,
      ensMwhUp3: ensMwhR,
      ensMwhReal: ensMwhR,
      ensTargetJuta: ensTgtJt,
      ensUp3Juta: ensLossJt,
      ensLossJuta: ensLossJt,

      // Commercial (Susut)
      penjualanGwhTarget: 0,
      penjualanGwhUp3: 0,
      penjualanGwhReal: 0,
      susutPercentTarget: parseNum(rawForm.susutPercentTarget),
      susutPercentUp3: parseNum(rawForm.susutPercentReal),
      susutPercentReal: parseNum(rawForm.susutPercentReal),

      // 4. Response Time
      responseTimeTarget: parseNum(rawForm.responseTimeTarget),
      responseTimeUp3: parseNum(rawForm.responseTimeUlp),
      responseTimeUlp: parseNum(rawForm.responseTimeUlp),

      // 5. Success Rate Auto Dispatch
      successRateAutoDispatchTarget: parseNum(rawForm.successRateAutoDispatchTarget),
      successRateAutoDispatchUp3: parseNum(rawForm.successRateAutoDispatchUlp),
      successRateAutoDispatchUlp: parseNum(rawForm.successRateAutoDispatchUlp),

      // 6. Feedback Rating Negatif (Kali)
      feedbackRatingNegatifTarget: parseNum(rawForm.feedbackRatingNegatifTarget),
      feedbackRatingNegatifUp3: parseNum(rawForm.feedbackRatingNegatifUlp),
      feedbackRatingNegatifUlp: parseNum(rawForm.feedbackRatingNegatifUlp),

      // 7. Gangguan TM (Kali)
      gangguanTmTarget: parseNum(rawForm.gangguanTmTarget),
      gangguanTmUp3: parseNum(rawForm.gangguanTmReal),
      gangguanTmReal: parseNum(rawForm.gangguanTmReal),

      // 8. Kerusakan Peralatan (Kali)
      kerusakanPeralatanTarget: parseNum(rawForm.kerusakanPeralatanTarget),
      kerusakanPeralatanUp3: parseNum(rawForm.kerusakanPeralatanReal),
      kerusakanPeralatanReal: parseNum(rawForm.kerusakanPeralatanReal),

      // 9. MVOD
      mvodTarget: parseNum(rawForm.mvodTarget),
      mvodUp3: parseNum(rawForm.mvodUlp),
      mvodUlp: parseNum(rawForm.mvodUlp),

      // 10. MTTR Siaga 1 TM
      mttrSiaga1Target: parseNum(rawForm.mttrSiaga1Target),
      mttrSiaga1Up3: parseNum(rawForm.mttrSiaga1Ulp),
      mttrSiaga1Ulp: parseNum(rawForm.mttrSiaga1Ulp),

      // 11. Penambahan Aset RUPTL
      asetRuptlTarget: parseNum(rawForm.asetRuptlTarget),
      asetRuptlUp3: parseNum(rawForm.asetRuptlUlp),
      asetRuptlUlp: parseNum(rawForm.asetRuptlUlp),

      // 12. Penambahan Aset Penyelesaian Fisik Investasi
      asetInvestasiTarget: parseNum(rawForm.asetInvestasiTarget),
      asetInvestasiUp3: parseNum(rawForm.asetInvestasiUlp),
      asetInvestasiUlp: parseNum(rawForm.asetInvestasiUlp)
    };

    if (onSaveRow) {
      onSaveRow(payload);
    } else if (onUpdateSaidi) {
      onUpdateSaidi(
        selectedYear,
        selectedMonth,
        payload.saidiReal,
        payload.saifiReal,
        payload.saidiTarget,
        payload.saifiTarget,
        payload.ensLossJuta
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkMode ? 'bg-[#0c1427] border-[#1c2942] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-[#1c2942] flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-[#070c19] to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-[#00f5a0] border border-emerald-500/30">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>FORM INPUT & EDIT KPI DISTRIBUSI PLN</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00f5a0] font-extrabold uppercase border border-emerald-500/30">
                  Mode Target vs Realisasi
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Input Target KPI & Realisasi KPI untuk 12 Indikator Distribusi
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#070c19] border border-[#1c2942] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 text-xs">
          
          {/* Periode Dropdowns */}
          <div className="p-3 rounded-xl bg-[#070c19] border border-[#1c2942] grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-400 block mb-1">Tahun Anggaran:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#1c2942] bg-[#0c1427] text-white font-extrabold"
              >
                {[2030, 2029, 2028, 2027, 2026, 2025, 2024].map(y => (
                  <option key={y} value={y}>Tahun {y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-extrabold text-slate-400 block mb-1">Bulan Pelaporan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#1c2942] bg-[#0c1427] text-white font-extrabold"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
                  <option key={m} value={m}>Bulan {m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 p-1 bg-[#070c19] rounded-xl border border-[#1c2942] text-xs font-extrabold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('susut')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'susut' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1. Susut Distribusi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('keandalan')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'keandalan' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>2. Keandalan Penyaluran Tenaga Listrik</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('investasi')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'investasi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3. Eksekusi RUPTL & Investasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pelayanan')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'pelayanan' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4. Peningkatan Pelayanan Pelanggan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('keandalan_jtm')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'keandalan_jtm' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>5. Keandalan JTM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ert_distribusi')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'ert_distribusi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>6. ERT Distribusi</span>
            </button>
          </div>

          {/* TAB 1: SUSUT DISTRIBUSI */}
          {activeTab === 'susut' && (
            <div className="space-y-4">
              {/* Susut Distribusi (%) */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Susut Distribusi Tanpa Emin (%)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.susutPercentTarget ?? ''}
                      onChange={(e) => handleInputChange('susutPercentTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.susutPercentReal ?? ''}
                      onChange={(e) => handleInputChange('susutPercentReal', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEANDALAN PENYALURAN TENAGA LISTRIK (SAIDI, SAIFI, ENS) */}
          {activeTab === 'keandalan' && (
            <div className="space-y-4">
              
              {/* SAIDI (menit/plg) */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="flex items-center justify-between font-extrabold text-sky-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-400" />
                    SAIDI (Lama Padam - Menit / Plg)
                  </span>
                  <span className="text-[10px] text-slate-400">Konversi Jam: Target ({targetJamCalc} j) | Realisasi ({realJamCalc} j)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.saidiTargetMenit ?? ''}
                      onChange={(e) => handleInputChange('saidiTargetMenit', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.saidiRealMenit ?? ''}
                      onChange={(e) => handleInputChange('saidiRealMenit', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* SAIFI (kali/plg) */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-[#00e5ff] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#00e5ff]" />
                  SAIFI (Frekuensi Padam - Kali / Plg)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.saifiTarget ?? ''}
                      onChange={(e) => handleInputChange('saifiTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.saifiReal ?? ''}
                      onChange={(e) => handleInputChange('saifiReal', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* ENS Loss (MWh) */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-[#fbbf24] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#fbbf24]" />
                  ENS (Energi Loss - MWh)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.ensMwhTarget ?? ''}
                      onChange={(e) => handleInputChange('ensMwhTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.ensMwhReal ?? ''}
                      onChange={(e) => handleInputChange('ensMwhReal', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PENYELESAIAN EKSEKUSI RUPTL DAN INVESTASI */}
          {activeTab === 'investasi' && (
            <div className="space-y-4">
              
              {/* Penambahan Aset RUPTL */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-pink-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-pink-400" />
                  Penambahan Aset RUPTL (%)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.asetRuptlTarget ?? ''}
                      onChange={(e) => handleInputChange('asetRuptlTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.asetRuptlUlp ?? ''}
                      onChange={(e) => handleInputChange('asetRuptlUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* Penambahan Aset Penyelesaian Fisik Investasi */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-[#00f5a0] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00f5a0]" />
                  Penambahan Aset Penyelesaian Fisik Investasi (%)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.asetInvestasiTarget ?? ''}
                      onChange={(e) => handleInputChange('asetInvestasiTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.asetInvestasiUlp ?? ''}
                      onChange={(e) => handleInputChange('asetInvestasiUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PENINGKATAN PELAYANAN PELANGGAN */}
          {activeTab === 'pelayanan' && (
            <div className="space-y-4">
              
              {/* Feedback Rating Negatif PLN Mobile (Satuan: Kali) */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-purple-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Feedback Rating Negatif pada PLN Mobile Gangguan (Kali)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.feedbackRatingNegatifTarget ?? ''}
                      onChange={(e) => handleInputChange('feedbackRatingNegatifTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.feedbackRatingNegatifUlp ?? ''}
                      onChange={(e) => handleInputChange('feedbackRatingNegatifUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* Response Time atas Gangguan */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-teal-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  Response Time atas Gangguan (diluar Clear Tamper - Menit)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI (Menit)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.responseTimeTarget ?? ''}
                      onChange={(e) => handleInputChange('responseTimeTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (Menit)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.responseTimeUlp ?? ''}
                      onChange={(e) => handleInputChange('responseTimeUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* Success Rate Auto Dispatch */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-blue-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-400" />
                  Success Rate Auto Dispatch Gangguan Individual (diluar Clear Tamper - %)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.successRateAutoDispatchTarget ?? ''}
                      onChange={(e) => handleInputChange('successRateAutoDispatchTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.successRateAutoDispatchUlp ?? ''}
                      onChange={(e) => handleInputChange('successRateAutoDispatchUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: KEANDALAN JTM */}
          {activeTab === 'keandalan_jtm' && (
            <div className="space-y-4">
              
              {/* Gangguan TM */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-rose-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Gangguan TM (sesuai kewenangan - Kali)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.gangguanTmTarget ?? ''}
                      onChange={(e) => handleInputChange('gangguanTmTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.gangguanTmReal ?? ''}
                      onChange={(e) => handleInputChange('gangguanTmReal', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* Kerusakan Peralatan Distribusi */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-orange-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Kerusakan Peralatan Distribusi (sesuai kewenangan - Kali)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.kerusakanPeralatanTarget ?? ''}
                      onChange={(e) => handleInputChange('kerusakanPeralatanTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (Kali)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.kerusakanPeralatanReal ?? ''}
                      onChange={(e) => handleInputChange('kerusakanPeralatanReal', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: EMERGENCY RESPONSE TIME (ERT) DISTRIBUSI */}
          {activeTab === 'ert_distribusi' && (
            <div className="space-y-4">
              
              {/* MVOD */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-lime-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-lime-400" />
                  MVOD (sesuai kewenangan - %)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.mvodTarget ?? ''}
                      onChange={(e) => handleInputChange('mvodTarget', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (%)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.mvodUlp ?? ''}
                      onChange={(e) => handleInputChange('mvodUlp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

              {/* MTTR Siaga 1 TM */}
              <div className="p-3.5 rounded-xl bg-[#081122] border border-[#1b2b46] space-y-2">
                <div className="font-extrabold text-indigo-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  MTTR Siaga 1 TM (sesuai kewenangan - Menit)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target KPI Limit (Menit)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.mttrSiaga1Target ?? ''}
                      onChange={(e) => handleInputChange('mttrSiaga1Target', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-[#1c2942] text-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#00f5a0] block mb-1">Realisasi KPI (Menit)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={rawForm.mttrSiaga1Ulp ?? ''}
                      onChange={(e) => handleInputChange('mttrSiaga1Ulp', e.target.value)}
                      onFocus={handleFocus}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg bg-[#070c19] border border-emerald-500/40 text-[#00f5a0] font-black"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#1c2942] flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Menyimpan data untuk periode <strong>Bulan {selectedMonth} {selectedYear}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#1c2942] bg-[#070c19] font-bold text-slate-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan 13 KPI Distribusi</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

