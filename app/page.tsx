"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ActiveTanker, Route, GeopoliticalEvent } from "@/lib/db";
import { ModelerResult, FixerRecommendation } from "@/lib/agents";
import LiveThreatFeed from "./components/LiveThreatFeed";
import ImpactPanel from "./components/ImpactPanel";
import { Waves, Activity, Zap } from "lucide-react";

// MapComponent requires browser APIs
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--background)] text-sm text-[var(--gray-500)]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-blue)] mb-4"></div>
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
      setModeler(initialModeler);
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
            // Loop progress back to start when reaching India to simulate continuous traffic
            return { ...tanker, progress: 0 };
          }
          
          // Speed scale: speedKnots is around 13-15.
          // Increment progress slightly per tick
          const speedFactor = tanker.speedKnots / 15;
          const increment = 0.03 * speedFactor; // yields smooth movement every 100ms
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
      <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="glass-panel rounded-2xl px-5 py-3 flex items-center gap-3 pointer-events-auto">
          <div className="bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-indigo)] p-2 rounded-xl text-white shadow-lg">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-[15px] tracking-tight">Rampart</h1>
            <p className="text-[11px] text-[var(--accent-blue)] font-medium uppercase tracking-widest">Supply Resilience</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl px-5 py-3 flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <Activity className="w-4 h-4 text-[var(--accent-emerald)] animate-pulse-glow" />
            <span>Database Synced</span>
          </div>
        </div>
      </header>

      {/* Main App Layout overlayed on Map */}
      <div className="absolute inset-0 top-[88px] z-10 flex p-4 gap-4 pointer-events-none">
        
        {/* Left Side: Live Feed Panel */}
        <div className="w-[380px] h-full flex flex-col pointer-events-auto opacity-0 animate-soft-in">
          <div className="glass-panel rounded-3xl h-full overflow-hidden flex flex-col shadow-2xl border border-[var(--panel-border)]">
            <LiveThreatFeed
              events={events}
              onTriggerEvent={triggerEvent}
              onReset={resetState}
            />
          </div>
        </div>

        <div className="flex-1 flex justify-center items-start pt-4">
          {/* Tactical Advisory floating pill */}
          {activeEvent && activeEvent.affectedZone !== "None" && (
            <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-3 pointer-events-auto animate-soft-in border-[var(--accent-rose)] shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <Zap className="w-5 h-5 text-[var(--accent-rose)] animate-pulse-glow" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[var(--accent-rose)] uppercase tracking-widest">Tactical Alert</span>
                <span className="text-[13px] font-semibold">{activeEvent.headline}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Impact & Orchestration */}
        <div className="w-[420px] h-full flex flex-col pointer-events-auto opacity-0 animate-soft-in" style={{ animationDelay: '150ms' }}>
          <div className="glass-panel rounded-3xl h-full overflow-hidden flex flex-col shadow-2xl border border-[var(--panel-border)]">
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
    </div>
  );
}
