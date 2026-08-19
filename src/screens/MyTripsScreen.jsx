import React, { useState, useEffect, useRef } from 'react';
import { 
  Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  Check, X, ScanLine, Download, ChevronRight, Play, Compass, MapPin, Coffee, Tag, Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, Filter, Star, Info
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
import { Modal } from '../components/common/Shared';

function TripsScreen() {
  const [tab, setTab] = useState("upcoming");
  const [pnr, setPnr] = useState("");
  const [pnrResult, setPnrResult] = useState(null);
  const [isSearchingPnr, setIsSearchingPnr] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const checkPnr = () => {
    if (!pnr.trim()) return;
    setIsSearchingPnr(true);
    setPnrResult(null);
    setTimeout(() => {
      setIsSearchingPnr(false);
      setPnrResult({
        pnr: pnr || "8462097315",
        train: "12951 Mumbai Rajdhani",
        date: "25 Aug 2026",
        from: "NDLS", to: "BCT",
        cls: "3A", coach: "B4", seat: "22, Side Lower",
        chart: "Not prepared", status: "CNF",
      });
    }, 800);
  };

  const handleCancelTicket = () => {
    setIsCancelled(true);
    setActiveModal(null);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "pnr", label: "PNR Status" },
    { key: "refunds", label: "Refunds & TDR" },
  ];

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="My Trips" title="Every booking, one place." sub="Upcoming journeys, PNR status, and refund tracking — consolidated from four scattered pages on the old site." />
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-20">
        <div className="flex gap-1 bg-white rounded-xl border p-1 w-fit mb-6" style={{ borderColor: "var(--line)" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 h-10 rounded-lg text-sm font-medium f-body transition-colors"
              style={{ background: tab === t.key ? "var(--blue)" : "transparent", color: tab === t.key ? "white" : "var(--ink)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "upcoming" && (
          <div onClick={() => setActiveModal('ticket_details')} className="rounded-xl border bg-white overflow-hidden mb-16 ticket-notch cursor-pointer hover:shadow-lg transition-shadow" style={{ borderColor: "var(--line)" }}>
            <div className="p-5 flex items-center justify-between transition-colors duration-500" style={{ background: isCancelled ? "var(--red-bg)" : "var(--green-bg)" }}>
              <div>
                <p className="f-display font-semibold text-sm">Mumbai Rajdhani · #12951</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>25 Aug · 16:35 NDLS → 08:35 BCT · 3A</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors duration-500" style={{ background: isCancelled ? "var(--red)" : "var(--green)", color: "white" }}>
                {isCancelled ? "Cancelled" : "Confirmed"}
              </span>
            </div>
            <div className="border-t border-dashed p-5 flex flex-wrap gap-6 items-center" style={{ borderColor: "var(--line)" }}>
              <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>PNR</p><p className="f-mono text-sm font-semibold">8462 097 315</p></div>
              {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Coach / Seat</p><p className="f-mono text-sm font-semibold">B4 / 22 SL</p></div>}
              {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Live status</p><p className="text-sm font-semibold" style={{ color: "var(--green)" }}>On time</p></div>}
              {isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Refund Status</p><p className="text-sm font-semibold" style={{ color: "var(--amber)" }}>Processing</p></div>}
              
              {!isCancelled && (
                <div className="ml-auto flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('live_tracking'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>Live tracking</button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('cancel_ticket'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-red-50 transition-colors" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "pnr" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Check PNR status</p>
            <p className="text-sm mb-4" style={{ color: "var(--steel)" }}>10-digit number printed on your ticket / SMS.</p>
            <div className="flex gap-2">
              <input value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="e.g. 8462097315"
                className="flex-1 h-11 rounded-lg border px-3 text-sm f-mono outline-none focus:border-blue-500 transition-colors" style={{ borderColor: "var(--line)" }} />
              <button onClick={checkPnr} className="h-11 px-5 rounded-lg font-semibold text-sm flex items-center justify-center min-w-[80px] transition-transform active:scale-[0.98]" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                {isSearchingPnr ? <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div> : "Check"}
              </button>
            </div>

            {pnrResult && !isSearchingPnr && (
              <div className="mt-5 rounded-lg border p-4 anim-fade-up" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="f-mono text-sm font-semibold">PNR {pnrResult.pnr}</p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{pnrResult.status} — Confirmed</span>
                </div>
                <p className="text-sm" style={{ color: "var(--ink)" }}>{pnrResult.train} · {pnrResult.date}</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{pnrResult.from} → {pnrResult.to} · {pnrResult.cls} · Coach {pnrResult.coach} · Seat {pnrResult.seat}</p>
                <p className="text-xs mt-2" style={{ color: "var(--steel)" }}>Chart status: {pnrResult.chart}. Final seat/coach may change slightly after charting.</p>
              </div>
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Refund status — TDR REF 20260812-441</p>
            <p className="text-sm mb-5" style={{ color: "var(--steel)" }}>Filed for a waitlisted passenger cancelled after chart preparation. Refunds are decided by the concerned zonal railway, typically within 60 days.</p>
            <div className="space-y-0">
              {[
                { label: "TDR filed", done: true, note: "12 Aug, 22:14" },
                { label: "Under review by Zonal Railway", done: true, note: "14 Aug" },
                { label: "Refund approved", done: false, note: "Expected by 10 Oct" },
                { label: "Credited to original payment method", done: false, note: "—" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: s.done ? "var(--green)" : "white", border: `2px solid ${s.done ? "var(--green)" : "var(--line)"}` }}>
                      {s.done && <Check size={12} color="white" />}
                    </div>
                    {i < arr.length - 1 && <div className="w-[2px] flex-1 my-1" style={{ background: s.done ? "var(--green)" : "var(--line)", minHeight: 28 }} />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-semibold" style={{ color: s.done ? "var(--ink)" : "var(--steel)" }}>{s.label}</p>
                    <p className="text-xs f-mono mt-0.5" style={{ color: "var(--steel)" }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <Modal isOpen={activeModal === 'live_tracking'} onClose={() => setActiveModal(null)} title="Live Tracking">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ background: "var(--green-bg)" }}>
            <div>
              <p className="f-mono text-xs" style={{ color: "var(--green)" }}>LIVE STATUS</p>
              <p className="font-semibold text-lg">On Time</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--steel)" }}>Next Stop</p>
              <p className="font-semibold text-lg">Kota Jn (KOTA)</p>
            </div>
          </div>
          
          <div className="space-y-0 px-2">
            {[
              { station: "New Delhi (NDLS)", time: "16:35", status: "Departed", done: true },
              { station: "Mathura Jn (MTJ)", time: "18:02", status: "Departed", done: true },
              { station: "Kota Jn (KOTA)", time: "20:45", status: "Expected", active: true },
              { station: "Ratlam Jn (RTM)", time: "00:15", status: "Upcoming", done: false },
              { station: "Vadodara Jn (BRC)", time: "03:55", status: "Upcoming", done: false },
              { station: "Mumbai Central (BCT)", time: "08:35", status: "Destination", done: false },
            ].map((s, i, arr) => (
              <div key={s.station} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full flex-shrink-0 relative" style={{ background: s.active ? "var(--blue)" : s.done ? "var(--green)" : "var(--line)" }}>
                    {s.active && <div className="h-4 w-4 rounded-full bg-blue-400 animate-ping absolute top-0 left-0"></div>}
                  </div>
                  {i < arr.length - 1 && <div className="w-[2px] flex-1 my-1" style={{ background: s.done ? "var(--green)" : "var(--line)", minHeight: 40 }} />}
                </div>
                <div className="pb-6 w-full flex justify-between items-start">
                  <div>
                    <p className={`text-[15px] font-semibold ${s.active ? "text-blue-600" : s.done ? "" : "text-gray-400"}`}>{s.station}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>{s.status}</p>
                  </div>
                  <p className="f-mono text-sm font-semibold">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'cancel_ticket'} onClose={() => setActiveModal(null)} title="Cancel Ticket">
        <div className="flex flex-col py-2">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <X size={28} className="text-red-500" />
          </div>
          <h3 className="text-center font-semibold text-lg mb-1">Confirm Cancellation</h3>
          <p className="text-center text-sm mb-6" style={{ color: "var(--steel)" }}>Are you sure you want to cancel your ticket for Mumbai Rajdhani?</p>
          
          <div className="rounded-xl border p-4 mb-6 bg-gray-50" style={{ borderColor: "var(--line)" }}>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "var(--steel)" }}>Ticket Fare</span>
              <span className="font-semibold">₹2,840</span>
            </div>
            <div className="flex justify-between text-sm mb-2 text-red-600">
              <span>Cancellation Fee</span>
              <span className="font-semibold">-₹240</span>
            </div>
            <div className="w-full h-px bg-gray-200 my-3"></div>
            <div className="flex justify-between text-[15px] font-bold">
              <span>Estimated Refund</span>
              <span className="text-green-600">₹2,600</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-auto">
            <button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-semibold border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>Keep Ticket</button>
            <button onClick={handleCancelTicket} className="flex-1 h-12 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors" style={{ background: "var(--red)" }}>Confirm Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'ticket_details'} onClose={() => setActiveModal(null)} title="E-Ticket Details">
        <div className="flex flex-col py-2">
          <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "var(--line)" }}>
            <div className="p-5 text-white transition-colors duration-500" style={{ background: isCancelled ? "var(--red)" : "var(--blue)" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg leading-none">Mumbai Rajdhani</p>
                  <p className="text-white/80 text-xs mt-1">Train #12951</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg leading-none">{isCancelled ? "CANCELLED" : "CONFIRMED"}</p>
                  <p className="text-white/80 text-xs mt-1">PNR 8462097315</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">NDLS</p>
                  <p className="text-xs text-white/80">New Delhi</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] text-white/80">16:00 hr</span>
                  <div className="w-16 h-px bg-white/30 my-1 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Train size={12} className="text-white/80" /></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">BCT</p>
                  <p className="text-xs text-white/80">Mumbai Ctrl</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 bg-white">
              <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "var(--steel)" }}>Passenger Details</p>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--line)" }}>
                <div>
                  <p className="font-semibold text-sm">Ananya Rao</p>
                  <p className="text-xs" style={{ color: "var(--steel)" }}>28 Yrs, Female</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">B4, 22</p>
                  <p className="text-xs" style={{ color: "var(--steel)" }}>Side Lower</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center mt-6 mb-2">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <ScanLine size={32} style={{ color: "var(--steel)" }} />
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: "var(--steel)" }}>Show this QR code to the TT</p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full h-12 rounded-xl border font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TripsScreen;
