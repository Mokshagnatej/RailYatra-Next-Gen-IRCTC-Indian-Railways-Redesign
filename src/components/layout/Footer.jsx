import React from "react";
import { Train } from "lucide-react";

export default function Footer({ onAction }) {
  const cols = [
    { title: "Quick Tools", items: ["PNR Status", "Train Between Stations", "Fare Enquiry", "Live Train Status", "Seat Availability", "Cancel / TDR"] },
    { title: "Explore", items: ["IRCTC Tourism", "Bharat Gaurav Trains", "Maharajas' Express", "Retiring Rooms", "e-Catering", "Buddhist Circuit"] },
    { title: "Company", items: ["RTI Disclosure", "Annual Report", "Tenders & Notices", "Careers at IRCTC", "Vigilance Corner"] },
    { title: "Support", items: ["Helpline: 139", "care@irctc.co.in", "Grievance Tracker", "Complaint Status", "FAQs", "Accessibility"] },
  ];
  return (
    <footer className="f-body relative bg-[#0A1626] text-[#94A3B8] overflow-hidden">
      {/* Top gold accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#F0A63A] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 md:gap-10">
        {/* Brand col */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#F0A63A] shadow-md">
              <Train size={20} className="text-[#0A1626]" />
            </div>
            <span className="f-heading font-bold text-white text-2xl tracking-tight">Rail<span className="text-[#F0A63A]">Yatra</span></span>
          </div>
          <p className="text-xs leading-relaxed mb-6 max-w-[240px] text-[#94A3B8]">Indian Railway Catering &amp; Tourism Corporation — Mini Ratna (Category-I) PSU, Ministry of Railways, Govt. of India.</p>
          <div className="flex items-center gap-2.5 mb-6">
            {[["𝕏","Twitter"],["f","Facebook"],["▶","YouTube"]].map(([sym, name]) => (
              <a key={name} aria-label={name} className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-white/10 border border-white/15 hover:bg-[#F0A63A] hover:text-[#0A1626] transition-all cursor-pointer shadow-sm">
                {sym}
              </a>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["iOS App", "Android"].map(label => (
              <span key={label} className="text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all font-semibold">
                📱 {label}
              </span>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 f-accent">{c.title}</p>
            <ul className="space-y-3 text-xs">
              {c.items.map((item) => (
                <li key={item} onClick={() => onAction && onAction(item)}
                  className="text-[#94A3B8] hover:text-[#F0A63A] cursor-pointer transition-colors duration-150 flex items-start gap-1.5 leading-relaxed font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[11px] text-[#64748B]">
          <div className="space-y-1">
            <span className="text-[#94A3B8] font-medium">© IRCTC Ltd — redesign concept · not the live site</span>
            <span className="block f-accent text-[#64748B]">CIN: L74899DL1999GOI101707</span>
          </div>
          <div className="flex gap-5 flex-wrap">
            {["Privacy Policy", "Terms of Service", "Refund Policy", "Security"].map((t) => (
              <span key={t} onClick={() => onAction && onAction(t)} className="hover:text-[#F0A63A] cursor-pointer transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[10px] mt-4 opacity-40 leading-relaxed text-[#94A3B8]">A UX redesign concept — not affiliated with or endorsed by Indian Railways or IRCTC. For real bookings visit irctc.co.in or call 139.</p>
      </div>
    </footer>
  );
}
