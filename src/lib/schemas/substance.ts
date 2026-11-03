import { z } from "zod";

/**
 * Reading mode supported across all Noxapedia explanatory blocks.
 * - "general": Serious, clear, adult physiological & neurobiological explanation.
 * - "technical": Advanced pharmacological, biochemical & clinical terminology.
 */
export const ReadingModeSchema = z.enum(["general", "technical"]);
export type ReadingMode = z.infer<typeof ReadingModeSchema>;

/**
 * Dual-level text block required for core scientific explanations.
 */
export const DualModeTextSchema = z.object({
  general: z.string().min(10, "General explanation must be descriptive"),
  technical: z.string().min(10, "Technical explanation must be descriptive"),
});
export type DualModeText = z.infer<typeof DualModeTextSchema>;

/**
 * Pharmacological classification of the substance.
 */
export const SubstanceCategorySchema = z.enum([
  "stimulant",
  "opioid",
  "depressant",
  "cannabinoid",
  "empathogen",
  "psychedelic",
  "dissociative",
]);
export type SubstanceCategory = z.infer<typeof SubstanceCategorySchema>;

/**
 * Clinical severity scale used for UI badges and 3D shader intensity.
 */
export const SeverityLevelSchema = z.enum([
  "low",
  "moderate",
  "high",
  "critical",
]);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

/**
 * Supported 3D organs in the Noxapedia anatomical simulator.
 */
export const OrganIdSchema = z.enum([
  "brain",
  "heart",
  "lungs",
  "liver",
  "kidneys",
]);
export type OrganId = z.infer<typeof OrganIdSchema>;

/**
 * Specific neuroanatomical subregions highlighted in the 3D Brain model.
 */
export const BrainRegionIdSchema = z.enum([
  "nucleus_accumbens",
  "prefrontal_cortex",
  "amygdala",
  "hippocampus",
  "brainstem",
]);
export type BrainRegionId = z.infer<typeof BrainRegionIdSchema>;

/**
 * Exposure timeline states controlled by the 3D simulator temporal slider.
 */
export const ExposureStateIdSchema = z.enum([
  "baseline",
  "acute",
  "withdrawal",
  "chronic",
  "overdose",
]);
export type ExposureStateId = z.infer<typeof ExposureStateIdSchema>;

/**
 * Neurotransmitter systems altered by a substance.
 */
export const NeurotransmitterIdSchema = z.enum([
  "dopamine",
  "serotonin",
  "norepinephrine",
  "gaba",
  "glutamate",
  "endorphins",
  "endocannabinoids",
]);
export type NeurotransmitterId = z.infer<typeof NeurotransmitterIdSchema>;

/**
 * Quantitative and qualitative neurotransmitter alteration.
 */
export const NeurotransmitterEffectSchema = z.object({
  id: NeurotransmitterIdSchema,
  name: z.string(),
  /** Percentage change vs physiological baseline during acute effect (e.g. +300 or -40) */
  changePercent: z.number(),
  /** Primary molecular targets (e.g. ["DAT", "D1", "D2"] or ["MOR (μ-opioid)"]) */
  receptorTargets: z.array(z.string()).min(1),
  explanation: DualModeTextSchema,
});
export type NeurotransmitterEffect = z.infer<
  typeof NeurotransmitterEffectSchema
>;

/**
 * Interactive 3D point of interest (Hotspot) rendered on top of an organ mesh.
 */
export const OrganHotspotSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** Normalized 3D coordinates [x, y, z] relative to the organ mesh center */
  position: z.tuple([z.number(), z.number(), z.number()]),
  severity: SeverityLevelSchema,
  description: DualModeTextSchema,
});
export type OrganHotspot = z.infer<typeof OrganHotspotSchema>;

/**
 * Dynamic physiological parameters for a specific exposure state (e.g. acute vs overdose).
 */
export const OrganStateParametersSchema = z.object({
  severity: SeverityLevelSchema,
  /** Simulated heart rate in beats per minute (used when organ === "heart") */
  simulatedBpm: z.number().min(0).max(260).optional(),
  /** Arterial vasoconstriction index from 0.0 (normal) to 1.0 (severe spasm) */
  vasoconstriction: z.number().min(0).max(1).optional(),
  /** Simulated respiratory rate in breaths per minute (used when organ === "lungs") */
  simulatedRpm: z.number().min(0).max(60).optional(),
  /** Metabolic or cellular toxicity stress index from 0.0 to 1.0 */
  stressIndex: z.number().min(0).max(1),
  description: DualModeTextSchema,
});
export type OrganStateParameters = z.infer<typeof OrganStateParametersSchema>;

/**
 * Comprehensive organ impact specification driving both Wiki cards and the 3D Simulator.
 */
export const OrganImpactSchema = z.object({
  organ: OrganIdSchema,
  overallSeverity: SeverityLevelSchema,
  headline: z.string(),
  explanation: DualModeTextSchema,
  /** Highlighted subregions when organ === "brain" */
  highlightedBrainRegions: z.array(BrainRegionIdSchema).optional(),
  /** Primary acute BPM when organ === "heart" */
  simulatedBpm: z.number().min(0).max(260).optional(),
  /** Primary acute vasoconstriction index (0.0 - 1.0) */
  vasoconstriction: z.number().min(0).max(1).optional(),
  /** Primary acute respiratory rate (RPM) when organ === "lungs" */
  simulatedRpm: z.number().min(0).max(60).optional(),
  /** Key hepatotoxic or cardiotoxic metabolite if applicable (e.g. "Cocaetileno", "Acetaldehído") */
  toxicMetabolite: z.string().optional(),
  hotspots: z.array(OrganHotspotSchema),
  /** Parameters for each of the 5 exposure states in the 3D timeline slider */
  timelineStates: z.object({
    baseline: OrganStateParametersSchema,
    acute: OrganStateParametersSchema,
    withdrawal: OrganStateParametersSchema,
    chronic: OrganStateParametersSchema,
    overdose: OrganStateParametersSchema,
  }),
});
export type OrganImpact = z.infer<typeof OrganImpactSchema>;

