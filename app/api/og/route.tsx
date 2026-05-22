import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "TATARING CATERING";
  const subtitle =
    searchParams.get("subtitle") ??
    "Cita Rasa Batak, Buat Setiap Momen Jadi Pesta.";

  const titleSize = title.length > 50 ? "52px" : title.length > 30 ? "64px" : "72px";

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
          backgroundColor: "#0f0505",
          padding: "64px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow kiri */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,26,26,0.35) 0%, transparent 70%)",
          }}
        />
        {/* Radial glow kanan */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,26,26,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Garis merah atas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            backgroundColor: "#8B1A1A",
          }}
        />

        {/* Brand label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "28px",
              backgroundColor: "#C0392B",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#C0392B",
              letterSpacing: "8px",
              textTransform: "uppercase",
            }}
          >
            TATARING CATERING
          </span>
        </div>

        {/* Judul */}
        <div
          style={{
            fontSize: titleSize,
            fontWeight: "700",
            color: "#F5F0EB",
            textAlign: "center",
            lineHeight: "1.2",
            maxWidth: "1000px",
            marginBottom: "28px",
          }}
        >
          {title}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "#8B1A1A",
            marginBottom: "28px",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            color: "#9B8070",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          {subtitle}
        </div>

        {/* Garis merah bawah */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            backgroundColor: "#8B1A1A",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
