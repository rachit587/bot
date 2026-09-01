'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-bot-border bg-bot-card/80 backdrop-blur-md pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="relative h-12 w-32 mb-3">
              <Image src="/logo.png" alt="BOT" fill className="object-contain" />
            </div>
            <p className="text-xs text-bot-text-secondary leading-relaxed">
              India&apos;s premier on-demand personal security & bouncers booking platform. High deterrence, total discretion.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-bot-gold">
              <span className="w-2 h-2 rounded-full bg-bot-success animate-pulse" />
              <span>Bengaluru Operations Live</span>
            </div>
          </div>

          {/* Direct Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-bot-white mb-3">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="text-bot-text-secondary hover:text-bot-gold">Women&apos;s Safety Escort</Link></li>
              <li><Link href="/" className="text-bot-text-secondary hover:text-bot-gold">Night Out / Club Security</Link></li>
              <li><Link href="/" className="text-bot-text-secondary hover:text-bot-gold">VIP & Celebrity Protection</Link></li>
              <li><Link href="/" className="text-bot-text-secondary hover:text-bot-gold">Campus / College Events</Link></li>
            </ul>
          </div>

          {/* Quick Hub */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-bot-white mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/discover" className="text-bot-text-secondary hover:text-bot-gold">Browse Verified Fleet</Link></li>
              <li><Link href="/bookings" className="text-bot-text-secondary hover:text-bot-gold">My Active Assignments</Link></li>
              <li><Link href="/help" className="text-bot-danger font-bold hover:underline">Emergency 24/7 SOS</Link></li>
              <li><Link href="/dashboard" className="text-bot-text-secondary hover:text-bot-gold">Customer Dashboard</Link></li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-bot-white mb-3">Partners</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/bouncer/onboarding" className="text-bot-gold font-bold hover:underline">Become a Bouncer</Link></li>
              <li><Link href="/bouncer" className="text-bot-text-secondary hover:text-bot-gold">Partner App Dashboard</Link></li>
              <li><Link href="/admin/operations" className="text-bot-text-secondary hover:text-bot-gold">Admin Dispatch Map</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-bot-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-bot-text-secondary">
          <p>© 2026 BOUNCERS ON TIPS (BOT). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>256-Bit Encrypted Platform</span>
            <span>•</span>
            <span className="text-bot-gold">Prototype MVP Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
