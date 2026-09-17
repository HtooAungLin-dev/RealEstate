import React, { useState } from 'react';
import { 
  Heart, 
  Bed, 
  Bath, 
  Maximize2, 
  Train, 
  ShieldCheck, 
  Compass, 
  MessageSquare, 
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scale
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property';
import { translations } from '../i18n/translations';

interface PropertyCardProps {
  property: Property;
  currentLang: SupportedLanguage;
  isShortlisted: boolean;
  onToggleShortlist: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactAgent: (property: Property) => void;
  isInCompare?: boolean;
  onToggleCompare?: (propertyId: string) => void;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currentLang,
  isShortlisted,
  onToggleShortlist,
  onSelectProperty,
  onContactAgent,
  isInCompare = false,
  onToggleCompare,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const t = translations[currentLang];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      id={`property-card-${property.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onSelectProperty(property)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl ${
        isHighlighted
          ? 'ring-2 ring-[#E00000] border-transparent shadow-lg scale-[1.01]'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Photo carousel container */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={property.images[activeImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient overlay for badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {property.verifiedListing && (
              <span className="bg-emerald-600/95 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center shadow-xs">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {t.property.verified}
              </span>
            )}
            {property.virtualTourAvailable && (
              <span className="bg-[#1E293B]/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center shadow-xs">
                <Compass className="w-3 h-3 mr-1 text-sky-400" />
                360° Tour
              </span>
            )}
            <span className="bg-white/95 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {property.district}
            </span>
          </div>

          {/* Top-Right Card Actions: Compare + Shortlist */}
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            {onToggleCompare && (
              <button
                id={`compare-btn-${property.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(property.id);
                }}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-xs transition-all cursor-pointer shadow-md flex items-center space-x-1 ${
                  isInCompare
                    ? 'bg-[#E00000] text-white ring-2 ring-white'
                    : 'bg-white/85 text-slate-700 hover:bg-white hover:text-[#E00000]'
                }`}
                title={isInCompare ? (t.compare?.inCompare || 'In Comparison') : (t.compare?.addToCompare || 'Add to Compare')}
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isInCompare ? (t.compare?.inCompare || 'Compared') : (t.compare?.addToCompare || 'Compare')}
                </span>
              </button>
            )}

            {/* Shortlist Heart Button */}
            <button
              id={`shortlist-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer shadow-md ${
                isShortlisted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500'
              }`}
              title="Save to Shortlist"
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeImageIndex + 1} / {property.images.length}
            </div>
          </>
        )}

        {/* Bottom image caption */}
        <div className="absolute bottom-2.5 left-3 text-white pointer-events-none">
          <span className="text-xs font-semibold text-slate-200">
            {property.tenure} • TOP {property.topYear}
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          {/* Price & PSF */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div>
              <span className="text-xl sm:text-2xl font-black text-[#E00000] tracking-tight">
                {property.formattedPrice}
              </span>
              {property.transactionType === 'sale' && (
                <span className="text-xs font-medium text-slate-500 ml-2">
                  (S$ {property.pricePerSqft.toLocaleString()} {t.property.psf})
                </span>
              )}
            </div>
          </div>

          {/* Title and Project Name */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#E00000] transition-colors line-clamp-1 mb-1">
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 mb-3 flex items-center">
            <span>{property.address}</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span>{property.districtName}</span>
          </p>

          {/* Specs Row: Beds, Baths, Size */}
          <div className="flex items-center space-x-4 py-2 border-y border-slate-100 text-xs font-semibold text-slate-700 mb-3">
            <div className="flex items-center">
              <Bed className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} ${t.property.beds}`}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{property.bathrooms} {t.property.baths}</span>
            </div>
            <div className="flex items-center">
              <Maximize2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{property.floorAreaSqft.toLocaleString()} {t.property.sqft}</span>
            </div>
          </div>

          {/* MRT Proximity badge */}
          <div className="flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg mb-3">
            <Train className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
            <span className="truncate font-medium">
              {property.mrtWalkMinutes} {t.property.mrtWalk} ({property.mrtStation})
            </span>
          </div>
        </div>

        {/* Agent Info & Quick Contact */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <div className="flex items-center">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {property.agent.name}
                </span>
                <CheckCircle2 className="w-3 h-3 text-sky-500 ml-1" />
              </div>
              <p className="text-[10px] text-slate-500">
                {property.agent.agency} • {property.agent.ceaRegNo}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              id={`chat-agent-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onContactAgent(property);
              }}
              className="flex items-center space-x-1 bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <a
              href={`https://wa.me/${property.agent.whatsapp}?text=${encodeURIComponent(
                `Hi ${property.agent.name}, I found your listing "${property.title}" on PropertyGuru Singapore and would like to find out more.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              title="Chat on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
