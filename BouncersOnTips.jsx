import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ShieldCheck, Users, PartyPopper, GraduationCap, Heart, Building2, Crown,
  Plane, ShieldAlert, Search, Navigation, ChevronLeft, ChevronRight, Check, X,
  Star, Clock, Calendar as CalendarIcon, Phone, MessageCircle, Home as HomeIcon,
  Bookmark, User as UserIcon, MapPin, Zap, ChevronDown, Plus, Minus, ShieldQuestion,
  Sparkles, Radar as RadarIcon, ArrowRight, LogOut, Bell, AlertTriangle, CircleCheck,
} from "lucide-react";

/* -------------------------------------------------------------------------
   DESIGN TOKENS
------------------------------------------------------------------------- */
const GOLD = "linear-gradient(135deg,#F7E7A0 0%,#D4AF37 45%,#8A6C15 100%)";
const GOLD_TEXT = "linear-gradient(135deg,#FBEFC0 0%,#E7C766 50%,#B8912A 100%)";
const SILVER = "linear-gradient(135deg,#F4F4F4 0%,#C6C9CC 50%,#8A8E92 100%)";

const bg0 = "#050505";
const bg1 = "#121212";
const bg2 = "#1A1A1A";
const bg3 = "#232323";
const border = "#2B2B2B";
const gold = "#D4AF37";
const goldSoft = "#E9CE6E";
const silver = "#C7CBCE";
const textPri = "#F6F5F2";
const textSec = "#9C9A94";

/* -------------------------------------------------------------------------
   MOCK DATA
------------------------------------------------------------------------- */
const PURPOSES = [
  { id: "womens", label: "Women's safety", desc: "Trusted escort & presence", icon: ShieldCheck },
  { id: "personal", label: "Personal protection", desc: "One-on-one close cover", icon: UserIcon },
  { id: "night", label: "Night out", desc: "Bars, late outings", icon: Sparkles },
  { id: "party", label: "Party / club", desc: "Entry & crowd control", icon: PartyPopper },
  { id: "college", label: "College event", desc: "Fests, fresher's, farewell", icon: GraduationCap },
  { id: "wedding", label: "Wedding", desc: "Guest & gate management", icon: Heart },
  { id: "corporate", label: "Corporate event", desc: "Launches, offsites", icon: Building2 },
  { id: "vip", label: "VIP protection", desc: "Discreet premium cover", icon: Crown },
  { id: "travel", label: "Travel / escort", desc: "Station, airport, transit", icon: Plane },
  { id: "other", label: "Something else", desc: "Tell us what you need", icon: ShieldQuestion },
];

const LEVELS = [
  { id: "standard", label: "Standard", desc: "Professional everyday presence", rate: 500, tag: "Reliable" },
  { id: "pro", label: "Pro", desc: "Experienced & highly trained", rate: 800, tag: "Most booked" },
  { id: "elite", label: "Elite", desc: "Premium protection professionals", rate: 1200, tag: "Top tier" },
];

const PRESENCE = [
  { id: "standard", label: "Standard presence" },
  { id: "large", label: "Large presence" },
  { id: "high", label: "High presence" },
];

const GENDERS = [
  { id: "any", label: "Any" },
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "mixed", label: "Mixed" },
];

const NAMES = ["Arjun","Rohit","Karan","Vikram","Aditya","Farhan","Suresh","Kabir",
  "Dev","Rahul","Ishaan","Yusuf","Gagan","Kunal","Priya","Sanya","Neha","Ananya","Meera","Tanvi"];

const LOCALITIES = [
  "Indiranagar, Bengaluru","Koramangala, Bengaluru","HSR Layout, Bengaluru",
  "Whitefield, Bengaluru","MG Road, Bengaluru","Jayanagar, Bengaluru",
  "Electronic City, Bengaluru","Marathahalli, Bengaluru","BTM Layout, Bengaluru",
  "Hebbal, Bengaluru",
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function uid() { return Math.random().toString(36).slice(2, 9); }

function makeCandidate(genderPref) {
  const gender = genderPref === "mixed" || genderPref === "any"
    ? pick(["male", "female"])
    : genderPref;
  const femaleNames = ["Priya","Sanya","Neha","Ananya","Meera","Tanvi"];
  const maleNames = NAMES.filter(n => !femaleNames.includes(n));
  const name = gender === "female" ? pick(femaleNames) : pick(maleNames);
  return {
    id: uid(),
    name,
    gender,
    code: "BT-" + rand(100, 999),
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    distance: (0.6 + Math.random() * 4.4).toFixed(1),
    assignments: rand(60, 400),
    status: "waiting",
  };
}

const PROFILE = { name: "Rachit", phone: "+91 98xxxxxx21" };

/* -------------------------------------------------------------------------
   SMALL UI PRIMITIVES
------------------------------------------------------------------------- */
function GoldButton({ children, onClick, disabled, style, full = true, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: full ? "100%" : "auto",
        background: disabled ? bg3 : GOLD,
        color: disabled ? textSec : "#1A1300",
        border: "none",
        borderRadius: 16,
        padding: "15px 20px",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 0.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: disabled ? "none" : "0 8px 24px -8px rgba(212,175,55,0.55)",
        cursor: disabled ? "default" : "pointer",
        transition: "transform .15s ease",
        ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}{Icon && <Icon size={16} />}
    </button>
  );
}

function GhostButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg2,
        color: textPri,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: "14px 18px",
        fontSize: 14,
        fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer",
        ...style,
      }}
    >{children}</button>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 18px 10px",
    }}>
      <button onClick={onBack} style={{
        width: 38, height: 38, borderRadius: 12, background: bg2, border: `1px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "center", color: textPri, cursor: "pointer",
      }}><ChevronLeft size={18} /></button>
      <div style={{ fontSize: 15, fontWeight: 700, color: textPri, letterSpacing: 0.2 }}>{title}</div>
      <div style={{ width: 38 }}>{right}</div>
    </div>
  );
}

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "0 18px 14px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, flex: 1, borderRadius: 4,
          background: i < step ? GOLD : bg3,
        }} />
      ))}
    </div>
  );
}

function Avatar({ name, size = 44, gender }) {
  const initials = name.slice(0, 2).toUpperCase();
  const g = gender === "female" ? "#E7B7C6" : "#C7CBCE";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg3}, ${bg1})`,
      border: `1.5px solid ${g}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: g, flexShrink: 0,
    }}>{initials}</div>
  );
}

function Card({ children, style, onClick, selected }) {
  return (
    <div onClick={onClick} style={{
      background: bg1,
      border: `1px solid ${selected ? gold : border}`,
      borderRadius: 18,
      padding: 16,
      cursor: onClick ? "pointer" : "default",
      boxShadow: selected ? "0 0 0 1px rgba(212,175,55,0.35), 0 8px 20px -12px rgba(212,175,55,0.4)" : "none",
      transition: "border-color .15s ease",
      ...style,
    }}>{children}</div>
  );
}

/* -------------------------------------------------------------------------
   LANDING SCREEN
------------------------------------------------------------------------- */
function Landing({ go, toast }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "34px 22px 0", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, background: GOLD,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><ShieldCheck size={20} color="#1A1300" /></div>
          <div style={{ fontSize: 15, fontWeight: 800, color: textPri, letterSpacing: 0.3 }}>
            BOUNCERS <span style={{ background: GOLD_TEXT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ON TIPS</span>
          </div>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7, alignSelf: "flex-start",
          background: bg1, border: `1px solid ${border}`, borderRadius: 100,
          padding: "6px 12px", marginBottom: 22,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "#3DDC84", boxShadow: "0 0 8px #3DDC84" }} />
          <span style={{ fontSize: 12.5, color: textSec, fontWeight: 600 }}>18 bouncers online near you</span>
        </div>

        <h1 style={{
          fontSize: 42, lineHeight: 1.04, fontWeight: 800, color: textPri, margin: 0,
          letterSpacing: -0.5,
        }}>Need backup?</h1>
        <p style={{ color: textSec, fontSize: 15.5, marginTop: 14, lineHeight: 1.5, maxWidth: 300 }}>
          Book bouncers and protection professionals around you — exactly when you need them.
        </p>
      </div>

      <div style={{ position: "relative", height: 210, margin: "26px 0" }}>
        <RadarHero />
      </div>

      <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 10 }}>
        <GoldButton onClick={() => go("purpose")} icon={ArrowRight}>Book bouncers</GoldButton>
        <GhostButton onClick={() => toast("The professional app is launching soon.")}>Become a bouncer</GhostButton>
      </div>

      <div style={{ padding: "34px 22px 100px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: silver, letterSpacing: 1, marginBottom: 14 }}>HOW IT WORKS</div>
        {[
          "Choose what you need",
          "Pick your team size & level",
          "Drop a pin on the map",
          "Nearby bouncers get your request",
          "Watch them accept, live",
          "Your team is confirmed",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", border: `1px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: goldSoft, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ fontSize: 14, color: textPri }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarHero() {
  const dots = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    angle: (i / 8) * 360 + rand(-10, 10),
    dist: rand(58, 92),
    delay: i * 0.35,
  })), []);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {[80, 130, 180].map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%", width: s, height: s,
          transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: `1px solid ${gold}22`,
        }} />
      ))}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 46, height: 46,
        transform: "translate(-50%,-50%)", borderRadius: "50%", background: GOLD,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 30px rgba(212,175,55,0.5)",
      }}><UserIcon size={20} color="#1A1300" /></div>
      {dots.map((d, i) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = Math.cos(rad) * d.dist;
        const y = Math.sin(rad) * d.dist;
        return (
          <div key={i} style={{
            position: "absolute", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
            width: 26, height: 26, transform: "translate(-50%,-50%)", borderRadius: "50%",
            background: bg1, border: `1.5px solid ${silver}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: `btFloat 3s ease-in-out ${d.delay}s infinite`,
          }}><ShieldCheck size={12} color={silver} /></div>
        );
      })}
      <style>{`@keyframes btFloat{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-6px)}}`}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------
   BOOKING WIZARD STEPS
------------------------------------------------------------------------- */
function StepPurpose({ booking, setBooking, next, back }) {
  return (
    <div>
      <TopBar title="What's it for?" onBack={back} />
      <ProgressDots step={1} total={7} />
      <div style={{ padding: "4px 18px 120px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {PURPOSES.map(p => {
          const Icon = p.icon;
          const sel = booking.purpose === p.id;
          return (
            <Card key={p.id} selected={sel} onClick={() => setBooking({ ...booking, purpose: p.id })}
              style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, minHeight: 108 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: sel ? GOLD : bg2,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icon size={17} color={sel ? "#1A1300" : silver} /></div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: textPri, lineHeight: 1.2 }}>{p.label}</div>
              <div style={{ fontSize: 11.5, color: textSec, lineHeight: 1.3 }}>{p.desc}</div>
            </Card>
          );
        })}
      </div>
      <BottomBar>
        <GoldButton disabled={!booking.purpose} onClick={next} icon={ArrowRight}>Continue</GoldButton>
      </BottomBar>
    </div>
  );
}

function StepCount({ booking, setBooking, next, back }) {
  const options = [1,2,3,4,5,6,8,10];
  return (
    <div>
      <TopBar title="Team size" onBack={back} />
      <ProgressDots step={2} total={7} />
      <div style={{ padding: "10px 18px" }}>
        <div style={{ fontSize: 13, color: textSec, marginBottom: 16 }}>How many bouncers do you need?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 26 }}>
          {Array.from({ length: Math.min(booking.count || 1, 6) }).map((_, i) => (
            <div key={i} style={{
              width: 34, height: 34, borderRadius: "50%", background: bg2, border: `1px solid ${gold}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><UserIcon size={16} color={goldSoft} /></div>
          ))}
          {booking.count > 6 && <div style={{ alignSelf: "center", color: textSec, fontSize: 13 }}>+{booking.count - 6}</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {options.map(n => {
            const sel = booking.count === n || (n === 10 && booking.count >= 10);
            return (
              <div key={n} onClick={() => setBooking({ ...booking, count: n })} style={{
                aspectRatio: "1", borderRadius: 14, background: sel ? GOLD : bg1,
                border: `1px solid ${sel ? gold : border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: sel ? "#1A1300" : textPri, cursor: "pointer",
              }}>{n === 10 ? "10+" : n}</div>
            );
          })}
        </div>
        {booking.count >= 10 && (
          <div style={{ marginTop: 14, fontSize: 12.5, color: goldSoft, textAlign: "center" }}>
            Large team — we'll follow up to scope a custom request.
          </div>
        )}
      </div>
      <BottomBar>
        <GoldButton disabled={!booking.count} onClick={next} icon={ArrowRight}>Continue</GoldButton>
      </BottomBar>
    </div>
  );
}

function StepLevel({ booking, setBooking, next, back }) {
  return (
    <div>
      <TopBar title="Choose a level" onBack={back} />
      <ProgressDots step={3} total={7} />
      <div style={{ padding: "6px 18px 120px", display: "flex", flexDirection: "column", gap: 12 }}>
        {LEVELS.map(l => {
          const sel = booking.level === l.id;
          return (
            <Card key={l.id} selected={sel} onClick={() => setBooking({ ...booking, level: l.id })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: textPri }}>{l.label}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: goldSoft, background: `${gold}1A`, padding: "3px 8px", borderRadius: 100 }}>{l.tag}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: textSec, marginTop: 4 }}>{l.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: sel ? goldSoft : textPri }}>₹{l.rate}</div>
                  <div style={{ fontSize: 10.5, color: textSec }}>/hr</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <BottomBar>
        <GoldButton disabled={!booking.level} onClick={next} icon={ArrowRight}>Continue</GoldButton>
      </BottomBar>
    </div>
  );
}

function StepPresenceGender({ booking, setBooking, next, back }) {
  return (
    <div>
      <TopBar title="Preferences" onBack={back} />
      <ProgressDots step={4} total={7} />
      <div style={{ padding: "6px 18px 120px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 10 }}>Physical presence you'd like</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
          {PRESENCE.map(p => {
            const sel = booking.presence === p.id;
            return (
              <div key={p.id} onClick={() => setBooking({ ...booking, presence: p.id })} style={{
                flex: 1, textAlign: "center", padding: "12px 6px", borderRadius: 14,
                background: sel ? GOLD : bg1, border: `1px solid ${sel ? gold : border}`,
                fontSize: 12, fontWeight: 700, color: sel ? "#1A1300" : textPri, cursor: "pointer",
              }}>{p.label}</div>
            );
          })}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 10 }}>Preferred team</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {GENDERS.map(g => {
            const sel = booking.gender === g.id;
            return (
              <div key={g.id} onClick={() => setBooking({ ...booking, gender: g.id })} style={{
                textAlign: "center", padding: "13px 6px", borderRadius: 14,
                background: sel ? GOLD : bg1, border: `1px solid ${sel ? gold : border}`,
                fontSize: 13, fontWeight: 700, color: sel ? "#1A1300" : textPri, cursor: "pointer",
              }}>{g.label}</div>
            );
          })}
        </div>
      </div>
      <BottomBar>
        <GoldButton disabled={!booking.presence || !booking.gender} onClick={next} icon={ArrowRight}>Continue</GoldButton>
      </BottomBar>
    </div>
  );
}

function StepLocation({ booking, setBooking, next, back }) {
  const [query, setQuery] = useState(booking.address || "");
  const [pin, setPin] = useState(booking.pin || { x: 50, y: 46 });
  const [showList, setShowList] = useState(false);
  const [confirmed, setConfirmed] = useState(!!booking.address);
  const mapRef = useRef(null);
  const nearby = useMemo(() => Array.from({ length: 9 }).map(() => ({
    x: rand(10, 90), y: rand(10, 85),
  })), []);

  const suggestions = LOCALITIES.filter(l => l.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  function onDrag(e) {
    const rect = mapRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    x = Math.max(4, Math.min(96, x));
    y = Math.max(4, Math.min(96, y));
    setPin({ x, y });
    setConfirmed(false);
  }

  function selectLocality(name) {
    setQuery(name);
    setShowList(false);
    setPin({ x: rand(35, 65), y: rand(35, 60) });
    setConfirmed(false);
  }

  function useCurrent() {
    setQuery("Current location — Indiranagar, Bengaluru");
    setPin({ x: 50, y: 46 });
    setConfirmed(false);
    setShowList(false);
  }

  return (
    <div>
      <TopBar title="Service location" onBack={back} />
      <ProgressDots step={5} total={7} />
      <div style={{ padding: "0 18px 6px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color={textSec} style={{ position: "absolute", left: 14, top: 14 }} />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowList(true); setConfirmed(false); }}
            onFocus={() => setShowList(true)}
            placeholder="Search area, street, landmark"
            style={{
              width: "100%", background: bg1, border: `1px solid ${border}`, borderRadius: 14,
              padding: "13px 14px 13px 38px", color: textPri, fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        {showList && (
          <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 14, marginTop: 6, overflow: "hidden" }}>
            <div onClick={useCurrent} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${border}`, cursor: "pointer" }}>
              <Navigation size={15} color={goldSoft} />
              <span style={{ fontSize: 13.5, color: goldSoft, fontWeight: 600 }}>Use current location</span>
            </div>
            {(query ? suggestions : LOCALITIES.slice(0, 5)).map(l => (
              <div key={l} onClick={() => selectLocality(l)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" }}>
                <MapPin size={15} color={textSec} />
                <span style={{ fontSize: 13.5, color: textPri }}>{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!showList && (
        <>
          <div style={{ padding: "14px 18px 8px" }}>
            <div
              ref={mapRef}
              onMouseDown={e => { onDrag(e); }}
              onTouchStart={onDrag}
              style={{
                position: "relative", width: "100%", height: 260, borderRadius: 20, overflow: "hidden",
                background: `
                  radial-gradient(circle at 30% 20%, #1c1c1c, #0c0c0c 70%),
                  repeating-linear-gradient(0deg, #161616 0, #161616 1px, transparent 1px, transparent 34px),
                  repeating-linear-gradient(90deg, #161616 0, #161616 1px, transparent 1px, transparent 34px)`,
                border: `1px solid ${border}`,
                cursor: "grab",
              }}
            >
              <div style={{
                position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-50%)",
                width: 130, height: 130, borderRadius: "50%", background: `${gold}14`, border: `1px solid ${gold}33`,
                pointerEvents: "none",
              }} />
              {nearby.map((n, i) => (
                <div key={i} style={{
                  position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)",
                  width: 18, height: 18, borderRadius: "50%", background: bg1, border: `1.5px solid ${silver}`,
                  display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
                }}><ShieldCheck size={9} color={silver} /></div>
              ))}
              <div style={{
                position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-100%)",
                display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
                  background: GOLD, marginBottom: 2, boxShadow: "0 4px 14px rgba(212,175,55,0.5)",
                }} />
              </div>
              <div style={{
                position: "absolute", bottom: 10, left: 10, right: 10, background: "rgba(10,10,10,0.75)",
                borderRadius: 10, padding: "6px 10px", fontSize: 10.5, color: silver, textAlign: "center",
              }}>Drag anywhere on the map to move the pin</div>
            </div>
          </div>

          <div style={{ padding: "0 18px" }}>
            <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: bg2, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><MapPin size={17} color={goldSoft} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: textPri }}>{query || "Select a location"}</div>
                <div style={{ fontSize: 11.5, color: textSec, marginTop: 2 }}>{rand(9, 16)} bouncers available within 5 km</div>
              </div>
            </Card>
          </div>
        </>
      )}

      <BottomBar>
        {showList ? (
          <GhostButton onClick={() => setShowList(false)}>Close search</GhostButton>
        ) : (
          <GoldButton
            disabled={!query}
            onClick={() => { setBooking({ ...booking, address: query, pin }); next(); }}
            icon={ArrowRight}
          >Confirm location</GoldButton>
        )}
      </BottomBar>
    </div>
  );
}

function StepDateTime({ booking, setBooking, next, back }) {
  const times = ["6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"];
  const durations = [1,2,3,4,6];
  const [date, setDate] = useState(booking.date || "");
  const [time, setTime] = useState(booking.time || "8:00 PM");
  const [duration, setDuration] = useState(booking.duration || 3);

  function endTime() {
    const [t, mer] = time.split(" ");
    let [h, m] = t.split(":").map(Number);
    let h24 = mer === "PM" && h !== 12 ? h + 12 : (mer === "AM" && h === 12 ? 0 : h);
    let end = (h24 + duration) % 24;
    const endMer = end >= 12 ? "PM" : "AM";
    let endH = end % 12; if (endH === 0) endH = 12;
    return `${endH}:${m.toString().padStart(2,"0")} ${endMer}`;
  }

  return (
    <div>
      <TopBar title="Date & time" onBack={back} />
      <ProgressDots step={6} total={7} />
      <div style={{ padding: "6px 18px 120px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 8 }}>Date</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{
            width: "100%", background: bg1, border: `1px solid ${border}`, borderRadius: 14,
            padding: "13px 14px", color: textPri, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 22,
            colorScheme: "dark",
          }} />

        <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 8 }}>Start time</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 22 }}>
          {times.map(t => (
            <div key={t} onClick={() => setTime(t)} style={{
              textAlign: "center", padding: "11px 4px", borderRadius: 12,
              background: time === t ? GOLD : bg1, border: `1px solid ${time === t ? gold : border}`,
              fontSize: 12.5, fontWeight: 700, color: time === t ? "#1A1300" : textPri, cursor: "pointer",
            }}>{t}</div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 8 }}>Duration</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {durations.map(d => (
            <div key={d} onClick={() => setDuration(d)} style={{
              flex: 1, textAlign: "center", padding: "11px 4px", borderRadius: 12,
              background: duration === d ? GOLD : bg1, border: `1px solid ${duration === d ? gold : border}`,
              fontSize: 12.5, fontWeight: 700, color: duration === d ? "#1A1300" : textPri, cursor: "pointer",
            }}>{d}h</div>
          ))}
        </div>

        {date && (
          <Card style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Clock size={15} color={goldSoft} />
            <span style={{ fontSize: 14, fontWeight: 700, color: textPri }}>{time} → {endTime()}</span>
          </Card>
        )}
      </div>
      <BottomBar>
        <GoldButton disabled={!date} onClick={() => { setBooking({ ...booking, date, time, duration, endTime: endTime() }); next(); }} icon={ArrowRight}>Continue</GoldButton>
      </BottomBar>
    </div>
  );
}

