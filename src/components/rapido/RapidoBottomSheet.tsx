'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Calendar,
  Shield,
  Zap,
  Star,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  X,
  XCircle,
  Radio,
} from 'lucide-react';
import { SERVICE_OPTIONS, MOCK_PROFESSIONALS } from '@/lib/mock-data';
import { calculatePrice, formatPrice } from '@/lib/price-calculator';
import { MaleBouncerAvatar, FemaleBouncerAvatar, MixedTeamAvatar } from '@/components/ui/BouncerAvatars';
import RatingModal from '@/components/rating/RatingModal';
import { ServicePurpose, ProfessionalLevel, GenderPreference, Professional } from '@/lib/types';

export type RapidoSheetState = 'BOOKING' | 'MATCHING' | 'CONFIRMED' | 'COMPLETED';

const QUICK_LOCATIONS = [
  { name: 'Indiranagar', address: '100ft Road, Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala', address: '4th Block, Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Church Street', address: 'Church Street / Brigade Rd, Bengaluru', lat: 12.9748, lng: 77.6045 },
  { name: 'Whitefield', address: 'ITPL Main Road, Whitefield, Bengaluru', lat: 12.9698, lng: 77.7500 },
  { name: 'HSR Layout', address: '27th Main, Sector 1, HSR Layout, Bengaluru', lat: 12.9116, lng: 77.6389 },
];

interface RapidoBottomSheetProps {
  sheetState: RapidoSheetState;
  setSheetState: (state: RapidoSheetState) => void;
  location: { lat: number; lng: number; address: string };
  onLocationChange: (loc: { lat: number; lng: number; address: string }) => void;
  assignedTeam: Professional[];
  setAssignedTeam: (team: Professional[]) => void;
}

