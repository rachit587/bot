'use client';

import { useBookingStore } from '@/stores/booking-store';
import { SERVICE_OPTIONS } from '@/lib/mock-data';
import { ShieldCheck, UserCheck, Moon, PartyPopper, GraduationCap, Heart, Lock, Users, Crown, Building2, Car, Building, MoreHorizontal } from 'lucide-react';
import { ServicePurpose } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, UserCheck, Moon, PartyPopper, GraduationCap, Heart, Lock, Users, Crown, Building2, Car, Building, MoreHorizontal,
};

export default function PurposeStep() {
  const { purpose, setPurpose, nextStep } = useBookingStore();

  const handleSelect = (id: ServicePurpose, title: string) => {
    setPurpose(id, title);
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">What do you need your bouncers for?</h2>
      <p className="text-bot-text-secondary mb-8">Choose the type of service you need</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SERVICE_OPTIONS.map((service) => {
          const Icon = iconMap[service.icon] || ShieldCheck;
          const isSelected = purpose === service.id;

          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id, service.title)}
              className={`group p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-bot-gold/10 border-bot-gold shadow-lg shadow-bot-gold/10'
                  : 'bg-bot-card border-bot-border hover:border-bot-gold/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected ? 'bg-bot-gold/20' : 'bg-bot-elevated group-hover:bg-bot-gold/10'
              }`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-bot-gold' : 'text-bot-text-secondary group-hover:text-bot-gold'}`} />
              </div>
              <h3 className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-bot-gold' : 'text-bot-white'}`}>
                {service.title}
              </h3>
              <p className="text-xs text-bot-text-secondary line-clamp-2">{service.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
