// ============================================
// BOUNCERS ON TIPS — Demo Simulation Engine
// ============================================

import { BookingResponse, Professional, ResponseStatus } from './types';
import { MOCK_PROFESSIONALS } from './mock-data';

export interface SimulationConfig {
  requiredCount: number;
  totalNotified: number;
  level: string;
  genderPreference: string;
  serviceLocation: { lat: number; lng: number };
}

export interface SimulationState {
  phase: 'idle' | 'searching' | 'matching' | 'confirmed' | 'failed';
  notifiedCount: number;
  responses: BookingResponse[];
  acceptedCount: number;
  rejectedCount: number;
  waitingCount: number;
  requiredCount: number;
  elapsedMs: number;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function selectNearbyBouncers(config: SimulationConfig): Professional[] {
  let pool = MOCK_PROFESSIONALS.filter(p => p.isOnline && p.availability !== 'offline');

  if (config.genderPreference === 'MALE') pool = pool.filter(p => p.gender === 'Male');
  else if (config.genderPreference === 'FEMALE') pool = pool.filter(p => p.gender === 'Female');

  return pool
    .map(p => ({
      ...p,
      _dist: getDistance(config.serviceLocation.lat, config.serviceLocation.lng, p.location.lat, p.location.lng),
    }))
    .sort((a, b) => a._dist - b._dist)
    .slice(0, config.totalNotified)
    .map(({ _dist, ...p }) => ({ ...p })); // remove temp field
}

export function createSimulation(config: SimulationConfig): {
  getState: () => SimulationState;
  start: (onUpdate: (state: SimulationState) => void) => void;
  stop: () => void;
} {
  const nearbyBouncers = selectNearbyBouncers(config);
  const totalNotified = nearbyBouncers.length;
  let stopped = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const state: SimulationState = {
    phase: 'idle',
    notifiedCount: 0,
    responses: [],
    acceptedCount: 0,
    rejectedCount: 0,
    waitingCount: 0,
    requiredCount: config.requiredCount,
    elapsedMs: 0,
  };

  function getState() {
    return { ...state };
  }

  function start(onUpdate: (state: SimulationState) => void) {
    stopped = false;
    state.phase = 'searching';
    state.notifiedCount = totalNotified;
    state.waitingCount = totalNotified;

    // Create initial pending responses
    state.responses = nearbyBouncers.map(p => ({
      bookingId: 'sim',
      professional: p,
      status: 'PENDING' as ResponseStatus,
      requestedAt: new Date().toISOString(),
      distance: +(getDistance(config.serviceLocation.lat, config.serviceLocation.lng, p.location.lat, p.location.lng)).toFixed(1),
      estimatedEarnings: 0,
    }));

    onUpdate(getState());

    // After 1s, move to matching phase
    timers.push(setTimeout(() => {
      if (stopped) return;
      state.phase = 'matching';
      onUpdate(getState());
    }, 1000));

    // Schedule responses with varied timing
    nearbyBouncers.forEach((bouncer, index) => {
      const delay = 2000 + Math.random() * 8000 + index * 500;

      timers.push(setTimeout(() => {
        if (stopped) return;

        const response = state.responses.find(r => r.professional.id === bouncer.id);
        if (!response) return;

        // Determine accept/reject — favor acceptance until we reach required count
        const needMore = state.acceptedCount < config.requiredCount;
        const acceptChance = needMore ? 0.55 : 0.2;
        const accepted = Math.random() < acceptChance;

        response.status = accepted ? 'ACCEPTED' : 'REJECTED';
        response.respondedAt = new Date().toISOString();
        response.responseTimeMs = delay;

        if (accepted) {
          state.acceptedCount++;
          response.estimatedEarnings = Math.round(800 * config.requiredCount * 0.7);
        } else {
          state.rejectedCount++;
        }
        state.waitingCount = totalNotified - state.acceptedCount - state.rejectedCount;

        // Check if we've reached required count
        if (state.acceptedCount >= config.requiredCount) {
          state.phase = 'confirmed';
          stopped = true;
          // Set remaining waiting to expired
          state.responses.forEach(r => {
            if (r.status === 'PENDING') r.status = 'EXPIRED';
          });
          state.waitingCount = 0;
        }

        state.elapsedMs = delay;
        onUpdate(getState());
      }, delay));
    });

    // Timeout after 25s if not confirmed
    timers.push(setTimeout(() => {
      if (stopped) return;
      if (state.acceptedCount < config.requiredCount) {
        // Force remaining accepts to meet quota
        const pending = state.responses.filter(r => r.status === 'PENDING');
        for (const r of pending) {
          if (state.acceptedCount >= config.requiredCount) {
            r.status = 'EXPIRED';
          } else {
            r.status = 'ACCEPTED';
            r.respondedAt = new Date().toISOString();
            state.acceptedCount++;
          }
        }
        state.waitingCount = 0;
        state.phase = 'confirmed';
        stopped = true;
        onUpdate(getState());
      }
    }, 22000));
  }

  function stop() {
    stopped = true;
    timers.forEach(clearTimeout);
  }

  return { getState, start, stop };
}
