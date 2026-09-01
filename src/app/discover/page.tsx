'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { MOCK_PROFESSIONALS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import { Search, Star, Shield, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');

  const filtered = MOCK_PROFESSIONALS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (levelFilter !== 'ALL' && p.level !== levelFilter) return false;
    if (genderFilter !== 'ALL' && p.gender !== genderFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-bot-white mb-2">Find Bouncers</h1>
          <p className="text-bot-text-secondary mb-6">Browse verified professionals near you</p>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bot-text-secondary" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-bot-card border border-bot-border text-bot-text placeholder:text-bot-text-secondary focus:border-bot-gold focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'STANDARD', 'PRO', 'ELITE'].map(l => (
                <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${levelFilter === l ? 'bg-bot-gold text-bot-bg' : 'bg-bot-card border border-bot-border text-bot-text-secondary hover:text-bot-text'}`}>
                  {l}
                </button>
              ))}
              {['ALL', 'Male', 'Female'].map(g => (
                <button key={g} onClick={() => setGenderFilter(g)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${genderFilter === g ? 'bg-bot-gold text-bot-bg' : 'bg-bot-card border border-bot-border text-bot-text-secondary hover:text-bot-text'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/30 transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-bot-elevated flex items-center justify-center text-lg font-bold text-bot-gold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-bot-white">{p.name}</span>
                      {p.isVerified && <Shield className="w-3.5 h-3.5 text-bot-gold" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-bot-text-secondary">
                      <span className="px-1.5 py-0.5 rounded bg-bot-elevated text-bot-gold font-semibold">{p.level}</span>
                      <span>{p.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-bot-text-secondary mb-3">
                  <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 text-bot-gold" />{p.rating}</span>
                  <span>{p.completedBookings} bookings</span>
                  <span>{p.experience}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-bot-border">
                  <span className="flex items-center gap-1 text-xs text-bot-text-secondary"><MapPin className="w-3 h-3" />{p.location.shortAddress}</span>
                  <span className="text-bot-gold font-bold">{formatPrice(p.hourlyRate)}<span className="text-xs text-bot-text-secondary font-normal">/hr</span></span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.isOnline ? 'text-bot-success' : 'text-bot-text-secondary'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.isOnline ? 'bg-bot-success' : 'bg-bot-text-secondary'}`} />
                    {p.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center py-12 text-bot-text-secondary">No bouncers match your filters.</p>}
        </div>
      </main>
    </div>
  );
}
