import React from "react";
import { Zap, Shield, Server, Activity, Database, Flame, Clock } from "lucide-react";
import { ProxyStats } from "../types";

interface NavbarProps {
  stats: ProxyStats | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPrewarmAll: () => void;
  isPrewarming: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  activeTab,
  setActiveTab,
  onPrewarmAll,
  isPrewarming,
}) => {
  const tabs = [
    { id: "workbench", label: "DNS Workbench", icon: Zap },
    { id: "cache", label: "Penyimpanan Cache", icon: Database, badge: stats?.cacheSize },
    { id: "hosts", label: "Local Hosts", icon: Server, badge: stats?.customHostsCount },
    { id: "blocklist", label: "Sinkhole & Adblock", icon: Shield, badge: stats?.blocklistCount },
    { id: "benchmark", label: "Upstream Bench", icon: Activity },
    { id: "binary", label: "Go + Erlang Binary", icon: Flame, isHighlight: true },
    { id: "logs", label: "Query Logs", icon: Clock, badge: stats?.totalQueries },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white tracking-tight">SpeedDNS</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  UDP/TCP 53
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  Go + BEAM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Local DNS Proxy & Zero-Latency Cache Engine
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Stats Pill */}
          {stats && (
            <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Hit Rate: <strong className="text-emerald-400">{stats.hitRate}%</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div>
                <span>Queries: <strong className="text-white">{stats.totalQueries}</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div>
                <span>Saved Time: <strong className="text-amber-400">{Math.round(stats.totalSavedMs)}ms</strong></span>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrewarmAll}
              disabled={isPrewarming}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm disabled:opacity-50"
              title="Pre-warm DNS cache for top mobile apps & websites"
            >
              <Flame className={`h-3.5 w-3.5 ${isPrewarming ? "animate-spin" : ""}`} />
              <span>{isPrewarming ? "Pre-warming..." : "Pre-warm Apps"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? tab.isHighlight
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : tab.isHighlight
                    ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (tab.isHighlight ? "text-amber-400" : "text-emerald-400") : ""}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-slate-700 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
