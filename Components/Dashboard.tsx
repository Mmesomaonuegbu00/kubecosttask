"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useClusterData } from "../hooks/useClusterData";
import KpiBar from "./KpiBar";
import ClusterCard from "./ClusterCard";
import NamespaceCard from "./NamespaceCard";
import WorkflowCard from "./WorkflowCard";

const SkeletonCard = ({ index }: { index: number }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    },
  };

  const shimmerVariants = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      className="rounded-lg bg-(--color-bg-card) border border-(--color-border) p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[80, 50, 100, 60].map((w, i) => (
        <motion.div
          key={i}
          className="rounded-sm mb-3"
          style={{
            height: i === 0 ? "20px" : "12px",
            width: `${w}%`,
            background:
              "linear-gradient(90deg, var(--color-bg-inset) 25%, var(--color-bg-secondary) 50%, var(--color-bg-inset) 75%)",
            backgroundSize: "200% 100%",
          }}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </motion.div>
  );
};

const Dashboard = () => {
  const { clusters, kpi, loading, error } = useClusterData();

  const [view, setView] = useState<
    "clusters" | "namespaces" | "workflows"
  >("clusters");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(
    null
  );

  const handleClusterClick = (clusterName: string) => {
    setSelectedCluster(clusterName);
    setView("namespaces");
    setSelectedNamespace(null);
  };

  const handleNamespaceClick = (namespaceName: string) => {
    setSelectedNamespace(namespaceName);
    setView("workflows");
  };

  const handleBack = () => {
    if (view === "workflows") {
      setView("namespaces");
      setSelectedNamespace(null);
    } else if (view === "namespaces") {
      setView("clusters");
      setSelectedCluster(null);
    }
  };

  const currentCluster = clusters.find((c) => c.name === selectedCluster);
  const currentNamespace = currentCluster?.namespaces.find(
    (n) => n.name === selectedNamespace
  );

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      
      <main className="w-full max-w-350 bg-(--color-bg-main) border border-(--color-border) rounded-xl shadow-lg px-[clamp(16px,4vw,40px)] py-7 pb-16">

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {(view === "namespaces" || view === "workflows") && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg-card-hover) transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 8H4M4 8L7 5M4 8L7 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
            )}

            <div className="flex items-center gap-2"> 
              <h2 className="text-[20px] font-bold text-(--color-text-primary)">
                {view === "clusters" && "Kube Cost Overview"}
                {view === "namespaces" &&
                  `${selectedCluster} - Namespaces`}
                {view === "workflows" &&
                  `${selectedNamespace} - Workflows`}
              </h2>

              <p className="text-[14px] text-(--color-text-muted) pt-1">
                {view === "clusters" &&
                  "Real-time cost visibility across all Kubernetes clusters"}
                {view === "namespaces" &&
                  "Cost breakdown by namespace"}
                {view === "workflows" &&
                  "Detailed workload cost analysis"}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 mb-7">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : kpi && view === "clusters" ? (
          <KpiBar kpi={kpi} />
        ) : null}

        {error && (
          <div className="mb-6 flex items-center gap-2 px-5 py-4 rounded-lg bg-(--color-accent-error-alpha) border border-[rgba(239,68,68,0.2)] text-(--color-accent-error) text-[13px]">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <section>
            {view === "clusters" && (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {loading
                  ? [0, 1, 2, 3].map((i) => (
                      <SkeletonCard key={i} index={i} />
                    ))
                  : clusters.map((cluster, i) => (
                      <ClusterCard
                        key={cluster.name}
                        cluster={cluster}
                        index={i}
                        onClick={() =>
                          handleClusterClick(cluster.name)
                        }
                      />
                    ))}
              </div>
            )}

            {view === "namespaces" && currentCluster && (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {currentCluster.namespaces
                  .slice(0, 4)
                  .map((namespace, i) => (
                    <NamespaceCard
                      key={namespace.name}
                      namespace={namespace}
                      index={i}
                      onClick={() =>
                        handleNamespaceClick(namespace.name)
                      }
                    />
                  ))}
              </div>
            )}

            {view === "workflows" && currentNamespace && (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {currentNamespace.workflows
                  .slice(0, 4)
                  .map((workflow, i) => (
                    <WorkflowCard
                      key={workflow.name}
                      workflow={workflow}
                      index={i}
                    />
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;