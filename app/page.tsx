"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ActiveTanker, Route, GeopoliticalEvent } from "@/lib/db";
import { ModelerResult, FixerRecommendation } from "@/lib/agents";
import LiveThreatFeed from "./components/LiveThreatFeed";
import ImpactPanel from "./components/ImpactPanel";
import { Waves, Activity, Zap, Radio, BarChart2, Map as MapIcon, RefreshCw } from "lucide-react";

// MapComponent requires browser APIs
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--background)] text-xs md:text-sm text-[var(--gray-500)]">
      <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-[var(--accent-blue)] mb-4"></div>
      <p className="font-medium text-[var(--accent-blue)]">Loading Global Vectors...</p>
    </div>
  )
});

const initialModeler: ModelerResult = {
  basePrice: 78.50,
  newSpotPrice: 78.50,
  priceIncreasePercent: 0,
  sprRemainingDays: 9.50,
  refineryImpact: "STABLE",
  impactDetails: "No significant supply chain disruptions detected."
};

export default function Home() {
  const [tankers, setTankers] = useState<ActiveTanker[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [events, setEvents] = useState<GeopoliticalEvent[]>([]);
  const [modeler, setModeler] = useState<ModelerResult>(initialModeler);
  const [fixer, setFixer] = useState<FixerRecommendation | null>(null);
  const [activeEvent, setActiveEvent] = useState<GeopoliticalEvent | null>(null);
  const [selectedTankerId, setSelectedTankerId] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"map" | "feed" | "impact">("map");

  // Fetch initial live oil market price on mount
  useEffect(() => {
    fetch("/api/oil-price")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.price) {
          setModeler(prev => ({
            ...prev,
            basePrice: data.price,
            newSpotPrice: data.price
          }));
        }
      })
      .catch(err => console.warn("Could not fetch initial live oil price:", err));
  }, []);

  // SSE handler for realtime updates
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.addEventListener("crisis_triggered", (e: any) => {
      const data = JSON.parse(e.data);
      setActiveEvent(data.event);
      setEvents(prev => [data.event, ...prev]);
      setModeler(data.modeler);
      setFixer(data.fixer);
      setTankers(data.tankers);
    });

    eventSource.addEventListener("tanker_rerouted", (e: any) => {
      const data = JSON.parse(e.data);
      setTankers(data.tankers);
      if (data.resolved) {
        setFixer(null);
        setActiveEvent(null);
        setModeler(prev => ({
          ...prev,
          refineryImpact: "STABLE",
          newSpotPrice: prev.basePrice,
          priceIncreasePercent: 0,
          impactDetails: "Alternative shipping corridors active. Strategic reserve depletion halted."
        }));
      }
    });

    eventSource.addEventListener("system_reset", (e: any) => {
      const data = JSON.parse(e.data);
      setTankers(data.tankers);
      setEvents(data.events || []);
      setRoutes(data.routes || []);
      if (data.liveOil?.price) {
        setModeler({
          ...initialModeler,
          basePrice: data.liveOil.price,
          newSpotPrice: data.liveOil.price
        });
      } else {
        setModeler(initialModeler);
      }
      setFixer(null);
      setActiveEvent(null);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Smooth live progress simulation loop (moves tankers along paths)
  useEffect(() => {
    const timer = setInterval(() => {
      setTankers(prevTankers =>
        prevTankers.map(tanker => {
          if (tanker.progress >= 100) {
            return { ...tanker, progress: 0 };
          }
          const speedFactor = tanker.speedKnots / 15;
          const increment = 0.03 * speedFactor;
          const nextProgress = Math.min(100, tanker.progress + increment);
          
          return {
            ...tanker,
            progress: nextProgress
          };
        })
      );
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const triggerEvent = async (headline: string, source: string) => {
    try {
      await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, source })
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
        body: JSON.stringify({ tankerId, newRouteId })
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

  useEffect(() => {
    resetState();
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[var(--background)] overflow-hidden font-sans">
      
      {/* Absolute Background Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          tankers={tankers}
          routes={routes}
          activeEvent={activeEvent}
          selectedTankerId={selectedTankerId}
          onSelectTanker={(id) => setSelectedTankerId(id === selectedTankerId ? null : id)}
        />
      </div>

      {/* Floating Header */}
      <header className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="glass-panel rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-3 pointer-events-auto">
          <div className="bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-indigo)] p-1.5 md:p-2 rounded-lg md:rounded-xl text-white shadow-lg">
            <Waves className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <h1 className="font-bold text-xs md:text-[15px] tracking-tight">Rampart</h1>
            <p className="text-[9px] md:text-[11px] text-[var(--accent-blue)] font-medium uppercase tracking-widest hidden sm:block">Supply Resilience</p>
          </div>
        </div>

        <div className="glass-panel rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-4 pointer-events-auto">
          <div className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[13px] font-medium">
            <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--accent-emerald)] animate-pulse-glow" />
            <span className="hidden sm:inline">Database Synced</span>
            <span className="sm:hidden">Live</span>
          </div>
        </div>
      </header>

      {/* Main App Layout overlayed on Map */}
      <div className="absolute inset-0 top-[60px] md:top-[88px] bottom-[56px] lg:bottom-0 z-10 flex flex-col lg:flex-row p-2 md:p-4 gap-3 md:gap-4 pointer-events-none">
        
        {/* Left Side: Live Feed Panel (Desktop or Active Mobile Tab) */}
        <div className={`w-full lg:w-[360px] xl:w-[380px] h-full flex flex-col pointer-events-auto transition-all duration-300 ${
          activeMobileTab === "feed" ? "flex" : "hidden lg:flex"
        }`}>
          <div className="glass-panel rounded-2xl md:rounded-3xl h-full overflow-hidden flex flex-col shadow-2xl border border-[var(--panel-border)]">
            <LiveThreatFeed
              events={events}
              onTriggerEvent={triggerEvent}
              onReset={resetState}
            />
          </div>
        </div>

        {/* Center: Floating Alert Banner */}
        <div className={`flex-1 flex justify-center items-start pt-2 md:pt-4 ${
          activeMobileTab === "map" ? "flex" : "hidden lg:flex"
        }`}>
          {activeEvent && activeEvent.affectedZone !== "None" && (
            <div className="glass-panel rounded-2xl md:rounded-full px-4 py-2.5 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 pointer-events-auto animate-soft-in border-[var(--accent-rose)] shadow-[0_0_30px_rgba(244,63,94,0.3)] max-w-sm md:max-w-md">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent-rose)] animate-pulse-glow shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] md:text-[10px] font-bold text-[var(--accent-rose)] uppercase tracking-widest">Tactical Alert</span>
                <span className="text-[11px] md:text-[13px] font-semibold truncate">{activeEvent.headline}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Impact & Orchestration Panel (Desktop or Active Mobile Tab) */}
        <div className={`w-full lg:w-[380px] xl:w-[420px] h-full flex flex-col pointer-events-auto transition-all duration-300 ${
          activeMobileTab === "impact" ? "flex" : "hidden lg:flex"
        }`}>
          <div className="glass-panel rounded-2xl md:rounded-3xl h-full overflow-hidden flex flex-col shadow-2xl border border-[var(--panel-border)]">
            <ImpactPanel
              tankers={tankers}
              routes={routes}
              modeler={modeler}
              fixer={fixer}
              onExecuteReroute={executeReroute}
            />
          </div>
        </div>

      </div>

      {/* Mobile/Tablet Bottom Navigation Bar */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30 bg-[var(--panel-bg)] backdrop-blur-xl border-t border-[var(--panel-border)] flex items-center justify-around px-4 py-2">
        <button
          onClick={() => setActiveMobileTab("feed")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
            activeMobileTab === "feed" ? "text-[var(--accent-blue)] bg-[var(--accent-blue)]/10" : "text-[var(--gray-500)]"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Signals</span>
        </button>

        <button
          onClick={() => setActiveMobileTab("map")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
            activeMobileTab === "map" ? "text-[var(--accent-blue)] bg-[var(--accent-blue)]/10" : "text-[var(--gray-500)]"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Map View</span>
        </button>

        <button
          onClick={() => setActiveMobileTab("impact")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
            activeMobileTab === "impact" ? "text-[var(--accent-blue)] bg-[var(--accent-blue)]/10" : "text-[var(--gray-500)]"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Impact</span>
        </button>
      </div>

    </div>
  );
}
