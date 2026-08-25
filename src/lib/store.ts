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
  setPassengers: (val: { adults: number; children: number; infants: number } | ((prev: { adults: number; children: number; infants: number }) => { adults: number; children: number; infants: number })) => void;
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
  setPassengers: (val) => set((state) => ({
    passengers: typeof val === "function" ? val(state.passengers) : val
  })),
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

export interface SavedPassenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  pref: string;
  aadhaarVerified?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  title: string;
  subtitle: string;
  icon?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; irctcId?: string; mobile?: string } | null;
  journeys: any[];
  savedPassengers: SavedPassenger[];
  paymentMethods: PaymentMethod[];
  login: (name: string, email: string, irctcId?: string, mobile?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<{ name: string; email: string; irctcId: string; mobile: string }>) => void;
  addJourney: (journey: any) => void;
  cancelJourney: (pnr: string) => void;
  addSavedPassenger: (p: Omit<SavedPassenger, 'id'>) => void;
  removeSavedPassenger: (id: string) => void;
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
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
      status: "CNF",
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

const getInitialPassengers = (): SavedPassenger[] => {
  try {
    const saved = localStorage.getItem('railyatra_passengers');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [
    { id: "p1", name: "Ananya Rao", age: 28, gender: "Female", pref: "Lower", aadhaarVerified: true },
    { id: "p2", name: "Rohan Rao", age: 30, gender: "Male", pref: "Upper", aadhaarVerified: true },
    { id: "p3", name: "Sita Devi", age: 58, gender: "Female", pref: "Lower", aadhaarVerified: true },
    { id: "p4", name: "Arjun Rao", age: 8, gender: "Male", pref: "No Preference", aadhaarVerified: false },
  ];
};

const getInitialPayments = (): PaymentMethod[] => {
  try {
    const saved = localStorage.getItem('railyatra_payments');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [
    { id: "pm1", type: "card", title: "HDFC Bank Credit Card", subtitle: "•••• 4242" },
    { id: "pm2", type: "upi", title: "Google Pay UPI", subtitle: "ananya@okaxis" }
  ];
};

const initialJourneys = getInitialJourneys();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!initialUser || initialJourneys.length > 0,
  user: initialUser || { name: "Ananya Rao", email: "ananya.rao@irctc.in", irctcId: "ananya.rao", mobile: "+91 98765 43210" },
  journeys: initialJourneys,
  savedPassengers: getInitialPassengers(),
  paymentMethods: getInitialPayments(),

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

  updateProfile: (data) => {
    set((state) => {
      const updatedUser = { ...(state.user || { name: "Ananya Rao", email: "ananya.rao@irctc.in" }), ...data };
      try {
        localStorage.setItem('railyatra_auth_user', JSON.stringify(updatedUser));
      } catch (e) {}
      return { user: updatedUser };
    });
  },

  addJourney: (journey) => {
    if (!journey) return;
    const safeJourney = {
      pnr: String(journey.pnr || Math.floor(1000000000 + Math.random() * 8999999999)),
      status: journey.status || "CNF",
      bookedAt: journey.bookedAt ? (typeof journey.bookedAt === 'string' ? journey.bookedAt : journey.bookedAt.toISOString()) : new Date().toISOString(),
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
        dur: "15h 40m",
        type: "Rajdhani"
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

  cancelJourney: (pnr) => {
    set((state) => {
      const updated = state.journeys.map(j => {
        if (j.pnr === pnr) {
          return {
            ...j,
            status: "CANCELLED",
            passengers: (j.passengers || []).map((p: any) => ({ ...p, status: "CAN" }))
          };
        }
        return j;
      });
      try {
        localStorage.setItem('railyatra_journeys', JSON.stringify(updated));
      } catch (e) {}
      return { journeys: updated };
    });
  },

  addSavedPassenger: (p) => {
    set((state) => {
      const newPassenger: SavedPassenger = { ...p, id: "p_" + Date.now() };
      const updated = [...state.savedPassengers, newPassenger];
      try {
        localStorage.setItem('railyatra_passengers', JSON.stringify(updated));
      } catch (e) {}
      return { savedPassengers: updated };
    });
  },

  removeSavedPassenger: (id) => {
    set((state) => {
      const updated = state.savedPassengers.filter(p => p.id !== id);
      try {
        localStorage.setItem('railyatra_passengers', JSON.stringify(updated));
      } catch (e) {}
      return { savedPassengers: updated };
    });
  },

  addPaymentMethod: (pm) => {
    set((state) => {
      const newPM: PaymentMethod = { ...pm, id: "pm_" + Date.now() };
      const updated = [...state.paymentMethods, newPM];
      try {
        localStorage.setItem('railyatra_payments', JSON.stringify(updated));
      } catch (e) {}
      return { paymentMethods: updated };
    });
  },

  removePaymentMethod: (id) => {
    set((state) => {
      const updated = state.paymentMethods.filter(p => p.id !== id);
      try {
        localStorage.setItem('railyatra_payments', JSON.stringify(updated));
      } catch (e) {}
      return { paymentMethods: updated };
    });
  }
}));
