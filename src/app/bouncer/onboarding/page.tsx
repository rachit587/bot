'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Shield,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Award,
  Lock,
  Sparkles,
} from 'lucide-react';
import { SERVICE_OPTIONS } from '@/lib/mock-data';
import { ProfessionalLevel, PhysicalPresence } from '@/lib/types';

export default function BouncerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male',
    city: 'Bengaluru',
    experienceYears: '3',
    level: 'PRO' as ProfessionalLevel,
    presence: 'STANDARD' as PhysicalPresence,
    hourlyRate: '800',
    services: ['womens_safety', 'night_out', 'party_club'],
    languages: 'English, Hindi, Kannada',
    idNumber: '',
  });

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-gold p-0.5 mx-auto mb-3 flex items-center justify-center">
              <Shield className="w-6 h-6 text-bot-bg" />
            </div>
            <h1 className="text-3xl font-extrabold text-bot-white">Become a Bouncer</h1>
            <p className="text-bot-text-secondary text-sm mt-1">
              Join the elite on-demand protection network. Flexible assignments, instant payouts.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 px-4">
            {['Personal Info', 'Experience & Tier', 'Verification'].map((label, idx) => {
              const num = idx + 1;
              const active = step >= num;
              return (
                <div key={label} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                      active ? 'bg-bot-gold text-bot-bg' : 'bg-bot-card border border-bot-border text-bot-text-secondary'
                    }`}
                  >
                    {step > num ? '✓' : num}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${active ? 'text-bot-gold' : 'text-bot-text-secondary'}`}>
                    {label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                        step > num ? 'bg-bot-gold' : 'bg-bot-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {submitted ? (
            <div className="rounded-3xl bg-bot-card border border-bot-gold/30 p-8 text-center animate-bounce-in">
              <div className="w-16 h-16 rounded-full bg-bot-success/20 text-bot-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-bot-white mb-2">Application Submitted!</h2>
              <p className="text-sm text-bot-text-secondary mb-6 max-w-md mx-auto">
                Our verification team is reviewing your profile and background checks. You will receive an SMS and WhatsApp activation link once approved.
              </p>
              <div className="p-4 rounded-2xl bg-bot-elevated border border-bot-border mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-bot-text-secondary">Applicant:</span>
                  <span className="text-bot-white font-semibold">{formData.fullName || 'Arjun Singh'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bot-text-secondary">Selected Tier:</span>
                  <span className="text-bot-gold font-semibold">{formData.level} Level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bot-text-secondary">Expected Base Rate:</span>
                  <span className="text-bot-white font-semibold">₹{formData.hourlyRate}/hour</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/bouncer')}
                className="w-full py-4 rounded-xl bg-gradient-gold text-bot-bg font-bold hover:shadow-lg hover:shadow-bot-gold/25 transition-all"
              >
                Go to Bouncer Dashboard (Demo Mode)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl bg-bot-card border border-bot-border p-6 md:p-8">
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold text-bot-white mb-4">Step 1: Personal Details</h3>

                  <div>
                    <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rawat"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Operating City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-gradient-gold text-bot-bg font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-bot-gold/25"
                    >
                      Next: Experience <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-lg font-bold text-bot-white mb-4">Step 2: Experience & Tier</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Years of Experience</label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={formData.experienceYears}
                        onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Desired Base Hourly Rate (₹)</label>
                      <input
                        type="number"
                        min="400"
                        step="50"
                        value={formData.hourlyRate}
                        onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-sm focus:border-bot-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">Level Tier Qualification</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['STANDARD', 'PRO', 'ELITE'] as ProfessionalLevel[]).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({ ...formData, level: lvl })}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            formData.level === lvl
                              ? 'bg-bot-gold/10 border-bot-gold text-bot-gold font-bold'
                              : 'bg-bot-elevated border-bot-border text-bot-text-secondary'
                          }`}
                        >
                          <div className="text-xs">{lvl}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bot-text-secondary mb-2">Service Specializations</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SERVICE_OPTIONS.slice(0, 9).map(service => {
                        const active = formData.services.includes(service.id);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              active
                                ? 'bg-bot-gold/15 border-bot-gold text-bot-white font-medium'
                                : 'bg-bot-elevated border-bot-border text-bot-text-secondary'
                            }`}
                          >
                            {service.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary text-sm font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xl bg-gradient-gold text-bot-bg font-bold text-sm flex items-center gap-2"
                    >
                      Next: Verification <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-lg font-bold text-bot-white mb-2">Step 3: Verification Documents</h3>
                  <p className="text-xs text-bot-text-secondary mb-4">
                    All bouncers undergo a mandatory police background check and security license verification before activation.
                  </p>

                  <div className="border-2 border-dashed border-bot-border hover:border-bot-gold/40 rounded-2xl p-6 text-center cursor-pointer bg-bot-elevated/40">
                    <UploadCloud className="w-8 h-8 text-bot-gold mx-auto mb-2" />
                    <p className="text-xs font-semibold text-bot-white">Upload Government ID (Aadhaar / Passport / Driving License)</p>
                    <p className="text-[10px] text-bot-text-secondary mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>

                  <div className="border-2 border-dashed border-bot-border hover:border-bot-gold/40 rounded-2xl p-6 text-center cursor-pointer bg-bot-elevated/40">
                    <Award className="w-8 h-8 text-bot-gold mx-auto mb-2" />
                    <p className="text-xs font-semibold text-bot-white">Upload Security / Martial Arts / First Aid Certifications (Optional)</p>
                    <p className="text-[10px] text-bot-text-secondary mt-1">Helps unlock PRO & ELITE tier approvals faster</p>
                  </div>

                  <div className="p-4 rounded-xl bg-bot-elevated border border-bot-border flex items-center gap-3">
                    <Lock className="w-5 h-5 text-bot-gold flex-shrink-0" />
                    <p className="text-xs text-bot-text-secondary">
                      Your identity documents are stored in 256-bit encrypted vaults and shared only with certified background check agencies.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary text-sm font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-gradient-gold text-bot-bg font-extrabold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-bot-gold/30"
                    >
                      <Sparkles className="w-4 h-4" /> Submit Application
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
