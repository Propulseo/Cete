import { MapPin, ExternalLink } from "lucide-react";
import { getContactInfo } from "@/lib/data-loader";

export function ContactMap() {
  const contact = getContactInfo();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${contact.address}, ${contact.city}`
  )}`;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl tracking-wide text-[#001a33] md:text-4xl">
              NOUS TROUVER
            </h2>
            <p className="mt-3 text-[#6A6D6A]">
              {contact.address}, {contact.city}
            </p>
          </div>

          {/* Map placeholder */}
          <div className="overflow-hidden rounded-2xl border border-[#E2E4E0] bg-gradient-to-br from-[#F5F6F4] to-[#E2E4E0]">
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#001a33]">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <p className="font-semibold text-[#001a33]">
                {contact.address}
              </p>
              <p className="text-[#6A6D6A]">{contact.city}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#001a33]/20 px-5 py-2.5 text-sm font-medium text-[#001a33] transition-colors hover:bg-[#001a33] hover:text-white"
              >
                Ouvrir dans Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
