import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Users, CreditCard, BadgeCheck, Languages, Bell, LogOut, ChevronRight,
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, LifeBuoy, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
import { 
  ProfileModal, PassengersModal, PaymentsModal, KycModal, LanguageModal, NotificationsModal 
} from '../components/common/Shared';
import { RangoliOverlay } from '../components/common/CulturalPatterns.jsx';

import { useAuthStore } from '../lib/store.ts';

function AccountScreen({ onLogout }) {
  const [activeModal, setActiveModal] = useState(null);
  const { user, logout } = useAuthStore();
  
  const displayName = user?.name || "Ananya Rao";
  const displayEmail = user?.email || "ananya.rao@gmail.com";
  const displayId = user?.irctcId || (displayEmail.includes("@") ? displayEmail.split("@")[0] : "ananya.rao");
  const displayMobile = user?.mobile || "+91 98765 43210";

  const handleLogoutClick = () => {
    logout();
    if (onLogout) onLogout();
  };

  const rows = [
    { id: "profile", icon: User, label: "Profile", detail: `${displayName}, ${displayMobile}` },
    { id: "passengers", icon: Users, label: "Saved passengers", detail: "4 saved (Aadhaar verified)" },
    { id: "payments", icon: CreditCard, label: "Payment methods", detail: "2 UPI IDs, 1 IRCTC Card" },
    { id: "kyc", icon: BadgeCheck, label: "KYC / Aadhaar", detail: "Verified · DigiLocker Connected" },
    { id: "language", icon: Languages, label: "Language", detail: "English (Default)" },
    { id: "notifications", icon: Bell, label: "Notifications", detail: "SMS + WhatsApp alerts enabled" },
  ];
  return (
    <div className="min-h-screen f-body relative">
      <RangoliOverlay position="top-right" size={200} opacity={0.03} />
      <PageHero eyebrow="Account & Settings" title={displayName} sub={`Member since 2019 · IRCTC ID: ${displayId} · ${displayEmail}`} small />
      <div className="max-w-2xl mx-auto px-4 md:px-8 mt-8 relative z-10 pb-16">
        <div className="rounded-2xl border border-[rgba(10,22,38,0.12)] bg-white shadow-sm overflow-hidden">
          {rows.map((r, i) => (
            <button key={r.id} onClick={() => setActiveModal(r.id)} className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F3EEE0]/50 active:bg-[#F3EEE0]" style={{ borderBottom: i < rows.length - 1 ? `1px solid rgba(10,22,38,0.08)` : "none" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#F3EEE0]">
                <r.icon size={18} className="text-[#0A1626]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#0A1626]">{r.label}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">{r.detail}</p>
              </div>
              <ChevronRight size={16} className="text-[#6B7280]" />
            </button>
          ))}
        </div>
        <button 
          onClick={handleLogoutClick} 
          className="mt-4 w-full h-12 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors border-red-200 text-red-600 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <LogOut size={16} /> Log Out from IRCTC
        </button>
      </div>

      <ProfileModal isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)} />
      <PassengersModal isOpen={activeModal === "passengers"} onClose={() => setActiveModal(null)} />
      <PaymentsModal isOpen={activeModal === "payments"} onClose={() => setActiveModal(null)} />
      <KycModal isOpen={activeModal === "kyc"} onClose={() => setActiveModal(null)} />
      <LanguageModal isOpen={activeModal === "language"} onClose={() => setActiveModal(null)} />
      <NotificationsModal isOpen={activeModal === "notifications"} onClose={() => setActiveModal(null)} />
    </div>
  );
}

export default AccountScreen;
