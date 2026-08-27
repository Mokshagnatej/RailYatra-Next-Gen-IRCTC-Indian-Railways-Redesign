import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Train, ShieldCheck, Clock, Wallet, Ticket, MapPin, ChevronDown, ChevronRight,
  Sparkles, PhoneCall, Landmark, BadgeCheck, CreditCard, Users, Hotel, Loader2, CalendarDays
} from "lucide-react";
import {
  Reveal, CountUp, RouteMapIllustration, StationIllustration, TrackConnector, TrustIllustration,
} from "./Illustrations.jsx";
import ScrollLinkedRailLine from "./common/ScrollLinkedRailLine.jsx";
import TrainTimetableModal from "./common/TrainTimetableModal";
import { getTrainByNumber, searchTrainsBetween } from "../lib/trainRouteService";
import { computeLiveTrainTracking } from "../lib/liveTrackingEngine";
import { getQuickDates, getSeatForecast, formatDateMedium } from "../lib/dateUtils";

/* ---------------- quick tools: PNR / live status / fare ---------------- */

const TOOLS = [
  { 
    key: "pnr", 
    label: "PNR Status", 
    icon: Ticket, 
    placeholder: "Enter 10-digit PNR (e.g. 4517228091)", 
    cta: "Check status",
    samples: ["4517228091", "8462097315", "6291048821"]
  },
  { 
    key: "live", 
    label: "Live Train Status", 
    icon: Train, 
    placeholder: "Enter train name/number (e.g. 12951, 22436, 12002)", 
    cta: "Track live",
    samples: ["12951", "22436", "12002", "12622", "12301"]
  },
  { 
    key: "fare", 
    label: "Fare Calculator", 
    icon: Wallet, 
    placeholder: "Route (e.g. NDLS to MMCT)", 
    cta: "Calculate fare",
    samples: ["NDLS to MMCT", "NDLS to BSB", "MAS to SBC"]
  },
  { 
    key: "seat", 
    label: "Seat Availability", 
    icon: ShieldCheck, 
    placeholder: "Train name/number (e.g. 12951)", 
    cta: "Check seats",
    samples: ["12951", "22436", "12002", "16052"]
  },
];

