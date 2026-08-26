"use client";

import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import { getContactInfo } from "@/lib/data-loader";

export function ContactMap() {
  const t = useTranslations("contact.map");
  const contact = getContactInfo();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${contact.address}, ${contact.city}`
  )}`;

  return (
    <section className="section-pad bg-white">
      <div className="container-reading">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="type-h2-section mb-3 text-[#1A2940]">
              {t("heading")}
            </h2>
            <p className="text-[#4A6580]">
              {contact.address}, {contact.city}
            </p>
          </div>

          {/* Map placeholder */}
          <div className="overflow-hidden rounded-[20px] border border-subtle bg-grad-card shadow-cete-md">
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-grad-blue shadow-cete-sm">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <p className="font-semibold text-[#1A2940]">
                {contact.address}
              </p>
              <p className="text-[#4A6580]">{contact.city}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgba(77,166,217,0.4)] bg-white px-5 py-2.5 text-sm font-medium text-[#0D5A8A] transition-all hover:-translate-y-0.5 hover:border-[#E8630A] hover:text-[#E8630A]"
              >
                {t("openGoogleMaps")}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
