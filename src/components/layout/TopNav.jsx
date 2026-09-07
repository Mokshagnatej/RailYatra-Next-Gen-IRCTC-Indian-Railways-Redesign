import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, CalendarDays, Ticket, Compass, LifeBuoy, 
  ChevronDown, User, LogOut, Train 
} from "lucide-react";
import { useAuthStore } from "../../lib/store.ts";
import AuthModal from "../common/AuthModal.jsx";
import MagneticButton from "../common/MagneticButton.jsx";

export default function TopNav({ screen, setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const isHome = ["search","results","booking","confirmation"].includes(screen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { key: "search", label: "Book Tickets", icon: Home },
    { key: "seat-availability", label: "Seat Availability", icon: CalendarDays },
    { key: "trips", label: "My Trips", icon: Ticket },
    { key: "explore", label: "Explore", icon: Compass },
    { key: "help", label: "Help", icon: LifeBuoy },
  ];

  /* Light theme globally: warm frosted glass when on top of hero, solid cream otherwise. */
  const onLightHero = isHome && !scrolled;
  const navBg = onLightHero
    ? "rgba(255,255,255,0.15)"
    : "rgba(255,249,240,0.98)";

  const textColor = "var(--blue)";
  const textInactive = onLightHero ? "rgba(15,42,69,0.6)" : "rgba(15,42,69,0.6)";
  const hamburgerColor = "var(--blue)";
  const accountBorder = "rgba(15,42,69,0.15)";

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-50 text-center py-2 px-4 f-body text-xs font-medium"
        style={{ background: "var(--marigold)", color: "var(--blue)" }}>
        ✦ Concept redesign &mdash; for real bookings call{" "}
        <span className="f-accent font-semibold">139</span> or visit irctc.co.in
      </div>

      <header className="sticky top-4 z-40 transition-all duration-500 mx-auto max-w-7xl px-4 md:px-8 mt-2 w-full"
        style={{ transform: scrolled ? "translateY(0)" : "translateY(10px)" }}>
        
        <motion.div 
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center justify-between gap-4 px-4 h-[66px] rounded-full shadow-xl transition-all duration-500"
          style={{
            background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}>
          
          {/* Logo */}
          <button onClick={() => setScreen("search")}
            className="flex items-center gap-3 flex-shrink-0 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--marigold)" }}>
              <Train size={20} color="var(--blue)" />
            </motion.div>
            <span className="f-heading font-bold text-xl tracking-tight" style={{ color: "var(--blue)" }}>
              Rail<span style={{ color: "var(--marigold)" }}>Yatra</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = screen === it.key || (it.key === "search" && isHome);
              return (
                <motion.button 
                  key={it.key} 
                  onClick={() => setScreen(it.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative f-body flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold transition-colors duration-200"
                  style={{
                    color: active ? "var(--blue)" : textInactive,
                  }}>
                  {active && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--marigold)", zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={16} /> <span className="relative z-10">{it.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* CTA area */}
          <div className="flex items-center gap-3 relative">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-gray-100/70 border border-[rgba(10,22,38,0.1)] bg-white/80 cursor-pointer shadow-sm"
                  style={{ color: textColor }}>
                  <div className="w-6 h-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-bold text-xs max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-2xl border border-[rgba(10,22,38,0.12)] p-3 z-50 divide-y divide-gray-100"
                    >
                      <div className="p-2">
                        <p className="text-xs font-bold text-[#0A1626] truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[9px] f-accent font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                          IRCTC ID: {user?.irctcId || "verified.user"}
                        </span>
                      </div>

                      <div className="py-1.5 space-y-1">
                        <button
                          onClick={() => {
                            setScreen("account");
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1626] hover:bg-[#F3EEE0] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <User size={14} className="text-[#0A1626]" /> My Profile &amp; Settings
                        </button>
                        <button
                          onClick={() => {
                            setScreen("trips");
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1626] hover:bg-[#F3EEE0] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Ticket size={14} className="text-[#0A1626]" /> My Bookings &amp; Trips
                        </button>
                      </div>

                      <div className="pt-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            setScreen("search");
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut size={14} /> Log Out from IRCTC
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-gray-100/50 cursor-pointer"
                style={{ color: textColor }}>
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}

            {authModalOpen && (
              <AuthModal 
                onClose={() => setAuthModalOpen(false)} 
                onSuccess={() => setScreen("account")}
              />
            )}
            
            <MagneticButton 
              onClick={() => { setScreen("search"); setMobileMenuOpen(false); }}
              className="h-11 px-6 rounded-full text-sm font-bold shadow-lg text-white"
              style={{ background: "var(--amber)" }}>
              Book Now
            </MagneticButton>
            
            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              aria-label="Menu">
              {[0,1,2].map(i => (
                <span key={i} className="block h-0.5 w-5 rounded-full transition-all"
                  style={{ background: hamburgerColor, transformOrigin:"center",
                    transform: mobileMenuOpen && i===0 ? "rotate(45deg) translate(3px,3px)" :
                               mobileMenuOpen && i===1 ? "scaleX(0)" :
                               mobileMenuOpen && i===2 ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
              ))}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden mt-2 rounded-2xl shadow-xl" 
              style={{
                background: isHome ? "rgba(255,249,240,0.98)" : "rgba(9,28,49,0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)"
              }}>
              
              {isAuthenticated && (
                <div className="p-4 border-b border-gray-200/50 bg-white/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0A1626]">Logged in as {user?.name}</p>
                    <p className="text-[10px] text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      setScreen("search");
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200 flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut size={12} /> Log Out
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 p-4">
                {[...items, { key:"account", label:"Account", icon:User }].map((it) => {
                  const Icon = it.icon;
                  const active = screen === it.key || (it.key === "search" && isHome);
                  return (
                    <button key={it.key} onClick={() => { setScreen(it.key); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                      style={{
                        color: active ? "var(--blue)" : isHome ? "var(--blue)" : "rgba(255,255,255,0.8)",
                        background: active ? "var(--marigold)" : isHome ? "rgba(15,42,69,0.04)" : "rgba(255,255,255,0.06)"
                      }}>
                      <Icon size={16} /> {it.label}
                    </button>
                  );
                })}
              </div>

              {!isAuthenticated && (
                <div className="p-3 border-t border-gray-200/50 bg-white/30">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0A1626] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <User size={14} /> Sign In / Register
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
