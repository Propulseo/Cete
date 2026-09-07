import type { PageOverridesMap } from "@/types";

export function resolveText(
  overrides: PageOverridesMap,
  fieldKey: string,
  fallback: string,
  locale: "fr" | "en" = "fr",
): string {
  const value = overrides[fieldKey]?.[locale];
  return value && value.trim() !== "" ? value : fallback;
}

export function resolveImage(
  overrides: PageOverridesMap,
  fieldKey: string,
  fallbackSrc: string,
): string {
  const value = overrides[fieldKey]?.fr;
  return value && value.trim() !== "" ? value : fallbackSrc;
}
