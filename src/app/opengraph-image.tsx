import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abdulrahman Alanani — AI Engineer";
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
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b0d10 0%, #12161c 60%, #101828 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #3b82f6, #22d3ee, #8b5cf6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#34d399",
            fontSize: 22,
            fontFamily: "monospace",
            letterSpacing: "0.2em",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#34d399" }} />
          SYSTEM ONLINE
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            color: "#f5f7fa",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Abdulrahman Alanani
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 44,
            fontWeight: 700,
            background: "linear-gradient(90deg, #3b82f6, #22d3ee, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          AI Engineer
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "#a1aab8",
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          I build intelligent systems that connect AI models with real-world
          software, automation, data, and hardware.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            gap: 14,
          }}
        >
          {["LLMs", "RAG", "Computer Vision", "Automation", "Robotics"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.3)",
                  color: "#a1aab8",
                  fontSize: 20,
                  fontFamily: "monospace",
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 80,
            color: "#6e7885",
            fontSize: 18,
            fontFamily: "monospace",
          }}
        >
          Riyadh, Saudi Arabia
        </div>
      </div>
    ),
    { ...size },
  );
}
