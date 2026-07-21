"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar
} from "recharts";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, RefreshCw,
  Fuel, Ship, AlertTriangle, ShieldCheck, Clock, DollarSign,
  Activity, Globe, BarChart3, Zap, Layers, Sparkles, ChevronRight,
  Sun, Moon
} from "lucide-react";

interface MarketPrice {
  price: number;
  currency: string;
  source: string;
  isLive: boolean;
  timestamp: string;
}

interface HistoricalPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface RouteAnalytics {
  routeName: string;
  origin: string;
  chokepoints: string[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  transitDays: number;
  costPerBarrel: number;
  logisticsSurcharge: number;
  trend: "UP" | "DOWN" | "SIDEWAYS";
  futureEstimate7d: number;
}

interface DashboardData {
  multiMarket: {
    brent: MarketPrice;
    wti: MarketPrice;
    dubai: MarketPrice;
    indianBasket: MarketPrice;
  };
  history: {
    brent: {
      today: HistoricalPoint[];
      "5d": HistoricalPoint[];
      "50d": HistoricalPoint[];
    };
    wti: {
      today: HistoricalPoint[];
      "5d": HistoricalPoint[];
      "50d": HistoricalPoint[];
    };
  };
  routeAnalytics: RouteAnalytics[];
  fetchedAt: string;
}

const RISK_THEME = {
  LOW: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)", label: "Low Risk" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)", label: "Medium Risk" },
  HIGH: { color: "#ff6b4b", bg: "rgba(255, 107, 75, 0.12)", border: "rgba(255, 107, 75, 0.3)", label: "High Risk" },
  CRITICAL: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.35)", label: "Critical Risk" },
};

