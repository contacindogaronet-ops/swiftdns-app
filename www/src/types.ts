export interface CacheEntry {
  domain: string;
  recordType: string;
  records: string[];
  ttl: number;
  expiresAt: number;
  cachedAt: number;
  hits: number;
  sourceUpstream: string;
  originalLatencyMs: number;
  isExpired?: boolean;
  remainingTtl?: number;
}

export interface CustomHost {
  id: string;
  domain: string;
  ip: string;
  recordType: string;
  notes?: string;
  enabled: boolean;
}

export interface BlocklistRule {
  id: string;
  pattern: string;
  reason: string;
  enabled: boolean;
}

export interface QueryLog {
  id: string;
  timestamp: number;
  domain: string;
  recordType: string;
  cached: boolean;
  blocked: boolean;
  latencyMs: number;
  upstream: string;
  results: string[];
  protocol: "UDP" | "TCP" | "DoH";
}

export interface ProxyStats {
  totalQueries: number;
  cacheHits: number;
  cacheMisses: number;
  blockedQueries: number;
  totalSavedMs: number;
  cacheSize: number;
  customHostsCount: number;
  blocklistCount: number;
  hitRate: number;
  uptimeSeconds: number;
}

export interface UpstreamServer {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  doh?: string;
  location: string;
}

export interface UpstreamBenchmarkResult {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  avgLatencyMs: number;
  results: number[];
}

export interface AppPresetCategory {
  category: string;
  domains: string[];
}

export interface ExportCodePayload {
  goSource: string;
  buildScript: string;
  dockerfile: string;
  systemdService: string;
  erlangActorExplanation: string;
}
