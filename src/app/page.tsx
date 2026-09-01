'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Users,
  PartyPopper,
  GraduationCap,
  Heart,
  Building2,
  Crown,
  Plane,
  ShieldAlert,
  Search,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Phone,
  MessageCircle,
  Home as HomeIcon,
  Bookmark,
  User as UserIcon,
  MapPin,
  Zap,
  ChevronDown,
  Plus,
  Minus,
  ShieldQuestion,
  Sparkles,
  Radio as RadarIcon,
  ArrowRight,
  LogOut,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Award,
  Flame,
  Activity,
  Lock,
  Smartphone,
} from "lucide-react";
import { MaleBouncerAvatar, FemaleBouncerAvatar, MixedTeamAvatar } from "@/components/ui/BouncerAvatars";
import GoogleMapPicker from "@/components/maps/GoogleMapPicker";
import GoogleMapLiveTracking from "@/components/maps/GoogleMapLiveTracking";
import { useShaderBackground } from "@/components/ui/animated-shader-hero";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { FakePaymentModal } from "@/components/ui/FakePaymentModal";
import { soundEffects } from "@/lib/sound-effects";
import { HOTSPOT_LOCATIONS, DEFAULT_BENGALURU_COORDS } from "@/lib/google-maps-config";

/* -------------------------------------------------------------------------
   LUXURY DARK & NEON GOLD PALETTE
------------------------------------------------------------------------- */
const GOLD_GRAD = "linear-gradient(135deg, #FFFBEB 0%, #FDE047 30%, #F59E0B 70%, #D97706 100%)";
const CARD_BG = "rgba(16, 18, 25, 0.85)";

/* -------------------------------------------------------------------------
   CATEGORIES & PRESETS
------------------------------------------------------------------------- */
const PURPOSES = [
  { id: "womens", label: "Women's Safety", desc: "Close personal escort & night transit", icon: ShieldCheck, popular: true },
  { id: "personal", label: "Personal Protection", desc: "One-on-one discreet bodyguard", icon: UserIcon, popular: true },
  { id: "night", label: "Night Out / Clubbing", desc: "Lounge, bar, & nightlife escort", icon: Sparkles, popular: true },
  { id: "party", label: "Party & Club Entry", desc: "Gate screening & crowd deterrence", icon: PartyPopper },
  { id: "college", label: "College Fest / Event", desc: "Campus fests, freshers, & farewells", icon: GraduationCap },
  { id: "wedding", label: "Wedding Management", desc: "VIP guest escort & entry security", icon: Heart },
  { id: "corporate", label: "Corporate Event", desc: "Launches, summits, & offsites", icon: Building2 },
  { id: "vip", label: "VIP Close Protection", desc: "Executive high-profile protection", icon: Crown },
  { id: "travel", label: "Transit & Travel", desc: "Airport, railway station pick & drop", icon: Plane },
  { id: "other", label: "Custom Protection", desc: "Tailored private security squad", icon: ShieldQuestion },
];

const LEVELS = [
  {
    id: "standard",
    label: "Standard Security",
    desc: "Physical presence & crowd deterrence",
    rate: 500,
    tag: "Essential",
    features: ["Physical deterrence", "Arm guards equipped", "Uniformed presence"],
  },
  {
    id: "pro",
    label: "Pro Tactical Fighter",
    desc: "Martial arts & conflict de-escalation",
    rate: 800,
    tag: "Most Booked",
    popular: true,
    features: ["Martial arts certified", "Tactical forearm guards", "Bodycam equipped"],
  },
  {
    id: "elite",
    label: "Elite Close Protection",
    desc: "Ex-military / Black-suit tactical guard",
    rate: 1200,
    tag: "VIP Grade",
    features: ["Ex-Special Forces", "Kevlar & VIP Convoy", "Discreet tactical suit"],
  },
];

const PRESENCE = [
  { id: "standard", label: "Tactical Bouncer", sub: "Arm guards & heavy build" },
  { id: "large", label: "Heavy Muscle Deterrence", sub: "Bulkier frame & high authority" },
  { id: "high", label: "Black Suit VIP", sub: "Discreet close escort" },
];

const GENDERS = [
  { id: "female", label: "Female Specialist", desc: "Close Escort & High Agility", tag: "Recommended for Women" },
  { id: "male", label: "Bulky Male Guard", desc: "High Deterrence & Arm Guards", tag: "Heavy Crowd" },
  { id: "mixed", label: "Mixed Tactical Duo", desc: "Balanced Duo Protection", tag: "Popular" },
  { id: "any", label: "Fastest Dispatch", desc: "Any Gender Available (< 3 min)", tag: "Instant" },
];

