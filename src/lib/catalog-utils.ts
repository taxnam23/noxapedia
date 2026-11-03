import type {
  OrganId,
  ReadingMode,
  SeverityLevel,
  Substance,
  SubstanceCategory,
} from "@/lib/schemas/substance";

/**
 * Human-readable category metadata in Spanish for UI badges and filters.
 */
export const CATEGORY_LABELS: Record<
  SubstanceCategory,
  { label: string; shortLabel: string; description: string }
> = {
  stimulant: {
    label: "Estimulante del SNC",
    shortLabel: "Estimulantes",
    description:
      "Incrementa la actividad catecolaminérgica (dopamina y noradrenalina), la frecuencia cardíaca y el estado de alerta.",
  },
  opioid: {
    label: "Opioide",
    shortLabel: "Opioides",
    description:
      "Agonista de receptores opioides (μ, κ, δ); produce analgesia profunda, euforia y depresión respiratoria dosis-dependiente.",
  },
  depressant: {
    label: "Depresor del SNC",
    shortLabel: "Depresores",
    description:
      "Potencia la transmisión inhibitoria (GABA) o reduce la excitatoria (Glutamato), disminuyendo la actividad neuronal central.",
  },
  cannabinoid: {
    label: "Cannabinoide",
    shortLabel: "Cannabinoides",
    description:
      "Modulador de los receptores endocannabinoides CB1 y CB2 en el sistema nervioso central e inmunitario.",
  },
  empathogen: {
    label: "Empatógeno / Entactógeno",
    shortLabel: "Empatógenos",
    description:
      "Induce liberación masiva de serotonina, dopamina y noradrenalina con riesgo de hipertermia y agotamiento monoaminérgico.",
  },
  psychedelic: {
    label: "Psicodélico Serotoninérgico",
    shortLabel: "Psicodélicos",
    description:
      "Agonista parcial de receptores 5-HT2A corticales que altera profundamente la percepción sensorial y la conectividad cerebral.",
  },
  dissociative: {
    label: "Anestésico Disociativo",
    shortLabel: "Disociativos",
    description:
      "Antagonista de los receptores NMDA de glutamato que desconecta la percepción sensorial e induce analgesia disociativa.",
  },
};

/**
 * Human-readable organ metadata in Spanish for the 3D Simulator and filters.
 */
export const ORGAN_LABELS: Record<
  OrganId,
  { name: string; system: string; keywords: string[] }
> = {
  brain: {
    name: "Cerebro",
    system: "Sistema Nervioso Central",
    keywords: [
      "cerebro",
      "neuronas",
      "sistema nervioso",
      "snc",
      "corteza",
      "accumbens",
      "tronco encefalico",
      "acv",
      "derrame",
    ],
  },
  heart: {
    name: "Corazón",
    system: "Sistema Cardiovascular",
    keywords: [
      "corazon",
      "corazón",
      "cardiaco",
      "cardíaco",
      "cardiovascular",
      "taquicardia",
      "bradicardia",
      "infarto",
      "arritmia",
      "arterias",
      "coronaria",
      "presion arterial",
    ],
  },
  lungs: {
    name: "Pulmones",
    system: "Sistema Respiratorio",
    keywords: [
      "pulmones",
      "pulmon",
      "pulmón",
      "respiratorio",
      "respiracion",
      "respiración",
      "alveolos",
      "apnea",
      "hipoxia",
      "bronquios",
    ],
  },
  liver: {
    name: "Hígado",
    system: "Sistema Hepatobiliar y Metabólico",
    keywords: [
      "higado",
      "hígado",
      "hepatico",
      "hepático",
      "cirrosis",
      "hepatotoxicidad",
      "metabolismo",
      "cocaetileno",
      "acetaldehido",
    ],
  },
  kidneys: {
    name: "Riñones",
    system: "Sistema Renal y Excretor",
    keywords: [
      "riñones",
      "rinones",
      "riñon",
      "renal",
      "rabdomiolisis",
      "rabdomiólisis",
      "filtracion",
      "nefrotoxicidad",
    ],
  },
};

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  low: "Bajo",
  moderate: "Moderado",
  high: "Alto",
  critical: "Crítico",
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

