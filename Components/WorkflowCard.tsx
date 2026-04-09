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
      className="workflow-card flex-col flex gap-10"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-5 pb-0 bg-(--color-bg-primary) border border-(--color-border) overflow-hidden transition-all duration-500 ease-out ">
        <div className="flex items-start justify-between gap-3 mb-4 h-20">
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
    </div>
  );
};

export default WorkflowCard;