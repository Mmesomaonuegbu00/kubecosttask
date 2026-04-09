"use client";

import React, { FC, useState } from "react";
import { Namespace } from "../hooks/useClusterData";
import MetricsBar from "./MetricsBar";
import WorkflowCard from "./WorkflowCard";

interface NamespaceCardProps {
  namespace: Namespace;
  index: number;
  onClick: () => void;
}

const NamespaceCard: FC<NamespaceCardProps> = ({ namespace, index, onClick }) => {
  const total = Object.values(namespace.metrics).reduce((s, v) => s + v, 0);

  return (
    <div
      className="namespace-card rounded-md border border-(--color-border) bg-(--color-bg-secondary) overflow-hidden animate-[slideDown_200ms_ease] cursor-pointer hover:bg-(--color-bg-card-hover) transition-colors"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={onClick}
    >
      <div className="p-3.5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[9px] font-bold px-1.5 py-[2px] rounded-full bg-(--color-accent-primary-alpha) text-(--color-accent-primary) uppercase tracking-[0.06em] shrink-0">
            NS
          </span>

          <span className="flex-1 text-[15px] font-semibold text-(--color-text-primary) truncate">
            {namespace.name}
          </span>

          <span className="text-[14px] text-(--color-text-secondary) shrink-0 font-[var(--font-geist-mono)]">
            {namespace.workflows.length} workflows
          </span>

          <span className="text-[16px] font-bold text-(--color-text-primary) shrink-0 ml-3 font-[var(--font-geist-mono)]">
            ${total.toFixed(0)}
          </span>
        </div>

        <div className="mb-3">
          <div className="text-[10px] text-(--color-text-muted) uppercase tracking-[0.08em] mb-2 font-[var(--font-geist-sans)]">
            Resource Allocation
          </div>
          <MetricsBar metrics={namespace.metrics} />
        </div>
      </div>
    </div>
  );
};

export default NamespaceCard;