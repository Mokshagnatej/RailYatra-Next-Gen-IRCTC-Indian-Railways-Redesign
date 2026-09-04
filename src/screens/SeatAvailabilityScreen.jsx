import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Train, Sparkles, CheckCircle2, AlertCircle, Clock,
  ArrowRight, ShieldCheck, UserCheck, RefreshCw, ChevronRight,
  TrendingUp, Activity, Compass, MapPin
} from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { RangoliOverlay, WarmGradientWave } from '../components/common/CulturalPatterns';
import StationPickerDropdown from '../components/common/StationPickerDropdown';
import TrainTimetableModal from '../components/common/TrainTimetableModal';
import { getTrainByNumber, searchTrainsBetween } from '../lib/trainRouteService';
import { getQuickDates, getSeatForecast, formatDateMedium } from '../lib/dateUtils';

export default function SeatAvailabilityScreen({ onBook, onNavigate }) {
  const [mode, setMode] = useState("train"); // 'train' | 'route'
  const [trainInput, setTrainInput] = useState("16052");
  const [fromStation, setFromStation] = useState("NDLS");
  const [toStation, setToStation] = useState("MMCT");
  const QUICK_DATES = useMemo(() => getQuickDates(7), []);
  const [date, setDate] = useState(QUICK_DATES[0]?.value || formatDateMedium(new Date()));
  const [quota, setQuota] = useState("General");
  const [loading, setLoading] = useState(false);
  const [trainResult, setTrainResult] = useState(null);
  const [routeResults, setRouteResults] = useState([]);
  const [selectedTimetableTrain, setSelectedTimetableTrain] = useState(null);

  const QUICK_TRAINS = [
    { no: "16052", name: "Tirupati Express (TPTY → MAS)" },
    { no: "12951", name: "Mumbai Tejas Rajdhani (NDLS → MMCT)" },
    { no: "22436", name: "Vande Bharat Express (NDLS → BSB)" },
    { no: "12002", name: "Bhopal Shatabdi (NDLS → RKMP)" },
    { no: "12622", name: "Tamil Nadu Express (NDLS → MAS)" },
    { no: "12301", name: "Howrah Rajdhani (HWH → NDLS)" }
  ];

  const QUOTAS = [
    { id: "General", label: "General (GN)" },
    { id: "Tatkal", label: "Tatkal (CK)" },
    { id: "Premium Tatkal", label: "Premium Tatkal (PT)" },
    { id: "Ladies", label: "Ladies (LD)" },
    { id: "Senior Citizen", label: "Senior Citizen (SS)" }
  ];

  // Auto-search initial train
  useEffect(() => {
    handleSearchTrain("16052");
  }, []);

  const handleSearchTrain = (noToSearch) => {
    const targetNo = noToSearch || trainInput;
    if (!targetNo) return;
    setLoading(true);
    setTimeout(() => {
      const train = getTrainByNumber(targetNo);
      setTrainResult(train);
      setLoading(false);
    }, 200);
  };

  const handleSearchRoute = () => {
    setLoading(true);
    setTimeout(() => {
      const results = searchTrainsBetween(fromStation, toStation, date);
      setRouteResults(results);
      setLoading(false);
    }, 250);
  };

  // Generate 6-day dynamic forecast
  const getForecastForClass = (cls) => {
    return getSeatForecast(6, new Date());
  };

  return (
    <div className="min-h-screen f-body pb-24 relative bg-[#FBF9F4]">
      <RangoliOverlay position="bottom-right" size={260} opacity={0.03} />
      <RangoliOverlay position="bottom-left" size={260} opacity={0.03} />

      <PageHero
        eyebrow="Real-Time Seat Availability"
        title="Know your seat before you book."
        sub="Instant seat confirmation probability, RAC movement predictions, Tatkal quotas, and 6-day availability trends across all 13,000+ Indian Railway trains."
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6 relative z-10">
        
        {/* Search Mode Toggle Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-1.5 rounded-2xl bg-white border border-[rgba(10,22,38,0.12)] shadow-sm flex items-center gap-1">
            <button
              onClick={() => setMode("train")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                mode === "train"
                  ? "bg-[#0A1626] text-white shadow-md"
                  : "text-[#4B5563] hover:text-[#0A1626] hover:bg-gray-100"
              }`}
            >
              <Train size={16} className={mode === "train" ? "text-[#F0A63A]" : ""} />
              <span>By Train Number / Name</span>
            </button>
            <button
              onClick={() => setMode("route")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                mode === "route"
                  ? "bg-[#0A1626] text-white shadow-md"
                  : "text-[#4B5563] hover:text-[#0A1626] hover:bg-gray-100"
              }`}
            >
              <Compass size={16} className={mode === "route" ? "text-[#F0A63A]" : ""} />
              <span>Between Two Stations</span>
            </button>
          </div>
        </div>

        {/* Search Box Bento Card */}
        <div className="p-6 rounded-3xl bg-white border border-[rgba(10,22,38,0.1)] shadow-xl mb-10">
          
          {mode === "train" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-[#0A1626] uppercase tracking-wider mb-2">
                    Enter Train Number or Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={trainInput}
                      onChange={e => setTrainInput(e.target.value)}
                      placeholder="e.g. 16052, 12951, Tirupati Express..."
                      className="w-full h-12 px-4 pl-11 rounded-2xl border border-[rgba(10,22,38,0.18)] bg-white text-sm font-semibold text-[#0A1626] outline-none focus:border-[#0A1626] focus:ring-2 focus:ring-[#F0A63A]/20 transition-all"
                    />
                    <Train size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0A1626] uppercase tracking-wider mb-2">
                    Quota
                  </label>
                  <select
                    value={quota}
                    onChange={e => setQuota(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl border border-[rgba(10,22,38,0.18)] bg-white text-xs font-bold text-[#0A1626] outline-none cursor-pointer"
                  >
                    {QUOTAS.map(q => (
                      <option key={q.id} value={q.id}>{q.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <button
                    onClick={() => handleSearchTrain()}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-[#0A1626] hover:bg-[#132338] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? <RefreshCw size={18} className="animate-spin text-[#F0A63A]" /> : <CheckCircle2 size={18} className="text-[#F0A63A]" />}
                    <span>Check Availability</span>
                  </button>
                </div>
              </div>

              {/* Quick Train Chips */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[rgba(10,22,38,0.06)]">
                <span className="text-xs font-bold text-[#6B7280]">Popular:</span>
                {QUICK_TRAINS.map(t => (
                  <button
                    key={t.no}
                    onClick={() => {
                      setTrainInput(t.no);
                      handleSearchTrain(t.no);
                    }}
                    className={`text-xs px-3 py-1 rounded-xl border transition-all cursor-pointer font-medium ${
                      trainInput === t.no
                        ? "bg-[#0A1626] text-white border-[#0A1626] shadow-xs"
                        : "bg-[#F3EEE0]/60 hover:bg-[#F3EEE0] text-[#0A1626] border-[rgba(10,22,38,0.1)]"
                    }`}
                  >
                    #{t.no} {t.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-[#0A1626] uppercase tracking-wider mb-2">
                    From Station
                  </label>
                  <StationPickerDropdown value={fromStation} onChange={setFromStation} placeholder="Select origin station..." />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-[#0A1626] uppercase tracking-wider mb-2">
                    To Station
                  </label>
                  <StationPickerDropdown value={toStation} onChange={setToStation} placeholder="Select destination..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0A1626] uppercase tracking-wider mb-2">
                    Quota
                  </label>
                  <select
                    value={quota}
                    onChange={e => setQuota(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl border border-[rgba(10,22,38,0.18)] bg-white text-xs font-bold text-[#0A1626] outline-none cursor-pointer"
                  >
                    {QUOTAS.map(q => (
                      <option key={q.id} value={q.id}>{q.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={handleSearchRoute}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-[#0A1626] hover:bg-[#132338] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? <RefreshCw size={18} className="animate-spin text-[#F0A63A]" /> : <Compass size={18} className="text-[#F0A63A]" />}
                    <span>Find Trains</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Date Selector Strip */}
          <div className="mt-5 pt-4 border-t border-[rgba(10,22,38,0.08)] flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#0A1626] flex items-center gap-1 shrink-0 mr-1">
              <Calendar size={14} className="text-[#F0A63A]" /> Date:
            </span>
            {QUICK_DATES.map(d => (
              <button
                key={d.value}
                onClick={() => {
                  setDate(d.value);
                  if (mode === "train") handleSearchTrain();
                  else handleSearchRoute();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  date === d.value
                    ? "bg-[#F0A63A] text-[#0A1626] shadow-sm font-extrabold"
                    : "bg-[#F3EEE0] hover:bg-[#EAE2C9] text-[#0A1626] border border-[rgba(10,22,38,0.08)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS: Search by Train Number */}
        {mode === "train" && trainResult && (
          <div className="space-y-6">
            
            {/* Train Header Banner */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-[#0A1626] text-[#F0A63A] f-accent font-extrabold text-sm shadow-xs">
                    #{trainResult.trainNo}
                  </span>
                  <h2 className="text-xl font-extrabold text-[#0A1626]">
                    {trainResult.trainName}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                    {trainResult.type}
                  </span>
                  {trainResult.pantry && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                      🍽 Pantry Car
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6B7280] flex items-center gap-2 mt-1">
                  <span className="font-semibold text-[#0A1626]">{trainResult.fromStationName}</span>
                  <ArrowRight size={12} />
                  <span className="font-semibold text-[#0A1626]">{trainResult.toStationName}</span>
                  <span>· Departs {trainResult.depTime} · Arrives {trainResult.arrTime} ({trainResult.totalDuration})</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedTimetableTrain(trainResult)}
                  className="px-4 py-2 rounded-xl bg-[#F3EEE0] hover:bg-[#EAE2C9] text-[#0A1626] font-bold text-xs border border-[rgba(10,22,38,0.15)] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Activity size={14} className="text-[#F0A63A]" />
                  <span>View All Halts ({trainResult.schedule?.length || 10} Stops)</span>
                </button>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-[#0A1626]">
                  Available Classes for {date} ({quota} Quota)
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live IRCTC Synced
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(trainResult.classes || {}).map(([cls, info]) => {
                  const isAvailable = info.status === "AVAILABLE";
                  const forecast = getForecastForClass(cls);

                  return (
                    <div
                      key={cls}
                      className="p-5 rounded-3xl bg-white border border-[rgba(10,22,38,0.1)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="f-accent font-black text-lg text-[#0A1626]">{cls}</span>
                            <span className="text-xs text-[#6B7280] block font-medium">
                              {cls === "1A" ? "AC First Class" : cls === "2A" ? "AC 2-Tier" : cls === "3A" ? "AC 3-Tier" : cls === "CC" ? "AC Chair Car" : cls === "EC" ? "Exec Chair Car" : "Sleeper Class"}
                            </span>
                          </div>
                          <span className="f-accent font-extrabold text-base text-[#0A1626]">
                            ₹{info.fare}
                          </span>
                        </div>

                        {/* Availability Status Badge */}
                        <div className={`p-3 rounded-2xl border mb-3 flex items-center justify-between ${
                          isAvailable
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className={isAvailable ? "text-emerald-600" : "text-amber-600"} />
                            <div>
                              <span className="f-accent font-extrabold text-sm block">
                                {isAvailable ? `AVAILABLE - ${info.n || 42}` : `RAC ${info.n || 8}`}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 block">
                                {isAvailable ? "99% High Confirmation Chance" : "85% Movement Probability"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 6-Day Mini Forecast */}
                        <div>
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                            6-Day Availability Forecast
                          </span>
                          <div className="grid grid-cols-6 gap-1 text-center">
                            {forecast.map(f => (
                              <div key={f.d} className={`p-1 rounded-lg border text-[9px] font-bold f-accent ${f.color}`}>
                                <span className="block opacity-75">{f.d.split(" ")[0]}</span>
                                <span className="block truncate">{f.status.split(" ")[0]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (onBook) {
                            onBook({
                              train: {
                                no: trainResult.trainNo,
                                name: trainResult.trainName,
                                type: trainResult.type || "Express",
                                from: trainResult.fromStationCode || "NDLS",
                                to: trainResult.toStationCode || "MMCT",
                                dep: trainResult.depTime || "16:35",
                                arr: trainResult.arrTime || "08:35",
                                dur: trainResult.totalDuration || "16h 00m",
                                classes: trainResult.classes || {}
                              },
                              cls,
                              fare: info.fare,
                              date
                            });
                          } else if (onNavigate) {
                            onNavigate("booking");
                          }
                        }}
                        className="w-full h-11 rounded-2xl bg-[#0A1626] hover:bg-[#132338] text-white font-bold text-xs cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      >
                        <span>Book {cls} for ₹{info.fare}</span>
                        <ChevronRight size={14} className="text-[#F0A63A]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS: Search Between Two Stations */}
        {mode === "route" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#0A1626]">
                Direct Trains between {fromStation} and {toStation} ({routeResults.length} Found)
              </h3>
            </div>

            {routeResults.length === 0 && !loading ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[rgba(10,22,38,0.1)]">
                <Compass size={36} className="mx-auto text-[#6B7280] mb-3" />
                <p className="font-bold text-sm text-[#0A1626]">No direct trains found for this route.</p>
                <p className="text-xs text-[#6B7280] mt-1">Try major junctions like NDLS, MMCT, HWH, MAS, SBC.</p>
              </div>
            ) : (
              routeResults.map((t) => (
                <div
                  key={t.no}
                  className="p-5 rounded-3xl bg-white border border-[rgba(10,22,38,0.1)] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="f-accent font-extrabold text-xs px-2.5 py-0.5 rounded-lg bg-[#0A1626] text-[#F0A63A]">
                        #{t.no}
                      </span>
                      <h4 className="font-bold text-base text-[#0A1626]">{t.name}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {t.type}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280]">
                      Departs {t.dep} · Arrives {t.arr} · Duration {t.dur} · {t.stops} Stops
                    </p>

                    {/* Classes strip */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {Object.entries(t.classes || {}).map(([cls, info]) => (
                        <div key={cls} className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2">
                          <span className="f-accent font-bold text-emerald-950">{cls}</span>
                          <span className="f-accent text-emerald-700 font-extrabold">₹{info.fare}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                            {info.status === "AVAILABLE" ? `AVL ${info.n || 32}` : "RAC"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedTimetableTrain(t.rawTrain || getTrainByNumber(t.no))}
                      className="px-3.5 py-2.5 rounded-xl border border-[rgba(10,22,38,0.15)] text-xs font-bold text-[#0A1626] hover:bg-[#F3EEE0] cursor-pointer"
                    >
                      View Halts
                    </button>
                    <button
                      onClick={() => {
                        const firstCls = Object.keys(t.classes || {})[0] || "3A";
                        const fare = t.classes?.[firstCls]?.fare || 1150;
                        if (onBook) {
                          onBook({
                            train: {
                              no: t.no,
                              name: t.name,
                              type: t.type || "Express",
                              from: t.from || fromStation,
                              to: t.to || toStation,
                              dep: t.dep || "12:00",
                              arr: t.arr || "18:00",
                              dur: t.dur || "6h 00m",
                              classes: t.classes || {}
                            },
                            cls: firstCls,
                            fare,
                            date
                          });
                        } else if (onNavigate) {
                          onNavigate("booking");
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#0A1626] hover:bg-[#132338] text-white text-xs font-bold cursor-pointer shadow-sm"
                    >
                      Book Ticket
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Train Timetable Modal */}
      <TrainTimetableModal
        train={selectedTimetableTrain}
        isOpen={!!selectedTimetableTrain}
        onClose={() => setSelectedTimetableTrain(null)}
        selectedFromCode={fromStation}
        selectedToCode={toStation}
      />
    </div>
  );
}
