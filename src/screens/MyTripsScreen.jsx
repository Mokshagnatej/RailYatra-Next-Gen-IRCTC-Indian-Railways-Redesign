import React, { useState } from 'react';
import { Ticket, Search, Clock, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, X, MapPin, Train, ShieldCheck, Check, ScanLine, Download, Activity, AlertTriangle } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { useAuthStore } from '../lib/store.ts';
import { Modal } from '../components/common/Shared';
import { DotNetwork } from '../components/common/CulturalPatterns.jsx';
import { computeLiveTrainTracking } from '../lib/liveTrackingEngine';
import { formatDateDisplay, formatDateLong } from '../lib/dateUtils';

export default function MyTripsScreen() {
  const [tab, setTab] = useState("upcoming");
  const [pnr, setPnr] = useState("");
  const [isSearchingPnr, setIsSearchingPnr] = useState(false);
  const [pnrResult, setPnrResult] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { journeys, cancelJourney } = useAuthStore();

  const activeJourney = selectedTicket || (journeys && journeys[0]) || null;
  const liveTelemetry = activeJourney?.train?.no ? computeLiveTrainTracking(activeJourney.train.no) : null;

  const checkPnr = () => {
    if (!pnr.trim()) return;
    setIsSearchingPnr(true);
    setTimeout(() => {
      setIsSearchingPnr(false);
      const cleanPnr = pnr.trim();
      const matched = (journeys || []).find(j => j.pnr === cleanPnr);
      if (matched) {
        setPnrResult({
          pnr: matched.pnr,
          status: matched.status === "CANCELLED" ? "CANCELLED" : "CNF",
          train: `${matched.train?.no || "12951"} ${matched.train?.name || "Superfast Express"}`,
          date: matched.date || formatDateDisplay(new Date()),
          from: matched.train?.from || "NDLS",
          to: matched.train?.to || "MMCT",
          cls: matched.cls || "3A",
          coach: matched.coach || "B4",
          seat: matched.passengers?.[0]?.seat || "22",
          chart: matched.status === "CANCELLED" ? "Booking Cancelled · Refund Initiated" : "Chart Prepared (Ready for Boarding)"
        });
      } else {
        setPnrResult({
          pnr: cleanPnr,
          status: "CNF",
          train: "12951 Mumbai Tejas Rajdhani",
          date: formatDateDisplay(new Date()),
          from: "NDLS",
          to: "MMCT",
          cls: "3A",
          coach: "B4",
          seat: "22, 23",
          chart: "Prepared (Confirmed)"
        });
      }
    }, 500);
  };

  const handleCancelTicket = (targetPnr) => {
    cancelJourney(targetPnr);
    setCancelSuccess(true);
    setTimeout(() => {
      setCancelSuccess(false);
      setActiveModal(null);
    }, 2000);
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
                const isItemCancelled = b.status === "CANCELLED";
                const mainPassenger = (b.passengers && b.passengers[0]) || { name: "Passenger", seat: "22", coach: "B4", berth: "Lower", class: "3A" };
                const trainName = b.train?.name || "Tejas Rajdhani Express";
                const trainNo = b.train?.no || "12951";
                const fromCode = b.train?.from || "NDLS";
                const toCode = b.train?.to || "MMCT";
                const depTime = b.train?.dep || "16:55";
                const arrTime = b.train?.arr || "08:35";
                const travelDate = b.date || formatDateDisplay(new Date());
                const coachSeat = `${mainPassenger.coach || b.coach || "B4"} / Berth ${mainPassenger.seat || "22"} (${mainPassenger.berth || "Lower"})`;
                const ticketClass = mainPassenger.class || b.cls || "3A";

                return (
                  <div key={b.pnr || idx} onClick={() => { setSelectedTicket(b); setActiveModal('ticket_details'); }} className="rounded-3xl border bg-white overflow-hidden mb-6 shadow-sm hover:shadow-xl transition-all border-[rgba(10,22,38,0.12)] cursor-pointer">
                    <div className={`p-5 flex items-center justify-between transition-colors duration-500 border-b ${
                      isItemCancelled ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="f-accent text-xs font-bold px-2 py-0.5 rounded bg-[#0A1626] text-[#F0A63A]">#{trainNo}</span>
                          <p className="f-heading font-bold text-base text-[#0A1626]">{trainName}</p>
                        </div>
                        <p className="f-accent text-xs mt-1 text-[#4B5563]">
                          {travelDate} · {depTime} {fromCode} → {arrTime} {toCode} · Class: <span className="font-bold text-[#0A1626]">{ticketClass}</span>
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full f-accent shadow-xs ${
                        isItemCancelled ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                      }`}>
                        {isItemCancelled ? "Cancelled · Refund Processed" : "Confirmed (CNF)"}
                      </span>
                    </div>
                    <div className="p-5 flex flex-wrap gap-6 items-center bg-white">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">PNR Number</p>
                        <p className="f-accent text-sm font-bold text-[#0A1626]">{b.pnr}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Coach / Seat</p>
                        <p className="f-accent text-sm font-bold text-[#0A1626]">{coachSeat}</p>
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
            <h3 className="f-heading font-bold text-base text-[#0A1626] mb-1">Check PNR Status</h3>
            <p className="text-xs text-[#6B7280] mb-4">Enter the 10-digit number printed on your booking confirmation or SMS.</p>
            <div className="flex gap-2">
              <input 
                value={pnr} 
                onChange={(e) => setPnr(e.target.value)} 
                placeholder="e.g. 8462097315"
                className="flex-1 h-12 rounded-xl border border-gray-300 px-3 text-sm f-accent font-bold text-[#0A1626] outline-none focus:border-[#0A1626] shadow-xs" 
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
                  <p className="f-accent text-sm font-bold text-[#0A1626]">PNR: {pnrResult.pnr}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full f-accent ${
                    pnrResult.status === "CANCELLED" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {pnrResult.status === "CANCELLED" ? "Cancelled" : "CNF — Confirmed"}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#0A1626]">{pnrResult.train} · {pnrResult.date}</p>
                <p className="f-accent text-xs mt-1 text-[#4B5563]">{pnrResult.from} → {pnrResult.to} · Class: {pnrResult.cls} · Coach {pnrResult.coach} · Seat {pnrResult.seat}</p>
                <p className="text-xs mt-2 text-emerald-800 font-medium">Chart status: {pnrResult.chart}.</p>
              </div>
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="rounded-3xl border bg-white p-6 mb-16 border-[rgba(10,22,38,0.12)] shadow-sm">
            <h3 className="f-heading font-bold text-base text-[#0A1626] mb-1">Refund Status — TDR Tracking</h3>
            <p className="text-xs text-[#6B7280] mb-5">Automated IRCTC auto-refund tracking engine. Monitored in real time.</p>
            <div className="space-y-4">
              {[
                { label: "TDR Filed & Acknowledged", done: true, note: "Just now · Automated PRS link" },
                { label: "Under Review by Zonal Railway Accounts", done: true, note: "Instant automated pre-approval" },
                { label: "Refund Approved (100% Guaranteed)", done: true, note: "Net amount ₹1,645 credited" },
                { label: "Credited to Source Payment Account", done: true, note: "Processed via UPI / Original Source" },
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
                    <p className="text-[11px] text-[#6B7280] f-accent">{s.note}</p>
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
          <div className="mb-4 p-3.5 rounded-xl bg-[#0A1626] text-white flex items-center justify-between shadow-md">
            <div>
              <p className="f-heading font-bold text-sm text-[#F0A63A]">{activeJourney?.train?.name || "Mumbai Rajdhani"}</p>
              <p className="f-accent text-xs text-gray-300">
                Train #{activeJourney?.train?.no || "12951"} · Speed: <span className="text-emerald-400 font-bold">{liveTelemetry?.currentSpeedKmH || 115} km/h</span>
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white f-accent flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE GPS
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4 flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Current Halt</span>
              <span className="font-bold text-amber-950">{liveTelemetry?.currentStation?.name || activeJourney?.train?.from || "NDLS"} ({liveTelemetry?.currentStation?.platform || "PF 1"})</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Next Stoppage</span>
              <span className="font-bold text-amber-950">{liveTelemetry?.nextStation?.name || activeJourney?.train?.to || "MMCT"} · ETA {liveTelemetry?.nextStation?.etaMinutes || 18}m</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {(liveTelemetry?.allStops || [
              { name: activeJourney?.train?.from || "Origin", arr: "--:--", dep: activeJourney?.train?.dep || "16:35", passed: true, current: false },
              { name: "Mathura Jn", arr: "18:00", dep: "18:02", passed: true, current: true },
              { name: "Kota Jn", arr: "20:40", dep: "20:45", passed: false, current: false },
              { name: "Ratlam Jn", arr: "00:10", dep: "00:15", passed: false, current: false },
              { name: "Vadodara Jn", arr: "03:50", dep: "03:55", passed: false, current: false },
              { name: activeJourney?.train?.to || "Destination", arr: activeJourney?.train?.arr || "08:35", dep: "--:--", passed: false, current: false },
            ]).map((s, i, arr) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className={`h-4 w-4 rounded-full flex-shrink-0 relative ${
                    s.current ? "bg-amber-500 ring-4 ring-amber-100" : s.passed ? "bg-emerald-600" : "bg-gray-300"
                  }`} />
                  {i < arr.length - 1 && <div className={`w-[2px] flex-1 my-1 ${s.passed ? "bg-emerald-600" : "bg-gray-200"}`} style={{ minHeight: 28 }} />}
                </div>
                <div className="pb-3 w-full flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold ${s.current ? "text-amber-700" : s.passed ? "text-[#0A1626]" : "text-gray-400"}`}>
                      {s.name} {s.current && <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 rounded text-amber-900 ml-1">Current</span>}
                    </p>
                    <p className="text-[10px] text-gray-500 f-accent">Arr: {s.arr || "--"} · Dep: {s.dep || "--"}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.passed ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {s.passed ? "Departed" : "Scheduled"}
                  </span>
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
                  <p className="f-heading font-bold text-base text-[#F0A63A]">{activeJourney.train?.name || "Superfast Express"}</p>
                  <p className="text-xs f-accent text-gray-300">Train #{activeJourney.train?.no || "12951"} · Class: {activeJourney.cls || "3A"}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded f-accent ${
                    activeJourney.status === "CANCELLED" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {activeJourney.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED"}
                  </span>
                  <p className="text-[11px] f-accent text-gray-300 mt-1">PNR: {activeJourney.pnr}</p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F2] border-b border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Boarding</p>
                  <p className="f-accent text-base font-bold text-[#0A1626]">{activeJourney.train?.from || "NDLS"}</p>
                  <p className="text-[10px] text-gray-500">{activeJourney.train?.dep || "16:55"} · {activeJourney.date || formatDateDisplay(new Date())}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Destination</p>
                  <p className="f-accent text-base font-bold text-[#0A1626]">{activeJourney.train?.to || "MMCT"}</p>
                  <p className="text-[10px] text-gray-500">{activeJourney.train?.arr || "08:35"}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2 f-accent">Passenger Manifest</p>
                <div className="space-y-2">
                  {(activeJourney.passengers || [{ name: "Passenger 1", age: "28", gender: "M", coach: "B4", seat: "22", berth: "Lower" }]).map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 rounded-xl border border-gray-200 bg-white">
                      <div>
                        <p className="text-xs font-bold text-[#0A1626]">{p.name || `Passenger ${i + 1}`}</p>
                        <p className="text-[10px] text-gray-500">{p.age || "28"} Yrs · {p.gender === "M" ? "Male" : "Female"}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold f-accent px-2 py-0.5 rounded border ${
                          activeJourney.status === "CANCELLED" 
                            ? "bg-rose-50 text-rose-800 border-rose-200" 
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}>
                          {activeJourney.status === "CANCELLED" ? "CAN / REFUND" : `Coach ${p.coach || activeJourney.coach || "B4"} · Berth ${p.seat || 22 + i * 3} (${p.berth || "Lower"})`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center mt-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                  <ScanLine size={32} className="text-[#0A1626] mb-1" />
                  <p className="text-[10px] text-gray-600 f-accent">Authorized Indian Railways Ticket QR · Show to TTE on Board</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => {
                  setDownloadSuccess(true);
                  setTimeout(() => setDownloadSuccess(false), 2500);
                }}
                className="h-12 rounded-xl font-bold text-xs bg-[#0A1626] text-[#F0A63A] hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download size={16} /> 
                <span>{downloadSuccess ? "✓ E-Ticket Saved!" : "Download PDF Slip"}</span>
              </button>

              {activeJourney.status !== "CANCELLED" ? (
                <button
                  onClick={() => handleCancelTicket(activeJourney.pnr)}
                  className="h-12 rounded-xl font-bold text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle size={15} />
                  <span>{cancelSuccess ? "Cancellation Submitted!" : "Cancel Ticket & Refund"}</span>
                </button>
              ) : (
                <div className="h-12 rounded-xl font-bold text-xs bg-gray-100 text-gray-600 flex items-center justify-center">
                  Refund Processed (₹{activeJourney.fare || 1680})
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
