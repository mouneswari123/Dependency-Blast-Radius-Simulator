"use client";

import React from "react";
import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

function DependencyGraph({
  services,
  dependencies,
}) {
  const nodes = services.map(
  (service, index) => ({
    id: service.id,
    position: {
      x: index * 250,
      y: 100,
    },

    data: {
      label:
        service.name,
    },

    style: {
      background:
        service.status ===
        "HEALTHY"
          ? "#16a34a"
          : service.status ===
            "DEGRADED"
          ? "#f59e0b"
          : "#dc2626",

      color: "white",
      borderRadius: "12px",
      padding: "12px",
      border:
        "2px solid white",
      fontWeight: "bold",
      width: 180,
      textAlign: "center",
    },
  })
);

  const edges =
  dependencies.map(
    (dependency) => ({
      id:
        dependency.id,

      source:
        dependency
          .sourceServiceId,

      target:
        dependency
          .targetServiceId,

      animated: true,

      style: {
        stroke:
          "#38bdf8",
        strokeWidth: 3,
      },
    })
  );
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        background:
          "#0f172a",
        borderRadius:
          "20px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default DependencyGraph;