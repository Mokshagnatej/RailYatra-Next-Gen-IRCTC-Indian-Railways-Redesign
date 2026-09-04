import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, CreditCard, Landmark, BadgeCheck, Check, MessageSquareText, PhoneCall, Bell, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../lib/store.ts';

export function Modal({ title, isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
      className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full md:w-[480px] max-h-[90vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col anim-fade-up overflow-hidden my-auto border border-[rgba(10,22,38,0.15)]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="h-14 px-5 border-b flex items-center justify-between bg-[#0A1626] text-white">
          <h3 className="font-serif font-bold text-base text-white tracking-tight">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-56px)] bg-[#FAF8F2]">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export function SimpleInput({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div>
      <label className="f-body text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">{label}</label>
      <div className="h-11 rounded-xl border border-gray-300 flex items-center gap-2 px-3 bg-white shadow-xs focus-within:border-[#0A1626] focus-within:ring-1 focus-within:ring-[#F0A63A]">
        <Icon size={15} className="text-gray-400" />
        <input 
          value={value} 
          onChange={onChange}
          placeholder={placeholder}
          className="f-body flex-1 outline-none text-xs md:text-sm font-semibold bg-transparent text-[#0A1626]" 
        />
      </div>
    </div>
  );
}

export function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || "Ananya Rao").split(" ");
      setFirstName(parts[0] || "Ananya");
      setLastName(parts.slice(1).join(" ") || "Rao");
      setMobile(user.mobile || "+91 98765 43210");
      setEmail(user.email || "ananya.rao@irctc.in");
    }
  }, [user, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    updateProfile({
      name: fullName || "Ananya Rao",
      mobile: mobile.trim() || "+91 98765 43210",
      email: email.trim() || "ananya.rao@irctc.in"
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <Modal title="Edit Profile Details" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSave} className="flex flex-col gap-3.5">
        <SimpleInput label="First Name" icon={User} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <SimpleInput label="Last Name" icon={User} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <SimpleInput label="Mobile Number" icon={Phone} value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <SimpleInput label="Email Address" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <button 
          type="submit"
          className="mt-3 w-full h-12 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all bg-[#0A1626] text-[#F0A63A] hover:bg-black cursor-pointer shadow-md active:scale-[0.99]"
        >
          {savedSuccess ? "✓ Profile Updated Successfully" : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}

export function PassengersModal({ isOpen, onClose }) {
  const { savedPassengers, addSavedPassenger, removeSavedPassenger } = useAuthStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [pref, setPref] = useState("Lower");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSavedPassenger({
      name: name.trim(),
      age: parseInt(age, 10) || 28,
      gender,
      pref,
      aadhaarVerified: true
    });
    setName("");
    setAge("");
    setShowAddForm(false);
  };

  return (
    <Modal title="Saved Passengers (Master List)" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {(savedPassengers || []).map((p) => (
          <div key={p.id} className="p-3.5 border border-gray-200 rounded-2xl flex items-center justify-between bg-white shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xs md:text-sm text-[#0A1626]">{p.name}</p>
                {p.aadhaarVerified && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                    <ShieldCheck size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 text-[#6B7280] font-medium">{p.age} yrs, {p.gender} • {p.pref} Berth</p>
            </div>
            <button 
              onClick={() => removeSavedPassenger(p.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Remove passenger"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {showAddForm ? (
          <form onSubmit={handleAdd} className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-3 mt-1">
            <p className="text-xs font-bold text-[#0A1626]">Add New Passenger</p>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Passenger Full Name" 
              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold outline-none"
              required 
            />
            <div className="grid grid-cols-3 gap-2">
              <input 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                placeholder="Age" 
                className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold outline-none text-center" 
                required
              />
              <select 
                value={gender} 
                onChange={e => setGender(e.target.value)} 
                className="h-10 px-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <select 
                value={pref} 
                onChange={e => setPref(e.target.value)} 
                className="h-10 px-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="Lower">Lower</option>
                <option value="Middle">Middle</option>
                <option value="Upper">Upper</option>
                <option value="Side Lower">Side Lower</option>
                <option value="Side Upper">Side Upper</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 h-9 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs cursor-pointer">
                Save Passenger
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-3 h-9 rounded-xl border border-gray-300 bg-white text-xs font-semibold">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-2 w-full h-11 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0A1626] font-bold text-xs text-[#0A1626] flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Plus size={15} /> Add New Passenger
          </button>
        )}
      </div>
    </Modal>
  );
}

export function PaymentsModal({ isOpen, onClose }) {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useAuthStore();
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState('upi');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addPaymentMethod({
      type,
      title: title.trim(),
      subtitle: subtitle.trim() || (type === 'upi' ? `${title.toLowerCase()}@upi` : '•••• 8821')
    });
    setTitle('');
    setSubtitle('');
    setShowAdd(false);
  };

  return (
    <Modal title="Saved Payment Methods" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {(paymentMethods || []).map((pm) => (
          <div key={pm.id} className="p-3.5 border border-gray-200 rounded-2xl flex items-center gap-3 bg-white shadow-xs">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              pm.type === 'card' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {pm.type === 'card' ? <CreditCard size={18} /> : <Landmark size={18} />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs md:text-sm text-[#0A1626]">{pm.title}</p>
              <p className="text-[11px] text-[#6B7280] f-accent">{pm.subtitle}</p>
            </div>
            <button 
              onClick={() => removePaymentMethod(pm.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {showAdd ? (
          <form onSubmit={handleAdd} className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-3 mt-1">
            <p className="text-xs font-bold text-[#0A1626]">Add Payment Method</p>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setType('upi')} 
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${type === 'upi' ? 'bg-[#0A1626] text-white' : 'bg-white text-gray-700 border'}`}
              >
                UPI ID
              </button>
              <button 
                type="button" 
                onClick={() => setType('card')} 
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${type === 'card' ? 'bg-[#0A1626] text-white' : 'bg-white text-gray-700 border'}`}
              >
                Debit / Credit Card
              </button>
            </div>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder={type === 'upi' ? 'e.g. Google Pay / PhonePe' : 'e.g. ICICI Bank Card'}
              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold outline-none"
              required 
            />
            <input 
              value={subtitle} 
              onChange={e => setSubtitle(e.target.value)} 
              placeholder={type === 'upi' ? 'yourname@okaxis' : 'Card Ending in •••• 1234'}
              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs f-accent outline-none" 
            />
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 h-9 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs cursor-pointer">
                Save Method
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 h-9 rounded-xl border border-gray-300 bg-white text-xs font-semibold">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowAdd(true)}
            className="mt-2 w-full h-11 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0A1626] font-bold text-xs text-[#0A1626] flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-gray-50 cursor-pointer"
          >
            <CreditCard size={15} /> Add Payment Method
          </button>
        )}
      </div>
    </Modal>
  );
}

export function KycModal({ isOpen, onClose }) {
  const [aadhaarLast4, setAadhaarLast4] = useState("8392");
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    if (tempInput.length === 4) {
      setAadhaarLast4(tempInput);
      setIsEditing(false);
      setTempInput("");
    }
  };

  return (
    <Modal title="KYC &amp; Aadhaar Verification" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center py-4 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700">
          <BadgeCheck size={36} />
        </div>
        <h4 className="font-serif font-bold text-base text-[#0A1626]">DigiLocker Verified Successfully</h4>
        <p className="text-xs mt-1 text-[#6B7280] max-w-xs leading-relaxed">
          Aadhaar ending in <strong className="f-accent text-[#0A1626]">•••• {aadhaarLast4}</strong> is active and unlocks 12 monthly ticket bookings.
        </p>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="w-full mt-4 p-3 rounded-2xl bg-white border border-gray-200 space-y-2">
            <p className="text-xs font-bold text-[#0A1626]">Enter New Last 4 Digits of Aadhaar</p>
            <input 
              type="text" 
              maxLength={4}
              value={tempInput}
              onChange={e => setTempInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 5921"
              className="h-10 w-36 mx-auto px-3 rounded-xl border border-gray-300 f-accent font-bold text-center text-sm outline-none block"
            />
            <div className="flex gap-2 justify-center">
              <button type="submit" className="h-8 px-4 rounded-lg bg-[#0A1626] text-[#F0A63A] text-xs font-bold cursor-pointer">
                Verify OTP
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="h-8 px-3 rounded-lg border text-xs cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-5 w-full h-11 rounded-xl border border-gray-300 font-bold text-xs text-[#0A1626] hover:bg-white transition-colors cursor-pointer"
          >
            Update / Re-verify Aadhaar
          </button>
        )}
      </div>
    </Modal>
  );
}

export function LanguageModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("English");
  return (
    <Modal title="Select Language / भाषा चुनें" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2">
        {[
          { id: "English", native: "English (Default)" },
          { id: "Hindi", native: "हिंदी (Hindi)" },
          { id: "Telugu", native: "తెలుగు (Telugu)" },
          { id: "Tamil", native: "தமிழ் (Tamil)" },
          { id: "Bengali", native: "বাংলা (Bengali)" },
          { id: "Marathi", native: "मराठी (Marathi)" }
        ].map(l => (
          <button 
            key={l.id} 
            onClick={() => { setLang(l.id); setTimeout(onClose, 250); }} 
            className={`p-3.5 border rounded-2xl text-left font-bold text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer ${
              lang === l.id 
                ? "border-[#0A1626] bg-[#0A1626] text-[#F0A63A]" 
                : "border-gray-200 bg-white hover:bg-gray-50 text-[#0A1626]"
            }`}
          >
            <span>{l.native}</span>
            {lang === l.id && <Check size={16} />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function NotificationsModal({ isOpen, onClose }) {
  const [toggles, setToggles] = useState({ sms: true, wa: true, push: false });
  const items = [
    { id: "sms", icon: MessageSquareText, title: "SMS Booking Alerts", desc: "Real-time PNR confirmation, chart updates and delay SMS." },
    { id: "wa", icon: PhoneCall, title: "WhatsApp E-Tickets", desc: "Get downloadable PDF tickets directly in your WhatsApp chat." },
    { id: "push", icon: Bell, title: "Tatkal & Fare Alerts", desc: "Push notification 10 minutes before 10 AM Tatkal booking opens." }
  ];

  return (
    <Modal title="Notification Preferences" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {items.map(n => (
          <div 
            key={n.id} 
            onClick={() => setToggles(p => ({ ...p, [n.id]: !p[n.id] }))} 
            className="flex items-center justify-between p-3.5 border border-gray-200 rounded-2xl cursor-pointer bg-white hover:bg-gray-50/80 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F3EEE0] flex items-center justify-center text-[#0A1626]"><n.icon size={18} /></div>
              <div>
                <p className="font-bold text-xs md:text-sm text-[#0A1626]">{n.title}</p>
                <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">{n.desc}</p>
              </div>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${
              toggles[n.id] ? "bg-emerald-600" : "bg-gray-300"
            }`}>
              <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                toggles[n.id] ? "left-6" : "left-1"
              }`}></div>
            </div>
          </div>
        ))}
        <button onClick={onClose} className="mt-2 w-full h-11 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs cursor-pointer">
          Done
        </button>
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
