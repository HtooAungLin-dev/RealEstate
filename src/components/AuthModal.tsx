import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any | null;
  onManualLogin: (user: any) => void;
  onSignOut: () => void;
  currentLang: SupportedLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onManualLogin,
  onSignOut,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        onManualLogin(result.user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Firebase popup sign-in:', err);
      // If popup blocked or domain restriction in iframe, offer instant demo profile
      setErrorMsg(
        err.message?.includes('popup') || err.message?.includes('network')
          ? 'Popup sign-in blocked by browser preview sandbox. Please use 1-Click Demo Profiles below.'
          : err.message || 'Failed to sign in'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoProfile = (role: 'buyer' | 'investor' | 'tenant') => {
    const profiles = {
      buyer: {
        uid: 'demo-buyer-sg-1',
        displayName: 'Tan Wei Ming',
        email: 'weiming.tan@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'Verified Singapore Citizen Buyer',
      },
      investor: {
        uid: 'demo-investor-sg-2',
        displayName: 'Elena Rostova',
        email: 'elena.rostova@sgcapital.com',
        photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
        role: 'High Net Worth Private Investor',
      },
      tenant: {
        uid: 'demo-tenant-sg-3',
        displayName: 'Rajesh Kumar',
        email: 'rajesh.kumar@techsea.io',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        role: 'Expat Professional Tenant',
      },
    };

    onManualLogin(profiles[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#E00000] flex items-center justify-center text-white font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentUser ? 'My RealEstate Account' : 'Sign in to RealEstate SG'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentUser ? 'Manage profile and saved searches' : 'Save searches, viewings, and agent chats'}
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

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img
                  src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={currentUser.displayName}
                  className="w-12 h-12 rounded-full border-2 border-red-300 object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentUser.displayName}</h3>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    Verified User
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Authentication Provider:</span>
                  <span className="font-semibold text-slate-800">Firebase Auth / Google</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Push Alerts:</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Direct Agent Messaging:</span>
                  <span className="font-semibold text-emerald-600">Enabled</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            /* Login Options */
            <div className="space-y-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              {errorMsg && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {errorMsg}
                </div>
              )}

              {/* Instant 1-Click Demo Profiles */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center space-x-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E00000]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Instant Demo Login (Preview-Safe)
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectDemoProfile('buyer')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-red-100 text-[#E00000] font-bold text-xs flex items-center justify-center">
                        TW
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Tan Wei Ming</p>
                        <p className="text-[10px] text-slate-500">Singapore Citizen Buyer • HDB / Condo</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#E00000] font-bold">Select →</span>
                  </button>

                  <button
                    onClick={() => handleSelectDemoProfile('investor')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                        ER
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Elena Rostova</p>
                        <p className="text-[10px] text-slate-500">High Net Worth Investor • Sentosa / Marina Bay</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#E00000] font-bold">Select →</span>
                  </button>

                  <button
                    onClick={() => handleSelectDemoProfile('tenant')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        RK
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Rajesh Kumar</p>
                        <p className="text-[10px] text-slate-500">Expat Tech Tenant • Tanjong Pagar / CBD</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#E00000] font-bold">Select →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
