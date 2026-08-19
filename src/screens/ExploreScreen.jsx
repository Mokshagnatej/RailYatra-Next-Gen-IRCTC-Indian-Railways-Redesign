import React, { useState, useMemo } from "react";
import {
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar,
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag,
  Train, Wallet, Hotel, Search, X
} from "lucide-react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--line)" }}>
          <h2 className="f-display font-semibold text-base" style={{ color: "var(--ink)" }}>{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X size={16} style={{ color: "var(--steel)" }} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ToolCard({ icon: Icon, title, body, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl border bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md group cursor-pointer w-full" style={{ borderColor: "var(--line)" }}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--paper-2)" }}>
        <Icon size={18} style={{ color: "var(--blue)" }} />
      </div>
      <p className="f-body font-semibold text-base" style={{ color: "var(--ink)" }}>{title}</p>
      <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{body}</p>
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--marigold-2)" }}>
        Open tool <ChevronRight size={13} />
      </div>
    </button>
  );
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [toolState, setToolState] = useState({
    trains: { from: "NDLS", to: "BCT" },
    fare: { classType: "3A", quota: "General" },
    room: { station: "NDLS", hours: "12 hrs" }
  });

  const trending = [
    { name: "Kashmir Vaishno Devi", days: "5N/6D", price: "₹21,300", desc: "Pilgrimage to the holy shrine of Vaishno Devi via Katra, with scenic views of the Trikuta Mountains.", highlights: "Katra base camp, Bhawan darshan, Patnitop excursion", meals: "Breakfast + Dinner", accommodation: "3-star hotel in Katra", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800" },
    { name: "Dev Darshan Yatra", days: "6N/7D", price: "₹18,900", desc: "Multi-city religious circuit covering Varanasi, Prayagraj, Ayodhya and Mathura by train.", highlights: "Kashi Vishwanath, Triveni Sangam, Ram Janmabhoomi", meals: "All meals included", accommodation: "AC Deluxe Hotel", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800" },
    { name: "Kerala Backwaters", days: "4N/5D", price: "₹16,500", desc: "Houseboat stay in Alleppey, tea plantations in Munnar, and the beaches of Kovalam.", highlights: "Alleppey houseboat, Munnar tea gardens, Kovalam beach", meals: "Breakfast included", accommodation: "Luxury Houseboat & Resort", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
    { name: "Rajasthan Heritage", days: "7N/8D", price: "₹26,800", desc: "Explore the royal forts and palaces of Jaipur, Jodhpur, Udaipur and Jaisalmer.", highlights: "Amber Fort, Mehrangarh, Lake Pichola, Sam Sand Dunes", meals: "Breakfast + Dinner", accommodation: "Heritage Haveli Stay", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" },
    { name: "North East Explorer", days: "8N/9D", price: "₹32,500", desc: "Discover the untouched beauty of Meghalaya, Assam and Arunachal Pradesh.", highlights: "Cherrapunji, Kaziranga, Tawang Monastery", meals: "All meals included", accommodation: "Eco-Lodge & Resorts", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800" },
    { name: "Buddhist Circuit Special", days: "5N/6D", price: "₹14,200", desc: "Follow the footsteps of Buddha — Bodh Gaya, Sarnath, Kushinagar and Lumbini.", highlights: "Mahabodhi Temple, Sarnath Stupa, Kushinagar", meals: "Vegetarian meals included", accommodation: "Pilgrim Rest Houses & Hotels", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" },
  ];

  const packages = [
    { name: "Bharat Gaurav Tourist Train", days: "8N/9D", desc: "AC III-Tier themed circuit train covering Kashi, Puri, Mahabalipuram, Rameswaram and Madurai.", price: "₹24,500", accommodation: "Onboard AC-III", meals: "All meals on train", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" },
    { name: "Maharajas' Express", days: "7N/8D", desc: "Luxury heritage train — World's Leading Luxury Train 6 years running. Suites with en-suite bathrooms and fine dining.", price: "On request", accommodation: "Luxury suite", meals: "Multi-cuisine à la carte", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
    { name: "Goa Beach Holidays", days: "3N/4D", desc: "Train + stay package covering North and South Goa highlights. Includes Dudhsagar Falls excursion and spice plantation.", price: "₹12,000", accommodation: "3-star resort", meals: "Breakfast included", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800" },
    { name: "Andaman Island Explorer", days: "6N/7D", desc: "Train to Chennai + flight to Port Blair. Havelock Island, Ross Island, Cellular Jail and pristine beaches.", price: "₹38,500", accommodation: "Beach resort", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800" },
    { name: "Shimla-Manali Delight", days: "5N/6D", desc: "Take the toy train from Kalka to Shimla (UNESCO World Heritage), then proceed to Manali by road.", price: "₹15,800", accommodation: "3-star hotel", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800" },
    { name: "Statue of Unity Special", days: "2N/3D", price: "₹8,900", desc: "Weekend getaway to the world's tallest statue. Includes Valley of Flowers, Sardar Sarovar Dam, jungle safari.", accommodation: "Tent City Narmada", meals: "All meals included", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800" },
  ];

  const filteredTrending = useMemo(() => {
    if (!searchQuery.trim()) return trending;
    const q = searchQuery.toLowerCase();
    return trending.filter((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages;
    const q = searchQuery.toLowerCase();
    return packages.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20">
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Explore</p>
          <h1 className="f-display text-3xl md:text-4xl font-semibold text-white mt-2 max-w-xl">Beyond booking a seat.</h1>
          <p className="text-sm mt-2 max-w-lg mb-8" style={{ color: "#C7D2DD" }}>Interactive rail planning tools and curated IRCTC Tourism packages for your next journey.</p>
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} style={{ color: "var(--steel)" }} />
            </div>
            <input type="text" placeholder="Search packages, destinations or tour types..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-10 py-3.5 rounded-xl border-none outline-none f-body shadow-lg text-sm"
              style={{ color: "var(--ink)", background: "white" }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center" style={{ color: "var(--steel)" }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <ToolCard onClick={() => setActiveModal({ type: "trains_between_stations", title: "Trains Between Stations" })} icon={Train} title="Trains between stations" body="Explore full timetables and running days across any two stations." />
        <ToolCard onClick={() => setActiveModal({ type: "fare_enquiry", title: "Fare Enquiry Calculator" })} icon={Wallet} title="Fare enquiry calculator" body="Calculate transparent breakdown across 1A, 2A, 3A, SL and Tatkal quotas." />
        <ToolCard onClick={() => setActiveModal({ type: "retiring_rooms", title: "Station Retiring Rooms" })} icon={Hotel} title="Retiring rooms & dorms" body="Reserve comfortable AC/Non-AC rooms for station layovers at 900+ junctions." />
      </div>

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
        </div>
        <div className="overflow-hidden relative" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)" }}>
          <div className="flex gap-4 px-4 md:px-6 pause-hover" style={{ animation: "scroll-left 35s linear infinite", width: "max-content" }}>
            {[...(filteredTrending.length ? filteredTrending : trending), ...(filteredTrending.length ? filteredTrending : trending)].map((p, idx) => (
              <div onClick={() => setActiveModal({ ...p, type: "package_detail" })} key={`${p.name}-${idx}`}
                className="relative w-[280px] md:w-[320px] h-[380px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900">
                <img src={p.image} alt={p.name}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"; }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-bold f-mono px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-md">{p.days}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1.5">{p.name}</h3>
                  <p className="text-white/80 text-xs mb-3 line-clamp-2">{p.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <span className="text-white font-extrabold text-base">{p.price}</span>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-blue-900 backdrop-blur-md transition-all">View Tour</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="f-display font-semibold text-xl mb-1">All Tourism Packages</h2>
        <p className="text-sm mb-5" style={{ color: "var(--steel)" }}>Domestic and international circuits, heritage luxury trains, and spiritual yatras.</p>
        {filteredPackages.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center bg-white">
            <p className="font-semibold" style={{ color: "var(--ink)" }}>No packages found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "var(--blue)" }}>Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPackages.map((p) => (
              <div onClick={() => setActiveModal({ ...p, type: "package_detail" })} key={p.name}
                className="rounded-2xl border bg-white overflow-hidden flex flex-col sm:flex-row group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-200" style={{ borderColor: "var(--line)" }}>
                <div className="h-48 sm:h-auto sm:w-48 relative overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"; }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold f-mono px-2 py-0.5 rounded-md text-white bg-black/60">{p.days}</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="f-body font-bold text-[16px] group-hover:text-blue-600 transition-colors mb-1" style={{ color: "var(--ink)" }}>{p.name}</h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-4">
                      {p.accommodation && <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">🏨 {p.accommodation}</span>}
                      {p.meals && <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">🍽️ {p.meals}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="f-mono text-base font-extrabold" style={{ color: "var(--blue)" }}>{p.price}</span>
                    <button className="text-xs font-bold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: "var(--blue)" }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal?.title || activeModal?.name}>
        {activeModal?.type === "trains_between_stations" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">From Station</label>
                <select value={toolState.trains.from} onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, from: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">To Station</label>
                <select value={toolState.trains.to} onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, to: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                </select>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Available Trains ({toolState.trains.from} → {toolState.trains.to})</p>
              <div className="space-y-2">
                {[{ no: "12951", name: "Mumbai Rajdhani Express", dep: "16:55", arr: "08:35", dur: "15h 40m", days: "Daily", classes: ["1A", "2A", "3A"] }, { no: "12953", name: "August Kranti Rajdhani", dep: "17:15", arr: "10:05", dur: "16h 50m", days: "Daily", classes: ["1A", "2A", "3A"] }, { no: "22221", name: "CSMT Rajdhani Express", dep: "16:55", arr: "11:15", dur: "18h 20m", days: "Mon, Wed, Fri", classes: ["1A", "2A", "3A"] }].map((t) => (
                  <div key={t.no} className="p-3 rounded-xl border bg-gray-50">
                    <div className="flex justify-between items-start">
                      <span className="f-mono text-xs font-bold" style={{ color: "var(--blue)" }}>{t.no} · {t.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">{t.days}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-1.5">
                      <span>Dep: <strong>{t.dep}</strong> → Arr: <strong>{t.arr}</strong> ({t.dur})</span>
                      <div className="flex gap-1">{t.classes.map((c) => <span key={c} className="px-1.5 py-0.5 rounded border text-[10px] font-mono bg-white">{c}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal?.type === "fare_enquiry" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Class</label>
                <select value={toolState.fare.classType} onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, classType: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option value="SL">Sleeper (SL)</option>
                  <option value="3A">AC 3-Tier (3A)</option>
                  <option value="2A">AC 2-Tier (2A)</option>
                  <option value="1A">AC First Class (1A)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quota</label>
                <select value={toolState.fare.quota} onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, quota: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option>General Quota</option>
                  <option>Tatkal (Premium)</option>
                  <option>Senior Citizen</option>
                </select>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-blue-50/50">
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">Total Estimate (NDLS → BCT)</p>
              <p className="text-2xl font-extrabold" style={{ color: "var(--blue)" }}>
                {toolState.fare.classType === "1A" ? "₹4,750" : toolState.fare.classType === "2A" ? "₹2,830" : toolState.fare.classType === "3A" ? "₹1,985" : "₹685"}
              </p>
            </div>
          </div>
        )}

        {activeModal?.type === "retiring_rooms" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Station</label>
                <select value={toolState.room.station} onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, station: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah Jn (HWH)</option>
                  <option value="BSB">Varanasi Jn (BSB)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Duration</label>
                <select value={toolState.room.hours} onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, hours: e.target.value } })} className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm outline-none">
                  <option>12 hrs</option>
                  <option>24 hrs</option>
                  <option>48 hrs</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {[{ name: "Executive AC Deluxe Room", beds: "1 King Bed (2 Guests)", tariff: "₹1,450 / 12h", avail: "3 Rooms Free" }, { name: "Standard AC Double Room", beds: "2 Single Beds", tariff: "₹950 / 12h", avail: "5 Rooms Free" }, { name: "AC Dormitory Bed", beds: "Individual Pod with Locker", tariff: "₹380 / 12h", avail: "14 Beds Free" }].map((r) => (
                <div key={r.name} className="p-3.5 rounded-xl border bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>{r.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.beds}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">● {r.avail}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm block" style={{ color: "var(--blue)" }}>{r.tariff}</span>
                    <button className="mt-1.5 text-xs font-bold px-3 py-1 rounded-lg text-white" style={{ background: "var(--blue)" }}>Book Room</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModal?.type === "package_detail" && (
          <div className="flex flex-col">
            {activeModal.image && (
              <div className="relative h-48 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-lg">
                <img src={activeModal.image} alt={activeModal.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <span className="text-xs f-mono font-bold px-2.5 py-1 rounded-full text-white bg-black/50">{activeModal.days}</span>
                  <span className="text-white font-extrabold text-xl">{activeModal.price}</span>
                </div>
              </div>
            )}
            <p className="text-sm leading-relaxed mb-4 text-gray-700">{activeModal.desc}</p>
            {activeModal.highlights && (
              <div className="rounded-xl p-3.5 mb-3 bg-blue-50/70 border border-blue-100">
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--blue)" }}>Key Highlights</p>
                <p className="text-xs leading-normal" style={{ color: "var(--ink)" }}>{activeModal.highlights}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border p-3 bg-gray-50"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Meals</p><p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.meals || "Included"}</p></div>
              <div className="rounded-xl border p-3 bg-gray-50"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Stay</p><p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.accommodation || "Hotel"}</p></div>
            </div>
            <button onClick={() => setActiveModal(null)} className="h-12 rounded-xl font-bold text-sm text-white" style={{ background: "var(--blue)" }}>Book This Package</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
