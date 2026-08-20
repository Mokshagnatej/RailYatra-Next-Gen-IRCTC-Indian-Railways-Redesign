/**
 * api.ts - Handles fetching data from the Indian Railways API.
 * Uses a RapidAPI provider. If the API key is not provided or the request fails,
 * it falls back to using mock data so the UI remains functional.
 */

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || "irctc1.p.rapidapi.com"; // Example host

// -----------------------------------------------------------------------------
// Mock Data (Fallback)
// -----------------------------------------------------------------------------
const MOCK_TRAINS = [
  { no: "12951", name: "Mumbai Rajdhani", type: "Rajdhani", dep: "16:35", arr: "08:35", dur: "16h 00m", from: "NDLS", to: "BCT",
    days: "MTWTFSS", pantry: true, distance: 1384, stops: 5,
    classes: { "1A": { status: "AVAILABLE", n: 12, fare: 4855 }, "2A": { status: "AVAILABLE", n: 34, fare: 2830 }, "3A": { status: "RAC", n: 6, fare: 1985 } } },
  { no: "12953", name: "August Kranti Rajdhani", type: "Rajdhani", dep: "17:40", arr: "10:55", dur: "17h 15m", from: "NDLS", to: "BCT",
    days: "MTWTFSS", pantry: true, distance: 1384, stops: 6,
    classes: { "1A": { status: "AVAILABLE", n: 4, fare: 4855 }, "2A": { status: "RAC", n: 2, fare: 2830 }, "3A": { status: "AVAILABLE", n: 18, fare: 1985 } } },
  { no: "12259", name: "Sealdah Duronto", type: "Duronto", dep: "08:05", arr: "23:55", dur: "15h 50m", from: "NDLS", to: "SDAH",
    days: "M_W_F__", pantry: true, distance: 1453, stops: 0,
    classes: { "2A": { status: "AVAILABLE", n: 8, fare: 2650 }, "3A": { status: "WAITLIST", n: 0, fare: 1840, wl: 14 }, "SL": { status: "AVAILABLE", n: 61, fare: 685 } } },
  { no: "12002", name: "Bhopal Shatabdi", type: "Shatabdi", dep: "06:00", arr: "12:10", dur: "6h 10m", from: "NDLS", to: "BPL",
    days: "MTWTFSS", pantry: true, distance: 704, stops: 4,
    classes: { "CC": { status: "AVAILABLE", n: 122, fare: 985 }, "EC": { status: "RAC", n: 3, fare: 1890 } } },
  { no: "22210", name: "MMCT Duronto", type: "Duronto", dep: "23:00", arr: "16:10", dur: "17h 10m", from: "NDLS", to: "BCT",
    days: "_T_T___", pantry: true, distance: 1384, stops: 0,
    classes: { "1A": { status: "AVAILABLE", n: 10, fare: 4590 }, "2A": { status: "AVAILABLE", n: 28, fare: 2540 }, "3A": { status: "AVAILABLE", n: 45, fare: 1780 } } },
  { no: "14650", name: "Bikaner Express", type: "Express", dep: "20:15", arr: "10:40", dur: "14h 25m", from: "NDLS", to: "BME",
    days: "MTWTFSS", pantry: false, distance: 467, stops: 12,
    classes: { "SL": { status: "AVAILABLE", n: 44, fare: 495 }, "3A": { status: "AVAILABLE", n: 19, fare: 1320 }, "2A": { status: "WAITLIST", n: 0, fare: 1955, wl: 3 } } },
  { no: "12622", name: "Tamil Nadu Express", type: "Superfast", dep: "22:30", arr: "05:50", dur: "31h 20m", from: "NDLS", to: "MAS",
    days: "MTWTFSS", pantry: true, distance: 2182, stops: 8,
    classes: { "SL": { status: "AVAILABLE", n: 92, fare: 720 }, "3A": { status: "AVAILABLE", n: 56, fare: 1895 }, "2A": { status: "AVAILABLE", n: 24, fare: 2760 }, "1A": { status: "RAC", n: 1, fare: 4680 } } },
  { no: "18238", name: "Chhattisgarh Exp", type: "Mail/Exp", dep: "11:20", arr: "05:05", dur: "17h 45m", from: "NDLS", to: "BSP",
    days: "M__T__S", pantry: false, distance: 1185, stops: 18,
    classes: { "SL": { status: "RAC", n: 11, fare: 460 }, "3A": { status: "AVAILABLE", n: 27, fare: 1210 } } },
];

const MOCK_PNR = {
  pnr: "2819384720",
  trainNo: "12951",
  trainName: "Mumbai Rajdhani",
  doj: "24-Aug-2026",
  from: "NDLS",
  to: "BCT",
  boarding: "NDLS",
  class: "3A",
  chartStatus: "CHART NOT PREPARED",
  passengers: [
    { no: 1, bookingStatus: "RLWL/23", currentStatus: "CNF" },
    { no: 2, bookingStatus: "RLWL/24", currentStatus: "RAC/12" },
  ]
};

const MOCK_LIVE_STATUS = {
  trainNo: "12951",
  startDate: "24-Aug-2026",
  currentStation: "Ratlam Jn (RTM)",
  status: "On Time",
  delay: "0 mins",
  lastUpdated: "10 mins ago"
};

// -----------------------------------------------------------------------------
// API Helper
// -----------------------------------------------------------------------------
async function fetchFromApi(endpoint: string, params: Record<string, string>) {
  if (!API_KEY) {
    console.warn("No RapidAPI key provided. Falling back to mock data.");
    throw new Error("No API Key");
  }

  const url = new URL(`https://${API_HOST}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// Exported Functions
// -----------------------------------------------------------------------------

export async function searchTrains(fromStation: string, toStation: string, date: string) {
  try {
    const data = await fetchFromApi("/api/v3/trainBetweenStations", {
      fromStationCode: fromStation,
      toStationCode: toStation,
      dateOfJourney: date
    });
    
    // Transform API data to match our UI shape if needed
    // For now, if we get real data, we would map it here.
    return data.data; 
  } catch (error) {
    console.log("Using mock trains data due to API error or missing key");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_TRAINS;
  }
}

export async function getPNRStatus(pnr: string) {
  try {
    const data = await fetchFromApi("/api/v3/getPNRStatus", { pnr });
    return data.data;
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...MOCK_PNR, pnr };
  }
}

export async function getLiveTrainStatus(trainNo: string, date: string) {
  try {
    const data = await fetchFromApi("/api/v1/liveTrainStatus", { trainNo, startDay: "1" });
    return data.data;
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...MOCK_LIVE_STATUS, trainNo };
  }
}
