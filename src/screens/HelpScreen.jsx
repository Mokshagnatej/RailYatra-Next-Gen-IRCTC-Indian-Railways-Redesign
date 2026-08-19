import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  PhoneCall, Mail, MessageSquareText, Search, ChevronUp
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
function HelpScreen() {
  const [openFaq, setOpenFaq] = useState(0);
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
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="Help & Support" title="Surfaced, not buried." sub="Refund status, complaint tracking and FAQs — moved from three clicks deep to a top-level page." />

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--green-bg)" }}><PhoneCall size={17} style={{ color: "var(--green)" }} /></div>
          <div><p className="text-sm font-semibold">139</p><p className="text-xs" style={{ color: "var(--steel)" }}>24×7 helpline</p></div>
        </a>
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--amber-bg)" }}><Mail size={17} style={{ color: "var(--amber)" }} /></div>
          <div><p className="text-sm font-semibold">care@irctc.co.in</p><p className="text-xs" style={{ color: "var(--steel)" }}>Email support</p></div>
        </a>
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "#EAE3F5" }}><MessageSquareText size={17} style={{ color: "#6D4FA8" }} /></div>
          <div><p className="text-sm font-semibold">Track a complaint</p><p className="text-xs" style={{ color: "var(--steel)" }}>By reference number</p></div>
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--steel)" }} />
          <input placeholder="Search help articles — refunds, PNR, Tatkal, KYC…"
            className="w-full h-12 rounded-xl border pl-10 pr-4 text-sm outline-none bg-white" style={{ borderColor: "var(--line)" }} />
        </div>
        <p className="f-display font-semibold mb-3">Frequently asked</p>
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
          {faqs.map((f, i) => (
            <div key={f.q} style={{ borderBottom: i < faqs.length - 1 ? `1px solid var(--line)` : "none" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="text-sm font-medium">{f.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0" style={{ color: "var(--steel)" }} /> : <ChevronDown size={16} className="flex-shrink-0" style={{ color: "var(--steel)" }} />}
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default HelpScreen;