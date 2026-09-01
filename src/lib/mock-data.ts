// ============================================
// BOUNCERS ON TIPS — Mock Data
// ============================================

import {
  Professional,
  Customer,
  Booking,
  ServiceOption,
  LevelOption,
  AppNotification,
  ServicePurpose,
} from './types';

// ---- Service Options ----

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'womens_safety', title: "Women's Safety", description: 'Dedicated female safety professionals for your peace of mind', icon: 'ShieldCheck' },
  { id: 'personal_protection', title: 'Personal Protection', description: 'One-on-one security for personal safety', icon: 'UserCheck' },
  { id: 'night_out', title: 'Night Out', description: 'Stay safe while you enjoy your evening', icon: 'Moon' },
  { id: 'party_club', title: 'Party / Club', description: 'Professional presence for nightlife events', icon: 'PartyPopper' },
  { id: 'college_event', title: 'College Event', description: 'Event security for campus gatherings', icon: 'GraduationCap' },
  { id: 'wedding', title: 'Wedding', description: 'Ensure your special day goes smoothly', icon: 'Heart' },
  { id: 'private_event', title: 'Private Event', description: 'Security for private functions and parties', icon: 'Lock' },
  { id: 'crowd_management', title: 'Crowd Management', description: 'Professional crowd control and management', icon: 'Users' },
  { id: 'vip_protection', title: 'VIP Protection', description: 'Premium protection for VIPs and celebrities', icon: 'Crown' },
  { id: 'corporate_event', title: 'Corporate Event', description: 'Professional security for business events', icon: 'Building2' },
  { id: 'travel_escort', title: 'Travel / Escort', description: 'Safe travel companionship and protection', icon: 'Car' },
  { id: 'venue_security', title: 'Venue Security', description: 'Complete venue security solutions', icon: 'Building' },
  { id: 'other', title: 'Other', description: 'Custom security requirements', icon: 'MoreHorizontal' },
];

// ---- Level Options ----

export const LEVEL_OPTIONS: LevelOption[] = [
  {
    level: 'STANDARD',
    title: 'Standard',
    description: 'Professional everyday presence',
    features: ['Background verified', 'Basic training', 'Professional conduct', 'Punctual & reliable'],
    baseRate: 500,
    multiplier: 1,
  },
  {
    level: 'PRO',
    title: 'Pro',
    description: 'Experienced and highly trained',
    features: ['Advanced training', '2+ years experience', 'Conflict resolution', 'First aid certified', 'Communication skills'],
    baseRate: 800,
    multiplier: 1.6,
  },
  {
    level: 'ELITE',
    title: 'Elite',
    description: 'Premium protection professionals',
    features: ['Ex-military / ex-police', '5+ years experience', 'VIP protocol trained', 'Emergency response', 'Discreet & professional', 'Multilingual'],
    baseRate: 1200,
    multiplier: 2.4,
  },
];

// ---- Bouncer Count Options ----

export const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10] as const;

// ---- Duration Options ----

export const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12] as const;

// ---- Mock Professionals (20) ----

const BENGALURU_CENTER = { lat: 12.9716, lng: 77.5946 };

function offsetLocation(baseLat: number, baseLng: number, kmRange: number) {
  const latOffset = (Math.random() - 0.5) * (kmRange / 111);
  const lngOffset = (Math.random() - 0.5) * (kmRange / 111);
  return { lat: baseLat + latOffset, lng: baseLng + lngOffset };
}

const maleNames = ['Arjun', 'Rohit', 'Karan', 'Vikram', 'Suresh', 'Deepak', 'Rajesh', 'Anil', 'Manoj', 'Sameer', 'Rahul', 'Vishal', 'Nikhil', 'Ajay'];
const femaleNames = ['Priya', 'Kavitha', 'Anjali', 'Neha', 'Rekha', 'Sunita'];
const areas = ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'MG Road', 'Marathahalli', 'Electronic City', 'Malleshwaram', 'BTM Layout', 'JP Nagar', 'Basavanagudi', 'Rajajinagar', 'Hebbal', 'Yelahanka', 'Banashankari', 'Vijayanagar', 'RT Nagar', 'Sahakarnagar', 'Bannerghatta Road'];

