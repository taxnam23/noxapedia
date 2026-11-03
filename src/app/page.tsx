import {
  Activity,
  Brain,
  Database,
  HeartPulse,
  Microscope,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABELS, getAllSubstances } from "@/lib/data";

export default function HomePage() {
  const substances = getAllSubstances();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Clinical Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold tracking-tight text-slate-100">
                  NOXAPEDIA
                </span>
                <Badge variant="default" className="text-[10px] font-mono">
                  v0.1 ALPHA
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Atlas Neurobiológico & Simulador 3D de Sustancias Adictivas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modo General
                </TabsTrigger>
                <TabsTrigger value="technical" className="gap-1.5">
                  <Microscope className="h-3.5 w-3.5" />
                  Modo Técnico
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Clinical Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 p-8 sm:p-10 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">Open Source Science</Badge>
              <Badge variant="secondary" className="font-mono">
                OMS / NIDA / PubMed
              </Badge>
              <Badge variant="low" className="font-mono">
                <Database className="h-3 w-3" />
                {substances.length}{" "}
                {substances.length === 1
                  ? "Sustancia Validada (Zod)"
                  : "Sustancias Validadas (Zod)"}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-50 leading-tight">
              Comprende qué hacen las sustancias adictivas en cada{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">
                órgano y sinapsis
              </span>
              .
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Una enciclopedia científica interactiva que traduce la
              farmacología, la neurobiología de la adicción y la toxicidad
              orgánica en explicaciones rigurosas y simulaciones anatómicas en
              3D.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
              <Input
                placeholder="Buscar sustancia, receptor u órgano (ej. Cocaína, Fentanilo, Dopamina, Corazón)..."
                className="h-11"
              />
              <Button size="lg" className="shrink-0">
                Explorar Atlas
              </Button>
            </div>
          </div>
        </section>

        {/* System Status & Diagnostic Preview Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-cyan-500/25">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Brain className="h-5 w-5 text-cyan-400" />
                <Badge variant="default">Doble Nivel</Badge>
              </div>
              <CardTitle className="pt-2">
                Rigor Científico Sin Infantilismos
              </CardTitle>
              <CardDescription>
                Alterna al instante entre divulgación fisiológica directa para
                todo público y farmacocinética clínica avanzada.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs font-mono text-slate-400">
              DAT / NET / SERT • Receptores μ-Opioides • GABA-A • CYP450
            </CardContent>
          </Card>

          <Card className="border-rose-500/25">
            <CardHeader>
              <div className="flex items-center justify-between">
                <HeartPulse className="h-5 w-5 text-rose-400" />
                <Badge variant="critical">Telemetría 3D</Badge>
              </div>
              <CardTitle className="pt-2">
                Simulador 3D de Órganos en Vivo
              </CardTitle>
              <CardDescription>
                Visualiza taquicardia, vasoconstricción coronaria, depresión
                respiratoria y hepatotoxicidad desde el efecto agudo hasta el
                consumo crónico.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs font-mono text-slate-400">
              Cerebro • Corazón • Pulmones • Hígado • Riñones
            </CardContent>
          </Card>

          <Card className="border-amber-500/25">
            <CardHeader>
              <div className="flex items-center justify-between">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <Badge variant="moderate">Contexto Real</Badge>
              </div>
              <CardTitle className="pt-2">
                Adulterantes e Interacciones
              </CardTitle>
              <CardDescription>
                Documentación sobre cortes frecuentes de calle (fentanilo,
                xilacina, levamisol) y sinergias tóxicas como el cocaetileno.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs font-mono text-slate-400">
              Levamisol • Xilacina • Cocaetileno • Policonsumo
            </CardContent>
          </Card>
        </section>

        {/* Validated Substances Preview from /data/substances/*.json */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Catálogo Científico Validado (`/data/substances/*.json`)
              </h2>
              <p className="text-sm text-slate-400">
                Datos cargados estáticamente y verificados con esquemas estrictos
                de Zod en tiempo de compilación.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {substances.map((substance) => (
              <Card
                key={substance.id}
                className="border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="default">
                      {CATEGORY_LABELS[substance.category].label}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400">
                      {substance.formula}
                    </span>
                  </div>
                  <CardTitle className="pt-2 text-xl">
                    {substance.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-cyan-400/90">
                    {substance.chemicalName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-300 line-clamp-3">
                    {substance.summary.general}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="critical" className="font-mono text-[11px]">
                      Adicción: {substance.riskMetrics.addictionPotential}/10
                    </Badge>
                    <Badge variant="high" className="font-mono text-[11px]">
                      Cardiotoxicidad: {substance.riskMetrics.cardiotoxicity}/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
