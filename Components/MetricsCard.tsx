"use client";

import React, { FC } from "react";

interface Metrics {
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
}

interface MetricsCardProps {
  metrics: Metrics;
}

const MetricsCard: FC<MetricsCardProps> = ({ metrics }) => {
  return (
    <div className="border border-(--color-border) rounded-md p-3 bg-(--color-bg-card) m-1">
      <h4 className="text-sm font-semibold text-(--color-text-primary) mb-2">
        Metrics
      </h4>

      <div className="text-[12px] text-(--color-text-secondary) space-y-1 font-[var(--font-geist-mono)]">
        <p>CPU: {metrics.cpu}</p>
        <p>RAM: {metrics.ram}</p>
        <p>Storage: {metrics.storage}</p>
        <p>Network: {metrics.network}</p>
        <p>GPU: {metrics.gpu}</p>
        <p>Efficiency: {metrics.efficiency}</p>
      </div>
    </div>
  );
};

export default MetricsCard;