import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { businessLogoQuery, LOGO_BUCKET, prepareLogo } from "@/lib/business-logo";
import type { Business } from "@/lib/data";

export function BusinessLogoSettings({ business }: { business: Business | undefined }) {
  const input = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: logo } = useQuery(businessLogoQuery(business?.logo_path));

  async function upload(file?: File) {
    if (!file || !business) return;
    setBusy(true);
    let newPath: string | undefined;
    try {
      const image = await prepareLogo(file);
      newPath = `${business.user_id}/${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage.from(LOGO_BUCKET).upload(newPath, image, { contentType: "image/png" });
      if (uploadError) throw uploadError;
      const { error } = await supabase.from("business_profiles").update({ logo_path: newPath }).eq("id", business.id);
      if (error) {
        await supabase.storage.from(LOGO_BUCKET).remove([newPath]);
        throw error;
      }
      if (business.logo_path) await supabase.storage.from(LOGO_BUCKET).remove([business.logo_path]);
      await qc.invalidateQueries({ queryKey: ["business"] });
      toast.success(t("Logo salvato"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("Impossibile caricare il logo. Riprova."));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove() {
    if (!business?.logo_path) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("business_profiles").update({ logo_path: null }).eq("id", business.id);
      if (error) throw error;
      await supabase.storage.from(LOGO_BUCKET).remove([business.logo_path]);
      await qc.invalidateQueries({ queryKey: ["business"] });
      toast.success(t("Logo rimosso"));
    } catch { toast.error(t("Impossibile rimuovere il logo. Riprova.")); }
    finally { setBusy(false); }
  }

  return <div className="space-y-3 border-t pt-4">
    <p className="text-sm font-bold">{t("Logo azienda")}</p>
    {logo && <img src={logo} alt={t("Logo azienda")} className="h-20 w-32 object-contain object-left" />}
    <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" aria-label={t("Carica logo azienda")} className="hidden" onChange={(event) => void upload(event.target.files?.[0])} />
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" disabled={busy || !business} onClick={() => input.current?.click()} className="min-h-12">
        {busy ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <ImagePlus />}{business?.logo_path ? t("Sostituisci logo") : t("Carica logo")}
      </Button>
      {business?.logo_path && <Button type="button" variant="ghost" disabled={busy} onClick={remove} className="min-h-12 text-destructive"><Trash2 />{t("Rimuovi logo")}</Button>}
    </div>
  </div>;
}