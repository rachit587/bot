'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import RatingModal from '@/components/rating/RatingModal';
import { useBookingStore, formatTime12 } from '@/stores/booking-store';
import { formatPrice } from '@/lib/price-calculator';
import { MOCK_PROFESSIONALS } from '@/lib/mock-data';
import {
  Shield,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Star,
  Users,
  MessageCircle,
} from 'lucide-react';

export default function ActiveBookingPage() {
  const router = useRouter();
  const params = useParams();
  const store = useBookingStore();
  const team = store.confirmedTeam.length > 0 ? store.confirmedTeam : [MOCK_PROFESSIONALS[0], MOCK_PROFESSIONALS[1]];

  const [bookingStatus, setBookingStatus] = useState<'ON_THE_WAY' | 'ARRIVED' | 'ACTIVE' | 'COMPLETED'>('ON_THE_WAY');
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [progressOffset, setProgressOffset] = useState(0);

  // Simulate progress of bouncers arriving
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressOffset(p => Math.min(100, p + 10));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleEndBooking = () => {
    setBookingStatus('COMPLETED');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        {/* Map Header Overlay */}
        <div className="relative w-full bg-bot-elevated h-80 sm:h-96 border-b border-bot-border overflow-hidden">
          {/* Map Grid */}
          <svg width="100%" height="100%" className="absolute inset-0 opacity-15">
            <defs>
              <pattern id="active-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A843" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#active-grid)" />
          </svg>

          {/* Central Service Location Marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-28 h-28 rounded-full bg-bot-gold/10 border border-bot-gold/30 animate-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-gold text-bot-bg flex items-center justify-center font-extrabold shadow-xl shadow-bot-gold/40">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="px-3 py-1 rounded-full bg-bot-card/90 border border-bot-gold text-xs font-bold text-bot-white mt-1 shadow-lg">
                {store.location?.shortAddress || 'Indiranagar'}
              </div>
            </div>
          </div>

          {/* Moving Bouncer Markers */}
          {team.map((member, i) => {
            const startX = 20 + i * 50;
            const startY = 20 + (i % 2) * 45;
            // Move toward center (50%, 50%)
            const currentX = startX + (50 - startX) * (progressOffset / 100);
            const currentY = startY + (50 - startY) * (progressOffset / 100);

            return (
              <div
                key={member.id}
                className="absolute z-30 transition-all duration-1000 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${currentX}%`,
                  top: `${currentY}%`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-bot-card border-2 border-bot-gold text-bot-gold flex items-center justify-center font-bold text-xs shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-bot-elevated/90 text-[10px] text-bot-white font-semibold mt-0.5">
                    {member.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Status Floating Pill */}
          <div className="absolute top-4 left-4 z-30 bg-bot-card/90 backdrop-blur-md border border-bot-border px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-bot-success animate-pulse" />
            <div>
              <div className="text-xs font-bold text-bot-white">
                {bookingStatus === 'ON_THE_WAY' && `Team In-Transit (~${Math.max(1, etaMinutes - Math.floor(progressOffset / 15))} min ETA)`}
                {bookingStatus === 'ARRIVED' && 'Team Has Arrived at Venue'}
                {bookingStatus === 'ACTIVE' && 'Assignment in Progress'}
                {bookingStatus === 'COMPLETED' && 'Assignment Concluded'}
              </div>
              <div className="text-[10px] text-bot-text-secondary">
                {team.length} Professionals • {store.purposeLabel || "Women's Safety"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control & Details Sheet */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Details Panel */}
            <div className="md:col-span-2 space-y-4">
              <div className="rounded-2xl bg-bot-card border border-bot-border p-5">
                <h3 className="text-sm font-bold text-bot-white mb-3 flex items-center justify-between">
                  <span>Assigned Protection Team</span>
                  <span className="text-xs text-bot-gold font-normal">{team.length} Confirmed</span>
                </h3>

                <div className="space-y-3">
                  {team.map((member, i) => (
                    <div key={member.id} className="p-3.5 rounded-xl bg-bot-elevated border border-bot-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-gold p-0.5">
                          <div className="w-full h-full rounded-full bg-bot-elevated flex items-center justify-center text-xs font-bold text-bot-gold">
                            {member.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-bot-white">{member.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-bot-card text-[10px] text-bot-gold font-semibold">{member.level}</span>
                          </div>
                          <div className="text-[10px] text-bot-text-secondary mt-0.5">
                            {member.gender} • {member.rating} ★ • {member.experience}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href="tel:+919876543210"
                          className="p-2 rounded-lg bg-bot-card border border-bot-border text-bot-gold hover:bg-bot-gold hover:text-bot-bg transition-colors"
                          title="Call Bouncer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Specifications */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-5">
                <h3 className="text-sm font-bold text-bot-white mb-3">Service Schedule & Location</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-bot-text-secondary">Venue:</span>
                    <p className="text-bot-white font-medium mt-0.5">{store.location?.address || 'Indiranagar, Bengaluru'}</p>
                  </div>
                  <div>
                    <span className="text-bot-text-secondary">Duration Window:</span>
                    <p className="text-bot-white font-medium mt-0.5">
                      {formatTime12(store.startTime || '20:00')} → {formatTime12(store.getEndTime() || '23:00')} ({store.duration || 3} hrs)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-bot-card border border-bot-border p-5 space-y-3">
                <h3 className="text-sm font-bold text-bot-white mb-2">Assignment Actions</h3>

                <button
                  onClick={() => {
                    if (bookingStatus === 'ON_THE_WAY') setBookingStatus('ARRIVED');
                    else if (bookingStatus === 'ARRIVED') setBookingStatus('ACTIVE');
                    else handleEndBooking();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-gold text-bot-bg font-extrabold text-xs hover:shadow-lg hover:shadow-bot-gold/25 transition-all"
                >
                  {bookingStatus === 'ON_THE_WAY' && 'Simulate: Team Arrived'}
                  {bookingStatus === 'ARRIVED' && 'Simulate: Start Assignment'}
                  {bookingStatus === 'ACTIVE' && 'End Booking & Leave Rating'}
                  {bookingStatus === 'COMPLETED' && 'Booking Finished'}
                </button>

                <button
                  onClick={() => router.push('/help')}
                  className="w-full py-3 rounded-xl bg-bot-danger/15 border border-bot-danger text-bot-danger font-bold text-xs flex items-center justify-center gap-2 hover:bg-bot-danger hover:text-bot-white transition-all"
                >
                  <AlertTriangle className="w-4 h-4" /> Emergency SOS
                </button>

                <button
                  onClick={() => router.push('/help')}
                  className="w-full py-2.5 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary font-medium text-xs flex items-center justify-center gap-2 hover:text-bot-white"
                >
                  <Phone className="w-3.5 h-3.5" /> Contact 24/7 Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5-star Rating Modal after completion */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        bouncersCount={team.length}
      />
    </div>
  );
}
