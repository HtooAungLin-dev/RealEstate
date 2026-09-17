import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property, SupportedLanguage } from '../types/property.ts';
import { Maximize2, LocateFixed, Layers, Train, Info } from 'lucide-react';
import { translations } from '../i18n/translations';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  hoveredPropertyId: string | null;
  onSelectProperty: (property: Property) => void;
  onContactAgent: (property: Property) => void;
  currentLang: SupportedLanguage;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  hoveredPropertyId,
  onSelectProperty,
  onContactAgent,
  currentLang,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const t = translations[currentLang];
  const [showMrtOverlay, setShowMrtOverlay] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Singapore default coordinates
    const map = L.map(mapContainerRef.current, {
      center: [1.295, 103.845],
      zoom: 12,
      zoomControl: false,
    });

    // Clean, crisp Carto Positron or OSM map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when properties change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;
      const isHovered = hoveredPropertyId === prop.id;

      // Abbreviated price tag: e.g. "S$ 2.48M" or "S$ 4.9k/mo"
      let shortPrice = '';
      if (prop.transactionType === 'rent') {
        shortPrice = `S$ ${(prop.price / 1000).toFixed(1)}k/m`;
      } else {
        shortPrice = prop.price >= 1000000 
          ? `S$ ${(prop.price / 1000000).toFixed(2)}M` 
          : `S$ ${(prop.price / 1000).toFixed(0)}k`;
      }

      const iconHtml = `
        <div class="property-marker transition-all duration-200 cursor-pointer ${
          isSelected || isHovered
            ? 'scale-115 z-50 ring-3 ring-slate-900 shadow-xl'
            : 'shadow-md hover:scale-110'
        }" style="
          background-color: ${isSelected || isHovered ? '#1E293B' : '#E00000'};
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: -0.02em;
          border: 1.5px solid #ffffff;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        ">
          <span>${shortPrice}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [60, 26],
        iconAnchor: [30, 13],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon }).addTo(map);

      // Popup with mini property card
      const popupHtml = `
        <div style="width: 220px; font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
          <img src="${prop.images[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <div style="font-size: 14px; font-weight: 800; color: #E00000; margin-bottom: 2px;">
            ${prop.formattedPrice}
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
            ${prop.project}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
            ${prop.bedrooms === 0 ? 'Studio' : prop.bedrooms + ' Beds'} • ${prop.bathrooms} Baths • ${prop.floorAreaSqft} sqft
          </div>
          <div style="font-size: 11px; color: #047857; font-weight: 600; margin-bottom: 8px;">
            🚇 ${prop.mrtWalkMinutes} mins to ${prop.mrtStation.split('(')[0]}
          </div>
          <button id="map-popup-btn-${prop.id}" style="width: 100%; background-color: #E00000; color: white; border: none; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -10],
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-popup-btn-${prop.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            onSelectProperty(prop);
          });
        }
      });

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      markersRef.current.set(prop.id, marker);
    });

    // If there's a selected property, center on it
    if (selectedProperty && map) {
      map.panTo([selectedProperty.lat, selectedProperty.lng], { animate: true });
      const activeMarker = markersRef.current.get(selectedProperty.id);
      if (activeMarker && !activeMarker.isPopupOpen()) {
        activeMarker.openPopup();
      }
    }
  }, [properties, selectedProperty, hoveredPropertyId]);

  // Recenter on Singapore button
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([1.295, 103.845], 12, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Map Target DOM element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Map: {properties.length} Singapore Listings</span>
        </div>
      </div>

      {/* Top Right Tool Buttons */}
      <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
        <button
          id="map-recenter-btn"
          onClick={handleRecenter}
          className="p-2.5 bg-white/95 hover:bg-white text-slate-700 hover:text-[#E00000] rounded-xl shadow-md border border-slate-200 transition-colors cursor-pointer"
          title="Recenter Singapore"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          id="map-mrt-toggle-btn"
          onClick={() => setShowMrtOverlay(!showMrtOverlay)}
          className={`p-2.5 rounded-xl shadow-md border transition-colors cursor-pointer ${
            showMrtOverlay
              ? 'bg-red-50 text-[#E00000] border-red-300'
              : 'bg-white/95 text-slate-700 border-slate-200'
          }`}
          title="Toggle MRT Stations Overlay"
        >
          <Train className="w-4 h-4" />
        </button>
      </div>

      {/* MRT Lines Legend Overlay */}
      {showMrtOverlay && (
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-lg border border-slate-200 max-w-xs text-[10px] text-slate-600 hidden sm:block">
          <div className="font-bold text-slate-800 mb-1.5 flex items-center">
            <Train className="w-3.5 h-3.5 mr-1 text-slate-700" />
            MRT Network Lines
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#D42E12] mr-1" /> NSL (Red)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#009645] mr-1" /> EWL (Green)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#FA9E0D] mr-1" /> CCL (Circle)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#005EC4] mr-1" /> DTL (Blue)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#9D5B25] mr-1" /> TEL (Brown)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#8F1A95] mr-1" /> NEL (Purple)</span>
          </div>
        </div>
      )}
    </div>
  );
};
