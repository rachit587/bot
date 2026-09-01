'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/stores/booking-store';
import Navbar from '@/components/layout/Navbar';
import StepProgress from '@/components/booking/StepProgress';
import PurposeStep from '@/components/booking/PurposeStep';
import CountStep from '@/components/booking/CountStep';
import LevelStep from '@/components/booking/LevelStep';
import PresenceStep from '@/components/booking/PresenceStep';
import GenderStep from '@/components/booking/GenderStep';
import LocationStep from '@/components/booking/LocationStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import SummaryStep from '@/components/booking/SummaryStep';
import { ServicePurpose } from '@/lib/types';
import { SERVICE_OPTIONS } from '@/lib/mock-data';

const STEPS = [
  { id: 'purpose', label: 'Purpose' },
  { id: 'count', label: 'Team Size' },
  { id: 'level', label: 'Level' },
  { id: 'presence', label: 'Presence' },
  { id: 'gender', label: 'Preference' },
  { id: 'location', label: 'Location' },
  { id: 'datetime', label: 'Schedule' },
  { id: 'summary', label: 'Confirm' },
];

function BookingContent() {
  const { currentStep, setStep, setPurpose } = useBookingStore();
  const searchParams = useSearchParams();

  // Handle purpose from URL query
  useEffect(() => {
    const purposeParam = searchParams.get('purpose') as ServicePurpose | null;
    if (purposeParam) {
      const option = SERVICE_OPTIONS.find(s => s.id === purposeParam);
      if (option) {
        setPurpose(purposeParam, option.title);
        setStep(1); // Skip to count step
      }
    }
  }, [searchParams, setPurpose, setStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PurposeStep />;
      case 1: return <CountStep />;
      case 2: return <LevelStep />;
      case 3: return <PresenceStep />;
      case 4: return <GenderStep />;
      case 5: return <LocationStep />;
      case 6: return <DateTimeStep />;
      case 7: return <SummaryStep />;
      default: return <PurposeStep />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <StepProgress steps={STEPS} currentStep={currentStep} />
      <div className="mt-8 animate-fade-in" key={currentStep}>
        {renderStep()}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <Suspense fallback={<div className="max-w-3xl mx-auto px-4 text-center py-16 text-bot-text-secondary">Loading booking wizard...</div>}>
          <BookingContent />
        </Suspense>
      </main>
    </div>
  );
}
