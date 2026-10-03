import { ImageResponse } from "next/og";
export const alt = "Vansinneshjärta — en bok av Irma Tegge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f3eee6",
          color: "#31251f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, marginBottom: 38 }}>
          EN BOK AV IRMA TEGGE
        </div>
        <div style={{ fontSize: 92, fontFamily: "serif", color: "#862f40" }}>
          Vansinneshjärta.
        </div>
        <div style={{ fontSize: 28, marginTop: 40 }}>
          Här börjar berättelsen.
        </div>
      </div>
    ),
    size,
  );
}
