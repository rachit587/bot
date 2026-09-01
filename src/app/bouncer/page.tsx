'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/price-calculator';
import { Power, TrendingUp, Clock, Star, CheckCircle2, Calendar, MapPin, ChevronRight, Shield, DollarSign, BarChart3 } from 'lucide-react';

export default function BouncerHomePage() {
  const { currentProfessional, isOnline, setIsOnline } = useAuthStore();
  const [showRequest, setShowRequest] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [requestAccepted, setRequestAccepted] = useState(false);

  const handleGoOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Simulate incoming request after 3s
      setTimeout(() => setShowRequest(true), 3000);
    }
  };

  const handleAccept = () => {
    setRequestAccepted(true);
    setShowRequest(false);
  };

  // Start countdown when request shows
  useState(() => {
    if (showRequest && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
      return () => clearInterval(timer);
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Online Toggle */}
          <div className="text-center mb-8">
            <button
              onClick={handleGoOnline}
              className={`relative w-28 h-28 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${
                isOnline
                  ? 'bg-bot-success/20 shadow-lg shadow-bot-success/20'
                  : 'bg-bot-elevated border-2 border-bot-border'
              }`}
            >
              {isOnline && <div className="absolute inset-0 rounded-full animate-pulse-gold" style={{ boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' }} />}
              <Power className={`w-10 h-10 ${isOnline ? 'text-bot-success' : 'text-bot-text-secondary'}`} />
            </button>
            <p className={`mt-4 text-lg font-semibold ${isOnline ? 'text-bot-success' : 'text-bot-text-secondary'}`}>
              {isOnline ? "You're Online" : "You're Offline"}
            </p>
            <p className="text-sm text-bot-text-secondary">
              {isOnline ? 'Available for nearby bookings' : 'Go online to receive booking requests'}
            </p>
          </div>

          {/* Incoming Request Modal */}
          {showRequest && !requestAccepted && (
            <div className="mb-8 animate-bounce-in">
              <div className="rounded-2xl bg-bot-card border-2 border-bot-gold overflow-hidden shadow-lg shadow-bot-gold/10">
                <div className="px-5 py-3 bg-bot-gold/10 border-b border-bot-gold/30 flex items-center justify-between">
                  <span className="text-sm font-bold text-bot-gold uppercase tracking-wider">New Booking Request</span>
                  <span className="text-sm font-bold text-bot-danger">{countdown}s</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-bot-white">Women&apos;s Safety</span>
                    <span className="px-2 py-1 rounded bg-bot-gold/10 text-bot-gold text-xs font-semibold">PRO</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-bot-text-secondary"><MapPin className="w-3.5 h-3.5 inline mr-1" />2.3 km away</div>
                    <div className="text-bot-text-secondary"><Clock className="w-3.5 h-3.5 inline mr-1" />8 PM – 11 PM</div>
                    <div className="text-bot-text-secondary"><Calendar className="w-3.5 h-3.5 inline mr-1" />3 hours</div>
                    <div className="text-bot-text-secondary">Gender: Female</div>
                  </div>
                  <div className="pt-3 border-t border-bot-border">
                    <div className="text-xs text-bot-text-secondary">Estimated Earnings</div>
                    <div className="text-2xl font-bold text-bot-gold">{formatPrice(2400)}</div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleAccept} className="flex-1 py-3 rounded-xl bg-gradient-gold text-bot-bg font-bold text-lg hover:shadow-lg hover:shadow-bot-gold/25 transition-all">
                      ACCEPT
                    </button>
                    <button onClick={() => setShowRequest(false)} className="flex-1 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary font-semibold hover:text-bot-text transition-colors">
                      DECLINE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accepted Confirmation */}
          {requestAccepted && (
            <div className="mb-8 p-5 rounded-2xl bg-bot-success/10 border border-bot-success/30 text-center animate-bounce-in">
              <CheckCircle2 className="w-10 h-10 text-bot-success mx-auto mb-2" />
              <h3 className="text-lg font-bold text-bot-success mb-1">Booking Accepted!</h3>
              <p className="text-sm text-bot-text-secondary">Women&apos;s Safety • Indiranagar • 8 PM – 11 PM</p>
              <p className="text-lg font-bold text-bot-gold mt-2">{formatPrice(2400)}</p>
              <button className="mt-3 px-6 py-2 rounded-xl bg-gradient-gold text-bot-bg font-semibold text-sm">
                Start Navigation
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon={DollarSign} label="Today" value={formatPrice(3200)} />
            <StatCard icon={Clock} label="Hours Online" value="6.5 hrs" />
            <StatCard icon={CheckCircle2} label="Completed" value="3" />
            <StatCard icon={Star} label="Rating" value={`${currentProfessional.rating} ★`} />
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
            <BouncerLink href="/bouncer/earnings" icon={BarChart3} label="Earnings" />
            <BouncerLink href="/bouncer/profile" icon={Shield} label="My Profile" />
            <BouncerLink href="/bookings" icon={Calendar} label="My Bookings" />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-bot-card border border-bot-border">
      <Icon className="w-5 h-5 text-bot-gold mb-2" />
      <div className="text-lg font-bold text-bot-white">{value}</div>
      <div className="text-xs text-bot-text-secondary">{label}</div>
    </div>
  );
}

function BouncerLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-5 py-4 hover:bg-bot-elevated transition-colors border-b border-bot-border last:border-0">
      <Icon className="w-4 h-4 text-bot-text-secondary" />
      <span className="text-sm text-bot-text-secondary flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-bot-text-secondary" />
    </Link>
  );
}
