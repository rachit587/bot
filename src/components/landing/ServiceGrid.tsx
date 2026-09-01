'use client';

import Link from 'next/link';
import { ShieldCheck, UserCheck, Moon, PartyPopper, GraduationCap, Heart, Lock, Users, Crown, Building2, Car, Building, MoreHorizontal } from 'lucide-react';
import { SERVICE_OPTIONS } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, UserCheck, Moon, PartyPopper, GraduationCap, Heart, Lock, Users, Crown, Building2, Car, Building, MoreHorizontal,
};

export default function ServiceGrid() {
  return (
    <section className="py-20 px-4 bg-bot-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-bot-white mb-3">What Do You Need?</h2>
          <p className="text-bot-text-secondary text-lg">Choose from a range of professional security services</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICE_OPTIONS.map((service) => {
            const Icon = iconMap[service.icon] || ShieldCheck;
            return (
              <Link
                key={service.id}
                href={`/book?purpose=${service.id}`}
                className="group p-5 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-bot-gold/5"
              >
                <div className="w-10 h-10 rounded-xl bg-bot-elevated flex items-center justify-center mb-3 group-hover:bg-bot-gold/10 transition-colors">
                  <Icon className="w-5 h-5 text-bot-gold" />
                </div>
                <h3 className="text-sm font-semibold text-bot-white mb-1">{service.title}</h3>
                <p className="text-xs text-bot-text-secondary line-clamp-2">{service.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
