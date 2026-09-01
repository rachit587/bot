'use client';

import { useEffect, useState, useRef } from 'react';

export default function HeroRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const bouncers = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2 + Math.random() * 0.5,
      radius: 60 + Math.random() * 70,
      speed: 0.003 + Math.random() * 0.004,
      size: 4 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.6,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx.clearRect(0, 0, size, size);
      time += 0.016;

      // Radar circles
      for (let i = 1; i <= 3; i++) {
        const r = i * 45;
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 168, 67, ${0.08 + (3 - i) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Radar sweep
      const sweepAngle = time * 0.8;
      const gradient = ctx.createConicGradient(sweepAngle, center, center);
      gradient.addColorStop(0, 'rgba(212, 168, 67, 0.15)');
      gradient.addColorStop(0.1, 'rgba(212, 168, 67, 0)');
      gradient.addColorStop(1, 'rgba(212, 168, 67, 0)');
      ctx.beginPath();
      ctx.arc(center, center, 135, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Center point (user location)
      ctx.beginPath();
      ctx.arc(center, center, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#D4A843';
      ctx.fill();

      // Center pulse
      const pulseR = 8 + Math.sin(time * 2) * 6;
      ctx.beginPath();
      ctx.arc(center, center, pulseR + 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212, 168, 67, ${0.3 - Math.sin(time * 2) * 0.15})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bouncer dots
      bouncers.forEach((b) => {
        b.angle += b.speed;
        const x = center + Math.cos(b.angle) * b.radius;
        const y = center + Math.sin(b.angle) * b.radius;
        const pulse = Math.sin(time * 3 + b.pulsePhase) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, b.size + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${b.opacity * (0.7 + pulse)})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, b.size + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${0.1 * b.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [mounted]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} className={`transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-bot-gold/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
