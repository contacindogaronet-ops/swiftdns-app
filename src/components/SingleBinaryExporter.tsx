import React, { useState } from "react";
import { Flame, Copy, Check, Download, Terminal, Cpu, FileCode, Layers, ShieldCheck, Smartphone, Monitor, Wifi } from "lucide-react";
import { ExportCodePayload } from "../types";

interface SingleBinaryExporterProps {
  exportData: ExportCodePayload | null;
}

export const SingleBinaryExporter: React.FC<SingleBinaryExporterProps> = ({ exportData }) => {
  const [activeFileTab, setActiveFileTab] = useState<"go" | "build" | "docker" | "service">("go");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!exportData) {
    return <div className="p-8 text-center text-slate-400">Loading code generator...</div>;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Architecture Concept Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Go UDP/TCP Core + BEAM / Erlang Actor Queue Mailbox</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Single Binary Go & Erlang Engine Generator
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Kompilasi seluruh sistem proxy DNS UDP/TCP, antrian Erlang actor worker non-blocking, in-memory cache storage, dan DNS sinkhole menjadi <strong>satu binary mandiri (single binary &lt; 8MB)</strong> tanpa dependensi eksternal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownload("main.go", exportData.goSource)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download main.go</span>
            </button>
            <button
              onClick={() => handleDownload("build.sh", exportData.buildScript)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>build.sh</span>
            </button>
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
              <Cpu className="w-4 h-4" />
              <span>Erlang Mailbox Pattern</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Antrian <code>chan DNSRequestJob</code> berkapasitas 2048 slot dengan 64 worker goroutine independen, memproses jutaan query tanpa lock contention.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-1">
              <Layers className="w-4 h-4" />
              <span>Parallel Upstream Racing</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scatter-gather dispatching ke 1.1.1.1, 8.8.8.8, dan 9.9.9.9 secara bersamaan, respons tercepat langsung dipakai dan di-cache.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Single Executable</span>
            </div>
            <p className="text-[11px] text-slate-400">
              CGO_ENABLED=0 menghasilkan static binary murni untuk Android (ARM64), Linux, Windows, dan Router tanpa butuh runtime tambahan.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer & Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Code Tabs Header */}
        <div className="p-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setActiveFileTab("go")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1.5 ${
                activeFileTab === "go"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>main.go</span>
            </button>
            <button
              onClick={() => setActiveFileTab("build")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1.5 ${
                activeFileTab === "build"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>build.sh</span>
            </button>
            <button
              onClick={() => setActiveFileTab("docker")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1.5 ${
                activeFileTab === "docker"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Dockerfile</span>
            </button>
            <button
              onClick={() => setActiveFileTab("service")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1.5 ${
                activeFileTab === "service"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>speeddns.service</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const content =
                  activeFileTab === "go"
                    ? exportData.goSource
                    : activeFileTab === "build"
                    ? exportData.buildScript
                    : activeFileTab === "docker"
                    ? exportData.dockerfile
                    : exportData.systemdService;
                handleCopy(content, activeFileTab);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
            >
              {copiedKey === activeFileTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-300 max-h-[480px] scrollbar-thin">
          <pre className="leading-relaxed">
            {activeFileTab === "go" && exportData.goSource}
            {activeFileTab === "build" && exportData.buildScript}
            {activeFileTab === "docker" && exportData.dockerfile}
            {activeFileTab === "service" && exportData.systemdService}
          </pre>
        </div>
      </div>

      {/* Deployment & Setup Guides for Android / PC / Router */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Cara Menjalankan Binary di HP (Android) / Komputer / Router</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Android Termux */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>1. Android (Termux / Root)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Jalankan binary di Termux pada port 5353 atau port 53 (jika Root):
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-[10px] font-mono text-cyan-300 break-all select-all">
              chmod +x speeddns-android-arm64<br />
              ./speeddns-android-arm64
            </div>
          </div>

          {/* Linux / Windows */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Monitor className="w-4 h-4" />
              <span>2. PC / Laptop (127.0.0.1)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Jalankan binary, lalu set DNS adapter Windows/Linux ke <code>127.0.0.1</code>:
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-[10px] font-mono text-cyan-300 break-all select-all">
              sudo ./speeddns-linux-amd64<br />
              # Atau Windows: speeddns.exe
            </div>
          </div>

          {/* Router / OpenWrt */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Wifi className="w-4 h-4" />
              <span>3. Router (OpenWrt / MikroTik)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Copy binary ke router OpenWrt (MIPS / ARM) agar seluruh WiFi otomatis cepat:
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-[10px] font-mono text-cyan-300 break-all select-all">
              scp speeddns root@192.168.1.1:/bin/<br />
              /etc/init.d/speeddns start
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