function StepSummary({ booking, next, back }) {
  const level = LEVELS.find(l => l.id === booking.level);
  const purpose = PURPOSES.find(p => p.id === booking.purpose);
  const subtotal = level.rate * booking.count * booking.duration;
  const fee = Math.round(subtotal * 0.08);
  const total = subtotal + fee;

  const rows = [
    ["Purpose", purpose.label],
    ["Team", `${booking.count} · ${GENDERS.find(g=>g.id===booking.gender).label}`],
    ["Level", level.label],
    ["Location", booking.address],
    ["Date", booking.date],
    ["Time", `${booking.time} – ${booking.endTime}`],
  ];

  return (
    <div>
      <TopBar title="Review & confirm" onBack={back} />
      <ProgressDots step={7} total={7} />
      <div style={{ padding: "8px 18px 130px" }}>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: silver, letterSpacing: 0.6, marginBottom: 12 }}>YOUR BOOKING</div>
          {rows.map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: 12.5, color: textSec }}>{k}</span>
              <span style={{ fontSize: 12.5, color: textPri, fontWeight: 600, textAlign: "right", maxWidth: 180 }}>{v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: silver, letterSpacing: 0.6, marginBottom: 12 }}>PRICE</div>
          <Row k={`Base rate · ${level.label}`} v={`₹${level.rate}/hr`} />
          <Row k={`${booking.count} × ${booking.duration}h`} v={`₹${subtotal.toLocaleString("en-IN")}`} />
          <Row k="Platform fee" v={`₹${fee.toLocaleString("en-IN")}`} />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 6, borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: textPri }}>Estimated total</span>
            <span style={{ fontSize: 18, fontWeight: 800, background: GOLD_TEXT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </Card>
      </div>
      <BottomBar>
        <GoldButton onClick={() => next(total)} icon={RadarIcon}>Confirm & find bouncers</GoldButton>
      </BottomBar>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontSize: 12.5, color: textSec }}>{k}</span>
      <span style={{ fontSize: 12.5, color: textPri }}>{v}</span>
    </div>
  );
}

