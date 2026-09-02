'use client';

import React, { useState, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function LiquidMetalButton({
  label = "Continue",
  onClick,
  viewMode = "text",
  className = "",
  icon: CustomIcon,
  fullWidth = true,
  disabled = false,
}: LiquidMetalButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleCount = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundEffects.playTap();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: rippleCount.current++ };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick();
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}>



      {/* 1. Outer Liquid Glow Ring & Ambient Drop Shadow */}
      <div
        className={`relative ${fullWidth ? "w-full" : "w-auto"} rounded-full p-[1.5px] liquid-outer-glow transition-all duration-300 ${
          isHovered
            ? "shadow-[0_0_30px_rgba(245,158,11,0.6),0_0_12px_rgba(253,224,71,0.8)] scale-[1.01]"
            : "shadow-[0_0_20px_rgba(245,158,11,0.35),0_4px_12px_rgba(0,0,0,0.8)]"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {/* 2. Glassmorphic Surface Body */}
        <div
          className={`relative w-full rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center ${
            viewMode === "icon" ? "h-11 w-11" : "h-12 px-6"
          }`}
          style={{
            background: "linear-gradient(180deg, #181b24 0%, #0c0e14 60%, #06070a 100%)",
            boxShadow: isPressed
              ? "inset 0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(245,158,11,0.4)"
              : "inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.7)",
          }}
        >
          {/* Top Liquid Glass Highlight Arc */}
          <div
            className="absolute top-0 left-2 right-2 h-1/2 rounded-t-full pointer-events-none opacity-40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(245,158,11,0.1) 80%, transparent 100%)",
            }}
          />

          {/* Label & Icon Display */}
          <div className="relative z-20 flex items-center justify-center gap-2 pointer-events-none select-none">
            {viewMode === "icon" ? (
              CustomIcon ? (
                <CustomIcon size={18} className="text-amber-300 drop-shadow-[0_1px_4px_rgba(245,158,11,0.8)]" />
              ) : (
                <Sparkles size={18} className="text-amber-300 drop-shadow-[0_1px_4px_rgba(245,158,11,0.8)]" />
              )
            ) : (
              <>
                <span
                  className="font-black text-sm tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  style={{ letterSpacing: "0.3px" }}
                >
                  {label}
                </span>
                {CustomIcon ? (
                  <CustomIcon
                    size={17}
                    className="text-amber-300 drop-shadow-[0_1px_6px_rgba(245,158,11,0.8)] transition-transform duration-200 group-hover:translate-x-1"
                  />
                ) : (
                  <ArrowRight
                    size={17}
                    className="text-amber-300 drop-shadow-[0_1px_6px_rgba(245,158,11,0.8)]"
                  />
                )}
              </>
            )}
          </div>

          {/* Interactive Button Click Target with Tactile Ripple Feedback */}
          <button
            ref={buttonRef}
            type="button"
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            aria-label={label}
            className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer outline-none z-30 overflow-hidden rounded-full"
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                style={{
                  position: "absolute",
                  left: `${r.x}px`,
                  top: `${r.y}px`,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(254,240,138,0.7) 0%, rgba(245,158,11,0.4) 50%, transparent 75%)",
                  pointerEvents: "none",
                  animation: "liquid-ripple 0.6s ease-out forwards",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
