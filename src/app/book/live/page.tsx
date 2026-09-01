'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBookingStore } from '@/stores/booking-store';
import { createSimulation, SimulationState } from '@/lib/demo-engine';
import Navbar from '@/components/layout/Navbar';
import BouncersRadar from '@/components/radar/BouncersRadar';
import ResponseCard from '@/components/radar/ResponseCard';
import { CheckCircle2, ArrowRight, Shield, Zap } from 'lucide-react';

export default function LiveRequestPage() {
  const router = useRouter();
  const store = useBookingStore();
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const simRef = useRef<ReturnType<typeof createSimulation> | null>(null);
  const startedRef = useRef(false);

  const handleUpdate = useCallback((state: SimulationState) => {
    setSimState({ ...state });
    store.setSimulationState(state);

    if (state.phase === 'confirmed') {
      const accepted = state.responses.filter(r => r.status === 'ACCEPTED');
      store.setConfirmedTeam(accepted.map(r => r.professional));
      store.setBookingStatus('CONFIRMED');
    }
  }, [store]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const sim = createSimulation({
      requiredCount: store.count || 2,
      totalNotified: Math.min(18, Math.max((store.count || 2) * 3, 8)),
      level: store.level,
      genderPreference: store.genderPreference,
      serviceLocation: store.location || { lat: 12.9784, lng: 77.6408 },
    });

    simRef.current = sim;
    sim.start(handleUpdate);

    return () => {
      sim.stop();
    };
  }, [store.count, store.level, store.genderPreference, store.location, handleUpdate]);

  const isConfirmed = simState?.phase === 'confirmed';

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Status & Brand */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-2">
              <div className="relative h-10 w-28">
                <Image src="/logo.png" alt="BOT" fill className="object-contain" />
              </div>
            </div>

            {isConfirmed ? (
              <div className="animate-bounce-in">
                <div className="w-14 h-14 rounded-2xl bg-bot-success/20 text-bot-success border border-bot-success/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-bot-success/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-bot-white mb-1">
                  Protection Team Confirmed!
                </h1>
                <p className="text-sm text-bot-text-secondary">
                  {store.count || 2} / {store.count || 2} verified professionals locked in
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-bot-white mb-1 flex items-center justify-center gap-2">
                  <span>Pinging Nearby Units</span>
                  <span className="flex gap-1 text-bot-gold">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-bot-text-secondary">
                  <span className="text-bot-gold font-bold">{simState?.acceptedCount ?? 0} of {store.count || 2} Accepted</span>
                  {simState && simState.acceptedCount < (store.count || 2) && (
                    <span> • Searching 5km radius around {store.location?.shortAddress || 'venue'}...</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Radar Component */}
            <div className="lg:col-span-1">
              <BouncersRadar simState={simState} required={store.count || 2} />
            </div>

            {/* Right: Real-time Live Bouncer Stream */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-bot-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-bot-gold" />
                  Live Dispatch Stream
                </h3>
                <span className="text-[10px] text-bot-gold font-bold">Auto-matching</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                {simState?.responses.map((response, i) => (
                  <ResponseCard key={response.professional.id} response={response} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* View Team CTA Button */}
          {isConfirmed && (
            <div className="mt-8 text-center animate-slide-up">
              <button
                onClick={() => router.push('/book/team')}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl btn-neon-gold text-sm sm:text-base font-black flex items-center justify-center gap-2 mx-auto"
              >
                VIEW MY PROTECTION TEAM
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
