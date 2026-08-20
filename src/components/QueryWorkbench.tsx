import React, { useState } from "react";
import { Zap, Send, ShieldAlert, CheckCircle2, Clock, Server, ArrowRight, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import { UpstreamServer } from "../types";

interface QueryWorkbenchProps {
  upstreams: UpstreamServer[];
  onQuerySuccess: () => void;
}

export const QueryWorkbench: React.FC<QueryWorkbenchProps> = ({ upstreams, onQuerySuccess }) => {
  const [domain, setDomain] = useState("web.whatsapp.com");
  const [recordType, setRecordType] = useState("A");
  const [selectedUpstream, setSelectedUpstream] = useState("1.1.1.1");
  const [protocol, setProtocol] = useState<"UDP" | "TCP">("UDP");
  const [bypassCache, setBypassCache] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    domain: string;
    recordType: string;
    records: string[];
    cached: boolean;
    blocked: boolean;
    reason?: string;
    latencyMs: number;
    source: string;
    ttl: number;
    cachedAt?: number;
    hits?: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const appPresets = [
    { name: "WhatsApp", domain: "web.whatsapp.com", type: "A", icon: "💬" },
    { name: "Instagram", domain: "api.instagram.com", type: "A", icon: "📸" },
    { name: "TikTok", domain: "tiktok.com", type: "A", icon: "🎵" },
    { name: "YouTube", domain: "i.ytimg.com", type: "A", icon: "▶️" },
    { name: "Shopee", domain: "shopee.co.id", type: "A", icon: "🛍️" },
    { name: "Tokopedia", domain: "tokopedia.com", type: "A", icon: "🛒" },
    { name: "Mobile Legends", domain: "mobilelegends.com", type: "A", icon: "⚔️" },
    { name: "Local Dev", domain: "local.dev", type: "A", icon: "💻" },
    { name: "Ad Tracker (Test Block)", domain: "doubleclick.net", type: "A", icon: "🚫" },
  ];

  const handleExecuteQuery = async (queryDomain?: string, queryType?: string) => {
    const targetDomain = queryDomain || domain;
    const targetType = queryType || recordType;

    if (!targetDomain.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dns/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: targetDomain.trim(),
          recordType: targetType,
          upstream: selectedUpstream,
          protocol,
          bypassCache,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resolve DNS query");
      }

      setResult(data);
      onQuerySuccess();
    } catch (err: any) {
      setError(err.message || "Network resolution error");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Roundtrip Local Resolver</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DNS Query Tester & Response Workbench
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Uji resolusi DNS lokal. Ketika domain sudah tersimpan di cache atau host lokal, respons dikembalikan dalam <strong>&lt; 0.3ms (0 roundtrip)</strong> tanpa perlu request berulang ke internet.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-left">
              <span className="text-[11px] text-slate-400 block">Upstream Target</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{selectedUpstream}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-left">
              <span className="text-[11px] text-slate-400 block">Active Protocol</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{protocol} 53</span>
            </div>
          </div>
        </div>

        {/* Quick App Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            🚀 Coba Resolusi Preset Aplikasi Populer:
          </span>
          <div className="flex flex-wrap gap-2">
            {appPresets.map((app) => (
              <button
                key={app.domain}
                onClick={() => {
                  setDomain(app.domain);
                  setRecordType(app.type);
                  handleExecuteQuery(app.domain, app.type);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition group"
              >
                <span>{app.icon}</span>
                <span>{app.name}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition ml-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Control Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Domain Input */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Domain Name / Host
            </label>
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExecuteQuery()}
                placeholder="e.g. web.whatsapp.com, google.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500">UDP/TCP</span>
            </div>
          </div>

          {/* Record Type */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            >
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="CNAME">CNAME</option>
              <option value="TXT">TXT</option>
              <option value="MX">MX</option>
              <option value="NS">NS</option>
            </select>
          </div>

          {/* Upstream Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Upstream DNS
            </label>
            <select
              value={selectedUpstream}
              onChange={(e) => setSelectedUpstream(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            >
              {upstreams.map((u) => (
                <option key={u.id} value={u.primary}>
                  {u.name} ({u.primary})
                </option>
              ))}
            </select>
          </div>

          {/* Protocol & Action */}
          <div className="md:col-span-2 flex flex-col justify-end">
            <button
              onClick={() => handleExecuteQuery()}
              disabled={isLoading || !domain.trim()}
              className="w-full h-[42px] flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Resolve DNS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Options & Protocol Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Protocol:</span>
              <button
                type="button"
                onClick={() => setProtocol("UDP")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  protocol === "UDP"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                UDP
              </button>
              <button
                type="button"
                onClick={() => setProtocol("TCP")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  protocol === "TCP"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                TCP
              </button>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={bypassCache}
                onChange={(e) => setBypassCache(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-800"
              />
              <span>Bypass Local Cache (Force Upstream Request)</span>
            </label>
          </div>

          <div className="text-slate-500 flex items-center space-x-1">
            <Server className="w-3.5 h-3.5" />
            <span>Local Listening: 0.0.0.0:53 (UDP/TCP)</span>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div>
            <strong className="font-semibold block">DNS Resolution Error:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Resolution Result Card */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in duration-200">
          {/* Header Result Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              {result.blocked ? (
                <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              ) : result.cached ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white font-mono">{result.domain}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {result.recordType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{result.source}</p>
              </div>
            </div>

            {/* Latency Meter Pill */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Response Time</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    result.latencyMs < 1
                      ? "text-emerald-400"
                      : result.latencyMs < 30
                      ? "text-cyan-400"
                      : "text-amber-400"
                  }`}
                >
                  {result.latencyMs} ms
                </span>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">TTL Remaining</span>
                <span className="text-sm font-semibold font-mono text-slate-300">{result.ttl}s</span>
              </div>
            </div>
          </div>

          {/* Latency Comparison Card: Cached vs Upstream */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Visualisasi Latensi Resolusi
              </span>
              <div className="space-y-2 mt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Upstream Resolver (Normal)</span>
                    <span className="font-mono text-slate-300">~65 - 120 ms</span>
                  </div>
                  <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[85%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-emerald-400 font-medium mb-1">
                    <span>SpeedDNS Local Cache</span>
                    <span className="font-mono font-bold text-emerald-400">&lt; 0.3 ms (Instant ⚡)</span>
                  </div>
                  <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[2%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-700/60 pt-3 md:pt-0 md:pl-4">
              <span className="text-xs text-slate-400">Efisiensi Aplikasi:</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {result.cached
                  ? `⚡ Domain telah tersimpan di memory proxy. Aplikasi APK atau Browser langsung dapat IP tanpa roundtrip ke server DNS internet, menghemat ~75ms per koneksi socket.`
                  : result.blocked
                  ? `🚫 Domain diblokir (Sinkhole ke 0.0.0.0). Iklan/telemetry tidak akan di-download, menghemat kuota dan mempercepat loading web.`
                  : `💾 Domain baru saja di-cache ke storage proxy lokal. Request berikutnya untuk domain ini akan direspons instan 0ms.`}
              </p>
            </div>
          </div>

          {/* Returned IP / Record Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                DNS Answer Records ({result.records.length})
              </span>
              <button
                onClick={() => handleCopy(result.records.join("\n"))}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy IPs"}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/80 font-mono text-xs">
              {result.records.map((ip, idx) => (
                <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 text-[10px]">#{idx + 1}</span>
                    <span className="text-emerald-400 font-semibold">{ip}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">IN {result.recordType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Repeat / Flush Cache for this Domain */}
          <div className="flex items-center justify-end space-x-2 pt-2 text-xs">
            <button
              onClick={() => handleExecuteQuery()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Query Again (Test Cache)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
