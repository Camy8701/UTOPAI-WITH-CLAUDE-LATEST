import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // Get dynamic params
  const title = searchParams.get("title") || "utopai.blog"
  const description = searchParams.get("description") || "AI Stories and Design Inspiration"
  const type = (searchParams.get("type") || "default") as "story" | "article" | "default"

  // Font
  const interRegular = await fetch(new URL("../../../public/fonts/Inter-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )
  const interBold = await fetch(new URL("../../../public/fonts/Inter-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 50,
        position: "relative",
      }}
    >
      {/* Colored borders */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundColor: "#3b82f6" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, backgroundColor: "#ef4444" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 8,
          background: "linear-gradient(to bottom, #3b82f6, #ef4444)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 8,
          background: "linear-gradient(to bottom, #3b82f6, #ef4444)",
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#3b82f6", fontSize: 48, fontWeight: "bold" }}>utop</span>
        <span style={{ color: "#ef4444", fontSize: 48, fontWeight: "bold" }}>ai</span>
        <span style={{ color: "#000000", fontSize: 48, fontWeight: "bold" }}>.blog</span>
      </div>

      {/* Type badge */}
      {type !== "default" && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 50,
            backgroundColor: type === "story" ? "#3b82f6" : "#ef4444",
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          {type === "story" ? "AI STORY" : "ARTICLE"}
        </div>
      )}

      {/* Content */}
      <div style={{ marginTop: 60, maxWidth: "70%" }}>
        <h1 style={{ fontSize: 64, fontWeight: "bold", color: "#000000", lineHeight: 1.2, margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 32, color: "#666666", marginTop: 20, lineHeight: 1.5 }}>{description}</p>
      </div>

      {/* URL */}
      <div style={{ marginTop: "auto", color: "#666666", fontSize: 24 }}>utopai.blog</div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  )
}
