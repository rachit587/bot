'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBookingStore, formatTime12 } from '@/stores/booking-store';
import { formatPrice } from '@/lib/price-calculator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MaleBouncerAvatar, FemaleBouncerAvatar } from '@/components/ui/BouncerAvatars';
import {
  Star,
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Phone,
  AlertTriangle,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function TeamPage() {
  const router = useRouter();
  const store = useBookingStore();
  const team = store.confirmedTeam;
  const pricing = store.getPricing();

  if (team.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-bot-bg">
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center p-8 bg-bot-card rounded-3xl border border-bot-border max-w-sm mx-auto">
            <Shield className="w-12 h-12 text-bot-gold mx-auto mb-3 opacity-50" />
            <p className="text-bot-white font-bold text-lg mb-1">No Active Match Session</p>
            <p className="text-bot-text-secondary text-xs mb-6">Select your location and team from the direct booking window.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl btn-neon-gold text-xs font-black uppercase"
            >
              Direct Booking Window
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bot-success/15 border border-bot-success/40 mb-3 shadow-lg shadow-bot-success/10">
              <CheckCircle2 className="w-4 h-4 text-bot-success" />
              <span className="text-xs font-black tracking-wider text-bot-success uppercase">
                {team.length}/{team.length} Team Confirmed & En Route
              </span>
            </div>

            <div className="flex justify-center mb-2">
              <div className="relative h-10 w-28">
                <Image src="/logo.png" alt="BOT" fill className="object-contain" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-bot-white">Your Assigned Protection Unit</h1>
            <p className="text-xs sm:text-sm text-bot-text-secondary mt-1">
              Estimated Venue Arrival in <span className="text-bot-gold font-bold">~10-12 minutes</span>
            </p>
          </div>

          {/* Team Cards */}
          <div className="space-y-4 mb-8">
            {team.map((member, i) => (
              <div
                key={member.id}
                className="p-5 rounded-3xl bg-bot-card border border-bot-border hover:border-bot-gold/40 transition-all shadow-xl animate-slide-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <div className="w-7 h-7 rounded-full bg-bot-gold text-bot-bg flex items-center justify-center text-xs font-black flex-shrink-0">
                    #{i + 1}
                  </div>

                  {/* Character Avatar */}
                  <div className="relative flex-shrink-0">
                    {member.gender === 'Female' ? (
                      <FemaleBouncerAvatar className="w-16 h-16" />
                    ) : (
                      <MaleBouncerAvatar className="w-16 h-16" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-bot-white">{member.name}</span>
                      <span className="px-2 py-0.5 rounded bg-bot-elevated text-bot-gold text-[10px] font-bold">
                        {member.level}
                      </span>
                      {member.isVerified && <Shield className="w-3.5 h-3.5 text-bot-gold" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-bot-text-secondary">
                      <span className="flex items-center gap-0.5 text-bot-gold font-bold">
                        <Star className="w-3.5 h-3.5 fill-bot-gold text-bot-gold" />
                        {member.rating}
                      </span>
                      <span>•</span>
                      <span>{member.completedBookings} assignments</span>
                      <span>•</span>
                      <span>{member.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-bot-text-secondary">
                      <MapPin className="w-3 h-3 text-bot-gold" />
                      <span>{member.location.shortAddress}</span>
                    </div>
                  </div>

                  {/* Direct Action Call */}
                  <div className="flex-shrink-0">
                    <a
                      href="tel:+919876543210"
                      className="p-3 rounded-2xl bg-bot-elevated border border-bot-gold/30 text-bot-gold hover:bg-bot-gold hover:text-bot-bg transition-all flex items-center justify-center shadow-md"
                      title="Call Bouncer"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Summary Box */}
          <div className="rounded-3xl bg-bot-card border border-bot-border p-5 mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-bot-gold mb-3">Service Order Specs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-bot-text-secondary">Purpose:</span>
                <p className="text-bot-white font-bold mt-0.5">{store.purposeLabel || "Women's Safety"}</p>
              </div>
              <div>
                <span className="text-bot-text-secondary">Destination:</span>
                <p className="text-bot-white font-bold mt-0.5">{store.location?.shortAddress || 'Indiranagar'}</p>
              </div>
              <div>
                <span className="text-bot-text-secondary">Duration:</span>
                <p className="text-bot-white font-bold mt-0.5">{store.duration} hours</p>
              </div>
              <div>
                <span className="text-bot-text-secondary">Total Amount:</span>
                <p className="text-base font-black text-gradient-gold">{formatPrice(pricing.total)}</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => router.push(`/booking/live-tracking`)}
              className="sm:col-span-2 py-4 rounded-2xl btn-neon-gold text-xs font-black flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> OPEN LIVE VEHICLE/GPS TRACKER
            </button>

            <button
              onClick={() => router.push('/help')}
              className="py-4 rounded-2xl bg-bot-danger/15 border border-bot-danger text-bot-danger hover:bg-bot-danger hover:text-bot-white text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> 24/7 SOS DESK
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
