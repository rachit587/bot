'use client';

import { useBookingStore, formatTime12 } from '@/stores/booking-store';
import { DURATION_OPTIONS } from '@/lib/mock-data';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

export default function DateTimeStep() {
  const { date, setDate, startTime, setStartTime, duration, setDuration, nextStep, prevStep, getEndTime } = useBookingStore();

  const endTime = getEndTime();

  // Generate next 14 days
  const dates: { label: string; value: string; day: string }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: d.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
    });
  }

  // Time slots
  const timeSlots: string[] = [];
  for (let h = 6; h < 24; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    timeSlots.push(`${String(h).padStart(2, '0')}:30`);
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">When do you need them?</h2>
      <p className="text-bot-text-secondary mb-8">Pick a date, time, and how long you need your team</p>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-bot-white mb-3">
          <Calendar className="w-4 h-4 text-bot-gold" /> Date
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => setDate(d.value)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border text-center transition-all min-w-[80px] ${
                date === d.value
                  ? 'bg-bot-gold/10 border-bot-gold text-bot-gold'
                  : 'bg-bot-card border-bot-border text-bot-text-secondary hover:border-bot-gold/30'
              }`}
            >
              <div className="text-xs">{d.day}</div>
              <div className="text-sm font-semibold mt-0.5">{d.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-bot-white mb-3">
          <Clock className="w-4 h-4 text-bot-gold" /> Start Time
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-2">
          {timeSlots.map((t) => (
            <button
              key={t}
              onClick={() => setStartTime(t)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center transition-all ${
                startTime === t
                  ? 'bg-bot-gold/10 border-bot-gold text-bot-gold'
                  : 'bg-bot-card border-bot-border text-bot-text-secondary hover:border-bot-gold/30'
              }`}
            >
              {formatTime12(t)}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-bot-white mb-3">
          <Clock className="w-4 h-4 text-bot-gold" /> Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((h) => (
            <button
              key={h}
              onClick={() => setDuration(h)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                duration === h
                  ? 'bg-bot-gold/10 border-bot-gold text-bot-gold'
                  : 'bg-bot-card border-bot-border text-bot-text-secondary hover:border-bot-gold/30'
              }`}
            >
              {h} {h === 1 ? 'hour' : 'hours'}
            </button>
          ))}
        </div>
      </div>

      {/* Time Summary */}
      {date && startTime && (
        <div className="p-4 rounded-xl bg-bot-card border border-bot-gold/30 mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs text-bot-text-secondary">Your booking window</div>
            <div className="text-lg font-bold text-bot-white">
              {formatTime12(startTime)} → {formatTime12(endTime)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-bot-text-secondary">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div className="text-sm font-semibold text-bot-gold">{duration} {duration === 1 ? 'hour' : 'hours'}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={nextStep}
          disabled={!date}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-gold text-bot-bg font-semibold hover:shadow-lg hover:shadow-bot-gold/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
