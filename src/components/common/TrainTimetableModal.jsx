import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Train, Clock, MapPin, Navigation, Calendar, ShieldCheck, Utensils,
  Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Activity, Coffee
} from "lucide-react";
export default function TrainTimetableModal({
  train,
  isOpen,
  onClose,
  selectedFromCode,
  selectedToCode,
}) {
  const [showSkipped, setShowSkipped] = useState(false);

  if (!isOpen || !train) return null;

  const originName = train.origin?.name || train.fromStationName || train.schedule?.[0]?.stationName || "Origin";
  const originCode = train.origin?.code || train.fromStationCode || train.schedule?.[0]?.stationCode || "ORIG";
  const destName = train.destination?.name || train.toStationName || train.schedule?.[train.schedule.length - 1]?.stationName || "Destination";
  const destCode = train.destination?.code || train.toStationCode || train.schedule?.[train.schedule.length - 1]?.stationCode || "DEST";
  const runsOnStr = train.runsOn || "MTWTFSS";
  const coachComposition = train.coachComposition || ["ENG", "EOG", "B1", "B2", "B3", "A1", "A2", "H1", "SL1", "SL2", "EOG"];
  const catering = train.catering || (train.pantry ? "Pantry Car Available · Hot Meals Served" : "IRCTC e-Catering Available");
  const avgSpeed = train.avgSpeedKmH || Math.round(train.totalDistanceKm / 15) || 75;

  const daysArr = [
    { label: "M", full: "Mon", active: runsOnStr[0] !== "_" },
    { label: "T", full: "Tue", active: runsOnStr[1] !== "_" },
    { label: "W", full: "Wed", active: runsOnStr[2] !== "_" },
    { label: "T", full: "Thu", active: runsOnStr[3] !== "_" },
    { label: "F", full: "Fri", active: runsOnStr[4] !== "_" },
    { label: "S", full: "Sat", active: runsOnStr[5] !== "_" },
    { label: "S", full: "Sun", active: runsOnStr[6] !== "_" },
  ];

  // Merge scheduled halts and skipped passing stations in distance order if toggled
  const mergedTimeline = [];

  (train.schedule || []).forEach((s) => {
    mergedTimeline.push({
      type: "halt",
      ...s,
    });
  });

  if (showSkipped && train.skippedStations) {
    train.skippedStations.forEach((sk) => {
      mergedTimeline.push({
        type: "skipped",
        stationCode: sk.stationCode,
        stationName: sk.stationName,
        distKm: sk.distKm,
        state: sk.state,
      });
    });
  }

  // Sort timeline strictly by distance
  mergedTimeline.sort((a, b) => a.distKm - b.distKm);

  const modalContent = (
    <div 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto" 
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[rgba(10,22,38,0.15)] flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-[#0A1626] p-6 text-white flex items-start justify-between border-b border-white/10 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#F0A63A]/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0A63A] text-[#0A1626] uppercase tracking-wider">
                {train.type}
              </span>
              <span className="f-accent text-xs text-[#94A3B8] font-semibold">
                Train #{train.trainNo}
              </span>
            </div>
            <h2 className="f-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              {train.trainName}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1.5 font-medium">
              <span>{originName} ({originCode})</span>
              <ArrowRight size={13} className="text-[#F0A63A]" />
              <span>{destName} ({destCode})</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Train Quick Summary Strip */}
        <div className="bg-[#F3EEE0] border-b border-[rgba(10,22,38,0.1)] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-[#0A1626] font-semibold">
            <div>
              <span className="text-[#6B7280] block text-[10px] uppercase f-accent">Distance</span>
              <span>{train.totalDistanceKm} km</span>
            </div>
            <div className="h-6 w-px bg-black/10" />
            <div>
              <span className="text-[#6B7280] block text-[10px] uppercase f-accent">Total Time</span>
              <span className="font-bold">{train.duration || train.totalDuration || "3h 30m"}</span>
            </div>
            <div className="h-6 w-px bg-black/10" />
            <div>
              <span className="text-[#6B7280] block text-[10px] uppercase f-accent">Avg Speed</span>
              <span className="font-bold">{avgSpeed} km/h</span>
            </div>
            <div className="h-6 w-px bg-black/10" />
            <div>
              <span className="text-[#6B7280] block text-[10px] uppercase f-accent">Halts</span>
              <span className="font-bold">{(train.schedule || []).length} Stops</span>
            </div>
          </div>

          {/* Running Days Chips */}
          <div className="flex items-center gap-1">
            <span className="text-[#6B7280] text-[11px] font-medium mr-1">Runs:</span>
            {daysArr.map((d, i) => (
              <span
                key={i}
                title={d.full}
                className={`h-5 w-5 rounded text-[10px] font-bold f-accent flex items-center justify-center ${
                  d.active
                    ? "bg-[#0A1626] text-white shadow-xs"
                    : "bg-black/5 text-[#9CA3AF]"
                }`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {/* Coach Composition & Catering Strip */}
        <div className="px-6 py-3 bg-white border-b border-[rgba(10,22,38,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4B5563]">
            <Utensils size={14} className="text-[#F0A63A]" />
            <span className="font-semibold text-[#0A1626]">Catering:</span>
            <span>{catering}</span>
          </div>

          {/* Toggle for skipped passing stations */}
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showSkipped
                ? "bg-[#0A1626] text-white border-[#0A1626]"
                : "bg-white text-[#0A1626] border-[rgba(10,22,38,0.15)] hover:bg-[#F3EEE0]"
            }`}
          >
            {showSkipped ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>
              {showSkipped ? "Hide Wayside Stations" : `Show Wayside Stations (${train.skippedStations?.length || 0})`}
            </span>
          </button>
        </div>

        {/* Coach Sequence visualization */}
        {train.coachComposition && (
          <div className="px-6 py-2.5 bg-gray-50 border-b border-[rgba(10,22,38,0.06)] overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
            <span className="text-[10px] f-accent uppercase font-bold text-[#6B7280] mr-1 flex-shrink-0">
              Rake Layout:
            </span>
            {train.coachComposition.map((c, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded text-[10px] f-accent font-bold flex-shrink-0 border ${
                  c === "ENG"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : c === "PC"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : c.startsWith("H") || c.startsWith("E")
                    ? "bg-purple-100 text-purple-900 border-purple-300"
                    : c.startsWith("A")
                    ? "bg-blue-100 text-blue-900 border-blue-300"
                    : "bg-white text-[#0A1626] border-gray-300"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Interactive Schedule Table / Timeline */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
          <div className="flex items-center justify-between text-xs f-accent font-bold text-[#6B7280] px-3 pb-1 border-b border-[rgba(10,22,38,0.1)]">
            <span className="w-10">SEQ</span>
            <span className="flex-1">STATION</span>
            <span className="w-16 text-center">ARR</span>
            <span className="w-16 text-center">DEP</span>
            <span className="w-16 text-center">HALT</span>
            <span className="w-14 text-right">DIST</span>
            <span className="w-12 text-right hidden sm:inline">PF</span>
          </div>

          <div className="space-y-1.5 relative">
            {/* Continuous Vertical Rail Line */}
            <div className="absolute left-[29px] top-4 bottom-4 w-1 bg-gradient-to-b from-[#15803D] via-[#F0A63A] to-[#DC2626] rounded-full opacity-30 pointer-events-none" />

            {mergedTimeline.map((item, idx) => {
              const isHalt = item.type === "halt";
              const isOrigin = idx === 0;
              const isDest = idx === mergedTimeline.length - 1;
              const isSelectedFrom = selectedFromCode && item.stationCode === selectedFromCode;
              const isSelectedTo = selectedToCode && item.stationCode === selectedToCode;

              if (!isHalt) {
                // Non-stopping wayside station
                return (
                  <div
                    key={`skip-${item.stationCode}-${idx}`}
                    className="flex items-center justify-between text-xs py-1 px-3 rounded-lg bg-gray-50/70 border border-dashed border-gray-200 text-[#9CA3AF] opacity-70"
                  >
                    <span className="w-10 f-accent text-[10px] text-gray-400">---</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="font-medium text-gray-600">{item.stationName}</span>
                      <span className="f-accent text-[10px] text-gray-400">({item.stationCode})</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-200 text-gray-600 uppercase font-bold">
                        Pass Through · No Halt
                      </span>
                    </div>
                    <span className="w-16 text-center text-gray-400">--:--</span>
                    <span className="w-16 text-center text-gray-400">--:--</span>
                    <span className="w-16 text-center text-gray-400">Speed</span>
                    <span className="w-14 text-right f-accent text-gray-400">{item.distKm} km</span>
                    <span className="w-12 text-right hidden sm:inline text-gray-400">-</span>
                  </div>
                );
              }

              // Scheduled Halting Station
              return (
                <div
                  key={`halt-${item.stationCode}-${idx}`}
                  className={`flex items-center justify-between text-xs py-2.5 px-3 rounded-xl border transition-all ${
                    isSelectedFrom || isSelectedTo
                      ? "bg-amber-50/80 border-[#F0A63A] ring-1 ring-[#F0A63A] shadow-xs"
                      : isOrigin
                      ? "bg-emerald-50/70 border-emerald-200"
                      : isDest
                      ? "bg-red-50/70 border-red-200"
                      : "bg-white border-[rgba(10,22,38,0.08)] hover:bg-[#F3EEE0]/50"
                  }`}
                >
                  <span className="w-10 f-accent font-bold text-[#6B7280]">
                    {item.seq || idx + 1}
                  </span>

                  <div className="flex-1 flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className={`h-3 w-3 rounded-full flex-shrink-0 border-2 ${
                        isOrigin
                          ? "bg-emerald-600 border-emerald-200 shadow-sm"
                          : isDest
                          ? "bg-red-600 border-red-200 shadow-sm"
                          : "bg-[#0A1626] border-white shadow-xs"
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-bold text-[#0A1626] text-[13px] block truncate">
                        {item.stationName}
                      </span>
                      <span className="f-accent text-[10px] text-[#6B7280] font-semibold">
                        {item.stationCode} {item.state && `· ${item.state}`} {item.day && `· Day ${item.day}`}
                      </span>
                    </div>
                  </div>

                  <span className="w-16 text-center f-accent font-bold text-[#0A1626]">
                    {item.arr}
                  </span>
                  <span className="w-16 text-center f-accent font-bold text-[#0A1626]">
                    {item.dep}
                  </span>

                  <span className="w-16 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] f-accent font-bold inline-block ${
                        isOrigin || isDest
                          ? "bg-gray-100 text-gray-700 font-semibold"
                          : "bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {item.haltMin}
                    </span>
                  </span>

                  <span className="w-14 text-right f-accent font-bold text-[#4B5563]">
                    {item.distKm} km
                  </span>

                  <span className="w-12 text-right hidden sm:inline f-accent text-[11px] font-bold text-[#0A1626]">
                    {item.platform || "PF 1"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="bg-[#0A1626] text-white px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-[#94A3B8]">
            Indian Railways Timetable · Live Platform & Halt schedules
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl font-bold bg-[#F0A63A] text-[#0A1626] hover:bg-amber-400 transition-colors cursor-pointer shadow-sm"
          >
            Close Timetable
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
