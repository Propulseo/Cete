"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { brandify } from "@/components/ui/brand-name";

const interventionZones = [
  { key: "france", lat: 46.6, lng: 2.2, primary: true },
  { key: "idf", lat: 48.86, lng: 2.35, primary: true },
  { key: "lyon", lat: 45.76, lng: 4.83, primary: true },
  { key: "marseille", lat: 43.3, lng: 5.37, primary: true },
  { key: "bordeaux", lat: 44.84, lng: -0.58, primary: true },
  { key: "belgique", lat: 50.85, lng: 4.35, primary: false },
  { key: "suisse", lat: 46.95, lng: 7.45, primary: false },
  { key: "maroc", lat: 33.97, lng: -6.85, primary: false },
  { key: "algerie", lat: 36.75, lng: 3.06, primary: false },
  { key: "tunisie", lat: 36.81, lng: 10.17, primary: false },
  { key: "senegal", lat: 14.69, lng: -17.44, primary: false },
  { key: "coteIvoire", lat: 5.35, lng: -4.01, primary: false },
  { key: "cameroun", lat: 3.87, lng: 11.52, primary: false },
  { key: "madagascar", lat: -18.88, lng: 47.51, primary: false },
  { key: "reunion", lat: -21.12, lng: 55.53, primary: false },
  { key: "chine", lat: 39.9, lng: 116.4, primary: false },
];

export function AboutWorldMap() {
  const t = useTranslations("about.worldMap");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <section className="py-24 bg-[#1A2940] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2940] via-[#0D5A8A]/30 to-[#1A2940]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#4DA6D9]/10 text-[#4DA6D9] text-sm font-semibold uppercase tracking-wider mb-4">
            <Globe className="h-4 w-4" />
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-4">
            {t("heading")}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {brandify(t("description"))}
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/20 ring-1 ring-black/10 shadow-2xl bg-[#F4F9FD]">
          {mapReady ? (
            <LeafletMap />
          ) : (
            <div className="h-[500px] bg-[#F4F9FD] flex items-center justify-center">
              <span className="text-[#4A6580]">{t("loading")}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E8630A]" />
            <span className="text-sm text-white/90">{t("legendFrance")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4DA6D9]" />
            <span className="text-sm text-white/90">{t("legendInternational")}</span>
          </div>
        </div>

        {/* Reprise textuelle des zones : à ce niveau de zoom les marqueurs
            français se superposent et restent illisibles sur la carte seule. */}
        <ul className="max-w-4xl mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {interventionZones.map((zone) => (
            <li
              key={zone.key}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90"
            >
              <span
                className={`h-2 w-2 rounded-full ${zone.primary ? "bg-[#E8630A]" : "bg-[#4DA6D9]"}`}
                aria-hidden
              />
              {t(`zones.${zone.key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LeafletMap() {
  const t = useTranslations("about.worldMap");
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [components, setComponents] = useState<typeof import("react-leaflet") | null>(null);

  useEffect(() => {
    Promise.all([import("leaflet"), import("react-leaflet")]).then(
      ([leaflet, rc]) => {
        setL(leaflet.default || leaflet);
        setComponents(rc);
      }
    );
  }, []);

  if (!L || !components) {
    return (
      <div className="h-[500px] bg-[#F4F9FD] flex items-center justify-center">
        <span className="text-[#4A6580]">{t("loading")}</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Tooltip } = components;

  // La pastille visible garde sa taille ; c'est le conteneur transparent qui
  // porte la cible tactile de 44px (les marqueurs à 24-28px étaient intouchables
  // au doigt). iconAnchor reste au centre, la position sur la carte est inchangée.
  const touchIcon = (dot: string) =>
    L.divIcon({
      className: "",
      html: `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;">${dot}</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

  // Sur fond clair, le liseré blanc seul se noie : on ajoute un anneau sombre
  // (box-shadow 0 0 0 1px) pour détacher la pastille des tuiles.
  const orangeIcon = touchIcon(
    `<div style="width:28px;height:28px;background:#E8630A;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(26,41,64,0.45),0 2px 6px rgba(26,41,64,0.35);"></div>`
  );

  const blueIcon = touchIcon(
    `<div style="width:24px;height:24px;background:#4DA6D9;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(26,41,64,0.45),0 2px 6px rgba(26,41,64,0.35);"></div>`
  );

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <MapContainer
        center={[28, 55]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: 500, width: "100%" }}
        attributionControl={false}
      >
        {/* Fond clair (Positron) : le fond sombre écrasait les pastilles et les
            noms de villes, les localisations n'étaient plus lisibles. */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {interventionZones.map((zone) => (
          <Marker
            key={zone.key}
            position={[zone.lat, zone.lng]}
            icon={zone.primary ? orangeIcon : blueIcon}
          >
            {/* Survol desktop : le nom sans clic. Le popup reste pour le tactile. */}
            <Tooltip direction="top" offset={[0, -16]} opacity={1}>
              <span style={{ fontWeight: 600, color: "#1A2940" }}>
                {t(`zones.${zone.key}`)}
              </span>
            </Tooltip>
            <Popup>
              <span style={{ fontWeight: 600, color: "#1A2940" }}>
                {t(`zones.${zone.key}`)}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
