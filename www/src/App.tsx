import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { QueryWorkbench } from "./components/QueryWorkbench";
import { CacheManager } from "./components/CacheManager";
import { CustomHostsManager } from "./components/CustomHostsManager";
import { BlocklistManager } from "./components/BlocklistManager";
import { UpstreamBenchmark } from "./components/UpstreamBenchmark";
import { SingleBinaryExporter } from "./components/SingleBinaryExporter";
import { QueryLogsViewer } from "./components/QueryLogsViewer";
import {
  ProxyStats,
  CacheEntry,
  CustomHost,
  BlocklistRule,
  QueryLog,
  UpstreamServer,
  UpstreamBenchmarkResult,
  AppPresetCategory,
  ExportCodePayload,
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("workbench");

  // State
  const [stats, setStats] = useState<ProxyStats | null>(null);
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [customHosts, setCustomHosts] = useState<CustomHost[]>([]);
  const [blocklistRules, setBlocklistRules] = useState<BlocklistRule[]>([]);
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);
  const [upstreams, setUpstreams] = useState<UpstreamServer[]>([]);
  const [benchmarks, setBenchmarks] = useState<UpstreamBenchmarkResult[]>([]);
  const [presets, setPresets] = useState<AppPresetCategory[]>([]);
  const [exportData, setExportData] = useState<ExportCodePayload | null>(null);

  const [isPrewarming, setIsPrewarming] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "info" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch all base data
  const fetchData = useCallback(async () => {
    try {
      const [
        statsRes,
        cacheRes,
        hostsRes,
        blocklistRes,
        logsRes,
        upstreamsRes,
        presetsRes,
        exportRes,
      ] = await Promise.all([
        fetch("/api/dns/stats").then((r) => r.json()),
        fetch("/api/dns/cache").then((r) => r.json()),
        fetch("/api/hosts").then((r) => r.json()),
        fetch("/api/blocklist").then((r) => r.json()),
        fetch("/api/dns/logs").then((r) => r.json()),
        fetch("/api/dns/upstreams").then((r) => r.json()),
        fetch("/api/dns/presets").then((r) => r.json()),
        fetch("/api/export/go-source").then((r) => r.json()),
      ]);

      setStats(statsRes);
      setCacheEntries(cacheRes);
      setCustomHosts(hostsRes);
      setBlocklistRules(blocklistRes);
      setQueryLogs(logsRes);
      setUpstreams(upstreamsRes);
      setPresets(presetsRes);
      setExportData(exportRes);
    } catch (err) {
      console.error("Error loading DNS data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Default initial benchmark
    runBenchmark();
  }, [fetchData]);

  // Prewarm cache
  const handlePrewarm = async (domains?: string[]) => {
    setIsPrewarming(true);
    try {
      const res = await fetch("/api/dns/prefetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
      });
      const data = await res.json();
      showNotification(`✨ Berhasil pre-warm ${data.prewarmedCount} domain ke penyimpanan cache lokal!`, "success");
      fetchData();
    } catch (err: any) {
      showNotification("Gagal pre-warm domain: " + err.message, "error");
    } finally {
      setIsPrewarming(false);
    }
  };

  // Clear cache
  const handleClearCache = async (domain?: string) => {
    try {
      const url = domain ? `/api/dns/cache?domain=${encodeURIComponent(domain)}` : "/api/dns/cache";
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      showNotification(data.message || "Cache berhasil dibersihkan", "info");
      fetchData();
    } catch (err: any) {
      showNotification("Gagal menghapus cache: " + err.message, "error");
    }
  };

  // Run Upstream Benchmark
  const runBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      const res = await fetch("/api/dns/benchmark", { method: "POST" });
      const data = await res.json();
      setBenchmarks(data);
    } catch (err) {
      console.error("Benchmark error:", err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  // Custom Hosts Handlers
  const handleAddHost = async (host: Omit<CustomHost, "id">) => {
    try {
      const res = await fetch("/api/hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(host),
      });
      if (res.ok) {
        showNotification(`Host ${host.domain} -> ${host.ip} tersimpan di storage lokal!`);
        fetchData();
      }
    } catch (err: any) {
      showNotification("Gagal menambah host: " + err.message, "error");
    }
  };

  const handleUpdateHost = async (id: string, updates: Partial<CustomHost>) => {
    try {
      await fetch(`/api/hosts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchData();
    } catch (err: any) {
      showNotification("Gagal update host", "error");
    }
  };

  const handleDeleteHost = async (id: string) => {
    try {
      await fetch(`/api/hosts/${id}`, { method: "DELETE" });
      showNotification("Host record dihapus");
      fetchData();
    } catch (err: any) {
      showNotification("Gagal menghapus host", "error");
    }
  };

  // Blocklist Handlers
  const handleAddBlockRule = async (rule: Omit<BlocklistRule, "id">) => {
    try {
      const res = await fetch("/api/blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      if (res.ok) {
        showNotification(`Rule sinkhole ${rule.pattern} aktif (0.0.0.0)`);
        fetchData();
      }
    } catch (err: any) {
      showNotification("Gagal menambah rule", "error");
    }
  };

  const handleUpdateBlockRule = async (id: string, updates: Partial<BlocklistRule>) => {
    try {
      await fetch(`/api/blocklist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchData();
    } catch (err: any) {
      showNotification("Gagal update rule", "error");
    }
  };

  const handleDeleteBlockRule = async (id: string) => {
    try {
      await fetch(`/api/blocklist/${id}`, { method: "DELETE" });
      showNotification("Rule sinkhole dihapus");
      fetchData();
    } catch (err: any) {
      showNotification("Gagal menghapus rule", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 border transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${
            notification.type === "error"
              ? "bg-rose-950 border-rose-500 text-rose-200"
              : notification.type === "info"
              ? "bg-slate-900 border-slate-700 text-slate-200"
              : "bg-emerald-950 border-emerald-500 text-emerald-200"
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navbar & Quick Stats */}
      <Navbar
        stats={stats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrewarmAll={() => handlePrewarm()}
        isPrewarming={isPrewarming}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "workbench" && (
          <QueryWorkbench
            upstreams={upstreams}
            onQuerySuccess={fetchData}
          />
        )}

        {activeTab === "cache" && (
          <CacheManager
            cacheEntries={cacheEntries}
            presets={presets}
            onRefresh={fetchData}
            onClearCache={handleClearCache}
            onPrefetch={handlePrewarm}
            isPrefetching={isPrewarming}
          />
        )}

        {activeTab === "hosts" && (
          <CustomHostsManager
            hosts={customHosts}
            onAddHost={handleAddHost}
            onUpdateHost={handleUpdateHost}
            onDeleteHost={handleDeleteHost}
          />
        )}

        {activeTab === "blocklist" && (
          <BlocklistManager
            rules={blocklistRules}
            onAddRule={handleAddBlockRule}
            onUpdateRule={handleUpdateBlockRule}
            onDeleteRule={handleDeleteBlockRule}
          />
        )}

        {activeTab === "benchmark" && (
          <UpstreamBenchmark
            benchmarks={benchmarks}
            onRunBenchmark={runBenchmark}
            isLoading={isBenchmarking}
          />
        )}

        {activeTab === "binary" && (
          <SingleBinaryExporter
            exportData={exportData}
          />
        )}

        {activeTab === "logs" && (
          <QueryLogsViewer
            logs={queryLogs}
            onRefresh={fetchData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpeedDNS • High-Performance UDP/TCP 53 Local Resolver & Network Cache Engine</span>
          <span className="font-mono text-slate-600">Built with Go Core + BEAM Queue Architecture</span>
        </div>
      </footer>
    </div>
  );
}
