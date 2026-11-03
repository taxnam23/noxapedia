"use client";

import {
  Activity,
  AlertTriangle,
  Brain,
  Droplets,
  FlaskConical,
  HeartPulse,
  Wind,
} from "lucide-react";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ALL_ORGANS,
  CATEGORY_LABELS,
  ORGAN_LABELS,
  SEVERITY_LABELS,
} from "@/lib/catalog-utils";
import type {
  OrganId,
  ReadingMode,
  SeverityLevel,
  Substance,
} from "@/lib/schemas/substance";
import { cn } from "@/lib/utils";

export const ORGAN_ICONS: Record<
  OrganId,
  React.ComponentType<{ className?: string }>
> = {
  brain: Brain,
  heart: HeartPulse,
  lungs: Wind,
  liver: FlaskConical,
  kidneys: Droplets,
};

const SEVERITY_DOT_COLORS: Record<SeverityLevel, string> = {
  low: "bg-emerald-400",
  moderate: "bg-amber-400",
  high: "bg-orange-400",
  critical: "bg-rose-500 shadow-sm shadow-rose-500/60",
};

interface SubstanceCardProps {
  substance: Substance;
  readingMode: ReadingMode;
  activeOrgan: OrganId | "all";
  onSelectOrgan?: (organ: OrganId) => void;
}

export function SubstanceCard({
  substance,
  readingMode,
  activeOrgan,
  onSelectOrgan,
}: SubstanceCardProps) {
  const focusedOrganImpact =
    activeOrgan !== "all" ? substance.organImpacts[activeOrgan] : undefined;

  return (
    <Card className="group relative flex flex-col justify-between border-slate-800/90 bg-slate-950/75 hover:border-cyan-500/45 transition-all duration-200 overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-rose-500 opacity-75 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="default">
            {CATEGORY_LABELS[substance.category].label}
          </Badge>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="rounded border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-cyan-300">
              {substance.formula}
            </span>
            <span className="hidden sm:inline text-slate-500">
              CAS {substance.casNumber}
            </span>
          </div>
        </div>

        <div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-50 group-hover:text-cyan-300 transition-colors">
            {substance.name}
          </CardTitle>
          <CardDescription className="font-mono text-xs text-cyan-400/90 mt-0.5">
            {substance.chemicalName} • {substance.molecularWeight}
          </CardDescription>
        </div>

        {substance.aliases.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Alias:
            </span>
            {substance.aliases.slice(0, 4).map((alias) => (
              <span
                key={alias}
                className="rounded bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 text-[11px] text-slate-300"
              >
                {alias}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-5">
        {/* Summary in selected reading mode */}
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            {substance.summary[readingMode]}
          </p>

          {/* Highlighted Organ Telemetry Callout when an organ filter is active */}
          {activeOrgan !== "all" && focusedOrganImpact && (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    Impacto en {ORGAN_LABELS[activeOrgan].name}:{" "}
                    {SEVERITY_LABELS[focusedOrganImpact.overallSeverity]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {focusedOrganImpact.simulatedBpm && (
                    <Badge variant="critical" className="text-[10px] py-0">
                      {focusedOrganImpact.simulatedBpm} BPM
                    </Badge>
                  )}
                  {focusedOrganImpact.simulatedRpm && (
                    <Badge variant="high" className="text-[10px] py-0">
                      {focusedOrganImpact.simulatedRpm} RPM
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs font-medium text-slate-100">
                {focusedOrganImpact.headline}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {focusedOrganImpact.explanation[readingMode]}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          {/* Affected Organs Interactive Row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <span>Órganos Afectados (3D)</span>
              <span>Severidad</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {ALL_ORGANS.map((organId) => {
                const impact = substance.organImpacts[organId];
                const Icon = ORGAN_ICONS[organId];
                const isSelected = activeOrgan === organId;

                if (!impact) {
                  return (
                    <div
                      key={organId}
                      className="flex flex-col items-center justify-center rounded-lg border border-slate-900 bg-slate-950/40 p-2 opacity-35"
                    >
                      <Icon className="h-4 w-4 text-slate-600" />
                      <span className="mt-1 text-[10px] text-slate-600">
                        {ORGAN_LABELS[organId].name}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={organId}
                    type="button"
                    onClick={() => onSelectOrgan?.(organId)}
                    title={`${ORGAN_LABELS[organId].name}: ${impact.headline}`}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border p-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-sm shadow-cyan-500/20"
                        : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    )}
                  >
                    <div className="relative">
                      <Icon className="h-4 w-4" />
                      <span
                        className={cn(
                          "absolute -right-1.5 -top-1 h-2 w-2 rounded-full",
                          SEVERITY_DOT_COLORS[impact.overallSeverity]
                        )}
                      />
                    </div>
                    <span className="mt-1 text-[10px] font-medium">
                      {ORGAN_LABELS[organId].name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Risk Metrics Bars */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Potencial Adictivo</span>
                <span className="text-rose-400 font-semibold">
                  {substance.riskMetrics.addictionPotential}/10
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                  style={{
                    width: `${substance.riskMetrics.addictionPotential * 10}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Daño Físico</span>
                <span className="text-orange-400 font-semibold">
                  {substance.riskMetrics.physicalHarm}/10
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-orange-500"
                  style={{
                    width: `${substance.riskMetrics.physicalHarm * 10}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Neurotransmitters & Street Adulterants Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1">
              {substance.neurotransmitters.map((nt) => (
                <Badge
                  key={nt.id}
                  variant="secondary"
                  className="font-mono text-[10px]"
                >
                  {nt.name}{" "}
                  <span className="text-cyan-400">
                    {nt.changePercent > 0
                      ? `+${nt.changePercent}%`
                      : `${nt.changePercent}%`}
                  </span>
                </Badge>
              ))}
            </div>

            {substance.commonAdulterants.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Corte:{" "}
                  {substance.commonAdulterants
                    .slice(0, 2)
                    .map((a) => a.name.split(" ")[0])
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

