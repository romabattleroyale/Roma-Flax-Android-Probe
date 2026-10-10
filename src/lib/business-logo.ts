import { t } from "@/lib/i18n";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LOGO_BUCKET = "business-logos";

export function blobDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error(t("Logo non leggibile")));
    reader.onerror = () => reject(new Error("Logo non leggibile"));
    reader.readAsDataURL(blob);
  });
}

export const businessLogoQuery = (path?: string | null) => queryOptions({
  queryKey: ["business-logo", path],
  enabled: Boolean(path),
  staleTime: 30 * 60 * 1000,
  queryFn: async () => {
    if (!path) return null;
    const { data, error } = await supabase.storage.from(LOGO_BUCKET).download(path);
    if (error) throw error;
    return blobDataUrl(data);
  },
});

// Normalize phone images to a bounded PNG, supported equally by the document and PDF.
export async function prepareLogo(file: File): Promise<Blob> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error(t("Scegli un’immagine PNG, JPG o WebP."));
  if (file.size > 5 * 1024 * 1024) throw new Error(t("Il logo deve essere inferiore a 5 MB."));
  const image = new Image();
  image.src = await blobDataUrl(file);
  await image.decode();
  const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error(t("Impossibile leggere il logo."));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Impossibile leggere il logo.")), "image/png"));
}