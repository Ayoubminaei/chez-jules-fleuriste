import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chez Jules — Fleuriste artisan";
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
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #2F4A3A 0%, #3d5e4a 60%, #C97B63 100%)",
          color: "#FFFBF3",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Chez Jules · Fleuriste
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 400,
              maxWidth: 980,
            }}
          >
            Des fleurs cueillies comme on raconte une histoire.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              opacity: 0.85,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Bouquets de saison · Paris 9ᵉ · Livraison soignée
          </div>
        </div>
      </div>
    ),
    size
  );
}
