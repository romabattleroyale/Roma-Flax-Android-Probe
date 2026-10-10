import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Phone, Mail, X, Pencil, Trash2, FilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";
import { PageHeader, Page } from "@/components/AppShell";
import { TextInput, inputCls } from "@/components/Field";
import { customersQuery, quotesQuery, uid, type Customer } from "@/lib/data";
import { euro } from "@/lib/quote";

export const Route = createFileRoute("/_authenticated/clienti")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Clienti — QuickQuote" }, { name: "description", content: "Gestisci i tuoi clienti." }, { property: "og:title", content: "Clienti — QuickQuote" }, { property: "og:description", content: "Gestisci i tuoi clienti." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Clients,
});

type Form = { id?: string; name: string; phone: string; email: string; address: string };

function Clients() {
  const qc = useQueryClient();
  const { data: customers = [] } = useQuery(customersQuery);
  const { data: quotes = [] } = useQuery(quotesQuery);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Form | null>(null);

  const stats = (id: string) => {
    const qs = quotes.filter((x) => x.customer_id === id);
    return { n: qs.length, total: qs.reduce((s, x) => s + Number(x.total), 0) };
  };
  const list = customers.filter((c) => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q.toLowerCase()));

  async function save() {
    if (!form?.name.trim()) return void toast.error(t("Inserisci il nome"));
    const payload = { name: form.name.trim(), phone: form.phone, email: form.email, address: form.address };
    const res = form.id
      ? await supabase.from("customers").update(payload).eq("id", form.id)
      : await supabase.from("customers").insert({ ...payload, user_id: await uid() });
    if (res.error) return void toast.error(res.error.message);
    qc.invalidateQueries({ queryKey: ["customers"] });
    toast.success(form.id ? t("Cliente aggiornato") : t("Cliente aggiunto"));
    setForm(null);
  }
  async function remove(c: Customer) {
    if (!confirm(t("Eliminare {name}? I preventivi resteranno salvati.", { name: c.name }))) return;
    const { error } = await supabase.from("customers").delete().eq("id", c.id);
    if (error) return void toast.error(error.message);
    qc.invalidateQueries();
    toast.success(t("Cliente eliminato"));
  }

  return (
    <>
      <PageHeader
        title={t("Clienti")}
        right={<button onClick={() => setForm({ name: "", phone: "", email: "", address: "" })} className="flex h-10 items-center gap-1 rounded-full bg-navy-soft px-4 text-sm font-bold"><Plus className="h-4 w-4" />{t("Aggiungi")}</button>}
      />
      <Page>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={`${inputCls} pl-11`} placeholder={t("Cerca cliente")} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mt-4 space-y-2">
          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              {customers.length ? t("Nessun risultato.") : t("Nessun cliente. I clienti vengono salvati automaticamente quando crei un preventivo.")}
            </div>
          )}
          {list.map((c) => {
            const s = stats(c.id);
            return (
              <div key={c.id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{c.name}</p>
                    <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                      {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{c.phone}</a>}
                      {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5" />{c.email}</a>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="num font-extrabold">{euro(s.total)}</p>
                    <p className="text-xs text-muted-foreground">{t(s.n === 1 ? "{n} preventivo" : "{n} preventivi", { n: s.n })}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link to="/preventivi/nuovo" search={{ customer: c.id }} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground"><FilePlus className="h-4 w-4" />{t("Preventivo")}</Link>
                  <button onClick={() => setForm({ id: c.id, name: c.name, phone: c.phone ?? "", email: c.email ?? "", address: c.address ?? "" })} className="flex h-11 w-11 items-center justify-center rounded-xl border" aria-label={t("Modifica")}><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(c)} className="flex h-11 w-11 items-center justify-center rounded-xl border text-destructive" aria-label={t("Elimina")}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </Page>

      {form && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/60" onClick={() => setForm(null)}>
          <div className="w-full rounded-t-3xl bg-card p-5 safe-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{form.id ? t("Modifica cliente") : t("Nuovo cliente")}</h3>
              <button onClick={() => setForm(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" aria-label={t("Chiudi")}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <TextInput label={t("Nome *")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
              <TextInput label={t("Telefono")} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <TextInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <TextInput label={t("Indirizzo")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <button onClick={save} className="h-14 w-full rounded-xl bg-navy font-bold text-navy-foreground">{t("Salva cliente")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}