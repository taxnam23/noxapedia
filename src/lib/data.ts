import fs from "node:fs";
import path from "node:path";
import {
  type OrganId,
  type SeverityLevel,
  type Substance,
  type SubstanceCategory,
  SubstanceSchema,
} from "@/lib/schemas/substance";

const SUBSTANCES_DIR = path.join(process.cwd(), "data", "substances");

/**
 * Human-readable category metadata in Spanish for UI badges and filters.
 */
export const CATEGORY_LABELS: Record<
  SubstanceCategory,
  { label: string; description: string }
> = {
  stimulant: {
    label: "Estimulante del SNC",
    description:
      "Incrementa la actividad catecolaminérgica (dopamina y noradrenalina), la frecuencia cardíaca y el estado de alerta.",
  },
  opioid: {
    label: "Opioide",
    description:
      "Agonista de receptores opioides (μ, κ, δ); produce analgesia profunda, euforia y depresión respiratoria dosis-dependiente.",
  },
  depressant: {
    label: "Depresor del SNC",
    description:
      "Potencia la transmisión inhibitoria (GABA) o reduce la excitatoria (Glutamato), disminuyendo la actividad neuronal central.",
  },
  cannabinoid: {
    label: "Cannabinoide",
    description:
      "Modulador de los receptores endocannabinoides CB1 y CB2 en el sistema nervioso central e inmunitario.",
  },
  empathogen: {
    label: "Empatógeno / Entactógeno",
    description:
      "Induce liberación masiva de serotonina, dopamina y noradrenalina con riesgo de hipertermia y agotamiento monoaminérgico.",
  },
  psychedelic: {
    label: "Psicodélico Serotoninérgico",
    description:
      "Agonista parcial de receptores 5-HT2A corticales que altera profundamente la percepción sensorial y la conectividad cerebral.",
  },
  dissociative: {
    label: "Anestésico Disociativo",
    description:
      "Antagonista de los receptores NMDA de glutamato que desconecta la percepción sensorial e induce analgesia disociativa.",
  },
};

/**
 * Human-readable organ metadata in Spanish for the 3D Simulator and filters.
 */
export const ORGAN_LABELS: Record<
  OrganId,
  { name: string; system: string }
> = {
  brain: {
    name: "Cerebro",
    system: "Sistema Nervioso Central",
  },
  heart: {
    name: "Corazón",
    system: "Sistema Cardiovascular",
  },
  lungs: {
    name: "Pulmones",
    system: "Sistema Respiratorio",
  },
  liver: {
    name: "Hígado",
    system: "Sistema Hepatobiliar y Metabólico",
  },
  kidneys: {
    name: "Riñones",
    system: "Sistema Renal y Excretor",
  },
};

/**
 * Severity rank for sorting organs or substances by impact intensity.
 */
export const SEVERITY_RANK: Record<SeverityLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

/**
 * Reads, parses, and strictly validates all `/data/substances/*.json` files
 * using `SubstanceSchema`. Throws descriptive build-time errors if any file
 * violates the schema so GitHub contributors get immediate feedback.
 */
export function getAllSubstances(): Substance[] {
  if (!fs.existsSync(SUBSTANCES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(SUBSTANCES_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  const substances: Substance[] = [];

  for (const fileName of files) {
    const fullPath = path.join(SUBSTANCES_DIR, fileName);
    const rawContent = fs.readFileSync(fullPath, "utf-8");

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawContent);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `[Noxapedia Data Error] Invalid JSON syntax in "/data/substances/${fileName}": ${message}`
      );
    }

    const validation = SubstanceSchema.safeParse(parsedJson);
    if (!validation.success) {
      const formattedIssues = validation.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `[Noxapedia Schema Validation Error] File "/data/substances/${fileName}" failed Zod validation:\n${formattedIssues}`
      );
    }

    substances.push(validation.data);
  }

  return substances.sort(
    (a, b) => b.riskMetrics.addictionPotential - a.riskMetrics.addictionPotential
  );
}

/**
 * Returns all substance slugs for Next.js `generateStaticParams()`.
 */
export function getAllSubstanceSlugs(): string[] {
  return getAllSubstances().map((substance) => substance.slug);
}

/**
 * Finds a single validated substance by its URL slug (e.g. "cocaina").
 */
export function getSubstanceBySlug(slug: string): Substance | undefined {
  return getAllSubstances().find((substance) => substance.slug === slug);
}

/**
 * Filters substances by pharmacological category.
 */
export function getSubstancesByCategory(
  category: SubstanceCategory
): Substance[] {
  return getAllSubstances().filter(
    (substance) => substance.category === category
  );
}

/**
 * Filters substances that impact a specific 3D organ, ordered by severity on that organ.
 */
export function getSubstancesByOrgan(organ: OrganId): Substance[] {
  return getAllSubstances()
    .filter((substance) => Boolean(substance.organImpacts[organ]))
    .sort((a, b) => {
      const sevA = a.organImpacts[organ]?.overallSeverity ?? "low";
      const sevB = b.organImpacts[organ]?.overallSeverity ?? "low";
      return SEVERITY_RANK[sevB] - SEVERITY_RANK[sevA];
    });
}

/**
 * Instant search and filter utility over a list of substances.
 */
export function filterSubstances(
  substances: Substance[],
  options: {
    query?: string;
    category?: SubstanceCategory | "all";
    organ?: OrganId | "all";
  }
): Substance[] {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? "";
  const category = options.category ?? "all";
  const organ = options.organ ?? "all";

  return substances.filter((substance) => {
    if (category !== "all" && substance.category !== category) {
      return false;
    }

    if (organ !== "all" && !substance.organImpacts[organ]) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableFields: string[] = [
      substance.name,
      substance.chemicalName,
      substance.formula,
      ...substance.aliases,
      CATEGORY_LABELS[substance.category].label,
      substance.summary.general,
      substance.summary.technical,
      ...substance.neurotransmitters.map((nt) => nt.name),
      ...substance.commonAdulterants.map((ad) => ad.name),
    ];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(normalizedQuery)
    );
  });
}

