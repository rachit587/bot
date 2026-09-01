'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/stores/auth-store';
import {
  User,
  Phone,
  Mail,
  Shield,
  MapPin,
  Plus,
  AlertCircle,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { currentCustomer } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: currentCustomer.name,
    phone: currentCustomer.phone,
    email: currentCustomer.email,
    emergencyName: currentCustomer.emergencyContact?.name || 'Brother / Family',
    emergencyPhone: currentCustomer.emergencyContact?.phone || '+91 99887 76655',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold p-0.5 flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-bot-elevated flex items-center justify-center text-2xl font-bold text-bot-gold">
                {currentCustomer.name.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bot-white">{currentCustomer.name}</h1>
              <p className="text-xs text-bot-text-secondary">Member since {new Date(currentCustomer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Information */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <h2 className="text-base font-bold text-bot-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-bot-gold" /> Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency SOS Contact */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-bot-gold" />
                <h2 className="text-base font-bold text-bot-white">Trusted Emergency Contact</h2>
              </div>
              <p className="text-xs text-bot-text-secondary mb-4">
                This contact is automatically alerted with your live tracking coordinates if you trigger the SOS button during any active assignment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Contact Name / Relation</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Saved Locations */}
            <div className="rounded-2xl bg-bot-card border border-bot-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-bot-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-bot-gold" /> Saved Frequent Locations
                </h2>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-bot-elevated border border-bot-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-bot-gold" />
                    <div>
                      <div className="text-xs font-semibold text-bot-white">Home</div>
                      <div className="text-[10px] text-bot-text-secondary">Indiranagar 100ft Road, Bengaluru</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-bot-gold font-semibold">Primary</span>
                </div>

                <div className="p-3.5 rounded-xl bg-bot-elevated border border-bot-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-bot-gold" />
                    <div>
                      <div className="text-xs font-semibold text-bot-white">Office / Campus</div>
                      <div className="text-[10px] text-bot-text-secondary">Koramangala 4th Block, Bengaluru</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="text-xs text-bot-success flex items-center gap-1.5 font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-gold text-bot-bg font-extrabold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-bot-gold/25 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
