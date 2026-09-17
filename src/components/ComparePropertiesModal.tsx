import React, { useState, useMemo } from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Check, 
  Minus, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  Printer, 
  Plus, 
  ShieldCheck, 
  Compass, 
  Sparkles,
  Train,
  Building,
  Bed,
  Bath,
  Maximize2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface ComparePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: Property[];
  allProperties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onAddProperty: (propertyId: string) => void;
  onClearAll: () => void;
  onSelectProperty: (property: Property) => void;
  onContactAgent: (property: Property) => void;
  currentLang: SupportedLanguage;
}

export const ComparePropertiesModal: React.FC<ComparePropertiesModalProps> = ({
  isOpen,
  onClose,
  comparedProperties,
  allProperties,
  onRemoveProperty,
  onAddProperty,
  onClearAll,
  onSelectProperty,
  onContactAgent,
  currentLang,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const t = translations[currentLang];

  // Candidates that are not yet in comparison
  const availableToAdd = useMemo(() => {
    const comparedIds = new Set(comparedProperties.map((p) => p.id));
    return allProperties.filter((p) => !comparedIds.has(p.id));
  }, [comparedProperties, allProperties]);

  // Aggregate all unique features/amenities across all compared properties
  const allFeaturesList = useMemo(() => {
    const standardAmenities = [
      'Swimming Pool',
      'Infinity Lap Pool & Aqua Gym',
      'Gym / Fitness Studio',
      'Tennis Courts',
      '24/7 Security & Concierge',
      'Concierge Service',
      'BBQ Pavilions',
      'Sky Garden & Viewing Lounge',
      'Jacuzzi / Spa Pool',
      'Children Playground',
      'Clubhouse & Function Rooms',
      'Direct Underground Link to MRT',
      'Private Lift Lobby',
      'High Ceiling',
      'Covered Carpark',
    ];

    const foundFeatures = new Set<string>();
    comparedProperties.forEach((p) => {
      p.features.forEach((feat) => foundFeatures.add(feat));
    });

    // Merge standard and custom, keeping unique list
    const combined = Array.from(new Set([...standardAmenities, ...Array.from(foundFeatures)]));
    return combined.slice(0, 14); // Keep top 14 relevant amenities
  }, [comparedProperties]);

  // Find best value metrics for comparison highlights
  const metrics = useMemo(() => {
    if (comparedProperties.length === 0) return { lowestPsf: 0, largestArea: 0, closestMrt: 0 };

    const lowestPsf = Math.min(...comparedProperties.map((p) => p.pricePerSqft));
    const largestArea = Math.max(...comparedProperties.map((p) => p.floorAreaSqft));
    const closestMrt = Math.min(...comparedProperties.map((p) => p.mrtWalkMinutes));

    return { lowestPsf, largestArea, closestMrt };
  }, [comparedProperties]);

  if (!isOpen) return null;

  // Check if all values across compared properties are the same
  const isRowDifferent = (getter: (p: Property) => any) => {
    if (comparedProperties.length < 2) return false;
    const firstVal = JSON.stringify(getter(comparedProperties[0]));
    return comparedProperties.some((p) => JSON.stringify(getter(p)) !== firstVal);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for MRT badge color
  const getMrtBadgeClass = (line: string) => {
    switch (line) {
      case 'NSL':
        return 'bg-red-600 text-white';
      case 'EWL':
        return 'bg-emerald-600 text-white';
      case 'CCL':
        return 'bg-amber-500 text-slate-900';
      case 'DTL':
        return 'bg-blue-600 text-white';
      case 'TEL':
        return 'bg-amber-800 text-white';
      case 'NEL':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  // Mortgage estimate helper (MAS 75% LTV, 30 years, 3.5%)
  const calculateMortgage = (price: number, type: 'sale' | 'rent') => {
    if (type === 'rent') return price;
    const loanAmount = price * 0.75;
    const monthlyRate = 0.035 / 12;
    const months = 30 * 12;
    return Math.round((loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-2 sm:p-4 md:p-6 backdrop-blur-xs">
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E00000] border border-red-200 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {t.compare?.compareTitle || 'Compare Properties'}
                </h2>
                <span className="bg-red-50 text-[#E00000] text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                  {comparedProperties.length} / 4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.compare?.compareSubtitle || 'Side-by-side comparison across pricing, floor plans, MRT proximity, and amenities'}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Highlight Differences Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-3.5 h-3.5 text-[#E00000] rounded focus:ring-red-500 accent-[#E00000] cursor-pointer"
              />
              <span className="hidden md:inline">{t.compare?.highlightDifferences || 'Highlight Differences'}</span>
              <span className="md:hidden">Diffs</span>
            </label>

            {/* Print Report */}
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer hidden sm:flex items-center space-x-1.5 text-xs font-semibold"
              title={t.compare?.printReport || 'Print Comparison Report'}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">{t.compare?.printReport || 'Print'}</span>
            </button>

            {/* Clear All */}
            {comparedProperties.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                {t.compare?.clearAll || 'Clear All'}
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-auto flex-1 p-4 sm:p-6 bg-slate-50/50">
          {comparedProperties.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 text-[#E00000] flex items-center justify-center">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {t.compare?.noPropertiesSelected || 'No properties selected for comparison'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Click the "Compare" button on any Singapore condo, HDB resale, or landed listing to compare features side-by-side.
              </p>
              <button
                onClick={onClose}
                className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Browse Singapore Properties
              </button>
            </div>
          ) : (
            <div className="min-w-[700px]">
              {/* Notice if only 1 property */}
              {comparedProperties.length === 1 && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-800">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t.compare?.selectAtLeastTwo || 'Select at least 2 properties to view a side-by-side comparison.'}</span>
                  </div>
                  {availableToAdd.length > 0 && (
                    <button
                      onClick={() => onAddProperty(availableToAdd[0].id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      + Add {availableToAdd[0].project}
                    </button>
                  )}
                </div>
              )}

              {/* Comparison Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full border-collapse text-left">
                  {/* Property Header Cards Row */}
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="p-4 w-48 sm:w-56 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100/70 align-top">
                        <div className="pt-2">
                          <span className="text-slate-800 font-extrabold text-sm block mb-1">
                            Listing Comparison
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            Comparing {comparedProperties.length} of 4 maximum
                          </span>

                          {/* Add Property Dropdown if < 4 */}
                          {comparedProperties.length < 4 && availableToAdd.length > 0 && (
                            <div className="relative mt-4">
                              <button
                                onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-dashed border-slate-300 shadow-xs transition-colors cursor-pointer"
                              >
                                <span className="flex items-center text-[#E00000]">
                                  <Plus className="w-3.5 h-3.5 mr-1" />
                                  {t.compare?.addProperty || 'Add Property'}
                                </span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                              </button>

                              {addDropdownOpen && (
                                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-60 overflow-y-auto">
                                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Choose from listings
                                  </div>
                                  {availableToAdd.map((p) => (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        onAddProperty(p.id);
                                        setAddDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
                                    >
                                      <img
                                        src={p.images[0]}
                                        alt={p.title}
                                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                                      />
                                      <div className="truncate flex-1">
                                        <div className="font-bold text-slate-800 truncate">{p.project}</div>
                                        <div className="text-[11px] text-[#E00000] font-semibold">{p.formattedPrice}</div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </th>

                      {/* Property Columns Header */}
                      {comparedProperties.map((prop) => (
                        <th key={prop.id} className="p-4 align-top border-l border-slate-200 min-w-[220px] max-w-[280px]">
                          <div className="relative group">
                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveProperty(prop.id)}
                              className="absolute -top-2 -right-2 bg-white hover:bg-red-500 hover:text-white text-slate-400 p-1.5 rounded-full border border-slate-200 shadow-md transition-colors cursor-pointer z-10"
                              title={t.compare?.removeFromCompare || 'Remove from comparison'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Property Thumbnail Image */}
                            <div 
                              onClick={() => onSelectProperty(prop)}
                              className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 cursor-pointer mb-2.5 group-hover:opacity-95"
                            >
                              <img
                                src={prop.images[0]}
                                alt={prop.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                {prop.verifiedListing && (
                                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center">
                                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                                    CEA
                                  </span>
                                )}
                                <span className="bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  {prop.district}
                                </span>
                              </div>
                              <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                {prop.tenure.includes('Freehold') ? 'Freehold' : '99-Yr'}
                              </div>
                            </div>

                            {/* Price and Title */}
                            <div className="mb-2">
                              <div className="text-lg font-black text-[#E00000] tracking-tight">
                                {prop.formattedPrice}
                              </div>
                              <div className="text-xs font-semibold text-slate-500">
                                S$ {prop.pricePerSqft.toLocaleString()} psf
                              </div>
                              <h4 
                                onClick={() => onSelectProperty(prop)}
                                className="text-xs font-bold text-slate-900 line-clamp-2 mt-1 hover:text-[#E00000] cursor-pointer"
                              >
                                {prop.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-normal truncate">
                                {prop.project} • {prop.address}
                              </p>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex items-center space-x-1.5 pt-1">
                              <button
                                onClick={() => onSelectProperty(prop)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => onContactAgent(prop)}
                                className="bg-[#E00000] hover:bg-[#C00000] text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                                title="Chat with Agent"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`https://wa.me/${prop.agent.whatsapp}?text=${encodeURIComponent(
                                  `Hi ${prop.agent.name}, I'm comparing "${prop.title}" on RealEstate Singapore.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="WhatsApp Agent"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </th>
                      ))}

                      {/* Empty Placeholder Slots to fill up to 4 */}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, index) => (
                        <th key={`empty-slot-${index}`} className="p-4 align-top border-l border-slate-200 hidden md:table-cell min-w-[200px]">
                          <div 
                            onClick={() => {
                              if (availableToAdd.length > 0) {
                                onAddProperty(availableToAdd[0].id);
                              }
                            }}
                            className="aspect-16/10 rounded-xl border-2 border-dashed border-slate-200 hover:border-red-300 bg-slate-50/50 hover:bg-red-50/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-1.5 shadow-xs">
                              <Plus className="w-4 h-4 text-[#E00000]" />
                            </div>
                            <span className="text-xs font-bold text-slate-600">
                              + Add Listing
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              Slot {comparedProperties.length + index + 1} of 4
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* SECTION 1: PRICING & FINANCIALS */}
                    <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                      <td colSpan={1 + comparedProperties.length + (4 - comparedProperties.length)} className="px-4 py-2 font-black text-xs uppercase tracking-wider text-slate-700">
                        {t.compare?.keyPricing || 'Pricing & Financials'}
                      </td>
                    </tr>

                    {/* Listing Price */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.price) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Price
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                          <span className="font-extrabold text-[#E00000] text-sm">
                            {p.formattedPrice}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {p.transactionType === 'sale' ? 'For Sale' : 'For Rent'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Price Per Sq Ft (PSF) */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.pricePerSqft) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Price Per Sq Ft (PSF)
                      </td>
                      {comparedProperties.map((p) => {
                        const isBestPsf = p.pricePerSqft === metrics.lowestPsf && comparedProperties.length > 1;
                        return (
                          <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                            <span className="font-bold text-slate-800">
                              S$ {p.pricePerSqft.toLocaleString()} psf
                            </span>
                            {isBestPsf && (
                              <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                                {t.compare?.bestValuePsf || 'Lowest PSF'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Est. Monthly Mortgage */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.price) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Est. Monthly Mortgage
                        <span className="text-[10px] text-slate-400 font-normal block">MAS 75% LTV, 30-Yr</span>
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                          <span className="font-semibold text-slate-800">
                            ~S$ {calculateMortgage(p.price, p.transactionType).toLocaleString()} /mo
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Monthly Maintenance Fee */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.maintenanceFeeMonthly) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Maintenance Fee
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700">
                          {p.maintenanceFeeMonthly ? `S$ ${p.maintenanceFeeMonthly} /month` : 'Contact Agent'}
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* SECTION 2: SPACE & LAYOUT */}
                    <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                      <td colSpan={1 + comparedProperties.length + (4 - comparedProperties.length)} className="px-4 py-2 font-black text-xs uppercase tracking-wider text-slate-700">
                        {t.compare?.spaceLayout || 'Space & Layout'}
                      </td>
                    </tr>

                    {/* Bedrooms & Bathrooms */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => `${p.bedrooms}-${p.bathrooms}`) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Bedrooms & Baths
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                          <div className="flex items-center space-x-3 font-semibold text-slate-800">
                            <span className="flex items-center">
                              <Bed className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} Beds`}
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {p.bathrooms} Baths
                            </span>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Floor Area */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.floorAreaSqft) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Floor Area
                      </td>
                      {comparedProperties.map((p) => {
                        const isLargest = p.floorAreaSqft === metrics.largestArea && comparedProperties.length > 1;
                        return (
                          <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                            <span className="font-bold text-slate-800">
                              {p.floorAreaSqft.toLocaleString()} sqft
                            </span>
                            <span className="text-[11px] text-slate-400 ml-1.5">
                              ({p.floorAreaSqm} sqm)
                            </span>
                            {isLargest && (
                              <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800">
                                {t.compare?.largestArea || 'Largest'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Floor Level */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.floorLevel) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Floor Level
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700 font-medium">
                          {p.floorLevel} Floor
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Facing & View */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.facing) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Facing & View
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700">
                          {p.facing}
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Furnishing */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.furnishing) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Furnishing
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700">
                          {p.furnishing}
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* SECTION 3: LOCATION & CONNECTIVITY */}
                    <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                      <td colSpan={1 + comparedProperties.length + (4 - comparedProperties.length)} className="px-4 py-2 font-black text-xs uppercase tracking-wider text-slate-700">
                        {t.compare?.buildingLocation || 'Location & Connectivity'}
                      </td>
                    </tr>

                    {/* District */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.district) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        District
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                          <span className="font-bold text-slate-800">{p.district}</span>
                          <span className="text-slate-500 block text-[11px]">{p.districtName}</span>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Nearest MRT & Walk Time */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.mrtWalkMinutes) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Nearest MRT
                      </td>
                      {comparedProperties.map((p) => {
                        const isClosest = p.mrtWalkMinutes === metrics.closestMrt && comparedProperties.length > 1;
                        return (
                          <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                            <div className="flex items-center text-emerald-700 font-bold mb-1">
                              <Train className="w-3.5 h-3.5 mr-1" />
                              <span>{p.mrtWalkMinutes} mins walk</span>
                              {isClosest && (
                                <span className="ml-1.5 px-1 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                  {t.compare?.nearestMrt || 'Closest'}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-600 text-[11px] block">{p.mrtStation}</span>
                            {/* MRT Line Badges */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {p.mrtLines.map((line) => (
                                <span
                                  key={line}
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${getMrtBadgeClass(line)}`}
                                >
                                  {line}
                                </span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Nearby Schools */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.nearbySchools.join(',')) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Nearby Schools
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700">
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {p.nearbySchools.map((s, idx) => (
                              <li key={idx} className="truncate">{s}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Tenure & TOP */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.tenure) ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Tenure & TOP Year
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs">
                          <span className={`font-bold ${p.tenure.includes('Freehold') ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {p.tenure}
                          </span>
                          <span className="text-slate-500 block text-[11px]">
                            TOP {p.topYear} ({2026 - p.topYear} yrs old)
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* Developer */}
                    <tr className={`border-b border-slate-100 ${highlightDifferences && isRowDifferent((p) => p.developer || '') ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Developer
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 border-l border-slate-200 text-xs text-slate-700">
                          {p.developer || 'Reputable Developer'}
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>

                    {/* SECTION 4: KEY AMENITIES & FACILITIES */}
                    <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                      <td colSpan={1 + comparedProperties.length + (4 - comparedProperties.length)} className="px-4 py-2 font-black text-xs uppercase tracking-wider text-slate-700">
                        {t.compare?.amenitiesFacilities || 'Key Amenities & Facilities'}
                      </td>
                    </tr>

                    {allFeaturesList.map((featureName) => {
                      const hasDifferences = isRowDifferent((p) => p.features.some((f) => f.toLowerCase().includes(featureName.toLowerCase())));
                      return (
                        <tr 
                          key={featureName} 
                          className={`border-b border-slate-100 ${highlightDifferences && hasDifferences ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'}`}
                        >
                          <td className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50/50">
                            {featureName}
                          </td>
                          {comparedProperties.map((p) => {
                            const hasFeature = p.features.some(
                              (f) => f.toLowerCase().includes(featureName.toLowerCase()) || 
                                     featureName.toLowerCase().includes(f.toLowerCase())
                            );
                            return (
                              <td key={p.id} className="px-4 py-2 border-l border-slate-200 text-xs text-center">
                                {hasFeature ? (
                                  <div className="inline-flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                                    <Check className="w-3.5 h-3.5 mr-1" />
                                    <span>Yes</span>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center text-slate-300 font-normal">
                                    <Minus className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                            <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                          ))}
                        </tr>
                      );
                    })}

                    {/* SECTION 5: CEA AGENT & ASSISTANCE */}
                    <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                      <td colSpan={1 + comparedProperties.length + (4 - comparedProperties.length)} className="px-4 py-2 font-black text-xs uppercase tracking-wider text-slate-700">
                        {t.compare?.agentDetails || 'CEA Estate Agent & Contact'}
                      </td>
                    </tr>

                    {/* Agent Card Row */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-xs font-bold text-slate-600 bg-slate-50/50">
                        Listing Agent
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-3 border-l border-slate-200 text-xs">
                          <div className="flex items-center space-x-2.5 mb-2">
                            <img
                              src={p.agent.avatar}
                              alt={p.agent.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">
                                {p.agent.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {p.agent.agency}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                CEA: {p.agent.ceaRegNo}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                onClose();
                                onContactAgent(p);
                              }}
                              className="flex-1 bg-[#E00000] hover:bg-[#C00000] text-white font-bold py-1.5 px-2 rounded-lg text-center text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-xs"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Chat Now</span>
                            </button>
                            <a
                              href={`https://wa.me/${p.agent.whatsapp}?text=${encodeURIComponent(
                                `Hi ${p.agent.name}, I am comparing "${p.title}" on RealEstate.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-colors"
                              title="WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={i} className="border-l border-slate-200 hidden md:table-cell" />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All property records verified against CEA Singapore public register</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
