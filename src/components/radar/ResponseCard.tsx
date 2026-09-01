'use client';

import { BookingResponse } from '@/lib/types';
import { MaleBouncerAvatar, FemaleBouncerAvatar } from '@/components/ui/BouncerAvatars';
import { CheckCircle2, XCircle, Clock, MapPin, Star, Shield } from 'lucide-react';

interface Props {
  response: BookingResponse;
  index: number;
}

export default function ResponseCard({ response, index }: Props) {
  const { professional: p, status, distance } = response;
  const isAccepted = status === 'ACCEPTED';
  const isRejected = status === 'REJECTED';
  const isPending = status === 'PENDING';
  const isExpired = status === 'EXPIRED';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-500 ${
        isAccepted
          ? 'bg-bot-success/10 border-bot-success shadow-lg shadow-bot-success/10 animate-bounce-in scale-[1.01]'
          : isRejected
          ? 'bg-bot-danger/5 border-bot-danger/30 opacity-50'
          : isExpired
          ? 'bg-bot-card border-bot-border opacity-40'
          : 'bg-bot-card border-bot-border hover:border-bot-gold/40'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3.5">
        {/* Custom Bouncer Avatar (Male or Female) */}
        <div className="relative flex-shrink-0">
          {p.gender === 'Female' ? (
            <FemaleBouncerAvatar className="w-12 h-12" />
          ) : (
            <MaleBouncerAvatar className="w-12 h-12" />
          )}
          {isAccepted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-bot-success text-bot-bg rounded-full flex items-center justify-center font-black text-[9px] shadow">
              ✓
            </div>
          )}
        </div>

        {/* Info Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-bot-white truncate">{p.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-bot-elevated text-bot-gold font-bold">{p.code}</span>
            {p.isVerified && <Shield className="w-3.5 h-3.5 text-bot-gold flex-shrink-0" />}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-bot-text-secondary">
            <span className="flex items-center gap-0.5 text-bot-gold font-bold">
              <Star className="w-3 h-3 fill-bot-gold text-bot-gold" />
              {p.rating}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-bot-elevated text-[10px] text-bot-white font-medium">{p.level}</span>
            <span className="flex items-center gap-0.5 text-bot-text-secondary">
              <MapPin className="w-3 h-3" />
              {distance} km away
            </span>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div className="flex-shrink-0">
          {isAccepted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bot-success/20 border border-bot-success text-bot-success text-xs font-black">
              <CheckCircle2 className="w-4 h-4" />
              ACCEPTED
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bot-danger/20 border border-bot-danger text-bot-danger text-xs font-bold">
              <XCircle className="w-4 h-4" />
              DECLINED
            </div>
          )}
          {isPending && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bot-gold/15 border border-bot-gold/40 text-bot-gold text-xs font-bold animate-pulse">
              <Clock className="w-4 h-4 animate-spin" />
              WAITING
            </div>
          )}
          {isExpired && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bot-elevated text-bot-text-secondary text-[11px] font-semibold">
              EXPIRED
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
