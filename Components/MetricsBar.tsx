"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Metrics } from "../hooks/useClusterData";

const METRIC_CONFIG = [
  { key: "cpu" as keyof Metrics, label: "CPU", color: "var(--color-accent-cpu)", unit: "$" },
  { key: "ram" as keyof Metrics, label: "RAM", color: "var(--color-accent-ram)", unit: "$" },
  { key: "storage" as keyof Metrics, label: "Storage", color: "var(--color-accent-storage)", unit: "$" },
  { key: "network" as keyof Metrics, label: "Network", color: "var(--color-accent-network)", unit: "$" },
  { key: "gpu" as keyof Metrics, label: "GPU", color: "var(--color-accent-gpu)", unit: "$" },
  { key: "efficiency" as keyof Metrics, label: "Efficiency", color: "var(--color-accent-efficiency)", unit: "$" },
];

interface MetricsBarProps {
  metrics: Metrics;
  compact?: boolean;
}

const MetricsBar: FC<MetricsBarProps> = ({ metrics, compact = false }) => {
  const total = Object.values(metrics).reduce((s, v) => s + v, 0);
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

  return (
    <div
      ref={ref}
      className={`flex flex-col ${compact ? "gap-1.5" : "gap-2.5"}`}
    >
      <div
        className={`flex overflow-hidden rounded-full bg-(--color-bg-inset) ${
          compact ? "h-1.5" : "h-2"
        }`}
      >
        {METRIC_CONFIG.map(({ key, color }, i) => {
          const pct = total > 0 ? (metrics[key] / total) * 100 : 0;
          return (
            <div
              key={key}
              className="h-full"
              style={{
                width: visible ? `${pct}%` : "0%",
                backgroundColor: color,
                transition: `width ${400 + i * 80}ms cubic-bezier(0.34,1.2,0.64,1)`,
                transitionDelay: `${i * 40}ms`,
              }}
            />
          );
        })}
      </div>

      {!compact &&
        METRIC_CONFIG.map(({ key, label, color, unit }, i) => {
          const val = metrics[key];
          const pct = total > 0 ? (val / total) * 100 : 0;

          return (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />

              <span className="text-[11px] text-(--color-text-muted) w-[58px] shrink-0 font-[var(--font-geist-sans)]">
                {label}
              </span>

              <div className="flex-1 h-1 rounded-full bg-(--color-bg-inset) overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: color,
                    width: visible ? `${pct}%` : "0%",
                    transition: `width ${500 + i * 60}ms cubic-bezier(0.34,1.2,0.64,1)`,
                    transitionDelay: `${i * 50}ms`,
                  }}
                />
              </div>

              <span className="text-[11px] text-(--color-text-secondary) w-[44px] text-right shrink-0 font-[var(--font-geist-mono)]">
                {unit}
                {val.toFixed(0)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default MetricsBar;