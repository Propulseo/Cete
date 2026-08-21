import { ImageResponse } from "next/og";

// Image OpenGraph par défaut du site (partages LinkedIn/X/Teams). Convention
// App Router : placée à la racine de app/, elle s'applique à toutes les routes
// qui ne fournissent pas leur propre image (les articles passent leur couverture
// via openGraph.images dans generateMetadata).
export const alt = "CETé - Agence de Notation du Risque Électrique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A2940",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(77,166,217,0.18) 0, rgba(77,166,217,0) 45%), radial-gradient(circle at 85% 75%, rgba(77,166,217,0.12) 0, rgba(77,166,217,0) 40%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 130,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          CETé
        </div>
        <div
          style={{
            display: "flex",
            width: 140,
            height: 8,
            borderRadius: 9999,
            backgroundColor: "#E8630A",
            marginTop: 28,
            marginBottom: 36,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 44,
            color: "#DAEEF8",
            textAlign: "center",
          }}
        >
          Agence de Notation du Risque Électrique
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#8AA5BE",
            marginTop: 22,
          }}
        >
          Travaux Sous Tension · Expertise · Prévention
        </div>
      </div>
    ),
    size,
  );
}
