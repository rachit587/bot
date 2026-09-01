// ============================================
// BOUNCERS ON TIPS — Zustand Booking Store
// ============================================

import { create } from 'zustand';
import {
  BookingRequest,
  BookingStatus,
  Booking,
  PriceBreakdown,
  Professional,
  ServicePurpose,
  ProfessionalLevel,
  GenderPreference,
  PhysicalPresence,
  Location,
} from '@/lib/types';
import { calculatePrice } from '@/lib/price-calculator';
import { SimulationState } from '@/lib/demo-engine';

interface BookingStore {
  // ---- Current Step ----
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // ---- Form Fields ----
  purpose: ServicePurpose | null;
  purposeLabel: string;
  count: number;
  level: ProfessionalLevel;
  presence: PhysicalPresence;
  genderPreference: GenderPreference;
  location: Location | null;
  date: string;
  startTime: string;
  duration: number;

  // ---- Setters ----
  setPurpose: (purpose: ServicePurpose, label: string) => void;
  setCount: (count: number) => void;
  setLevel: (level: ProfessionalLevel) => void;
  setPresence: (presence: PhysicalPresence) => void;
  setGenderPreference: (pref: GenderPreference) => void;
  setLocation: (location: Location) => void;
  setDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setDuration: (hours: number) => void;

  // ---- Computed ----
  getEndTime: () => string;
  getPricing: () => PriceBreakdown;
  getBookingRequest: () => BookingRequest | null;

  // ---- Active Booking ----
  activeBooking: Booking | null;
  setActiveBooking: (booking: Booking | null) => void;

  // ---- Simulation ----
  simulationState: SimulationState | null;
  setSimulationState: (state: SimulationState | null) => void;

  // ---- Team ----
  confirmedTeam: Professional[];
  setConfirmedTeam: (team: Professional[]) => void;

  // ---- Booking Status ----
  bookingStatus: BookingStatus;
  setBookingStatus: (status: BookingStatus) => void;

  // ---- Reset ----
  resetBooking: () => void;
}

function computeEndTime(startTime: string, duration: number): string {
  if (!startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const endH = (h + duration) % 24;
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTime12(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export { formatTime12 };

export const useBookingStore = create<BookingStore>((set, get) => ({
  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

  purpose: null,
  purposeLabel: '',
  count: 2,
  level: 'PRO',
  presence: 'STANDARD',
  genderPreference: 'ANY',
  location: null,
  date: '',
  startTime: '20:00',
  duration: 3,

  setPurpose: (purpose, label) => set({ purpose, purposeLabel: label }),
  setCount: (count) => set({ count }),
  setLevel: (level) => set({ level }),
  setPresence: (presence) => set({ presence }),
  setGenderPreference: (pref) => set({ genderPreference: pref }),
  setLocation: (location) => set({ location }),
  setDate: (date) => set({ date }),
  setStartTime: (time) => set({ startTime: time }),
  setDuration: (hours) => set({ duration: hours }),

  getEndTime: () => {
    const s = get();
    return computeEndTime(s.startTime, s.duration);
  },

  getPricing: () => {
    const s = get();
    return calculatePrice(s.level, s.count, s.duration, s.presence);
  },

  getBookingRequest: () => {
    const s = get();
    if (!s.purpose || !s.location) return null;
    return {
      purpose: s.purpose,
      purposeLabel: s.purposeLabel,
      count: s.count,
      level: s.level,
      presence: s.presence,
      genderPreference: s.genderPreference,
      location: s.location,
      date: s.date,
      startTime: s.startTime,
      duration: s.duration,
      endTime: computeEndTime(s.startTime, s.duration),
    };
  },

  activeBooking: null,
  setActiveBooking: (booking) => set({ activeBooking: booking }),

  simulationState: null,
  setSimulationState: (state) => set({ simulationState: state }),

  confirmedTeam: [],
  setConfirmedTeam: (team) => set({ confirmedTeam: team }),

  bookingStatus: 'DRAFT',
  setBookingStatus: (status) => set({ bookingStatus: status }),

  resetBooking: () =>
    set({
      currentStep: 0,
      purpose: null,
      purposeLabel: '',
      count: 2,
      level: 'PRO',
      presence: 'STANDARD',
      genderPreference: 'ANY',
      location: null,
      date: '',
      startTime: '20:00',
      duration: 3,
      activeBooking: null,
      simulationState: null,
      confirmedTeam: [],
      bookingStatus: 'DRAFT',
    }),
}));
