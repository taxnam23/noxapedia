"use client";

import { Globe } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type SupportedLanguage = "es" | "en" | "pt" | "fr";

interface LanguageOption {
  code: SupportedLanguage;
  shortLabel: string;
  fullName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "es", shortLabel: "ES", fullName: "Español (Original)" },
  { code: "en", shortLabel: "EN", fullName: "English" },
  { code: "pt", shortLabel: "PT", fullName: "Português" },
  { code: "fr", shortLabel: "FR", fullName: "Français" },
];

const LANGUAGE_STORAGE_KEY = "noxapedia:lang";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => unknown;
      };
    };
    __noxapediaDomPatched?: boolean;
  }
}

/**
 * Patches Node.prototype.removeChild and Node.prototype.insertBefore so React 19
 * reconciliation never throws NotFoundError when browser/DOM translation wraps text in <font>.
 */
function ensureReactDomTranslationPatch() {
  if (typeof window === "undefined" || window.__noxapediaDomPatched) {
    return;
  }
  window.__noxapediaDomPatched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

function setGoogTransCookie(targetLang: SupportedLanguage) {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;

  if (targetLang === "es") {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
  } else {
    const cookieVal = `/es/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/; SameSite=Lax`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${host}; SameSite=Lax`;
  }
}

function triggerGoogleTranslateCombo(targetLang: SupportedLanguage): boolean {
  const selectEl = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!selectEl) return false;

  selectEl.value = targetLang === "es" ? "" : targetLang;
  selectEl.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

/**
 * Mounts the hidden Google Translate DOM engine and installs the React DOM safety patch.
 * Place once inside RootLayout.
 */
export function DomTranslationEngine() {
  React.useEffect(() => {
    ensureReactDomTranslationPatch();

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "es",
            includedLanguages: "es,en,pt,fr",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const existingScript = document.getElementById(
      "noxapedia-google-translate-script"
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "noxapedia-google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      className="sr-only pointer-events-none h-0 w-0 overflow-hidden"
    />
  );
}

/**
 * Sleek clinical language selector ("ES | EN | PT | FR") that controls the DOM translation engine
 * without duplicating any substance JSON files.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const [currentLang, setCurrentLang] =
    React.useState<SupportedLanguage>("es");

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      ) as SupportedLanguage | null;
      if (
        saved &&
        SUPPORTED_LANGUAGES.some((item) => item.code === saved)
      ) {
        setCurrentLang(saved);
        if (saved !== "es") {
          setGoogTransCookie(saved);
          // Retry applying translation once the hidden combo finishes loading
          const timer = window.setTimeout(() => {
            triggerGoogleTranslateCombo(saved);
          }, 800);
          return () => window.clearTimeout(timer);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    if (lang === currentLang) return;
    setCurrentLang(lang);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }

    setGoogTransCookie(lang);

    if (lang === "es") {
      // Returning to original Spanish: reload cleanly after clearing googtrans cookie
      // so all DOM nodes return to their exact pristine Spanish state
      window.location.reload();
      return;
    }

    const triggered = triggerGoogleTranslateCombo(lang);
    if (!triggered) {
      // If the script hasn't mounted the combo yet, reload with cookie set
      window.location.reload();
    }
  };

  return (
    <div
      translate="no"
      className={cn(
        "notranslate inline-flex items-center gap-1 rounded-lg border border-slate-800/90 bg-slate-900/95 p-0.5",
        className
      )}
      title="Idioma de visualización (traducción automática protegiendo fórmulas y receptores)"
    >
      <span className="flex items-center pl-2 pr-1 text-slate-400">
        <Globe className="h-3.5 w-3.5 text-cyan-400" />
      </span>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelectLanguage(lang.code)}
            title={lang.fullName}
            className={cn(
              "rounded-md px-2 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer",
              isActive
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {lang.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

