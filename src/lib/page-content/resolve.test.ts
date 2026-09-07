import { describe, expect, it } from "vitest";
import { resolveText, resolveImage } from "./resolve";

describe("resolveText", () => {
  it("retombe sur le fallback si aucune surcharge", () => {
    expect(resolveText({}, "hero.badge", "Texte par defaut")).toBe("Texte par defaut");
  });

  it("utilise la surcharge FR si presente", () => {
    const overrides = { "hero.badge": { fr: "Texte admin", en: "Admin text" } };
    expect(resolveText(overrides, "hero.badge", "Texte par defaut", "fr")).toBe("Texte admin");
  });

  it("utilise la surcharge EN quand locale=en", () => {
    const overrides = { "hero.badge": { fr: "Texte admin", en: "Admin text" } };
    expect(resolveText(overrides, "hero.badge", "Default", "en")).toBe("Admin text");
  });

  it("ignore une surcharge vide (chaine vide = pas de personnalisation)", () => {
    const overrides = { "hero.badge": { fr: "", en: "" } };
    expect(resolveText(overrides, "hero.badge", "Texte par defaut")).toBe("Texte par defaut");
  });
});

describe("resolveImage", () => {
  it("retombe sur le fallback si aucune surcharge", () => {
    expect(resolveImage({}, "rse.logo", "/images/partners/esf-logo.png")).toBe(
      "/images/partners/esf-logo.png",
    );
  });

  it("utilise l'URL personnalisee si presente", () => {
    const overrides = { "rse.logo": { fr: "https://x.supabase.co/site-images/a.png", en: "" } };
    expect(resolveImage(overrides, "rse.logo", "/images/partners/esf-logo.png")).toBe(
      "https://x.supabase.co/site-images/a.png",
    );
  });
});
