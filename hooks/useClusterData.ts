import { useState, useEffect, useRef } from "react";

export interface Metrics {
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
}

export interface Workflow {
  name: string;
  metrics: Metrics;
}

export interface Namespace {
  name: string;
  workflows: Workflow[];
  metrics: Metrics;
}

export interface Cluster {
  name: string;
  namespaces: Namespace[];
  metrics: Metrics;
  total: number;
  savingsOpportunity: number;
}

export interface KpiData {
  totalSpend: number;
  potentialSavings: number;
  efficiency: number;
  clusters: number;
  trend: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache: { data: { clusters: Cluster[]; kpi: KpiData } | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const isCacheFresh = () => Date.now() - cache.timestamp < CACHE_TTL_MS;

function aggregateMetrics(list: Metrics[]): Metrics {
  return list.reduce(
    (acc, m) => ({
      cpu: acc.cpu + m.cpu,
      ram: acc.ram + m.ram,
      storage: acc.storage + m.storage,
      network: acc.network + m.network,
      gpu: acc.gpu + m.gpu,
      efficiency: acc.efficiency + m.efficiency,
    }),
    { cpu: 0, ram: 0, storage: 0, network: 0, gpu: 0, efficiency: 0 }
  );
}

function metricTotal(m: Metrics) {
  return m.cpu + m.ram + m.storage + m.network + m.gpu + m.efficiency;
}

function parseProducts(products: any[]): Cluster[] {
  const clusterMap = new Map<string, any[]>();
  products.forEach((p, i) => {
    const key = `cluster-${(i % 4) + 1}`;
    if (!clusterMap.has(key)) clusterMap.set(key, []);
    clusterMap.get(key)!.push(p);
  });

  return Array.from(clusterMap.entries()).map(([clusterName, items]) => {
    const nsMap = new Map<string, any[]>();
    items.forEach((p) => {
      const key = p.category || "default";
      if (!nsMap.has(key)) nsMap.set(key, []);
      nsMap.get(key)!.push(p);
    });

    const namespaces: Namespace[] = Array.from(nsMap.entries())
      .slice(0, 5)
      .map(([nsName, nsItems]) => {
        const workflows: Workflow[] = nsItems.slice(0, 6).map((p) => ({
          name: p.title,
          metrics: {
            cpu: +(p.price * 0.3).toFixed(2),
            ram: +(p.stock * 0.02).toFixed(2),
            storage: +(p.rating * 8).toFixed(2),
            network: +(p.discountPercentage * 0.5).toFixed(2),
            gpu: +((p.id % 5) * 12).toFixed(2),
            efficiency: +(p.rating * 18).toFixed(2),
          },
        }));
        return {
          name: nsName,
          workflows,
          metrics: aggregateMetrics(workflows.map((w) => w.metrics)),
        };
      });

    const clusterMetrics = aggregateMetrics(namespaces.map((n) => n.metrics));
    const total = +metricTotal(clusterMetrics).toFixed(2);
    const savingsOpportunity = +(total * (0.15 + Math.random() * 0.25)).toFixed(2);

    return { name: clusterName, namespaces, metrics: clusterMetrics, total, savingsOpportunity };
  });
}


export function useClusterData() {
  const [clusters, setClusters] = useState<Cluster[]>(cache.data?.clusters ?? []);
  const [kpi, setKpi] = useState<KpiData | null>(cache.data?.kpi ?? null);
  const [loading, setLoading] = useState(!isCacheFresh());
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (isCacheFresh() && cache.data) {
      setClusters(cache.data.clusters);
      setKpi(cache.data.kpi);
      setLoading(false);
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=80", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed = parseProducts(json.products || []);

        const totalSpend = +parsed.reduce((s, c) => s + c.total, 0).toFixed(2);
        const potentialSavings = +parsed.reduce((s, c) => s + c.savingsOpportunity, 0).toFixed(2);
        const avgEff = +(
          parsed.reduce((s, c) => s + c.metrics.efficiency, 0) / parsed.length
        ).toFixed(1);

        const kpiData: KpiData = {
          totalSpend,
          potentialSavings,
          efficiency: Math.min(99, Math.round(avgEff / 10)),
          clusters: parsed.length,
          trend: +(Math.random() * 12 - 4).toFixed(1),
        };

        cache.data = { clusters: parsed, kpi: kpiData };
        cache.timestamp = Date.now();

        setClusters(parsed);
        setKpi(kpiData);
      } catch (e: any) {
        if (e.name !== "AbortError") setError("Failed to fetch cluster data.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { clusters, kpi, loading, error };
}
