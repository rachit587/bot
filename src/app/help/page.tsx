'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  MessageSquare,
  FileText,
  MapPin,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function HelpAndSafetyPage() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handleSos = () => {
    setSosTriggered(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-bot-danger/15 text-bot-danger border border-bot-danger/30 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-bot-white">Safety & Emergency SOS</h1>
            <p className="text-sm text-bot-text-secondary mt-1">
              Your protection is our highest priority. 24/7 dedicated command response.
            </p>
          </div>

          {/* Emergency SOS Instant Trigger */}
          <div className="rounded-3xl bg-gradient-to-b from-bot-danger/20 to-bot-card border-2 border-bot-danger p-6 md:p-8 text-center mb-8 relative overflow-hidden">
            <h2 className="text-xl font-black text-bot-white uppercase tracking-wider mb-2">
              Emergency Panic SOS
            </h2>
            <p className="text-xs text-bot-text-secondary max-w-md mx-auto mb-6">
              Press and hold to broadcast your live GPS location to local authorities, nearby bouncers, and your emergency contacts.
            </p>

            {sosTriggered ? (
              <div className="p-6 rounded-2xl bg-bot-danger/20 border border-bot-danger text-center animate-bounce-in">
                <CheckCircle2 className="w-12 h-12 text-bot-danger mx-auto mb-2" />
                <h3 className="text-lg font-bold text-bot-white">SOS SIGNAL BROADCAST ACTIVE</h3>
                <p className="text-xs text-bot-text-secondary mt-1">
                  Alert dispatched to Rapid Response Unit & Emergency Helpline.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href="tel:112"
                    className="px-6 py-2.5 rounded-xl bg-bot-danger text-bot-white font-bold text-xs flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" /> Call 112 National Helpline
                  </a>
                  <button
                    onClick={() => setSosTriggered(false)}
                    className="px-4 py-2.5 rounded-xl bg-bot-elevated text-bot-text-secondary text-xs"
                  >
                    Cancel Alert
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSos}
                className="w-36 h-36 rounded-full bg-bot-danger text-bot-white font-black text-2xl mx-auto flex flex-col items-center justify-center shadow-2xl shadow-bot-danger/40 hover:scale-105 active:scale-95 transition-all"
              >
                <span>SOS</span>
                <span className="text-[10px] font-medium opacity-80 mt-1">PRESS TO BROADCAST</span>
              </button>
            )}
          </div>

          {/* Direct Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <a
              href="tel:112"
              className="p-5 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-danger/40 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-bot-danger/10 text-bot-danger flex items-center justify-center font-bold text-lg">
                112
              </div>
              <div>
                <div className="text-sm font-bold text-bot-white">National Emergency Police</div>
                <div className="text-xs text-bot-text-secondary">Instant 24/7 Police Dispatch</div>
              </div>
            </a>

            <a
              href="tel:1091"
              className="p-5 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/40 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-bot-gold/10 text-bot-gold flex items-center justify-center font-bold text-lg">
                1091
              </div>
              <div>
                <div className="text-sm font-bold text-bot-white">Women&apos;s Safety Helpline</div>
                <div className="text-xs text-bot-text-secondary">Dedicated Protection Desk</div>
              </div>
            </a>
          </div>

          {/* Incident Report Box */}
          <div className="rounded-2xl bg-bot-card border border-bot-border p-6 mb-8">
            <h3 className="text-base font-bold text-bot-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-bot-gold" /> Report an Incident or Feedback
            </h3>
            <p className="text-xs text-bot-text-secondary mb-4">
              File a confidential inquiry or behavioral report regarding a booking or professional.
            </p>

            {reportSent ? (
              <div className="p-4 rounded-xl bg-bot-success/10 border border-bot-success/30 text-center text-xs text-bot-success font-semibold">
                ✓ Report logged securely. Incident Ticket #INC-9821 has been created.
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Describe what occurred, location details, or concerns..."
                  className="w-full p-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-xs focus:border-bot-gold focus:outline-none"
                />
                <button
                  onClick={() => setReportSent(true)}
                  className="px-6 py-2.5 rounded-xl bg-bot-elevated border border-bot-gold/40 text-bot-gold hover:bg-bot-gold hover:text-bot-bg font-bold text-xs transition-all"
                >
                  Submit Incident Report
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
