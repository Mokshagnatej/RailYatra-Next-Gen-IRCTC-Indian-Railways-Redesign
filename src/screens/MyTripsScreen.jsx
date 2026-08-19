import React, { useState } from 'react';
import { Check, X, Download, Train, ScanLine } from 'lucide-react';
import PageHero from '../components/common/PageHero';

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full md:w-[480px] max-h-[90vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-14 px-5 border-b flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
          <h3 className="font-semibold text-lg" style={{ color: "var(--ink)" }}>{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

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
      setPnrResult({ pnr: pnr || "8462097315", train: "12951 Mumbai Rajdhani", date: "25 Aug 2026", from: "NDLS", to: "BCT", cls: "3A", coach: "B4", seat: "22, Side Lower", chart: "Not prepared", status: "CNF" });
    }, 800);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "pnr", label: "PNR Status" },
    { key: "refunds", label: "Refunds & TDR" },
  ];

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="My Trips" title="Every booking, one place." sub="Upcoming journeys, PNR status, and refund tracking — consolidated from four scattered pages." />
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
          <div onClick={() => setActiveModal('ticket_details')} className="rounded-xl border bg-white overflow-hidden mb-16 cursor-pointer hover:shadow-lg transition-shadow" style={{ borderColor: "var(--line)" }}>
            <div className="p-5 flex items-center justify-between" style={{ background: isCancelled ? "var(--red-bg)" : "var(--green-bg)" }}>
              <div>
                <p className="f-display font-semibold text-sm">Mumbai Rajdhani · #12951</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>25 Aug · 16:35 NDLS → 08:35 BCT · 3A</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: isCancelled ? "var(--red)" : "var(--green)", color: "white" }}>
                {isCancelled ? "Cancelled" : "Confirmed"}
              </span>
            </div>
            <div className="border-t border-dashed p-5 flex flex-wrap gap-6 items-center" style={{ borderColor: "var(--line)" }}>
              <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>PNR</p><p className="f-mono text-sm font-semibold">8462 097 315</p></div>
              {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Coach / Seat</p><p className="f-mono text-sm font-semibold">B4 / 22 SL</p></div>}
              {!isCancelled && (
                <div className="ml-auto flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('live_tracking'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-gray-50" style={{ borderColor: "var(--line)" }}>Live tracking</button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('cancel_ticket'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-red-50" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "pnr" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Check PNR status</p>
            <div className="flex gap-2 mt-4">
              <input value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="e.g. 8462097315"
                className="flex-1 h-11 rounded-lg border px-3 text-sm f-mono outline-none" style={{ borderColor: "var(--line)" }} />
              <button onClick={checkPnr} className="h-11 px-5 rounded-lg font-semibold text-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                {isSearchingPnr ? "..." : "Check"}
              </button>
            </div>
            {pnrResult && !isSearchingPnr && (
              <div className="mt-5 rounded-lg border p-4" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <p className="f-mono text-sm font-semibold">PNR {pnrResult.pnr}</p>
                <p className="text-sm mt-2" style={{ color: "var(--ink)" }}>{pnrResult.train} · {pnrResult.date}</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{pnrResult.from} → {pnrResult.to} · {pnrResult.cls} · Coach {pnrResult.coach}</p>
              </div>
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Refund status — TDR REF 20260812-441</p>
            <div className="space-y-0 mt-5">
              {[
                { label: "TDR filed", done: true, note: "12 Aug, 22:14" },
                { label: "Under review by Zonal Railway", done: true, note: "14 Aug" },
                { label: "Refund approved", done: false, note: "Expected by 10 Oct" },
                { label: "Credited to original payment method", done: false, note: "—" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.done ? "var(--green)" : "white", border: `2px solid ${s.done ? "var(--green)" : "var(--line)"}` }}>
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

      <Modal isOpen={activeModal === 'cancel_ticket'} onClose={() => setActiveModal(null)} title="Cancel Ticket">
        <div className="flex flex-col py-2">
          <p className="text-center text-sm mb-6" style={{ color: "var(--steel)" }}>Cancel your ticket for Mumbai Rajdhani? Estimated refund: ₹2,600</p>
          <div className="flex gap-3">
            <button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-semibold border" style={{ borderColor: "var(--line)" }}>Keep Ticket</button>
            <button onClick={() => { setIsCancelled(true); setActiveModal(null); }} className="flex-1 h-12 rounded-xl font-semibold text-white" style={{ background: "var(--red)" }}>Confirm Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'ticket_details'} onClose={() => setActiveModal(null)} title="E-Ticket Details">
        <div className="flex flex-col py-2 items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
            <ScanLine size={32} style={{ color: "var(--steel)" }} />
          </div>
          <p className="f-mono font-semibold text-sm">PNR 8462 097 315</p>
          <p className="text-xs mt-1" style={{ color: "var(--steel)" }}>Mumbai Rajdhani · 25 Aug · B4/22 SL</p>
          <button className="mt-6 w-full h-12 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2" style={{ borderColor: "var(--line)" }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TripsScreen;
