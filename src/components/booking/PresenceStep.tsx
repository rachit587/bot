'use client';

import { useBookingStore } from '@/stores/booking-store';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PhysicalPresence } from '@/lib/types';

const options: { id: PhysicalPresence; title: string; description: string }[] = [
  { id: 'STANDARD', title: 'Standard Presence', description: 'Regular professional build and stature' },
  { id: 'LARGE', title: 'Large Presence', description: 'Taller and broader physical presence' },
  { id: 'HIGH', title: 'High-Presence', description: 'Maximum physical deterrence and authority' },
];

export default function PresenceStep() {
  const { presence, setPresence, nextStep, prevStep } = useBookingStore();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">Choose the presence you want your team to have</h2>
      <p className="text-bot-text-secondary mb-1">This is a preference only — all professionals are equally trained and capable.</p>
      <p className="text-xs text-bot-text-secondary mb-8 italic">Optional — you can skip this step</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {options.map((opt) => {
          const isSelected = presence === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setPresence(opt.id)}
              className={`p-6 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-bot-gold/10 border-bot-gold shadow-lg shadow-bot-gold/10'
                  : 'bg-bot-card border-bot-border hover:border-bot-gold/30'
              }`}
            >
              {/* Visual presence indicator */}
              <div className="flex items-end justify-center gap-1 mb-4 h-12">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`rounded-sm transition-all ${
                      isSelected ? 'bg-bot-gold' : 'bg-bot-elevated'
                    }`}
                    style={{
                      width: '12px',
                      height: opt.id === 'STANDARD' ? `${bar * 10 + 8}px` :
                             opt.id === 'LARGE' ? `${bar * 12 + 10}px` :
                             `${bar * 14 + 10}px`,
                    }}
                  />
                ))}
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-bot-gold' : 'text-bot-white'}`}>
                {opt.title}
              </h3>
              <p className="text-sm text-bot-text-secondary">{opt.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-gold text-bot-bg font-semibold hover:shadow-lg hover:shadow-bot-gold/25 transition-all">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
