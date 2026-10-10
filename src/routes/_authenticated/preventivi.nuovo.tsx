import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { t as tr } from "@/lib/i18n";
import { PageHeader, Page } from "@/components/AppShell";
import { Field, MoneyInput, Section, TextInput, inputCls } from "@/components/Field";
import { businessQuery, customersQuery, nextQuoteNumber, quotesQuery, quoteQuery, uid, type Customer } from "@/lib/data";
import { calcTotals, canCreateQuote, euro, toNum, type Plan } from "@/lib/quote";
import { currentPlan, profileQuery } from "@/lib/data";

type Search = { edit?: string | undefined; customer?: string | undefined };

export const Route = createFileRoute("/_authenticated/preventivi/nuovo")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): Search => ({
    edit: typeof s["edit"] === "string" ? s["edit"] : undefined,
    customer: typeof s["customer"] === "string" ? s["customer"] : undefined,
  }),
  head: () => ({ meta: [{ title: "Nuovo preventivo — QuickQuote" }, { name: "description", content: "Crea un nuovo preventivo." }, { property: "og:title", content: "Nuovo preventivo — QuickQuote" }, { property: "og:description", content: "Crea un nuovo preventivo." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: NewQuote,
});

const today = () => new Date().toISOString().slice(0, 10);

function NewQuote() {
  const { edit, customer: preCustomer } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: biz } = useQuery(businessQuery);
  const { data: quotes = [], isSuccess: quotesReady } = useQuery(quotesQuery);
  const { data: customers = [] } = useQuery(customersQuery);
  const { data: profile } = useQuery(profileQuery);
  const { data: existing } = useQuery({ ...quoteQuery(edit ?? ""), enabled: !!edit });

  const [f, setF] = useState({
    business: "", customerId: "" as string, name: "", phone: "", email: "",
    date: today(), number: "", title: "", description: "",
    labour: "", materials: "", other: "", discount: "", vat: "22",
  });
  const [picker, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  // init defaults
  useEffect(() => {
    if (edit || !biz || !quotesReady) return;
    setF((s) => ({
      ...s,
      business: s.business || biz.business_name,
      vat: s.vat === "22" ? String(biz.default_vat) : s.vat,
      number: s.number || nextQuoteNumber(quotes),
    }));
  }, [biz, quotesReady, edit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!preCustomer || edit) return;
    const c = customers.find((x) => x.id === preCustomer);
    if (c) pick(c);
  }, [preCustomer, customers.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!existing) return;
    const q = existing.quote;
    const amt = (k: string) => String(existing.items.find((i) => i.kind === k)?.amount ?? "");
    setF({
      business: q.business_name, customerId: q.customer_id ?? "", name: q.customer_name, phone: q.customer_phone ?? "",
      email: q.customer_email ?? "", date: q.quote_date, number: q.number, title: q.title, description: q.description ?? "",
      labour: amt("labour"), materials: amt("materials"), other: amt("other"),
      discount: Number(q.discount) ? String(q.discount) : "", vat: String(q.vat_rate),
    });
  }, [existing]);

  function pick(c: Customer) {
    setF((s) => ({ ...s, customerId: c.id, name: c.name, phone: c.phone ?? "", email: c.email ?? "" }));
    setPicker(false);
  }

  const t = useMemo(
    () => calcTotals({ labour: toNum(f.labour), materials: toNum(f.materials), other: toNum(f.other), discount: toNum(f.discount), vat: toNum(f.vat) }),
    [f.labour, f.materials, f.other, f.discount, f.vat],
  );

  async function save() {
    if (!f.name.trim()) return void toast.error(tr("Inserisci il nome del cliente"));
    if (!f.title.trim()) return void toast.error(tr("Inserisci il titolo del lavoro"));
    if (!edit && !canCreateQuote(currentPlan(profile), quotes.length)) return void toast.error(tr("Limite piano gratuito raggiunto"));
    setSaving(true);
    try {
      const user_id = await uid();
      let customer_id = f.customerId || null;
      if (!customer_id) {
        const match = customers.find((c) => c.name.trim().toLowerCase() === f.name.trim().toLowerCase());
        if (match) customer_id = match.id;
        else {
          const { data, error } = await supabase.from("customers").insert({ user_id, name: f.name.trim(), phone: f.phone, email: f.email }).select().single();
          if (error) throw error;
          customer_id = data.id;
        }
      }
      const row = {
        user_id, customer_id, number: f.number, quote_date: f.date, business_name: f.business,
        customer_name: f.name.trim(), customer_phone: f.phone, customer_email: f.email,
        title: f.title.trim(), description: f.description, discount: t.discount, vat_rate: toNum(f.vat),
        subtotal: t.subtotal, taxable: t.taxable, vat_amount: t.vatAmount, total: t.total, updated_at: new Date().toISOString(),
      };
      let id = edit;
      if (edit) {
        const { error } = await supabase.from("quotes").update(row).eq("id", edit);
        if (error) throw error;
        await supabase.from("quote_items").delete().eq("quote_id", edit);
      } else {
        const { data, error } = await supabase.from("quotes").insert(row).select().single();
        if (error) throw error;
        id = data.id;
      }
      const items = [
        { kind: "labour", label: "Manodopera", amount: toNum(f.labour) },
        { kind: "materials", label: "Materiali", amount: toNum(f.materials) },
        { kind: "other", label: "Altri costi", amount: toNum(f.other) },
      ].map((it, position) => ({ ...it, position, user_id, quote_id: id! }));
      const ie = await supabase.from("quote_items").insert(items);
      if (ie.error) throw ie.error;
      if (biz && !biz.business_name && f.business) {
        await supabase.from("business_profiles").update({ business_name: f.business }).eq("id", biz.id);
      }
      await qc.invalidateQueries();
      toast.success(edit ? tr("Preventivo aggiornato") : tr("Preventivo creato"));
      navigate({ to: "/preventivi/$id", params: { id: id! }, replace: true });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(f.name.toLowerCase()));

  if (!edit && quotesReady && profile !== undefined && !canCreateQuote(currentPlan(profile), quotes.length)) {
    return (
      <>
        <PageHeader title={tr("Nuovo preventivo")} back="/dashboard" />
        <Page>
          <section className="rounded-2xl bg-navy p-6 text-center text-navy-foreground">
            <h2 className="text-xl font-extrabold">{tr("Hai utilizzato i 5 preventivi gratuiti.")}</h2>
            <p className="mt-2 text-sm text-navy-foreground/75">{tr("Passa a QuickQuote Pro per continuare a creare preventivi illimitati.")}</p>
            <Link to="/pro" className="mt-5 flex h-14 w-full items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground">{tr("PASSA A PRO")}</Link>
          </section>
        </Page>
      </>
    );
  }

  return (
    <>
      <PageHeader title={edit ? tr("Modifica preventivo") : tr("Nuovo preventivo")} back="/dashboard" />
      <Page>
        <div className="space-y-4 pb-24">
          <Section title={tr("Cliente")}>
            {customers.length > 0 && (
              <button type="button" onClick={() => setPicker(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground">
                <UserCheck className="h-5 w-5" /> {f.customerId ? tr("Cambia cliente") : tr("Scegli cliente esistente")}
              </button>
            )}
            <TextInput label={tr("Nome cliente *")} value={f.name} onChange={(e) => setF((s) => ({ ...s, name: e.target.value, customerId: "" }))} placeholder={tr("Mario Bianchi")} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput label={tr("Telefono cliente")} type="tel" inputMode="tel" value={f.phone} onChange={(e) => set("phone")(e.target.value)} />
              <TextInput label={tr("Email cliente")} type="email" inputMode="email" value={f.email} onChange={(e) => set("email")(e.target.value)} />
            </div>
          </Section>

          <Section title={tr("Lavoro")}>
            <TextInput label={tr("Titolo del lavoro *")} value={f.title} onChange={(e) => set("title")(e.target.value)} placeholder={tr("Es. Sostituzione caldaia")} />
            <Field label={tr("Descrizione")}>
              <textarea className={`${inputCls} min-h-24`} value={f.description} onChange={(e) => set("description")(e.target.value)} placeholder={tr("Dettagli del lavoro, tempi, condizioni…")} />
            </Field>
          </Section>

          <Section title={tr("Costi")}>
            <MoneyInput label={tr("Manodopera")} value={f.labour} onChange={set("labour")} />
            <MoneyInput label={tr("Materiali")} value={f.materials} onChange={set("materials")} />
            <MoneyInput label={tr("Altri costi")} value={f.other} onChange={set("other")} />
            <div className="grid grid-cols-2 gap-3">
              <MoneyInput label={tr("Sconto")} value={f.discount} onChange={set("discount")} />
              <MoneyInput label={tr("IVA")} value={f.vat} onChange={set("vat")} suffix="%" />
            </div>
            <div className="flex flex-wrap gap-2">
              {["0", "4", "10", "22"].map((v) => (
                <button key={v} type="button" onClick={() => set("vat")(v)} className={`h-9 rounded-full px-4 text-sm font-semibold ${f.vat === v ? "bg-navy text-navy-foreground" : "bg-muted text-muted-foreground"}`}>
                  {tr("IVA")} {v}%
                </button>
              ))}
            </div>
            <dl className="num space-y-1.5 rounded-xl bg-muted p-4 text-sm">
              <Row k="Subtotale" v={euro(t.subtotal)} />
              <Row k="Sconto" v={`− ${euro(t.discount)}`} />
              <Row k="Imponibile" v={euro(t.taxable)} />
              <Row k={`${tr("IVA")} ${toNum(f.vat)}%`} v={euro(t.vatAmount)} />
              <div className="flex justify-between border-t pt-2 text-lg font-extrabold"><dt>{tr("Totale")}</dt><dd>{euro(t.total)}</dd></div>
            </dl>
          </Section>

          <Section title={tr("Dettagli")}>
            <TextInput label={tr("Nome attività")} value={f.business} onChange={(e) => set("business")(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={tr("Data")} type="date" value={f.date} onChange={(e) => set("date")(e.target.value)} />
              <TextInput label={tr("Numero preventivo")} value={f.number} onChange={(e) => set("number")(e.target.value)} />
            </div>
          </Section>
        </div>
      </Page>

      <div className="no-print fixed inset-x-0 bottom-[76px] z-20 px-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl bg-navy p-2 pl-4 text-navy-foreground shadow-xl">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wide text-navy-foreground/60">{tr("Totale")}</p>
            <p className="num text-lg font-extrabold">{euro(t.total)}</p>
          </div>
          <button onClick={save} disabled={saving} className="h-12 rounded-xl bg-primary px-6 font-bold text-primary-foreground disabled:opacity-60">
            {saving ? tr("Salvo…") : tr("Salva e vedi")}
          </button>
        </div>
      </div>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/60" onClick={() => setPicker(false)}>
          <div className="max-h-[80vh] w-full overflow-auto rounded-t-3xl bg-card p-4 safe-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">{tr("Scegli cliente")}</h3>
              <button onClick={() => setPicker(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" aria-label={tr("Chiudi")}><X className="h-5 w-5" /></button>
            </div>
            <input className={inputCls} placeholder={tr("Cerca…")} value={f.customerId ? "" : f.name} onChange={(e) => setF((s) => ({ ...s, name: e.target.value, customerId: "" }))} />
            <div className="mt-3 divide-y">
              {(f.customerId ? customers : filtered).map((c) => (
                <button key={c.id} onClick={() => pick(c)} className="flex w-full flex-col items-start py-3 text-left">
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{[c.phone, c.email].filter(Boolean).join(" · ") || "—"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <dt>{tr(k)}</dt>
      <dd className="font-semibold text-foreground">{v}</dd>
    </div>
  );
}