function BottomBar({ children }) {
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto",
      padding: "14px 18px calc(18px + env(safe-area-inset-bottom))",
      background: "linear-gradient(0deg, #050505 60%, transparent)",
    }}>{children}</div>
  );
}

/* -------------------------------------------------------------------------
   LIVE RADAR SCREEN
------------------------------------------------------------------------- */
function LiveRadar({ booking, onDone }) {
  const needed = Math.min(booking.count, 10);
  const totalNotified = needed + rand(9, 15);
  const [candidates, setCandidates] = useState(() =>
    Array.from({ length: totalNotified }).map(() => makeCandidate(booking.gender))
  );
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    let acceptedCount = 0;
    let t = 400;
    const order = [...candidates].sort(() => Math.random() - 0.5);
    order.forEach((c, i) => {
      t += rand(500, 1400);
      const timer = setTimeout(() => {
        setCandidates(prev => {
          const willAccept = acceptedCount < needed && Math.random() < 0.55;
          const idx = prev.findIndex(p => p.id === c.id);
          if (idx === -1) return prev;
          const next = [...prev];
          if (willAccept && acceptedCount < needed) {
            acceptedCount += 1;
            next[idx] = { ...next[idx], status: "accepted" };
            setAccepted(a => (a.find(x => x.id === c.id) ? a : [...a, next[idx]]));
          } else if (acceptedCount >= needed) {
            next[idx] = { ...next[idx], status: "expired" };
          } else {
            next[idx] = { ...next[idx], status: "rejected" };
            setRejected(r => r + 1);
          }
          return next;
        });
      }, t);
      timers.current.push(timer);
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accepted.length >= needed) {
      const done = setTimeout(() => onDone(accepted.slice(0, needed)), 900);
      return () => clearTimeout(done);
    }
  }, [accepted, needed, onDone]);

  const waiting = candidates.filter(c => c.status === "waiting").length;
  const pct = Math.round((accepted.length / needed) * 100);

  return (
    <div style={{ padding: "24px 18px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: textSec, fontWeight: 600, letterSpacing: 0.4 }}>
          {accepted.length >= needed ? "TEAM CONFIRMED" : "FINDING YOUR TEAM"}
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: textPri, marginTop: 4 }}>
          {accepted.length} / {needed} <span style={{ fontSize: 15, color: textSec, fontWeight: 600 }}>confirmed</span>
        </div>
      </div>

      <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 20px" }}>
        <svg width="220" height="220" style={{ position: "absolute", inset: 0 }}>
          <circle cx="110" cy="110" r="96" fill="none" stroke={bg3} strokeWidth="10" />
          <circle cx="110" cy="110" r="96" fill="none" stroke={gold} strokeWidth="10"
            strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * (1 - Math.min(pct, 100) / 100)}
            strokeLinecap="round" transform="rotate(-90 110 110)"
            style={{ transition: "stroke-dashoffset .6s ease" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 18, borderRadius: "50%",
          background: `radial-gradient(circle, ${bg1} 0%, ${bg0} 75%)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        }}>
          <RadarIcon size={26} color={goldSoft} style={{ animation: accepted.length < needed ? "btSpin 2.4s linear infinite" : "none" }} />
          <div style={{ fontSize: 11, color: textSec, marginTop: 8 }}>{totalNotified} notified</div>
        </div>
        <style>{`@keyframes btSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <Stat label="Accepted" value={accepted.length} color="#4ADE80" />
        <Stat label="Rejected" value={rejected} color="#F87171" />
        <Stat label="Waiting" value={waiting} color={silver} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
        {candidates.filter(c => c.status !== "expired" && c.status !== "waiting").slice(-6).reverse().map(c => (
          <div key={c.id} style={{
            display: "flex", alignItems: "center", gap: 10, background: bg1, border: `1px solid ${border}`,
            borderRadius: 14, padding: "10px 12px", animation: "btIn .3s ease",
          }}>
            <Avatar name={c.name} size={34} gender={c.gender} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textPri }}>{c.name} <span style={{ color: textSec, fontWeight: 500 }}>· {c.code}</span></div>
              <div style={{ fontSize: 11, color: textSec }}>{c.distance} km away · ★ {c.rating}</div>
            </div>
            {c.status === "accepted" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#4ADE80", fontSize: 12, fontWeight: 700 }}><Check size={14} /> Accepted</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#F87171", fontSize: 12, fontWeight: 700 }}><X size={14} /> Declined</div>
            )}
          </div>
        ))}
        <style>{`@keyframes btIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    </div>
  );
}
function Stat({ label, value, color }) {
  return (
    <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10.5, color: textSec, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   TEAM CONFIRMED
------------------------------------------------------------------------- */
function TeamConfirmed({ team, booking, onTrack }) {
  return (
    <div style={{ padding: "30px 18px 130px", textAlign: "center" }}>
      <div style={{
        width: 62, height: 62, borderRadius: "50%", background: GOLD, margin: "0 auto 16px",
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px -8px rgba(212,175,55,0.55)",
      }}><CircleCheck size={30} color="#1A1300" /></div>
      <div style={{ fontSize: 20, fontWeight: 800, color: textPri }}>Your team is ready</div>
      <div style={{ fontSize: 13, color: textSec, marginTop: 6 }}>{team.length} bouncers confirmed for {booking.address}</div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
        {team.map((m, i) => (
          <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={m.name} size={46} gender={m.gender} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textPri }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: textSec, marginTop: 2 }}>★ {m.rating} · {m.assignments} assignments · {m.distance} km</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: goldSoft, background: `${gold}1A`, padding: "5px 9px", borderRadius: 100 }}>
              ETA {rand(5, 14)}m
            </div>
          </Card>
        ))}
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto", padding: "14px 18px calc(18px + env(safe-area-inset-bottom))", background: "linear-gradient(0deg, #050505 60%, transparent)" }}>
        <GoldButton onClick={onTrack} icon={ArrowRight}>Track my team</GoldButton>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ACTIVE BOOKING
------------------------------------------------------------------------- */
function ActiveBooking({ team, booking, onEnd, toast }) {
  const [eta, setEta] = useState(rand(6, 12));
  const [sos, setSos] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => setEta(e => Math.max(0, e - 1)), 4000);
    return () => clearInterval(iv);
  }, []);
  const spots = useMemo(() => team.map(() => ({ x: rand(15, 85), y: rand(15, 80) })), [team]);

  return (
    <div style={{ padding: "0 0 130px" }}>
      <div style={{ padding: "18px 18px 10px" }}>
        <div style={{ fontSize: 12, color: textSec, fontWeight: 600 }}>BOOKING ACTIVE</div>
        <div style={{ fontSize: 19, fontWeight: 800, color: textPri, marginTop: 2 }}>{eta > 0 ? `Team arriving in ${eta} min` : "Team on site"}</div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <div style={{
          position: "relative", height: 200, borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`,
          background: `radial-gradient(circle at 40% 30%, #1c1c1c, #0c0c0c 70%),
            repeating-linear-gradient(0deg, #161616 0, #161616 1px, transparent 1px, transparent 34px),
            repeating-linear-gradient(90deg, #161616 0, #161616 1px, transparent 1px, transparent 34px)`,
        }}>
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            width: 22, height: 22, borderRadius: "50%", background: GOLD,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(212,175,55,0.6)",
          }}><MapPin size={12} color="#1A1300" /></div>
          {spots.map((s, i) => (
            <div key={i} style={{
              position: "absolute", left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)",
              width: 24, height: 24, borderRadius: "50%", background: bg1, border: `1.5px solid ${silver}`,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 4s linear",
            }}><ShieldCheck size={12} color={silver} /></div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 18px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {team.map(m => (
          <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={m.name} size={40} gender={m.gender} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: textPri }}>{m.name}</div>
              <div style={{ fontSize: 11, color: textSec }}>★ {m.rating} · On the way</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <IconBtn icon={Phone} onClick={() => toast(`Calling ${m.name}...`)} />
              <IconBtn icon={MessageCircle} onClick={() => toast(`Opening chat with ${m.name}`)} />
            </div>
          </Card>
        ))}
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: silver, marginBottom: 10 }}>BOOKING DETAILS</div>
          <Row k="Purpose" v={PURPOSES.find(p=>p.id===booking.purpose)?.label} />
          <Row k="Location" v={booking.address} />
          <Row k="Time" v={`${booking.time} – ${booking.endTime}`} />
          <Row k="Total" v={`₹${booking.total?.toLocaleString("en-IN")}`} />
        </Card>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <button onClick={() => setSos(true)} style={{
          width: "100%", background: "#2A1010", border: `1px solid #5A2323`, borderRadius: 16,
          padding: "13px", color: "#F87171", fontWeight: 700, fontSize: 13.5,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
        }}><AlertTriangle size={16} /> SOS / Emergency help</button>
      </div>

      {sos && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", zIndex: 50, maxWidth: 420, margin: "0 auto" }}>
          <div style={{ background: bg1, width: "100%", borderRadius: "22px 22px 0 0", padding: 22, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: textPri, marginBottom: 6 }}>Emergency help</div>
            <div style={{ fontSize: 13, color: textSec, marginBottom: 16 }}>Your live location and booking will be shared with support and your emergency contact.</div>
            <GoldButton onClick={() => { setSos(false); toast("Support has been alerted."); }} style={{ marginBottom: 8, background: "linear-gradient(135deg,#F87171,#B91C1C)", boxShadow: "0 8px 24px -8px rgba(220,38,38,0.5)" }}>Alert support now</GoldButton>
            <GhostButton onClick={() => setSos(false)}>Cancel</GhostButton>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto", padding: "14px 18px calc(18px + env(safe-area-inset-bottom))", background: "linear-gradient(0deg, #050505 60%, transparent)" }}>
        <GoldButton onClick={onEnd}>End booking</GoldButton>
      </div>
    </div>
  );
}
function IconBtn({ icon: Icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 10, background: bg2, border: `1px solid ${border}`,
      display: "flex", alignItems: "center", justifyContent: "center", color: silver, cursor: "pointer",
    }}><Icon size={14} /></button>
  );
}

