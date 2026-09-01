'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
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
  Lock,
  Award,
  BadgeCheck,
  Flame,
} from "lucide-react";
import { MaleBouncerAvatar, FemaleBouncerAvatar, MixedTeamAvatar } from "@/components/ui/BouncerAvatars";

/* -------------------------------------------------------------------------
   LUXURY DARK & NEON GOLD PALETTE
------------------------------------------------------------------------- */
const GOLD_GRAD = "linear-gradient(135deg, #FFFBEB 0%, #FDE047 30%, #F59E0B 70%, #D97706 100%)";
const GOLD_ACCENT = "linear-gradient(135deg, #FDE047 0%, #F59E0B 50%, #B45309 100%)";
const CARD_BG = "rgba(18, 20, 26, 0.88)";
const CARD_BORDER = "rgba(245, 158, 11, 0.18)";
const CARD_BORDER_ACTIVE = "rgba(245, 158, 11, 0.85)";

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
    desc: "Physical presence & crowd control",
    rate: 500,
    tag: "Essential",
    features: ["Physical deterrence", "ID screening", "Uniformed presence"],
  },
  {
    id: "pro",
    label: "Pro Tactical Fighter",
    desc: "Martial arts & conflict de-escalation",
    rate: 800,
    tag: "Most Booked",
    popular: true,
    features: ["Martial arts certified", "Conflict resolution", "Bodycam equipped"],
  },
  {
    id: "elite",
    label: "Elite Close Protection",
    desc: "Ex-military / Black-suit tactical guard",
    rate: 1200,
    tag: "VIP Grade",
    features: ["Ex-Special Forces / Commando", "VIP convoy escort", "Discreet tactical dress"],
  },
];

const PRESENCE = [
  { id: "standard", label: "Standard Presence", sub: "Discreet & approachable" },
  { id: "large", label: "High Deterrence", sub: "Muscular & authoritative" },
  { id: "high", label: "Executive Suit", sub: "Black suit VIP cover" },
];

const GENDERS = [
  { id: "female", label: "Female Squad", desc: "Women's Safety Specialist", tag: "Recommended for Women" },
  { id: "male", label: "Male Bouncers", desc: "High Deterrence & Gate Guard", tag: "Heavy Crowd" },
  { id: "mixed", label: "Mixed Squad", desc: "Balanced Duo Protection", tag: "Popular" },
  { id: "any", label: "Any Gender", desc: "Fastest Dispatch (< 5 min)", tag: "Instant" },
];

const LOCALITIES = [
  "Indiranagar 100ft Road, Bengaluru",
  "4th Block, Koramangala, Bengaluru",
  "Church Street / MG Road, Bengaluru",
  "27th Main, HSR Layout, Bengaluru",
  "ITPL Main Road, Whitefield, Bengaluru",
  "11th Main, Jayanagar, Bengaluru",
  "Electronic City Phase 1, Bengaluru",
  "Outer Ring Road, Marathahalli, Bengaluru",
  "BTM Layout 2nd Stage, Bengaluru",
  "Hebbal / Sahakara Nagar, Bengaluru",
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
    distance: (0.7 + Math.random() * 2.8).toFixed(1),
    assignments: rand(120, 520),
    status: "waiting" as "waiting" | "accepted" | "rejected" | "expired",
  };
}

const PROFILE = { name: "Rachit", phone: "+91 98765 43210" };

