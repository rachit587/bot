'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  ArrowRight,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound-effects';

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function FakePaymentModal({ amount, onSuccess, onClose }: PaymentModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handlePay = () => {
    soundEffects.playTap();
    setIsProcessing(true);
    setStatusText('Connecting to Bank Escrow Gateway...');

    // Snappy, realistic 800ms authorization flow for presentations
    setTimeout(() => {
      setStatusText('Payment Confirmed ✅');
      soundEffects.playSuccessChime();
    }, 450);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#0d0e14] border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-white overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock size={14} />
            </div>
            <div>
              <div className="text-xs font-black text-white">BOT Escrow Payment</div>
              <div className="text-[9.5px] text-zinc-400 font-medium">256-Bit Bank Encryption</div>
            </div>
          </div>
          <button
            disabled={isProcessing}
            onClick={() => {
              soundEffects.playTap();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Amount Box */}
        <div className="my-3 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Total Escrow Amount
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight mt-0.5">
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[9.5px] text-emerald-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <ShieldCheck size={11} /> Held securely until mission is completed
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2.5 mb-4">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            Select Payment Method
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'upi', label: 'UPI Fast', icon: Smartphone },
              { id: 'card', label: 'Cards', icon: CreditCard },
              { id: 'netbanking', label: 'NetBank', icon: Building2 },
              { id: 'cash', label: 'Pay Later', icon: Banknote },
            ].map((m) => {
              const Icon = m.icon;
              const sel = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playTap();
                    setMethod(m.id as any);
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    sel
                      ? 'bg-amber-400 text-black font-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold'
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-[9px]">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* UPI Apps Selection */}
          {method === 'upi' && (
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
              <div className="text-[9.5px] font-bold text-zinc-400">INSTANT UPI APPS</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'gpay', name: 'Google Pay', tag: 'Fast' },
                  { id: 'phonepe', name: 'PhonePe', tag: 'Popular' },
                  { id: 'paytm', name: 'Paytm UPI', tag: 'Instant' },
                  { id: 'cred', name: 'CRED Pay', tag: 'Secure' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playTap();
                      setUpiApp(app.id as any);
                    }}
                    className={`p-2 rounded-lg text-left border flex items-center justify-between transition-all cursor-pointer ${
                      upiApp === app.id
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{app.name}</span>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-black">
                      {app.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1 text-xs text-zinc-400">
              <div className="flex justify-between items-center text-zinc-300 font-bold text-[11px]">
                <span>Saved Card</span>
                <span className="text-amber-400 font-mono text-[10px]">VISA / MC</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                •••• •••• •••• 4242 (Express)
              </div>
            </div>
          )}

          {method === 'cash' && (
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-300">
              💵 Hand cash to lead security captain after mission is completed.
            </div>
          )}
        </div>

        {/* Action Button */}
        {isProcessing ? (
          <div className="w-full py-3.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-amber-400" />
            <span>{statusText}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePay}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-xs transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Authorize & Pay ₹{amount.toLocaleString('en-IN')}</span>
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        )}

        <div className="mt-2 text-center text-[9px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldCheck size={11} className="text-amber-400" />
          <span>100% Refund if no bouncer accepts</span>
        </div>
      </div>
    </div>
  );
}
