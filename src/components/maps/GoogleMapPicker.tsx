'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GOOGLE_MAPS_API_KEY, DARK_GOLD_MAP_STYLE, DEFAULT_BENGALURU_COORDS } from '@/lib/google-maps-config';
import { Navigation, MapPin, Loader2, Compass } from 'lucide-react';
import { soundEffects } from '@/lib/sound-effects';

interface GoogleMapPickerProps {
  initialAddress: string;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export default function GoogleMapPicker({ initialAddress, onLocationSelect }: GoogleMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(DEFAULT_BENGALURU_COORDS);
  const [addressText, setAddressText] = useState(initialAddress || 'Indiranagar 100ft Road, Bengaluru');
  const [isLocating, setIsLocating] = useState(false);

  // Reverse Geocoding helper
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!window.google?.maps?.Geocoder) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === 'OK' && results?.[0]) {
        const fullAddr = results[0].formatted_address;
        setAddressText(fullAddr);
        onLocationSelect({ address: fullAddr, lat, lng });
      } else {
        const fallback = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, Bengaluru`;
        setAddressText(fallback);
        onLocationSelect({ address: fallback, lat, lng });
      }
    });
  }, [onLocationSelect]);

  // Load Google Maps Script
  useEffect(() => {
    let isMounted = true;

    function initMap() {
      if (!mapContainerRef.current || !window.google?.maps) return;

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: currentCoords,
        zoom: 15,
        styles: DARK_GOLD_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'greedy',
      });
      mapInstanceRef.current = map;

      // Custom SVG Golden Pin Marker
      const goldPinSvg = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#F59E0B',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.8,
        anchor: new window.google.maps.Point(12, 22),
      };

      const marker = new window.google.maps.Marker({
        position: currentCoords,
        map: map,
        draggable: true,
        icon: goldPinSvg,
        animation: window.google.maps.Animation.DROP,
        title: 'Drag to set service location',
      });
      markerInstanceRef.current = marker;

      // Drag listener
      marker.addListener('dragend', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setCurrentCoords({ lat, lng });
        reverseGeocode(lat, lng);
        soundEffects.playTap();
      });

      // Map click listener
      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        setCurrentCoords({ lat, lng });
        reverseGeocode(lat, lng);
        soundEffects.playTap();
      });

      // Add nearby roaming dummy bouncer dots around the center
      const nearbyOffsets = [
        { dLat: 0.003, dLng: 0.002, female: true },
        { dLat: -0.002, dLng: -0.003, female: false },
        { dLat: 0.004, dLng: -0.002, female: true },
        { dLat: -0.003, dLng: 0.004, female: false },
      ];

      nearbyOffsets.forEach((off) => {
        const bouncerPin = {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: off.female ? '#F472B6' : '#60A5FA',
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: 6,
        };
        new window.google.maps.Marker({
          position: { lat: currentCoords.lat + off.dLat, lng: currentCoords.lng + off.dLng },
          map: map,
          icon: bouncerPin,
          title: off.female ? 'Female Officer Active' : 'Male Bouncer Active',
        });
      });

      if (isMounted) setLoading(false);
    }

    if (window.google?.maps) {
      initMap();
    } else {
      const scriptId = 'google-maps-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) initMap();
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            if (isMounted) initMap();
          }
        }, 150);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [currentCoords, reverseGeocode]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    soundEffects.playTap();
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPos = { lat, lng };
        setCurrentCoords(newPos);
        setIsLocating(false);

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.panTo(newPos);
          mapInstanceRef.current.setZoom(16);
          markerInstanceRef.current.setPosition(newPos);
        }
        reverseGeocode(lat, lng);
      },
      () => {
        setIsLocating(false);
        // Fallback to Bengaluru Indiranagar
        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.panTo(DEFAULT_BENGALURU_COORDS);
          markerInstanceRef.current.setPosition(DEFAULT_BENGALURU_COORDS);
        }
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
      {/* Real Google Map Div */}
      <div ref={mapContainerRef} className="w-full h-64 relative z-10" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
          <span className="text-xs font-bold text-zinc-300">Loading Real-Time Google Maps...</span>
        </div>
      )}

      {/* Floating GPS Locate Me Button */}
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md shadow-xl hover:bg-amber-400 hover:text-black transition-all active:scale-95"
      >
        {isLocating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
      </button>

      {/* Bottom Map Instruction Banner */}
      <div className="absolute bottom-2.5 inset-x-3 z-30 bg-zinc-950/85 backdrop-blur-md rounded-xl py-1.5 px-3 text-[11px] font-bold text-center text-zinc-300 border border-zinc-800/80 shadow-md">
        📍 Drag pin or tap on Google Maps to pinpoint venue
      </div>
    </div>
  );
}
