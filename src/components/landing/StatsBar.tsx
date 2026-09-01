'use client';

import { Shield, Users, Star, MapPin } from 'lucide-react';
import { ADMIN_STATS } from '@/lib/mock-data';

const stats = [
  { icon: Shield, label: 'Bookings Completed', value: '1,284+' },
  { icon: Users, label: 'Verified Professionals', value: '243+' },
  { icon: Star, label: 'Average Rating', value: '4.8 ★' },
  { icon: MapPin, label: 'Cities Active', value: '3' },
];

export default function StatsBar() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-bot-elevated mx-auto mb-3 flex items-center justify-center group-hover:bg-bot-gold/10 transition-colors">
                <stat.icon className="w-6 h-6 text-bot-gold" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-bot-white mb-1">{stat.value}</div>
              <div className="text-sm text-bot-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
