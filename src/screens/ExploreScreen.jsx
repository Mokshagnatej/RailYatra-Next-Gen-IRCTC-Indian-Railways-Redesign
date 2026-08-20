import React, { useState, useMemo } from 'react';
import { 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag,
  Search, Train, Wallet, Hotel, Check, ShieldCheck, ArrowRight
} from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import PageHero from '../components/common/PageHero';
import { Modal, ToolCard } from '../components/common/Shared';
import { WarmGradientWave, RangoliOverlay } from '../components/common/CulturalPatterns.jsx';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [toolState, setToolState] = useState({
    trains: { from: "NDLS", to: "BCT", searched: true },
    fare: { classType: "3A", quota: "General", base: 1820 },
    room: { station: "NDLS", type: "AC Deluxe", hours: "12 hrs", available: true }
  });
  
  const trending = [
    { name: "Kashmir Vaishno Devi", days: "5N/6D", price: "₹21,300", desc: "Pilgrimage to the holy shrine of Vaishno Devi via Katra, with scenic views of the Trikuta Mountains. Includes train, hotel, and helicopter options.", highlights: "Katra base camp, Bhawan darshan, Patnitop excursion", meals: "Breakfast + Dinner", accommodation: "3-star hotel in Katra", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800" },
    { name: "Dev Darshan Yatra", days: "6N/7D", price: "₹18,900", desc: "Multi-city religious circuit covering Varanasi, Prayagraj, Ayodhya and Mathura by train. Guided temple tours included.", highlights: "Kashi Vishwanath, Triveni Sangam, Ram Janmabhoomi", meals: "All meals included", accommodation: "AC Deluxe Hotel", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800" },
    { name: "Kerala Backwaters", days: "4N/5D", price: "₹16,500", desc: "Houseboat stay in Alleppey, tea plantations in Munnar, and the beaches of Kovalam. Train from home city to Ernakulam.", highlights: "Alleppey houseboat, Munnar tea gardens, Kovalam beach", meals: "Breakfast included", accommodation: "Luxury Houseboat & Resort", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
    { name: "Rajasthan Heritage", days: "7N/8D", price: "₹26,800", desc: "Explore the royal forts and palaces of Jaipur, Jodhpur, Udaipur and Jaisalmer. Desert safari and folk culture evenings.", highlights: "Amber Fort, Mehrangarh, Lake Pichola, Sam Sand Dunes", meals: "Breakfast + Dinner", accommodation: "Heritage Haveli Stay", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" },
    { name: "North East Explorer", days: "8N/9D", price: "₹32,500", desc: "Discover the untouched beauty of Meghalaya, Assam and Arunachal Pradesh. Living root bridges, tea gardens and monasteries.", highlights: "Cherrapunji, Kaziranga, Tawang Monastery", meals: "All meals included", accommodation: "Eco-Lodge & Resorts", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800" },
    { name: "Buddhist Circuit Special", days: "5N/6D", price: "₹14,200", desc: "Follow the footsteps of Buddha — Bodh Gaya, Sarnath, Kushinagar and Lumbini (Nepal). Special IRCTC Buddhist circuit train.", highlights: "Mahabodhi Temple, Sarnath Stupa, Kushinagar", meals: "Vegetarian meals included", accommodation: "Pilgrim Rest Houses & Hotels", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" },
  ];

  const packages = [
    { name: "Bharat Gaurav Tourist Train", days: "8N/9D", desc: "AC III-Tier themed circuit train promoting domestic heritage tourism. Covers Kashi, Puri, Mahabalipuram, Rameswaram and Madurai in one loop.", price: "₹24,500", accommodation: "Onboard AC-III", meals: "All meals on train", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" },
    { name: "Maharajas' Express", days: "7N/8D", desc: "Luxury heritage train — 'World's Leading Luxury Train' 6 years running. Suites with en-suite bathrooms, fine dining, and curated excursions.", price: "On request", accommodation: "Luxury suite", meals: "Multi-cuisine à la carte", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
    { name: "Goa Beach Holidays", days: "3N/4D", desc: "Train + stay package covering North and South Goa highlights. Includes Dudhsagar Falls excursion, spice plantation visit, and beach activities.", price: "₹12,000", accommodation: "3-star resort", meals: "Breakfast included", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800" },
    { name: "Andaman Island Explorer", days: "6N/7D", desc: "Train to Chennai + flight to Port Blair. Havelock Island, Ross Island, Cellular Jail and pristine beaches. Snorkelling and glass-bottom boat rides.", price: "₹38,500", accommodation: "Beach resort", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800" },
    { name: "Shimla-Manali Delight", days: "5N/6D", desc: "Take the toy train from Kalka to Shimla (UNESCO World Heritage), then proceed to Manali by road. Rohtang Pass, Solang Valley included.", price: "₹15,800", accommodation: "3-star hotel", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800" },
    { name: "Statue of Unity Special", days: "2N/3D", price: "₹8,900", desc: "Weekend getaway to the world's tallest statue. Includes Valley of Flowers, Sardar Sarovar Dam, jungle safari at Shoolpaneshwar Wildlife Sanctuary.", accommodation: "Tent City Narmada", meals: "All meals included", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800" },
  ];

  // Dynamic filter based on search query
  const filteredTrending = useMemo(() => {
    if (!searchQuery.trim()) return trending;
    const q = searchQuery.toLowerCase();
    return trending.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.highlights?.toLowerCase().includes(q));
  }, [searchQuery, trending]);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages;
    const q = searchQuery.toLowerCase();
    return packages.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }, [searchQuery, packages]);

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20 relative">
      <RangoliOverlay position="bottom-right" size={240} opacity={0.03} />
      <RangoliOverlay position="bottom-left" size={240} opacity={0.03} />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FFF9F0 0%, #FEF3E2 40%, #F7F4EC 100%)" }}>
        <WarmGradientWave />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Explore</p>
          <h1 className="f-display text-3xl md:text-4xl font-semibold mt-2 max-w-xl" style={{ color: "var(--blue)" }}>Beyond booking a seat.</h1>
          <p className="text-sm mt-2 max-w-lg mb-8" style={{ color: "var(--steel)" }}>Interactive rail planning tools and curated IRCTC Tourism packages for your next journey.</p>
          
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} style={{ color: "var(--steel)" }} />
            </div>
            <input 
              type="text" 
              placeholder="Search packages, destinations or tour types..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-10 py-3.5 rounded-xl border-none outline-none f-body shadow-sm text-sm transition-shadow focus:shadow-md"
              style={{ color: "var(--ink)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(192,131,33,0.15)" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3 Interactive Quick Tools */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <ToolCard onClick={() => setActiveModal({ type: "trains_between_stations", title: "Trains Between Stations" })} icon={Train} title="Trains between stations" body="Explore full timetables and running days across any two stations." />
        <ToolCard onClick={() => setActiveModal({ type: "fare_enquiry", title: "Fare Enquiry Calculator" })} icon={Wallet} title="Fare enquiry calculator" body="Calculate transparent breakdown across 1A, 2A, 3A, SL and Tatkal quotas." />
        <ToolCard onClick={() => setActiveModal({ type: "retiring_rooms", title: "Station Retiring Rooms" })} icon={Hotel} title="Retiring rooms & dorms" body="Reserve comfortable AC/Non-AC rooms for station layovers at 900+ junctions." />
      </div>

      {/* Trending Destinations with sliding carousel */}
      <div className="mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: "var(--marigold-2)" }} />
              <h2 className="f-display font-semibold text-xl">Trending Destinations</h2>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--steel)" }}>
              {searchQuery ? `Showing ${filteredTrending.length} matching destinations` : "Curated packages from IRCTC Tourism — train travel included."}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border bg-white text-gray-500 font-medium hidden sm:inline-block">
            Hover to pause · Click card for details
          </span>
        </div>
        
        {/* Auto-scrolling carousel with pause-on-hover */}
        <div className="overflow-hidden relative" style={{ 
          maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)", 
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)" 
        }}>
          <div className="flex gap-4 px-4 md:px-6 pause-hover" style={{
            animation: "scroll-left 35s linear infinite",
            width: "max-content",
          }}>
            {/* Duplicate for seamless infinite loop */}
            {[...(filteredTrending.length ? filteredTrending : trending), ...(filteredTrending.length ? filteredTrending : trending)].map((p, idx) => (
              <div 
                onClick={() => setActiveModal({ ...p, type: "package_detail" })} 
                key={`${p.name}-${idx}`} 
                className="relative w-[280px] md:w-[320px] h-[380px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 group cursor-pointer border border-black/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900"
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="text-[11px] font-bold f-mono px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-md border border-white/20">
                    {p.days}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/90 text-slate-900">
                    Popular
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1.5 drop-shadow">{p.name}</h3>
                  <p className="text-white/80 text-xs mb-3 line-clamp-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <div>
                      <span className="text-[10px] text-white/60 block">Starting from</span>
                      <span className="text-white font-extrabold text-base">{p.price}</span>
                    </div>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-blue-900 backdrop-blur-md transition-all">
                      View Tour
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Packages Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="f-display font-semibold text-xl mb-1">All Tourism Packages</h2>
            <p className="text-sm" style={{ color: "var(--steel)" }}>Domestic and international circuits, heritage luxury trains, and spiritual yatras.</p>
          </div>
          {filteredPackages.length !== packages.length && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
              {filteredPackages.length} packages found
            </span>
          )}
        </div>
        
        {filteredPackages.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center bg-white shadow-sm">
            <p className="font-semibold text-gray-700">No packages found matching "{searchQuery}"</p>
            <p className="text-xs text-gray-500 mt-1">Try searching for "Goa", "Kashmir", "Heritage", or "Bharat Gaurav"</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPackages.map((p) => (
              <div 
                onClick={() => setActiveModal({ ...p, type: "package_detail" })} 
                key={p.name} 
                className="rounded-2xl border overflow-hidden flex flex-col sm:flex-row group cursor-pointer transition-all duration-300 hover:shadow-xl" 
                style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
              >
                <div className="h-48 sm:h-auto sm:w-48 relative overflow-hidden flex-shrink-0">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold f-mono px-2 py-0.5 rounded-md text-white bg-black/60 backdrop-blur-md">
                    {p.days}
                  </span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="f-body font-bold text-[16px] transition-colors" style={{ color: "var(--blue)" }}>{p.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-4">
                      {p.accommodation && <span className="px-2 py-0.5 rounded bg-white border font-medium" style={{ borderColor: "rgba(192,131,33,0.15)" }}>🏨 {p.accommodation}</span>}
                      {p.meals && <span className="px-2 py-0.5 rounded bg-white border font-medium" style={{ borderColor: "rgba(192,131,33,0.15)" }}>🍽️ {p.meals}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{ borderColor: "rgba(15,42,69,0.06)" }}>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium">All-Inclusive</span>
                      <span className="f-mono text-base font-extrabold" style={{ color: "var(--ink)" }}>{p.price}</span>
                    </div>
                    <button className="text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all hover:opacity-90" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Tool Modals & Details */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal?.title || activeModal?.name}>
        {/* 1. Trains Between Stations Interactive Modal */}
        {activeModal?.type === "trains_between_stations" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">From Station</label>
                <select 
                  value={toolState.trains.from} 
                  onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, from: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                  <option value="SBC">Bengaluru (SBC)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">To Station</label>
                <select 
                  value={toolState.trains.to} 
                  onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, to: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                  <option value="SBC">Bengaluru (SBC)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Available Daily Trains ({toolState.trains.from} → {toolState.trains.to})</p>
              <div className="space-y-2.5">
                {[
                  { no: "12951", name: "Mumbai Rajdhani Express", dep: "16:55", arr: "08:35", dur: "15h 40m", days: "Daily", classes: ["1A", "2A", "3A"] },
                  { no: "12953", name: "August Kranti Rajdhani", dep: "17:15", arr: "10:05", dur: "16h 50m", days: "Daily", classes: ["1A", "2A", "3A", "3E"] },
                  { no: "22221", name: "CSMT Rajdhani Express", dep: "16:55", arr: "11:15", dur: "18h 20m", days: "Mon, Wed, Fri", classes: ["1A", "2A", "3A"] }
                ].map((t) => (
                  <div key={t.no} className="p-3 rounded-xl border bg-gray-50/70 hover:bg-blue-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="f-mono text-xs font-bold text-blue-700 mr-2">{t.no}</span>
                        <span className="font-semibold text-sm text-gray-900">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">{t.days}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span>Dep: <strong>{t.dep}</strong> → Arr: <strong>{t.arr}</strong> ({t.dur})</span>
                      <div className="flex gap-1">
                        {t.classes.map(c => <span key={c} className="px-1.5 py-0.5 rounded bg-white border text-[10px] font-mono">{c}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Fare Enquiry Interactive Modal */}
        {activeModal?.type === "fare_enquiry" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Select Class</label>
                <select 
                  value={toolState.fare.classType} 
                  onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, classType: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="SL">Sleeper (SL)</option>
                  <option value="3E">AC 3-Tier Economy (3E)</option>
                  <option value="3A">AC 3-Tier (3A)</option>
                  <option value="2A">AC 2-Tier (2A)</option>
                  <option value="1A">AC First Class (1A)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quota</label>
                <select 
                  value={toolState.fare.quota} 
                  onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, quota: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="General">General Quota</option>
                  <option value="Tatkal">Tatkal (Premium)</option>
                  <option value="Ladies">Ladies Quota</option>
                  <option value="Senior">Senior Citizen</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-blue-50/50">
              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <div>
                  <p className="text-xs text-blue-800 font-semibold uppercase">Total Fare Estimate</p>
                  <p className="text-2xl font-extrabold text-blue-950 mt-0.5">
                    {toolState.fare.classType === "1A" ? "₹4,750" : 
                     toolState.fare.classType === "2A" ? "₹2,830" : 
                     toolState.fare.classType === "3A" ? "₹1,985" : 
                     toolState.fare.classType === "3E" ? "₹1,750" : "₹685"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">NDLS ⇄ BCT</span>
              </div>
              <div className="grid gap-1.5 pt-3 text-xs text-gray-700">
                <div className="flex justify-between"><span>Base Distance Fare:</span><span className="font-semibold">₹1,640</span></div>
                <div className="flex justify-between"><span>Superfast Surcharge:</span><span className="font-semibold">₹45</span></div>
                <div className="flex justify-between"><span>Reservation Fee:</span><span className="font-semibold">₹40</span></div>
                <div className="flex justify-between"><span>GST (5% for AC):</span><span className="font-semibold">₹110</span></div>
                <div className="flex justify-between"><span>Dynamic Tatkal Fee:</span><span className="font-semibold">{toolState.fare.quota === "Tatkal" ? "+₹400" : "₹0"}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Retiring Rooms Interactive Modal */}
        {activeModal?.type === "retiring_rooms" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Station</label>
                <select 
                  value={toolState.room.station} 
                  onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, station: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah Jn (HWH)</option>
                  <option value="BSB">Varanasi Jn (BSB)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Duration</label>
                <select 
                  value={toolState.room.hours} 
                  onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, hours: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="12 hrs">12 Hours Slot</option>
                  <option value="24 hrs">24 Hours Full Day</option>
                  <option value="48 hrs">48 Hours Stay</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { name: "Executive AC Deluxe Room", beds: "1 King Bed (2 Guests)", tariff: "₹1,450 / 12h", available: "3 Rooms Free", rating: "4.4 ★" },
                { name: "Standard AC Double Room", beds: "2 Single Beds (2 Guests)", tariff: "₹950 / 12h", available: "5 Rooms Free", rating: "4.1 ★" },
                { name: "AC Dormitory Bed", beds: "Individual Pod with Locker", tariff: "₹380 / 12h", available: "14 Beds Free", rating: "4.2 ★" }
              ].map((r) => (
                <div key={r.name} className="p-3.5 rounded-xl border bg-gray-50 flex items-center justify-between hover:border-blue-300 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.beds} · {r.rating}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      ● {r.available}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-blue-900 block">{r.tariff}</span>
                    <button onClick={() => alert(`Reserved slot for ${r.name} at ${toolState.room.station}!`)} className="mt-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      Book Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Package Detail Modal */}
        {activeModal?.type === "package_detail" && (
          <div className="flex flex-col">
            <div className="relative h-48 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-lg">
              <img 
                src={activeModal.image} 
                alt={activeModal.name} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <span className="text-xs f-mono font-bold px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-md border border-white/20">{activeModal.days}</span>
                <div className="text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-medium">Package Fare</span>
                  <span className="text-white font-extrabold text-xl">{activeModal.price}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed mb-4 text-gray-700">{activeModal.desc}</p>
            
            {activeModal.highlights && (
              <div className="rounded-xl p-3.5 mb-3 bg-blue-50/70 border border-blue-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1">Key Highlights</p>
                <p className="text-xs text-blue-950 leading-normal">{activeModal.highlights}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border p-3 bg-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Meals Included</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.meals || "Breakfast & Dinner"}</p>
              </div>
              <div className="rounded-xl border p-3 bg-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Accommodation</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.accommodation || "3-Star Hotel / Resort"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { alert(`Thank you! Booking inquiry initiated for ${activeModal.name}. Our IRCTC tourism executive will contact you shortly.`); setActiveModal(null); }} className="flex-1 h-12 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-[0.98]" style={{ background: "var(--blue)" }}>
                Book This Package
              </button>
              <button onClick={() => setActiveModal(null)} className="px-5 h-12 rounded-xl font-semibold text-sm border text-gray-700 hover:bg-gray-50">
                Close
              </button>
            </div>
            <p className="text-[11px] text-center mt-2.5 text-gray-400">IRCTC Official Tourism Partner · 100% Verified Itinerary</p>
          </div>
        )}
      </Modal>

    </div>
  );
}
