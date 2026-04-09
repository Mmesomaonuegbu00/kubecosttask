"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Cluster } from "../hooks/useClusterData";

interface SavingsInsightsProps {
  clusters: Cluster[];
}

const SavingsInsights: FC<SavingsInsightsProps> = ({ clusters }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const insights = clusters
    .map((c) => ({
      cluster: c.name,
      saving: c.savingsOpportunity,
      pct: c.total > 0 ? +((c.savingsOpportunity / c.total) * 100).toFixed(1) : 0,
      type: c.metrics.gpu > c.metrics.cpu ? "GPU underutilization" : "CPU overprovisioning",
    }))
    .sort((a, b) => b.saving - a.saving);

  return (
    <div
      ref={ref}
      className="rounded-lg border border-(--color-border) bg-(--color-bg-card) shadow-(--shadow-card) p-5 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-sm bg-(--color-accent-success-alpha) flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L9 5L13 5.5L10 8.5L10.5 13L7 11L3.5 13L4 8.5L1 5.5L5 5L7 1Z"
              fill="var(--color-accent-success)"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-(--color-text-primary) font-(--font-display)">
            Optimization Insights
          </h3>
          <span className="text-[11px] text-(--color-text-muted) font-(--font-body)">
            Automatically generated recommendations
          </span>
        </div>
      </div>

      {/* Insights List */}
      <div className="flex flex-col gap-2">
        {insights.map((ins, i) => (
          <div
            key={ins.cluster}
            className="flex items-center gap-2.5 p-2.5 rounded-md border border-(--color-border) bg-(--color-bg-inset) transition-all duration-350"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-12px)",
              transitionDelay: `${300 + i * 70}ms`,
            }}
          >
            <div className="w-8 h-8 rounded-sm bg-(--color-accent-success-alpha) flex items-center justify-center shrink-0">
              <span className="text-[14px]">💡</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-(--color-text-primary) font-(--font-body)">
                {ins.cluster}: {ins.type}
              </div>
              <div className="text-[11px] text-(--color-text-muted) font-(--font-body)">
                Resize recommendations available
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[13px] font-bold text-(--color-accent-success) font-(--font-mono)">
                ${ins.saving.toFixed(0)}
              </div>
              <div className="text-[10px] text-(--color-text-muted) bg-(--color-accent-success-alpha) rounded-full px-1 py-[1px] mt-0.5 font-(--font-body)">
                -{ins.pct}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsInsights;