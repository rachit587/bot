'use client';

import { useBookingStore } from '@/stores/booking-store';
import { ArrowLeft, ArrowRight, Users, User } from 'lucide-react';
import { GenderPreference } from '@/lib/types';

const options: { id: GenderPreference; title: string; description: string; icon: React.ReactNode }[] = [
  { id: 'ANY', title: 'Any', description: 'No preference — best available match', icon: <Users className="w-6 h-6" /> },
  { id: 'MALE', title: 'Male', description: 'Male professionals only', icon: <User className="w-6 h-6" /> },
  { id: 'FEMALE', title: 'Female', description: 'Female professionals only', icon: <User className="w-6 h-6" /> },
  { id: 'MIXED', title: 'Mixed', description: 'A combination of male and female professionals', icon: <Users className="w-6 h-6" /> },
];

export default function GenderStep() {
  const { genderPreference, setGenderPreference, nextStep, prevStep } = useBookingStore();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">Preferred Team</h2>
      <p className="text-bot-text-secondary mb-8">Choose your team&apos;s gender composition</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {options.map((opt) => {
          const isSelected = genderPreference === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setGenderPreference(opt.id)}
              className={`p-5 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-bot-gold/10 border-bot-gold shadow-lg shadow-bot-gold/10'
                  : 'bg-bot-card border-bot-border hover:border-bot-gold/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 ${
                isSelected ? 'bg-bot-gold/20 text-bot-gold' : 'bg-bot-elevated text-bot-text-secondary'
              }`}>
                {opt.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-bot-gold' : 'text-bot-white'}`}>
                {opt.title}
              </h3>
              <p className="text-xs text-bot-text-secondary">{opt.description}</p>
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
