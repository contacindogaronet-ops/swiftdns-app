import React, { useState } from "react";
import { Database, Trash2, RefreshCw, Search, Flame, Clock, Zap, CheckCircle2, ArrowUpRight, Plus } from "lucide-react";
import { CacheEntry, AppPresetCategory } from "../types";

interface CacheManagerProps {
  cacheEntries: CacheEntry[];
  presets: AppPresetCategory[];
  onRefresh: () => void;
  onClearCache: (domain?: string) => void;
  onPrefetch: (domains: string[]) => void;
  isPrefetching: boolean;
}

export const CacheManager: React.FC<CacheManagerProps> = ({
  cacheEntries,
  presets,
  onRefresh,
  onClearCache,
  onPrefetch,
  isPrefetching,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customDomainInput, setCustomDomainInput] = useState("");

  const filteredEntries = cacheEntries.filter(
    (e) =>
      e.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.records.some((r) => r.includes(searchTerm))
  );

  const handleAddManualPrefetch = () => {
    if (!customDomainInput.trim()) return;
    const domains = customDomainInput
      .split(/[\s,]+/)
      .map((d) => d.trim())
      .filter(Boolean);
    if (domains.length > 0) {
      onPrefetch(domains);
      setCustomDomainInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>In-Memory Zero-Latency Network Storage</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Penyimpanan Cache Domain & IP
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Daftar record DNS yang telah di-cache ke memori proxy lokal. Setiap kali aplikasi ponsel atau browser mengakses domain ini, proxy langsung merespons dari storage lokal tanpa tanya-tanya lagi ke server DNS luar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Table</span>
            </button>
            <button
              onClick={() => onClearCache()}
              disabled={cacheEntries.length === 0}
              className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition flex items-center space-x-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Flush All Cache</span>
            </button>
          </div>
        </div>

        {/* Pre-warm Preset Categories */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Kategori Pre-warm (Simpan DNS Sekaligus)</span>
            </span>
            <span className="text-xs text-slate-500">
              Isi cache sebelum aplikasi dibuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((p) => (
              <div
                key={p.category}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{p.category}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded">
                      {p.domains.length} domains
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-mono">
                    {p.domains.slice(0, 3).join(", ")}...
                  </div>
                </div>

                <button
                  onClick={() => onPrefetch(p.domains)}
                  disabled={isPrefetching}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center justify-center space-x-1 disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Pre-warm Kategori</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Domain Pre-warmer Input */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddManualPrefetch()}
              placeholder="Masukkan domain kustom untuk di-prewarm (e.g. pubgmobile.com, api.mybank.id)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleAddManualPrefetch}
            disabled={!customDomainInput.trim() || isPrefetching}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pre-fetch Domain</span>
          </button>
        </div>
      </div>

      {/* Cache Table & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari domain atau IP di storage..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Total Tersimpan: <strong className="text-white">{cacheEntries.length}</strong> Record</span>
          </div>
        </div>

        {/* Table Content */}
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Belum ada data cache yang tersimpan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Lakukan query di DNS Workbench atau klik tombol "Pre-warm Apps" di atas untuk menyimpan domain ke cache memori lokal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Domain Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Stored IP Records</th>
                  <th className="py-3 px-4">TTL Sisa</th>
                  <th className="py-3 px-4">Cache Hits</th>
                  <th className="py-3 px-4">Upstream Asal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredEntries.map((entry) => (
                  <tr key={`${entry.domain}:${entry.recordType}`} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white">{entry.domain}</span>
                        {entry.hits > 5 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                            Hot 🔥
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold border border-slate-700 text-[11px]">
                        {entry.recordType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 max-w-xs truncate">
                      <div className="flex flex-wrap gap-1">
                        {entry.records.map((ip, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 text-[11px]">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center space-x-1 text-slate-300 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{entry.remainingTtl ?? entry.ttl}s</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400 font-mono">
                        {entry.hits}x
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {entry.sourceUpstream}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onClearCache(entry.domain)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Hapus cache domain ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
