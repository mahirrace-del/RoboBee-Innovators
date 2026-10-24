"use client";

import React from "react";
import { SnapLine } from "./types";

interface SnapGuidesOverlayProps {
  snapLines: SnapLine[];
}

export function SnapGuidesOverlay({ snapLines }: SnapGuidesOverlayProps) {
  if (!snapLines || snapLines.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {snapLines.map((line, idx) => {
        const isCenter =
          (line.orientation === "vertical" && Math.abs(line.position - 640) < 2) ||
          (line.orientation === "horizontal" && Math.abs(line.position - 360) < 2);

        const color = isCenter ? "#F5B700" : "#00F5D4";

        if (line.orientation === "vertical") {
          return (
            <div
              key={`vl-${idx}-${line.position}`}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${line.position}px`,
                width: "1px",
                borderLeft: `1px dashed ${color}`,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          );
        }

        return (
          <div
            key={`hl-${idx}-${line.position}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${line.position}px`,
              height: "1px",
              borderTop: `1px dashed ${color}`,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}
