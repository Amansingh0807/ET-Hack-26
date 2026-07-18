"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ActiveTanker, Route, GeopoliticalEvent } from "@/lib/db";
import { ModelerResult, FixerRecommendation } from "@/lib/agents";
import LiveThreatFeed from "./components/LiveThreatFeed";
import ImpactPanel from "./components/ImpactPanel";
import { Shield, Compass, Server, Info, AlertTriangle } from "lucide-react";

// Dynamically import MapComponent to prevent SSR issues (Leaflet needs standard browser window)
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 font-mono text-xs text-zinc-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mb-3"></div>
      LOADING GEOSPATIAL CORE LAYERS...
    </div>
  ),
});

// Baseline Seed Values for Initial Load (Matches DB baseline)
const initialRoutes: Route[] = [
  {
    id: "route-saudi",
    supplierId: "saudi",
    destinationPort: "Mumbai Port",
    transitDays: 6,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [26.7, 50.2],
      [26.56, 56.25],
      [24.0, 59.0],
      [21.0, 65.0],
      [19.0, 72.8],
    ],
  },
  {
    id: "route-adnoc",
    supplierId: "adnoc",
    destinationPort: "Kochi Port",
    transitDays: 5,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [24.4, 54.3],
      [26.56, 56.25],
      [24.0, 59.0],
      [16.0, 68.0],
      [9.97, 76.22],
    ],
  },
  {
    id: "route-rosneft",
    supplierId: "rosneft",
    destinationPort: "Vadinar Port",
    transitDays: 16,
    chokePoints: ["Suez Canal", "Red Sea"],
    geoCoordinates: [
      [44.7, 37.8],
      [39.0, 25.0],
      [32.5, 32.0],
      [29.9, 32.5],
      [20.0, 39.0],
      [12.6, 43.3],
      [11.5, 48.0],
      [15.0, 60.0],
      [22.44, 69.72],
    ],
  },
  {
    id: "route-iraq",
    supplierId: "iraq",
    destinationPort: "Paradeep Port",
    transitDays: 11,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [29.9, 48.6],
      [26.56, 56.25],
      [24.0, 59.0],
      [12.0, 65.0],
      [5.5, 78.0],
      [12.0, 84.0],
      [20.26, 86.67],
    ],
  },
];

const initialTankers: ActiveTanker[] = [
  {
    id: "tanker-hormuz-pioneer",
    vesselName: "Hormuz Pioneer (VLCC)",
    currentLat: 25.1,
    currentLng: 57.8,
    routeId: "route-saudi",
    status: "ON_TRACK",
    cargoVolume: 1500000,
    progress: 35,
    speedKnots: 14.5,
  },
  {
    id: "tanker-suez-monarch",
    vesselName: "Suez Monarch (Suezmax)",
    currentLat: 22.5,
    currentLng: 38.2,
    routeId: "route-rosneft",
    status: "ON_TRACK",
    cargoVolume: 2000000,
    progress: 45,
    speedKnots: 13.0,
  },
  {
    id: "tanker-mesopotamia-star",
    vesselName: "Mesopotamia Star (VLCC)",
    currentLat: 28.5,
    currentLng: 50.8,
    routeId: "route-iraq",
    status: "ON_TRACK",
    cargoVolume: 1800000,
    progress: 5,
    speedKnots: 15.0,
  },
  {
    id: "tanker-atlantic-endeavour",
    vesselName: "Atlantic Endeavour (Suezmax)",
    currentLat: -32.5,
    currentLng: 14.2,
    routeId: "route-petrobras",
    status: "ON_TRACK",
    cargoVolume: 1200000,
    progress: 30,
    speedKnots: 13.8,
  },
];

const initialModeler: ModelerResult = {
  basePrice: 78.5,
  newSpotPrice: 78.5,
  priceIncreasePercent: 0,
  sprRemainingDays: 9.5,
  refineryImpact: "STABLE",
  impactDetails:
    "All Indian refiners reporting normal stock runs. Strait operations secure.",
};

