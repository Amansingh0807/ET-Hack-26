"use client";

import { useEffect, useState } from "react";
import { GeopoliticalEvent } from "@/lib/db";
import {
  AlertCircle,
  Zap,
  ShieldAlert,
  Newspaper,
  RefreshCw,
  Radio,
  Compass,
  MessageSquare,
  Globe,
  ArrowRight,
} from "lucide-react";

interface FeedItem {
  id: string;
  headline: string;
  link: string;
  pubDate: string;
  source: string;
}

interface LiveThreatFeedProps {
  events: GeopoliticalEvent[];
  onTriggerEvent: (headline: string, source: string) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function LiveThreatFeed({
  events,
  onTriggerEvent,
  onReset,
}: LiveThreatFeedProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "live" | "osint">(
    "presets",
  );
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  // States for Connector Engine feeds
  const [newsFeed, setNewsFeed] = useState<FeedItem[]>([]);
  const [osintFeed, setOsintFeed] = useState<FeedItem[]>([]);
  const [fetchingFeeds, setFetchingFeeds] = useState(false);

  // Scenarios list
  const scenarios = [
    {
      id: "hormuz-strike",
      label: "Trigger Hormuz Crisis",
      headline:
        "US-Iran Standoff Escalates: Explosions reported on oil tanker in Gulf of Oman near Strait of Hormuz.",
      source: "Reuters Intel",
      icon: "💥",
      color: "border-red-950 hover:bg-red-950/20 text-red-400 bg-red-950/10",
    },
    {
      id: "red-sea-attack",
      label: "Trigger Red Sea Attack",
      headline:
        "Houthi rebels launch multiple drone attacks on commercial tankers in the southern Red Sea.",
      source: "Lloyds List",
      icon: "🚀",
      color:
        "border-amber-950 hover:bg-amber-950/20 text-amber-400 bg-amber-950/10",
    },
    {
      id: "opec-cut",
      label: "Trigger OPEC+ Cut",
      headline:
        "OPEC+ announces surprise emergency production cut of 1.5 million barrels per day.",
      source: "Bloomberg",
      icon: "🛢",
      color:
        "border-yellow-950 hover:bg-yellow-950/20 text-yellow-400 bg-yellow-950/10",
    },
  ];

  // Fetch feeds from `/api/connector`
  const handleFetchFeeds = async () => {
    setFetchingFeeds(true);
    try {
      const res = await fetch("/api/connector");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNewsFeed(data.news || []);
          setOsintFeed(data.osint || []);
        }
      }
    } catch (e) {
      console.error("Failed to fetch feeds:", e);
    } finally {
      setFetchingFeeds(false);
    }
  };

  // Fetch feeds once on mount
  useEffect(() => {
    handleFetchFeeds();
  }, []);

  const handleInject = async (
    scenarioId: string,
    headline: string,
    source: string,
  ) => {
    setLoadingScenario(scenarioId);
    try {
      await onTriggerEvent(headline, source);
    } finally {
      setLoadingScenario(null);
    }
  };

  const handleResetClick = async () => {
    setLoadingScenario("reset");
    try {
      await onReset();
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-zinc-800 bg-zinc-950 text-zinc-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
            Signal Ingestion Layer
          </h2>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          LIVE FEED
        </span>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-900 bg-zinc-900/10 text-xs">
        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 py-2 font-mono font-bold border-b-2 text-center cursor-pointer transition-all ${
            activeTab === "presets"
              ? "border-sky-500 text-sky-400 bg-sky-950/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          💥 Presets
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`flex-1 py-2 font-mono font-bold border-b-2 text-center cursor-pointer transition-all ${
            activeTab === "live"
              ? "border-sky-500 text-sky-400 bg-sky-950/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          📰 Live Wire
        </button>
        <button
          onClick={() => setActiveTab("osint")}
          className={`flex-1 py-2 font-mono font-bold border-b-2 text-center cursor-pointer transition-all ${
            activeTab === "osint"
              ? "border-sky-500 text-sky-400 bg-sky-950/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          🐦 OSINT Feed
        </button>
      </div>

      {/* Tabs Content (Top 50%) */}
      <div className="h-[48%] border-b border-zinc-900 p-4 flex flex-col min-h-0 bg-zinc-950/30">
        {/* Presets Tab */}
        {activeTab === "presets" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Scenario Injectors
              </h3>
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  disabled={loadingScenario !== null}
                  onClick={() => handleInject(sc.id, sc.headline, sc.source)}
                  className={`w-full flex items-center gap-3 px-3 py-2 border rounded font-mono text-left text-xs transition-all duration-200 cursor-pointer ${sc.color} ${
                    loadingScenario === sc.id ? "opacity-55 cursor-wait" : ""
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span className="flex-1 font-semibold">{sc.label}</span>
                </button>
              ))}
            </div>

            <button
              disabled={loadingScenario !== null}
              onClick={handleResetClick}
              className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 rounded font-mono text-xs font-semibold cursor-pointer transition-all duration-150"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingScenario === "reset" ? "animate-spin" : ""}`}
              />
              Reset System Baseline
            </button>
          </div>
        )}

        {/* Live Wire Tab (gCaptain RSS) */}
        {activeTab === "live" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Real gCaptain Wire
              </h3>
              <button
                disabled={fetchingFeeds}
                onClick={handleFetchFeeds}
                className="p-1 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                title="Fetch Live Signals"
              >
                <RefreshCw
                  className={`w-3 h-3 ${fetchingFeeds ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {newsFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleInject(item.id, item.headline, item.source)
                  }
                  className="p-2 border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 hover:bg-zinc-900/30 rounded text-left text-xs cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 mb-0.5">
                    <span>{item.source}</span>
                    <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-zinc-300 group-hover:text-zinc-100 line-clamp-2 leading-tight">
                    {item.headline}
                  </p>
                  <div className="flex items-center gap-0.5 text-[8.5px] font-mono text-sky-500/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>RUN AI AGENTS</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OSINT Alerts Tab */}
        {activeTab === "osint" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                Live OSINT Feeds
              </h3>
              <button
                disabled={fetchingFeeds}
                onClick={handleFetchFeeds}
                className="p-1 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                title="Fetch Live Signals"
              >
                <RefreshCw
                  className={`w-3 h-3 ${fetchingFeeds ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {osintFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleInject(item.id, item.headline, item.source)
                  }
                  className="p-2 border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 hover:bg-zinc-900/30 rounded text-left text-xs cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 mb-0.5">
                    <span className="text-sky-400 font-bold">
                      @{item.source.split(" ")[0]}
                    </span>
                    <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-zinc-300 group-hover:text-zinc-100 line-clamp-2 leading-tight">
                    {item.headline}
                  </p>
                  <div className="flex items-center gap-0.5 text-[8.5px] font-mono text-sky-500/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>RUN AI AGENTS</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Processed timeline feed (Bottom 52%) */}
      <div className="flex-1 p-4 flex flex-col min-h-0 bg-zinc-950/70">
        <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5 text-sky-500" />
          Ingested Timeline ({events.length})
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {events.length === 0 ? (
            <div className="text-zinc-600 font-mono text-xs text-center py-8">
              No active threat profiles ingested.
            </div>
          ) : (
            events.map((ev, index) => {
              const isThreat =
                ev.affectedZone !== "None" && ev.severityScore > 1;
              const severityColor =
                ev.severityScore >= 8
                  ? "text-red-500 border-red-500/20 bg-red-950/15"
                  : ev.severityScore >= 5
                    ? "text-amber-500 border-amber-500/20 bg-amber-950/15"
                    : "text-zinc-400 border-zinc-850 bg-zinc-900/10";

              return (
                <div
                  key={ev.id}
                  className={`p-3 border rounded leading-relaxed transition-all duration-200 hover:border-zinc-700 ${severityColor} ${
                    index === 0 && isThreat ? "ring-1 ring-red-500/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-black/45 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-800/80">
                      {ev.source}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500">
                      {new Date(ev.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-zinc-200 leading-tight mb-2">
                    {ev.headline}
                  </p>

                  {isThreat && (
                    <div className="flex items-center gap-1.5 text-[9.5px] font-mono border-t border-zinc-900 pt-1.5 mt-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-zinc-500">ZONE:</span>
                      <span className="text-red-400 font-bold uppercase">
                        {ev.affectedZone}
                      </span>
                      <span className="ml-auto text-[9.5px] bg-red-500/15 text-red-400 px-1 rounded font-bold">
                        SEV: {ev.severityScore}/10
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
