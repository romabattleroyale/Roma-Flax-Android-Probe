import { locale } from "@/lib/i18n";

export type QuoteStatus = "bozza" | "inviato" | "accettato" | "rifiutato";

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  bozza: "Bozza",
  inviato: "Inviato",
  accettato: "Accettato",
  rifiutato: "Rifiutato",
};

export const STATUS_CLASS: Record<QuoteStatus, string> = {
  bozza: "bg-muted text-muted-foreground",
  inviato: "bg-info/15 text-info",
  accettato: "bg-success/15 text-success",
  rifiutato: "bg-destructive/12 text-destructive",
};

export const euro = (n: number) =>
  new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR" }).format(n || 0);

export const dateIt = (d: string) =>
  new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString(locale(), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const toNum = (v: string | number) => {
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return isFinite(n) ? n : 0;
};

export function calcTotals(i: { labour: number; materials: number; other: number; discount: number; vat: number }) {
  const subtotal = i.labour + i.materials + i.other;
  const discount = Math.min(Math.max(i.discount, 0), subtotal);
  const taxable = subtotal - discount;
  const vatAmount = Math.round(taxable * i.vat) / 100;
  const total = taxable + vatAmount;
  return { subtotal, discount, taxable, vatAmount, total };
}

/* Piani: FREE (5 preventivi totali) e PRO (illimitati). Il limite è applicato
   anche dal database; profiles.plan verrà aggiornato dal futuro webhook Stripe. */
export const PLAN_LIMITS = { free: 5, pro: Infinity } as const;
export type Plan = keyof typeof PLAN_LIMITS;
export const PRO_PRICE_LABEL = "7,99 €";
export const PRO_PRICE_FULL = "7,99 €/mese + IVA, se applicabile";
export const PRO_TAX_NOTE = "Il totale finale può includere IVA o altre imposte in base alla tua posizione e viene mostrato prima della conferma.";
export const ENFORCE_PLAN_LIMITS = true;
export function canCreateQuote(plan: Plan, used: number) {
  if (!ENFORCE_PLAN_LIMITS) return true;
  return used < PLAN_LIMITS[plan];
}