export function QuickTools() {
  const [tab, setTab] = useState("pnr");
  const [value, setValue] = useState("");
  const QUICK_DATES = useMemo(() => getQuickDates(10), []);
  const [travelDate, setTravelDate] = useState(QUICK_DATES[0]?.dateStr || formatDateMedium(new Date()));
  const [travelQuota, setTravelQuota] = useState("General");
  const [dynamicResult, setDynamicResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimetableTrain, setSelectedTimetableTrain] = useState(null);
  
  const active = TOOLS.find((t) => t.key === tab) || TOOLS[0];

  const handleCheck = (queryValue, customDate, customQuota) => {
    const q = queryValue !== undefined ? queryValue : (value.trim() || active.samples[0]);
    const d = customDate || travelDate;
    const quota = customQuota || travelQuota;

    setValue(q);
    if (customDate) setTravelDate(customDate);
    if (customQuota) setTravelQuota(customQuota);
    setLoading(true);
    setDynamicResult(null);

    setTimeout(() => {
      setLoading(false);
      
      if (tab === "live") {
        const telemetry = computeLiveTrainTracking(q);
        if (telemetry) {
          setDynamicResult({
            title: `#${telemetry.trainNo} ${telemetry.trainName} (Live GPS Tracking)`,
            badge: telemetry.statusType === "halted" ? "HALTED AT STATION" : "CRUISING · ON TIME",
            badgeColor: telemetry.statusType === "halted" ? "#C97F1F" : "#1F7A4C",
            trainNo: telemetry.trainNo,
            lines: [
              ["Current Position", `${telemetry.currentStation.name} (${telemetry.currentStation.code}) · ${telemetry.currentStation.platform}`],
              ["Live Speed & Delay", `${telemetry.currentSpeedKmH} km/h · ${telemetry.delayString}`],
              ["Next Upcoming Stoppage", `${telemetry.nextStation.name} (${telemetry.nextStation.code}) · ETA ${telemetry.nextStation.etaMinutes} mins`],
              ["Journey Progress", `${telemetry.progressPercent}% completed (${telemetry.distanceCoveredKm} km of ${telemetry.totalDistanceKm} km)`]
            ]
          });
        }
      } else if (tab === "pnr") {
        setDynamicResult({
          title: `PNR Status · ${q}`,
          badge: "CONFIRMED (CNF)",
          badgeColor: "#1F7A4C",
          trainNo: "12951",
          lines: [
            ["Passenger 1 Status", "Confirmed (CNF) · Coach B3, Berth 24 (Lower)"],
            ["Passenger 2 Status", "Confirmed (CNF) · Coach B3, Berth 25 (Middle)"],
            ["Class & Quota", "AC 3-Tier (3A) · General Quota"],
            ["Chart Status", "Chart Prepared · Boarding Confirmed"]
          ]
        });
      } else if (tab === "seat") {
        const train = getTrainByNumber(q);
        const originStation = train?.fromStationName || train?.schedule?.[0]?.stationName || "Origin";
        const destStation = train?.toStationName || train?.schedule?.[(train?.schedule?.length || 1) - 1]?.stationName || "Destination";
        
        // Date and quota specific seat counts
        const isTatkal = quota === "Tatkal" || quota === "Premium Tatkal";
        const isWeekend = d.toLowerCase().includes("sat") || d.toLowerCase().includes("sun");

        const classEntries = train?.classes && Object.keys(train.classes).length > 0
          ? Object.entries(train.classes).map(([cls, info]) => {
              const label = cls === "1A" ? "Executive / 1A" : cls === "2A" ? "AC 2-Tier (2A)" : cls === "3A" ? "AC 3-Tier (3A)" : cls === "CC" ? "AC Chair Car (CC)" : cls === "EC" ? "Exec Chair Car (EC)" : "Sleeper (SL)";
              const baseCount = info.n || (cls === "SL" ? 92 : cls === "3A" ? 48 : cls === "2A" ? 18 : 6);
              const count = isTatkal ? Math.max(4, Math.round(baseCount * 0.25)) : (isWeekend ? Math.max(8, baseCount - 14) : baseCount);
              const statusText = isTatkal 
                ? `TATKAL AVAILABLE - ${count} Seats (Opens 10:00 AM)` 
                : `AVAILABLE - ${count} Seats (Instant Confirmation)`;
              return [label, `${statusText} · Fare: ₹${info.fare}`];
            })
          : [
            ["AC 3-Tier (3A)", isTatkal ? "TATKAL AVAILABLE - 12 Seats" : "AVAILABLE - 48 Seats (Instant Confirmation)"],
            ["AC 2-Tier (2A)", isTatkal ? "TATKAL AVAILABLE - 4 Seats" : "AVAILABLE - 18 Seats (Instant Confirmation)"],
            ["Executive / 1A", "AVAILABLE - 6 Seats"],
            ["Sleeper (SL)", isTatkal ? "TATKAL AVAILABLE - 24 Seats" : "AVAILABLE - 92 Seats"]
          ];

        // 6-day dynamic forecast
        const forecastDates = getSeatForecast(6, new Date()).map(f => ({
          date: f.d.replace(' ', '-'),
          day: f.day,
          status: f.status,
          color: f.hexColor
        }));

        setDynamicResult({
          title: `Seat Availability · #${train?.trainNo} ${train?.trainName}`,
          badge: `DATE: ${d}`,
          badgeColor: "#1F7A4C",
          trainNo: train?.trainNo,
          forecast: forecastDates,
          lines: [
            ["Selected Journey Date", `${d} · ${quota} Quota`],
            ["Route & Operating Days", `${originStation} → ${destStation} (${train?.runsOn || "Daily"})`],
            ...classEntries
          ]
        });
      } else {
        const train = getTrainByNumber(q);
        const originStation = train?.fromStationName || train?.schedule?.[0]?.stationName || "New Delhi (NDLS)";
        const destStation = train?.toStationName || train?.schedule?.[(train?.schedule?.length || 1) - 1]?.stationName || "Mumbai Central (MMCT)";
        
        const fareEntries = train?.classes && Object.keys(train.classes).length > 0
          ? Object.entries(train.classes).map(([cls, info]) => {
              const label = cls === "1A" ? "AC First Class (1A)" : cls === "2A" ? "AC 2-Tier (2A)" : cls === "3A" ? "AC 3-Tier (3A)" : cls === "CC" ? "AC Chair Car (CC)" : cls === "EC" ? "Exec Chair Car (EC)" : "Sleeper Class (SL)";
              return [label, `₹${info.fare} (Base fare + Reservation + GST)`];
            })
          : [
            ["Sleeper Class (SL)", "₹685 (Base ₹640 + Superfast ₹45)"],
            ["AC 3-Tier (3A)", "₹1,985 (Base ₹1,820 + GST ₹110 + Resv ₹40)"],
            ["AC 2-Tier (2A)", "₹2,830 (Base ₹2,620 + Catering Included)"],
            ["AC First Class (1A)", "₹4,855 (Coupe / Cabin Berth)"]
          ];

        setDynamicResult({
          title: `Fare Breakdown: #${train?.trainNo} ${train?.trainName} (${originStation} → ${destStation})`,
          badge: `DATE: ${d}`,
          badgeColor: "#0A1626",
          trainNo: train?.trainNo,
          lines: fareEntries
        });
      }
    }, 300);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 mt-12 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {TOOLS.map((t) => {
          const on = t.key === tab;
          const Icon = t.icon;
          return (
            <motion.button 
              key={t.key} 
              onClick={() => { setTab(t.key); setDynamicResult(null); setValue(""); }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-start gap-3 p-5 rounded-2xl cursor-pointer text-left transition-all duration-300 ${
                on
                  ? 'bg-[#0A1626] text-white shadow-xl ring-2 ring-[#F0A63A]'
                  : 'bg-white text-[#0A1626] border border-[rgba(10,22,38,0.12)] hover:border-[#F0A63A] hover:bg-[#F3EEE0]/60 shadow-sm'
              }`}
            >
              <div className={`p-2.5 rounded-xl shadow-sm ${
                on ? 'bg-white/15 text-[#F0A63A]' : 'bg-[#F3EEE0] text-[#0A1626]'
              }`}>
                <Icon size={20} /> 
              </div>
              <span className="font-bold text-[15px]">{t.label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.div 
        layout
        className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-[rgba(10,22,38,0.12)] shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-3">
          {/* Train Number Input */}
          <div className="flex-1 h-14 rounded-2xl border border-[rgba(10,22,38,0.14)] flex items-center gap-3 px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#F0A63A] focus-within:border-transparent shadow-inner">
            <Search size={20} className="text-[#0A1626]" />
            <input 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder={active.placeholder}
              className="flex-1 outline-none bg-transparent text-[16px] font-semibold text-[#0A1626] placeholder-[#6B7280]" 
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()} 
            />
            {value && (
              <button onClick={() => setValue("")} className="text-gray-400 hover:text-red-500 transition-colors p-1"><span className="sr-only">Clear</span>✕</button>
            )}
          </div>

          {/* Date Picker (Shown on Seat Availability & Fare) */}
          {(tab === "seat" || tab === "fare") && (
            <div className="flex gap-2">
              <div className="h-14 rounded-2xl border border-[rgba(10,22,38,0.14)] flex items-center gap-2 px-3 bg-white shadow-inner">
                <CalendarDays size={18} className="text-[#F0A63A]" />
                <select
                  value={travelDate}
                  onChange={(e) => {
                    setTravelDate(e.target.value);
                    if (dynamicResult) handleCheck(undefined, e.target.value);
                  }}
                  className="bg-transparent text-sm font-bold text-[#0A1626] outline-none cursor-pointer"
                >
                  {QUICK_DATES.map(d => (
                    <option key={d.dateStr} value={d.dateStr}>{d.dateStr} ({d.day})</option>
                  ))}
                </select>
              </div>

              <div className="h-14 rounded-2xl border border-[rgba(10,22,38,0.14)] flex items-center px-3 bg-white shadow-inner">
                <select
                  value={travelQuota}
                  onChange={(e) => {
                    setTravelQuota(e.target.value);
                    if (dynamicResult) handleCheck(undefined, undefined, e.target.value);
                  }}
                  className="bg-transparent text-sm font-bold text-[#0A1626] outline-none cursor-pointer"
                >
                  <option value="General">General Quota</option>
                  <option value="Tatkal">Tatkal Quota</option>
                  <option value="Ladies">Ladies Quota</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Premium Tatkal">Premium Tatkal</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#000000" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCheck()} 
            disabled={loading}
            className="h-14 px-8 rounded-2xl font-bold text-[15px] flex items-center justify-center min-w-[150px] shadow-lg transition-all cursor-pointer bg-[#0A1626] text-[#F3EEE0]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Fetching...
              </span>
            ) : active.cta}
          </motion.button>
        </div>

        {/* Quick Date Chips (When tab is seat availability) */}
        {tab === "seat" ? (
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">Select Journey Date:</span>
            {QUICK_DATES.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => {
                  setTravelDate(d.dateStr);
                  handleCheck(undefined, d.dateStr);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  travelDate === d.dateStr
                    ? 'bg-[#0A1626] text-[#F0A63A] shadow-sm ring-1 ring-[#F0A63A]'
                    : 'bg-[#F3EEE0] text-[#0A1626] hover:bg-[#F0A63A] hover:text-[#0A1626]'
                }`}
              >
                {d.label} <span className="opacity-70 font-normal">({d.dateStr.slice(0, 6)})</span>
              </button>
            ))}
          </div>
        ) : (
          /* Quick Clickable Sample Chips for PNR / Live / Fare */
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold text-[#4B5563]">
            <span>Try quick search:</span>
            {active.samples.map((s) => (
              <button
                key={s}
                onClick={() => handleCheck(s)}
                className="px-3 py-1.5 rounded-full border border-[rgba(10,22,38,0.14)] bg-white hover:bg-[#F3EEE0] hover:border-[#F0A63A] transition-all text-xs cursor-pointer shadow-sm text-[#0A1626] font-bold"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {dynamicResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mt-6 rounded-2xl border p-6 shadow-xl" 
              style={{ borderColor: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200/60">
                <p className="f-mono text-base font-bold text-[#0A1626]">{dynamicResult.title}</p>
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm" style={{ background: dynamicResult.badgeColor }}>
                  {dynamicResult.badge}
                </span>
              </div>

              {/* 6-Day Availability Forecast Strip for Seat Availability */}
              {dynamicResult.forecast && (
                <div className="mb-5 p-3 rounded-xl bg-[#F8F6F0] border border-[rgba(10,22,38,0.08)]">
                  <div className="text-[11px] font-mono font-bold text-gray-500 uppercase mb-2 flex items-center justify-between">
                    <span>📅 6-Day Availability Forecast</span>
                    <span className="text-[10px] text-green-700 font-bold">Click date to switch</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {dynamicResult.forecast.map((fc) => (
                      <button
                        key={fc.date}
                        onClick={() => handleCheck(undefined, `${fc.date}-2026`)}
                        className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                          travelDate.includes(fc.date)
                            ? 'bg-[#0A1626] text-white border-[#F0A63A] ring-1 ring-[#F0A63A]'
                            : 'bg-white text-[#0A1626] border-gray-200 hover:border-[#0A1626]'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-70">{fc.day}</div>
                        <div className="text-xs font-bold font-mono">{fc.date}</div>
                        <div className="text-[10px] font-bold mt-1" style={{ color: travelDate.includes(fc.date) ? '#F0A63A' : fc.color }}>
                          {fc.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {dynamicResult.lines.map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-1.5 border-b border-dashed last:border-none border-gray-200">
                    <span className="font-semibold text-xs sm:text-sm text-[#4B5563]">{k}</span>
                    <span className="font-mono font-bold text-xs sm:text-sm mt-0.5 sm:mt-0 text-[#0A1626]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#4B5563] font-medium">Detailed stop sequence, halts &amp; platform schedule</span>
                <button
                  onClick={() => {
                    const trainNum = dynamicResult.trainNo || (tab === "live" ? (value.trim() || "12951") : "12951");
                    const matchedTrain = getTrainByNumber(trainNum) || getTrainByNumber("12951");
                    setSelectedTimetableTrain(matchedTrain);
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-[#0A1626] text-[#F3EEE0] hover:bg-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Train size={14} className="text-[#F0A63A]" />
                  <span>View Route &amp; All Halts →</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Interactive Train Timetable Modal */}
      <TrainTimetableModal
        train={selectedTimetableTrain}
        isOpen={!!selectedTimetableTrain}
        onClose={() => setSelectedTimetableTrain(null)}
      />
    </section>
  );
}

/* ---------------- stats band ---------------- */

const STATS = [
  { value: "13,169", label: "trains running daily" },
  { value: "7,335", label: "stations connected" },
  { value: "1.2 M", label: "tickets booked a day" },
  { value: "23 M", label: "passengers carried daily" },
];

export function StatsBand() {
  return (
    <section className="mt-16 relative overflow-hidden" style={{ background: "var(--blue-3, #060F1D)" }}>
      {/* Subtle marigold glow */}
      <div style={{ position:"absolute", top:"-30%", left:"50%", transform:"translateX(-50%)", width:"60%", height:"200%", background:"radial-gradient(ellipse,rgba(229,169,61,0.07) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.09}>
            <div className="relative">
              <p className="f-serif font-bold" style={{ fontSize:"clamp(2rem,3.5vw,3rem)", color:"var(--marigold)", lineHeight:1.1 }}>
                {(() => {
                  const m = String(s.value).match(/^([^\d]*)([\d,]+)(.*)$/);
                  if (!m) return s.value;
                  return <CountUp value={Number(m[2].replace(/,/g, ""))} prefix={m[1]} suffix={m[3]} />;
                })()}
              </p>
              <p className="text-xs font-medium mt-2 leading-relaxed" style={{ color: "rgba(199,210,221,0.7)" }}>{s.label}</p>
              <div className="mt-3 h-px w-8" style={{ background:"rgba(229,169,61,0.3)" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- popular routes ---------------- */

/* ---------------- popular routes ---------------- */

const ROUTES = [
  { 
    from: "New Delhi", 
    to: "Mumbai Central", 
    code: "NDLS → MMCT", 
    trainNo: "12951",
    trainName: "Mumbai Tejas Rajdhani",
    nextDep: "16:55",
    arrTime: "08:35",
    platform: "PF 16",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 18, 
    from_fare: 685, 
    dur: "15h 40m", 
    fastest: "Rajdhani" 
  },
  { 
    from: "Howrah", 
    to: "New Delhi", 
    code: "HWH → NDLS", 
    trainNo: "12301",
    trainName: "Howrah Rajdhani",
    nextDep: "16:50",
    arrTime: "10:05",
    platform: "PF 9",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 24, 
    from_fare: 720, 
    dur: "17h 15m", 
    fastest: "Rajdhani" 
  },
  { 
    from: "Chennai Central", 
    to: "Bengaluru", 
    code: "MAS → SBC", 
    trainNo: "20607",
    trainName: "Mysuru Vande Bharat",
    nextDep: "05:50",
    arrTime: "10:25",
    platform: "PF 2A",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 31, 
    from_fare: 245, 
    dur: "4h 35m", 
    fastest: "Vande Bharat" 
  },
  { 
    from: "Secunderabad", 
    to: "Pune", 
    code: "SC → PUNE", 
    trainNo: "12026",
    trainName: "Pune Shatabdi Express",
    nextDep: "14:45",
    arrTime: "23:10",
    platform: "PF 1",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 12, 
    from_fare: 385, 
    dur: "8h 25m", 
    fastest: "Shatabdi" 
  },
  { 
    from: "Ahmedabad", 
    to: "Jaipur", 
    code: "ADI → JP", 
    trainNo: "12957",
    trainName: "Swarna Jayanti Rajdhani",
    nextDep: "17:40",
    arrTime: "02:55",
    platform: "PF 4",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 9, 
    from_fare: 310, 
    dur: "9h 15m", 
    fastest: "Rajdhani" 
  },
  { 
    from: "Lucknow", 
    to: "Varanasi", 
    code: "LKO → BSB", 
    trainNo: "22436",
    trainName: "Vande Bharat Express",
    nextDep: "06:00",
    arrTime: "10:55",
    platform: "PF 1",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 21, 
    from_fare: 155, 
    dur: "4h 55m", 
    fastest: "Vande Bharat" 
  },
  { 
    from: "Patna", 
    to: "New Delhi", 
    code: "PNBE → NDLS", 
    trainNo: "12309",
    trainName: "Patna Rajdhani",
    nextDep: "19:00",
    arrTime: "07:40",
    platform: "PF 1",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 16, 
    from_fare: 580, 
    dur: "12h 40m", 
    fastest: "Rajdhani" 
  },
  { 
    from: "New Delhi", 
    to: "Kolkata", 
    code: "NDLS → KOAA", 
    trainNo: "12314",
    trainName: "Sealdah Rajdhani",
    nextDep: "16:30",
    arrTime: "10:10",
    platform: "PF 12",
    status: "ON TIME",
    statusColor: "#1F7A4C",
    trains: 22, 
    from_fare: 695, 
    dur: "17h 40m", 
    fastest: "Rajdhani" 
  },
];

export function PopularRoutes({ onSearch }) {
  const [modalTrain, setModalTrain] = useState(null);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1F7A4C] animate-pulse" />
            <p className="f-mono text-xs tracking-widest uppercase font-bold" style={{ color: "var(--marigold-2)" }}>Live Train Timings & Popular Corridors</p>
          </div>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>Where India is travelling this week</h2>
          <p className="text-xs text-[#6B7280] mt-1 font-mono">Live GPS synchronized departure schedule · updated in real time</p>
        </div>
        <div className="hidden md:block w-56 flex-shrink-0"><RouteMapIllustration /></div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROUTES.map((r, i) => (
          <Reveal key={r.code} delay={i * 0.06}>
            <div
              className="w-full text-left rounded-2xl border bg-white p-5 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl group relative overflow-hidden flex flex-col justify-between"
              style={{ borderColor: "rgba(10,22,38,0.12)", boxShadow: "0 2px 8px rgba(15,42,69,0.05)" }}
            >
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0A1626]">
                    <Train size={13} className="text-[#F0A63A]" /> 
                    <span>{r.code}</span>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> {r.status}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="font-['Oswald'] font-semibold text-lg leading-snug text-[#0A1626]">
                    {r.from} <span className="text-gray-400 font-normal">→</span> {r.to}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                    #{r.trainNo} {r.trainName}
                  </p>
                </div>

                {/* Live Next Departure Box */}
                <div className="mt-3.5 p-3 rounded-xl bg-[#F8F6F0] border border-[rgba(10,22,38,0.08)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase font-mono block">Next Departure</span>
                    <span className="font-['Oswald'] font-bold text-base text-[#0A1626]">{r.nextDep}</span>
                    <span className="text-[10px] text-gray-500 ml-1 font-mono">({r.platform})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-500 uppercase font-mono block">Arrival</span>
                    <span className="font-['Oswald'] font-bold text-base text-[#0A1626]">{r.arrTime}</span>
                    <span className="text-[10px] text-green-700 ml-1 font-mono font-bold">({r.dur})</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-gray-500 text-[11px] font-mono">{r.trains} daily trains</span>
                  <span className="font-mono font-bold text-xs text-[#1F7A4C]">from ₹{r.from_fare}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const t = getTrainByNumber(r.trainNo) || getTrainByNumber("12951");
                      setModalTrain(t);
                    }}
                    className="py-2 px-2 text-center rounded-xl bg-white border border-[#0A1626]/20 hover:border-[#0A1626] hover:bg-gray-50 text-[#0A1626] font-bold text-[11px] font-mono transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    <Clock size={12} className="text-[#F0A63A]" /> Live Timings
                  </button>

                  <button
                    onClick={() => onSearch({ 
                      from: r.from, 
                      to: r.to, 
                      date: "25-Aug-2026", 
                      cls: "All classes", 
                      quota: "General", 
                      passengers: { adults: 1, children: 0, infants: 0 } 
                    })}
                    className="py-2 px-2 text-center rounded-xl bg-[#0A1626] hover:bg-black text-white font-bold text-[11px] font-mono transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    Book Seat →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Live Timetable Modal */}
      {modalTrain && (
        <TrainTimetableModal
          train={modalTrain}
          isOpen={!!modalTrain}
          onClose={() => setModalTrain(null)}
        />
      )}
    </section>
  );
}

/* ---------------- services grid ---------------- */

const SERVICES = [
  { icon: Ticket, title: "Reserved & Tatkal booking", body: "General, Tatkal, Premium Tatkal, Ladies, Senior Citizen, Divyangjan and Defence quotas. Live seat pressure shown on every date before you pick one. Supports up to 6 passengers per booking." },
  { icon: Hotel, title: "Retiring rooms & stays", body: "Book station retiring rooms at 900+ stations and IRCTC-partnered hotels alongside your ticket. AC/non-AC rooms and dorms available, with 4-hour and 12-hour stay options." },
  { icon: Sparkles, title: "e-Catering on the move", body: "Order meals from 500+ FSSAI-approved restaurant partners, delivered to your coach and seat at en-route stations. Multi-cuisine options including regional specialities." },
  { icon: Landmark, title: "Tourism & Bharat Gaurav", body: "60+ curated rail tourism packages covering pilgrimage circuits, beach holidays, heritage trains, and the luxury Maharajas' Express — bookable in one flow." },
  { icon: CreditCard, title: "Refunds you can follow", body: "TDR filing, refund timeline, and bank settlement stage shown day by day. 98.4% of eligible refunds settled within 5 working days — never a black box." },
  { icon: PhoneCall, title: "Help that answers", body: "24×7 helpline (139), email support, in-app chat, and a grievance tracker with a reference number and SLA clock. Average first response under 4 hours." },
];

export function Services() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="grid md:grid-cols-[1fr_0.8fr] gap-6 items-center">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Everything on one platform</p>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>More than a ticket window</h2>
          <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "var(--steel)" }}>
            Tickets, stays, meals and refunds — handled end to end, from the platform bench to the berth.
          </p>
        </div>
        <Reveal delay={0.1} className="hidden md:block"><StationIllustration /></Reveal>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.06} style={{ borderColor: "var(--line)" }}
              className="h-full rounded-xl border bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--paper-2)" }}>
                <Icon size={18} style={{ color: "var(--blue)" }} />
              </div>
              <p className="f-body font-semibold text-base" style={{ color: "var(--ink)" }}>{s.title}</p>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{s.body}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- how it works ---------------- */

const STEPS = [
  { n: "01", title: "Search", body: "Pick stations, date and quota. Seat pressure shows before you commit to a date." },
  { n: "02", title: "Compare", body: "Results sort by departure by default. Filter by train type and class in one tap." },
  { n: "03", title: "Pay", body: "UPI, cards, net banking or wallet — with an explicit outcome for every payment state." },
  { n: "04", title: "Travel", body: "e-Ticket, chart status, live running and refunds all live under My Trips." },
];

export function HowItWorks() {
  return (
    <section className="mt-20 relative overflow-hidden" style={{ background:"var(--paper-2)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <Reveal className="text-center mb-12">
          <p className="f-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--marigold-2)" }}>How it works</p>
          <h2 className="f-serif font-bold text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>Four stops, start to seat</h2>
        </Reveal>
        
        <ScrollLinkedRailLine steps={STEPS} />
      </div>
    </section>
  );
}

/* ---------------- trust strip ---------------- */

const TRUST = [
  { icon: ShieldCheck, k: "PCI-DSS payments", v: "Tokenised cards, no raw card data stored. UPI, Net Banking, and eWallet options available." },
  { icon: Clock, k: "Sub-second search", v: "Availability cached and refreshed every 30 seconds across 13,000+ trains." },
  { icon: BadgeCheck, k: "Verified refunds", v: "98.4% of eligible refunds settled within 5 working days. Track every step under My Trips." },
];

export function TrustStrip() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="rounded-2xl border p-5 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center" style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}>
        <Reveal className="hidden md:block w-40"><TrustIllustration /></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TRUST.map((t, i) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.k} delay={i * 0.08} className="flex gap-3">
              <div className="h-9 w-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-[var(--surface)]" style={{ color: "var(--green)" }}>
                <Icon size={17} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{t.k}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--steel)" }}>{t.v}</p>
              </div>
            </Reveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  { q: "When does Tatkal booking open?", a: "Tatkal opens at 10:00 AM one day before departure for AC classes and 11:00 AM for non-AC classes, counted from the train's origin station. Premium Tatkal opens at the same times with dynamic pricing." },
  { q: "My money was debited but I have no ticket. What now?", a: "The booking sits in a Pending state and is auto-reconciled with the bank. If the ticket is not issued, the full amount is reversed to the source account, typically within 3–5 working days, and the status is visible under My Trips." },
  { q: "What does RAC actually mean for my journey?", a: "RAC guarantees you board with a shared side-lower berth. If confirmed berths free up before or after charting, RAC passengers are upgraded in serial order. You can check your updated status on the PNR check tool." },
  { q: "Can I change the boarding station after booking?", a: "Yes, boarding point can be changed online up to 24 hours before scheduled departure, once per ticket, provided the new station is on the same route and before your original boarding station." },
  { q: "How is the refund calculated on cancellation?", a: "Cancellation charges depend on class and how far ahead you cancel; between 48 and 12 hours before departure, 25% of the fare is deducted. Closer cancellations carry 50%. The refund timeline is shown step by step under My Trips → Refunds." },
  { q: "Do children below 5 years need a ticket?", a: "No, children below 5 travel free without a berth. Children aged 5–11 can share a berth with a guardian at no charge, or be booked a separate berth at full adult fare. Children 12 and above require a full ticket." },
  { q: "How do I order meals on the train?", a: "Use e-Catering during booking or from My Trips. Choose from 500+ FSSAI-approved restaurants at en-route stations. Meals are delivered directly to your seat. Minimum order time is 2 hours before the train reaches the delivery station." },
  { q: "What ID proof do I need to carry?", a: "Carry any one government-issued photo ID — Aadhaar, PAN, Voter ID, Passport, or Driving Licence. The name on the ID should match the name on the ticket. ID is checked by the Travelling Ticket Examiner (TTE) on board." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 mt-14 pb-16">
      <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Questions</p>
      <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>The things people actually ask</h2>
      <div className="mt-5 rounded-xl border bg-[var(--surface)] overflow-hidden" style={{ borderColor: "var(--line)" }}>
        {FAQS.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className="border-b last:border-b-0" style={{ borderColor: "var(--line)" }}>
              <button onClick={() => setOpen(on ? -1 : i)} className="w-full flex items-center justify-between gap-3 text-left px-4 py-4">
                <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>{f.q}</span>
                <ChevronDown size={16} className="transition-transform flex-shrink-0"
                  style={{ color: "var(--steel)", transform: on ? "rotate(180deg)" : "none" }} />
              </button>
              {on && (
                <p className="px-4 pb-4 -mt-1 text-sm leading-relaxed anim-fade-up" style={{ color: "var(--steel)" }}>{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- destination discovery ---------------- */

const DESTINATIONS = [
  { title: "Mountains", subtitle: "Himalayan Railways & Escapes", imgUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
  { title: "Coast", subtitle: "Konkan & Southern Shores", imgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
  { title: "Culture", subtitle: "Temples & Heritage Circuits", imgUrl: "https://images.unsplash.com/photo-1560179406-1c6c60e0dcb6?q=80&w=800&auto=format&fit=crop" },
  { title: "Cities", subtitle: "Metros & Urban Connections", imgUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800&auto=format&fit=crop" },
];

export function DestinationDiscovery() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Explore</p>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>Find your next journey</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINATIONS.map((dest, i) => (
          <div key={dest.title} className="group relative rounded-2xl overflow-hidden cursor-pointer h-64 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <img 
              src={dest.imgUrl} 
              alt={dest.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="f-serif font-bold text-xl text-white mb-1">{dest.title}</h3>
              <p className="f-body text-sm text-white/80">{dest.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
