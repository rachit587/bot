export const GOOGLE_MAPS_API_KEY = "AIzaSyD9iXWp2a1zie3UX4Dm2IJpeXcGxpVQOk0";

export const DEFAULT_BENGALURU_COORDS = {
  lat: 12.9716,
  lng: 77.5946,
};

export const HOTSPOT_LOCATIONS = [
  { name: "Indiranagar 100ft Road", lat: 12.9784, lng: 77.6408, address: "100ft Road, Indiranagar, Bengaluru" },
  { name: "Koramangala 4th Block", lat: 12.9352, lng: 77.6245, address: "80ft Road, 4th Block, Koramangala, Bengaluru" },
  { name: "Church Street / MG Road", lat: 12.9756, lng: 77.6066, address: "Church Street, Ashok Nagar, Bengaluru" },
  { name: "HSR Layout 27th Main", lat: 12.9121, lng: 77.6446, address: "27th Main Road, Sector 1, HSR Layout, Bengaluru" },
  { name: "Whitefield ITPL", lat: 12.9866, lng: 77.7381, address: "ITPL Main Road, Whitefield, Bengaluru" },
  { name: "Jayanagar 4th Block", lat: 12.9299, lng: 77.5826, address: "11th Main Road, 4th Block, Jayanagar, Bengaluru" },
];

/* Ultra-Luxury Dark & Neon Gold Google Maps Style */
export const DARK_GOLD_MAP_STYLE: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0d0f17" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#07080d" }, { weight: 3 }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f59e0b" }, { weight: 1.5 }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#111822" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1c2230" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#141722" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#b45309" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#78350f" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fde047" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#293245" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#171c26" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#06080d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
];
