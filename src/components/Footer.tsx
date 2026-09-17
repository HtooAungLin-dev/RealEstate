import React from 'react';
import { Building2, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import { SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface FooterProps {
  currentLang: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#0F172A] text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand & CEA Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#E00000] flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Property<span className="text-[#E00000]">Guru</span>
                <span className="ml-1 text-[10px] text-red-400 font-bold">SG</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              RealEstate Singapore is the leading real estate portal empowering property seekers with transparent pricing data, verified CEA agent listings, interactive real-time MRT maps, and intelligent search alerts.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-xs pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliant with Council for Estate Agencies (CEA) Guidelines</span>
            </div>
          </div>

          {/* Column 2: Popular Residential Enclaves */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              Prime Singapore Enclaves
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">District 09: Orchard / River Valley</li>
              <li className="hover:text-white transition-colors cursor-pointer">District 10: Tanglin / Holland / Bukit Timah</li>
              <li className="hover:text-white transition-colors cursor-pointer">District 01: Marina Bay & Raffles Place</li>
              <li className="hover:text-white transition-colors cursor-pointer">District 15: East Coast / Marine Parade</li>
              <li className="hover:text-white transition-colors cursor-pointer">District 04: Sentosa Cove / Telok Blangah</li>
              <li className="hover:text-white transition-colors cursor-pointer">District 20: Bishan / Ang Mo Kio</li>
            </ul>
          </div>

          {/* Column 3: Property Categories */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              Properties & Launches
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">Singapore Condos for Sale</li>
              <li className="hover:text-white transition-colors cursor-pointer">HDB Resale Flats (3/4/5-Room & Executive)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Landed Properties (Bungalows & Semi-D)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Singapore New Launch Showflats</li>
              <li className="hover:text-white transition-colors cursor-pointer">Commercial Offices & Shophouses</li>
              <li className="hover:text-white transition-colors cursor-pointer">Rental Apartments for Expats</li>
            </ul>
          </div>

          {/* Column 4: Consumer Guides & Tools */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              Financing & Calculators
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">MAS Housing Loan Rules & 75% LTV</li>
              <li className="hover:text-white transition-colors cursor-pointer">Total Debt Servicing Ratio (TDSR 55%)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Buyer's Stamp Duty (BSD) Calculator</li>
              <li className="hover:text-white transition-colors cursor-pointer">Additional Buyer's Stamp Duty (ABSD)</li>
              <li className="hover:text-white transition-colors cursor-pointer">CPF Housing Grant Eligibility</li>
              <li className="hover:text-white transition-colors cursor-pointer">Find a Registered CEA Estate Agent</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} RealEstate Singapore. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security & Fraud Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
