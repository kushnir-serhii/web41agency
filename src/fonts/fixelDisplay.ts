import localFont from "next/font/local";

const fixelDisplay = localFont({
  // Only these 4 weights are actually used across the site (font-normal,
  // font-medium, font-semibold, font-bold) — the other 5 weights were
  // preloaded but never referenced.
  src: [
    {
      path: "../../public/fonts/fixelDisplay/FixelDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/fixelDisplay/FixelDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/fixelDisplay/FixelDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/fixelDisplay/FixelDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fixel-display", // Adds a CSS variable for global use
  display: "swap", // Ensures better loading performance
});

export default fixelDisplay;
