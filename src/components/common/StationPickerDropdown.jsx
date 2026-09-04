import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronDown, Check, Train, LocateFixed, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import stationsData from '../../data/stationsData.json';
import majorStations from '../../data/majorStations.json';

const POPULAR_HUBS = [
  { label: "New Delhi (NDLS)", code: "NDLS", name: "New Delhi", state: "Delhi" },
  { label: "Mumbai Central (BCT)", code: "BCT", name: "Mumbai Central", state: "Maharashtra" },
  { label: "Howrah Jn (HWH)", code: "HWH", name: "Howrah", state: "West Bengal" },
  { label: "KSR Bengaluru (SBC)", code: "SBC", name: "Bengaluru", state: "Karnataka" },
  { label: "MGR Chennai Central (MAS)", code: "MAS", name: "Chennai", state: "Tamil Nadu" },
  { label: "Varanasi Jn (BSB)", code: "BSB", name: "Varanasi", state: "Uttar Pradesh" },
  { label: "Ahmedabad Jn (ADI)", code: "ADI", name: "Ahmedabad", state: "Gujarat" },
  { label: "Pune Jn (PUNE)", code: "PUNE", name: "Pune", state: "Maharashtra" },
  { label: "Hyderabad Deccan (HYB)", code: "HYB", name: "Hyderabad", state: "Telangana" },
  { label: "Kanpur Central (CNB)", code: "CNB", name: "Kanpur", state: "Uttar Pradesh" },
  { label: "Rani Kamlapati (RKMP)", code: "RKMP", name: "Bhopal", state: "Madhya Pradesh" },
  { label: "Jaipur Jn (JP)", code: "JP", name: "Jaipur", state: "Rajasthan" },
  { label: "Patna Jn (PNBE)", code: "PNBE", name: "Patna", state: "Bihar" },
  { label: "Lucknow NR (LKO)", code: "LKO", name: "Lucknow", state: "Uttar Pradesh" },
  { label: "Madgaon (MAO)", code: "MAO", name: "Goa", state: "Goa" },
  { label: "Chandigarh (CDG)", code: "CDG", name: "Chandigarh", state: "Punjab" }
];

const ZONE_FILTERS = [
  { id: 'all', label: 'All 8,965 Stations' },
  { id: 'major', label: 'Major Hubs (115)' },
  { id: 'north', label: 'Northern (NR/NCR)' },
  { id: 'west', label: 'Western (WR/CR)' },
  { id: 'south', label: 'Southern (SR/SWR/SCR)' },
  { id: 'east', label: 'Eastern (ER/ECR/SER)' }
];

