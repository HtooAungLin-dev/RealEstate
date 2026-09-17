import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  List, 
  Columns, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Bell, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Info,
  X
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroSearchBar } from './components/HeroSearchBar';
import { AdvancedFilterModal } from './components/AdvancedFilterModal';
import { PropertyCard } from './components/PropertyCard';
import { PropertyMap } from './components/PropertyMap';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { DirectMessagingDrawer } from './components/DirectMessagingDrawer';
import { SavedSearchModal } from './components/SavedSearchModal';
import { AuthModal } from './components/AuthModal';
import { ShortlistModal } from './components/ShortlistModal';
import { ComparePropertiesModal } from './components/ComparePropertiesModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { Footer } from './components/Footer';

import { 
  Property, 
  FilterState, 
  SupportedLanguage, 
  PropertyCategory, 
  TransactionType 
} from './types/property';
import { SINGAPORE_PROPERTIES } from './data/properties';
import { translations } from './i18n/translations';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

export default function App() {
  // Multi-Language State (English, Chinese, Malay, Tamil)
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const t = translations[currentLang];

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    transactionType: 'all',
    category: 'all',
    minPrice: 0,
    maxPrice: 100000000,
    bedrooms: 'all',
    bathrooms: 'all',
    district: 'all',
    mrtLine: 'all',
    tenure: 'any',
    furnishing: 'any',
    verifiedOnly: false,
    virtualTourOnly: false,
    sortBy: 'recommended',
  });

  // UI View Modes: 'split' (List + Map), 'list', 'map'
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [activeNavTab, setActiveNavTab] = useState('buy');

  // Interactive Property State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Shortlist State (Persisted)
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('propertyguru_shortlist');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-4'];
    } catch {
      return ['prop-1', 'prop-4'];
    }
  });

  // Compare State (Persisted)
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('propertyguru_compare');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Messaging Drawer State
  const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);
  const [activeChatProperty, setActiveChatProperty] = useState<Property | null>(null);

  // Modals
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [savedSearchModalOpen, setSavedSearchModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);

  // Saved Searches count
  const [savedAlertsCount, setSavedAlertsCount] = useState(1);
  const [toastAlert, setToastAlert] = useState<{ title: string; message: string } | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save shortlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('propertyguru_shortlist', JSON.stringify(shortlist));
    } catch {
      // Ignore
    }
  }, [shortlist]);

  // Save compareList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('propertyguru_compare', JSON.stringify(compareList));
    } catch {
      // Ignore
    }
  }, [compareList]);

  // Sync Nav Tab with Transaction Type Filter
  const handleSelectNavTab = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'buy') {
      setFilters((prev) => ({ ...prev, transactionType: 'sale', category: 'all' }));
    } else if (tab === 'rent') {
      setFilters((prev) => ({ ...prev, transactionType: 'rent', category: 'all' }));
    } else if (tab === 'new_launches') {
      setFilters((prev) => ({ ...prev, transactionType: 'sale', keyword: 'Launch' }));
    } else if (tab === 'commercial') {
      setFilters((prev) => ({ ...prev, category: 'commercial' }));
    } else {
      setFilters((prev) => ({ ...prev, transactionType: 'all', category: 'all', keyword: '' }));
    }
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((prop) => {
      // Transaction Type
      if (filters.transactionType !== 'all' && prop.transactionType !== filters.transactionType) {
        return false;
      }
      // Category
      if (filters.category !== 'all' && prop.category !== filters.category) {
        return false;
      }
      // District
      if (filters.district !== 'all' && prop.district !== filters.district) {
        return false;
      }
      // MRT Line
      if (filters.mrtLine !== 'all' && !prop.mrtLines.includes(filters.mrtLine as any)) {
        return false;
      }
      // Price
      if (filters.minPrice > 0 && prop.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice < 100000000 && prop.price > filters.maxPrice) {
        return false;
      }
      // Bedrooms
      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === 'studio' && prop.bedrooms !== 0) return false;
        if (filters.bedrooms === '5' && prop.bedrooms < 5) return false;
        if (filters.bedrooms !== 'studio' && filters.bedrooms !== '5' && prop.bedrooms !== Number(filters.bedrooms)) {
          return false;
        }
      }
      // Bathrooms
      if (filters.bathrooms !== 'all' && prop.bathrooms < Number(filters.bathrooms)) {
        return false;
      }
      // Tenure
      if (filters.tenure !== 'any' && !prop.tenure.toLowerCase().includes(filters.tenure.toLowerCase())) {
        return false;
      }
      // Furnishing
      if (filters.furnishing !== 'any' && !prop.furnishing.toLowerCase().includes(filters.furnishing.toLowerCase())) {
        return false;
      }
      // Verified only
      if (filters.verifiedOnly && !prop.verifiedListing) {
        return false;
      }
      // Virtual Tour only
      if (filters.virtualTourOnly && !prop.virtualTourAvailable) {
        return false;
      }
      // Keyword
      if (filters.keyword.trim()) {
        const q = filters.keyword.toLowerCase();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.project.toLowerCase().includes(q) ||
          prop.address.toLowerCase().includes(q) ||
          prop.district.toLowerCase().includes(q) ||
          prop.districtName.toLowerCase().includes(q) ||
          prop.mrtStation.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'psf_asc') return a.pricePerSqft - b.pricePerSqft;
      if (filters.sortBy === 'size_desc') return b.floorAreaSqft - a.floorAreaSqft;
      if (filters.sortBy === 'newest') {
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      }
      return 0; // recommended default
    });
  }, [filters]);

  // Shortlist Handlers
  const handleToggleShortlist = (propertyId: string) => {
    setShortlist((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const shortlistedItems = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((p) => shortlist.includes(p.id));
  }, [shortlist]);

  // Compare Handlers
  const handleToggleCompare = (propertyId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        if (prev.length >= 4) {
          setToastAlert({
            title: 'Comparison Limit Reached',
            message: t.compare?.maxReached || 'Maximum 4 properties can be compared simultaneously.',
          });
          return prev;
        }
        return [...prev, propertyId];
      }
    });
  };

  const handleAddCompare = (propertyId: string) => {
    if (!compareList.includes(propertyId)) {
      if (compareList.length >= 4) {
        setToastAlert({
          title: 'Comparison Limit Reached',
          message: t.compare?.maxReached || 'Maximum 4 properties can be compared simultaneously.',
        });
        return;
      }
      setCompareList((prev) => [...prev, propertyId]);
    }
  };

  const handleRemoveCompare = (propertyId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== propertyId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const comparedPropertiesList = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((p) => compareList.includes(p.id));
  }, [compareList]);

  // Agent Contact Handlers
  const handleContactAgent = (property: Property) => {
    setActiveChatProperty(property);
    setMessageDrawerOpen(true);
  };

  // Property Selection
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
  };

  // Simulated Alert Trigger
  const handleTriggerSimulatedAlert = (alertTitle: string) => {
    setToastAlert({
      title: `New Property Alert: ${alertTitle}`,
      message: 'A brand new high-floor unit matching your alert was just listed on PropertyGuru Singapore!',
    });
    setTimeout(() => setToastAlert(null), 6000);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans'] text-slate-800 antialiased selection:bg-red-500 selection:text-white">
      {/* Toast Alert Notification */}
      {toastAlert && (
        <div className="fixed top-18 right-4 z-50 bg-[#1E293B] text-white p-4 rounded-2xl shadow-2xl border border-red-500 max-w-sm animate-bounce">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E00000] flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{toastAlert.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {toastAlert.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setToastAlert(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        savedAlertsCount={savedAlertsCount}
        unreadMessagesCount={1}
        shortlistCount={shortlist.length}
        compareCount={compareList.length}
        onOpenAlerts={() => setSavedSearchModalOpen(true)}
        onOpenMessages={() => {
          setActiveChatProperty(filteredProperties[0] || SINGAPORE_PROPERTIES[0]);
          setMessageDrawerOpen(true);
        }}
        onOpenShortlist={() => setShortlistModalOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        user={currentUser}
        onSignOut={handleSignOut}
        activeNavTab={activeNavTab}
        onSelectNavTab={handleSelectNavTab}
      />

      {/* Hero Search Section */}
      <HeroSearchBar
        currentLang={currentLang}
        filters={filters}
        onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        onOpenAdvancedFilters={() => setAdvancedFiltersOpen(true)}
        onSearch={() => {}}
        totalResults={filteredProperties.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Results Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {filters.district !== 'all' ? `Properties in ${filters.district}` : 'All Singapore Properties'}
              </h2>
              <span className="bg-red-50 text-[#E00000] text-xs font-bold px-2 py-0.5 rounded-md">
                {filteredProperties.length} {t.results?.found || 'properties found in Singapore'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified by CEA Registered Real Estate Agencies in Singapore
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Save Search Alert Button */}
            <button
              id="save-current-search-btn"
              onClick={() => setSavedSearchModalOpen(true)}
              className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-[#E00000] text-xs font-bold px-3.5 py-2 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t.results?.saveSearch || 'Save Search Alert'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {t.results?.sortBy || 'Sort By'}:
              </span>
              <select
                id="sort-by-select"
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="recommended">{t.results?.sortRecommended || 'Recommended'}</option>
                <option value="price_asc">{t.results?.sortPriceLow || 'Price: Low to High'}</option>
                <option value="price_desc">{t.results?.sortPriceHigh || 'Price: High to Low'}</option>
                <option value="psf_asc">{t.results?.sortPsf || 'PSF: Low to High'}</option>
                <option value="size_desc">{t.results?.sortSize || 'Floor Area: Largest'}</option>
                <option value="newest">{t.results?.sortNewest || 'Newest Listed'}</option>
              </select>
            </div>

            {/* View Mode Toggle (Split / List / Map) */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="view-split-btn"
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Split List & Map View"
              >
                <Columns className="w-4 h-4" />
                <span>Split</span>
              </button>
              <button
                id="view-list-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List Only"
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                id="view-map-btn"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Map Only"
              >
                <MapIcon className="w-4 h-4" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 text-xs font-bold text-slate-700">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'condo', label: 'Condominiums' },
            { id: 'hdb', label: 'HDB Flats (Resale)' },
            { id: 'landed', label: 'Landed Houses' },
            { id: 'commercial', label: 'Commercial Spaces' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id as any }))}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                filters.category === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Display based on View Mode */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No properties matched your exact criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your price range, clearing district filters, or searching for popular enclaves like Orchard (D09) or Marina Bay (D01).
            </p>
            <button
              onClick={() =>
                setFilters({
                  keyword: '',
                  transactionType: 'all',
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 100000000,
                  bedrooms: 'all',
                  bathrooms: 'all',
                  district: 'all',
                  mrtLine: 'all',
                  tenure: 'any',
                  furnishing: 'any',
                  verifiedOnly: false,
                  virtualTourOnly: false,
                  sortBy: 'recommended',
                })
              }
              className="mt-4 bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'split' ? (
          /* Split View: 50% List / 50% Interactive Real-Time Map */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Property Cards Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currentLang={currentLang}
                    isShortlisted={shortlist.includes(property.id)}
                    onToggleShortlist={handleToggleShortlist}
                    onSelectProperty={handleSelectProperty}
                    onContactAgent={handleContactAgent}
                    isInCompare={compareList.includes(property.id)}
                    onToggleCompare={handleToggleCompare}
                    isHighlighted={hoveredPropertyId === property.id}
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                  />
                ))}
              </div>
            </div>

            {/* Sticky Real-time Map Column */}
            <div className="lg:col-span-5 sticky top-22 h-[calc(100vh-120px)] hidden lg:block">
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                hoveredPropertyId={hoveredPropertyId}
                onSelectProperty={handleSelectProperty}
                onContactAgent={handleContactAgent}
                currentLang={currentLang}
              />
            </div>
          </div>
        ) : viewMode === 'list' ? (
          /* Full Width List Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currentLang={currentLang}
                isShortlisted={shortlist.includes(property.id)}
                onToggleShortlist={handleToggleShortlist}
                onSelectProperty={handleSelectProperty}
                onContactAgent={handleContactAgent}
                isInCompare={compareList.includes(property.id)}
                onToggleCompare={handleToggleCompare}
                isHighlighted={hoveredPropertyId === property.id}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
              />
            ))}
          </div>
        ) : (
          /* Full Screen Map View */
          <div className="h-[75vh] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              hoveredPropertyId={hoveredPropertyId}
              onSelectProperty={handleSelectProperty}
              onContactAgent={handleContactAgent}
              currentLang={currentLang}
            />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <AdvancedFilterModal
        isOpen={advancedFiltersOpen}
        onClose={() => setAdvancedFiltersOpen(false)}
        filters={filters}
        onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        onReset={() =>
          setFilters({
            keyword: '',
            transactionType: 'all',
            category: 'all',
            minPrice: 0,
            maxPrice: 100000000,
            bedrooms: 'all',
            bathrooms: 'all',
            district: 'all',
            mrtLine: 'all',
            tenure: 'any',
            furnishing: 'any',
            verifiedOnly: false,
            virtualTourOnly: false,
            sortBy: 'recommended',
          })
        }
        currentLang={currentLang}
        totalMatches={filteredProperties.length}
      />

      <PropertyDetailModal
        property={selectedProperty}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isShortlisted={selectedProperty ? shortlist.includes(selectedProperty.id) : false}
        onToggleShortlist={handleToggleShortlist}
        onContactAgent={handleContactAgent}
        isInCompare={selectedProperty ? compareList.includes(selectedProperty.id) : false}
        onToggleCompare={handleToggleCompare}
        currentLang={currentLang}
      />

      <DirectMessagingDrawer
        isOpen={messageDrawerOpen}
        onClose={() => setMessageDrawerOpen(false)}
        property={activeChatProperty}
        currentLang={currentLang}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <SavedSearchModal
        isOpen={savedSearchModalOpen}
        onClose={() => setSavedSearchModalOpen(false)}
        currentFilters={filters}
        currentLang={currentLang}
        onApplySavedFilter={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
      />

      <ShortlistModal
        isOpen={shortlistModalOpen}
        onClose={() => setShortlistModalOpen(false)}
        shortlistedProperties={shortlistedItems}
        onRemoveFromShortlist={handleToggleShortlist}
        onSelectProperty={handleSelectProperty}
        onContactAgent={handleContactAgent}
        compareList={compareList}
        onToggleCompare={handleToggleCompare}
        onOpenCompare={() => setCompareModalOpen(true)}
        currentLang={currentLang}
      />

      {/* Compare Properties Modal */}
      <ComparePropertiesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        comparedProperties={comparedPropertiesList}
        allProperties={SINGAPORE_PROPERTIES}
        onAddProperty={handleAddCompare}
        onRemoveProperty={handleRemoveCompare}
        onContactAgent={handleContactAgent}
        currentLang={currentLang}
      />

      {/* Floating Comparison Drawer Bar */}
      <CompareFloatingBar
        comparedProperties={comparedPropertiesList}
        onRemoveProperty={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onOpenCompareModal={() => setCompareModalOpen(true)}
        currentLang={currentLang}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onManualLogin={setCurrentUser}
        onSignOut={handleSignOut}
        currentLang={currentLang}
      />

      {/* Footer */}
      <Footer currentLang={currentLang} />
    </div>
  );
}
