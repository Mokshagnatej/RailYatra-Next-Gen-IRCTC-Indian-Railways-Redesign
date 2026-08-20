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
  date: "Tue, 25 Aug",
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
  user: { name: string; email: string } | null;
  journeys: any[];
  login: (name: string, email: string) => void;
  logout: () => void;
  addJourney: (journey: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  journeys: [],
  login: (name, email) => set({ isAuthenticated: true, user: { name, email } }),
  logout: () => set({ isAuthenticated: false, user: null }),
  addJourney: (journey) => set((state) => ({ journeys: [journey, ...state.journeys] })),
}));
