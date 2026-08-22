const fs = require('fs');
const path = 'src/components/RailApp.jsx';
let code = fs.readFileSync(path, 'utf8');

const importOld = 'import { ChevronDown, ChevronRight, Train, Check, ShieldCheck, Ticket, Search, User, Home, Compass, LifeBuoy, MapPin, X, ArrowLeftRight, Navigation, Map, PackageSearch, MessageSquareText, Activity, LocateFixed, SlidersHorizontal, Lock, ArrowRight, Sun, Settings, Clock, Star, Users, Briefcase, Info, ArrowRightCircle, Smartphone, Globe, Send, Shield, Zap, RefreshCw, SmartphoneNfc, Fingerprint, Cpu, SearchCode, Phone, Mail, FileText, ChevronLeft, CreditCard } from "lucide-react";';
if (!code.includes('import { REGEXP_ONLY_DIGITS_AND_CHARS }')) {
  code = code.replace(importOld, importOld + '\nimport { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "input-otp";');
}

const bookingScreenOld = `function BookingScreen({ selection, onDone, onBack, onConfirmed }) {
  const [step, setStep] = useState(0);
  const [payState, setPayState] = useState("idle"); // idle | processing | verifying | success | failed
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "M" }]);`;

const bookingScreenNew = `function BookingScreen({ selection, onDone, onBack, onConfirmed }) {
  const [step, setStep] = useState(0);
  const [payState, setPayState] = useState("idle"); // idle | otp | processing | verifying | success | failed
  const [otp, setOtp] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "M" }]);`;
code = code.replace(bookingScreenOld, bookingScreenNew);

const payMethodsOld = `{payState === "idle" && (
              <div className="space-y-3">
                {[
                  { icon: "💳", label: "UPI (GPay, PhonePe, Paytm)", desc: "Pay instantly via UPI ID or QR scan" },
                  { icon: "🏦", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay accepted" },
                  { icon: "🏢", label: "Net Banking", desc: "All major banks supported" },
                  { icon: "👛", label: "IRCTC eWallet", desc: "Pre-loaded wallet for faster checkout" },
                ].map((pm) => (
                  <div key={pm.label} className="rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--paper-2)] transition-colors" style={{ borderColor: "var(--line)" }}>
                    <span className="text-xl">{pm.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.label}</p>
                      <p className="text-xs" style={{ color: "var(--steel)" }}>{pm.desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--steel)" }} />
                  </div>
                ))}
                <p className="text-xs pt-2" style={{ color: "var(--steel)" }}>Demo: try each outcome to see how the redesigned flow handles it — no more silent dead ends.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button onClick={() => runPayment("success")} className="h-11 rounded-lg font-semibold text-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>Pay ₹{total} — succeeds</button>
                  <button onClick={() => runPayment("verifying")} className="h-11 rounded-lg font-semibold text-sm border" style={{ borderColor: "var(--amber)", color: "var(--amber)" }}>Simulate ambiguous debit</button>
                  <button onClick={() => runPayment("failed")} className="h-11 rounded-lg font-semibold text-sm border" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Simulate failure</button>
                </div>
              </div>
            )}`;

const payMethodsNew = `{payState === "idle" && (
              <div className="space-y-3 anim-fade-up">
                {[
                  { icon: "💳", label: "UPI (GPay, PhonePe, Paytm)", desc: "Pay instantly via UPI ID or QR scan" },
                  { icon: "🏦", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay accepted" },
                  { icon: "🏢", label: "Net Banking", desc: "All major banks supported" },
                  { icon: "👛", label: "IRCTC eWallet", desc: "Pre-loaded wallet for faster checkout" },
                ].map((pm) => (
                  <div key={pm.label} onClick={() => { setSelectedMethod(pm.label); setPayState("otp"); }} className="rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--paper-2)] transition-colors group" style={{ borderColor: "var(--line)" }}>
                    <span className="text-xl group-hover:scale-110 transition-transform">{pm.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.label}</p>
                      <p className="text-xs" style={{ color: "var(--steel)" }}>{pm.desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--steel)" }} />
                  </div>
                ))}
              </div>
            )}
            
            {payState === "otp" && (
              <div className="flex flex-col items-center py-6 gap-4 anim-fade-up">
                <ShieldCheck size={48} className="text-green-500 mb-2" />
                <div className="text-center">
                  <p className="font-semibold text-lg">Verification Required</p>
                  <p className="text-sm" style={{ color: "var(--steel)" }}>Enter the 6-digit OTP sent to your registered mobile for {selectedMethod}.</p>
                </div>
                
                <div className="my-4">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} className="w-12 h-14 text-lg border rounded-xl" style={{ borderColor: "var(--line)" }} />
                      ))}
                    </InputOTPGroup>
                  )} />
                </div>
                
                <div className="flex gap-3 w-full max-w-[280px]">
                  <button onClick={() => setPayState("idle")} className="flex-1 h-11 rounded-xl font-semibold border transition-colors hover:bg-[var(--paper-2)]" style={{ borderColor: "var(--line)" }}>Cancel</button>
                  <button disabled={otp.length !== 6} onClick={() => runPayment(otp === "000000" ? "failed" : "success")} 
                    className="flex-1 h-11 rounded-xl font-semibold transition-colors disabled:opacity-50" 
                    style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                    Verify
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--steel)" }}>Demo: Enter any 6 digits to succeed, or 000000 to fail.</p>
              </div>
            )}`;

code = code.replace(payMethodsOld, payMethodsNew);
fs.writeFileSync(path, code);
