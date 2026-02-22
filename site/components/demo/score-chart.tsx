"use client";

import React from "react";
import { motion } from "motion/react";
import type { IterationStep, CriteriaKey } from "@/lib/demo-data";

const CRITERIA_COLORS: Record<CriteriaKey, string> = {
  composition: "#06b6d4",
  typography: "#8b5cf6",
  color: "#f59e0b",
  identity: "#10b981",
  polish: "#f43f5e",
};

const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  composition: "Composition",
  typography: "Typography",
  color: "Color",
  identity: "Identity",
  polish: "Polish",
};

const CRITERIA_KEYS: CriteriaKey[] = [
  "composition",
  "typography",
  "color",
  "identity",
  "polish",
];

const AVG_COLOR = "#e5e5e5";

// Chart dimensions
const W = 480;
const H = 200;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

function xCoord(i: number, total: number): number {
  if (total <= 1) return PAD_L + PLOT_W / 2;
  return PAD_L + (i / (total - 1)) * PLOT_W;
}

function yCoord(score: number): number {
  return PAD_T + ((5 - score) / 4) * PLOT_H;
}

function buildPoints(
  iterations: IterationStep[],
  accessor: (step: IterationStep) => number
): string {
  return iterations
    .map((step, i) => `${xCoord(i, iterations.length)},${yCoord(accessor(step))}`)
    .join(" ");
}

export function ScoreChart({ iterations }: { iterations: IterationStep[] }) {
  const gridScores = [1, 2, 3, 4, 5];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width={W} height={H} fill="#111111" rx="8" />

        {/* Gridlines */}
        {gridScores.map((s) => {
          const y = yCoord(s);
          return (
            <g key={s}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#262626" strokeWidth="1" />
              <text x={PAD_L - 8} y={y + 4} textAnchor="end" fill="#737373" fontSize="10" fontFamily="monospace">
                {s}
              </text>
            </g>
          );
        })}

        {/* Criterion lines */}
        {CRITERIA_KEYS.map((key, ci) => {
          const points = buildPoints(iterations, (step) => step.scores[key]);
          const color = CRITERIA_COLORS[key];

          return (
            <g key={key}>
              {iterations.length > 1 && (
                <motion.polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    pathLength: { duration: 1.2, ease: "easeInOut", delay: ci * 0.15 },
                    opacity: { duration: 0.3, delay: ci * 0.15 },
                  }}
                />
              )}
              {iterations.map((step, i) => (
                <motion.circle
                  key={i}
                  cx={xCoord(i, iterations.length)}
                  cy={yCoord(step.scores[key])}
                  r="3"
                  fill={color}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: ci * 0.15 + (i / iterations.length) * 0.8,
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Average dashed line */}
        {(() => {
          const avgPoints = buildPoints(iterations, (step) => {
            const vals = CRITERIA_KEYS.map((k) => step.scores[k]);
            return vals.reduce((a, b) => a + b, 0) / vals.length;
          });
          return (
            iterations.length > 1 && (
              <motion.polyline
                points={avgPoints}
                fill="none"
                stroke={AVG_COLOR}
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{
                  pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.6 },
                  opacity: { duration: 0.3, delay: 0.6 },
                }}
              />
            )
          );
        })()}

        {/* X-axis labels */}
        {iterations.map((step, i) => (
          <text
            key={i}
            x={xCoord(i, iterations.length)}
            y={H - 8}
            textAnchor="middle"
            fill="#737373"
            fontSize="9"
            fontFamily="monospace"
          >
            {i === 0 ? "B" : `${i}`}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {CRITERIA_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="h-[3px] w-4 rounded-sm"
              style={{ background: CRITERIA_COLORS[key] }}
            />
            <span className="text-[10px] text-[#737373]">{CRITERIA_LABELS[key]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div
            className="h-[3px] w-4 rounded-sm"
            style={{
              background: `repeating-linear-gradient(90deg, ${AVG_COLOR} 0 4px, transparent 4px 7px)`,
            }}
          />
          <span className="text-[10px] text-[#737373]">Avg</span>
        </div>
      </div>
    </div>
  );
}
