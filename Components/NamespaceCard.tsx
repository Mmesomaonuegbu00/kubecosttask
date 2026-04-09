"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Namespace } from "../hooks/useClusterData";
import MetricsBar from "./MetricsBar";

interface NamespaceCardProps {
  namespace: Namespace;
  index: number;
  onClick: () => void;
}

const NamespaceCard: FC<NamespaceCardProps> = ({ namespace, index, onClick }) => {
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

  const total = Object.values(namespace.metrics).reduce((s, v) => s + v, 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="namespace-card flex-col flex gap-10"
      variants={cardVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      onClick={onClick}
    >
      <div className="p-5 pb-0 bg-(--color-bg-primary) border border-(--color-border) overflow-hidden transition-all duration-500 ease-out cursor-pointer min-h-20 ">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div>
              <h2 className="m-0 text-[15px] font-semibold text-(--color-text-primary) tracking-[-0.01em]">
                {namespace.name}
              </h2>
              <span className="text-[11px] text-(--color-text-muted) font-(--font-geist-sans)">
                {namespace.workflows.length} workflow{namespace.workflows.length !== 1 ? "s" : ""} · Namespace
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[22px] font-bold text-(--color-text-primary) leading-none tracking-[-0.02em]">
              ${total.toFixed(0)}
            </div>
            <div className="text-[10px] text-(--color-text-muted) mt-0.5">
              monthly spend
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 p-5 pb-0 bg-(--color-bg-card) min-h-70">
        <div className="text-[10px] text-(--color-text-muted) uppercase tracking-[0.08em] mb-2 font-(--font-geist-sans)">
          Resource Allocation
        </div>
        <MetricsBar metrics={namespace.metrics} />
      </div>
    </motion.div>
  );
};

export default NamespaceCard;