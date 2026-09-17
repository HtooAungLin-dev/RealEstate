import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { FilterState, SupportedLanguage, TenureType, FurnishingType } from '../types/property.ts';
import { SINGAPORE_DISTRICTS, SINGAPORE_MRT_LINES } from '../data/properties';
import { translations } from '../i18n/translations';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  currentLang: SupportedLanguage;
  totalMatches: number;
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  currentLang,
  totalMatches,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const isRent = filters.transactionType === 'rent';

  const pricePresets = isRent
    ? [
        { label: '< S$ 3,000', min: 0, max: 3000 },
        { label: 'S$ 3,000 - 6,000', min: 3000, max: 6000 },
        { label: 'S$ 6,000 - 10,000', min: 6000, max: 10000 },
        { label: 'S$ 10,000+', min: 10000, max: 100000 },
      ]
    : [
        { label: '< S$ 1M', min: 0, max: 1000000 },
        { label: 'S$ 1M - 2M', min: 1000000, max: 2000000 },
        { label: 'S$ 2M - 4M', min: 2000000, max: 4000000 },
        { label: 'S$ 4M+', min: 4000000, max: 100000000 },
      ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {t.hero.moreFilters}
            </h2>
            <p className="text-xs text-slate-500">
              Refine your Singapore property search criteria
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Listings' },
                { id: 'sale', label: 'Buy (For Sale)' },
                { id: 'rent', label: 'Rent (For Rent)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onFilterChange({ transactionType: item.id as any })}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    filters.transactionType === item.id
                      ? 'bg-[#E00000] text-white border-[#E00000] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* District / Enclave Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Singapore District / Location
            </label>
            <select
              value={filters.district}
              onChange={(e) => onFilterChange({ district: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              {SINGAPORE_DISTRICTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Price Range (SGD)
              </label>
              <span className="text-xs text-slate-500">
                {filters.minPrice > 0 ? `S$ ${filters.minPrice.toLocaleString()}` : 'No Min'} –{' '}
                {filters.maxPrice < 100000000 ? `S$ ${filters.maxPrice.toLocaleString()}` : 'No Max'}
              </span>
            </div>

            {/* Price Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {pricePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onFilterChange({ minPrice: preset.min, maxPrice: preset.max })}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    filters.minPrice === preset.min && filters.maxPrice === preset.max
                      ? 'bg-red-50 text-[#E00000] border-red-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Min/Max Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Min Price (SGD)"
                  value={filters.minPrice || ''}
                  onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Price (SGD)"
                  value={filters.maxPrice === 100000000 ? '' : filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) || 100000000 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Bedrooms
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[
                { id: 'all', label: 'Any' },
                { id: 'studio', label: 'Studio' },
                { id: '1', label: '1 Bed' },
                { id: '2', label: '2 Beds' },
                { id: '3', label: '3 Beds' },
                { id: '4', label: '4 Beds' },
                { id: '5', label: '5+ Beds' },
              ].map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => onFilterChange({ bedrooms: bed.id })}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                    filters.bedrooms === bed.id
                      ? 'bg-[#E00000] text-white border-[#E00000]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {bed.label}
                </button>
              ))}
            </div>
          </div>

          {/* MRT Line Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Singapore MRT Station Line Proximity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SINGAPORE_MRT_LINES.map((line) => (
                <button
                  key={line.code}
                  onClick={() => onFilterChange({ mrtLine: line.code })}
                  className={`flex items-center px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    filters.mrtLine === line.code
                      ? 'bg-red-50 border-red-400 text-[#E00000] font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <span>{line.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tenure & Furnishing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Property Tenure
              </label>
              <select
                value={filters.tenure}
                onChange={(e) => onFilterChange({ tenure: e.target.value as TenureType })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="any">Any Tenure</option>
                <option value="freehold">Freehold</option>
                <option value="99-year">99-Year Leasehold</option>
                <option value="999-year">999-Year Leasehold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Furnishing
              </label>
              <select
                value={filters.furnishing}
                onChange={(e) => onFilterChange({ furnishing: e.target.value as FurnishingType })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="any">Any Furnishing</option>
                <option value="fully">Fully Furnished</option>
                <option value="partially">Partially Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Exclusive Toggles */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
                className="w-4 h-4 text-[#E00000] rounded focus:ring-red-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                Verified Listings Only (CEA Certified Agents & Documented Ownership)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.virtualTourOnly}
                onChange={(e) => onFilterChange({ virtualTourOnly: e.target.checked })}
                className="w-4 h-4 text-[#E00000] rounded focus:ring-red-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                360° Virtual Tour Available
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {t.hero.resetFilters}
          </button>

          <button
            onClick={onClose}
            className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Show {totalMatches} Matching Properties
          </button>
        </div>
      </div>
    </div>
  );
};
