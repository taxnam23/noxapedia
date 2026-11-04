# Contributing to Noxapedia

Thank you for your interest in contributing to **Noxapedia**! Whether you are a pharmacologist, medical student, science communicator, 3D artist, or software engineer, your contributions help build an open, evidence-based public health resource.

---

## Ways to Contribute

1. **Add or Peer-Review a Substance Profile:** Expand `/data/substances/<slug>.json` with rigorous pharmacological and toxicological data.
2. **3D Anatomy & Visualization:** Improve procedural shaders, organ meshes (`src/components/simulator-3d/`), or pharmacokinetic charts (`src/components/charts/`).
3. **UI & Accessibility:** Enhance the clinical explorer, search filters, or mobile responsiveness.

---

## Editorial & Scientific Standards (Mandatory)

Every substance profile in Noxapedia must strictly follow these rules:

### 1. Dual Reading Modes (`general` vs. `technical`)
All narrative blocks (`summary`, `mechanism`, `addictionExplanation`, `organImpacts`, `timeline`, `neurotransmitters`) require two keys:

* **`general` (Public Science):**
  * Written for an intelligent general adult audience.
  * **Never use childish metaphors** (e.g., no *"little happiness trucks"* or *"brain factories"*).
  * Explain real physiological processes (dopamine reuptake, coronary vasoconstriction, receptor downregulation, tolerance, withdrawal) in clear, accessible language.
* **`technical` (Clinical & Pharmacological):**
  * Written for healthcare professionals, students, and researchers.
  * Include exact receptor targets (e.g., `DAT`, `NET`, `SERT`, $\mu$-opioid, $\text{GABA}_A$, `CB1`), metabolic enzymes (`CYP450`), half-life ($t_{1/2}$), bioavailability, and toxic metabolites (e.g., cocaethylene, NAPQI, acetaldehyde).

### 2. Zero Harm / Zero Sourcing Policy
* **No dosing guides or synthesis/sourcing instructions:** Never include instructions on how to acquire, synthesize, extract, or recreationally dose any substance.
* **Real-World Toxicology:** Always document common street adulterants (`commonAdulterants`) and dangerous polydrug interactions (`interactions`).
* **Verifiable References:** Every profile must include peer-reviewed citations (`PubMed`, `DOI`, `WHO`, `NIDA`, `EMCDDA`).

---

## How to Add a New Substance

1. **Fork & Clone the repository:**
   ```bash
   git clone https://github.com/taxnam23/noxapedia.git
   cd noxapedia
   npm install
   ```
2. **Create the JSON file:**
   Copy an existing file in [`/data/substances/`](./data/substances) (e.g., `data/substances/cocaina.json`) to `data/substances/<new-slug>.json`.
3. **Validate against the Zod Schema:**
   All fields are strictly checked against [`src/lib/schemas/substance.ts`](./src/lib/schemas/substance.ts). Run:
   ```bash
   npm run build
   ```
   If any required field, organ parameter, or severity level is missing or invalid, the build will output the exact Zod validation error.

---

## Pull Request Checklist

- [ ] `npm run build` and `npm run lint` pass with zero errors.
- [ ] Both `general` and `technical` texts are complete and follow the adult scientific tone.
- [ ] Organ impacts include 3D telemetry parameters (`simulatedBpm`, `simulatedRpm`, `vasoconstriction`, `affectedRegions` where applicable).
- [ ] At least 2 peer-reviewed or institutional references (`WHO`, `NIDA`, `PubMed`) are included.

