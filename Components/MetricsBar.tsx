"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Metrics } from "../hooks/useClusterData";

const METRICS_CONFIG = [
  { id: "cpu" as keyof Metrics, name: "CPU", color: "var(--color-accent-cpu)", unit: "$" },
  { id: "ram" as keyof Metrics, name: "RAM", color: "var(--color-accent-ram)", unit: "$" },
  { id: "storage" as keyof Metrics, name: "Storage", color: "var(--color-accent-storage)", unit: "$" },
  { id: "network" as keyof Metrics, name: "Network", color: "var(--color-accent-network)", unit: "$" },
  { id: "gpu" as keyof Metrics, name: "GPU", color: "var(--color-accent-gpu)", unit: "$" },
  { id: "efficiency" as keyof Metrics, name: "Efficiency", color: "var(--color-accent-efficiency)", unit: "$" },
];

interface MetricsBarProps {
  metrics: Metrics;
  compact?: boolean;
}



const MetricsBar: FC<MetricsBarProps> = ({ metrics, compact = false }) => {

  

  const totalValue = Object.values(metrics).reduce((sum, value) => sum + value, 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col ${compact ? "gap-1.5" : "gap-2.5"}`}>
      {!compact &&
        METRICS_CONFIG.map((metric, index) => {
          const value = metrics[metric.id];
          const percentage =
            totalValue > 0 ? (value / totalValue) * 100 : 0;

          const barVariants = {
            hidden: { width: "0%" },
            visible: {
              width: `${percentage}%`,
              transition: {
                delay: index * 0.05,
                duration: 0.5,
                ease: "easeOut",
              },
            },
          };

          return (
            <div key={metric.id} className="flex items-center gap-2">

              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: metric.color }}
              />

              <span className="text-[11px] text-(--color-text-muted) w-14.5 shrink-0">
                {metric.name}
              </span>

              <div className="flex-1 h-1 rounded-full bg-(--color-bg-inset) overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: metric.color,
                  }}
                  variants={{barVariants}}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                />
              </div>

              <span className="text-[11px] text-(--color-text-secondary) w-11 text-right">
                {metric.unit}{value.toFixed(0)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default MetricsBar;