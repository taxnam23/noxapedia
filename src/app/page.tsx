import {
  Activity,
  Brain,
  Database,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/wiki/language-switcher";
import { ReadingModeToggle } from "@/components/wiki/reading-mode-toggle";
import { SubstanceExplorer } from "@/components/wiki/substance-explorer";
import { getAllSubstances } from "@/lib/data";

export default function HomePage() {
  const substances = getAllSubstances();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Clinical Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  translate="no"
                  className="notranslate font-mono text-lg font-bold tracking-tight text-slate-100"
                >
                  NOXAPEDIA
                </span>
                <Badge
                  variant="default"
                  translate="no"
                  className="notranslate text-[10px] font-mono"
                >
                  v0.1 ALPHA
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Atlas Neurobiológico & Simulador 3D de Sustancias Adictivas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ReadingModeToggle size="sm" />
            <Badge
              variant="low"
              className="hidden lg:inline-flex font-mono text-xs"
            >
              <Database className="h-3.5 w-3.5" />
              {substances.length}{" "}
              {substances.length === 1
                ? "Sustancia en Base de Datos"
                : "Sustancias en Base de Datos"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Clinical Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 p-8 sm:p-10 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">Open Source Science</Badge>
              <Badge variant="secondary" className="font-mono">
                OMS / NIDA / PubMed
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
          </div>
        </section>

        {/* Interactive Real-Time Search & Filter Explorer */}
        <section id="explorar">
          <SubstanceExplorer substances={substances} />
        </section>

        {/* System Status & Diagnostic Preview Cards */}
        <section className="grid gap-6 md:grid-cols-3 pt-4">
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
      </main>
    </div>
  );
}
