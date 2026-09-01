'use client';

import Navbar from '@/components/layout/Navbar';
import { formatPrice } from '@/lib/price-calculator';
import { TrendingUp, DollarSign, Calendar, Clock, BarChart3 } from 'lucide-react';

const earningsHistory = [
  { date: 'Sep 1', amount: 3200, bookings: 3 },
  { date: 'Aug 31', amount: 2400, bookings: 2 },
  { date: 'Aug 30', amount: 4800, bookings: 4 },
  { date: 'Aug 29', amount: 1600, bookings: 1 },
  { date: 'Aug 28', amount: 3600, bookings: 3 },
  { date: 'Aug 27', amount: 0, bookings: 0 },
  { date: 'Aug 26', amount: 2800, bookings: 2 },
];

export default function EarningsPage() {
  const maxAmount = Math.max(...earningsHistory.map(e => e.amount));

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-bot-white mb-6">Earnings</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-bot-card border border-bot-border">
              <DollarSign className="w-5 h-5 text-bot-gold mb-2" />
              <div className="text-xl font-bold text-bot-white">{formatPrice(3200)}</div>
              <div className="text-xs text-bot-text-secondary">Today</div>
            </div>
            <div className="p-4 rounded-2xl bg-bot-card border border-bot-border">
              <TrendingUp className="w-5 h-5 text-bot-gold mb-2" />
              <div className="text-xl font-bold text-bot-white">{formatPrice(14800)}</div>
              <div className="text-xs text-bot-text-secondary">This Week</div>
            </div>
            <div className="p-4 rounded-2xl bg-bot-card border border-bot-border">
              <Calendar className="w-5 h-5 text-bot-gold mb-2" />
              <div className="text-xl font-bold text-bot-white">8</div>
              <div className="text-xs text-bot-text-secondary">Completed</div>
            </div>
            <div className="p-4 rounded-2xl bg-bot-card border border-bot-border">
              <BarChart3 className="w-5 h-5 text-bot-gold mb-2" />
              <div className="text-xl font-bold text-bot-white">{formatPrice(1850)}</div>
              <div className="text-xs text-bot-text-secondary">Avg Booking</div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl bg-bot-card border border-bot-border p-5 mb-6">
            <h3 className="text-sm font-semibold text-bot-white mb-4">Last 7 Days</h3>
            <div className="flex items-end gap-3 h-40">
              {earningsHistory.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-bot-gold font-semibold">
                    {day.amount > 0 ? formatPrice(day.amount) : ''}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-bot-gold/60 to-bot-gold transition-all duration-500"
                    style={{ height: `${maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0}%`, minHeight: day.amount > 0 ? '4px' : '0' }}
                  />
                  <div className="text-[10px] text-bot-text-secondary">{day.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* History List */}
          <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
            <div className="px-5 py-3 border-b border-bot-border">
              <h3 className="text-sm font-semibold text-bot-white">Earnings History</h3>
            </div>
            <div className="divide-y divide-bot-border">
              {earningsHistory.filter(d => d.amount > 0).map((day, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-bot-white font-medium">{day.date}</div>
                    <div className="text-xs text-bot-text-secondary">{day.bookings} bookings</div>
                  </div>
                  <span className="text-bot-gold font-bold">{formatPrice(day.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
