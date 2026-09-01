'use client';

import { SimulationState } from '@/lib/demo-engine';
import { useEffect, useRef } from 'react';

interface Props {
  simState: SimulationState | null;
  required: number;
}

export default function BouncersRadar({ simState, required }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const accepted = simState?.acceptedCount ?? 0;
  const rejected = simState?.rejectedCount ?? 0;
  const waiting = simState?.waitingCount ?? 0;
  const total = simState?.notifiedCount ?? 0;
  const isConfirmed = simState?.phase === 'confirmed';
  const progress = required > 0 ? Math.min(accepted / required, 1) : 0;

  // Radar animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    const center = size / 2;

    function draw() {
      ctx.clearRect(0, 0, size, size);
      timeRef.current += 0.016;
      const t = timeRef.current;

      // Background circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(center, center, i * 28, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 168, 67, ${0.06 + (3 - i) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Sweep (only when searching)
      if (!isConfirmed) {
        const angle = t * 1.2;
        const grad = ctx.createConicGradient(angle, center, center);
        grad.addColorStop(0, 'rgba(212, 168, 67, 0.2)');
        grad.addColorStop(0.15, 'rgba(212, 168, 67, 0)');
        grad.addColorStop(1, 'rgba(212, 168, 67, 0)');
        ctx.beginPath();
        ctx.arc(center, center, 84, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Progress ring
      const ringRadius = 72;
      const ringWidth = 6;

      // Background ring
      ctx.beginPath();
      ctx.arc(center, center, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(48, 48, 48, 0.8)';
      ctx.lineWidth = ringWidth;
      ctx.stroke();

      // Progress arc
      if (progress > 0) {
        ctx.beginPath();
        ctx.arc(center, center, ringRadius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.strokeStyle = isConfirmed ? '#22C55E' : '#D4A843';
        ctx.lineWidth = ringWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.lineCap = 'butt';
      }

      // Center text
      ctx.fillStyle = '#F5F5F5';
      ctx.font = 'bold 28px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${accepted}/${required}`, center, center - 6);

      ctx.fillStyle = '#A0A0A0';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText('FOUND', center, center + 16);

      // Bouncer dots
      const responses = simState?.responses ?? [];
      responses.forEach((r, i) => {
        const angle = (i / Math.max(responses.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const radius = 55 + Math.sin(t * 0.5 + i) * 3;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const dotSize = 4;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle =
          r.status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.9)' :
          r.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.5)' :
          r.status === 'EXPIRED' ? 'rgba(100, 100, 100, 0.4)' :
          `rgba(212, 168, 67, ${0.4 + Math.sin(t * 3 + i) * 0.3})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [simState, accepted, required, progress, isConfirmed]);

  return (
    <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-xs font-bold text-bot-gold uppercase tracking-[0.2em]">Bouncers Radar</h3>
      </div>

      {/* Radar Canvas */}
      <div className="flex justify-center mb-6">
        <canvas ref={canvasRef} />
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <StatBar label="Accepted" count={accepted} total={total} color="bg-bot-success" />
        <StatBar label="Rejected" count={rejected} total={total} color="bg-bot-danger" />
        <StatBar label="Waiting" count={waiting} total={total} color="bg-bot-gold" />
      </div>

      {/* Status Text */}
      <div className="mt-4 text-center">
        {isConfirmed ? (
          <div className="px-4 py-2 rounded-lg bg-bot-success/10 border border-bot-success/30">
            <span className="text-sm font-semibold text-bot-success">✓ Team Confirmed</span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-lg bg-bot-gold/10 border border-bot-gold/30">
            <span className="text-sm text-bot-gold font-medium">Finding your team...</span>
          </div>
        )}
      </div>

      {/* Notified count */}
      <div className="mt-3 text-center text-xs text-bot-text-secondary">
        {total} nearby professionals notified
      </div>
    </div>
  );
}

function StatBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-bot-text-secondary">{label}</span>
        <span className="text-bot-white font-semibold">{count}</span>
      </div>
      <div className="h-2 bg-bot-elevated rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
