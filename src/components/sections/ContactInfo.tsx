"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import { getContactInfo } from "@/lib/data-loader";

export function ContactInfo() {
  const t = useTranslations("contact.info");
  const contact = getContactInfo();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-6 text-xl font-bold text-foreground">
          {t("heading")}
        </h3>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{t("addressLabel")}</h4>
            <p className="text-muted-foreground">
              {contact.address}
              <br />
              {contact.city}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{t("emailLabel")}</h4>
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{t("phoneLabel")}</h4>
            <a
              href={`tel:${contact.phone}`}
              className="text-primary hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="overflow-hidden rounded-xl">
        <div className="flex h-48 items-center justify-center bg-secondary">
          <div className="text-center text-muted-foreground">
            <MapPin className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">{t("mapPlaceholder")}</p>
            <p className="text-xs">{contact.address}, {contact.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
