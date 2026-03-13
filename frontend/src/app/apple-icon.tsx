import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF8",
          borderRadius: 36,
        }}
      >
        <svg viewBox="0 0 64 64" width="140" height="140">
          <g stroke="#9B7B73" strokeLinecap="round" fill="none">
            <line x1="16" y1="10" x2="16" y2="46" strokeWidth="4" />
            <line x1="23" y1="10" x2="23" y2="46" strokeWidth="4" />
            <line x1="23" y1="11" x2="40" y2="11" strokeWidth="3" />
            <line x1="23" y1="17" x2="44" y2="17" strokeWidth="3" />
            <line x1="23" y1="23" x2="44" y2="23" strokeWidth="3" />
            <line x1="23" y1="29" x2="40" y2="29" strokeWidth="3" />
            <line x1="23" y1="35" x2="35" y2="35" strokeWidth="3" />
            <path d="M40 11 C52 11 52 35 35 35" strokeWidth="3" fill="none" />
          </g>
          <line x1="12" y1="54" x2="52" y2="54" stroke="#6BB5A0" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
