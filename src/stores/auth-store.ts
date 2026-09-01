// ============================================
// BOUNCERS ON TIPS — Auth Store
// ============================================

import { create } from 'zustand';
import { UserRole, Customer, Professional } from '@/lib/types';
import { MOCK_CUSTOMERS, MOCK_PROFESSIONALS } from '@/lib/mock-data';

interface AuthStore {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentCustomer: Customer;
  currentProfessional: Professional;
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  role: 'customer',
  setRole: (role) => set({ role }),
  currentCustomer: MOCK_CUSTOMERS[0],
  currentProfessional: MOCK_PROFESSIONALS[0],
  isOnline: true,
  setIsOnline: (v) => set({ isOnline: v }),
  demoMode: true,
  setDemoMode: (v) => set({ demoMode: v }),
}));
