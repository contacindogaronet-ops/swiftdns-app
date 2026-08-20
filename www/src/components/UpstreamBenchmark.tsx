import React, { useState } from "react";
import { Activity, Play, CheckCircle2, Shield, Zap, Sparkles, Server } from "lucide-react";
import { UpstreamBenchmarkResult } from "../types";

interface UpstreamBenchmarkProps {
  benchmarks: UpstreamBenchmarkResult[];
  onRunBenchmark: () => void;
  isLoading: boolean;
}

export const UpstreamBenchmark: React.FC<UpstreamBenchmarkProps> = ({
  benchmarks,
  onRunBenchmark,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Multi-Upstream Latency Optimizer</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Benchmark Latensi Upstream DNS & Parallel Racing
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Engine Go + BEAM kami menggunakan metode <strong>Scatter-Gather Parallel Racing</strong>: setiap query dikirim bersamaan ke upstream tercepat. Hasil pertama yang tiba langsung dipakai dan disimpan ke local cache.
            </p>
          </div>

          <button
            onClick={onRunBenchmark}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center space-x-2 self-start disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Benchmarking..." : "Jalankan Benchmark"}</span>
          </button>
        </div>
      </div>

      {/* Benchmark Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benchmarks.map((srv, index) => {
          const isFastest = index === 0;
          return (
            <div
              key={srv.id}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
                isFastest
                  ? "bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5 relative overflow-hidden"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              {isFastest && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Tercepat 🚀</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2.5 mb-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold ${
                      isFastest
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{srv.name}</h3>
                    <span className="text-xs font-mono text-slate-400">
                      {srv.primary} / {srv.secondary}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Rata-rata Respon:</span>
                    <span
                      className={`text-lg font-mono font-bold ${
                        isFastest
                          ? "text-emerald-400"
                          : srv.avgLatencyMs < 40
                          ? "text-cyan-400"
                          : "text-amber-400"
                      }`}
                    >
                      {srv.avgLatencyMs} ms
                    </span>
                  </div>
                  {/* Progress bar visualizer */}
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFastest ? "bg-emerald-400" : "bg-cyan-500"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(10, 100 - srv.avgLatencyMs * 0.8))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Multi-query sample ({srv.results?.length || 5} test)</span>
                <span className="text-emerald-400 font-medium">Ready in Race Pool</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
