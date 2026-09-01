'use client';

import { useBookingStore } from '@/stores/booking-store';
import { COUNT_OPTIONS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/price-calculator';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CountStep() {
  const { count, setCount, nextStep, prevStep, getPricing } = useBookingStore();
  const pricing = getPricing();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">How many bouncers do you need?</h2>
      <p className="text-bot-text-secondary mb-8">Select the team size for your requirement</p>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8">
        {COUNT_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className={`p-4 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-0.5 ${
              count === n
                ? 'bg-bot-gold/10 border-bot-gold shadow-lg shadow-bot-gold/10'
                : 'bg-bot-card border-bot-border hover:border-bot-gold/30'
            }`}
          >
            <span className={`text-2xl font-bold ${count === n ? 'text-bot-gold' : 'text-bot-white'}`}>
              {n === 10 ? '10+' : n}
            </span>
            {n === 10 && (
              <p className="text-[10px] text-bot-text-secondary mt-1">Custom</p>
            )}
          </button>
        ))}
      </div>

      {/* Visual representation */}
      <div className="p-6 rounded-2xl bg-bot-card border border-bot-border mb-8">
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          {Array.from({ length: Math.min(count, 10) }, (_, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-bot-elevated border border-bot-border flex items-center justify-center animate-bounce-in" style={{ animationDelay: `${i * 80}ms` }}>
              <User className="w-5 h-5 text-bot-gold" />
            </div>
          ))}
        </div>
        <p className="text-center text-bot-text-secondary text-sm">
          <span className="text-bot-white font-semibold">{count}</span> {count === 1 ? 'Bouncer' : 'Bouncers'}
        </p>
        <p className="text-center text-bot-gold font-semibold text-lg mt-2">
          {formatPrice(pricing.total)} estimated
        </p>
      </div>

      {/* Navigation */}
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
