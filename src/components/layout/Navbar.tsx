'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  User,
  Shield,
  Zap,
  MapPin,
  Calendar,
  Compass,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const pathname = usePathname();
  const { role, setRole, demoMode } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-bot-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Official Logo Brand Link */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-10 w-28 sm:w-32 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Bouncers on Tips (BOT)"
                  fill
                  priority
                  className="object-contain filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink href="/" active={isActive('/')}>Direct Book</NavLink>
              <NavLink href="/discover" active={isActive('/discover')}>Browse Fleet</NavLink>
              <NavLink href="/bookings" active={isActive('/bookings')}>Activity</NavLink>
              <NavLink href="/dashboard" active={isActive('/dashboard')}>My Hub</NavLink>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Switcher Pills */}
              {demoMode && (
                <div className="flex items-center gap-0.5 p-1 rounded-xl bg-bot-elevated border border-bot-border text-xs">
                  {(['customer', 'bouncer', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                        role === r
                          ? 'bg-gradient-to-r from-bot-gold-neon to-bot-gold text-bot-bg shadow-sm'
                          : 'text-bot-text-secondary hover:text-bot-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick 1-Tap Sign In / Connect */}
              <button
                onClick={() => setShowPhoneModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bot-elevated border border-bot-border hover:border-bot-gold text-xs font-semibold text-bot-white transition-all"
              >
                <User className="w-3.5 h-3.5 text-bot-gold" />
                <span>+91 98765...</span>
              </button>

              <Link
                href="/notifications"
                className="relative p-2 rounded-xl bg-bot-elevated/50 hover:bg-bot-elevated border border-bot-border transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-bot-text-secondary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bot-gold-neon rounded-full animate-pulse" />
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-white"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-bot-border bg-bot-card/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-slide-up shadow-2xl">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bot-elevated text-sm font-semibold text-bot-gold"
            >
              <Zap className="w-4 h-4 text-bot-gold" /> Direct Ride-Style Booking
            </Link>
            <Link
              href="/discover"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bot-elevated text-sm font-medium text-bot-text-secondary hover:text-bot-white"
            >
              <Compass className="w-4 h-4" /> Find Bouncers
            </Link>
            <Link
              href="/bookings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bot-elevated text-sm font-medium text-bot-text-secondary hover:text-bot-white"
            >
              <Calendar className="w-4 h-4" /> My Bookings
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bot-elevated text-sm font-medium text-bot-text-secondary hover:text-bot-white"
            >
              <User className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              href="/bouncer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bot-elevated text-sm font-medium text-bot-text-secondary hover:text-bot-white"
            >
              <Shield className="w-4 h-4" /> Bouncer / Partner App
            </Link>
            <Link
              href="/admin/operations"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bot-elevated text-sm font-medium text-bot-text-secondary hover:text-bot-white"
            >
              <MapPin className="w-4 h-4" /> Live Operations Map
            </Link>
          </div>
        )}
      </nav>

      {/* Floating Bottom App Navigation for Mobile (Rapido/Uber Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-bot-border px-3 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === '/' ? 'text-bot-gold font-bold scale-105' : 'text-bot-text-secondary'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px]">Book</span>
        </Link>
        <Link
          href="/discover"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === '/discover' ? 'text-bot-gold font-bold scale-105' : 'text-bot-text-secondary'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Fleet</span>
        </Link>
        <Link
          href="/bookings"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === '/bookings' ? 'text-bot-gold font-bold scale-105' : 'text-bot-text-secondary'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Activity</span>
        </Link>
        <Link
          href="/help"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === '/help' ? 'text-bot-danger font-bold scale-105' : 'text-bot-text-secondary'
          }`}
        >
          <Shield className="w-5 h-5 text-bot-danger" />
          <span className="text-[10px]">SOS</span>
        </Link>
      </div>

      {/* Instant Phone Sign-in Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-bot-card border border-bot-border p-6 text-center relative shadow-2xl">
            <button
              onClick={() => setShowPhoneModal(false)}
              className="absolute top-4 right-4 text-bot-text-secondary hover:text-bot-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-12 w-28 mx-auto mb-3">
              <Image src="/logo.png" alt="BOT" fill className="object-contain" />
            </div>
            <h3 className="text-lg font-bold text-bot-white mb-1">Instant Demo Connect</h3>
            <p className="text-xs text-bot-text-secondary mb-4">No password needed. Ready to book backup.</p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-bot-elevated border border-bot-border mb-4">
              <span className="text-sm font-bold text-bot-gold">+91</span>
              <input
                type="tel"
                defaultValue="98765 43210"
                className="bg-transparent text-sm text-bot-white font-semibold focus:outline-none flex-1"
              />
            </div>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full py-3 rounded-xl btn-neon-gold text-xs font-black uppercase tracking-wider"
            >
              Continue directly
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
        active
          ? 'text-bot-gold bg-bot-elevated border border-bot-gold/30 shadow-sm'
          : 'text-bot-text-secondary hover:text-bot-white hover:bg-bot-elevated/60'
      }`}
    >
      {children}
    </Link>
  );
}
