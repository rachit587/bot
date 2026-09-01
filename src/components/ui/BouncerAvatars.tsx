'use client';

import React from 'react';

export function MaleBouncerAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Glow Circle */}
      <circle cx="60" cy="60" r="56" fill="#121212" stroke="url(#goldGrad)" strokeWidth="3" filter="drop-shadow(0px 0px 8px rgba(234, 179, 8, 0.4))" />
      
      {/* Head & Neck */}
      <path d="M50 44V54C50 59.5 54.5 64 60 64C65.5 64 70 59.5 70 54V44H50Z" fill="#F3C49F" />
      <circle cx="60" cy="34" r="18" fill="#F3C49F" />
      
      {/* Black Sunglasses */}
      <path d="M46 32C46 30.5 48 29 51 29H57C58.5 29 59.5 30 59.5 31.5V36C59.5 38 57.5 39.5 55 39.5H50C47.5 39.5 46 38 46 36V32Z" fill="#0A0A0A" stroke="#FFD700" strokeWidth="0.8" />
      <path d="M74 32C74 30.5 72 29 69 29H63C61.5 29 60.5 30 60.5 31.5V36C60.5 38 62.5 39.5 65 39.5H70C72.5 39.5 74 38 74 36V32Z" fill="#0A0A0A" stroke="#FFD700" strokeWidth="0.8" />
      <path d="M57 32H63" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
      {/* Sunglass Highlight */}
      <path d="M49 32L53 36" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M67 32L71 36" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

      {/* Confident Jaw & Mouth */}
      <path d="M57 46H63" stroke="#8A4A28" strokeWidth="1.5" strokeLinecap="round" />

      {/* Shoulders & Muscular Black Tight Polo */}
      <path d="M30 114C30 90 40 68 60 68C80 68 90 90 90 114H30Z" fill="#151515" stroke="#333333" strokeWidth="1.5" />
      {/* Polo Collar */}
      <path d="M50 68L60 78L70 68L65 65L60 71L55 65L50 68Z" fill="#0A0A0A" stroke="#FFD700" strokeWidth="1" />

      {/* Bulky Muscular Arms (Folded / Crossed in Front) */}
      {/* Left Upper Arm */}
      <path d="M32 82C30 92 36 104 46 108C50 110 56 106 58 100C54 94 48 88 42 82L32 82Z" fill="#F3C49F" stroke="#151515" strokeWidth="2" />
      {/* Right Upper Arm */}
      <path d="M88 82C90 92 84 104 74 108C70 110 64 106 62 100C66 94 72 88 78 82L88 82Z" fill="#F3C49F" stroke="#151515" strokeWidth="2" />
      {/* Crossed Forearms */}
      <path d="M40 96C50 94 65 94 78 98C82 100 80 106 72 108C58 111 46 106 38 102C36 100 37 97 40 96Z" fill="#F3C49F" stroke="#151515" strokeWidth="2" />
      {/* Tattoos / Muscle Contour */}
      <path d="M36 86C38 90 40 94 44 96" stroke="#8A4A28" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M84 86C82 90 80 94 76 96" stroke="#8A4A28" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Gold Security Crest Badge */}
      <circle cx="60" cy="85" r="4.5" fill="#FFD700" />
      <path d="M58.5 85L60 83L61.5 85L60 87L58.5 85Z" fill="#0A0A0A" />

      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="50%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FemaleBouncerAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Glow Circle */}
      <circle cx="60" cy="60" r="56" fill="#121212" stroke="url(#goldGradFemale)" strokeWidth="3" filter="drop-shadow(0px 0px 8px rgba(234, 179, 8, 0.4))" />

      {/* Hair Bun / Back Hair */}
      <circle cx="60" cy="28" r="16" fill="#18181B" />
      <ellipse cx="60" cy="22" rx="9" ry="8" fill="#27272A" />

      {/* Head & Neck */}
      <path d="M52 46V54C52 58.5 55.5 62 60 62C64.5 62 68 58.5 68 54V46H52Z" fill="#F7D0B4" />
      <circle cx="60" cy="36" r="15" fill="#F7D0B4" />
      {/* Front Hair Strands */}
      <path d="M45 32C47 24 53 22 60 22C67 22 73 24 75 32C71 28 65 27 60 27C55 27 49 28 45 32Z" fill="#18181B" />

      {/* Aviator Sunglasses */}
      <path d="M48 35C48 33.5 50 32.5 52.5 32.5H57C58 32.5 59 33.5 59 34.5V38C59 40 57.5 41 55.5 41H51.5C49.5 41 48 40 48 38V35Z" fill="#0A0A0A" stroke="#FFD700" strokeWidth="0.8" />
      <path d="M72 35C72 33.5 70 32.5 67.5 32.5H63C62 32.5 61 33.5 61 34.5V38C61 40 62.5 41 64.5 41H68.5C70.5 41 72 40 72 38V35Z" fill="#0A0A0A" stroke="#FFD700" strokeWidth="0.8" />
      <path d="M57 34H63" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Highlight */}
      <path d="M50 35L53 38" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M66 35L69 38" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

      {/* Security Radio Earpiece Wire */}
      <path d="M74 38C77 42 75 52 70 56" stroke="#E4E4E7" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" />

      {/* Lips */}
      <path d="M57 47H63" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />

      {/* Tactical Fit Black Security Uniform */}
      <path d="M33 114C33 92 42 70 60 70C78 70 87 92 87 114H33Z" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
      {/* V-Neck / Tactical Zipper */}
      <path d="M54 70L60 80L66 70" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />

      {/* Athletic Crossed Arms */}
      <path d="M36 84C34 94 40 104 50 108C54 109 58 105 60 100C56 94 50 88 44 84L36 84Z" fill="#F7D0B4" stroke="#18181B" strokeWidth="1.5" />
      <path d="M84 84C86 94 80 104 70 108C66 109 62 105 60 100C64 94 70 88 76 84L84 84Z" fill="#F7D0B4" stroke="#18181B" strokeWidth="1.5" />
      <path d="M42 96C51 94 64 94 76 98C80 100 78 105 70 107C58 109 48 105 40 101C39 99 40 97 42 96Z" fill="#F7D0B4" stroke="#18181B" strokeWidth="1.5" />

      {/* Gold Shield Badge */}
      <path d="M57 84C57 82 60 81 60 81C60 81 63 82 63 84C63 88 60 90 60 90C60 90 57 88 57 84Z" fill="#FFD700" stroke="#CA8A04" strokeWidth="0.5" />

      <defs>
        <linearGradient id="goldGradFemale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MixedTeamAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute -left-1 top-0 w-4/5 h-4/5 z-0 opacity-90">
        <MaleBouncerAvatar className="w-full h-full" />
      </div>
      <div className="absolute -right-1 bottom-0 w-4/5 h-4/5 z-10">
        <FemaleBouncerAvatar className="w-full h-full" />
      </div>
    </div>
  );
}
