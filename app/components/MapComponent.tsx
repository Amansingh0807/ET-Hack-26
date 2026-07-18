"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { ActiveTanker, Route } from "@/lib/db";

interface MapComponentProps {
  tankers: ActiveTanker[];
  routes: Route[];
  activeEvent: any | null;
  selectedTankerId: string | null;
  onSelectTanker: (tankerId: string) => void;
}

export default function MapComponent({
  tankers,
  routes,
  activeEvent,
  selectedTankerId,
  onSelectTanker
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    polylines: Record<string, L.Polyline>;
    markers: Record<string, L.Marker>;
    circles: Record<string, L.Circle>;
    labels: L.Marker[];
  }>({
    polylines: {},
    markers: {},
    circles: {},
    labels: []
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance centered on Arabian Sea / Northern Indian Ocean
    const map = L.map(mapContainerRef.current, {
      center: [15, 65],
      zoom: 4,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false // Custom placement later
    });

    mapRef.current = map;

    // CartoDB Dark Matter tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Zoom controls on bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add labels for key chokepoints
    const chokepoints = [
      { name: "Strait of Hormuz", latlng: [26.56, 56.25] as [number, number] },
      { name: "Suez Canal", latlng: [29.9, 32.5] as [number, number] },
      { name: "Red Sea", latlng: [18.0, 40.0] as [number, number] },
      { name: "Cape of Good Hope", latlng: [-34.35, 18.47] as [number, number] }
    ];

    chokepoints.forEach(cp => {
      const labelIcon = L.divIcon({
        className: "bg-transparent",
        html: `<div class="px-2 py-0.5 bg-black/80 border border-zinc-700 text-zinc-400 font-mono text-[9px] uppercase tracking-wider rounded whitespace-nowrap">${cp.name}</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      });
      const labelMarker = L.marker(cp.latlng, { icon: labelIcon, zIndexOffset: -100 }).addTo(map);
      layersRef.current.labels.push(labelMarker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map state based on activeEvent, tankers and routes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const { polylines, markers, circles } = layersRef.current;

    // 1. Clear old layers
    Object.values(polylines).forEach(l => l.remove());
    Object.values(markers).forEach(m => m.remove());
    Object.values(circles).forEach(c => c.remove());
    layersRef.current.polylines = {};
    layersRef.current.markers = {};
    layersRef.current.circles = {};

    // 2. Draw active zones & pulse effects if a crisis is active
    if (activeEvent && activeEvent.affectedZone !== "None" && activeEvent.severityScore > 1) {
      const zoneName = activeEvent.affectedZone;
      let coords: [number, number] = [0, 0];

      if (zoneName === "Strait of Hormuz") coords = [26.56, 56.25];
      else if (zoneName === "Red Sea") coords = [18.0, 40.0];
      else if (zoneName === "Suez Canal") coords = [29.9, 32.5];

      // Draw red threat circle
      const radius = activeEvent.severityScore * 80000; // scaling radius based on severity
      const circle = L.circle(coords, {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.15,
        weight: 1.5,
        className: "animate-pulse"
      }).addTo(map);

      // Add a second pulsing ring
      const outerRing = L.circle(coords, {
        color: "#f97316",
        fillColor: "transparent",
        weight: 1,
        dashArray: "4 4",
        radius: radius * 1.5
      }).addTo(map);

      circles[zoneName] = circle;
      circles[`${zoneName}-outer`] = outerRing;

      // Pan to the incident zone
      map.flyTo(coords, 5, { animate: true, duration: 1.5 });
    } else {
      // Fit bounds to show typical routes (Persian Gulf to India)
      // Only do this when reset or no active event
      if (!activeEvent || activeEvent.affectedZone === "None") {
        map.setView([15, 65], 4);
      }
    }

    // 3. Draw Route Polylines
    tankers.forEach(tanker => {
      const route = routes.find(r => r.id === tanker.routeId);
      if (!route) return;

      let lineColor = "#0ea5e9"; // Default sky-blue
      let lineWeight = 2;
      let lineDash = "";

      if (tanker.status === "AT_RISK") {
        lineColor = "#f97316"; // Warning orange
        lineWeight = 2.5;
        lineDash = "2 4";
      } else if (tanker.status === "REROUTED") {
        lineColor = "#10b981"; // Safe green
        lineWeight = 2.5;
        lineDash = "5 5";
      }

      // Draw active route path
      const polyline = L.polyline(route.geoCoordinates, {
        color: lineColor,
        weight: lineWeight,
        dashArray: lineDash,
        opacity: selectedTankerId === tanker.id ? 0.9 : 0.45
      }).addTo(map);

      polyline.on("click", () => onSelectTanker(tanker.id));
      polylines[tanker.id] = polyline;
    });

    // 4. Draw Tanker Markers
    tankers.forEach(tanker => {
      const isSelected = selectedTankerId === tanker.id;
      let statusColor = "bg-sky-500 border-sky-400";
      let pulseRing = "";

      if (tanker.status === "AT_RISK") {
        statusColor = "bg-amber-500 border-amber-400 text-amber-500";
        pulseRing = '<span class="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>';
      } else if (tanker.status === "REROUTED") {
        statusColor = "bg-emerald-500 border-emerald-400";
        pulseRing = '<span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping"></span>';
      }

      const shipIcon = L.divIcon({
        className: "relative bg-transparent",
        html: `
          <div class="flex items-center justify-center cursor-pointer">
            <span class="absolute h-8 w-8 rounded-full flex items-center justify-center">
              ${pulseRing}
              <div class="relative w-6 h-6 rounded-full ${statusColor} border-2 shadow-lg flex items-center justify-center text-white font-bold transition-transform hover:scale-125 duration-200 ${isSelected ? "scale-125 outline outline-2 outline-white" : ""}">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 text-white">
                  <path d="M2 21h20M19.3 14.8C21.1 13.5 22 11.7 22 10V5h-3v4.3c0 .8-.5 1.5-1.2 1.7L12 13 6.2 11c-.7-.2-1.2-.9-1.2-1.7V5H2v5c0 1.7.9 3.5 2.7 4.8L2 19h20l-2.7-4.2z"></path>
                </svg>
              </div>
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([tanker.currentLat, tanker.currentLng], { icon: shipIcon }).addTo(map);

      // Tooltip / Popup binding
      marker.bindTooltip(`
        <div class="p-2 bg-zinc-950/95 border border-zinc-800 text-white font-sans text-xs rounded shadow-xl leading-normal">
          <div class="font-bold text-zinc-100">${tanker.vesselName}</div>
          <div class="text-[10px] text-zinc-400 mt-0.5">Cargo: <span class="text-zinc-200 font-mono">${tanker.cargoVolume.toLocaleString()} BBL</span></div>
          <div class="text-[10px] text-zinc-400">Speed: <span class="text-zinc-200 font-mono">${tanker.speedKnots} Knots</span></div>
          <div class="text-[10px] text-zinc-400">Status: 
            <span class="font-semibold ${
              tanker.status === "AT_RISK" ? "text-amber-400" : tanker.status === "REROUTED" ? "text-emerald-400" : "text-sky-400"
            }">${tanker.status}</span>
          </div>
        </div>
      `, {
        direction: "top",
        offset: [0, -10],
        opacity: 0.95
      });

      marker.on("click", () => {
        onSelectTanker(tanker.id);
      });

      markers[tanker.id] = marker;
    });

  }, [tankers, routes, activeEvent, selectedTankerId]);

  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-950">
      {/* Map Target Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Subtle bottom-left UI coordinates overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-zinc-900/90 border border-zinc-800/80 px-3 py-1.5 rounded font-mono text-[9px] text-zinc-500 shadow-2xl backdrop-blur-md">
        SYS_STATUS: ACTIVE | GRID_MODE: GEOSPATIAL_NAV | LAT_LNG: 15.0000° N, 65.0000° E
      </div>
    </div>
  );
}
