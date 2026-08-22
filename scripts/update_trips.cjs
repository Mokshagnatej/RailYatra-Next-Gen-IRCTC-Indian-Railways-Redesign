const fs = require('fs');
const path = 'src/screens/MyTripsScreen.jsx';
let code = fs.readFileSync(path, 'utf8');

const importAuth = "import { useAuthStore } from '../lib/store.ts';";
if (!code.includes(importAuth)) {
  code = code.replace("import PageHero from '../components/common/PageHero';", "import PageHero from '../components/common/PageHero';\n" + importAuth);
}

const stateOld = 'const [isCancelled, setIsCancelled] = useState(false);';
const stateNew = 'const [isCancelled, setIsCancelled] = useState(false);\n  const { journeys, isAuthenticated } = useAuthStore();';
code = code.replace(stateOld, stateNew);

const renderOld = `{tab === "upcoming" && (
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
        )}`;

const renderNew = `{tab === "upcoming" && (
          <div className="mb-16">
            {!isAuthenticated || journeys.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                {!isAuthenticated ? "Sign in to view your bookings." : "No upcoming journeys found."}
              </div>
            ) : (
              journeys.map((b, idx) => (
                <div key={idx} onClick={() => setActiveModal('ticket_details')} className="rounded-xl border bg-white overflow-hidden mb-6 ticket-notch cursor-pointer hover:shadow-lg transition-shadow" style={{ borderColor: "var(--line)" }}>
                  <div className="p-5 flex items-center justify-between transition-colors duration-500" style={{ background: isCancelled ? "var(--red-bg)" : "var(--green-bg)" }}>
                    <div>
                      <p className="f-display font-semibold text-sm">{b.train.name} · #{b.train.no}</p>
                      <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{b.date} · {b.train.dep} {b.train.from} → {b.train.arr} {b.train.to} · {b.passengers[0].class}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors duration-500" style={{ background: isCancelled ? "var(--red)" : "var(--green)", color: "white" }}>
                      {isCancelled ? "Cancelled" : "Confirmed"}
                    </span>
                  </div>
                  <div className="border-t border-dashed p-5 flex flex-wrap gap-6 items-center" style={{ borderColor: "var(--line)" }}>
                    <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>PNR</p><p className="f-mono text-sm font-semibold">{b.pnr}</p></div>
                    {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Coach / Seat</p><p className="f-mono text-sm font-semibold">B4 / 22 SL</p></div>}
                    {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Live status</p><p className="text-sm font-semibold" style={{ color: "var(--green)" }}>On time</p></div>}
                    
                    {!isCancelled && (
                      <div className="ml-auto flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setActiveModal('live_tracking'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>Live tracking</button>
                        <button onClick={(e) => { e.stopPropagation(); setActiveModal('cancel_ticket'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-red-50 transition-colors" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}`;

code = code.replace(renderOld, renderNew);
fs.writeFileSync(path, code);
