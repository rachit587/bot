'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { MOCK_PROFESSIONALS, MOCK_BOOKINGS } from '@/lib/mock-data';
import {
  Shield,
  MapPin,
  Users,
  Radio,
  Clock,
  ArrowLeft,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';

export default function AdminOperationsMapPage() {
  const [selectedBouncer, setSelectedBouncer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'available'>('all');

  const bouncers = MOCK_PROFESSIONALS.filter(p => {
    if (activeTab === 'assigned') return p.availability === 'busy';
    if (activeTab === 'available') return p.availability === 'available';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-bot-card border-b border-bot-border px-4 py-3 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 rounded-lg bg-bot-elevated hover:bg-bot-border text-bot-text-secondary hover:text-bot-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-bot-white">Live Operations Dispatch Radar</h1>
                  <span className="px-2 py-0.5 rounded-full bg-bot-success/15 text-bot-success text-[10px] font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-bot-text-secondary">Bengaluru Urban Command Cluster</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-bot-elevated p-1 rounded-xl border border-bot-border text-xs">
                {(['all', 'available', 'assigned'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                      activeTab === tab ? 'bg-bot-gold text-bot-bg font-bold' : 'text-bot-text-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map & Live Feed Split */}
        <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {/* Main Visual Map Area */}
          <div className="flex-1 relative bg-bot-elevated overflow-hidden">
            {/* Grid background */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-15">
              <defs>
                <pattern id="ops-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4A843" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ops-grid)" />
            </svg>

            {/* Radar concentric sweep overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-bot-gold/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-bot-gold/15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full border border-bot-gold/20 pointer-events-none" />

            {/* Service Location Pins (Bookings) */}
            {MOCK_BOOKINGS.map((booking, idx) => (
              <div
                key={booking.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${40 + (idx * 25) % 50}%`,
                  top: `${35 + (idx * 20) % 45}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-bot-gold text-bot-bg font-extrabold text-xs flex items-center justify-center shadow-lg shadow-bot-gold/30">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="px-2 py-0.5 rounded bg-bot-card/95 border border-bot-gold text-[10px] text-bot-white font-bold whitespace-nowrap mt-1 shadow-md">
                    {booking.request.purposeLabel} ({booking.request.count})
                  </div>
                </div>
              </div>
            ))}

            {/* Bouncers On-Duty Pins */}
            {bouncers.map((bouncer, idx) => {
              const isSelected = selectedBouncer === bouncer.id;
              const isBusy = bouncer.availability === 'busy';
              return (
                <div
                  key={bouncer.id}
                  onClick={() => setSelectedBouncer(bouncer.id)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all"
                  style={{
                    left: `${15 + (idx * 17) % 75}%`,
                    top: `${18 + (idx * 23) % 65}%`,
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-transform group-hover:scale-125 ${
                        isSelected
                          ? 'bg-bot-white text-bot-bg border-bot-gold scale-125'
                          : isBusy
                          ? 'bg-bot-warning text-bot-bg border-bot-warning'
                          : 'bg-bot-card text-bot-gold border-bot-gold/60'
                      }`}
                    >
                      {bouncer.name.charAt(0)}
                    </div>
                    <div className="hidden group-hover:block absolute top-7 bg-bot-card border border-bot-border p-2 rounded-lg text-xs whitespace-nowrap z-30 shadow-xl">
                      <div className="font-bold text-bot-white">{bouncer.name} ({bouncer.code})</div>
                      <div className="text-[10px] text-bot-text-secondary">{bouncer.level} • {bouncer.location.shortAddress}</div>
                      <div className={`text-[10px] font-semibold mt-0.5 ${isBusy ? 'text-bot-warning' : 'text-bot-success'}`}>
                        {isBusy ? 'On Assignment' : 'Available for Dispatch'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Legend Floating Box */}
            <div className="absolute bottom-4 left-4 z-20 bg-bot-card/90 backdrop-blur-md border border-bot-border rounded-xl p-3 text-xs space-y-1.5 shadow-xl">
              <div className="text-[10px] uppercase tracking-wider font-bold text-bot-text-secondary mb-1">Radar Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-bot-gold" />
                <span className="text-bot-white">Active Service Location</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-bot-card border border-bot-gold text-bot-gold flex items-center justify-center text-[8px]">●</span>
                <span className="text-bot-white">Available Bouncer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-bot-warning" />
                <span className="text-bot-white">Assigned / In-Transit</span>
              </div>
            </div>
          </div>

          {/* Right Live Stream Sidebar */}
          <div className="w-full lg:w-80 bg-bot-card border-t lg:border-t-0 lg:border-l border-bot-border flex flex-col max-h-96 lg:max-h-full">
            <div className="p-4 border-b border-bot-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-bot-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-bot-gold" /> Dispatch Feed
              </span>
              <span className="text-[10px] text-bot-text-secondary">{bouncers.length} tracked units</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {bouncers.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBouncer(b.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedBouncer === b.id
                      ? 'bg-bot-gold/15 border-bot-gold'
                      : 'bg-bot-elevated/60 border-bot-border hover:border-bot-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-bot-white">{b.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      b.availability === 'busy' ? 'bg-bot-warning/15 text-bot-warning' : 'bg-bot-success/15 text-bot-success'
                    }`}>
                      {b.availability === 'busy' ? 'BUSY' : 'READY'}
                    </span>
                  </div>
                  <div className="text-[11px] text-bot-text-secondary flex justify-between">
                    <span>{b.level} • {b.location.shortAddress}</span>
                    <span className="text-bot-gold font-semibold">{b.rating} ★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
