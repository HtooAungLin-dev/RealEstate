import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  MessageSquare, 
  Heart, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronDown,
  Scale
} from 'lucide-react';
import { SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  savedAlertsCount: number;
  unreadMessagesCount: number;
  shortlistCount: number;
  compareCount?: number;
  onOpenAlerts: () => void;
  onOpenMessages: () => void;
  onOpenShortlist: () => void;
  onOpenCompare?: () => void;
  onOpenAuth: () => void;
  user: any | null;
  onSignOut: () => void;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  savedAlertsCount,
  unreadMessagesCount,
  shortlistCount,
  compareCount = 0,
  onOpenAlerts,
  onOpenMessages,
  onOpenShortlist,
  onOpenCompare,
  onOpenAuth,
  user,
  onSignOut,
  activeNavTab,
  onSelectNavTab,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇸🇬' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  ];

  const navItems = [
    { id: 'buy', label: t.nav.buy },
    { id: 'rent', label: t.nav.rent },
    { id: 'new_launches', label: t.nav.newLaunches },
    { id: 'commercial', label: t.nav.commercial },
    { id: 'find_agent', label: t.nav.findAgent },
    { id: 'news_guides', label: t.nav.newsGuides },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro bar */}
      <div className="bg-[#1E293B] text-slate-300 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              CEA Verified Singapore Real Estate Portal
            </span>
            <span className="text-slate-500">•</span>
            <span>Over 25,000+ Verified Condos, HDBs & Landed Properties</span>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-slate-400">Singapore MAS Housing Loan Guide (Max 75% LTV)</span>
            <div className="relative">
              <button 
                id="header-lang-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center text-white hover:text-red-400 font-medium cursor-pointer transition-colors"
              >
                <Globe className="w-3.5 h-3.5 mr-1 text-slate-300" />
                <span>{languages.find(l => l.code === currentLang)?.flag} {languages.find(l => l.code === currentLang)?.label}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                        currentLang === lang.code ? 'font-bold text-[#E00000] bg-red-50' : ''
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="mr-2 text-base">{lang.flag}</span>
                        {lang.label}
                      </span>
                      {currentLang === lang.code && <span className="text-[#E00000]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <div 
              onClick={() => onSelectNavTab('all')}
              className="flex items-center cursor-pointer group"
              id="brand-logo"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E00000] flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-[#C00000] transition-colors">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="ml-2.5">
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E293B]">
                    RealEstate<span className="text-[#E00000]">Boss</span>
                  </span>
                  <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 py-0.2 rounded">
                    SG
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-1">
                  Singapore's Leading Property Portal
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4">
              {navItems.map((item) => {
                const isActive = activeNavTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectNavTab(item.id)}
                    className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#E00000] bg-red-50/80 font-bold'
                        : 'text-slate-700 hover:text-[#E00000] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile language button */}
            <div className="block md:hidden relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-slate-600 hover:text-[#E00000] rounded-full hover:bg-slate-100"
                title="Change language"
              >
                <Globe className="w-5 h-5" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center ${
                        currentLang === lang.code ? 'font-bold text-[#E00000] bg-red-50' : ''
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compare Properties button */}
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className={`relative flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-semibold ${
                compareCount > 0
                  ? 'bg-red-50 text-[#E00000] hover:bg-red-100 font-bold'
                  : 'text-slate-700 hover:text-[#E00000] hover:bg-slate-100'
              }`}
              title={t.nav.compare || 'Compare'}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.compare || 'Compare'}</span>
              {compareCount > 0 && (
                <span className="bg-[#E00000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Shortlist heart button */}
            <button
              id="header-shortlist-btn"
              onClick={onOpenShortlist}
              className="relative p-2 text-slate-700 hover:text-[#E00000] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={t.nav.myShortlist}
            >
              <Heart className="w-5 h-5" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E00000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Saved Search Alerts */}
            <button
              id="header-alerts-btn"
              onClick={onOpenAlerts}
              className="relative flex items-center space-x-1 px-2.5 py-1.5 text-slate-700 hover:text-[#E00000] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
              title={t.nav.savedAlerts}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.savedAlerts}</span>
              {savedAlertsCount > 0 && (
                <span className="bg-[#E00000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {savedAlertsCount}
                </span>
              )}
            </button>

            {/* Direct Messages with Agents */}
            <button
              id="header-messages-btn"
              onClick={onOpenMessages}
              className="relative flex items-center space-x-1 px-2.5 py-1.5 text-slate-700 hover:text-[#E00000] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
              title={t.nav.messages}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.messages}</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-[#E00000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div 
                  onClick={onOpenAuth}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-red-200 object-cover"
                  />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#E00000]">
                      {user.displayName || 'Buyer Profile'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[100px]">
                      {user.email || 'Verified Buyer'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNavTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-md ${
                  activeNavTab === item.id ? 'text-[#E00000] bg-red-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onOpenCompare && (
              <button
                onClick={() => {
                  onOpenCompare();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-md text-[#E00000] bg-red-50 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <Scale className="w-4 h-4" />
                  <span>{t.nav.compare || 'Compare Properties'}</span>
                </span>
                {compareCount > 0 && (
                  <span className="bg-[#E00000] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {compareCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
