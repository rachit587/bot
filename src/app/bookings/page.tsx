'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { MOCK_BOOKINGS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

const TABS = ['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const;
type Tab = typeof TABS[number];

const statusColors: Record<string, string> = {
  COMPLETED: 'text-bot-success bg-bot-success/10',
  CONFIRMED: 'text-bot-gold bg-bot-gold/10',
  ACTIVE: 'text-bot-info bg-bot-info/10',
  CANCELLED: 'text-bot-danger bg-bot-danger/10',
  SEARCHING: 'text-bot-warning bg-bot-warning/10',
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('ALL');

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return ['CONFIRMED'].includes(b.status);
    if (activeTab === 'ACTIVE') return ['ACTIVE', 'ON_THE_WAY', 'ARRIVED'].includes(b.status);
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-bot-white mb-6">Your Bookings</h1>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab ? 'bg-bot-gold text-bot-bg' : 'bg-bot-card border border-bot-border text-bot-text-secondary hover:text-bot-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Booking Cards */}
          <div className="space-y-3">
            {filtered.map((booking) => (
              <div key={booking.id} className="p-5 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-bot-white">{booking.request.purposeLabel}</h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[booking.status] || 'text-bot-text-secondary bg-bot-elevated'}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-bot-text-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.request.location.shortAddress}
                  </div>
                  <div className="flex items-center gap-1.5 text-bot-text-secondary">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(booking.request.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-bot-text-secondary">
                    <Users className="w-3.5 h-3.5" />
                    {booking.request.count} bouncers
                  </div>
                  <div className="text-right">
                    <span className="text-bot-white font-semibold">{formatPrice(booking.pricing.total)}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-bot-text-secondary">
                No bookings found in this category.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
