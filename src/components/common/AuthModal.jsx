import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../lib/store.ts';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ onClose, onSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleQuickLogin = (demoName, demoEmail, irctcId, mobile) => {
    setLoading(true);
    setTimeout(() => {
      login(demoName, demoEmail, irctcId, mobile);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 500);
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (authMode === 'otp') {
        const userName = `Passenger ${phone.slice(-4) || "User"}`;
        login(userName, `${phone || "9876543210"}@mobile.irctc.in`, "irctc.mobile", phone);
      } else {
        const userName = authMode === 'signup' ? name : (email.includes('@') ? email.split('@')[0] : "Passenger");
        login(userName, email, "ananya.rao", phone || "+91 98765 43210");
      }
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 500);
    }, 300);
  };

  const modalContent = (
    <div 
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[rgba(10,22,38,0.15)] flex flex-col my-auto max-h-[90vh] relative"
      >
        {/* Header */}
        <div className="bg-[#0A1626] text-white p-4 sm:p-5 relative shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0A63A] text-[#0A1626] mb-1 f-accent">
                <ShieldCheck size={11} /> IRCTC Verified Auth
              </span>
              <h2 className="f-heading text-xl sm:text-2xl font-bold tracking-wide">
                {authMode === 'signup' ? "Create RailYatra Account" : authMode === 'otp' ? "Instant OTP Sign In" : "Welcome Back"}
              </h2>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Access verified bookings, live coach radars & fast refunds.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-1.5 mt-3.5 bg-white/10 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => { setAuthMode('login'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login' ? 'bg-white text-[#0A1626] shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Password
            </button>
            <button 
              type="button"
              onClick={() => { setAuthMode('otp'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'otp' ? 'bg-white text-[#0A1626] shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Mobile OTP
            </button>
            <button 
              type="button"
              onClick={() => { setAuthMode('signup'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup' ? 'bg-white text-[#0A1626] shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {success ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#0A1626]">Signed In Successfully!</h3>
              <p className="text-xs text-gray-500 mt-1">Connecting to your IRCTC journeys & profile...</p>
            </div>
          ) : (
            <>
              {/* Quick 1-Click Demo Profiles */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider f-accent">1-Click Fast Sign In</span>
                  <span className="text-[10px] text-[#F0A63A] font-bold">Demo Login</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("Ananya Rao", "ananya.rao@gmail.com", "ananya.rao", "+91 98765 43210")}
                    className="p-2.5 text-left border border-gray-200 rounded-xl hover:border-[#0A1626] hover:bg-[#F3EEE0]/50 transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#0A1626] flex items-center justify-between">
                      <span>Ananya Rao</span>
                      <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#F0A63A]" />
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">ananya.rao@gmail.com</div>
                    <span className="inline-block text-[9px] font-bold bg-green-100 text-green-800 px-1 py-0.2 rounded mt-0.5">Passenger</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("Admin User", "admin@railyatra.in", "irctc.admin", "+91 98111 22334")}
                    className="p-2.5 text-left border border-gray-200 rounded-xl hover:border-[#0A1626] hover:bg-[#F3EEE0]/50 transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#0A1626] flex items-center justify-between">
                      <span>IRCTC Admin</span>
                      <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#F0A63A]" />
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">admin@railyatra.in</div>
                    <span className="inline-block text-[9px] font-bold bg-blue-100 text-blue-800 px-1 py-0.2 rounded mt-0.5">Railway Officer</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center my-3.5">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-2 text-[10px] text-gray-400 font-medium absolute uppercase f-accent">Or enter credentials</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0A1626] mb-1">Full Legal Name</label>
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] transition-all text-xs font-semibold text-[#0A1626]"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                  </div>
                )}

                {authMode !== 'otp' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0A1626] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] transition-all text-xs font-semibold text-[#0A1626]"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'otp' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0A1626] mb-1">Indian Mobile Number</label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-xs font-bold text-gray-600 f-accent">
                        +91
                      </span>
                      <input 
                        type="tel" 
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pr-3 py-2.5 rounded-r-xl border border-gray-300 focus:outline-none focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] transition-all text-xs font-semibold text-[#0A1626]"
                        placeholder="9876543210"
                      />
                    </div>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (phone.length === 10) setOtpSent(true);
                        }}
                        disabled={phone.length !== 10}
                        className="mt-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 disabled:opacity-50 cursor-pointer"
                      >
                        Send 6-digit OTP code →
                      </button>
                    ) : (
                      <div className="mt-2.5">
                        <label className="block text-xs font-bold text-green-700 mb-1">Enter OTP (Sent to +91 {phone})</label>
                        <input 
                          type="text" 
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-green-500 focus:outline-none text-center f-accent text-base tracking-widest font-bold"
                          placeholder="123456"
                        />
                      </div>
                    )}
                  </div>
                )}

                {authMode !== 'otp' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0A1626] mb-1">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        autoComplete={authMode === 'signup' ? "new-password" : "current-password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] transition-all text-xs font-semibold text-[#0A1626]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A1626] cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 rounded-xl text-white font-bold text-xs sm:text-sm bg-[#0A1626] hover:bg-black mt-2 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <span>{authMode === 'signup' ? "Create Account & Sign In" : authMode === 'otp' ? "Verify OTP & Continue" : "Sign In"}</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
