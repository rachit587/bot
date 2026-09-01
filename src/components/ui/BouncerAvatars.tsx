'use client';

import React from 'react';

export function MaleBouncerAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Glow Ring */}
      <circle cx="60" cy="60" r="56" fill="#0c0d12" stroke="url(#maleGoldGrad)" strokeWidth="3" filter="drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.5))" />
      
      {/* Heavy Muscular Neck & Trapezius */}
      <path d="M42 52L30 72H90L78 52H42Z" fill="#D4936B" stroke="#8A4A28" strokeWidth="1" />
      <path d="M48 44V56C48 62.5 53 66 60 66C67 66 72 62.5 72 56V44H48Z" fill="#D4936B" />
      
      {/* Head with Defined Strong Jawline */}
      <circle cx="60" cy="32" r="17" fill="#D4936B" />
      
      {/* Short Military Crew Hair */}
      <path d="M44 26C45 18 52 14 60 14C68 14 75 18 76 26C72 23 66 22 60 22C54 22 48 23 44 26Z" fill="#18181B" />
      <path d="M43 28V36C43 36 44 38 46 38V28H43Z" fill="#18181B" />
      <path d="M77 28V36C77 36 76 38 74 38V28H77Z" fill="#18181B" />

      {/* Heavy Tactical Dark Sunglasses with Gold Trim */}
      <path d="M45 29C45 27 47 26 50.5 26H57C58.5 26 59.5 27 59.5 28.5V34C59.5 36.5 57.5 38 54.5 38H49.5C46.5 38 45 36.5 45 34V29Z" fill="#050505" stroke="#F59E0B" strokeWidth="1" />
      <path d="M75 29C75 27 73 26 69.5 26H63C61.5 26 60.5 27 60.5 28.5V34C60.5 36.5 62.5 38 65.5 38H70.5C73.5 38 75 36.5 75 34V29Z" fill="#050505" stroke="#F59E0B" strokeWidth="1" />
      <path d="M57 29H63" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sunglass Lens Reflection */}
      <path d="M48 29L52 34" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M68 29L72 34" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Security Acoustic Earpiece & Clear Coil Wire */}
      <circle cx="76" cy="34" r="2" fill="#E4E4E7" />
      <path d="M76 36C79 40 78 48 74 54" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* Strong Stern Mouth */}
      <path d="M56 46H64" stroke="#683419" strokeWidth="1.8" strokeLinecap="round" />

      {/* Massive Shoulders & Bodyguard Combat Armor Vest */}
      <path d="M22 116C22 84 34 66 60 66C86 66 98 84 98 116H22Z" fill="#121318" stroke="#27272A" strokeWidth="1.5" />
      {/* Tactical Vest Front Plates */}
      <path d="M40 70H80V116H40V70Z" fill="#1C1D24" stroke="#3F3F46" strokeWidth="1" />
      <path d="M44 76H76" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 86H76" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 96H76" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />

      {/* Bulky Biceps & Forearms with Kevlar ARM PROTECTION GUARDS */}
      {/* Left Bicep */}
      <path d="M24 78C20 90 26 102 38 108C42 110 48 106 50 100C46 92 40 84 34 78H24Z" fill="#D4936B" stroke="#121318" strokeWidth="1.5" />
      {/* Right Bicep */}
      <path d="M96 78C100 90 94 102 82 108C78 110 72 106 70 100C74 92 80 84 86 78H96Z" fill="#D4936B" stroke="#121318" strokeWidth="1.5" />
      
      {/* Forearm Tactical Arm Guards / Kevlar Bracers */}
      <path d="M30 94C38 90 52 90 62 94C66 96 64 102 58 106C46 110 36 106 28 102C26 100 27 96 30 94Z" fill="#1F2128" stroke="#F59E0B" strokeWidth="1" />
      <path d="M90 94C82 90 68 90 58 94C54 96 56 102 62 106C74 110 84 106 92 102C94 100 93 96 90 94Z" fill="#1F2128" stroke="#F59E0B" strokeWidth="1" />
      <path d="M36 96L54 100" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M84 96L66 100" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Gold Security Commando Shield Badge */}
      <path d="M57 73C57 71 60 70 60 70C60 70 63 71 63 73C63 78 60 80 60 80C60 80 57 78 57 73Z" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
      <circle cx="60" cy="74.5" r="1.2" fill="#0A0A0A" />

      <defs>
        <linearGradient id="maleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FemaleBouncerAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Glow Ring */}
      <circle cx="60" cy="60" r="56" fill="#0c0d12" stroke="url(#femaleGoldGrad)" strokeWidth="3" filter="drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.5))" />

      {/* High Ponytail / Long Sleek Hair Bun & Tail */}
      <ellipse cx="60" cy="18" rx="8" ry="6" fill="#18181B" />
      <path d="M64 16C74 16 84 22 86 34C88 44 82 52 78 58C77 53 82 42 78 32C76 26 70 20 64 18V16Z" fill="#18181B" />
      {/* Back Hair Volume */}
      <circle cx="60" cy="30" r="16" fill="#18181B" />

      {/* Feminine Athletic Neck with Trapezius */}
      <path d="M46 52L36 72H84L74 52H46Z" fill="#E8A782" stroke="#8A4A28" strokeWidth="1" />
      <path d="M51 44V56C51 61.5 55 64.5 60 64.5C65 64.5 69 61.5 69 56V44H51Z" fill="#E8A782" />
      
      {/* Feminine Contoured Face & Jawline */}
      <circle cx="60" cy="33" r="15" fill="#E8A782" />
      {/* Elegant Front Hair Bangs */}
      <path d="M45 28C47 20 53 17 60 17C67 17 73 20 75 28C70 24 64 23 60 23C55 23 50 24 45 28Z" fill="#18181B" />
      <path d="M45 28C44 34 45 40 47 43C46 39 46 34 47 30L45 28Z" fill="#18181B" />
      <path d="M75 28C76 34 75 40 73 43C74 39 74 34 73 30L75 28Z" fill="#18181B" />

      {/* Sleek Tactical Aviators with Gold Accent */}
      <path d="M47 30C47 28.5 49 27.5 51.5 27.5H56.5C57.8 27.5 58.8 28.5 58.8 29.8V34C58.8 36.5 57 38 54.5 38H50.5C48 38 47 36.5 47 34V30Z" fill="#0A0A0A" stroke="#F59E0B" strokeWidth="0.9" />
      <path d="M73 30C73 28.5 71 27.5 68.5 27.5H63.5C62.2 27.5 61.2 28.5 61.2 29.8V34C61.2 36.5 63 38 65.5 38H69.5C72 38 73 36.5 73 34V30Z" fill="#0A0A0A" stroke="#F59E0B" strokeWidth="0.9" />
      <path d="M57 30H63" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lens Reflection Highlight */}
      <path d="M49 30L53 34" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <path d="M67 30L71 34" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.85" />

      {/* Security Acoustic Earpiece with White/Silver Cable */}
      <circle cx="73" cy="35" r="1.8" fill="#FFFFFF" />
      <path d="M73 37C76 42 75 49 71 55" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* Defined Feminine Lips */}
      <path d="M56 46C58 48 62 48 64 46" stroke="#B43403" strokeWidth="1.8" strokeLinecap="round" />

      {/* Fitted Tactical Close-Protection Vest */}
      <path d="M26 116C26 86 36 68 60 68C84 68 94 86 94 116H26Z" fill="#14151B" stroke="#27272A" strokeWidth="1.5" />
      {/* Body Armor Contours & V-Neck Gold Trim */}
      <path d="M44 68L60 84L76 68" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 88H72" stroke="#27272A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M46 98H74" stroke="#27272A" strokeWidth="1.8" strokeLinecap="round" />

      {/* Athletic Muscular Arms with TACTICAL ARM GUARDS */}
      {/* Left Bicep */}
      <path d="M28 80C25 90 30 100 42 106C45 107 50 104 52 98C48 91 42 84 36 80H28Z" fill="#E8A782" stroke="#14151B" strokeWidth="1.5" />
      {/* Right Bicep */}
      <path d="M92 80C95 90 90 100 78 106C75 107 70 104 68 98C72 91 78 84 84 80H92Z" fill="#E8A782" stroke="#14151B" strokeWidth="1.5" />
      
      {/* Tactical Forearm Bracers / Arm Protection */}
      <path d="M34 94C42 90 54 90 62 94C65 96 63 101 58 104C48 108 39 105 32 101C31 99 32 96 34 94Z" fill="#1F2128" stroke="#F59E0B" strokeWidth="1" />
      <path d="M86 94C78 90 66 90 58 94C55 96 57 101 62 104C72 108 81 105 88 101C89 99 88 96 86 94Z" fill="#1F2128" stroke="#F59E0B" strokeWidth="1" />
      <path d="M40 96L54 100" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M80 96L66 100" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />

      {/* Gold Shield Badge */}
      <path d="M57 76C57 74 60 73 60 73C60 73 63 74 63 76C63 80 60 82 60 82C60 82 57 80 57 76Z" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />

      <defs>
        <linearGradient id="femaleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MixedTeamAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute -left-1.5 top-0 w-[85%] h-[85%] z-0 opacity-95">
        <MaleBouncerAvatar className="w-full h-full" />
      </div>
      <div className="absolute -right-1.5 bottom-0 w-[85%] h-[85%] z-10">
        <FemaleBouncerAvatar className="w-full h-full" />
      </div>
    </div>
  );
}
