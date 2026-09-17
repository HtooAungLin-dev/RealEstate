import React from 'react';
import { X, Heart, Trash2, ArrowRight, Scale } from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property';
import { translations } from '../i18n/translations';

interface ShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedProperties: Property[];
  onRemoveFromShortlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactAgent: (property: Property) => void;
  compareList?: string[];
  onToggleCompare?: (id: string) => void;
  onOpenCompare?: () => void;
  currentLang: SupportedLanguage;
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  isOpen,
  onClose,
  shortlistedProperties,
  onRemoveFromShortlist,
  onSelectProperty,
  onContactAgent,
  compareList = [],
  onToggleCompare,
  onOpenCompare,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-[#E00000]">
              <Heart className="w-4 h-4 fill-[#E00000]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.nav.myShortlist} ({shortlistedProperties.length})
              </h2>
              <p className="text-xs text-slate-500">
                Your saved Singapore dream properties for easy comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortlist Items */}
        <div className="p-6 overflow-y-auto space-y-3">
          {shortlistedProperties.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Heart className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Your shortlist is currently empty</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the heart icon on any property listing to save it here.
              </p>
            </div>
          ) : (
            shortlistedProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div 
                  onClick={() => {
                    onSelectProperty(prop);
                    onClose();
                  }}
                  className="flex items-center space-x-3 cursor-pointer w-full sm:w-auto flex-1"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-20 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate hover:text-[#E00000]">
                      {prop.title}
                    </span>
                    <span className="text-sm font-black text-[#E00000] block">
                      {prop.formattedPrice}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {prop.district} • {prop.bedrooms} Beds • {prop.floorAreaSqft} sqft
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(prop.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1 cursor-pointer ${
                        compareList.includes(prop.id)
                          ? 'bg-[#E00000] text-white border-red-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-[#E00000] hover:bg-red-50'
                      }`}
                      title="Compare this property"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{compareList.includes(prop.id) ? 'In Compare' : 'Compare'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onContactAgent(prop);
                      onClose();
                    }}
                    className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                  >
                    Chat Agent
                  </button>
                  <button
                    onClick={() => onRemoveFromShortlist(prop.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