function generateProfessional(index: number): Professional {
  const isFemale = index >= 14;
  const name = isFemale ? femaleNames[index - 14] : maleNames[index];
  const levels: ('STANDARD' | 'PRO' | 'ELITE')[] = ['STANDARD', 'PRO', 'ELITE'];
  const level = levels[index % 3];
  const presence: ('STANDARD' | 'LARGE' | 'HIGH')[] = ['STANDARD', 'LARGE', 'HIGH'];
  const loc = offsetLocation(BENGALURU_CENTER.lat, BENGALURU_CENTER.lng, 8);
  const area = areas[index % areas.length];

  const specializations: ServicePurpose[] = [];
  const allPurposes: ServicePurpose[] = ['womens_safety', 'personal_protection', 'night_out', 'party_club', 'college_event', 'wedding', 'crowd_management', 'vip_protection', 'venue_security'];
  for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
    const p = allPurposes[Math.floor(Math.random() * allPurposes.length)];
    if (!specializations.includes(p)) specializations.push(p);
  }

  return {
    id: `prof_${index + 1}`,
    code: `BT-${100 + index + 1}`,
    name,
    gender: isFemale ? 'Female' : 'Male',
    profilePhoto: `/api/placeholder/96/96`,
    level,
    rating: +(4.2 + Math.random() * 0.8).toFixed(1),
    completedBookings: 50 + Math.floor(Math.random() * 400),
    experience: `${1 + Math.floor(Math.random() * 8)} years`,
    specializations,
    languages: ['Hindi', 'English', 'Kannada'].slice(0, 2 + Math.floor(Math.random() * 2)),
    hourlyRate: level === 'STANDARD' ? 500 : level === 'PRO' ? 800 : 1200,
    isOnline: Math.random() > 0.3,
    isVerified: Math.random() > 0.15,
    location: { lat: loc.lat, lng: loc.lng, address: `${area}, Bengaluru`, shortAddress: area },
    availability: Math.random() > 0.3 ? 'available' : Math.random() > 0.5 ? 'busy' : 'offline',
    acceptanceRate: +(75 + Math.random() * 25).toFixed(0) as unknown as number,
    physicalPresence: presence[index % 3],
  };
}

export const MOCK_PROFESSIONALS: Professional[] = Array.from({ length: 20 }, (_, i) => generateProfessional(i));

// ---- Mock Customers (10) ----

const customerNames = ['Aarav Sharma', 'Ishaan Patel', 'Diya Nair', 'Riya Reddy', 'Vivaan Kumar', 'Ananya Gupta', 'Aditya Joshi', 'Sara Khan', 'Kabir Singh', 'Meera Iyer'];

export const MOCK_CUSTOMERS: Customer[] = customerNames.map((name, i) => ({
  id: `cust_${i + 1}`,
  name,
  phone: `+91 98${String(76500000 + i * 1111).padStart(8, '0')}`,
  email: `${name.split(' ')[0].toLowerCase()}@email.com`,
  savedLocations: [],
  emergencyContact: { name: 'Emergency Contact', phone: '+91 9999999999' },
  createdAt: new Date(2025, 5 + Math.floor(i / 3), 10 + i).toISOString(),
}));

