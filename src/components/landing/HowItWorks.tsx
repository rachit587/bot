'use client';

import { Search, Users, MapPin, Radio, Eye, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Choose what you need', description: 'Select from safety, events, protection, and more' },
  { icon: Users, title: 'Pick your team', description: 'Choose number, level, and preferences' },
  { icon: MapPin, title: 'Choose your location & time', description: 'Pin your location on Google Maps' },
  { icon: Radio, title: 'Nearby bouncers receive your request', description: 'We notify available professionals near you' },
  { icon: Eye, title: 'Watch them accept in real time', description: 'See bouncers accept your request live' },
  { icon: CheckCircle2, title: 'Your team is confirmed', description: 'Track your team as they arrive' },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-bot-white mb-3">How It Works</h2>
          <p className="text-bot-text-secondary text-lg">From request to protection in minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-bot-card border border-bot-border hover:border-bot-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-bot-gold flex items-center justify-center text-bot-bg text-xs font-bold">
                {i + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-bot-elevated flex items-center justify-center mb-4 group-hover:bg-bot-gold/10 transition-colors">
                <step.icon className="w-6 h-6 text-bot-gold" />
              </div>

              <h3 className="text-lg font-semibold text-bot-white mb-2">{step.title}</h3>
              <p className="text-sm text-bot-text-secondary">{step.description}</p>

              {/* Connector Line (hidden on last of each row) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-bot-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