export default function LivePricePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"brent" | "wti">("brent");
  const [timeframe, setTimeframe] = useState<"today" | "5d" | "50d">("50d");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const isLight = theme === "light";

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/oil-history");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Failed to fetch oil data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${isLight ? "bg-[#f8fafc] text-[#0f172a]" : "bg-[#08090d] text-white"}`}>
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="relative flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full border-2 ${isLight ? "border-[#e2e8f0] border-t-[#ff6b4b]" : "border-[#1e2230] border-t-[#ff6b4b]"} animate-spin`} />
            <Activity className="w-6 h-6 text-[#ff6b4b] absolute" />
          </div>
          <div className="text-center">
            <p className={`text-sm font-semibold tracking-wider uppercase ${isLight ? "text-[#64748b]" : "text-[#8a8f9e]"}`}>Initializing Market Feed</p>
            <p className={`text-xs ${isLight ? "text-[#94a3b8]" : "text-[#525866]"} mt-1`}>Connecting to Yahoo Finance & Commodity Index</p>
          </div>
        </div>
      </div>
    );
  }

  const { multiMarket, history, routeAnalytics } = data;
  const chartData = activeChart === "brent" ? history.brent[timeframe] : history.wti[timeframe];

  // Compute 7-period SMA
  const chartWithSMA = chartData.map((pt, i) => {
    if (i < 6) return { ...pt, sma7: null };
    const sum = chartData.slice(i - 6, i + 1).reduce((a, b) => a + b.close, 0);
    return { ...pt, sma7: parseFloat((sum / 7).toFixed(2)) };
  });

  const curr = activeChart === "brent" ? multiMarket.brent.price : multiMarket.wti.price;
  const prev = chartData.length > 1 ? chartData[0].close : chartData[0]?.close ?? curr;
  const dayChange = curr - prev;
  const dayChangePct = prev > 0 ? (dayChange / prev) * 100 : 0;

  const allCloses = chartData.map(p => p.close);
  const timeframeHigh = allCloses.length > 0 ? Math.max(...allCloses) : curr;
  const timeframeLow = allCloses.length > 0 ? Math.min(...allCloses) : curr;

  // Range position calculation (0 to 100%)
  const rangeSpan = timeframeHigh - timeframeLow;
  const currentRangePct = rangeSpan > 0 ? Math.min(100, Math.max(0, ((curr - timeframeLow) / rangeSpan) * 100)) : 50;

  const markets = [
    { key: "brent", label: "Brent Crude", symbol: "BZ=F", data: multiMarket.brent, flag: "🇬🇧", tag: "Benchmark" },
    { key: "wti", label: "WTI Crude", symbol: "CL=F", data: multiMarket.wti, flag: "🇺🇸", tag: "US Light" },
    { key: "dubai", label: "Dubai / Oman", symbol: "DUBAI", data: multiMarket.dubai, flag: "🇦🇪", tag: "Middle East" },
    { key: "indianBasket", label: "Indian Basket", symbol: "ICB", data: multiMarket.indianBasket, flag: "🇮🇳", tag: "Refinery Target" },
  ];

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      isLight ? "bg-[#f8fafc] text-[#0f172a]" : "bg-[#08090d] text-[#f0f2f5]"
    }`}>
      
      {/* ─── Dribbble SaaS Header ─── */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isLight ? "bg-white/85 border-[#e2e8f0]" : "bg-[#08090d]/80 border-[#181b25]"
      }`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all group ${
                isLight ? "bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1] text-[#475569]" : "bg-[#12141c] hover:bg-[#1a1d28] border-[#1e2230] text-[#8a8f9e] hover:text-white"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Map Command</span>
            </Link>

            <div className={`h-4 w-px ${isLight ? "bg-[#e2e8f0]" : "bg-[#181b25]"}`} />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ff6b4b]/10 border border-[#ff6b4b]/20 flex items-center justify-center text-[#ff6b4b]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h1 className={`font-bold text-sm sm:text-base tracking-tight flex items-center gap-2 ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                  Live Crude Oil Intelligence
                </h1>
                <p className={`text-[10px] hidden sm:block ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>Real-time spot quotes, historical volatility & route impact</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight 
                  ? "bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1] text-[#0f172a]" 
                  : "bg-[#12141c] hover:bg-[#1a1d28] border-[#1e2230] text-[#f0f2f5]"
              }`}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] ${
              isLight ? "bg-[#f1f5f9] border-[#e2e8f0] text-[#64748b]" : "bg-[#12141c] border-[#1e2230] text-[#8a8f9e]"
            }`}>
              <Clock className="w-3.5 h-3.5 text-[#ff6b4b]" />
              <span>Sync: <strong className={isLight ? "text-[#0f172a]" : "text-white"}>{lastUpdate}</strong></span>
            </div>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 ${
                isLight ? "bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1] text-[#0f172a]" : "bg-[#12141c] hover:bg-[#1a1d28] border-[#1e2230] text-[#f0f2f5]"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ff6b4b] ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#12141c] border-[#1e2230]"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b4b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b4b]"></span>
              </span>
              <span className={`text-[11px] font-bold tracking-widest uppercase ${isLight ? "text-[#0f172a]" : "text-white"}`}>Live Market</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">

        {/* ─── Bento Grid Row 1: Market Ticker Cards ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map((m) => {
            const isActive = activeChart === m.key;
            const isClickable = m.key === "brent" || m.key === "wti";
            
            return (
              <div
                key={m.key}
                onClick={() => {
                  if (isClickable) setActiveChart(m.key as "brent" | "wti");
                }}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-[135px] overflow-hidden ${
                  isActive
                    ? isLight
                      ? "bg-white border-[#ff6b4b] shadow-md"
                      : "bg-[#161922] border-[#ff6b4b]/40 shadow-[0_8px_30px_rgba(255,107,75,0.12)]"
                    : isLight
                      ? "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                      : "bg-[#12141c] border-[#1c1f2b] hover:border-[#2a2f42] hover:bg-[#141721]"
                } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {/* Accent Highlight Bar for Active Card */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff6b4b] via-[#ff886b] to-transparent" />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.flag}</span>
                    <div>
                      <span className={`text-xs font-bold tracking-wide block ${isLight ? "text-[#0f172a]" : "text-white"}`}>{m.label}</span>
                      <span className={`text-[10px] font-mono ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>{m.symbol}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                    isActive 
                      ? "bg-[#ff6b4b]/15 text-[#ff6b4b] border-[#ff6b4b]/30"
                      : isLight
                        ? "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]"
                        : "bg-[#1c1f2b] text-[#8a8f9e] border-[#252a3b]"
                  }`}>
                    {m.tag}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-auto relative z-10">
                  <div>
                    <div className={`text-2xl font-black tracking-tight font-mono ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                      ${m.data.price.toFixed(2)}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>
                      USD / Barrel • {m.data.isLive ? "Realtime Feed" : "Market Spread Index"}
                    </div>
                  </div>

                  {isClickable && (
                    <div className={`p-1.5 rounded-lg border transition-all ${
                      isActive 
                        ? "bg-[#ff6b4b] text-white border-[#ff6b4b]" 
                        : isLight
                          ? "bg-[#f1f5f9] text-[#64748b] group-hover:text-[#0f172a] border-[#e2e8f0]"
                          : "bg-[#1c1f2b] text-[#64748b] group-hover:text-white border-[#252a3b]"
                    }`}>
                      <BarChart3 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Abstract Subtle Card Pattern */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#ff6b4b]/5 rounded-full blur-xl group-hover:bg-[#ff6b4b]/10 transition-all pointer-events-none" />
              </div>
            );
          })}
        </section>

        {/* ─── Bento Grid Row 2: Main Chart + Key Analytics ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Chart Terminal (Bento 8 Cols) */}
          <div className={`lg:col-span-8 rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden ${
            isLight ? "bg-white border-[#e2e8f0] shadow-sm" : "bg-[#12141c] border-[#1c1f2b]"
          }`}>
            
            {/* Chart Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
              isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#ff6b4b]" />
                  <h2 className={`font-bold text-base tracking-tight ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                    {activeChart === "brent" ? "Brent Crude (BZ=F)" : "WTI Crude (CL=F)"} Performance
                  </h2>
                </div>
                <p className={`text-xs ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>
                  {timeframe === "today" ? "Intraday 5-min candles" : timeframe === "5d" ? "30-min interval trend analysis" : "50-Day historical close track"} with 7-period SMA
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Timeframe Selector Pill Tabs */}
                <div className={`flex items-center p-1 rounded-xl border ${
                  isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                }`}>
                  {[
                    { key: "today", label: "Live Today" },
                    { key: "5d", label: "5 Days" },
                    { key: "50d", label: "50 Days" }
                  ].map((tf) => (
                    <button
                      key={tf.key}
                      onClick={() => setTimeframe(tf.key as "today" | "5d" | "50d")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        timeframe === tf.key
                          ? "bg-[#ff6b4b] text-white shadow-[0_2px_10px_rgba(255,107,75,0.3)]"
                          : isLight
                            ? "text-[#64748b] hover:text-[#0f172a] hover:bg-white"
                            : "text-[#8a8f9e] hover:text-white hover:bg-[#161922]"
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {/* Change Pill */}
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                  dayChange >= 0
                    ? "bg-[#ff6b4b]/10 text-[#ff6b4b] border-[#ff6b4b]/30"
                    : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                }`}>
                  {dayChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)} ({dayChangePct.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Interactive Chart Container */}
            <div className="h-[320px] w-full pt-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartWithSMA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b4b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ff6b4b" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2e8f0" : "#1c1f2b"} vertical={false} />
                  
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={Math.floor(chartWithSMA.length / 7)}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    tickFormatter={(v) => `$${v}`}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    hide={true}
                    domain={[0, (max: number) => max * 5]}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? "#ffffff" : "#12141c",
                      borderColor: isLight ? "#cbd5e1" : "#252a3b",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      color: isLight ? "#0f172a" : "#ffffff"
                    }}
                    labelStyle={{ color: isLight ? "#64748b" : "#8a8f9e", marginBottom: "4px", fontWeight: 600 }}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = { close: "Close Price", sma7: "7-Period SMA", volume: "Market Volume" };
                      return [`$${Number(value).toFixed(2)}`, labels[String(name)] || String(name)];
                    }}
                  />

                  <Bar dataKey="volume" fill="#ff6b4b" fillOpacity={0.1} barSize={4} yAxisId="volume" radius={[2, 2, 0, 0]} />

                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#ff6b4b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#coralGradient)"
                    dot={false}
                    activeDot={{ r: 6, fill: "#ff6b4b", stroke: "#ffffff", strokeWidth: 2 }}
                  />

                  <Area
                    type="monotone"
                    dataKey="sma7"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={0}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className={`flex items-center justify-between text-xs text-[#64748b] pt-3 border-t ${
              isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"
            }`}>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-[#ff6b4b]" />
                  <span>Spot Price Line</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-[#f59e0b] border-t border-dashed" />
                  <span>7-Period Moving Average</span>
                </div>
              </div>

              <div className="text-[11px] font-mono opacity-70">
                Range: <strong className={isLight ? "text-[#0f172a]" : "text-white"}>${timeframeLow.toFixed(2)}</strong> — <strong className={isLight ? "text-[#0f172a]" : "text-white"}>${timeframeHigh.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Key Metrics Bento Card (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Card A: Range Bar & High/Low */}
            <div className={`rounded-2xl border p-5 flex flex-col justify-between ${
              isLight ? "bg-white border-[#e2e8f0] shadow-sm" : "bg-[#12141c] border-[#1c1f2b]"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? "text-[#64748b]" : "text-[#8a8f9e]"
                }`}>
                  <Layers className="w-4 h-4 text-[#ff6b4b]" />
                  Timeframe Bounds
                </h3>
                <span className="text-[10px] font-mono text-[#ff6b4b] bg-[#ff6b4b]/10 px-2 py-0.5 rounded border border-[#ff6b4b]/20">
                  {timeframe === "today" ? "24 Hours" : timeframe === "5d" ? "5 Trading Days" : "50 Trading Days"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-2">
                <div className={`p-3 rounded-xl border ${
                  isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                }`}>
                  <span className={`text-[10px] uppercase font-semibold block ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>Period High</span>
                  <span className="text-lg font-bold font-mono text-[#ff6b4b] mt-0.5 block">${timeframeHigh.toFixed(2)}</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                }`}>
                  <span className={`text-[10px] uppercase font-semibold block ${isLight ? "text-[#64748b]" : "text-[#64748b]"}`}>Period Low</span>
                  <span className="text-lg font-bold font-mono text-[#10b981] mt-0.5 block">${timeframeLow.toFixed(2)}</span>
                </div>
              </div>

              {/* Dynamic Range Slider Indicator */}
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-[#64748b] mb-1.5">
                  <span>Low Range</span>
                  <span className={`font-mono ${isLight ? "text-[#0f172a]" : "text-white"}`}>Position: {currentRangePct.toFixed(0)}%</span>
                  <span>High Range</span>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden border p-0.5 relative ${
                  isLight ? "bg-[#e2e8f0] border-[#cbd5e1]" : "bg-[#08090d] border-[#1c1f2b]"
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ff6b4b] rounded-full transition-all duration-700"
                    style={{ width: `${currentRangePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card B: Market Volatility & Forecast */}
            <div className={`rounded-2xl border p-5 flex flex-col justify-between flex-1 ${
              isLight ? "bg-white border-[#e2e8f0] shadow-sm" : "bg-[#12141c] border-[#1c1f2b]"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? "text-[#64748b]" : "text-[#8a8f9e]"
                }`}>
                  <Sparkles className="w-4 h-4 text-[#ff6b4b]" />
                  AI Volatility Forecast
                </h3>
                <span className="text-[10px] text-[#10b981] font-bold">STABLE</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className={`flex justify-between items-center py-2 border-b ${isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"}`}>
                  <span className={`text-xs ${isLight ? "text-[#64748b]" : "text-[#8a8f9e]"}`}>Chokepoint Stress</span>
                  <span className="text-xs font-bold text-[#ff6b4b] bg-[#ff6b4b]/10 px-2 py-0.5 rounded">High (Hormuz)</span>
                </div>
                <div className={`flex justify-between items-center py-2 border-b ${isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"}`}>
                  <span className={`text-xs ${isLight ? "text-[#64748b]" : "text-[#8a8f9e]"}`}>Refinery Demand Index</span>
                  <span className={`text-xs font-bold ${isLight ? "text-[#0f172a]" : "text-white"}`}>92.4% Optimal</span>
                </div>
                <div className={`flex justify-between items-center py-2 border-b ${isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"}`}>
                  <span className={`text-xs ${isLight ? "text-[#64748b]" : "text-[#8a8f9e]"}`}>7-Day Projected Spread</span>
                  <span className="text-xs font-bold font-mono text-[#f59e0b]">+$2.40 / bbl</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className={`text-xs ${isLight ? "text-[#64748b]" : "text-[#8a8f9e]"}`}>Freight Surcharge</span>
                  <span className={`text-xs font-bold font-mono ${isLight ? "text-[#0f172a]" : "text-white"}`}>+4.2%</span>
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs text-[#64748b] ${
                isLight ? "border-[#e2e8f0]" : "border-[#1c1f2b]"
              }`}>
                <span>Predictive Confidence</span>
                <span className={`font-mono font-bold ${isLight ? "text-[#0f172a]" : "text-white"}`}>94.8%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bento Grid Row 3: Route-Wise Cost & Risk Matrix ─── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#ff6b4b]" />
              <h2 className={`font-bold text-base ${isLight ? "text-[#0f172a]" : "text-white"}`}>Maritime Supply Route Matrix</h2>
            </div>
            <span className="text-xs text-[#64748b]">7 Active Global Import Shipping Corridors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {routeAnalytics.map((route) => {
              const risk = RISK_THEME[route.riskLevel];
              const futureChange = route.futureEstimate7d - route.costPerBarrel;

              return (
                <div
                  key={route.routeName}
                  className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                    isLight 
                      ? "bg-white border-[#e2e8f0] hover:border-[#ff6b4b]/40 shadow-sm" 
                      : "bg-[#12141c] border-[#1c1f2b] hover:border-[#ff6b4b]/30"
                  }`}
                >
                  {/* Top Row: Route Title & Risk Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-bold text-xs leading-snug group-hover:text-[#ff6b4b] transition-colors ${
                        isLight ? "text-[#0f172a]" : "text-white"
                      }`}>
                        {route.routeName}
                      </h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border"
                        style={{ backgroundColor: risk.bg, color: risk.color, borderColor: risk.border }}
                      >
                        {risk.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748b] mb-3">{route.origin}</p>
                  </div>

                  {/* Chokepoints Badges */}
                  <div className="mb-4 min-h-[26px] flex flex-wrap gap-1">
                    {route.chokepoints.length > 0 ? (
                      route.chokepoints.map((cp) => (
                        <span key={cp} className="text-[10px] px-2 py-0.5 rounded bg-[#ff6b4b]/10 text-[#ff6b4b] border border-[#ff6b4b]/20 font-medium">
                          ⚠️ {cp}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 font-medium">
                        🛡️ Open Ocean Bypass
                      </span>
                    )}
                  </div>

                  {/* Cost & Transit Mini Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className={`p-2.5 rounded-xl border ${
                      isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                    }`}>
                      <span className="text-[10px] text-[#64748b] block">Delivered Cost</span>
                      <span className={`text-sm font-bold font-mono mt-0.5 block ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                        ${route.costPerBarrel.toFixed(2)}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border ${
                      isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                    }`}>
                      <span className="text-[10px] text-[#64748b] block">Transit Time</span>
                      <span className={`text-sm font-bold font-mono mt-0.5 block ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                        {route.transitDays} Days
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Forecast Box */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    isLight ? "bg-[#f1f5f9] border-[#e2e8f0]" : "bg-[#08090d] border-[#1c1f2b]"
                  }`}>
                    <div>
                      <span className="text-[10px] text-[#64748b] block">7D Forecast</span>
                      <span className={`text-xs font-bold font-mono ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                        ${route.futureEstimate7d.toFixed(2)}
                      </span>
                    </div>

                    <div className={`flex items-center gap-1 text-xs font-bold ${futureChange >= 0 ? "text-[#ff6b4b]" : "text-[#10b981]"}`}>
                      {futureChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{futureChange >= 0 ? "+" : ""}{futureChange.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer info */}
        <footer className={`mt-4 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-3 ${
          isLight ? "border-[#e2e8f0]" : "border-[#181b25]"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6b4b]" />
            <span>Project Rampart • Indian Energy Resilience Engine</span>
          </div>
          <div>Data feeds verified via Yahoo Finance API & Global Maritime Tracking</div>
        </footer>

      </main>
    </div>
  );
}
