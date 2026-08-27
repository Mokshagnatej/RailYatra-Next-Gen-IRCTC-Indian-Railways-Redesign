import React, { useState, useMemo } from 'react';
import { 
  PhoneCall, Mail, MessageSquareText, Search, ChevronUp, ChevronDown, 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, CheckCircle2, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
import { RangoliOverlay } from '../components/common/CulturalPatterns.jsx';
import { Modal } from '../components/common/Shared';
import { formatDateDisplay, getRelativeDate } from '../lib/dateUtils';

function HelpScreen() {
  const [openFaq, setOpenFaq] = useState(0);
  const [query, setQuery] = useState("");
  const [trackingModal, setTrackingModal] = useState(false);
  const [complaintRef, setComplaintRef] = useState("");
  const [complaintStatus, setComplaintStatus] = useState(null);
  const [isSearchingComplaint, setIsSearchingComplaint] = useState(false);

  const handleTrackComplaint = () => {
    if (!complaintRef.trim()) return;
    setIsSearchingComplaint(true);
    setTimeout(() => {
      setIsSearchingComplaint(false);
      setComplaintStatus({
        ref: complaintRef.trim().toUpperCase(),
        status: "RESOLVED · ACTION TAKEN",
        date: formatDateDisplay(getRelativeDate(-1)),
        dep: "Railway Board / Western Railway",
        resolution: "Cleanliness issue addressed by On-Board Housekeeping Staff (OBHS) at Kota Junction."
      });
    }, 600);
  };
  const faqs = [
    { q: "My money was debited but I didn't get a ticket. What now?", a: "You'll see a 'Verifying' status immediately with a confirmation SLA. If the booking can't be confirmed within that window, the amount is auto-refunded to your original payment method — no TDR filing needed for this case. Refunds typically appear within 3–5 working days." },
    { q: "How do I file a TDR for a waitlisted passenger?", a: "Go to My Trips → Refunds & TDR, select the PNR, choose the affected passenger(s), and submit before the train's scheduled departure. Refunds are decided by the concerned Zonal Railway, usually within 60 days." },
    { q: "Why is my Tatkal ticket non-refundable?", a: "Confirmed Tatkal tickets carry zero refund on cancellation by rule. Waitlisted Tatkal tickets can still be cancelled up to 30 minutes before departure for a nominal clerkage fee. Premium Tatkal tickets follow the same rule." },
    { q: "What's the difference between chart-prepared and not-prepared?", a: "Charts are usually finalised 4 hours before departure. Before that, RAC/waitlist positions can still move. After charting, your final coach and berth are locked and shown on the PNR status." },
    { q: "How many tickets can I book in a month?", a: "Individual users can book up to 6 tickets per user ID per month for non-Tatkal bookings. For Tatkal bookings, the limit is 2 tickets per user ID per day. IRCTC-verified users (Aadhaar-linked) get a higher limit of 12 tickets per month." },
    { q: "Do children need a separate ticket?", a: "Children below 5 years travel free without a berth. Children aged 5–11 can either share a berth with a guardian (free) or be booked a separate berth at full adult fare. Children 12 and above require a full ticket." },
    { q: "Can I change the boarding station after booking?", a: "Yes, you can change the boarding point online up to 24 hours before the train's scheduled departure, once per ticket. The new station must be on the same route before your original boarding station." },
    { q: "How do I order food on the train?", a: "Use the e-Catering service available during booking or on My Trips after booking. Select your delivery station from 500+ FSSAI-approved partner restaurants. Meals are delivered to your seat by restaurant staff at the station. Minimum order time is 2 hours before the train arrives at the station." },
  ];

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen f-body relative">
      <RangoliOverlay position="top-left" size={200} opacity={0.03} />
      <PageHero eyebrow="Help & Support" title="Surfaced, not buried." sub="Refund status, complaint tracking and FAQs — moved from three clicks deep to a top-level page." />

      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a href="tel:139" className="rounded-2xl bg-white border border-[rgba(10,22,38,0.12)] p-5 flex items-center gap-3.5 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-700 shadow-sm"><PhoneCall size={20} /></div>
          <div><p className="text-base font-bold text-[#0A1626]">139</p><p className="text-xs text-[#4B5563]">24×7 railway helpline</p></div>
        </a>
        <a href="mailto:care@irctc.co.in" className="rounded-2xl bg-white border border-[rgba(10,22,38,0.12)] p-5 flex items-center gap-3.5 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-amber-50 text-amber-700 shadow-sm"><Mail size={20} /></div>
          <div><p className="text-base font-bold text-[#0A1626]">care@irctc.co.in</p><p className="text-xs text-[#4B5563]">Official email support</p></div>
        </a>
        <button onClick={() => setTrackingModal(true)} className="rounded-2xl bg-white border border-[rgba(10,22,38,0.12)] p-5 flex items-center gap-3.5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-purple-50 text-purple-700 shadow-sm"><MessageSquareText size={20} /></div>
          <div><p className="text-base font-bold text-[#0A1626]">Track a complaint</p><p className="text-xs text-[#4B5563]">By reference number</p></div>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input 
            placeholder="Search help articles — refunds, PNR, Tatkal, KYC…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 rounded-2xl border border-[rgba(10,22,38,0.14)] pl-11 pr-4 text-sm font-semibold text-[#0A1626] placeholder-[#6B7280] outline-none bg-white shadow-sm focus:border-amber-500" 
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          )}
        </div>
        <div className="flex justify-between items-center mb-3">
          <p className="font-serif font-bold text-lg text-[#0A1626]">Frequently asked questions</p>
          {query && <span className="text-xs text-gray-500">{filteredFaqs.length} results</span>}
        </div>
        <div className="rounded-2xl border border-[rgba(10,22,38,0.12)] bg-white overflow-hidden shadow-sm">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No matching help articles found for "{query}".
            </div>
          ) : (
            filteredFaqs.map((f, i) => (
              <div key={f.q} style={{ borderBottom: i < filteredFaqs.length - 1 ? `1px solid rgba(10,22,38,0.08)` : "none" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F3EEE0]/50 transition-colors">
                  <span className="text-sm font-semibold text-[#0A1626]">{f.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0 text-[#6B7280]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[#6B7280]" />}
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed text-[#4B5563]">{f.a}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RailMadad Grievance Tracking Modal */}
      <Modal title="RailMadad Grievance Tracker" isOpen={trackingModal} onClose={() => setTrackingModal(false)}>
        <div className="flex flex-col gap-3.5">
          <p className="text-xs text-[#6B7280]">Enter your 10-digit RailMadad reference ID or PNR to view real-time department investigation status.</p>
          <div className="flex gap-2">
            <input 
              value={complaintRef}
              onChange={e => setComplaintRef(e.target.value)}
              placeholder="e.g. RM20260824901"
              className="flex-1 h-12 px-3.5 rounded-xl border border-gray-300 bg-white text-xs md:text-sm font-mono font-bold text-[#0A1626] outline-none"
            />
            <button 
              onClick={handleTrackComplaint}
              disabled={isSearchingComplaint}
              className="h-12 px-5 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs md:text-sm cursor-pointer shadow-md"
            >
              {isSearchingComplaint ? "Checking..." : "Track"}
            </button>
          </div>

          {complaintStatus && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 anim-fade-up">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                <span className="font-mono font-bold text-emerald-950">Ref: {complaintStatus.ref}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">{complaintStatus.status}</span>
              </div>
              <p className="text-[#0A1626] font-semibold">Department: <span className="text-emerald-900">{complaintStatus.dep}</span></p>
              <p className="text-emerald-800 bg-white p-2.5 rounded-xl border border-emerald-100 leading-relaxed font-medium">
                {complaintStatus.resolution}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default HelpScreen;