export type SortCriterion =
  | "addiction"
  | "physicalHarm"
  | "cardiotoxicity"
  | "neurotoxicity"
  | "name";

export const ALL_ORGANS: OrganId[] = [
  "brain",
  "heart",
  "lungs",
  "liver",
  "kidneys",
];

export const ALL_CATEGORIES: SubstanceCategory[] = [
  "stimulant",
  "opioid",
  "depressant",
  "empathogen",
  "cannabinoid",
  "psychedelic",
  "dissociative",
];

/**
 * Normalizes strings for accent-insensitive search in Spanish/English.
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Instant search, filter, and sort utility over a list of substances.
 * Supports searching by common name, aliases, chemical name, formula,
 * pharmacological category, affected organ, neurotransmitter, or adulterant.
 */
export function filterSubstances(
  substances: Substance[],
  options: {
    query?: string;
    category?: SubstanceCategory | "all";
    organ?: OrganId | "all";
    sortBy?: SortCriterion;
    readingMode?: ReadingMode;
  }
): Substance[] {
  const normalizedQuery = normalizeText(options.query ?? "");
  const category = options.category ?? "all";
  const organ = options.organ ?? "all";
  const sortBy = options.sortBy ?? "addiction";

  const filtered = substances.filter((substance) => {
    if (category !== "all" && substance.category !== category) {
      return false;
    }

    if (organ !== "all" && !substance.organImpacts[organ]) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const impactedOrgansText = ALL_ORGANS.flatMap((organId) => {
      const impact = substance.organImpacts[organId];
      if (!impact) return [];
      return [
        ORGAN_LABELS[organId].name,
        ORGAN_LABELS[organId].system,
        ...ORGAN_LABELS[organId].keywords,
        impact.headline,
        impact.explanation.general,
        impact.explanation.technical,
        impact.toxicMetabolite ?? "",
      ];
    });

    const searchableFields: string[] = [
      substance.name,
      substance.chemicalName,
      substance.formula,
      substance.casNumber,
      ...substance.aliases,
      CATEGORY_LABELS[substance.category].label,
      CATEGORY_LABELS[substance.category].shortLabel,
      substance.summary.general,
      substance.summary.technical,
      substance.mechanism.general,
      substance.mechanism.technical,
      ...substance.neurotransmitters.flatMap((nt) => [
        nt.name,
        ...nt.receptorTargets,
      ]),
      ...substance.commonAdulterants.map((ad) => ad.name),
      ...impactedOrgansText,
    ];

    return searchableFields.some((field) =>
      normalizeText(field).includes(normalizedQuery)
    );
  });

  return [...filtered].sort((a, b) => {
    // If a specific organ filter is active and default sort is selected, prioritize severity on that organ
    if (organ !== "all" && sortBy === "addiction") {
      const sevA = a.organImpacts[organ]?.overallSeverity ?? "low";
      const sevB = b.organImpacts[organ]?.overallSeverity ?? "low";
      if (SEVERITY_RANK[sevB] !== SEVERITY_RANK[sevA]) {
        return SEVERITY_RANK[sevB] - SEVERITY_RANK[sevA];
      }
    }

    switch (sortBy) {
      case "physicalHarm":
        return b.riskMetrics.physicalHarm - a.riskMetrics.physicalHarm;
      case "cardiotoxicity":
        return b.riskMetrics.cardiotoxicity - a.riskMetrics.cardiotoxicity;
      case "neurotoxicity":
        return b.riskMetrics.neurotoxicity - a.riskMetrics.neurotoxicity;
      case "name":
        return a.name.localeCompare(b.name, "es");
      case "addiction":
      default:
        return (
          b.riskMetrics.addictionPotential - a.riskMetrics.addictionPotential
        );
    }
  });
}

