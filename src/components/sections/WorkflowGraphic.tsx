"use client";

import { useInView, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  Database,
  Mail,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

const VIEWBOX_WIDTH = 520;
const VIEWBOX_HEIGHT = 344;
const NODE_WIDTH = 146;
const NODE_HEIGHT = 64;

type WorkflowNode = {
  id: string;
  label: string;
  icon: LucideIcon;
  x: number;
  y: number;
  enterDelay: number;
  pulseDelay: number;
};

const nodes: WorkflowNode[] = [
  {
    id: "lead",
    label: "New Lead",
    icon: User,
    x: 8,
    y: 140,
    enterDelay: 0.05,
    pulseDelay: 1.2,
  },
  {
    id: "qualify",
    label: "AI Qualify",
    icon: Sparkles,
    x: 180,
    y: 140,
    enterDelay: 0.13,
    pulseDelay: 1.6,
  },
  {
    id: "crm",
    label: "CRM Update",
    icon: Database,
    x: 352,
    y: 48,
    enterDelay: 0.21,
    pulseDelay: 2,
  },
  {
    id: "reply",
    label: "Instant Reply",
    icon: Mail,
    x: 180,
    y: 232,
    enterDelay: 0.29,
    pulseDelay: 2.2,
  },
  {
    id: "booked",
    label: "Booked Call",
    icon: CalendarCheck,
    x: 352,
    y: 232,
    enterDelay: 0.37,
    pulseDelay: 2.6,
  },
];

type WorkflowPath = {
  id: string;
  d: string;
  drawDelay: number;
  dotDuration: number;
  dotBegin: number;
};

const paths: WorkflowPath[] = [
  {
    id: "wf-edge-lead-qualify",
    d: "M 154 172 C 164 172, 170 172, 180 172",
    drawDelay: 0.15,
    dotDuration: 1.2,
    dotBegin: 1.2,
  },
  {
    id: "wf-edge-qualify-crm",
    d: "M 326 172 C 340 172, 338 80, 352 80",
    drawDelay: 0.4,
    dotDuration: 2.4,
    dotBegin: 1.55,
  },
  {
    id: "wf-edge-qualify-reply",
    d: "M 300 204 C 300 220, 274 232, 253 232",
    drawDelay: 0.4,
    dotDuration: 2,
    dotBegin: 1.55,
  },
  {
    id: "wf-edge-crm-booked",
    d: "M 425 112 C 433 160, 417 188, 425 232",
    drawDelay: 0.65,
    dotDuration: 2.4,
    dotBegin: 1.9,
  },
  {
    id: "wf-edge-reply-booked",
    d: "M 326 264 C 334 264, 344 264, 352 264",
    drawDelay: 0.65,
    dotDuration: 1.2,
    dotBegin: 1.9,
  },
];

export function WorkflowGraphic() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion() ?? false;
  const showDots = isInView && !reduceMotion;

  return (
    <figure
      ref={containerRef}
      role="img"
      aria-label="Animated diagram of an automation workflow from new lead to booked call"
      className={cn(
        "relative isolate w-full max-w-[540px] select-none",
        isInView && "wf-live",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-14%] -z-10"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139, 124, 199, 0.26), rgba(90, 59, 140, 0.14) 55%, transparent 78%)",
        }}
      />

      <div className="wf-float">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          className="wf-svg"
          aria-hidden
          focusable="false"
        >
          {paths.map((path) => (
            <path
              key={path.id}
              id={path.id}
              d={path.d}
              pathLength={1}
              fill="none"
              stroke="#8B7CC7"
              strokeOpacity={0.5}
              strokeWidth={1.5}
              strokeLinecap="round"
              className="wf-path"
              style={{ animationDelay: `${path.drawDelay}s` }}
            />
          ))}

          {nodes.map((node) => {
            const Icon = node.icon;

            return (
              <g
                key={node.id}
                className="wf-node"
                style={{ animationDelay: `${node.enterDelay}s` }}
              >
                <rect
                  className="wf-node-glow"
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={17}
                  fill="none"
                  stroke="#8B7CC7"
                  strokeOpacity={0.55}
                  strokeWidth={1.5}
                  style={{ animationDelay: `${node.pulseDelay}s` }}
                />
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={17}
                  fill="#2A1E4D"
                  fillOpacity={0.6}
                  stroke="#8B7CC7"
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
                <g
                  transform={`translate(${node.x + 16}, ${node.y + 24})`}
                  aria-hidden
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    color="#8B7CC7"
                    focusable="false"
                  />
                </g>
                <text
                  x={node.x + 42}
                  y={node.y + 32}
                  dominantBaseline="middle"
                  fill="#C9C2E3"
                  fontSize={13.5}
                  fontWeight={500}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {showDots ? (
            <g className="motion-reduce:hidden" aria-hidden>
              {paths.map((path) => (
                <g key={`dot-${path.id}`} opacity={0}>
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.01s"
                    begin={`${path.dotBegin}s`}
                    fill="freeze"
                  />
                  <animateMotion
                    dur={`${path.dotDuration}s`}
                    begin={`${path.dotBegin}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${path.id}`} />
                  </animateMotion>
                  <circle r={5.5} fill="#8B7CC7" opacity={0.25} />
                  <circle r={2.2} fill="#C9C2E3" />
                </g>
              ))}
            </g>
          ) : null}
        </svg>
      </div>

      <figcaption className="mt-3 text-center text-[0.7rem] tracking-wide text-lavender/70">
        Live workflow preview (demo)
      </figcaption>
    </figure>
  );
}
