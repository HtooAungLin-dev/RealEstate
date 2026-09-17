import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Bed, 
  Bath, 
  Maximize2, 
  Train, 
  ShieldCheck, 
  Compass, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Calculator, 
  GraduationCap, 
  Building, 
  Clock, 
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Scale
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';
import { MortgageCalculator } from './MortgageCalculator';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  onContactAgent: (property: Property) => void;
  isInCompare?: boolean;
  onToggleCompare?: (id: string) => void;
  currentLang: SupportedLanguage;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onContactAgent,
  isInCompare = false,
  onToggleCompare,
  currentLang,
}) => {
  if (!isOpen || !property) return null;

  const t = translations[currentLang];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-red-100 text-[#E00000]">
              {property.transactionType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
              {property.district}
            </span>
            {property.verifiedListing && (
              <span className="hidden sm:flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {t.property.verified}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onToggleCompare && (
              <button
                id="modal-compare-btn"
                onClick={() => onToggleCompare(property.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isInCompare
                    ? 'bg-[#E00000] text-white border-red-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-[#E00000] hover:bg-red-50'
                }`}
                title={isInCompare ? (t.compare?.inCompare || 'In Comparison') : (t.compare?.addToCompare || 'Add to Compare')}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isInCompare ? (t.compare?.inCompare || 'In Comparison') : (t.compare?.addToCompare || 'Compare')}</span>
              </button>
            )}

            <button
              id="modal-shortlist-btn"
              onClick={() => onToggleShortlist(property.id)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isShortlisted
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-red-500'
              }`}
              title="Save to Shortlist"
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Photo Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
              <img
                src={property.images[selectedPhotoIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (selectedPhotoIndex - 1 + property.images.length) % property.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedPhotoIndex((selectedPhotoIndex + 1) % property.images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx
                      ? 'border-[#E00000] scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Key Summary Header */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#E00000] tracking-tight">
                {property.formattedPrice}
              </span>
              {property.transactionType === 'sale' && (
                <span className="text-sm font-semibold text-slate-600 ml-2">
                  (S$ {property.pricePerSqft.toLocaleString()} {t.property.psf})
                </span>
              )}
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {property.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {property.address} • {property.districtName} (Postal: {property.postalCode})
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                id="modal-chat-agent-btn"
                onClick={() => {
                  onClose();
                  onContactAgent(property);
                }}
                className="flex items-center space-x-1.5 bg-[#E00000] hover:bg-[#C00000] text-white font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.property.chatNow}</span>
              </button>
              <a
                href={`https://wa.me/${property.agent.whatsapp}?text=${encodeURIComponent(
                  `Hi ${property.agent.name}, I am inquiring about "${property.title}" on RealEstate Singapore.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all text-xs sm:text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Bedrooms</span>
              <span className="text-base font-bold text-slate-800">
                {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Beds`}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Bathrooms</span>
              <span className="text-base font-bold text-slate-800">{property.bathrooms} Baths</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Floor Area</span>
              <span className="text-base font-bold text-slate-800">
                {property.floorAreaSqft.toLocaleString()} sqft
              </span>
              <span className="text-[10px] text-slate-400 block">({property.floorAreaSqm} sqm)</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Tenure</span>
              <span className="text-base font-bold text-slate-800 truncate block">
                {property.tenure}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Property Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {property.description}
            </p>
          </div>

          {/* Features & Key Facilities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Key Features & Project Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {property.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Transport Connectivity */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center">
              <Train className="w-4 h-4 mr-1.5 text-emerald-700" />
              MRT Transport Connectivity
            </h3>
            <p className="text-sm font-bold text-emerald-900">
              {property.mrtStation}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Approx. {property.mrtWalkMinutes} mins walk ({property.mrtDistanceMeters}m). Served by lines: {property.mrtLines.join(', ')}.
            </p>
          </div>

          {/* Nearby Schools */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
              <GraduationCap className="w-4 h-4 mr-1.5 text-slate-700" />
              Nearby Primary & Secondary Schools (Singapore P1 Priority)
            </h3>
            <div className="space-y-1.5">
              {property.nearbySchools.map((school, idx) => (
                <div
                  key={idx}
                  className="text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
                >
                  🎓 {school}
                </div>
              ))}
            </div>
          </div>

          {/* Singapore Bank Mortgage Calculator (for Sale properties) */}
          {property.transactionType === 'sale' && (
            <MortgageCalculator
              property={property}
              currentLang={currentLang}
              onContactAgentForLoan={(pkg, monthly) => {
                onClose();
                onContactAgent(property);
              }}
            />
          )}

          {/* CEA Agent Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-14 h-14 rounded-full border-2 border-red-200 object-cover"
              />
              <div>
                <div className="flex items-center">
                  <h4 className="text-base font-bold text-slate-900">{property.agent.name}</h4>
                  <span className="ml-2 text-[10px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                    CEA Certified
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {property.agent.agency} • CEA Reg: {property.agent.ceaRegNo}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {property.agent.responseTime} • {property.agent.experienceYears} Years Exp
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onContactAgent(property);
                }}
                className="flex-1 sm:flex-initial bg-[#E00000] hover:bg-[#C00000] text-white font-bold px-4 py-2.5 rounded-xl shadow-xs text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
