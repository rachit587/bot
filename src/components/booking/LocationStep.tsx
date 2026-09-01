'use client';

import { useState, useCallback } from 'react';
import { useBookingStore } from '@/stores/booking-store';
import { ArrowLeft, ArrowRight, MapPin, Navigation, Search, Shield } from 'lucide-react';
import { MOCK_PROFESSIONALS } from '@/lib/mock-data';

// Bengaluru locations for demo
const DEMO_LOCATIONS = [
  { name: 'Indiranagar', address: 'Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala', address: 'Koramangala, Bengaluru, Karnataka', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', address: 'Whitefield, Bengaluru, Karnataka', lat: 12.9698, lng: 77.7500 },
  { name: 'HSR Layout', address: 'HSR Layout, Bengaluru, Karnataka', lat: 12.9116, lng: 77.6389 },
  { name: 'MG Road', address: 'MG Road, Bengaluru, Karnataka', lat: 12.9756, lng: 77.6067 },
  { name: 'Jayanagar', address: 'Jayanagar, Bengaluru, Karnataka', lat: 12.9308, lng: 77.5838 },
  { name: 'Electronic City', address: 'Electronic City, Bengaluru, Karnataka', lat: 12.8399, lng: 77.6770 },
  { name: 'Malleshwaram', address: 'Malleshwaram, Bengaluru, Karnataka', lat: 13.0035, lng: 77.5653 },
];

export default function LocationStep() {
  const { location, setLocation, nextStep, prevStep } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredLocations = DEMO_LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nearbyCount = MOCK_PROFESSIONALS.filter(p => p.isOnline).length;

  const handleSelectLocation = useCallback((loc: typeof DEMO_LOCATIONS[0]) => {
    setLocation({ lat: loc.lat, lng: loc.lng, address: loc.address, shortAddress: loc.name });
    setSearchQuery(loc.name);
    setShowSuggestions(false);
  }, [setLocation]);

  const handleCurrentLocation = () => {
    // Demo: use Indiranagar as default
    handleSelectLocation(DEMO_LOCATIONS[0]);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-bot-white mb-2">Where do you need your bouncers?</h2>
      <p className="text-bot-text-secondary mb-8">Search for a location or use your current position</p>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bot-text-secondary" />
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-bot-card border border-bot-border text-bot-text placeholder:text-bot-text-secondary focus:border-bot-gold focus:outline-none transition-colors"
        />
        <button
          onClick={handleCurrentLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-bot-elevated transition-colors"
          title="Use current location"
        >
          <Navigation className="w-5 h-5 text-bot-gold" />
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-bot-card border border-bot-border rounded-xl overflow-hidden z-10 shadow-lg">
            {filteredLocations.map((loc, i) => (
              <button
                key={i}
                onClick={() => handleSelectLocation(loc)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bot-elevated transition-colors text-left border-b border-bot-border last:border-0"
              >
                <MapPin className="w-4 h-4 text-bot-gold flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-bot-white">{loc.name}</div>
                  <div className="text-xs text-bot-text-secondary">{loc.address}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Fallback */}
      <div className="relative rounded-2xl overflow-hidden bg-bot-card border border-bot-border mb-4" style={{ height: '320px' }}>
        {/* Dark grid map */}
        <div className="absolute inset-0 bg-bot-elevated">
          {/* Grid lines */}
          <svg width="100%" height="100%" className="opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#303030" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Nearby bouncer dots */}
          {MOCK_PROFESSIONALS.filter(p => p.isOnline).slice(0, 12).map((p, i) => (
            <div
              key={p.id}
              className="absolute w-3 h-3 rounded-full bg-bot-gold/60 animate-pulse"
              style={{
                left: `${15 + (i * 6) % 70}%`,
                top: `${15 + ((i * 7 + 13) % 60)}%`,
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}

          {/* Center marker */}
          {location && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Radius circle */}
              <div className="w-40 h-40 rounded-full border-2 border-bot-gold/20 bg-bot-gold/5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              {/* Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-bot-gold flex items-center justify-center shadow-lg shadow-bot-gold/30 animate-bounce-in">
                  <MapPin className="w-5 h-5 text-bot-bg" />
                </div>
                <div className="w-2 h-6 bg-bot-gold/50 rounded-b" />
              </div>
            </div>
          )}

          {/* Instruction overlay if no location */}
          {!location && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-bot-text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-bot-text-secondary text-sm">Search for a location above</p>
                <p className="text-bot-text-secondary text-xs mt-1">or use your current location</p>
              </div>
            </div>
          )}
        </div>

        {/* Map API hint */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-bot-bg/80 text-[10px] text-bot-text-secondary">
          Demo Map • Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google Maps
        </div>
      </div>

      {/* Selected Location Info */}
      {location && (
        <div className="p-4 rounded-xl bg-bot-card border border-bot-gold/30 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bot-gold/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-bot-gold" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-bot-white">{location.shortAddress || 'Selected Location'}</div>
            <div className="text-xs text-bot-text-secondary">{location.address}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-bot-gold">
              <Shield className="w-3 h-3" />
              <span>{nearbyCount} nearby</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Location Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {DEMO_LOCATIONS.slice(0, 6).map((loc) => (
          <button
            key={loc.name}
            onClick={() => handleSelectLocation(loc)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              location?.shortAddress === loc.name
                ? 'bg-bot-gold text-bot-bg'
                : 'bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-text hover:border-bot-gold/30'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-text-secondary hover:text-bot-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={nextStep}
          disabled={!location}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-gold text-bot-bg font-semibold hover:shadow-lg hover:shadow-bot-gold/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm Location <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