export default function RapidoBottomSheet({
  sheetState,
  setSheetState,
  location,
  onLocationChange,
  assignedTeam,
  setAssignedTeam,
}: RapidoBottomSheetProps) {
  // Booking Config
  const [selectedPurpose, setSelectedPurpose] = useState<ServicePurpose>('womens_safety');
  const [bouncerCount, setBouncerCount] = useState<number>(2);
  const [selectedLevel, setSelectedLevel] = useState<ProfessionalLevel>('PRO');
  const [selectedGender, setSelectedGender] = useState<GenderPreference>('FEMALE');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [scheduleType, setScheduleType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return d.toISOString().slice(0, 16);
  });

  // Search Address Dropdown
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(location.address);

  // Live Matching Simulation Ticker
  const [notifiedCount, setNotifiedCount] = useState(18);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Calculate live dynamic price
  const pricing = calculatePrice(selectedLevel, bouncerCount, durationHours, 'STANDARD');

  // Real-time Matching Simulator when state is 'MATCHING'
  useEffect(() => {
    if (sheetState !== 'MATCHING') return;

    setAcceptedCount(0);
    setRejectedCount(0);

    const matchCandidates = MOCK_PROFESSIONALS.filter(
      (p) => selectedGender === 'ANY' || (selectedGender === 'FEMALE' ? p.gender === 'Female' : p.gender === 'Male')
    ).slice(0, 8);

    const timers: NodeJS.Timeout[] = [];

    // Simulate 1st response after 1.5s
    timers.push(
      setTimeout(() => {
        setAcceptedCount(1);
      }, 1500)
    );

    // Simulate reject after 2.5s
    timers.push(
      setTimeout(() => {
        setRejectedCount(1);
      }, 2500)
    );

    // Simulate final accept to meet requirement after 4s
    timers.push(
      setTimeout(() => {
        const teamToAssign = matchCandidates.slice(0, bouncerCount);
        setAcceptedCount(bouncerCount);
        setAssignedTeam(teamToAssign.length > 0 ? teamToAssign : MOCK_PROFESSIONALS.slice(0, bouncerCount));
        setSheetState('CONFIRMED');
      }, 4000)
    );

    return () => timers.forEach(clearTimeout);
  }, [sheetState, bouncerCount, selectedGender, setAssignedTeam, setSheetState]);

  const handleStartBooking = () => {
    setSheetState('MATCHING');
  };

  const handleCancelBooking = () => {
    setSheetState('BOOKING');
    setAssignedTeam([]);
  };

  const handleCompleteRide = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    setSheetState('BOOKING');
    setAssignedTeam([]);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-3 pb-3 sm:pb-5">
        <div className="bg-[#12141a]/95 border border-[#262c38] rounded-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden transition-all duration-300">
          
          {/* ========================================================= */}
          {/* STATE 1: RAPIDO DIRECT CUSTOMER BOOKING FORM              */}
          {/* ========================================================= */}
          {sheetState === 'BOOKING' && (
            <div className="p-4 sm:p-5 max-h-[82vh] overflow-y-auto scrollbar-thin">
              
              {/* Top Handle / Bar */}
              <div className="w-12 h-1.5 bg-[#323b4d] rounded-full mx-auto mb-3" />

              {/* 1. SERVICE ADDRESS SEARCH BAR (Rapido "Where are you heading?" style) */}
              <div className="relative mb-3">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#1a1f2c] border border-[#2e3748] focus-within:border-bot-gold transition-colors">
                  <MapPin className="w-5 h-5 text-bot-gold flex-shrink-0" />
                  <input
                    type="text"
                    value={searchText}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setSearchOpen(true);
                    }}
                    placeholder="Where do you need protection in Bengaluru?"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-white placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="p-1 text-bot-text-secondary hover:text-white"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Hotspot suggestions dropdown */}
                {searchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#171b26] border border-bot-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
                    <div className="p-2 border-b border-bot-border text-[10px] font-bold text-bot-gold uppercase tracking-wider">
                      Popular Bengaluru Venues & Hubs
                    </div>
                    {QUICK_LOCATIONS.map((q) => (
                      <button
                        key={q.name}
                        onClick={() => {
                          onLocationChange(q);
                          setSearchText(q.address);
                          setSearchOpen(false);
                        }}
                        className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-bot-elevated text-left text-xs border-b border-bot-border/50 last:border-0"
                      >
                        <MapPin className="w-3.5 h-3.5 text-bot-gold" />
                        <div>
                          <div className="font-bold text-white">{q.name}</div>
                          <div className="text-[10px] text-gray-400">{q.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. SERVICE PURPOSE HORIZONTAL SCROLL CHIPS */}
              <div className="mb-3.5">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {SERVICE_OPTIONS.map((srv) => {
                    const isSelected = selectedPurpose === srv.id;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedPurpose(srv.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-bot-gold to-bot-gold-dark text-black shadow-md shadow-bot-gold/30'
                            : 'bg-[#181d29] border border-[#283142] text-gray-300 hover:text-white'
                        }`}
                      >
                        <Shield className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-bot-gold'}`} />
                        <span>{srv.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. TEAM PREFERENCE WITH MALE / FEMALE / MIXED CUSTOM AVATARS */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Choose Protection Squad
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Male Bouncer Card */}
                  <button
                    onClick={() => setSelectedGender('MALE')}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      selectedGender === 'MALE'
                        ? 'bg-bot-gold/15 border-bot-gold shadow-md shadow-bot-gold/20 scale-[1.02]'
                        : 'bg-[#181d29] border-[#283142] hover:border-bot-gold/40'
                    }`}
                  >
                    <MaleBouncerAvatar className="w-12 h-12 mb-1" />
                    <span className="text-[11px] font-black text-white">Male Team</span>
                    <span className="text-[9px] text-gray-400">High Presence</span>
                  </button>

                  {/* Female Bouncer Card */}
                  <button
                    onClick={() => setSelectedGender('FEMALE')}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      selectedGender === 'FEMALE'
                        ? 'bg-bot-gold/15 border-bot-gold shadow-md shadow-bot-gold/20 scale-[1.02]'
                        : 'bg-[#181d29] border-[#283142] hover:border-bot-gold/40'
                    }`}
                  >
                    <FemaleBouncerAvatar className="w-12 h-12 mb-1" />
                    <span className="text-[11px] font-black text-white">Female Team</span>
                    <span className="text-[9px] text-bot-gold font-bold">Women Safety</span>
                  </button>

                  {/* Mixed Team Card */}
                  <button
                    onClick={() => setSelectedGender('MIXED')}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      selectedGender === 'MIXED'
                        ? 'bg-bot-gold/15 border-bot-gold shadow-md shadow-bot-gold/20 scale-[1.02]'
                        : 'bg-[#181d29] border-[#283142] hover:border-bot-gold/40'
                    }`}
                  >
                    <MixedTeamAvatar className="w-12 h-12 mb-1" />
                    <span className="text-[11px] font-black text-white">Mixed Squad</span>
                    <span className="text-[9px] text-gray-400">Tactical Duo</span>
                  </button>
                </div>
              </div>

              {/* 4. PROFESSIONAL TIERS & HOURLY RATES */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Security Level
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { level: 'STANDARD' as ProfessionalLevel, title: 'Standard', rate: 500 },
                    { level: 'PRO' as ProfessionalLevel, title: 'Pro Fighter', rate: 800, tag: 'MOST POPULAR' },
                    { level: 'ELITE' as ProfessionalLevel, title: 'Elite VIP', rate: 1200 },
                  ].map((t) => {
                    const active = selectedLevel === t.level;
                    return (
                      <button
                        key={t.level}
                        onClick={() => setSelectedLevel(t.level)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          active
                            ? 'bg-bot-gold/15 border-bot-gold shadow-sm'
                            : 'bg-[#181d29] border-[#283142] text-gray-400'
                        }`}
                      >
                        {t.tag && (
                          <span className="absolute -top-2 right-1 px-1.5 py-0.2 rounded bg-bot-gold text-black text-[8px] font-black">
                            {t.tag}
                          </span>
                        )}
                        <div className="text-xs font-bold text-white">{t.title}</div>
                        <div className="text-sm font-black text-bot-gold mt-0.5">₹{t.rate}<span className="text-[9px] font-normal text-gray-400">/hr</span></div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. TEAM SIZE & DURATION STEPPERS (MIN 1 HOUR) */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {/* Count Stepper */}
                <div className="p-2.5 rounded-xl bg-[#181d29] border border-[#283142] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">Bouncers:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBouncerCount(Math.max(1, bouncerCount - 1))}
                      className="w-6 h-6 rounded bg-[#252c3d] text-white font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-white">{bouncerCount}</span>
                    <button
                      onClick={() => setBouncerCount(Math.min(10, bouncerCount + 1))}
                      className="w-6 h-6 rounded bg-[#252c3d] text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Duration Stepper */}
                <div className="p-2.5 rounded-xl bg-[#181d29] border border-[#283142] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">Duration:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                      className="w-6 h-6 rounded bg-[#252c3d] text-white font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-white">{durationHours}h</span>
                    <button
                      onClick={() => setDurationHours(Math.min(12, durationHours + 1))}
                      className="w-6 h-6 rounded bg-[#252c3d] text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. TIMING: ASAP (10m) OR GOOGLE CALENDAR / TIME POPUP */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScheduleType('asap')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      scheduleType === 'asap'
                        ? 'bg-bot-gold/15 border-bot-gold text-bot-gold'
                        : 'bg-[#181d29] border-[#283142] text-gray-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" /> Book for Now (10m)
                  </button>

                  <button
                    onClick={() => setScheduleType('scheduled')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      scheduleType === 'scheduled'
                        ? 'bg-bot-gold/15 border-bot-gold text-bot-gold'
                        : 'bg-[#181d29] border-[#283142] text-gray-400'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" /> Schedule Later
                  </button>
                </div>

                {scheduleType === 'scheduled' && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#181d29] border border-bot-gold/30">
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full bg-transparent text-xs text-white font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* BIG RAPIDO BOOKING ACTION BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleStartBooking}
                  className="w-full py-4 rounded-2xl btn-neon-gold text-sm font-black uppercase tracking-wider flex items-center justify-between px-5"
                >
                  <div className="flex items-center gap-2 text-black">
                    <Zap className="w-5 h-5 fill-black" />
                    <span>BOOK BOUNCERS NOW</span>
                  </div>
                  <span className="text-base font-black text-black">
                    {formatPrice(pricing.total)}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 2: RAPIDO LIVE RADAR MATCHING TICKER                */}
          {/* ========================================================= */}
          {sheetState === 'MATCHING' && (
            <div className="p-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-bot-gold/15 border-2 border-bot-gold flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
                <Radio className="w-8 h-8 text-bot-gold animate-spin" />
              </div>

              <h3 className="text-xl font-black text-white mb-1">
                Pinging Available Bouncers...
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                Notifying top-rated {selectedGender.toLowerCase()} security professionals within 5 km of {location.address.split(',')[0]}
              </p>

              {/* Live Acceptance Meter */}
              <div className="p-4 rounded-2xl bg-[#181d29] border border-[#283142] mb-5 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Team Target:</span>
                  <span className="text-bot-gold">{acceptedCount} / {bouncerCount} Confirmed</span>
                </div>
                <div className="h-2.5 bg-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bot-gold to-bot-success rounded-full transition-all duration-500"
                    style={{ width: `${(acceptedCount / bouncerCount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                  <span>● 18 Pings Dispatched</span>
                  <span className="text-bot-success">✓ {acceptedCount} Accepted</span>
                  <span className="text-bot-danger">✕ {rejectedCount} Declined</span>
                </div>
              </div>

              <button
                onClick={handleCancelBooking}
                className="w-full py-3 rounded-xl bg-[#252b3b] text-gray-300 hover:text-white text-xs font-bold"
              >
                Cancel Search
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: ASSIGNED TEAM EN ROUTE & ACTIVE TRACKING         */}
          {/* ========================================================= */}
          {sheetState === 'CONFIRMED' && (
            <div className="p-5 max-h-[82vh] overflow-y-auto scrollbar-thin animate-fade-in">
              <div className="w-12 h-1.5 bg-[#323b4d] rounded-full mx-auto mb-3" />

              {/* En Route Header Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-bot-success/15 border border-bot-success/40 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-bot-success animate-ping" />
                  <div>
                    <div className="text-xs font-black text-bot-success uppercase">Protection Squad En Route</div>
                    <div className="text-[11px] text-gray-300">Arriving at venue in <span className="text-white font-bold">~6 mins</span></div>
                  </div>
                </div>
                {/* Security PIN code for starting assignment */}
                <div className="px-3 py-1.5 rounded-xl bg-black border border-bot-border text-center">
                  <span className="text-[8px] uppercase text-gray-400 block font-bold">Start PIN</span>
                  <span className="text-sm font-black text-bot-gold tracking-widest">4892</span>
                </div>
              </div>

              {/* Assigned Captains List */}
              <div className="space-y-2.5 mb-4">
                {assignedTeam.map((captain, idx) => (
                  <div key={captain.id} className="p-3 rounded-2xl bg-[#181d29] border border-[#283142] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {captain.gender === 'Female' ? (
                        <FemaleBouncerAvatar className="w-12 h-12" />
                      ) : (
                        <MaleBouncerAvatar className="w-12 h-12" />
                      )}
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{captain.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-bot-gold/20 text-bot-gold text-[9px] font-bold">
                            {captain.level}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {captain.code} • {captain.rating} ★ • {captain.experience}
                        </div>
                      </div>
                    </div>

                    <a
                      href="tel:+919876543210"
                      className="w-9 h-9 rounded-xl bg-bot-elevated border border-bot-gold/40 text-bot-gold flex items-center justify-center hover:bg-bot-gold hover:text-black transition-colors"
                      title="Call Captain"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Active Assignment CTAs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCompleteRide}
                  className="py-3.5 rounded-xl btn-neon-gold text-xs font-black uppercase text-center"
                >
                  End & Leave 5★ Rating
                </button>

                <a
                  href="tel:112"
                  className="py-3.5 rounded-xl bg-bot-danger/20 border border-bot-danger text-bot-danger hover:bg-bot-danger hover:text-white text-xs font-black flex items-center justify-center gap-1.5 text-center transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> Panic SOS
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post-Booking Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        bouncersCount={bouncerCount}
      />
    </>
  );
}
