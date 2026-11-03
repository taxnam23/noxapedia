"use client";

import {
  ArrowUpDown,
  Filter,
  Microscope,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ORGAN_ICONS,
  SubstanceCard,
} from "@/components/wiki/substance-card";
import {
  ALL_CATEGORIES,
  ALL_ORGANS,
  CATEGORY_LABELS,
  filterSubstances,
  ORGAN_LABELS,
  type SortCriterion,
} from "@/lib/catalog-utils";
import type {
  OrganId,
  ReadingMode,
  Substance,
  SubstanceCategory,
} from "@/lib/schemas/substance";
import { cn } from "@/lib/utils";

interface SubstanceExplorerProps {
  substances: Substance[];
  defaultReadingMode?: ReadingMode;
}

const QUICK_SEARCH_SUGGESTIONS = [
  "Cocaína",
  "Benzoilmetilecgonina",
  "Dopamina",
  "Corazón",
  "Levamisol",
  "Cocaetileno",
];

export function SubstanceExplorer({
  substances,
  defaultReadingMode = "general",
}: SubstanceExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<
    SubstanceCategory | "all"
  >("all");
  const [selectedOrgan, setSelectedOrgan] = React.useState<OrganId | "all">(
    "all"
  );
  const [sortBy, setSortBy] = React.useState<SortCriterion>("addiction");
  const [readingMode, setReadingMode] =
    React.useState<ReadingMode>(defaultReadingMode);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Support pressing "/" anywhere outside an input to focus the search bar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSubstances = React.useMemo(
    () =>
      filterSubstances(substances, {
        query,
        category: selectedCategory,
        organ: selectedOrgan,
        sortBy,
        readingMode,
      }),
    [substances, query, selectedCategory, selectedOrgan, sortBy, readingMode]
  );

  // Count how many substances belong to each category & organ
  const categoryCounts = React.useMemo(() => {
    const counts: Record<SubstanceCategory, number> = {
      stimulant: 0,
      opioid: 0,
      depressant: 0,
      cannabinoid: 0,
      empathogen: 0,
      psychedelic: 0,
      dissociative: 0,
    };
    for (const s of substances) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, [substances]);

  const organCounts = React.useMemo(() => {
    const counts: Record<OrganId, number> = {
      brain: 0,
      heart: 0,
      lungs: 0,
      liver: 0,
      kidneys: 0,
    };
    for (const s of substances) {
      for (const organId of ALL_ORGANS) {
        if (s.organImpacts[organId]) {
          counts[organId] += 1;
        }
      }
    }
    return counts;
  }, [substances]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedOrgan !== "all";

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedOrgan("all");
    setSortBy("addiction");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Panel */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-950/85 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
        {/* Top Row: Instant Search Input + Reading Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre común, nombre químico (ej. Benzoilmetilecgonina), receptor (DAT), adulterante o síntoma..."
              className="h-12 pl-10 pr-20 text-sm sm:text-base bg-slate-900/90 border-slate-700/80"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-slate-700 bg-slate-900 px-2 font-mono text-[11px] text-slate-400">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Reading Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-mono text-slate-400 hidden xl:inline">
              Nivel de explicación:
            </span>
            <Tabs
              value={readingMode}
              onValueChange={(val) => setReadingMode(val as ReadingMode)}
            >
              <TabsList className="h-11">
                <TabsTrigger value="general" className="gap-1.5 px-3.5 py-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modo General
                </TabsTrigger>
                <TabsTrigger value="technical" className="gap-1.5 px-3.5 py-2">
                  <Microscope className="h-3.5 w-3.5" />
                  Modo Técnico
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-mono text-[11px] text-slate-500 mr-1">
            Búsquedas rápidas:
          </span>
          {QUICK_SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs transition-colors cursor-pointer",
                query.toLowerCase() === term.toLowerCase()
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Filter Row 1: Pharmacological Categories */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5 text-cyan-400" />
              Categoría Farmacológica
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                selectedCategory === "all"
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
            >
              <span>Todas</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-slate-300">
                {substances.length}
              </span>
            </button>

            {ALL_CATEGORIES.map((category) => {
              const count = categoryCounts[category];
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isSelected ? "all" : category)
                  }
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    isSelected
                      ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  )}
                >
                  <span>{CATEGORY_LABELS[category].shortLabel}</span>
                  <span className="rounded-full bg-slate-800/90 px-1.5 py-0.2 font-mono text-[10px] text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Row 2: Affected Organ Filter + Sort Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="space-y-2">
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              Filtrar por Órgano Afectado (Simulador 3D)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrgan("all")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                  selectedOrgan === "all"
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-200"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                )}
              >
                Todos los órganos
              </button>

              {ALL_ORGANS.map((organId) => {
                const Icon = ORGAN_ICONS[organId];
                const isSelected = selectedOrgan === organId;
                return (
                  <button
                    key={organId}
                    type="button"
                    onClick={() =>
                      setSelectedOrgan(isSelected ? "all" : organId)
                    }
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                      isSelected
                        ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200 shadow-sm shadow-cyan-500/15"
                        : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{ORGAN_LABELS[organId].name}</span>
                    <span className="rounded-full bg-slate-800 px-1.5 font-mono text-[10px] text-slate-400">
                      {organCounts[organId]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Control */}
          <div className="flex items-center gap-2 self-start lg:self-end">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <label
              htmlFor="sort-substances"
              className="text-xs font-mono text-slate-400"
            >
              Ordenar:
            </label>
            <select
              id="sort-substances"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortCriterion)}
              className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <option value="addiction">Mayor Potencial Adictivo</option>
              <option value="physicalHarm">Mayor Daño Físico</option>
              <option value="cardiotoxicity">Mayor Cardiotoxicidad</option>
              <option value="neurotoxicity">Mayor Neurotoxicidad</option>
              <option value="name">Orden Alfabético (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header & Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-100">
            Resultados del Atlas ({filteredSubstances.length}{" "}
            {filteredSubstances.length === 1 ? "sustancia" : "sustancias"})
          </h2>
          {selectedCategory !== "all" && (
            <Badge variant="default" className="gap-1">
              {CATEGORY_LABELS[selectedCategory].label}
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="ml-1 hover:text-white cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedOrgan !== "all" && (
            <Badge variant="critical" className="gap-1">
              Órgano: {ORGAN_LABELS[selectedOrgan].name}
              <button
                type="button"
                onClick={() => setSelectedOrgan("all")}
                className="ml-1 hover:text-white cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restablecer filtros
          </Button>
        )}
      </div>

      {/* Substance Cards Grid or Empty State */}
      {filteredSubstances.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubstances.map((substance) => (
            <SubstanceCard
              key={substance.id}
              substance={substance}
              readingMode={readingMode}
              activeOrgan={selectedOrgan}
              onSelectOrgan={(organId) =>
                setSelectedOrgan(selectedOrgan === organId ? "all" : organId)
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center space-y-3">
          <p className="text-base font-medium text-slate-200">
            No se encontraron sustancias que coincidan con los filtros actuales.
          </p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Prueba buscando otro nombre común, nombre químico, receptor o
            restablece los filtros de categoría y órgano.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-3.5 w-3.5" />
              Mostrar todo el catálogo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

