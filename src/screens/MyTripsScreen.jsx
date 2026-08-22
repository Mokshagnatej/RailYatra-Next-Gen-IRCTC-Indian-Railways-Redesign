import React, { useState } from 'react';
import { Ticket, Search, Clock, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, X, MapPin, Train, ShieldCheck, Check, ScanLine, Download } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { useAuthStore } from '../lib/store.ts';
import { Modal } from '../components/common/Shared';
import { DotNetwork } from '../components/common/CulturalPatterns.jsx';

export default function MyTripsScreen() {
  const [tab, setTab] = useState("upcoming");
  const [pnr, setPnr] = useState("");
  const [isSearchingPnr, setIsSearchingPnr] = useState(false);
  const [pnrResult, setPnrResult] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { journeys, isAuthenticated } = useAuthStore();

  const activeJourney = selectedTicket || (journeys && journeys[0]) || null;

  const checkPnr = () => {
    if (!pnr) return;
    setIsSearchingPnr(true);
    setTimeout(() => {
      setIsSearchingPnr(false);
      const matched = journeys.find(j => j.pnr === pnr.trim());
      if (matched) {
        setPnrResult({
          pnr: matched.pnr,
          status: "CNF",
          train: `${matched.train?.no || "12951"} ${matched.train?.name || "Superfast Express"}`,
          date: matched.date || "25 Aug 2026",
          from: matched.train?.from || "NDLS",
          to: matched.train?.to || "MMCT",
          cls: matched.cls || "3A",
          coach: matched.coach || "B4",
          seat: matched.passengers?.[0]?.seat || "22",
          chart: "Prepared (Charts Done)"
        });
      } else {
        setPnrResult({
          pnr,
          status: "CNF",
          train: "12951 Mumbai Tejas Rajdhani",
          date: "25 Aug 2026",
          from: "NDLS",
          to: "MMCT",
          cls: "3A",
          coach: "B4",
          seat: "22, 23",
          chart: "Prepared"
        });
      }
    }, 800);
  };

  const handleCancelTicket = () => {
    setIsCancelled(true);
    setActiveModal(null);
  };

  const tabs = [
    { key: "upcoming", label: `Upcoming Journeys (${journeys?.length || 0})` },
    { key: "pnr", label: "PNR Status" },
    { key: "refunds", label: "Refunds & TDR" },
  ];

  return (
    <div className="min-h-screen f-body relative">
      <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden pointer-events-none opacity-40">
        <DotNetwork count={6} />
      </div>
      <PageHero eyebrow="My Trips" title="Every booking, one place." sub="Upcoming journeys, confirmed e-tickets, and live coach assignments." />
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 relative z-10 pb-20">
        <div className="flex gap-1 bg-white rounded-2xl border p-1.5 w-fit mb-8 border-[rgba(10,22,38,0.12)] shadow-sm">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 h-10 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-[#0A1626] text-[#F0A63A] shadow-md"
                  : "text-[#4B5563] hover:text-[#0A1626] hover:bg-black/5"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "upcoming" && (
          <div className="mb-16">
            {!journeys || journeys.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-[rgba(10,22,38,0.18)] shadow-sm">
                <Ticket size={36} className="mx-auto mb-3 text-gray-400" />
                <p className="text-base font-bold text-[#0A1626] mb-1">
                  No upcoming journeys found
                </p>
                <p className="text-xs text-[#4B5563]">
                  Book a ticket to start tracking your journey and manage e-tickets.
                </p>
              </div>
            ) : (
              journeys.map((b, idx) => {
                const mainPassenger = (b.passengers && b.passengers[0]) || { name: "Passenger", seat: "22", coach: "B4", berth: "Lower", class: "3A" };
                const trainName = b.train?.name || "Tejas Rajdhani Express";
                const trainNo = b.train?.no || "12951";
                const fromCode = b.train?.from || "NDLS";
                const toCode = b.train?.to || "MMCT";
                const depTime = b.train?.dep || "16:55";
                const arrTime = b.train?.arr || "08:35";
                const travelDate = b.date || "25 Aug 2026";
                const coachSeat = `${mainPassenger.coach || b.coach || "B4"} / Berth ${mainPassenger.seat || "22"} (${mainPassenger.berth || "Lower"})`;
                const ticketClass = mainPassenger.class || b.cls || "3A";

                return (
                  <div key={b.pnr || idx} onClick={() => { setSelectedTicket(b); setActiveModal('ticket_details'); }} className="rounded-3xl border bg-white overflow-hidden mb-6 shadow-sm hover:shadow-xl transition-all border-[rgba(10,22,38,0.12)] cursor-pointer">
                    <div className="p-5 flex items-center justify-between transition-colors duration-500 bg-emerald-50 border-b border-emerald-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0A1626] text-[#F0A63A]">#{trainNo}</span>
                          <p className="font-serif font-bold text-base text-[#0A1626]">{trainName}</p>
                        </div>
                        <p className="font-mono text-xs mt-1 text-[#4B5563]">
                          {travelDate} · {depTime} {fromCode} → {arrTime} {toCode} · Class: <span className="font-bold text-[#0A1626]">{ticketClass}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white font-mono shadow-xs">
                        {isCancelled ? "Cancelled" : "Confirmed (CNF)"}
                      </span>
                    </div>
                    <div className="p-5 flex flex-wrap gap-6 items-center bg-white">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">PNR Number</p>
                        <p className="font-mono text-sm font-bold text-[#0A1626]">{b.pnr}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Coach / Seat</p>
                        <p className="font-mono text-sm font-bold text-[#0A1626]">{coachSeat}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Passenger Manifest</p>
                        <p className="text-xs font-bold text-[#0A1626]">{mainPassenger.name} {b.passengers?.length > 1 ? `(+${b.passengers.length - 1} more)` : ''}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedTicket(b); setActiveModal('live_tracking'); }} className="h-9 px-3.5 rounded-xl border border-gray-300 hover:border-[#0A1626] text-xs font-bold text-[#0A1626] bg-[#FAF8F2] flex items-center gap-1.5 transition-all cursor-pointer">
                          <Train size={14} className="text-blue-700" /> Live Tracking
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedTicket(b); setActiveModal('ticket_details'); }} className="h-9 px-3.5 rounded-xl border border-[#0A1626] bg-[#0A1626] text-[#F0A63A] hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs">
                          <Ticket size={14} /> E-Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "pnr" && (
          <div className="rounded-3xl border bg-white p-6 mb-16 border-[rgba(10,22,38,0.12)] shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#0A1626] mb-1">Check PNR Status</h3>
            <p className="text-xs text-[#6B7280] mb-4">Enter the 10-digit number printed on your booking confirmation or SMS.</p>
            <div className="flex gap-2">
              <input 
                value={pnr} 
                onChange={(e) => setPnr(e.target.value)} 
                placeholder="e.g. 8462097315"
                className="flex-1 h-12 rounded-xl border border-gray-300 px-3 text-sm font-mono font-bold text-[#0A1626] outline-none focus:border-[#0A1626] shadow-xs" 
              />
              <button 
                onClick={checkPnr} 
                className="h-12 px-6 rounded-xl font-bold text-sm flex items-center justify-center min-w-[100px] bg-[#0A1626] text-[#F0A63A] hover:bg-black transition-all cursor-pointer shadow-md"
              >
                {isSearchingPnr ? <div className="w-4 h-4 border-2 border-[#F0A63A] border-t-transparent rounded-full animate-spin"></div> : "Check PNR"}
              </button>
            </div>

            {pnrResult && !isSearchingPnr && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 anim-fade-up">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-sm font-bold text-[#0A1626]">PNR: {pnrResult.pnr}</p>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white font-mono">
                    {pnrResult.status} — Confirmed
                  </span>
                </div>
                <p className="text-sm font-bold text-[#0A1626]">{pnrResult.train} · {pnrResult.date}</p>
                <p className="font-mono text-xs mt-1 text-[#4B5563]">{pnrResult.from} → {pnrResult.to} · Class: {pnrResult.cls} · Coach {pnrResult.coach} · Seat {pnrResult.seat}</p>
                <p className="text-xs mt-2 text-emerald-800 font-medium">Chart status: {pnrResult.chart}. Ready for boarding.</p>
              </div>
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="rounded-3xl border bg-white p-6 mb-16 border-[rgba(10,22,38,0.12)] shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#0A1626] mb-1">Refund Status — TDR REF 20260812-441</h3>
            <p className="text-xs text-[#6B7280] mb-5">Automated IRCTC auto-refund tracking engine. Monitored in real time.</p>
            <div className="space-y-4">
              {[
                { label: "TDR Filed & Acknowledged", done: true, note: "12 Aug, 22:14" },
                { label: "Under Review by Zonal Railway Accounts", done: true, note: "14 Aug, 10:30" },
                { label: "Refund Approved (₹2,640)", done: true, note: "15 Aug, 18:20" },
                { label: "Credited to Source Payment Account", done: true, note: "Processed via UPI" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${s.done ? "bg-emerald-600 text-white" : "border-2 border-gray-300 bg-white"}`}>
                      {s.done && <Check size={12} />}
                    </div>
                    {i < arr.length - 1 && <div className="w-[2px] flex-1 my-1 bg-emerald-600 min-h-[24px]" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs md:text-sm font-bold text-[#0A1626]">{s.label}</p>
                    <p className="text-[11px] text-[#6B7280] font-mono">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Tracking Modal */}
      <Modal isOpen={activeModal === 'live_tracking'} onClose={() => setActiveModal(null)} title="Live Journey Tracking">
        <div className="py-2">
          <div className="mb-4 p-3 rounded-xl bg-[#0A1626] text-white flex items-center justify-between">
            <div>
              <p className="font-serif font-bold text-sm text-[#F0A63A]">{activeJourney?.train?.name || "Mumbai Rajdhani"}</p>
              <p className="font-mono text-xs text-gray-300">Train #{activeJourney?.train?.no || "12951"} · Status: On Time</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white font-mono">LIVE GPS</span>
          </div>
          <div className="space-y-2">
            {[
              { station: `${activeJourney?.train?.from || "NDLS"} (Origin)`, time: activeJourney?.train?.dep || "16:35", status: "Departed", done: true },
              { station: "Mathura Jn (MTJ)", time: "18:02", status: "Departed", done: true },
              { station: "Kota Jn (KOTA)", time: "20:45", status: "Current Location", active: true },
              { station: "Ratlam Jn (RTM)", time: "00:15", status: "Next Stop", done: false },
              { station: "Vadodara Jn (BRC)", time: "03:55", status: "Upcoming", done: false },
              { station: `${activeJourney?.train?.to || "MMCT"} (Destination)`, time: activeJourney?.train?.arr || "08:35", status: "Destination", done: false },
            ].map((s, i, arr) => (
              <div key={s.station} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-4 w-4 rounded-full flex-shrink-0 relative ${s.active ? "bg-blue-600 ring-4 ring-blue-100" : s.done ? "bg-emerald-600" : "bg-gray-300"}`} />
                  {i < arr.length - 1 && <div className={`w-[2px] flex-1 my-1 ${s.done ? "bg-emerald-600" : "bg-gray-200"}`} style={{ minHeight: 30 }} />}
                </div>
                <div className="pb-4 w-full flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold ${s.active ? "text-blue-700" : s.done ? "text-[#0A1626]" : "text-gray-400"}`}>{s.station}</p>
                    <p className="text-[10px] text-gray-500">{s.status}</p>
                  </div>
                  <p className="font-mono text-xs font-bold text-[#0A1626]">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Ticket Details Modal */}
      <Modal isOpen={activeModal === 'ticket_details'} onClose={() => setActiveModal(null)} title="Electronic Reservation Slip (ERS)">
        {activeJourney && (
          <div className="flex flex-col py-1">
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
              <div className="p-4 bg-[#0A1626] text-white flex justify-between items-center">
                <div>
                  <p className="font-serif font-bold text-base text-[#F0A63A]">{activeJourney.train?.name || "Superfast Express"}</p>
                  <p className="text-xs font-mono text-gray-300">Train #{activeJourney.train?.no || "12951"} · Class: {activeJourney.cls || "3A"}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white font-mono">CONFIRMED</span>
                  <p className="text-[11px] font-mono text-gray-300 mt-1">PNR: {activeJourney.pnr}</p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F2] border-b border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Boarding</p>
                  <p className="font-mono text-base font-bold text-[#0A1626]">{activeJourney.train?.from || "NDLS"}</p>
                  <p className="text-[10px] text-gray-500">{activeJourney.train?.dep || "16:55"} · {activeJourney.date || "25 Aug 2026"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Destination</p>
                  <p className="font-mono text-base font-bold text-[#0A1626]">{activeJourney.train?.to || "MMCT"}</p>
                  <p className="text-[10px] text-gray-500">{activeJourney.train?.arr || "08:35"}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2 font-mono">Passenger Manifest</p>
                <div className="space-y-2">
                  {(activeJourney.passengers || [{ name: "Passenger 1", age: "28", gender: "M", coach: "B4", seat: "22", berth: "Lower" }]).map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 rounded-xl border border-gray-200 bg-white">
                      <div>
                        <p className="text-xs font-bold text-[#0A1626]">{p.name || `Passenger ${i + 1}`}</p>
                        <p className="text-[10px] text-gray-500">{p.age || "28"} Yrs · {p.gender === "M" ? "Male" : "Female"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Coach {p.coach || activeJourney.coach || "B4"} · Berth {p.seat || 22 + i * 3} ({p.berth || "Lower"})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center mt-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                  <ScanLine size={32} className="text-[#0A1626] mb-1" />
                  <p className="text-[10px] text-gray-600 font-mono">Authorized Indian Railways Ticket QR · Show to TTE on Board</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 2500);
              }}
              className="mt-4 w-full h-12 rounded-xl font-bold text-xs md:text-sm bg-[#0A1626] text-[#F0A63A] hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download size={16} /> 
              <span>{downloadSuccess ? "✓ E-Ticket PDF Downloaded!" : "Download Official ERS PDF"}</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
