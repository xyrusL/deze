import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, rgba(125,226,209,0.36), transparent 42%), linear-gradient(180deg, #0c1824 0%, #071019 100%)",
          borderRadius: "16px",
          border: "1px solid rgba(214,226,237,0.18)",
          color: "#eef4fa",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "-0.08em",
        }}
      >
        D
      </div>
    ),
    size,
  );
}
