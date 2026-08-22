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

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!initialUser,
  user: initialUser,
  journeys: [],
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
  addJourney: (journey) => set((state) => ({ journeys: [journey, ...state.journeys] })),
}));
