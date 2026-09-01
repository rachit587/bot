'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ADMIN_STATS, MOCK_BOOKINGS, MOCK_PROFESSIONALS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import {
  Shield,
  Users,
  Activity,
  DollarSign,
  Star,
  AlertTriangle,
  Radio,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-bot-success animate-pulse" />
                <span className="text-xs uppercase font-bold tracking-widest text-bot-gold">Control Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-bot-white mt-1">Platform Operations & Analytics</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/operations"
                className="px-4 py-2.5 rounded-xl bg-gradient-gold text-bot-bg font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-bot-gold/25"
              >
                <Radio className="w-4 h-4 animate-pulse" /> Live Radar Operations
              </Link>
            </div>
          </div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-bot-card border border-bot-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-bot-text-secondary font-medium">Total Bookings</span>
                <Activity className="w-4 h-4 text-bot-gold" />
              </div>
              <div className="text-2xl font-bold text-bot-white">{ADMIN_STATS.totalBookings.toLocaleString()}</div>
              <div className="text-[10px] text-bot-success mt-1">↑ +14.2% this week</div>
            </div>

            <div className="p-5 rounded-2xl bg-bot-card border border-bot-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-bot-text-secondary font-medium">Active Fleet</span>
                <Users className="w-4 h-4 text-bot-gold" />
              </div>
              <div className="text-2xl font-bold text-bot-white">{ADMIN_STATS.activeBouncers}</div>
              <div className="text-[10px] text-bot-text-secondary mt-1">
                <span className="text-bot-success font-semibold">{ADMIN_STATS.onlineNow} Online Now</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-bot-card border border-bot-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-bot-text-secondary font-medium">Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-bot-gold" />
              </div>
              <div className="text-2xl font-bold text-bot-gold">{formatPrice(ADMIN_STATS.revenue)}</div>
              <div className="text-[10px] text-bot-success mt-1">↑ 18.7% MoM</div>
            </div>

            <div className="p-5 rounded-2xl bg-bot-card border border-bot-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-bot-text-secondary font-medium">Avg CSAT Rating</span>
                <Star className="w-4 h-4 text-bot-gold" />
              </div>
              <div className="text-2xl font-bold text-bot-white">{ADMIN_STATS.averageRating} ★</div>
              <div className="text-[10px] text-bot-text-secondary mt-1">Across 1.1k reviews</div>
            </div>

            <div className="p-5 rounded-2xl bg-bot-card border border-bot-border col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-bot-text-secondary font-medium">Cancellation Rate</span>
                <AlertTriangle className="w-4 h-4 text-bot-danger" />
              </div>
              <div className="text-2xl font-bold text-bot-white">{ADMIN_STATS.cancellationRate}%</div>
              <div className="text-[10px] text-bot-success mt-1">Well within 5% SLA</div>
            </div>
          </div>

          {/* Operational Pipeline & Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Real-time Dispatch Performance */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <h3 className="text-base font-bold text-bot-white mb-4 flex items-center justify-between">
                <span>Matching Funnel</span>
                <span className="text-xs text-bot-gold font-normal">Last 24h</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-bot-text-secondary">Requests Dispatched</span>
                    <span className="text-bot-white font-semibold">{ADMIN_STATS.totalRequests}</span>
                  </div>
                  <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-bot-gold rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-bot-text-secondary">Bouncer Acceptances</span>
                    <span className="text-bot-success font-semibold">{ADMIN_STATS.acceptedRequests} (78.5%)</span>
                  </div>
                  <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-bot-success rounded-full" style={{ width: '78.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-bot-text-secondary">Declined / Timeouts</span>
                    <span className="text-bot-danger font-semibold">{ADMIN_STATS.rejectedRequests} (21.5%)</span>
                  </div>
                  <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-bot-danger rounded-full" style={{ width: '21.5%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-bot-border grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-bot-elevated">
                  <div className="text-bot-text-secondary">Avg Response Time</div>
                  <div className="text-sm font-bold text-bot-white mt-1">4.2s</div>
                </div>
                <div className="p-3 rounded-xl bg-bot-elevated">
                  <div className="text-bot-text-secondary">Full Match Time</div>
                  <div className="text-sm font-bold text-bot-gold mt-1">18.4s</div>
                </div>
              </div>
            </div>

            {/* Active System Incidents & Verification Queue */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <h3 className="text-base font-bold text-bot-white mb-4">Pending Verifications ({ADMIN_STATS.pendingVerifications})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {MOCK_PROFESSIONALS.slice(0, 4).map((bouncer, i) => (
                  <div key={bouncer.id} className="p-3 rounded-xl bg-bot-elevated border border-bot-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-bot-card border border-bot-border flex items-center justify-center font-bold text-xs text-bot-gold">
                        {bouncer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-bot-white">{bouncer.name}</div>
                        <div className="text-[10px] text-bot-text-secondary">{bouncer.level} • {bouncer.experience}</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded bg-bot-success/15 text-bot-success text-[10px] font-bold">
                        Approve
                      </button>
                      <button className="px-2 py-1 rounded bg-bot-elevated text-bot-text-secondary text-[10px]">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Category Demand */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <h3 className="text-base font-bold text-bot-white mb-4">Category Demand Split</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-bot-border">
                  <span className="text-bot-white">Women&apos;s Safety Escort</span>
                  <span className="text-bot-gold font-bold">38% (High)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-bot-border">
                  <span className="text-bot-white">Nightclub & Parties</span>
                  <span className="text-bot-white font-bold">26%</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-bot-border">
                  <span className="text-bot-white">College & Campus Festivals</span>
                  <span className="text-bot-white font-bold">18%</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-bot-border">
                  <span className="text-bot-white">Private & VIP Security</span>
                  <span className="text-bot-white font-bold">12%</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-bot-white">Corporate Events</span>
                  <span className="text-bot-white font-bold">6%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master Bookings Ledger */}
          <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden">
            <div className="px-6 py-4 border-b border-bot-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-bot-white">Live Platform Ledger</h3>
              <div className="flex gap-2 text-xs">
                {['ALL', 'ACTIVE', 'CONFIRMED', 'COMPLETED'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeFilter === tab ? 'bg-bot-gold text-bot-bg font-bold' : 'bg-bot-elevated text-bot-text-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-bot-text-secondary">
                <thead className="bg-bot-elevated text-bot-white uppercase text-[10px] tracking-wider border-b border-bot-border">
                  <tr>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Team</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bot-border">
                  {MOCK_BOOKINGS.map(b => (
                    <tr key={b.id} className="hover:bg-bot-elevated/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-bot-gold font-semibold">{b.id}</td>
                      <td className="px-6 py-4 font-medium text-bot-white">{b.customerId}</td>
                      <td className="px-6 py-4">{b.request.purposeLabel}</td>
                      <td className="px-6 py-4">{b.request.count} Bouncers ({b.request.level})</td>
                      <td className="px-6 py-4">{b.request.location.shortAddress}</td>
                      <td className="px-6 py-4 font-bold text-bot-white">{formatPrice(b.pricing.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'COMPLETED' ? 'bg-bot-success/10 text-bot-success' : 'bg-bot-gold/10 text-bot-gold'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