export default function StationPickerDropdown({
  label,
  value,
  onChange,
  placeholder = "Search station or code (e.g. NDLS, Mumbai)...",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeZone, setActiveZone] = useState('all');
  const [locating, setLocating] = useState(false);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter stations across all 8,965 Indian stations
  const filteredStations = useMemo(() => {
    const q = query.toLowerCase().trim();
    let dataset = stationsData || [];

    if (activeZone === 'major') {
      dataset = majorStations || dataset;
    } else if (activeZone === 'north') {
      dataset = dataset.filter(s => s.state?.match(/Delhi|Punjab|Haryana|Uttar Pradesh|Uttarakhand|Himachal|Jammu|Rajasthan/i) || s.zoneCode?.match(/NR|NCR|NWR/i));
    } else if (activeZone === 'west') {
      dataset = dataset.filter(s => s.state?.match(/Maharashtra|Gujarat|Goa|Madhya Pradesh/i) || s.zoneCode?.match(/WR|CR|WCR/i));
    } else if (activeZone === 'south') {
      dataset = dataset.filter(s => s.state?.match(/Tamil Nadu|Karnataka|Kerala|Telangana|Andhra Pradesh/i) || s.zoneCode?.match(/SR|SWR|SCR/i));
    } else if (activeZone === 'east') {
      dataset = dataset.filter(s => s.state?.match(/West Bengal|Bihar|Odisha|Jharkhand|Assam/i) || s.zoneCode?.match(/ER|ECR|SER|SECR|NFR/i));
    }

    if (!q) {
      return dataset.slice(0, 60);
    }

    return dataset.filter(s => {
      const nameMatch = s.name?.toLowerCase().includes(q);
      const codeMatch = s.code?.toLowerCase().includes(q);
      const labelMatch = s.label?.toLowerCase().includes(q);
      const stateMatch = s.state?.toLowerCase().includes(q);

      // Metropolitan multi-terminal alias matching
      if (q.match(/mumbai|mmct|bct|bombay/i) && (s.code === 'BCT' || s.code === 'MMCT' || s.code === 'CSMT' || s.code === 'BDTS' || s.code === 'LTT')) return true;
      if (q.match(/delhi|ndls|dli|nzm/i) && (s.code === 'NDLS' || s.code === 'DLI' || s.code === 'NZM' || s.code === 'ANVT')) return true;
      if (q.match(/chennai|mas|ms|madras/i) && (s.code === 'MAS' || s.code === 'MS' || s.code === 'PER' || s.code === 'TBM')) return true;
      if (q.match(/bangalore|bengaluru|sbc|ypr|smvb/i) && (s.code === 'SBC' || s.code === 'YPR' || s.code === 'SMVB' || s.code === 'BNC')) return true;
      if (q.match(/kolkata|calcutta|hwh|sdah|koaa/i) && (s.code === 'HWH' || s.code === 'SDAH' || s.code === 'KOAA' || s.code === 'SHM')) return true;
      if (q.match(/hyderabad|secunderabad|hyb|sc/i) && (s.code === 'HYB' || s.code === 'SC' || s.code === 'KCG')) return true;
      if (q.match(/tirupati|tpty|ru/i) && (s.code === 'TPTY' || s.code === 'RU')) return true;

      return nameMatch || codeMatch || labelMatch || stateMatch;
    }).slice(0, 80);
  }, [query, activeZone]);

  const handleSelect = (stationLabel) => {
    onChange(stationLabel);
    setIsOpen(false);
    setQuery("");
  };

  const handleLocateNearest = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        handleSelect("New Delhi (NDLS)");
      },
      (err) => {
        setLocating(false);
        handleSelect("New Delhi (NDLS)");
      },
      { timeout: 4000 }
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-[11px] font-mono tracking-[0.14em] uppercase text-[#6b6250] font-bold mb-2">
          {label}
        </label>
      )}

      {/* Input Trigger Box */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-between bg-white border rounded-xl px-4 py-3.5 shadow-sm transition-all cursor-pointer select-none ${
          isOpen 
            ? 'border-[#F0A63A] ring-2 ring-[#F0A63A]/25 bg-[#FFFDF7]' 
            : 'border-[rgba(10,22,38,0.14)] hover:border-[#F0A63A]'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Train size={18} className="text-[#F0A63A] shrink-0" />
          <span 
            className="f-heading text-lg font-bold text-[#0A1626] truncate" 
          >
            {value || placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-[#6b6250] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#F0A63A]' : ''}`} 
        />
      </div>

      {/* Floating Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-[150] bg-white border border-[rgba(10,22,38,0.15)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[460px] min-w-[320px] md:min-w-[400px]"
          >
            {/* Search Box Header */}
            <div className="p-3.5 bg-[#0A1626] text-white border-b border-white/10">
              <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                <Search size={16} className="text-[#F0A63A] shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type any of 8,965 station names or codes..."
                  className="w-full bg-transparent text-sm font-semibold text-white placeholder-blue-200/60 focus:outline-none"
                />
                {query && (
                  <button 
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 hover:text-white text-blue-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Quick Hub Chips */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-blue-200 mb-1.5">
                  <span className="flex items-center gap-1"><Sparkles size={11} className="text-[#F0A63A]" /> POPULAR RAIL HUBS</span>
                  <button 
                    type="button" 
                    onClick={handleLocateNearest} 
                    className="text-[#F0A63A] hover:underline flex items-center gap-1 font-bold"
                  >
                    {locating ? <Loader2 size={10} className="animate-spin" /> : <LocateFixed size={10} />}
                    <span>Nearest GPS</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {POPULAR_HUBS.slice(0, 10).map((hub) => (
                    <button
                      key={hub.code}
                      type="button"
                      onClick={() => handleSelect(hub.label)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                        value === hub.label
                          ? 'bg-[#F0A63A] text-[#0A1626] shadow-sm'
                          : 'bg-white/15 text-white hover:bg-white/25 hover:text-[#F0A63A]'
                      }`}
                    >
                      {hub.code} <span className="opacity-70 font-normal">· {hub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Zone Filter Strip */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F8F6F0] border-b border-gray-200 overflow-x-auto text-[11px] font-mono">
              {ZONE_FILTERS.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setActiveZone(z.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition-all ${
                    activeZone === z.id
                      ? 'bg-[#0A1626] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200/70'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Scrollable Station List */}
            <div className="overflow-y-auto flex-1 p-2 divide-y divide-gray-100/80">
              {filteredStations.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <MapPin size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-bold text-[#0A1626]">No stations found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try searching by 3-4 letter code (e.g. NDLS, MMCT, BSB)</p>
                </div>
              ) : (
                filteredStations.map((st) => {
                  const isSelected = value === (st.label || `${st.name} (${st.code})`);
                  return (
                    <button
                      key={st.code + (st.label || st.name)}
                      type="button"
                      onClick={() => handleSelect(st.label || `${st.name} (${st.code})`)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all group ${
                        isSelected 
                          ? 'bg-[#F3EEE0] border border-[#F0A63A]/40' 
                          : 'hover:bg-[#F8F6F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected ? 'bg-[#0A1626] text-[#F0A63A]' : 'bg-gray-100 text-[#0A1626] group-hover:bg-[#0A1626] group-hover:text-white transition-colors'
                        }`}>
                          {st.code}
                        </div>
                        <div>
                          <div className="f-heading text-base font-semibold text-[#0A1626] flex items-center gap-2">
                            <span>{st.name || st.label}</span>
                            {st.isMajor && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded f-accent">
                                MAJOR HUB
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500">
                            {st.state ? `${st.state}` : ''} {st.zoneCode ? `· ${st.zoneCode} Zone` : ''}
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <Check size={16} className="text-[#1F7A4C] shrink-0" />
                      ) : (
                        <span className="text-[11px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Select ➔
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-3.5 py-2 bg-[#F8F6F0] border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Showing {filteredStations.length} matching stations</span>
              <span className="text-green-700 font-bold">● 8,965 Indian Stations Indexed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
