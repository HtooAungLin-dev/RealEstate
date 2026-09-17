import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed,
  Train,
  X
} from 'lucide-react';
import { FilterState, SupportedLanguage, TransactionType, PropertyCategory } from '../types/property.ts';
import { translations } from '../i18n/translations';
import { SINGAPORE_DISTRICTS } from '../data/properties';

interface HeroSearchBarProps {
  currentLang: SupportedLanguage;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenAdvancedFilters: () => void;
  onSearch: () => void;
  totalResults: number;
}

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({
  currentLang,
  filters,
  onFilterChange,
  onOpenAdvancedFilters,
  onSearch,
  totalResults,
}) => {
  const t = translations[currentLang];
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const topDistricts = [
    { label: 'Orchard (D09)', query: 'D09' },
    { label: 'Marina Bay (D01)', query: 'D01' },
    { label: 'Tanjong Pagar (D02)', query: 'D02' },
    { label: 'East Coast (D15)', query: 'D15' },
    { label: 'Holland / Bukit Timah (D10)', query: 'D10' },
    { label: 'Bishan (D20)', query: 'D20' },
  ];

  const handleTabClick = (tab: 'all' | 'sale' | 'rent' | 'commercial') => {
    if (tab === 'all') {
      onFilterChange({ transactionType: 'all', category: 'all' });
    } else if (tab === 'sale') {
      onFilterChange({ transactionType: 'sale', category: 'all' });
    } else if (tab === 'rent') {
      onFilterChange({ transactionType: 'rent', category: 'all' });
    } else if (tab === 'commercial') {
      onFilterChange({ category: 'commercial' });
    }
  };

  const getActiveTab = () => {
    if (filters.category === 'commercial') return 'commercial';
    if (filters.transactionType === 'sale') return 'sale';
    if (filters.transactionType === 'rent') return 'rent';
    return 'all';
  };

  const activeTab = getActiveTab();

  return (
    <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-900/95 text-white py-10 px-4 sm:px-6 shadow-inner overflow-hidden">
      {/* Subtle architectural background texture */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80')`
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Main Headline */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-['Plus_Jakarta_Sans']">
            {currentLang === 'zh' 
              ? '发现您在新加坡的理想家园'
              : currentLang === 'ms'
              ? 'Cari Kediaman Impian Anda di Singapura'
              : currentLang === 'ta'
              ? 'சிங்கப்பூரில் உங்கள் கனவு இல்லத்தைக் கண்டறியுங்கள்'
              : 'Find Your Dream Property in Singapore'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {t.tagline} • Condos, HDB Flats, Landed Estates & Commercial Spaces
          </p>
        </div>

        {/* Search Box Container */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl text-slate-800 border border-slate-100">
          {/* Segmented Search Tabs */}
          <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-200">
            <button
              id="tab-all-residential"
              onClick={() => handleTabClick('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#E00000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.hero.allResidential}
            </button>
            <button
              id="tab-buy"
              onClick={() => handleTabClick('sale')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'sale'
                  ? 'bg-[#E00000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.hero.buy}
            </button>
            <button
              id="tab-rent"
              onClick={() => handleTabClick('rent')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'rent'
                  ? 'bg-[#E00000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.hero.rent}
            </button>
            <button
              id="tab-commercial"
              onClick={() => handleTabClick('commercial')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'commercial'
                  ? 'bg-[#E00000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.hero.commercial}
            </button>
          </div>

          {/* Search Inputs Row */}
          <div className="pt-3 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            {/* Location & Keyword input */}
            <div className="relative md:col-span-5">
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-500 focus-within:bg-white transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => onFilterChange({ keyword: e.target.value })}
                  onFocus={() => setSuggestionsOpen(true)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
                {filters.keyword && (
                  <button 
                    onClick={() => onFilterChange({ keyword: '' })}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Auto-suggest dropdown */}
              {suggestionsOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-left">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Popular Singapore Enclaves & MRT Stations
                  </div>
                  <div className="space-y-0.5 max-h-56 overflow-y-auto">
                    {SINGAPORE_DISTRICTS.filter(d => d.code !== 'all').map((dist) => (
                      <button
                        key={dist.code}
                        onClick={() => {
                          onFilterChange({ district: dist.code, keyword: dist.name });
                          setSuggestionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 hover:text-[#E00000] rounded-lg flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {dist.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{dist.code}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1 mt-1 text-right">
                    <button
                      onClick={() => setSuggestionsOpen(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Property Type Dropdown */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  id="filter-property-type"
                  value={filters.category}
                  onChange={(e) => onFilterChange({ category: e.target.value as PropertyCategory })}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-red-500 focus:outline-hidden font-medium cursor-pointer pr-8"
                >
                  <option value="all">{t.hero.allTypes}</option>
                  <option value="condo">{t.hero.condo}</option>
                  <option value="hdb">{t.hero.hdb}</option>
                  <option value="landed">{t.hero.landed}</option>
                  <option value="commercial">{t.hero.commercial}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Bedrooms dropdown */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  id="filter-bedrooms"
                  value={filters.bedrooms}
                  onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-red-500 focus:outline-hidden font-medium cursor-pointer pr-8"
                >
                  <option value="all">{t.hero.anyBeds}</option>
                  <option value="studio">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* More Filters Toggle */}
            <div className="md:col-span-1">
              <button
                id="btn-more-filters"
                onClick={onOpenAdvancedFilters}
                className="w-full flex items-center justify-center space-x-1 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                title="Advanced Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden xl:inline">Filters</span>
              </button>
            </div>

            {/* Red Search Button */}
            <div className="md:col-span-2">
              <button
                id="hero-search-btn"
                onClick={onSearch}
                className="w-full flex items-center justify-center space-x-2 bg-[#E00000] hover:bg-[#C00000] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.hero.searchBtn}</span>
              </button>
            </div>
          </div>

          {/* Quick Enclave Pills */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 mr-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-[#E00000]" />
              Popular Enclaves:
            </span>
            {topDistricts.map((item) => (
              <button
                key={item.query}
                onClick={() => onFilterChange({ district: item.query })}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filters.district === item.query
                    ? 'bg-red-100 text-[#E00000] font-bold border border-red-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
            {filters.district !== 'all' && (
              <button
                onClick={() => onFilterChange({ district: 'all' })}
                className="text-xs text-red-600 font-semibold hover:underline ml-2"
              >
                Clear Location
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
