import { create } from 'zustand';

export type AppMode = 'interface' | 'journey';

export interface BookingState {
  from: string;
  to: string;
  date: string;
  passengers: { adults: number; children: number; infants: number };
  cls: string;
  quota: string;
  setFrom: (val: string) => void;
  setTo: (val: string) => void;
  setDate: (val: string) => void;
  setPassengers: (val: { adults: number; children: number; infants: number }) => void;
  setCls: (val: string) => void;
  setQuota: (val: string) => void;
}

export interface JourneyState {
  mode: AppMode;
  currentStation: string;
  nextStation: string;
  eta: string;
  speed: string;
  distanceRemaining: string;
  platform: string;
  routeProgress: number;
  serviceState: string;
  setMode: (mode: AppMode) => void;
  setJourneyData: (data: Partial<JourneyState>) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  from: "New Delhi (NDLS)",
  to: "Mumbai Central (BCT)",
  date: "23 Aug",
  passengers: { adults: 1, children: 0, infants: 0 },
  cls: "All classes",
  quota: "General",
  setFrom: (val) => set({ from: val }),
  setTo: (val) => set({ to: val }),
  setDate: (val) => set({ date: val }),
  setPassengers: (val) => set({ passengers: val }),
  setCls: (val) => set({ cls: val }),
  setQuota: (val) => set({ quota: val }),
}));

export const useJourneyStore = create<JourneyState>((set) => ({
  mode: 'interface',
  currentStation: 'New Delhi',
  nextStation: 'Mathura Jn',
  eta: '18:45',
  speed: '124 km/h',
  distanceRemaining: '1250 km',
  platform: '-',
  routeProgress: 0,
  serviceState: 'On Time',
  setMode: (mode) => set({ mode }),
  setJourneyData: (data) => set((state) => ({ ...state, ...data })),
}));

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; irctcId?: string; mobile?: string } | null;
  journeys: any[];
  login: (name: string, email: string, irctcId?: string, mobile?: string) => void;
  logout: () => void;
  addJourney: (journey: any) => void;
}

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('railyatra_auth_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return null;
};

const initialUser = getInitialUser();

const getInitialJourneys = () => {
  try {
    const saved = localStorage.getItem('railyatra_journeys');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [
    {
      pnr: "8462097315",
      bookedAt: new Date().toISOString(),
      txnId: "IRC84620973TX",
      coach: "B4",
      cls: "3A",
      fare: 1680,
      date: "Tue, 25 Aug 2026",
      train: {
        no: "12951",
        name: "Mumbai Tejas Rajdhani",
        from: "NDLS",
        to: "MMCT",
        dep: "16:55",
        arr: "08:35",
        dur: "15h 40m",
        type: "Rajdhani"
      },
      passengers: [
        {
          name: "Ananya Rao",
          age: "28",
          gender: "F",
          coach: "B4",
          seat: "22",
          berth: "Lower",
          status: "CNF",
          class: "3A"
        }
      ]
    }
  ];
};

const initialJourneys = getInitialJourneys();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!initialUser || initialJourneys.length > 0,
  user: initialUser || { name: "Ananya Rao", email: "ananya.rao@irctc.in", irctcId: "ananya.rao", mobile: "+91 98765 43210" },
  journeys: initialJourneys,
  login: (name, email, irctcId = "ananya.rao", mobile = "+91 98765 43210") => {
    const cleanName = name ? name.trim() : (email.includes("@") ? email.split("@")[0] : "Passenger");
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const userObj = { name: formattedName, email, irctcId, mobile };
    try {
      localStorage.setItem('railyatra_auth_user', JSON.stringify(userObj));
    } catch (e) {}
    set({ isAuthenticated: true, user: userObj });
  },
  logout: () => {
    try {
      localStorage.removeItem('railyatra_auth_user');
    } catch (e) {}
    set({ isAuthenticated: false, user: null });
  },
  addJourney: (journey) => {
    if (!journey) return;
    const safeJourney = {
      pnr: String(journey.pnr || Math.floor(1000000000 + Math.random() * 8999999999)),
      bookedAt: journey.bookedAt || new Date().toISOString(),
      txnId: journey.txnId || ("IRC" + String(Date.now()).slice(-8) + "TX"),
      coach: journey.coach || "B4",
      cls: journey.cls || journey.train?.cls || "3A",
      fare: journey.fare || 1680,
      date: journey.date || "Tue, 25 Aug 2026",
      train: journey.train || {
        no: "12951",
        name: "Mumbai Tejas Rajdhani",
        from: "NDLS",
        to: "MMCT",
        dep: "16:55",
        arr: "08:35",
        dur: "15h 40m"
      },
      passengers: Array.isArray(journey.passengers) && journey.passengers.length > 0 
        ? journey.passengers.map((p: any, i: number) => ({
            name: p.name || `Passenger ${i + 1}`,
            age: p.age || "28",
            gender: p.gender || "M",
            coach: p.coach || journey.coach || "B4",
            seat: p.seat || String(20 + i * 3),
            berth: p.berth || "Lower",
            status: p.status || "CNF",
            class: p.class || journey.cls || "3A"
          }))
        : [{ name: "Passenger 1", age: "28", gender: "M", coach: "B4", seat: "22", berth: "Lower", status: "CNF", class: "3A" }]
    };

    set((state) => {
      const updated = [safeJourney, ...state.journeys.filter(j => j.pnr !== safeJourney.pnr)];
      try {
        localStorage.setItem('railyatra_journeys', JSON.stringify(updated));
      } catch (e) {}
      return { 
        journeys: updated,
        isAuthenticated: true,
        user: state.user || { name: "Ananya Rao", email: "ananya.rao@irctc.in", irctcId: "ananya.rao", mobile: "+91 98765 43210" }
      };
    });
  },
}));
