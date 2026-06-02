"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";

const interventionZones = [
  { name: "France métropolitaine", lat: 46.6, lng: 2.2, primary: true },
  { name: "Île-de-France", lat: 48.86, lng: 2.35, primary: true },
  { name: "Lyon", lat: 45.76, lng: 4.83, primary: true },
  { name: "Marseille", lat: 43.3, lng: 5.37, primary: true },
  { name: "Bordeaux", lat: 44.84, lng: -0.58, primary: true },
  { name: "Belgique", lat: 50.85, lng: 4.35, primary: false },
  { name: "Suisse", lat: 46.95, lng: 7.45, primary: false },
  { name: "Maroc", lat: 33.97, lng: -6.85, primary: false },
  { name: "Algérie", lat: 36.75, lng: 3.06, primary: false },
  { name: "Tunisie", lat: 36.81, lng: 10.17, primary: false },
  { name: "Sénégal", lat: 14.69, lng: -17.44, primary: false },
  { name: "Côte d'Ivoire", lat: 5.35, lng: -4.01, primary: false },
  { name: "Cameroun", lat: 3.87, lng: 11.52, primary: false },
  { name: "Madagascar", lat: -18.88, lng: 47.51, primary: false },
  { name: "La Réunion", lat: -21.12, lng: 55.53, primary: false },
  { name: "Chine", lat: 39.9, lng: 116.4, primary: false },
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
            {t("description")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#4DA6D9]/20 shadow-2xl">
          {mapReady ? (
            <LeafletMap />
          ) : (
            <div className="h-[500px] bg-[#0D5A8A]/30 flex items-center justify-center">
              <span className="text-white/40">{t("loading")}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E8630A]" />
            <span className="text-sm text-white/70">{t("legendFrance")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4DA6D9]" />
            <span className="text-sm text-white/70">{t("legendInternational")}</span>
          </div>
        </div>
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
      <div className="h-[500px] bg-[#0D5A8A]/30 flex items-center justify-center">
        <span className="text-white/40">{t("loading")}</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = components;

  const orangeIcon = L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;background:#E8630A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(232,99,10,0.5);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const blueIcon = L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;background:#4DA6D9;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(77,166,217,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {interventionZones.map((zone) => (
          <Marker
            key={zone.name}
            position={[zone.lat, zone.lng]}
            icon={zone.primary ? orangeIcon : blueIcon}
          >
            <Popup>
              <span style={{ fontWeight: 600, color: "#1A2940" }}>
                {zone.name}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
