<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# AGENTS.md — AI Coding & Contribution Guide for Noxapedia

Welcome! This file provides context, architectural rules, and editorial standards for any AI coding assistant or contributor working on **Noxapedia**.

---

## 1. Project Overview

**Noxapedia** *(from medical Latin "noxa" —a harmful agent to the organism— + "encyclopedia")* is an open-source, interactive scientific encyclopedia and **3D human organ simulator** focused on addictive and illicit substances (as well as addictive prescription and legal compounds).

* **Mission:** Bridge the gap between dense academic databases (e.g., DrugBank, PubChem) and accessible public health education through interactive 3D anatomy and rigorous science communication.
* **Core Philosophy:** Strictly evidence-based (WHO, NIDA, EMCDDA, peer-reviewed PubMed literature). Zero fear-mongering propaganda, zero glorification/sourcing, and zero infantilization.

---

## 2. Editorial & Scientific Standards (CRITICAL)

When generating, editing, or validating content for substances, you **MUST** adhere to these rules:

### 2.1. Dual-Level Reading Modes (`general` vs. `technical`)
Every explanatory block in Noxapedia supports two reading modes. Both modes must maintain a **serious, adult, and scientifically accurate tone**:

1. **General Mode (`general` — Public Science / Divulgative):**
   * Written for an intelligent general adult reader who is not a physician or biochemist.
   * **DO NOT dumb down into childish metaphors** (e.g., never write *"recycling trucks of happiness"* or *"tiny brain factories"*).
   * **DO** use real physiological and neurobiological concepts (neurons, dopamine, reuptake, receptors, coronary vasoconstriction, tolerance, withdrawal) and explain clearly what they do to the body and why they cause addiction or organ damage.
2. **Technical Mode (`technical` — Pharmacological & Clinical):**
   * Written for medical students, pharmacologists, biochemists, and advanced readers.
   * Include exact mechanisms of action (e.g., competitive inhibition of DAT/NET/SERT, $\mu$-opioid receptor agonism, GABA$_A$ allosteric modulation, voltage-gated sodium channel blockade), pharmacokinetics ($t_{1/2}$, bioavailability, CYP450 metabolic pathways), and toxic metabolites (e.g., cocaethylene, acetaldehyde).

### 2.2. Multifactorial & Real-World Context
Every substance profile must cover:
* **Neurobiology of Addiction:** Artificial neurotransmitter surges, receptor downregulation/desensitization, tolerance, anhedonia, and physical/psychological withdrawal.
* **Prescription vs. Illicit Context:** When applicable (e.g., fentanyl, oxycodone, benzodiazepines, amphetamines), distinguish legitimate controlled hospital/clinical use from the mechanisms that drive rapid dependence and overdose outside clinical monitoring.
* **Common Adulterants & Cross-Contamination:** Document real-world street adulterants (e.g., levamisole in cocaine, xylazine or fentanyl in illicit opioids/pressed pills, methanol, synthetic cathinones) and how they compound organ toxicity.
* **Citations:** Every substance file must include verifiable scientific references (DOI / PubMed / WHO / NIDA).

---

## 3. Tech Stack & Architecture

* **Framework:** Next.js (App Router) with **TypeScript** (`strict: true`).
* **Styling & UI:** Tailwind CSS + `shadcn/ui` + Lucide Icons + Framer Motion (high-contrast dark medical/scientific UI).
* **3D Engine:** Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`.
* **2D Charts:** Recharts (for neurotransmitter curves, tolerance/withdrawal cycles, pharmacokinetic timelines, and multi-substance radar comparisons).
* **Data Layer (Git-based Open Source DB):**
  * Substance data lives in `/data/substances/<slug>.json`.
  * All data files are strictly validated at build time and runtime using **Zod** schemas located in `src/lib/schemas/`.
  * No external database server is required to run or contribute to the core encyclopedia.

---

## 4. Expected Directory Structure

```text
/
├── data/
│   └── substances/          # Individual JSON files per substance (e.g., cocaine.json, fentanyl.json)
├── public/
│   └── models/              # Optional optimized GLTF/GLB 3D anatomical assets
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── page.tsx         # Home portal, instant search & 3D body overview
│   │   ├── substances/
│   │   │   └── [slug]/      # Substance Wiki Page + integrated 3D Organ Simulator
│   │   ├── lab/             # Standalone 3D Body Explorer ("Lab Mode")
│   │   └── compare/         # Side-by-side substance comparator
│   ├── components/
│   │   ├── ui/              # Reusable UI primitives (shadcn/ui)
│   │   ├── wiki/            # Substance cards, mode toggles, risk bars, adulterant alerts
│   │   ├── charts/          # Addiction cycle, pharmacokinetics, and radar charts
│   │   └── simulator-3d/    # React Three Fiber canvas, organ meshes, shaders & hotspots
│   ├── context/             # ReadingModeContext (General vs. Technical mode)
│   └── lib/
│       ├── schemas/         # Zod schemas & TypeScript types for substances and organs
│       └── data.ts          # Data loader, search indexer, and filter utilities
└── AGENTS.md                # This guide
```

---

## 5. 3D Organ Simulator Guidelines

The 3D simulator (`src/components/simulator-3d/`) is **data-driven**. Never hardcode substance names inside 3D mesh components; instead, pass physiological parameters from the substance JSON schema:

* **Supported Organs:**
  1. `brain`: Highlights specific neuroanatomical regions (`nucleus_accumbens`, `prefrontal_cortex`, `amygdala`, `hippocampus`, `brainstem`) and animates neurotransmitter particle density.
  2. `heart`: Procedural systolic/diastolic heartbeat animation driven by `simulatedBpm` (e.g., `70` baseline, `145+` stimulant tachycardia, `35` opioid overdose bradycardia) and `vasoconstriction` severity.
  3. `lungs`: Thoracic expansion/contraction driven by respiratory rate (`simulatedRpm`) to visualize respiratory depression or inhalation tissue damage.
  4. `liver`: Visualizes first-pass metabolic stress, hepatotoxic metabolites, steatosis, and fibrosis/cirrhosis progression.
  5. `kidneys`: Visualizes renal vasoconstriction, filtration stress, and rhabdomyolysis impact.
* **Exposure Timeline States:**
  * The 3D viewer must respond dynamically to the 5 timeline states: `baseline` (Healthy) → `acute` (Active Effect) → `withdrawal` (Crash / Withdrawal) → `chronic` (Long-term Use) → `overdose` (Acute Toxicity).
* **Visual Style & Performance:**
  * Use a clean, stylized medical/holographic aesthetic (avoid grotesque or gore imagery).
  * Keep 3D scenes performant (60 FPS target, proper disposal of Three.js geometries/materials, and responsive layout on mobile viewports).

---

## 6. Development Workflow & Conventions

* **Type Safety:** Never use `any`. Always infer types from the Zod schemas in `src/lib/schemas/substance.ts`.
* **Adding or Updating a Substance:**
  1. Create or edit `/data/substances/<slug>.json`.
  2. Ensure both `general` and `technical` descriptions are populated for all sections (`summary`, `mechanism`, `addictionExplanation`, `organImpacts`).
  3. Verify that all `organImpacts` include parameters for the 3D simulator and that `commonAdulterants` and `references` are present.
* **Commands:**
  * `npm run dev` — Start development server.
  * `npm run build` — Production build (must pass TypeScript & static page generation without errors).
  * `npm run lint` — Run ESLint checks.