/* -------------------------------------------------------------------------
   RATING
------------------------------------------------------------------------- */
function RatingScreen({ team, onDone }) {
  const cats = ["Professionalism", "Punctuality", "Behaviour", "Communication"];
  const [ratings, setRatings] = useState({});
  const [overall, setOverall] = useState(0);

  return (
    <div style={{ padding: "30px 18px 130px" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: textPri }}>How was your experience?</div>
        <div style={{ fontSize: 13, color: textSec, marginTop: 6 }}>Rate {team.map(t=>t.name).join(" & ")}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
        {[1,2,3,4,5].map(n => (
          <Star key={n} size={34} onClick={() => setOverall(n)}
            fill={n <= overall ? gold : "none"} color={n <= overall ? gold : border}
            style={{ cursor: "pointer" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cats.map(c => (
          <div key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13.5, color: textPri }}>{c}</span>
            <div style={{ display: "flex", gap: 3 }}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={18} onClick={() => setRatings({ ...ratings, [c]: n })}
                  fill={n <= (ratings[c]||0) ? gold : "none"} color={n <= (ratings[c]||0) ? gold : border}
                  style={{ cursor: "pointer" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto", padding: "14px 18px calc(18px + env(safe-area-inset-bottom))", background: "linear-gradient(0deg, #050505 60%, transparent)" }}>
        <GoldButton disabled={!overall} onClick={onDone}>Submit rating</GoldButton>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   HOME / DASHBOARD
------------------------------------------------------------------------- */
function Home({ go, bookings, active }) {
  const quick = [
    { id: "womens", label: "Women's safety" },
    { id: "night", label: "Night out" },
    { id: "college", label: "College event" },
    { id: "party", label: "Party" },
  ];
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 12, color: textSec }}>Welcome back</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: textPri }}>{PROFILE.name}</div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: bg1, border: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Bell size={17} color={silver} /></div>
      </div>

      {active && (
        <Card style={{ marginBottom: 18, border: `1px solid ${gold}55` }} onClick={() => go("active")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: goldSoft, fontWeight: 700 }}>ACTIVE BOOKING</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: textPri, marginTop: 4 }}>{active.count} bouncers · {active.address}</div>
            </div>
            <ChevronRight size={18} color={goldSoft} />
          </div>
        </Card>
      )}

      <GoldButton onClick={() => go("purpose")} icon={ArrowRight} style={{ marginBottom: 22 }}>Book bouncers</GoldButton>

      <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 12 }}>QUICK REQUESTS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 26 }}>
        {quick.map(q => (
          <div key={q.id} onClick={() => go("purpose", q.id)} style={{
            background: bg1, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 12px",
            fontSize: 13, fontWeight: 700, color: textPri, cursor: "pointer",
          }}>{q.label}</div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: silver, marginBottom: 12 }}>RECENT BOOKINGS</div>
      {bookings.length === 0 && <div style={{ fontSize: 13, color: textSec }}>No bookings yet. Your history will show up here.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {bookings.slice(0, 3).map((b, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: textPri }}>{PURPOSES.find(p=>p.id===b.purpose)?.label}</div>
              <div style={{ fontSize: 11.5, color: "#4ADE80", fontWeight: 700 }}>Completed</div>
            </div>
            <div style={{ fontSize: 11.5, color: textSec, marginTop: 4 }}>{b.date} · {b.count} bouncers · ₹{b.total?.toLocaleString("en-IN")}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BookingsPage({ bookings }) {
  const [tab, setTab] = useState("all");
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: textPri, marginBottom: 16 }}>Bookings</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
        {["all","completed"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding: "8px 14px", borderRadius: 100, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
            background: tab === t ? GOLD : bg1, color: tab === t ? "#1A1300" : textSec,
            border: `1px solid ${tab === t ? gold : border}`, cursor: "pointer",
          }}>{t === "all" ? "All" : "Completed"}</div>
        ))}
      </div>
      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: textSec, fontSize: 13.5 }}>
          No bookings yet. Book your first team of bouncers to see it here.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bookings.map((b, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: textPri }}>{PURPOSES.find(p=>p.id===b.purpose)?.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80" }}>Completed</span>
              </div>
              <div style={{ fontSize: 12, color: textSec }}>{b.address}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                <span style={{ fontSize: 11.5, color: textSec }}>{b.date} · {b.time}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: goldSoft }}>₹{b.total?.toLocaleString("en-IN")}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ toast }) {
  const items = [
    { icon: Bookmark, label: "Saved locations" },
    { icon: UserIcon, label: "Emergency contact" },
    { icon: ShieldCheck, label: "Safety centre" },
    { icon: MessageCircle, label: "Support" },
  ];
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
        <Avatar name={PROFILE.name} size={58} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: textPri }}>{PROFILE.name}</div>
          <div style={{ fontSize: 12.5, color: textSec }}>{PROFILE.phone}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(it => {
          const Icon = it.icon;
          return (
            <div key={it.label} onClick={() => toast("Coming soon in this prototype.")} style={{
              display: "flex", alignItems: "center", gap: 12, background: bg1, border: `1px solid ${border}`,
              borderRadius: 14, padding: "14px 14px", cursor: "pointer",
            }}>
              <Icon size={17} color={silver} />
              <span style={{ fontSize: 13.5, color: textPri, flex: 1 }}>{it.label}</span>
              <ChevronRight size={16} color={textSec} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 22, textAlign: "center", fontSize: 11, color: "#5A5A5A" }}>
        Bouncers on Tips · prototype build
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   NAV
------------------------------------------------------------------------- */
function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "bookings", label: "Bookings", icon: CalendarIcon },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 420, margin: "0 auto",
      background: "rgba(10,10,10,0.9)", backdropFilter: "blur(10px)", borderTop: `1px solid ${border}`,
      display: "flex", padding: "10px 10px calc(10px + env(safe-area-inset-bottom))",
    }}>
      {items.map(it => {
        const Icon = it.icon;
        const sel = tab === it.id;
        return (
          <div key={it.id} onClick={() => setTab(it.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 0", cursor: "pointer",
          }}>
            <Icon size={19} color={sel ? goldSoft : textSec} />
            <span style={{ fontSize: 10.5, color: sel ? goldSoft : textSec, fontWeight: sel ? 700 : 500 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", left: 18, right: 18, bottom: 96, maxWidth: 384, margin: "0 auto",
      background: bg2, border: `1px solid ${border}`, borderRadius: 14, padding: "12px 16px",
      color: textPri, fontSize: 13, zIndex: 60, boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
      animation: "btIn .25s ease",
    }}>{msg}</div>
  );
}

/* -------------------------------------------------------------------------
   APP ROOT
------------------------------------------------------------------------- */
const WIZARD_STEPS = ["purpose","count","level","preferences","location","datetime","summary"];

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [tab, setTab] = useState("home");
  const [booking, setBooking] = useState({});
  const [team, setTeam] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const toast = useCallback((m) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(""), 2400);
  }, []);

  function goWizard(step, presetPurpose) {
    if (presetPurpose) setBooking(b => ({ ...b, purpose: presetPurpose }));
    setScreen(step);
  }

  function stepIndex(s) { return WIZARD_STEPS.indexOf(s); }
  function nextStep() {
    const idx = stepIndex(screen);
    setScreen(WIZARD_STEPS[idx + 1]);
  }
  function prevStep() {
    const idx = stepIndex(screen);
    if (idx <= 0) { setScreen(tab === "home" && pastBookings.length === 0 && !activeBooking ? "landing" : "home"); return; }
    setScreen(WIZARD_STEPS[idx - 1]);
  }

  function confirmBooking(total) {
    setBooking(b => ({ ...b, total }));
    setScreen("radar");
  }

  function radarDone(members) {
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
    setPastBookings(p => [{ ...booking }, ...p]);
    setActiveBooking(null);
    setBooking({});
    setTeam([]);
    setTab("home");
    setScreen("home");
  }

  let content;
  if (screen === "landing") content = <Landing go={goWizard} toast={toast} />;
  else if (screen === "purpose") content = <StepPurpose booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "count") content = <StepCount booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "level") content = <StepLevel booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "preferences") content = <StepPresenceGender booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "location") content = <StepLocation booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "datetime") content = <StepDateTime booking={booking} setBooking={setBooking} next={nextStep} back={prevStep} />;
  else if (screen === "summary") content = <StepSummary booking={booking} next={confirmBooking} back={prevStep} />;
  else if (screen === "radar") content = <LiveRadar booking={booking} onDone={radarDone} />;
  else if (screen === "teamConfirmed") content = <TeamConfirmed team={team} booking={booking} onTrack={trackTeam} />;
  else if (screen === "active") content = <ActiveBooking team={team} booking={activeBooking || booking} onEnd={endBooking} toast={toast} />;
  else if (screen === "rating") content = <RatingScreen team={team} onDone={finishRating} />;
  else if (screen === "home") content = <Home go={goWizard} bookings={pastBookings} active={activeBooking} />;
  else if (screen === "bookings") content = <BookingsPage bookings={pastBookings} />;
  else if (screen === "profile") content = <ProfilePage toast={toast} />;

  const showNav = ["home","bookings","profile"].includes(screen);

  function switchTab(t) {
    setTab(t);
    setScreen(t);
  }

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: bg0,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative", overflowX: "hidden",
    }}>
      {content}
      {showNav && <BottomNav tab={screen} setTab={switchTab} />}
      <Toast msg={toastMsg} />
    </div>
  );
}
