import React, { useState } from "react";
import { Clock, CheckCircle2, ShieldAlert, Zap, Search, RefreshCw } from "lucide-react";
import { QueryLog } from "../types";

interface QueryLogsViewerProps {
  logs: QueryLog[];
  onRefresh: () => void;
}

export const QueryLogsViewer: React.FC<QueryLogsViewerProps> = ({ logs, onRefresh }) => {
  const [filter, setFilter] = useState<"ALL" | "CACHED" | "UPSTREAM" | "BLOCKED">("ALL");
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (filter === "CACHED" && !log.cached) return false;
    if (filter === "UPSTREAM" && (log.cached || log.blocked)) return false;
    if (filter === "BLOCKED" && !log.blocked) return false;
    if (search && !log.domain.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time DNS Traffic Monitor</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Aktivitas Log Query DNS
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Catatan real-time setiap kali aplikasi atau web mengirimkan request DNS ke proxy. Menunjukkan status cache hit, latensi, dan IP tujuan.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex space-x-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === "ALL"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              onClick={() => setFilter("CACHED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === "CACHED"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cache Hit ⚡ ({logs.filter((l) => l.cached).length})
            </button>
            <button
              onClick={() => setFilter("BLOCKED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === "BLOCKED"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Blocked 🚫 ({logs.filter((l) => l.blocked).length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari domain..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada log query yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status & Sumber</th>
                  <th className="py-3 px-4">Latensi</th>
                  <th className="py-3 px-4">Hasil IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {log.domain}
                    </td>
                    <td className="py-3 px-4 text-cyan-400">
                      {log.recordType}
                    </td>
                    <td className="py-3 px-4">
                      {log.blocked ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px]">
                          <ShieldAlert className="w-3 h-3" />
                          <span>BLOCKED (0.0.0.0)</span>
                        </span>
                      ) : log.cached ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px]">
                          <Zap className="w-3 h-3" />
                          <span>CACHE HIT (0ms)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>UPSTREAM MISS</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={log.latencyMs < 1 ? "text-emerald-400" : "text-amber-400"}>
                        {log.latencyMs} ms
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs truncate">
                      {log.results.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
