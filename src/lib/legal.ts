import { getLang, t } from "@/lib/i18n";

/* ATTENZIONE (interno): i testi di Privacy Policy e Termini sono una bozza.
   Devono essere revisionati dal titolare / consulente legale prima del lancio definitivo.
   I dati mancanti sono segnati con LEGAL_PLACEHOLDERS e vanno forniti dal titolare. */
export const CONTACT_EMAIL = "replay.toolslab@gmail.com";
export const BRAND_CREDIT = "Creato da ReplyToolsLab";
export const legalUpdated = () => (getLang() === "en" ? "8 October 2026" : "8 ottobre 2026");
export const deletionMailto = (accountEmail?: string | null) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("Richiesta cancellazione account QuickQuote"))}&body=${encodeURIComponent(
    t("Ciao, chiedo la cancellazione del mio account QuickQuote e dei dati collegati. Email dell'account: ") + (accountEmail ?? ""),
  )}`;