import fs from "node:fs";
import path from "node:path";
import {
  CATEGORY_LABELS,
  filterSubstances,
  ORGAN_LABELS,
  SEVERITY_LABELS,
  SEVERITY_RANK,
} from "@/lib/catalog-utils";
import {
  type OrganId,
  type Substance,
  type SubstanceCategory,
  SubstanceSchema,
} from "@/lib/schemas/substance";

export {
  CATEGORY_LABELS,
  ORGAN_LABELS,
  SEVERITY_LABELS,
  SEVERITY_RANK,
  filterSubstances,
};

const SUBSTANCES_DIR = path.join(process.cwd(), "data", "substances");

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
