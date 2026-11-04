import type * as React from "react";
import { cn } from "@/lib/utils";

interface NoxapediaIconProps extends React.SVGProps<SVGSVGElement> {
  withContainer?: boolean;
}

/**
 * Minimalist geometric vector icon for Noxapedia:
 * Combines a hexagonal molecular ring (alkaloid/benzene lattice) with
 * an internal "N" shaped as a synaptic/ECG pulse between a cyan neurotransmitter
 * node and a crimson toxicity ("noxa") receptor node.
 */
export function NoxapediaIcon({
  className,
  withContainer = true,
  ...props
}: NoxapediaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("h-9 w-9 shrink-0", className)}
      {...props}
    >
      {withContainer && (
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="#070B14"
          stroke="#1E293B"
          strokeWidth="2"
        />
      )}

      {/* Outer Molecular Hexagon Ring */}
      <path
        d="M32 9L52 20.5V43.5L32 55L12 43.5V20.5L32 9Z"
        stroke="#06B6D4"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />

      {/* Inner Molecular Double-Bond Accents */}
      <path
        d="M32 14.5L47 23.2"
        stroke="#22D3EE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path
        d="M17 40.8L32 49.5"
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />

      {/* Central Geometric "N" + Synaptic / ECG Telemetry Trace */}
      <path
        d="M22 42V22L30 33L34 29L42 42V22"
        stroke="#F8FAFC"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Synaptic & Receptor Nodes */}
      <circle cx="22" cy="22" r="3.5" fill="#22D3EE" />
      <circle cx="22" cy="42" r="2.5" fill="#94A3B8" />
      <circle cx="42" cy="22" r="2.5" fill="#94A3B8" />
      <circle cx="42" cy="42" r="3.5" fill="#F43F5E" />
    </svg>
  );
}

interface NoxapediaLogoProps {
  subtitle?: string;
  versionBadge?: string;
  className?: string;
}

/**
 * Complete horizontal brand lockup (Geometric Icon + NOXAPEDIA wordmark + subtitle).
 */
export function NoxapediaLogo({
  subtitle = "Atlas Neurobiológico & Simulador 3D de Sustancias Adictivas",
  versionBadge = "v0.1 ALPHA",
  className,
}: NoxapediaLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <NoxapediaIcon className="h-10 w-10 shadow-sm shadow-cyan-500/15" />
      <div>
        <div className="flex items-center gap-2">
          <span
            translate="no"
            className="notranslate font-mono text-lg font-bold tracking-wider text-slate-100"
          >
            NOXA<span className="text-cyan-400">PEDIA</span>
          </span>
          {versionBadge && (
            <span
              translate="no"
              className="notranslate inline-flex items-center rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300"
            >
              {versionBadge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

