import { jsPDF } from "jspdf";
import type { Business, Quote, QuoteItem } from "@/lib/data";
import { t } from "@/lib/i18n";
import { dateIt, euro } from "@/lib/quote";

// Use stored amounts verbatim: PDF export must never recalculate a quotation.
export function createQuotePdf(q: Quote, items: QuoteItem[], business?: Business, logo?: string | null) {
  const pdf = new jsPDF({ format: "a4", unit: "mm", compress: true });
  const margin = 18;
  const right = 192;
  const width = right - margin;
  const bottom = 275;
  let y = 23;
  let textLeft = margin;
  pdf.setProperties({ title: `${t("Preventivo")}-${q.number}`, subject: q.title, creator: "QuickQuote" });

  function ensureSpace(height: number) {
    if (y + height <= bottom) return;
    pdf.addPage();
    y = 23;
  }

  function text(value: string, size = 11, bold = false) {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(value.replace(/\u00a0|\u202f/g, " "), right - textLeft);
    const lineHeight = size * 0.3528 * 1.4;
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, textLeft, y);
      y += lineHeight;
    }
  }

  function section(label: string) {
    ensureSpace(18);
    y += 5;
    text(label, 10, true);
    y += 2;
  }

  function row(label: string, value: string, bold = false) {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(11);
    const amount = value.replace(/\u00a0|\u202f/g, " ");
    const amountWidth = pdf.getTextWidth(amount);
    const lines: string[] = pdf.splitTextToSize(label, width - amountWidth - 10);
    lines.forEach((line, index) => {
      ensureSpace(6);
      pdf.text(line, margin, y);
      if (index === 0) pdf.text(amount, right, y, { align: "right" });
      y += 6;
    });
    y += 2;
  }

  if (logo) {
    const image = pdf.getImageProperties(logo);
    const scale = Math.min(24 / image.width, 24 / image.height);
    pdf.addImage(logo, "PNG", margin, 18, image.width * scale, image.height * scale);
    textLeft = margin + 30;
  }
  text(business?.business_name || q.business_name || "", 18, true);
  if (business?.address) text(business.address, 10);
  if (business?.vat_number) text(`${t("P.IVA")} ${business.vat_number}`, 10);
  if (business?.phone) text(business.phone, 10);
  if (business?.email) text(business.email, 10);
  if (logo) y = Math.max(y, 45);
  textLeft = margin;
  section(t("PREVENTIVO"));
  text(`${t("N.")} ${q.number}`, 14, true);
  text(`${t("Data:")} ${dateIt(q.quote_date)}`);
  section(t("CLIENTE"));
  text(q.customer_name, 12, true);
  if (q.customer_phone) text(q.customer_phone);
  if (q.customer_email) text(q.customer_email);
  section(t("OGGETTO"));
  text(q.title, 12, true);
  if (q.description) {
    section(t("DESCRIZIONE"));
    text(q.description);
  }
  section(t("VOCI DEL PREVENTIVO"));
  for (const item of items) row(t(item.label), euro(Number(item.amount)));
  if (business?.notes) {
    section(t("NOTE"));
    text(business.notes, 10);
  }

  ensureSpace(72);
  section(t("RIEPILOGO FINALE"));
  row(t("Subtotale"), euro(Number(q.subtotal)));
  row(t("Sconto"), `${Number(q.discount) > 0 ? "- " : ""}${euro(Number(q.discount))}`);
  row(t("Imponibile"), euro(Number(q.taxable)));
  row(`${t("IVA")} ${Number(q.vat_rate)}%`, euro(Number(q.vat_amount)));
  y += 2;
  pdf.line(margin, y - 4, right, y - 4);
  text(t("TOTALE FINALE"), 12, true);
  y += 3;
  text(euro(Number(q.total)), 22, true);

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(`${page} / ${pageCount}`, right, 286, { align: "right" });
  }
  return pdf;
}

export function quotePdfFilename(q: Quote) {
  return `${t("Preventivo")}-${q.number.replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
}

export function downloadQuotePdf(q: Quote, items: QuoteItem[], business?: Business, logo?: string | null) {
  const pdf = createQuotePdf(q, items, business, logo);
  const filename = quotePdfFilename(q);
  pdf.save(filename);
}