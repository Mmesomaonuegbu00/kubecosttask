"use client";

import React, { FC } from "react";
import { Workflow } from "../hooks/useClusterData";
import MetricsBar from "./MetricsBar";

interface WorkflowCardProps {
  workflow: Workflow;
  index: number;
}

const WorkflowCard: FC<WorkflowCardProps> = ({ workflow, index }) => {
  const total = Object.values(workflow.metrics).reduce((s, v) => s + v, 0);

  return (
    <div
      className="workflow-card rounded-md border bg-(--color-bg-inset) border-(--color-border) p-4 transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: "var(--color-accent-primary)" }}
          />
          <span className="text-[14px] font-semibold text-(--color-text-primary) truncate">
            {workflow.name}
          </span>
        </div>
        <span className="text-[13px] font-bold text-(--color-accent-primary) font-[var(--font-geist-mono)] flex-shrink-0 ml-2">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="mb-3">
        <MetricsBar metrics={workflow.metrics} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">CPU:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">${workflow.metrics.cpu.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">RAM:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">${workflow.metrics.ram.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">Storage:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">${workflow.metrics.storage.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">Network:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">${workflow.metrics.network.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">GPU:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">${workflow.metrics.gpu.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-text-muted)">Efficiency:</span>
          <span className="font-[var(--font-geist-mono)] text-(--color-text-primary)">{workflow.metrics.efficiency.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;