import React, { useState } from "react";
import { Server, Plus, Trash2, Edit2, Check, X, Shield, HelpCircle, HardDrive } from "lucide-react";
import { CustomHost } from "../types";

interface CustomHostsManagerProps {
  hosts: CustomHost[];
  onAddHost: (host: Omit<CustomHost, "id">) => void;
  onUpdateHost: (id: string, host: Partial<CustomHost>) => void;
  onDeleteHost: (id: string) => void;
}

export const CustomHostsManager: React.FC<CustomHostsManagerProps> = ({
  hosts,
  onAddHost,
  onUpdateHost,
  onDeleteHost,
}) => {
  const [domainInput, setDomainInput] = useState("");
  const [ipInput, setIpInput] = useState("");
  const [recordTypeInput, setRecordTypeInput] = useState("A");
  const [notesInput, setNotesInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim() || !ipInput.trim()) return;

    onAddHost({
      domain: domainInput.trim().toLowerCase(),
      ip: ipInput.trim(),
      recordType: recordTypeInput,
      notes: notesInput.trim(),
      enabled: true,
    });

    setDomainInput("");
    setIpInput("");
    setNotesInput("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Static Local Domain Storage</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Pemetaan Domain & IP Lokal (Custom Hosts)
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Simpan pasangan <strong>Domain ➔ IP</strong> statis secara permanen di proxy lokal. Memungkinkan buka web internal/server rumah atau override IP aplikasi secara langsung tanpa query ke internet (0ms instant response).
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center space-x-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Host Baru</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150"
          >
            <h3 className="text-sm font-semibold text-white">Tambah Record Host Statis Baru</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. server.local, myapk.internal"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Target IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.1.100, 10.0.0.5"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
                <select
                  value={recordTypeInput}
                  onChange={(e) => setRecordTypeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="A">A (IPv4)</option>
                  <option value="AAAA">AAAA (IPv6)</option>
                  <option value="CNAME">CNAME</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end space-x-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Catatan / Deskripsi (Opsional)</label>
                <input
                  type="text"
                  placeholder="Keterangan server atau perangkat lokal..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Hosts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Daftar Local Host Entries ({hosts.length})
          </span>
          <span className="text-xs text-slate-500">Resolusi Instan 0ms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Domain Name</th>
                <th className="py-3 px-4">Record Type</th>
                <th className="py-3 px-4">Mapped IP Address</th>
                <th className="py-3 px-4">Catatan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {hosts.map((host) => (
                <tr key={host.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onUpdateHost(host.id, { enabled: !host.enabled })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                        host.enabled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {host.enabled ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {host.domain}
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400">
                    {host.recordType}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                    {host.ip}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {host.notes || "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteHost(host.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Hapus record"
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
