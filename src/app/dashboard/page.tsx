'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/stores/auth-store';
import { MOCK_BOOKINGS, MOCK_PROFESSIONALS, SERVICE_OPTIONS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import { Shield, ArrowRight, Calendar, Clock, MapPin, Star, ChevronRight, Users, Wallet, Bell, Settings, ShieldCheck, Moon, PartyPopper, GraduationCap, Zap } from 'lucide-react';

const quickServices = [
  { id: 'womens_safety', icon: ShieldCheck, label: "Women's Safety" },
  { id: 'night_out', icon: Moon, label: 'Night Out' },
  { id: 'college_event', icon: GraduationCap, label: 'College Event' },
  { id: 'party_club', icon: PartyPopper, label: 'Party' },
];

export default function DashboardPage() {
  const { currentCustomer } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-bot-white mb-1">
              Welcome back, <span className="text-gradient-gold">{currentCustomer.name.split(' ')[0]}</span>
            </h1>
            <p className="text-bot-text-secondary">What do you need today?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <Link href="/book" className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-gradient-gold text-bot-bg hover:shadow-lg hover:shadow-bot-gold/25 transition-all hover:-translate-y-0.5">
              <Zap className="w-6 h-6 mb-2" />
              <span className="font-bold">Book Now</span>
            </Link>
            {quickServices.map((s) => (
              <Link key={s.id} href={`/book?purpose=${s.id}`} className="p-4 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/30 transition-all hover:-translate-y-0.5">
                <s.icon className="w-5 h-5 text-bot-gold mb-2" />
                <span className="text-sm font-medium text-bot-text-secondary">{s.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Booking Card */}
              <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
                <div className="px-5 py-3 border-b border-bot-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-bot-white">Active Booking</h3>
                  <span className="px-2 py-0.5 rounded-full bg-bot-success/10 text-bot-success text-xs font-semibold">CONFIRMED</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-bot-gold/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-bot-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-bot-white">College Event</h4>
                      <div className="flex items-center gap-3 text-xs text-bot-text-secondary mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Whitefield</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Sep 15</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 6 bouncers</span>
                      </div>
                    </div>
                    <Link href="/bookings" className="p-2 rounded-lg hover:bg-bot-elevated">
                      <ChevronRight className="w-5 h-5 text-bot-text-secondary" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
                <div className="px-5 py-3 border-b border-bot-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-bot-white">Recent Bookings</h3>
                  <Link href="/bookings" className="text-xs text-bot-gold hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-bot-border">
                  {MOCK_BOOKINGS.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center gap-4 hover:bg-bot-elevated/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        booking.status === 'COMPLETED' ? 'bg-bot-success' :
                        booking.status === 'CONFIRMED' ? 'bg-bot-gold' : 'bg-bot-text-secondary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-bot-white">{booking.request.purposeLabel}</div>
                        <div className="text-xs text-bot-text-secondary">{booking.request.location.shortAddress} • {booking.request.count} bouncers</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-bot-white">{formatPrice(booking.pricing.total)}</div>
                        <div className={`text-xs font-medium ${
                          booking.status === 'COMPLETED' ? 'text-bot-success' : 'text-bot-gold'
                        }`}>{booking.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="rounded-2xl bg-bot-card border border-bot-border p-5">
                <h3 className="text-sm font-semibold text-bot-white mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <StatItem label="Total Bookings" value="7" />
                  <StatItem label="This Month" value={formatPrice(15400)} />
                  <StatItem label="Saved Professionals" value="3" />
                  <StatItem label="Average Rating Given" value="4.7 ★" />
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
                <QuickLink href="/profile" icon={Settings} label="Profile & Settings" />
                <QuickLink href="/notifications" icon={Bell} label="Notifications" badge={2} />
                <QuickLink href="/discover" icon={Users} label="Find Bouncers" />
                <QuickLink href="/help" icon={Shield} label="Help & Safety" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-bot-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-bot-white">{value}</span>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label, badge }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-bot-elevated transition-colors border-b border-bot-border last:border-0">
      <Icon className="w-4 h-4 text-bot-text-secondary" />
      <span className="text-sm text-bot-text-secondary flex-1">{label}</span>
      {badge && <span className="w-5 h-5 rounded-full bg-bot-gold text-bot-bg text-xs font-bold flex items-center justify-center">{badge}</span>}
      <ChevronRight className="w-4 h-4 text-bot-text-secondary" />
    </Link>
  );
}
