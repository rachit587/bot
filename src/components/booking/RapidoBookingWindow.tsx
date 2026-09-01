'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Shield,
  Zap,
  Star,
  Users,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle2,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { useBookingStore } from '@/stores/booking-store';
import { SERVICE_OPTIONS, MOCK_PROFESSIONALS } from '@/lib/mock-data';
import { calculatePrice, formatPrice } from '@/lib/price-calculator';
import { MaleBouncerAvatar, FemaleBouncerAvatar, MixedTeamAvatar } from '@/components/ui/BouncerAvatars';
import { ServicePurpose, ProfessionalLevel, GenderPreference, PhysicalPresence } from '@/lib/types';

const POPULAR_AREAS = [
  { name: 'Indiranagar', address: 'Indiranagar 100ft Road, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala', address: 'Koramangala 4th Block, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', address: 'ITPL Main Road, Whitefield, Bengaluru', lat: 12.9698, lng: 77.7500 },
  { name: 'HSR Layout', address: '27th Main Rd, HSR Layout, Bengaluru', lat: 12.9116, lng: 77.6389 },
  { name: 'MG Road / Brigade', address: 'MG Road Metro Station, Bengaluru', lat: 12.9756, lng: 77.6067 },
];

export default function RapidoBookingWindow() {
  const router = useRouter();
  const store = useBookingStore();

  // Local form states with smart defaults
  const [selectedPurpose, setSelectedPurpose] = useState<ServicePurpose>('womens_safety');
  const [teamCount, setTeamCount] = useState<number>(2);
  const [selectedLevel, setSelectedLevel] = useState<ProfessionalLevel>('PRO');
  const [selectedGender, setSelectedGender] = useState<GenderPreference>('FEMALE');
  const [scheduleType, setScheduleType] = useState<'asap' | 'scheduled'>('asap');
  const [durationHours, setDurationHours] = useState<number>(2);

  // Address and Map location
  const [addressQuery, setAddressQuery] = useState('Indiranagar 100ft Road, Bengaluru');
  const [currentCoords, setCurrentCoords] = useState({ lat: 12.9784, lng: 77.6408 });
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Date & Time (Google Calendar / Native Picker format)
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toISOString().slice(0, 16);
  });

  // Calculate dynamic price
  const pricing = calculatePrice(selectedLevel, teamCount, durationHours, 'STANDARD');

  // Handle GPS location
  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });
          setAddressQuery(`Current GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setIsLocating(false);
        },
        () => {
          // Fallback
          setCurrentCoords(POPULAR_AREAS[0]);
          setAddressQuery(POPULAR_AREAS[0].address);
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleStartMatching = () => {
    // Save to global store
    const purposeObj = SERVICE_OPTIONS.find((s) => s.id === selectedPurpose);
    store.setPurpose(selectedPurpose, purposeObj?.title || "Women's Safety");
    store.setCount(teamCount);
    store.setLevel(selectedLevel);
    store.setGenderPreference(selectedGender);
    store.setLocation({
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      address: addressQuery,
      shortAddress: addressQuery.split(',')[0],
    });
    store.setDuration(durationHours);
    store.setStartTime(scheduleType === 'asap' ? 'Immediate (15m)' : scheduledDateTime.slice(11));
    store.setDate(scheduleType === 'asap' ? new Date().toISOString().split('T')[0] : scheduledDateTime.slice(0, 10));
    store.setBookingStatus('SEARCHING');

    // Go directly to live acceptance radar
    router.push('/book/live');
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT / MOBILE TOP: DIRECT BOOKING WINDOW (Rapido / Uber Card Style) */}
      <div className="lg:col-span-7 bg-bot-card/95 border border-bot-border rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bot-gold-bright via-bot-gold to-bot-gold-dark" />

        {/* Header with BOT badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-24">
              <Image src="/logo.png" alt="BOT" fill className="object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-bot-gold uppercase block">Instant Dispatch</span>
              <h2 className="text-lg sm:text-xl font-black text-bot-white leading-tight">Direct Booking Window</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bot-success/15 border border-bot-success/30 text-bot-success text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-bot-success animate-pulse" />
            18 Online Near You
          </div>
        </div>

        {/* 1. SERVICE PURPOSE (Horizontal Scrollable Chips) */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-bot-text-secondary mb-2">
            1. Why do you need backup?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = selectedPurpose === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedPurpose(service.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-bot-gold-neon to-bot-gold text-bot-bg shadow-md shadow-bot-gold/20 scale-[1.02]'
                      : 'bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-white'
                  }`}
                >
                  <Shield className={`w-3.5 h-3.5 ${isSelected ? 'text-bot-bg' : 'text-bot-gold'}`} />
                  <span>{service.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PICK TEAM PREFERENCE (Custom Illustrated Avatars: Male / Female / Mixed) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-bot-text-secondary">
              2. Preferred Team & Stature
            </label>
            <span className="text-[10px] text-bot-gold font-semibold">Verified Professionals</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Male Bouncer Card */}
            <button
              onClick={() => setSelectedGender('MALE')}
              className={`p-3 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center ${
                selectedGender === 'MALE'
                  ? 'bg-bot-gold/15 border-bot-gold shadow-lg shadow-bot-gold/15 scale-[1.02]'
                  : 'bg-bot-elevated/70 border-bot-border hover:border-bot-gold/40'
              }`}
            >
              <MaleBouncerAvatar className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />
              <span className={`text-xs font-black block ${selectedGender === 'MALE' ? 'text-bot-gold' : 'text-bot-white'}`}>
                Male Bouncers
              </span>
              <span className="text-[10px] text-bot-text-secondary">High Presence • Buff</span>
            </button>

            {/* Female Bouncer Card */}
            <button
              onClick={() => setSelectedGender('FEMALE')}
              className={`p-3 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center ${
                selectedGender === 'FEMALE'
                  ? 'bg-bot-gold/15 border-bot-gold shadow-lg shadow-bot-gold/15 scale-[1.02]'
                  : 'bg-bot-elevated/70 border-bot-border hover:border-bot-gold/40'
              }`}
            >
              <FemaleBouncerAvatar className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />
              <span className={`text-xs font-black block ${selectedGender === 'FEMALE' ? 'text-bot-gold' : 'text-bot-white'}`}>
                Female Bouncers
              </span>
              <span className="text-[10px] text-bot-gold font-bold">Women Safety Special</span>
            </button>

            {/* Mixed Team Card */}
            <button
              onClick={() => setSelectedGender('MIXED')}
              className={`p-3 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center ${
                selectedGender === 'MIXED'
                  ? 'bg-bot-gold/15 border-bot-gold shadow-lg shadow-bot-gold/15 scale-[1.02]'
                  : 'bg-bot-elevated/70 border-bot-border hover:border-bot-gold/40'
              }`}
            >
              <MixedTeamAvatar className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />
              <span className={`text-xs font-black block ${selectedGender === 'MIXED' ? 'text-bot-gold' : 'text-bot-white'}`}>
                Mixed Squad
              </span>
              <span className="text-[10px] text-bot-text-secondary">Balanced Duo</span>
            </button>
          </div>
        </div>

        {/* 3. TIER LEVEL & RATES (Standard, Pro, Elite) */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-bot-text-secondary mb-2">
            3. Professional Tier & Hourly Rates
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { level: 'STANDARD' as ProfessionalLevel, name: 'Standard', rate: 500, desc: 'Everyday Presence' },
              { level: 'PRO' as ProfessionalLevel, name: 'Pro Fighter', rate: 800, desc: 'Ex-Military / Certified', tag: 'POPULAR' },
              { level: 'ELITE' as ProfessionalLevel, name: 'Elite Guard', rate: 1200, desc: 'VIP Armed/Tactical' },
            ].map((t) => {
              const active = selectedLevel === t.level;
              return (
                <button
                  key={t.level}
                  onClick={() => setSelectedLevel(t.level)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative ${
                    active
                      ? 'bg-bot-gold/15 border-bot-gold shadow-md shadow-bot-gold/10'
                      : 'bg-bot-elevated border-bot-border hover:border-bot-gold/30'
                  }`}
                >
                  {t.tag && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-bot-gold text-bot-bg font-black text-[9px]">
                      {t.tag}
                    </span>
                  )}
                  <div className="text-xs font-bold text-bot-white">{t.name}</div>
                  <div className="text-sm sm:text-base font-black text-bot-gold mt-0.5">₹{t.rate}<span className="text-[10px] font-normal text-bot-text-secondary">/hr</span></div>
                  <div className="text-[10px] text-bot-text-secondary truncate mt-0.5">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. QUANTITY & DURATION STEPPERS (Minimum 1 Hour) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Bouncer Count */}
          <div className="p-3 rounded-xl bg-bot-elevated border border-bot-border">
            <span className="text-[10px] font-bold uppercase text-bot-text-secondary block mb-1">
              Number of Bouncers
            </span>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTeamCount(Math.max(1, teamCount - 1))}
                className="w-8 h-8 rounded-lg bg-bot-card hover:bg-bot-border text-bot-white font-black text-base flex items-center justify-center"
              >
                -
              </button>
              <span className="text-base font-extrabold text-bot-white flex items-center gap-1">
                <Users className="w-4 h-4 text-bot-gold" /> {teamCount}
              </span>
              <button
                onClick={() => setTeamCount(Math.min(10, teamCount + 1))}
                className="w-8 h-8 rounded-lg bg-bot-card hover:bg-bot-border text-bot-white font-black text-base flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Duration (Min 1 hr) */}
          <div className="p-3 rounded-xl bg-bot-elevated border border-bot-border">
            <span className="text-[10px] font-bold uppercase text-bot-text-secondary block mb-1">
              Duration (Min 1 hr)
            </span>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                className="w-8 h-8 rounded-lg bg-bot-card hover:bg-bot-border text-bot-white font-black text-base flex items-center justify-center"
              >
                -
              </button>
              <span className="text-base font-extrabold text-bot-white flex items-center gap-1">
                <Clock className="w-4 h-4 text-bot-gold" /> {durationHours} hr{durationHours > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setDurationHours(Math.min(12, durationHours + 1))}
                className="w-8 h-8 rounded-lg bg-bot-card hover:bg-bot-border text-bot-white font-black text-base flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 5. LOCATION (Google Maps / Address Search & Current GPS) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-bot-text-secondary">
              5. Service Address (Where to dispatch?)
            </label>
            <button
              onClick={handleGetLocation}
              className="text-[11px] text-bot-gold font-bold flex items-center gap-1 hover:underline"
            >
              <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Locating...' : 'Locate Me (GPS)'}
            </button>
          </div>

          <div className="relative mb-2">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bot-gold" />
            <input
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder="Search venue or address in Bengaluru..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-xs sm:text-sm text-bot-white font-medium focus:border-bot-gold focus:outline-none"
            />
          </div>

          {/* Popular Fast Pills */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_AREAS.slice(0, 4).map((area) => (
              <button
                key={area.name}
                onClick={() => {
                  setAddressQuery(area.address);
                  setCurrentCoords({ lat: area.lat, lng: area.lng });
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  addressQuery.includes(area.name)
                    ? 'bg-bot-gold text-bot-bg'
                    : 'bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-white'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        {/* 6. FLEXIBLE TIMING (ASAP or Google Calendar Native Picker) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-bot-text-secondary">
              6. Timing & Schedule
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setScheduleType('asap')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                scheduleType === 'asap'
                  ? 'bg-bot-gold/15 border-bot-gold text-bot-gold'
                  : 'bg-bot-elevated border-bot-border text-bot-text-secondary'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Book for Now (10-15m)
            </button>

            <button
              onClick={() => setScheduleType('scheduled')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                scheduleType === 'scheduled'
                  ? 'bg-bot-gold/15 border-bot-gold text-bot-gold'
                  : 'bg-bot-elevated border-bot-border text-bot-text-secondary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule Later
            </button>
          </div>

          {scheduleType === 'scheduled' && (
            <div className="p-3 rounded-xl bg-bot-elevated border border-bot-gold/30 animate-fade-in">
              <label className="block text-[10px] font-bold text-bot-gold mb-1">
                Select Date & Time (Calendar Popup):
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bot-card border border-bot-border text-bot-white text-xs font-semibold focus:border-bot-gold focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* BOTTOM STICKY ACTION BAR: LIVE PRICE & BIG RAPIDO BUTTON */}
        <div className="pt-4 border-t border-bot-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-bot-text-secondary">Total Estimated Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gradient-gold">
                {formatPrice(pricing.total)}
              </span>
              <span className="text-xs text-bot-text-secondary">
                ({teamCount} {selectedLevel.toLowerCase()} × {durationHours}h + 8% fee)
              </span>
            </div>
          </div>

          <button
            onClick={handleStartMatching}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-neon-gold text-sm sm:text-base font-black flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-bot-bg" />
            FIND BOUNCERS NOW
          </button>
        </div>
      </div>

      {/* RIGHT / DESKTOP MAP: INTERACTIVE LIVE RADAR MAP PREVIEW */}
      <div className="lg:col-span-5 h-80 lg:h-[720px] rounded-3xl bg-bot-card border border-bot-border overflow-hidden relative shadow-2xl flex flex-col">
        {/* Map Header Status */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="glass-surface px-3 py-1.5 rounded-full border border-bot-border flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bot-gold animate-pulse" />
            <span className="text-xs font-bold text-bot-white">Live Bouncer Radar Mesh</span>
          </div>
          <div className="glass-surface px-3 py-1.5 rounded-full border border-bot-border text-[11px] font-bold text-bot-gold">
            Radius: 5 km
          </div>
        </div>

        {/* Interactive Map Visual Grid */}
        <div className="flex-1 relative bg-bot-elevated">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
            <defs>
              <pattern id="rapido-grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M 45 0 L 0 0 0 45" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rapido-grid)" />
          </svg>

          {/* Concentric Radar Rings around selected location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-bot-gold/20 animate-pulse-gold pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-bot-gold/30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-bot-gold/5 border border-bot-gold/40 pointer-events-none" />

          {/* Center Target Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-bot-gold-neon to-bot-gold text-bot-bg flex items-center justify-center font-black shadow-2xl shadow-bot-gold/60 animate-bounce-in">
              <MapPin className="w-6 h-6 fill-bot-bg stroke-bot-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-bot-card/95 border border-bot-gold text-[10px] font-extrabold text-bot-white mt-1 shadow-lg whitespace-nowrap">
              {addressQuery.split(',')[0]}
            </div>
          </div>

          {/* Nearby Live Bouncers Dots (Male & Female with realistic offsets) */}
          {MOCK_PROFESSIONALS.slice(0, 10).map((b, idx) => (
            <div
              key={b.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer group"
              style={{
                left: `${20 + (idx * 17) % 65}%`,
                top: `${18 + (idx * 23) % 65}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-bot-card border border-bot-gold text-bot-gold flex items-center justify-center text-[10px] font-bold shadow-md shadow-bot-gold/20">
                  {b.gender === 'Female' ? '♀' : '♂'}
                </div>
                <div className="hidden group-hover:block absolute bottom-8 bg-bot-card border border-bot-border p-2 rounded-lg text-xs whitespace-nowrap z-30 shadow-2xl">
                  <div className="font-bold text-bot-white">{b.name} ({b.level})</div>
                  <div className="text-[10px] text-bot-gold">{b.rating} ★ • {b.experience}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Floating Map Details */}
          <div className="absolute bottom-4 left-4 right-4 z-20 glass-surface p-3.5 rounded-2xl border border-bot-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-bot-gold" />
                <span className="text-bot-white font-bold">12 nearby available</span>
              </div>
              <span className="text-bot-text-secondary text-[11px]">Avg Response: 4.5s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
