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
    <section className="section-pad relative overflow-hidden bg-[#F4F9FD]">
      <div className="glow-blob absolute -left-16 -top-20 h-[320px] w-[320px]" />

      <div className="container-page relative z-10">
        <div className="mx-auto mb-12 max-w-[680px] text-center">
          <span className="type-kicker mb-4 inline-flex items-center gap-2 rounded-full bg-[#4DA6D9]/[0.14] px-4 py-2 text-[#1A2940]">
            <Globe className="h-4 w-4" />
            {t("badge")}
          </span>
          <h2 className="type-h2-section mb-4 text-[#1A2940]">
            {t("heading")}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A6580]">
            {brandify(t("description"))}
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[20px] border border-subtle bg-white shadow-cete-xl">
          {mapReady ? (
            <LeafletMap />
          ) : (
            <div className="h-[500px] bg-[#F4F9FD] flex items-center justify-center">
              <span className="text-[#4A6580]">{t("loading")}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E8630A]" />
            <span className="text-sm text-[#4A6580]">{t("legendFrance")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#4DA6D9]" />
            <span className="text-sm text-[#4A6580]">{t("legendInternational")}</span>
          </div>
        </div>

        {/* Reprise textuelle des zones : à ce niveau de zoom les marqueurs
            français se superposent et restent illisibles sur la carte seule. */}
        <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
          {interventionZones.map((zone) => (
            <li
              key={zone.key}
              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-white px-3 py-1.5 text-sm text-[#1A2940]"
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

  // Cadrage initial, dépendant de la largeur.
  //
  // Le cadrage précédent — centre [28, 55], zoom 3 — était calculé pour un écran large.
  // À ce zoom, la carte fait 2048px de large : un téléphone de 390px n'en montre que
  // ~19%, soit environ 68° de longitude. Centré sur 55°E, on affichait donc 21°E–89°E,
  // c'est-à-dire l'Asie centrale : la France (2°E) et toute l'Europe tombaient hors
  // champ à l'arrivée sur la section.
  //
  // Sous 1024px on recentre sur l'Europe occidentale et le Maghreb — le cœur de
  // l'activité, et ce que le lecteur cherche. Les zones lointaines (Chine, Madagascar,
  // Afrique de l'Ouest) restent atteignables en déplaçant la carte, et sont de toute
  // façon reprises en toutes lettres dans la liste sous la carte.
  //
  // Lecture directe de innerWidth : ce composant n'est monté qu'après hydratation
  // (`mapReady`, puis import dynamique de Leaflet), on est donc toujours côté client ici.
  // Le zoom reste à 3 dans les deux cas : c'est la largeur du conteneur qui change
  // l'étendue visible, seul le centre a besoin de bouger.
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 1024;
  const center: [number, number] = isNarrow ? [41, 6] : [28, 55];
  const zoom = 3;

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
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: 500, width: "100%" }}
        attributionControl={false}
      >
        {/* Fond clair (Positron) : le fond sombre écrasait les pastilles et les
            noms de villes, les localisations n'étaient plus lisibles. */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
