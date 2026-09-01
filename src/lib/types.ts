// ============================================
// BOUNCERS ON TIPS — Core Type Definitions
// ============================================

// ---- Enums ----

export type BookingStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'SEARCHING'
  | 'PARTIALLY_CONFIRMED'
  | 'CONFIRMED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type ResponseStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ProfessionalLevel = 'STANDARD' | 'PRO' | 'ELITE';

export type GenderPreference = 'ANY' | 'MALE' | 'FEMALE' | 'MIXED';

export type PhysicalPresence = 'STANDARD' | 'LARGE' | 'HIGH';

export type UserRole = 'customer' | 'bouncer' | 'admin';

export type ServicePurpose =
  | 'womens_safety'
  | 'personal_protection'
  | 'night_out'
  | 'party_club'
  | 'college_event'
  | 'wedding'
  | 'private_event'
  | 'crowd_management'
  | 'vip_protection'
  | 'corporate_event'
  | 'travel_escort'
  | 'venue_security'
  | 'other';

// ---- Location ----

export interface Location {
  lat: number;
  lng: number;
  address: string;
  shortAddress?: string;
}

// ---- Users ----

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePhoto?: string;
  savedLocations: Location[];
  emergencyContact?: { name: string; phone: string };
  createdAt: string;
}

export interface Professional {
  id: string;
  code: string; // e.g., "BT-104"
  name: string;
  gender: 'Male' | 'Female';
  profilePhoto: string;
  level: ProfessionalLevel;
  rating: number;
  completedBookings: number;
  experience: string; // e.g., "3 years"
  specializations: ServicePurpose[];
  languages: string[];
  hourlyRate: number;
  isOnline: boolean;
  isVerified: boolean;
  location: Location;
  availability: 'available' | 'busy' | 'offline';
  acceptanceRate: number;
  physicalPresence: PhysicalPresence;
}

// ---- Booking ----

export interface BookingRequest {
  purpose: ServicePurpose;
  purposeLabel: string;
  count: number;
  level: ProfessionalLevel;
  presence: PhysicalPresence;
  genderPreference: GenderPreference;
  location: Location;
  date: string;
  startTime: string;
  duration: number; // hours
  endTime: string;
}

export interface Booking {
  id: string;
  customerId: string;
  request: BookingRequest;
  status: BookingStatus;
  pricing: PriceBreakdown;
  responses: BookingResponse[];
  team: Professional[];
  createdAt: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: Rating;
}

export interface BookingResponse {
  bookingId: string;
  professional: Professional;
  status: ResponseStatus;
  requestedAt: string;
  respondedAt?: string;
  responseTimeMs?: number;
  distance: number; // km
  estimatedEarnings: number;
}

// ---- Pricing ----

export interface PriceBreakdown {
  level: ProfessionalLevel;
  baseRate: number; // per hour
  count: number;
  duration: number;
  subtotal: number;
  platformFee: number;
  total: number;
}

// ---- Ratings ----

export interface Rating {
  id: string;
  bookingId: string;
  fromCustomer: boolean;
  overall: number;
  professionalism?: number;
  punctuality?: number;
  behaviour?: number;
  communication?: number;
  comment?: string;
  createdAt: string;
}

// ---- Notifications ----

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

// ---- Service Card ----

export interface ServiceOption {
  id: ServicePurpose;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

// ---- Level Card ----

export interface LevelOption {
  level: ProfessionalLevel;
  title: string;
  description: string;
  features: string[];
  baseRate: number;
  multiplier: number;
}
