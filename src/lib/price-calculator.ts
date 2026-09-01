// ============================================
// BOUNCERS ON TIPS — Price Calculator
// ============================================

import { ProfessionalLevel, PhysicalPresence, PriceBreakdown } from './types';
import { LEVEL_OPTIONS } from './mock-data';

const PRESENCE_MULTIPLIER: Record<PhysicalPresence, number> = {
  STANDARD: 1,
  LARGE: 1.15,
  HIGH: 1.25,
};

const PLATFORM_FEE_PERCENT = 0.08; // 8%

export function calculatePrice(
  level: ProfessionalLevel,
  count: number,
  duration: number,
  presence: PhysicalPresence = 'STANDARD'
): PriceBreakdown {
  const levelOption = LEVEL_OPTIONS.find(l => l.level === level)!;
  const baseRate = levelOption.baseRate;
  const presenceMultiplied = Math.round(baseRate * PRESENCE_MULTIPLIER[presence]);
  const subtotal = presenceMultiplied * count * duration;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT);
  const total = subtotal + platformFee;

  return {
    level,
    baseRate: presenceMultiplied,
    count,
    duration,
    subtotal,
    platformFee,
    total,
  };
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
