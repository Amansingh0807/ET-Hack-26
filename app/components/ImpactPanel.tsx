"use client";

import { ActiveTanker, Route } from "@/lib/db";
import { ModelerResult, FixerRecommendation } from "@/lib/agents";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { TrendingUp, TrendingDown, Anchor, Factory, AlertTriangle, ShieldCheck } from "lucide-react";

interface ImpactPanelProps {
  tankers: ActiveTanker[];
  routes: Route[];
  modeler: ModelerResult;
  fixer: FixerRecommendation | null;
  onExecuteReroute: (tankerId: string, newRouteId: string) => Promise<void>;
}

export default function ImpactPanel({
  tankers,
  modeler,
  fixer,
  onExecuteReroute
}: ImpactPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [priceHistory, setPriceHistory] = useState<Array<{ time: string; price: number }>>([]);
  const [rerouting, setRerouting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setPriceHistory(prev => {
      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const updated = [...prev, { time: nowStr, price: modeler.newSpotPrice }];
      if (updated.length > 8) updated.shift();
      return updated;
    });
  }, [modeler.newSpotPrice]);

  useEffect(() => {
    if (priceHistory.length === 0) {
      const base = modeler.basePrice;
      const history = [];
      for (let i = 4; i > 0; i--) {
        const time = new Date(Date.now() - i * 10000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        history.push({ time, price: base });
      }
      history.push({
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: modeler.newSpotPrice
      });
      setPriceHistory(history);
    }
  }, [modeler.basePrice]);

  const handleApprove = async (tankerId: string, routeId: string) => {
    setRerouting(true);
    try {
      await onExecuteReroute(tankerId, routeId);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#8b5cf6"]
      });
    } finally {
      setRerouting(false);
    }
  };

  const getRefineryRunRate = (refineryName: string) => {
    if (modeler.refineryImpact === "CRITICAL_SHORTFALL") {
      if (refineryName === "Vadinar" && fixer?.affectedChokepoint === "Red Sea") return 65;
      if (refineryName === "Kochi" && fixer?.affectedChokepoint === "Strait of Hormuz") return 70;
      if (refineryName === "Mumbai" && fixer?.affectedChokepoint === "Strait of Hormuz") return 75;
      return 80;
    } else if (modeler.refineryImpact === "WARNING") {
      return 90;
    }
    return 100;
  };

  const isCrisis = modeler.priceIncreasePercent > 0;

  return (
    <div className="flex flex-col h-full bg-transparent text-[var(--foreground)] text-[13px]">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--panel-border)] flex items-center justify-between">
        <h2 className="font-bold text-base tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--accent-blue)]" />
          Economic Impact
        </h2>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
          isCrisis 
            ? "bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] border border-[var(--accent-rose)]/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
            : "bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20"
        }`}>
          {isCrisis ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
          {modeler.refineryImpact}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 custom-scroll flex flex-col gap-5">
        
        {/* Spot Price Block - Beautiful soft gradient */}
        <div className="relative bg-gradient-to-br from-[var(--background)] to-[var(--panel-border)]/20 rounded-3xl p-5 border border-[var(--panel-border)] shadow-sm overflow-hidden">
          {/* Soft background glow if crisis */}
          {isCrisis && (
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent-rose)]/20 rounded-full blur-3xl" />
          )}

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <div className="text-[12px] font-medium text-[var(--gray-500)] mb-1 uppercase tracking-wider">Brent Crude Spot</div>
              <div className="text-3xl font-black tracking-tight">
                ${modeler.newSpotPrice.toFixed(2)}
              </div>
            </div>
            
            <div className={`flex items-center gap-1 text-[13px] font-bold px-3 py-1 rounded-xl ${
              isCrisis ? "bg-[var(--accent-rose)] text-white shadow-md" : "bg-[var(--accent-emerald)] text-white shadow-md"
            }`}>
              {isCrisis ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isCrisis ? `+${modeler.priceIncreasePercent}%` : "0.0%"}
            </div>
          </div>
          
          <div className="h-[60px] w-full mt-2 relative z-10">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isCrisis ? "var(--accent-rose)" : "var(--accent-blue)"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isCrisis ? "var(--accent-rose)" : "var(--accent-blue)"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isCrisis ? "var(--accent-rose)" : "var(--accent-blue)"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Refineries Grid */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-bold text-[var(--gray-500)] uppercase tracking-wider pl-1">Refinery Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Jamnagar", "Vadinar", "Kochi", "Paradeep"].map((name) => {
              const rate = getRefineryRunRate(name);
              const isReduced = rate < 100;
              return (
                <div key={name} className="bg-[var(--background)] rounded-2xl p-4 border border-[var(--panel-border)] shadow-sm hover-lift flex flex-col justify-between h-24 relative overflow-hidden group">
                  <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${
                    isReduced ? "bg-[var(--accent-amber)]" : "bg-[var(--accent-emerald)]"
                  }`} style={{ width: `${rate}%` }} />
                  
                  <div className="flex items-center gap-2">
                    <Factory className={`w-4 h-4 ${isReduced ? "text-[var(--accent-amber)]" : "text-[var(--accent-emerald)]"}`} />
                    <span className="font-semibold">{name}</span>
                  </div>
                  <div className={`text-2xl font-black ${isReduced ? "text-[var(--accent-amber)]" : "text-[var(--foreground)]"}`}>
                    {rate}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orchestrator Action (Fixer) */}
        {fixer && (
          <div className="mt-2 bg-gradient-to-br from-[var(--accent-indigo)]/5 to-[var(--accent-blue)]/5 rounded-3xl p-1 border border-[var(--accent-indigo)]/20 shadow-lg animate-soft-in">
            <div className="bg-[var(--background)] rounded-[1.4rem] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[var(--accent-indigo)] text-white p-1.5 rounded-lg shadow-sm">
                  <Anchor className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[14px]">AI Reroute Ready</h4>
              </div>

              {fixer.recommendations.map((rec, idx) => {
                if (idx > 0) return null; // Show only top recommendation
                
                return (
                  <div key={rec.alternativeRouteId} className="flex flex-col gap-4">
                    <p className="text-[13px] text-[var(--gray-600)] leading-relaxed font-medium">
                      {rec.tradeoffSummary}
                    </p>
                    
                    <button
                      disabled={rerouting}
                      onClick={() => {
                        const affectedTanker = tankers.find(t => t.status === "AT_RISK");
                        if (affectedTanker) handleApprove(affectedTanker.id, rec.alternativeRouteId);
                      }}
                      className="w-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-indigo)] hover:from-[var(--accent-indigo)] hover:to-[var(--accent-blue)] text-white font-bold py-3 px-4 rounded-xl shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {rerouting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Executing Protocol...
                        </>
                      ) : (
                        `Reroute via ${rec.supplierName}`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
