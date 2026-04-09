"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Cluster } from "../hooks/useClusterData";

interface SpendChartProps {
  clusters: Cluster[];
}

const SpendChart: FC<SpendChartProps> = ({ clusters }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxTotal = Math.max(...clusters.map((c) => c.total));

  const metricKeys: Array<{ key: keyof Cluster["metrics"]; color: string; label: string }> = [
    { key: "cpu", color: "var(--color-accent-cpu)", label: "CPU" },
    { key: "ram", color: "var(--color-accent-ram)", label: "RAM" },
    { key: "storage", color: "var(--color-accent-storage)", label: "Storage" },
    { key: "network", color: "var(--color-accent-network)", label: "Network" },
    { key: "gpu", color: "var(--color-accent-gpu)", label: "GPU" },
  ];

  return (
    <div
      ref={ref}
      className="rounded-lg border bg-(--color-bg-card) border-(--color-border) shadow-(--shadow-card) p-5 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-(--color-text-primary) font-(--font-display) m-0">
          Spend by Cluster
        </h3>
        <span className="text-[11px] text-(--color-text-muted) font-(--font-body)">
          Breakdown by resource type
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2.5 mb-3.5">
        {metricKeys.map(({ key, color, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-(--color-text-muted) font-(--font-body)">{label}</span>
          </div>
        ))}
      </div>

      {/* Stacked bars */}
      <div className="flex flex-col gap-2.5">
        {clusters.map((cluster, ci) => (
          <div key={cluster.name} className="flex items-center gap-2.5">
            <span className="text-[11px] text-(--color-text-secondary) font-(--font-mono) w-[68px] shrink-0">
              {cluster.name}
            </span>

            <div className="flex-1 h-5 rounded-sm overflow-hidden flex bg-(--color-bg-inset)">
              {metricKeys.map(({ key, color }, ki) => {
                const val = cluster.metrics[key];
                const pct = maxTotal > 0 ? (val / maxTotal) * 100 : 0;
                return (
                  <div
                    key={key}
                    title={`${key}: $${val.toFixed(0)}`}
                    style={{
                      width: visible ? `${pct}%` : "0%",
                      backgroundColor: color,
                      transition: `width ${600 + ki * 80}ms cubic-bezier(0.34,1.1,0.64,1)`,
                      transitionDelay: `${100 + ci * 60 + ki * 40}ms`,
                    }}
                  />
                );
              })}
            </div>

            <span className="text-[11px] text-(--color-text-secondary) font-(--font-mono) w-[52px] text-right shrink-0">
              ${cluster.total.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendChart;