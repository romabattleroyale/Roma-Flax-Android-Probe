import type { InputHTMLAttributes, ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ label, ...p }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label}>
      <input className={inputCls} {...p} />
    </Field>
  );
}

export function MoneyInput({ label, value, onChange, suffix = "€" }: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <Field label={label}>
      <div className="relative">
        <input
          className={`${inputCls} num pr-10 text-right font-semibold`}
          inputMode="decimal"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
          onFocus={(e) => e.target.select()}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
      </div>
    </Field>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}