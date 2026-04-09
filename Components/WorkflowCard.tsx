"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Workflow } from "../hooks/useClusterData";
import MetricsBar from "./MetricsBar";

interface WorkflowCardProps {
  workflow: Workflow;
  index: number;
}

const WorkflowCard: FC<WorkflowCardProps> = ({ workflow, index }) => {
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

  const total = Object.values(workflow.metrics).reduce((s, v) => s + v, 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="workflow-card flex-col flex gap-10"
      variants={cardVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <div className="p-5 pb-0 bg-(--color-bg-primary) border border-(--color-border) overflow-hidden transition-all duration-500 ease-out ">
        <div className="flex flex-col md:flex-row items-start justify-between gap-3 mb-4 h-40 md:max-h-30 ">
          <div className="flex items-center gap-2.5">
            <div>
              <h2 className="m-0 text-[15px] font-semibold text-(--color-text-primary) tracking-[-0.01em]">
                {workflow.name}
              </h2>
              <span className="text-[11px] text-(--color-text-muted)  ">
                Workflow · Kubernetes
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[22px] font-bold text-(--color-text-primary) leading-none tracking-[-0.02em]">
              ${total.toFixed(2)}
            </div>
            <div className="text-[10px] text-(--color-text-muted) mt-0.5">
              monthly spend
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 p-5 pb-0 bg-(--color-bg-card) min-h-70">
        <div className="text-[10px] text-(--color-text-muted) uppercase tracking-[0.08em] mb-2  ">
          Resource Allocation
        </div>
        <MetricsBar metrics={workflow.metrics} />
      </div>
    </motion.div>
  );
};

export default WorkflowCard;