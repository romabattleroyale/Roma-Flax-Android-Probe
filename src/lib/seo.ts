import { CONTACT_EMAIL } from "@/lib/legal";

/** Public origin used for canonical, og:url and JSON-LD ids. */
export const SITE_URL = "https://mobile-quotify.lovable.app";

/** Only facts that are true in the product: no ratings, reviews or address. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: "ReplyToolsLab",
    url: `${SITE_URL}/`,
    email: CONTACT_EMAIL,
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "QuickQuote",
    url: `${SITE_URL}/`,
    inLanguage: "it",
    publisher: { "@id": `${SITE_URL}/#org` },
  };
}

export function webApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: "QuickQuote",
    url: `${SITE_URL}/`,
    description:
      "App web per creare preventivi dal telefono: manodopera, materiali, sconto e IVA calcolati, invio su WhatsApp o PDF con logo.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    browserRequirements: "Requires a modern web browser",
    inLanguage: ["it", "en"],
    publisher: { "@id": `${SITE_URL}/#org` },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "EUR",
        description: "5 preventivi gratuiti in totale, senza carta di credito.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "7.99",
        priceCurrency: "EUR",
        description: "Preventivi illimitati. 7,99 €/mese + IVA, se applicabile.",
      },
    ],
  };
}

export function breadcrumbLd(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "QuickQuote", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: SITE_URL + path },
    ],
  };
}

export const ldScript = (data: object) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

/** Per-page head: unique title/description, self-referencing canonical + og:url. */
export function pageHead(path: string, title: string, description: string, ld: object[] = []) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + path },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: SITE_URL + path }],
    scripts: ld.map(ldScript),
  };
}