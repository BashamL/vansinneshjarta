import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "vansinnehjärta — en diktsamling av Irma Tegge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "public/fonts/EBGaramond-Regular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8f5ed",
          color: "#37382f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Garamond",
        }}
      >
        <div
          style={{
            fontSize: 21,
            letterSpacing: 5,
            color: "#77796b",
            marginBottom: 38,
          }}
        >
          POESI AV IRMA TEGGE
        </div>
        <div style={{ fontSize: 112, letterSpacing: -5 }}>vansinnehjärta</div>
        <div style={{ fontSize: 30, marginTop: 18, color: "#77796b" }}>
          en diktsamling
        </div>
        <div
          style={{ width: 1, height: 45, background: "#d9d8c9", marginTop: 40 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Garamond", data: font, weight: 400, style: "normal" }],
    },
  );
}
