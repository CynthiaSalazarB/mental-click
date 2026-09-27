import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Kalam, Literata } from "next/font/google";
import "./globals.css";

const literata = Literata({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"] });
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Mental Click",
  description:
    "Paste your notes. For each concept you get what it is, a picture to hold it by, and a real situation to answer. Every quote is checked against your notes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${literata.variable} ${atkinson.variable} ${kalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
