import React, { useState } from 'react';
import { X, User, Phone, Mail, CreditCard, Landmark, BadgeCheck, Check, MessageSquareText, PhoneCall, Bell } from 'lucide-react';

export function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="bg-white w-full md:w-[480px] max-h-[90vh] md:max-h-[80vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col anim-fade-up overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="h-14 px-5 border-b flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
          <h3 className="font-semibold text-lg" style={{ color: "var(--ink)" }}>{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} style={{ color: "var(--steel)" }} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SimpleInput({ label, icon: Icon, value }) {
  return (
    <div>
      <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>{label}</label>
      <div className="mt-1.5 h-11 rounded-xl border flex items-center gap-2 px-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
        <Icon size={16} style={{ color: "var(--steel)" }} />
        <input defaultValue={value} className="f-body flex-1 outline-none text-[15px] bg-transparent" style={{ color: "var(--ink)" }} />
      </div>
    </div>
  );
}

export function ProfileModal({ isOpen, onClose }) {
  return (
    <Modal title="Edit Profile" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <SimpleInput label="First Name" icon={User} value="Ananya" />
        <SimpleInput label="Last Name" icon={User} value="Rao" />
        <SimpleInput label="Mobile Number" icon={Phone} value="+91 98765 43210" />
        <SimpleInput label="Email Address" icon={Mail} value="ananya.rao@example.com" />
        <button className="mt-2 w-full h-12 rounded-xl f-body font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[0.99]" style={{ background: "var(--marigold)", color: "var(--blue)" }} onClick={onClose}>Save Changes</button>
      </div>
    </Modal>
  );
}

export function PassengersModal({ isOpen, onClose }) {
  const passengers = [
    { name: "Ananya Rao", age: 28, gender: "Female", pref: "Lower" },
    { name: "Rohan Rao", age: 30, gender: "Male", pref: "Upper" },
    { name: "Sita Devi", age: 58, gender: "Female", pref: "Lower" },
    { name: "Arjun Rao", age: 8, gender: "Male", pref: "No Preference" },
  ];
  return (
    <Modal title="Saved Passengers" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {passengers.map((p, i) => (
          <div key={i} className="p-3 border rounded-xl flex items-center justify-between bg-gray-50" style={{ borderColor: "var(--line)" }}>
            <div>
              <p className="font-semibold text-[15px]">{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>{p.age} yrs, {p.gender} • {p.pref} Berth</p>
            </div>
            <button className="text-sm font-medium transition-colors hover:text-blue-700" style={{ color: "var(--blue)" }}>Edit</button>
          </div>
        ))}
        <button className="mt-2 w-full h-12 rounded-xl border-2 border-dashed font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors hover:bg-blue-50" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>
          <User size={16} /> Add New Passenger
        </button>
      </div>
    </Modal>
  );
}

export function PaymentsModal({ isOpen, onClose }) {
  return (
    <Modal title="Payment Methods" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="p-4 border rounded-xl flex items-center gap-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-100"><CreditCard size={18} className="text-green-700" /></div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">HDFC Bank Credit Card</p>
            <p className="text-xs" style={{ color: "var(--steel)" }}>•••• 4242</p>
          </div>
        </div>
        <div className="p-4 border rounded-xl flex items-center gap-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-100"><Landmark size={18} className="text-blue-700" /></div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">Google Pay</p>
            <p className="text-xs" style={{ color: "var(--steel)" }}>ananya@okaxis</p>
          </div>
        </div>
        <button className="mt-2 w-full h-12 rounded-xl border-2 border-dashed font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors hover:bg-blue-50" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>
          <CreditCard size={16} /> Add Payment Method
        </button>
      </div>
    </Modal>
  );
}

export function KycModal({ isOpen, onClose }) {
  return (
    <Modal title="KYC / Aadhaar" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center py-6 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <BadgeCheck size={32} className="text-green-600" />
        </div>
        <h4 className="font-semibold text-lg">Verified Successfully</h4>
        <p className="text-sm mt-1 max-w-[250px]" style={{ color: "var(--steel)" }}>Your Aadhaar ending in <strong>8392</strong> is linked to your IRCTC account.</p>
        <button className="mt-6 w-full h-12 rounded-xl border font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
          Update Aadhaar
        </button>
      </div>
    </Modal>
  );
}

export function LanguageModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("English");
  return (
    <Modal title="Select Language" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2">
        {["English", "हिंदी (Hindi)", "తెలుగు (Telugu)", "தமிழ் (Tamil)", "বাংলা (Bengali)", "मराठी (Marathi)"].map(l => (
          <button key={l} onClick={() => { setLang(l); setTimeout(onClose, 200); }} className="p-3 border rounded-xl text-left font-medium text-[15px] transition-colors hover:bg-gray-50 flex items-center justify-between" style={{ borderColor: lang === l ? "var(--blue)" : "var(--line)", background: lang === l ? "var(--blue-3)" : "transparent" }}>
            <span>{l}</span>
            {lang === l && <Check size={16} style={{ color: "var(--blue)" }} />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function NotificationsModal({ isOpen, onClose }) {
  const [toggles, setToggles] = useState({ sms: true, wa: true, push: false });
  const items = [
    { id: "sms", icon: MessageSquareText, title: "SMS Updates", desc: "PNR status and journey alerts via SMS." },
    { id: "wa", icon: PhoneCall, title: "WhatsApp Updates", desc: "Get tickets directly on WhatsApp." },
    { id: "push", icon: Bell, title: "Push Notifications", desc: "App alerts for Tatkal and availability." }
  ];
  return (
    <Modal title="Notifications" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {items.map(n => (
          <div key={n.id} onClick={() => setToggles(p => ({ ...p, [n.id]: !p[n.id] }))} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"><n.icon size={18} style={{ color: "var(--blue)" }} /></div>
              <div>
                <p className="font-semibold text-[14px]">{n.title}</p>
                <p className="text-[11px]" style={{ color: "var(--steel)" }}>{n.desc}</p>
              </div>
            </div>
            <div className="w-11 h-6 rounded-full relative transition-colors duration-300" style={{ background: toggles[n.id] ? "var(--green)" : "var(--steel)" }}>
              <div className="absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-300" style={{ left: toggles[n.id] ? "calc(100% - 20px)" : "4px" }}></div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function ToolCard({ icon: Icon, title, body, onClick }) {
  return (
    <div onClick={onClick} className="rounded-2xl border bg-white p-5 group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[rgba(10,22,38,0.12)]">
      <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 bg-[#F3EEE0] group-hover:bg-[#EAE2C9]">
        <Icon size={22} className="text-[#0A1626] transition-colors" />
      </div>
      <p className="font-bold text-base text-[#0A1626]">{title}</p>
      <p className="text-xs md:text-sm mt-1.5 leading-relaxed text-[#4B5563]">{body}</p>
    </div>
  );
}
