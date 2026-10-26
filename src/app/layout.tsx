import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, Inter } from "next/font/google";
import "./globals.css";

// Display: Bricolage Grotesque 600/800, with optical sizing as in the design.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Labels / meta: DM Mono 400/500.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Body / UI: Inter 300–600.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yurix — 2D animator & illustrator",
  description: "Hand-drawn loops, characters and music videos by Yurix, a 2D animator and illustrator in Mumbai.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmMono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