/* -------------------------------------------------------------------------
   TACTILE UI PRIMITIVES
------------------------------------------------------------------------- */
function GoldButton({
  children,
  onClick,
  disabled,
  style,
  full = true,
  icon: Icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  full?: boolean;
  icon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      style={{
        width: full ? "100%" : "auto",
        background: disabled
          ? "#232630"
          : "linear-gradient(135deg, #FDE047 0%, #F59E0B 50%, #D97706 100%)",
        color: disabled ? "#94A3B8" : "#070707",
        border: "none",
        borderRadius: 18,
        padding: "16px 24px",
        fontSize: 15,
        fontWeight: 900,
        letterSpacing: 0.3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: disabled
          ? "none"
          : "0 8px 30px -4px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon size={18} color="#070707" />}
      </span>
      {!disabled && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
      )}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-200 hover:bg-zinc-800/80 active:scale-[0.98]"
      style={{
        background: "rgba(24, 26, 32, 0.8)",
        color: "#F8FAFC",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 18,
        padding: "14px 20px",
        fontSize: 14,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        ...style,
      }}
    >
      {children}
    </button>
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
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-zinc-200 hover:text-amber-400 hover:border-amber-500/50 transition-all active:scale-95 shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="text-center">
        <div className="text-base font-black text-zinc-100 tracking-tight">{title}</div>
        {stepText && <div className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest">{stepText}</div>}
      </div>
      <div className="w-10 h-10 flex items-center justify-center">
        <ShieldCheck size={18} className="text-amber-400/50" />
      </div>
    </div>
  );
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 px-5 pb-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{
            background:
              i < step
                ? "linear-gradient(90deg, #FDE047, #F59E0B)"
                : "rgba(255, 255, 255, 0.08)",
            boxShadow: i < step ? "0 0 10px rgba(245, 158, 11, 0.5)" : "none",
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
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-[0.99] hover:border-amber-500/40" : ""
      } ${className}`}
      style={{
        background: selected ? "rgba(30, 26, 18, 0.95)" : CARD_BG,
        border: `1.5px solid ${selected ? "#F59E0B" : "rgba(255, 255, 255, 0.08)"}`,
        padding: 16,
        boxShadow: selected
          ? "0 0 0 1px rgba(245, 158, 11, 0.4), 0 12px 30px -10px rgba(245, 158, 11, 0.35)"
          : "0 8px 24px -10px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black shadow-md">
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
      className="fixed left-0 right-0 bottom-0 max-w-[440px] mx-auto px-5 pt-3 pb-[calc(18px+env(safe-area-inset-bottom))] z-40"
      style={{
        background: "linear-gradient(0deg, #07080B 85%, rgba(7,8,11,0.6) 95%, transparent)",
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
    <div className="min-h-full flex flex-col">
      {/* 1. TOP BRAND HEADER */}
      <div className="px-5 pt-6 flex items-center justify-between">
        <div className="relative w-36 h-12">
          <Image
            src="/logo.png"
            alt="Bouncers on Tips Logo"
            fill
            priority
            className="object-contain filter drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-black text-zinc-200 tracking-wide">18 Bouncers Active</span>
        </div>
      </div>

      {/* 2. HERO STATEMENT */}
      <div className="px-5 pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
          <Flame size={13} className="text-amber-400" />
          <span>India&apos;s 1st On-Demand Security App</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight leading-[1.08]">
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
        <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed max-w-[340px]">
          Book vetted bouncers, women&apos;s safety escorts, and VIP bodyguards instantly anywhere in Bengaluru.
        </p>
      </div>

      {/* 3. DYNAMIC RADAR VISUALIZER */}
      <div className="relative h-64 my-2 flex items-center justify-center">
        <HeroRadarVisualizer />
      </div>

      {/* 4. PRIMARY CTAs */}
      <div className="px-5 flex flex-col gap-3">
        <GoldButton onClick={() => go("purpose")} icon={ArrowRight}>
          Book Bouncers Now
        </GoldButton>
        <GhostButton onClick={() => toast("Bouncer Partner Onboarding is open.")}>
          Become a BOT Partner
        </GhostButton>
      </div>

      {/* 5. TRUST & SAFETY BADGES */}
      <div className="px-5 mt-7">
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 text-center">
          <div>
            <div className="text-base font-black text-amber-400">4.9★</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">4,800+ Bookings</div>
          </div>
          <div className="border-x border-zinc-800">
            <div className="text-base font-black text-amber-400">&lt; 5m</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Avg Response</div>
          </div>
          <div>
            <div className="text-base font-black text-emerald-400">100%</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Police Verified</div>
          </div>
        </div>
      </div>

      {/* 6. HOW IT WORKS TIMELINE */}
      <div className="px-5 pt-8 pb-28">
        <div className="text-xs font-black text-zinc-400 tracking-wider uppercase mb-3">
          HOW IT WORKS
        </div>
        <div className="space-y-2.5">
          {[
            { step: "1", title: "Select your requirement", desc: "Choose party, women's safety, or VIP guard" },
            { step: "2", title: "Choose team & level", desc: "Select male, female, or mixed tactical squads" },
            { step: "3", title: "Live radar match", desc: "Nearby verified bouncers accept in real time" },
            { step: "4", title: "Secure arrival with OTP", desc: "Live GPS tracking with emergency SOS protection" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-black text-amber-400">
                {item.step}
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">{item.title}</div>
                <div className="text-[11px] text-zinc-400">{item.desc}</div>
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
    { name: "Priya S.", eta: "3m", rating: "4.9", isFemale: true, angle: 35, dist: 78 },
    { name: "Vikram R.", eta: "4m", rating: "5.0", isFemale: false, angle: 140, dist: 84 },
    { name: "Sanya V.", eta: "5m", rating: "4.8", isFemale: true, angle: 220, dist: 74 },
    { name: "Arjun K.", eta: "6m", rating: "4.9", isFemale: false, angle: 310, dist: 88 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Concentric Radar Rings */}
      {[70, 120, 180, 240].map((size, idx) => (
        <div
          key={idx}
          className="absolute rounded-full border border-amber-500/20"
          style={{
            width: size,
            height: size,
            boxShadow: idx === 1 ? "0 0 30px rgba(245, 158, 11, 0.08)" : "none",
          }}
        />
      ))}

      {/* Rotating Sonar Scanner */}
      <div
        className="absolute w-60 h-60 rounded-full pointer-events-none animate-[spin_6s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(245,158,11,0.25) 0deg, rgba(245,158,11,0) 60deg, transparent 360deg)",
        }}
      />

      {/* Center Pin */}
      <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] border-2 border-white/80">
        <ShieldCheck size={28} className="text-black" />
      </div>

      {/* Nearby Bouncer Character Chips */}
      {nearbyBouncers.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = Math.cos(rad) * b.dist;
        const y = Math.sin(rad) * b.dist;
        return (
          <div
            key={i}
            className="absolute z-20 flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/90 border border-amber-500/40 shadow-xl backdrop-blur-md animate-[float_4s_ease-in-out_infinite]"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.6}s`,
            }}
          >
            {b.isFemale ? (
              <FemaleBouncerAvatar className="w-7 h-7" />
            ) : (
              <MaleBouncerAvatar className="w-7 h-7" />
            )}
            <div className="text-left leading-none">
              <div className="text-[10px] font-black text-zinc-100">{b.name}</div>
              <div className="text-[9px] font-bold text-amber-400">{b.eta} away</div>
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
      <div className="px-5 pb-32 grid grid-cols-2 gap-2.5">
        {PURPOSES.map((p) => {
          const Icon = p.icon;
          const sel = booking.purpose === p.id;
          return (
            <Card
              key={p.id}
              selected={sel}
              onClick={() => setBooking({ ...booking, purpose: p.id })}
              className="flex flex-col justify-between min-h-[114px]"
            >
              <div>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                    sel ? "bg-amber-400 text-black shadow-md" : "bg-zinc-800 text-amber-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="text-xs font-black text-white leading-snug">{p.label}</div>
              </div>
              <div className="text-[10.5px] text-zinc-400 mt-1 leading-tight">{p.desc}</div>
            </Card>
          );
        })}
      </div>
      <BottomBar>
        <GoldButton disabled={!booking.purpose} onClick={next} icon={ArrowRight}>
          Continue
        </GoldButton>
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
      <TopBar title="Squad Size" onBack={back} stepText="Step 2 of 7" />
      <ProgressDots step={2} total={7} />
      <div className="px-5">
        <div className="text-xs text-zinc-400 mb-4">How many bouncers do you require on site?</div>

        {/* Live Visual Squad Lineup */}
        <div className="flex items-center justify-center gap-2 py-4 mb-5 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <div key={i} className="animate-[scale-up_0.3s_ease]">
              {i % 2 === 0 ? (
                <MaleBouncerAvatar className="w-12 h-12" />
              ) : (
                <FemaleBouncerAvatar className="w-12 h-12" />
              )}
            </div>
          ))}
          {count > 5 && (
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-sm font-black text-amber-300">
              +{count - 5}
            </div>
          )}
        </div>

        {/* Interactive Count Stepper */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-5">
          <button
            onClick={() => setBooking({ ...booking, count: Math.max(1, count - 1) })}
            className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-all font-black text-lg"
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
            onClick={() => setBooking({ ...booking, count: Math.min(20, count + 1) })}
            className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-all font-black text-lg"
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
                onClick={() => setBooking({ ...booking, count: n })}
                className={`py-3.5 rounded-xl font-black text-sm transition-all ${
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
        <GoldButton onClick={next} icon={ArrowRight}>
          Continue
        </GoldButton>
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
      <div className="px-5 pb-32 space-y-3">
        {LEVELS.map((lvl) => {
          const sel = (booking.level || "pro") === lvl.id;
          return (
            <Card
              key={lvl.id}
              selected={sel}
              onClick={() => setBooking({ ...booking, level: lvl.id })}
              className="space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{lvl.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      {lvl.tag}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{lvl.desc}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black text-amber-400">₹{lvl.rate}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">/ hour</div>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-800/80">
                {lvl.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
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
        <GoldButton onClick={next} icon={ArrowRight}>
          Continue
        </GoldButton>
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
      <TopBar title="Squad Preference" onBack={back} stepText="Step 4 of 7" />
      <ProgressDots step={4} total={7} />
      <div className="px-5 pb-32 space-y-5">
        {/* Presence Style */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2.5">
            DRESS & PRESENCE TYPE
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESENCE.map((p) => {
              const sel = (booking.presence || "standard") === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setBooking({ ...booking, presence: p.id })}
                  className={`p-3 rounded-2xl text-center transition-all ${
                    sel
                      ? "bg-amber-400 text-black font-black shadow-lg shadow-amber-500/20"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold"
                  }`}
                >
                  <div className="text-xs leading-tight">{p.label}</div>
                  <div className={`text-[9px] mt-1 ${sel ? "text-black/70 font-semibold" : "text-zinc-500"}`}>
                    {p.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Squad Gender & Avatars */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2.5">
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
                  className="flex flex-col items-center text-center p-4"
                >
                  {g.id === "female" && <FemaleBouncerAvatar className="w-14 h-14 mb-2.5" />}
                  {g.id === "male" && <MaleBouncerAvatar className="w-14 h-14 mb-2.5" />}
                  {g.id === "mixed" && <MixedTeamAvatar className="w-14 h-14 mb-2.5" />}
                  {g.id === "any" && (
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber-400 mb-2.5">
                      <Zap size={26} />
                    </div>
                  )}
                  <div className="text-xs font-black text-white">{g.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">{g.desc}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <BottomBar>
        <GoldButton onClick={next} icon={ArrowRight}>
          Continue
        </GoldButton>
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
  const [query, setQuery] = useState(booking.address || "Indiranagar 100ft Road, Bengaluru");
  const [pin, setPin] = useState(booking.pin || { x: 50, y: 46 });
  const [showList, setShowList] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const suggestions = LOCALITIES.filter((l) =>
    l.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  function onDrag(e: any) {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    x = Math.max(8, Math.min(92, x));
    y = Math.max(8, Math.min(92, y));
    setPin({ x, y });
  }

  function selectLocality(name: string) {
    setQuery(name);
    setShowList(false);
    setPin({ x: rand(35, 65), y: rand(35, 60) });
  }

  function useCurrent() {
    setQuery("Current GPS — Indiranagar, Bengaluru");
    setPin({ x: 50, y: 46 });
    setShowList(false);
  }

  return (
    <div>
      <TopBar title="Service Location" onBack={back} stepText="Step 5 of 7" />
      <ProgressDots step={5} total={7} />
      <div className="px-5 pb-32 space-y-3">
        {/* Search Field */}
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowList(true);
            }}
            onFocus={() => setShowList(true)}
            placeholder="Search venue, street, or landmark"
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {showList && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={useCurrent}
              className="w-full flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800 text-left hover:bg-zinc-800/80"
            >
              <Navigation size={16} className="text-amber-400" />
              <span className="text-xs font-black text-amber-400">Use Live GPS Location</span>
            </button>
            {(query ? suggestions : LOCALITIES.slice(0, 5)).map((l) => (
              <button
                key={l}
                onClick={() => selectLocality(l)}
                className="w-full flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800/60 text-left hover:bg-zinc-800/80"
              >
                <MapPin size={15} className="text-zinc-400" />
                <span className="text-xs text-zinc-200">{l}</span>
              </button>
            ))}
          </div>
        )}

        {!showList && (
          <>
            {/* Interactive Vector Map Canvas */}
            <div
              ref={mapRef}
              onMouseDown={onDrag}
              onTouchStart={onDrag}
              className="relative w-full h-64 rounded-3xl overflow-hidden border border-zinc-800 cursor-grab shadow-2xl"
              style={{
                background: `
                  radial-gradient(circle at 40% 30%, #1a1e28, #090a0f 75%),
                  repeating-linear-gradient(0deg, #1b202c 0, #1b202c 1px, transparent 1px, transparent 32px),
                  repeating-linear-gradient(90deg, #1b202c 0, #1b202c 1px, transparent 1px, transparent 32px)`,
              }}
            >
              {/* Radar Ring */}
              <div
                className="absolute rounded-full border border-amber-500/30 bg-amber-500/10 pointer-events-none animate-pulse"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  width: 140,
                  height: 140,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Target Drop Pin */}
              <div
                className="absolute pointer-events-none flex flex-col items-center"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="w-8 h-8 rounded-full rounded-br-none -rotate-45 bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.8)] border border-white">
                  <ShieldCheck size={14} className="text-black rotate-45" />
                </div>
              </div>

              <div className="absolute bottom-2.5 inset-x-3 bg-black/80 backdrop-blur-md rounded-xl py-1.5 px-3 text-[11px] font-bold text-center text-zinc-300 border border-zinc-800">
                Drag anywhere on the map to set exact spot
              </div>
            </div>

            {/* Selected Location Card */}
            <Card className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-white truncate">{query}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                  18 verified bouncers available within 5 km
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <BottomBar>
        {showList ? (
          <GhostButton onClick={() => setShowList(false)}>Close Search</GhostButton>
        ) : (
          <GoldButton
            disabled={!query}
            onClick={() => {
              setBooking({ ...booking, address: query, pin });
              next();
            }}
            icon={ArrowRight}
          >
            Confirm Location
          </GoldButton>
        )}
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
      <div className="px-5 pb-32 space-y-4">
        {/* Date Field */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">DATE</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl px-4 py-3 text-sm text-zinc-100 font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Start Time Chips */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">START TIME</div>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-3 rounded-xl text-xs font-black transition-all ${
                  time === t
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
            DURATION (MINIMUM 1 HOUR)
          </div>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  duration === d
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}
              >
                {d}h
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Window Card */}
        {date && (
          <Card className="flex items-center justify-center gap-2.5 py-3.5 bg-amber-500/10 border-amber-500/30">
            <Clock size={16} className="text-amber-400" />
            <span className="text-xs font-black text-white">
              Service Window: {time} → {endTime()} ({duration} hrs)
            </span>
          </Card>
        )}
      </div>

      <BottomBar>
        <GoldButton
          disabled={!date}
          onClick={() => {
            setBooking({ ...booking, date, time, duration, endTime: endTime() });
            next();
          }}
          icon={ArrowRight}
        >
          Continue
        </GoldButton>
      </BottomBar>
    </div>
  );
}

