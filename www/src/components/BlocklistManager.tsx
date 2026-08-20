import React, { useState } from "react";
import { Shield, ShieldAlert, Plus, Trash2, X, Check, Eye } from "lucide-react";
import { BlocklistRule } from "../types";

interface BlocklistManagerProps {
  rules: BlocklistRule[];
  onAddRule: (rule: Omit<BlocklistRule, "id">) => void;
  onUpdateRule: (id: string, rule: Partial<BlocklistRule>) => void;
  onDeleteRule: (id: string) => void;
}

export const BlocklistManager: React.FC<BlocklistManagerProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
}) => {
  const [patternInput, setPatternInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternInput.trim()) return;

    onAddRule({
      pattern: patternInput.trim().toLowerCase(),
      reason: reasonInput.trim() || "User Blocklist Rule",
      enabled: true,
    });

    setPatternInput("");
    setReasonInput("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>0.0.0.0 Sinkhole & Tracker Shield</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Adblock & Telemetry Sinkhole Filter
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Blokir domain iklan, tracker, dan telemetry dengan mengarahkan resolusi langsung ke <code>0.0.0.0</code>. Membuat aplikasi dan website terbuka jauh lebih ringan dan hemat kuota data.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition flex items-center space-x-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rule Blokir</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150"
          >
            <h3 className="text-sm font-semibold text-white">Tambah Domain / Pattern Blokir Baru</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Domain / Keyword</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. adservice.google.com, telemetry.*"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Alasan Pemblokiran</label>
                <input
                  type="text"
                  placeholder="e.g. In-app banner ads, tracking pixel"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-end space-x-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Blokir
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Daftar Rule Sinkhole ({rules.length})
          </span>
          <span className="text-xs text-slate-500">Meredam DNS ke 0.0.0.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Domain Pattern</th>
                <th className="py-3 px-4">Sinkhole Target</th>
                <th className="py-3 px-4">Kategori / Alasan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onUpdateRule(rule.id, { enabled: !rule.enabled })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                        rule.enabled
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {rule.enabled ? "Blocked" : "Bypassed"}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {rule.pattern}
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-semibold">
                    0.0.0.0
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {rule.reason}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Hapus rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
