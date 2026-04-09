"use client";

import React, { useState } from "react";
import { useClusterData } from "../hooks/useClusterData";
import KpiBar from "./KpiBar";
import ClusterCard from "./ClusterCard";
import NamespaceCard from "./NamespaceCard";
import WorkflowCard from "./WorkflowCard";
import SavingsInsights from "./SavingsInsights";
import SpendChart from "./SpendChart";

const SkeletonCard = ({ index }: { index: number }) => (
  <div
    className="rounded-lg bg-(--color-bg-card) border border-(--color-border) p-5 animate-[fadeIn_300ms_ease]"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {[80, 50, 100, 60].map((w, i) => (
      <div
        key={i}
        className="rounded-[var(--radius-sm)] mb-3 animate-[shimmer_1.5s_infinite]"
        style={{
          height: i === 0 ? "20px" : "12px",
          width: `${w}%`,
          background:
            "linear-gradient(90deg, var(--color-bg-inset) 25%, var(--color-bg-secondary) 50%, var(--color-bg-inset) 75%)",
          backgroundSize: "200% 100%",
          animationDelay: `${i * 200}ms`,
        }}
      />
    ))}
  </div>
);


const Dashboard = () => {
  const { clusters, kpi, loading, error } = useClusterData();
  const [timeRange, setTimeRange] = useState("month");
  const [view, setView] = useState<'clusters' | 'namespaces' | 'workflows'>('clusters');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);

  const handleClusterClick = (clusterName: string) => {
    setSelectedCluster(clusterName);
    setView('namespaces');
    setSelectedNamespace(null);
  };

  const handleNamespaceClick = (namespaceName: string) => {
    setSelectedNamespace(namespaceName);
    setView('workflows');
  };

  const handleBack = () => {
    if (view === 'workflows') {
      setView('namespaces');
      setSelectedNamespace(null);
    } else if (view === 'namespaces') {
      setView('clusters');
      setSelectedCluster(null);
    }
  };

  const currentCluster = clusters.find(c => c.name === selectedCluster);
  const currentNamespace = currentCluster?.namespaces.find(n => n.name === selectedNamespace);

  return (
    <div className="min-h-screen bg-(--color-bg-primary)">
      <main className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] py-7 pb-16">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {(view === 'namespaces' || view === 'workflows') && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg-card-hover) transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 8H4M4 8L7 5M4 8L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            )}
            <div>
              <h2 className="m-0 text-[24px] font-bold text-(--color-text-primary) tracking-[-0.02em]">
                {view === 'clusters' && 'Kube Cost Overview'}
                {view === 'namespaces' && `${selectedCluster} - Namespaces`}
                {view === 'workflows' && `${selectedNamespace} - Workflows`}
              </h2>
              <p className="mt-1 text-[13px] text-(--color-text-muted)">
                {view === 'clusters' && 'Real-time cost visibility across all Kubernetes clusters'}
                {view === 'namespaces' && 'Cost breakdown by namespace'}
                {view === 'workflows' && 'Detailed workload cost analysis'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 mb-7 grid-cols-[repeat(auto-fit,minmax(clamp(160px,20vw,220px),1fr))]">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : kpi && view === 'clusters' ? (
          <KpiBar kpi={kpi} />
        ) : null}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-2 px-5 py-4 rounded-lg
                       bg-(--color-accent-error-alpha)
                       border border-[rgba(239,68,68,0.2)]
                       text-(--color-accent-error) text-[13px]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 5V8M8 11H8.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="grid gap-4 items-start grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <section>
            {view === 'clusters' && (
              <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(clamp(280px,40%,480px),1fr))]">
                {loading
                  ? [0, 1, 2, 3].map((i) => (
                      <SkeletonCard key={i} index={i} />
                    ))
                  : clusters.map((cluster, i) => (
                      <ClusterCard
                        key={cluster.name}
                        cluster={cluster}
                        index={i}
                        onClick={() => handleClusterClick(cluster.name)}
                      />
                    ))}
              </div>
            )}

            {view === 'namespaces' && currentCluster && (
              <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(clamp(280px,40%,480px),1fr))]">
                {currentCluster.namespaces.slice(0, 4).map((namespace, i) => (
                  <NamespaceCard
                    key={namespace.name}
                    namespace={namespace}
                    index={i}
                    onClick={() => handleNamespaceClick(namespace.name)}
                  />
                ))}
              </div>
            )}

            {view === 'workflows' && currentNamespace && (
              <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(clamp(280px,40%,480px),1fr))]">
                {currentNamespace.workflows.slice(0, 4).map((workflow, i) => (
                  <WorkflowCard
                    key={workflow.name}
                    workflow={workflow}
                    index={i}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-3">
            {loading ? (
              <>
                <SkeletonCard index={4} />
                <SkeletonCard index={5} />
              </>
            ) : view === 'clusters' ? (
              <>
                <SpendChart clusters={clusters} />
                <SavingsInsights clusters={clusters} />
              </>
            ) : view === 'namespaces' && currentCluster ? (
              <>
                <SpendChart clusters={[currentCluster]} />
                <SavingsInsights clusters={[currentCluster]} />
              </>
            ) : view === 'workflows' && currentCluster ? (
              <>
                <SpendChart clusters={[currentCluster]} />
                <SavingsInsights clusters={[currentCluster]} />
              </>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;