/**
 * Stage in the pharmacokinetic & addiction cycle timeline.
 */
export const TimelineStageSchema = z.object({
  stage: z.enum([
    "onset",
    "comeup",
    "peak",
    "offset",
    "aftereffects",
    "withdrawal",
  ]),
  label: z.string(),
  timeRange: z.string(),
  /** Normalized subjective/physiological effect intensity (0 - 100) */
  intensity: z.number().min(0).max(100),
  /** Relative dopamine/reward tone where 100 = healthy baseline (e.g. 320 at peak, 45 during crash) */
  rewardToneIndex: z.number().min(0).max(1200),
  description: DualModeTextSchema,
});
export type TimelineStage = z.infer<typeof TimelineStageSchema>;

/**
 * Drug-drug interaction entry for polydrug risk matrix.
 */
export const InteractionSchema = z.object({
  withSubstance: z.string(),
  riskLevel: z.enum(["caution", "unsafe", "dangerous", "lethal"]),
  resultingCompound: z.string().optional(),
  effectSummary: z.string(),
  explanation: DualModeTextSchema,
});
export type Interaction = z.infer<typeof InteractionSchema>;

/**
 * Street adulterant or cross-contaminant entry.
 */
export const AdulterantSchema = z.object({
  name: z.string(),
  frequency: z.enum(["occasional", "common", "very_common"]),
  severity: SeverityLevelSchema,
  purpose: z.string(),
  organRisk: DualModeTextSchema,
});
export type Adulterant = z.infer<typeof AdulterantSchema>;

/**
 * Evidence-based myth vs reality item.
 */
export const MythRealitySchema = z.object({
  myth: z.string(),
  reality: DualModeTextSchema,
});
export type MythReality = z.infer<typeof MythRealitySchema>;

/**
 * Verifiable scientific citation (PubMed, DOI, WHO, NIDA, EMCDDA).
 */
export const ScientificReferenceSchema = z.object({
  title: z.string(),
  authors: z.string().optional(),
  source: z.string(),
  year: z.number().int().min(1900).max(2100),
  url: z.string().url(),
  doi: z.string().optional(),
});
export type ScientificReference = z.infer<typeof ScientificReferenceSchema>;

/**
 * Standardized 0-10 risk metrics for radar comparisons and risk bars.
 */
export const RiskMetricsSchema = z.object({
  addictionPotential: z.number().min(0).max(10),
  physicalHarm: z.number().min(0).max(10),
  neurotoxicity: z.number().min(0).max(10),
  cardiotoxicity: z.number().min(0).max(10),
  hepatotoxicity: z.number().min(0).max(10),
  withdrawalSeverity: z.number().min(0).max(10),
  socialImpact: z.number().min(0).max(10),
});
export type RiskMetrics = z.infer<typeof RiskMetricsSchema>;

/**
 * Pharmacokinetic profile metadata.
 */
export const PharmacokineticsSchema = z.object({
  routesOfAdministration: z.array(z.string()).min(1),
  halfLife: z.string(),
  bioavailability: z.string(),
  metabolism: z.string(),
  excretion: z.string(),
});
export type Pharmacokinetics = z.infer<typeof PharmacokineticsSchema>;

/**
 * Complete Noxapedia Substance Schema.
 */
export const SubstanceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase kebab-case"),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  chemicalName: z.string(),
  formula: z.string(),
  molecularWeight: z.string(),
  casNumber: z.string(),
  category: SubstanceCategorySchema,
  origin: z.enum(["natural", "semi-synthetic", "synthetic"]),
  legalStatus: z.string(),
  pharmacokinetics: PharmacokineticsSchema,
  riskMetrics: RiskMetricsSchema,
  summary: DualModeTextSchema,
  mechanism: DualModeTextSchema,
  addictionExplanation: DualModeTextSchema,
  prescriptionVsIllicitContext: DualModeTextSchema.optional(),
  neurotransmitters: z.array(NeurotransmitterEffectSchema).min(1),
  organImpacts: z.object({
    brain: OrganImpactSchema.optional(),
    heart: OrganImpactSchema.optional(),
    lungs: OrganImpactSchema.optional(),
    liver: OrganImpactSchema.optional(),
    kidneys: OrganImpactSchema.optional(),
  }),
  timelineStages: z.array(TimelineStageSchema).min(1),
  shortTermEffects: z.object({
    psychological: z.array(z.string()).min(1),
    physiological: z.array(z.string()).min(1),
  }),
  longTermEffects: z.object({
    psychological: z.array(z.string()).min(1),
    physiological: z.array(z.string()).min(1),
  }),
  overdoseSigns: z.array(z.string()).min(1),
  interactions: z.array(InteractionSchema).min(1),
  commonAdulterants: z.array(AdulterantSchema),
  myths: z.array(MythRealitySchema).min(1),
  references: z.array(ScientificReferenceSchema).min(1),
});

export type Substance = z.infer<typeof SubstanceSchema>;

