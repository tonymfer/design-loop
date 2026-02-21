import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "design-loop — AI can code your UI. Now it can see it.",
  description:
    "Autonomous visual iteration loop for frontend UI/UX. Screenshots, measures layout metrics, scores against 8 design criteria, fixes issues, and repeats until polished. Standalone, framework-aware, CSS cascade audit.",
  openGraph: {
    title: "design-loop",
    description: "AI can code your UI. Now it can see it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "design-loop",
    description: "AI can code your UI. Now it can see it.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
