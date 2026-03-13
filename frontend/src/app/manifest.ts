import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PappoCrafts",
    short_name: "PappoCrafts",
    description: "Handmade by Roma Artisans in the Balkans",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#4A9B3F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
