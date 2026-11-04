# Noxapedia

> **Interactive Scientific Encyclopedia & 3D Human Organ Simulator for Addictive and Psychoactive Substances.**

![Status](https://img.shields.io/badge/status-v0.1_alpha-06b6d4?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-emerald?style=flat-square)

**Noxapedia** *(from medical Latin "noxa" + "encyclopedia")* bridges the gap between dense clinical databases (DrugBank, PubChem) and public health education. It combines rigorous pharmacology, neurobiology of addiction, and real-world toxicology with interactive 3D anatomy.

---

## Key Features

* **Dual Reading Modes (`General` / `Technical`):** Switch instantly between clear, adult physiological explanations (zero infantilization) and clinical pharmacology (receptor binding, CYP450 pathways, $t_{1/2}$ pharmacokinetics, and toxic metabolites).
* **Organ & Synapse Telemetry:** Explore how compounds impact the **Brain**, **Heart**, **Lungs**, **Liver**, and **Kidneys** across 5 exposure states (`baseline`, `acute`, `withdrawal`, `chronic`, `overdose`).
* **Real-World Toxicology:** Documents street adulterants (e.g., levamisole, xylazine, illicit fentanyl), polydrug synergies (e.g., cocaethylene), and myths vs. peer-reviewed evidence.
* **Open Git-Based Database:** Every substance lives in `/data/substances/<slug>.json` and is validated at build time with strict **Zod** schemas (`src/lib/schemas/substance.ts`).
* **Multi-Language Support:** Built-in DOM translation switcher (`ES` | `EN` | `PT` | `FR`) that preserves chemical formulas, CAS numbers, and receptor nomenclature.

---

## Tech Stack

* **Framework:** Next.js (App Router) + TypeScript (`strict: true`)
* **UI & Styling:** Tailwind CSS v4 + `shadcn/ui` + Lucide Icons
* **3D & Visualization:** Three.js (`@react-three/fiber`, `@react-three/drei`) + Recharts
* **Data Validation:** Zod static schema validation

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Validate schemas & build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributing a Substance

All substance profiles are stored in [`/data/substances/`](./data/substances) and validated against [`src/lib/schemas/substance.ts`](./src/lib/schemas/substance.ts).

1. Duplicate an existing profile (e.g., `data/substances/cocaina.json`).
2. Populate both `general` and `technical` explanations, organ impacts, street adulterants, and verifiable references (WHO, NIDA, PubMed DOI).
3. Run `npm run build` to verify schema compliance.
4. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`AGENTS.md`](./AGENTS.md) for editorial and scientific standards.

---

## Scientific & Medical Disclaimer

**Noxapedia is strictly an educational, scientific, and harm-reduction resource.** It does not provide medical advice, clinical diagnosis, or dosing instructions, nor does it promote the use or sourcing of any controlled substance.

## License

Released under the [MIT License](./LICENSE).
