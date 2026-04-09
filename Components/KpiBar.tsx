"use client";

import React, { FC, useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { KpiData } from "../hooks/useClusterData";

interface KpiBarProps {
  kpi: KpiData;
}

const CountUp: FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => {
    return `${prefix}${Math.floor(latest).toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    const controls = async () => {
      await new Promise<void>((resolve) => {
        let frameId: number;
        const start = Date.now();
        const duration = 1100;

        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          count.set(value * eased);

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          } else {
            count.set(value);
            resolve();
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        frameId = requestAnimationFrame(animate);
      });
    };

    controls();
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
};

interface KpiItemProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sublabel: string;
  accent: string;
  trend?: number;
  index: number;
}

const KpiItem: FC<KpiItemProps> = ({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  sublabel,
  accent,
  trend,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isPositiveTrend = (trend ?? 0) < 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-lg bg-(--color-bg-card) border border-(--color-border) shadow-(--shadow-card) p-4"
      variants={itemVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-full"
        style={{ backgroundColor: accent, opacity: 0.7 }}
      />

      <div className="text-[10px] text-(--color-text-muted) uppercase tracking-[0.08em] mb-2  ">
        {label}
      </div>

      <div className="flex items-end gap-2 mb-1">
        <div className="text-[26px] font-bold text-(--color-text-primary) leading-none tracking-[-0.02em]  ">
          {visible ? (
            <CountUp
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          ) : (
            `${prefix ?? ""}0${suffix ?? ""}`
          )}
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold pb-0.5 ${
              isPositiveTrend
                ? "text-(--color-accent-success)"
                : "text-(--color-accent-error)"
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={isPositiveTrend ? "M2 7L5 3L8 7" : "M2 3L5 7L8 3"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="text-[11px] text-(--color-text-muted)  ">
        {sublabel}
      </div>
    </motion.div>
  );
};

const KpiBar: FC<KpiBarProps> = ({ kpi }) => {
  return (
    <div
      role="region"
      aria-label="Key performance indicators"
      className="grid gap-3 mb-7 grid-cols-[repeat(auto-fit,minmax(clamp(160px,20vw,220px),1fr))]"
    >
      <KpiItem
        index={0}
        label="Total Monthly Spend"
        value={kpi.totalSpend}
        prefix="$"
        decimals={0}
        sublabel="across all clusters"
        accent="var(--color-accent-primary)"
        trend={kpi.trend}
      />
      <KpiItem
        index={1}
        label="Potential Savings"
        value={kpi.potentialSavings}
        prefix="$"
        decimals={0}
        sublabel="optimization available"
        accent="var(--color-accent-success)"
      />
      <KpiItem
        index={2}
        label="Avg Efficiency"
        value={kpi.efficiency}
        suffix="%"
        decimals={0}
        sublabel="resource utilization"
        accent="var(--color-accent-efficiency)"
      />
      <KpiItem
        index={3}
        label="Active Clusters"
        value={kpi.clusters}
        decimals={0}
        sublabel="monitored by Kubecost"
        accent="var(--color-accent-gpu)"
      />
    </div>
  );
};

export default KpiBar;