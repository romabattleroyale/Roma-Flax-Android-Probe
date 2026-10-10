import { setLang, useLangState, type Lang } from "@/lib/i18n";

const OPTIONS: [Lang, string][] = [["it", "Italiano"], ["en", "English"]];

export function LangSwitch({ big, className = "" }: { big?: boolean; className?: string }) {
  const { lang } = useLangState();
  if (big) {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`} role="radiogroup">
        {OPTIONS.map(([l, label]) => (
          <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}
            className={`h-12 rounded-xl text-sm font-bold ${lang === l ? "bg-navy text-navy-foreground" : "border bg-card text-muted-foreground"}`}>
            {label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <p className={`flex justify-center gap-3 font-semibold ${className}`}>
      {OPTIONS.map(([l, label]) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={lang === l ? "underline" : "opacity-70"}>{label}</button>
      ))}
    </p>
  );
}

/* First-open choice; shown once until a language is saved. */
export function LanguagePicker() {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/70 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="lang-title">
      <div className="w-full max-w-sm rounded-t-3xl bg-card p-6 safe-bottom sm:rounded-3xl">
        <h2 id="lang-title" className="text-xl font-extrabold">Scegli la lingua · Choose your language</h2>
        <div className="mt-5 space-y-3">
          {OPTIONS.map(([l, label]) => (
            <button key={l} type="button" onClick={() => setLang(l)} className="h-14 w-full rounded-xl bg-navy text-base font-bold text-navy-foreground">{label}</button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Puoi cambiarla dalle Impostazioni · You can change it in Settings</p>
      </div>
    </div>
  );
}