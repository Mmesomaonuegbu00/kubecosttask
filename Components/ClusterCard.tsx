'use client'

import React, { FC, useState, useRef, useEffect } from "react";
import { Cluster } from "../hooks/useClusterData";
import MetricsBar from "./MetricsBar";

interface ClusterCardProps {
  cluster: Cluster;
  index: number;
  onClick: () => void;
}

const CountUp: FC<{ value: number; prefix?: string; decimals?: number }> = ({ value, prefix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const from = 0;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <>{prefix}{display.toFixed(decimals)}</>;
};

const ClusterCard: FC<ClusterCardProps> = ({ cluster, index, onClick }) => {
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

  const savingsPct =
    cluster.total > 0
      ? ((cluster.savingsOpportunity / cluster.total) * 100).toFixed(0)
      : "0";

  const nsCount = cluster.namespaces.length;

  return (
    <div
      ref={ref}
      className="cluster-card flex-col flex gap-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 100}ms`,
      }}
      onClick={onClick}
    >
      <div className="p-5 pb-0 bg-(--color-bg-primary)  border border-(--color-border)  overflow-hidden transition-all duration-500 ease-out cursor-pointer min-h-30">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div>
              <h2 className="m-0 text-[15px] font-semibold text-(--color-text-primary) tracking-[-0.01em]">
                {cluster.name}
              </h2>
              <span className="text-[11px] text-(--color-text-muted)  ">
                {nsCount} namespace{nsCount !== 1 ? "s" : ""} · Kubernetes
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[22px] font-bold text-(--color-text-primary) leading-none tracking-[-0.02em]">
              {visible ? (
                <CountUp value={cluster.total} prefix="$" decimals={0} />
              ) : (
                "$0"
              )}
            </div>
            <div className="text-[10px] text-(--color-text-muted) mt-0.5">
              monthly spend
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-(--color-accent-success-alpha) border border-[rgba(16,185,129,0.2)] rounded-full px-2.5 py-1 mb-3.5">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5H8M5 2L8 5L5 8"
              stroke="var(--color-accent-success)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] text-(--color-accent-success) ">
            Save up to {savingsPct}% · $
            {cluster.savingsOpportunity.toFixed(0)}
          </span>
        </div>

        
      </div>


      <div className="mb-4 p-5 pb-0 bg-(--color-bg-card) min-h-70">
          <div className="text-[10px] text-(--color-text-muted) uppercase tracking-[0.08em] mb-2">
            Resource Allocation
          </div>
          <MetricsBar metrics={cluster.metrics} />
        </div>
    </div>
  );
};

export default ClusterCard;