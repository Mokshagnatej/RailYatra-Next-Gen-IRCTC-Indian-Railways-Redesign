import React, { useMemo } from "react";
import {
  Download, Share2, Printer, Train, Users, Ticket,
  ShieldCheck, Clock, CheckCircle2, Utensils, Bell, ChevronRight, Info, Wallet,
} from "lucide-react";

const COACHES = ["B2", "B4", "A1", "S6", "C3"];
const BERTHS = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper"];

function seeded(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000;
  return (n) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s % n;
  };
}

export function buildBooking(selection, passengers) {
  const digits = String(Math.floor(1000000000 + Math.random() * 8999999999));
  const rnd = seeded(digits);
  const coach = COACHES[rnd(COACHES.length)];
  return {
    pnr: digits,
    bookedAt: new Date(),
    txnId: "IRC" + digits.slice(0, 8) + "TX",
    coach,
    train: selection.train,
    cls: selection.cls,
    fare: selection.fare,
    date: "Tue, 25 Aug 2026",
    passengers: passengers.map((p, i) => ({
      name: p.name?.trim() ? p.name : `Passenger ${i + 1}`,
      age: p.age?.trim() ? p.age : "—",
      gender: p.gender,
      coach,
      seat: 8 + rnd(60),
      berth: BERTHS[rnd(BERTHS.length)],
      status: "CNF",
    })),
  };
}

function Row({ label, value, mono = true, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-xs" style={{ color: "var(--steel)" }}>{label}</span>
      <span className={`${mono ? "f-mono" : ""} text-sm ${strong ? "font-semibold" : "font-medium"}`} style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function FauxQR({ seed, size = 92 }) {
  const cells = useMemo(() => {
    const rnd = seeded(seed);
    return Array.from({ length: 100 }).map(() => rnd(10) > 4);
  }, [seed]);
  return (
    <div className="rounded-lg p-2 bg-white" style={{ border: "1px solid var(--line)" }}>
      <div className="grid grid-cols-10" style={{ width: size, height: size }}>
        {cells.map((on, i) => (<span key={i} style={{ background: on ? "var(--blue)" : "transparent" }} />))}
      </div>
    </div>
  );
}

export default function ConfirmationScreen({ booking, onTrips, onHome }) {
  const convenience = 35;
  const gst = Math.round(booking.fare * 0.05);
  const total = booking.fare * booking.passengers.length + convenience + gst;
  const t = booking.train;

  const timeline = [
    { label: "Booked", detail: "Payment captured · just now", done: true },
    { label: "Chart preparation", detail: "Expected 4 hours before departure", done: false },
    { label: "Boarding", detail: `${t.dep} · ${t.from} · Platform announced 30 min prior`, done: false },
    { label: "Arrival", detail: `${t.arr} · ${t.to}`, done: false },
  ];

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20">
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-12 pb-24 text-center relative">
          <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--green)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "draw-check 0.5s 0.2s ease-out forwards" }} />
            </svg>
          </div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Booking confirmed</p>
          <h1 className="f-display text-3xl md:text-4xl font-semibold text-white mt-2">Your seats are booked.</h1>
          <p className="text-sm mt-2" style={{ color: "#C7D2DD" }}>An e-ticket has been sent to your registered email and mobile. Carry a government photo ID while travelling.</p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full px-5 py-2.5" style={{ background: "rgba(255,255,255,0.1)" }}>
            <span className="text-xs uppercase tracking-wide" style={{ color: "#C7D2DD" }}>PNR</span>
            <span className="f-mono text-lg font-semibold" style={{ color: "var(--marigold)" }}>
              {booking.pnr.slice(0, 3)} {booking.pnr.slice(3, 6)} {booking.pnr.slice(6)}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-lg)" }}>
          <div className="p-5 md:p-6 flex flex-wrap items-start justify-between gap-4" style={{ background: "var(--paper-2)" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "var(--blue)" }}>
                <Train size={18} color="var(--marigold)" />
              </div>
              <div>
                <p className="f-display font-semibold text-base" style={{ color: "var(--ink)" }}>{t.name}</p>
                <p className="f-mono text-xs mt-0.5" style={{ color: "var(--steel)" }}>#{t.no} · {t.type} · Class {booking.cls}</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--green-bg)", color: "var(--green)" }}>CONFIRMED</span>
          </div>

          <div className="p-5 md:p-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-dashed" style={{ borderColor: "var(--line)" }}>
            <div>
              <p className="f-mono text-2xl font-semibold" style={{ color: "var(--ink)" }}>{t.dep}</p>
              <p className="f-mono text-xs font-semibold mt-1" style={{ color: "var(--blue)" }}>{t.from}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>{booking.date}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[11px] mb-1" style={{ color: "var(--steel)" }}>{t.dur}</p>
              <div className="h-[2px] w-20 md:w-40" style={{ background: "repeating-linear-gradient(90deg, var(--blue) 0 8px, transparent 8px 14px)" }} />
              <p className="text-[11px] mt-1" style={{ color: "var(--steel)" }}>Direct</p>
            </div>
            <div className="text-right">
              <p className="f-mono text-2xl font-semibold" style={{ color: "var(--ink)" }}>{t.arr}</p>
              <p className="f-mono text-xs font-semibold mt-1" style={{ color: "var(--blue)" }}>{t.to}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>Next day arrival</p>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <p className="f-display font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
              <Users size={15} style={{ color: "var(--blue)" }} /> Passengers & berth allotment
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>
                    <th className="font-semibold pb-2">Name</th>
                    <th className="font-semibold pb-2">Age / Gender</th>
                    <th className="font-semibold pb-2">Coach</th>
                    <th className="font-semibold pb-2">Berth</th>
                    <th className="font-semibold pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.passengers.map((p, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                      <td className="py-2.5 font-medium" style={{ color: "var(--ink)" }}>{p.name}</td>
                      <td className="py-2.5 f-mono text-xs" style={{ color: "var(--steel)" }}>{p.age} / {p.gender}</td>
                      <td className="py-2.5 f-mono text-xs font-semibold" style={{ color: "var(--blue)" }}>{p.coach}</td>
                      <td className="py-2.5 f-mono text-xs" style={{ color: "var(--ink)" }}>{p.seat} · {p.berth}</td>
                      <td className="py-2.5"><span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 md:p-6 border-t border-dashed grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
            <div className="flex items-center gap-4">
              <FauxQR seed={booking.pnr} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Scan at boarding</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--ink)" }}>TXN {booking.txnId}</p>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: "var(--ink)" }}>
                <Wallet size={15} style={{ color: "var(--blue)" }} /> Fare breakdown
              </p>
              <Row label={`Base fare × ${booking.passengers.length}`} value={`₹${(booking.fare * booking.passengers.length).toLocaleString("en-IN")}`} />
              <Row label="Convenience fee" value={`₹${convenience}`} />
              <Row label="GST (5%)" value={`₹${gst}`} />
              <div className="border-t mt-2 pt-2" style={{ borderColor: "var(--line)" }}>
                <Row label="Total paid" value={`₹${total.toLocaleString("en-IN")}`} strong />
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--line)" }}>
            <button onClick={() => window.print()} className="flex-1 min-w-[140px] h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: "var(--line)", color: "var(--blue)" }}><Download size={15} /> Download</button>
            <button className="flex-1 min-w-[140px] h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: "var(--line)", color: "var(--blue)" }}><Share2 size={15} /> Share</button>
            <button className="flex-1 min-w-[140px] h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: "var(--line)", color: "var(--blue)" }}><Printer size={15} /> Print</button>
            <button onClick={onTrips} className="flex-1 min-w-[140px] h-11 rounded-lg font-semibold text-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>View in My Trips</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs flex items-center gap-2" style={{ color: "var(--steel)" }}>
          <CheckCircle2 size={14} style={{ color: "var(--green)" }} /> Ticket also available offline under My Trips.
        </p>
        <button onClick={onHome} className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--blue)" }}>
          <Ticket size={15} /> Book another journey
        </button>
      </div>
    </div>
  );
}