function StepSummary({
  booking,
  next,
  back,
}: {
  booking: any;
  next: (total: number) => void;
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
      <div className="px-5 pb-32 space-y-3.5">
        {/* Specifications */}
        <Card className="space-y-2.5">
          <div className="text-[11px] font-black text-amber-400 tracking-wider uppercase">
            BOOKING DETAILS
          </div>
          {[
            ["Purpose", purpose.label],
            ["Team Size", `${count} Bouncers (${booking.gender || "Female"} Squad)`],
            ["Level", level.label],
            ["Location", booking.address || "Bengaluru"],
            ["Date", booking.date || "Today"],
            ["Time", `${booking.time || "8:00 PM"} – ${booking.endTime || "11:00 PM"}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-1 border-b border-zinc-800/60 text-xs">
              <span className="text-zinc-400">{k}</span>
              <span className="text-white font-bold text-right truncate max-w-[200px]">{v}</span>
            </div>
          ))}
        </Card>

        {/* Pricing Card */}
        <Card className="space-y-2.5">
          <div className="text-[11px] font-black text-amber-400 tracking-wider uppercase">
            ESTIMATED PRICING
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-zinc-400">Base Rate ({level.label})</span>
            <span className="text-white font-bold">₹{level.rate}/hr</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-zinc-400">{count} bouncers × {duration} hours</span>
            <span className="text-white font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-zinc-400">Platform & Insurance Protection Fee (8%)</span>
            <span className="text-white font-bold">₹{fee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center pt-2.5 border-t border-zinc-800">
            <span className="text-sm font-black text-white">Total Amount</span>
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

        {/* Guarantee Banner */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
          <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
          <span>Backed by 100% On-Site Arrival Guarantee & Emergency Support</span>
        </div>
      </div>

      <BottomBar>
        <GoldButton onClick={() => next(total)} icon={RadarIcon}>
          Confirm & Find Bouncers
        </GoldButton>
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: LIVE RADAR MATCHING
------------------------------------------------------------------------- */
function LiveRadarScreen({ booking, onDone }: { booking: any; onDone: (members: any[]) => void }) {
  const needed = Math.min(booking.count || 2, 10);
  const totalNotified = needed + 12;
  const [candidates, setCandidates] = useState(() =>
    Array.from({ length: totalNotified }).map(() => makeCandidate(booking.gender || "any"))
  );
  const [accepted, setAccepted] = useState<any[]>([]);
  const [rejected, setRejected] = useState(0);
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    let acceptedCount = 0;
    let t = 400;
    const order = [...candidates].sort(() => Math.random() - 0.5);

    order.forEach((c) => {
      t += rand(500, 1200);
      const timer = setTimeout(() => {
        setCandidates((prev) => {
          const willAccept = acceptedCount < needed && Math.random() < 0.65;
          const idx = prev.findIndex((p) => p.id === c.id);
          if (idx === -1) return prev;
          const next = [...prev];
          if (willAccept && acceptedCount < needed) {
            acceptedCount += 1;
            next[idx] = { ...next[idx], status: "accepted" };
            setAccepted((a) => (a.find((x) => x.id === c.id) ? a : [...a, next[idx]]));
          } else if (acceptedCount >= needed) {
            next[idx] = { ...next[idx], status: "expired" };
          } else {
            next[idx] = { ...next[idx], status: "rejected" };
            setRejected((r) => r + 1);
          }
          return next;
        });
      }, t);
      timers.current.push(timer);
    });

    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (accepted.length >= needed) {
      const done = setTimeout(() => onDone(accepted.slice(0, needed)), 900);
      return () => clearTimeout(done);
    }
  }, [accepted, needed, onDone]);

  const waiting = candidates.filter((c) => c.status === "waiting").length;
  const pct = Math.round((accepted.length / needed) * 100);

  return (
    <div className="px-5 pt-8 pb-10">
      <div className="text-center mb-6">
        <div className="text-xs font-black text-amber-400 tracking-wider uppercase">
          {accepted.length >= needed ? "TEAM CONFIRMED" : "PINGING FLEET IN BENGLURU"}
        </div>
        <div className="text-3xl font-black text-white mt-1">
          {accepted.length} / {needed} <span className="text-zinc-400 text-lg font-bold">Confirmed</span>
        </div>
      </div>

      {/* High-Tech Circular Radar Meter */}
      <div className="relative w-52 h-52 mx-auto mb-6 flex items-center justify-center">
        <svg className="w-52 h-52 absolute inset-0 -rotate-90">
          <circle cx="104" cy="104" r="92" fill="none" stroke="#1E222D" strokeWidth="10" />
          <circle
            cx="104"
            cy="104"
            r="92"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 92}
            strokeDashoffset={2 * Math.PI * 92 * (1 - Math.min(pct, 100) / 100)}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="w-36 h-36 rounded-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
          <RadarIcon size={32} className="text-amber-400 animate-spin" />
          <div className="text-[11px] font-black text-zinc-300 mt-2">{totalNotified} Notified</div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-emerald-400">{accepted.length}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">Accepted</div>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-rose-400">{rejected}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">Declined</div>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="text-xl font-black text-zinc-300">{waiting}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">Waiting</div>
        </div>
      </div>

      {/* Stream of Incoming Candidate Responses */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {candidates
          .filter((c) => c.status !== "expired" && c.status !== "waiting")
          .slice(-6)
          .reverse()
          .map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-900/90 border transition-all ${
                c.status === "accepted" ? "border-emerald-500/40 bg-emerald-950/20" : "border-zinc-800"
              }`}
            >
              {c.gender === "female" ? (
                <FemaleBouncerAvatar className="w-10 h-10" />
              ) : (
                <MaleBouncerAvatar className="w-10 h-10" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-white truncate">{c.name}</div>
                <div className="text-[10px] text-zinc-400">{c.distance} km away • ★ {c.rating}</div>
              </div>
              {c.status === "accepted" ? (
                <span className="flex items-center gap-1 text-xs font-black text-emerald-400">
                  <Check size={14} /> Accepted
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-black text-rose-400">
                  <X size={14} /> Declined
                </span>
              )}
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
    <div className="px-5 pt-8 pb-32 text-center">
      {/* Golden Celebratory Badge */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center mx-auto mb-4 shadow-[0_10px_35px_rgba(245,158,11,0.6)]">
        <CheckCircle2 size={36} className="text-black" />
      </div>
      <h2 className="text-2xl font-black text-white">Your Team is Confirmed!</h2>
      <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto">
        {team.length} verified security captains are assigned & dispatching to your location.
      </p>

      {/* Security OTP Start PIN */}
      <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center">
        <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
          SECURITY START PIN
        </div>
        <div className="text-3xl font-black text-white tracking-widest mt-1">4 8 9 2</div>
        <div className="text-[10px] text-zinc-400 mt-1">Share this OTP with captains upon arrival</div>
      </div>

      {/* Assigned Captain Cards */}
      <div className="mt-5 space-y-2.5 text-left">
        {team.map((m) => (
          <Card key={m.id} className="flex items-center gap-3.5">
            {m.gender === "female" ? (
              <FemaleBouncerAvatar className="w-12 h-12" />
            ) : (
              <MaleBouncerAvatar className="w-12 h-12" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-white truncate">{m.name}</div>
              <div className="text-[11px] text-zinc-400">
                ★ {m.rating} • {m.assignments} missions • {m.distance} km
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10.5px] font-black">
              ETA {rand(5, 10)}m
            </div>
          </Card>
        ))}
      </div>

      <BottomBar>
        <GoldButton onClick={onTrack} icon={ArrowRight}>
          Track Live Squad
        </GoldButton>
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SCREEN: ACTIVE TRACKING
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
  const [eta, setEta] = useState(rand(6, 9));
  const [sos, setSos] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setEta((e) => Math.max(0, e - 1)), 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="pb-32">
      {/* Header status */}
      <div className="px-5 pt-6 pb-3">
        <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
          LIVE ASSIGNMENT
        </div>
        <div className="text-2xl font-black text-white mt-0.5">
          {eta > 0 ? `Squad Arriving in ~${eta} mins` : "Squad on Site & Active"}
        </div>
      </div>

      {/* Live Vector Map Simulation */}
      <div className="px-5">
        <div
          className="relative h-56 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
          style={{
            background: `
              radial-gradient(circle at 40% 30%, #171b26, #090a0f 75%),
              repeating-linear-gradient(0deg, #1b202c 0, #1b202c 1px, transparent 1px, transparent 32px),
              repeating-linear-gradient(90deg, #1b202c 0, #1b202c 1px, transparent 1px, transparent 32px)`,
          }}
        >
          {/* Client Destination Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(245,158,11,0.9)]">
            <MapPin size={16} />
          </div>

          {/* Moving Squad Pins */}
          {team.map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${35 + i * 28}%`,
                top: `${42 + (i % 2) * 16}%`,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg">
                <ShieldCheck size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Captain Actions Cards */}
      <div className="px-5 mt-4 space-y-2.5">
        {team.map((m) => (
          <Card key={m.id} className="flex items-center gap-3.5">
            {m.gender === "female" ? (
              <FemaleBouncerAvatar className="w-12 h-12" />
            ) : (
              <MaleBouncerAvatar className="w-12 h-12" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-white truncate">{m.name}</div>
              <div className="text-[10.5px] text-zinc-400">★ {m.rating} • En Route</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toast(`Calling ${m.name} (+91 98xxx)...`)}
                className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-black transition-all"
              >
                <Phone size={16} />
              </button>
              <button
                onClick={() => toast(`Opening live chat with ${m.name}`)}
                className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 hover:bg-zinc-700 transition-all"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Summary */}
      <div className="px-5 mt-4">
        <Card className="space-y-1.5 text-xs">
          <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1">
            DETAILS
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Location:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{booking.address}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Window:</span>
            <span className="text-white font-bold">{booking.time} – {booking.endTime}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Total:</span>
            <span className="text-amber-400 font-bold">₹{booking.total?.toLocaleString("en-IN")}</span>
          </div>
        </Card>
      </div>

      {/* SOS Button */}
      <div className="px-5 mt-4">
        <button
          onClick={() => setSos(true)}
          className="w-full py-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-300 font-black text-xs flex items-center justify-center gap-2 hover:bg-rose-900 transition-all shadow-lg"
        >
          <AlertTriangle size={16} />
          <span>EMERGENCY SOS / ALERT SUPPORT</span>
        </button>
      </div>

      {/* SOS Modal */}
      {sos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-[440px] bg-zinc-950 border border-zinc-800 rounded-t-3xl p-6 space-y-4">
            <div className="text-lg font-black text-white">Emergency Response</div>
            <div className="text-xs text-zinc-400 leading-relaxed">
              Your live GPS coordinates and booking telemetry will be broadcast to our rapid reaction team and 112 emergency line.
            </div>
            <GoldButton
              onClick={() => {
                setSos(false);
                toast("Emergency reaction team alerted.");
              }}
              style={{
                background: "linear-gradient(135deg, #EF4444, #B91C1C)",
                boxShadow: "0 8px 30px rgba(220, 38, 38, 0.5)",
              }}
            >
              Broadcast Emergency Now
            </GoldButton>
            <GhostButton onClick={() => setSos(false)}>Cancel</GhostButton>
          </div>
        </div>
      )}

      <BottomBar>
        <GoldButton onClick={onEnd}>End Booking & Leave 5★ Rating</GoldButton>
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
    <div className="px-5 pt-8 pb-32 text-center">
      <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
        <Award size={30} />
      </div>
      <h2 className="text-2xl font-black text-white">Rate Your Experience</h2>
      <p className="text-xs text-zinc-400 mt-1">
        Help us maintain India&apos;s highest security standard
      </p>

      {/* Overall Stars */}
      <div className="flex justify-center gap-2 my-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={36}
            onClick={() => setOverall(n)}
            className="cursor-pointer transition-all hover:scale-110"
            fill={n <= overall ? "#F59E0B" : "none"}
            color={n <= overall ? "#F59E0B" : "#3F3F46"}
          />
        ))}
      </div>

      {/* Dimensional Ratings */}
      <div className="space-y-3 text-left">
        {cats.map((c) => (
          <div key={c} className="flex justify-between items-center p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs font-bold text-zinc-300">{c}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  onClick={() => setRatings({ ...ratings, [c]: n })}
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
        <GoldButton onClick={onDone}>Submit 5★ Feedback</GoldButton>
      </BottomBar>
    </div>
  );
}

/* -------------------------------------------------------------------------
   APP ROOT (Single Page Shell with Desktop Showcase Frame)
------------------------------------------------------------------------- */
const WIZARD_STEPS = ["purpose", "count", "level", "preferences", "location", "datetime", "summary"];

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [booking, setBooking] = useState<any>({ count: 2, level: "pro", presence: "standard", gender: "female" });
  const [team, setTeam] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  const toast = useCallback((m: string) => {
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

  function confirmBooking(total: number) {
    setBooking((b: any) => ({ ...b, total }));
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
    content = <StepSummary booking={booking} next={confirmBooking} back={prevStep} />;
  else if (screen === "radar") content = <LiveRadarScreen booking={booking} onDone={radarDone} />;
  else if (screen === "teamConfirmed")
    content = <TeamConfirmedScreen team={team} booking={booking} onTrack={trackTeam} />;
  else if (screen === "active")
    content = <ActiveTrackingScreen team={team} booking={activeBooking || booking} onEnd={endBooking} toast={toast} />;
  else if (screen === "rating") content = <RatingScreen team={team} onDone={finishRating} />;

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col items-center justify-center selection:bg-amber-400 selection:text-black font-sans">
      {/* Background Ambient Radial Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Main Responsive Mobile Frame */}
      <main className="relative w-full max-w-[440px] min-h-screen sm:min-h-[860px] sm:my-8 bg-[#090A0E] sm:rounded-[36px] sm:border sm:border-zinc-800 sm:shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-x-hidden flex flex-col">
        {content}

        {/* Floating Toast Notification */}
        {toastMsg && (
          <div className="fixed left-5 right-5 bottom-24 max-w-[400px] mx-auto bg-zinc-900 border border-amber-500/40 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </main>
    </div>
  );
}
