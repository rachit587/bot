'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_API_KEY, DARK_GOLD_MAP_STYLE, DEFAULT_BENGALURU_COORDS } from '@/lib/google-maps-config';
import { ShieldCheck, MapPin, Loader2 } from 'lucide-react';

interface GoogleMapLiveTrackingProps {
  centerCoords?: { lat: number; lng: number };
  team: any[];
}

export default function GoogleMapLiveTracking({ centerCoords = DEFAULT_BENGALURU_COORDS, team }: GoogleMapLiveTrackingProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const bouncerMarkersRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    function initMap() {
      if (!mapContainerRef.current || !window.google?.maps) return;

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 15,
        styles: DARK_GOLD_MAP_STYLE,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
      });
      mapInstanceRef.current = map;

      // 1. Client Destination Marker
      const clientMarker = new window.google.maps.Marker({
        position: centerCoords,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#F59E0B',
          fillOpacity: 1,
          strokeWeight: 4,
          strokeColor: '#FFFFFF',
          scale: 9,
        },
        title: 'Your Protected Location',
      });

      // 2. Protection Radius Circle
      new window.google.maps.Circle({
        strokeColor: '#F59E0B',
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: '#F59E0B',
        fillOpacity: 0.12,
        map: map,
        center: centerCoords,
        radius: 400,
      });

      // 3. Moving Bouncer Captains Markers
      const initialOffsets = [
        { dLat: 0.004, dLng: 0.003 },
        { dLat: -0.003, dLng: -0.004 },
        { dLat: 0.005, dLng: -0.003 },
      ];

      team.forEach((m, idx) => {
        const offset = initialOffsets[idx % initialOffsets.length];
        const initialPos = {
          lat: centerCoords.lat + offset.dLat,
          lng: centerCoords.lng + offset.dLng,
        };

        const bouncerMarker = new window.google.maps.Marker({
          position: initialPos,
          map: map,
          icon: {
            path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
            fillColor: '#10B981',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 1.4,
          },
          title: `Captain ${m.name} (En Route)`,
        });

        bouncerMarkersRef.current.push(bouncerMarker);
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

    // Interval to gently move bouncer markers towards the center
    const moveInterval = setInterval(() => {
      bouncerMarkersRef.current.forEach((marker) => {
        if (!marker.getPosition) return;
        const current = marker.getPosition();
        const curLat = current.lat();
        const curLng = current.lng();

        // Step towards centerCoords
        const nextLat = curLat + (centerCoords.lat - curLat) * 0.08;
        const nextLng = curLng + (centerCoords.lng - curLng) * 0.08;
        marker.setPosition({ lat: nextLat, lng: nextLng });
      });
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(moveInterval);
    };
  }, [centerCoords, team]);

  return (
    <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
      <div ref={mapContainerRef} className="w-full h-full relative z-10" />

      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
          <span className="text-xs font-bold text-zinc-300">Connecting to Live Tactical Satellites...</span>
        </div>
      )}

      {/* Live Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Live GPS Telemetry Active</span>
      </div>
    </div>
  );
}
