import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "../common/Shared.jsx";
import { getPNRStatus, getLiveTrainStatus } from "../../lib/api.ts";
import { useAuthStore } from "../../lib/store.ts";

export default function QuickLinksModal({ modal, onClose, onNavigate }) {
  const [pnrInput, setPnrInput] = useState("4517228091");
  const [trainInput, setTrainInput] = useState("12951");
  const [activeTab, setActiveTab] = useState("result");
  const [loading, setLoading] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [liveData, setLiveData] = useState(null);

  // Added this so seat availability fake data can be shown in modal
  const [trainData, setTrainData] = useState(null);

  if (!modal) return null;

  const handleFetch = async (type) => {
    setLoading(true);
    try {
      if (type === 'pnr') {
        const data = await getPNRStatus(pnrInput);
        setPnrData(data);
      } else if (type === 'live') {
        const data = await getLiveTrainStatus(trainInput, "1");
        setLiveData(data);
      } else if (type === 'train') {
        // Mock seat data for the modal
        setTrainData({
          trainNo: trainInput,
          trainName: "RAJJDHANI EXPRESS",
          classes: {
            "3A": { n: 42, fare: 1250 },
            "2A": { n: 12, fare: 1850 },
            "1A": { n: 4, fare: 2950 }
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <Modal isOpen={!!modal} onClose={onClose} title={
      modal.type === "pnr" ? "PNR Status Enquiry" :
      modal.type === "trains_between_stations" ? "Trains Between Stations" :
      modal.type === "fare_enquiry" ? "Fare Enquiry Calculator" :
      modal.type === "live" ? "Live Train Running Status" :
      modal.type === "seat" ? "Seat Availability Check" :
      modal.type === "cancel_tdr" ? "Cancel Ticket & TDR Refund" :
      modal.type === "retiring_rooms" ? "Station Retiring Rooms" :
      modal.type === "e_catering" ? "e-Catering Onboard Meal Booking" :
      "IRCTC Railway Service"
    }>
      {/* PNR Status */}
      {modal.type === "pnr" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter 10-digit PNR"
              value={pnrInput} 
              onChange={e => setPnrInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm f-accent font-semibold outline-none"
            />
            <button 
              onClick={() => handleFetch('pnr')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check PNR"}
            </button>
          </div>

          {pnrData ? (
            <div className="p-4 rounded-xl border bg-green-50/60 border-green-200">
              <div className="flex justify-between items-center pb-2 border-b border-green-200 mb-2">
                <span className="f-accent text-xs font-bold text-green-900">PNR {pnrData.pnr}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">{pnrData.chartStatus}</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between"><span>Train:</span><span className="font-semibold">{pnrData.trainNo} {pnrData.trainName}</span></div>
                <div className="flex justify-between"><span>Route:</span><span className="font-semibold">{pnrData.from} → {pnrData.to}</span></div>
                {pnrData.passengers && pnrData.passengers.map((p, i) => (
                  <div key={i} className="flex justify-between"><span>Passenger {p.no}:</span><span className="font-semibold text-blue-900">{p.currentStatus} (Booking: {p.bookingStatus})</span></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-sm text-gray-500">
              Enter PNR to see details
            </div>
          )}
          <button onClick={onClose} className="w-full h-11 rounded-xl border font-semibold text-sm hover:bg-gray-50 cursor-pointer">Done</button>
        </div>
      )}

      {/* Live Train Status */}
      {modal.type === "live" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Train number or name"
              value={trainInput} 
              onChange={e => setTrainInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-semibold outline-none"
            />
            <button 
              onClick={() => handleFetch('live')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Track Live"}
            </button>
          </div>

          {liveData ? (
            <div className="p-4 rounded-xl border bg-blue-50/70 border-blue-200">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200 mb-2">
                <span className="font-bold text-xs text-blue-950">{liveData.trainNo} Live Status</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">{liveData.status.toUpperCase()}</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between"><span>Start Date:</span><span className="font-semibold">{liveData.startDate}</span></div>
                <div className="flex justify-between"><span>Current Station:</span><span className="font-semibold">{liveData.currentStation}</span></div>
                <div className="flex justify-between"><span>Delay:</span><span className="font-semibold text-red-600">{liveData.delay}</span></div>
                <div className="flex justify-between"><span>Last Updated:</span><span className="font-semibold">{liveData.lastUpdated}</span></div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-sm text-gray-500">
              Enter Train Number to track status
            </div>
          )}
          <button onClick={onClose} className="w-full h-11 rounded-xl border font-semibold text-sm hover:bg-gray-50 cursor-pointer">Close</button>
        </div>
      )}

      {/* Cancel Ticket / TDR */}
      {modal.type === "cancel_tdr" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-600">Enter your PNR to calculate cancellation refund or file online TDR before train departure.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="10-digit PNR number"
              value={pnrInput} 
              onChange={e => setPnrInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm f-accent font-semibold outline-none"
            />
            <button 
              onClick={() => handleSimulate()}
              disabled={loading}
              className="h-12 px-4 rounded-xl text-white font-semibold text-sm bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check Refund"}
            </button>
          </div>

          <div className="p-4 rounded-xl border bg-gray-50">
            <div className="flex justify-between text-xs py-1 border-b">
              <span className="text-gray-500">Original Fare Paid:</span>
              <span className="font-bold">₹2,840</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b text-red-600">
              <span>Clerkage / IRCTC Cancellation Fee:</span>
              <span className="font-bold">-₹240</span>
            </div>
            <div className="flex justify-between text-sm py-2 font-bold text-green-700">
              <span>Instant Refund to Source Account:</span>
              <span>₹2,600</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                const targetPnr = pnrInput.trim() || "8462097315";
                useAuthStore.getState().cancelJourney(targetPnr);
                onClose();
              }} 
              className="flex-1 h-11 rounded-xl font-bold text-xs md:text-sm text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm"
            >
              Submit Cancellation & Claim Refund
            </button>
            <button onClick={onClose} className="px-4 h-11 rounded-xl border font-semibold text-xs md:text-sm hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Dedicated Interactive Seat Availability Tool in Modal */}
      {modal.type === "seat" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Train number (e.g. 16052)"
              value={trainInput} 
              onChange={e => setTrainInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-semibold outline-none"
            />
            <button 
              onClick={() => handleFetch('train')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check Seats"}
            </button>
          </div>

          {trainData ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border bg-emerald-50/70 border-emerald-200">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200 mb-2">
                  <span className="font-bold text-xs text-emerald-950">#{trainData.trainNo} {trainData.trainName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">LIVE SYNCED</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(trainData.classes || {}).map(([cls, info]) => (
                    <div key={cls} className="p-2 rounded-lg bg-white border border-emerald-200 text-center">
                      <span className="f-accent font-bold text-xs block text-[#0A1626]">{cls}</span>
                      <span className="text-[11px] font-extrabold text-emerald-700 block">AVL {info.n}</span>
                      <span className="text-[10px] text-gray-500 f-accent">₹{info.fare}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-xs text-gray-500">
              Enter train number (e.g. 16052, 12951, 22436) to see live available seats and fares.
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => { onClose(); if (onNavigate) onNavigate("seat-availability"); }} 
              className="flex-1 h-11 rounded-xl text-white font-bold text-xs bg-[#0A1626] hover:bg-[#132338] cursor-pointer"
            >
              Open Full 6-Day Forecast Page
            </button>
            <button onClick={onClose} className="px-4 h-11 rounded-xl border font-semibold text-xs hover:bg-gray-50 cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* Explore info / Generic notice */}
      {modal.type === "explore_info" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border bg-amber-50 border-amber-200">
            <p className="font-bold text-sm text-amber-950 mb-1">{modal.title || "Official Indian Railways Portal"}</p>
            <p className="text-xs text-amber-900 leading-relaxed">
              Official Indian Railways information and direct services are actively integrated and available in RailYatra Next-Gen.
            </p>
          </div>
          <button onClick={onClose} className="w-full h-11 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs cursor-pointer shadow-sm">
            Close Notice
          </button>
        </div>
      )}

      {/* Fare Enquiry & Other Services */}
      {(modal.type === "fare_enquiry" || modal.type === "trains_between_stations" || modal.type === "retiring_rooms" || modal.type === "e_catering") && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border bg-blue-50/50">
            <p className="font-bold text-sm text-blue-950 mb-2">Instant Railway Tool</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {modal.type === "fare_enquiry" ? "Calculate transparent fare breakdowns across AC 1st, 2nd, 3rd Tier, Sleeper and Tatkal." :
               modal.type === "trains_between_stations" ? "Browse all timetable schedules, intermediate halts, and pantry availability across all routes." :
               modal.type === "e_catering" ? "Order hot meals from 500+ FSSAI-approved restaurant partners delivered straight to your seat." :
               "Book AC Deluxe and Standard rooms or dormitory pods at station junctions."}
            </p>
          </div>
          <button onClick={() => { onClose(); if (onNavigate) onNavigate("explore"); }} className="w-full h-12 rounded-xl text-white font-bold text-sm bg-blue-900 hover:bg-blue-800 cursor-pointer">
            Launch Interactive Tool
          </button>
        </div>
      )}
    </Modal>
  );
}
