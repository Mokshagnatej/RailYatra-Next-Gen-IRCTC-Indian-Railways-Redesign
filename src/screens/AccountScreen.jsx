import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  Users, BadgeCheck, Languages, LogOut
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
import { ProfileModal, PassengersModal, PaymentsModal, KycModal, LanguageModal, NotificationsModal } from '../components/common/Shared';
function AccountScreen({ onLogout }) {
  const [activeModal, setActiveModal] = useState(null);

  const rows = [
    { id: "profile", icon: User, label: "Profile", detail: "Name, mobile, email" },
    { id: "passengers", icon: Users, label: "Saved passengers", detail: "4 saved" },
    { id: "payments", icon: CreditCard, label: "Payment methods", detail: "2 UPI IDs, 1 card" },
    { id: "kyc", icon: BadgeCheck, label: "KYC / Aadhaar", detail: "Verified" },
    { id: "language", icon: Languages, label: "Language", detail: "English" },
    { id: "notifications", icon: Bell, label: "Notifications", detail: "SMS + push enabled" },
  ];
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="Account" title="Ananya Rao" sub="Member since 2019 · IRCTC ID: ananya.rao" small />
      <div className="max-w-2xl mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-16">
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
          {rows.map((r, i) => (
            <button key={r.id} onClick={() => setActiveModal(r.id)} className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100" style={{ borderBottom: i < rows.length - 1 ? `1px solid var(--line)` : "none" }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
                <r.icon size={16} style={{ color: "var(--blue)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs" style={{ color: "var(--steel)" }}>{r.detail}</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--steel)" }} />
            </button>
          ))}
        </div>
        <button onClick={() => { if(confirm("Are you sure you want to log out?")) onLogout(); }} className="mt-4 w-full h-12 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors" style={{ borderColor: "var(--red)", color: "var(--red)" }}>
          <LogOut size={15} /> Log out
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