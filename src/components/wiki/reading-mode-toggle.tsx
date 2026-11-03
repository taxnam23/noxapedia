"use client";

import { BookOpen, Microscope, Sparkles } from "lucide-react";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  READING_MODE_META,
  useReadingMode,
} from "@/context/reading-mode-context";
import type { DualModeText, ReadingMode } from "@/lib/schemas/substance";
import { cn } from "@/lib/utils";

interface ReadingModeToggleProps {
  size?: "sm" | "default";
  showShortcutHint?: boolean;
  className?: string;
}

/**
 * Global segmented switch that updates the persistent ReadingModeContext.
 */
export function ReadingModeToggle({
  size = "default",
  showShortcutHint = false,
  className,
}: ReadingModeToggleProps) {
  const { readingMode, setReadingMode } = useReadingMode();

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Tabs
        value={readingMode}
        onValueChange={(value) => setReadingMode(value as ReadingMode)}
      >
        <TabsList
          className={cn(
            "border border-slate-800/90 bg-slate-900/95",
            size === "sm" ? "h-9 p-0.5" : "h-11 p-1"
          )}
        >
          <TabsTrigger
            value="general"
            title="Explicación fisiológica clara, directa y adulta"
            className={cn(
              "gap-1.5 font-medium transition-all",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-xs sm:text-sm"
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Modo General</span>
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            title="Bioquímica, receptores, vías CYP450 y farmacocinética (t½)"
            className={cn(
              "gap-1.5 font-medium transition-all",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-xs sm:text-sm"
            )}
          >
            <Microscope className="h-3.5 w-3.5 text-rose-400" />
            <span>Modo Técnico</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {showShortcutHint && (
        <kbd
          translate="no"
          title="Atajo de teclado para alternar el nivel de lectura"
          className="notranslate hidden xl:inline-flex h-6 items-center rounded border border-slate-800 bg-slate-900/90 px-2 font-mono text-[10px] text-slate-400"
        >
          Alt + M
        </kbd>
      )}
    </div>
  );
}

/**
 * Interactive banner that explains the active reading mode and shows what parameters are unlocked.
 */
export function ReadingModeBanner({ className }: { className?: string }) {
  const { readingMode, isTechnical, modeMeta, toggleReadingMode } =
    useReadingMode();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 sm:p-5 transition-colors duration-300",
        isTechnical
          ? "border-rose-500/35 bg-gradient-to-r from-rose-950/25 via-slate-950/90 to-cyan-950/25"
          : "border-cyan-500/30 bg-gradient-to-r from-cyan-950/25 via-slate-950/90 to-slate-900/60",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isTechnical ? "critical" : "default"}
              className="gap-1.5 font-mono text-[11px]"
            >
              {isTechnical ? (
                <Microscope className="h-3 w-3" />
              ) : (
                <BookOpen className="h-3 w-3" />
              )}
              {modeMeta.label}: {modeMeta.badge}
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              {modeMeta.tagline}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {modeMeta.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          {READING_MODE_META[readingMode].focusPills.map((pill) => (
            <span
              key={pill}
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-[11px]",
                isTechnical
                  ? "border-rose-500/30 bg-rose-950/30 text-rose-200"
                  : "border-cyan-500/25 bg-cyan-950/25 text-cyan-200"
              )}
            >
              {pill}
            </span>
          ))}
          <button
            type="button"
            onClick={toggleReadingMode}
            className="ml-1 rounded-md border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 font-mono text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            Cambiar a{" "}
            {isTechnical
              ? READING_MODE_META.general.label
              : READING_MODE_META.technical.label}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a DualModeText block reactive to the global ReadingModeContext.
 */
export function DualModeTextBlock({
  text,
  as: Component = "p",
  className,
}: {
  text: DualModeText;
  as?: React.ElementType;
  className?: string;
}) {
  const { resolveText } = useReadingMode();
  return <Component className={className}>{resolveText(text)}</Component>;
}

