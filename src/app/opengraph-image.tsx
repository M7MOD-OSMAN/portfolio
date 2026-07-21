import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/content";
import { getCurrentRole } from "@/content/loaders";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} - ${profile.title}`;

export default async function OpengraphImage() {
  const currentRole = await getCurrentRole();

  const portrait = await readFile(
    path.join(process.cwd(), "public", profile.portraitSrc),
  );
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  // Satori treats each JSX expression as a separate child, so any element with
  // interpolated text must receive a single pre-built string.
  const eyebrow = currentRole
    ? `${profile.title} / ${currentRole.company}`
    : profile.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "#0b0b0e",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              fontSize: 26,
              color: "#fb923c",
              letterSpacing: 1,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 20,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a1a1aa",
              lineHeight: 1.4,
              marginTop: 26,
            }}
          >
            React, Next.js and TypeScript. Architecture, design systems, and
            performance.
          </div>
        </div>

        <div style={{ display: "flex", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            alt=""
            width={340}
            height={425}
            style={{
              objectFit: "cover",
              borderRadius: 24,
              border: "1px solid #27272d",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