const initialEvents: GeopoliticalEvent[] = [
  {
    id: "event-0",
    headline:
      "System Initialized: Energy supply lines operating under standard maritime baselines.",
    source: "Rampart Intel",
    affectedZone: "None",
    severityScore: 1,
    timestamp: new Date().toISOString(),
    briefSummary:
      "All energy corridors report stable transit times. No shipping warnings active.",
  },
];

export default function Home() {
  const [tankers, setTankers] = useState<ActiveTanker[]>(initialTankers);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [events, setEvents] = useState<GeopoliticalEvent[]>(initialEvents);
  const [modeler, setModeler] = useState<ModelerResult>(initialModeler);
  const [fixer, setFixer] = useState<FixerRecommendation | null>(null);
  const [activeEvent, setActiveEvent] = useState<GeopoliticalEvent | null>(
    null,
  );
  const [selectedTankerId, setSelectedTankerId] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");

  // Live ticking clock in header (IST)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeStr(`${formatter.format(new Date())} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up SSE Event Source to receive updates pushed from the Node backend
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.addEventListener("crisis_triggered", (e: any) => {
      const data = JSON.parse(e.data);
      setActiveEvent(data.event);
      setEvents((prev) => {
        // Exclude default initialization event if real events are added
        const filtered = prev.filter((ev) => ev.id !== "event-0");
        return [data.event, ...filtered];
      });
      setModeler(data.modeler);
      setFixer(data.fixer);
      setTankers(data.tankers);
    });

    eventSource.addEventListener("tanker_rerouted", (e: any) => {
      const data = JSON.parse(e.data);
      setTankers(data.tankers);
      if (data.resolved) {
        // Clear active alerts and fixer proposal once all tankers are safe
        setFixer(null);
        setActiveEvent(null);
        setModeler((prev) => ({
          ...prev,
          refineryImpact: "STABLE",
          newSpotPrice: prev.basePrice,
          priceIncreasePercent: 0,
          impactDetails:
            "Alternative shipping corridors active. Strategic reserve depletion halted.",
        }));
      }
    });

    eventSource.addEventListener("system_reset", (e: any) => {
      const data = JSON.parse(e.data);
      setTankers(data.tankers);
      setEvents(initialEvents);
      setModeler(initialModeler);
      setFixer(null);
      setActiveEvent(null);
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const triggerEvent = async (headline: string, source: string) => {
    try {
      await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, source }),
      });
    } catch (e) {
      console.error("Failed to trigger event:", e);
    }
  };

  const executeReroute = async (tankerId: string, newRouteId: string) => {
    try {
      await fetch("/api/reroute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tankerId, newRouteId }),
      });
    } catch (e) {
      console.error("Failed to execute reroute:", e);
    }
  };

  const resetState = async () => {
    try {
      await fetch("/api/reset", { method: "POST" });
    } catch (e) {
      console.error("Failed to reset:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 font-sans overflow-hidden">
      {/* Top command center header */}
      <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 text-zinc-100 z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-sky-950/50 border border-sky-900/60 rounded text-sky-400">
            <Shield className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase font-mono text-zinc-100">
              PROJECT RAMPART
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              India Energy Supply Resilience Intelligence System
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
          <div className="hidden md:flex items-center gap-2 border-r border-zinc-800 pr-6">
            <Server className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              DB_STATE:{" "}
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 border-r border-zinc-800 pr-6">
            <Compass className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              GEO_GRID: <span className="text-sky-400 font-bold">READY</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Indian Flag Aesthetic */}
            <div className="flex flex-col w-4 h-3 rounded overflow-hidden shadow">
              <div className="bg-[#FF9933] h-1"></div>
              <div className="bg-white h-1 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#000080]"></div>
              </div>
              <div className="bg-[#128807] h-1"></div>
            </div>
            <span className="font-bold text-zinc-300 min-w-[85px] text-right">
              {timeStr}
            </span>
          </div>
        </div>
      </header>

      {/* Grid Dashboard Core Layout */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar - Timeline Signals (20%) */}
        <aside className="w-[20%] h-full flex-shrink-0 z-10">
          <LiveThreatFeed
            events={events}
            onTriggerEvent={triggerEvent}
            onReset={resetState}
          />
        </aside>

        {/* Main Central Map Panel (60%) */}
        <main className="flex-1 h-full relative z-0">
          {activeEvent && activeEvent.affectedZone !== "None" && (
            <div className="absolute top-4 left-4 z-[400] max-w-sm bg-red-950/80 border border-red-800 text-red-100 p-3 rounded shadow-2xl backdrop-blur-md animate-bounce-short">
              <div className="flex items-start gap-2 text-xs leading-normal">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold uppercase tracking-wider text-[10px] text-red-400 mb-0.5">
                    Maritime Advisory Active
                  </div>
                  <span className="font-semibold text-zinc-200">
                    {activeEvent.headline}
                  </span>
                </div>
              </div>
            </div>
          )}

          <MapComponent
            tankers={tankers}
            routes={routes}
            activeEvent={activeEvent}
            selectedTankerId={selectedTankerId}
            onSelectTanker={(id) =>
              setSelectedTankerId(id === selectedTankerId ? null : id)
            }
          />
        </main>

        {/* Right Sidebar - Economic Impacts & Orchestrator (20%) */}
        <aside className="w-[20%] h-full flex-shrink-0 z-10">
          <ImpactPanel
            tankers={tankers}
            routes={routes}
            modeler={modeler}
            fixer={fixer}
            onExecuteReroute={executeReroute}
          />
        </aside>
      </div>
    </div>
  );
}
          <div className="flex items-center gap-3.5">
            <div className="flex flex-col w-5 h-4 rounded overflow-hidden shadow border border-zinc-800">
              <div className="bg-[#FF9933] h-1.5"></div>
              <div className="bg-white h-1 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#000080]"></div>
              </div>
              <div className="bg-[#128807] h-1.5"></div>
            </div>
            <span className="font-bold text-amber-400/90 text-sm tracking-widest bg-[#09090f] px-2.5 py-0.5 border border-zinc-800 rounded">
              {timeStr}
            </span>
          </div>
        </div>
      </header>

      {/* Grid Dashboard Core Layout */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Left Sidebar - Timeline Signals (20%) */}
        <aside className="w-[20%] h-full flex-shrink-0 z-10 opacity-0 animate-panel-in">
          <LiveThreatFeed
            events={events}
            onTriggerEvent={triggerEvent}
            onReset={resetState}
          />
        </aside>

        {/* Main Central Map Panel (60%) */}
        <main className="flex-1 h-full relative z-0 opacity-0 animate-panel-in [animation-delay:150ms]">
          {activeEvent && activeEvent.affectedZone !== "None" && (
            <div className="absolute top-4 left-4 z-[400] max-w-sm bg-[#0a0505]/95 border border-red-900/60 text-red-200 p-4 rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-l-4 border-l-red-500 animate-bounce-short">
              <div className="flex items-start gap-2 text-xs leading-normal">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <div className="font-mono font-bold uppercase tracking-widest text-[11px] text-red-400 mb-0.5">Tactical Advisory Active</div>
                  <span className="font-semibold text-zinc-100 font-mono leading-snug text-[13px]">{activeEvent.headline}</span>
                </div>
              </div>
            </div>
          )}

          <MapComponent
            tankers={tankers}
            routes={routes}
            activeEvent={activeEvent}
            selectedTankerId={selectedTankerId}
            onSelectTanker={(id) => setSelectedTankerId(id === selectedTankerId ? null : id)}
          />
        </main>

        {/* Right Sidebar - Economic Impacts & Orchestrator (20%) */}
        <aside className="w-[20%] h-full flex-shrink-0 z-10 opacity-0 animate-panel-in [animation-delay:300ms]">
          <ImpactPanel
            tankers={tankers}
            routes={routes}
            modeler={modeler}
            fixer={fixer}
            onExecuteReroute={executeReroute}
          />
        </aside>
      </div>
    </div>
  );
}
