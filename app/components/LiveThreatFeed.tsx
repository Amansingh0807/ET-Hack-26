"use client";

import { useEffect, useState } from "react";
import { GeopoliticalEvent } from "@/lib/db";
import { Radio, RefreshCw, Zap, ShieldAlert, Newspaper, MessageSquare, Flame } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"presets" | "live" | "osint">("presets");
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  
  const [newsFeed, setNewsFeed] = useState<FeedItem[]>([]);
  const [osintFeed, setOsintFeed] = useState<FeedItem[]>([]);

  const scenarios = [
    {
      id: "hormuz-strike",
      label: "Gulf of Oman Escalation",
      headline: "US-Iran Standoff Escalates: Explosions reported on oil tanker in Gulf of Oman near Strait of Hormuz.",
      source: "Reuters Intel",
      gradient: "from-rose-500 to-orange-500",
      icon: <Flame className="w-4 h-4 text-white" />
    },
    {
      id: "red-sea-attack",
      label: "Southern Red Sea Attack",
      headline: "Houthi rebels launch multiple drone attacks on commercial tankers in the southern Red Sea.",
      source: "Lloyds List",
      gradient: "from-amber-500 to-yellow-500",
      icon: <Zap className="w-4 h-4 text-white" />
    },
    {
      id: "opec-cut",
      label: "OPEC Production Cut",
      headline: "OPEC+ announces surprise emergency production cut of 1.5 million barrels per day.",
      source: "Bloomberg",
      gradient: "from-blue-500 to-indigo-500",
      icon: <ShieldAlert className="w-4 h-4 text-white" />
    },
  ];

  const handleFetchFeeds = async () => {
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
    }
  };

  useEffect(() => {
    handleFetchFeeds();
  }, []);

  const handleInject = async (scenarioId: string, headline: string, source: string) => {
    setLoadingScenario(scenarioId);
    try {
      await onTriggerEvent(headline, source);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-[var(--foreground)] text-[13px]">
      
      {/* Playful Header */}
      <div className="flex items-center justify-between p-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--accent-indigo)]/10 p-2 rounded-xl text-[var(--accent-indigo)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="font-bold text-base tracking-tight">Signal Feed</h2>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex px-5 pt-2 pb-3 gap-2">
        {["presets", "live", "osint"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all hover-lift ${
              activeTab === tab
                ? "bg-[var(--foreground)] text-[var(--background)] shadow-md"
                : "bg-[var(--panel-border)]/20 text-[var(--gray-500)] hover:bg-[var(--panel-border)]/40"
            }`}
          >
            {tab === "presets" ? "Scenarios" : tab === "live" ? "Live Wire" : "OSINT"}
          </button>
        ))}
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scroll">
        <div className="flex flex-col gap-3 pt-2">
          
          {/* Presets */}
          {activeTab === "presets" && scenarios.map((sc) => (
            <div
              key={sc.id}
              className={`relative bg-[var(--background)] rounded-2xl p-4 cursor-pointer hover-lift shadow-sm border border-[var(--panel-border)] overflow-hidden group ${
                loadingScenario === sc.id ? "opacity-60 pointer-events-none" : ""
              }`}
              onClick={() => handleInject(sc.id, sc.headline, sc.source)}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${sc.gradient}`} />
              <div className="pl-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${sc.gradient} shadow-sm`}>
                    {sc.icon}
                  </div>
                  <span className="font-bold text-sm">{sc.label}</span>
                </div>
                <p className="text-[12px] text-[var(--gray-500)] leading-relaxed">
                  {sc.headline}
                </p>
              </div>
            </div>
          ))}

          {/* Reset Button */}
          {activeTab === "presets" && (
            <button
              onClick={onReset}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-[var(--panel-border)] text-[var(--gray-500)] font-medium hover:bg-[var(--panel-border)]/20 hover:text-[var(--foreground)] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset System
            </button>
          )}

          {/* Live / OSINT list */}
          {(activeTab === "live" || activeTab === "osint") && (
            (activeTab === "live" ? newsFeed : osintFeed).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleInject(item.id, item.headline, item.source)}
                className="bg-[var(--background)] rounded-2xl p-4 cursor-pointer hover-lift shadow-sm border border-[var(--panel-border)] group"
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--gray-500)] mb-2">
                  <span className="flex items-center gap-1.5 text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-md">
                    {activeTab === "live" ? <Newspaper className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                    {item.source}
                  </span>
                  <span>{new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div className="font-medium text-sm leading-snug group-hover:text-[var(--accent-indigo)] transition-colors">
                  {item.headline}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Section */}
      <div className="h-[35%] shrink-0 border-t border-[var(--panel-border)] flex flex-col bg-[var(--panel-bg)]/50 backdrop-blur-md rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[var(--panel-border)]/10 to-transparent pointer-events-none" />
        
        <div className="px-5 py-4 font-bold text-xs uppercase tracking-widest text-[var(--gray-400)]">
          System Activity
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 pb-4 custom-scroll">
          <div className="flex flex-col gap-3">
            {events.map((ev) => (
              <div key={ev.id} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-[var(--gray-300)] animate-soft-in">
                {ev.severityScore > 1 && (
                  <div className="absolute left-[-2px] top-1 w-3 h-3 rounded-full bg-[var(--accent-rose)] animate-ping opacity-75" />
                )}
                {ev.severityScore > 1 && (
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[var(--accent-rose)]" />
                )}

                <div className="flex items-center gap-2 text-[11px] text-[var(--gray-500)] mb-1">
                  <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  {ev.affectedZone !== "None" && (
                     <span className={`font-semibold ${ev.severityScore > 5 ? 'text-[var(--accent-rose)]' : 'text-[var(--accent-amber)]'}`}>
                       • {ev.affectedZone}
                     </span>
                  )}
                </div>
                <p className="text-[12px] font-medium leading-snug text-[var(--foreground)]">
                  {ev.headline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