const NAMES = [
  "Vikram Singh", "Priya Sharma", "Arjun Reddy", "Rohit Malhotra", "Sanya Verma",
  "Karan Thapar", "Aditya Rawat", "Neha Kapoor", "Kabir Khan", "Ananya Sen",
  "Dev Shekhawat", "Farhan Qureshi", "Meera Nair", "Rahul Deshmukh"
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeCandidate(genderPref: string) {
  const gender =
    genderPref === "mixed" || genderPref === "any"
      ? pick(["male", "female"])
      : genderPref;
  const femaleNames = ["Priya Sharma", "Sanya Verma", "Neha Kapoor", "Ananya Sen", "Meera Nair"];
  const maleNames = NAMES.filter((n) => !femaleNames.includes(n));
  const name = gender === "female" ? pick(femaleNames) : pick(maleNames);
  return {
    id: uid(),
    name,
    gender,
    code: "BOT-" + rand(100, 999),
    rating: (4.8 + Math.random() * 0.2).toFixed(1),
    distance: (0.5 + Math.random() * 2.2).toFixed(1),
    assignments: rand(120, 520),
    status: "waiting" as "waiting" | "accepted" | "rejected" | "expired",
  };
}

/* -------------------------------------------------------------------------
   TACTILE UI PRIMITIVES
------------------------------------------------------------------------- */
function TopBrandLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.6)]">
        <ShieldCheck size={22} className="text-black stroke-[2.5]" />
      </div>
      <div>
        <div className="text-sm sm:text-base font-black tracking-tight text-white leading-none">
          BOUNCERS ON TIPS
        </div>
        <div className="text-[9px] font-bold text-amber-400 tracking-widest uppercase mt-0.5">
          YOUR BACKUP. ON DEMAND.
        </div>
      </div>
    </div>
  );
}

