import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  className?: string;
  activeColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'slate';
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  className = '',
  activeColor = 'emerald',
  showSearch = false,
  searchPlaceholder = 'Cari...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to object form
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOpt: SelectOption = normalizedOptions.find(o => o.value === value) || { value, label: value || placeholder };

  // Filter options if searching
  const filteredOptions = normalizedOptions.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorStyles = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/30 hover:border-emerald-400',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/50 ring-1 ring-amber-500/30 hover:border-amber-400',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-500/50 ring-1 ring-rose-500/30 hover:border-rose-400',
    blue: 'bg-blue-950/80 text-blue-300 border-blue-500/50 ring-1 ring-blue-500/30 hover:border-blue-400',
    indigo: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50 ring-1 ring-indigo-500/30 hover:border-indigo-400',
    slate: 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-slate-600'
  };

  const activeStyle = value && value !== 'ALL' ? colorStyles[activeColor] : colorStyles.slate;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer shadow-sm ${activeStyle} ${className}`}
      >
        <span className="truncate flex items-center gap-1.5">
          {selectedOpt.icon && <span>{selectedOpt.icon}</span>}
          <span>{selectedOpt.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 min-w-[200px] max-w-[280px] w-max bg-[#0c162d] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          {/* Search box if enabled or if options count > 7 */}
          {(showSearch || normalizedOptions.length > 7) && (
            <div className="p-2 border-b border-slate-800 bg-[#081124]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 text-center italic">Tidak ditemukan</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors duration-100 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-400 font-bold'
                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-emerald-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {opt.icon && <span>{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
