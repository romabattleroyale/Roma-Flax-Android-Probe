import { describe, expect, it } from "vitest";
import { breadcrumbLd, organizationLd, pageHead, webApplicationLd, SITE_URL } from "@/lib/seo";

describe("SEO structured data", () => {
  const all = [organizationLd(), webApplicationLd(), breadcrumbLd("/preventivo-idraulico", "x")];

  it("serializes to valid JSON-LD with schema.org context", () => {
    for (const d of all) {
      const parsed = JSON.parse(pageHead("/", "t", "d", [d]).scripts[0]!.children);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(typeof parsed["@type"]).toBe("string");
    }
  });

  it("contains no invented ratings, reviews or addresses", () => {
    const s = JSON.stringify(all);
    for (const k of ["aggregateRating", "review", "address", "telephone"])
      expect(s).not.toContain(k);
  });

  it("uses the real Pro price and self-referencing canonical", () => {
    expect(webApplicationLd().offers.map((o) => o.price)).toEqual(["0", "7.99"]);
    const h = pageHead("/preventivo-idraulico", "t", "d");
    expect(h.links[0]!.href).toBe(`${SITE_URL}/preventivo-idraulico`);
    expect(h.meta.find((m) => m.property === "og:url")?.content).toBe(h.links[0]!.href);
  });
});