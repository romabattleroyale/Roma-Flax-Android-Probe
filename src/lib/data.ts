import { t } from "@/lib/i18n";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Business = Database["public"]["Tables"]["business_profiles"]["Row"];
export type QuoteItem = Database["public"]["Tables"]["quote_items"]["Row"];

export async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error(t("Sessione scaduta"));
  return data.user.id;
}

export const quotesQuery = queryOptions({
  queryKey: ["quotes"],
  queryFn: async () => {
    const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const customersQuery = queryOptions({
  queryKey: ["customers"],
  queryFn: async () => {
    const { data, error } = await supabase.from("customers").select("*").order("name");
    if (error) throw error;
    return data;
  },
});

export const businessQuery = queryOptions({
  queryKey: ["business"],
  queryFn: async () => {
    const id = await uid();
    const { data, error } = await supabase.from("business_profiles").select("*").eq("user_id", id).maybeSingle();
    if (error) throw error;
    if (data) return data;
    const ins = await supabase.from("business_profiles").insert({ user_id: id }).select().single();
    if (ins.error) throw ins.error;
    return ins.data;
  },
});

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const id = await uid();
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    return data;
  },
});

export const quoteQuery = (id: string) =>
  queryOptions({
    queryKey: ["quote", id],
    queryFn: async () => {
      const [q, items] = await Promise.all([
        supabase.from("quotes").select("*").eq("id", id).single(),
        supabase.from("quote_items").select("*").eq("quote_id", id).order("position"),
      ]);
      if (q.error) throw q.error;
      return { quote: q.data, items: items.data ?? [] };
    },
  });

export function nextQuoteNumber(quotes: Quote[]) {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const max = quotes
    .filter((q) => q.number.startsWith(prefix))
    .reduce((m, q) => Math.max(m, parseInt(q.number.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

/* Plan for the current build: test builds (pk_test_ token) read sandbox_plan,
   production reads plan (live subscriptions only). A test subscription never unlocks production. */
const paymentsToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"] as string | undefined;
export const isTestPayments = !!paymentsToken?.startsWith("pk_test_");
export function currentPlan(profile: { plan: string; sandbox_plan?: string } | null | undefined): "free" | "pro" {
  const p = isTestPayments ? profile?.sandbox_plan : profile?.plan;
  return p === "pro" ? "pro" : "free";
}