function TopBar({
  title,
  onBack,
  stepText,
}: {
  title: string;
  onBack: () => void;
  stepText?: string;
}) {
  const handleBack = () => {
    soundEffects.playTap();
    onBack();
  };

  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-zinc-800/40">
      <button
        onClick={handleBack}
        className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-zinc-200 hover:text-amber-400 hover:border-amber-500/50 transition-all active:scale-95 shadow-lg cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="text-center">
        <div className="text-base sm:text-lg font-black text-zinc-100 tracking-tight">{title}</div>
        {stepText && <div className="text-[10.5px] font-bold text-amber-400 uppercase tracking-widest">{stepText}</div>}
      </div>
      <div className="w-10 h-10 flex items-center justify-center">
        <ShieldCheck size={20} className="text-amber-400/60" />
      </div>
    </div>
  );
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2 px-5 py-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{
            background:
              i < step
                ? "linear-gradient(90deg, #FDE047, #F59E0B)"
                : "rgba(255, 255, 255, 0.08)",
            boxShadow: i < step ? "0 0 10px rgba(245, 158, 11, 0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function Card({
  children,
  style,
  onClick,
  selected,
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const handleClick = () => {
    soundEffects.playTap();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-[0.99] hover:border-amber-500/50" : ""
      } ${className}`}
      style={{
        background: selected ? "rgba(35, 30, 20, 0.95)" : CARD_BG,
        border: `1.5px solid ${selected ? "#F59E0B" : "rgba(255, 255, 255, 0.08)"}`,
        padding: 16,
        boxShadow: selected
          ? "0 0 0 1px rgba(245, 158, 11, 0.4), 0 12px 30px -10px rgba(245, 158, 11, 0.35)"
          : "0 8px 24px -10px rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px)",
        ...style,
      }}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black shadow-md">
          <Check size={12} strokeWidth={3.5} />
        </div>
      )}
      {children}
    </div>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 w-full px-5 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] z-40 backdrop-blur-xl border-t border-zinc-800/40"
      style={{
        background: "linear-gradient(0deg, #07080B 90%, rgba(7,8,11,0.7) 98%, transparent)",
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN 1: LUXURY HERO & RADAR LANDING
------------------------------------------------------------------------- */
function LandingScreen({ go, toast }: { go: (step: string) => void; toast: (m: string) => void }) {
  return (
    <div className="min-h-full flex flex-col justify-between">
      {/* 1. TOP BRAND HEADER */}
      <div className="px-5 pt-5 flex items-center justify-between">
        <TopBrandLogo />
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black text-zinc-200 tracking-wide">18 Bouncers Active</span>
        </div>
      </div>

      {/* 2. HERO STATEMENT */}
      <div className="px-5 pt-5 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2.5">
          <Flame size={13} className="text-amber-400" />
          <span>India&apos;s 1st On-Demand Security App</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
          Your Backup. <br />
          <span
            style={{
              background: GOLD_GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            On Demand.
          </span>
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed">
          Book vetted bulky bouncers, women&apos;s safety specialists, and VIP bodyguards with live Google Maps telemetry.
        </p>
      </div>

      {/* 3. DYNAMIC RADAR VISUALIZER */}
      <div className="relative h-60 sm:h-72 my-2 flex items-center justify-center">
        <HeroRadarVisualizer />
      </div>

      {/* 4. PRIMARY CTAs WITH LIQUID METAL SHADER BUTTON */}
      <div className="px-5 flex flex-col gap-3">
        <div className="w-full flex justify-center">
          <LiquidMetalButton
            label="⚡ Book Bouncers Now"
            fullWidth={true}
            onClick={() => go("purpose")}
            icon={ArrowRight}
          />
        </div>
        <button
          type="button"
          onClick={() => toast("Bouncer Partner Onboarding is open.")}
          className="w-full py-3.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800 transition-all cursor-pointer backdrop-blur-md"
        >
          Become a BOT Partner
        </button>
      </div>

      {/* 5. TRUST & SAFETY BADGES */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center">
          <div>
            <div className="text-base font-black text-amber-400">4.9★</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">4,800+ Bookings</div>
          </div>
          <div className="border-x border-zinc-800">
            <div className="text-base font-black text-amber-400">&lt; 3m</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Fastest Match</div>
          </div>
          <div>
            <div className="text-base font-black text-emerald-400">100%</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Police Verified</div>
          </div>
        </div>
      </div>

      {/* 6. HOW IT WORKS */}
      <div className="px-5 pt-6 pb-6">
        <div className="text-xs font-black text-zinc-400 tracking-wider uppercase mb-2.5">
          HOW IT WORKS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { step: "1", title: "Select your requirement", desc: "Choose party, women's safety, or VIP guard" },
            { step: "2", title: "Choose squad & gear", desc: "Select male, female, or mixed armored squads" },
            { step: "3", title: "Instant escrow authorization", desc: "Secure 1-click UPI/Card payment" },
            { step: "4", title: "Fast radar dispatch", desc: "Nearby bouncers confirm in real time" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-black text-amber-400">
                {item.step}
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">{item.title}</div>
                <div className="text-[10.5px] text-zinc-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroRadarVisualizer() {
  const nearbyBouncers = [
    { name: "Priya S.", eta: "2m", isFemale: true, angle: 35, dist: 80 },
    { name: "Vikram R.", eta: "3m", isFemale: false, angle: 140, dist: 88 },
    { name: "Sanya V.", eta: "4m", isFemale: true, angle: 220, dist: 78 },
    { name: "Arjun K.", eta: "4m", isFemale: false, angle: 310, dist: 92 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {[70, 130, 190, 260].map((size, idx) => (
        <div
          key={idx}
          className="absolute rounded-full border border-amber-500/20"
          style={{
            width: size,
            height: size,
            boxShadow: idx === 1 ? "0 0 30px rgba(245, 158, 11, 0.1)" : "none",
          }}
        />
      ))}

      <div
        className="absolute w-64 h-64 rounded-full pointer-events-none animate-[spin_5s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(245,158,11,0.25) 0deg, rgba(245,158,11,0) 60deg, transparent 360deg)",
        }}
      />

      <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] border-2 border-white/80">
        <ShieldCheck size={32} className="text-black" />
      </div>

      {nearbyBouncers.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = Math.cos(rad) * b.dist;
        const y = Math.sin(rad) * b.dist;
        return (
          <div
            key={i}
            className="absolute z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/90 border border-amber-500/40 shadow-xl backdrop-blur-md"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {b.isFemale ? (
              <FemaleBouncerAvatar className="w-8 h-8" />
            ) : (
              <MaleBouncerAvatar className="w-8 h-8" />
            )}
            <div className="text-left leading-none">
              <div className="text-xs font-black text-zinc-100">{b.name}</div>
              <div className="text-[10px] font-bold text-amber-400">{b.eta} away</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------
   WIZARD STEPS
------------------------------------------------------------------------- */
function StepPurpose({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  return (
    <div>
      <TopBar title="What do you need backup for?" onBack={back} stepText="Step 1 of 7" />
      <ProgressDots step={1} total={7} />
      <div className="px-5 pb-6 grid grid-cols-2 gap-3">
        {PURPOSES.map((p) => {
          const Icon = p.icon;
          const sel = booking.purpose === p.id;
          return (
            <Card
              key={p.id}
              selected={sel}
              onClick={() => setBooking({ ...booking, purpose: p.id })}
              className="flex flex-col justify-between min-h-[112px]"
            >
              <div>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                    sel ? "bg-amber-400 text-black shadow-md" : "bg-zinc-800 text-amber-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="text-xs sm:text-sm font-black text-white leading-snug">{p.label}</div>
              </div>
              <div className="text-[10.5px] text-zinc-400 mt-1 leading-tight">{p.desc}</div>
            </Card>
          );
        })}
      </div>
      <BottomBar>
        <LiquidMetalButton
          label="Continue"
          fullWidth={true}
          onClick={next}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepCount({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  const count = booking.count || 2;
  const options = [1, 2, 3, 4, 5, 6, 8, 10];

  return (
    <div>
      <TopBar title="Squad Size & Lineup" onBack={back} stepText="Step 2 of 7" />
      <ProgressDots step={2} total={7} />
      <div className="px-5 pb-6">
        <div className="text-xs text-zinc-400 mb-3">How many bouncers do you require on site?</div>

        {/* Live Visual Squad Lineup */}
        <div className="flex items-center justify-center gap-2.5 py-4 mb-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <div key={i} className="animate-[scale-up_0.2s_ease]">
              {i % 2 === 0 ? (
                <MaleBouncerAvatar className="w-14 h-14" />
              ) : (
                <FemaleBouncerAvatar className="w-14 h-14" />
              )}
            </div>
          ))}
          {count > 5 && (
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-sm font-black text-amber-300">
              +{count - 5}
            </div>
          )}
        </div>

        {/* Interactive Stepper */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
          <button
            onClick={() => {
              soundEffects.playTap();
              setBooking({ ...booking, count: Math.max(1, count - 1) });
            }}
            className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-all font-black cursor-pointer"
          >
            <Minus size={18} />
          </button>
          <div className="text-center">
            <div className="text-3xl font-black text-white">{count}</div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              {count === 1 ? "Solo Bouncer" : "Protection Squad"}
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playTap();
              setBooking({ ...booking, count: Math.min(20, count + 1) });
            }}
            className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-all font-black cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Quick Number Pills */}
        <div className="grid grid-cols-4 gap-2">
          {options.map((n) => {
            const sel = count === n || (n === 10 && count >= 10);
            return (
              <button
                key={n}
                onClick={() => {
                  soundEffects.playTap();
                  setBooking({ ...booking, count: n });
                }}
                className={`py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  sel
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/30 scale-[1.02]"
                    : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {n === 10 ? "10+" : n}
              </button>
            );
          })}
        </div>
      </div>
      <BottomBar>
        <LiquidMetalButton
          label="Continue"
          fullWidth={true}
          onClick={next}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepLevel({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  return (
    <div>
      <TopBar title="Choose Protection Level" onBack={back} stepText="Step 3 of 7" />
      <ProgressDots step={3} total={7} />
      <div className="px-5 pb-6 space-y-3">
        {LEVELS.map((lvl) => {
          const sel = (booking.level || "pro") === lvl.id;
          return (
            <Card
              key={lvl.id}
              selected={sel}
              onClick={() => setBooking({ ...booking, level: lvl.id })}
              className="space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">{lvl.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      {lvl.tag}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{lvl.desc}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black text-amber-400">₹{lvl.rate}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">/ hour</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-800/80">
                {lvl.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <Check size={12} className="text-amber-400 flex-shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <BottomBar>
        <LiquidMetalButton
          label="Continue"
          fullWidth={true}
          onClick={next}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepPreferences({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  return (
    <div>
      <TopBar title="Squad Preference & Arm Armor" onBack={back} stepText="Step 4 of 7" />
      <ProgressDots step={4} total={7} />
      <div className="px-5 pb-6 space-y-4">
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
            PRESENCE & TACTICAL ARM PROTECTION
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESENCE.map((p) => {
              const sel = (booking.presence || "standard") === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEffects.playTap();
                    setBooking({ ...booking, presence: p.id });
                  }}
                  className={`p-3 rounded-xl text-center transition-all cursor-pointer ${
                    sel
                      ? "bg-amber-400 text-black font-black shadow-md shadow-amber-500/20"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold"
                  }`}
                >
                  <div className="text-xs leading-tight">{p.label}</div>
                  <div className={`text-[9px] mt-0.5 ${sel ? "text-black/70 font-semibold" : "text-zinc-500"}`}>
                    {p.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
            GENDER & SQUAD COMPOSITION
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {GENDERS.map((g) => {
              const sel = (booking.gender || "female") === g.id;
              return (
                <Card
                  key={g.id}
                  selected={sel}
                  onClick={() => setBooking({ ...booking, gender: g.id })}
                  className="flex flex-col items-center text-center p-3.5"
                >
                  {g.id === "female" && <FemaleBouncerAvatar className="w-14 h-14 mb-2" />}
                  {g.id === "male" && <MaleBouncerAvatar className="w-14 h-14 mb-2" />}
                  {g.id === "mixed" && <MixedTeamAvatar className="w-14 h-14 mb-2" />}
                  {g.id === "any" && (
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 mb-2">
                      <Zap size={26} />
                    </div>
                  )}
                  <div className="text-xs sm:text-sm font-black text-white">{g.label}</div>
                  <div className="text-[10.5px] text-zinc-400 mt-0.5">{g.desc}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <BottomBar>
        <LiquidMetalButton
          label="Continue"
          fullWidth={true}
          onClick={next}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepLocation({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  const [address, setAddress] = useState(booking.address || "Indiranagar 100ft Road, Bengaluru");

  const handleLocationSelect = (loc: { address: string; lat: number; lng: number }) => {
    setAddress(loc.address);
    setBooking((prev: any) => ({ ...prev, address: loc.address, coords: { lat: loc.lat, lng: loc.lng } }));
  };

  const handleHotspotClick = (h: typeof HOTSPOT_LOCATIONS[0]) => {
    soundEffects.playTap();
    setAddress(h.address);
    setBooking((prev: any) => ({ ...prev, address: h.address, coords: { lat: h.lat, lng: h.lng } }));
  };

  return (
    <div>
      <TopBar title="Service Location (Google Maps)" onBack={back} stepText="Step 5 of 7" />
      <ProgressDots step={5} total={7} />
      <div className="px-5 pb-6 space-y-3">
        {/* Real Google Maps Location Picker */}
        <GoogleMapPicker
          initialAddress={address}
          onLocationSelect={handleLocationSelect}
        />

        {/* Hotspots */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">
            POPULAR BENGALURU HOTSPOTS
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {HOTSPOT_LOCATIONS.map((h) => (
              <button
                key={h.name}
                type="button"
                onClick={() => handleHotspotClick(h)}
                className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 whitespace-nowrap hover:border-amber-400 hover:text-amber-300 transition-all active:scale-95 cursor-pointer"
              >
                📍 {h.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Address Display */}
        <Card className="flex items-center gap-3 bg-zinc-900/90 py-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 flex-shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-black text-white truncate">{address}</div>
            <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
              18 verified bouncers nearby
            </div>
          </div>
        </Card>
      </div>

      <BottomBar>
        <LiquidMetalButton
          label="Confirm Location"
          fullWidth={true}
          onClick={() => {
            setBooking({ ...booking, address });
            next();
          }}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepDateTime({
  booking,
  setBooking,
  next,
  back,
}: {
  booking: any;
  setBooking: any;
  next: () => void;
  back: () => void;
}) {
  const times = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];
  const durations = [1, 2, 3, 4, 6];
  const [date, setDate] = useState(booking.date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(booking.time || "8:00 PM");
  const [duration, setDuration] = useState(booking.duration || 3);

  function endTime() {
    const [t, mer] = time.split(" ");
    let [h, m] = t.split(":").map(Number);
    let h24 = mer === "PM" && h !== 12 ? h + 12 : mer === "AM" && h === 12 ? 0 : h;
    let end = (h24 + duration) % 24;
    const endMer = end >= 12 ? "PM" : "AM";
    let endH = end % 12;
    if (endH === 0) endH = 12;
    return `${endH}:${m.toString().padStart(2, "0")} ${endMer}`;
  }

  return (
    <div>
      <TopBar title="Schedule Date & Time" onBack={back} stepText="Step 6 of 7" />
      <ProgressDots step={6} total={7} />
      <div className="px-5 pb-6 space-y-4">
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">DATE</div>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              soundEffects.playTap();
              setDate(e.target.value);
            }}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-100 font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">START TIME</div>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => {
                  soundEffects.playTap();
                  setTime(t);
                }}
                className={`py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  time === t
                    ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
            DURATION (MINIMUM 1 HOUR)
          </div>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => {
                  soundEffects.playTap();
                  setDuration(d);
                }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  duration === d
                    ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}
              >
                {d}h
              </button>
            ))}
          </div>
        </div>

        {date && (
          <Card className="flex items-center justify-center gap-2 py-3 bg-amber-500/10 border-amber-500/30">
            <Clock size={16} className="text-amber-400" />
            <span className="text-xs font-black text-white">
              Service: {time} → {endTime()} ({duration} hrs)
            </span>
          </Card>
        )}
      </div>

      <BottomBar>
        <LiquidMetalButton
          label="Continue"
          fullWidth={true}
          onClick={() => {
            setBooking({ ...booking, date, time, duration, endTime: endTime() });
            next();
          }}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

function StepSummary({
  booking,
  onProceedToPayment,
  back,
}: {
  booking: any;
  onProceedToPayment: (total: number) => void;
  back: () => void;
}) {
  const level = LEVELS.find((l) => l.id === (booking.level || "pro")) || LEVELS[1];
  const purpose = PURPOSES.find((p) => p.id === (booking.purpose || "womens")) || PURPOSES[0];
  const count = booking.count || 2;
  const duration = booking.duration || 3;
  const subtotal = level.rate * count * duration;
  const fee = Math.round(subtotal * 0.08);
  const total = subtotal + fee;

  return (
    <div>
      <TopBar title="Review & Confirm" onBack={back} stepText="Step 7 of 7" />
      <ProgressDots step={7} total={7} />
      <div className="px-5 pb-6 space-y-3.5">
        <Card className="space-y-2">
          <div className="text-xs font-black text-amber-400 tracking-wider uppercase">
            BOOKING DETAILS
          </div>
          {[
            ["Purpose", purpose.label],
            ["Squad Size", `${count} Bouncers (${booking.gender || "Female"} Specialist)`],
            ["Level & Gear", `${level.label} (Arm Guards)`],
            ["Location", booking.address || "Bengaluru"],
            ["Time", `${booking.time || "8:00 PM"} – ${booking.endTime || "11:00 PM"}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-1 border-b border-zinc-800/60 text-xs">
              <span className="text-zinc-400">{k}</span>
              <span className="text-white font-bold text-right truncate max-w-[200px]">{v}</span>
            </div>
          ))}
        </Card>

        <Card className="space-y-2">
          <div className="text-xs font-black text-amber-400 tracking-wider uppercase">
            PRICING BREAKDOWN
          </div>
          <div className="flex justify-between text-xs py-0.5">
            <span className="text-zinc-400">Base Rate ({level.label})</span>
            <span className="text-white font-bold">₹{level.rate}/hr</span>
          </div>
          <div className="flex justify-between text-xs py-0.5">
            <span className="text-zinc-400">{count} bouncers × {duration} hrs</span>
            <span className="text-white font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs py-0.5">
            <span className="text-zinc-400">Platform & Escrow Insurance (8%)</span>
            <span className="text-white font-bold">₹{fee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center pt-2.5 border-t border-zinc-800">
            <span className="text-sm font-black text-white">Total Escrow Amount</span>
            <span
              className="text-2xl font-black"
              style={{
                background: GOLD_GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </Card>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
          <span>Backed by 100% Escrow Protection & On-Site Arrival Guarantee</span>
        </div>
      </div>

      <BottomBar>
        <LiquidMetalButton
          label="⚡ Proceed to Escrow Payment"
          fullWidth={true}
          onClick={() => onProceedToPayment(total)}
          icon={Lock}
        />
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: ULTRA-FAST LIVE RADAR MATCHING (Guaranteed Transition)
------------------------------------------------------------------------- */
function LiveRadarScreen({ booking, onDone }: { booking: any; onDone: (members: any[]) => void }) {
  const needed = Math.max(1, Math.min(booking.count || 2, 6));
  const totalNotified = needed + 8;
  
  // Stable list of candidates generated once
  const initialCandidates = useMemo(() => {
    return Array.from({ length: totalNotified }).map(() => makeCandidate(booking.gender || "any"));
  }, [totalNotified, booking.gender]);

  const [candidates, setCandidates] = useState<any[]>(initialCandidates);
  const [accepted, setAccepted] = useState<any[]>([]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let currentAccepted: any[] = [];
    const timers: NodeJS.Timeout[] = [];

    // Schedule rapid acceptance for each required bouncer (250ms cadence)
    for (let i = 0; i < needed; i++) {
      const delay = (i + 1) * 350;
      const t = setTimeout(() => {
        soundEffects.playTap();
        const cand = initialCandidates[i] || makeCandidate(booking.gender || "any");
        const acceptedCand = { ...cand, status: "accepted" as const };
        currentAccepted.push(acceptedCand);
        setAccepted([...currentAccepted]);
        setCandidates((prev) =>
          prev.map((c, idx) => (idx === i ? acceptedCand : c))
        );

        // When all needed bouncers have accepted, trigger celebratory chime and move forward
        if (currentAccepted.length >= needed) {
          soundEffects.playSuccessChime();
          const finalTimer = setTimeout(() => {
            onDoneRef.current(currentAccepted);
          }, 600);
          timers.push(finalTimer);
        }
      }, delay);
      timers.push(t);
    }

    return () => timers.forEach(clearTimeout);
  }, [needed, initialCandidates, booking.gender]);

  const waiting = Math.max(0, totalNotified - accepted.length);
  const pct = Math.round((accepted.length / needed) * 100);

  return (
    <div className="px-5 pt-8 pb-8">
      <div className="text-center mb-5">
        <div className="text-xs font-black text-amber-400 tracking-wider uppercase">
          {accepted.length >= needed ? "SQUAD CONFIRMED & READY" : "RADAR BROADCASTING IN BENGALURU"}
        </div>
        <div className="text-3xl font-black text-white mt-1">
          {accepted.length} / {needed} <span className="text-zinc-400 text-base font-bold">Confirmed</span>
        </div>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-5 flex items-center justify-center">
        <svg className="w-48 h-48 absolute inset-0 -rotate-90">
          <circle cx="96" cy="96" r="82" fill="none" stroke="#1E222D" strokeWidth="8" />
          <circle
            cx="96"
            cy="96"
            r="82"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 82}
            strokeDashoffset={2 * Math.PI * 82 * (1 - Math.min(pct, 100) / 100)}
            strokeLinecap="round"
            className="transition-all duration-200 ease-out"
          />
        </svg>

        <div className="w-36 h-36 rounded-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
          <RadarIcon size={28} className="text-amber-400 animate-spin" />
          <div className="text-xs font-black text-zinc-300 mt-2">{totalNotified} Notified</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-emerald-400">{accepted.length}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Accepted</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-rose-400">0</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Declined</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-zinc-300">{waiting}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Waiting</div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {accepted.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/40 bg-emerald-950/20 transition-all animate-fade-in"
          >
            {c.gender === "female" ? (
              <FemaleBouncerAvatar className="w-9 h-9" />
            ) : (
              <MaleBouncerAvatar className="w-9 h-9" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-white truncate">{c.name}</div>
              <div className="text-[10px] text-zinc-400">{c.distance} km away • ★ {c.rating}</div>
            </div>
            <span className="flex items-center gap-1 text-xs font-black text-emerald-400">
              <Check size={14} /> Accepted
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: TEAM CONFIRMED
------------------------------------------------------------------------- */
function TeamConfirmedScreen({
  team,
  booking,
  onTrack,
}: {
  team: any[];
  booking: any;
  onTrack: () => void;
}) {
  return (
    <div className="px-5 pt-8 pb-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center mx-auto mb-3.5 shadow-[0_10px_35px_rgba(245,158,11,0.6)]">
        <CheckCircle2 size={36} className="text-black" />
      </div>
      <h2 className="text-2xl font-black text-white">Your Team is Confirmed!</h2>
      <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-[320px] mx-auto">
        {team.length} verified security captains assigned & dispatching.
      </p>

      {/* Security OTP Start PIN */}
      <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center">
        <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
          SECURITY START PIN
        </div>
        <div className="text-3xl font-black text-white tracking-widest mt-1">4 8 9 2</div>
        <div className="text-[10px] text-zinc-400 mt-1">Share this OTP with captains upon arrival</div>
      </div>

      <div className="mt-5 space-y-2.5 text-left">
        {team.map((m) => (
          <Card key={m.id} className="flex items-center gap-3.5 py-3">
            {m.gender === "female" ? (
              <FemaleBouncerAvatar className="w-12 h-12" />
            ) : (
              <MaleBouncerAvatar className="w-12 h-12" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-white truncate">{m.name}</div>
              <div className="text-xs text-zinc-400">
                ★ {m.rating} • {m.assignments} missions • {m.distance} km
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black">
              ETA {rand(4, 7)}m
            </div>
          </Card>
        ))}
      </div>

      <BottomBar>
        <LiquidMetalButton
          label="Track Live Squad on Google Maps"
          fullWidth={true}
          onClick={onTrack}
          icon={ArrowRight}
        />
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: ACTIVE TRACKING (REAL GOOGLE MAPS)
------------------------------------------------------------------------- */
function ActiveTrackingScreen({
  team,
  booking,
  onEnd,
  toast,
}: {
  team: any[];
  booking: any;
  onEnd: () => void;
  toast: (m: string) => void;
}) {
  const [eta, setEta] = useState(rand(5, 7));
  const [sos, setSos] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setEta((e) => Math.max(0, e - 1)), 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="pb-6">
      <div className="px-5 pt-5 pb-3">
        <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
          LIVE GOOGLE MAPS DISPATCH
        </div>
        <div className="text-2xl font-black text-white mt-0.5">
          {eta > 0 ? `Squad Arriving in ~${eta} mins` : "Squad on Site & Active"}
        </div>
      </div>

      {/* Real Google Maps Live Tracking */}
      <div className="px-5">
        <GoogleMapLiveTracking
          centerCoords={booking.coords || DEFAULT_BENGALURU_COORDS}
          team={team}
        />
      </div>

      {/* Captain Action Cards */}
      <div className="px-5 mt-4 space-y-2.5">
        {team.map((m) => (
          <Card key={m.id} className="flex items-center gap-3.5 py-3">
            {m.gender === "female" ? (
              <FemaleBouncerAvatar className="w-11 h-11" />
            ) : (
              <MaleBouncerAvatar className="w-11 h-11" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-black text-white truncate">{m.name}</div>
              <div className="text-[11px] text-zinc-400">★ {m.rating} • En Route (Arm Guards)</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toast(`Calling ${m.name} (+91 98xxx)...`)}
                className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-black transition-all cursor-pointer"
              >
                <Phone size={16} />
              </button>
              <button
                onClick={() => toast(`Opening live chat with ${m.name}`)}
                className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Summary */}
      <div className="px-5 mt-3.5">
        <Card className="space-y-1.5 text-xs py-2.5">
          <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
            DETAILS
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Location:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{booking.address}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Total Escrow:</span>
            <span className="text-amber-400 font-bold">₹{booking.total?.toLocaleString("en-IN")}</span>
          </div>
        </Card>
      </div>

      {/* SOS Button */}
      <div className="px-5 mt-3.5">
        <button
          onClick={() => {
            soundEffects.playTap();
            setSos(true);
          }}
          className="w-full py-3.5 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-300 font-black text-xs flex items-center justify-center gap-2 hover:bg-rose-900 transition-all shadow-lg cursor-pointer"
        >
          <AlertTriangle size={16} />
          <span>EMERGENCY SOS / ALERT SUPPORT</span>
        </button>
      </div>

      {/* SOS Modal */}
      {sos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl p-5 space-y-3">
            <div className="text-base font-black text-white">Emergency Response</div>
            <div className="text-xs text-zinc-400 leading-relaxed">
              Your live GPS coordinates and booking telemetry will be broadcast to our rapid reaction team.
            </div>
            <button
              type="button"
              onClick={() => {
                setSos(false);
                toast("Emergency reaction team alerted.");
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs shadow-xl shadow-red-600/40 cursor-pointer"
            >
              Broadcast Emergency Now
            </button>
            <button
              type="button"
              onClick={() => setSos(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <BottomBar>
        <LiquidMetalButton
          label="End Booking & Leave 5★ Rating"
          fullWidth={true}
          onClick={onEnd}
          icon={Award}
        />
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: RATING
------------------------------------------------------------------------- */
function RatingScreen({ team, onDone }: { team: any[]; onDone: () => void }) {
  const cats = ["Professionalism", "Punctuality", "Conduct & Demeanor", "Communication"];
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overall, setOverall] = useState(5);

  return (
    <div className="px-5 pt-8 pb-8 text-center">
      <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
        <Award size={30} />
      </div>
      <h2 className="text-2xl font-black text-white">Rate Your Experience</h2>
      <p className="text-xs sm:text-sm text-zinc-400 mt-1">
        Help us maintain India&apos;s highest security standard
      </p>

      <div className="flex justify-center gap-2.5 my-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={34}
            onClick={() => {
              soundEffects.playTap();
              setOverall(n);
            }}
            className="cursor-pointer transition-all hover:scale-110"
            fill={n <= overall ? "#F59E0B" : "none"}
            color={n <= overall ? "#F59E0B" : "#3F3F46"}
          />
        ))}
      </div>

      <div className="space-y-2.5 text-left">
        {cats.map((c) => (
          <div key={c} className="flex justify-between items-center p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs sm:text-sm font-bold text-zinc-300">{c}</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  onClick={() => {
                    soundEffects.playTap();
                    setRatings({ ...ratings, [c]: n });
                  }}
                  className="cursor-pointer"
                  fill={n <= (ratings[c] || 5) ? "#F59E0B" : "none"}
                  color={n <= (ratings[c] || 5) ? "#F59E0B" : "#3F3F46"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomBar>
        <LiquidMetalButton
          label="Submit 5★ Feedback"
          fullWidth={true}
          onClick={onDone}
          icon={CheckCircle2}
        />
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   APP ROOT: Seamless Edge-to-Edge Dark & Gold Experience
------------------------------------------------------------------------- */
const WIZARD_STEPS = ["purpose", "count", "level", "preferences", "location", "datetime", "summary"];

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [booking, setBooking] = useState<any>({ count: 2, level: "pro", presence: "standard", gender: "female" });
  const [team, setTeam] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const canvasRef = useShaderBackground();

  const toast = useCallback((m: string) => {
    soundEffects.playTap();
    setToastMsg(m);
    setTimeout(() => setToastMsg(""), 2400);
  }, []);

  function goWizard(step: string) {
    setScreen(step);
  }

  function stepIndex(s: string) {
    return WIZARD_STEPS.indexOf(s);
  }

  function nextStep() {
    const idx = stepIndex(screen);
    setScreen(WIZARD_STEPS[idx + 1]);
  }

  function prevStep() {
    const idx = stepIndex(screen);
    if (idx <= 0) {
      setScreen("landing");
      return;
    }
    setScreen(WIZARD_STEPS[idx - 1]);
  }

  function handleProceedToPayment(total: number) {
    setPaymentAmount(total);
    setBooking((b: any) => ({ ...b, total }));
    setShowPaymentModal(true);
  }

  function handlePaymentSuccess() {
    setShowPaymentModal(false);
    setScreen("radar");
  }

  function radarDone(members: any[]) {
    setTeam(members);
    setScreen("teamConfirmed");
  }

  function trackTeam() {
    setActiveBooking({ ...booking });
    setScreen("active");
  }

  function endBooking() {
    setScreen("rating");
  }

  function finishRating() {
    setPastBookings((p) => [{ ...booking }, ...p]);
    setActiveBooking(null);
    setBooking({ count: 2, level: "pro", presence: "standard", gender: "female" });
    setTeam([]);
    setScreen("landing");
  }

  let content;
  if (screen === "landing") content = <LandingScreen go={goWizard} toast={toast} />;
  else if (screen === "purpose")
    content = <StepPurpose booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "count")
    content = <StepCount booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "level")
    content = <StepLevel booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "preferences")
    content = <StepPreferences booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "location")
    content = <StepLocation booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "datetime")
    content = <StepDateTime booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "summary")
    content = <StepSummary booking={booking} onProceedToPayment={handleProceedToPayment} back={prevStep} />;
  else if (screen === "radar") content = <LiveRadarScreen booking={booking} onDone={radarDone} />;
  else if (screen === "teamConfirmed")
    content = <TeamConfirmedScreen team={team} booking={booking} onTrack={trackTeam} />;
  else if (screen === "active")
    content = <ActiveTrackingScreen team={team} booking={activeBooking || booking} onEnd={endBooking} toast={toast} />;
  else if (screen === "rating") content = <RatingScreen team={team} onDone={finishRating} />;

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-zinc-100 flex flex-col items-center justify-start selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
      {/* 1. Interactive WebGL Shader Background Engraved Across Whole Screen */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-60 z-0"
        style={{ background: '#050608' }}
      />

      {/* 2. Seamless Full-Screen Main Application Container (Edge-to-edge on mobile, centered on laptop) */}
      <div className="relative z-10 w-full min-h-screen flex justify-center">
        <main className="w-full max-w-md sm:max-w-lg min-h-screen bg-[#07080d]/92 border-x border-zinc-800/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col justify-between">
          {content}

          {/* Floating Toast Notification */}
          {toastMsg && (
            <div className="fixed bottom-20 max-w-xs mx-auto left-4 right-4 bg-zinc-900 border border-amber-500/40 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>{toastMsg}</span>
            </div>
          )}
        </main>
      </div>

      {/* Fake Escrow Payment Modal */}
      {showPaymentModal && (
        <FakePaymentModal
          amount={paymentAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
