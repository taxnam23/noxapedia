"use client";

import * as React from "react";
import {
  type DualModeText,
  type ReadingMode,
  ReadingModeSchema,
} from "@/lib/schemas/substance";

export const READING_MODE_STORAGE_KEY = "noxapedia:reading-mode";

export interface ReadingModeMetadata {
  id: ReadingMode;
  label: string;
  shortLabel: string;
  badge: string;
  tagline: string;
  description: string;
  focusPills: string[];
}

export const READING_MODE_META: Record<ReadingMode, ReadingModeMetadata> = {
  general: {
    id: "general",
    label: "Modo General",
    shortLabel: "General",
    badge: "Divulgación Adulta",
    tagline: "Fisiología clara, directa y rigurosa para todo público",
    description:
      "Explica con claridad qué hace cada sustancia en las neuronas, vasos sanguíneos y órganos vitales, por qué genera tolerancia y abstinencia, sin recurrir a metáforas infantiles.",
    focusPills: [
      "Neurobiología comprensible",
      "Impacto en órganos reales",
      "Por qué causa adicción",
      "Señales de alerta clínica",
    ],
  },
  technical: {
    id: "technical",
    label: "Modo Técnico",
    shortLabel: "Técnico",
    badge: "Farmacología & Clínica",
    tagline: "Bioquímica, receptores, vías CYP450 y farmacocinética (t½)",
    description:
      "Incluye dianas moleculares exactas (DAT/NET/SERT, MOR, GABA-A, NMDA), vida media plasmática (t½), biodisponibilidad, biotransformación hepática y metabolitos activos o cardiotóxicos.",
    focusPills: [
      "Afinidad por receptores",
      "Farmacocinética (t½)",
      "Metabolismo CYP450",
      "Fisiopatología celular",
    ],
  },
};

interface ReadingModeContextValue {
  /** Current active reading level ("general" | "technical") */
  readingMode: ReadingMode;
  /** Convenience boolean true when readingMode === "technical" */
  isTechnical: boolean;
  /** True once client localStorage hydration has completed */
  isHydrated: boolean;
  /** Metadata for the currently active reading mode */
  modeMeta: ReadingModeMetadata;
  /** Set a specific reading mode and persist it in localStorage */
  setReadingMode: (mode: ReadingMode) => void;
  /** Toggle between "general" and "technical" */
  toggleReadingMode: () => void;
  /** Helper that returns the string corresponding to the active reading mode */
  resolveText: (dualText: DualModeText) => string;
}

const ReadingModeContext = React.createContext<
  ReadingModeContextValue | undefined
>(undefined);

interface ReadingModeProviderProps {
  children: React.ReactNode;
  defaultMode?: ReadingMode;
}

export function ReadingModeProvider({
  children,
  defaultMode = "general",
}: ReadingModeProviderProps) {
  const [readingMode, setReadingModeState] =
    React.useState<ReadingMode>(defaultMode);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Hydrate persisted mode from localStorage on client mount
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(READING_MODE_STORAGE_KEY);
      if (stored) {
        const parsed = ReadingModeSchema.safeParse(stored);
        if (parsed.success) {
          setReadingModeState(parsed.data);
        }
      }
    } catch {
      // Ignore storage access errors in restricted environments
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Synchronize HTML attribute & localStorage whenever readingMode changes after hydration
  React.useEffect(() => {
    document.documentElement.setAttribute("data-reading-mode", readingMode);
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(READING_MODE_STORAGE_KEY, readingMode);
    } catch {
      // Ignore storage write errors
    }
  }, [readingMode, isHydrated]);

  // Listen for cross-tab storage updates + global Alt+M keyboard shortcut
  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === READING_MODE_STORAGE_KEY && event.newValue) {
        const parsed = ReadingModeSchema.safeParse(event.newValue);
        if (parsed.success) {
          setReadingModeState(parsed.data);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        (event.key === "m" || event.key === "M") &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        setReadingModeState((prev) =>
          prev === "general" ? "technical" : "general"
        );
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const setReadingMode = React.useCallback((mode: ReadingMode) => {
    setReadingModeState(mode);
  }, []);

  const toggleReadingMode = React.useCallback(() => {
    setReadingModeState((prev) =>
      prev === "general" ? "technical" : "general"
    );
  }, []);

  const resolveText = React.useCallback(
    (dualText: DualModeText) => dualText[readingMode],
    [readingMode]
  );

  const contextValue = React.useMemo<ReadingModeContextValue>(
    () => ({
      readingMode,
      isTechnical: readingMode === "technical",
      isHydrated,
      modeMeta: READING_MODE_META[readingMode],
      setReadingMode,
      toggleReadingMode,
      resolveText,
    }),
    [readingMode, isHydrated, setReadingMode, toggleReadingMode, resolveText]
  );

  return (
    <ReadingModeContext.Provider value={contextValue}>
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode(): ReadingModeContextValue {
  const context = React.useContext(ReadingModeContext);
  if (!context) {
    throw new Error(
      "useReadingMode must be used within a ReadingModeProvider"
    );
  }
  return context;
}