// ---- Mock Bookings ----

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book_1',
    customerId: 'cust_1',
    request: {
      purpose: 'womens_safety',
      purposeLabel: "Women's Safety",
      count: 2,
      level: 'PRO',
      presence: 'STANDARD',
      genderPreference: 'FEMALE',
      location: { lat: 12.9784, lng: 77.6408, address: 'Indiranagar, Bengaluru', shortAddress: 'Indiranagar' },
      date: '2026-09-10',
      startTime: '20:00',
      duration: 3,
      endTime: '23:00',
    },
    status: 'COMPLETED',
    pricing: { level: 'PRO', baseRate: 800, count: 2, duration: 3, subtotal: 4800, platformFee: 400, total: 5200 },
    responses: [],
    team: [MOCK_PROFESSIONALS[14], MOCK_PROFESSIONALS[15]],
    createdAt: '2026-08-20T14:30:00Z',
    confirmedAt: '2026-08-20T14:35:00Z',
    completedAt: '2026-08-20T23:05:00Z',
    rating: { id: 'r1', bookingId: 'book_1', fromCustomer: true, overall: 5, professionalism: 5, punctuality: 5, behaviour: 5, communication: 4, createdAt: '2026-08-21T00:00:00Z' },
  },
  {
    id: 'book_2',
    customerId: 'cust_2',
    request: {
      purpose: 'party_club',
      purposeLabel: 'Party / Club',
      count: 4,
      level: 'STANDARD',
      presence: 'LARGE',
      genderPreference: 'MALE',
      location: { lat: 12.9352, lng: 77.6245, address: 'Koramangala, Bengaluru', shortAddress: 'Koramangala' },
      date: '2026-09-05',
      startTime: '21:00',
      duration: 5,
      endTime: '02:00',
    },
    status: 'COMPLETED',
    pricing: { level: 'STANDARD', baseRate: 500, count: 4, duration: 5, subtotal: 10000, platformFee: 800, total: 10800 },
    responses: [],
    team: [MOCK_PROFESSIONALS[0], MOCK_PROFESSIONALS[1], MOCK_PROFESSIONALS[3], MOCK_PROFESSIONALS[6]],
    createdAt: '2026-08-25T18:00:00Z',
    confirmedAt: '2026-08-25T18:08:00Z',
    completedAt: '2026-08-26T02:10:00Z',
  },
  {
    id: 'book_3',
    customerId: 'cust_3',
    request: {
      purpose: 'college_event',
      purposeLabel: 'College Event',
      count: 6,
      level: 'STANDARD',
      presence: 'STANDARD',
      genderPreference: 'MIXED',
      location: { lat: 12.9698, lng: 77.7500, address: 'Whitefield, Bengaluru', shortAddress: 'Whitefield' },
      date: '2026-09-15',
      startTime: '10:00',
      duration: 8,
      endTime: '18:00',
    },
    status: 'CONFIRMED',
    pricing: { level: 'STANDARD', baseRate: 500, count: 6, duration: 8, subtotal: 24000, platformFee: 1920, total: 25920 },
    responses: [],
    team: [MOCK_PROFESSIONALS[2], MOCK_PROFESSIONALS[4], MOCK_PROFESSIONALS[7], MOCK_PROFESSIONALS[9], MOCK_PROFESSIONALS[14], MOCK_PROFESSIONALS[16]],
    createdAt: '2026-09-01T10:00:00Z',
    confirmedAt: '2026-09-01T10:12:00Z',
  },
];

// ---- Mock Notifications ----

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', userId: 'cust_1', type: 'booking_confirmed', title: 'Team Confirmed!', message: 'Your team of 2 bouncers is confirmed for Sep 10.', read: false, createdAt: '2026-09-01T12:00:00Z', bookingId: 'book_1' },
  { id: 'n2', userId: 'cust_1', type: 'bouncer_accepted', title: 'Bouncer Accepted', message: 'Priya (PRO) has accepted your booking request.', read: true, createdAt: '2026-08-20T14:32:00Z', bookingId: 'book_1' },
  { id: 'n3', userId: 'cust_1', type: 'booking_completed', title: 'Booking Completed', message: 'Your booking has been completed. Rate your experience!', read: true, createdAt: '2026-08-20T23:05:00Z', bookingId: 'book_1' },
  { id: 'n4', userId: 'prof_1', type: 'new_request', title: 'New Request!', message: 'New booking request for Party/Club at Koramangala.', read: false, createdAt: '2026-09-01T18:00:00Z', bookingId: 'book_2' },
  { id: 'n5', userId: 'prof_1', type: 'payment_credited', title: 'Payment Credited', message: '₹2,500 has been credited to your wallet.', read: true, createdAt: '2026-08-26T08:00:00Z' },
];

// ---- Admin Stats ----

export const ADMIN_STATS = {
  totalBookings: 1284,
  activeBouncers: 243,
  onlineNow: 87,
  revenue: 1240000,
  averageRating: 4.8,
  cancellationRate: 3.2,
  pendingVerifications: 12,
  totalUsers: 856,
  totalRequests: 2150,
  acceptedRequests: 1687,
  rejectedRequests: 463,
  incidents: 3,
};

// ---- Helper: Get Purpose Label ----

export function getPurposeLabel(purpose: ServicePurpose): string {
  return SERVICE_OPTIONS.find(s => s.id === purpose)?.title ?? 'Other';
}
