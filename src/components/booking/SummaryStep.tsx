'use client';

import { useRouter } from 'next/navigation';
import { useBookingStore, formatTime12 } from '@/stores/booking-store';
import { formatPrice } from '@/lib/price-calculator';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Shield, Sparkles, ChevronRight } from 'lucide-react';

export default function SummaryStep() {
  const router = useRouter();
  const store = useBookingStore();
  const pricing = store.getPricing();
  const endTime = store.getEndTime();

  const handleConfirm = () => {
    store.setBookingStatus('SEARCHING');
    router.push('/book/live');
  };

  const dateFormatted = store.date
    ? new Date(store.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">Booking Summary</h2>
      <p className="text-bot-text-secondary mb-8">Review your booking details before confirming</p>

      {/* Booking Card */}
      <div className="rounded-2xl bg-bot-card border border-bot-border overflow-hidden mb-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-bot-gold/10 to-transparent border-b border-bot-border">
          <h3 className="text-lg font-bold text-bot-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-bot-gold" />
            YOUR BOOKING
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <SummaryRow label="Purpose" value={store.purposeLabel} />
          <SummaryRow label="Professionals" value={`${store.count} ${store.genderPreference !== 'ANY' ? store.genderPreference.charAt(0) + store.genderPreference.slice(1).toLowerCase() : ''}`} />
          <SummaryRow label="Level" value={store.level} highlight />
          <SummaryRow label="Presence" value={store.presence.charAt(0) + store.presence.slice(1).toLowerCase()} />

          <div className="flex items-start gap-3 py-3 border-t border-bot-border">
            <MapPin className="w-4 h-4 text-bot-gold mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-bot-text-secondary">Location</div>
              <div className="text-sm text-bot-white font-medium">{store.location?.shortAddress || store.location?.address || 'Not selected'}</div>
              {store.location?.address && store.location.shortAddress && (
                <div className="text-xs text-bot-text-secondary">{store.location.address}</div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-t border-bot-border">
            <Calendar className="w-4 h-4 text-bot-gold mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-bot-text-secondary">Date & Time</div>
              <div className="text-sm text-bot-white font-medium">{dateFormatted}</div>
              <div className="text-sm text-bot-gold font-semibold">
                {formatTime12(store.startTime)} → {formatTime12(endTime)}
                <span className="text-bot-text-secondary font-normal ml-2">({store.duration} {store.duration === 1 ? 'hour' : 'hours'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="px-6 py-4 bg-bot-elevated border-t border-bot-border">
          <h4 className="text-sm font-semibold text-bot-white mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-bot-text-secondary">
              <span>Base Rate ({store.level})</span>
              <span>{formatPrice(pricing.baseRate)}/hr</span>
            </div>
            <div className="flex justify-between text-bot-text-secondary">
              <span>{store.count} {store.count === 1 ? 'bouncer' : 'bouncers'} × {store.duration} hrs</span>
              <span>{formatPrice(pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-bot-text-secondary">
              <span>Platform Fee</span>
              <span>{formatPrice(pricing.platformFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-bot-border text-lg font-bold">
              <span className="text-bot-white">Estimated Total</span>
              <span className="text-bot-gold">{formatPrice(pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={store.prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleConfirm}
          className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-bot-bg font-bold text-lg hover:shadow-lg hover:shadow-bot-gold/25 transition-all hover:-translate-y-0.5"
        >
          <Sparkles className="w-5 h-5" />
          CONFIRM & FIND BOUNCERS
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-bot-text-secondary">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-bot-gold' : 'text-bot-white'}`}>{value}</span>
    </div>
  );
}
