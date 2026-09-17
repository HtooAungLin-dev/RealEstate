import React, { useState } from 'react';
import { 
  Scale, 
  X, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property';
import { translations } from '../i18n/translations';

interface CompareFloatingBarProps {
  comparedProperties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onClearAll: () => void;
  onOpenCompareModal: () => void;
  currentLang: SupportedLanguage;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  comparedProperties,
  onRemoveProperty,
  onClearAll,
  onOpenCompareModal,
  currentLang,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const t = translations[currentLang];

  if (comparedProperties.length === 0) return null;

  return (
    <aside 
      aria-label="Property comparison drawer"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl transition-all duration-300"
    >
      {/* Minimized Pill Mode */}
      {isMinimized ? (
        <div className="bg-[#1E293B] text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center justify-between mx-auto w-fit gap-4 backdrop-blur-md">
          <div 
            onClick={() => setIsMinimized(false)}
            className="flex items-center space-x-2.5 cursor-pointer hover:text-red-400 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#E00000] text-white flex items-center justify-center font-bold text-xs">
              {comparedProperties.length}
            </div>
            <span className="text-xs font-bold">
              {t.compare?.compareTitle || 'Compare Properties'} ({comparedProperties.length}/4)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCompareModal}
              className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>{t.compare?.compareNow || 'Compare Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Expand"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Dock Card */
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-3 sm:p-4 transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-red-100 text-[#E00000] flex items-center justify-center">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {t.compare?.compareTitle || 'Compare Properties'}
              </span>
              <span className="bg-red-50 text-[#E00000] text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                {comparedProperties.length} of 4 selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-50"
              >
                {t.compare?.clearAll || 'Clear All'}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Minimize bar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Horizontal Property Thumbnails */}
            <div className="flex items-center space-x-2.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {comparedProperties.map((property) => (
                <div
                  key={property.id}
                  className="relative group bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center space-x-2 shrink-0 pr-3 hover:border-red-200 transition-all"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="max-w-[130px]">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {property.project}
                    </p>
                    <p className="text-[11px] font-extrabold text-[#E00000] -mt-0.5">
                      {property.formattedPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveProperty(property.id)}
                    className="ml-1 text-slate-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                    title={t.compare?.removeFromCompare || 'Remove'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Placeholder slots up to 4 */}
              {Array.from({ length: 4 - comparedProperties.length }).map((_, idx) => (
                <div
                  key={`slot-${idx}`}
                  className="hidden md:flex border border-dashed border-slate-300 rounded-xl p-2 items-center justify-center text-slate-400 text-xs font-medium space-x-1 w-28 h-12 bg-slate-50/50"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px]">Add Slot</span>
                </div>
              ))}
            </div>

            {/* Compare Now CTA Button */}
            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
              <button
                id="floating-compare-now-btn"
                onClick={onOpenCompareModal}
                disabled={comparedProperties.length < 1}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer ${
                  comparedProperties.length >= 2
                    ? 'bg-[#E00000] hover:bg-[#C00000] text-white hover:scale-102 active:scale-98 shadow-red-500/25'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>
                  {comparedProperties.length >= 2
                    ? `${t.compare?.compareNow || 'Compare Now'} (${comparedProperties.length})`
                    : 'View Selected (Select 1 more)'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
