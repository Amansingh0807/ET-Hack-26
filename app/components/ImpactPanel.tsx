"use client";

import { useEffect, useState } from "react";
import { ActiveTanker, Route } from "@/lib/db";
import { ModelerResult, FixerRecommendation } from "@/lib/agents";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ShieldCheck,
  Compass,
  BarChart3,
  Database,
  ShieldAlert,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ImpactPanelProps {
  tankers: ActiveTanker[];
  routes: Route[];
  modeler: ModelerResult;
  fixer: FixerRecommendation | null;
  onExecuteReroute: (tankerId: string, newRouteId: string) => Promise<void>;
}

export default function ImpactPanel({
  tankers,
  routes,
  modeler,
  fixer,
  onExecuteReroute,
}: ImpactPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [priceHistory, setPriceHistory] = useState<
    Array<{ time: string; price: number }>
  >([]);
  const [rerouting, setRerouting] = useState(false);

  // Set mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update price history whenever the modeler price changes
  useEffect(() => {
    setPriceHistory((prev) => {
      const nowStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      // Keep last 8 points
      const updated = [...prev, { time: nowStr, price: modeler.newSpotPrice }];
      if (updated.length > 8) updated.shift();
      return updated;
    });
  }, [modeler.newSpotPrice]);

  // Seed initial price history if empty
  useEffect(() => {
    if (priceHistory.length === 0) {
      const base = modeler.basePrice;
      const history = [];
      for (let i = 5; i > 0; i--) {
        const time = new Date(Date.now() - i * 10000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        history.push({ time, price: base });
      }
      history.push({
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: modeler.newSpotPrice,
      });
      setPriceHistory(history);
    }
  }, [modeler.basePrice]);

  const handleApprove = async (tankerId: string, routeId: string) => {
    setRerouting(true);
    try {
      await onExecuteReroute(tankerId, routeId);
      // Trigger Confetti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#059669", "#34d399", "#ffffff"],
      });
    } finally {
      setRerouting(false);
    }
  };

  // Determine refinery run rates
  const getRefineryRunRate = (refineryName: string) => {
    if (modeler.refineryImpact === "CRITICAL_SHORTFALL") {
      if (refineryName === "Vadinar" && fixer?.affectedChokepoint === "Red Sea")
        return 65;
      if (
        refineryName === "Kochi" &&
        fixer?.affectedChokepoint === "Strait of Hormuz"
      )
        return 70;
      if (
        refineryName === "Mumbai" &&
        fixer?.affectedChokepoint === "Strait of Hormuz"
      )
        return 75;
      return 80; // General dropdown
    } else if (modeler.refineryImpact === "WARNING") {
      return 90;
    }
    return 100;
  };

  return (
    <div className="flex flex-col h-full border-l border-zinc-800 bg-zinc-950 text-zinc-100 p-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 mb-4">
        <BarChart3 className="w-4 h-4 text-sky-500" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
          Impact & Orchestration
        </h2>
      </div>

      {/* Brent crude spot price widget */}
      <div className="mb-5 bg-zinc-900/40 border border-zinc-900 p-3 rounded">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Brent Crude Spot
          </span>
          <span
            className={`font-mono text-xs font-semibold ${
              modeler.priceIncreasePercent > 0
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {modeler.priceIncreasePercent > 0
              ? `+${modeler.priceIncreasePercent}%`
              : "Baseline"}
          </span>
        </div>
        <div className="font-mono text-xl font-bold tracking-tight text-white mb-2">
          ${modeler.newSpotPrice.toFixed(2)}{" "}
          <span className="text-xs text-zinc-500 font-normal">/ BBL</span>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[75px] w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceHistory}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <defs>
                  <linearGradient id="priceGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        modeler.priceIncreasePercent > 0 ? "#f43f5e" : "#0284c7"
                      }
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        modeler.priceIncreasePercent > 0 ? "#f43f5e" : "#0284c7"
                      }
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                  }}
                  labelStyle={{ color: "#a1a1aa", fontSize: "10px" }}
                  itemStyle={{ color: "#f43f5e", fontSize: "10px" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={
                    modeler.priceIncreasePercent > 0 ? "#f43f5e" : "#0ea5e9"
                  }
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#priceGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Strategic Petroleum Reserve (SPR) */}
      <div className="mb-5 bg-zinc-900/40 border border-zinc-900 p-3 rounded">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-sky-500" />
            Strategic Reserves
          </span>
          <span
            className={`font-mono text-[9px] px-1 rounded font-bold ${
              modeler.sprRemainingDays < 7
                ? "bg-red-500/20 text-red-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {modeler.sprRemainingDays > 8 ? "SECURE" : "DEPLETING"}
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-mono text-xl font-bold text-zinc-100">
            {modeler.sprRemainingDays.toFixed(2)}{" "}
            <span className="text-[10px] text-zinc-500 font-normal uppercase">
              Days Cover
            </span>
          </div>
          <div className="font-mono text-[10px] text-zinc-500">
            Depletion:{" "}
            <span
              className={
                modeler.priceIncreasePercent > 0
                  ? "text-amber-400 font-bold"
                  : "text-emerald-400 font-bold"
              }
            >
              {modeler.priceIncreasePercent > 0 ? "-0.50d/d" : "Stable"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              modeler.sprRemainingDays < 6
                ? "bg-red-500 animate-pulse"
                : modeler.sprRemainingDays < 8.5
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${(modeler.sprRemainingDays / 9.5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Refineries Run Rates */}
      <div className="mb-5">
        <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
          Refinery Run-Rates
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { name: "Jamnagar", loc: "Gujarat" },
            { name: "Vadinar", loc: "Gujarat" },
            { name: "Kochi", loc: "Kerala" },
            { name: "Paradeep", loc: "Odisha" },
          ].map((ref) => {
            const runRate = getRefineryRunRate(ref.name);
            const rateColor =
              runRate === 100
                ? "text-emerald-400 font-bold"
                : runRate >= 80
                  ? "text-amber-400 font-bold"
                  : "text-red-500 font-bold";

            return (
              <div
                key={ref.name}
                className="border border-zinc-900 bg-zinc-900/20 p-2 rounded"
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-zinc-300">
                    {ref.name}
                  </span>
                  <span className={rateColor}>{runRate}%</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                  {ref.loc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orchestrator Action Panel (The Fixer) */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          Procurement Orchestrator
        </h3>

        <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-900/10 border border-zinc-900 rounded p-2.5 space-y-3">
          {!fixer ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <ShieldCheck className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-zinc-500 text-xs font-mono">
                System stable. No rerouting decisions required.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs leading-relaxed">
              {/* Executive briefing */}
              <div className="bg-amber-950/15 border border-amber-900/30 p-2.5 rounded text-[11px] text-amber-200">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono mb-1 text-[10px] text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Executive Command Briefing
                </div>
                {fixer.executiveBriefing}
              </div>

              {/* Alternatives List */}
              <div className="space-y-2">
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                  Evaluated Alternatives
                </div>

                {fixer.recommendations.map((rec, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={rec.alternativeRouteId}
                      className={`p-2 border rounded transition-all ${
                        isTop
                          ? "border-emerald-500/30 bg-emerald-950/10"
                          : "border-zinc-900 bg-zinc-900/10"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-zinc-200">
                          {rec.supplierName} ({rec.crudeGrade.split(" ")[0]})
                        </span>
                        {isTop && (
                          <span className="flex items-center gap-0.5 font-mono text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold uppercase">
                            <Award className="w-2.5 h-2.5" /> Recommended
                          </span>
                        )}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-1 font-mono text-[9.5px] text-zinc-400 mb-1 border-b border-zinc-900/50 pb-1.5">
                        <div>
                          Cost:{" "}
                          <span className="text-zinc-200 font-bold">
                            ${rec.deliveredPricePerBarrel}
                          </span>
                        </div>
                        <div>
                          Transit:{" "}
                          <span className="text-zinc-200 font-bold">
                            {rec.transitDays}d
                          </span>
                        </div>
                        <div>
                          Match:{" "}
                          <span
                            className={`font-bold ${
                              rec.gradeCompatibility === "HIGH"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {rec.gradeCompatibility}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-zinc-400 italic mb-2 leading-tight">
                        {rec.tradeoffSummary}
                      </div>

                      {isTop && (
                        <button
                          disabled={rerouting}
                          onClick={() => {
                            // Find the affected tanker id
                            const affectedTanker = tankers.find(
                              (t) => t.status === "AT_RISK",
                            );
                            if (affectedTanker) {
                              handleApprove(
                                affectedTanker.id,
                                rec.alternativeRouteId,
                              );
                            }
                          }}
                          className="w-full mt-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black py-1.5 px-3 rounded font-mono font-bold text-[10.5px] uppercase tracking-wider shadow-lg shadow-emerald-950/20 cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-wait"
                        >
                          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                          Execute Reroute Plan
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
