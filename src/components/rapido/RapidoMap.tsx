'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Shield, Compass, Star } from 'lucide-react';
import { MOCK_PROFESSIONALS } from '@/lib/mock-data';
import { Professional } from '@/lib/types';

interface RapidoMapProps {
  center: { lat: number; lng: number; address: string };
  onLocationChange: (loc: { lat: number; lng: number; address: string }) => void;
  assignedTeam?: Professional[];
  isMatching?: boolean;
  serviceRadiusKm?: number;
}

export default function RapidoMap({
  center,
  onLocationChange,
  assignedTeam = [],
  isMatching = false,
  serviceRadiusKm = 5,
}: RapidoMapProps) {
  const [bouncers, setBouncers] = useState(MOCK_PROFESSIONALS.slice(0, 12));
  const [isLocating, setIsLocating] = useState(false);
  const [isDraggingPin, setIsDraggingPin] = useState(false);
  const [pinOffset, setPinOffset] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Subtle simulated movement of nearby bouncers on the map (like Rapido bike captains)
  useEffect(() => {
    const interval = setInterval(() => {
      setBouncers((prev) =>
        prev.map((b) => ({
          ...b,
          location: {
            ...b.location,
            lat: b.location.lat + (Math.random() - 0.5) * 0.0006,
            lng: b.location.lng + (Math.random() - 0.5) * 0.0006,
          },
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onLocationChange({
            lat: latitude,
            lng: longitude,
            address: `Current GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-[#0d0f12] overflow-hidden select-none">
      {/* Dark Map Vector Styling (Roads, Blocks, Urban Grid) */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="road-grid-main" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* City blocks */}
            <rect width="112" height="112" fill="#13161c" rx="4" />
            {/* Major road network */}
            <path d="M 0 116 L 120 116 M 116 0 L 116 120" stroke="#1f242e" strokeWidth="6" />
            <path d="M 0 116 L 120 116 M 116 0 L 116 120" stroke="#2a303d" strokeWidth="2" strokeDasharray="6 6" />
            {/* Inner lanes */}
            <path d="M 40 0 L 40 112 M 0 60 L 112 60" stroke="#181c24" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#road-grid-main)" />
      </svg>

      {/* Street / Landmark Labels (Bengaluru hotspots) */}
      <div className="absolute top-[22%] left-[18%] text-[11px] font-bold text-[#4b5563] pointer-events-none uppercase tracking-wider">
        100ft Road • Indiranagar
      </div>
      <div className="absolute top-[68%] left-[62%] text-[11px] font-bold text-[#4b5563] pointer-events-none uppercase tracking-wider">
        Sony World Jxn • Koramangala
      </div>
      <div className="absolute top-[35%] right-[15%] text-[11px] font-bold text-[#4b5563] pointer-events-none uppercase tracking-wider">
        ITPL Main • Whitefield
      </div>
      <div className="absolute bottom-[28%] left-[25%] text-[11px] font-bold text-[#4b5563] pointer-events-none uppercase tracking-wider">
        27th Main • HSR Layout
      </div>

      {/* Pulsing Radar Range Circles around Service Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[480px] h-[480px] rounded-full border border-bot-gold/15 bg-bot-gold/[0.02] animate-pulse-gold" />
        <div className="absolute inset-0 m-auto w-[300px] h-[300px] rounded-full border border-bot-gold/25" />
        <div className="absolute inset-0 m-auto w-[140px] h-[140px] rounded-full border border-bot-gold/40 bg-bot-gold/[0.05]" />
        
        {isMatching && (
          <div className="absolute inset-0 m-auto w-[460px] h-[460px] rounded-full border-2 border-bot-gold/40 animate-ping opacity-30" />
        )}
      </div>

      {/* Live Nearby Available Bouncers on the Map (Rapido Captains Style) */}
      {bouncers.map((b, idx) => {
        const isMale = b.gender === 'Male';
        // Distribute coordinates realistically around center
        const xPos = 50 + ((idx * 19) % 70) - 35;
        const yPos = 48 + ((idx * 23 + 7) % 65) - 32;

        return (
          <div
            key={b.id}
            className="absolute z-10 transition-all duration-1000 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`,
            }}
          >
            {/* Captain Pin */}
            <div className="relative flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#171717] border-2 border-bot-gold shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center transition-transform group-hover:scale-125">
                <span className="text-xs font-black text-bot-gold">
                  {isMale ? '♂' : '♀'}
                </span>
              </div>
              {/* Mini Label */}
              <div className="px-1.5 py-0.5 rounded bg-black/90 border border-bot-border text-[9px] font-bold text-white mt-0.5 whitespace-nowrap shadow">
                {b.name} ({b.level[0]})
              </div>
            </div>
          </div>
        );
      })}

      {/* EN-ROUTE ASSIGNED BOUNCERS (Moving towards user) */}
      {assignedTeam.map((captain, i) => (
        <div
          key={captain.id}
          className="absolute z-30 transition-all duration-1000 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${45 + (i === 0 ? -12 : 12)}%`,
            top: `${42 + (i === 0 ? -10 : 10)}%`,
          }}
        >
          <div className="flex flex-col items-center animate-bounce">
            <div className="px-2 py-0.5 rounded-full bg-bot-success text-black text-[9px] font-black uppercase shadow-lg">
              En Route • {4 + i * 2}m
            </div>
            <div className="w-9 h-9 rounded-full bg-bot-card border-2 border-bot-success text-bot-success flex items-center justify-center font-bold text-xs shadow-xl mt-0.5">
              🛡️
            </div>
          </div>
        </div>
      ))}

      {/* CENTRAL SERVICE DESTINATION PIN (THE USER'S LOCATION) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex flex-col items-center -mt-8">
          {/* Glowing Target Badge */}
          <div className="px-3 py-1 rounded-full bg-bot-card/95 border border-bot-gold text-white text-[11px] font-extrabold shadow-2xl whitespace-nowrap mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-bot-gold animate-ping" />
            <span>{center.address.split(',')[0]}</span>
          </div>

          {/* Golden Pin */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bot-gold-dark via-bot-gold to-bot-gold-bright text-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(245,158,11,0.8)] border-2 border-white">
            <MapPin className="w-5 h-5 fill-black stroke-white" />
          </div>
          <div className="w-2 h-4 bg-bot-gold shadow-md -mt-1 rounded-b" />
          {/* Ground shadow */}
          <div className="w-6 h-2 bg-black/60 rounded-full blur-[2px] mt-0.5" />
        </div>
      </div>

      {/* Floating GPS 'Locate Me' Button */}
      <button
        onClick={handleLocateMe}
        className="absolute top-20 right-4 z-30 p-3 rounded-2xl glass-surface border border-bot-border hover:border-bot-gold text-bot-gold shadow-2xl transition-transform active:scale-95 flex items-center justify-center"
        title="Locate Me on Map"
      >
        <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
