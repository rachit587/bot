'use client';

import { useBookingStore } from '@/stores/booking-store';
import { LEVEL_OPTIONS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import { ArrowLeft, ArrowRight, Check, Star, Shield, Crown } from 'lucide-react';

const levelIcons = { STANDARD: Shield, PRO: Star, ELITE: Crown };

export default function LevelStep() {
  const { level, setLevel, nextStep, prevStep, count, duration } = useBookingStore();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">Choose your professional level</h2>
      <p className="text-bot-text-secondary mb-8">Higher levels bring more experience and training</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {LEVEL_OPTIONS.map((opt) => {
          const isSelected = level === opt.level;
          const Icon = levelIcons[opt.level];
          const total = opt.baseRate * count * duration;

          return (
            <button
              key={opt.level}
              onClick={() => setLevel(opt.level)}
              className={`relative p-6 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 ${
                isSelected
                  ? 'bg-bot-gold/10 border-bot-gold shadow-lg shadow-bot-gold/10'
                  : 'bg-bot-card border-bot-border hover:border-bot-gold/30'
              }`}
            >
              {opt.level === 'PRO' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-bot-gold text-bot-bg text-xs font-bold">
                  POPULAR
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isSelected ? 'bg-bot-gold/20' : 'bg-bot-elevated'
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-bot-gold' : 'text-bot-text-secondary'}`} />
              </div>

              <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-bot-gold' : 'text-bot-white'}`}>
                {opt.title}
              </h3>
              <p className="text-sm text-bot-text-secondary mb-4">{opt.description}</p>

              <div className="space-y-2 mb-4">
                {opt.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-bot-text-secondary">
                    <Check className="w-3.5 h-3.5 text-bot-gold flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-bot-border">
                <div className="text-bot-gold font-bold text-lg">{formatPrice(opt.baseRate)}<span className="text-sm font-normal text-bot-text-secondary">/hr</span></div>
                <div className="text-xs text-bot-text-secondary mt-1">Est. total: {formatPrice(total)}</div>
              </div>
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
