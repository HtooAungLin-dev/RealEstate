import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Trash2, 
  Check, 
  Clock, 
  Sparkles, 
  SlidersHorizontal,
  Mail,
  Smartphone
} from 'lucide-react';
import { FilterState, SavedSearch, SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface SavedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterState;
  currentLang: SupportedLanguage;
  onApplySavedFilter: (filters: Partial<FilterState>) => void;
  onTriggerSimulatedAlert: (alertTitle: string) => void;
}

export const SavedSearchModal: React.FC<SavedSearchModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  currentLang,
  onApplySavedFilter,
  onTriggerSimulatedAlert,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [alertTitle, setAlertTitle] = useState('');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Default suggested title based on current search
  useEffect(() => {
    let titleParts = [];
    if (currentFilters.district && currentFilters.district !== 'all') {
      titleParts.push(currentFilters.district);
    }
    if (currentFilters.category && currentFilters.category !== 'all') {
      titleParts.push(currentFilters.category.toUpperCase());
    }
    if (currentFilters.bedrooms && currentFilters.bedrooms !== 'all') {
      titleParts.push(`${currentFilters.bedrooms} Bed`);
    }
    if (currentFilters.keyword) {
      titleParts.push(`"${currentFilters.keyword}"`);
    }

    const defaultTitle = titleParts.length > 0 
      ? `Singapore ${titleParts.join(' • ')} Alert`
      : 'All Singapore Residential Alert';

    setAlertTitle(defaultTitle);
  }, [currentFilters]);

  // Load saved searches from API or localStorage
  useEffect(() => {
    fetch('/api/saved-searches')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setSavedSearches(data);
        } else {
          // Local storage fallback
          const local = localStorage.getItem('propertyguru_saved_searches');
          if (local) {
            setSavedSearches(JSON.parse(local));
          }
        }
      })
      .catch(() => {
        const local = localStorage.getItem('propertyguru_saved_searches');
        if (local) setSavedSearches(JSON.parse(local));
      });
  }, []);

  const handleSaveSearch = async () => {
    if (!alertTitle.trim()) return;
    setIsSaving(true);

    const newSearch: SavedSearch = {
      id: `alert-${Date.now()}`,
      title: alertTitle.trim(),
      filters: { ...currentFilters },
      frequency,
      createdAt: new Date().toLocaleDateString(),
      matchCount: Math.floor(Math.random() * 8) + 2,
      active: true,
    };

    try {
      await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSearch),
      });
    } catch (e) {
      console.warn('API error saving search, using local fallback:', e);
    }

    const updated = [newSearch, ...savedSearches];
    setSavedSearches(updated);
    localStorage.setItem('propertyguru_saved_searches', JSON.stringify(updated));
    setIsSaving(false);
    setFeedbackMsg('Alert saved successfully! You will be notified of new Singapore listings.');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      await fetch(`/api/saved-searches/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('propertyguru_saved_searches', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-[#E00000]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.nav.savedAlerts}
              </h2>
              <p className="text-xs text-slate-500">
                Receive instant notifications when matching properties hit the market
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Create New Alert Section */}
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-[#E00000] mr-1.5" />
              Save Current Search as Property Alert
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Alert Name
              </label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. 2-Bedroom Condo in Orchard / River Valley"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Notification Frequency */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Notification Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'instant', label: 'Instant (Real-time)' },
                  { id: 'daily', label: 'Daily Digest' },
                  { id: 'weekly', label: 'Weekly Summary' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFrequency(item.id as any)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      frequency === item.id
                        ? 'bg-[#E00000] text-white border-[#E00000]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center">
                <Smartphone className="w-3 h-3 mr-1 text-slate-400" />
                Push Alerts & In-App Badge
              </span>
              <button
                id="save-search-btn"
                onClick={handleSaveSearch}
                disabled={isSaving || !alertTitle.trim()}
                className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Create Alert'}
              </button>
            </div>

            {feedbackMsg && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✓ {feedbackMsg}
              </p>
            )}
          </div>

          {/* Active Saved Alerts List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                My Active Alerts ({savedSearches.length})
              </h3>
            </div>

            {savedSearches.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No saved searches yet. Save your favorite criteria above to get notified of new listings!
              </div>
            ) : (
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {search.title}
                        </h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {search.frequency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Created on {search.createdAt} • ~{search.matchCount} matching properties
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          onApplySavedFilter(search.filters);
                          onClose();
                        }}
                        className="text-xs font-bold text-[#E00000] hover:underline px-2 py-1"
                        title="Load this search"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => onTriggerSimulatedAlert(search.title)}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md"
                        title="Simulate push alert notification"
                      >
                        Test Alert
                      </button>
                      <button
                        onClick={() => handleDeleteSearch(search.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
