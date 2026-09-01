'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/price-calculator';
import {
  Shield,
  Star,
  Award,
  CheckCircle2,
  MapPin,
  Clock,
  Languages,
  BadgeCheck,
  Calendar,
  DollarSign,
  Edit3,
} from 'lucide-react';

export default function BouncerProfilePage() {
  const { currentProfessional } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Profile Card */}
          <div className="rounded-3xl bg-bot-card border border-bot-border p-6 md:p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-bot-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-gold p-1">
                  <div className="w-full h-full rounded-xl bg-bot-elevated flex items-center justify-center text-3xl font-extrabold text-bot-gold">
                    {currentProfessional.name.charAt(0)}
                  </div>
                </div>
                {currentProfessional.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-bot-card border border-bot-border rounded-full p-1 shadow-lg">
                    <BadgeCheck className="w-6 h-6 text-bot-gold" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-bot-white">{currentProfessional.name}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-bot-gold/10 border border-bot-gold/30 text-bot-gold text-xs font-bold w-fit mx-auto md:mx-0">
                    {currentProfessional.level} PROFESSIONAL
                  </span>
                  <span className="text-xs text-bot-text-secondary bg-bot-elevated px-2 py-0.5 rounded w-fit mx-auto md:mx-0">
                    {currentProfessional.code}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-bot-text-secondary mb-4">
                  <span className="flex items-center gap-1 text-bot-gold font-semibold">
                    <Star className="w-4 h-4 fill-bot-gold text-bot-gold" />
                    {currentProfessional.rating} (128 reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-bot-text-secondary" />
                    {currentProfessional.location.shortAddress}, Bengaluru
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-bot-text-secondary" />
                    {currentProfessional.experience} Exp
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bot-success/10 text-bot-success text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-bot-success animate-pulse" />
                    Verified Partner
                  </span>
                  <span className="text-sm font-semibold text-bot-gold">
                    {formatPrice(currentProfessional.hourlyRate)}/hr Rate
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Left 2 Cols: Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Skills & Specializations */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
                <h3 className="text-base font-semibold text-bot-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-bot-gold" /> Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfessional.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-bot-elevated border border-bot-border text-xs text-bot-white font-medium capitalize"
                    >
                      {spec.replace('_', ' ')}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-xl bg-bot-elevated border border-bot-border text-xs text-bot-white font-medium">
                    Crowd Control
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-bot-elevated border border-bot-border text-xs text-bot-white font-medium">
                    First Aid & CPR
                  </span>
                </div>
              </div>

              {/* Bio & Background */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
                <h3 className="text-base font-semibold text-bot-white mb-3">About & Credentials</h3>
                <p className="text-sm text-bot-text-secondary leading-relaxed mb-4">
                  Certified security specialist trained in executive personal protection, crowd neutralization, and de-escalation tactics.
                  Prior experience leading event security for high-profile music festivals, private VIP escorts, and nightlife venues in Bengaluru.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-bot-border text-xs">
                  <div>
                    <span className="text-bot-text-secondary">Physical Presence:</span>
                    <p className="text-bot-white font-semibold mt-0.5">{currentProfessional.physicalPresence} Presence</p>
                  </div>
                  <div>
                    <span className="text-bot-text-secondary">Languages:</span>
                    <p className="text-bot-white font-semibold mt-0.5">{currentProfessional.languages.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
                <h3 className="text-base font-semibold text-bot-white mb-4">Client Feedback</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-bot-elevated border border-bot-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-bot-white">Ananya G.</span>
                      <div className="flex items-center text-bot-gold text-xs">
                        <Star className="w-3.5 h-3.5 fill-bot-gold text-bot-gold" />
                        <span className="ml-1 font-bold">5.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-bot-text-secondary">
                      &quot;Arjun was extremely polite, attentive, and vigilant during our late night event. Felt 100% safe.&quot;
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bot-elevated border border-bot-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-bot-white">Rohit M.</span>
                      <div className="flex items-center text-bot-gold text-xs">
                        <Star className="w-3.5 h-3.5 fill-bot-gold text-bot-gold" />
                        <span className="ml-1 font-bold">5.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-bot-text-secondary">
                      &quot;Top tier professional demeanor. Handled crowd entry smoothly with zero issues.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Performance Stats */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
                <h3 className="text-base font-semibold text-bot-white mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-bot-text-secondary">Acceptance Rate</span>
                      <span className="text-bot-success font-bold">{currentProfessional.acceptanceRate}%</span>
                    </div>
                    <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-bot-success rounded-full" style={{ width: `${currentProfessional.acceptanceRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-bot-text-secondary">On-Time Arrival</span>
                      <span className="text-bot-gold font-bold">98%</span>
                    </div>
                    <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-bot-gold rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-bot-text-secondary">Assignments</span>
                      <span className="text-bot-white font-bold">{currentProfessional.completedBookings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
                <h3 className="text-base font-semibold text-bot-white mb-3">Bank & Payout Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-bot-border">
                    <span className="text-bot-text-secondary">Account Status</span>
                    <span className="text-bot-success font-semibold">Active / Instant UPI</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-bot-border">
                    <span className="text-bot-text-secondary">UPI ID</span>
                    <span className="text-bot-white font-mono">{currentProfessional.name.toLowerCase()}@okhdfcbank</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-bot-text-secondary">Auto Payout</span>
                    <span className="text-bot-gold font-semibold">Daily at 11:59 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
